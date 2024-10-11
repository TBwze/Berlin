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
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const campaignsPerPage = 4; // Change this value for different number of campaigns per page

  const fetchData = async () => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [getCampaigns, contract, address]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Filter campaigns based on the search query
  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredCampaigns.length / campaignsPerPage);
  const indexOfLastCampaign = currentPage * campaignsPerPage;
  const indexOfFirstCampaign = indexOfLastCampaign - campaignsPerPage;
  const currentCampaigns = filteredCampaigns.slice(indexOfFirstCampaign, indexOfLastCampaign);

  // Handle page navigation
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="flex flex-col items-center justify-center mx-auto max-w-[1280px] p-4">
      <PageLoad loading={isLoading} />

      {/* Search Bar */}
      <div className="flex w-full max-w-lg mb-8">
        <input
          type="text"
          placeholder="Cari Projek"
          className="flex-1 p-2 border border-gray-300 rounded-l-full outline-none"
          onChange={handleSearch}
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
          {currentCampaigns.map((campaign) => (
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

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="bg-gray-300 p-2 rounded hover:bg-gray-400">
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="bg-gray-300 p-2 rounded hover:bg-gray-400">
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

export default Campaign;
