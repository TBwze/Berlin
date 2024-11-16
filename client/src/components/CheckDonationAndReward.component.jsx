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
        return { src: goldBadge, color: "text-yellow-600", bg: "bg-yellow-50" };
      case "Silver":
        return { src: silverBadge, color: "text-gray-600", bg: "bg-gray-50" };
      case "Bronze":
        return { src: bronzeBadge, color: "text-orange-600", bg: "bg-orange-50" };
      default:
        return null;
    }
  };

  const badgeInfo = getRewardBadge(rewardTier);

  return (
    <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-8 max-w-lg mx-auto mt-8 hover:shadow-xl transition-shadow duration-300">
      {/* Header Section */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative">
          <img
            src={profilePicture}
            alt={`${username}'s profile`}
            className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
          />
          {badgeInfo && (
            <div className="absolute -bottom-2 -right-2">
              <img
                src={badgeInfo.src}
                alt={`${rewardTier} Badge`}
                className="w-8 h-8 rounded-full shadow-sm"
              />
            </div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{username}</h2>
          <p className="text-sm text-gray-500">Campaign Supporter</p>
        </div>
      </div>

      {/* Donation Amount Card */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
          <p className="text-sm font-medium text-blue-600 mb-1">Total Contribution</p>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-blue-900">{donationAmount}</span>
            <span className="ml-1 text-lg font-medium text-blue-700">ETH</span>
          </div>
        </div>
      </div>

      {/* Reward Tier Section */}
      {badgeInfo ? (
        <div className={`${badgeInfo.bg} p-6 rounded-lg`}>
          <p className="text-sm font-medium mb-2 text-gray-600">Reward Tier</p>
          <div className="flex items-center justify-between">
            <span className={`text-xl font-bold ${badgeInfo.color}`}>{rewardTier} Supporter</span>
            <div className="flex items-center">
              <img src={badgeInfo.src} alt={`${rewardTier} Badge`} className="w-10 h-10" />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="text-center text-gray-500">Continue donating to earn reward badges!</p>
        </div>
      )}
    </div>
  );
};

export default DonationDetails;
