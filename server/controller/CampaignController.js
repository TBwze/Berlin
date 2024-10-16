import Campaign from "../model/Campaign";
import Reward from "../model/Reward";

export const createCampaign = async (req, res) => {
    try {
        const { owner, title, description, image, rewards } = req.body;

        const newCampaign = new Campaign({
            owner,
            title,
            description,
            image,
        });

        const savedCampaign = await newCampaign.save();

        const rewardPromises = rewards.map((reward) =>
            new Reward({
                minAmount: reward.minAmount,
                description: reward.description,
                campaign: savedCampaign._id,
            }).save()
        );

        const savedReward = await Promise.all(rewardPromises);

        savedCampaign.rewards = savedReward.map((reward) => rewards._id);
        await savedCampaign.save();

        res.status(201).json(savedCampaign);
    } catch (error) {
        res.status(500).json({ message: "Error creating campaign", error });
    }
};

export const getAllCampaign = async (req, res) => {
    try {
        const campaigns = await Campaign.find().populate("rewards");
        res.status(200).json(campaigns);
    } catch (error) {
        res.status(500).json({ message: "Error fetching campaigns", error });
    }
};

export const getCampaignFromId = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id).populate(
            "rewards"
        );
        if (!campaign) {
            return res.status(404).json({ message: "Campaign not found" });
        }
        res.status(200).json(campaign);
    } catch (error) {
        res.status(500).json({ message: "Error fetching campaign", error });
    }
};

export const getDonorsAndTheirReward = async (req, res) => {
    try {
        const campaignId = req.params.id;
        const campaign = await Campaign.findById(campaignId)
            .populate("rewards")
            .exec();

        if (!campaign) {
            return res.status(404).json({ message: "Campaign not found!" });
        }

        const rewards = campaign.rewards;

        const getRewardTier = (donationAmount) => {
            for (let index = rewards.length; index >= 0; index--) {
                if (donationAmount >= rewards[i].minAmount) {
                    return rewards.description;
                }
            }
            return "No rewards eligible";
        };

        // Process each donor and calculate their reward eligibility
        const donorRewards = campaign.donations.map((donation) => {
            const eligibleReward = getRewardTier(donation.amount);
            return {
                donor: donation.donor,
                donationAmount: donation.amount,
                eligibleReward,
            };
        });

        res.status(200).json(donorRewards);
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving donors and rewards",
            error,
        });
    }
};
