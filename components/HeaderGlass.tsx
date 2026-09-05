"use client";

import React, { useRef } from 'react';
import { RoundedBox, Text, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

export default function HeaderGlass() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const w = viewport.width;
  const h = viewport.height;
  
  // Helpers de conversion Pixel -> WebGL (Base 860x418)
  const toW = (px: number) => (px / 860) * w;
  const toH = (py: number) => (py / 418) * h;
  const toX = (px: number) => (px / 860 - 0.5) * w;
  const toY = (py: number) => -(py / 418 - 0.5) * h;

  // Header mesuré: X de 23px à 815px (largeur 792px = 92.1%), Y de 44px à 80px (hauteur 36px)
  const width = toW(792);
  const height = toH(36);
  const centerX = toX((23 + 815) / 2);
  const centerY = toY(62);

  return (
    <group position={[centerX, centerY, 0.4]}>
      {/* Capsule en verre dépoli sombre */}
      <RoundedBox args={[width, height, 0.08]} radius={toH(12)} smoothness={8} ref={meshRef}>
        <MeshTransmissionMaterial 
          transmission={0.88} 
          thickness={0.4} 
          roughness={0.25} 
          ior={1.25} 
          color="#151518"
          attenuationColor="#0a0a0c"
          attenuationDistance={1.5}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
          chromaticAberration={0.015}
        />
      </RoundedBox>

      {/* Textes de navigation positionnés au-dessus du verre */}
      <group position={[0, 0, 0.06]}>
        {/* Logo "■ Prism" */}
        <Text 
          position={[-width / 2 + toW(38), 0, 0]} 
          fontSize={toW(13)} 
          color="#f0f0f0" 
          anchorX="left" 
          anchorY="middle"
          fontWeight="bold"
          letterSpacing={0.02}
        >
          ■ Prism
        </Text>
        
        {/* Liens de navigation (alignés à gauche après le logo) */}
        <group position={[-width / 2 + toW(125), 0, 0]}>
          <Text 
            position={[0, 0, 0]} 
            fontSize={toW(12)} 
            color="#888890" 
            anchorX="left" 
            anchorY="middle"
          >
            Studio
          </Text>
          <Text 
            position={[toW(60), 0, 0]} 
            fontSize={toW(12)} 
            color="#888890" 
            anchorX="left" 
            anchorY="middle"
          >
            Materials
          </Text>
          <Text 
            position={[toW(135), 0, 0]} 
            fontSize={toW(12)} 
            color="#888890" 
            anchorX="left" 
            anchorY="middle"
          >
            Pricing
          </Text>
        </group>
        
        {/* Bouton "Sign in" à droite */}
        <Text 
          position={[width / 2 - toW(30), 0, 0]} 
          fontSize={toW(12)} 
          color="#b0b0b8" 
          anchorX="right" 
          anchorY="middle"
        >
          Sign in
        </Text>
      </group>
    </group>
  );
}
