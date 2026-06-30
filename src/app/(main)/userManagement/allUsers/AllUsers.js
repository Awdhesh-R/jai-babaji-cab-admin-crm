'use client';
import BasicTable from '@/components/tables/BasicTable';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import UpdateDetailsModal from '@/components/modals/UpdateDetailsModal';
import AllRideCard from '@/components/cards/AllRideCard';
import { apiClient } from '@/app/lib/apiClient';
import { FiFastForward } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FaMobileAlt, FaCalendarAlt, FaRegCopy, FaCheck } from "react-icons/fa";
import { FaCarSide, FaLocationDot } from "react-icons/fa6";
import { HiMiniLink } from "react-icons/hi2";
import SearchPanel from '@/components/ui/SearchPanel';


const AllUsersPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCab, setSelectedCab] = useState(null);
  const [modalMode, setModalMode] = useState('edit');
  const [viewType, setViewType] = useState("Card");
  const [allRides, setAllRides] = useState([]);
  const [copied, setCopied] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();

  const lastCardRef = useCallback((node) => {
    if (!hasMore) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observerRef.current.observe(node);
  }, [hasMore]);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleEditClick = (item) => {
    setModalMode('edit');
    setSelectedCab(item);
    setIsModalOpen(true);
  };

  const handleNewClick = () => {
    setModalMode('add');
    setSelectedCab({
      vehicle_number: '',
      vehicle_model: '',
      driver_name: '',
      phone: '',
      rc_number: '',
      status: 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleModalSubmit = () => {
    if (modalMode === 'add') {
      console.log('Adding new cab:', selectedCab);
      // Add API call or local update logic here
    } else {
      console.log('Updating cab:', selectedCab);
      // Add update logic here
    }
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedCab((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchAllRides = async (pageNo) => {
    try {
      const response = await apiClient('GET', `/ride_management/allRide/${pageNo}`);


      if (response && response.data?.length > 0) {
        console.log('data', response.data);

        setAllRides((prev) => [...prev, ...response.data]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log("Error fetching rides:", error.message || error);
    }
  };

  useEffect(() => {
    fetchAllRides(page);
  }, [page]);

  const thead = (
    <tr className="bg-gray-100 dark:bg-gray-800 text-xs sm:text-sm text-gray-800 dark:text-gray-200 uppercase">
      <th className="px-6 py-6 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700 cursor-pointer">
        <button>ID</button>
      </th>
      <th className="px-6 py-6 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700 cursor-pointer">
        <button>RB Id</button>
      </th>
      <th className="px-6 py-6 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700 cursor-pointer">
        <button>Type</button>
      </th>
      <th className="px-6 py-6 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700 cursor-pointer">
        <button>Name</button>
      </th>
      <th className="px-6 py-6 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700 cursor-pointer">
        <button>Mobile</button>
      </th>
      <th className="px-6 py-6 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700 cursor-pointer">
        <button>City</button>
      </th>
      <th className="px-6 py-6 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700 cursor-pointer">
        <button>Pic</button>
      </th>
      <th className="px-6 py-6 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700 cursor-pointer">
        <button>Status</button>
      </th>
      <th className="px-6 py-6 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700 cursor-pointer">
        <button>Ref ID</button>
      </th>
      <th className="px-6 py-6 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700 cursor-pointer">
        <button>Actions</button>
      </th>
    </tr>
  );

  const tbody = allRides.map((item) => (
    <tr
      key={item.id}
      className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
    >
      {/* ID */}
      <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200">
        <div className="flex flex-col items-start">
          <span className='text-[14px] font-regular text-[#2F6FED]'>{item.urid}</span>
        </div>
      </td>
      {/* RB ID  */}
      <td className="text-sm text-gray-800 dark:text-gray-200">
        <div className="flex flex-col pb-3 pt-3 text-sm w-full max-w-md mx-auto">
          <span className='text-[14px] font-regular text-[#2F6FED]'>{item.urid}</span>
        </div>
      </td>
      {/* TYPE  */}
      <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200">
        <div className="flex flex-col pb-3 pt-3 text-sm w-full max-w-md mx-auto">
          <span className='text-[14px] font-regular text-[#2F6FED]'>{item.urid}</span>
        </div>
      </td>
      {/* NAME  */}
      <td className="px-4 py-4">
        <div className="flex flex-col pb-3 pt-3 text-sm w-full max-w-md mx-auto">
          <span className="break-all text-gray-500">{item.booking_travel_date}</span>
        </div>
      </td>
      {/* MOBILE  */}
      <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200">
        <div className="flex flex-col pb-3 pt-3 text-sm w-full max-w-md mx-auto">
          <span className='text-[14px] font-regular text-[#2F6FED]'>{item.urid}</span>
        </div>
      </td>
      {/* CITY  */}
      <td className="px-4 py-4">
        <div className="flex flex-col pb-3 pt-3 text-sm w-full max-w-md mx-auto">
          <span className="break-all text-gray-500">{item.booking_travel_date}</span>
        </div>
      </td>
      {/* PIC  */}
      <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200">
        <div className="flex flex-col pb-3 pt-3 text-sm w-full max-w-md mx-auto">
          <span className='text-[14px] font-regular text-[#2F6FED]'>{item.urid}</span>
        </div>
      </td>
      {/* STATUS  */}
      <td className="px-4 py-4">
        <div className="flex flex-col pb-3 pt-3 text-sm w-full max-w-md mx-auto">
          <span className="break-all text-gray-500">{item.booking_travel_date}</span>
        </div>
      </td>
      {/* REF ID  */}
      <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200">
        <div className="flex flex-col pb-3 pt-3 text-sm w-full max-w-md mx-auto">
          <span className='text-[14px] font-regular text-[#2F6FED]'>{item.urid}</span>
        </div>
      </td>
      {/* ACTIONS  */}
      <td className="px-4 py-4">
        <div className="flex flex-col gap-1 items-center">
          <button
            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-md px-2 flex items-center text-sm"
          >
            Edit
          </button>
        </div>
      </td>
    </tr>
  ));


  return (
    <>
      <SearchPanel />
      {
        viewType === 'Table' ? (
          <BasicTable
            title="RB Booking"
            subtitle={[
              {
                label: "Offer",
                customColor: 'bg-green-600 text-white',
              },
              {
                label: "Admin",
                customColor: 'bg-blue-700 text-white',
              },
              {
                label: "Driver",
                customColor: 'bg-gray-700 text-white',
              }
            ]}
            actions={[
              {
                isCustom: true,
                element: (
                  <select
                    className="py-2 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-white"
                    value={viewType}
                    onChange={(e) => setViewType(e.target.value)}
                  >
                    <option value="Table">Table</option>
                    <option value="Card">Card</option>
                  </select>
                )
              },
              // {
              //   label: 'New',
              //   customColor: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white',
              //   onClick: () => handleNewClick()
              // },
              // {
              //   label: 'CSV',
              //   customColor: 'bg-gradient-to-r from-yellow-500 to-yellow-500 text-white',
              //   onClick: () => alert('Add clicked')
              // }
              {
                label: 'Mini',
                value: '18',
              },
              {
                label: 'Sedan',
                value: '155'
              },
              {
                label: 'SUV',
                value: '57'
              }
            ]}
            thead={thead}
            tbody={tbody}
          />
        ) : (
          <AllRideCard
            title="RB Booking"
            subtitle={[
              {
                label: "Offer",
                customColor: 'bg-green-600 text-white',
              },
              {
                label: "Admin",
                customColor: 'bg-blue-700 text-white',
              },
              {
                label: "Driver",
                customColor: 'bg-gray-700 text-white',
              }
            ]}
            actions={[
              {
                isCustom: true,
                element: (
                  <select
                    className="py-2 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-white"
                    value={viewType}
                    onChange={(e) => setViewType(e.target.value)}
                  >
                    <option value="Table">Table</option>
                    <option value="Card">Card</option>
                  </select>
                )
              },
              // {
              //   label: 'New',
              //   customColor: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white',
              //   onClick: () => handleNewClick()
              // },
              // {
              //   label: 'CSV',
              //   customColor: 'bg-gradient-to-r from-yellow-500 to-yellow-500 text-white',
              //   onClick: () => alert('Add clicked')
              // }
              {
                label: 'Mini',
                value: '8',
              },
              {
                label: 'Sedan',
                value: '155'
              },
              {
                label: 'SUV',
                value: '57'
              }
            ]}
            rides={allRides}
            moreData={hasMore}
            checklastCardRef={lastCardRef}
          />
        )
      }

      {/* UPDATE MODAL  */}
      {isModalOpen && selectedCab && (
        <UpdateDetailsModal
          isOpen={isModalOpen}
          title={modalMode === 'add' ? 'Add New Cab' : 'Edit Cab Details'}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 m-2">
            {[
              ['Cab No', 'vehicle_number'],
              ['Model', 'vehicle_model'],
              ['Driver Name', 'driver_name'],
              ['Phone', 'phone'],
              ['RC Number', 'rc_number'],
              ['Whatsapp Number', 'phone'],
              ['Status', 'status'],
            ].map(([label, name]) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{label}</label>
                {name === 'status' ? (
                  <select
                    name="status"
                    value={selectedCab.status || ''}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="BANNED">BANNED</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    name={name}
                    value={selectedCab[name] || ''}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                )}
              </div>
            ))}
          </div>
        </UpdateDetailsModal>
      )}
    </>
  );
};

export default AllUsersPage;