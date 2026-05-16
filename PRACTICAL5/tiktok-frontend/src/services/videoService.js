import api from "@/lib/api-config";
import { normalizeVideo } from "@/lib/normalizeVideo";

export const getVideos = async ({ pageParam = null, cursor = null } = {}) => {
  const nextCursor = pageParam ?? cursor;
  const url = nextCursor ? `/videos?cursor=${nextCursor}` : "/videos";
  const response = await api.get(url);
  const data = response.data;

  return {
    videos: data.videos || [],
    pagination: {
      nextCursor: data.nextCursor ?? null,
      hasNextPage: !!data.nextCursor,
    },
  };
};

export const getFollowingVideos = async (options = {}) => {
  return getVideos(options);
};

export const getVideoById = async (videoId) => {
  const response = await api.get(`/videos/${videoId}`);
  return normalizeVideo(response.data);
};

export const getVideoComments = async (videoId) => {
  const response = await api.get(`/comments?videoId=${videoId}`);
  const comments = (response.data.comments || []).map((comment) => ({
    ...comment,
    content: comment.content || comment.text,
  }));

  return { comments };
};

export const addComment = async (videoId, text) => {
  const response = await api.post("/comments", {
    videoId: parseInt(videoId),
    text,
  });

  return {
    ...response.data,
    content: response.data.content || response.data.text,
  };
};

export const createVideo = async (payload) => {
  const response = await api.post("/videos", payload);
  return response.data;
};

export const deleteVideo = async (videoId) => {
  const response = await api.delete(`/videos/${videoId}`);
  return response.data;
};

export const likeVideo = async (videoId) => {
  const response = await api.post(`/videos/${videoId}/like`);
  return response.data;
};
