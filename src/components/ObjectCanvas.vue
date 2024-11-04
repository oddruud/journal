<template>
  <div>
    <canvas ref="canvas" width="800" height="600" @mousedown="startDrag" @mouseup="endDrag" @mousemove="drag"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const canvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const circles = ref<{ x: number; y: number; radius: number; color: string; text: string }[]>([]);
const dragging = ref(false);
const dragIndex = ref<number | null>(null);
const offset = ref<{ x: number; y: number } | null>(null);
const animationFrames = ref<number[]>([]); // Store animation frame IDs

const createCircle = (x: number, y: number, color: string, text: string) => {
  const newCircle = { x, y, radius: 0, color, text }; // Add text property
  circles.value.push(newCircle);
  animateCircle(newCircle); // Start the animation
};

const animateCircle = (circle: { x: number; y: number; radius: number }) => {
  const targetRadius = 30;
  const bounceHeight = 10; // Height of the bounce
  let direction = 1; // 1 for growing, -1 for shrinking
  const speed = 2;
  const animate = () => {
    if (circle.radius > targetRadius + bounceHeight) {
      direction *= -1; // Change direction when reaching the target or bounce height
    }
    circle.radius += direction * speed; // Increment or decrement radius
    drawCircles(); // Redraw circles

    if (!(circle.radius <= targetRadius && direction == -1)) {
      animationFrames.value.push(requestAnimationFrame(animate)); // Request next frame
    }
  };
  animate(); // Start the animation
}; 

const drawCircles = () => {
  if (ctx.value) {
    ctx.value.clearRect(0, 0, canvas.value!.width, canvas.value!.height);
    circles.value.forEach((circle) => {
      ctx.value!.beginPath();
      ctx.value!.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      ctx.value!.fillStyle = circle.color; // Use circle's color property
      ctx.value!.fill();
      ctx.value!.closePath();

      // Draw text inside the circle
      ctx.value!.fillStyle = 'white'; // Set text color
      ctx.value!.font = '12px Arial'; // Set font style
      ctx.value!.textAlign = 'center'; // Center the text
      ctx.value!.textBaseline = 'middle'; // Middle align the text
      ctx.value!.fillText(circle.text, circle.x, circle.y); // Use circle's text property
    });
  }
};

const startDrag = (event: MouseEvent) => {
  const mousePos = getMousePos(event);
  circles.value.forEach((circle, index) => {
    if (isInsideCircle(mousePos, circle)) {
      dragging.value = true;
      dragIndex.value = index;
      offset.value = { x: mousePos.x - circle.x, y: mousePos.y - circle.y };
    }
  });
};

const endDrag = () => {
  dragging.value = false;
  dragIndex.value = null;
};

const drag = (event: MouseEvent) => {
  if (dragging.value && dragIndex.value !== null) {
    const mousePos = getMousePos(event);
    const circle = circles.value[dragIndex.value];
    circle.x = mousePos.x - (offset.value!.x);
    circle.y = mousePos.y - (offset.value!.y);
    drawCircles();
  }
};

const getMousePos = (event: MouseEvent) => {
  const rect = canvas.value!.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
};

const isInsideCircle = (mousePos: { x: number; y: number }, circle: { x: number; y: number; radius: number }) => {
  const dx = mousePos.x - circle.x;
  const dy = mousePos.y - circle.y;
  return Math.sqrt(dx * dx + dy * dy) < circle.radius;
};

onMounted(() => {
  ctx.value = canvas.value!.getContext('2d');
  createCircle(100, 100, 'blue', 'Circle 1'); // Initial circle with color and text
  createCircle(300, 200, 'red', 'Circle 2'); // Another circle with different color and text
  drawCircles();
});
</script>

<style scoped>
canvas {
  border: 1px solid black;
}
</style> 