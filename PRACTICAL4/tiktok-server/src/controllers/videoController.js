exports.createVideo = async (req, res) => {
  try {
    const { title, description } = req.body;

    const videoPath = req.file ? `/uploads/${req.file.filename}` : null;

    const video = await prisma.video.create({
      data: {
        title,
        description,
        videoUrl: videoPath,
        thumbnail: "",
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
