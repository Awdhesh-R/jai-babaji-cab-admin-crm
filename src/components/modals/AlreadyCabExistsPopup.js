import { useState } from "react";

const AlreadyCabExistsPopup = ({ show, onClose }) => {
  if (!show) return null; // agar show false hai to kuch render na ho

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-80 text-center animate-fadeIn">
        <h2 className="text-lg font-semibold text-red-600">⚠️ Already Exists</h2>
        <p className="text-gray-700 mt-2">
          The entered value already exists. Please try another.
        </p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default AlreadyCabExistsPopup;
