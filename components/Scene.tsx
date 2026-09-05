"use client";

import { Environment, Html } from "@react-three/drei";
import GlassPieces from "./GlassPieces";
import CameraRig from "./CameraRig";
import { MotionValue } from "framer-motion";

interface SceneProps {
  scrollYProgress: MotionValue<number>;
}

export default function Scene({ scrollYProgress }: SceneProps) {
  return (
    <>
      {/* Lumières adaptées pour un fond sombre. Une lumière bleutée pour l'ambiance. */}
      <ambientLight intensity={0.4} color="#ffffff" />
      <directionalLight position={[10, 10, 5]} intensity={2.5} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={1} color="#4477ff" />
      
      {/* City donne de beaux reflets de gratte-ciels invisibles sur le verre */}
      <Environment preset="city" />
      
      <CameraRig />
      
      {/* Le nouveau puzzle de verre */}
      <GlassPieces scrollYProgress={scrollYProgress} />
      
      <Html transform position={[0, 0, -3]} center>
        <div className="flex flex-col items-start w-[800px] pointer-events-none">
          <h2 className="text-gray-400 uppercase tracking-[0.2em] text-xs mb-6 font-medium">
            Real-time Material Studio
          </h2>
          <h1 className="text-7xl md:text-8xl font-black text-[#f3f4f6] leading-[1.05] tracking-tighter">
            Designed<br />in glass.
          </h1>
          <p className="text-gray-400 mt-8 text-lg max-w-md leading-relaxed">
            Author dispersion, transmission, and refraction in the browser. Live previews, real materials.
          </p>
          
          <div className="flex items-center gap-4 mt-10 pointer-events-auto">
            <button className="bg-white text-black px-6 py-2 rounded-md font-medium text-sm hover:bg-gray-200 transition-colors">
              Open studio
            </button>
            <button className="text-white border border-gray-600 px-6 py-2 rounded-md font-medium text-sm hover:bg-white hover:text-black transition-colors">
              Read paper ↗
            </button>
          </div>
        </div>
      </Html>
    </>
  );
}
