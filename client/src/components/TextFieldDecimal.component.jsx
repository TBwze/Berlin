import React from "react";
import { Controller } from "react-hook-form";
import { NumericFormat } from "react-number-format";

const TextFieldDecimalComponent = ({
  name,
  label,
  control,
  addOrmentText = "",
  required = false,
  disabled = false,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({ field }) => (
        <div className="flex flex-col space-y-1 mt-3">
          <div className="text-xs font-bold text-black font-poppins">
            {label}
          </div>
          <div className="relative flex items-center">
            <NumericFormat
              name={field.name}
              onBlur={field.onBlur}
              inputRef={field.ref}
              InputProps={{
                endAdornment: (
                  <span className="absolute right-2 text-xs text-black font-bold">
                    {addOrmentText}
                  </span>
                ),
              }}
              onValueChange={(event) => field.onChange(Number(event.value))}
              allowNegative={false}
              disabled={disabled}
              customInput="input"
              thousandSeparator=","
              decimalScale={2}
              placeholder="0.00"
              value={field.value}
              fixedDecimalScale
              className={`w-full p-2 pr-${
                addOrmentText ? 16 : 10
              } text-xs bg-transparent rounded outline-1 border border-gray-500 font-poppins`}
              style={{ width: "20rem" }}
              aria-label={`textfield-decimal-${name
                .toLowerCase()
                .trim()
                .replace(/_+/g, "-")}`}
            />
          </div>
        </div>
      )}
    />
  );
};

export default TextFieldDecimalComponent;
