// import ThreeDScene from "./components/Model.jsx"
// import React, { useEffect, useState } from "react";
//
// function App() {
//     const [mouthOpen, setMouthOpen] = useState(0);
//
//     useEffect(() => {
//         console.log("HELLO WORLD");
//     }, []);
//
//     return (
//         <div style={{position: "relative", height: "100vh", overflow: "hidden"}}>
//             <div
//                 style={{
//                     position: "absolute",
//                     top: "20px",
//                     left: "20px",
//                     zIndex: 10, // Ensure it's above the canvas
//                 }}
//             >
//             </div>
//             <div className="App">
//                 <h1 className="text-3xl font-bold text-center py-4">3D Model Viewer</h1>
//                 <ThreeDScene/>
//             </div>
//         </div>
//     );
// }
//
// export default App

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

const Model = ({ url }) => {
    const gltf = useGLTF(url);
    return <primitive object={gltf.scene} scale={1.5} />;
};

const RotatingCube = () => {
    const ref = useRef();
    useFrame(() => {
        ref.current.rotation.x += 0.01;
        ref.current.rotation.y += 0.01;
    });

    return (
        <mesh ref={ref}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="orange" />
        </mesh>
    );
};

const App = () => {
    const [showCube, setShowCube] = useState(true);
    const [modelUrl, setModelUrl] = useState(
        chrome.runtime.getURL("models/model.glb") // Default model URL
    );

    return (
        <div
            style={{
                position: "fixed",
                top: "0",
                left: "0",
                width: "100vw",
                height: "100vh",
                zIndex: "9999",
                background: "rgba(0, 0, 0, 0.8)",
            }}
        >
            {/* Close button */}
            <button
                style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    padding: "10px 20px",
                    background: "red",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
                onClick={() => {
                    const root = document.getElementById("react-3d-viewer-root");
                    root.remove();
                }}
            >
                Close
            </button>

            {/* Toggle between Cube and Model */}
            <button
                style={{
                    position: "absolute",
                    top: "50px",
                    right: "10px",
                    padding: "10px 20px",
                    background: "blue",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
                onClick={() => setShowCube(!showCube)}
            >
                {showCube ? "Show Model" : "Show Cube"}
            </button>

            {/* Replace Model */}
            <button
                style={{
                    position: "absolute",
                    top: "90px",
                    right: "10px",
                    padding: "10px 20px",
                    background: "green",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
                onClick={() => {
                    const newModelUrl = chrome.runtime.getURL("models/another-model.glb");
                    setModelUrl(newModelUrl);
                }}
            >
                Load Another Model
            </button>

            {/* 3D Viewer */}
            <Canvas>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} />

                {showCube ? <RotatingCube /> : <Model url={modelUrl} />}

                <OrbitControls />
            </Canvas>
        </div>
    );
};

export default App;
