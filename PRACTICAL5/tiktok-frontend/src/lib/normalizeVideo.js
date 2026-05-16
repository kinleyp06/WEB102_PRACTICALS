export const normalizeVideo = (video) => {
  if (!video) return video;

  return {
    ...video,
    caption: video.caption || video.title || video.description || "",
    thumbnailUrl: video.thumbnailUrl || video.thumbnail,
    likeCount: video.likeCount ?? video._count?.likes ?? 0,
    commentCount: video.commentCount ?? video._count?.comments ?? 0,
    user: {
      id: video.user?.id ?? video.userId,
      username: video.user?.username,
      avatar: video.user?.avatar,
    },
  };
};

export const normalizeVideosResponse = (data) => {
  if (Array.isArray(data)) {
    return {
      videos: data.map(normalizeVideo),
      pagination: { hasNextPage: false, nextCursor: null },
    };
  }

  if (data?.videos) {
    return {
      ...data,
      videos: data.videos.map(normalizeVideo),
    };
  }

  return { videos: [], pagination: { hasNextPage: false, nextCursor: null } };
};
