"use client";
import React from "react";

export default function EditUserAddress({ isOpen, onClose, userData, theme }) {
  if (!isOpen) return null;

  const isDark = theme === "dark";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div
        className={`p-6 rounded-2xl w-full max-w-lg space-y-6 border shadow-lg ${
          isDark
            ? "bg-[#0C111F] text-white border-[#1F2937]"
            : "bg-white text-black border-gray-200"
        }`}
      >
        <div className="flex justify-between items-center border-b pb-3 border-gray-600">
          <h2 className="text-xl font-semibold">Edit Address</h2>
          <button
            onClick={onClose}
            className={`text-2xl ${isDark ? "text-white" : "text-black"} hover:text-red-400`}
          >
            ✖
          </button>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Country</label>
              <input
                className={`p-2 rounded-lg w-full border focus:outline-none focus:ring-2 ${
                  isDark
                    ? "bg-[#1F2937] text-white border-gray-700 focus:ring-blue-600"
                    : "bg-gray-100 text-black border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="Country"
                defaultValue={userData.country}
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">City/State</label>
              <input
                className={`p-2 rounded-lg w-full border focus:outline-none focus:ring-2 ${
                  isDark
                    ? "bg-[#1F2937] text-white border-gray-700 focus:ring-blue-600"
                    : "bg-gray-100 text-black border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="City/State"
                defaultValue={userData.cityState}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm text-gray-400 mb-1 block">Postal Code</label>
              <input
                className={`p-2 rounded-lg w-full border focus:outline-none focus:ring-2 ${
                  isDark
                    ? "bg-[#1F2937] text-white border-gray-700 focus:ring-blue-600"
                    : "bg-gray-100 text-black border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="Postal Code"
                defaultValue={userData.postalCode}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg transition ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 border border-gray-400 text-black"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg transition ${
                isDark
                  ? "bg-blue-600 hover:bg-blue-700 border border-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 border border-blue-600 text-white"
              }`}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

