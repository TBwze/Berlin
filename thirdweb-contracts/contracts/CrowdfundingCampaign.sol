// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdfundingCampaign {
    struct Reward {
        uint256 minAmount; // Minimum donation amount for this reward
        string description; // Description of the reward
    }

    struct Campaign {
        address owner; // Creator of the campaign
        string title; // Title of the campaign
        string description; // Description of the campaign
        uint256 targetAmount; // Target amount to be raised
        uint256 deadline; // Campaign deadline as a timestamp
        uint256 amountCollected; // Total amount collected
        string image; // Image URL for the campaign
        Reward[] rewards; // Dynamic array of rewards
        bool exists; // To check if the campaign exists (for deletion logic)
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public campaignCount;

    // Event emitted when a new campaign is created
    event CampaignCreated(uint256 indexed campaignId, address indexed owner);

    // Event emitted when a campaign is updated
    event CampaignUpdated(uint256 indexed campaignId);

    // Event emitted when a donation is made
    event DonationReceived(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );

    // Modifier to check if the sender is the campaign owner
    modifier onlyOwner(uint256 _campaignId) {
        require(
            campaigns[_campaignId].owner == msg.sender,
            "Only the campaign owner can perform this action."
        );
        _;
    }

    // Modifier to check if the campaign exists
    modifier campaignExists(uint256 _campaignId) {
        require(campaigns[_campaignId].exists, "Campaign does not exist.");
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

    // Function to update a campaign
    function updateCampaign(
        uint256 _campaignId,
        string memory _title,
        string memory _description,
        uint256 _targetAmount,
        uint256 _deadline,
        string memory _image,
        Reward[] memory _rewards
    ) public onlyOwner(_campaignId) campaignExists(_campaignId) {
        require(
            _deadline > block.timestamp,
            "Deadline should be in the future."
        );
        require(_rewards.length <= 3, "Maximum of 3 rewards allowed."); // Ensure only 3 rewards

        Campaign storage campaign = campaigns[_campaignId];
        campaign.title = _title;
        campaign.description = _description;
        campaign.targetAmount = _targetAmount;
        campaign.deadline = _deadline;
        campaign.image = _image;

        // Clear existing rewards
        delete campaign.rewards;

        // Copy new rewards from memory to storage
        for (uint256 i = 0; i < _rewards.length; i++) {
            campaign.rewards.push(_rewards[i]);
        }

        emit CampaignUpdated(_campaignId);
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
            Reward[] memory rewards
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
            campaign.rewards
        );
    }

    // Function to get all campaigns
    function getAllCampaigns() public view returns (Campaign[] memory) {
        // Create an array in memory to hold all the campaigns
        Campaign[] memory allCampaigns = new Campaign[](campaignCount);

        // Loop through each campaign and add it to the array
        for (uint256 i = 1; i <= campaignCount; i++) {
            allCampaigns[i - 1] = campaigns[i];
        }

        return allCampaigns;
    }

    // Function to delete a campaign
    function deleteCampaign(
        uint256 _campaignId
    ) public onlyOwner(_campaignId) campaignExists(_campaignId) {
        delete campaigns[_campaignId];
    }

    // Function to donate to a campaign
    function donateToCampaign(
        uint256 _campaignId
    ) public payable campaignExists(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp < campaign.deadline, "Campaign has ended.");
        require(msg.value > 0, "Donation must be greater than zero.");

        campaign.amountCollected += msg.value;

        // Emit event
        emit DonationReceived(_campaignId, msg.sender, msg.value);
    }

    // Function to get the reward tier for a donation amount
    function getRewardTier(
        uint256 _campaignId,
        uint256 _donationAmount
    )
        public
        view
        campaignExists(_campaignId)
        returns (string memory rewardDescription)
    {
        Reward[] memory rewards = campaigns[_campaignId].rewards;

        for (uint256 i = 0; i < rewards.length; i++) {
            if (_donationAmount >= rewards[i].minAmount) {
                rewardDescription = rewards[i].description;
            }
        }
        return rewardDescription;
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
        campaign.amountCollected = 0; // Reset after withdrawal
    }
}
