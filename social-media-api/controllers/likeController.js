const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { likes, posts, users } = require('../utils/mockData');

// @desc    Get all likes for a specific post
// @route   GET /api/posts/:postId/likes
// @access  Public
exports.getLikesByPost = asyncHandler(async (req, res, next) => {
  const postId = req.params.postId;
  
  // Check if post exists
  const post = posts.find(post => post.id === postId);
  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${postId}`, 404));
  }
  
  // Filter likes for this post
  const postLikes = likes.filter(like => like.post_id === postId);
  
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = postLikes.length;
  
  // Get paginated results
  const paginatedLikes = postLikes.slice(startIndex, endIndex);
  
  // Enhance likes with user data
  const enhancedLikes = paginatedLikes.map(like => {
    const user = users.find(user => user.id === like.user_id);
    return {
      ...like,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        profile_picture: user.profile_picture
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
    count: enhancedLikes.length,
    total_likes: total,
    page,
    total_pages: Math.ceil(total / limit),
    pagination,
    data: enhancedLikes
  });
});

// @desc    Like a post (create like)
// @route   POST /api/posts/:postId/likes
// @access  Private
exports.likePost = asyncHandler(async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.header('X-User-Id');
  
  // Check authentication
  if (!userId) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
  
  // Check if post exists
  const post = posts.find(post => post.id === postId);
  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${postId}`, 404));
  }
  
  // Check if user exists
  const user = users.find(user => user.id === userId);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }
  
  // Check if user already liked this post
  const existingLike = likes.find(like => like.post_id === postId && like.user_id === userId);
  if (existingLike) {
    return next(new ErrorResponse('You have already liked this post', 400));
  }
  
  const newLike = {
    id: (likes.length + 1).toString(),
    post_id: postId,
    user_id: userId,
    created_at: new Date().toISOString()
  };
  
  likes.push(newLike);
  
  // Get total likes count for the post
  const totalLikes = likes.filter(like => like.post_id === postId).length;
  
  // Enhance response with user data
  const responseLike = {
    ...newLike,
    user: {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      profile_picture: user.profile_picture
    }
  };
  
  res.status(201).json({
    success: true,
    total_likes: totalLikes,
    data: responseLike
  });
});

// @desc    Unlike a post (delete like)
// @route   DELETE /api/posts/:postId/likes
// @access  Private
exports.unlikePost = asyncHandler(async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.header('X-User-Id');
  
  // Check authentication
  if (!userId) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
  
  // Check if post exists
  const post = posts.find(post => post.id === postId);
  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${postId}`, 404));
  }
  
  // Find the like
  const like = likes.find(like => like.post_id === postId && like.user_id === userId);
  
  if (!like) {
    return next(new ErrorResponse('You have not liked this post', 400));
  }
  
  // Delete like
  const index = likes.findIndex(like => like.id === like.id);
  likes.splice(index, 1);
  
  // Get remaining likes count
  const totalLikes = likes.filter(like => like.post_id === postId).length;
  
  res.status(200).json({
    success: true,
    message: 'Post unliked successfully',
    total_likes: totalLikes,
    data: {}
  });
});

// @desc    Check if user liked a post
// @route   GET /api/posts/:postId/likes/check
// @access  Private
exports.checkLikeStatus = asyncHandler(async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.header('X-User-Id');
  
  // Check authentication
  if (!userId) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
  
  // Check if post exists
  const post = posts.find(post => post.id === postId);
  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${postId}`, 404));
  }
  
  const hasLiked = likes.some(like => like.post_id === postId && like.user_id === userId);
  const totalLikes = likes.filter(like => like.post_id === postId).length;
  
  res.status(200).json({
    success: true,
    data: {
      post_id: postId,
      user_id: userId,
      has_liked: hasLiked,
      total_likes: totalLikes
    }
  });
});