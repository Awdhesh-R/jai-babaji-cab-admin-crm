"use client";

import React, { useState, useRef, useEffect } from "react";
import { LuUpload } from "react-icons/lu";
import { GoImage } from "react-icons/go";
import { FaCircle } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";

export default function AddServiceModal({ isOpen, onClose, onCreate }) {
  const [uploads, setUploads] = useState([]);
  const [formData, setFormData] = useState({
    serviceName: "",
    componentChanged: "",
    partName: "",
    quantity: "",
    serviceDate: "",
    serviceProvider: "",
    approvedBy: "",
    cost: "",
    paymentStatus: "",
    description: "",
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setUploads([]);
      setFormData({
        serviceName: "",
        componentChanged: "",
        partName: "",
        quantity: "",
        serviceDate: "",
        serviceProvider: "",
        approvedBy: "",
        cost: "",
        paymentStatus: "",
        description: "",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileInput = (event) => {
    const files = Array.from(event.target.files);
    for (const file of files) {
      if (
        !["image/png", "image/jpeg", "image/gif", "application/pdf"].includes(
          file.type
        )
      ) {
        alert("Only image or PDF files allowed!");
        return;
      }
      if (file.size > 10485760) {
        alert("Max file size is 10MB.");
        return;
      }
    }

    files.forEach((file) => {
      const url = file.type.startsWith("image")
        ? URL.createObjectURL(file)
        : "";
      const newUpload = {
        name: file.name,
        size: file.size,
        type: file.type,
        url,
        progress: 0,
        status: "Uploading",
        id: `${file.name}-${file.size}-${Date.now()}`,
      };
      setUploads((prev) => [...prev, newUpload]);
      simulateUpload(newUpload.id);
    });
  };

  const simulateUpload = (id) => {
    let progress = 0;
    const interval = setInterval(() => {
      setUploads((prev) =>
        prev.map((file) =>
          file.id === id
            ? {
                ...file,
                progress: Math.min(file.progress + 13, 100),
                status: file.progress >= 87 ? "Uploaded" : "Uploading",
              }
            : file
        )
      );
      progress += 13;
      if (progress >= 100) clearInterval(interval);
    }, 150);
  };

  const handleRemove = (id) => {
    setUploads((prev) => prev.filter((f) => f.id !== id));
  };

  const handleCreateService = () => {
    if (!formData.serviceName || !formData.serviceDate) {
      alert("Please fill required fields");
      return;
    }
    onCreate(formData);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-[1126px] max-h-[90vh] overflow-y-scroll shadow-2xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {/* <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-xl text-white flex items-start gap-4">
          <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold">
            +
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">Add New Service Record</h2>
            <p className="text-sm text-white/80 mt-1">
              Create a comprehensive maintenance record with all details
            </p>
          </div>
        </div> */}
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-xl text-white flex items-start justify-between">
          {/* Left Side: Icon + Title */}
          <div className="flex items-start gap-4">
            <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold">
              +
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">Add New Service Record</h2>
              <p className="text-sm text-white/80 mt-1">
                Create a comprehensive maintenance record with all details
              </p>
            </div>
          </div>

          {/* Right Side: Close Button */}
          <button
            onClick={onClose}
            title="Close"
            className="text-white hover:text-red-300 text-2xl font-bold leading-none transition"
          >
            ×
          </button>
        </div>
        {/* Header close*/}
        {/* Form container */}
        <div className="p-6 space-y-6">
          {/* 🟦 Basic Info (same as before) */}
          <div className="bg-slate-50 rounded-2xl p-5 shadow-inner">
            <div className="flex items-start gap-3">
              <div className="bg-blue-600 text-white rounded-lg p-2">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 2v6H3v8h6v6h6v-6h6V8h-6V2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <p className="text-sm text-slate-500">
                  Essential service details
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Row 1 */}
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Service Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Brake Maintenance, Oil Change"
                  value={formData.serviceName}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      serviceName: e.target.value.replace(/[^A-Za-z\s]/g, ""),
                    }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Part Name *
                </label>
                <input
                  placeholder="e.g., Front Brake System, Engine"
                  value={formData.partName}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, partName: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  No. of Quantity
                </label>

                <input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="No. of Quantity"
                  value={formData.quantity}
                  onChange={(e) => {
                    // number-only validation
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setFormData((p) => ({ ...p, quantity: value }));
                  }}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none no-spinner"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Component Changed
                </label>
                <input
                  placeholder="e.g., Brake Pads, Oil Filter"
                  value={formData.componentChanged}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      componentChanged: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Service Date *
                </label>
                <input
                  type="date"
                  value={formData.serviceDate}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, serviceDate: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 🟩 Personnel & Financial (same layout) */}
          <div className="bg-white rounded-2xl p-5 shadow-inner border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="bg-green-500 text-white rounded-lg p-2">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2a5 5 0 10.001 9.999A5 5 0 0012 2zM2 22a10 10 0 0120 0H2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Personnel & Financial</h3>
                <p className="text-sm text-slate-500">
                  Who performed the service and cost details
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Service Provider *
                </label>
                <input
                  placeholder="Select service provider"
                  value={formData.serviceProvider}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      serviceProvider: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Approved By *
                </label>
                <input
                  placeholder="Select approver"
                  value={formData.approvedBy}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, approvedBy: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Service Cost (₹) *
                </label>
                <input
                  type="number"
                  placeholder="₹ 0"
                  value={formData.cost}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, cost: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Payment Status *
                </label>
                <input
                  placeholder="Select payment status"
                  value={formData.paymentStatus}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      paymentStatus: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 🟣 Photo Documentation */}
          {/* 🟣 Photo Documentation */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="bg-purple-600 text-white rounded-lg p-2">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Photo Documentation</h3>
                <p className="text-sm text-slate-500">
                  Upload service photos for better record keeping
                </p>
              </div>
            </div>

            <label
              htmlFor="file-input"
              className="mt-4 block w-full cursor-pointer"
            >
              <input
                id="file-input"
                multiple
                ref={fileInputRef}
                accept=".png,.jpg,.jpeg,.gif,.pdf"
                type="file"
                onChange={handleFileInput}
                className="hidden"
              />
              <div className="w-full text-center bg-white border border-gray-200 rounded-2xl py-10 shadow-sm hover:border-blue-400 transition">
                <div className="flex flex-col items-center justify-center space-y-3">
                  {/* ⬆️ Oval Upload Button */}
                  <div className="w-64 h-12 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full flex items-center justify-start pl-6 shadow-inner">
                    <LuUpload className="text-white text-2xl" />
                  </div>

                  {/* Upload Texts */}
                  <div className="text-lg font-semibold text-gray-800">
                    Upload Service Photos
                  </div>
                  <p className="text-sm text-slate-500">
                    Drag & drop files here or click to browse
                  </p>

                  {/* File Info */}
                  <div className="mt-2 text-xs text-slate-400 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1">
                      <GoImage className="text-gray-500" /> Images
                    </span>
                    <FaCircle className="text-slate-300" />
                    <span>PDF</span>
                    <FaCircle className="text-slate-300" />
                    <span>Max 10MB</span>
                  </div>
                </div>
              </div>
            </label>

            {/* Upload preview */}
            {uploads.length > 0 && (
              <div className="mt-4 space-y-3">
                {uploads.map((file) => (
                  <div
                    key={file.id}
                    className="bg-[#edfff7] rounded-xl p-4 flex items-center gap-4 relative shadow-sm"
                  >
                    {file.type.startsWith("image") ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-[86px] h-[86px] object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                        📄
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">
                        {file.name}
                      </div>
                      <div className="text-sm text-slate-500 flex items-center gap-3 mt-1">
                        <FaCircle className="text-green-600" />
                        <span>{(file.size / 1024).toFixed(2)} KB</span>
                        <span className="font-semibold text-xs text-slate-500">
                          {file.type.includes("pdf")
                            ? "PDF"
                            : file.type.replace("image/", "").toUpperCase()}
                        </span>
                      </div>

                      <div className="mt-3 h-2 bg-green-50 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${file.progress}%` }}
                          className="h-2 bg-emerald-500 transition-all"
                        />
                      </div>

                      <div className="mt-2 text-sm text-emerald-600 flex items-center gap-2">
                        {file.progress === 100 ? (
                          <>
                            <span className="text-lg">✔️</span> Upload
                            successful!
                          </>
                        ) : (
                          <>
                            <span className="text-lg">⏳</span> Uploading...
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemove(file.id)}
                      title="Remove file"
                      className="absolute right-4 top-4 bg-red-50 border border-red-200 text-red-600 p-2 rounded-full"
                    >
                      <RiDeleteBinLine />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 🟧 Service Description */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="bg-orange-400 text-white rounded-lg p-2">📄</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Service Description</h3>
                <p className="text-sm text-slate-500">
                  Detailed information about the service performed
                </p>

                <label className="block mt-4 text-sm font-semibold text-slate-700">
                  Detailed Description *
                </label>
                <textarea
                  rows={5}
                  maxLength={1000}
                  placeholder="Provide comprehensive details about the service performed, including:
- Reason for maintenance or repair
- Condition of parts before service
- Work performed and parts replaced
- Any issues discovered during service
- Recommendations for future maintenance
- Quality of service and any concerns"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, description: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 mt-2 focus:outline-none"
                />
                <div className="text-sm text-slate-400 mt-1">
                  {formData.description.length}/1000 characters
                </div>
              </div>
            </div>
          </div>

          {/* ✅ Actions */}
          <div className="flex flex-col md:flex-row items-center md:justify-end gap-3">
            <button
              onClick={() => {
                setFormData({
                  serviceName: "",
                  componentChanged: "",
                  partName: "",
                  quantity: "",
                  serviceDate: "",
                  serviceProvider: "",
                  approvedBy: "",
                  cost: "",
                  paymentStatus: "",
                  description: "",
                });
                setUploads([]);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="px-5 py-2 rounded-md border border-gray-200 bg-white text-sm hover:bg-gray-50"
            >
              ✖ Clear Form
            </button>

            <button
              onClick={handleCreateService}
              className="px-5 py-2 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:opacity-90"
            >
              📋 Create Service Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
