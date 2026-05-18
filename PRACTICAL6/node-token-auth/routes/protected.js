const express = require("express");

const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// Protected route
router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "Welcome! Protected route accessed.",
    user: req.user,
  });
});

module.exports = router;
