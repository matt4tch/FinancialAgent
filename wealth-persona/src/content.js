import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  DirectionalLight,
  AmbientLight
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Text-to-speech function
const speakText = (text) => {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  utterance.voice = voices.find(voice => voice.name === "Aaron");
  utterance.rate = 0.6;

  // Simulate mouth movement with TTS
  utterance.onstart = () => {
    const interval = setInterval(() => {
      setMouthOpen(Math.random()); // Random mouth movement
    }, 100); // Adjust frequency as needed
    utterance.onend = () => {
      clearInterval(interval);
      setMouthOpen(0); // Close the mouth when speech ends
    };
  };
  synth.speak(utterance);
};

// Step 1: Create a container for the 3D viewer and text box
const container = document.createElement("div");
container.style.position = "fixed";
container.style.top = "0";
container.style.left = "0";
container.style.width = "100vw";
container.style.height = "100vh";
container.style.zIndex = "9999";
container.style.background = "rgba(0, 0, 0, 0.7)";
document.body.appendChild(container);

// Create a text box container on the right
const textBox = document.createElement("div");
textBox.style.position = "absolute";
textBox.style.top = "20px";
textBox.style.right = "20px";
textBox.style.width = "45%";
textBox.style.height = "calc(100vh - 40px)";
textBox.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
textBox.style.color = "#333";
textBox.style.padding = "20px";
textBox.style.borderRadius = "10px";
textBox.style.overflowY = "auto";
textBox.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
container.appendChild(textBox);

// Add some stylish text inside the text box
const heading = document.createElement("h1");
heading.textContent = "3D Model Viewer";
heading.style.textAlign = "center";
heading.style.fontFamily = "Arial, sans-serif";
heading.style.color = "#444";
textBox.appendChild(heading);

const description = document.createElement("p");
description.textContent = "This is a 3D model viewer. Use your mouse to interact with the model.";
description.style.fontFamily = "Arial, sans-serif";
description.style.fontSize = "16px";
description.style.lineHeight = "1.5";
textBox.appendChild(description);

// Add a close button to close the viewer
const closeButton = document.createElement("button");
closeButton.textContent = "Close";
closeButton.style.position = "absolute";
closeButton.style.top = "10px";
closeButton.style.right = "10px";
closeButton.style.padding = "10px 20px";
closeButton.style.background = "red";
closeButton.style.color = "#fff";
closeButton.style.border = "none";
closeButton.style.borderRadius = "5px";
closeButton.style.cursor = "pointer";
textBox.appendChild(closeButton);

closeButton.addEventListener("click", () => {
  container.remove();
});

// Step 2: Create a canvas for rendering the 3D model
const canvas = document.createElement("canvas");
canvas.style.position = "absolute";
canvas.style.left = "20px";  // Position the model to the left
canvas.style.top = "20px";
canvas.style.width = "calc(100% - 340px)"; // Make the model container smaller for the text box
canvas.style.height = "calc(100vh - 40px)";
container.appendChild(canvas);

// Step 3: Load Three.js dynamically
(async () => {
  // Step 4: Set up the scene, camera, and renderer
  const scene = new Scene();
  const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new WebGLRenderer({ canvas, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Step 5: Add lights
  const ambientLight = new AmbientLight(0xffffff, 0.5);
  const directionalLight = new DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(ambientLight, directionalLight);

  // Step 6: Load the 3D model
  const loader = new GLTFLoader();
  loader.load(
      chrome.runtime.getURL("models/model.glb"), // Path to your 3D model
      (gltf) => {
        const model = gltf.scene;
        model.position.set(-5, -5, 0); // Position the model to the left
        model.scale.set(3, 3, 3); // Scale up the model to make it bigger
        scene.add(model);

        // Step 10: Add click event listener to trigger speech
        model.traverse((child) => {
          if (child.isMesh) {
            child.cursor = "pointer"; // Make the cursor a pointer to indicate clickable
            child.on('click', () => {
              speakText("Hello! I am the character!");
            });
          }
        });
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
      }
  );

  // Step 7: Add OrbitControls for interaction
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Disable zooming to prevent scaling
  controls.enableZoom = false;

  // Limit the rotation to the Y-axis (horizontal spinning)
  controls.enableRotate = true;
  controls.minAzimuthAngle = -Math.PI / 2; // Start rotation from left
  controls.maxAzimuthAngle = Math.PI / 2;  // End rotation at right

  // Step 8: Position the camera
  camera.position.y = 1;
  camera.position.x = 4;
  camera.position.z = 5;

  // Step 9: Animation loop
  function animate() {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
  }
  animate();
})();
