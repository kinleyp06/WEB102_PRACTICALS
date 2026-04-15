const express = require('express');
const {
  getLikesByPost,
  likePost,
  unlikePost,
  checkLikeStatus
} = require('../controllers/likeController');

const router = express.Router();

router.route('/posts/:postId/likes')
  .get(getLikesByPost)
  .post(likePost)
  .delete(unlikePost);

router.route('/posts/:postId/likes/check')
  .get(checkLikeStatus);

module.exports = router;