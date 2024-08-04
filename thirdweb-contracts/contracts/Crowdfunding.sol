// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Crowdfunding {
    constructor() {}

    struct Campaign {
        address owner;
        string title;
        string description;
        string information;
        string image;
        uint256 goalAmount;
        uint256 currentAmount;
        uint256 deadline;
        address[] donators;
        uint256[] donations;
        bool isActive;
    }

    mapping(uint256 => Campaign) public campaigns;

    uint256 public numberOfCampaigns = 0;

    function createContract(
        address _owner,
        string memory _title,
        string memory _description,
        string memory _information,
        string memory _image,
        uint256 _goalAmount,
        uint256 _deadline
    ) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        require(
            campaign.deadline < block.timestamp,
            "Deadline must be a future date!"
        );

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.information = _information;
        campaign.image = _image;
        campaign.goalAmount = _goalAmount;
        campaign.currentAmount = 0;
        campaign.deadline = _deadline;
        campaign.isActive = true;

        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    function donateToCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id];
        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        (bool sent, ) = payable(campaign.owner).call{value: amount}("");

        if (sent) campaign.currentAmount += amount;
    }

    function getDonators(
        uint256 _id
    ) public view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for (uint256 index = 0; index < numberOfCampaigns; index++) {
            Campaign storage item = campaigns[index];
            allCampaigns[index] = item;
        }

        return allCampaigns;
    }
}
