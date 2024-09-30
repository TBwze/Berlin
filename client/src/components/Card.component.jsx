import React, { useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import { ethers } from 'ethers';

const CardComponent = ({ id, title, targetAmount, amountCollected, deadline, imageUrl }) => {
  // Calculate the funding percentage
  const fundingPercentage = Math.min((amountCollected / targetAmount) * 100, 100).toFixed(1);

  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <a href={`/campaign/${id}`}>
        <img
          className="rounded-t-lg w-full h-48 object-cover"
          src={imageUrl || '/api/placeholder/384/192'}
          alt={title}
        />
      </a>
      <div className="p-5">
        <a href={`/campaign/${id}`}>
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate font-poppins-bold">
            {title}
          </h5>
        </a>

        {/* Progress bar showing the funding percentage */}
        <div className="relative w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 mb-2">
          <div
            className="bg-green-700 h-full rounded-full"
            style={{ width: `${fundingPercentage}%` }}></div>
          <span className="absolute inset-0 flex justify-center items-center text-xs text-white font-poppins-500">
            {fundingPercentage}%
          </span>
        </div>

        <p className="mb-3 font-normal dark:text-gray-200 font-poppins text-xs">
          {amountCollected} / {targetAmount} ETH Funded
        </p>

        <p className="mb-3 font-normal dark:text-gray-200 font-poppins text-xs">
          Deadline: {deadline}
        </p>

        <a
          href={`/campaign/${id}`}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          See Details
          <FaArrowRight className="w-3.5 h-3.5 ms-2" />
        </a>
      </div>
    </div>
  );
};

export default CardComponent;
