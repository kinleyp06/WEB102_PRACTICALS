const express = require("express");

const router = express.Router();

const {
  createVideo,
  getAllVideos,
  likeVideo,
} = require("../controllers/videoController");

const { protect } = require("../middleware/auth");

// Routes
router.get("/", getAllVideos);

router.post("/", protect, createVideo);

router.post("/:id/like", protect, likeVideo);

module.exports = router;