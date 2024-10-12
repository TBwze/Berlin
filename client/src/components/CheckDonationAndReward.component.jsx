import React, { useEffect } from 'react';
import { useStateContext } from '../context';

const CheckDonationAndReward = ({ campaignId }) => {
  const { checkDonationAndReward, donationAmount, reward } = useStateContext();

  useEffect(() => {
    if (campaignId) {
      checkDonationAndReward(campaignId); // Fetch donation and reward when the component mounts
    }
  }, [campaignId]);

  return (
    <div>
      <h3>Check Your Donation and Reward</h3>
      {donationAmount === null ? ( // Display loading state until donation is fetched
        <p>Loading your donation...</p>
      ) : (
        <>
          <p>Your Donation Amount: {donationAmount} ETH</p>
          <p>Your Reward: {reward}</p>
        </>
      )}
    </div>
  );
};

export default CheckDonationAndReward;
