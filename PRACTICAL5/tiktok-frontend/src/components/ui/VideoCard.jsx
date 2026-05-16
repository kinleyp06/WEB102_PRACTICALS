"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  FaComment,
  FaHeart,
  FaMusic,
  FaShare,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/authContext";
import { getMediaUrl } from "@/lib/media";
import { likeVideo as likeVideoApi } from "@/services/videoService";

export default function VideoCard({ video }) {
  const { isAuthenticated } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(!!video.isLiked);
  const [likeCount, setLikeCount] = useState(video.likeCount || 0);
  const [videoError, setVideoError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => console.error("Error playing video:", error));
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to like videos");
      return;
    }

    if (isLiked) {
      toast.error("Unlike is not supported by the current API");
      return;
    }

    try {
      await likeVideoApi(video.id);
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    } catch (error) {
      console.error("Error liking video:", error);
      toast.error(error.response?.data?.message || "Failed to like video");
    }
  };

  useEffect(() => {
    if (!videoRef.current) return;

    let paused = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            if (videoRef.current && !paused) {
              videoRef.current
                .play()
                .then(() => setIsPlaying(true))
                .catch(() => setIsPlaying(false));
            }
          }, 50);
        } else if (videoRef.current) {
          paused = true;
          videoRef.current.pause();
          setIsPlaying(false);
          setTimeout(() => {
            paused = false;
          }, 100);
        }
      },
      { threshold: 0.6 },
    );

    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <article className="mb-8 flex border-b border-zinc-200 pb-8">
      <Link href={`/profile/${video.user?.id}`} className="mr-4">
        <div className="h-12 w-12 overflow-hidden rounded-full bg-zinc-200">
          <img
            src={getMediaUrl(video.user?.avatar) || "https://via.placeholder.com/150"}
            alt={video.user?.username || "User"}
            className="h-full w-full object-cover"
          />
        </div>
      </Link>

      <div className="flex-1">
        <div className="mb-3">
          <Link
            href={`/profile/${video.user?.id}`}
            className="font-semibold hover:underline"
          >
            {video.user?.username}
          </Link>
          <p className="mt-1">{video.caption}</p>
          {video.audioName && (
            <p className="mt-1 flex items-center text-sm text-zinc-500">
              <FaMusic className="mr-1" /> {video.audioName}
            </p>
          )}
        </div>

        <div className="flex">
          <div className="relative mr-4 h-[600px] w-[336px] overflow-hidden rounded-lg bg-black">
            {!videoError ? (
              <>
                <video
                  ref={videoRef}
                  onClick={togglePlay}
                  className="h-full w-full object-contain"
                  loop
                  muted={isMuted}
                  playsInline
                  poster={
                    getMediaUrl(video.thumbnailUrl || video.thumbnail) ||
                    "https://via.placeholder.com/336x600"
                  }
                  src={getMediaUrl(video.videoUrl)}
                  onError={() => setVideoError(true)}
                />

                <button
                  type="button"
                  onClick={toggleMute}
                  className="absolute bottom-4 right-4 z-10 rounded-full bg-black/50 p-2 text-white"
                >
                  {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
                </button>

                {!isPlaying && (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
                    <span className="rounded-full bg-black/50 p-4">▶️</span>
                  </div>
                )}
              </>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center text-white">
                <p>Video unavailable</p>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center justify-end space-y-4">
            <button
              type="button"
              onClick={handleLike}
              className={`flex flex-col items-center ${isLiked ? "text-red-500" : ""}`}
            >
              <span className="rounded-full bg-zinc-100 p-3">
                <FaHeart size={20} />
              </span>
              <span className="mt-1 text-xs">{likeCount}</span>
            </button>

            <Link
              href={`/video/${video.id}`}
              className="flex flex-col items-center"
            >
              <span className="rounded-full bg-zinc-100 p-3">
                <FaComment size={20} />
              </span>
              <span className="mt-1 text-xs">{video.commentCount || 0}</span>
            </Link>

            <button type="button" className="flex flex-col items-center">
              <span className="rounded-full bg-zinc-100 p-3">
                <FaShare size={20} />
              </span>
              <span className="mt-1 text-xs">Share</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
