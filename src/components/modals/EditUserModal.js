"use client";
import React from "react";

export default function EditUserModal({ isOpen, onClose, userData, theme }) {
  if (!isOpen) return null;

  const isDark = theme === "dark";

  const inputClass = `p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    isDark
      ? "bg-[#0C111F] text-white border-gray-600"
      : "bg-white text-black border-gray-300"
  }`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div
        className={`p-6 rounded-xl w-full max-w-2xl space-y-6 ${
          isDark ? "bg-[#1F2937] text-white" : "bg-white text-black"
        }`}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Edit Personal & Social Info</h2>
          <button onClick={onClose} className="text-xl">✖</button>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              className={inputClass}
              placeholder="First Name"
              defaultValue={userData.firstName}
            />
            <input
              className={inputClass}
              placeholder="Last Name"
              defaultValue={userData.lastName}
            />
            <input
              className={`${inputClass} col-span-2`}
              placeholder="Email"
              defaultValue={userData.email}
            />
            <input
              className={`${inputClass} col-span-2`}
              placeholder="Phone"
              defaultValue={userData.phone}
            />
            <input
              className={`${inputClass} col-span-2`}
              placeholder="Bio"
              defaultValue={userData.bio}
            />
          </div>

          <div className="pt-4 border-t border-gray-400 space-y-4">
            <h3 className="text-lg font-semibold">Social Links</h3>
            <div className="grid grid-cols-2 gap-4">
              {["facebook", "x", "linkedin", "instagram"].map((field) => (
                <input
                  key={field}
                  className={`${inputClass} col-span-2`}
                  placeholder={`${field[0].toUpperCase()}${field.slice(1)} URL`}
                  defaultValue={userData[field]}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded ${
                isDark
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded ${
                isDark
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
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
