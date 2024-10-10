
export const createComment = async (req, res) => {
    try {
        const { campaignId, user, content } = req.body;
        const newComment = new Comment({ campaignId, user, content });
        await newComment.save();
        return res.status(201).json(newComment);
    } catch (error) {
        return res.status(500).json({ message: "Error creating comment" });
    }
};

// Get all comments for a campaign
export const getComments = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const comments = await Comment.find({ campaignId });
        return res.status(200).json(comments);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching comments" });
    }
};

// Add a reply to a comment
export const addReply = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { user, content } = req.body;
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        comment.replies.push({ user, content });
        await comment.save();
        return res.status(201).json(comment);
    } catch (error) {
        return res.status(500).json({ message: "Error adding reply" });
    }
};

// Like a comment
export const likeComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { userId } = req.body; // User ID or username

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (!comment.likes.includes(userId)) {
            comment.likes.push(userId);
            await comment.save();
        }

        return res.status(200).json(comment);
    } catch (error) {
        return res.status(500).json({ message: "Error liking comment" });
    }
};

// Like a reply
export const likeReply = async (req, res) => {
    try {
        const { commentId, replyId } = req.params;
        const { userId } = req.body;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        const reply = comment.replies.id(replyId);
        if (!reply) {
            return res.status(404).json({ message: "Reply not found" });
        }

        if (!reply.likes.includes(userId)) {
            reply.likes.push(userId);
            await comment.save();
        }

        return res.status(200).json(comment);
    } catch (error) {
        return res.status(500).json({ message: "Error liking reply" });
    }
};

// Delete a comment
export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        await Comment.findByIdAndDelete(commentId);
        return res
            .status(200)
            .json({ message: "Comment deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting comment" });
    }
};

// Delete a reply
export const deleteReply = async (req, res) => {
    try {
        const { commentId, replyId } = req.params;
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        comment.replies = comment.replies.filter(
            (reply) => !reply._id.equals(replyId)
        );
        await comment.save();
        return res.status(200).json(comment);
    } catch (error) {
        return res.status(500).json({ message: "Error deleting reply" });
    }
};
