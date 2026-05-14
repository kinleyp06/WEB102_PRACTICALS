const prisma = require("../lib/prisma");

// Create Video
exports.createVideo = async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnail } = req.body;

    const video = await prisma.video.create({
      data: {
        title,
        description,
        videoUrl,
        thumbnail,
        userId: req.user.id,
      },
    });

    res.status(201).json(video);

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Get All Videos
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await prisma.video.findMany({
      include: {
        user: {
          select: {
            username: true,
          },
        },

        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    res.json(videos);

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Like Video
exports.likeVideo = async (req, res) => {
  try {
    await prisma.videoLike.create({
      data: {
        userId: req.user.id,
        videoId: parseInt(req.params.id),
      },
    });

    res.json({
      message: "Video liked",
    });

  } catch (error) {
    res.status(400).json({
      message: "Already liked or video not found",
    });
  }
};