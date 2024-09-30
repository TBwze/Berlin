import React, { useEffect, useState } from 'react';
import { useContract } from '@thirdweb-dev/react';
import CardComponent from '../components/Card.component';
import { ethers } from 'ethers'; // to format amounts from Wei to Ether

const Home = () => {
  const [data, setData] = useState([]);
  const { contract } = useContract('0x4AdeDAe205840c757e5824682c8F82537C6ECB8f');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const campaigns = await contract.call('getAllCampaigns'); // Fetch campaigns from the contract
        const formattedCampaigns = campaigns.map((campaign, index) => ({
          id: index + 1,
          title: campaign.title,
          targetAmount: ethers.utils.formatEther(campaign.targetAmount), // Convert from Wei to Ether
          amountCollected: ethers.utils.formatEther(campaign.amountCollected), // Convert from Wei to Ether
          deadline: new Date(campaign.deadline * 1000).toLocaleDateString(), // Convert timestamp to readable date
          imageUrl: campaign.image || 'default-image-url.jpg' // Use a default image if none provided
        }));
        setData(formattedCampaigns);
      } catch (error) {
        setData([]);
        console.error('Failed to fetch campaigns:', error);
      }
    };

    fetchCampaigns();
  }, [contract]);

  return (
    <div className="max-w-[1280px] mx-auto p-4 bg-white">
      {/* Projek Populer Section */}
      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold">Projek Populer</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {/* Large Project Card */}
          {data.map((campaign) => (
            <CardComponent
              key={campaign.id}
              id={campaign.id}
              title={campaign.title}
              targetAmount={campaign.targetAmount}
              amountCollected={campaign.amountCollected}
              deadline={campaign.deadline}
              imageUrl={campaign.imageUrl}
            />
          ))}
          {/* Small Project Cards */}
          {Array(5)
            .fill('')
            .map((_, index) => (
              <div key={index} className="flex flex-col items-center p-4 bg-gray-200 rounded-lg">
                <div className="w-24 h-24 mb-2 bg-gray-300 rounded-lg"></div>
                <h3 className="mb-1 text-sm font-bold text-black truncate">Lorem ipsum...</h3>
                <p className="text-xs text-gray-600">Creator</p>
                <p className="text-xs text-gray-600">100 Backers</p>
                <p className="text-xs text-gray-600">10 / 50 Funded</p>
              </div>
            ))}
        </div>
      </section>

      {/* Projek Terbaru Section */}
      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold">Projek Terbaru</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {Array(3)
            .fill('')
            .map((_, index) => (
              <div key={index} className="flex flex-col items-center p-4 bg-gray-200 rounded-lg">
                <div className="w-24 h-24 mb-2 bg-gray-300 rounded-lg"></div>
                <h3 className="mb-1 text-sm font-bold text-black truncate">Lorem ipsum...</h3>
                <p className="text-xs text-gray-600">Creator</p>
                <p className="text-xs text-gray-600">100 Backers</p>
                <p className="text-xs text-gray-600">10 / 50 Funded</p>
              </div>
            ))}
        </div>
      </section>

      {/* Tutorial dan Tips Section */}
      <section>
        <h2 className="mb-6 text-xl font-bold">Tutorial dan Tips</h2>
        <div className="space-y-6">
          {Array(2)
            .fill('')
            .map((_, index) => (
              <div key={index} className="p-4 bg-gray-200 rounded-lg hover:bg-gray-300">
                <p className="text-sm text-gray-700">
                  Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur,
                  adipisci velit.
                </p>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
