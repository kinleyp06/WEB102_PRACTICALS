const express = require('express');
const {
  getCommentsByPost,
  getComment,
  createComment,
  updateComment,
  deleteComment
} = require('../controllers/commentController');

const router = express.Router();

// Nested route for post comments
router.route('/posts/:postId/comments')
  .get(getCommentsByPost)
  .post(createComment);

// Direct comment routes
router.route('/comments/:id')
  .get(getComment)
  .put(updateComment)
  .delete(deleteComment);

module.exports = router;