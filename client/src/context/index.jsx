import React, { useContext, createContext } from "react";
import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
  useSigner,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import dayjs from "dayjs";

const stateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(
    "0x4AdeDAe205840c757e5824682c8F82537C6ECB8f"
  );
  const { mutateAsync: createCampaignWrite } = useContractWrite(
    contract,
    "createCampaign"
  );

  const address = useAddress();
  const connect = useMetamask();
  const signer = useSigner();

  const publishCampaign = async (form) => {
    try {
      const { title, description, targetAmount, deadline, image, rewards } = form;
  
      if (!title || !description || !targetAmount || !deadline || !image || rewards.length === 0) {
        throw new Error("Fill in all fields!");
      }
  
      const targetInWei = ethers.utils.parseEther(targetAmount);
      const deadlineTimestamp = dayjs().add(deadline, "day").format("YYYY-MM-DD");
  
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
          formattedRewards, // Pass array of rewards into contract
        ],
        signer: signer,
      });
  
      console.log("Contract call success!", data);
    } catch (error) {
      console.error("Contract call failed!", error);
      throw new Error("Failed to create campaign");
    }
  };

  return (
    <stateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,

      }}
    >
      {children}
    </stateContext.Provider>
  );
};

export const useStateContext = () => useContext(stateContext);
