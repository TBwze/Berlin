import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import CustomButton from '../components/CustomButton.component';
import TextFieldComponent from '../components/Textfield.component';
import { getAccountByWallet } from '../api/User/getUserByWallet.api';
import { useParams } from 'react-router-dom';
import { useStateContext } from '../context';
import silverBadge from '../assets/silver.png';
import goldBadge from '../assets/gold.png';
import bronzeBadge from '../assets/bronze.png';
import PageLoad from '../components/Loading.component';
import { getUserDetails } from '../api/User/getUserDetails.api';
import PopupComponent from '../components/PopUp.component';
import TextFieldDecimalComponent from '../components/TextFieldDecimal.component';
import { getAllComments } from '../api/Comment/getAllComment.api';
import CommentSection from '../components/Comment.component';
import { postComment } from '../api/Comment/postComment.api';
import CheckDonationAndReward from '../components/CheckDonationAndReward.component';
import DataGridComponent from '../components/DataGrid.component';

const CampaignDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [comments, setComments] = useState([]);
  const { address, contract, getCampaignById, donateToCampaign, fetchUserReward, withdrawFunds } =
    useStateContext();
  const [isLoading, setIsLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [userId, setUserId] = useState(null);
  const [newProfilePict, setNewProfilePict] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const [username, setUsername] = useState(null);
  const [userPicture, setUserPicture] = useState(null);
  const [donators, setDonators] = useState([]);
  const [rows, setRows] = useState([]);
  const [popupMessage, setPopupMessage] = useState('');

  const form = useForm({
    defaultValues: {
      minimal_eth: '',
      content: '',
      is_owner: false
    }
  });

  const fundingPercentage = Math.min((data.amountCollected / data.targetAmount) * 100, 100).toFixed(
    1
  );
  const percentage = Number(fundingPercentage);

  const isTargetMet = data.amountCollected >= data.targetAmount;
  const isDeadlinePassed = new Date(data.deadline) < new Date();
  useEffect(() => {
    const fetchRewards = async () => {
      const updatedRows = [];

      for (const address of donators) {
        const rewardTier = await fetchUserReward(id, address);
        const donator = await getAccountByWallet(address);
        const usernames = donator.username;

        if (rewardTier) {
          updatedRows.push({ donor: usernames, reward: rewardTier });
        }
      }

      setRows(updatedRows);
    };

    if (donators.length > 0) {
      fetchRewards();
    }
  }, [donators, id]);

  const columns = [
    { headerName: 'Donor Address', field: 'donor' },
    { headerName: 'Reward Tier', field: 'reward' }
  ];

  const getRewardBadge = (reward) => {
    switch (reward) {
      case 'Gold':
        return <img src={goldBadge} alt="Gold Badge" className="w-8 h-8" />;
      case 'Silver':
        return <img src={silverBadge} alt="Silver Badge" className="w-8 h-8" />;
      case 'Bronze':
        return <img src={bronzeBadge} alt="Bronze Badge" className="w-8 h-8" />;
      default:
        return null;
    }
  };
  const rowsWithBadges = rows.map((row) => ({
    ...row,
    reward: getRewardBadge(row.reward) // Replace reward text with image
  }));

  const fetchCampaign = async () => {
    try {
      const campaignData = await getCampaignById(id);
      setData(campaignData);
      setDonators(campaignData.donators);
      setWallet(campaignData.owner);

      const userDetails = await getUserDetails();
      setUserId(userDetails.wallet);
      setUsername(userDetails.username);
      setUserPicture(userDetails.profilePicture);
      if (userDetails.wallet === campaignData.owner) {
        form.setValue('is_owner', true);
      }
    } catch (error) {
      alert('Error fetching campaign:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCommentsData = async () => {
    setLoadingComments(true);
    try {
      const fetchedComments = await getAllComments(id);
      setComments(fetchedComments);
    } catch (error) {
      alert('Error fetching comments:', error.message);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoadingComments(true);
      await postComment(id, userId, form.watch('content'));
      fetchCommentsData();
      form.reset({ content: '' });
    } catch (error) {
      alert(error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleDonation = async (e) => {
    e.preventDefault();

    try {
      const donationAmount = form.watch('minimal_eth');
      await donateToCampaign(id, donationAmount);
      setPopupMessage('Donation Successful!');
      setPopupVisible(true);
      fetchCampaign();
    } catch (error) {
      alert('Error donating to campaign: ' + error.message);
    }
  };
  useEffect(() => {
    if (contract) {
      fetchCampaign();
      fetchCommentsData();
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
    window.location.reload();
  };

  const handleWithdrawFunds = async () => {
    setIsLoading(true);
    try {
      await withdrawFunds(id);
      setPopupMessage('Funds withdrawn successfully!');
      setPopupVisible(true);
    } catch (error) {
      alert('Error withdrawing funds: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mx-auto max-w-[1280px] p-4">
      <PageLoad loading={isLoading || loadingComments} />
      <PopupComponent message={popupMessage} visible={popupVisible} onClose={closePopup} />
      {!isLoading && (
        <div className="flex flex-col text-center pb-4">
          <div className="Header font-bold text-xl pb-4">
            <h3>{data.title}</h3>
          </div>
          <div className="flex flex-row justify-around">
            <div className="flex flex-col gap-8 w-1/2">
              <div className="grid grid-rows-2 grid-cols-4 gap-4 items-center w-auto border border-gray-300 rounded-lg shadow-lg p-4">
                <div className="row-span-4 col-span-4 w-full">
                  <img src={data.imageUrl} alt="Campaign" />
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
                            <h3 className="text-sm font-bold mb-2 text-left">Description:</h3>
                            <p className="text-sm text-left">{reward.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <h2 className="font-bold text-xl text-left">Comments</h2>
                <hr className="border-t border-gray-400 my-2" />
                <form
                  onSubmit={handleCommentSubmit}
                  className="flex flex-col gap-4 border border-2 p-4 rounded-lg shadow-lg bg-gray-100">
                  <TextFieldComponent
                    name="content"
                    label=""
                    placeholder="Add a Comment..."
                    control={form.control}
                    type="textarea"
                    rows={4}
                    required={true}
                    errorMessage={form.formState.errors.content?.message}
                  />
                  <div className="flex justify-end">
                    <CustomButton
                      btnType="submit"
                      title="Post"
                      bgColor="#4CAF50"
                      styles="font-semibold rounded px-4 border-2"
                      textColor="#ffffff"
                      className="w-1/4"
                    />
                  </div>
                </form>
                {/* Render comments with nested replies */}
                <div className="flex flex-col gap-2 mt-4">
                  <div>
                    {loadingComments ? (
                      <p>Loading comments...</p>
                    ) : (
                      comments.map((comment) => (
                        <CommentSection
                          key={comment._id}
                          comment={comment}
                          userId={userId}
                          campaignId={id}
                          refreshComments={fetchCommentsData}
                        />
                      ))
                    )}
                  </div>
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
                <div className="w-full bg-gray-300 h-3.5 ">
                  <div
                    className="bg-green-500 h-3.5 text-xs text-white text-center shadow-lg"
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
              {form.watch('is_owner') && isTargetMet && isDeadlinePassed && (
                <CustomButton
                  className="w-40"
                  btnType="button"
                  title="Withdraw Funds"
                  bgColor="#4CAF50"
                  styles="font-semibold rounded px-4"
                  textColor="#ffffff"
                  onClick={handleWithdrawFunds}
                />
              )}

              {!form.watch('is_owner') && (
                <form onSubmit={handleDonation} className="flex flex-col mb-2">
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
                  <div>
                    <CheckDonationAndReward
                      campaignId={id}
                      username={username}
                      profilePicture={userPicture}
                    />
                  </div>
                </form>
              )}
              <DataGridComponent columns={columns} rows={rowsWithBadges} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetail;
