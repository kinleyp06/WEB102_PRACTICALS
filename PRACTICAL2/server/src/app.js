const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());

module.exports = app;

const videoRoutes = require("./routes/videos");
const userRoutes = require("./routes/users");
const commentRoutes = require("./routes/comments");

app.use("/api/videos", videoRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);