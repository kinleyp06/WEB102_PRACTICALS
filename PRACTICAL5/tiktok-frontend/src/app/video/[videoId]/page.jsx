"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaUser } from "react-icons/fa";
import toast from "react-hot-toast";
import { getMediaUrl } from "@/lib/media";
import { useAuth } from "@/contexts/authContext";
import {
  addComment,
  getVideoById,
  getVideoComments,
} from "@/services/videoService";

export default function VideoDetailPage() {
  const { videoId } = useParams();
  const { isAuthenticated } = useAuth();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!videoId) return;

    const fetchVideoData = async () => {
      try {
        setLoading(true);
        const videoData = await getVideoById(videoId);
        setVideo(videoData);

        const commentsData = await getVideoComments(videoId);
        setComments(commentsData.comments || []);
      } catch (error) {
        console.error("Error fetching video:", error);
        toast.error("Failed to load video");
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [videoId]);

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please log in to comment");
      return;
    }

    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const newComment = await addComment(videoId, commentText);
      setComments((prev) => [newComment, ...prev]);
      setCommentText("");
      toast.success("Comment added");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="py-10 text-center">
        <p>Video not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="md:w-2/3">
          <div className="overflow-hidden rounded-lg bg-black">
            <video
              src={getMediaUrl(video.videoUrl)}
              controls
              className="max-h-[70vh] w-full object-contain"
              poster={getMediaUrl(video.thumbnailUrl)}
            />
          </div>
          <div className="mt-4">
            <Link
              href={`/profile/${video.user?.id}`}
              className="flex items-center gap-2"
            >
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-zinc-200">
                {video.user?.avatar ? (
                  <img
                    src={getMediaUrl(video.user.avatar)}
                    alt={video.user.username}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FaUser className="text-zinc-500" />
                )}
              </div>
              <span className="font-bold">{video.user?.username}</span>
            </Link>
            <p className="mt-2">{video.caption}</p>
          </div>
        </div>

        <div className="md:w-1/3 rounded-lg border border-zinc-200">
          <div className="border-b p-4">
            <h2 className="text-lg font-bold">Comments</h2>
          </div>

          <form onSubmit={handleAddComment} className="flex border-b p-4">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 rounded-l border border-zinc-300 p-2"
              disabled={!isAuthenticated}
            />
            <button
              type="submit"
              className="rounded-r bg-pink-500 px-4 py-2 text-white disabled:bg-pink-300"
              disabled={!isAuthenticated || !commentText.trim()}
            >
              Post
            </button>
          </form>

          <div className="max-h-[50vh] overflow-y-auto p-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="mb-4 border-b pb-2">
                  <p className="font-bold">{comment.user?.username}</p>
                  <p className="mt-1 text-sm">{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-zinc-500">No comments yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
