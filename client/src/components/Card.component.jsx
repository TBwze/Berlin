import React from "react";
import { FaArrowRight } from "react-icons/fa6";
import { ethers } from "ethers";

const CardComponent = ({
  id,
  title,
  targetAmount,
  amountCollected,
  deadline,
  imageUrl,
  creator
}) => {
  // Calculate the funding percentage
  const fundingPercentage = Math.min((amountCollected / targetAmount) * 100, 100).toFixed(1);

  return (
    <div className="max-w-sm border rounded-lg shadow bg-gray-800 border-gray-700">
      <a href={`/campaign/${id}`}>
        <img
          className="rounded-t-lg w-full h-48 object-cover"
          src={imageUrl || "/api/placeholder/384/192"}
          alt={title}
        />
      </a>
      <div className="p-5">
        <a href={`/campaign/${id}`}>
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-white truncate font-poppins-bold">
            {title}
          </h5>
        </a>

        {/* Display creator's name or wallet address */}
        <p className="text-xs text-gray-200 mb-3 truncate font-poppins">
          Pemilik Kampanye: <span className="font-bold">{creator}</span>
        </p>

        {/* Progress bar showing the funding percentage */}
        <div className="relative w-full h-4 bg-gray-700 mb-2 rounded-lg">
          <div
            className="bg-green-700 h-full rounded-lg"
            style={{ width: `${fundingPercentage}%` }}></div>
          <span className="absolute inset-0 flex justify-center items-center text-xs text-white font-poppins-500">
            {fundingPercentage}%
          </span>
        </div>

        <p className="mb-3 font-normal text-gray-200 font-poppins text-xs">
          {amountCollected} / {targetAmount} ETH Tercapai
        </p>

        <p className="mb-3 font-normal text-gray-200 font-poppins text-xs">Deadline: {deadline}</p>

        <a
          href={`/campaign/${id}`}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg focus:ring-4 focus:outline-none hover:bg-blue-700 focus:ring-blue-800">
          Lihat detail
          <FaArrowRight className="w-3.5 h-3.5 ms-2" />
        </a>
      </div>
    </div>
  );
};

export default CardComponent;
