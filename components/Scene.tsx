"use client";

import { Environment, Text, RoundedBox } from "@react-three/drei";
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
  const [hoveredPaper, setHoveredPaper] = useState(false);
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
    // Lumière ponctuelle dynamique qui suit subtilement la souris pour des glints spéculaires vivants
    if (lightRef.current) {
      const targetLightX = state.pointer.x * w * 0.4;
      const targetLightY = state.pointer.y * h * 0.4 + 1.0;
      lightRef.current.position.x = THREE.MathUtils.damp(lightRef.current.position.x, targetLightX, 4, delta);
      lightRef.current.position.y = THREE.MathUtils.damp(lightRef.current.position.y, targetLightY, 4, delta);
    }

    // Animation de transition fluide de la section Hero
    if (heroGroupRef.current) {
      const isStudio = page === 'studio';
      const targetX = isStudio ? 0 : -w * 0.9;
      const targetZ = isStudio ? -0.15 : -3;
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
      {/* 
        Éclairage Studio Haute Précision :
        Recrée exactement les reflets spéculaires intenses sur les arêtes et biseaux de la vidéo
      */}
      <ambientLight intensity={0.45} color="#ffffff" />
      <directionalLight position={[2, 10, 6]} intensity={4.2} color="#ffffff" />
      <directionalLight position={[-8, 3, 3]} intensity={2.8} color="#c0dcff" />
      <directionalLight position={[8, -2, 4]} intensity={2.2} color="#ffffff" />
      <directionalLight position={[0, -6, 2]} intensity={1.2} color="#506080" />
      
      {/* Spot spéculaire interactif */}
      <pointLight ref={lightRef} position={[0, 1, 4]} intensity={4.5} distance={22} color="#ffffff" />
      
      {/* Environnement HDRI riche (preset city) pour des reflets nets sur le verre fumé */}
      <Environment preset="city" environmentIntensity={0.85} />
      
      <CameraRig />
      
      {/* ==================== PAGE 1 : STUDIO HERO (TEXTE & CTA SITUÉS DERRIÈRE LE VERRE) ==================== */}
      <group ref={heroGroupRef} position={[0, 0, -0.15]}>
        
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
          scale={hoveredCta ? 1.06 : 1.0}
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
            <planeGeometry args={[toW(86), toH(28)]} />
            <meshBasicMaterial color={hoveredCta ? "#ffffff" : "#e0e0e4"} />
            <Text
              position={[0, 0, 0.01]}
              fontSize={toW(11.5)}
              color="#0d0d10"
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
            >
              Open studio
            </Text>
          </mesh>
        </group>

        {/* Bouton Read paper → interactif (navigue vers Materials) */}
        <group 
          position={[toX(60 + 120), toY(320 + 14), 0]}
          scale={hoveredPaper ? 1.06 : 1.0}
        >
          <mesh 
            onClick={(e) => {
              e.stopPropagation();
              setPage('materials');
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'pointer';
              setHoveredPaper(true);
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'default';
              setHoveredPaper(false);
            }}
          >
            <planeGeometry args={[toW(95), toH(28)]} />
            <meshBasicMaterial transparent opacity={0} />
            <Text
              position={[0, 0, 0.01]}
              fontSize={toW(11.5)}
              color={hoveredPaper ? "#ffffff" : "#9898a0"}
              anchorX="center"
              anchorY="middle"
              fontWeight="500"
            >
              Read paper →
            </Text>
          </mesh>
        </group>

        {/* Signature légale "© Prism Lab" en bas à gauche */}
        <Text
          position={[toX(60), toY(396), 0]}
          fontSize={toW(8.5)}
          color="#55555e"
          anchorX="left"
          anchorY="bottom"
        >
          © Prism Lab
        </Text>

        {/* Extension WebGL "KHR_materials_dispersion" en bas à droite */}
        <Text
          position={[toX(780), toY(396), 0]}
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
            <meshPhysicalMaterial
              transmission={0.9}
              thickness={0.6}
              roughness={0.12}
              ior={1.28}
              color="#161720"
              clearcoat={1.0}
              clearcoatRoughness={0.06}
              specularIntensity={1.0}
              specularColor="#ffffff"
              transparent={true}
              opacity={0.96}
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
