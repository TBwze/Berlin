import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CustomButton from "./CustomButton.component";
import Cookies from "js-cookie";
import { FaChevronDown } from "react-icons/fa";
import { getUserDetails } from "../api/User/getUserDetails.api";
import { API_BASE_URL } from "../utils/api.utils";
import PageLoad from "./Loading.component";
import Web3 from "web3";
import { profile } from "../assets";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [ethBalance, setEthBalance] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const web3 = new Web3(window.ethereum);
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setIsLoggedIn(true);

      getUserDetails()
        .then((response) => {
          setUserDetails(response.username);
          getEthBalance(response.wallet);
          const originalPath = response.profilePicture;
          const startDirectory = "assets";
          setImageUrl(getFullUrl(originalPath, startDirectory));
        })
        .catch((error) => {
          alert(error.message);
        });
    } else {
      setIsLoggedIn(false);
    }
  }, [location]);

  const getEthBalance = async (walletAddress) => {
    try {
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [walletAddress, "latest"],
      });

      let ethBalance = web3.utils.fromWei(balance, "ether");

      ethBalance = parseFloat(ethBalance).toFixed(4);

      setEthBalance(ethBalance);
    } catch (error) {
      setEthBalance(0);
    }
  };

  const handleLogOutButton = () => {
    setIsLoading(true);
    Cookies.remove("token");
    setShowDropdown(false);
    setIsLoggedIn(false);
    navigate("/");
    setIsLoading(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const getFullUrl = (fullPath, startDirectory) => {
    const startIndex = fullPath.indexOf(startDirectory);

    if (startIndex === -1) {
      return "";
    }

    const relativePath = fullPath.substring(startIndex);
    const finalPath = relativePath.replace(/\\/g, "/");
    const fullUrl = `${API_BASE_URL}/${finalPath}`;
    return fullUrl;
  };

  return (
    <div className="w-full flex justify-between items-center bg-white border-b-2 border-black mb-4">
      <PageLoad loading={isLoading} />
      {/* Logo and slogan */}
      <div className="flex items-center">
        <div className="ml-4 mb-4">
          <a href="/">
            <h1
              style={{ fontSize: "36px", letterSpacing: "2px" }}
              className="font-bold font-keaniaOne"
            >
              SharedFuture
            </h1>
          </a>
          <h2 style={{ fontSize: "18px" }} className="mb-5 font-poppins">
            Join the Movement: See, Support, Succeed!
          </h2>
          <CustomButton
            btnType="button"
            title="Jelajahi"
            styles="bg-blue-300 font-bold px-4 py-1 rounded"
            textColor="text-black"
            handleClick={() => navigate("/campaign")}
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <CustomButton
          btnType="button"
          title="Create Campaign"
          styles="bg-gray-300 font-bold rounded-full px-4 py-2"
          textColor="text-black"
          handleClick={() => navigate("/create-campaign")}
        />

        {isLoggedIn ? (
          <div className="relative">
            <div
              className="flex items-center cursor-pointer"
              onClick={toggleDropdown}
            >
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
                  onClick={() => setShowDropdown(false)}
                >
                  Profile
                </Link>
                <button
                  className="w-full text-left block px-4 py-2 text-red-500 hover:bg-red-100 hover:text-red-600 rounded-b-lg transition duration-200"
                  onClick={handleLogOutButton}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <CustomButton
            btnType="button"
            title="Login"
            styles="ml-6 bg-green-500 font-bold rounded-full px-6 py-2"
            textColor="text-white"
            handleClick={() => navigate("/login")}
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;
