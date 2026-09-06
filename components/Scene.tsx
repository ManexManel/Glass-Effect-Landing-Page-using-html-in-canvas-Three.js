"use client";

import { Environment, Text, RoundedBox, MeshTransmissionMaterial } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useRef, useState } from "react";
import * as THREE from "three";
import GlassPieces from "./GlassPieces";
import HeaderGlass from "./HeaderGlass";
import CameraRig from "./CameraRig";
import MaterialsPage from "./MaterialsPage";
import { useNav } from "./NavigationContext";

export default function Scene() {
  const lightRef = useRef<THREE.PointLight>(null);
  const heroGroupRef = useRef<THREE.Group>(null);
  const pricingGroupRef = useRef<THREE.Group>(null);
  const [hoveredCta, setHoveredCta] = useState(false);
  const { page, setPage } = useNav();

  const { viewport } = useThree();
  const w = viewport.width;
  const h = viewport.height;
  
  // Helpers de conversion Pixel -> WebGL (Base 860x418)
  const toX = (px: number) => (px / 860 - 0.5) * w;
  const toY = (py: number) => -(py / 418 - 0.5) * h;
  const toW = (px: number) => (px / 860) * w;
  const toH = (py: number) => (py / 418) * h;

  useFrame((state, delta) => {
    if (lightRef.current) {
      const time = state.clock.getElapsedTime();
      lightRef.current.position.y = Math.cos(time * 0.15) * 4;
    }

    // Animation de transition fluide de la section Hero
    if (heroGroupRef.current) {
      const isStudio = page === 'studio';
      const targetX = isStudio ? 0 : -w * 0.8;
      const targetZ = isStudio ? -0.08 : -3;
      heroGroupRef.current.position.x = THREE.MathUtils.damp(heroGroupRef.current.position.x, targetX, 5, delta);
      heroGroupRef.current.position.z = THREE.MathUtils.damp(heroGroupRef.current.position.z, targetZ, 5, delta);
    }

    // Animation de transition pour la section Pricing
    if (pricingGroupRef.current) {
      const isPricing = page === 'pricing';
      const targetY = isPricing ? 0 : -h * 1.2;
      const targetZ = isPricing ? 0 : -3;
      pricingGroupRef.current.position.y = THREE.MathUtils.damp(pricingGroupRef.current.position.y, targetY, 5, delta);
      pricingGroupRef.current.position.z = THREE.MathUtils.damp(pricingGroupRef.current.position.z, targetZ, 5, delta);
    }
  });

  return (
    <>
      {/* Éclairage Studio haut de gamme */}
      <ambientLight intensity={0.4} color="#ffffff" />
      <directionalLight position={[0, 8, 4]} intensity={2.0} color="#ffffff" />
      <directionalLight position={[-6, -2, 2]} intensity={1.2} color="#80a0c0" />
      <pointLight ref={lightRef} position={[-2, 0, 4]} intensity={3.0} distance={30} color="#ffffff" />
      <pointLight position={[5, 2, 3]} intensity={2.0} distance={25} color="#b0d0ff" />
      
      {/* Environnement avec reflets sombres élégants */}
      <Environment preset="city" environmentIntensity={0.15} />
      
      <CameraRig />
      
      {/* ==================== PAGE 1 : STUDIO HERO (TEXTE & CTA) ==================== */}
      <group ref={heroGroupRef} position={[0, 0, -0.08]} renderOrder={-1}>
        
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

        {/* Bouton Open Studio interactif (navigue vers la page Materials / Studio) */}
        <group 
          position={[toX(60 + 40), toY(320 + 14), 0]}
          scale={hoveredCta ? 1.05 : 1.0}
        >
          <mesh 
            onClick={(e) => {
              e.stopPropagation();
              setPage('materials');
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'pointer';
              setHoveredCta(true);
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'default';
              setHoveredCta(false);
            }}
          >
            <planeGeometry args={[toW(80), toH(28)]} />
            <meshBasicMaterial color={hoveredCta ? "#ffffff" : "#f0f0f4"} />
            <Text 
              position={[0, 0, 0.01]} 
              fontSize={toW(11.5)} 
              color="#111113"
              fontWeight="bold"
            >
              Open studio
            </Text>
          </mesh>
        </group>
        
        {/* Bouton Read Paper interactif */}
        <Text 
          position={[toX(156), toY(334), 0]} 
          fontSize={toW(12.5)} 
          color="#b0b0b8" 
          anchorX="left" 
          anchorY="middle"
          onClick={(e) => {
            e.stopPropagation();
            setPage('materials');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'default';
          }}
        >
          Read paper →
        </Text>

        {/* Footer métadonnées (Frame 36 & 41) */}
        <Text
          position={[toX(60), toY(405), 0]}
          fontSize={toW(8.5)}
          color="#55555e"
          anchorX="left"
          anchorY="bottom"
        >
          © Prism Lab
        </Text>
        <Text
          position={[toX(800), toY(405), 0]}
          fontSize={toW(8.5)}
          color="#55555e"
          anchorX="right"
          anchorY="bottom"
        >
          KHR_materials_dispersion
        </Text>
      </group>

      {/* ==================== PAGE 2 : MATERIALS (FRAME 38) ==================== */}
      <MaterialsPage />

      {/* ==================== PAGE 3 : PRICING CARDS (GLASS MODAL) ==================== */}
      <group ref={pricingGroupRef} position={[0, -h * 1.2, -3]}>
        <group position={[0, toY(230), 0.2]}>
          <RoundedBox args={[toW(420), toH(220), 0.1]} radius={toH(14)} smoothness={8}>
            <MeshTransmissionMaterial
              transmission={0.92}
              thickness={0.5}
              roughness={0.15}
              ior={1.25}
              color="#151518"
              clearcoat={1}
              resolution={256}
              samples={2}
            />
          </RoundedBox>
          <Text position={[0, toH(70), 0.1]} fontSize={toW(18)} color="#ffffff" fontWeight="bold">
            Studio License
          </Text>
          <Text position={[0, toH(35), 0.1]} fontSize={toW(28)} color="#f5f5f7" fontWeight="bold">
            $49 / month
          </Text>
          <Text position={[0, -toH(10), 0.1]} fontSize={toW(11)} color="#888892" maxWidth={toW(340)} textAlign="center">
            Unlimited real-time optical shader exports for WebGL, Three.js and React Three Fiber.
          </Text>
          <mesh 
            position={[0, -toH(65), 0.1]}
            onClick={(e) => {
              e.stopPropagation();
              setPage('studio');
            }}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'default'; }}
          >
            <planeGeometry args={[toW(140), toH(32)]} />
            <meshBasicMaterial color="#ffffff" />
            <Text position={[0, 0, 0.01]} fontSize={toW(12)} color="#111113" fontWeight="bold">
              Get Started
            </Text>
          </mesh>
        </group>
      </group>

      <HeaderGlass />
      
      {/* 
        Mosaïque de verre en 5 plaques polygonales
        Réfracte le texte 3D en temps réel et se disperse lors de la navigation
      */}
      <GlassPieces />
    </>
  );
}
