// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdfundingCampaign {
    struct Reward {
        uint256 minAmount;
        string description;
    }

    struct Campaign {
        uint256 campaignId;
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
        bool isWithdraw;
    }

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public donations;
    mapping(uint256 => mapping(address => bool)) public isDonor; // New mapping to track if address has donated before
    mapping(uint256 => mapping(address => uint256))
        public totalDonationsPerDonor;
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
        campaigns[campaignCount].campaignId = campaignCount;
        campaigns[campaignCount].owner = msg.sender;
        campaigns[campaignCount].title = _title;
        campaigns[campaignCount].description = _description;
        campaigns[campaignCount].targetAmount = _targetAmount;
        campaigns[campaignCount].deadline = _deadline;
        campaigns[campaignCount].amountCollected = 0;
        campaigns[campaignCount].image = _image;
        campaigns[campaignCount].exists = true;
        campaigns[campaignCount].isWithdraw = false;

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
        uint256 existingCount = 0;
        for (uint256 i = 1; i <= campaignCount; i++) {
            if (campaigns[i].exists) {
                existingCount++;
            }
        }

        Campaign[] memory existingCampaigns = new Campaign[](existingCount);

        uint256 currentIndex = 0;
        for (uint256 i = 1; i <= campaignCount; i++) {
            if (campaigns[i].exists) {
                existingCampaigns[currentIndex] = campaigns[i];
                currentIndex++;
            }
        }

        return existingCampaigns;
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
        totalDonationsPerDonor[_campaignId][msg.sender] += msg.value;

        // Only add to donors array if this is their first donation
        if (!isDonor[_campaignId][msg.sender]) {
            campaign.donors.push(msg.sender);
            isDonor[_campaignId][msg.sender] = true;
        }

        emit DonationReceived(_campaignId, msg.sender, msg.value);
    }

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
        uint256 totalDonation = totalDonationsPerDonor[_campaignId][
            _donorAddress
        ];
        Reward[] memory rewards = campaigns[_campaignId].rewards;

        if (rewards.length >= 3 && totalDonation >= rewards[2].minAmount) {
            return "Gold";
        } else if (
            rewards.length >= 2 && totalDonation >= rewards[1].minAmount
        ) {
            return "Silver";
        } else if (
            rewards.length >= 1 && totalDonation >= rewards[0].minAmount
        ) {
            return "Bronze";
        }

        return "No eligible reward";
    }

    // Function to refund donations from an unsuccessful campaign
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

    // Function to withdraw funds from a successful campaign
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
        campaign.isWithdraw = true;
    }

    // Function to get all donors along with their donation, ordered by donations (desc)
    function getLeaderboard(
        uint256 _campaignId
    )
        public
        view
        campaignExists(_campaignId)
        returns (address[] memory donors, uint256[] memory donationAmounts)
    {
        Campaign storage campaign = campaigns[_campaignId];
        uint256 donorCount = campaign.donors.length;

        address[] memory allDonors = new address[](donorCount);
        uint256[] memory allDonations = new uint256[](donorCount);

        // Populate arrays with donor addresses and their total donation amounts
        for (uint256 i = 0; i < donorCount; i++) {
            address donor = campaign.donors[i];
            uint256 totalDonation = totalDonationsPerDonor[_campaignId][donor];
            allDonors[i] = donor;
            allDonations[i] = totalDonation;
        }

        // Sort the donors and donation amounts in descending order based on donations
        quickSort(allDonors, allDonations, 0, int(donorCount - 1));

        return (allDonors, allDonations);
    }

    // Function to delete a user's campaign when their account gets deleted
    function deleteAllOwnerCampaigns(address _owner) public {
        for (uint256 i = 0; i < campaignCount; i++) {
            if (campaigns[i].owner == _owner && campaigns[i].exists) {
                campaigns[i].deadline = block.timestamp - 1;

                // Ensure targetAmount is greater than amountCollected
                if (campaigns[i].targetAmount <= campaigns[i].amountCollected) {
                    campaigns[i].targetAmount =
                        campaigns[i].amountCollected +
                        1;
                }
            }
        }
    }

    function quickSort(
        address[] memory allDonors,
        uint256[] memory allDonations,
        int left,
        int right
    ) internal pure {
        if (left < right) {
            int pivotIndex = partition(allDonors, allDonations, left, right);
            quickSort(allDonors, allDonations, left, pivotIndex - 1);
            quickSort(allDonors, allDonations, pivotIndex + 1, right);
        }
    }

    function partition(
        address[] memory allDonors,
        uint256[] memory allDonations,
        int left,
        int right
    ) internal pure returns (int) {
        uint256 pivot = allDonations[uint256(right)];
        int i = left - 1;

        for (int j = left; j < right; j++) {
            if (allDonations[uint256(j)] >= pivot) {
                i++;

                (allDonations[uint256(i)], allDonations[uint256(j)]) = (
                    allDonations[uint256(j)],
                    allDonations[uint256(i)]
                );
                (allDonors[uint256(i)], allDonors[uint256(j)]) = (
                    allDonors[uint256(j)],
                    allDonors[uint256(i)]
                );
            }
        }

        (allDonations[uint256(i + 1)], allDonations[uint256(right)]) = (
            allDonations[uint256(right)],
            allDonations[uint256(i + 1)]
        );
        (allDonors[uint256(i + 1)], allDonors[uint256(right)]) = (
            allDonors[uint256(right)],
            allDonors[uint256(i + 1)]
        );

        return i + 1;
    }

    function getDonorsWithRewards(
        uint256 _campaignId
    )
        public
        view
        campaignExists(_campaignId)
        returns (
            string[] memory rewardTiers,
            address[][] memory donors,
            uint256[][] memory donationsList
        )
    {
        Campaign storage campaign = campaigns[_campaignId];

        // Define reward tier labels
        string[] memory rewardTierLabels = new string[](3);
        rewardTierLabels[0] = "Bronze";
        rewardTierLabels[1] = "Silver";
        rewardTierLabels[2] = "Gold";

        // Initialize result arrays
        address[][] memory rewardDonors = new address[][](3);
        uint256[][] memory rewardDonations = new uint256[][](3);
        uint256[] memory donorCounts = new uint256[](3);

        for (uint256 i = 0; i < 3; i++) {
            rewardDonors[i] = new address[](campaign.donors.length);
            rewardDonations[i] = new uint256[](campaign.donors.length);
        }

        // Categorize donors into reward tiers based on total donations
        for (uint256 i = 0; i < campaign.donors.length; i++) {
            address donor = campaign.donors[i];
            uint256 totalDonation = totalDonationsPerDonor[_campaignId][donor];

            // Determine reward tier based on total donation
            uint256 tierIndex;
            if (totalDonation >= campaign.rewards[2].minAmount) {
                tierIndex = 2; // Gold
            } else if (totalDonation >= campaign.rewards[1].minAmount) {
                tierIndex = 1; // Silver
            } else {
                tierIndex = 0; // Bronze
            }

            rewardDonors[tierIndex][donorCounts[tierIndex]] = donor;
            rewardDonations[tierIndex][donorCounts[tierIndex]] = totalDonation;
            donorCounts[tierIndex]++;
        }

        // Resize arrays to actual counts
        for (uint256 i = 0; i < 3; i++) {
            address[] memory tierDonors = new address[](donorCounts[i]);
            uint256[] memory tierDonations = new uint256[](donorCounts[i]);

            for (uint256 j = 0; j < donorCounts[i]; j++) {
                tierDonors[j] = rewardDonors[i][j];
                tierDonations[j] = rewardDonations[i][j];
            }
            rewardDonors[i] = tierDonors;
            rewardDonations[i] = tierDonations;
        }

        return (rewardTierLabels, rewardDonors, rewardDonations);
    }
}
