import React, { useEffect, useState } from 'react';
import AutoComplete from '../autocomplete/AutoComplete';
import { apiClient } from '@/app/lib/apiClient';

const SearchPanel = () => {

  const [searchUser, setSearchUser] = useState({ startDate: '', endDate: '' });
  const [mobile, setMobile] = useState('');
  const [srcCity, setSrcCity] = useState('');
  const [dstCity, setDstCity] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [cityData, setCityData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const searchRides = async () => {
      try {
        const response = await apiClient('GET', `/ride_management/searchRide?keyword=${mobile}`);

        if (response && response.data?.length > 0) {
          // console.log('data', response.data);

          setSearchData(response.data);
        }
      } catch (error) {
        console.log("Error fetching rides:", error.message || error);
      }
    };
    searchRides();
  }, [mobile]);

  useEffect(() => {
    const searchCities = async () => {
      try {
        const response = await apiClient('POST', `/City/searchCity`, { "cityName": srcCity ? srcCity : dstCity });
        if (response && response.data?.length > 0) {
          // console.log('data', response.data);
          setCityData(response.data);
        }
      } catch (error) {
        console.log("Error fetching rides:", error.message || error);
      }
    };
    searchCities();
  }, [srcCity, dstCity]);

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-md shadow border border-gray-200 dark:border-gray-700 transition-colors duration-300 m-4">
      <form onSubmit={handleSearch}>
        <div className="flex flex-wrap gap-4">
          {/* Mobile */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile</label>
            <AutoComplete
              options={searchData}
              value={mobile}
              type="text"
              onChange={(text) => {
                setMobile(text)
              }}
              name="mobile"
              fieldType="Mobile"
              placeholder="Enter Registered Mobile"
              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Source City */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source City</label>
            <AutoComplete
              options={cityData}
              type="text"
              name="sourceCity"
              value={srcCity}
              onChange={(text) => {
                setSrcCity(text)
              }}
              fieldType="SourceCity"
              placeholder="Search Source"
              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Destination City */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Destination City</label>
            <AutoComplete
              type="text"
              name="destinationCity"
              options={cityData}
              value={dstCity}
              onChange={(text) => {
                setDstCity(text)
              }}
              fieldType="DestinationCity"
              placeholder="Search Destination"
              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Start Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={searchUser.startDate}
              onChange={handleChange}
              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={searchUser.endDate}
              onChange={handleChange}
              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="mt-1 px-16 py-[10px] bg-gray-300 border border-gray-300 text-black dark:text-white dark:border-gray-700 font-semibold rounded-md transition duration-200"
            >
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchPanel;
