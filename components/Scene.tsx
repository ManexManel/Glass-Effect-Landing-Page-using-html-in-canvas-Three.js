"use client";

import { Environment, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";
import GlassPieces from "./GlassPieces";
import HeaderGlass from "./HeaderGlass";
import CameraRig from "./CameraRig";

export default function Scene() {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (lightRef.current) {
      const time = state.clock.getElapsedTime();
      // Lumière organique rasante très douce
      lightRef.current.position.y = Math.cos(time * 0.15) * 4;
    }
  });

  const { viewport } = useThree();
  const w = viewport.width;
  const h = viewport.height;
  
  // Helpers de conversion Pixel -> WebGL (Base 860x418)
  const toX = (px: number) => (px / 860 - 0.5) * w;
  const toY = (py: number) => -(py / 418 - 0.5) * h;
  const toW = (px: number) => (px / 860) * w;
  const toH = (py: number) => (py / 418) * h;

  return (
    <>
      {/* Éclairage Studio pur (sans téléchargement externe réseau bloquant) */}
      <ambientLight intensity={0.4} color="#ffffff" />
      <directionalLight position={[0, 8, 4]} intensity={2.0} color="#ffffff" />
      <directionalLight position={[-6, -2, 2]} intensity={1.2} color="#80a0c0" />
      <pointLight ref={lightRef} position={[-2, 0, 4]} intensity={3.0} distance={30} color="#ffffff" />
      <pointLight position={[5, 2, 3]} intensity={2.0} distance={25} color="#b0d0ff" />
      {/* Environnement avec intensité très douce pour reflets subtils sombres */}
      <Environment preset="city" environmentIntensity={0.15} />
      
      <CameraRig />
      
      {/* TEXTE WebGL DIRECTEMENT DERRIÈRE LE VERRE */}
      <group position={[0, 0, -0.08]} renderOrder={-1}>
        
        {/* Label (REAL-TIME MATERIAL STUDIO) */}
        <Text
          position={[toX(60), toY(108), 0]}
          fontSize={toW(9.5)}
          color="#888892"
          anchorX="left"
          anchorY="top"
          letterSpacing={0.12}
        >
          REAL-TIME MATERIAL STUDIO
        </Text>
        
        {/* Titre Principal (Designed in glass.) */}
        <Text
          position={[toX(60), toY(128), 0]}
          fontSize={toW(60)}
          color="#ffffff"
          anchorX="left"
          anchorY="top"
          fontWeight="bold"
          lineHeight={0.92}
          letterSpacing={-0.05}
        >
          {"Designed\nin glass."}
        </Text>
        
        {/* Paragraphe descriptif */}
        <Text
          position={[toX(60), toY(254), 0]}
          fontSize={toW(13)}
          color="#909098"
          anchorX="left"
          anchorY="top"
          maxWidth={toW(310)}
          lineHeight={1.4}
        >
          Author dispersion, transmission, and refraction in the browser. Live previews, real materials.
        </Text>

        {/* Bouton Open Studio */}
        <mesh position={[toX(60 + 40), toY(320 + 14), 0]}>
          <planeGeometry args={[toW(80), toH(28)]} />
          <meshBasicMaterial color="#ffffff" />
          <Text 
            position={[0, 0, 0.01]} 
            fontSize={toW(11.5)} 
            color="#111113"
            fontWeight="bold"
          >
            Open studio
          </Text>
        </mesh>
        
        {/* Bouton Read Paper */}
        <Text 
          position={[toX(156), toY(334), 0]} 
          fontSize={toW(12.5)} 
          color="#b0b0b8" 
          anchorX="left" 
          anchorY="middle"
        >
          Read paper →
        </Text>
      </group>

      <HeaderGlass />
      
      {/* 
        Mosaïque de verre en 5 plaques polygonales
        Réfracte le texte 3D situé en arrière-plan
      */}
      <GlassPieces />
    </>
  );
}
