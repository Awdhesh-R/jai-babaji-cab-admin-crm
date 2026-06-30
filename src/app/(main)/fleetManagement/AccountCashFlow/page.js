"use client";

import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { TbWallet } from "react-icons/tb";
import { LuCircleCheckBig } from "react-icons/lu";
import { GoClock } from "react-icons/go";
import { FiShield } from "react-icons/fi";
import { GiCheckMark } from "react-icons/gi";
import { ImCheckboxChecked } from "react-icons/im";
import { CiFilter } from "react-icons/ci";
import { FiUpload } from "react-icons/fi";

const DATA = [
  {
    name: "Rajesh Kumar",
    ref: "REF-001",
    status: "Pending",
    amount: 2000,
    approved: false,
  },
  {
    name: "Priya Singh",
    ref: "REF-002",
    status: "Submitted by Company",
    amount: 3500,
    approved: true,
  },
  {
    name: "Amit Patel",
    ref: "REF-003",
    status: "Approved",
    amount: 1500,
    approved: true,
  },
  {
    name: "Neha Sharma",
    ref: "REF-004",
    status: "Pending",
    amount: 2800,
    approved: false,
  },
  {
    name: "Vikram Desai",
    ref: "REF-005",
    status: "Submitted by Company",
    amount: 4200,
    approved: true,
  },
  {
    name: "Rohit Mehta",
    ref: "REF-006",
    status: "Pending",
    amount: 3100,
    approved: false,
  },
  {
    name: "Sneha Reddy",
    ref: "REF-007",
    status: "Approved",
    amount: 2300,
    approved: true,
  },
  {
    name: "Ankit Verma",
    ref: "REF-008",
    status: "Submitted by Company",
    amount: 3900,
    approved: true,
  },
  {
    name: "Kiran Gupta",
    ref: "REF-009",
    status: "Pending",
    amount: 2700,
    approved: false,
  },
  {
    name: "Manish Tiwari",
    ref: "REF-010",
    status: "Approved",
    amount: 3500,
    approved: true,
  },
  {
    name: "Riya Nair",
    ref: "REF-011",
    status: "Pending",
    amount: 2100,
    approved: false,
  },
  {
    name: "Suresh Pillai",
    ref: "REF-012",
    status: "Submitted by Company",
    amount: 4500,
    approved: true,
  },
  {
    name: "Kavita Joshi",
    ref: "REF-013",
    status: "Approved",
    amount: 2900,
    approved: true,
  },
  {
    name: "Deepak Yadav",
    ref: "REF-014",
    status: "Pending",
    amount: 2600,
    approved: false,
  },
  {
    name: "Arjun Malhotra",
    ref: "REF-015",
    status: "Submitted by Company",
    amount: 4000,
    approved: true,
  },
  {
    name: "Pooja Bansal",
    ref: "REF-016",
    status: "Approved",
    amount: 3300,
    approved: true,
  },
  {
    name: "Harish Kumar",
    ref: "REF-017",
    status: "Pending",
    amount: 2400,
    approved: false,
  },
  {
    name: "Divya Menon",
    ref: "REF-018",
    status: "Submitted by Company",
    amount: 4600,
    approved: true,
  },
  {
    name: "Sameer Shah",
    ref: "REF-019",
    status: "Approved",
    amount: 3200,
    approved: true,
  },
  {
    name: "Aarti Jain",
    ref: "REF-020",
    status: "Pending",
    amount: 1800,
    approved: false,
  },
  {
    name: "Sanjay Rao",
    ref: "REF-021",
    status: "Submitted by Company",
    amount: 4100,
    approved: true,
  },
  {
    name: "Tina Kapoor",
    ref: "REF-022",
    status: "Approved",
    amount: 3500,
    approved: true,
  },
  {
    name: "Nikhil Ghosh",
    ref: "REF-023",
    status: "Pending",
    amount: 2500,
    approved: false,
  },
  {
    name: "Rachna Dey",
    ref: "REF-024",
    status: "Submitted by Company",
    amount: 3800,
    approved: true,
  },
  {
    name: "Vivek Sinha",
    ref: "REF-025",
    status: "Approved",
    amount: 2700,
    approved: true,
  },
  {
    name: "Meena Rao",
    ref: "REF-026",
    status: "Pending",
    amount: 2000,
    approved: false,
  },
  {
    name: "Arnav Kapoor",
    ref: "REF-027",
    status: "Submitted by Company",
    amount: 4300,
    approved: true,
  },
  {
    name: "Lakshmi Iyer",
    ref: "REF-028",
    status: "Approved",
    amount: 3000,
    approved: true,
  },
  {
    name: "Kunal Das",
    ref: "REF-029",
    status: "Pending",
    amount: 2200,
    approved: false,
  },
  {
    name: "Reena Thomas",
    ref: "REF-030",
    status: "Submitted by Company",
    amount: 4400,
    approved: true,
  },
];

const getStatusBadge = (status) => {
  if (status === "Pending") {
    return (
      <span className="bg-[#FEF3C6] text-[#BB4D00] px-3 py-1 rounded-full text-xs font-semibold ">
        Pending
      </span>
    );
  }
  if (status === "Submitted by Company") {
    return (
      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
        Submitted by Company{" "}
        <span>
          <GiCheckMark />
        </span>
      </span>
    );
  }
  if (status === "Approved") {
    return (
      // <span className=" bg-[#DCFCE7] text-[#008236] px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center  gap-1">
      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
        Approved{" "}
        <span>
          <GiCheckMark />
        </span>
      </span>
    );
  }

  return null;
};

const getApproval = (approved) =>
  approved ? (
    <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-semibold border border-green-100 flex gap-1 items-center">
      Approved by CEO <span>🟢</span>
    </span>
  ) : null;

function StatBox({ label, value, color, border, icon }) {
  return (
    <div
      className={`${color} ${border} border rounded-xl shadow-md p-4 flex items-center justify-between`}
    >
      <div>
        <p className="text-xs text-gray-600 font-semibold">{label}</p>
        <h3 className="text-lg font-bold text-gray-900 mt-1">{value}</h3>
      </div>
      <div className="p-3 rounded-md bg-blue/70">{icon}</div>
    </div>
  );
}

const PaymentTable = () => {
  const [allRows, setAllRows] = useState(DATA);
  const [rows, setRows] = useState(DATA);
  const [selected, setSelected] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  
  const [stats, setStats] = useState({
    dues: DATA.reduce((sum, r) => sum + r.amount, 0),
    submitted: DATA.filter((r) => r.status !== "Pending").reduce(
      (sum, r) => sum + r.amount,
      0
    ),
    pending: DATA.filter((r) => r.status === "Pending").length,
    approvedByCEO: DATA.filter((r) => r.approved).length,
  });

  // Filter whenever search or rows change
  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      setRows(allRows);
    } else {
      setRows(
        allRows.filter(
          (emp) =>
            emp.name.toLowerCase().includes(q) ||
            emp.ref.toLowerCase().includes(q)
        )
      );
    }
    setSelected([]); // Reset selection when filtering/searching
  }, [search, allRows]);

  const handleSearchChange = (e) => setSearch(e.target.value);

  const handleSelect = (ref) => {
    setSelected((prev) =>
      prev.includes(ref) ? prev.filter((r) => r !== ref) : [...prev, ref]
    );
  };

  const totalSelectedDues = rows
    .filter((item) => selected.includes(item.ref))
    .reduce((sum, item) => sum + item.amount, 0);

  const handleSendPayment = () => {
    setModalOpen(true);
  };

  // Loader added to file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setReceipt(null);
    // Simulating upload
    setTimeout(() => {
      setUploading(false);
      setReceipt(file);
    }, 2000);
  };

  

  const handleModalConfirm = () => {
    const updatedRows = allRows.map((row) =>
      selected.includes(row.ref)
        ? { ...row, status: "Approved", approved: true }
        : row
    );

    const totalSelected = allRows
      .filter((row) => selected.includes(row.ref))
      .reduce((sum, r) => sum + r.amount, 0);

    setStats({
      dues: stats.dues - totalSelected,
      submitted: stats.submitted + totalSelected,
      pending: updatedRows.filter((r) => r.status === "Pending").length,
      approvedByCEO: updatedRows.filter((r) => r.approved).length,
    });

    setAllRows(updatedRows);
    setModalOpen(false);
    setReceipt(null);
    setSelected([]);
    setSearch(""); // Show updated list
  };

  return (
    // <div className="bg-white rounded-xl shadow border border-gray-100 p-6 mt-6">
    <div className="bg-white rounded-xl shadow border border-gray-100 p-3 sm:p-6 mt-4 sm:mt-6">
         <div className="mb-2">
<h1 className="text-2xl font-bold text-[#22223b]">Account Cash Flow </h1>
<p className="text-sm text-gray-500">Manage employee payments and approvals</p>
</div>
      {/* Stats Row */}
      {/* <div className="w-full p-4"> */}
      <div className="w-full p-2 sm:p-4">
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <StatBox
            label="Total Dues"
            value={`₹${stats.dues.toLocaleString()}`}
            color="bg-gradient-to-tr from-[#EFF6FF] to-[#DBEAFE]"
            border="border-blue-200"
            icon={<TbWallet size={34} className="text-[#b6c4db]" />} // Very light blue/gray, exact match to image
          />
          <StatBox
            label="Total Submitted"
            value={`₹${stats.submitted.toLocaleString()}`}
            color="bg-gradient-to-tr from-[#F0FDF4] to-[#DCFCE7]"
            border="border-green-200"
            icon={<LuCircleCheckBig size={34} className="text-[#90A1B9]" />}
          />
          <StatBox
            label="Pending Payments"
            value={stats.pending}
            color="bg-gradient-to-tr from-[#FFFBEB] to-[#FEF3C6]"
            border="border-yellow-200"
            icon={
              <GoClock size={34} className="text-[#b6c4db] justify-start" />
            }
          />
        </div>
      </div>

      {/* Search + Table */}
      <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center mb-2 sm:mb-3 gap-2">
        <div className="relative w-full flex-1">
          <FiSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by Employee Name or Reference ID..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm shadow"
            value={search}
            onChange={handleSearchChange}
          />
           <button
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
    // onClick={handleFilterOpen}
  >
    <CiFilter size={20} /> 
  </button>
        </div>
      </div>
      <div>
        <h2 className="text-base sm:text-[16px] font-semibold text-gray-800 py-3 sm:py-5 px-1 sm:px-3">
          Payment Records
        </h2>
      </div>
      {/* <div className="bg-white rounded-xl shadow border border-gray-100 p-6 ">
       
        <table className="w-full text-sm"> */}
      <div className="max-w-full bg-white md:p-0 p-2 shadow-md rounded-lg">
        <table className="min-w-full border-collapse block md:table">
          <thead className="hidden md:table-header-group">
            <tr className="text-left text-gray-600 font-semibold border-b border-gray-300 block md:table-row">
              <th className="p-1 md:py-4 text-[14px] block md:table-cell">
                Name
              </th>
              <th className="p-3 font-semibold block md:table-cell">
                Reference ID
              </th>
              <th className="p-3 font-semibold block md:table-cell">Status</th>
              <th className="p-3 font-semibold block md:table-cell">Amount</th>
              {/* <th className="p-3 font-semibold block item md:table-cell">Select</th> */}
              <th className="p-3 font-semibold block md:table-cell text-center flex-1 justify-center">Select</th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group">
            {rows.map((row) => (
              <tr
                key={row.ref}
                className="border-b border-gray-200 block md:table-row w-full md:w-auto"
              >
                <td
                  className="block md:table-cell md:w-auto p-3 font-nunito text-[#15803D] font-semibold"
                  data-label="Name"
                >
                  <div className="flex justify-between md:block">
                    <span className="font-bold text-gray-500 md:hidden">
                      Name:
                    </span>
                    <span>{row.name}</span>
                  </div>
                </td>
                <td
                  className="block md:table-cell md:w-auto p-3 font-nunito text-gray-600"
                  data-label="Reference ID"
                >
                  <div className="flex justify-between md:block">
                    <span className="font-bold text-gray-500 md:hidden">
                      Reference ID:
                    </span>
                    <span>{row.ref}</span>
                  </div>
                </td>
                {/* <td className="block md:table-cell md:w-auto p-1 font-nunito" data-label="Status">
            <div className="flex justify-between md:block">
              <span className="font-bold text-gray-500 md:hidden">Status:</span>
              <span>{getStatusBadge(row.status)}</span>
            </div>
          </td> */}
                <td
                  className="block md:table-cell md:w-auto p-1 font-nunito"
                  data-label="Status"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between md:block">
                    <span className="font-bold text-gray-500 md:hidden">
                      Status:
                    </span>
                    {/* Always wrap badge in own block, margin top for mobile */}
                    <span className="mt-1 md:mt-0 w-full md:inline-block">
                      {getStatusBadge(row.status)}
                    </span>
                  </div>
                </td>
                <td
                  className="block md:table-cell md:w-auto p-3 font-nunito font-semibold text-gray-900"
                  data-label="Amount"
                >
                  <div className="flex justify-between md:block">
                    <span className="font-bold text-gray-500 md:hidden">
                      Amount:
                    </span>
                    <span>₹{row.amount.toLocaleString()}</span>
                  </div>
                </td>
                {/* <td className="block md:table-cell md:w-auto p-1 font-nunito" data-label="Select">
            <div className="flex justify-between md:block">
              <span className="font-bold text-gray-500 md:hidden">Select:</span>
              <span>
                <div className="flex items-center justify-center min-h-[44px]">
                  {!row.approved ? (
                    <input
                      type="checkbox"
                      checked={selected.includes(row.ref)}
                      onChange={() => handleSelect(row.ref)}
                      className="accent-blue-500 w-5 h-5"
                    />
                  ) : (
                    <span className="bg-[#D0FAE5] text-[#007A55] flex items-center gap-1 px-4 py-1 rounded-full text-[12px] font-semibold">
                      Approved by CEO
                      <span className="text-lg text-green-500"><ImCheckboxChecked /></span>
                    </span>
                  )}
                </div>
              </span>
            </div>
          </td> */}
                <td
                  className="block md:table-cell md:w-auto p-1 font-nunito"
                  data-label="Select"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between md:block">
                    <span className="font-bold text-gray-500 md:hidden">
                      Select:
                    </span>
                    <span className="mt-1 md:mt-0 w-full md:inline-block">
                      <div className="flex items-center justify-center min-h-[32px]">
                        {!row.approved ? (
                          <input
                            type="checkbox"
                            checked={selected.includes(row.ref)}
                            onChange={() => handleSelect(row.ref)}
                            className="accent-blue-500 w-5 h-5"
                          />
                        ) : (
                          <span className="bg-[#D0FAE5] text-[#007A55] flex items-center gap-1 px-4 py-1 rounded-full text-[12px] font-semibold">
                            Approved by CEO
                            <span className="text-lg text-green-500">
                              <ImCheckboxChecked />
                            </span>
                          </span>
                        )}
                      </div>
                    </span>
                  </div>
                </td>
             

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* <div className="flex justify-between items-center py-3 mt-2"> */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center py-2 sm:py-3 mt-2 gap-2 sm:gap-0">
        <div>
          <span className="text-xs text-gray-500 font-medium">
            Total Dues Remaining
          </span>
          <p className="text-lg font-bold text-gray-900">
            ₹{totalSelectedDues.toLocaleString()}
          </p>
        </div>
        <button
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow font-medium text-sm disabled:bg-blue-300"
          disabled={selected.length === 0}
          onClick={handleSendPayment}
        >
          Send Payment ({selected.length})
        </button>
      </div>

     
      {/* {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-[20px] shadow-xl px-6 pt-8 pb-6 w-full max-w-md relative">
            <button
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 text-xl"
              onClick={() => {
                setModalOpen(false);
                setReceipt(null);
                setUploading(false);
              }}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-center text-xl font-semibold mb-5 text-[#21346B]">
              Upload Payment Receipt
            </h3>
            <label htmlFor="file-upload-receipt">
              <div className="border-2 border-dashed border-blue-200 rounded-xl flex flex-col items-center justify-center py-8 cursor-pointer mb-4 hover:border-blue-400 transition-all">
               

                <>
                
                  <FiUpload  size={30} />
                  <span className="text-gray-600 mb-1 text-sm">
                    Click to upload receipt
                  </span>
                  <span className="text-xs text-gray-400">
                    PDF, PNG, or JPG
                  </span>
                  {receipt && (
                    <div className="text-green-600 text-xs mt-2">
                      {receipt.name}
                    </div>
                  )}
                </>

                <input
                  id="file-upload-receipt"
                  type="file"
                  accept=".pdf,image/png,image/jpeg"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </div>
            </label>
            <div className="flex justify-between gap-2 mt-2">
              <button
                className="w-1/2 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
                onClick={() => {
                  setModalOpen(false);
                  setReceipt(null);
                  setUploading(false);
                }}
              >
                Cancel
              </button>
              <button
                className="w-1/2 py-2 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition disabled:bg-blue-300"
                disabled={!receipt || uploading}
                onClick={handleModalConfirm}
              >
                Submit Payment
              </button>
            </div>
          </div>
        </div>
      )} */}

      {modalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 px-2">
    <div className="bg-white rounded-[20px] shadow-xl px-3 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-6 w-[95vw] sm:w-full max-w-md relative">
      <button
        className="absolute right-3 sm:right-4 top-3 sm:top-4 text-gray-400 hover:text-gray-600 text-xl"
        onClick={() => {
          setModalOpen(false);
          setReceipt(null);
          setUploading(false);
        }}
        aria-label="Close"
      >
        &times;
      </button>
      <h3 className="text-center text-xl font-semibold mb-3 sm:mb-5 text-[#21346B]">
        Upload Payment Receipt
      </h3>
      <label htmlFor="file-upload-receipt">
        <div className="border-2 border-dashed border-blue-200 rounded-xl flex flex-col items-center justify-center py-5 sm:py-8 cursor-pointer mb-2 sm:mb-4 hover:border-blue-400 transition-all">
          {/* Loader/Spinner */}
          <>
            <FiUpload size={30} />
            <span className="text-gray-600 mb-1 text-sm">
              Click to upload receipt
            </span>
            <span className="text-xs text-gray-400">
              PDF, PNG, or JPG
            </span>
            {receipt && (
              <div className="text-green-600 text-xs mt-2">
                {receipt.name}
              </div>
            )}
          </>
          <input
            id="file-upload-receipt"
            type="file"
            accept=".pdf,image/png,image/jpeg"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </div>
      </label>
      <div className="flex flex-col sm:flex-row justify-between gap-2 mt-2">
        <button
          className="w-full sm:w-1/2 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
          onClick={() => {
            setModalOpen(false);
            setReceipt(null);
            setUploading(false);
          }}
        >
          Cancel
        </button>
        <button
          className="w-full sm:w-1/2 py-2 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition disabled:bg-blue-300"
          disabled={!receipt || uploading}
          onClick={handleModalConfirm}
        >
          Submit Payment
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default PaymentTable;
