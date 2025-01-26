import React, { Suspense, useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, useGLTF, Text } from "@react-three/drei"
import * as THREE from "three"

function Model() {
    const { scene, nodes } = useGLTF("/public/models/model.glb")
    const duckRef = useRef()
    const mouthRef = useRef()
    const [speaking, setSpeaking] = useState(false)
    const phrase = "Quack quack! I'm a talking duck!"
    const [currentLetter, setCurrentLetter] = useState(0)

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

    useFrame((state) => {
        if (mouthRef.current && speaking) {
            mouthRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 30) * 0.1
        }
    })

    useEffect(() => {
        if (duckRef.current) {
            duckRef.current.scale.set(2, 2, 2) // Make the duck larger
        }
        // Find the mouth part and set its reference
        const mouth = nodes["DuckMouth"]
        if (mouth) {
            mouthRef.current = mouth
        }
    }, [nodes])

    return (
        <group ref={duckRef} position={[0, -1, 0]} onClick={() => setSpeaking(true)}>
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
        <div className="w-full h-screen">
            <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <pointLight position={[-10, -10, -10]} />
                <Suspense fallback={null}>
                    <Model />
                    <OrbitControls />
                </Suspense>
            </Canvas>
            <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 p-2 rounded">
                Click on the duck to make it speak!
            </div>
        </div>
    )
}
