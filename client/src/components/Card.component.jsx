import React from "react";
import { Controller } from "react-hook-form";
import { FaArrowRight } from "react-icons/fa6";

const CardComponent = ({
  id,
  title,
  creator,
  backers,
  funded,
  totalFunding,
  imageUrl,
  control,
}) => {
  const fundingPercentage = Math.min(
    (funded / totalFunding) * 100,
    100
  ).toFixed(1);

  return (
    <Controller
      name={String(id)}
      control={control}
      defaultValue={{
        title,
        creator,
        backers,
        funded,
        totalFunding,
        imageUrl,
      }}
      render={({ field }) => (
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <a href={`/campaign/${id}`}>
            <img
              className="rounded-t-lg w-full h-48 object-cover"
              src={field.value.imageUrl || "/api/placeholder/384/192"}
              alt={field.value.title}
            />
          </a>
          <div className="p-5">
            <a href={`/campaign/${id}`}>
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate font-poppins-bold">
                {field.value.title}
              </h5>
            </a>
            <p className="mb-2 font-normal dark:text-gray-400 font-poppins">
              Creator: {field.value.creator}
            </p>
            <p className="mb-2 font-normal dark:text-gray-400 font-poppins">
              {field.value.backers} Backers
            </p>

            {/* Progress bar with percentage inside */}
            <div className="relative w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 mb-2 font-poppins">
              <div
                className="bg-blue-600 h-4 rounded-full font-poppins"
                style={{ width: `${fundingPercentage}%` }}
              ></div>
              <span className="absolute inset-0 flex justify-center items-center text-xs text-white font-poppins-500">
                {fundingPercentage}%
              </span>
            </div>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 font-poppins">
              {field.value.funded} / {field.value.totalFunding} Funded
            </p>

            <a
              href={`/campaign/${id}`}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              See Details
              <FaArrowRight className="w-3.5 h-3.5 ms-2" />
            </a>
          </div>
        </div>
      )}
    />
  );
};

export default CardComponent;
