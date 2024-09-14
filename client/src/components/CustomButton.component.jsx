const CustomButton = ({
  btnType = "button",
  title,
  handleClick,
  styles = "",
  textColor = "text-white",
  bgColor = "bg-gray-200", // Default background color
  className = "",
}) => {
  return (
    <button
      type={btnType}
      className={`font-poppins text-[12px] leading-[26px] min-h-[36px] px-4 rounded-[10px] cursor-pointer ${bgColor} ${textColor} ${styles} ${className}`}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

export default CustomButton;
