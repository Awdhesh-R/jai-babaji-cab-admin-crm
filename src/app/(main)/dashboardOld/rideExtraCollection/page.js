'use client';
import BasicTable from '@/components/tables/BasicTable';
import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const extraCollection = [
  {
    id: 1,
    vehicle_number: "BR01PL3488",
    vehicle_model: "SwiftDzire",
    driver_name: "Sunil kumar",
    phone: "9771309695",
    rc_number: "BR01200823275587",
    tx_remarks: "",
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
    tx_remarks: "",
    status: "PENDING",
    actions: { delete: true, edit: true }
  },
  {
    id: 3,
    vehicle_number: "BR01PB6737",
    vehicle_model: "WagonR",
    driver_name: "Ravi Kumar",
    phone: "9709106222",
    rc_number: "BR01201380146675",
    tx_remarks: "",
    status: "BANNED",
    actions: { delete: true, edit: false }
  },
  {
    id: 4,
    vehicle_number: "BR01PC6504",
    vehicle_model: "Swift Dzire",
    driver_name: "Amit Kumar",
    phone: "9507686975",
    rc_number: "BR01201460151581",
    tx_remarks: "",
    status: "APPROVED",
    actions: { delete: true, edit: false }
  },
  {
    id: 5,
    vehicle_number: "BR01PC1234",
    vehicle_model: "Tata Magic",
    driver_name: "Abhishek Raj",
    phone: "9123456789",
    rc_number: "BR01201780123456",
    tx_remarks: "",
    status: "REJECTED",
    actions: { delete: true, edit: false }
  },
  {
    id: 6,
    vehicle_number: "BR01PB5678",
    vehicle_model: "Bolero",
    driver_name: "Manoj Kumar",
    phone: "9876543210",
    rc_number: "BR01201890198765",
    tx_remarks: "",
    status: "APPROVED",
    actions: { delete: true, edit: false }
  },
  {
    id: 7,
    vehicle_number: "BR01PC9999",
    vehicle_model: "Indigo",
    driver_name: "Suraj Kumar",
    phone: "9812345678",
    rc_number: "BR01201910111213",
    tx_remarks: "",
    status: "PENDING",
    actions: { delete: true, edit: false }
  },
  {
    id: 8,
    vehicle_number: "BR01PA4321",
    vehicle_model: "Eeco",
    driver_name: "Rahul Kumar",
    phone: "9123123123",
    rc_number: "BR01201560234567",
    tx_remarks: "",
    status: "BANNED",
    actions: { delete: true, edit: false }
  },
  {
    id: 9,
    vehicle_number: "BR01PL3488",
    vehicle_model: "SwiftDzire",
    driver_name: "Sunil kumar",
    phone: "9771309695",
    rc_number: "BR01200823275587",
    tx_remarks: "",
    status: "BANNED",
    actions: { delete: false, edit: true }
  },
  {
    id: 10,
    vehicle_number: "BR01PC1235",
    vehicle_model: "Tata Ace",
    driver_name: "Pintu Kumar",
    phone: "7033911340",
    rc_number: "BR01202050284867",
    tx_remarks: "",
    status: "PENDING",
    actions: { delete: true, edit: false }
  },
  {
    id: 11,
    vehicle_number: "BR01PB6737",
    vehicle_model: "WagonR",
    driver_name: "Ravi Kumar",
    phone: "9709106222",
    rc_number: "BR01201380146675",
    tx_remarks: "",
    status: "BANNED",
    actions: { delete: true, edit: false }
  },
  {
    id: 12,
    vehicle_number: "BR01PC6504",
    vehicle_model: "Swift Dzire",
    driver_name: "Amit Kumar",
    phone: "9507686975",
    rc_number: "BR01201460151581",
    tx_remarks: "",
    status: "APPROVED",
    actions: { delete: true, edit: false }
  },
  {
    id: 13,
    vehicle_number: "BR01PC1234",
    vehicle_model: "Tata Magic",
    driver_name: "Abhishek Raj",
    phone: "9123456789",
    rc_number: "BR01201780123456",
    tx_remarks: "",
    status: "REJECTED",
    actions: { delete: true, edit: false }
  },
  {
    id: 14,
    vehicle_number: "BR01PB5678",
    vehicle_model: "Bolero",
    driver_name: "Manoj Kumar",
    phone: "9876543210",
    rc_number: "BR01201890198765",
    tx_remarks: "",
    status: "APPROVED",
    actions: { delete: true, edit: false }
  },
  {
    id: 15,
    vehicle_number: "BR01PC9999",
    vehicle_model: "Indigo",
    driver_name: "Suraj Kumar",
    phone: "9812345678",
    rc_number: "BR01201910111213",
    tx_remarks: "",
    status: "PENDING",
    actions: { delete: true, edit: false }
  },
  {
    id: 16,
    vehicle_number: "BR01PA4321",
    vehicle_model: "Eeco",
    driver_name: "Rahul Kumar",
    phone: "9123123123",
    rc_number: "BR01201560234567",
    tx_remarks: "",
    status: "BANNED",
    actions: { delete: true, edit: false }
  },
  {
    id: 17,
    vehicle_number: "BR01PL3488",
    vehicle_model: "SwiftDzire",
    driver_name: "Sunil kumar",
    phone: "9771309695",
    rc_number: "BR01200823275587",
    tx_remarks: "",
    status: "BANNED",
    actions: { delete: false, edit: true }
  },
  {
    id: 18,
    vehicle_number: "BR01PC1235",
    vehicle_model: "Tata Ace",
    driver_name: "Pintu Kumar",
    phone: "7033911340",
    rc_number: "BR01202050284867",
    tx_remarks: "",
    status: "PENDING",
    actions: { delete: true, edit: false }
  },
  {
    id: 19,
    vehicle_number: "BR01PB6737",
    vehicle_model: "WagonR",
    driver_name: "Ravi Kumar",
    phone: "9709106222",
    rc_number: "BR01201380146675",
    tx_remarks: "",
    status: "BANNED",
    actions: { delete: true, edit: false }
  },
  {
    id: 20,
    vehicle_number: "BR01PC6504",
    vehicle_model: "Swift Dzire",
    driver_name: "Amit Kumar",
    phone: "9507686975",
    rc_number: "BR01201460151581",
    tx_remarks: "",
    status: "APPROVED",
    actions: { delete: true, edit: false }
  },
  {
    id: 21,
    vehicle_number: "BR01PC1234",
    vehicle_model: "Tata Magic",
    driver_name: "Abhishek Raj",
    phone: "9123456789",
    rc_number: "BR01201780123456",
    tx_remarks: "",
    status: "REJECTED",
    actions: { delete: true, edit: false }
  },
  {
    id: 22,
    vehicle_number: "BR01PB5678",
    vehicle_model: "Bolero",
    driver_name: "Manoj Kumar",
    phone: "9876543210",
    rc_number: "BR01201890198765",
    tx_remarks: "",
    status: "APPROVED",
    actions: { delete: true, edit: false }
  },
  {
    id: 23,
    vehicle_number: "BR01PC9999",
    vehicle_model: "Indigo",
    driver_name: "Suraj Kumar",
    phone: "9812345678",
    rc_number: "BR01201910111213",
    tx_remarks: "",
    status: "PENDING",
    actions: { delete: true, edit: false }
  },
  {
    id: 24,
    vehicle_number: "BR01PA4321",
    vehicle_model: "Eeco",
    driver_name: "Rahul Kumar",
    phone: "9123123123",
    rc_number: "BR01201560234567",
    tx_remarks: "",
    status: "BANNED",
    actions: { delete: true, edit: false }
  },
  {
    id: 25,
    vehicle_number: "BR01PL3488",
    vehicle_model: "SwiftDzire",
    driver_name: "Sunil kumar",
    phone: "9771309695",
    rc_number: "BR01200823275587",
    tx_remarks: "",
    status: "BANNED",
    actions: { delete: false, edit: true }
  },
  {
    id: 26,
    vehicle_number: "BR01PC1235",
    vehicle_model: "Tata Ace",
    driver_name: "Pintu Kumar",
    phone: "7033911340",
    rc_number: "BR01202050284867",
    tx_remarks: "",
    status: "PENDING",
    actions: { delete: true, edit: false }
  },
  {
    id: 27,
    vehicle_number: "BR01PB6737",
    vehicle_model: "WagonR",
    driver_name: "Ravi Kumar",
    phone: "9709106222",
    rc_number: "BR01201380146675",
    tx_remarks: "",
    status: "BANNED",
    actions: { delete: true, edit: false }
  },
  {
    id: 28,
    vehicle_number: "BR01PC6504",
    vehicle_model: "Swift Dzire",
    driver_name: "Amit Kumar",
    phone: "9507686975",
    rc_number: "BR01201460151581",
    tx_remarks: "",
    status: "APPROVED",
    actions: { delete: true, edit: false }
  },
  {
    id: 29,
    vehicle_number: "BR01PC1234",
    vehicle_model: "Tata Magic",
    driver_name: "Abhishek Raj",
    phone: "9123456789",
    rc_number: "BR01201780123456",
    tx_remarks: "",
    status: "REJECTED",
    actions: { delete: true, edit: false }
  },
  {
    id: 30,
    vehicle_number: "BR01PB5678",
    vehicle_model: "Bolero",
    driver_name: "Manoj Kumar",
    phone: "9876543210",
    rc_number: "BR01201890198765",
    tx_remarks: "",
    status: "APPROVED",
    actions: { delete: true, edit: false }
  },
  {
    id: 31,
    vehicle_number: "BR01PC9999",
    vehicle_model: "Indigo",
    driver_name: "Suraj Kumar",
    phone: "9812345678",
    rc_number: "BR01201910111213",
    tx_remarks: "",
    status: "PENDING",
    actions: { delete: true, edit: false }
  },
  {
    id: 32,
    vehicle_number: "BR01PA4321",
    vehicle_model: "Eeco",
    driver_name: "Rahul Kumar",
    phone: "9123123123",
    rc_number: "BR01201560234567",
    tx_remarks: "",
    status: "BANNED",
    actions: { delete: true, edit: false }
  },
  {
    id: 33,
    vehicle_number: "BR01PL3488",
    vehicle_model: "SwiftDzire",
    driver_name: "Sunil kumar",
    phone: "9771309695",
    rc_number: "BR01200823275587",
    tx_remarks: "",
    status: "BANNED",
    actions: { delete: false, edit: true }
  },
  {
    id: 34,
    vehicle_number: "BR01PC1235",
    vehicle_model: "Tata Ace",
    driver_name: "Pintu Kumar",
    phone: "7033911340",
    rc_number: "BR01202050284867",
    tx_remarks: "",
    status: "PENDING",
    actions: { delete: true, edit: false }
  },
  {
    id: 35,
    vehicle_number: "BR01PB6737",
    vehicle_model: "WagonR",
    driver_name: "Ravi Kumar",
    phone: "9709106222",
    rc_number: "BR01201380146675",
    tx_remarks: "",
    status: "BANNED",
    actions: { delete: true, edit: false }
  },
  {
    id: 36,
    vehicle_number: "BR01PC6504",
    vehicle_model: "Swift Dzire",
    driver_name: "Amit Kumar",
    phone: "9507686975",
    rc_number: "BR01201460151581",
    tx_remarks: "",
    status: "APPROVED",
    actions: { delete: true, edit: false }
  },
  {
    id: 37,
    vehicle_number: "BR01PC1234",
    vehicle_model: "Tata Magic",
    driver_name: "Abhishek Raj",
    phone: "9123456789",
    rc_number: "BR01201780123456",
    tx_remarks: "",
    status: "REJECTED",
    actions: { delete: true, edit: false }
  },
  {
    id: 38,
    vehicle_number: "BR01PB5678",
    vehicle_model: "Bolero",
    driver_name: "Manoj Kumar",
    phone: "9876543210",
    rc_number: "BR01201890198765",
    tx_remarks: "",
    status: "APPROVED",
    actions: { delete: true, edit: false }
  },
  {
    id: 39,
    vehicle_number: "BR01PC9999",
    vehicle_model: "Indigo",
    driver_name: "Suraj Kumar",
    phone: "9812345678",
    rc_number: "BR01201910111213",
    tx_remarks: "",
    status: "PENDING",
    actions: { delete: true, edit: false }
  },
  {
    id: 40,
    vehicle_number: "BR01PA4321",
    vehicle_model: "Eeco",
    driver_name: "Rahul Kumar",
    phone: "9123123123",
    rc_number: "BR01201560234567",
    tx_remarks: "",
    status: "BANNED",
    actions: { delete: true, edit: false }
  },
  {
    id: 41,
    vehicle_number: "BR01PL3488",
    vehicle_model: "SwiftDzire",
    driver_name: "Sunil kumar",
    phone: "9771309695",
    rc_number: "BR01200823275587",
    tx_remarks: "",
    status: "BANNED",
    actions: { delete: false, edit: true }
  },
  {
    id: 42,
    vehicle_number: "BR01PC1235",
    vehicle_model: "Tata Ace",
    driver_name: "Pintu Kumar",
    phone: "7033911340",
    rc_number: "BR01202050284867",
    tx_remarks: "",
    status: "PENDING",
    actions: { delete: true, edit: false }
  },
  {
    id: 43,
    vehicle_number: "BR01PB6737",
    vehicle_model: "WagonR",
    driver_name: "Ravi Kumar",
    phone: "9709106222",
    rc_number: "BR01201380146675",
    tx_remarks: "",
    status: "BANNED",
    actions: { delete: true, edit: false }
  },
  {
    id: 44,
    vehicle_number: "BR01PC6504",
    vehicle_model: "Swift Dzire",
    driver_name: "Amit Kumar",
    phone: "9507686975",
    rc_number: "BR01201460151581",
    tx_remarks: "",
    status: "APPROVED",
    actions: { delete: true, edit: false }
  },
  {
    id: 45,
    vehicle_number: "BR01PC1234",
    vehicle_model: "Tata Magic",
    driver_name: "Abhishek Raj",
    phone: "9123456789",
    rc_number: "BR01201780123456",
    tx_remarks: "",
    status: "REJECTED",
    actions: { delete: true, edit: false }
  },
  {
    id: 46,
    vehicle_number: "BR01PB5678",
    vehicle_model: "Bolero",
    driver_name: "Manoj Kumar",
    phone: "9876543210",
    rc_number: "BR01201890198765",
    tx_remarks: "",
    status: "APPROVED",
    actions: { delete: true, edit: false }
  },
  {
    id: 47,
    vehicle_number: "BR01PC9999",
    vehicle_model: "Indigo",
    driver_name: "Suraj Kumar",
    phone: "9812345678",
    rc_number: "BR01201910111213",
    tx_remarks: "",
    status: "PENDING",
    actions: { delete: true, edit: false }
  },
  {
    id: 48,
    vehicle_number: "BR01PA4321",
    vehicle_model: "Eeco",
    driver_name: "Rahul Kumar",
    phone: "9123123123",
    rc_number: "BR01201560234567",
    tx_remarks: "",
    status: "BANNED",
    actions: { delete: true, edit: false }
  },
  {
    id: 49,
    vehicle_number: "BR01PL3488",
    vehicle_model: "SwiftDzire",
    driver_name: "Sunil kumar",
    phone: "9771309695",
    rc_number: "BR01200823275587",
    tx_remarks: "",
    status: "BANNED",
    actions: { delete: false, edit: true }
  },
  {
    id: 50,
    vehicle_number: "BR01PC1235",
    vehicle_model: "Tata Ace",
    driver_name: "Pintu Kumar",
    phone: "7033911340",
    rc_number: "BR01202050284867",
    tx_remarks: "",
    status: "PENDING",
    actions: { delete: true, edit: false }
  },
  {
    id: 51,
    vehicle_number: "BR01PB6737",
    vehicle_model: "WagonR",
    driver_name: "Ravi Kumar",
    phone: "9709106222",
    rc_number: "BR01201380146675",
    tx_remarks: "",
    status: "BANNED",
    actions: { delete: true, edit: false }
  },
  {
    id: 52,
    vehicle_number: "BR01PC6504",
    vehicle_model: "Swift Dzire",
    driver_name: "Amit Kumar",
    phone: "9507686975",
    rc_number: "BR01201460151581",
    tx_remarks: "",
    status: "APPROVED",
    actions: { delete: true, edit: false }
  },
  {
    id: 53,
    vehicle_number: "BR01PC1234",
    vehicle_model: "Tata Magic",
    driver_name: "Abhishek Raj",
    phone: "9123456789",
    rc_number: "BR01201780123456",
    tx_remarks: "",
    status: "REJECTED",
    actions: { delete: true, edit: false }
  },
  {
    id: 54,
    vehicle_number: "BR01PB5678",
    vehicle_model: "Bolero",
    driver_name: "Manoj Kumar",
    phone: "9876543210",
    rc_number: "BR01201890198765",
    tx_remarks: "",
    status: "APPROVED",
    actions: { delete: true, edit: false }
  },
  {
    id: 55,
    vehicle_number: "BR01PC9999",
    vehicle_model: "Indigo",
    driver_name: "Suraj Kumar",
    phone: "9812345678",
    rc_number: "BR01201910111213",
    tx_remarks: "",
    status: "PENDING",
    actions: { delete: true, edit: false }
  },
  {
    id: 56,
    vehicle_number: "BR01PA4321",
    vehicle_model: "Eeco",
    driver_name: "Rahul Kumar",
    phone: "9123123123",
    rc_number: "BR01201560234567",
    tx_remarks: "",
    status: "BANNED",
    actions: { delete: true, edit: false }
  }
];

const statusBadge = (status) => {
  const baseClasses = 'px-3 py-1 text-xs font-medium rounded-full';
  switch (status) {
    case 'APPROVED':
      return <span className={`${baseClasses} bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300`}>{status}</span>;
    case 'PENDING':
      return <span className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`}>{status}</span>;
    case 'REJECTED':
      return <span className={`${baseClasses} bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300`}>{status}</span>;
    case 'BANNED':
      return <span className={`${baseClasses} bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-300`}>{status}</span>;
    default:
      return <span className={`${baseClasses} bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300`}>{status}</span>;
  }
};

const ExtraRideCollection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalPages = Math.ceil(extraCollection.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = extraCollection.slice(startIndex, startIndex + rowsPerPage);

  const thead = (
    <tr className="bg-gray-100 dark:bg-gray-800 text-left text-sm text-gray-700 dark:text-gray-300">
      <th className="px-4 py-3 font-semibold">ID</th>
      <th className="px-4 py-3 font-semibold">Uqid</th>
      <th className="px-4 py-3 font-semibold">Admin Name</th>
      <th className="px-4 py-3 font-semibold">Admin Id</th>
      <th className="px-4 py-3 font-semibold">Amount</th>
      <th className="px-4 py-3 font-semibold">Tx Type</th>
      <th className="px-4 py-3 font-semibold">Tx Remarks</th>
      <th className="px-4 py-3 font-semibold">Status</th>
      <th className="px-4 py-3 font-semibold">Actions</th>
    </tr>
  );

  const tbody = currentData.map((item) => (
    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-800 dark:text-gray-200 border-b dark:border-gray-700">
      <td className="px-4 py-2">{item.id}</td>
      <td className="px-4 py-2">{item.vehicle_number}</td>
      <td className="px-4 py-2">{item.vehicle_model}</td>
      <td className="px-4 py-2">{item.driver_name}</td>
      <td className="px-4 py-2">{item.phone}</td>
      <td className="px-4 py-2">{item.rc_number}</td>
      <td className="px-4 py-2">{item.tx_remarks}</td>
      <td className="px-4 py-2">{statusBadge(item.status)}</td>
      <td className="px-4 py-2">
        <div className="flex gap-3 items-center">
          {item.actions.edit && (
            <button className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-sm">
              <Pencil className="w-4 h-4" />
              Edit
            </button>
          )}
          {item.actions.delete && (
            <button className="text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 text-sm">
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>
      </td>
    </tr>
  ));

  return (
    <div className='m-4'>
    <BasicTable
      title="Extra Ride Collections"
      actions={[
        {
          label: 'New',
          customColor: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white',
          onClick: () => alert('Hello Murari!')
        },
        {
          label: 'CSV',
          customColor: 'bg-gradient-to-r from-yellow-500 to-yellow-500 text-white',
          onClick: () => alert('CSV Nhi hoga download.')
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
    </div>
  );
};

export default ExtraRideCollection;