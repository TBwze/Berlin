import React from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const PhoneNumberInput = ({
  label = "Nomor telepon",
  placeholder = "Masukan nomor telepon",
  value,
  onChange,
  defaultCountry = "ID",
  errorMessage = ""
}) => {
  return (
    <div className="flex flex-col space-y-1 mt-4 mb-2">
      {label && <div className="text-xs text-black font-poppins">{label}</div>}
      <PhoneInput
        international
        countryCallingCodeEditable={false}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        defaultCountry={defaultCountry}
        className={`w-full p-2 text-xs bg-transparent rounded border outline-none font-poppins font-medium bg-white ${
          errorMessage ? "border-red-500" : "border-gray-500"
        }`}
      />
      {errorMessage && <p className="text-red-500 text-xs">{errorMessage}</p>}
    </div>
  );
};

export default PhoneNumberInput;
