"use client";

import { Environment, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
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
      // Lumière organique rasante
      lightRef.current.position.x = Math.sin(time * 0.2) * 12;
      lightRef.current.position.y = Math.cos(time * 0.15) * 8;
    }
  });

  return (
    <>
      <ambientLight intensity={0.15} color="#ffffff" />
      <directionalLight position={[0, 10, -5]} intensity={0.8} color="#ffffff" />
      <pointLight ref={lightRef} position={[0, 0, 4]} intensity={2.5} distance={30} color="#ffffff" />
      
      <Environment preset="city" />
      
      <CameraRig />
      
      {/* 
        ========================================================================
        TEXTE 100% 3D (WebGL) POUR RÉFRACTION PHYSIQUE
        ========================================================================
        Le Html de drei est remplacé par du Text 3D. 
        C'est le seul moyen pour que le MeshTransmissionMaterial capte le texte
        et applique la distorsion / l'effet loupe optique de la référence.
      */}
      <group position={[-6.5, 0, -3]}>
        
        {/* Label (REAL-TIME MATERIAL STUDIO) */}
        <Text
          position={[0, 2.5, 0]}
          fontSize={0.25}
          color="#888888"
          anchorX="left"
          letterSpacing={0.2}
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.ttf"
        >
          REAL-TIME MATERIAL STUDIO
        </Text>
        
        {/* Titre Principal (Designed in glass.) */}
        <Text
          position={[0, 0.5, 0]}
          fontSize={2.5}
          color="#f5f5f5"
          anchorX="left"
          fontWeight="bold"
          lineHeight={0.9}
          letterSpacing={-0.05}
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf"
        >
          {"Designed\nin glass."}
        </Text>
        
        {/* Paragraphe descriptif */}
        <Text
          position={[0, -1.8, 0]}
          fontSize={0.35}
          color="#777777"
          anchorX="left"
          maxWidth={9}
          lineHeight={1.4}
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
        >
          Author dispersion, transmission, and refraction in the browser. Live previews, real materials.
        </Text>

        {/* Boutons Call To Action 3D */}
        <group position={[0, -3.2, 0]}>
          {/* Bouton Open Studio */}
          <mesh position={[1.8, 0, 0]}>
            <planeGeometry args={[3.6, 1]} />
            <meshBasicMaterial color="#eeeeee" />
            <Text 
              position={[0, 0, 0.01]} 
              fontSize={0.28} 
              color="#111111"
              font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf"
            >
              Open studio
            </Text>
          </mesh>
          
          {/* Bouton Read Paper */}
          <Text 
            position={[4.2, 0, 0]} 
            fontSize={0.28} 
            color="#cccccc" 
            anchorX="left"
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf"
          >
            Read paper ↗
          </Text>
        </group>
      </group>

      <HeaderGlass />
      
      {/* 
        Le verre se place devant la typographie. 
        Étant donné que la typographie est un mesh, elle sera réfractée !
      */}
      <GlassPieces />
    </>
  );
}
