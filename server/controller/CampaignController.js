import { User } from "../model/User";

const { ThirdwebSDK } = require("@thirdweb-dev/sdk");
const ethers = require("ethers");
const sdk = new ThirdwebSDK("sepolia");
const contractAddress = process.env.CONTRACT_ADDRESS;

let contract;

(async () => {
    contract = await sdk.getContract(contractAddress);
})();

const isValidAddress = (address) => {
    return ethers.utils.isAddress(address);
};

export const create = async (request, response) => {
    const {
        address,
        title,
        description,
        information,
        target,
        deadline,
        image,
    } = req.body;

    if (!isValidAddress(address)) {
        return response.status(400).json({
            message: "Invalid address",
        });
    }

    try {
        let owner = await User.findOne({ wallet: address });

        // Interact with the contract (e.g., call "createCampaign" function)
        const tx = await contract.call("createCampaign", [
            address,
            title,
            description,
            information,
            target,
            deadline,
            image,
        ]);

        response.status(200).json({
            message: "Campaign created successfully!",
            transactionHash: tx.hash,
        });
    } catch (error) {
        console.error("Contract call failed", error);
        response.status(500).json({ message: "Contract call failed!", error });
    }
};
