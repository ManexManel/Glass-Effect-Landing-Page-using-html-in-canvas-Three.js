"use client";

import React, { useRef } from 'react';
import { RoundedBox, Text, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function HeaderGlass() {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <group position={[0, 4.2, 0.5]}>
      {/* La barre de verre horizontale */}
      <RoundedBox args={[15, 0.8, 0.1]} radius={0.1} smoothness={4} ref={meshRef}>
        {/* Matériau de verre fumé (Dark Glass) */}
        <MeshTransmissionMaterial 
          transmission={0.95} 
          thickness={0.2} 
          roughness={0.2} 
          ior={1.4} 
          color="#222222"
          clearcoat={0.5}
        />
      </RoundedBox>

      {/* Les Textes 3D positionnés très légèrement devant le verre */}
      <group position={[0, 0, 0.06]}>
        {/* Logo à gauche */}
        <Text 
          position={[-7, 0, 0]} 
          fontSize={0.15} 
          color="#eeeeee" 
          anchorX="left" 
          anchorY="middle"
          fontWeight="bold"
        >
          ■ Prism
        </Text>
        
        {/* Liens de navigation */}
        <Text 
          position={[-4.5, 0, 0]} 
          fontSize={0.12} 
          color="#888888" 
          anchorX="left" 
          anchorY="middle"
        >
          Studio          Materials          Pricing
        </Text>
        
        {/* Bouton Sign In à droite */}
        <Text 
          position={[7, 0, 0]} 
          fontSize={0.12} 
          color="#aaaaaa" 
          anchorX="right" 
          anchorY="middle"
        >
          Sign in
        </Text>
      </group>
    </group>
  );
}
