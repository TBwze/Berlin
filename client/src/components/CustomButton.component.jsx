const CustomButton = ({
  btnType = "button",
  title,
  handleClick,
  styles = "",
  textColor = "", // Default hex color for text (white)
  bgColor = "", // Default hex color for background (white)
  borderColor = "", // Default hex color for border (black)
  className = "",
}) => {
  return (
    <button
      type={btnType}
      className={`font-poppins text-[12px] leading-[26px] min-h-[36px] rounded-[10px] cursor-pointer ${styles} ${className}`}
      style={{
        color: textColor, // Set text color using hex value
        backgroundColor: bgColor, // Set background color using hex value
        borderColor: borderColor, // Set border color using hex value
        borderStyle: "solid", // Ensure border is visible if a border color is provided
      }}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

export default CustomButton;
