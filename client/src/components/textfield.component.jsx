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
        <div className="flex flex-col space-y-1 mt-3">
          <div
            className="text-xs font-medium text-gray-700"
            style={{
              fontFamily: "Poppins",
              margin: "0.1vh 0.3vw",
            }}
          >
            {label}
          </div>
          <div className="relative flex items-center">
            {type === "textarea" ? (
              <textarea
                rows={rows}
                placeholder={placeholder}
                className="w-full p-2 text-xs bg-transparent rounded outline-1 border border-gray-500"
                style={{
                  fontFamily: "Poppins",
                  width: "20rem",
                }}
                {...field}
                required={required}
                disabled={disabled}
              />
            ) : (
              <input
                type={inputType}
                placeholder={placeholder}
                className="w-full p-2 pr-10 text-xs bg-transparent rounded outline-1 border border-gray-500"
                style={{
                  fontFamily: "Poppins",
                  width: "20rem",
                }}
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
                  <FaEyeSlash className="w-4 h-4 " />
                ) : (
                  <FaEye className="w-4 h-4 " />
                )}
              </button>
            )}
          </div>
        </div>
      )}
    />
  );
};

export default TextFieldComponent;
