const express = require("express");

const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());

app.use(express.json());

const userRoutes = require("./routes/userRoutes");

const videoRoutes = require("./routes/videoRoutes");

const commentRoutes = require("./routes/commentRoutes");

app.use("/api/users", userRoutes);

app.use("/api/videos", videoRoutes);

app.use("/api/comments", commentRoutes);

app.use(
  "/uploads",
  express.static("uploads")
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "TikTok Server Running",
  });
});

module.exports = app;
