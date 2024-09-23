import React from "react";
import { Controller } from "react-hook-form";

const DropdownComponent = ({
  control,
  name,
  label,
  optionData = [],
  optionId,
  optionLabel,
  required,
  placeholder = "Select an option",
  disabled = false,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={required}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col space-y-1 mt-3">
          {label && (
            <label className="text-xs text-black font-poppins">{label}</label>
          )}
          <div className="relative">
            <select
              className={`w-full p-2 text-xs bg-transparent border ${
                error ? "border-red-500" : "border-gray-500"
              } rounded outline-none font-poppins`}
              {...field}
              disabled={disabled}
            >
              <option value="" disabled>
                {placeholder}
              </option>
              {optionData.map((option, index) => (
                <option key={index} value={option[optionId]}>
                  {option[optionLabel]}
                </option>
              ))}
            </select>
          </div>
          {error && (
            <span className="text-xs text-red-500 font-poppins">
              {error.message}
            </span>
          )}
        </div>
      )}
    />
  );
};

export default DropdownComponent;
