import React, { useContext, createContext, useState } from "react";
import {
  useAddress,
  useContract,
  useConnect,
  metamaskWallet,
  // useContractWrite,
  useSigner
} from "@thirdweb-dev/react";
import dayjs from "dayjs";
import { getAccountByWallet } from "../api/User/getUserByWallet.api";
import { formatDate } from "../utils/date.utils";
import { ethToWei, weiToEth } from "../utils/convertEth.utils";
import { formatResponse } from "../utils/response";
import { calculatePagination } from "../utils/pagination";

const stateContext = createContext();
const metamaskConfig = metamaskWallet();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract("0xab51D0b2e42fECCD9224EB0d6314850F0e8D427B");
  // const { mutateAsync: createCampaignWrite } = useContractWrite(contract, "createCampaign");

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

      // Using contract.call instead of useContractWrite
      const result = await contract.call("createCampaign", [
        title,
        description,
        targetInWei,
        deadlineTimestamp,
        image,
        formattedRewards
      ]);

      return result;
    } catch (error) {
      throw new Error("Failed to create campaign");
    }
  };

  // const publishCampaign = async (form) => {
  //   try {
  //     const { title, description, targetAmount, deadline, image, rewards } = form;

  //     if (!title || !description || !targetAmount || !deadline || !image || rewards.length === 0) {
  //       throw new Error("Fill in all fields!");
  //     }

  //     if (!signer || !address) {
  //       await connect(metamaskConfig);
  //     }

  //     if (!signer || !address) {
  //       throw new Error("Wallet not connected. Please try connecting again.");
  //     }

  //     const targetInWei = ethToWei(targetAmount);
  //     const deadlineTimestamp = dayjs().add(deadline, "day").unix();

  //     const formattedRewards = rewards.map((reward) => ({
  //       minAmount: ethToWei(reward.minAmount),
  //       description: reward.description
  //     }));

  //     const result = await createCampaignWrite({
  //       args: [title, description, targetInWei, deadlineTimestamp, image, formattedRewards]
  //     });

  //     return result;
  //   } catch (error) {
  //     throw new Error("Failed to create campaign");
  //   }
  // };

  const getAccountUsername = async (wallet) => {
    try {
      const response = await getAccountByWallet(wallet);
      return response.data.username;
    } catch (error) {
      throw new Error("Failed to get username");
    }
  };

  const parseCampaignData = (campaignArray) => {
    return {
      campaignId: campaignArray[0],
      owner: campaignArray[1],
      title: campaignArray[2],
      description: campaignArray[3],
      targetAmount: campaignArray[4],
      deadline: campaignArray[5],
      amountCollected: campaignArray[6],
      image: campaignArray[7],
      rewards: campaignArray[8],
      donors: campaignArray[9],
      exists: campaignArray[10]
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
        paginatedCampaigns.map(async (campaign) => {
          const owner = await getAccountUsername(campaign.owner);
          return {
            id: campaign.campaignId,
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
        donators,
        isWithdraw
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
        donators: donators,
        isWithdraw: isWithdraw
      };

      return formatResponse(formattedCampaign);
    } catch (error) {
      throw new Error("Failed to get Campaign");
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
      throw new Error("Failed to donate");
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
      throw new Error("Failed to get user donation");
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
      throw new Error("Failed to get user reward");
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
      throw new Error("Failed to refund");
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
      const leaderboard = await contract.call("getLeaderboard", [campaignId]);

      // Transform the response using weiToEth
      const formattedData = leaderboard[0].map((address, index) => ({
        address: address,
        amount: parseFloat(weiToEth(leaderboard[1][index])) // Using your weiToEth function
      }));

      // Sort by amount in descending order
      formattedData.sort((a, b) => b.amount - a.amount);

      // Calculate pagination values
      const totalRows = formattedData.length;
      const totalPages = Math.ceil(totalRows / limit);
      const startIndex = page * limit;
      const endIndex = startIndex + limit;

      // Get the paginated data
      const paginatedData = formattedData.slice(startIndex, endIndex);

      const pagination = {
        page,
        limit,
        total_pages: totalPages,
        total_rows: totalRows
      };
      return formatResponse(paginatedData, pagination);
    } catch (error) {
      return formatResponse([], { page: 0, limit: 10, total_pages: 0, total_rows: 0 });
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
      throw new Error("Failed to withdraw funds");
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
      throw new Error("Failed to delete campaign");
    }
  };
  const deleteUserCampaign = async (userId) => {
    try {
      if (!signer || !address) {
        await connect(metamaskConfig);
      }

      if (!signer || !address) {
        throw new Error("Wallet not connected. Please try connecting again.");
      }

      const transaction = await contract.call("deleteAllOwnerCampaigns", [userId]);

      return transaction;
    } catch (error) {
      throw new Error("Failed to delete campaign");
    }
  };

  const getCampaignDonators = async (campaignId, page = 0, limit = 10) => {
    try {
      if (!signer || !address) {
        await connect(metamaskConfig);
      }

      if (!signer || !address) {
        throw new Error("Wallet not connected. Please try connecting again.");
      }

      const data = await contract.call("getDonorsWithRewards", campaignId);
      const [tiers, addresses, amounts] = data;

      // First, flatten all data into single array of donor objects
      const flatDonors = [];
      tiers.forEach((tier, tierIndex) => {
        addresses[tierIndex].forEach((address, addressIndex) => {
          flatDonors.push({
            tier,
            address,
            amount: amounts[tierIndex][addressIndex]
              ? weiToEth(amounts[tierIndex][addressIndex])
              : null
          });
        });
      });

      // Calculate pagination values
      const totalRows = flatDonors.length;
      const totalPages = Math.ceil(totalRows / limit);
      const startIndex = page * limit;
      const endIndex = startIndex + limit;

      // Get paginated slice of donors
      const paginatedDonors = flatDonors.slice(startIndex, endIndex);

      // Group paginated donors by tier
      const groupedByTier = paginatedDonors.reduce((acc, donor) => {
        const existingTier = acc.find((t) => t.tier === donor.tier);

        if (existingTier) {
          existingTier.addresses.push(donor.address);
          existingTier.amounts.push(donor.amount);
        } else {
          acc.push({
            tier: donor.tier,
            addresses: [donor.address],
            amounts: [donor.amount]
          });
        }

        return acc;
      }, []);

      return formatResponse(groupedByTier, {
        page,
        limit,
        total_pages: totalPages,
        total_rows: totalRows
      });
    } catch (error) {
      console.error("Error fetching eligible rewards:", error);
      return formatResponse([], { page: 0, limit: 10, total_pages: 0, total_rows: 0 });
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
        deleteCampaign,
        deleteUserCampaign,
        getCampaignDonators
      }}>
      {children}
    </stateContext.Provider>
  );
};

export const useStateContext = () => useContext(stateContext);
