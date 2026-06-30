"use client";

import React, { useState, useEffect } from "react";

export default function EditCityModal({ isOpen, onClose, city, onSave }) {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (city) {
      setFormData({ ...city });
    }
  }, [city]);

  if (!isOpen || !formData) return null;

  const handleToggle = (key) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key] === "yes" ? "no" : "yes",
    }));
  };

  const handleTimingChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      cab_availability_km_json: {
        ...prev.cab_availability_km_json,
        [key]: value,
      },
    }));
  };

  const handleSubmit = () => {
    const payload = {
      city_id: formData.id,
      local_min_km: Number(formData.local_min_km),
      local_max_km: Number(formData.local_max_km),
      intra_city_min_km: Number(formData.intra_city_min_km),
      is_local: formData.is_local,
      is_intercity: formData.is_intercity,
      is_intracity: formData.is_intracity,
      is_intrastate: formData.is_intrastate,
      is_cluster: formData.is_cluster,
      is_rental: formData.is_rental,
      auto_confirmed_booking: formData.auto_confirmed_booking,
      cab_availability_km_json: formData.cab_availability_km_json,
    };

    onSave(formData.id, payload);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-xl p-6 w-[600px] max-h-[90vh] overflow-y-auto shadow-xl 
[scrollbar-width:none] 
[&::-webkit-scrollbar]:hidden"
      >
        <h3 className="text-xl font-bold mb-6">
          Edit City - {formData.city_name}
        </h3>


        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm font-semibold">Local Min KM</label>
            <input
              type="number"
              value={formData.local_min_km}
              onChange={(e) =>
                setFormData({ ...formData, local_min_km: e.target.value })
              }
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Local Max KM</label>
            <input
              type="number"
              value={formData.local_max_km}
              onChange={(e) =>
                setFormData({ ...formData, local_max_km: e.target.value })
              }
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Intra City Min KM</label>
            <input
              type="number"
              value={formData.intra_city_min_km}
              onChange={(e) =>
                setFormData({ ...formData, intra_city_min_km: e.target.value })
              }
              className="w-full border p-2 rounded mt-1"
            />
          </div>
        </div>


        <div className="mb-6">
          <h4 className="font-semibold mb-3">Services</h4>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Local", key: "is_local" },
              { label: "Intercity", key: "is_intercity" },
              { label: "Intracity", key: "is_intracity" },
              { label: "Intrastate", key: "is_intrastate" },
              { label: "Cluster", key: "is_cluster" },
              { label: "Rental", key: "is_rental" },
            ].map((service) => (
              <div
                key={service.key}
                onClick={() => handleToggle(service.key)}
                className={`flex justify-between items-center px-3 py-2 rounded cursor-pointer border ${
                  formData[service.key] === "yes"
                    ? "bg-green-100 border-green-400"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <span>{service.label}</span>
                <span className="text-sm font-bold">
                  {formData[service.key] === "yes" ? "ON" : "OFF"}
                </span>
              </div>
            ))}
          </div>
        </div>


        <div className="mb-6">
          <h4 className="font-semibold mb-3">Auto Confirm Booking</h4>

          <div
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                auto_confirmed_booking:
                  prev.auto_confirmed_booking === "yes" ? "no" : "yes",
              }))
            }
            className={`flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer border transition ${
              formData.auto_confirmed_booking === "yes"
                ? "bg-green-100 border-green-400"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <span className="font-medium">Auto Confirm</span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                formData.auto_confirmed_booking === "yes"
                  ? "bg-green-500 text-white"
                  : "bg-gray-400 text-white"
              }`}
            >
              {formData.auto_confirmed_booking === "yes" ? "ON" : "OFF"}
            </span>
          </div>
        </div>


        <div className="mb-6">
          <h4 className="font-semibold mb-3">Cab Availability Timing</h4>

          {["inter_city", "intra_city", "inter_state", "local_inter_city"].map(
            (key) => (
              <div key={key} className="mb-3">
                <label className="text-sm capitalize">
                  {key.replace("_", " ")}
                </label>
                <input
                  type="text"
                  value={formData.cab_availability_km_json?.[key] || ""}
                  onChange={(e) => handleTimingChange(key, e.target.value)}
                  className="w-full border p-2 rounded mt-1"
                />
              </div>
            ),
          )}
        </div>


        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
