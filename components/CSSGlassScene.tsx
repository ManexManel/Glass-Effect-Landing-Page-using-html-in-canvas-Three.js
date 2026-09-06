"use client";

import React, { useState } from "react";
import { useNav } from "./NavigationContext";

export default function CSSGlassScene() {
  const { page, setPage, setShowSignIn } = useNav();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
    setHoveredIndex(idx);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setMousePos({ x: 0, y: 0 });
  };

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
    <div className="relative w-full h-screen bg-[#030303] text-white overflow-hidden select-none font-sans">
      {/* ==================== HEADER EN VERRE DÉPOLI ==================== */}
      <header className="absolute top-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-5xl">
        <div className="flex items-center justify-between px-6 py-2.5 rounded-full border border-white/10 bg-[#121216]/80 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setPage('studio')}
              className="flex items-center gap-2 font-bold text-sm text-white hover:text-gray-200 transition-colors"
            >
              <span className="text-xs">■</span> Prism
            </button>
            <nav className="flex items-center gap-6 text-xs">
              <button 
                onClick={() => setPage('studio')}
                className={`transition-colors ${page === 'studio' ? 'text-white font-semibold' : 'text-gray-400 hover:text-white'}`}
              >
                Studio
              </button>
              <button 
                onClick={() => setPage('materials')}
                className={`transition-colors ${page === 'materials' ? 'text-white font-semibold' : 'text-gray-400 hover:text-white'}`}
              >
                Materials
              </button>
              <button 
                onClick={() => setPage('pricing')}
                className={`transition-colors ${page === 'pricing' ? 'text-white font-semibold' : 'text-gray-400 hover:text-white'}`}
              >
                Pricing
              </button>
            </nav>
          </div>
          <button 
            onClick={() => setShowSignIn(true)}
            className="text-xs text-gray-300 hover:text-white font-medium transition-colors"
          >
            Sign in
          </button>
        </div>
      </header>

      {/* ==================== PAGE 1 : STUDIO HERO ==================== */}
      <div 
        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
          page === 'studio' ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 -translate-x-32 pointer-events-none'
        }`}
      >
        <div className="relative w-full max-w-5xl h-[520px] px-8">
          {/* Contenu textuel derrière le verre */}
          <div className="absolute top-16 left-12 z-10 max-w-md">
            <span className="block text-[10px] tracking-[0.2em] font-mono text-gray-400 mb-3">
              REAL-TIME MATERIAL STUDIO
            </span>
            <h1 className="text-6xl font-bold tracking-tight text-white leading-[0.95] mb-5">
              Designed<br />in glass.
            </h1>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs mb-8">
              Author dispersion, transmission, and refraction in the browser. Live previews, real materials.
            </p>
            <div className="flex items-center gap-5">
              <button 
                onClick={() => setPage('materials')}
                className="px-5 py-2.5 bg-white text-black font-semibold text-xs rounded-full hover:bg-gray-200 transition-transform active:scale-95 shadow-lg"
              >
                Open studio
              </button>
              <button 
                onClick={() => setPage('materials')}
                className="text-xs text-gray-300 hover:text-white transition-colors"
              >
                Read paper →
              </button>
            </div>
          </div>

          {/* Mosaïque polygonale en 5 pièces de verre optique */}
          <div className="absolute inset-0 z-20 pointer-events-auto">
            {/* Pièce 0 (Gauche - Couvre le texte) */}
            <div 
              onMouseMove={(e) => handleMouseMove(e, 0)}
              onMouseLeave={handleMouseLeave}
              style={{
                clipPath: 'polygon(0% 0%, 25% 0%, 55% 65%, 35% 100%, 0% 100%)',
                transform: hoveredIndex === 0 
                  ? `perspective(800px) rotateX(${-mousePos.y * 6}deg) rotateY(${mousePos.x * 6}deg) translateZ(-6px)` 
                  : 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
              }}
              className="absolute inset-0 backdrop-blur-[2px] bg-white/[0.02] border border-white/[0.08] transition-transform duration-200 ease-out shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
            />

            {/* Pièce 1 (Triangle supérieur) */}
            <div 
              onMouseMove={(e) => handleMouseMove(e, 1)}
              onMouseLeave={handleMouseLeave}
              style={{
                clipPath: 'polygon(25.5% 0%, 58% 0%, 55% 64.5%)',
                transform: hoveredIndex === 1 
                  ? `perspective(800px) rotateX(${-mousePos.y * 8}deg) rotateY(${mousePos.x * 8}deg) translateZ(-8px)` 
                  : 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
              }}
              className="absolute inset-0 backdrop-blur-[3px] bg-white/[0.03] border border-white/[0.1] transition-transform duration-200 ease-out shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
            />

            {/* Pièce 2 (Trapèze haut centre) */}
            <div 
              onMouseMove={(e) => handleMouseMove(e, 2)}
              onMouseLeave={handleMouseLeave}
              style={{
                clipPath: 'polygon(58.5% 0%, 84% 0%, 75% 67%, 55.5% 65%)',
                transform: hoveredIndex === 2 
                  ? `perspective(800px) rotateX(${-mousePos.y * 7}deg) rotateY(${mousePos.x * 7}deg) translateZ(-6px)` 
                  : 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
              }}
              className="absolute inset-0 backdrop-blur-[3px] bg-white/[0.02] border border-white/[0.08] transition-transform duration-200 ease-out shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
            />

            {/* Pièce 3 (Quad bas centre) */}
            <div 
              onMouseMove={(e) => handleMouseMove(e, 3)}
              onMouseLeave={handleMouseLeave}
              style={{
                clipPath: 'polygon(55.5% 66%, 75% 67.5%, 86% 100%, 35.5% 100%)',
                transform: hoveredIndex === 3 
                  ? `perspective(800px) rotateX(${-mousePos.y * 7}deg) rotateY(${mousePos.x * 7}deg) translateZ(-6px)` 
                  : 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
              }}
              className="absolute inset-0 backdrop-blur-[3px] bg-white/[0.02] border border-white/[0.08] transition-transform duration-200 ease-out shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
            />

            {/* Pièce 4 (Droite) */}
            <div 
              onMouseMove={(e) => handleMouseMove(e, 4)}
              onMouseLeave={handleMouseLeave}
              style={{
                clipPath: 'polygon(84.5% 0%, 100% 0%, 100% 100%, 86.5% 100%, 75.5% 67%)',
                transform: hoveredIndex === 4 
                  ? `perspective(800px) rotateX(${-mousePos.y * 8}deg) rotateY(${mousePos.x * 8}deg) translateZ(-8px)` 
                  : 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
              }}
              className="absolute inset-0 backdrop-blur-[4px] bg-white/[0.03] border border-white/[0.1] transition-transform duration-200 ease-out shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
            />
          </div>

          {/* Footer métadonnées */}
          <div className="absolute bottom-2 left-12 right-12 flex justify-between text-[9px] text-gray-500 font-mono">
            <span>© Prism Lab</span>
            <span>KHR_materials_dispersion</span>
          </div>
        </div>
      </div>

      {/* ==================== PAGE 2 : MATERIALS (FRAME 38) ==================== */}
      <div 
        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
          page === 'materials' ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-32 pointer-events-none'
        }`}
      >
        <div className="relative w-full max-w-5xl h-[520px] px-8 flex items-center">
          {/* Bouton triangulaire en verre 3D "← Back" (Gauche) */}
          <div className="w-1/3 flex justify-center">
            <button 
              onClick={() => setPage('studio')}
              className="group relative px-8 py-5 rounded-2xl border border-white/20 bg-[#15151a]/80 backdrop-blur-xl shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
              style={{
                clipPath: 'polygon(0% 15%, 85% 35%, 100% 60%, 80% 85%, 0% 85%)',
                width: '180px',
                height: '75px',
              }}
            >
              <div className="flex items-center justify-center gap-3 text-sm font-bold text-white tracking-wide">
                <span>← Back</span>
                <span className="text-xs text-gray-400 group-hover:text-white transition-colors">▶</span>
              </div>
            </button>
          </div>

          {/* Contenu 5 termes techniques (Droite) */}
          <div className="w-2/3 pl-8">
            <h2 className="text-2xl font-bold tracking-tight text-white mb-6">
              Real-time glass, in five terms.
            </h2>
            <div className="space-y-4">
              {terms.map((item, idx) => (
                <div key={idx} className="text-xs leading-relaxed">
                  <span className="font-bold text-white mr-2">{item.term}</span>
                  <span className="text-gray-400">— {item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ==================== PAGE 3 : PRICING ==================== */}
      <div 
        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
          page === 'pricing' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-32 pointer-events-none'
        }`}
      >
        <div className="relative w-full max-w-md p-8 rounded-3xl border border-white/15 bg-[#121216]/85 backdrop-blur-2xl shadow-2xl text-center">
          <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">License</span>
          <h3 className="text-xl font-bold text-white mb-2">Studio License</h3>
          <div className="text-4xl font-extrabold text-white mb-4">$49 <span className="text-base font-normal text-gray-400">/ month</span></div>
          <p className="text-xs text-gray-400 leading-relaxed mb-6">
            Unlimited real-time optical shader exports for WebGL, Three.js, and React Three Fiber.
          </p>
          <button 
            onClick={() => { setPage('studio'); setShowSignIn(true); }}
            className="w-full py-3 bg-white text-black font-bold text-xs rounded-xl hover:bg-gray-200 transition-transform active:scale-95 shadow-xl"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
