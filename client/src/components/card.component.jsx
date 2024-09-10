import React from "react";
import { Controller } from "react-hook-form";

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
          <a href={`/${id}`}>
            <img
              className="rounded-t-lg w-full h-48 object-cover"
              src={field.value.imageUrl || "/api/placeholder/384/192"}
              alt={field.value.title}
            />
          </a>
          <div className="p-5">
            <a href={`/${id}`}>
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
                {field.value.title}
              </h5>
            </a>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              Creator: {field.value.creator}
            </p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {field.value.backers} Backers
            </p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {field.value.funded} / {field.value.totalFunding} Funded
            </p>
            <a
              href={`/${id}`}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              See Details
              <svg
                className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </a>
          </div>
        </div>
      )}
    />
  );
};

export default CardComponent;
