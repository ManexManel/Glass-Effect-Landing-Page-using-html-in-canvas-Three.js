"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { motion, useScroll } from "framer-motion";
import Scene from "@/components/Scene";

export default function Home() {
  const { scrollYProgress } = useScroll();

  return (
    <main className="relative min-h-screen w-full bg-[#050505] overflow-x-hidden text-white font-sans selection:bg-white selection:text-black">
      {/* Header Dark Mode aligné sur la vidéo */}
      <header className="absolute top-0 left-0 w-full z-20 flex items-center justify-between p-6 sm:px-12 pt-8">
        <h1 className="text-white font-bold text-xl tracking-tight flex items-center gap-3">
          <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
            <div className="w-2 h-2 bg-black rounded-sm" />
          </div>
          Prism
        </h1>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <span className="hover:text-white cursor-pointer transition-colors">Studio</span>
            <span className="hover:text-white cursor-pointer transition-colors">Materials</span>
            <span className="hover:text-white cursor-pointer transition-colors">Pricing</span>
        </nav>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-white px-6 py-2 font-medium hover:text-gray-300 transition-colors"
        >
          Sign in
        </motion.button>
      </header>

      {/* Conteneur 3D en fond */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas eventSource={typeof window !== "undefined" ? (document.body as HTMLElement) : undefined}>
          <Scene scrollYProgress={scrollYProgress} />
        </Canvas>
      </div>

      {/* Contenu HTML défilant par-dessus */}
      <div className="relative z-10 pointer-events-none">
        {/* Section 1 : Espace vide */}
        <section className="h-[120vh] w-full"></section>

        {/* Section 2 : Suite du contenu (assorti au dark mode) pointer-events-auto pour que ça soit cliquable */}
        <section className="min-h-screen w-full bg-[#0a0a0a] flex flex-col items-center justify-center p-8 sm:p-20 pointer-events-auto border-t border-[#1a1a1a]">
          <h2 className="text-4xl font-bold text-white mb-16 tracking-tight">
            Features & Capabilities
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
            {[
              {
                title: "Real-time Refraction",
                desc: "Physically accurate materials powered by WebGL and Three.js."
              },
              {
                title: "Chromatic Aberration",
                desc: "Simulate color fringing at the edges of thick glass objects."
              },
              {
                title: "Surface Roughness",
                desc: "Frosted glass effects with precise depth and blur controls."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="border border-[#222] shadow-sm rounded-2xl h-72 bg-[#111] flex flex-col items-start p-8 transition-colors hover:border-[#444]"
              >
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full bg-[#050505] py-12 text-center text-gray-500 text-sm border-t border-[#1a1a1a] pointer-events-auto">
          © 2026 Prism. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
