const prisma = require("../lib/prisma");

exports.createComment = async (req, res) => {
  try {
    const { text, videoId } = req.body;

    const comment = await prisma.comment.create({
      data: {
        text,
        videoId,
        userId: req.user.id,
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        user: true,
      },
    });

    res.json(comments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
