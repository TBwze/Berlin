import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomButton from "./CustomButton";
import { logo, profile, search } from "../assets";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("dashboard");
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const balance = query.get("balance") || "0";

  const [integerPart, decimalPart] = balance.split(".");
  const firstThreeDigits = decimalPart ? decimalPart.slice(0, 3) : "";
  const result = integerPart + "." + firstThreeDigits;
  return (
    <div className="w-full flex justify-between items-center bg-white border-b-2 border-black">
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
          <a href="/campaign">
            <p style={{ fontSize: "14px" }} className=" font-poppins">
              Jelajahi
            </p>
          </a>
        </div>
      </div>

      {/* Start Project button and profile */}
      <div className="flex items-center">
        <CustomButton
          btnType="button"
          title="Start Project"
          styles="bg-gray-300 font-bold rounded-full px-4 py-2 border-2 border-black"
          textColor={"text-black"}
          handleClick={() => navigate("./create-campaign")}
        />
        <Link to="/profile" className="ml-4">
          <div className="flex items-center">
            <img
              src={profile}
              alt="user"
              className="w-[40px] h-[40px] rounded-full"
            />
            <div className="ml-2 text-left">
              <p className="text-sm font-bold">Username</p>
              <p className="text-xs text-black-500"> {result} ETH</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
