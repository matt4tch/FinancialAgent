// Keep track of the DOM element we create so we don’t spawn multiples.
let container = null;

function createModelViewer() {
  // If we already have a container, do nothing.
  if (container) return;

  // 1) Create the semi-opaque overlay container
  container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "100vw";
  container.style.height = "100vh";
  container.style.zIndex = "9999";
  container.style.background = "rgba(0, 0, 0, 0.7)";
  document.body.appendChild(container);

  // 2) Add the “panel” on the right with text, logs, or instructions
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

  // 2b) Embed an image (analytics.png) inside the text box
  const analyticsImg = document.createElement("img");
  analyticsImg.src = chrome.runtime.getURL("/src/assets/analytics.png");
  analyticsImg.alt = "Analytics";
  analyticsImg.style.width = "200px";
  analyticsImg.style.display = "block";
  analyticsImg.style.margin = "0 auto 20px"; // center it, add margin bottom
  textBox.appendChild(analyticsImg);

  // 3) Add a close button inside the panel
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
    if (container) {
      container.remove();
      container = null;
    }
  });

  // 4) Create a canvas for Three.js (left side)
  const canvas = document.createElement("canvas");
  canvas.style.position = "absolute";
  canvas.style.left = "20px";
  canvas.style.top = "20px";
  // We'll explicitly set the CSS width/height to fill up the leftover space
  canvas.style.width = "calc(55% - 40px)"; // 55% leftover after textBox’s 45% – minus margins
  canvas.style.height = "calc(100vh - 40px)";
  canvas.style.border = "1px solid #ccc";
  container.appendChild(canvas);

  // 5) Dynamically import Three.js + loaders/controls
  Promise.all([
    import("three"),
    import("three/examples/jsm/loaders/GLTFLoader.js"),
    import("three/examples/jsm/controls/OrbitControls.js")
  ]).then(([THREEImport, GLTFLoaderImport, OrbitControlsImport]) => {
    const THREE = THREEImport;
    const { GLTFLoader } = GLTFLoaderImport;
    const { OrbitControls } = OrbitControlsImport;

    // 6) Create the scene/camera/renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvasWidth, canvasHeight);

    // 7) Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight1.position.set(5, 5, 5);
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight2.position.set(-5, -5, -5);
    scene.add(ambientLight, directionalLight1, directionalLight2);

    // 8) Load the 3D model
    const loader = new GLTFLoader();
    loader.load(
        chrome.runtime.getURL("models/model.glb"),
        (gltf) => {
          const model = gltf.scene;

          // Center & scale the model
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());

          model.position.x -= center.x;
          model.position.y -= center.y;
          model.position.z -= center.z;

          const maxDim = Math.max(size.x, size.y, size.z);
          const scaleFactor = 10 / maxDim;
          model.scale.set(scaleFactor, scaleFactor, scaleFactor);

          scene.add(model);

          // Adjust camera so we see the model
          camera.position.set(0, 0, maxDim * 2);
          camera.lookAt(0, 0, 0);
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        (error) => {
          console.error("Error loading model:", error);
        }
    );

    // 9) Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;

    // 10) Handle window resizing
    function onWindowResize() {
      const newWidth = canvas.clientWidth;
      const newHeight = canvas.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    }
    window.addEventListener("resize", onWindowResize);

    // 11) Animate
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();
  });
}

function addModelViewerButton() {
  const button = document.createElement("button");
  button.textContent = "Open 3D Model Viewer";
  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.padding = "10px 20px";
  button.style.background = "#4CAF50";
  button.style.color = "white";
  button.style.border = "none";
  button.style.borderRadius = "5px";
  button.style.cursor = "pointer";
  button.style.zIndex = "9998";

  button.addEventListener("click", createModelViewer);
  document.body.appendChild(button);
}

// If you want to open from a background/popup
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "openModelViewer") {
    createModelViewer();
  }
});

// Initialize
addModelViewerButton();
