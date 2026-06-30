"use client";

import { useState } from "react";
import { MdBlock, MdCancel } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { BsExclamationTriangle } from "react-icons/bs";
import Image from "next/image";

const reasons = [
  { label: "Fake Documents", icon: "📄" },
  { label: "Misbehavior with Rider", icon: "😡" },
  { label: "Overcharging", icon: "🔥" },
  { label: "Frequently Unavailable", icon: "📵" },
  { label: "Safety Concerns", icon: "⚠️" },
  { label: "Repeated Cancellations", icon: "❌" },
  { label: "Unprofessional Appearance", icon: "🧍" },
  { label: "Other", icon: "✏️" },
];

export default function BlockDriverModal({ isOpen, onClose }) {
  const [selectedReason, setSelectedReason] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-[#F9F8F8] rounded-2xl shadow-lg w-full max-w-lg p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          <IoMdClose size={24} />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#EB3E3E] flex items-center justify-center shadow-lg">
            <BsExclamationTriangle className="text-white text-xl" />
          </div>
          <div className="flex items-start flex-col">
            <h2 className="text-xl font-bold text-gray-900">Block Driver</h2>
            <p className="text-[12px] text-gray-500">
              Take action with appropriate reason
            </p>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-4 mb-6 flex items-center gap-4">
          <Image
            height={75}
            width={75}
            className="rounded-full"
            alt="kumar image"
            src=""
          />
          <div className="flex flex-col">
            <h3 className="text-md font-semibold text-gray-800">
              Abhishek Kumar
            </h3>
            <p className="text-sm text-gray-500">DL: 7845-2244-6561</p>
            <div className="flex items-center text-green-600 text-sm mt-1">
              <FaPhoneAlt className="mr-2 text-[12px]" />
              +91 9993130968
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-r from-[#F7691F] to-[#F04C3B] flex items-center justify-center">
              <span className="text-white">2</span>
            </div>
            <h4 className="text-sm font-semibold text-gray-700">
              Select reason for block/ban
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {reasons.map((r) => (
              <button
                key={r.label}
                onClick={() => setSelectedReason(r.label)}
                className={`flex items-center justify-start gap-2 px-3 py-2 rounded-md border ${
                  selectedReason === r.label
                    ? "bg-red-100 border-red-400 text-red-600 font-medium"
                    : "border-gray-300 text-gray-700 hover:border-red-300"
                }`}
              >
                <span className="text-xl">{r.icon}</span>
                <span className="text-sm">{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
            disabled={!selectedReason}
            onClick={() => {
              alert(`Driver blocked for: ${selectedReason}`);
              onClose();
            }}
          >
            Confirm Block
          </button>
        </div>
      </div>
    </div>
  );
}
