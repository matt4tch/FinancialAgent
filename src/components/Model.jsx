import React, { Suspense, useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, useGLTF, Text } from "@react-three/drei"
import * as THREE from "three"

function Model() {
    const { scene, nodes } = useGLTF("/public/models/model.glb");
    console.log(nodes);
    console.log('nodes', nodes.Armature.position.set(0, 0, 0));
    console.log('scene', scene);
    const [mouthOpen, setMouthOpen] = useState(0);
    const [speaking, setSpeaking] = useState(false);
    const phrase = "I'm Sandra, your personal finance assistant";
    const [currentLetter, setCurrentLetter] = useState(0);

    useEffect(() => {
        if (speaking && currentLetter < phrase.length) {
            const timer = setTimeout(() => {
                setCurrentLetter(currentLetter + 1)
            }, 100)
            return () => clearTimeout(timer)
        } else if (currentLetter === phrase.length) {
            setSpeaking(false)
            setCurrentLetter(0)
        }
    }, [speaking, currentLetter])

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

    return (
        <group position={[0, -1, 0]} onClick={() => { setSpeaking(true); speakText(phrase) }}>
            <primitive object={scene} />
            {speaking && (
                <Text position={[0, 2, 0]} fontSize={0.2} color="black" anchorX="center" anchorY="middle">
                    {phrase.slice(0, currentLetter)}
                </Text>
            )}
        </group>
    )
}

    export default function ThreeDScene() {
    return (
        <div className="relative w-screen h-screen bg-gray-900">
            <Canvas
                camera={{position: [0, 5, 10], fov: 50}}
                style={{width: "700px", height: "1000px"}}
            >
                <ambientLight intensity={0.5}/>
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1}/>
                <pointLight position={[-10, -10, -10]}/>
                <Suspense fallback={null}>
                    <Model/>
                    <OrbitControls/>
                </Suspense>
            </Canvas>
            {/*<div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 p-2 rounded">*/}
            {/*    Click on the duck to make it speak!*/}
            {/*</div>*/}
        </div>
    )
    }
