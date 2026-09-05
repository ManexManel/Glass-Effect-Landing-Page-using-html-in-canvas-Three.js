"use client";

import * as THREE from 'three';
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';

// Géométrie vectorielle des plaques de verre recréée d'après l'analyse visuelle.
// Ces points forment un plan continu qui se fragmente.
const piecesCoords = [
  // P1: Plaque haut-gauche
  [[-12, 7], [-4, 7], [-3, 1], [-12, -0.5]],
  // P2: Grande plaque trapézoïdale couvrant le texte
  [[-4, 7], [3, 7], [1.5, -2], [-3, 1]],
  // P3: Plaque droite
  [[3, 7], [12, 7], [12, 1.5], [1.5, -2]],
  // P4: Plaque bas-gauche
  [[-12, -0.5], [-3, 1], [-1.5, -7], [-12, -7]],
  // P5: Plaque bas-centre
  [[-3, 1], [1.5, -2], [4, -7], [-1.5, -7]],
  // P6: Plaque bas-droite
  [[1.5, -2], [12, 1.5], [12, -7], [4, -7]]
];

const extrudeSettings = {
  depth: 0.2, // Épaisseur du maillage (pour la lumière rase)
  bevelEnabled: true,
  bevelSegments: 5,
  bevelSteps: 2,
  bevelSize: 0.04, // Rayon du chanfrein
  bevelThickness: 0.04,
};

// Calcule le barycentre d'une plaque pour la physique de collision/répulsion
function getCenter(points: number[][]) {
  let cx = 0, cy = 0;
  points.forEach(p => { cx += p[0]; cy += p[1]; });
  return { x: cx / points.length, y: cy / points.length };
}

function GlassPiece({ points, index }: { points: number[][], index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const center = useMemo(() => getCenter(points), [points]);
  
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      s.lineTo(points[i][0], points[i][1]);
    }
    s.lineTo(points[0][0], points[0][1]);
    return s;
  }, [points]);

  // Interpolation de la position et de la rotation via `damp`
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Position du curseur projetée sur le plan z=0 (approximatif, viewport basé sur fov=45, z=10)
    // viewPort.width / height correspond aux unités 3D à z=0
    const mouseX = (state.pointer.x * state.viewport.width) / 2;
    const mouseY = (state.pointer.y * state.viewport.height) / 2;
    
    const dx = mouseX - center.x;
    const dy = mouseY - center.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Modèle de répulsion physique : le curseur repousse les plaques.
    const maxRadius = 8;
    let force = 0;
    if (dist < maxRadius) {
      // Force non-linéaire : l'effet est plus fort au centre
      force = Math.pow((maxRadius - dist) / maxRadius, 2);
    }
    
    // La plaque s'avance en Z lorsqu'elle est touchée par la force
    const targetZ = force * 1.5; 
    
    // La plaque pivote pour "fuir" le pointeur (pitch/yaw inversé)
    const targetRotX = (dy / maxRadius) * force * 0.15;
    const targetRotY = -(dx / maxRadius) * force * 0.15;
    
    // Mouvement d'expansion de la grille : la force écarte les plaques de leur centre
    const targetX = dx * force * -0.15;
    const targetY = dy * force * -0.15;

    // Respiration permanente indépendante de la souris
    const time = state.clock.getElapsedTime();
    const breathX = Math.sin(time * 0.3 + index) * 0.05;
    const breathY = Math.cos(time * 0.2 + index) * 0.05;
    const breathRot = Math.sin(time * 0.4 + index) * 0.01;

    // Application fluide de la physique (damping exponentiel frame-indépendant)
    meshRef.current.position.z = THREE.MathUtils.damp(meshRef.current.position.z, targetZ, 3, delta);
    meshRef.current.position.x = THREE.MathUtils.damp(meshRef.current.position.x, targetX + breathX, 3, delta);
    meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, targetY + breathY, 3, delta);
    
    meshRef.current.rotation.x = THREE.MathUtils.damp(meshRef.current.rotation.x, targetRotX + breathRot, 4, delta);
    meshRef.current.rotation.y = THREE.MathUtils.damp(meshRef.current.rotation.y, targetRotY + breathRot, 4, delta);
  });

  return (
    <mesh ref={meshRef}>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      {/* 
        Le verre qui réfracte tout.
        C'est le composant principal responsable du "wow effect". 
      */}
      <MeshTransmissionMaterial 
        transmission={0.99} // Transmission de la lumière presque totale
        thickness={2.0} // Profondeur optique pour la distorsion
        roughness={0.06} // Légèrement givré pour diffuser les arêtes
        ior={1.52} // Indice de Réfraction du vrai verre (Crown Glass)
        chromaticAberration={0.08} // Séparation des couleurs sur les bords
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
  return (
    <group position={[0, 0, 0]}>
      {piecesCoords.map((points, idx) => (
        <GlassPiece key={idx} points={points} index={idx} />
      ))}
    </group>
  );
}
