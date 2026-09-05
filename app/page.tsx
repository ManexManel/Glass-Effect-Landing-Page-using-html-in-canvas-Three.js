"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "@/components/Scene";
import { motion } from "framer-motion";

export default function Home() {
  return (
    // Single page full-screen hero layout
    <main className="relative h-screen w-full bg-[#030303] overflow-hidden text-white font-sans selection:bg-white selection:text-black">
      
      {/* Navbar "Prism" façon dark glass */}
      <header className="absolute top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[1400px] z-20 flex items-center justify-between px-6 py-4 rounded-2xl bg-black/40 backdrop-blur-md border border-[#222222] shadow-2xl">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <h1 className="text-[#eeeeee] font-semibold text-lg flex items-center gap-3 cursor-pointer">
            <div className="w-4 h-4 rounded-sm flex items-center justify-center border border-[#555]">
              <div className="w-1.5 h-1.5 bg-[#ccc] rounded-sm" />
            </div>
            Prism
          </h1>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-[#888888]">
              <span className="hover:text-white cursor-pointer transition-colors">Studio</span>
              <span className="hover:text-white cursor-pointer transition-colors">Materials</span>
              <span className="hover:text-white cursor-pointer transition-colors">Pricing</span>
          </nav>
        </div>

        <motion.button 
          whileHover={{ opacity: 1 }}
          className="text-[#888888] text-[13px] font-medium hover:text-white transition-opacity cursor-pointer"
        >
          Sign in
        </motion.button>
      </header>

      {/* Rendu 3D avec antialiasing forcé pour la netteté du verre */}
      <div className="absolute inset-0 z-0">
        <Canvas 
          gl={{ antialias: true, alpha: false }} 
          camera={{ position: [0, 0, 10], fov: 45 }}
          eventSource={typeof window !== "undefined" ? (document.body as HTMLElement) : undefined}
        >
          <color attach="background" args={['#030303']} />
          <Scene />
        </Canvas>
      </div>
    </main>
  );
}
