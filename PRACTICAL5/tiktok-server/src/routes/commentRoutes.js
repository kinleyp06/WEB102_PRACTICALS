const express = require("express");

const router = express.Router();

const {
  createComment,
  getComments,
} = require("../controllers/commentController");

const { protect } = require("../middleware/auth");

router.get("/", getComments);

router.post("/", protect, createComment);

module.exports = router;
