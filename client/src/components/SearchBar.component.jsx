import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBarComponent = ({ onSearch, placeholder = "Search..." }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl relative">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full py-2 pl-10 pr-4 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </form>
  );
};

export default SearchBarComponent;
