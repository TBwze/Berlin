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
        type: [String], // Array of user identifiers who liked the comment
        default: [],
    },
    replies: {
        type: [replySchema], // Array of replies using the default _id field
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Comment = mongoose.model("Comment", commentSchema);
