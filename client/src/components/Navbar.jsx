import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CustomButton from "./CustomButton.component";
import { FaChevronDown } from "react-icons/fa";
import { getUserDetails } from "../api/User/getUserDetails.api";
import PageLoad from "./Loading.component";
import Web3 from "web3";
import { profile } from "../assets";
import AlertComponent from "./Alert.component";
import { logoutUser } from "../api/User/logout.api";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [ethBalance, setEthBalance] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "", visible: false });
  const [role, setRole] = useState("");
  const web3 = new Web3(window.ethereum);

  const fetchUserDetails = async () => {
    try {
      const response = await getUserDetails();
      setIsLoggedIn(true);
      setUserDetails(response.data.username);
      getEthBalance(response.data.wallet);
      setRole(response.data.role);

      if (response.data.profilePicture !== null) {
        setImageUrl(response.data.profilePicture);
      }
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [location]);

  const getEthBalance = async (walletAddress) => {
    try {
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [walletAddress, "latest"]
      });
      let ethBalance = web3.utils.fromWei(balance, "ether");

      ethBalance = parseFloat(ethBalance).toFixed(4);

      setEthBalance(ethBalance);
    } catch (error) {
      setAlert({
        type: "error",
        message: error,
        visible: true
      });
      setEthBalance(0);
    }
  };

  const handleLogOutButton = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      setShowDropdown(false);
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      setAlert({
        type: "error",
        message: error,
        visible: true
      });
    } finally {
      window.location.reload();
      setIsLoading(false);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="w-full flex justify-between items-center bg-white border-b-2 border-black mb-4">
      <PageLoad loading={isLoading} />
      <AlertComponent
        type={alert.type}
        message={alert.message}
        visible={alert.visible}
        onClose={() => setAlert({ ...alert, visible: false })}
      />
      {/* Logo and slogan */}
      <div className="flex items-center">
        <div className="ml-4 mb-4">
          <a href="/">
            <h1
              style={{ fontSize: "36px", letterSpacing: "2px" }}
              className="font-bold font-keaniaOne">
              SharedFuture
            </h1>
          </a>
          <h2 style={{ fontSize: "18px" }} className="mb-7 font-poppins">
            Join the Movement: See, Support, Succeed!
          </h2>
          <CustomButton
            btnType="button"
            title="Jelajahi Kampanye"
            styles="rounded hover:underline text-lg"
            textColor="#000000"
            handleClick={() => navigate("/campaign")}
          />
          <CustomButton
            btnType="button"
            title="Kampanye Saya"
            styles="rounded hover:underline text-lg ml-10"
            textColor="#000000"
            handleClick={() => navigate("/my-campaign")}
          />
          <CustomButton
            btnType="button"
            title="Tentang kami"
            styles="rounded hover:underline text-lg ml-10"
            textColor="#000000"
            handleClick={() => navigate("/about-us")}
          />
          <CustomButton
            btnType="button"
            title="Hubungi Kami"
            styles="rounded hover:underline text-lg ml-10"
            textColor="#000000"
            handleClick={() => navigate("/contact-us")}
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <CustomButton
          btnType="button"
          title="Buat Kampanye Baru"
          bgColor="bg-white"
          styles="border-2 px-4 font-semibold h-8"
          className="hover:bg-green-200"
          textColor="#000000"
          borderColor="#2E6950"
          handleClick={() => navigate("/create-campaign")}
        />

        {isLoggedIn && role === "Admin" && (
          <CustomButton
            btnType="button"
            title="Admin"
            bgColor="#2E6950"
            styles="font-semibold rounded px-4"
            textColor="#ffffff"
            handleClick={() => navigate("/admin")}
          />
        )}

        {isLoggedIn ? (
          <div className="relative">
            <div className="flex items-center cursor-pointer" onClick={toggleDropdown}>
              <img
                src={imageUrl ? imageUrl : profile}
                alt={profile}
                className="w-[40px] h-[40px] rounded-full"
              />
              <div className="ml-2 text-left">
                <p className="text-sm font-bold">{userDetails}</p>
                <p className="text-xs text-black-500">{ethBalance} ETH</p>
              </div>
              <div className="ml-2">
                <FaChevronDown />
              </div>
            </div>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-300 hover:text-black rounded-t-lg transition duration-200"
                  onClick={() => setShowDropdown(false)}>
                  Profile
                </Link>
                <button
                  className="w-full text-left block px-4 py-2 text-red-500 hover:bg-red-100 hover:text-red-600 rounded-b-lg transition duration-200"
                  onClick={handleLogOutButton}>
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <CustomButton
            btnType="button"
            title="Log in"
            styles="  rounded px-6 py-1.2"
            bgColor="#2C7A5A"
            textColor="#ffffff"
            handleClick={() => navigate("/login")}
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;
