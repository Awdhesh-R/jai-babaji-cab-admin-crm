'use client';
import { useEffect, useState } from "react";
import AutoComplete from "../autocomplete/SearchCity";
import { apiClient } from "@/app/lib/apiClient";

const CitySearchModal = ({ isOpen, onClose, onSelect, fieldType = "SourceCity" }) => {
  const [query, setQuery] = useState("");
  const [cityData, setCityData] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      if (!query.trim()) return;

      try {
        const response = await apiClient('POST', `/City/searchCity`, {
          cityName: query,
        });
        if (response?.data?.length > 0) {
          setCityData(response.data);
        } else {
          setCityData([]);
        }
      } catch (error) {
        console.error("Error fetching city data:", error.message || error);
      }
    };

    fetchCities();
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-xl shadow-xl relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-xl">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white bg-gradient-to-r from-white to-green-500 text-transparent bg-clip-text mt-4 ml-4">Search Your City</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-red-500 text-xl font-bold mt-4 mr-4"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto px-6">
          <AutoComplete
            options={cityData}
            value={query}
            onChange={(text) => setQuery(text)}
            onSelect={(cityName) => {
                setQuery(cityName);
                onSelect(cityName);
            }}
            placeholder={`Search ${fieldType === "SourceCity" ? "Source" : "Destination"}`}
            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end space-x-3 border-t p-6">
          <button
            onClick={onClose}
            className="bg-gray-200 dark:bg-gray-700 text-red-500 dark:text-white px-5 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Close
          </button>
          <button
            onClick={() => {
              if (query.trim()) {
                onSelect(query);
              }
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow transition"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitySearchModal;
