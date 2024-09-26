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
  errorMessage = "",
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({ field }) => (
        <div className="flex flex-col space-y-1 mt-3">
          <div className="text-xs text-black font-poppins">{label}</div>
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
              decimalScale={4}
              placeholder="0.0000"
              required={required}
              value={field.value}
              fixedDecimalScale
              className={`w-full p-2 pr-${
                addOrmentText ? 16 : 10
              } text-xs bg-transparent rounded border border-gray-500 outline-none`}
              aria-label={`textfield-decimal-${name
                .toLowerCase()
                .trim()
                .replace(/_+/g, "-")}`}
            />
            {addOrmentText && (
              <div className="absolute right-2 text-sm text-black font-bold">
                {addOrmentText}
              </div>
            )}
          </div>
          {errorMessage && (
            <p className="text-red-500 text-xs">{errorMessage}</p>
          )}
        </div>
      )}
    />
  );
};

export default TextFieldDecimalComponent;
