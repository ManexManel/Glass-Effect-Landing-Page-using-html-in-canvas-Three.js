"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { motion, useScroll } from "framer-motion";
import Scene from "@/components/Scene";

export default function Home() {
  const { scrollYProgress } = useScroll();

  return (
    <main className="relative min-h-screen w-full bg-white overflow-x-hidden">
      {/* Header en position absolue (z-20 pour passer au-dessus du contenu) */}
      <header className="absolute top-0 left-0 w-full z-20 flex items-center justify-between p-6 sm:px-12 pt-8">
        <h1 className="text-[#0055FF] font-bold text-2xl tracking-tight">
          Manel - Automatisation & Conversion
        </h1>
        
        {/* Bouton Call-to-Action avec animations Framer Motion */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#0055FF] text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-blue-700 transition-colors"
        >
          Réserver un Audit
        </motion.button>
      </header>

      {/* Conteneur 3D en position fixed pour rester en fond (z-0) et pointer-events-none */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* eventSource={document.body} permet à r3f d'écouter la souris globalement, même avec pointer-events-none */}
        <Canvas eventSource={typeof window !== "undefined" ? (document.body as HTMLElement) : undefined}>
          <Scene scrollYProgress={scrollYProgress} />
        </Canvas>
      </div>

      {/* Contenu HTML défilant par-dessus */}
      <div className="relative z-10">
        {/* Section 1 : Espace vide pour laisser respirer la 3D en plein écran */}
        <section className="h-screen w-full"></section>

        {/* Section 2 : Nos Systèmes / Services */}
        <section className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-8 sm:p-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-16 tracking-tight">
            Systèmes d&apos;Acquisition
          </h2>
          
          {/* Grille de services */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
            {/* Carte 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="border border-gray-100 shadow-sm rounded-2xl h-72 bg-white flex flex-col items-start p-8 transition-shadow hover:shadow-md"
            >
              <h3 className="text-xl font-bold text-[#0055FF] mb-4">Audits de Friction</h3>
              <p className="text-gray-600 leading-relaxed">
                Analyse des points de blocage et optimisation de l&apos;infrastructure de conversion.
              </p>
            </motion.div>
            
            {/* Carte 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="border border-gray-100 shadow-sm rounded-2xl h-72 bg-white flex flex-col items-start p-8 transition-shadow hover:shadow-md"
            >
              <h3 className="text-xl font-bold text-[#0055FF] mb-4">Qualification Automatisée</h3>
              <p className="text-gray-600 leading-relaxed">
                Déploiement d&apos;agents conversationnels (Vapi, Voiceflow) pour le filtrage des prospects.
              </p>
            </motion.div>
            
            {/* Carte 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="border border-gray-100 shadow-sm rounded-2xl h-72 bg-white flex flex-col items-start p-8 transition-shadow hover:shadow-md"
            >
              <h3 className="text-xl font-bold text-[#0055FF] mb-4">Workflows & Intégrations</h3>
              <p className="text-gray-600 leading-relaxed">
                Synchronisation des flux de données B2B via n8n et Make.com.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Footer Minimaliste */}
        <footer className="w-full bg-gray-50 py-8 text-center text-gray-400 text-sm border-t border-gray-100">
          © 2026 Manel - Branding & Automatisation IA. Tous droits réservés.
        </footer>
      </div>
    </main>
  );
}
