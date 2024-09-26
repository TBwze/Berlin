import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Controller } from "react-hook-form";

const TextFieldComponent = ({
  name,
  label,
  type = "text",
  placeholder,
  control,
  required = false,
  disabled = false,
  rows = 3,
  addOrmentText = "",
  errorMessage = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({ field }) => (
        <div className="flex flex-col space-y-1 mt-5 mb-2">
          {label && (
            <div className="text-xs text-black font-poppins">{label}</div>
          )}
          <div className="relative flex items-center">
            {type === "textarea" ? (
              <textarea
                rows={rows}
                placeholder={placeholder}
                className="w-full p-2 text-xs bg-transparent rounded border border-gray-500 outline-none font-poppins font-medium"
                {...field}
                required={required}
                disabled={disabled}
              />
            ) : (
              <input
                type={inputType}
                placeholder={placeholder}
                className={`w-full p-2 pr-${
                  addOrmentText ? 16 : 10
                } text-xs bg-transparent rounded border border-gray-500 outline-none font-poppins font-medium`}
                {...field}
                required={required}
                disabled={disabled}
              />
            )}

            {type === "password" && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 flex items-center justify-center h-full aspect-square"
              >
                {showPassword ? (
                  <FaEyeSlash className="w-4 h-4" />
                ) : (
                  <FaEye className="w-4 h-4" />
                )}
              </button>
            )}
            {type === "text" && addOrmentText && (
              <div className="absolute right-2 text-xs text-black font-bold">
                {addOrmentText}
              </div>
            )}
          </div>
          {/* Display the error message here */}
          {errorMessage && (
            <p className="text-red-500 text-xs">{errorMessage}</p>
          )}
        </div>
      )}
    />
  );
};

export default TextFieldComponent;
