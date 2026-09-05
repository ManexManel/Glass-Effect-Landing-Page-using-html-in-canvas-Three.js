"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function CameraRig() {
  useFrame((state, delta) => {
    // Calcul de la position cible à l'opposé du curseur avec un décalage subtil (parallaxe élégant)
    const targetX = -state.pointer.x * 0.35;
    const targetY = -state.pointer.y * 0.25;

    // Interpolation (lerp) fluide de la position de la caméra
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, delta * 2.5);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, delta * 2.5);

    // Assure que la caméra fixe toujours le centre de la scène
    state.camera.lookAt(0, 0, 0);
  });

  return null; // Ce composant ne rend rien visuellement, il ne gère que la logique
}
