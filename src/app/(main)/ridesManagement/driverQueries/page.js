'use client';
import BasicTable from '@/components/tables/BasicTable';
import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import UpdateDetailsModal from '@/components/modals/UpdateDetailsModal';

const driversData = [
  {
    id: 1,
    vehicle_number: "BR01PL3488",
    vehicle_model: "SwiftDzire",
    driver_name: "Sunil kumar",
    phone: "9771309695",
    rc_number: "BR01200823275587",
    status: "BANNED",
    actions: { delete: true, edit: true }
  },
  {
    id: 2,
    vehicle_number: "BR01PC1235",
    vehicle_model: "Tata Ace",
    driver_name: "Pintu Kumar",
    phone: "7033911340",
    rc_number: "BR01202050284867",
    status: "INACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 3,
    vehicle_number: "BR01PB6737",
    vehicle_model: "WagonR",
    driver_name: "Ravi Kumar",
    phone: "9709106222",
    rc_number: "BR01201380146675",
    status: "BANNED",
    actions: { delete: true, edit: true }
  },
  {
    id: 4,
    vehicle_number: "BR01PC6504",
    vehicle_model: "Swift Dzire",
    driver_name: "Amit Kumar",
    phone: "9507686975",
    rc_number: "BR01201460151581",
    status: "ACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 5,
    vehicle_number: "BR01PC1234",
    vehicle_model: "Tata Magic",
    driver_name: "Abhishek Raj",
    phone: "9123456789",
    rc_number: "BR01201780123456",
    status: "ACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 6,
    vehicle_number: "BR01PB5678",
    vehicle_model: "Bolero",
    driver_name: "Manoj Kumar",
    phone: "9876543210",
    rc_number: "BR01201890198765",
    status: "ACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 7,
    vehicle_number: "BR01PC9999",
    vehicle_model: "Indigo",
    driver_name: "Suraj Kumar",
    phone: "9812345678",
    rc_number: "BR01201910111213",
    status: "INACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 8,
    vehicle_number: "BR01PA4321",
    vehicle_model: "Eeco",
    driver_name: "Rahul Kumar",
    phone: "9123123123",
    rc_number: "BR01201560234567",
    status: "BANNED",
    actions: { delete: true, edit: true }
  },
  {
    id: 9,
    vehicle_number: "BR01PL3488",
    vehicle_model: "SwiftDzire",
    driver_name: "Sunil kumar",
    phone: "9771309695",
    rc_number: "BR01200823275587",
    status: "BANNED",
    actions: { delete: true, edit: true }
  },
  {
    id: 10,
    vehicle_number: "BR01PC1235",
    vehicle_model: "Tata Ace",
    driver_name: "Pintu Kumar",
    phone: "7033911340",
    rc_number: "BR01202050284867",
    status: "INACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 11,
    vehicle_number: "BR01PB6737",
    vehicle_model: "WagonR",
    driver_name: "Ravi Kumar",
    phone: "9709106222",
    rc_number: "BR01201380146675",
    status: "BANNED",
    actions: { delete: true, edit: true }
  },
  {
    id: 12,
    vehicle_number: "BR01PC6504",
    vehicle_model: "Swift Dzire",
    driver_name: "Amit Kumar",
    phone: "9507686975",
    rc_number: "BR01201460151581",
    status: "ACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 13,
    vehicle_number: "BR01PC1234",
    vehicle_model: "Tata Magic",
    driver_name: "Abhishek Raj",
    phone: "9123456789",
    rc_number: "BR01201780123456",
    status: "ACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 14,
    vehicle_number: "BR01PB5678",
    vehicle_model: "Bolero",
    driver_name: "Manoj Kumar",
    phone: "9876543210",
    rc_number: "BR01201890198765",
    status: "ACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 15,
    vehicle_number: "BR01PC9999",
    vehicle_model: "Indigo",
    driver_name: "Suraj Kumar",
    phone: "9812345678",
    rc_number: "BR01201910111213",
    status: "INACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 16,
    vehicle_number: "BR01PA4321",
    vehicle_model: "Eeco",
    driver_name: "Rahul Kumar",
    phone: "9123123123",
    rc_number: "BR01201560234567",
    status: "BANNED",
    actions: { delete: true, edit: true }
  },
  {
    id: 17,
    vehicle_number: "BR01PL3488",
    vehicle_model: "SwiftDzire",
    driver_name: "Sunil kumar",
    phone: "9771309695",
    rc_number: "BR01200823275587",
    status: "BANNED",
    actions: { delete: true, edit: true }
  },
  {
    id: 18,
    vehicle_number: "BR01PC1235",
    vehicle_model: "Tata Ace",
    driver_name: "Pintu Kumar",
    phone: "7033911340",
    rc_number: "BR01202050284867",
    status: "INACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 19,
    vehicle_number: "BR01PB6737",
    vehicle_model: "WagonR",
    driver_name: "Ravi Kumar",
    phone: "9709106222",
    rc_number: "BR01201380146675",
    status: "BANNED",
    actions: { delete: true, edit: true }
  },
  {
    id: 20,
    vehicle_number: "BR01PC6504",
    vehicle_model: "Swift Dzire",
    driver_name: "Amit Kumar",
    phone: "9507686975",
    rc_number: "BR01201460151581",
    status: "ACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 21,
    vehicle_number: "BR01PC1234",
    vehicle_model: "Tata Magic",
    driver_name: "Abhishek Raj",
    phone: "9123456789",
    rc_number: "BR01201780123456",
    status: "ACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 22,
    vehicle_number: "BR01PB5678",
    vehicle_model: "Bolero",
    driver_name: "Manoj Kumar",
    phone: "9876543210",
    rc_number: "BR01201890198765",
    status: "ACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 23,
    vehicle_number: "BR01PC9999",
    vehicle_model: "Indigo",
    driver_name: "Suraj Kumar",
    phone: "9812345678",
    rc_number: "BR01201910111213",
    status: "INACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 24,
    vehicle_number: "BR01PA4321",
    vehicle_model: "Eeco",
    driver_name: "Rahul Kumar",
    phone: "9123123123",
    rc_number: "BR01201560234567",
    status: "BANNED",
    actions: { delete: true, edit: true }
  },
  {
    id: 25,
    vehicle_number: "BR01PL3488",
    vehicle_model: "SwiftDzire",
    driver_name: "Sunil kumar",
    phone: "9771309695",
    rc_number: "BR01200823275587",
    status: "BANNED",
    actions: { delete: true, edit: true }
  },
  {
    id: 26,
    vehicle_number: "BR01PC1235",
    vehicle_model: "Tata Ace",
    driver_name: "Pintu Kumar",
    phone: "7033911340",
    rc_number: "BR01202050284867",
    status: "INACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 27,
    vehicle_number: "BR01PB6737",
    vehicle_model: "WagonR",
    driver_name: "Ravi Kumar",
    phone: "9709106222",
    rc_number: "BR01201380146675",
    status: "BANNED",
    actions: { delete: true, edit: true }
  },
  {
    id: 28,
    vehicle_number: "BR01PC6504",
    vehicle_model: "Swift Dzire",
    driver_name: "Amit Kumar",
    phone: "9507686975",
    rc_number: "BR01201460151581",
    status: "ACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 29,
    vehicle_number: "BR01PC1234",
    vehicle_model: "Tata Magic",
    driver_name: "Abhishek Raj",
    phone: "9123456789",
    rc_number: "BR01201780123456",
    status: "ACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 30,
    vehicle_number: "BR01PB5678",
    vehicle_model: "Bolero",
    driver_name: "Manoj Kumar",
    phone: "9876543210",
    rc_number: "BR01201890198765",
    status: "ACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 31,
    vehicle_number: "BR01PC9999",
    vehicle_model: "Indigo",
    driver_name: "Suraj Kumar",
    phone: "9812345678",
    rc_number: "BR01201910111213",
    status: "INACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 32,
    vehicle_number: "BR01PA4321",
    vehicle_model: "Eeco",
    driver_name: "Rahul Kumar",
    phone: "9123123123",
    rc_number: "BR01201560234567",
    status: "BANNED",
    actions: { delete: true, edit: true }
  },
  {
    id: 33,
    vehicle_number: "BR01PL3488",
    vehicle_model: "SwiftDzire",
    driver_name: "Sunil kumar",
    phone: "9771309695",
    rc_number: "BR01200823275587",
    status: "BANNED",
    actions: { delete: true, edit: true }
  },
  {
    id: 34,
    vehicle_number: "BR01PC1235",
    vehicle_model: "Tata Ace",
    driver_name: "Pintu Kumar",
    phone: "7033911340",
    rc_number: "BR01202050284867",
    status: "INACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 35,
    vehicle_number: "BR01PB6737",
    vehicle_model: "WagonR",
    driver_name: "Ravi Kumar",
    phone: "9709106222",
    rc_number: "BR01201380146675",
    status: "BANNED",
    actions: { delete: true, edit: true }
  },
  {
    id: 36,
    vehicle_number: "BR01PC6504",
    vehicle_model: "Swift Dzire",
    driver_name: "Amit Kumar",
    phone: "9507686975",
    rc_number: "BR01201460151581",
    status: "ACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 37,
    vehicle_number: "BR01PC1234",
    vehicle_model: "Tata Magic",
    driver_name: "Abhishek Raj",
    phone: "9123456789",
    rc_number: "BR01201780123456",
    status: "ACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 38,
    vehicle_number: "BR01PB5678",
    vehicle_model: "Bolero",
    driver_name: "Manoj Kumar",
    phone: "9876543210",
    rc_number: "BR01201890198765",
    status: "ACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 39,
    vehicle_number: "BR01PC9999",
    vehicle_model: "Indigo",
    driver_name: "Suraj Kumar",
    phone: "9812345678",
    rc_number: "BR01201910111213",
    status: "INACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 40,
    vehicle_number: "BR01PA4321",
    vehicle_model: "Eeco",
    driver_name: "Rahul Kumar",
    phone: "9123123123",
    rc_number: "BR01201560234567",
    status: "BANNED",
    actions: { delete: true, edit: true }
  },
  {
    id: 41,
    vehicle_number: "BR01PL3488",
    vehicle_model: "SwiftDzire",
    driver_name: "Sunil kumar",
    phone: "9771309695",
    rc_number: "BR01200823275587",
    status: "BANNED",
    actions: { delete: true, edit: true }
  },
  {
    id: 42,
    vehicle_number: "BR01PC1235",
    vehicle_model: "Tata Ace",
    driver_name: "Pintu Kumar",
    phone: "7033911340",
    rc_number: "BR01202050284867",
    status: "INACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 43,
    vehicle_number: "BR01PB6737",
    vehicle_model: "WagonR",
    driver_name: "Ravi Kumar",
    phone: "9709106222",
    rc_number: "BR01201380146675",
    status: "BANNED",
    actions: { delete: true, edit: true }
  },
  {
    id: 44,
    vehicle_number: "BR01PC6504",
    vehicle_model: "Swift Dzire",
    driver_name: "Amit Kumar",
    phone: "9507686975",
    rc_number: "BR01201460151581",
    status: "ACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 45,
    vehicle_number: "BR01PC1234",
    vehicle_model: "Tata Magic",
    driver_name: "Abhishek Raj",
    phone: "9123456789",
    rc_number: "BR01201780123456",
    status: "ACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 46,
    vehicle_number: "BR01PB5678",
    vehicle_model: "Bolero",
    driver_name: "Manoj Kumar",
    phone: "9876543210",
    rc_number: "BR01201890198765",
    status: "ACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 47,
    vehicle_number: "BR01PC9999",
    vehicle_model: "Indigo",
    driver_name: "Suraj Kumar",
    phone: "9812345678",
    rc_number: "BR01201910111213",
    status: "INACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 48,
    vehicle_number: "BR01PA4321",
    vehicle_model: "Eeco",
    driver_name: "Rahul Kumar",
    phone: "9123123123",
    rc_number: "BR01201560234567",
    status: "BANNED",
    actions: { delete: true, edit: true }
  },
  {
    id: 49,
    vehicle_number: "BR01PL3488",
    vehicle_model: "SwiftDzire",
    driver_name: "Sunil kumar",
    phone: "9771309695",
    rc_number: "BR01200823275587",
    status: "BANNED",
    actions: { delete: true, edit: true }
  },
  {
    id: 50,
    vehicle_number: "BR01PC1235",
    vehicle_model: "Tata Ace",
    driver_name: "Pintu Kumar",
    phone: "7033911340",
    rc_number: "BR01202050284867",
    status: "INACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 51,
    vehicle_number: "BR01PB6737",
    vehicle_model: "WagonR",
    driver_name: "Ravi Kumar",
    phone: "9709106222",
    rc_number: "BR01201380146675",
    status: "BANNED",
    actions: { delete: true, edit: true }
  },
  {
    id: 52,
    vehicle_number: "BR01PC6504",
    vehicle_model: "Swift Dzire",
    driver_name: "Amit Kumar",
    phone: "9507686975",
    rc_number: "BR01201460151581",
    status: "ACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 53,
    vehicle_number: "BR01PC1234",
    vehicle_model: "Tata Magic",
    driver_name: "Abhishek Raj",
    phone: "9123456789",
    rc_number: "BR01201780123456",
    status: "ACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 54,
    vehicle_number: "BR01PB5678",
    vehicle_model: "Bolero",
    driver_name: "Manoj Kumar",
    phone: "9876543210",
    rc_number: "BR01201890198765",
    status: "ACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 55,
    vehicle_number: "BR01PC9999",
    vehicle_model: "Indigo",
    driver_name: "Suraj Kumar",
    phone: "9812345678",
    rc_number: "BR01201910111213",
    status: "INACTIVE",
    actions: { delete: true, edit: true }
  },
  {
    id: 56,
    vehicle_number: "BR01PA4321",
    vehicle_model: "Eeco",
    driver_name: "Rahul Kumar",
    phone: "9123123123",
    rc_number: "BR01201560234567",
    status: "BANNED",
    actions: { delete: true, edit: true }
  }
];

const statusBadge = (status) => {
  const baseClasses =
    'px-3 py-1 text-xs font-semibold rounded-full border inline-block';

  switch (status) {
    case 'ACTIVE':
      return (
        <span
          className={`${baseClasses} 
            text-green-700 bg-green-100 border-green-300 
            dark:text-green-400 dark:bg-green-900 dark:border-green-700`}
        >
          {status}
        </span>
      );

    case 'BANNED':
      return (
        <span
          className={`${baseClasses} 
            text-red-700 bg-red-100 border-red-300 
            dark:text-red-400 dark:bg-red-900 dark:border-red-700`}
        >
          {status}
        </span>
      );

    case 'INACTIVE':
      return (
        <span
          className={`${baseClasses} 
            text-yellow-800 bg-yellow-100 border-yellow-300 
            dark:text-yellow-300 dark:bg-yellow-900 dark:border-yellow-700`}
        >
          {status}
        </span>
      );

    default:
      return (
        <span
          className={`${baseClasses} 
            text-gray-700 bg-gray-100 border-gray-300 
            dark:text-gray-300 dark:bg-gray-800 dark:border-gray-600`}
        >
          {status}
        </span>
      );
  }
};


const OnetimeCabsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCab, setSelectedCab] = useState(null);
  const [modalMode, setModalMode] = useState('edit');

  const totalPages = Math.ceil(driversData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = driversData.slice(startIndex, startIndex + rowsPerPage);

  // const handleEditClick = (item) => {
  //   setSelectedCab(item);
  //   setIsModalOpen(true);
  // };

  // const handleModalSubmit = () => {
  //   console.log('Updated:', selectedCab);
  //   setIsModalOpen(false);
  // };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setSelectedCab((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

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
      <th className="px-6 py-6 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700">ID</th>
      <th className="px-6 py-6 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700">User Name.</th>
      <th className="px-6 py-6 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700">User Email</th>
      <th className="px-6 py-6 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700">Driver</th>
      <th className="px-6 py-6 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700">Phone</th>
      <th className="px-6 py-6 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700">RC</th>
      <th className="px-6 py-6 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700">Status</th>
      <th className="px-6 py-6 text-left font-semibold tracking-wide border-b border-gray-200 dark:border-gray-700">Actions</th>
    </tr>
  );

  const tbody = currentData.map((item) => (
    <tr
      key={item.id}
      className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
    >
      <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200">{item.id}</td>
      <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200">{item.vehicle_number}</td>
      <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200">{item.vehicle_model}</td>
      <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200">{item.driver_name}</td>
      <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200">{item.phone}</td>
      <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200">{item.rc_number}</td>
      <td className="px-4 py-4">{statusBadge(item.status)}</td>
      <td className="px-4 py-4">
        <div className="flex gap-3 items-center">
          {item.actions.edit && (
            <button
              onClick={() => handleEditClick(item)}
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-sm font-medium"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </button>
          )}
          {item.actions.delete && (
            <button
              className="text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>
      </td>
    </tr>
  ));


  return (
    <>
      {/* TABLE FOR ONE TIME CABS  */}
      <BasicTable
        title="Driver Queries"
        actions={[
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
        entriesOptions={[10, 25, 50, 100]}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(value) => {
          setRowsPerPage(value);
          setCurrentPage(1);
        }}
        thead={thead}
        tbody={tbody}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

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

export default OnetimeCabsPage;