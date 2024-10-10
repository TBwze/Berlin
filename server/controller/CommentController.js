import { Comment } from "../model/Comment.js";

export const createComment = async (request, response) => {
    try {
        const { campaignId, user, content } = request.body;

        if (!campaignId || !user || !content) {
            return response.status(400).send({
                message: "Send all required fields!",
            });
        }

        const newComment = {
            campaignId,
            user,
            content,
        };

        const comment = await Comment.create(newComment);

        return response.status(201).send(comment);
    } catch (error) {
        return response.status(500).send({
            message: error.message,
        });
    }
};

// Get all comments for a campaign
export const getComments = async (request, response) => {
    try {
        const { campaignId } = request.params;
        const comments = await Comment.find({ campaignId });
        return response.status(200).json(comments);
    } catch (error) {
        return response
            .status(500)
            .json({ message: "Error fetching comments" });
    }
};

// Add a reply to a comment
export const addReply = async (request, response) => {
    try {
        const { commentId } = request.params;
        const { user, content } = request.body;
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return response.status(404).json({ message: "Comment not found" });
        }

        comment.replies.push({ user, content });
        await comment.save();
        return response.status(201).json(comment);
    } catch (error) {
        return response.status(500).json({ message: "Error adding reply" });
    }
};

// Like a comment
export const likeComment = async (request, response) => {
    try {
        const { commentId } = request.params;
        const { userId } = request.body;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return response.status(404).json({ message: "Comment not found" });
        }
        if (!userId) {
            return response.status(404).json({ message: "User not found" });
        }

        if (!comment.likes.includes(userId)) {
            comment.likes.push(userId);
            await comment.save();
        }

        return response.status(200).json(comment);
    } catch (error) {
        return response.status(500).json({ message: "Error liking comment" });
    }
};

// Like a reply
export const likeReply = async (request, response) => {
    try {
        const { commentId, replyId } = request.params;
        const { userId } = request.body;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return response.status(404).json({ message: "Comment not found" });
        }

        const reply = comment.replies.id(replyId);
        if (!reply) {
            return response.status(404).json({ message: "Reply not found" });
        }

        if (!reply.likes.includes(userId)) {
            reply.likes.push(userId);
            await comment.save();
        }

        return response.status(200).json(comment);
    } catch (error) {
        return response.status(500).json({ message: "Error liking reply" });
    }
};

// Delete a comment
export const deleteComment = async (request, response) => {
    try {
        const { commentId } = request.params;
        await Comment.findByIdAndDelete(commentId);
        return response
            .status(200)
            .json({ message: "Comment deleted successfully" });
    } catch (error) {
        return response.status(500).json({ message: "Error deleting comment" });
    }
};

// Delete a reply
export const deleteReply = async (request, response) => {
    try {
        const { commentId, replyId } = request.params;
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return response.status(404).json({ message: "Comment not found" });
        }

        comment.replies = comment.replies.filter(
            (reply) => !reply._id.equals(replyId)
        );
        await comment.save();
        return response.status(200).json(comment);
    } catch (error) {
        return response.status(500).json({ message: "Error deleting reply" });
    }
};
