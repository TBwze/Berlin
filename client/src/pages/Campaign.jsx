import React, { useEffect, useState } from "react";
import { useStateContext } from "../context";
import CardComponent from "../components/Card.component";
import PageLoad from "../components/Loading.component";
import SearchBarComponent from "../components/SearchBar.component";
import { useForm } from "react-hook-form";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Campaign = () => {
  const { getCampaigns, address, contract } = useStateContext();
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm({
    defaultValues: {
      page: 0,
      limit: 10,
      total_pages: 0,
      total_rows: 0,
      PageOptions: [1, 10, 20, 50]
    }
  });

  const watchedPage = form.watch("page");
  const watchedLimit = form.watch("limit");
  const watchedTotalPages = form.watch("total_pages");
  const rowsPerPageOptions = form.watch("PageOptions");

  const fetchData = async (page, limit) => {
    setIsLoading(true);
    try {
      const fetchedCampaigns = await getCampaigns(page, limit, searchQuery);
      setCampaigns(fetchedCampaigns.data);
      form.setValue("total_pages", fetchedCampaigns.total_pages);
      form.setValue("total_rows", fetchedCampaigns.total_rows);
    } catch (error) {
      alert("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(watchedPage, watchedLimit, searchQuery);
  }, [watchedPage, watchedLimit, getCampaigns, contract, address, searchQuery]);

  const handleSearch = (searchTerm) => {
    setSearchQuery(searchTerm);
    form.setValue("page", 0);
  };

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePageChange = (newPage) => {
    form.setValue("page", newPage);
  };

  const handleLimitChange = (event) => {
    form.setValue("limit", Number(event.target.value));
    form.setValue("page", 0);
  };

  return (
    <div className="flex flex-col items-center justify-center mx-auto max-w-[1280px] p-4">
      <PageLoad loading={isLoading} />

      {/* Search Bar */}
      <div className="flex w-full max-w-lg mb-8">
        <SearchBarComponent onSearch={handleSearch} placeholder="Cari Kampanye..." />
      </div>

      <h2 className="text-lg font-bold mb-10">
        Jelajahi <span className="text-[#2E6950]">{filteredCampaigns.length} Kampanye</span>
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
                isWithdraw={campaign.isWithdraw}
              />
            ))}
          </div>
        </section>
      ) : (
        <p className="text-center text-gray-500">Kampanye tidak ditemukan.</p>
      )}

      {/* Pagination Controls */}
      <div className="flex flex-row items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          {/* Rows per page selector */}
          <div className="flex items-center space-x-2">
            <label htmlFor="limit" className="text-sm text-gray-600 text-nowrap">
              Kampanye per halaman:
            </label>
            <select
              id="limit"
              value={watchedLimit}
              onChange={handleLimitChange}
              className="form-select rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500 border">
              {rowsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(watchedPage - 1)}
            disabled={watchedPage === 0}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50 cursor-pointer">
            <FaChevronLeft className="h-4 w-4" />
            <span className="ml-1">Sebelumnya</span>
          </button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: watchedTotalPages }, (_, i) => i).map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={`relative inline-flex items-center px-3 py-2 text-sm font-medium ${
                  watchedPage === p ? "z-10 bg-[#2E6950] text-white" : "text-black hover:bg-gray-50"
                } rounded-md`}>
                {p + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(watchedPage + 1)}
            disabled={watchedPage === watchedTotalPages - 1 || watchedPage === 0}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50 cursor-pointer">
            <span className="mr-1">Selanjutnya</span>
            <FaChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Campaign;
