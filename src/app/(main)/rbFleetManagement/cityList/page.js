"use client";

import React, { useEffect, useState, useCallback } from "react";
import EditCityModal from "./components/EditCityModal";
import { apiClient } from "@/app/lib/apiClient";
import { Loader } from "lucide-react";
import moment from "moment";
import { toast } from "react-toastify";

export default function CityListPage() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCityFilter, setSelectedCityFilter] = useState("");

  const fetchCityList = useCallback(async () => {
    try {
      setLoading(true);

      const response = await apiClient("GET", "/city/getCityList");

      if (response?.success || response?.status) {
        setCities(response.data || []);
      } else {
        toast.error(response?.message || "Failed to fetch cities");
      }
    } catch (error) {
      toast.error("Something went wrong");
      setCities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCity = async (id, payload) => {
    try {
      setLoading(true);

      const response = await apiClient(
        "PUT",
        `/city/update-city/${id}`,
        payload,
      );

      if (response?.success || response?.status) {
        toast.success(response.message || "City updated successfully");
        fetchCityList();
        setIsModalOpen(false);
      } else {
        toast.error(response?.message || "Update failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCityList();
  }, [fetchCityList]);

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      {/* <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
        City Management
      </h2>

      <div className="mb-4">
        <select
          value={selectedCityFilter}
          onChange={(e) => setSelectedCityFilter(e.target.value)}
          className="border px-3 py-2 rounded-md w-full md:w-1/3 text-sm"
        >
          <option value="">All Cities</option>

          {cities.map((city) => (
            <option key={city.id} value={city.city_name}>
              {city.city_name}
            </option>
          ))}
        </select>
      </div> */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          City Management
        </h2>

        <div className="mt-3 md:mt-0">
          <select
            value={selectedCityFilter}
            onChange={(e) => setSelectedCityFilter(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm w-full md:w-60"
          >
            <option value="">All Cities</option>

            {cities.map((city) => (
              <option key={city.id} value={city.city_name}>
                {city.city_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-sm">
            <thead className="bg-blue-600 text-white sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left">City</th>
                <th className="px-4 py-3 text-left">Local KM</th>
                <th className="px-4 py-3 text-left">Intra KM</th>
                <th className="px-4 py-3 text-left">Services</th>
                <th className="px-4 py-3 text-left">Cab Timing</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Auto Confirm</th>
                <th className="px-4 py-3 text-left">Updated</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {!loading ? (
                cities.length > 0 ? (
                  // cities.map((city, i) => (
                  (selectedCityFilter
                    ? cities.filter(
                        (city) => city.city_name === selectedCityFilter,
                      )
                    : cities
                  ).map((city, i) => (
                    <tr
                      key={city.id}
                      className={`border-b transition ${
                        i % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-blue-50`}
                    >
                      <td className="px-4 py-3">
                        <div className="font-semibold text-blue-700">
                          {city.city_name}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[200px]">
                          {city.formatted_address}
                        </div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {city.local_min_km} - {city.local_max_km}
                      </td>

                      <td className="px-4 py-3">{city.intra_city_min_km}</td>

                      <td className="px-4 py-3">
                        <div className="grid grid-cols-2 gap-1 text-[11px]">
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
                              className={`flex items-center justify-between px-2 py-0.5 rounded border ${
                                city[service.key] === "yes"
                                  ? "bg-green-50 border-green-300"
                                  : "bg-gray-50 border-gray-300"
                              }`}
                            >
                              <span>{service.label}</span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${
                                  city[service.key] === "yes"
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-400 text-white"
                                }`}
                              >
                                {city[service.key] === "yes" ? "ON" : "OFF"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-xs text-gray-700 space-y-1">
                        <div>
                          <span className="font-medium">Inter:</span>{" "}
                          {city.cab_availability_km_json?.inter_city}
                        </div>
                        <div>
                          <span className="font-medium">Intra:</span>{" "}
                          {city.cab_availability_km_json?.intra_city}
                        </div>
                        <div>
                          <span className="font-medium">State:</span>{" "}
                          {city.cab_availability_km_json?.inter_state}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            city.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {city.status}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            city.auto_confirmed_booking === "yes"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {city.auto_confirmed_booking === "yes" ? "ON" : "OFF"}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {moment(city.updatedAt).format("DD-MM-YYYY")}
                      </td>

                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            setSelectedCity(city);
                            setIsModalOpen(true);
                          }}
                          className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs hover:bg-blue-700 transition"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-gray-500">
                      No City Data Found
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-8">
                    <Loader
                      className="animate-spin mx-auto text-blue-600"
                      size={30}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <EditCityModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          city={selectedCity}
          onSave={updateCity}
        />
      </div>
    </div>
  );
}
