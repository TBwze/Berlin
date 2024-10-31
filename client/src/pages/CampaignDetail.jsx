import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import CustomButton from "../components/CustomButton.component";
import TextFieldComponent from "../components/Textfield.component";
import { getAccountByWallet } from "../api/User/getUserByWallet.api";
import { useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../context";
import silverBadge from "../assets/silver.png";
import goldBadge from "../assets/gold.png";
import bronzeBadge from "../assets/bronze.png";
import PageLoad from "../components/Loading.component";
import { getUserDetails } from "../api/User/getUserDetails.api";
import PopupComponent from "../components/PopUp.component";
import TextFieldDecimalComponent from "../components/TextFieldDecimal.component";
import { getAllComments } from "../api/Comment/getAllComment.api";
import CommentSection from "../components/Comment.component";
import { postComment } from "../api/Comment/postComment.api";
import CheckDonationAndReward from "../components/CheckDonationAndReward.component";
import DataGridComponent from "../components/DataGrid.component";

const CampaignDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [comments, setComments] = useState([]);
  const {
    address,
    contract,
    getCampaignById,
    donateToCampaign,
    withdrawFunds,
    getCampaignDonators
  } = useStateContext();
  const [isLoading, setIsLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [userId, setUserId] = useState(null);
  const [newProfilePict, setNewProfilePict] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const [username, setUsername] = useState(null);
  const [userPicture, setUserPicture] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [donatorData, setDonatorData] = useState([]);
  const [gridRows, setGridRows] = useState([]);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      minimal_eth: "",
      content: "",
      is_owner: false
    }
  });

  const fundingPercentage = Math.min((data.amountCollected / data.targetAmount) * 100, 100).toFixed(
    1
  );
  const percentage = Number(fundingPercentage);

  const isTargetMet = data.amountCollected >= data.targetAmount;
  const isDeadlinePassed = new Date(data.deadline) < new Date();

  const getRewardBadge = (reward) => {
    switch (reward) {
      case "Gold":
        return (
          <div className="flex items-center">
            <img src={goldBadge} alt="Gold Badge" className="w-8 h-8" />
            <span className="ml-2">Gold</span>
          </div>
        );
      case "Silver":
        return (
          <div className="flex items-center">
            <img src={silverBadge} alt="Silver Badge" className="w-8 h-8" />
            <span className="ml-2">Silver</span>
          </div>
        );
      case "Bronze":
        return (
          <div className="flex items-center">
            <img src={bronzeBadge} alt="Bronze Badge" className="w-8 h-8" />
            <span className="ml-2">Bronze</span>
          </div>
        );
      default:
        return null;
    }
  };
  const columns = [
    { headerName: "Tier", field: "tier" },
    { headerName: "Username", field: "addresses" },
    { headerName: "Amounts", field: "amounts" }
  ];

  const getUsernamesForAddresses = async (addresses) => {
    try {
      const usernames = await Promise.all(
        addresses.map(async (address) => {
          const response = await getAccountByWallet(address);
          return response.data.username || address;
        })
      );
      return usernames;
    } catch (error) {
      return addresses;
    }
  };

  const createGridRows = async () => {
    setIsLoading(true);
    try {
      const gridRows = await Promise.all(
        donatorData.map(async (item) => {
          const usernames =
            item.addresses.length > 0 ? await getUsernamesForAddresses(item.addresses) : [];

          return {
            tier: getRewardBadge(item.tier),
            addresses: usernames.length > 0 ? usernames.join(", ") : "",
            amounts: item.amounts.length > 0 ? item.amounts.join(", ") : ""
          };
        })
      );
      setGridRows(gridRows);
    } catch (error) {
      console.error("Error creating grid rows:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDonors = async () => {
    setIsLoading(true);
    try {
      const data = await getCampaignDonators(id);
      setDonatorData(data);
    } catch (error) {
      console.error("Error fetching donors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCampaign = async () => {
    try {
      const campaignData = await getCampaignById(id);
      setData(campaignData);
      setWallet(campaignData.owner);

      const userDetails = await getUserDetails();
      setUserId(userDetails.data.wallet);
      setUsername(userDetails.data.username);
      setUserPicture(userDetails.data.profilePicture);
      if (userDetails.data.wallet === campaignData.owner) {
        form.setValue("is_owner", true);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCommentsData = async () => {
    setLoadingComments(true);
    try {
      const fetchedComments = await getAllComments(id);
      setComments(fetchedComments.data);
      form.setValue("total_pages", fetchedComments.total_pages);
      form.setValue("total_rows", fetchedComments.total_rows);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoadingComments(true);
      await postComment(id, userId, form.watch("content"));
      fetchCommentsData();
      form.reset({ content: "" });
    } catch (error) {
      alert(error.message);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleDonation = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const donationAmount = form.watch("minimal_eth");
      await donateToCampaign(id, donationAmount);
      setPopupMessage("Donation Successful!");
      setPopupVisible(true);
      fetchCampaign();
    } catch (error) {
      alert("Error donating to campaign: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (contract) {
      fetchCampaign();
      fetchDonors();
      fetchCommentsData();
      createGridRows();
    }
  }, [address, contract, id]);

  useEffect(() => {
    if (wallet) {
      getAccountByWallet(wallet)
        .then((response) => {
          setNewProfilePict(response.data.profilePicture);
        })
        .catch((error) => {
          alert(error.message);
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
      setPopupMessage("Funds withdrawn successfully!");
      setPopupVisible(true);
    } catch (error) {
      alert("Error withdrawing funds: " + error.message);
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
          <div className="Header font-bold text-2xl pb-4">
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
                      badgeName = "Gold";
                    } else if (data.rewards.length - index === 2) {
                      badgeImage = silverBadge;
                      badgeName = "Silver";
                    } else if (data.rewards.length - index === 1) {
                      badgeImage = bronzeBadge;
                      badgeName = "Bronze";
                    }

                    return (
                      <div key={index} className="p-4 border border-gray-300 rounded-lg shadow-lg">
                        <div className="flex items-start items-center gap-4">
                          <div className="flex flex-col items-center text-center w-24">
                            <img src={badgeImage} alt={badgeName} className="w-16 h-16 mb-2" />
                            <h3 className="text-lg font-bold">{badgeName}</h3>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-bold mb-2 text-left">Description:</h3>
                            <p className="text-sm text-justify mb-2">{reward.description}</p>
                            <h3 className="text-sm font-bold mb-2 text-left">Minimum Donation:</h3>
                            <p className="text-sm text-left bg-gray-200 p-2 rounded-sm">
                              {">"} {reward.minAmount} ETH
                            </p>{" "}
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
                <img
                  src={newProfilePict}
                  alt="ProfilePicture"
                  className="w-20 h-20 mr-2 rounded-full"
                />
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
                <h3 className="font-bold mt-3 text-left mb-3">Informasi Proyek</h3>
                <p className="text-balance text-justify text-sm">{data.description}</p>
              </div>
              {/* {form.watch('is_owner') && isTargetMet && isDeadlinePassed && ( */}
              {form.watch("content") !== "asdfasdfannnbbbbbbbbbb" && (
                <CustomButton
                  className="w-40"
                  btnType="button"
                  title="Withdraw Funds"
                  bgColor="#4CAF50"
                  styles="font-semibold rounded px-4"
                  textColor="#ffffff"
                  handleClick={handleWithdrawFunds}
                />
              )}

              {/* {!form.watch('is_owner') && !isDeadlinePassed && ( */}
              {form.watch("content") !== "i[qwpoeoirq[pwoier" && (
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
              <DataGridComponent columns={columns} rows={gridRows} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetail;
