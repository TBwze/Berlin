import React, { useEffect, useState } from "react";
import { useStateContext } from "../context";
import silverBadge from "../assets/silver.png";
import goldBadge from "../assets/gold.png";
import bronzeBadge from "../assets/bronze.png";

const DonationDetails = ({ campaignId, username, profilePicture }) => {
  const { fetchUserDonation, fetchUserReward, address } = useStateContext();
  const [donationAmount, setDonationAmount] = useState(null);
  const [rewardTier, setRewardTier] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const donation = await fetchUserDonation(campaignId);
      setDonationAmount(donation.data);
      const reward = await fetchUserReward(campaignId);
      setRewardTier(reward.data);
    };

    if (address && campaignId) {
      fetchData();
    }
  }, [campaignId, address]);

  const getRewardBadge = (reward) => {
    switch (reward) {
      case "Gold":
        return <img src={goldBadge} alt="Gold Badge" className="w-8 h-8" />;
      case "Silver":
        return <img src={silverBadge} alt="Silver Badge" className="w-8 h-8" />;
      case "Bronze":
        return <img src={bronzeBadge} alt="Bronze Badge" className="w-8 h-8" />;
      default:
        return null;
    }
  };

  // Determine the badge image and name based on the reward tier
  const badgeImage = getRewardBadge(rewardTier);
  const badgeName = rewardTier;

  return (
    <div className="bg-white border-2 shadow-md rounded-lg p-6 max-w-lg mx-auto mt-8">
      <div className="flex items-center mb-4">
        <img
          src={profilePicture}
          alt={`${username}'s profile`}
          className="w-12 h-12 rounded-full mr-3"
        />
        <h2 className="text-xl font-semibold text-gray-800">{username}</h2>
      </div>
      <div className="bg-gray-100 p-4 rounded-md mb-4">
        <p className="text-gray-600">
          <strong className="text-gray-800">Amount Donated:</strong> {`${donationAmount} ETH`}
        </p>
      </div>
      <div className="bg-gray-100 p-4 rounded-md">
        {badgeImage && rewardTier ? (
          <div className="flex items-center justify-center">
            <p className="text-black">
              <strong className="text-gray-800 text-center">Reward Tier:</strong> {badgeName}
            </p>
            {badgeImage} {/* Use the badgeImage directly */}
          </div>
        ) : (
          <p className="text-gray-600">Your donation isn't enough for a reward.</p>
        )}
      </div>
    </div>
  );
};

export default DonationDetails;
