import React, { useContext, createContext, useState } from "react";
import {
  useAddress,
  useContract,
  useConnect,
  metamaskWallet,
  useContractWrite,
  useSigner
} from "@thirdweb-dev/react";
import dayjs from "dayjs";
import { getAccountByWallet } from "../api/User/getUserByWallet.api";
import { formatDate } from "../utils/date.utils";
import { ethToWei, weiToEth } from "../utils/convertEth.utils";
import { formatErrorResponse, formatResponse } from "../utils/response";
import { calculatePagination } from "../utils/pagination";

const stateContext = createContext();
const metamaskConfig = metamaskWallet();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract("0xd8146A621Ed0b7AF5aB1d683e24Ae6510f543A98");
  const { mutateAsync: createCampaignWrite } = useContractWrite(contract, "createCampaign");

  const address = useAddress();
  const connect = useConnect();
  const signer = useSigner();

  const publishCampaign = async (form) => {
    try {
      const { title, description, targetAmount, deadline, image, rewards } = form;

      if (!title || !description || !targetAmount || !deadline || !image || rewards.length === 0) {
        throw new Error("Fill in all fields!");
      }

      if (!signer || !address) {
        await connect(metamaskConfig);
      }

      if (!signer || !address) {
        throw new Error("Wallet not connected. Please try connecting again.");
      }

      const targetInWei = ethToWei(targetAmount);
      const deadlineTimestamp = dayjs().add(deadline, "day").unix();

      const formattedRewards = rewards.map((reward) => ({
        minAmount: ethToWei(reward.minAmount),
        description: reward.description
      }));

      const tx = await createCampaignWrite({
        args: [title, description, targetInWei, deadlineTimestamp, image, formattedRewards],
        signer: signer
      });

      await tx.wait();

      return tx;
    } catch (error) {
      console.error("Contract call failed!", error);
      throw new Error("Failed to create campaign");
    }
  };

  const getAccountUsername = async (wallet) => {
    try {
      const response = await getAccountByWallet(wallet);
      return response.data.username;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const parseCampaignData = (campaignArray) => {
    return {
      owner: campaignArray[0],
      title: campaignArray[1],
      description: campaignArray[2],
      targetAmount: campaignArray[3],
      deadline: campaignArray[4],
      amountCollected: campaignArray[5],
      image: campaignArray[6],
      rewards: campaignArray[7],
      donors: campaignArray[8],
      exists: campaignArray[9]
    };
  };

  const getCampaigns = async (page = 0, limit = 10, searchQuery = "", isOwner = false) => {
    try {
      if (!signer || !address) {
        await connect(metamaskConfig);
      }

      if (!signer || !address) {
        throw new Error("Wallet not connected. Please try connecting again.");
      }

      const rawCampaigns = await contract.call("getAllCampaigns");

      // Parse the raw campaign data
      let campaigns = rawCampaigns.map(parseCampaignData);

      // Filter by owner if required
      if (isOwner) {
        campaigns = campaigns.filter(
          (campaign) => campaign.owner.toLowerCase() === address.toLowerCase()
        );
      }

      // Filter by search query
      let filteredCampaigns = campaigns.filter((campaign) =>
        campaign.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Calculate pagination
      const totalItems = filteredCampaigns.length;
      const pagination = calculatePagination(totalItems, page, limit);

      // Apply pagination
      const paginatedCampaigns = filteredCampaigns.slice(
        pagination.page * pagination.limit,
        pagination.page * pagination.limit + pagination.limit
      );

      // Parse and format the campaign data
      const parsedCampaigns = await Promise.all(
        paginatedCampaigns.map(async (campaign, index) => {
          const owner = await getAccountUsername(campaign.owner);
          return {
            id: index + 1 + pagination.page * pagination.limit,
            wallet: campaign.owner,
            owner,
            title: campaign.title,
            targetAmount: weiToEth(campaign.targetAmount.hex || campaign.targetAmount),
            amountCollected: weiToEth(campaign.amountCollected.hex || campaign.amountCollected),
            deadline: formatDate(campaign.deadline.hex || campaign.deadline),
            imageUrl: campaign.image,
            exists: campaign.exists,
            description: campaign.description,
            rewards: campaign.rewards.map((reward) => ({
              minAmount: weiToEth(reward[0].hex || reward[0]),
              description: reward[1]
            }))
          };
        })
      );
      return formatResponse(parsedCampaigns, pagination);
    } catch (error) {
      return formatResponse([], { page: 0, limit: 10, total_rows: 0, total_pages: 0 });
    }
  };

  const getCampaignById = async (id) => {
    try {
      const response = await contract.call("getCampaign", id);
      const [
        owner,
        title,
        description,
        targetAmount,
        deadline,
        amountCollected,
        image,
        rewards,
        donators
      ] = response;

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
        })),
        donators: donators
      };

      return formatResponse(formattedCampaign);
    } catch (error) {
      return formatErrorResponse(error);
    }
  };

  const donateToCampaign = async (campaignId, amount) => {
    try {
      if (!signer || !address) {
        await connect(metamaskConfig);
      }

      if (!signer || !address) {
        throw new Error("Wallet not connected. Please try connecting again.");
      }
      const transaction = await contract.call("donateToCampaign", campaignId, {
        value: ethToWei(amount.toString())
      });
    } catch (error) {
      return formatErrorResponse(error);
    }
  };

  const fetchUserDonation = async (campaignId) => {
    try {
      if (!signer || !address) {
        await connect(metamaskConfig);
      }

      if (!signer || !address) {
        throw new Error("Wallet not connected. Please try connecting again.");
      }

      const donation = await contract.call("donations", [campaignId, address]);
      const donationEth = weiToEth(donation);
      return formatResponse(donation == 0 ? donation : donationEth);
    } catch (error) {
      return formatErrorResponse(error);
    }
  };
  const fetchUserReward = async (campaignId) => {
    try {
      if (!signer || !address) {
        await connect(metamaskConfig);
      }

      if (!signer || !address) {
        throw new Error("Wallet not connected. Please try connecting again.");
      }
      const rewardTier = await contract.call("getRewardTier", [campaignId, address]);
      return formatResponse(rewardTier);
    } catch (error) {
      return formatErrorResponse(error);
    }
  };

  const refundDonation = async (campaignId) => {
    try {
      if (!signer || !address) {
        await connect(metamaskConfig);
      }

      if (!signer || !address) {
        throw new Error("Wallet not connected. Please try connecting again.");
      }

      const transaction = await contract.call("refundDonation", [campaignId]);
      return transaction;
    } catch (error) {
      return formatErrorResponse(error);
    }
  };

  const getLeaderboard = async (campaignId, page = 0, limit = 10) => {
    try {
      if (!signer || !address) {
        await connect(metamaskConfig);
      }

      if (!signer || !address) {
        throw new Error("Wallet not connected. Please try connecting again.");
      }

      // Get leaderboard data from contract
      const [donors, donationAmounts] = await contract.call("getLeaderboard", [campaignId]);

      // Create full leaderboard array
      const fullLeaderboard = await Promise.all(
        donors.map((donor, index) =>
          formatLeaderboardEntry(donor, donationAmounts[index], index + 1)
        )
      );

      // Sort by amount in descending order (in case it's not already sorted)
      fullLeaderboard.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));

      // Calculate pagination
      const totalItems = fullLeaderboard.length;
      const pagination = calculatePagination(totalItems, page, limit);

      // Slice the data according to pagination
      const paginatedData = fullLeaderboard.slice(
        pagination.page * pagination.limit,
        pagination.page * pagination.limit + pagination.limit
      );

      // Return formatted response
      return formatResponse(paginatedData, pagination);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      return formatResponse([], { page: 0, limit: 10, total_rows: 0, total_pages: 0 });
    }
  };

  const withdrawFunds = async (campaignId) => {
    try {
      if (!signer || !address) {
        await connect(metamaskConfig);
      }

      if (!signer || !address) {
        throw new Error("Wallet not connected. Please try connecting again.");
      }

      const transaction = await contract.call("withdrawFunds", [campaignId]);

      return transaction;
    } catch (error) {
      return formatErrorResponse(error);
    }
  };

  const deleteCampaign = async (campaignId) => {
    try {
      if (!signer || !address) {
        await connect(metamaskConfig);
      }

      if (!signer || !address) {
        throw new Error("Wallet not connected. Please try connecting again.");
      }

      const transaction = await contract.call("deleteCampaign", [campaignId]);

      return transaction;
    } catch (error) {
      return formatErrorResponse(error);
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
        refundDonation,
        getLeaderboard,
        withdrawFunds,
        deleteCampaign
      }}>
      {children}
    </stateContext.Provider>
  );
};

export const useStateContext = () => useContext(stateContext);
