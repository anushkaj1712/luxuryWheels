"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import * as React from "react";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

function Knot() {
  const ref = React.useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.1;
  });
  return (
    <mesh ref={ref} scale={1.15}>
      <torusKnotGeometry args={[0.55, 0.18, 96, 16]} />
      <meshStandardMaterial color="#d4d4d8" metalness={0.95} roughness={0.22} />
    </mesh>
  );
}

export function HeroGraphic() {
  const mobile = useIsMobile();
  const reduced = useReducedMotion();

  if (reduced) return null;

  return (
    <div className="pointer-events-none absolute inset-0 opacity-40 md:opacity-75" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 42 }}
        dpr={mobile ? [1, 1] : [1, 1.25]}
        gl={{ alpha: true, antialias: !mobile, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.45} />
        <directionalLight position={[4, 6, 5]} intensity={1.1} />
        <pointLight position={[-3, -2, 2]} intensity={0.35} color="#a1a1aa" />
        <Knot />
      </Canvas>
    </div>
  );
}
