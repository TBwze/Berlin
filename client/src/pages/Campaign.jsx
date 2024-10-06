import React, { useEffect, useState } from 'react';
import { useStateContext } from '../context';
import CardComponent from '../components/Card.component';
import PageLoad from '../components/Loading.component';
import { getUserDetails } from '../api/User/getUserDetails.api';

const Campaign = () => {
  const { getCampaigns, address, contract } = useStateContext();
  const [campaigns, setCampaigns] = useState([]);
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const fetchData = async () => {
    setIsLoading(true); // Start loading before fetching data
    try {
      const userDetails = await getUserDetails();
      setWallet(userDetails.wallet);
      console.log(wallet);

      const fetchedCampaigns = await getCampaigns();
      setCampaigns(fetchedCampaigns);
      console.log(fetchedCampaigns);

      const userCampaigns = fetchedCampaigns.filter(
        (campaign) => campaign.wallet.toLowerCase() === userDetails.wallet.toLowerCase()
      );

      setMyCampaigns(userCampaigns);
    } catch (error) {
      alert('Failed to fetch data:', error);
    } finally {
      setIsLoading(false); // Stop loading after fetching data
    }
  };

  useEffect(() => {
    fetchData();
  }, [getCampaigns, contract, address]);

  // Handle search input changes
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filtered campaigns based on the search query
  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center mx-auto max-w-[1280px] p-4">
      <PageLoad loading={isLoading} />

      {/* Search Bar */}
      <div className="flex w-full max-w-lg mb-8">
        <input
          type="text"
          placeholder="Cari Projek"
          className="flex-1 p-2 border border-gray-300 rounded-l-full outline-none"
          onChange={handleSearch} // Handle input changes
        />
        <button className="bg-gray-300 p-2 rounded-r-full hover:bg-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m2.85-5.15a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
            />
          </svg>
        </button>
      </div>

      {/* Projek Anda Section */}
      {myCampaigns.length > 0 && (
        <section className="w-full mb-8">
          <h2 className="mb-4 text-lg font-bold">Projek Anda</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {myCampaigns.slice(0, 4).map((campaign) => (
              <CardComponent
                key={campaign.id}
                id={campaign.id}
                creator={campaign.owner}
                title={campaign.title}
                targetAmount={campaign.targetAmount}
                amountCollected={campaign.amountCollected}
                deadline={campaign.deadline}
                imageUrl={campaign.imageUrl}
              />
            ))}
          </div>
        </section>
      )}

      {/* Explore Section */}
      <section className="w-full">
        <h2 className="mb-4 text-lg font-bold">
          Jelajahi{' '}
          <span className="text-blue-500 cursor-pointer">{filteredCampaigns.length} Projek</span>
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {filteredCampaigns.map((campaign) => (
            <CardComponent
              key={campaign.id}
              id={campaign.id}
              creator={campaign.owner}
              title={campaign.title}
              targetAmount={campaign.targetAmount}
              amountCollected={campaign.amountCollected}
              deadline={campaign.deadline}
              imageUrl={campaign.imageUrl}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Campaign;
