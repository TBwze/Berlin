import React, { useEffect, useState } from "react";
import { useStateContext } from "../context";
import CardComponent from "../components/Card.component";
import PageLoad from "../components/Loading.component";
import SearchBarComponent from "../components/SearchBar.component";
import { useForm } from "react-hook-form";

const MyCampaign = () => {
  const { getCampaigns, address, contract } = useStateContext();
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm({
    defaultValues: {
      page: 0,
      limit: 10
    }
  });

  const watchedPage = form.watch("page");
  const watchedLimit = form.watch("limit");

  const fetchData = async (page, limit, searchQuery, isOwner) => {
    setIsLoading(true);
    try {
      const fetchedCampaigns = await getCampaigns(page, limit, searchQuery, isOwner);
      setMyCampaigns(fetchedCampaigns.data);
      form.setValue("total_pages", fetchedCampaigns.total_pages);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(watchedPage, watchedLimit, searchQuery, true);
  }, [getCampaigns, contract, address, watchedPage, watchedLimit, searchQuery]);

  const handleSearch = (searchTerm) => {
    setSearchQuery(searchTerm);
    form.setValue("page", 0);
  };

  const handlePageChange = (newPage) => {
    form.setValue("page", newPage);
  };

  const handleLimitChange = (event) => {
    form.setValue("limit", Number(event.target.value));
    form.setValue("page", 0);
  };

  const filteredMyCampaigns = myCampaigns.filter((campaign) =>
    campaign.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center mx-auto max-w-[1280px] p-4">
      <PageLoad loading={isLoading} />

      {/* Search Bar */}
      <div className="flex w-full max-w-lg mb-8">
        <SearchBarComponent onSearch={handleSearch} placeholder="Search your project..." />
      </div>

      {/* My Projects Section */}
      <h2 className="mb-4 text-lg font-bold mb-10">My Projects</h2>
      {filteredMyCampaigns.length > 0 ? (
        <section className="w-full mb-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {filteredMyCampaigns.map((campaign) => (
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

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <label htmlFor="limit" className="mr-2">
            Items per page:
          </label>
          <select
            id="limit"
            value={watchedLimit}
            onChange={handleLimitChange}
            className="border border-gray-300 rounded">
            <option value={1}>1</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        <div>
          <button
            onClick={() => handlePageChange(watchedPage - 1)}
            disabled={watchedPage === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400">
            Previous
          </button>
          <span className="mx-2">{`Page ${watchedPage + 1}`}</span>
          <button
            onClick={() => handlePageChange(watchedPage + 1)}
            disabled={watchedPage + 1 >= form.getValues("total_pages")}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyCampaign;
