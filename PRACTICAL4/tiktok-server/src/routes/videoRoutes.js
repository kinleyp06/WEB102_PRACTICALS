const express = require("express");

const router = express.Router();

const {
  createVideo,
  getVideos,
  likeVideo,
} = require("../controllers/videoController");

const { protect } = require("../middleware/auth");

const upload = require("../middleware/uploadMiddleware");

router.get("/", getVideos);

router.post("/", protect, upload.single("video"), createVideo);

router.post("/:id/like", protect, likeVideo);

module.exports = router;
