"use client";

import * as THREE from 'three';
import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import { MotionValue } from 'framer-motion';

// Définition des points pour 5 morceaux de verre irréguliers (style mosaïque)
const puzzleDef = [
  // Piece 1: Haut Gauche
  [[-7, 4], [-2.1, 4], [-1.1, 0.1], [-7, -0.5]],
  // Piece 2: Haut Droite
  [[-1.9, 4], [7, 4], [7, 1.1], [1.6, 0.5]],
  // Piece 3: Bas Gauche
  [[-7, -0.7], [-1.2, -0.1], [-0.2, -4], [-7, -4]],
  // Piece 4: Centre
  [[-0.9, 0], [1.4, 0.4], [0.5, -3.9], [0, -3.9]],
  // Piece 5: Bas Droite
  [[1.6, 0.3], [7, 0.9], [7, -4], [0.7, -4]]
];

const extrudeSettings = {
  depth: 0.15,
  bevelEnabled: true,
  bevelSegments: 16,
  bevelSteps: 4,
  bevelSize: 0.05,
  bevelThickness: 0.05,
};

function GlassPiece({ points, index, scrollYProgress }: { points: number[][], index: number, scrollYProgress: MotionValue<number> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      s.lineTo(points[i][0], points[i][1]);
    }
    s.lineTo(points[0][0], points[0][1]);
    return s;
  }, [points]);

  // Centre d'origine pour l'animation
  const initZ = 0;

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Animation au hover (effet loupe / décalage)
    const targetZ = hovered ? 0.3 : initZ;
    const targetScale = hovered ? 1.01 : 1;
    
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, delta * 5);
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, delta * 5));
    
    // Animation au scroll (les pièces s'écartent et tournent légèrement)
    const scrollVal = scrollYProgress.get();
    const multiplier = (index % 2 === 0 ? 1 : -1) * (index * 0.5 + 1);
    
    const scrollYOffset = scrollVal * multiplier * 3;
    const scrollXOffset = scrollVal * multiplier * 1.5;
    const scrollRotX = scrollVal * multiplier * 0.2;
    const scrollRotY = scrollVal * multiplier * 0.1;

    // Appliquer une légère flottaison par défaut + effet de scroll
    const floatY = Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.05;
    
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, scrollYOffset + floatY, delta * 2);
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, scrollXOffset, delta * 2);
    
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, scrollRotX, delta * 2);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, scrollRotY, delta * 2);
  });

  return (
    <mesh 
      ref={meshRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <extrudeGeometry args={[shape, extrudeSettings]} />
      {/* 
        MeshTransmissionMaterial gives the realistic glass refraction. 
        Adjusted settings for the dark environment.
      */}
      <MeshTransmissionMaterial 
        transmission={0.95} 
        thickness={0.5} 
        roughness={0.05} 
        ior={1.3} 
        chromaticAberration={0.03} 
        backside={true} 
        color="#ffffff"
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
}

export default function GlassPieces({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  return (
    // Centrer le groupe pour qu'il soit bien devant la caméra
    <group position={[0, 0, 0]}>
      {puzzleDef.map((points, idx) => (
        <GlassPiece key={idx} points={points} index={idx} scrollYProgress={scrollYProgress} />
      ))}
    </group>
  );
}
