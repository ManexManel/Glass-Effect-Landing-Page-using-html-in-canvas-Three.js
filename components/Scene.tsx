"use client";

import { Environment, Html } from "@react-three/drei";
import GlassShape from "./GlassShape";
import CameraRig from "./CameraRig";
import { MotionValue } from "framer-motion";

interface SceneProps {
  scrollYProgress: MotionValue<number>;
}

export default function Scene({ scrollYProgress }: SceneProps) {
  return (
    <>
      {/* Lumières pour créer des contrastes et des reflets nets sur le verre */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 2]} intensity={3} color="#ffffff" />
      
      <Environment preset="city" />
      <CameraRig />
      <GlassShape scrollYProgress={scrollYProgress} />
      
      <Html transform position={[0, 0, -3]} center>
        <div className="flex items-center justify-center">
          <h1 className="text-8xl font-black text-[#0055FF] text-center whitespace-nowrap">
            CONVERSION SYSTEMS
          </h1>
        </div>
      </Html>
    </>
  );
}
