import React, { useContext, createContext, useState } from 'react';
import {
  useAddress,
  useContract,
  useConnect,
  metamaskWallet,
  useContractWrite,
  useSigner
} from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import dayjs from 'dayjs';
import { getAccountByWallet } from '../api/User/getUserByWallet.api';
import { formatDate } from '../utils/date.utils';

const stateContext = createContext();
const metamaskConfig = metamaskWallet();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract('0x4AdeDAe205840c757e5824682c8F82537C6ECB8f');
  const { mutateAsync: createCampaignWrite } = useContractWrite(contract, 'createCampaign');
  const [username, setUsername] = useState('');

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
        console.log('Wallet not connected, connecting now...');
        await connect(metamaskConfig);
      }

      if (!signer || !address) {
        throw new Error('Wallet not connected. Please try connecting again.');
      }

      const targetInWei = ethers.utils.parseEther(targetAmount);
      const deadlineTimestamp = dayjs().add(deadline, 'day').unix();

      const formattedRewards = rewards.map((reward) => ({
        minAmount: ethers.utils.parseEther(reward.minAmount),
        description: reward.description
      }));

      const data = await createCampaignWrite({
        args: [
          title,
          description,
          targetInWei,
          deadlineTimestamp,
          image,
          formattedRewards // Pass array of rewards into contract
        ],
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
            targetAmount: ethers.utils.formatEther(campaign.targetAmount),
            amountCollected: ethers.utils.formatEther(campaign.amountCollected),
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
        targetAmount: ethers.utils.formatEther(targetAmount),
        amountCollected: ethers.utils.formatEther(amountCollected),
        deadline: formatDate(deadline),
        imageUrl: image,
        rewards: rewards.map((reward) => ({
          minAmount: ethers.utils.formatEther(reward.minAmount),
          description: reward.description
        }))
      };
      return formattedCampaign;
    } catch (error) {
      throw new Error('Error fetching campaign by ID');
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
        getCampaignById
      }}>
      {children}
    </stateContext.Provider>
  );
};

export const useStateContext = () => useContext(stateContext);
