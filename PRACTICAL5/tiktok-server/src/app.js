const express = require("express");

const cors = require("cors");

require("dotenv").config();

const app = express();

// Allow Next.js frontend to call the API (fixes CORS during local dev)
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  }),
);

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

app.get("/", (req, res) => {
  res.json({
    message: "TikTok Server Running",
  });
});

module.exports = app;
