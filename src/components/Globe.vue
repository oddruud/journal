<template>
  <div class="globe-container">
    <canvas ref="globeCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
//import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
//import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
//import { Font } from 'three/examples/jsm/loaders/FontLoader'
//import { OrbitControls } from '../three/OrbitControls'
import { gsap } from 'gsap'

const globeCanvas = ref<HTMLCanvasElement | null>(null)
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let globe: THREE.Mesh

const markers: THREE.Mesh[] = []
let animationFrameId: number
let glowMesh: THREE.Mesh
//let font: Font
const labels: THREE.Mesh[] = []
//let controls: OrbitControls
let raycaster: THREE.Raycaster
let mouse: THREE.Vector2
const curves: THREE.Line[] = []
const markerPositions: { [key: string]: THREE.Vector3 } = {}
const animatedSpheres: THREE.Mesh[] = []
const sphereProgress: number[] = []
const markerScales: number[] = []
const markerScaleDirections: boolean[] = []
const labelOpacities: number[] = []
const nightPositionProgress = 0.0

const curveOpacities: number[] = curves.map(() => 0) // Initialize opacities for each curve

// Constants for configuration
const GLOBE_CONFIG = {
  radius: 1,
  segments: 128,
  bumpScale: 0.05,
  shininess: 5,
  emissiveIntensity: 0.1,
}

const CAMERA_CONFIG = {
  fov: 75,
  near: 0.1,
  far: 1000,
  position: { x: 0, y: 0, z: 3 },
}

const RENDERER_CONFIG = {
  width: window.innerWidth,
  height: window.innerHeight,
}

const CONTROLS_CONFIG = {
  dampingFactor: 0.05,
  rotateSpeed: 0.5,
}

const GLOW_CONFIG = {
  coefficient: 0.5,
  power: 2,
  color: 0x4d7cff,
}

const GLOW_SHADERS = {
  vertex: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
  fragment: `
      uniform float coefficient;
      uniform float power;
      uniform vec3 glowColor;
      varying vec3 vNormal;
      void main() {
        float intensity = pow(coefficient - dot(vNormal, vec3(0.0, 0.0, 1.0)), power);
        gl_FragColor = vec4(glowColor, intensity);
      }
    `,
}

interface City {
  name: string
  latitude: number
  longitude: number
}

const CITIES: City[] = [
  { name: 'New York', latitude: 40.7128, longitude: -74.006 },
  { name: 'London', latitude: 51.5074, longitude: -0.1278 },
  { name: 'Tokyo', latitude: 35.6762, longitude: 139.6503 },
  { name: 'Nairobi', latitude: -1.2921, longitude: 36.8219 },
  { name: 'Madeira', latitude: 32.7607, longitude: -16.9595 },
  { name: 'Buenos Aires', latitude: -34.6037, longitude: -58.3816 },
]

const CITY_CONNECTIONS: [string, string][] = [
  ['London', 'Tokyo'],
  ['London', 'Tokyo'],
  ['London', 'Madeira'],
  ['Tokyo', 'Nairobi'],
  ['New York', 'Buenos Aires'],
  ['New York', 'London'],
]

const TRANSITION_CONFIG = {
  transitionSpeed: 0.01,
  transitionValue: 0.0,
}

const createGlowMaterial = () => {
  return new THREE.ShaderMaterial({
    uniforms: {
      coefficient: { value: GLOW_CONFIG.coefficient },
      power: { value: GLOW_CONFIG.power },
      glowColor: { value: new THREE.Color(GLOW_CONFIG.color) },
    },
    vertexShader: GLOW_SHADERS.vertex,
    fragmentShader: GLOW_SHADERS.fragment,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
  })
}

const initThreeJS = () => {
  initScene()
  initCamera()
  initRenderer()
  initControls()
  initGlobe()
  initLights()
  loadFontAndAddCities()
  addGlowEffect()
  handleResize()
}

const initScene = () => {
  scene = new THREE.Scene()
}

const initCamera = () => {
  const { fov, near, far, position } = CAMERA_CONFIG
  camera = new THREE.PerspectiveCamera(
    fov,
    RENDERER_CONFIG.width / RENDERER_CONFIG.height,
    near,
    far,
  )
  camera.position.set(position.x, position.y, position.z)
}

const initRenderer = () => {
  const { width, height } = RENDERER_CONFIG

  renderer = new THREE.WebGLRenderer({
    canvas: globeCanvas.value!,
    antialias: true,
    alpha: true,
  })

  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setClearColor(0x000000, 0)

  initRaycaster()
}

const initRaycaster = () => {
  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()
  renderer.domElement.addEventListener('click', onGlobeClick)
}

const initControls = () => {
  /*
  const { dampingFactor, rotateSpeed } = CONTROLS_CONFIG

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = dampingFactor
  controls.rotateSpeed = rotateSpeed
  controls.enableZoom = true
  controls.enablePan = false
  */
}

const initGlobe = () => {
  const { radius, segments, bumpScale, shininess, emissiveIntensity } =
    GLOBE_CONFIG

  const geometry = new THREE.SphereGeometry(radius, segments, segments)
  const dayTexture = loadGlobeTexture()
  const nightTexture = loadSecondaryTexture()
  const material = createGlobeMaterial(dayTexture, nightTexture, {
    bumpScale,
    shininess,
    emissiveIntensity,
  })

  globe = new THREE.Mesh(geometry, material)
  globe.scale.set(0, 0, 0)
  scene.add(globe)

  const timeline = gsap.timeline({
    onComplete: () => {
      fadeInCurves() // Start fading in the curves after the globe animation
    },
  })

  timeline.to(globe.scale, {
    x: 1,
    y: 1,
    z: 1,
    duration: 2,
    ease: 'power2.out',
    delay: 1,
  })

  timeline.to(
    globe.rotation,
    {
      y: Math.PI * 0.1, // Adjust the value for desired rotation
      duration: 2.2,
      ease: 'power1.inOut',
      delay: 1,
    },
    '<',
  ) // Use "<" to start this animation at the same time as the previous one
}

function loadTexture(texturePath: string): THREE.Texture {
  const textureLoader = new THREE.TextureLoader()
  return textureLoader.load(
    texturePath,
    texture => {
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
    },
    undefined,
    error => {
      console.error(`Failed to load texture from ${texturePath}:`, error)
      throw new Error(`Texture failed to load from ${texturePath}`)
    },
  )
}

const loadGlobeTexture = () => loadTexture('/assets/earth.jpg')
const loadSecondaryTexture = () => loadTexture('/assets/earth_night.jpg')
const loadCloudTexture = () => {
  const texture = loadTexture('src/assets/earth_clouds.jpg')
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}
const loadNormalMap = () => loadTexture('src/assets/earth_normal.jpg')
const loadSpecularMap = () => loadTexture('src/assets/earth_specular.jpg')

const createGlobeMaterial = (
  dayTexture: THREE.Texture,
  nightTexture: THREE.Texture,
  config: { bumpScale: number; shininess: number; emissiveIntensity: number },
) => {
  const specularMap = loadSpecularMap()
  const cloudTexture = loadCloudTexture()
  const normalMap = loadNormalMap()

  const uniforms = {
    dayTexture: { value: dayTexture },
    nightTexture: { value: nightTexture },
    specularMap: { value: specularMap },
    cloudTexture: { value: cloudTexture },
    normalMap: { value: normalMap },
    nightPosition: { value: 0.5 },
    nightWidth: { value: 0.2 },
    emissiveColor: { value: new THREE.Color(0xffffff) },
    emissiveIntensity: { value: 1.0 },
    lightDirection: { value: new THREE.Vector3(1, 1, 1).normalize() },
    time: { value: 0.0 },
  }

  const vertexShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vTangent;
      varying vec3 vBitangent;
      varying vec3 vViewPosition;

      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        vViewPosition = -vPosition;

        // Calculate tangent and bitangent
        vec3 tangent = normalize(normalMatrix * vec3(1.0, 0.0, 0.0));
        vec3 bitangent = normalize(normalMatrix * vec3(0.0, 1.0, 0.0));
        vTangent = tangent;
        vBitangent = bitangent;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `

  const fragmentShader = `
      uniform sampler2D dayTexture;
      uniform sampler2D nightTexture;
      uniform sampler2D specularMap;
      uniform sampler2D cloudTexture;
      uniform sampler2D normalMap;
      uniform vec3 emissiveColor;
      uniform float emissiveIntensity;
      uniform vec3 lightDirection;
      uniform float time;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vTangent;
      varying vec3 vBitangent;
      varying vec3 vViewPosition;

      void main() {
        vec2 wrappedUv = fract(vUv);
        vec4 dayColor = texture2D(dayTexture, wrappedUv);
        vec4 nightColor = texture2D(nightTexture, wrappedUv);

        // Animate cloud texture by offsetting UVs with time
        vec2 cloudUv = wrappedUv + vec2(time * 0.01, 0.0);
        vec4 cloudColor = texture2D(cloudTexture, cloudUv);

        vec3 emissiveEffect = emissiveColor * emissiveIntensity;
        vec4 emissiveNightColor = vec4(nightColor.rgb + emissiveEffect, nightColor.a);

        // Sample the normal map
        vec3 normalTex = texture2D(normalMap, wrappedUv).rgb;
        normalTex = normalize(normalTex * 2.0 - 1.0); // Convert from [0,1] to [-1,1]

        // Transform normal from tangent space to world space
        mat3 tbn = mat3(vTangent, vBitangent, vNormal);
        vec3 normal = normalize(tbn * normalTex);

        vec3 viewDirection = normalize(vViewPosition);
        vec3 reflectDirection = reflect(-lightDirection, vNormal);
        float specularFactor = pow(max(dot(viewDirection, reflectDirection), 0.0), 16.0);
        vec4 specularColor = texture2D(specularMap, wrappedUv) * specularFactor * 1.0;
        float dotNL = dot(normal, lightDirection);
        float transitionValue = smoothstep(-0.1, 0.1, dotNL);

        vec4 finalColor = mix(nightColor, dayColor, transitionValue);
        finalColor.rgb += cloudColor.rgb * 0.5;

        gl_FragColor = finalColor + specularColor;
      }
    `

  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    side: THREE.FrontSide,
    transparent: true,
  })
}

const initLights = () => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 1)
  const pointLight = createPointLight()

  scene.add(ambientLight)
  scene.add(pointLight)
}

const createPointLight = () => {
  const light = new THREE.PointLight(0xffffff, 4)
  light.position.set(5, 3, 5)
  return light
}

const loadFontAndAddCities = () => {
  /*
  const fontLoader = new FontLoader()
  fontLoader.load(
    'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
    (loadedFont: Font) => {
      font = loadedFont
      addCitiesAndConnections()
    },
  )*/
}

const addCitiesAndConnections = () => {
  // Add cities
  CITIES.forEach(city => {
    addMarker(city.latitude, city.longitude, city.name)
  })

  // Add connections
  CITY_CONNECTIONS.forEach(([city1, city2]) => {
    drawCurve(city1, city2)
  })
}

const addMarker = (latitude: number, longitude: number, cityName: string) => {
  // Calculate local time
  const localTime = calculateLocalTime(longitude)

  // Create and position marker
  const marker = createMarkerMesh()
  marker.material.opacity = 0 // Start with opacity 0
  positionOnGlobe(marker, latitude, longitude)
  globe.add(marker)
  markers.push(marker)
  markerScales.push(1.0)
  markerScaleDirections.push(true)

  // Create and position label with local time
  //const label = createCityLabel(`${cityName} - ${localTime}`)
  //positionLabel(label, marker.position)
  //globe.add(label)
  //labels.push(label)
  // labelOpacities.push(0)

  // Draw line from marker to label
  //drawLineToLabel(marker.position, label.position)

  // Store position for connections
  markerPositions[cityName] = marker.position.clone()

  // Add marker to fade-in list
  fadeInMarkers.push(marker)

  return marker
}

const calculateLocalTime = (longitude: number) => {
  const now = new Date()
  const utcOffset = now.getTimezoneOffset() / 60
  const localOffset = longitude / 15 // 15 degrees per hour
  const localTime = new Date(
    now.setUTCHours(now.getUTCHours() + localOffset - utcOffset),
  )
  return localTime.toTimeString().split(' ')[0].slice(0, 5) // Return time in HH:MM format
}

// Helper functions
const createMarkerMesh = () => {
  const geometry = new THREE.SphereGeometry(0.02, 16, 16)
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  return new THREE.Mesh(geometry, material)
}

const positionOnGlobe = (
  object: THREE.Object3D,
  latitude: number,
  longitude: number,
) => {
  const radius = 1.01
  const phi = (90 - latitude) * (Math.PI / 180)
  const theta = (longitude + 180) * (Math.PI / 180)

  object.position.set(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  )
}

const createCityLabel = (cityName: string) => {
  /*
  const textGeometry = new TextGeometry(cityName, {
    font: font,
    size: 0.05,
    depth: 0.01,
  })
  return new THREE.Mesh(
    textGeometry,
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
    }),
  )*/
}

const positionLabel = (label: THREE.Mesh, markerPosition: THREE.Vector3) => {
  /*
  label.position.copy(markerPosition)
  label.position.multiplyScalar(1.2)
  label.lookAt(new THREE.Vector3(0, 0, 0))
  label.rotateY(Math.PI)*/
}

const drawCurve = (city1: string, city2: string) => {
  if (!markerPositions[city1] || !markerPositions[city2]) return

  // Get start and end positions
  const start = markerPositions[city1]
  const end = markerPositions[city2]

  // Calculate middle point with elevation
  const middle = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
  middle.normalize().multiplyScalar(1.5) // Adjust this value to change curve height

  // Create curve points
  const curve = new THREE.QuadraticBezierCurve3(start, middle, end)

  // Create geometry from curve
  const points = curve.getPoints(500)
  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  // Create curved line
  const material = new THREE.LineBasicMaterial({
    color: 0x00ffff,
    linewidth: 2,
    transparent: true,
    opacity: 0.6,
  })

  const curvedLine = new THREE.Line(geometry, material)
  globe.add(curvedLine)
  curves.push(curvedLine)

  const curveIndex = curves.length
  createAnimatedSphere(curveIndex)
}

const addGlowEffect = () => {
  const glowGeometry = new THREE.SphereGeometry(1.1, 32, 32)
  const glowMaterial = createGlowMaterial()
  glowMesh = new THREE.Mesh(glowGeometry, glowMaterial)
  globe.add(glowMesh)
}

const updateLocalTimes = () => {
  /*
  CITIES.forEach((city, index) => {
    const localTime = calculateLocalTime(city.longitude)
    const label = labels[index]
    const textGeometry = new TextGeometry(`${city.name} - ${localTime}`, {
      font: font,
      size: 0.05,
      height: 0.01,
    })
    label.geometry.dispose() // Dispose of the old geometry
    label.geometry = textGeometry // Assign the new geometry
  })*/
}

const animate = () => {
  animationFrameId = requestAnimationFrame(animate)

  // controls.update()
  updateLabels()
  animatePathSpheres()
  fadeInLabels()
  fadeInCurves()
  fadeInMarkersEffect()
  updateClouds()
  renderer.render(scene, camera)
} //

const updateClouds = () => {
  ;(globe.material as THREE.ShaderMaterial).uniforms.time.value += 0.005 // Adjust speed as needed
}

const updateLabels = () => {
  labels.forEach(label => {
    label.quaternion.copy(camera.quaternion)
  })
}

const animatePathSpheres = () => {
  curves.forEach((curve, index) => {
    if (!animatedSpheres[index]) return

    sphereProgress[index] = (sphereProgress[index] + 0.002) % 1
    const point = new THREE.Vector3()
    const curvePoints = curve.geometry.attributes.position
    const pointIndex = Math.floor(
      sphereProgress[index] * (curvePoints.count - 1),
    )

    point.set(
      curvePoints.getX(pointIndex),
      curvePoints.getY(pointIndex),
      curvePoints.getZ(pointIndex),
    )
    animatedSpheres[index].position.copy(point)
  })
}

const pulseMarkers = () => {
  markers.forEach((marker, index) => {
    if (markerScaleDirections[index]) {
      markerScales[index] += 0.02
      if (markerScales[index] >= 1.5) markerScaleDirections[index] = false
    } else {
      markerScales[index] -= 0.02
      if (markerScales[index] <= 1.0) markerScaleDirections[index] = true
    }

    marker.scale.setScalar(markerScales[index])
  })
}

const fadeInLabels = () => {
  labels.forEach((label, index) => {
    if (labelOpacities[index] < 1) {
      labelOpacities[index] += 0.01
      ;(label.material as THREE.MeshBasicMaterial).opacity =
        labelOpacities[index]
    }
  })
}

const handleResize = () => {
  if (!camera || !renderer) return

  const container = globeCanvas.value?.parentElement
  if (!container) return

  const { width, height } = container.getBoundingClientRect()

  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

const onGlobeClick = (event: MouseEvent) => {
  const rect = renderer.domElement.getBoundingClientRect()

  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(
    markers,
  ) as THREE.Intersection<THREE.Mesh>[]

  if (intersects.length > 0) {
    const markerIndex = markers.indexOf(intersects[0].object)
    const cityName = CITIES[markerIndex].name
    window.open(
      `https://en.wikipedia.org/wiki/${encodeURIComponent(cityName)}`,
      '_blank',
    )
  }
}

const createAnimatedSphere = (curveIndex: number) => {
  const sphereGeometry = new THREE.SphereGeometry(0.01, 8, 8)
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    transparent: true,
    opacity: 0.8,
  })
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  globe.add(sphere)
  animatedSpheres[curveIndex] = sphere
  sphereProgress[curveIndex] = 0
}

function drawLineToLabel(
  markerPosition: THREE.Vector3,
  labelPosition: THREE.Vector3,
) {
  const points = [markerPosition, labelPosition]
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const material = new THREE.LineBasicMaterial({ color: 0xffffff })
  const line = new THREE.Line(geometry, material)
  globe.add(line)
}

const onGlobeMouseMove = (event: MouseEvent) => {
  const rect = renderer.domElement.getBoundingClientRect()

  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(
    markers,
  ) as THREE.Intersection<THREE.Mesh>[]

  markers.forEach((marker, index) => {
    if (intersects.length > 0 && intersects[0].object === marker) {
      marker.scale.setScalar(1.5) // Scale up the marker
    } else {
      marker.scale.setScalar(markerScales[index]) // Reset to original scale
    }
  })
}

const fadeInCurves = () => {
  curves.forEach((curve, index) => {
    if (curveOpacities[index] < 1) {
      curveOpacities[index] += 0.01 // Adjust the increment for desired speed
      ;(curve.material as THREE.LineBasicMaterial).opacity =
        curveOpacities[index]
    }
  })
}

const fadeInMarkers: THREE.Mesh[] = []

const fadeInMarkersEffect = () => {
  fadeInMarkers.forEach((marker, index) => {
    const material = marker.material as THREE.MeshBasicMaterial
    if (material.opacity < 1) {
      material.opacity += 0.01 // Adjust the increment for desired speed
    } else {
      fadeInMarkers.splice(index, 1) // Remove marker from list once fully visible
    }
  })
}

onMounted(() => {
  initThreeJS()
  animate()
  //fetchCities(); // Fetch additional cities
  window.addEventListener('resize', handleResize)
  renderer.domElement.addEventListener('mousemove', onGlobeMouseMove) // Add mousemove event listener
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId)
  window.removeEventListener('resize', handleResize)
  renderer.domElement.removeEventListener('click', onGlobeClick)
  renderer.domElement.removeEventListener('mousemove', onGlobeMouseMove) // Remove mousemove event listener
})
</script>

<style scoped>
.globe-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  margin: 0 auto;
}

canvas {
  width: 100%;
  height: 100%;
  cursor: pointer;
}
</style>
