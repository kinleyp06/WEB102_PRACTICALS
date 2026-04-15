const express = require('express');
const {
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
  getFollowerStats
} = require('../controllers/followerController');

const router = express.Router();

router.route('/users/:userId/followers')
  .get(getFollowers);

router.route('/users/:userId/following')
  .get(getFollowing);

router.route('/users/:userId/followers/stats')
  .get(getFollowerStats);

router.route('/users/:userId/follow')
  .post(followUser)
  .delete(unfollowUser);

module.exports = router;