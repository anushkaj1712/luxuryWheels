"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as React from "react";
import * as THREE from "three";

/**
 * Abstract metallic hero knot — lightweight 3D motif (replace with GLTF showroom model).
 * Canvas is pointer-events none so Lenis scroll is unaffected.
 */
function Knot() {
  const ref = React.useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.12;
  });
  return (
    <Float speed={1.6} rotationIntensity={0.35} floatIntensity={0.45}>
      <mesh ref={ref} scale={1.25}>
        <torusKnotGeometry args={[0.55, 0.2, 220, 28]} />
        <meshStandardMaterial color="#d4d4d8" metalness={1} roughness={0.18} />
      </mesh>
    </Float>
  );
}

export function HeroGraphic() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-50 md:opacity-[0.85]" aria-hidden>
      <Canvas camera={{ position: [0, 0, 4], fov: 42 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}>
        <ambientLight intensity={0.35} />
        <spotLight position={[5, 6, 6]} intensity={1.25} angle={0.35} penumbra={1} />
        <Knot />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
