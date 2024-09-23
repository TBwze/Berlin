import React, { useRef } from "react";
import { Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import { MdDateRange } from "react-icons/md";

const DatePickerComponent = ({ name, label, control, required }) => {
  const datePickerRef = useRef(null);

  const handleIconClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({ field }) => (
        <div className="relative max-w-sm space-y-1 mt-3">
          {label && (
            <div className="text-xs font-bold text-black font-poppins">
              {label}
            </div>
          )}
          <div className="relative">
            <DatePicker
              ref={datePickerRef}
              selected={field.value ? dayjs(field.value).toDate() : null}
              onChange={(date) =>
                field.onChange(date ? dayjs(date).format("YYYY-MM-DD") : null)
              }
              onBlur={field.onBlur}
              dateFormat="yyyy-MM-dd"
              className="border border-gray-500 text-black text-sm rounded block w-full pl-10 py-1.5"
              placeholderText="Select date"
            />
            <div
              className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
              onClick={handleIconClick}
            >
              <MdDateRange className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
        </div>
      )}
    />
  );
};

export default DatePickerComponent;
