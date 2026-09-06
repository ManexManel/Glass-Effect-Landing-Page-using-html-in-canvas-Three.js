"use client";

import React, { useRef } from 'react';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';

import { useNav } from './NavigationContext';

export default function HeaderGlass() {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const { page, setPage, setShowSignIn } = useNav();

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

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Positionnement stable et fluide avec légère adaptation de profondeur
      const isMaterials = page === 'materials';
      const targetZ = isMaterials ? 0.35 : 0.4;
      groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, centerY, 6, delta);
      groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, targetZ, 6, delta);
    }
  });

  const handlePointerOver = () => {
    document.body.style.cursor = 'pointer';
  };
  const handlePointerOut = () => {
    document.body.style.cursor = 'default';
  };

  return (
    <group ref={groupRef} position={[centerX, centerY, 0.4]}>
      {/* Capsule en verre dépoli sombre */}
      <RoundedBox args={[width, height, 0.08]} radius={toH(12)} smoothness={8} ref={meshRef}>
        <meshPhysicalMaterial 
          transmission={0.88} 
          thickness={0.5} 
          roughness={0.16} 
          ior={1.28} 
          color="#16171e"
          attenuationColor="#0a0a0f"
          attenuationDistance={1.8}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
          specularIntensity={1.0}
          specularColor="#ffffff"
          transparent={true}
          opacity={0.96}
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
          onClick={(e) => {
            e.stopPropagation();
            setPage('studio');
          }}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          ■ Prism
        </Text>
        
        {/* Liens de navigation (alignés à gauche après le logo) */}
        <group position={[-width / 2 + toW(125), 0, 0]}>
          <Text 
            position={[0, 0, 0]} 
            fontSize={toW(12)} 
            color={page === 'studio' ? "#ffffff" : "#888890"} 
            anchorX="left" 
            anchorY="middle"
            fontWeight={page === 'studio' ? "bold" : "normal"}
            onClick={(e) => {
              e.stopPropagation();
              setPage('studio');
            }}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
          >
            Studio
          </Text>
          <Text 
            position={[toW(60), 0, 0]} 
            fontSize={toW(12)} 
            color={page === 'materials' ? "#ffffff" : "#888890"} 
            anchorX="left" 
            anchorY="middle"
            fontWeight={page === 'materials' ? "bold" : "normal"}
            onClick={(e) => {
              e.stopPropagation();
              setPage('materials');
            }}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
          >
            Materials
          </Text>
          <Text 
            position={[toW(135), 0, 0]} 
            fontSize={toW(12)} 
            color={page === 'pricing' ? "#ffffff" : "#888890"} 
            anchorX="left" 
            anchorY="middle"
            fontWeight={page === 'pricing' ? "bold" : "normal"}
            onClick={(e) => {
              e.stopPropagation();
              setPage('pricing');
            }}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
          >
            Pricing
          </Text>
        </group>

        {/* Bouton Sign In (aligné à droite) */}
        <Text 
          position={[width / 2 - toW(28), 0, 0]} 
          fontSize={toW(12)} 
          color="#f0f0f0" 
          anchorX="right" 
          anchorY="middle"
          fontWeight="500"
          onClick={(e) => {
            e.stopPropagation();
            setShowSignIn(true);
          }}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          Sign In
        </Text>
      </group>
    </group>
  );
}
