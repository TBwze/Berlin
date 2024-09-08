import React from "react";

const CustomButton = ({
  btnType = "button",
  title,
  handleClick,
  styles = "",
  textColor = "text-white",
  bgColor,
  className = "",
}) => {
  // Only apply backgroundColor if bgColor is provided
  const inlineStyles = bgColor ? { backgroundColor: bgColor } : {};

  return (
    <button
      type={btnType}
      className={`font-semibold text-[12px] leading-[26px] min-h-[32px] px-4 rounded-[10px] cursor-pointer mt-3 ${textColor} ${styles} ${className}`}
      style={inlineStyles}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

export default CustomButton;
