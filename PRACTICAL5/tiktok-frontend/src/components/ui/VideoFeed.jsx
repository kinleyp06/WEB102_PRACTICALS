"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import VideoCard from "@/components/ui/VideoCard";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { useAuth } from "@/contexts/authContext";
import { getFollowingVideos, getVideos } from "@/services/videoService";
import { normalizeVideo } from "@/lib/normalizeVideo";

export default function VideoFeed({ feedType = "forYou" }) {
  const { isAuthenticated } = useAuth();
  const [videos, setVideos] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const fetchFn = feedType === "following" ? getFollowingVideos : getVideos;

  const loadVideos = useCallback(
    async (nextCursor = null, append = false) => {
      if (feedType === "following" && !isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        const data = await fetchFn({ cursor: nextCursor });
        const normalized = (data.videos || []).map(normalizeVideo);
        setVideos((prev) => (append ? [...prev, ...normalized] : normalized));
        setCursor(data.pagination?.nextCursor ?? null);
        setHasNextPage(!!data.pagination?.hasNextPage);
        setError(null);
      } catch (err) {
        console.error("Error loading videos:", err);
        setError(err);
        toast.error("Failed to load videos. Please try again.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [feedType, fetchFn, isAuthenticated],
  );

  const loadMoreRef = useIntersectionObserver(() => {
    if (hasNextPage && !loadingMore && cursor) {
      loadVideos(cursor, true);
    }
  });

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
      </div>
    );
  }

  if (error && videos.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-red-500">Failed to load videos</p>
        <button
          type="button"
          onClick={() => loadVideos()}
          className="mt-4 rounded-lg bg-pink-500 px-4 py-2 text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (feedType === "following" && videos.length === 0) {
    return (
      <div className="py-10 text-center text-zinc-500">
        <p>
          You are not following anyone yet, or the users you follow have not
          posted any videos.
        </p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="py-10 text-center text-zinc-500">
        <p>No videos found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}

      {loadingMore && (
        <div className="flex justify-center py-5">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
        </div>
      )}

      {hasNextPage && !loadingMore && <div ref={loadMoreRef} className="h-20" />}

      {!hasNextPage && videos.length > 0 && (
        <p className="py-5 text-center text-zinc-500">
          You have reached the end of the feed.
        </p>
      )}
    </div>
  );
}
