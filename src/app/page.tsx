"use client";
import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { motion } from "framer-motion";
import Link from "next/link";
import * as THREE from "three";


// ----------------------- Animated Background -----------------------
function MovingParticles({ count = 200 }) {
  const groupRef = useRef<THREE.Group>(null);
  const particles = React.useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        x: (Math.random() - 0.5) * 40,
        y: (Math.random() - 0.5) * 20,
        z: (Math.random() - 0.5) * 40,
        speed: 0.001 + Math.random() * 0.002,
      })),
    [count]
  );

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      child.position.y += particles[i].speed * 50;
      if (child.position.y > 10) child.position.y = -10;
      child.rotation.y += 0.01;
    });
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial
            color={`hsl(${Math.random() * 360}, 100%, 70%)`}
          />
        </mesh>
      ))}
    </group>
  );
}

function FloatingNeonShapes({ count = 10 }) {
  const groupRef = useRef<THREE.Group>(null);
  const shapes = React.useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 10,
        z: (Math.random() - 0.5) * 20,
        speed: 0.001 + Math.random() * 0.003,
        rotationSpeed: Math.random() * 0.01,
        size: 0.5 + Math.random() * 0.5,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      })),
    [count]
  );

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      child.position.y += shapes[i].speed * 50;
      if (child.position.y > 5) child.position.y = -5;
      child.rotation.x += shapes[i].rotationSpeed;
      child.rotation.y += shapes[i].rotationSpeed;
    });
  });

  return (
    <group ref={groupRef}>
      {shapes.map((s, i) => (
        <mesh key={i} position={[s.x, s.y, s.z]}>
          <torusGeometry args={[s.size, 0.1, 16, 100]} />
          <meshStandardMaterial
            color={s.color}
            emissive={s.color}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

// ----------------------- Dummy Carousel -----------------------
const DummyCarousel = () => {
  const items = [
    "Futuristic UI",
    "3D Previews",
    "Custom Downloads",
    "Interactive Hero",
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5 }}
      className="mt-16 w-full max-w-4xl overflow-hidden rounded-2xl"
    >
      <div className="flex animate-slide whitespace-nowrap gap-8">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-tr from-pink-600 to-purple-600 px-8 py-6 rounded-2xl min-w-[220px] text-center font-bold shadow-xl hover:scale-105 transition-transform"
          >
            {item}
          </div>
        ))}
      </div>
      <style jsx>{`
        .animate-slide {
          animation: slide 15s linear infinite;
        }
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </motion.div>
  );
};

// ----------------------- Landing Page -----------------------
export default function LandingPage() {
  return (
    <div className="w-full h-screen relative overflow-hidden bg-black text-white">
      {/* 3D Canvas Background */}
      <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Suspense fallback={null}>
          <Stars
            radius={50}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
          />
          <MovingParticles />
          <FloatingNeonShapes />
        </Suspense>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.1} />
      </Canvas>

      {/* Overlay UI */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-3xl"
        >
          <h1 className="text-6xl md:text-7xl font-extrabold mb-4">
            <span className="text-pink-500">CloudShare</span> 3D
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Upload, preview, and download your images in epic 3D style.
            Customize formats and see your content come alive.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Link href="/social-share">
              <motion.button
                whileHover={{ scale: 1.1, boxShadow: "0 0 30px #ff00ff" }}
                className="bg-pink-500 px-8 py-4 rounded-full font-bold text-white text-lg"
              >
                Try it Now
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px #00ffff" }}
              className="border border-cyan-400 px-8 py-4 rounded-full font-bold text-cyan-400 text-lg"
              onClick={() => alert("Coming Soon!")}
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl text-center z-20"
        >
          {[
            {
              title: "Upload & Share",
              desc: "Easily upload images and share them anywhere with Cloudinary backend.",
              color: "from-indigo-700 to-purple-700",
            },
            {
              title: "3D Preview",
              desc: "Watch your images come alive with interactive 3D previews powered by React Three Fiber.",
              color: "from-pink-700 to-purple-700",
            },
            {
              title: "Custom Downloads",
              desc: "Download images with custom filenames and formats tailored for any social media.",
              color: "from-cyan-700 to-indigo-700",
            },
          ].map((feat, idx) => (
            <motion.div
              key={idx}
              whileHover={{
                scale: 1.1,
                rotateY: 5,
                boxShadow: "0 0 20px #fff",
              }}
              className={`p-6 bg-gradient-to-tr ${feat.color} rounded-3xl shadow-2xl transition-transform cursor-pointer`}
            >
              <h3 className="text-2xl font-bold mb-2">{feat.title}</h3>
              <p className="text-gray-200">{feat.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Dummy Carousel */}
        <DummyCarousel />
      </div>
    </div>
  );
}
