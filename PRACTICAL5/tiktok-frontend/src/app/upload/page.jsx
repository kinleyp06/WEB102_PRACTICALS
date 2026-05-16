"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api-config";
import { useAuth } from "@/contexts/authContext";
import { uploadVideoWithThumbnail } from "@/services/uploadService";

export default function UploadPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error("Please log in to upload videos");
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!video) {
      toast.error("Please select a video file");
      return;
    }

    setUploading(true);

    try {
      const uploadResult = await uploadVideoWithThumbnail(video);

      await api.post("/videos", {
        title,
        description,
        videoUrl: uploadResult.videoUrl,
        thumbnailUrl: uploadResult.thumbnailUrl,
        videoStoragePath: uploadResult.videoStoragePath,
        thumbnailStoragePath: uploadResult.thumbnailStoragePath,
      });

      toast.success("Video uploaded successfully");
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || error.message || "Upload failed",
      );
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <p className="text-zinc-500">Loading...</p>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-4xl font-bold">Upload Video</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-lg bg-white p-6 shadow"
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-3"
          required
          disabled={uploading}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-3"
          required
          disabled={uploading}
        />

        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files?.[0] || null)}
          className="w-full border p-3"
          required
          disabled={uploading}
        />

        {video && (
          <p className="text-sm text-zinc-500">
            Selected: {video.name} ({(video.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="w-full rounded bg-pink-500 py-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? "Uploading to cloud..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
