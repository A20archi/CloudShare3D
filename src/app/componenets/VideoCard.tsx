"use client";

import React, { useCallback, useEffect, useState } from "react";
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import {
  Download,
  Clock,
  FileDown,
  FileUp,
  Video as VideoIcon,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Video as VideoModel } from "../../../generated/prisma";
import {filesize} from "filesize";

dayjs.extend(relativeTime);

interface VideoCardProps {
  video: VideoModel;
  onDownload: (url: string, title: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onDownload }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const getThumbnailUrl = useCallback((publicId: string) => {
    return getCldImageUrl({
      src: publicId,
      width: 400,
      height: 225,
      crop: "fill",
      gravity: "auto",
      format: "jpg",
      quality: "auto",
      assetType: "video",
    });
  }, []);

  const getPreviewVideoUrl = useCallback((publicId: string) => {
    return getCldVideoUrl({
      src: publicId,
      width: 400,
      height: 225,
      rawTransformations: [
        "e_preview[:duration_15][:max_seg_9][:min_seg_dur_1]",
      ],
    });
  }, []);

  const getFullVideoUrl = useCallback((publicId: string) => {
    return getCldVideoUrl({ src: publicId, width: 1920, height: 1080 });
  }, []);

  const formatSize = useCallback((size: number) => filesize(size), []);
  const formatDuration = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins} min ${secs} sec`;
  }, []);

  const compressionPercentage = Math.round(
    (1 - Number(video.compressedSize) / Number(video.originalSize)) * 100
  );

  useEffect(() => {
    setPreviewError(false);
  }, [isHovered]);

  const handlePreviewError = () => setPreviewError(true);

  return (
    <div
      className="bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video bg-black">
        {isHovered ? (
          previewError ? (
            <div className="flex items-center justify-center w-full h-full text-red-500 font-semibold">
              Preview not available
            </div>
          ) : (
            <video
              src={getPreviewVideoUrl(video.publicId)}
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
              onError={handlePreviewError}
            />
          )
        ) : (
          <img
            src={getThumbnailUrl(video.publicId)}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded flex items-center text-xs">
          <Clock size={14} className="mr-1" /> {formatDuration(video.duration)}
        </div>
      </div>

      <div className="p-4 space-y-2">
        <h2 className="font-bold text-lg truncate">{video.title}</h2>
        <p className="text-sm text-gray-300 line-clamp-2">
          {video.description}
        </p>
        <p className="text-xs text-gray-400">
          Uploaded {dayjs(video.createdAt).fromNow()}
        </p>

        <div className="grid grid-cols-2 gap-3 mt-2 text-xs">
          <div className="flex items-center">
            <FileUp size={16} className="mr-1 text-blue-400" />
            <div>
              <div>Original</div>
              <div>{formatSize(Number(video.originalSize))}</div>
            </div>
          </div>
          <div className="flex items-center">
            <FileDown size={16} className="mr-1 text-green-400" />
            <div>
              <div>Compressed</div>
              <div>{formatSize(Number(video.compressedSize))}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-yellow-400 font-semibold">
            Compression: {compressionPercentage}%
          </span>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded flex items-center text-xs"
            onClick={() =>
              onDownload(getFullVideoUrl(video.publicId), video.title)
            }
          >
            <Download size={14} className="mr-1" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
