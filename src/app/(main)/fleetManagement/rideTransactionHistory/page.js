

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { TbWallet } from "react-icons/tb";
import { LuCircleCheckBig } from "react-icons/lu";
import { GoClock } from "react-icons/go";
import { GiCheckMark } from "react-icons/gi";
import { ImCheckboxChecked } from "react-icons/im";
import { CiFilter } from "react-icons/ci";
import { FiUpload } from "react-icons/fi";
import { apiClient } from "@/app/lib/apiClient";
import moment from "moment";





const AddAmountInDriverWallet = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [drivers, setDrivers] = useState([]);
  // const [formData, setFormData] = useState({
  //   driver_id: "",
  //   driver_name: "",
  //   driver_mobile: "",
  //   cab_number: "",
  //   cab_name: "",
  //   cab_type: "",
  //   amount: "",
  //   payment_recived_mode: "wallet",
  //   payment_bank: "",
  //   payment_remark: "",
  //   wallet_user_name: "",
  //   purpose: "",
  // });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // formData me naye field add karen
const [formData, setFormData] = useState({
  driver_id: "",
  driver_name: "",
  driver_mobile: "",
  cab_number: "",
  cab_name: "",
  cab_type: "",
  amount: "",
  payment_recived_mode: "wallet", 
  payment_bank: "",
  payment_remark: "",
  wallet_user_name: "",
  purpose: "",
});


  // Load all drivers for dropdown
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await apiClient("GET", "/rb_drivers/getAllDriver");
        if (res?.success || res?.status) setDrivers(res?.data || []);
      } catch (err) {
        // console.error("Error fetching drivers:", err);
      }
    };
    fetchDrivers();
  }, []);

  // Live search handler
  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    resetFormDataExceptAmount();

    if (term.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await apiClient(
        "GET",
        `/rb_cabs/search/driver/withCab?searchTerm=${term}`
      );
      if (res?.success && res?.data?.rows?.length > 0) {
        const results = res.data.rows.filter((d) =>
          d.driver.driverName.toLowerCase().includes(term.toLowerCase())
        );
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults([]);
    }
  };

  // On selecting driver from search
  const handleSelectSearch = (item) => {
    setFormData({
      driver_id: item.driver.id,
      driver_name: item.driver.driverName,
      driver_mobile: item.driver.driverMobile,
      cab_number: item.cab_reg,
      cab_name: item.cab_name,
      cab_type: item.cab_name,
      amount: "",
      payment_recived_mode: "wallet",
      payment_bank: "",
      payment_remark: "",
      wallet_user_name: item.driver.driverName,
      purpose: "",
    });
    setSearchTerm(item.driver.driverName);
    setSearchResults([]);
  };

  // Dropdown change handler with type-safe id match
  const handleDropdownChange = (e) => {
    const driverId = e.target.value;
    setSearchTerm("");
    setSearchResults([]);

    if (!driverId) {
      resetFormDataExceptAmount(true);
      return;
    }

    const driver = drivers.find((d) => String(d.id) === driverId);
    if (driver) {
      setFormData((prev) => ({
        ...prev,
        driver_id: driver.id,
        driver_name: driver.driverName,
        driver_mobile: driver.driverMobile,
        cab_number: driver.cabDetails?.cab_reg || "",
        cab_name: driver.cabDetails?.cab_name || "",
        cab_type: driver.cabDetails?.cab_name || "",
        wallet_user_name: driver.driverName,
      }));
    }
  };

  // Reset form except amount (option to reset amount too)
  const resetFormDataExceptAmount = (resetAmount = false) => {
    setFormData((prev) => ({
      driver_id: "",
      driver_name: "",
      driver_mobile: "",
      cab_number: "",
      cab_name: "",
      cab_type: "",
      amount: resetAmount ? "" : prev.amount,
      payment_recived_mode: "wallet",
      payment_bank: "",
      payment_remark: "",
      wallet_user_name: "",
      purpose: "",
    }));
  };

  // Input change handler
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};


  // Form submission handler
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage(null);

//     try {
//       const res = await apiClient(
//         "POST",
//         "/rb_drivers/add-amount-in-driver-wallet/",
//         {
//           driver_id: Number(formData.driver_id),
//           amount: Number(formData.amount),
//           cab_number: formData.cab_number,
//           payment_recived_mode: formData.payment_recived_mode,
//           payment_bank: formData.payment_bank,
//           payment_remark: formData.payment_remark,
//           wallet_user_name: formData.wallet_user_name,
//           purpose: formData.purpose,
//         }
//       );

      
// //           const res = await apiClient(
// //   "POST",
// //   "/rb_drivers/add-amount-in-driver-wallet/",
// //   {
// //     driver_id: Number(formData.driver_id),
// //     amount: Number(formData.amount),
// //     cab_number: formData.cab_number,
// //     payment_recived_mode: formData.payment_recived_mode, // existing payment mode
// //     payment_received_mode: formData.payment_received_mode, // new dropdown value
// //     payment_bank: formData.payment_bank,
// //     payment_remark: formData.payment_remark,
// //     wallet_user_name: formData.wallet_user_name,
// //     purpose: formData.purpose,
// //   }
// // );

//       // Console for debugging
//       console.log("API Response:", res);

//       if (res?.success || res?.status) {
//         setMessage({ type: "success", text: "Amount added successfully ✅" });
//         resetFormDataExceptAmount(true);
//         setSearchTerm("");
//       } else {
//         throw new Error(res?.message || "Failed to add amount");
//       }
//     } catch (err) {
//       setMessage({
//         type: "error",
//         text: err.message || "Something went wrong",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };



const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage(null);

  try {
    // Prepare conditional payload based on mode
    const payload = {
      driver_id: Number(formData.driver_id),
      amount: Number(formData.amount),
      cab_number: formData.cab_number,
      payment_recived_mode: formData.payment_recived_mode,
      payment_remark: formData.payment_remark,
      purpose: formData.purpose,
      received_mode: formData.received_mode
    };

    // If mode is wallet, add wallet_user_name
    if (formData.payment_recived_mode === "wallet") {
      payload.wallet_user_name = formData.wallet_user_name;
    }
    // If mode is bank, add payment_bank
    if (formData.payment_recived_mode === "bank") {
      payload.payment_bank = formData.payment_bank;
    }

    // If you have a new dropdown for payment_received_mode, add it
    if (formData.payment_received_mode) {
      payload.payment_received_mode = formData.payment_received_mode;
    }

    const res = await apiClient(
      "POST",
      "/rb_drivers/add-amount-in-driver-wallet/",
      payload
    );

    console.log("API Response:", res);

    if (res?.success || res?.status) {
      setMessage({ type: "success", text: "Amount added successfully ✅" });
      resetFormDataExceptAmount(true);
      setSearchTerm("");
    } else {
      throw new Error(res?.message || "Failed to add amount");
    }
  } catch (err) {
    setMessage({
      type: "error",
      text: err.message || "Something went wrong",
    });
  } finally {
    setLoading(false);
  }
};


  return (
    // <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-4 py-6">
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-4 py-6"
      onClick={onClose}
    >
      {/* <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg max-h-[85vh] overflow-y-auto"> */}

      <div
        className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // inner click ko stop karna
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Add Amount in Driver Wallet
        </h2>

        {/* Driver Select Dropdown */}
        <div className="mb-5">
          <label className="block text-sm font-medium mb-2">
            Select Driver
          </label>
          <select
            value={formData.driver_id ? String(formData.driver_id) : ""}
            onChange={handleDropdownChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Driver --</option>
            {drivers.map((d) => (
              <option key={d.id} value={String(d.id)}>
                {d.driverName} ({d.driverMobile})
              </option>
            ))}
          </select>
        </div>



        {/* Live Search Input */}
        {!formData.driver_id && (
          <div className="relative mb-5">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search driver by name or mobile..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchResults.length > 0 && (
              <ul className="absolute z-50 bg-white border border-gray-300 rounded-md w-full mt-1 max-h-44 overflow-y-auto text-sm shadow-md">
                {searchResults.map((item) => (
                  <li
                    key={item.driver.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectSearch(item)}
                  >
                    {item.driver.driverName} ({item.driver.driverMobile}) -{" "}
                    {item.cab_reg}
                  </li>
                ))}
              </ul>
            )}
            {searchTerm.length > 1 && searchResults.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">No drivers found...</p>
            )}
          </div>
        )}

        {/* Driver & Cab Details */}

        {formData.driver_name && (
          <div className="mb-5 p-4  bg-gradient-to-tr from-[#EFF6FF] to-[#DBEAFE] border border-gray-300 rounded-xl shadow-sm text-sm">
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              <div>
                <p className="text-gray-500 font-medium text-xs">Driver Name</p>
                <p className="font-semibold text-gray-800">
                  {formData.driver_name}
                </p>
              </div>
              <div>
                <p className="text-gray-500 font-medium text-xs">Mobile</p>
                <p className="font-semibold text-gray-800">
                  {formData.driver_mobile}
                </p>
              </div>
              <div>
                <p className="text-gray-500 font-medium text-xs">Cab Number</p>
                <p className="font-semibold text-gray-800">
                  {formData.cab_number}
                </p>
              </div>
              <div>
                <p className="text-gray-500 font-medium text-xs">Cab Type</p>
                <p className="font-semibold text-gray-800">
                  {formData.cab_type}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* <div className="mb-5">
          <label className="block text-sm font-medium mb-2">
            Received Mode
          </label>
          <select
            name="received_mode"
            value={formData.received_mode}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="wallet">Wallet</option>
            <option value="driver">Driver</option>
            <option value="paid_to_merchant">Paid To Merchant</option>
          </select>
        </div> */}

        {/* Amount Input */}
        <div className="mb-5">
          <label className="block text-sm font-medium mb-2">Amount</label>
          <input
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            required
          />
        </div>

        {/* Payment Mode */}
        <div className="mb-5">
          <label className="block text-sm font-medium mb-2">Payment Mode</label>
          <select
            name="payment_recived_mode"
            value={formData.payment_recived_mode}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="wallet">Wallet</option>
            <option value="cash">Cash</option>
            <option value="bank">Bank</option>
          </select>
        </div>

        {/* Wallet User (only for wallet mode) */}
        {formData.payment_recived_mode === "wallet" && (
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2">
              Wallet User Name
            </label>
            <select
              name="wallet_user_name"
              value={formData.wallet_user_name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Wallet</option>
              <option value="Anu Mishra">Anu Mishra</option>
              <option value="Suraj">Suraj</option>
              <option value="Anshuman">Anshuman</option>
              <option value="4247 RodBez">4247 RodBez</option>
            </select>
          </div>
        )}

        {/* Account Type (only for account mode) */}
        {/* {formData.payment_recived_mode === "account" && (
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2">
              Account Type
            </label>
            <select
              name="wallet_user_name"
              value={formData.payment_bank}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Bank</option>
              <option value="SBI">SBI</option>
              <option value="ICICI">ICICI</option>
              <option value="HDFC">HDFC</option>
            </select>
          </div>
        )} */}

        {/* {formData.payment_recived_mode === "bank" && (
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2">
              Account Type
            </label>
            <select
              name="bank" // yahan correct name
              value={formData.payment_bank} // initial empty, tile update hoga
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Bank</option>
              <option value="SBI">SBI</option>
              <option value="ICICI">ICICI</option>
              <option value="HDFC">HDFC</option>
            </select>
          </div>
        )} */}


        {formData.payment_recived_mode === "bank" && (
  <div className="mb-5">
    <label className="block text-sm font-medium mb-2">
      Account Type
    </label>
    <select
      name="payment_bank"              
      value={formData.payment_bank}    
      onChange={handleChange}
      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    >
      <option value="">Select Bank</option>
      <option value="SBI">SBI</option>
      <option value="ICICI">ICICI</option>
      <option value="HDFC">HDFC</option>
    </select>
  </div>
)}


        {/* Purpose */}
        {/* <div className="mb-5">
          <label className="block text-sm font-medium mb-2">Purpose</label>
          <select
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Purpose</option>
            <option value="fuel">Fuel</option>
            <option value="advance">Advance</option>
            <option value="other">Other</option>
          </select>
        </div>

       
        <div className="mb-5">
          <label className="block text-sm font-medium mb-2">
            Payment Remark
          </label>
          <textarea
            name="payment_remark"
            value={formData.payment_remark}
            onChange={handleChange}
            rows={3}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div> */}

        <div className="mb-5">
          <label className="block text-sm font-medium mb-2">Purpose</label>
          <select
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Purpose</option>
            <option value="fuel">Fuel</option>
            <option value="advance">Advance</option>
            <option value="other">Other</option>
          </select>
        </div>

        {formData.purpose === "other" && (
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2">
              Payment Remark
            </label>
            <textarea
              name="payment_remark"
              value={formData.payment_remark}
              onChange={handleChange}
              rows={3}
              required={formData.purpose === "other"}
              className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Message */}
        {message && (
          <p
            className={`text-sm ${
              message.type === "error" ? "text-red-600" : "text-green-600"
            } mb-4`}
          >
            {message.text}
          </p>
        )}

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60 transition"
          >
            {loading ? "Adding..." : "Add Amount"}
          </button>
        </div>
      </div>
    </div>
  );
};










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
  const [showAddAmountPopup, setShowAddAmountPopup] = useState(false);
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Search/filter params
  const [search, setSearch] = useState("");
  const [driverId, setDriverId] = useState("");
  const [mobile, setMobile] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [paymentReceivedMode, setPaymentReceivedMode] = useState("");
  const [activeTab, setActiveTab] = useState("credit");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Data & pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  // Stats data
  const [stats, setStats] = useState({
    dues: 0,
    submitted: 0,
    pending: 0,
    approvedByCEO: 0,
  });

  // Driver autocomplete suggestions
  const [drivers, setDrivers] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await apiClient("GET", "/rb_drivers/getAllDriver");
        if (res?.success) setDrivers(res.data || []);
        else setDrivers([]);
      } catch {
        setDrivers([]);
      }
    };
    fetchDrivers();
  }, []);

  // Fetch wallet history with filters and pagination
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let url = "";
      if (activeTab === "credit") {
        url = `/rb_drivers/getDriverWalletHistory?page=${currentPage}&pageSize=${pageSize}`;
      } else if (activeTab === "debit") {
        url = `/rb_drivers/get-driver-fuel-wallet-transection-history?page=${currentPage}&pageSize=${pageSize}`;
      }

      //   if (driverId) url += `&driver_id=${encodeURIComponent(driverId)}`;
      //   else if (search) url += `&search=${encodeURIComponent(search)}`;

      if (driverId) url += `&driver_id=${encodeURIComponent(driverId)}`;
      else if (search) url += `&driver_id=${encodeURIComponent(search)}`;
      else if (mobile) url += `&driverMobile=${encodeURIComponent(mobile)}`;

      if (dateStart) url += `&from=${encodeURIComponent(dateStart)}`;
      if (dateEnd) url += `&to=${encodeURIComponent(dateEnd)}`;

      if (paymentReceivedMode)
        url += `&payment_recived_mode=${encodeURIComponent(
          paymentReceivedMode
        )}`;

      if (sortBy) url += `&sortBy=${encodeURIComponent(sortBy)}`;
      if (sortOrder) url += `&sortOrder=${encodeURIComponent(sortOrder)}`;

      const res = await apiClient("GET", url);

      if (res.success && res.data?.rows) {
        const mappedRows = res.data.rows.map((item) => ({
          ref: item.transection_id ?? item.transectionid,
          driverId: item.driver_id ?? item.driver?.id ?? "",
          name: item.driver?.driverName ?? "N/A",
          status:
            activeTab === "debit" && item.transection_type === "debit"
              ? "Pending"
              : "Approved",
          amount: Number(item.amount),
          approved: item.approved_by ?? item.approvedby,
          cab_no: (item.cab_no ?? item.cabno) || "",
          createdAt: item.createdAt,
          driverMobile: item.driver?.driverMobile ?? "",
          date: item.updatedAt,
        }));

        if (currentPage === 1) setRows(mappedRows);
        else setRows((prev) => [...prev, ...mappedRows]);

        setTotalPages(res.data.pagination?.totalPages ?? 1);

        if (currentPage === 1) {
          setStats({
            dues: res.data.totals?.amount || 0,
            submitted: mappedRows
              .filter((r) => r.status !== "Pending")
              .reduce((sum, r) => sum + r.amount, 0),
            pending: mappedRows.filter((r) => r.status === "Pending").length,
            approvedByCEO: mappedRows.filter((r) => r.approved).length,
          });
        }
      } else {
        if (currentPage === 1) {
          setRows([]);
          setStats({ dues: 0, submitted: 0, pending: 0, approvedByCEO: 0 });
          setTotalPages(1);
        }
      }
    } catch (err) {
      console.error("Failed to fetch wallet history:", err);
      if (currentPage === 1) {
        setRows([]);
        setStats({ dues: 0, submitted: 0, pending: 0, approvedByCEO: 0 });
        setTotalPages(1);
      }
    }
    setLoading(false);
  }, [
    activeTab,
    currentPage,
    pageSize,
    search,
    dateStart,
    dateEnd,
    driverId,
    mobile,
    paymentReceivedMode,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeTab,
    search,
    dateStart,
    dateEnd,
    driverId,
    mobile,
    paymentReceivedMode,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onScroll = () => {
    if (!containerRef.current || loading || currentPage >= totalPages) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollHeight - scrollTop <= clientHeight + 150) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setDriverId("");
    setShowSuggestions(true);
  };
  const handleSuggestionClick = (driver) => {
    setSearch(driver.driverName);
    setDriverId(driver.id.toString());
    setShowSuggestions(false);
    setCurrentPage(1);
  };

  const handleDateChange = (type, value) => {
    if (type === "start") setDateStart(value);
    else setDateEnd(value);
  };

  const handleSelect = (ref) => {
    setSelected((prev) =>
      prev.includes(ref) ? prev.filter((r) => r !== ref) : [...prev, ref]
    );
  };

  const totalSelectedDues = rows
    .filter((item) => selected.includes(item.ref))
    .reduce((sum, item) => sum + item.amount, 0);

  const handleSendPayment = () => setModalOpen(true);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setReceipt(null);
    setTimeout(() => {
      setUploading(false);
      setReceipt(file);
    }, 2000);
  };

  const handleModalConfirm = () => {
    const updatedRows = rows.map((row) =>
      selected.includes(row.ref)
        ? { ...row, status: "Approved", approved: true }
        : row
    );

    const totalSelected = rows
      .filter((row) => selected.includes(row.ref))
      .reduce((sum, r) => sum + r.amount, 0);

    setStats({
      dues: stats.dues - totalSelected,
      submitted: stats.submitted + totalSelected,
      pending: updatedRows.filter((r) => r.status === "Pending").length,
      approvedByCEO: updatedRows.filter((r) => r.approved).length,
    });

    setRows(updatedRows);
    setModalOpen(false);
    setReceipt(null);
    setUploading(false);
    setSelected([]);
    setSearch("");
  };

  useEffect(() => {
    // Clear search inputs and filters on tab change
    setSearch("");
    setDriverId("");
    setMobile("");
    setDateStart("");
    setDateEnd("");
    setPaymentReceivedMode("");

    // Reset pagination to page 1
    setCurrentPage(1);
    // Clear existing rows to avoid flashing old data
    setRows([]);
  }, [activeTab]);

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 p-3 sm:p-6 mt-4 sm:mt-6">
      {/* Header and filters */}
      <div className="mb-2 flex  md:flex-row flex-col gap-5 justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#22223b]">
            Ride Transaction History
          </h1>
          <p className="text-sm text-gray-500">
            Manage employee payments and approvals
          </p>
        </div>
        <button
          onClick={() => setShowAddAmountPopup(true)}
          className="px-4 py-2  bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Amount in Wallet
        </button>
      </div>



       {/* Stats */}
      <div className="w-full p-2 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <StatBox
            label="Total Collection"
            // value={`₹${stats.dues.toLocaleString()}`}
            color="bg-gradient-to-tr from-[#EFF6FF] to-[#DBEAFE]"
            border="border-blue-200"
            icon={<TbWallet size={34} className="text-[#b6c4db]" />}
          />
          <StatBox
            label="Total Paid"
            // value={`₹${stats.submitted.toLocaleString()}`}
            color="bg-gradient-to-tr from-[#F0FDF4] to-[#DCFCE7]"
            border="border-green-200"
            icon={<LuCircleCheckBig size={34} className="text-[#90A1B9]" />}
          />
          <StatBox
            label="Dues"
            // value={stats.pending}
            color="bg-gradient-to-tr from-[#FFFBEB] to-[#FEF3C6]"
            border="border-yellow-200"
            icon={<GoClock size={34} className="text-[#b6c4db]" />}
          />
        </div>
      </div>


            <div className="flex items-center py-10 justify-between flex-col md:flex-row rounded-2xl p-4 gap-3">
        <button
          onClick={() => setActiveTab("credit")}
          className={`w-full px-4 py-2 rounded-md text-sm font-semibold ${
            activeTab === "credit"
              ? "bg-green-600 text-white"
              : "bg-white border border-gray-300 text-gray-700"
          }`}
        >
          Credit
        </button>
        <button
          onClick={() => setActiveTab("debit")}
          className={`w-full px-4 py-2 rounded-md text-sm font-semibold ${
            activeTab === "debit"
              ? "bg-red-600 text-white"
              : "bg-white border border-gray-300 text-gray-700"
          }`}
        >
          Debit
        </button>
      </div>


      {/* Search Input & date range */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 w-full">
        {/* Search input container: full width on mobile, max width on desktop */}
        <div className="relative w-full md:max-w-[900px]">
          <FiSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Search by Driver Name or Driver ID..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm shadow"
          />
          {showSuggestions && search && (
            <div className="absolute z-50 w-full max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-md mt-1 shadow">
              {drivers
                .filter((d) =>
                  d.driverName.toLowerCase().includes(search.toLowerCase())
                )
                .slice(0, 10)
                .map((driver) => (
                  <div
                    key={driver.id}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                    onMouseDown={() => handleSuggestionClick(driver)}
                  >
                    {driver.driverName} ({driver.driverMobile})
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Date Range container: stacked on mobile, horizontal on desktop */}
        <div className="flex flex-col sm:flex-row gap-2 mt-3 md:mt-0">
          <input
            type="date"
            className="border rounded p-2"
            value={dateStart}
            onChange={(e) => handleDateChange("start", e.target.value)}
            placeholder="From date"
          />
          <input
            type="date"
            className="border rounded p-2"
            value={dateEnd}
            onChange={(e) => handleDateChange("end", e.target.value)}
            placeholder="To date"
          />
        </div>
      </div>

      {/* Scrollable table container */}

      <div
        ref={containerRef}
        onScroll={onScroll}
        style={{ maxHeight: "400px", marginTop: "1rem" }}
        className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        <table className="min-w-full border-collapse block md:table">
          <thead className="hidden md:table-header-group">
            <tr className="text-left text-gray-600 font-semibold border-b border-gray-300 block md:table-row">
              <th className="p-1 md:py-4 text-[14px] block md:table-cell">
                Payment Through
              </th>
              <th className="p-3 font-semibold block md:table-cell">
                Transaction ID
              </th>
              <th className="p-3 font-semibold block md:table-cell">Cash</th>
              <th className="p-3 font-semibold block md:table-cell">Online</th>
              <th className="p-3 font-semibold block md:table-cell">Total</th>
              <th className="p-3 font-semibold block md:table-cell text-center flex-1 justify-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group">
            {rows.map((row) => (
              <tr
                key={row.ref}
                className="border-b border-gray-200 block md:table-row w-full md:w-auto"
              >
                <td
                  className="block md:table-cell md:w-auto md:p-3 font-nunito text-[#15803D] font-semibold"
                  data-label="Name"
                >
                  <div className="flex justify-between md:block">
                    <span className="font-bold text-gray-500 md:hidden">
                      Payment Through:
                    </span>
                    {/* <span>{row.name}</span> */}
                  </div>
                </td>
                <td
                  className="block md:table-cell md:w-auto md:p-3 font-nunito text-gray-600"
                  data-label="Reference ID"
                >
                  {/* <div className="flex justify-between md:block">
              <span className="font-bold text-gray-500 md:hidden">Reference ID:</span>
              <span>{row.ref}</span>
            </div> */}
                  <div className="flex flex-col md:flex-row md:block md:items-center justify-between">
                    <span className="font-bold text-gray-500 md:hidden mb-1 md:mb-0">
                      Transaction Id:
                    </span>
                    {/* <span>{row.ref}</span> */}
                  </div>
                </td>
                <td
                  className="block md:table-cell md:w-auto md:p-1 font-nunito"
                  data-label="Status"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between md:block">
                    <span className="font-bold text-gray-500 md:hidden">
                      Cash:
                    </span>
                    <span className="mt-1 md:mt-0 w-full md:inline-block">
                      {/* {getStatusBadge(row.status)} */}
                    </span>
                  </div>
                </td>
                <td
                  className="block md:table-cell md:w-auto md:p-3 font-nunito text-gray-600"
                  data-label="Date"
                >
                  <div className="flex justify-between md:block">
                    <span className="font-bold text-gray-500 md:hidden">
                      Online:
                    </span>
                    {/* <span>
                      {row.date
                        ? moment(row.date).format("DD-MM-YYYY hh:mm A")
                        : "-"}
                    </span> */}
                  </div>
                </td>
                <td
                  className="block md:table-cell md:w-auto md:p-3 font-nunito font-semibold text-gray-900"
                  data-label="Amount"
                >
                  <div className="flex justify-between md:block">
                    <span className="font-bold text-gray-500 md:hidden">
                      Total:
                    </span>
                    {/* <span>₹{row.amount.toLocaleString()}</span> */}
                  </div>
                </td>
                <td
                  className="block md:table-cell md:w-auto md:p-1 font-nunito"
                  data-label="Select"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between md:block">
                    <span className="font-bold text-gray-500 md:hidden">
                      Status:
                    </span>
                    <span className="mt-1 md:mt-0 w-full md:inline-block">
                      <div className="flex items-center justify-center min-h-[32px]">
                        {/* {!row.approved ? (
                          <input
                            type="checkbox"
                            checked={selected.includes(row.ref)}
                            onChange={() => handleSelect(row.ref)}
                            className="accent-blue-500 w-5 h-5"
                          />
                        ) : (
                          <span className="bg-[#D0FAE5] text-[#007A55] flex items-center gap-1 px-4 py-1 rounded-full text-[12px] font-semibold">
                            {row.approved}
                            <ImCheckboxChecked className="text-lg text-green-500" />
                          </span>
                        )} */}
                      </div>
                    </span>
                  </div>
                </td>
              </tr>
            ))}
            {loading && (
              <tr className="block md:table-row w-full">
                <td colSpan={6} className="text-center p-4 text-gray-500">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr className="block md:table-row w-full">
                <td colSpan={6} className="text-center p-4 text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {/* <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center py-2 sm:py-3 mt-2 gap-2 sm:gap-0">
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
                <FiUpload size={30} />
                <span className="text-gray-600 mb-1 text-sm">
                  Click to upload receipt
                </span>
                <span className="text-xs text-gray-400">PDF, PNG, or JPG</span>
                {receipt && (
                  <div className="text-green-600 text-xs mt-2">
                    {receipt.name}
                  </div>
                )}
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
      )} */}

      {showAddAmountPopup && (
        <AddAmountInDriverWallet onClose={() => setShowAddAmountPopup(false)} />
      )}
    </div>
  );
};

export default PaymentTable;
