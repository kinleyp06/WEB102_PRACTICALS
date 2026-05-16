const express = require("express");

const router = express.Router();

const {
  createVideo,
  getVideos,
  getVideoById,
  likeVideo,
  deleteVideo,
} = require("../controllers/videoController");

const { protect } = require("../middleware/auth");

// JSON body — frontend uploads to Supabase first, then sends URLs here
router.get("/", getVideos);
router.get("/:id", getVideoById);
router.post("/", protect, createVideo);
router.post("/:id/like", protect, likeVideo);
router.delete("/:id", protect, deleteVideo);

module.exports = router;
