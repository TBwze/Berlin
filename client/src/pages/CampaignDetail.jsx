import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import CustomButton from '../components/CustomButton.component';
import TextFieldDecimalComponent from '../components/TextFieldDecimal.component';
import { getAccountByWallet } from "../api/User/getUserByWallet.api";
import { useParams } from 'react-router-dom';
import { useStateContext } from '../context';
import silverBadge from '../assets/silver.png';
import goldBadge from '../assets/gold.png';
import bronzeBadge from '../assets/bronze.png';
import PageLoad from '../components/Loading.component';

const CampaignDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const { address, contract, getCampaignById } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [NewProfilePict, setNewProfilePict] = useState(null);

  const form = useForm({
    defaultValues: {
      minimal_eth: '',
      Komentar: ''
    }
  });

  // Calculate the funding percentage
  const fundingPercentage = Math.min((data.amountCollected/ data.targetAmount) * 100, 100).toFixed(1);
  const percentage = Number(fundingPercentage);

  const fetchCampaign = async () => {
    try {
      const campaignData = await getCampaignById(id);
      setData(campaignData);
      setProfilePicture(campaignData.owner)
      console.log('Fetched campaign data:', campaignData);
    } catch (error) {
      alert('Error fetching campaign:', error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    if (contract) {
      fetchCampaign();
    }
    setIsLoading(false);
  }, [address, contract, id]);

  useEffect(() => {
  if (profilePicture !== null) {
    getAccountByWallet(profilePicture)
      .then((response) => {
        console.log(response)
        setNewProfilePict(response.profilePicture);
      })
      .catch((err) => {
        console.error('Error fetching user by wallet:', err);
      });
  }
  }, [profilePicture]);

  return (
    <div className="flex flex-col items-center justify-center mx-auto max-w-[1280px] p-4">
      <div className="flex flex-col text-center pb-4">
        <PageLoad loading={isLoading} />
        {/* title Section */}
        <div className="Header font-bold text-xl pb-4">
           <h3>{data.title}</h3>
        </div>
      </div>
      <div className="flex flex-row justify-around">
        {/* left section */}
        <div className="flex flex-col gap-8 w-1/2">
          {/* Galery section */}
          <div className="grid grid-rows-2 grid-cols-4 gap-4 items-center w-auto border border-gray-300 rounded-lg shadow-lg p-4">
            <div className="row-span-4 col-span-4 w-full">
              <img src={data.imageUrl} alt="test" />
            </div>
            {/* <div className="row-span-2 col-span-2 w-auto">
              <img src="src/assets/dummy.jpg" alt="test" />
            </div>
            <img className="size-full" src="src/assets/dummy.jpg" alt="test" />
            <img className="size-full" src="src/assets/dummy.jpg" alt="test" />
            <img className="size-full" src="src/assets/dummy.jpg" alt="test" />
            <img className="size-full" src="src/assets/dummy.jpg" alt="test" /> */}
          </div>
          {/* Badge Section */}
          <div className="flex flex-col gap-4">
            {data.rewards?.slice().reverse().map((reward, index) => {
              let badgeImage;
              let badgeName;

              // Determine badge based on the reward tier
              if (data.rewards.length - index === 3) {
                badgeImage = goldBadge;  // image path for Gold badge
                badgeName = "Gold";
              } else if (data.rewards.length - index === 2) {
                badgeImage = silverBadge;  // image path for Silver badge
                badgeName = "Silver";
              } else if (data.rewards.length - index === 1) {
                badgeImage = bronzeBadge;  // image path for Bronze badge
                badgeName = "Bronze";
              } 

              return (
                <div key={index} className="p-4 border border-gray-300 rounded-lg shadow-lg">
                  <div className='flex flex-row gap-4'>
                    <div className="flex flex-col items-center text-center">
                      <img src={badgeImage} alt={badgeName} className="w-10 h-10 mr-2" />
                      <h3 className="text-l font-bold items-center">{badgeName}</h3>
                    </div>
                    <div className='flex flex-col'>
                      <h3 className='text-sm font-bold'>Desciption:</h3>
                      <p className='text-sm'>{reward.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Comment Section */}
          <div className="flex flex-col gap-2">
            {/* Header */}
            <h2 className="font-bold text-xl mb-4">Komentar</h2>
            {/* textbox Comment */}
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
            {/*Comments */}
            <div className="flex flex-row items-center border border-gray-300 rounded-lg shadow-lg p-2">
              <img className="w-20" src="src/assets/ProfilePicture.png" alt="ProfilePicture" />
              <div className="flex flex-col">
                <h3 className="font-semibold text-sm">Username</h3>
                <p className="text-xs font-thin">15 - 06- 2024</p>
                <p className="text-sm text-wrap text-pretty text-balance">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ultrices
                  pellentesque pellentesque.
                </p>
              </div>
            </div>

            <div className="flex flex-row items-center border border-gray-300 rounded-lg shadow-lg p-2">
              <img className="w-20" src="src/assets/ProfilePicture.png" alt="ProfilePicture" />
              <div className="flex flex-col">
                <h3 className="font-semibold text-sm">Username</h3>
                <p className="text-xs font-thin">15 - 06- 2024</p>
                <p className="text-sm text-wrap text-pretty text-balance">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ultrices
                  pellentesque pellentesque.
                </p>
              </div>
            </div>

            <div className="flex flex-row items-center border border-gray-300 rounded-lg shadow-lg p-2">
              <img className="w-20" src="src/assets/ProfilePicture.png" alt="ProfilePicture" />
              <div className="flex flex-col">
                <h3 className="font-semibold text-sm">Username</h3>
                <p className="text-xs font-thin">15 - 06- 2024</p>
                <p className="text-sm text-wrap text-pretty text-balance">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ultrices
                  pellentesque pellentesque.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* right section */}
        <div className="flex flex-col w-1/2 pl-10 gap-4 ">
          <div className="flex flex-row items-center">
            <img
              src={NewProfilePict}
              alt="ProfilePicture"
              className="w-20 h-20 mr-2"
            />
            <h4 className="text-xl font-semibold">{data.username}</h4>
          </div>
          <p className="font-bold text-right">{data.amountCollected} / {data.targetAmount} Tercapai</p>
          {/* Progress Bar */}
          <div className='flex flex-row items-center gap-3'>
            <div class="w-full  bg-gray-300 rounded-3xl h-3.5 ">
            <div
              class="bg-green-500 h-3.5 rounded-3xl text-xs text-white text-center shadow-lg"
              style={{ width: `${fundingPercentage}%` }}
              role="progressbar"
              aria-valuenow="60"
              aria-valuemin="0"
              aria-valuemax="100">
            </div>
          </div>
          {percentage}%
          </div>
          <div className="flex flex-row justify-between">
            <h3 className="font-bold">100 Donatur</h3>
            <div className="flex flex-col">
              <h3 className="font-bold">Deadline :</h3>
              <p>{data.deadline}</p>
            </div>
          </div>
          {/* Informasi Proyek */}
          <h3 className="font-bold">Informasi Proyek</h3>
          <p className="text-balance text-left text-sm">{data.description}</p>
          {/* Share Button */}
          <CustomButton
            className="w-40"
            btnType="button"
            title="Share"
            bgColor="#4169E1"
            styles="font-semibold rounded px-4 border-2"
            textColor="white"
            borderColor="#2E6950"
          />
          {/* Nominal Donasi */}
          <div className="border border-gray-300 rounded-lg p-4 shadow-lg">
            <div className="flex flex-col mb-2">
              <TextFieldDecimalComponent
                name="minimal_eth"
                label="Masukkan Nominal Donasi"
                control={form.control}
                required
                addOrmentText="ETH"
              />
            </div>
          </div>
          <CustomButton
            btnType="button"
            title="Donasi Sekarang"
            bgColor="#4CAF50"
            styles="font-semibold rounded px-4 border-2"
            textColor="#ffffff"
          />
        </div>
      </div>
    </div>
  );
};
export default CampaignDetail;
