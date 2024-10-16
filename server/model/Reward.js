import mongoose from "mongoose";

const rewardSchema = mongoose.Schema(
    {
        minAmount: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        campaign: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campaign",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Reward = mongoose.model("Reward", rewardSchema);
export default Reward;
