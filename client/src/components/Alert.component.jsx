import React from "react";

const AlertComponent = ({ type, message, visible, onClose }) => {
  if (!visible) return null;

  return (
    <div
      className={`${
        type === "success" ? "bg-green-100" : "bg-red-100"
      } border ${
        type === "success" ? "border-green-500" : "border-red-500"
      } text-${
        type === "success" ? "green-700" : "red-700"
      } px-4 py-3 rounded relative w-3/4 mt-4`}
      role="alert"
    >
      <span className="block sm:inline">{message}</span>
      <span
        className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
        onClick={onClose}
      >
        <svg
          className="fill-current h-6 w-6"
          role="button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <title>Close</title>
          <path d="M14.348 5.652a1 1 0 10-1.414-1.414L10 7.172 7.066 4.238a1 1 0 00-1.414 1.414l2.934 2.934-2.934 2.934a1 1 0 001.414 1.414L10 10.828l2.934 2.934a1 1 0 001.414-1.414l-2.934-2.934 2.934-2.934z" />
        </svg>
      </span>
    </div>
  );
};

export default AlertComponent;
