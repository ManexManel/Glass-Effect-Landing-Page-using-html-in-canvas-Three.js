"use client";

import { MeshTransmissionMaterial, RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";
import { MotionValue } from "framer-motion";

interface GlassShapeProps {
  scrollYProgress: MotionValue<number>;
}

export default function GlassShape({ scrollYProgress }: GlassShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotation subtile automatique
      meshRef.current.rotation.x += delta * 0.15;
      meshRef.current.rotation.y += delta * 0.2;

      // Récupération de la progression du scroll
      const scroll = scrollYProgress.get();

      // Cibles d'animation au scroll
      // Quand on descend (scroll tend vers 1), le verre monte de 5 unités et s'incline.
      const targetY = scroll * 5;
      const targetRotationZ = scroll * Math.PI * 0.5;

      // Interpolation fluide (Lerp) de la position et de l'inclinaison Z
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, delta * 5);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRotationZ, delta * 5);
    }
  });

  return (
    <RoundedBox 
      ref={meshRef} 
      position={[0, 0, 0]} 
      args={[4, 5, 0.5]} 
      radius={0.1} 
      smoothness={4}
    >
      <MeshTransmissionMaterial
        transmission={1}
        thickness={0.5}
        roughness={0.05}
        ior={1.5}
        chromaticAberration={0.04}
        backside={true}
      />
    </RoundedBox>
  );
}
