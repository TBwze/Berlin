import express from "express";
import {
    deleteComment,
    getComments,
    likeComment,
    postComment,
    unlikeComment,
} from "../controller/CommentController.js";

const router = express.Router();

// Routes for managing comments
router.post("/", postComment);
router.get("/:campaignId", getComments);
router.delete("/:commentId", deleteComment);
router.post("/:commentId/like", likeComment);
router.post("/:commentId/unlike", unlikeComment);
export default router;
