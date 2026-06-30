"use client";

import React, { useState, useEffect } from "react";
import StatsCards from "./StatsCards";
import AddServiceModal from "./AddServiceModal";
import ServiceCard from "./ServiceCard";
import Breadcrumbs from "./Breadcrumbs";

import { IoSettingsOutline } from "react-icons/io5";
// Page component: main container + top header + search + filter + list
export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState("All Status");
  const [date, setDate] = useState("All Dates");
  const statusOptions = ["All Status", "Active", "Pending", "Completed"];
  const dateOptions = ["All Dates", "Today", "This Week", "This Month"];

  const [serviceData, setServiceData] = useState([
    {
      title: "Brake Maintenance",
      part: "Brake Pad",
      date: "15 Jan 2025",
      priority: "High",
      changedBy: "Rajesh Kumar (Driver)",
      approvedBy: "Admin Sharma",
      amount: 2500,
      status: "Settled",
      description:
        "Routine brake pad replacement due to wear and tear. Front brake pads were completely worn out.",
    },
    {
      title: "Engine checkup",
      part: "Engine Oil",
      date: "10 Jan 2025",
      priority: "Medium",
      changedBy: "City Auto Workshop",
      approvedBy: "Supervisor",
      amount: 1200,
      status: "Pending",
      description: "Engine oil changed with synthetic oil.",
    },
    {
      title: "Tire Replacement",
      part: "Front Tires",
      date: "08 Jan 2025",
      priority: "High",
      changedBy: "MRF Service Center",
      approvedBy: "Admin Sharma",
      amount: "4,500",
      status: "Pending",
      description:
        "Emergency tire replacement after puncture. Both front tires needed replacement due to damage.",
    },
    {
      title: "AC Service",
      part: "AC Filter",
      date: "05 Jan 2025",
      priority: "Low",
      changedBy: "Cool Air Services",
      approvedBy: "Supervisor Patel",
      amount: "650",
      status: "Settled",
      description:
        "Air conditioning system cleaning and filter replacement for better cooling efficiency.",
    },
    {
      title: "Battery Replacement",
      part: "Car Battery",
      date: "03 Jan 2025",
      priority: "High",
      changedBy: "Exide Service Point",
      approvedBy: "Admin Sharma",
      amount: "3,200",
      status: "Pending",
      description:
        "Battery replacement due to complete discharge and inability to hold charge.",
    },
  ]);

  const [filteredServices, setFilteredServices] = useState(serviceData);
  const [searchTerm, setSearchTerm] = useState("");

  // Add new service handler (called by modal)
  const addNewService = (newService) => {
    const formattedService = {
      title: newService.serviceName,
      part: newService.partName,
      date: new Date(newService.serviceDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      priority: "Medium",
      changedBy: newService.componentChanged,
      approvedBy: newService.approvedBy,
      amount: newService.cost,
      status: "Pending",
      description: newService.description,
    };
    setServiceData((prev) => [formattedService, ...prev]);
  };

  // Filtering
  useEffect(() => {
    const filtered = serviceData.filter((service) => {
      const matchesStatus =
        status === "All Status" || service.status === status;
      const matchesDate =
        date === "All Dates" || service.date.includes(date.replace(" ", ""));
      const matchesSearch =
        !searchTerm ||
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.part.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.changedBy || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (service.approvedBy || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      return matchesStatus && matchesDate && matchesSearch;
    });
    setFilteredServices(filtered);
  }, [status, date, serviceData, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Header / top */}
      {/* Breadcrumbs */}
      <Breadcrumbs />
      <header className="w-full bg-white shadow-sm sticky top-0 z-20 ">
        <div
          className="
      w-full 
      px-2  md:px-14 
      py-1.5 md:py-4 
      flex flex-col md:flex-row md:items-center 
      gap-1.5 md:gap-6 shadow-lg
    "
        >
          <div className="flex flex-col">
            <span
              className="
          text-[13px] md:text-xl 
          font-bold text-slate-900 leading-tight
        "
            >
              My Cabs
            </span>
            <span
              className="
          text-[10px]   md:text-sm 
          text-slate-500 leading-tight
        "
            >
              Manage your rides and vehicle
            </span>
          </div>

          <div
            className="
        ml-auto 
        flex items-center 
        gap-1  md:gap-3
      "
          >
            <input
              type="text"
              placeholder="Search..."
              className="
          px-1.5 md:px-4 
          py-0.5  md:py-2 
          rounded-md border border-gray-200 
          text-[8px]  md:text-sm 
              w-fit min-w-[100px] md:w-64     
          focus:outline-none focus:ring-1 focus:ring-blue-400
        "
            />

            <button
              className="
          px-2  md:px-4 
          py-0.5 md:py-2 
          rounded-md bg-gray-100 
          text-[10px] md:text-sm
          font-medium
        "
            >
              Filter
            </button>

            <button
              className="
          px-2  md:px-5 
          py-0.5  md:py-2 
          rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
          text-[10px]  md:text-sm
          font-medium shadow
        "
            >
              + Add Cab
            </button>
          </div>
        </div>
      </header>

      <main
        className="
    max-w-auto 
    mx-auto 
    px-3   md:px-10 lg:px-14 
    py-2  md:py-6
  "
      >
        {/* Stats row */}
        <StatsCards />

        {/* Service header  */}
        <div className="bg-white shadow-lg rounded-lg  p-4 mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4 ">
            <div className="bg-blue-600 rounded-lg w-11 h-11 flex items-center justify-center text-white">
              <IoSettingsOutline className="text-[22px]" />
            </div>
            <div>
              <div className="text-xl font-semibold text-slate-900">
                Service History
              </div>
              <div className="text-sm text-slate-500">
                Comprehensive vehicle maintenance tracking
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow"
            >
              + Add Service
            </button>
          </div>
        </div>

        {/* Search & filters & Buttons  */}

        {/* All Status button */}
        <div className="mt-4 bg-white rounded-lg p-4 shadow-lg  ">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
        w-full md:w-1/2 
        px-4 py-2 border border-gray-200 rounded-md focus:outline-none
        text-sm"
              placeholder="Search services, parts, or providers..."
            />

            <div className="flex gap-2 md:flex-row  flex-col sm:gap-10 justify-between">
              <div className="flex gap-2  flex-row ">
                {statusOptions.map((item) => (
                  <button
                    key={item}
                    onClick={() => setStatus(item)}
                    className={`
               px-1 py-2 rounded-md text-[9px] md:text-[10px] md:px-2
               
              ${
                status === item
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }
            `}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 flex-row">
                {dateOptions.map((item) => (
                  <button
                    key={item}
                    onClick={() => setDate(item)}
                    className={`
              px-1 py-2 rounded-md  text-[10px] md:text-[10px] md:px-2
              ${
                date === item
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }
            `}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* All Status button End*/}

        {/* Service list Start */}
        <div className="mt-6 space-y-4">
          {filteredServices.length === 0 ? (
            <div className="text-center text-gray-500 py-8 bg-white rounded-md shadow-sm">
              No services found.
            </div>
          ) : (
            filteredServices.map((item, idx) => (
              <ServiceCard key={idx} item={item} />
            ))
          )}
        </div>
        {/* Service list End */}
      </main>

      {/* Modal */}
      <AddServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={addNewService}
      />
    </div>
  );
}
