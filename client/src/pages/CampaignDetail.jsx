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
import CampaignDonatorsGrid from "./DonatorList";

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
    getLeaderboard,
    deleteCampaign
  } = useStateContext();
  const [isLoading, setIsLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [userId, setUserId] = useState(null);
  const [newProfilePict, setNewProfilePict] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [withdraw, setWithdraw] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const [username, setUsername] = useState(null);
  const [userPicture, setUserPicture] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [gridRows, setGridRows] = useState([]);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      minimal_eth: "",
      content: "",
      is_owner: false,
      page: 0,
      limit: 10,
      total_pages: 0,
      total_rows: 0
    }
  });

  const fundingPercentage = Math.min((data.amountCollected / data.targetAmount) * 100, 100).toFixed(
    1
  );
  const percentage = Number(fundingPercentage);

  const isTargetMet = data.amountCollected >= data.targetAmount;
  const isDeadlinePassed = new Date(data.deadline) < new Date();
  const isOneMonthPassed =
    new Date(data.deadline).setMonth(new Date(data.deadline).getMonth() + 1) < new Date();

  const columns = [
    {
      field: "rank",
      headerName: "Peringkat"
    },
    {
      field: "username",
      headerName: "Donatur"
    },
    {
      field: "amount",
      headerName: "Total Donasi (ETH)"
    }
  ];

  const fetchDonors = async (page, limit) => {
    setIsLoading(true);
    try {
      const response = await getLeaderboard(id, page, limit);
      const transformedRows = await Promise.all(
        response.data.map(async (donor, index) => {
          try {
            const userResponse = await getAccountByWallet(donor.address);
            return {
              rank: page * limit + index + 1,
              username:
                userResponse.data.username ||
                `${donor.address.slice(0, 6)}...${donor.address.slice(-4)}`,
              amount: donor.amount
            };
          } catch (error) {
            return {
              rank: page * limit + index + 1,
              username: `${donor.address.slice(0, 6)}...${donor.address.slice(-4)}`,
              amount: donor.amount
            };
          }
        })
      );

      setGridRows(transformedRows);
      form.setValue("page", response.page);
      form.setValue("limit", response.limit);
      form.setValue("total_pages", response.total_pages);
      form.setValue("total_rows", response.total_rows);
    } catch (error) {
      setGridRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCampaign = async () => {
    try {
      const campaignData = await getCampaignById(id);
      setData(campaignData.data);
      setWallet(campaignData.data.owner);
      setWithdraw(campaignData.data.isWithdraw);

      const userDetails = await getUserDetails();
      setUserId(userDetails.data.wallet);
      setUsername(userDetails.data.username);
      setUserPicture(userDetails.data.profilePicture);
      if (userDetails.data.wallet === campaignData.data.owner) {
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
      setPopupMessage("Donasi Berhasil!");
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
      fetchDonors(0, 10);
      fetchCommentsData();
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

  let is_owner = form.watch("is_owner");

  useEffect(() => {
    if (is_owner && isOneMonthPassed) {
      if (withdraw === true) {
        removeCampaign();
      } else if (withdraw === false) {
        handleWithdrawFunds();
      }
    }
  }, []);

  const removeCampaign = async () => {
    setIsLoading(true);
    try {
      await deleteCampaign(id);
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
    setIsLoading(false);
  };

  const closePopup = () => {
    setPopupVisible(false);
    window.location.reload();
  };

  const handleWithdrawFunds = async () => {
    setIsLoading(true);
    try {
      await withdrawFunds(id);
      setPopupMessage("Dana berhasil ditarik!");
      setPopupVisible(true);
    } catch (error) {
      alert("Error withdrawing funds: " + error.message);
    } finally {
      setIsLoading(false);
      window.location.reload();
      document.getElementById("my_modal").showModal();
    }
  };

  const handleChangePageGrid = async (page) => {
    form.setValue("page", page);
    await fetchDonors(page, form.watch("limit"));
  };

  const handleChangeLimitGrid = async (limit) => {
    form.setValue("limit", limit);
    form.setValue("page", 0);
    await fetchDonors(form.watch("page"), limit);
  };

  return (
    <div className="flex flex-col items-center justify-center mx-auto max-w-[1280px] p-4">
      <PageLoad loading={isLoading || loadingComments} />
      <PopupComponent message={popupMessage} visible={popupVisible} onClose={closePopup} />
      {!isLoading && (
        <div className="flex flex-col text-center pb-4">
          <div className="Header font-bold text-2xl pb-4">
            <h1 className="uppercase py-8 text-5xl">{data.title}</h1>
          </div>
          <div className="flex flex-row justify-around">
            <div className="flex flex-col gap-4 w-[40vw]">
              <div className="grid grid-rows-2 grid-cols-4 gap-4 items-center w-auto shadow-lg">
                <div className="row-span-4 col-span-4 w-full">
                  <img src={data.imageUrl} alt="Campaign" className="w-full" />
                </div>
              </div>
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center">
                  <img
                    src={newProfilePict}
                    alt="ProfilePicture"
                    className="w-20 h-20 mr-2 rounded-full"
                  />
                  <h4 className="text-xl text-left font-bold">
                    {data.username}
                    <span className="font-normal"> menyelenggarakan crowdfunding ini</span>
                  </h4>
                </div>
                <div className="flex">
                  {form.watch("is_owner") && isTargetMet && isDeadlinePassed && (
                    <div>
                      <CustomButton
                        className="btn btn-success bg-green-500"
                        btnType="button"
                        title="Withdraw Funds"
                        styles="font-semibold rounded px-4 text-nowrap"
                        textColor="#ffffff"
                        handleClick={handleWithdrawFunds}
                      />
                    </div>
                  )}
                </div>
              </div>
              <hr style={{ border: "1px solid #ccc" }} />
              <div className="pb-4">
                <h2 className="font-bold text-xl text-left pl-4 pb-4">Informasi Kampanye</h2>
                <p className="text-balance text-justify pl-4">{data.description}</p>
              </div>
              <div className="flex flex-col gap-6 p-4">
                {data.rewards
                  ?.slice()
                  .reverse()
                  .map((reward, index) => {
                    let badgeImage;
                    let badgeName;
                    let borderColor;
                    let bgColor;

                    if (data.rewards.length - index === 3) {
                      badgeImage = goldBadge;
                      badgeName = "Gold";
                      borderColor = "border-yellow-200";
                      bgColor = "bg-yellow-100";
                    } else if (data.rewards.length - index === 2) {
                      badgeImage = silverBadge;
                      badgeName = "Silver";
                      borderColor = "border-gray-200";
                      bgColor = "bg-gray-100";
                    } else if (data.rewards.length - index === 1) {
                      badgeImage = bronzeBadge;
                      badgeName = "Bronze";
                      borderColor = "border-orange-200";
                      bgColor = "bg-orange-100";
                    }

                    return (
                      <div
                        key={index}
                        className={`p-6 border-2 ${borderColor} ${bgColor} rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out`}>
                        <div className="flex items-start gap-6">
                          <div className="flex flex-col items-center text-center min-w-28">
                            <div className="p-4 bg-white rounded-full shadow-sm mb-3">
                              <img
                                src={badgeImage}
                                alt={badgeName}
                                className="w-16 h-16 object-contain"
                              />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">{badgeName}</h3>
                          </div>

                          <div className="flex-1 space-y-4">
                            <div>
                              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                                Informasi Peringkat
                              </h3>
                              <p className="text-sm leading-relaxed text-gray-600">
                                {reward.description}
                              </p>
                            </div>

                            <div>
                              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                                Donasi Minimum yang Dibutuhkan
                              </h3>
                              <div className="inline-block bg-white border border-gray-200 rounded-lg px-4 py-2">
                                <span className="text-sm font-medium text-gray-800">
                                  {reward.minAmount} ETH
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <h2 className="font-bold text-xl text-left">Komentar</h2>
                <hr className="border-t border-gray-400 my-2" />
                <form
                  onSubmit={handleCommentSubmit}
                  className="flex flex-col gap-4 border-2 p-4 rounded-lg shadow-lg bg-gray-100">
                  <TextFieldComponent
                    name="content"
                    label=""
                    placeholder="Masukkan Komentar..."
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
                      styles="font-semibold rounded px-4 border-2"
                      className="btn-sm btn-outline bg-green-500 uppercase"
                    />
                  </div>
                </form>
                <div className="flex flex-col gap-2 mt-4">
                  <div>
                    {loadingComments ? (
                      <p>Loading Komentar...</p>
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
            <div className="w-[30vw] h-full top-10 flex flex-col gap-4 ml-10 p-8 rounded-lg shadow-xl border">
              {withdraw === false ? (
                <>
                  <p className="font-bold text-right">
                    {data.amountCollected} / {data.targetAmount} Tercapai
                  </p>
                  <div className="flex flex-row items-center gap-3">
                    <progress
                      className="progress progress-success w-full h-3.5"
                      value={fundingPercentage}
                      max="100"></progress>
                    {percentage}%
                  </div>
                  <div className="flex flex-row justify-between">
                    <h3>
                      <b>Deadline</b>: {data.deadline}
                    </h3>
                  </div>

                  {!form.watch("is_owner") && !isDeadlinePassed && (
                    <div className="mb-2">
                      <CheckDonationAndReward
                        campaignId={id}
                        username={username}
                        profilePicture={userPicture}
                      />
                    </div>
                  )}

                  {!form.watch("is_owner") && !isDeadlinePassed && (
                    <button
                      className="btn btn-block bg-green-600 text-white hover:bg-green-800 my-1"
                      onClick={() => document.getElementById("my_modal_2").showModal()}>
                      Donasi
                    </button>
                  )}
                  <dialog id="my_modal_2" className="modal">
                    <div className="modal-box">
                      <div className="flex flex-col">
                        <h3 className="font-bold text-xl text-center text-balance">{data.title}</h3>
                        <p className="text-sm">
                          Pemilik Kampanye: <span className="font-semibold">{data.username}</span>
                        </p>
                        <img
                          src={data.imageUrl}
                          alt="Campaign"
                          className="w-full p-2 rounded-2xl"
                        />
                        <p className="text-balance text-justify text-sm p-3 max-h-40 overflow-y-auto">
                          {data.description}
                        </p>
                      </div>

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
                          styles="rounded-2xl p-2 text-sm font-semibold"
                          className="btn-block btn-outline btn-success bg-green-500"
                          textColor="#ffffff"
                        />
                      </form>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                      <button>close</button>
                    </form>
                  </dialog>

                  <DataGridComponent
                    columns={columns}
                    rows={gridRows}
                    page={form.watch("page")}
                    limit={form.watch("limit")}
                    totalPages={form.watch("total_pages")}
                    handleChangePage={handleChangePageGrid}
                    handleChangeLimit={handleChangeLimitGrid}
                  />
                </>
              ) : (
                <>
                  <p className="font-bold text-center text-2xl">Kampanye Selesai</p>
                  <p className="font-bold text-right">Target Tercapai</p>
                  <div className="flex flex-row items-center gap-3">
                    <progress
                      className="progress progress-success w-full h-3.5"
                      value="100"
                      max="100"></progress>
                    100%
                  </div>
                  <button
                    className="btn btn-outline btn-ghost my-1"
                    onClick={() => document.getElementById("my_modal").showModal()}>
                    Lihat Donatur
                  </button>
                  <dialog id="my_modal" className="modal">
                    <div className="modal-box max-w-5xl">
                      <div className="flex flex-col">
                        <h1 className="font-bold text-2xl mb-4">Donatur</h1>
                        <CampaignDonatorsGrid campaignId={id} />
                      </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                      <button>close</button>
                    </form>
                  </dialog>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetail;
