// routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// Routes for managing comments
router.post('/comments', commentController.createComment);
router.get('/comments/:campaignId', commentController.getComments);
router.delete('/comments/:commentId', commentController.deleteComment);

// Routes for managing replies
router.post('/comments/:commentId/replies', commentController.addReply);
router.delete('/comments/:commentId/replies/:replyId', commentController.deleteReply);

// Routes for liking comments and replies
router.post('/comments/:commentId/like', commentController.likeComment);
router.post('/comments/:commentId/replies/:replyId/like', commentController.likeReply);

module.exports = router;
