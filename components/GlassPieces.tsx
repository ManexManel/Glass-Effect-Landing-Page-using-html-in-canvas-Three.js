"use client";

import * as THREE from 'three';
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';

import { useNav } from './NavigationContext';

const extrudeSettings = {
  depth: 0.12,
  bevelEnabled: true,
  bevelSegments: 8,
  bevelSteps: 2,
  bevelSize: 0.018,
  bevelThickness: 0.024,
};

function getCenter(points: number[][]) {
  let cx = 0, cy = 0;
  points.forEach(p => { cx += p[0]; cy += p[1]; });
  return { x: cx / points.length, y: cy / points.length };
}

function GlassPiece({ 
  points, 
  index, 
  simulatedHit,
  page
}: { 
  points: number[][], 
  index: number, 
  simulatedHit: THREE.Vector3 | null,
  page: string
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const center = useMemo(() => getCenter(points), [points]);
  const [localHitPoint, setLocalHitPoint] = useState<THREE.Vector3 | null>(null);
  const { viewport } = useThree();

  const activeHit = simulatedHit || localHitPoint;

  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      s.lineTo(points[i][0], points[i][1]);
    }
    s.lineTo(points[0][0], points[0][1]);
    return s;
  }, [points]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    let targetZ = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let targetRotZ = 0;
    let targetX = 0;
    let targetY = 0;

    const isStudio = page === 'studio';

    if (!isStudio) {
      // Dispersion spatiale spectaculaire lors de la transition vers les autres pages
      const disperseDirs = [
        { x: -viewport.width * 1.2, y: -0.2, z: -5, rz: -0.25 },
        { x: -viewport.width * 0.4, y: viewport.height * 1.2, z: -5, rz: 0.3 },
        { x: viewport.width * 0.4, y: viewport.height * 1.2, z: -5, rz: -0.3 },
        { x: 0, y: -viewport.height * 1.3, z: -5, rz: 0.15 },
        { x: viewport.width * 1.2, y: 0.2, z: -5, rz: 0.25 },
      ];
      const dir = disperseDirs[index % disperseDirs.length];
      targetX = dir.x;
      targetY = dir.y;
      targetZ = dir.z;
      targetRotZ = dir.rz;
    } else if (activeHit) {
      // Bras de levier par rapport au centre de gravité de la pièce
      const leverX = activeHit.x - center.x;
      const leverY = activeHit.y - center.y;
      
      // Système de coordonnées Three.js réel vérifié :
      // - Pointer en haut (leverY > 0) -> rotX négatif pour enfoncer le bord supérieur
      // - Pointer à droite (leverX > 0) -> rotY positif pour enfoncer le bord droit
      targetRotX = -leverY * 0.18;
      targetRotY = leverX * 0.18;
      
      // Enfoncement léger sous le doigt
      targetZ = -0.04;
      targetX = -leverX * 0.01;
      targetY = -leverY * 0.01;
    }

    const time = state.clock.getElapsedTime();
    // Respiration organique subtile au repos
    const breathRot = (!activeHit && isStudio) ? Math.sin(time * 0.6 + index * 1.2) * 0.003 : 0;
    const breathZ = (!activeHit && isStudio) ? Math.cos(time * 0.5 + index * 1.5) * 0.005 : 0;

    const dampSpeed = isStudio ? (activeHit ? 6 : 3.5) : 4.5;

    meshRef.current.position.z = THREE.MathUtils.damp(meshRef.current.position.z, targetZ + breathZ, dampSpeed, delta);
    meshRef.current.position.x = THREE.MathUtils.damp(meshRef.current.position.x, targetX, dampSpeed, delta);
    meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, targetY, dampSpeed, delta);
    
    meshRef.current.rotation.x = THREE.MathUtils.damp(meshRef.current.rotation.x, targetRotX + breathRot, dampSpeed, delta);
    meshRef.current.rotation.y = THREE.MathUtils.damp(meshRef.current.rotation.y, targetRotY + breathRot, dampSpeed, delta);
    meshRef.current.rotation.z = THREE.MathUtils.damp(meshRef.current.rotation.z, targetRotZ, dampSpeed, delta);
  });

  return (
    <mesh 
      ref={meshRef}
      onPointerMove={(e) => {
        e.stopPropagation();
        setLocalHitPoint(e.point);
      }}
      onPointerOut={() => {
        setLocalHitPoint(null);
      }}
    >
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <MeshTransmissionMaterial 
        transmission={1.0}
        thickness={1.2}
        roughness={0.05}
        ior={1.2}
        chromaticAberration={0.03}
        backside={true} 
        color="#ffffff"
        clearcoat={1}
        clearcoatRoughness={0.05}
        attenuationDistance={10}
        resolution={512}
        samples={4}
      />
    </mesh>
  );
}

export default function GlassPieces() {
  const { viewport } = useThree();
  const { page } = useNav();
  const [testFrame, setTestFrame] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setTestFrame(params.get('testFrame'));
    }
  }, []);

  const w = viewport.width;
  const h = viewport.height;
  
  const toX = (p: number) => (p / 100 - 0.5) * w;
  const toY = (p: number) => -(p / 100 - 0.5) * h;
  
  // Coordonnées mesurées rigoureusement sur le viewport 860x418
  const X_L = toX(3.72);   // 32px
  const X_R = toX(87.09);  // 749px
  const Y_T = toY(20.57);  // 86px
  const Y_B = toY(97.37);  // 407px
  
  const T1 = toX(12.91);   // 111px
  const T2 = toX(44.19);   // 380px
  const T3 = toX(68.60);   // 590px
  
  const V1 = [toX(42.79), toY(59.57)]; // (368px, 249px)
  const V2 = [toX(61.05), toY(61.24)]; // (525px, 256px)
  
  const B1 = toX(29.07);   // 250px
  const B2 = toX(70.35);   // 605px

  const piecesCoords = useMemo(() => [
    [[X_L, Y_T], [T1, Y_T], V1, [B1, Y_B], [X_L, Y_B]],             // Pièce 0 (Gauche)
    [[T1, Y_T], [T2, Y_T], V1],                                     // Pièce 1 (Triangle supérieur)
    [[T2, Y_T], [T3, Y_T], V2, V1],                                 // Pièce 2 (Trapèze haut centre)
    [V1, V2, [B2, Y_B], [B1, Y_B]],                                 // Pièce 3 (Quad bas centre)
    [[T3, Y_T], [X_R, Y_T], [X_R, Y_B], [B2, Y_B], V2]             // Pièce 4 (Droite)
  ], [X_L, X_R, Y_T, Y_B, T1, T2, T3, V1, V2, B1, B2]);

  // Point d'impact simulé selon la frame de test
  const simulatedHits = useMemo(() => {
    if (!testFrame) return [null, null, null, null, null];
    
    // Frame 01 à 25 : curseur en (320px, 173px) -> sur la Pièce 1 (triangle)
    if (['1', '01', '5', '05', '10', '15', '20'].includes(testFrame)) {
      const hitX = (320 / 860 - 0.5) * w;
      const hitY = -(173 / 418 - 0.5) * h;
      return [
        null,
        new THREE.Vector3(hitX, hitY, 0),
        null,
        null,
        null
      ];
    }
    
    // Frame 50 : curseur en (680px, 295px) -> sur la Pièce 4 (droite)
    if (testFrame === '50') {
      const hitX = (680 / 860 - 0.5) * w;
      const hitY = -(295 / 418 - 0.5) * h;
      return [
        null,
        null,
        null,
        null,
        new THREE.Vector3(hitX, hitY, 0)
      ];
    }

    return [null, null, null, null, null];
  }, [testFrame, w, h]);

  return (
    <group position={[0, 0, 0]}>
      {piecesCoords.map((points, idx) => (
        <GlassPiece 
          key={idx} 
          points={points} 
          index={idx} 
          simulatedHit={simulatedHits[idx]} 
          page={page}
        />
      ))}
    </group>
  );
}
