const prisma = require("../lib/prisma");
const storageService = require("../services/storageService");

/**
 * Create a video record after the frontend uploads files to Supabase.
 * Expects public URLs and storage paths in the JSON body.
 */
exports.createVideo = async (req, res) => {
  try {
    const {
      title,
      description,
      videoUrl,
      thumbnailUrl,
      videoStoragePath,
      thumbnailStoragePath,
    } = req.body;

    const finalVideoUrl = videoUrl || null;
    const finalThumbnailUrl = thumbnailUrl || "";
    const finalVideoPath = videoStoragePath || null;
    const finalThumbnailPath = thumbnailStoragePath || null;

    if (!finalVideoUrl) {
      return res.status(400).json({ message: "videoUrl is required" });
    }

    const video = await prisma.video.create({
      data: {
        title,
        description,
        videoUrl: finalVideoUrl,
        thumbnail: finalThumbnailUrl,
        videoStoragePath: finalVideoPath,
        thumbnailStoragePath: finalThumbnailPath,
        userId: req.user.id,
      },
    });

    res.status(201).json(video);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getVideoById = async (req, res) => {
  try {
    const videoId = parseInt(req.params.id);

    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        user: true,
        comments: { include: { user: true } },
        likes: true,
      },
    });

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVideos = async (req, res) => {
  try {
    const limit = 5;
    const cursor = req.query.cursor;

    const videos = await prisma.video.findMany({
      take: limit + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: parseInt(cursor) } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        comments: true,
        likes: true,
      },
    });

    let nextCursor = null;

    if (videos.length > limit) {
      const nextItem = videos.pop();
      nextCursor = nextItem.id;
    }

    res.json({ videos, nextCursor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.likeVideo = async (req, res) => {
  try {
    const videoId = parseInt(req.params.id);

    const existingLike = await prisma.like.findFirst({
      where: {
        userId: req.user.id,
        videoId,
      },
    });

    if (existingLike) {
      return res.status(400).json({ message: "Already liked" });
    }

    const like = await prisma.like.create({
      data: {
        userId: req.user.id,
        videoId,
      },
    });

    res.json(like);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** Delete video from database and remove files from Supabase Storage */
exports.deleteVideo = async (req, res) => {
  try {
    const videoId = parseInt(req.params.id);

    const video = await prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (video.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await storageService.deleteVideoAssets(video);

    await prisma.video.delete({
      where: { id: videoId },
    });

    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
