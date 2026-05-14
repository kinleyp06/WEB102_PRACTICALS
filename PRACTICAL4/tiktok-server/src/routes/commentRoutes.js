const express = require("express");

const router = express.Router();

const {
    addComment,
    getComments,
} = require("../controllers/commentController");

const { protect } = require("../middleware/auth");

// Routes
router.get("/:videoId", getComments);

router.post("/:videoId", protect, addComment);

module.exports = router;