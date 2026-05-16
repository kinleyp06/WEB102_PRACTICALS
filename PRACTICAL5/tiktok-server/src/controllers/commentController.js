const prisma = require("../lib/prisma");

exports.createComment = async (req, res) => {
  try {
    const { text, videoId } = req.body;

    const comment = await prisma.comment.create({
      data: {
        text,
        videoId: parseInt(videoId),
        userId: req.user.id,
      },
      include: {
        user: true,
      },
    });

    res.status(201).json({
      ...comment,
      content: comment.text,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getComments = async (req, res) => {
  try {
    const videoId = req.query.videoId ? parseInt(req.query.videoId) : null;

    const comments = await prisma.comment.findMany({
      where: videoId ? { videoId } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
      },
    });

    res.json({ comments });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
