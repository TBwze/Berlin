import React, { useEffect, useState } from "react";
import { useContract } from "@thirdweb-dev/react";
import CardComponent from "../components/Card.component";
import { ethers } from "ethers";
import { getAccountByWallet } from "../api/User/getUserByWallet.api";
import { formatDate } from "../utils/date.utils";
import { useNavigate } from "react-router-dom";
import PageLoad from "../components/Loading.component";
import { useStateContext } from "../context";
import PopupComponent from "../components/PopUp.component";

const Home = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const { contract, address, getCampaigns, fetchUserDonation, refundDonation } = useStateContext();
  const [isLoading, setIsLoading] = useState(true);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      const response = await getCampaigns();
      setData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAndRefund = async () => {
    try {
      for (const campaign of data) {
        const userDonation = await fetchUserDonation(campaign.id);
        if (
          userDonation > 0 &&
          new Date(campaign.deadline).getTime() < Date.now() &&
          parseFloat(campaign.amountCollected) < parseFloat(campaign.targetAmount)
        ) {
          await refundDonation(campaign.id);
          setPopupVisible(true);
          setPopupMessage(`Refunded for campaign ${campaign.title}`);
          window.location.reload();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchCampaigns();
    }
  }, [contract, address]);

  useEffect(() => {
    if (data.length > 0) {
      checkAndRefund();
    }
  }, [data]);

  const popularProjects = [...data]
    .sort((a, b) => {
      const percentageA = parseFloat(a.amountCollected) / parseFloat(a.targetAmount) || 0;
      const percentageB = parseFloat(b.amountCollected) / parseFloat(b.targetAmount) || 0;
      return percentageB - percentageA; // Descending order
    })
    .slice(0, 3);

  const latestProjects = [...data].sort((a, b) => b.id - a.id).slice(0, 3);

  if (!contract) return <PageLoad loading={true} />;

  return (
    <div className="max-w-[1280px] mx-auto p-4 bg-white">
      <PageLoad loading={isLoading} />
      <PopupComponent
        message={popupMessage}
        visible={popupVisible}
        onClose={() => setPopupVisible(false)}
      />

      {/* Projek Populer Section */}
      {!isLoading && (
        <>
          <section className="mb-12">
            <h2 className="mb-6 text-xl font-bold">Projek Populer</h2>
            {popularProjects.length > 0 ? (
              <div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                  {popularProjects.map((campaign) => (
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
                <div>
                  <button
                    className="mt-4 text-blue-500 hover:underline"
                    onClick={() => navigate("/campaign")}>
                    See More
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No popular projects yet.</p>
            )}
          </section>

          {/* Projek Terbaru Section */}
          <section className="mb-12">
            <h2 className="mb-6 text-xl font-bold">Projek Terbaru</h2>
            {latestProjects.length > 0 ? (
              <div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                  {latestProjects.map((campaign) => (
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
                <div>
                  <button
                    className="mt-4 text-blue-500 hover:underline"
                    onClick={() => navigate("/campaign")}>
                    See More
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No latest projects yet.</p>
            )}
          </section>

          {/* Tutorial dan Tips Section */}
          <section>
            <h2 className="mb-6 text-xl font-bold">Tutorial dan Tips</h2>
            <div className="space-y-6">
              {Array(2)
                .fill("")
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
        </>
      )}
    </div>
  );
};

export default Home;
