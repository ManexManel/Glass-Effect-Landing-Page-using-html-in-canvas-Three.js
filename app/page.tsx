"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "@/components/Scene";
import { NavProvider, useNav } from "@/components/NavigationContext";

class WebGLErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn("WebGL context notification:", error.message);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full items-center justify-center p-8 text-center text-gray-400">
          <div className="max-w-md rounded-xl border border-white/10 bg-[#101014] p-6 text-sm">
            <h3 className="mb-2 font-semibold text-white">WebGL Initializing</h3>
            <p>Please ensure hardware acceleration is enabled in your browser settings to experience real-time 3D glass physics.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
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
  return (
    <NavProvider>
      <main className="relative h-screen w-full bg-[#030303] overflow-hidden select-none">
        <div className="absolute inset-0">
          <WebGLErrorBoundary>
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
          </WebGLErrorBoundary>
        </div>

        {/* Modal de connexion */}
        <SignInModal />
      </main>
    </NavProvider>
  );
}
