"use client";

import React from "react";
import { Video, ImageIcon } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 flex flex-col sm:flex-row items-center justify-around gap-4">
      {/* Video Upload */}
      <a
        href="/video-upload"
        className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all"
      >
        <Video size={20} />
        Upload Video
      </a>

      {/* Image Upload */}
      <a
        href="/social-share"
        className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all"
      >
        <ImageIcon size={20} />
        Upload Image
      </a>
    </div>
  );
}
