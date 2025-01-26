// src/Model.jsx
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const Model = ({ mouthOpen }) => {
    const { scene } = useGLTF("../model.glb");
    const mouth = scene.getObjectByName("Mouth"); // Replace "Mouth" with the name of the morph target object in your model

    // Animate mouth morph target based on mouthOpen value
    useFrame(() => {
        if (mouth && mouth.morphTargetInfluences) {
            mouth.morphTargetInfluences[0] = mouthOpen; // Adjust the first morph target
        }
    });

    return <primitive object={scene} />;
};

export default Model;
