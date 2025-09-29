"use client";

import React, { useEffect, useState } from "react";
import { getCldImageUrl } from "next-cloudinary";
import Dashboard from "../componenets/Dashboard";
import VideoCard from "../componenets/VideoCard";
import ImageCard from "../componenets/ImageCard";
import { Video as VideoModel } from "../../../generated/prisma";
import { Image as ImageModel } from "../../../generated/prisma";

// Define a type for images including url
type ImageWithUrl = ImageModel & { url: string; title: string };

export default function HomePage() {
  const [videos, setVideos] = useState<VideoModel[]>([]);
  const [images, setImages] = useState<ImageWithUrl[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const [videoRes, imageRes] = await Promise.all([
          fetch("/api/video"),
          fetch("/api/image"),
        ]);
        const videoData: VideoModel[] = await videoRes.json();
        const imageDataRaw: ImageModel[] = await imageRes.json();

        const imageData: ImageWithUrl[] = imageDataRaw.map((img) => ({
          ...img,
          url: getCldImageUrl({
            src: img.publicId,
            width: 400,
            height: 225,
            crop: "fill",
            format: "jpg",
          }),
          title: img.title || "demo-image",
        }));

        setVideos(videoData);
        setImages(imageData);
      } catch (err) {
        console.error("Failed to fetch media:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  const handleDownload = (url: string, title: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = title;
    a.click();
  };

  const mediaItems = [
    ...videos.map((v) => ({ type: "video" as const, data: v })),
    ...images.map((i) => ({ type: "image" as const, data: i })),
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <Dashboard />

      {loading ? (
        <div className="text-center text-gray-400 mt-20">Loading media...</div>
      ) : mediaItems.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          No media uploaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {mediaItems.map((item) =>
            item.type === "video" ? (
              <VideoCard
                key={item.data.id}
                video={item.data}
                onDownload={handleDownload}
              />
            ) : (
              <ImageCard
                key={`image-${item.data.publicId}`} // unique key
                image={item.data}
                onDownload={handleDownload}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
