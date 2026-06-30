'use client';
import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { FaRegCalendarAlt } from 'react-icons/fa';

export default function EditDocumentModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    documentType: 'License',
    expiryDate: '2025-07-20',
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Edit Document</h2>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">Make changes to the document details here.</p>

        <div className="space-y-4">
          {/* Document Type */}
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-200 block mb-1">Document Type</label>
            <input
              name="documentType"
              value={formData.documentType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="License"
              type="text"
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-200 block mb-1">Expiry Date</label>
            <div className="relative">
              <span className="absolute top-2.5 left-3 text-gray-500">
                <FaRegCalendarAlt />
              </span>
              <input
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                type="date"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Document File */}
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-200 block mb-1">Document File</label>
            <input
              name="file"
              onChange={handleChange}
              type="file"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end">
          <button
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
            onClick={() => {
              console.log('Saved:', formData);
              onClose();
            }}
          >
            Save Changes
          </button>
        </div>

        {/* Close Icon */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-black dark:text-gray-300"
          onClick={onClose}
        >
          <AiOutlineClose size={18} />
        </button>
      </div>
    </div>
  );
}
