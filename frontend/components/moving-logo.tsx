"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const { mouse } = state;

    if (meshRef.current) {
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        mouse.x * 2,
        0.05
      );

      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        mouse.y * 2,
        0.05
      );
    }
  });

  return (
    <mesh ref={meshRef} scale={2.5}>
      <sphereGeometry args={[1, 128, 128]} />
      <MeshDistortMaterial
        color="#4b2e83"
        metalness={0.8}
        roughness={0.2}
        distort={0.4}
        speed={2}
      />
    </mesh>
  );
}

export default function MovingLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`w-full ${compact ? "h-[260px]" : "h-[400px]"}`}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 2, 5]} intensity={1} />
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
          <AnimatedSphere />
        </Float>
      </Canvas>
    </div>
  );
}