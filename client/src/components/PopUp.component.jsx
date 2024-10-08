import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const PopupComponent = ({ message, visible, onClose }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 h-72 flex flex-col items-center justify-center">
        <FaCheckCircle className="text-green-500 text-8xl mb-4" />
        <h2 className="flex text-2xl font-bold mb-4">{message}</h2>
        <button
          className="bg-blue-950 text-white px-6 py-2 rounded hover:bg-black focus:outline-none mt-4"
          onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default PopupComponent;
