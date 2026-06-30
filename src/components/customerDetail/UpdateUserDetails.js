'use client';
import React, { useEffect, useState } from 'react';
import { FaLocationDot } from "react-icons/fa6";
import { FaCaretDown } from "react-icons/fa";
import Image from 'next/image';
import UserPrimaryData from './UserPrimaryData';
import CitySearchModal from '../modals/CitySearchModal';

const UpdateUserDetails = ({ rideDetails, actData, genTemplates, canTemplates, checkUpdate, setCheckUpdate, showStatus, setShowStatus }) => {
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [location, setLocation] = useState({ source: '', destination: '' });

  useEffect(() => {
  if (rideDetails) {
    setLocation({
      source: rideDetails?.source_city_name || '',
      destination: rideDetails?.destination_city_name || '',
    });
  }
}, [rideDetails]);

  const handleCitySelect = (selectedCity) => {
    setLocation((prev) => ({
      ...prev,
      source: editingField === "source" ? selectedCity : prev.source,
      destination: editingField === "destination" ? selectedCity : prev.destination,
    }));
    setIsCityModalOpen(false);
  };

  return (
    <div className={`overflow-hidden shadow-md border dark:border-slate-700 my-4 rounded-md ${!isActive ? 'pb-4' : ''}`}>
      <div className="flex flex-wrap md:flex-nowrap items-start md:items-center justify-between text-sm rounded-md p-4 transition-colors bg-gradient-to-r from-[#F0F5FD] to-[#B9EAFF] dark:from-[#1E1F2D] dark:to-[#323B50]">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 dark:bg-[#EADFFA] p-2 rounded-lg shadow-lg">
              <Image src="/icons/journey.svg" alt="Journey" width={20} height={20} />
            </div>
            <span className="text-[14px] font-semibold text-gray-900 dark:text-white">Update Journey Details</span>
            <span className="text-[14px] font-semibold text-gray-900 dark:text-white capitalize">( {rideDetails?.service_type} )</span>
            <div className="flex items-center gap-2 flex-wrap md:flex-nowrap w-full md:w-auto">
              <div className="flex items-center gap-2 shrink-0">
                <div className="border-4 border-blue-200 dark:border-blue-500 bg-white dark:bg-gray-900 rounded-full p-[2px]">
                  <div className="bg-blue-600 dark:bg-blue-400 rounded-full h-2 w-2"></div>
                </div>
                <button
                  className="text-gray-600 dark:text-gray-300 text-[14px] whitespace-nowrap"
                  onClick={() => {
                    setEditingField("source");
                    setIsCityModalOpen(true);
                  }}
                >
                  {location?.source}
                </button>
              </div>

              <div className="h-[4px] w-[5%] bg-gray-200 dark:bg-gray-600"></div>
              <div className="flex items-center gap-2 shrink-0">
                <FaLocationDot className="text-[16px] md:text-[20px] text-red-600 dark:text-red-400" />
                <button
                  className="text-gray-600 dark:text-gray-300 text-[14px] whitespace-nowrap cursor-pointer"
                  onClick={() => {
                    setEditingField("destination");
                    setIsCityModalOpen(true);
                  }}
                >
                  {location?.destination}
                </button>
              </div>
              <div className="h-[4px] w-[5%] bg-gray-200 dark:bg-gray-600"></div>
              <div className="flex items-center gap-2 text-[14px] text-gray-600 w-full">
                <div
                  className="gap-2 justify-between flex"
                  onClick={e => {
                    e.stopPropagation();
                    if(rideDetails?.route_map && rideDetails?.route_map != "0") {
                        window.open(rideDetails?.route_map, "_blank"); 
                    } else {
                      const src = rideDetails?.booking_source_coordinates?.coordinates?.sort();
                      const dest = rideDetails?.booking_destination_coordinates?.coordinates?.sort();
                      if (src && dest) {
                        const url = `https://www.google.com/maps/dir/${encodeURIComponent(src)}/${encodeURIComponent(dest)}`;
                        window.open(url, '_blank');
                      }
                    }
                  }}
                  style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                  <Image
                    src="/icons/googlemap.svg"
                    alt="Google Maps"
                    height={30}
                    width={30}
                  />
                  <span> {"Direction"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          className="mt-4 md:mt-0 text-black dark:text-gray-300"
          onClick={() => setIsActive(!isActive)}
        >
          <FaCaretDown className={`text-2xl transform transition-transform duration-300 ${!isActive ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {!isActive && rideDetails && 
        <UserPrimaryData 
          rideData={rideDetails} 
          activityData={actData} 
          generalTemplates={genTemplates} 
          cancelTemplates={canTemplates} 
          checkUpdate={checkUpdate}
          setCheckUpdate={setCheckUpdate}
          showStatus={showStatus} 
          setShowStatus={setShowStatus}
        />}
      {isCityModalOpen && (
        <CitySearchModal
          isOpen={isCityModalOpen}
          onClose={() => setIsCityModalOpen(false)}
          onSelect={handleCitySelect}
          fieldType={editingField === "source" ? "SourceCity" : "DestinationCity"}
        />
      )}
    </div>
  );
};

export default UpdateUserDetails;