// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdfundingCampaign {
    struct Reward {
        uint256 minAmount;
        string description;
    }

    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 targetAmount;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        Reward[] rewards;
        address[] donors;
        bool exists;
    }

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public donations;
    uint256 public campaignCount;

    // Event emitted when a new campaign is created
    event CampaignCreated(uint256 indexed campaignId, address indexed owner);

    // Event emitted when a donation is made
    event DonationReceived(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );

    // Event emitted when a campaign is deleted
    event CampaignDeleted(uint256 indexed campaignId, address indexed owner);

    // Modifier to check if the sender is the campaign owner
    modifier onlyOwner(uint256 _campaignId) {
        require(
            campaigns[_campaignId].owner == msg.sender,
            "Only the campaign owner can perform this action"
        );
        _;
    }

    // Modifier to check if the campaign exists
    modifier campaignExists(uint256 _campaignId) {
        require(campaigns[_campaignId].exists, "Campaign does not exist");
        _;
    }

    // Function to create a new campaign
    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _targetAmount,
        uint256 _deadline,
        string memory _image,
        Reward[] memory _rewards
    ) public {
        require(
            _deadline > block.timestamp,
            "Deadline should be in the future."
        );
        require(_rewards.length <= 3, "Maximum of 3 rewards allowed."); // Ensure only 3 rewards

        campaignCount++;
        campaigns[campaignCount].owner = msg.sender;
        campaigns[campaignCount].title = _title;
        campaigns[campaignCount].description = _description;
        campaigns[campaignCount].targetAmount = _targetAmount;
        campaigns[campaignCount].deadline = _deadline;
        campaigns[campaignCount].amountCollected = 0;
        campaigns[campaignCount].image = _image;
        campaigns[campaignCount].exists = true;

        // Copy rewards from memory to storage
        for (uint256 i = 0; i < _rewards.length; i++) {
            campaigns[campaignCount].rewards.push(_rewards[i]);
        }

        emit CampaignCreated(campaignCount, msg.sender);
    }

    // Function to view a campaign
    function getCampaign(
        uint256 _campaignId
    )
        public
        view
        campaignExists(_campaignId)
        returns (
            address owner,
            string memory title,
            string memory description,
            uint256 targetAmount,
            uint256 deadline,
            uint256 amountCollected,
            string memory image,
            Reward[] memory rewards,
            address[] memory donors
        )
    {
        Campaign memory campaign = campaigns[_campaignId];
        return (
            campaign.owner,
            campaign.title,
            campaign.description,
            campaign.targetAmount,
            campaign.deadline,
            campaign.amountCollected,
            campaign.image,
            campaign.rewards,
            campaign.donors
        );
    }

    // Function to get all campaigns
    function getAllCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](campaignCount);

        for (uint256 i = 1; i <= campaignCount; i++) {
            allCampaigns[i - 1] = campaigns[i];
        }

        return allCampaigns;
    }

    // Function to delete a campaign
    function deleteCampaign(
        uint256 _campaignId
    ) public onlyOwner(_campaignId) campaignExists(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];

        require(
            block.timestamp >= campaign.deadline + 30 days,
            "Campaign can only be deleted 30 days after deadline"
        );

        campaign.exists = false;
        emit CampaignDeleted(_campaignId, msg.sender);
    }

    // Function to donate to a campaign
    function donateToCampaign(
        uint256 _campaignId
    ) public payable campaignExists(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp < campaign.deadline, "Campaign has ended.");
        require(msg.value > 0, "Donation must be greater than zero.");

        campaign.amountCollected += msg.value;
        donations[_campaignId][msg.sender] += msg.value;
        campaign.donors.push(msg.sender);

        emit DonationReceived(_campaignId, msg.sender, msg.value);
    }

    // Function to get all donors and their eligible rewards for a specific campaign
    // function getEligibleRewardsForCampaign(
    //     uint256 _campaignId
    // )
    //     public
    //     view
    //     campaignExists(_campaignId)
    //     onlyOwner(_campaignId)
    //     returns (address[] memory, string[] memory)
    // {
    //     Campaign storage campaign = campaigns[_campaignId];
    //     address[] memory donorAddresses = campaign.donors;
    //     string[] memory rewardTiers = new string[](donorAddresses.length);

    //     for (uint256 i = 0; i < donorAddresses.length; i++) {
    //         rewardTiers[i] = getRewardTier(_campaignId, donorAddresses[i]); // Get the eligible reward
    //     }

    //     return (donorAddresses, rewardTiers);
    // }

    // Function to get the reward tier for a donation amount
    function getRewardTier(
        uint256 _campaignId,
        address _donorAddress
    )
        public
        view
        campaignExists(_campaignId)
        returns (string memory rewardDescription)
    {
        uint256 donationAmount = donations[_campaignId][_donorAddress];
        Reward[] memory rewards = campaigns[_campaignId].rewards;

        for (uint256 i = 0; i < rewards.length; i++) {
            if (donationAmount >= rewards[i].minAmount) {
                if (i == 0) {
                    return "Bronze";
                } else if (i == 1) {
                    return "Silver";
                } else if (i == 2) {
                    return "Gold";
                }
            }
        }

        return "No eligible reward";
    }

    // Refund donations from an unsuccessful campaign
    function refundDonation(
        uint256 _campaignId
    ) public campaignExists(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        require(
            block.timestamp >= campaign.deadline,
            "Campaign is still active."
        );
        require(
            campaign.amountCollected < campaign.targetAmount,
            "Campaign reached its goal."
        );

        uint256 donatedAmount = donations[_campaignId][msg.sender];
        require(donatedAmount > 0, "No donation to refund.");

        donations[_campaignId][msg.sender] = 0;
        payable(msg.sender).transfer(donatedAmount);
    }

    // Withdraw funds from a successful campaign
    function withdrawFunds(
        uint256 _campaignId
    ) public onlyOwner(_campaignId) campaignExists(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        require(
            block.timestamp >= campaign.deadline,
            "Campaign is still active."
        );
        require(
            campaign.amountCollected >= campaign.targetAmount,
            "Campaign has not reached the target amount."
        );

        payable(campaign.owner).transfer(campaign.amountCollected);
        campaign.amountCollected = 0;
    }
}
