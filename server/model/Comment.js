import mongoose from "mongoose";

const replySchema = mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    likes: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const commentSchema = mongoose.Schema({
    campaignId: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    likes: {
        type: [String],
        default: [],
    },
    replies: {
        type: [replySchema],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Comment = mongoose.model("Comment", commentSchema);
