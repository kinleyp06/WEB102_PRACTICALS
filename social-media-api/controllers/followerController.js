const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { followers, users } = require('../utils/mockData');

// @desc    Get followers of a user
// @route   GET /api/users/:userId/followers
// @access  Public
exports.getFollowers = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;
  
  // Check if user exists
  const user = users.find(user => user.id === userId);
  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${userId}`, 404));
  }
  
  // Get all followers (users who follow this user)
  const userFollowers = followers.filter(f => f.following_id === userId);
  
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = userFollowers.length;
  
  // Get paginated results
  const paginatedFollowers = userFollowers.slice(startIndex, endIndex);
  
  // Enhance with follower user data
  const enhancedFollowers = paginatedFollowers.map(follow => {
    const followerUser = users.find(u => u.id === follow.follower_id);
    return {
      id: follow.id,
      followed_at: follow.created_at,
      follower: {
        id: followerUser.id,
        username: followerUser.username,
        full_name: followerUser.full_name,
        profile_picture: followerUser.profile_picture,
        bio: followerUser.bio
      }
    };
  });
  
  // Pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = { page: page + 1, limit };
  }
  if (startIndex > 0) {
    pagination.prev = { page: page - 1, limit };
  }
  
  res.status(200).json({
    success: true,
    count: enhancedFollowers.length,
    total_followers: total,
    page,
    total_pages: Math.ceil(total / limit),
    pagination,
    data: enhancedFollowers
  });
});

// @desc    Get users that a user is following
// @route   GET /api/users/:userId/following
// @access  Public
exports.getFollowing = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;
  
  // Check if user exists
  const user = users.find(user => user.id === userId);
  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${userId}`, 404));
  }
  
  // Get all following (users this user follows)
  const userFollowing = followers.filter(f => f.follower_id === userId);
  
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = userFollowing.length;
  
  // Get paginated results
  const paginatedFollowing = userFollowing.slice(startIndex, endIndex);
  
  // Enhance with following user data
  const enhancedFollowing = paginatedFollowing.map(follow => {
    const followingUser = users.find(u => u.id === follow.following_id);
    return {
      id: follow.id,
      followed_at: follow.created_at,
      following: {
        id: followingUser.id,
        username: followingUser.username,
        full_name: followingUser.full_name,
        profile_picture: followingUser.profile_picture,
        bio: followingUser.bio
      }
    };
  });
  
  // Pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = { page: page + 1, limit };
  }
  if (startIndex > 0) {
    pagination.prev = { page: page - 1, limit };
  }
  
  res.status(200).json({
    success: true,
    count: enhancedFollowing.length,
    total_following: total,
    page,
    total_pages: Math.ceil(total / limit),
    pagination,
    data: enhancedFollowing
  });
});

// @desc    Follow a user
// @route   POST /api/users/:userId/follow
// @access  Private
exports.followUser = asyncHandler(async (req, res, next) => {
  const userIdToFollow = req.params.userId;
  const currentUserId = req.header('X-User-Id');
  
  // Check authentication
  if (!currentUserId) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
  
  // Cannot follow yourself
  if (currentUserId === userIdToFollow) {
    return next(new ErrorResponse('You cannot follow yourself', 400));
  }
  
  // Check if user to follow exists
  const userToFollow = users.find(user => user.id === userIdToFollow);
  if (!userToFollow) {
    return next(new ErrorResponse(`User not found with id of ${userIdToFollow}`, 404));
  }
  
  // Check if current user exists
  const currentUser = users.find(user => user.id === currentUserId);
  if (!currentUser) {
    return next(new ErrorResponse('User not found', 404));
  }
  
  // Check if already following
  const existingFollow = followers.find(
    f => f.follower_id === currentUserId && f.following_id === userIdToFollow
  );
  
  if (existingFollow) {
    return next(new ErrorResponse('You are already following this user', 400));
  }
  
  const newFollow = {
    id: (followers.length + 1).toString(),
    follower_id: currentUserId,
    following_id: userIdToFollow,
    created_at: new Date().toISOString()
  };
  
  followers.push(newFollow);
  
  res.status(201).json({
    success: true,
    message: `You are now following ${userToFollow.username}`,
    data: {
      id: newFollow.id,
      follower: {
        id: currentUser.id,
        username: currentUser.username,
        full_name: currentUser.full_name
      },
      following: {
        id: userToFollow.id,
        username: userToFollow.username,
        full_name: userToFollow.full_name
      },
      followed_at: newFollow.created_at
    }
  });
});

// @desc    Unfollow a user
// @route   DELETE /api/users/:userId/follow
// @access  Private
exports.unfollowUser = asyncHandler(async (req, res, next) => {
  const userIdToUnfollow = req.params.userId;
  const currentUserId = req.header('X-User-Id');
  
  // Check authentication
  if (!currentUserId) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
  
  // Check if user to unfollow exists
  const userToUnfollow = users.find(user => user.id === userIdToUnfollow);
  if (!userToUnfollow) {
    return next(new ErrorResponse(`User not found with id of ${userIdToUnfollow}`, 404));
  }
  
  // Find the follow relationship
  const follow = followers.find(
    f => f.follower_id === currentUserId && f.following_id === userIdToUnfollow
  );
  
  if (!follow) {
    return next(new ErrorResponse('You are not following this user', 400));
  }
  
  // Delete follow relationship
  const index = followers.findIndex(f => f.id === follow.id);
  followers.splice(index, 1);
  
  res.status(200).json({
    success: true,
    message: `You have unfollowed ${userToUnfollow.username}`,
    data: {}
  });
});

// @desc    Get follower stats for a user
// @route   GET /api/users/:userId/followers/stats
// @access  Public
exports.getFollowerStats = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;
  
  // Check if user exists
  const user = users.find(user => user.id === userId);
  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${userId}`, 404));
  }
  
  const followersCount = followers.filter(f => f.following_id === userId).length;
  const followingCount = followers.filter(f => f.follower_id === userId).length;
  
  res.status(200).json({
    success: true,
    data: {
      user_id: userId,
      username: user.username,
      followers_count: followersCount,
      following_count: followingCount
    }
  });
});