"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "@/components/Scene";
import { NavProvider, useNav } from "@/components/NavigationContext";

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

class WebGLErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: string }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: '' };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error: error?.message || 'WebGL context creation error' };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-[#030303] text-white p-6 text-center">
          <div className="max-w-md p-8 rounded-2xl border border-white/10 bg-[#121216]/90 shadow-2xl backdrop-blur-xl">
            <h2 className="text-xl font-bold mb-2 text-white">Prism 3D Studio</h2>
            <p className="text-sm text-gray-400 mb-4">
              L'accélération matérielle WebGL 3D est requise pour calculer les réfractions de verre optique en temps réel.
            </p>
            <p className="text-xs text-yellow-400/90 mb-6 font-mono bg-yellow-950/30 p-2.5 rounded border border-yellow-800/40">
              Veuillez ouvrir la page dans Google Chrome, Edge ou Brave avec l'accélération graphique activée.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-white text-black font-semibold text-sm rounded-lg hover:bg-gray-200 transition-all"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function CanvasContainer() {
  const [webglReady, setWebglReady] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebglReady(!!gl);
    } catch {
      setWebglReady(false);
    }
  }, []);

  if (webglReady === false) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#030303] text-white p-6 text-center">
        <div className="max-w-md p-8 rounded-2xl border border-white/10 bg-[#121216]/90 shadow-2xl backdrop-blur-xl">
          <h2 className="text-xl font-bold mb-2 text-white">Prism 3D Studio</h2>
          <p className="text-sm text-gray-400 mb-6">
            L'accélération matérielle WebGL est requise pour afficher le rendu de verre 3D temps réel.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-white text-black font-semibold text-sm rounded-lg hover:bg-gray-200 transition-all"
          >
            Recharger
          </button>
        </div>
      </div>
    );
  }

  if (webglReady === null) return null;

  return (
    <Canvas 
      gl={{ 
        antialias: true, 
        alpha: false, 
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
  );
}

export default function Home() {
  return (
    <NavProvider>
      <main className="relative h-screen w-full bg-[#030303] overflow-hidden select-none">
        <div className="absolute inset-0">
          <WebGLErrorBoundary>
            <CanvasContainer />
          </WebGLErrorBoundary>
        </div>

        {/* Modal de connexion */}
        <SignInModal />
      </main>
    </NavProvider>
  );
}
