'use client';
import BasicTable from '@/components/tables/BasicTable';
import React, { useState } from 'react';
import { LuAnchor } from "react-icons/lu";
import UpdateDetailsModal from '@/components/modals/UpdateDetailsModal';
import CabManagementCard from '@/components/cards/CabManagementCard';


const CabDriverPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCab, setSelectedCab] = useState(null);
  const [modalMode, setModalMode] = useState('edit');
  const [viewType, setViewType] = useState("Card");


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

  const thead = (
    <tr className="bg-gray-100 dark:bg-gray-800 text-xs sm:text-sm text-gray-800 dark:text-gray-200 uppercase">
      <th className="px-4 py-4 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700">
        <button>ID</button>
      </th>
      <th className="px-4 py-4 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700">
        <button>Model</button>
      </th>
      <th className="px-4 py-4 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700">
        <td>Owner</td>
      </th>
      <th className="px-4 py-4 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700">
        <button>Mfg year</button>
      </th>
      <th className="px-4 py-4 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700">
        <td>RC</td>
      </th>
      <th className="px-4 py-4 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700">
        <button>Type</button>
      </th>
      <th className="px-4 py-4 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700">
        <button>Cab Pic</button>
      </th>
      <th className="px-4 py-4 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700">
        <button>Has Carrier</button>
      </th>
      <th className="px-4 py-4 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700">
        <button>CNG</button>
      </th>
      <th className="px-4 py-4 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700">
        <button>Actions</button>
      </th>
    </tr>
  );

  const tbody = (
    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-[14px]">
      {/* ID */}
      <td className="px-4 py-2 text-sm text-left text-gray-800 dark:text-gray-200">1</td>

      {/* MODEL */}
      <td className="px-4 py-4 text-sm text-left text-gray-800 dark:text-gray-200">
        <div className='flex flex-col'>
          <span>SwiftDzire</span>
          <span>Rides:693</span>
        </div>
      </td>

      {/* OWNER */}
      <td className="px-4 py-4 text-sm text-left text-gray-800 dark:text-gray-200">
        <div className='flex flex-col'>
          <span>VISHWASH KUMAR GUPTA</span>
          <span>8860132608[Saharsa]</span>
          <span>[Available at: <span className='text-green-600'>Baruari, Bihar 852110, India</span>] Rate:[<span className='text-red-600'>11</span> Rs/Km]</span>
        </div>
      </td>

      {/* MFG YEAR */}
      <td className="px-4 py-4 text-sm text-left text-gray-800 dark:text-gray-200">2025</td>

      {/* RC */}
      <td className="px-4 py-4 text-sm text-left text-gray-800 dark:text-gray-200">
        <div className='text-yellow-500 font-semibold'>BR01AB0007</div>
      </td>

      {/* TYPE */}
      <td className="px-4 py-4 text-sm text-left text-gray-800 dark:text-gray-200">
        <div>Mini</div>
      </td>

      {/* CAB PIC */}
      <td className="px-4 py-4 text-sm text-left text-gray-800 dark:text-gray-200">
        <div>CAB PIC</div>
      </td>

      {/* HAS CARRIER */}
      <td className="px-4 py-4 text-sm text-left text-gray-800 dark:text-gray-200">
        <div>Yes</div>
      </td>

      {/* CNG */}
      <td className="px-4 py-4 text-sm text-left text-gray-800 dark:text-gray-200">
        <div>Yes</div>
      </td>

      {/* ACTIONS */}
      <td className="px-4 py-4 text-sm text-left text-gray-800 dark:text-gray-200">
        <div className="flex gap-3 items-center">
          <button className="text-white bg-sky-600 px-3 py-1 roudnded-md hover:text-blue-800">Edit</button>
          <LuAnchor className='text-green-600 text-[18px]' />
        </div>
      </td>
    </tr>
  );


  return (
    <>
      {/* TABLE FOR RB CABS  */}
      {
        viewType === 'Table' ? (
          <BasicTable
            title="RB Cabs"
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
              {
                label: 'New',
                customColor: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white',
                onClick: () => handleNewClick()
              },
              {
                label: 'CSV',
                customColor: 'bg-gradient-to-r from-yellow-500 to-yellow-500 text-white',
                onClick: () => alert('Add clicked')
              }
            ]}
            thead={thead}
            tbody={tbody}
          />
        ) : (
          <CabManagementCard
            title="RB Cabs"
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
              {
                label: 'New',
                customColor: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white',
                onClick: () => handleNewClick()
              },
              {
                label: 'CSV',
                customColor: 'bg-gradient-to-r from-yellow-500 to-yellow-500 text-white',
                onClick: () => alert('Add clicked')
              }
            ]}
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

export default CabDriverPage;