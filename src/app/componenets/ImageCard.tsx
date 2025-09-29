"use client";

import React, { useState } from "react";
import { Download } from "lucide-react";

interface ImageCardProps {
  image: {
    id: string;
    publicId: string;
    url: string;
    title: string;
    createdAt: string | Date;
  };
  onDownload: (url: string, title: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onDownload }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <figure className="aspect-video relative">
        <img
          src={image.url}
          alt={image.title}
          className="w-full h-full object-cover rounded-lg"
        />
      </figure>

      <div className="card-body p-4">
        <h2 className="card-title text-lg font-bold">
          {image.title || "demo-image"}
        </h2>
        <p className="text-sm text-base-content opacity-70 mb-4">
          Uploaded {new Date(image.createdAt).toLocaleDateString()}
        </p>

        <div className="flex justify-end mt-2">
          <button
            className="btn btn-primary btn-sm flex items-center"
            onClick={() => onDownload(image.url, image.title)}
          >
            <Download size={16} className="mr-1" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
