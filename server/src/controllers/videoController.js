const { videos } = require("../models");

exports.getAllVideos = (req, res) => {
  res.json(videos);
};

exports.getVideoById = (req, res) => {
  const video = videos.find(v => v.id == req.params.id);
  res.json(video);
};

exports.createVideo = (req, res) => {
  const newVideo = { id: videos.length + 1, ...req.body };
  videos.push(newVideo);
  res.json(newVideo);
};

exports.deleteVideo = (req, res) => {
  res.send("Delete video");
};