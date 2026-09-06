"use client";

import React, { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useNav } from './NavigationContext';

const buttonExtrudeSettings = {
  depth: 0.08,
  bevelEnabled: true,
  bevelSegments: 6,
  bevelSteps: 2,
  bevelSize: 0.015,
  bevelThickness: 0.02,
};

export default function MaterialsPage() {
  const { page, setPage } = useNav();
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const buttonRef = useRef<THREE.Mesh>(null);
  const [hoveredButton, setHoveredButton] = useState(false);

  const w = viewport.width;
  const h = viewport.height;

  const toX = (px: number) => (px / 860 - 0.5) * w;
  const toY = (py: number) => -(py / 418 - 0.5) * h;
  const toW = (px: number) => (px / 860) * w;
  const toH = (py: number) => (py / 418) * h;

  // Forme triangulaire arrondie du bouton de retour en verre (Frame 38)
  const buttonShape = useMemo(() => {
    const s = new THREE.Shape();
    const bx = toW(65);
    const by = toH(22);
    s.moveTo(-bx, -by * 0.6);
    s.lineTo(bx, -by * 0.2);
    s.lineTo(-bx * 0.7, by);
    s.closePath();
    return s;
  }, [w, h]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const isActive = page === 'materials';
    // Glissement fluide en X et Z lors de la transition (bien en dehors de l'écran si inactif)
    const targetX = isActive ? 0 : w * 1.8;
    const targetZ = isActive ? 0 : -5;

    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetX, 5, delta);
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, targetZ, 5, delta);

    // Animation du bouton de retour
    if (buttonRef.current) {
      const targetScale = hoveredButton ? 1.08 : 1.0;
      const targetRotZ = hoveredButton ? 0.04 : 0;
      const time = state.clock.getElapsedTime();
      const breath = Math.sin(time * 1.5) * 0.02;

      buttonRef.current.scale.setScalar(THREE.MathUtils.damp(buttonRef.current.scale.x, targetScale, 6, delta));
      buttonRef.current.rotation.z = THREE.MathUtils.damp(buttonRef.current.rotation.z, targetRotZ + breath, 4, delta);
    }
  });

  const terms = [
    {
      term: "Iridescence",
      desc: "thin-film interference between two close surfaces splits reflected light by wavelength. Angle and film thickness determine the visible hue."
    },
    {
      term: "Index of refraction",
      desc: "how strongly light bends crossing a boundary. Vacuum 1.0, water 1.33, glass ~1.5, diamond 2.42."
    },
    {
      term: "Dispersion",
      desc: "the IOR of a material varies with wavelength, so red, green, and blue refract at slightly different angles. The chromatic fringe at glass edges is the visible signature."
    },
    {
      term: "Transmission",
      desc: "fraction of light that passes through. Three.js renders the scene to a backdrop buffer, samples it with an IOR-weighted offset, and accumulates absorption along the volume."
    },
    {
      term: "Roughness",
      desc: "surface micro-bumpiness. 0 mirror polish to 1 matte. Higher values blur reflections AND the transmission sample, frosting what would otherwise be sharp see-through."
    }
  ];

  return (
    <group ref={groupRef} position={[w * 1.8, 0, -5]}>
      {/* Bouton de retour triangulaire en verre physique (gauche) */}
      <group 
        position={[toX(170), toY(120), 0.2]}
        onClick={(e) => {
          e.stopPropagation();
          setPage('studio');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
          setHoveredButton(true);
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
          setHoveredButton(false);
        }}
      >
        {/* Surface de clic invisible pour garantir une interaction 100% réactive */}
        <mesh position={[0, 0, 0.15]}>
          <planeGeometry args={[toW(140), toH(60)]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        <mesh ref={buttonRef}>
          <extrudeGeometry args={[buttonShape, buttonExtrudeSettings]} />
          <MeshTransmissionMaterial
            transmission={0.92}
            thickness={0.5}
            roughness={0.15}
            ior={1.25}
            chromaticAberration={0.03}
            backside={true}
            color="#18181c"
            attenuationColor="#0a0a0d"
            attenuationDistance={2}
            clearcoat={1}
            clearcoatRoughness={0.08}
            resolution={256}
            samples={2}
          />
          {/* Texte centré sur le bouton */}
          <Text
            position={[-toW(10), 0, 0.1]}
            fontSize={toW(11)}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            ← Back
          </Text>
          <Text
            position={[toW(28), 0, 0.1]}
            fontSize={toW(8)}
            color="#9999a4"
            anchorX="center"
            anchorY="middle"
          >
            ▶
          </Text>
        </mesh>
      </group>

      {/* Contenu textuel sur 5 termes (droite) */}
      <group position={[toX(260), toY(135), 0]}>
        {/* Titre de section */}
        <Text
          position={[0, 0, 0]}
          fontSize={toW(16)}
          color="#f5f5f7"
          anchorX="left"
          anchorY="top"
          fontWeight="bold"
          letterSpacing={-0.02}
        >
          Real-time glass, in five terms.
        </Text>

        {/* Liste des 5 termes */}
        {terms.map((item, idx) => {
          const yOffset = -toH(32 + idx * 46);
          return (
            <group key={idx} position={[0, yOffset, 0]}>
              <Text
                position={[0, 0, 0]}
                fontSize={toW(10)}
                color="#ffffff"
                anchorX="left"
                anchorY="top"
                fontWeight="bold"
              >
                {item.term}
              </Text>
              <Text
                position={[toW(item.term.length * 5.8 + 12), 0, 0]}
                fontSize={toW(9.5)}
                color="#888892"
                anchorX="left"
                anchorY="top"
                maxWidth={toW(460)}
                lineHeight={1.38}
              >
                {"— " + item.desc}
              </Text>
            </group>
          );
        })}
      </group>
    </group>
  );
}
