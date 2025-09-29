"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { motion } from "framer-motion";

function TorusRing() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[8, 0.3, 16, 100]} />
      <meshStandardMaterial
        color="#a855f7"
        emissive="#9333ea"
        emissiveIntensity={0.6}
      />
    </mesh>
  );
}

export default function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const router = useRouter();
  const MAX_FILE_SIZE = 670 * 1024 * 1024; // 670MB

  // Preview & get duration
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (!selectedFile) return;

    const url = URL.createObjectURL(selectedFile);
    setVideoPreview(url);

    const videoEl = document.createElement("video");
    videoEl.preload = "metadata";
    videoEl.onloadedmetadata = () => {
      setDuration(videoEl.duration.toString());
    };
    videoEl.src = url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert("File too large!");
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      // 1️⃣ Get signature from server
      const sigRes = await fetch("/api/video-signature");
      const { timestamp, signature } = await sigRes.json();

      // 2️⃣ Prepare form data for direct upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", "next-cloudinary-uploads");
      formData.append("resource_type", "video");

      // 3️⃣ Direct upload
      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`
      );

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          console.log("Uploaded video:", response);
          router.push(`/video/${response.public_id}`);
        } else {
          console.error("Upload failed:", xhr.responseText);
          alert("Upload failed");
        }
        setIsUploading(false);
      };

      xhr.onerror = () => {
        console.error("Upload error");
        setIsUploading(false);
        alert("Upload failed");
      };

      xhr.send(formData);
    } catch (err) {
      console.error(err);
      setIsUploading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* 3D Canvas */}
      <Canvas className="absolute inset-0 z-0">
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <TorusRing />
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
        />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          className="bg-gray-900 bg-opacity-70 p-8 rounded-2xl shadow-xl w-full max-w-lg space-y-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-3xl font-bold text-center text-purple-400">
            Upload Your Video
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 focus:ring-2 focus:ring-purple-500"
            />

            {videoPreview && (
              <video
                src={videoPreview}
                controls
                className="rounded-lg max-h-60 w-full object-contain border border-gray-600"
              />
            )}

            <input
              type="text"
              placeholder="Video Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 focus:ring-2 focus:ring-purple-500"
            />

            <textarea
              placeholder="Video Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 focus:ring-2 focus:ring-purple-500"
            />

            <button
              type="submit"
              disabled={isUploading}
              className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold disabled:opacity-50"
            >
              {isUploading ? `Uploading ${progress}%` : "Upload Video"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
