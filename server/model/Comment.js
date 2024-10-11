import mongoose from "mongoose";

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
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
export const Comment = mongoose.model("Comment", commentSchema);
