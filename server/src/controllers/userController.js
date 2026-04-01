const { users, videos } = require("../models");

exports.getAllUsers = (req, res) => {
  res.json(users);
};

exports.getUserById = (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  res.json(user);
};

exports.createUser = (req, res) => {
  const newUser = { id: users.length + 1, ...req.body };
  users.push(newUser);
  res.json(newUser);
};

exports.getUserVideos = (req, res) => {
  const userVideos = videos.filter(v => v.userId == req.params.id);
  res.json(userVideos);
};