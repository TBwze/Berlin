import React, { useContext, createContext, useState } from 'react';
import {
  useAddress,
  useContract,
  useConnect,
  metamaskWallet,
  useContractWrite,
  useSigner
} from '@thirdweb-dev/react';
import dayjs from 'dayjs';
import { getAccountByWallet } from '../api/User/getUserByWallet.api';
import { formatDate } from '../utils/date.utils';
import { ethToWei, weiToEth } from '../utils/convertEth.utils';

const stateContext = createContext();
const metamaskConfig = metamaskWallet();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract('0x7874f2DF36a6893715aADE2a598f357898f5B7C6');
  const { mutateAsync: createCampaignWrite } = useContractWrite(contract, 'createCampaign');

  const address = useAddress();
  const connect = useConnect();
  const signer = useSigner();

  const publishCampaign = async (form) => {
    try {
      const { title, description, targetAmount, deadline, image, rewards } = form;

      if (!title || !description || !targetAmount || !deadline || !image || rewards.length === 0) {
        throw new Error('Fill in all fields!');
      }

      if (!signer || !address) {
        await connect(metamaskConfig);
      }

      if (!signer || !address) {
        throw new Error('Wallet not connected. Please try connecting again.');
      }

      const targetInWei = ethToWei(targetAmount);
      const deadlineTimestamp = dayjs().add(deadline, 'day').unix();

      const formattedRewards = rewards.map((reward) => ({
        minAmount: ethToWei(reward.minAmount),
        description: reward.description
      }));

      const data = await createCampaignWrite({
        args: [title, description, targetInWei, deadlineTimestamp, image, formattedRewards],
        signer: signer
      });

      console.log('Contract call success!', data);
    } catch (error) {
      console.error('Contract call failed!', error);
      throw new Error('Failed to create campaign');
    }
  };

  const getAccountUsername = async (wallet) => {
    try {
      const response = await getAccountByWallet(wallet);
      return response.username;
    } catch (error) {
      alert(error);
      throw new Error('Failed to fetch account username');
    }
  };

  const getCampaigns = async () => {
    try {
      const campaigns = await contract.call('getAllCampaigns');
      const parsedCampaigns = await Promise.all(
        campaigns.map(async (campaign, index) => {
          const owner = await getAccountUsername(campaign.owner);
          return {
            id: index + 1,
            wallet: campaign.owner,
            owner,
            title: campaign.title,
            targetAmount: weiToEth(campaign.targetAmount),
            amountCollected: weiToEth(campaign.amountCollected),
            deadline: formatDate(campaign.deadline),
            imageUrl: campaign.image || 'default-image-url.jpg'
          };
        })
      );

      return parsedCampaigns;
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
      return [];
    }
  };

  const getCampaignById = async (id) => {
    try {
      const response = await contract.call('getCampaign', id);
      const [owner, title, description, targetAmount, deadline, amountCollected, image, rewards] =
        response;
      const username = await getAccountUsername(owner);
      const formattedCampaign = {
        owner: owner,
        username: username,
        title: title,
        description: description,
        targetAmount: weiToEth(targetAmount),
        amountCollected: weiToEth(amountCollected),
        deadline: formatDate(deadline),
        imageUrl: image,
        rewards: rewards.map((reward) => ({
          minAmount: weiToEth(reward.minAmount),
          description: reward.description
        }))
      };
      return formattedCampaign;
    } catch (error) {
      throw new Error('Error fetching campaign by ID');
    }
  };

  const donateToCampaign = async (campaignId, amount) => {
    try {
      if (!signer || !address) {
        await connect(metamaskConfig);
      }

      if (!signer || !address) {
        throw new Error('Wallet not connected. Please try connecting again.');
      }
      const transaction = await contract.call('donateToCampaign', campaignId, {
        value: ethToWei(amount.toString())
      });

      console.log('Donation successful!', transaction);
    } catch (error) {
      console.error('Donation failed!', error);
      throw new Error('Failed to donate to campaign');
    }
  };

  const fetchUserDonation = async (campaignId) => {
    if (!signer || !address) {
      await connect(metamaskConfig);
    }

    if (!signer || !address) {
      throw new Error('Wallet not connected. Please try connecting again.');
    }

    try {
      const donation = await contract.call('donations', [campaignId, address]);
      const donationEth = weiToEth(donation);
      return donation == 0 ? donation : donationEth;
    } catch (error) {
      console.error('Error fetching donation:', error);
      return 0;
    }
  };
  const fetchUserReward = async (campaignId) => {
    if (!signer || !address) {
      await connect(metamaskConfig);
    }

    if (!signer || !address) {
      throw new Error('Wallet not connected. Please try connecting again.');
    }

    try {
      const donationEth = await fetchUserDonation(campaignId);
      const userDonation = donationEth == 0 ? donationEth : ethToWei(donationEth);

      if (!userDonation || userDonation === '0') {
        console.error('No donation amount found for this campaign.');
        return null;
      }

      const rewardTier = await contract.call('getRewardTier', [campaignId, userDonation]);
      return rewardTier;
    } catch (error) {
      console.error('Error fetching reward tier:', error);
      return null;
    }
  };

  const refundDonation = async (campaignId) => {
    try {
      if (!signer || !address) {
        await connect(metamaskConfig);
      }

      if (!signer || !address) {
        throw new Error('Wallet not connected. Please try connecting again.');
      }

      const transaction = await contract.call('refundDonation', [campaignId]);

      console.log('Refund successful!', transaction);
      return transaction;
    } catch (error) {
      console.error('Refund failed!', error);
      throw new Error('Failed to refund donation');
    }
  };

  return (
    <stateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getCampaignById,
        donateToCampaign,
        fetchUserDonation,
        fetchUserReward,
        refundDonation
      }}>
      {children}
    </stateContext.Provider>
  );
};

export const useStateContext = () => useContext(stateContext);
