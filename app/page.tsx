"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "@/components/Scene";
import { NavProvider, useNav } from "@/components/NavigationContext";

function checkWebGL(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

function SignInModal() {
  const { showSignIn, setShowSignIn } = useNav();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowSignIn(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setShowSignIn]);

  if (!showSignIn) return null;

  return (
    <div 
      onClick={() => setShowSignIn(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#121216]/90 p-8 shadow-2xl backdrop-blur-xl"
      >
        <button 
          type="button"
          onClick={() => setShowSignIn(false)}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-white text-base focus:outline-none"
          aria-label="Close"
        >
          ✕
        </button>
        <h2 className="mb-2 text-xl font-bold text-white">Sign in to Prism</h2>
        <p className="mb-6 text-sm text-gray-400">Access your saved materials, shaders, and prototypes.</p>
        
        <form onSubmit={(e) => { e.preventDefault(); setShowSignIn(false); }} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300">Email address</label>
            <input 
              type="email" 
              required 
              placeholder="designer@studio.com"
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
            />
          </div>
          <button 
            type="submit" 
            className="w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-black transition-all hover:bg-gray-200"
          >
            Continue with Email
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Home() {
  const [hasWebGL, setHasWebGL] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    setHasWebGL(checkWebGL());
  }, []);

  return (
    <NavProvider>
      <main className="relative h-screen w-full bg-[#030303] overflow-hidden select-none">
        <div className="absolute inset-0">
          {hasWebGL === true && (
            <Canvas 
              gl={{ 
                antialias: true, 
                powerPreference: "default",
                failIfMajorPerformanceCaveat: false 
              }} 
              camera={{ position: [0, 0, 10], fov: 45 }}
            >
              <color attach="background" args={['#030303']} />
              <React.Suspense fallback={null}>
                <Scene />
              </React.Suspense>
            </Canvas>
          )}

          {hasWebGL === false && (
            <div className="flex h-full w-full items-center justify-center p-8 text-center text-gray-400">
              <div className="max-w-md rounded-2xl border border-white/10 bg-[#121216]/90 p-8 shadow-2xl backdrop-blur-xl">
                <div className="mb-4 text-3xl">💎</div>
                <h3 className="mb-2 text-lg font-bold text-white">Prism Real-Time 3D Studio</h3>
                <p className="text-sm text-gray-400">
                  Hardware acceleration or WebGL is currently unavailable in this browser session. 
                  Please open in Chrome, Edge, or Firefox with hardware acceleration enabled to experience the real-time optical glass engine.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal de connexion */}
        <SignInModal />
      </main>
    </NavProvider>
  );
}
