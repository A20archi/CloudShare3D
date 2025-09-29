"use client";

import React, { useState, useEffect, useRef } from "react";
import { CldImage } from "next-cloudinary";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
};

type SocialFormat = keyof typeof socialFormats;

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>(
    "Instagram Square (1:1)"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) setIsTransforming(true);
  }, [selectedFormat, uploadedImage]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");

      const data = await response.json();
      setUploadedImage(data.publicId);
    } catch (error) {
      console.log(error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (!imageRef.current) return;

    fetch(imageRef.current.src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedFormat
          .replace(/\s+/g, "_")
          .toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-black text-white">
      {/* Animated 3D Background */}
      <div className="absolute inset-0 -z-10">
        <Canvas>
          <Stars
            radius={50}
            depth={80}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={2}
          />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.6} />
        </Canvas>
      </div>

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-black bg-opacity-50 backdrop-blur-lg border-b border-purple-600">
        <h1 className="text-2xl font-extrabold text-purple-400 tracking-wider">
          🚀 SocialForge
        </h1>
        <div className="flex gap-8 text-lg">
          <a href="/" className="hover:text-purple-300 transition">
            Home
          </a>
          <a href="/dashboard" className="hover:text-purple-300 transition">
            Dashboard
          </a>
        </div>
      </nav>

      {/* Main Section */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border border-purple-500 rounded-2xl shadow-2xl p-10 backdrop-blur-lg"
        >
          <h2 className="text-4xl font-bold text-center text-purple-300 mb-10">
            Transform & Download Social Media Posts ✨
          </h2>

          {/* Upload */}
          <div className="mb-6">
            <label className="block text-lg mb-3 font-medium">
              Upload an image
            </label>
            <input
              type="file"
              onChange={handleFileUpload}
              className="block w-full px-4 py-3 text-sm text-gray-200 border border-purple-400 rounded-lg cursor-pointer bg-black/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {isUploading && (
            <div className="text-center my-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full mx-auto"
              />
              <p className="mt-2 text-purple-300">Uploading...</p>
            </div>
          )}

          {/* Format + Preview */}
          {uploadedImage && (
            <>
              <div className="mt-8">
                <label className="block text-lg mb-3 font-medium">
                  Choose Social Media Format
                </label>
                <select
                  className="block w-full px-4 py-3 rounded-lg bg-black/70 border border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={selectedFormat}
                  onChange={(e) =>
                    setSelectedFormat(e.target.value as SocialFormat)
                  }
                >
                  {Object.keys(socialFormats).map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preview */}
              <div className="mt-10 relative flex justify-center items-center">
                {isTransforming && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg z-10">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                      className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full"
                    />
                  </div>
                )}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="rounded-xl overflow-hidden shadow-lg border border-purple-600"
                >
                  <CldImage
                    width={socialFormats[selectedFormat].width}
                    height={socialFormats[selectedFormat].height}
                    src={uploadedImage}
                    sizes="100vw"
                    alt="transformed image"
                    crop="fill"
                    aspectRatio={socialFormats[selectedFormat].aspectRatio}
                    gravity="auto"
                    ref={imageRef}
                    onLoad={() => setIsTransforming(false)}
                  />
                </motion.div>
              </div>

              {/* Download */}
              <div className="flex justify-center mt-10">
                <motion.button
                  whileHover={{ scale: 1.1, boxShadow: "0 0 25px #a855f7" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownload}
                  className="px-8 py-3 bg-purple-600 rounded-xl font-semibold tracking-wide shadow-lg hover:bg-purple-500 transition"
                >
                  ⬇️ Download {selectedFormat}
                </motion.button>
              </div>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}
