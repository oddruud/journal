declare module 'three/examples/jsm/loaders/FontLoader' {
  export * from 'three/examples/jsm/loaders/FontLoader'
}

declare module 'three/examples/jsm/loaders/OrbitControls' {
  export * from 'three/examples/jsm/loaders/OrbitControls'
}

declare module '../three/OrbitControls' {
  import { Camera, EventDispatcher, MOUSE, Vector3 } from 'three'
  export class OrbitControls extends EventDispatcher {
    constructor(object: Camera, domElement?: HTMLElement)
    object: Camera
    domElement: HTMLElement | HTMLDocument
    // Add other properties and methods as needed
  }
}
