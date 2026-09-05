"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "@/components/Scene";

export default function Home() {
  return (
    <main className="relative h-screen w-full bg-[#030303] overflow-hidden">
      {/* 
        Le DOM HTML disparaît totalement au profit de WebGL.
        C'est obligatoire pour que MeshTransmissionMaterial puisse
        réfracter le texte (qui sera rendu via le composant Text de drei dans Scene).
      */}
      <div className="absolute inset-0">
        <Canvas 
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }} 
          camera={{ position: [0, 0, 10], fov: 45 }}
        >
          <color attach="background" args={['#030303']} />
          <React.Suspense fallback={null}>
            <Scene />
          </React.Suspense>
        </Canvas>
      </div>
    </main>
  );
}
