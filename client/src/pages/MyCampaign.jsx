import React, { useEffect, useState } from "react";
import { useStateContext } from "../context";
import CardComponent from "../components/Card.component";
import PageLoad from "../components/Loading.component";
import SearchBarComponent from "../components/SearchBar.component";
import { useForm } from "react-hook-form";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getUserDetails } from "../api/User/getUserDetails.api";

const MyCampaign = () => {
  const { getCampaigns, address, contract } = useStateContext();
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [donatedCampaigns, setDonatedCampaigns] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");

  const form = useForm({
    defaultValues: {
      page: 0,
      limit: 10,
      total_pages: 0,
      total_rows: 0,
      PageOptions: [1, 10, 20, 50],

      page2: 0,
      limit2: 10,
      total_pages2: 0,
      total_rows2: 0,
      PageOptions2: [1, 10, 20, 50]
    }
  });

  const watchedPage = form.watch("page");
  const watchedLimit = form.watch("limit");
  const watchedTotalPages = form.watch("total_pages");
  const rowsPerPageOptions = form.watch("PageOptions");

  const watchedPage2 = form.watch("page2");
  const watchedLimit2 = form.watch("limit2");
  const watchedTotalPages2 = form.watch("total_pages2");
  const rowsPerPageOptions2 = form.watch("PageOptions2");

  const fetchData = async (page, limit, searchQuery, isOwner) => {
    setIsLoading(true);
    try {
      const fetchedCampaigns = await getCampaigns(page, limit, searchQuery, isOwner, null);
      setMyCampaigns(fetchedCampaigns.data);
      form.setValue("total_pages", fetchedCampaigns.total_pages);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(watchedPage, watchedLimit, searchQuery, true);
    fetchDonatedCampaign(watchedPage2, watchedLimit2, searchQuery2);
  }, [getCampaigns, contract, address, watchedPage, watchedLimit, searchQuery]);

  const fetchDonatedCampaign = async (page2, limit2, searchQuery2) => {
    setIsLoading(true);
    try {
      const userDetails = await getUserDetails();
      setWallet(userDetails.data.wallet);

      const fetchedDonatedCampaigns = await getCampaigns(
        page2,
        limit2,
        searchQuery2,
        false,
        wallet
      );
      setDonatedCampaigns(fetchedDonatedCampaigns.data);
      form.setValue("total_pages2", fetchedDonatedCampaigns.total_pages);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleSearch2 = (searchTerm) => {
    setSearchQuery2(searchTerm);
    form.setValue("page2", 0);
  };

  const handlePageChange2 = (newPage) => {
    form.setValue("page2", newPage);
  };

  const handleLimitChange2 = (event) => {
    form.setValue("limit2", Number(event.target.value));
    form.setValue("page2", 0);
  };

  const filteredMyCampaigns = myCampaigns.filter((campaign) =>
    campaign.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMyCampaigns2 = donatedCampaigns.filter((campaign) =>
    campaign.title.toLowerCase().includes(searchQuery2.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1280px] mx-auto p-6 space-y-8">
        <PageLoad loading={isLoading} />

        {/* My Projects Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-black mb-4 md:mb-0">Projek Saya</h2>
            <div className="w-full md:w-96">
              <SearchBarComponent onSearch={handleSearch} placeholder="Cari Projek Anda..." />
            </div>
          </div>

          {filteredMyCampaigns.length > 0 ? (
            <section className="mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
            <div className="flex flex-col items-center justify-center py-12 rounded-lg">
              <p className="text-gray-500 text-lg">Projek tidak ditemukan.</p>
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <label htmlFor="limit" className="font-medium">
                Projek per halaman:
              </label>
              <select
                id="limit"
                value={watchedLimit}
                onChange={handleLimitChange}
                className="form-select rounded-lg border-gray-200 text-sm focus:border-emerald-500 focus:ring-emerald-500">
                {rowsPerPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(watchedPage - 1)}
                disabled={watchedPage === 0}
                className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <FaChevronLeft className="h-4 w-4 mr-1" />
                Sebelumnya
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: watchedTotalPages }, (_, i) => i).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      watchedPage === p
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}>
                    {p + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(watchedPage + 1)}
                disabled={watchedPage === watchedTotalPages - 1 || watchedPage === 0}
                className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                Selanjutnya
                <FaChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Donated Projects Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-black mb-4 md:mb-0">Proyek yang saya donasikan</h2>
            <div className="w-full md:w-96">
              <SearchBarComponent
                onSearch={handleSearch2}
                placeholder="Cari Projek yang telah anda donasikan..."
              />
            </div>
          </div>

          {filteredMyCampaigns2.length > 0 ? (
            <section className="mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredMyCampaigns2.map((campaign) => (
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
            <div className="flex flex-col items-center justify-center py-12 rounded-lg">
              <p className="text-gray-500 text-lg">Projek tidak ditemukan.</p>
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <label htmlFor="limit" className="font-medium">
                Projek per halaman:
              </label>
              <select
                id="limit"
                value={watchedLimit2}
                onChange={handleLimitChange2}
                className="form-select rounded-lg border-gray-200 text-sm focus:border-emerald-500 focus:ring-emerald-500">
                {rowsPerPageOptions2.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange2(watchedPage2 - 1)}
                disabled={watchedPage2 === 0}
                className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <FaChevronLeft className="h-4 w-4 mr-1" />
                Sebelumnya
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: watchedTotalPages2 }, (_, i) => i).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange2(p)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      watchedPage2 === p
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}>
                    {p + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange2(watchedPage2 + 1)}
                disabled={watchedPage2 === watchedTotalPages2 - 1 || watchedPage2 === 0}
                className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                Selanjutnya
                <FaChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCampaign;
