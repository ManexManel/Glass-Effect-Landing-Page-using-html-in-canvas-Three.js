"use client";

import * as THREE from 'three';
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

// Coordonnées parfaites d'une grille fracturée (diagramme polygonal)
// À l'état 0 (position 0,0,0), les arêtes sont parfaitement alignées et jointives.
const piecesCoords = [
  // P1: Top Left
  [[-12, 7], [-2, 7], [-3.5, 1], [-12, -0.5]],
  // P2: Top Center
  [[-2, 7], [4, 7], [5.5, -1.5], [-3.5, 1]],
  // P3: Top Right
  [[4, 7], [12, 7], [12, 2.5], [5.5, -1.5]],
  // P4: Bottom Left
  [[-12, -0.5], [-3.5, 1], [-1, -7], [-12, -7]],
  // P5: Bottom Center
  [[-3.5, 1], [5.5, -1.5], [7, -7], [-1, -7]],
  // P6: Bottom Right
  [[5.5, -1.5], [12, 2.5], [12, -7], [7, -7]]
];

const extrudeSettings = {
  depth: 0.15,
  bevelEnabled: true,
  bevelSegments: 4,
  bevelSteps: 2,
  bevelSize: 0.03, // Le biseau crée les arêtes lumineuses d'espacement naturel
  bevelThickness: 0.03,
};

// Target transformations pour le layout "éclaté" 
const getExplodedTransform = (index: number) => {
  const transforms = [
    { x: -0.8, y: 0.6, z: 0.3, rx: -0.05, ry: 0.05 },  // P1
    { x: 0.2, y: 1.1, z: -0.1, rx: 0.05, ry: -0.03 }, // P2
    { x: 1.0, y: 0.5, z: 0.4, rx: 0.02, ry: -0.06 }, // P3
    { x: -0.9, y: -0.5, z: -0.2, rx: -0.04, ry: 0.04 }, // P4
    { x: 0.3, y: -0.8, z: 0.5, rx: 0.07, ry: 0.03 }, // P5
    { x: 1.2, y: -0.6, z: -0.4, rx: -0.03, ry: -0.07 }, // P6
  ];
  return transforms[index];
};

function GlassPiece({ points, index }: { points: number[][], index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      s.lineTo(points[i][0], points[i][1]);
    }
    s.lineTo(points[0][0], points[0][1]);
    return s;
  }, [points]);

  // Couche d'interaction : Hover indépendant de GSAP
  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    if (meshRef.current) {
      gsap.to(meshRef.current.scale, {
        x: 1.03, y: 1.03, z: 1.1,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto"
      });
    }
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    document.body.style.cursor = 'auto';
    if (meshRef.current) {
      gsap.to(meshRef.current.scale, {
        x: 1, y: 1, z: 1,
        duration: 1.2,
        ease: "power2.out",
        overwrite: "auto"
      });
    }
  };

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    // Mouvement organique subtil et permanent (respiration)
    meshRef.current.position.y += Math.sin(time * 0.4 + index) * 0.0006;
    meshRef.current.position.x += Math.cos(time * 0.3 + index) * 0.0004;
  });

  return (
    <mesh 
      ref={meshRef} 
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <extrudeGeometry args={[shape, extrudeSettings]} />
      {/* Paramètres optiques ultra réalistes pour reproduire la référence sombre */}
      <MeshTransmissionMaterial 
        transmission={0.98} 
        thickness={1.5} 
        roughness={0.08} 
        ior={1.45} 
        chromaticAberration={0.06} 
        backside={true} 
        color="#ffffff"
        clearcoat={1}
        clearcoatRoughness={0.1}
        attenuationDistance={3}
        attenuationColor="#ffffff"
      />
    </mesh>
  );
}

export default function GlassPieces() {
  const groupRef = useRef<THREE.Group>(null);

  useGSAP(() => {
    if (!groupRef.current) return;
    const meshes = groupRef.current.children as THREE.Mesh[];
    
    // État 0 : Pièces jointives, alignement parfait des arêtes
    meshes.forEach((mesh) => {
      gsap.set(mesh.position, { x: 0, y: 0, z: 0 });
      gsap.set(mesh.rotation, { x: 0, y: 0, z: 0 });
    });

    // Orchestration temporelle entre les layouts sans interaction
    const tl = gsap.timeline({ 
      repeat: -1, 
      yoyo: true, 
      defaults: { ease: "sine.inOut", duration: 10 } 
    });

    // Interpolation fluide vers l'état éclaté (profondeur Z, écartement)
    meshes.forEach((mesh, i) => {
      const transform = getExplodedTransform(i);
      tl.to(mesh.position, { 
        x: transform.x, 
        y: transform.y, 
        z: transform.z 
      }, 0);
      tl.to(mesh.rotation, { 
        x: transform.rx, 
        y: transform.ry, 
        z: 0 
      }, 0);
    });
  }, { scope: groupRef });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {piecesCoords.map((points, idx) => (
        <GlassPiece key={idx} points={points} index={idx} />
      ))}
    </group>
  );
}
