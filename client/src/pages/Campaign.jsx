import React, { useEffect, useState } from "react";
import { useStateContext } from "../context";
import CardComponent from "../components/Card.component";
import PageLoad from "../components/Loading.component";
import SearchBarComponent from "../components/SearchBar.component";

const Campaign = () => {
  const { getCampaigns, address, contract } = useStateContext();
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const fetchedCampaigns = await getCampaigns();
      setCampaigns(fetchedCampaigns);
    } catch (error) {
      alert("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [getCampaigns, contract, address]);

  const handleSearch = (searchTerm) => {
    setSearchQuery(searchTerm);
  };

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center mx-auto max-w-[1280px] p-4">
      <PageLoad loading={isLoading} />

      {/* Search Bar */}
      <div className="flex w-full max-w-lg mb-8">
        <SearchBarComponent onSearch={handleSearch} placeholder="Search project..." />
      </div>

      <h2 className="mb-4 text-lg font-bold mb-10">
        Jelajahi <span className="text-[#2E6950]">{filteredCampaigns.length} Projek</span>
      </h2>
      {filteredCampaigns.length > 0 ? (
        <section className="w-full mb-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
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
      ) : (
        <p className="text-center text-gray-500">No projects found.</p>
      )}
    </div>
  );
};

export default Campaign;
