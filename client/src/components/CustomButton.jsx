import React from "react";

const CustomButton = ({ btnType, title, handleClick, styles, textColor }) => {
  return (
    <button
      type={btnType}
      className={`font-epilogue font-semibold text-[16px] leading-[26px] min-h-[52px] px-4 rounded-[10px] ${textColor} ${styles}`}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

export default CustomButton;
