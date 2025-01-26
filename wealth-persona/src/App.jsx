import ThreeDScene from "./components/Model.jsx"
import React, { useEffect, useState } from "react";

function App() {
    const [mouthOpen, setMouthOpen] = useState(0);

    useEffect(() => {
        console.log("HELLO WORLD");
    }, []);

    return (
        <div style={{position: "relative", height: "100vh", overflow: "hidden"}}>
            <div
                style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    zIndex: 10, // Ensure it's above the canvas
                }}
            >
            </div>
            <div className="App">
                <h1 className="text-3xl font-bold text-center py-4">3D Model Viewer</h1>
                <ThreeDScene/>
            </div>
        </div>
    );
}

export default App
