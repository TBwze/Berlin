import mongoose from "mongoose";

const campaignSchema = mongoose.Schema(
    {
        owner: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        donations: [
            {
                donor: {
                    type: String,
                    required: true,
                },
                amount: {
                    type: Number,
                    required: true,
                },
            },
        ],
        rewards: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Reward",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Campaign = mongoose.model("Campaign", campaignSchema);
export default Campaign;
