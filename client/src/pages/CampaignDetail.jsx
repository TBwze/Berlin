import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import CustomButton from '../components/CustomButton.component';
import TextFieldDecimalComponent from '../components/TextFieldDecimal.component';
import { getAccountByWallet } from '../api/User/getUserByWallet.api';
import { useParams } from 'react-router-dom';
import { useStateContext } from '../context';
import silverBadge from '../assets/silver.png';
import goldBadge from '../assets/gold.png';
import bronzeBadge from '../assets/bronze.png';
import PageLoad from '../components/Loading.component';
import { getUserDetails } from '../api/User/getUserDetails.api';
import PopupComponent from '../components/PopUp.component';

const CampaignDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const { address, contract, getCampaignById, donateToCampaign } = useStateContext();
  const [isLoading, setIsLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [newProfilePict, setNewProfilePict] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);

  const form = useForm({
    defaultValues: {
      minimal_eth: '',
      Komentar: '',
      is_owner: false
    }
  });

  const fundingPercentage = Math.min((data.amountCollected / data.targetAmount) * 100, 100).toFixed(
    1
  );
  const percentage = Number(fundingPercentage);

  const fetchCampaign = async () => {
    try {
      const campaignData = await getCampaignById(id);
      setData(campaignData);
      setWallet(campaignData.owner);

      const userDetails = await getUserDetails();
      if (userDetails.wallet === campaignData.owner) {
        form.setValue('is_owner', true);
      }
    } catch (error) {
      alert('Error fetching campaign:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDonation = async () => {
    try {
      const donationAmount = form.watch('minimal_eth');
      await donateToCampaign(id, donationAmount);
      setPopupVisible(true);
      fetchCampaign();
    } catch (error) {
      alert('Error donating to campaign: ' + error.message);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchCampaign();
    }
  }, [address, contract, id]);

  useEffect(() => {
    if (wallet) {
      getAccountByWallet(wallet)
        .then((response) => {
          setNewProfilePict(response.profilePicture);
        })
        .catch((err) => {
          alert('Error fetching user by wallet:', err);
        });
    }
  }, [wallet]);

  const closePopup = () => {
    setPopupVisible(false);
  };
  return (
    <div className="flex flex-col items-center justify-center mx-auto max-w-[1280px] p-4">
      <PageLoad loading={isLoading} />
      <PopupComponent message="Donation Successful!" visible={popupVisible} onClose={closePopup} />
      {!isLoading && (
        <div className="flex flex-col text-center pb-4">
          <div className="Header font-bold text-xl pb-4">
            <h3>{data.title}</h3>
          </div>
          <div className="flex flex-row justify-around">
            <div className="flex flex-col gap-8 w-1/2">
              <div className="grid grid-rows-2 grid-cols-4 gap-4 items-center w-auto border border-gray-300 rounded-lg shadow-lg p-4">
                <div className="row-span-4 col-span-4 w-full">
                  <img src={data.imageUrl} alt="test" />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {data.rewards
                  ?.slice()
                  .reverse()
                  .map((reward, index) => {
                    let badgeImage;
                    let badgeName;

                    if (data.rewards.length - index === 3) {
                      badgeImage = goldBadge;
                      badgeName = 'Gold';
                    } else if (data.rewards.length - index === 2) {
                      badgeImage = silverBadge;
                      badgeName = 'Silver';
                    } else if (data.rewards.length - index === 1) {
                      badgeImage = bronzeBadge;
                      badgeName = 'Bronze';
                    }

                    return (
                      <div key={index} className="p-4 border border-gray-300 rounded-lg shadow-lg">
                        <div className="flex items-start gap-4">
                          <div className="flex flex-col items-center text-center w-24">
                            <img src={badgeImage} alt={badgeName} className="w-10 h-10 mb-2" />
                            <h3 className="text-lg font-bold">{badgeName}</h3>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-bold mb-2">Description:</h3>
                            <p className="text-sm">{reward.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="font-bold text-xl mb-4">Komentar</h2>
                <div className="flex flex-row border border-gray-300 rounded-lg shadow-lg p-2 items-center gap-4">
                  <img className="w-20" src="src/assets/ProfilePicture.png" alt="ProfilePicture" />
                  <textarea
                    className="w-full border border-gray-300 rounded-lg shadow-lg p-2 text-sm"
                    placeholder="Masukkan Komentar Anda"></textarea>
                  <CustomButton
                    btnType="button"
                    title="POST"
                    bgColor="#4CAF50"
                    styles="font-semibold rounded px-4 border-2"
                    textColor="#ffffff"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col w-1/2 pl-10 gap-4 ">
              <div className="flex flex-row items-center">
                <img src={newProfilePict} alt="ProfilePicture" className="w-20 h-20 mr-2" />
                <h4 className="text-xl font-semibold">{data.username}</h4>
              </div>
              <p className="font-bold text-right">
                {data.amountCollected} / {data.targetAmount} Tercapai
              </p>
              <div className="flex flex-row items-center gap-3">
                <div className="w-full bg-gray-300 rounded-3xl h-3.5 ">
                  <div
                    className="bg-green-500 h-3.5 rounded-3xl text-xs text-white text-center shadow-lg"
                    style={{ width: `${fundingPercentage}%` }}
                    role="progressbar"
                    aria-valuenow="60"
                    aria-valuemin="0"
                    aria-valuemax="100"></div>
                </div>
                {percentage}%
              </div>
              <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                  <h3>
                    <b>Deadline</b>: {data.deadline}
                  </h3>
                </div>
              </div>
              <div>
                <h3 className="font-bold mt-3">Informasi Proyek</h3>
                <p className="text-balance text-left text-sm mt-0">{data.description}</p>
              </div>
              <CustomButton
                className="w-40"
                btnType="button"
                title="Share"
                bgColor="#4169E1"
                styles="font-semibold rounded px-4 border-2"
                textColor="white"
                borderColor="#2E6950"
              />
              {!form.watch('is_owner') && (
                <form
                  onSubmit={form.handleSubmit(handleDonation)}
                  className="flex flex-col mb-2">
                  <div className="mb-3">
                    <TextFieldDecimalComponent
                      name="minimal_eth"
                      label="Masukkan Nominal Donasi"
                      control={form.control}
                      required
                      addOrmentText="ETH"
                    />
                  </div>
                  <CustomButton
                    btnType="submit"
                    title="Donasi"
                    styles="bg-primary rounded-2xl p-2 text-sm font-semibold"
                    textColor="#ffffff"
                    bgColor="#4CAF50"
                  />
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetail;