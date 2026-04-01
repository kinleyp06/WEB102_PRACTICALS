const { comments } = require("../models");

exports.getAllComments = (req, res) => {
  res.json(comments);
};

exports.createComment = (req, res) => {
  const newComment = { id: comments.length + 1, ...req.body };
  comments.push(newComment);
  res.json(newComment);
};

exports.getCommentById = (req, res) => {
  const comment = comments.find(c => c.id == req.params.id);
  res.json(comment);
};