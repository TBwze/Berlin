import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBarComponent = ({ onSearch, placeholder = "Search..." }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the parent function to perform the API search
    onSearch(searchTerm);
  };

  const handleIconClick = () => {
    // Call the parent function to perform the API search when the icon is clicked
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl relative">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full py-2 pl-3 pr-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
        />
        <button
          type="button"
          onClick={handleIconClick}
          className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-white bg-[#2E6950] rounded-r-lg" // Increased width and centered icon
        >
          <FaSearch className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
};

export default SearchBarComponent;
