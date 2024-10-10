import express from "express";
import {
    addReply,
    createComment,
    deleteComment,
    deleteReply,
    getComments,
    likeComment,
    likeReply,
} from "../controller/CommentController.js";

const router = express.Router();

// Routes for managing comments
router.post("/", createComment);
router.get("/:campaignId", getComments);
router.delete("/:commentId", deleteComment);

// Routes for managing replies
router.post("/:commentId/replies", addReply);
router.delete("/:commentId/replies/:replyId", deleteReply);

// Routes for liking comments and replies
router.post("/:commentId/like", likeComment);
router.post("/:commentId/replies/:replyId/like", likeReply);

export default router;
