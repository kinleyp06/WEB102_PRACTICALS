const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/videos", require("./routes/videoRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));

// Home route
app.get("/", (req, res) => {
  res.send("TikTok API is running!");
});

module.exports = app;