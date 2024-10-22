import { Comment } from "../model/Comment.js";
import { User } from "../model/User.js";

export const postComment = async (req, res) => {
    try {
        const { campaignId, user, content, parentId } = req.body;

        const newComment = new Comment({
            campaignId,
            user,
            content,
            parentId: parentId || null,
        });

        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: "Error posting comment" });
    }
};

// Get all comments for a campaign
const buildNestedComments = (comments, parentId = null) => {
    const nestedComments = [];

    // Filter comments based on parentId
    const filteredComments = comments.filter((comment) => {
        return parentId === null
            ? !comment.parentId
            : comment.parentId?.toString() === parentId.toString();
    });

    // For each comment, recursively build its nested replies
    for (const comment of filteredComments) {
        nestedComments.push({
            ...comment.toObject(),
            replies: buildNestedComments(comments, comment._id),
        });
    }

    return nestedComments;
};

export const getComments = async (req, res) => {
    try {
        const { campaignId } = req.params;

        // Fetch comments for the specified campaign and sort by createdAt in descending order
        const comments = await Comment.find({ campaignId }).sort({
            createdAt: -1,
        });

        // Function to get user details and include them in comments and replies
        const attachUserDetails = async (comment) => {
            const user = await User.findOne({ wallet: comment.user });
            const userDetails = user
                ? {
                      profilePicture: user.profilePicture,
                      username: user.username,
                  }
                : { profilePicture: null, username: null };

            const repliesWithUserDetails = await Promise.all(
                comment.replies.map(attachUserDetails)
            );

            return {
                ...comment,
                ...userDetails,
                replies: repliesWithUserDetails,
            };
        };

        const nestedComments = buildNestedComments(comments);
        const commentsWithUserDetails = await Promise.all(
            nestedComments.map(attachUserDetails)
        );

        return res.status(200).json(commentsWithUserDetails);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching comments" });
    }
};

export const likeComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { userId } = req.body; // Expecting a userId (wallet address or username) in the request body

        // Find the comment by its ID
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Check if the user has already liked the comment
        if (!comment.likes.includes(userId)) {
            comment.likes.push(userId);
            await comment.save();
        }

        return res.status(200).json(comment);
    } catch (error) {
        return res.status(500).json({ message: "Error liking the comment" });
    }
};
export const unlikeComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { userId } = req.body;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        const index = comment.likes.indexOf(userId);
        if (index === -1) {
            return res
                .status(400)
                .json({ message: "User has not liked this comment" });
        }

        comment.likes.splice(index, 1);
        await comment.save();
        return res.status(200).json({
            message: "Comment unliked successfully",
            likes: comment.likes,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error unliking comment" });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        // Find the comment by its ID
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Delete the comment and all its nested replies using a single query
        await Comment.deleteMany({
            $or: [{ _id: commentId }, { parentId: commentId }],
        });

        return res
            .status(200)
            .json({ message: "Comment and its replies deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting the comment" });
    }
};
