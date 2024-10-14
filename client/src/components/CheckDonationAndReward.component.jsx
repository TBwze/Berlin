import React, { useEffect, useState } from 'react';
import { useStateContext } from '../context';
import silverBadge from '../assets/silver.png';
import goldBadge from '../assets/gold.png';
import bronzeBadge from '../assets/bronze.png';

const DonationDetails = ({ campaignId, username, profilePicture }) => {
  const { fetchUserDonation, fetchUserReward, address, getCampaignById } = useStateContext();
  const [donationAmount, setDonationAmount] = useState(null);
  const [rewardTier, setRewardTier] = useState(null);
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const donation = await fetchUserDonation(campaignId);
      setDonationAmount(donation);
      const reward = await fetchUserReward(campaignId);
      setRewardTier(reward);
    };

    if (address && campaignId) {
      fetchData();
    }
  }, [campaignId, address]);

  useEffect(() => {
    const fetchRewards = async () => {
      const campaignData = await getCampaignById(campaignId);
      setRewards(campaignData.rewards);
    };

    if (campaignId) {
      fetchRewards();
    }
  }, [campaignId]);

  const getBadgeInfo = (tier) => {
    if (!tier) return { image: null, name: '' };

    const matchingReward = rewards.find((reward) => reward.description === tier);
    if (!matchingReward) return { image: null, name: '' };

    const index = rewards.indexOf(matchingReward);
    let badgeImage;
    let badgeName;

    switch (rewards.length - index) {
      case 1:
        badgeImage = goldBadge;
        badgeName = 'Gold';
        break;
      case 2:
        badgeImage = silverBadge;
        badgeName = 'Silver';
        break;
      case 3:
        badgeImage = bronzeBadge;
        badgeName = 'Bronze';
        break;
      default:
        badgeImage = null;
        badgeName = '';
    }

    return { image: badgeImage, name: badgeName };
  };

  const { image: badgeImage, name: badgeName } = getBadgeInfo(rewardTier);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto mt-8">
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
          <strong className="text-gray-800">Amount Donated:</strong>{' '}
          {donationAmount ? `${donationAmount} ETH` : '0 ETH'}
        </p>
      </div>
      <div className="bg-gray-100 p-4 rounded-md">
        {badgeImage && rewardTier ? (
          <div className="flex items-center">
            <p className="text-black">
              <strong className="text-gray-800">Reward Tier:</strong> {badgeName}
            </p>
            <img src={badgeImage} alt={badgeName} className="w-10 h-10 mr-2" />
          </div>
        ) : (
          <p className="text-gray-600">Your donation isn't enough for a reward.</p>
        )}
      </div>
    </div>
  );
};

export default DonationDetails;
