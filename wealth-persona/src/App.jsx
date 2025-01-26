// src/App.jsx
import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Model from "./components/Model.jsx";

const App = () => {
    const [mouthOpen, setMouthOpen] = useState(0);

    useEffect(() => {
        console.log("HELLO WORLD");
    }, []);

    const speakText = (text) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        utterance.voice = voices.find(voice => voice.name === "Aaron");

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

    return (
        <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
             {/*Canvas Layer*/}
            <Canvas style={{ position: "absolute", top: 0, left: 0 }} frameloop="demand">
                <ambientLight intensity={0.5} />
                <directionalLight position={[2, 2, 2]} />
                <Model mouthOpen={mouthOpen} />
                <OrbitControls />
            </Canvas>

            {/* UI Layer */}
            <div
                style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    zIndex: 10, // Ensure it's above the canvas
                }}
            >
                <input
                    type="text"
                    id="text-input"
                    placeholder="Enter text to speak"
                    style={{ marginRight: "10px" }}
                />
                <button
                    onClick={() => {
                        const text = document.getElementById("text-input").value;
                        speakText(text);
                    }}
                >
                    Speak
                </button>
            </div>
        </div>
    );
};

export default App;
