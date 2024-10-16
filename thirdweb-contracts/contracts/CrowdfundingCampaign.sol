// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdfundingCampaign {
    struct Campaign {
        address owner;
        string metadataURI; // Store off-chain references (IPFS or MongoDB URI)
        uint256 targetAmount;
        uint256 deadline;
        uint256 amountCollected;
        address[] donors;
        bool exists; // For deletion logic
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

    // Event emitted when donator refunded donation from a failed campaign
    event DonationRefunded(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );

    // Modifier to check if the sender is the campaign owner
    modifier onlyOwner(uint256 _campaignId) {
        require(
            campaigns[_campaignId].owner == msg.sender,
            "Only campaign owner can perform this action"
        );
        _;
    }

    // Modifier to check if the campaign exists
    modifier campaignExists(uint256 _campaignId) {
        require(campaigns[_campaignId].exists, "Campaign is unavailable");
        _;
    }

    // Function to create a new campaign
    function createCampaign(
        string memory _metadataURI,
        uint256 _targetAmount,
        uint256 _deadline
    ) public {
        require(
            _deadline > block.timestamp,
            "Deadline should be in the future."
        );

        campaignCount++;
        campaigns[campaignCount] = Campaign({
            owner: msg.sender,
            targetAmount: _targetAmount,
            deadline: _deadline,
            amountCollected: 0,
            metadataURI: _metadataURI,
            donors: new address[](0),
            exists: true
        });

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
            uint256 targetAmount,
            uint256 deadline,
            uint256 amountCollected,
            string memory metadataURI
        )
    {
        Campaign memory campaign = campaigns[_campaignId];
        return (
            campaign.owner,
            campaign.targetAmount,
            campaign.deadline,
            campaign.amountCollected,
            campaign.metadataURI
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

    // Function to donate to a campaign
    function donateToCampaign(
        uint256 _campaignId
    ) public payable campaignExists(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp < campaign.deadline, "Campaign ended");
        require(msg.value > 0, "Donation must be greater than 0");

        campaign.amountCollected += msg.value;
        donations[_campaignId][msg.sender] += msg.value;
        campaign.donors.push(msg.sender);

        emit DonationReceived(_campaignId, msg.sender, msg.value);
    }

    // Refund donations from an unsuccessful campaign
    function refundDonation(
        uint256 _campaignId
    ) public campaignExists(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        require(
            block.timestamp >= campaign.deadline,
            "Campaign is still active"
        );
        require(
            campaign.amountCollected < campaign.targetAmount,
            "Campaign reached its target"
        );

        uint256 donatedAmount = donations[_campaignId][msg.sender];
        require(donatedAmount > 0, "No donation to refund.");

        donations[_campaignId][msg.sender] = 0; // Reset the donor's contribution
        payable(msg.sender).transfer(donatedAmount); // Refund the donor
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
