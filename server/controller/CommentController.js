import calculatePagination from "../helper/pagination.js";
import {
    handleErrorResponse,
    handleResponsePagination,
    handleSuccessResponse,
} from "../helper/Response.js";
import { Comment } from "../model/Comment.js";
import { User } from "../model/User.js";

export const postComment = async (request, response) => {
    try {
        const { campaignId, user, content, parentId } = request.body;

        const newComment = new Comment({
            campaignId,
            user,
            content,
            parentId: parentId || null,
        });

        await newComment.save();
        return handleSuccessResponse(response, 201, "Success");
    } catch (error) {
        return handleErrorResponse(response, 500, "An error occured");
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

export const getComments = async (request, response) => {
    try {
        const { campaignId } = request.params;
        const { page, limit } = request.query;

        const parsedPage = parseInt(page) || 0;
        const parsedLimit = parseInt(limit) || 10;

        const comments = await Comment.find({ campaignId })
            .sort({ createdAt: -1 })
            .skip(parsedPage * parsedLimit)
            .limit(parsedLimit);

        const totalItems = await Comment.countDocuments({ campaignId });

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
        const pagination = calculatePagination(
            parsedPage,
            parsedLimit,
            totalItems
        );
        return handleResponsePagination(
            pagination.page,
            pagination.page_limit,
            pagination.total_pages,
            pagination.total_rows,
            response,
            200,
            "Success",
            commentsWithUserDetails
        );
    } catch (error) {
        return handleErrorResponse(response, 500, "An error occured");
    }
};

export const likeComment = async (request, response) => {
    try {
        const { commentId } = request.params;
        const { userId } = request.body;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return handleErrorResponse(response, 404, "Comment not found");
        }

        if (!comment.likes.includes(userId)) {
            comment.likes.push(userId);
            await comment.save();
        }
        return handleSuccessResponse(response, 200, "Success", comment);
    } catch (error) {
        return handleErrorResponse(response, 500, "An error occured");
    }
};
export const unlikeComment = async (request, response) => {
    try {
        const { commentId } = request.params;
        const { userId } = request.body;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return handleErrorResponse(response, 404, "Comment not found");
        }

        const index = comment.likes.indexOf(userId);
        if (index === -1) {
            return handleErrorResponse(
                response,
                400,
                "User has not liked this comment"
            );
        }

        comment.likes.splice(index, 1);
        await comment.save();
        return handleSuccessResponse(response, 200, "Success", comment.likes);
    } catch (error) {
        return handleErrorResponse(response, 500, "An error occured");
    }
};

export const deleteComment = async (request, response) => {
    try {
        const { commentId } = request.params;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return handleErrorResponse(response, 404, "Comment not found");
        }

        await Comment.deleteMany({
            $or: [{ _id: commentId }, { parentId: commentId }],
        });

        return handleSuccessResponse(response, 200, "Success", null);
    } catch (error) {
        return handleErrorResponse(response, 500, "An error occured");
    }
};
