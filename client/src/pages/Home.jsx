import React, { useEffect, useState } from "react";
import CardComponent from "../components/Card.component";
import { useNavigate } from "react-router-dom";
import PageLoad from "../components/Loading.component";
import { useStateContext } from "../context";
import PopupComponent from "../components/PopUp.component";
import { HiArrowLongRight, HiChartBar, HiClock, HiBookOpen } from "react-icons/hi2";

const Home = () => {
  const [data, setData] = useState([]);
  const [allCampaigns, setAllCampaigns] = useState([]);
  const navigate = useNavigate();
  const {
    contract,
    address,
    getCampaigns,
    fetchUserDonation,
    refundDonation,
    getCampaignsWithoutPagination
  } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [tips] = useState([
    {
      id: 1,
      title: "Tentukan Target yang Realistis",
      description:
        "Pastikan target penggalangan dana Anda masuk akal, sesuai dengan kebutuhan, dan mudah dipahami oleh pendukung Anda."
    },
    {
      id: 2,
      title: "Buat Deskripsi yang Jelas",
      description:
        "Tulis deskripsi kampanye yang informatif dan menyentuh, menjelaskan mengapa tujuan ini penting."
    }
  ]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const campaignsResponse = await getCampaigns();
        const allCampaignsResponse = await getCampaignsWithoutPagination();
        setData(campaignsResponse.data);
        setAllCampaigns(allCampaignsResponse.data);
        if (contract && address) {
          if (allCampaignsResponse.data.length > 0) {
            await checkAndRefund(allCampaignsResponse.data);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [contract, address]);

  const checkAndRefund = async (campaigns) => {
    setIsLoading(true);
    for (const campaign of campaigns) {
      const userDonation = await fetchUserDonation(campaign.id);
      if (
        userDonation.data > 0 &&
        new Date(campaign.deadline).getTime() < Date.now() &&
        parseFloat(campaign.amountCollected) < parseFloat(campaign.targetAmount)
      ) {
        await refundDonation(campaign.id);
        setPopupVisible(true);
        setPopupMessage(`Refund dari campaign ${campaign.title}`);
      }
    }
    setIsLoading(false);
  };

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
    <div className="min-h-screen">
      <div className="max-w-[1280px] mx-auto p-6 md:p-8">
        <PageLoad loading={isLoading} />
        <PopupComponent
          message={popupMessage}
          visible={popupVisible}
          onClose={() => {
            setPopupVisible(false);
            window.location.reload();
          }}
        />

        {!isLoading && (
          <div className="space-y-12">
            {/* Popular Projects Section */}
            <section className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <HiChartBar className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Kampanye Populer</h2>
                </div>
                <button
                  onClick={() => navigate("/campaign")}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-500 hover:text-blue-700 transition-colors">
                  Lihat Semua
                  <HiArrowLongRight className="w-4 h-4" />
                </button>
              </div>

              {popularProjects.length > 0 ? (
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
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <p className="text-gray-500">Belum ada kampanye populer saat ini.</p>
                </div>
              )}
            </section>

            {/* Latest Projects Section */}
            <section className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <HiClock className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Kampanye Terbaru</h2>
                </div>
                <button
                  onClick={() => navigate("/campaign")}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-500 hover:text-blue-700 transition-colors">
                  Lihat Semua
                  <HiArrowLongRight className="w-4 h-4" />
                </button>
              </div>

              {latestProjects.length > 0 ? (
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
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <p className="text-gray-500">Belum ada kampanye terbaru</p>
                </div>
              )}
            </section>

            {/* Tutorial and Tips Section */}
            <section className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-green-100 rounded-lg">
                  <HiBookOpen className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Tutorial dan Tips</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {tips.map((tip) => (
                  <div
                    key={tip.id}
                    className="p-6 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm">
                        <span className="text-xl font-bold text-gray-600">{tip.id}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-2 transition-colors">
                          {tip.title}
                        </h3>
                        <p className="text-sm text-gray-800 leading-relaxed">{tip.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
