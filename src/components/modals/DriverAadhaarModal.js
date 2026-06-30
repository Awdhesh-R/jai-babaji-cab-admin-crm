'use client';
import { useState } from 'react';
import Image from 'next/image';
import { IoClose } from 'react-icons/io5';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function DriverAadhaarModal({ onClose }) {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [showNumber, setShowNumber] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg p-6 w-full max-w-[30%] shadow-lg relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-800">View Aadhaar Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <IoClose size={22} />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">Verify the Aadhaar details below</p>

        {/* Aadhaar Image Section */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Aadhaar Documents</p>
          <div className="relative border border-dashed border-gray-300 rounded-xl overflow-hidden p-2">
            <Image
              src="/images/aadhaarFront.jpeg" // Replace with actual image path
              alt="Aadhaar Front"
              width={400}
              height={250}
              className="rounded-md object-cover"
            />
            <span className="absolute top-2 right-2 bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full font-medium">
              Front
            </span>
          </div>
          <p className="text-center text-xs text-gray-500 mt-2">Aadhaar Front Image</p>
        </div>

        {/* Aadhaar Number Input */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Enter Aadhaar Number</label>
          <div className="relative">
            <input
              type={showNumber ? 'text' : 'password'}
              placeholder="XXX-XXX-XXXX"
              value={aadhaarNumber}
              onChange={(e) => setAadhaarNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
            />
            <button
              onClick={() => setShowNumber(!showNumber)}
              type="button"
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              {showNumber ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-between gap-2">
          <button
            className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 rounded-lg transition"
          >
            ✅ Verify and Approve
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto text-sm text-gray-500 hover:text-gray-700 mt-2 sm:mt-0"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
