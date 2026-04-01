const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { comments, posts, users } = require('../utils/mockData');

// @desc    Get all comments for a specific post
// @route   GET /api/posts/:postId/comments
// @access  Public
exports.getCommentsByPost = asyncHandler(async (req, res, next) => {
  const postId = req.params.postId;
  
  // Check if post exists
  const post = posts.find(post => post.id === postId);
  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${postId}`, 404));
  }
  
  // Filter comments for this post
  let postComments = comments.filter(comment => comment.post_id === postId);
  
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = postComments.length;
  
  // Get paginated results
  const paginatedComments = postComments.slice(startIndex, endIndex);
  
  // Enhance comments with user data
  const enhancedComments = paginatedComments.map(comment => {
    const user = users.find(user => user.id === comment.user_id);
    return {
      ...comment,
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
    count: enhancedComments.length,
    page,
    total_pages: Math.ceil(total / limit),
    pagination,
    data: enhancedComments
  });
});

// @desc    Get single comment
// @route   GET /api/comments/:id
// @access  Public
exports.getComment = asyncHandler(async (req, res, next) => {
  const comment = comments.find(comment => comment.id === req.params.id);
  
  if (!comment) {
    return next(new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404));
  }
  
  // Enhance comment with user data
  const user = users.find(user => user.id === comment.user_id);
  const post = posts.find(post => post.id === comment.post_id);
  
  const enhancedComment = {
    ...comment,
    user: {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      profile_picture: user.profile_picture
    },
    post: {
      id: post.id,
      caption: post.caption,
      image: post.image
    }
  };
  
  res.status(200).json({
    success: true,
    data: enhancedComment
  });
});

// @desc    Create new comment on a post
// @route   POST /api/posts/:postId/comments
// @access  Private
exports.createComment = asyncHandler(async (req, res, next) => {
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
  
  // Validate request body
  if (!req.body.content) {
    return next(new ErrorResponse('Comment content is required', 400));
  }
  
  const newComment = {
    id: (comments.length + 1).toString(),
    content: req.body.content,
    post_id: postId,
    user_id: userId,
    created_at: new Date().toISOString()
  };
  
  comments.push(newComment);
  
  // Enhance response with user data
  const responseComment = {
    ...newComment,
    user: {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      profile_picture: user.profile_picture
    }
  };
  
  res.status(201).json({
    success: true,
    data: responseComment
  });
});

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
exports.updateComment = asyncHandler(async (req, res, next) => {
  const userId = req.header('X-User-Id');
  const commentId = req.params.id;
  
  // Check authentication
  if (!userId) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
  
  let comment = comments.find(comment => comment.id === commentId);
  
  if (!comment) {
    return next(new ErrorResponse(`Comment not found with id of ${commentId}`, 404));
  }
  
  // Check if user owns the comment
  if (comment.user_id !== userId) {
    return next(new ErrorResponse('Not authorized to update this comment', 401));
  }
  
  // Update comment
  const index = comments.findIndex(comment => comment.id === commentId);
  comments[index] = {
    ...comment,
    content: req.body.content || comment.content,
    updated_at: new Date().toISOString()
  };
  
  // Enhance with user data
  const user = users.find(user => user.id === userId);
  const updatedComment = {
    ...comments[index],
    user: {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      profile_picture: user.profile_picture
    }
  };
  
  res.status(200).json({
    success: true,
    data: updatedComment
  });
});

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const userId = req.header('X-User-Id');
  const commentId = req.params.id;
  
  // Check authentication
  if (!userId) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
  
  const comment = comments.find(comment => comment.id === commentId);
  
  if (!comment) {
    return next(new ErrorResponse(`Comment not found with id of ${commentId}`, 404));
  }
  
  // Check if user owns the comment
  if (comment.user_id !== userId) {
    return next(new ErrorResponse('Not authorized to delete this comment', 401));
  }
  
  // Delete comment
  const index = comments.findIndex(comment => comment.id === commentId);
  comments.splice(index, 1);
  
  res.status(200).json({
    success: true,
    data: {}
  });
});