"use client";

import VideoFeed from "@/components/ui/VideoFeed";

export default function HomePage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">For You</h1>
      <VideoFeed feedType="forYou" />
    </div>
  );
}
