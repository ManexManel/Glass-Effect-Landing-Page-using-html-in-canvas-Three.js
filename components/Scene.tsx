"use client";

import { Environment, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";
import GlassPieces from "./GlassPieces";
import CameraRig from "./CameraRig";

export default function Scene() {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (lightRef.current) {
      const time = state.clock.getElapsedTime();
      // Lumière dynamique lente qui rase les arêtes du verre pour les illuminer
      lightRef.current.position.x = Math.sin(time * 0.15) * 12;
      lightRef.current.position.y = Math.cos(time * 0.1) * 8;
    }
  });

  return (
    <>
      <ambientLight intensity={0.15} color="#ffffff" />
      <directionalLight position={[0, 10, -5]} intensity={1} color="#ffffff" />
      
      {/* Lumière rasante dynamique pour le relief des arêtes */}
      <pointLight ref={lightRef} position={[0, 0, 4]} intensity={2.5} distance={25} color="#ffffff" />
      
      <Environment preset="city" />
      
      <CameraRig />
      
      <GlassPieces />
      
      {/* 
        Composition HTML Hero exacte de la vidéo 
        Située derrière le verre (z = -2)
      */}
      <Html transform position={[-1, 1, -2]} zIndexRange={[0, 0]}>
        <div className="flex flex-col items-start w-[800px] pointer-events-none select-none">
          <h2 className="text-[#888888] uppercase tracking-[0.25em] text-[10px] mb-8 font-medium">
            Real-time Material Studio
          </h2>
          <h1 className="text-[110px] font-black text-[#e5e5e5] leading-[0.95] tracking-[-0.04em]">
            Designed<br />in glass.
          </h1>
          <p className="text-[#777777] mt-8 text-lg max-w-[420px] leading-[1.6]">
            Author dispersion, transmission, and refraction in the browser. Live previews, real materials.
          </p>
          
          <div className="flex items-center gap-5 mt-10 pointer-events-auto">
            <button className="bg-[#eeeeee] text-[#111111] px-6 py-3 rounded text-sm font-semibold hover:bg-white transition-colors cursor-pointer">
              Open studio
            </button>
            <button className="text-[#cccccc] px-4 py-3 rounded text-sm font-medium hover:text-white transition-colors flex items-center gap-2 cursor-pointer">
              Read paper <span className="text-[10px]">↗</span>
            </button>
          </div>
        </div>
      </Html>
    </>
  );
}
