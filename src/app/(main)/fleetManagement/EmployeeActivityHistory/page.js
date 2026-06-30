
"use client";
import React, { useState } from "react";
import { Search, Filter } from "lucide-react";

const EmployeeActivityHistory = () => {
  const [search, setSearch] = useState("");
  const [selectedModule, setSelectedModule] = useState("All Modules");
  const [selectedSubModule, setSelectedSubModule] = useState("All Sub-modules");
  const [selectedEmployee, setSelectedEmployee] = useState("All Employees");

//   const activities = [
//     {
//       id: 1,
//       module: "User Management",
//       subModule: "User Profiles",
//       activity: "Updated user profile information",
//       date: "2025-10-14 09:15 AM",
//       employee: "Sarah Johnson",
//     },
//     {
//       id: 2,
//       module: "Sales",
//       subModule: "Order Processing",
//       activity: "Created new sales order #12453",
//       date: "2025-10-14 09:45 AM",
//       employee: "Michael Chen",
//     },
//     {
//       id: 3,
//       module: "Inventory",
//       subModule: "Stock Management",
//       activity: "Updated inventory levels for 15 items",
//       date: "2025-10-14 10:20 AM",
//       employee: "Emily Rodriguez",
//     },
//     {
//       id: 4,
//       module: "Finance",
//       subModule: "Invoice Management",
//       activity: "Generated monthly invoice report",
//       date: "2025-10-14 10:55 AM",
//       employee: "David Kim",
//     },
//     {
//       id: 5,
//       module: "HR",
//       subModule: "Employee Records",
//       activity: "Added new employee to system",
//       date: "2025-10-14 11:30 AM",
//       employee: "Jennifer Martinez",
//     },
//     {
//       id: 6,
//       module: "Customer Support",
//       subModule: "Ticket System",
//       activity: "Resolved 8 customer support tickets",
//       date: "2025-10-14 01:15 PM",
//       employee: "Robert Taylor",
//     },
//     {
//       id: 7,
//       module: "Analytics",
//       subModule: "Performance Metrics",
//       activity: "Exported Q4 performance analytics",
//       date: "2025-10-14 02:00 PM",
//       employee: "Amanda White",
//     },
//     {
//       id: 8,
//       module: "Marketing",
//       subModule: "Campaign Management",
//       activity: "Launched new email marketing campaign",
//       date: "2025-10-14 02:45 PM",
//       employee: "James Anderson",
//     },
//   ];



const activities = [
  {
    id: 1,
    module: "User Management",
    subModule: "User Profiles",
    activity: "Updated user profile information",
    date: "2025-10-14 09:15 AM",
    employee: "Sarah Johnson",
  },
  {
    id: 2,
    module: "Sales",
    subModule: "Order Processing",
    activity: "Created new sales order #12453",
    date: "2025-10-14 09:45 AM",
    employee: "Michael Chen",
  },
  {
    id: 3,
    module: "Inventory",
    subModule: "Stock Management",
    activity: "Updated inventory levels for 15 items",
    date: "2025-10-14 10:20 AM",
    employee: "Emily Rodriguez",
  },
  {
    id: 4,
    module: "Finance",
    subModule: "Invoice Management",
    activity: "Generated monthly invoice report",
    date: "2025-10-14 10:55 AM",
    employee: "David Kim",
  },
  {
    id: 5,
    module: "HR",
    subModule: "Employee Records",
    activity: "Added new employee to system",
    date: "2025-10-14 11:30 AM",
    employee: "Jennifer Martinez",
  },
  {
    id: 6,
    module: "Customer Support",
    subModule: "Ticket System",
    activity: "Resolved 8 customer support tickets",
    date: "2025-10-14 01:15 PM",
    employee: "Robert Taylor",
  },
  {
    id: 7,
    module: "Analytics",
    subModule: "Performance Metrics",
    activity: "Exported Q4 performance analytics",
    date: "2025-10-14 02:00 PM",
    employee: "Amanda White",
  },
  {
    id: 8,
    module: "Marketing",
    subModule: "Campaign Management",
    activity: "Launched new email marketing campaign",
    date: "2025-10-14 02:45 PM",
    employee: "James Anderson",
  },
  {
    id: 9,
    module: "Operations",
    subModule: "Logistics",
    activity: "Scheduled delivery for client order #5621",
    date: "2025-10-14 03:10 PM",
    employee: "Olivia Brown",
  },
  {
    id: 10,
    module: "Finance",
    subModule: "Payroll",
    activity: "Processed salary for 50 employees",
    date: "2025-10-14 03:45 PM",
    employee: "William Scott",
  },
  {
    id: 11,
    module: "Inventory",
    subModule: "Suppliers",
    activity: "Added new supplier contract",
    date: "2025-10-14 04:10 PM",
    employee: "Sophia Davis",
  },
  {
    id: 12,
    module: "User Management",
    subModule: "Role Access",
    activity: "Modified admin access rights",
    date: "2025-10-14 04:45 PM",
    employee: "Ethan Wilson",
  },
  {
    id: 13,
    module: "Sales",
    subModule: "Quotations",
    activity: "Generated quotation for client #A320",
    date: "2025-10-14 05:00 PM",
    employee: "Mia Thomas",
  },
  {
    id: 14,
    module: "Customer Support",
    subModule: "Feedback",
    activity: "Reviewed 10 customer feedback responses",
    date: "2025-10-14 05:25 PM",
    employee: "Lucas Harris",
  },
  {
    id: 15,
    module: "Marketing",
    subModule: "Social Media",
    activity: "Posted product update on LinkedIn",
    date: "2025-10-14 06:00 PM",
    employee: "Ava Martin",
  },
  {
    id: 16,
    module: "HR",
    subModule: "Leave Management",
    activity: "Approved leave request for 3 employees",
    date: "2025-10-14 06:30 PM",
    employee: "Benjamin Lewis",
  },
  {
    id: 17,
    module: "IT Support",
    subModule: "System Maintenance",
    activity: "Upgraded server security patches",
    date: "2025-10-14 07:00 PM",
    employee: "Charlotte Clark",
  },
  {
    id: 18,
    module: "Finance",
    subModule: "Expense Tracking",
    activity: "Uploaded 5 new expense receipts",
    date: "2025-10-14 07:30 PM",
    employee: "Daniel Walker",
  },
  {
    id: 19,
    module: "Analytics",
    subModule: "Data Visualization",
    activity: "Updated dashboard charts for management",
    date: "2025-10-14 08:00 PM",
    employee: "Ella Hall",
  },
  {
    id: 20,
    module: "Operations",
    subModule: "Fleet Management",
    activity: "Assigned new driver to cab BR01PQ9492",
    date: "2025-10-14 08:30 PM",
    employee: "Henry Allen",
  },
];

  const moduleOptions = ["All Modules", ...new Set(activities.map((a) => a.module))];
  const subModuleOptions = ["All Sub-modules", ...new Set(activities.map((a) => a.subModule))];
  const employeeOptions = ["All Employees", ...new Set(activities.map((a) => a.employee))];

  const filteredActivities = activities.filter((item) => {
    const matchesSearch =
      item.activity.toLowerCase().includes(search.toLowerCase()) ||
      item.module.toLowerCase().includes(search.toLowerCase()) ||
      item.employee.toLowerCase().includes(search.toLowerCase());

    const matchesModule =
      selectedModule === "All Modules" || item.module === selectedModule;
    const matchesSubModule =
      selectedSubModule === "All Sub-modules" || item.subModule === selectedSubModule;
    const matchesEmployee =
      selectedEmployee === "All Employees" || item.employee === selectedEmployee;

    return matchesSearch && matchesModule && matchesSubModule && matchesEmployee;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-4 md:p-8">
      <div className="max-w-auto mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-md">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Employee Activity History
          </h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            Monitor and track employee activities across modules
          </p>
        </div>

        {/* Filter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col">
            <span className="text-xs text-gray-500 uppercase mb-1">Module Name</span>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className=" bg-transparent outline-none font-semibold text-[#0F172A]"
            >
              {moduleOptions.map((m, i) => (
                <option key={i}>{m}</option>
              ))}
            </select>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col">
            <span className="text-xs text-gray-500 uppercase mb-1">Sub-module Name</span>
            <select
              value={selectedSubModule}
              onChange={(e) => setSelectedSubModule(e.target.value)}
              className="font-semibold bg-transparent outline-none text-[#0F172A]"
            >
              {subModuleOptions.map((s, i) => (
                <option key={i}>{s}</option>
              ))}
            </select>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <span className="text-xs text-gray-500 uppercase">Activity Report</span>
            <p className="font-semibold text-[#0F172A] mt-1">Last 30 Days</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <span className="text-xs text-gray-500 uppercase">Activity Date</span>
            <p className="font-semibold text-[#0F172A] mt-1">2025-10-14</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col">
            <span className="text-xs text-gray-500 uppercase mb-1">Employee Name</span>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="font-semibold bg-transparent outline-none text-[#0F172A]"
            >
              {employeeOptions.map((e, i) => (
                <option key={i}>{e}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row items-center mt-12 gap-3 mb-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-3  h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities, employees, or modules..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-1 focus:ring-blue-500 text-sm"
            />
          </div>
          <button className="flex items-center justify-center gap-2 text-black bg-white border border-gray-200 px-4 py-3 rounded-xl hover:bg-blue-500 hover:text-white w-full md:w-auto">
            <Filter className="h-4 w-4 text-lg " />
            Filter
          </button>
        </div>

        {/* Table */}
        <h2 className="text-2xl font-semibold mb-3">Recent Activities</h2>
        <p className="text-l text-gray-500 mb-4">
          Latest employee actions and system events
        </p>

        {/* <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-[16px] text-[#0F172A]">
                <th className="p-5">#</th>
                <th className="p-3">Module</th>
                <th className="p-3">Sub-module</th>
                <th className="p-3">Activity</th>
                <th className="p-3">Date</th>
                <th className="p-3">Employee</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.length > 0 ? (
                filteredActivities.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-4">{item.id}</td>
                    <td className="p-3 font-medium text-[#0F172A]">{item.module}</td>
                    <td className="p-3 text-gray-600">{item.subModule}</td>
                    <td className="p-3 text-[#0F172A]">{item.activity}</td>
                    <td className="p-3 text-gray-500">{item.date}</td>
                    <td className="p-3 font-medium">{item.employee}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500 p-6 italic">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div> */}

{/* <div className="relative rounded-xl shadow-md border border-gray-100">

 <div className="max-h-[550px] overflow-y-auto overflow-x-auto rounded-xl">
<table className="w-full border-collapse text-sm">
 <thead className="sticky top-0 bg-gray-100 z-10">
<tr className="text-left text-[16px] text-[#0F172A]">
 <th className="p-5 min-w-[40px] sm:p-3">#</th>
 <th className="p-3 min-w-[120px] sm:p-2">Module</th>
<th className="p-3 min-w-[100px] sm:p-2">Sub-module</th>
 <th className="p-3 min-w-[120px] sm:p-2">Activity</th>
 <th className="p-3 min-w-[90px] sm:p-2">Date</th>
<th className="p-3 min-w-[120px] sm:p-2">Employee</th>
 </tr>
 </thead>
 <tbody>
 {filteredActivities.length > 0 ? (
filteredActivities.map((item) => (
<tr
 key={item.id}
className="border-b hover:bg-gray-50 transition text-[#0F172A]"
 >
<td className="p-4 sm:p-2">{item.id}</td>
 <td className="p-3 font-medium sm:p-2">{item.module}</td>
 <td className="p-3 text-gray-600 sm:p-2">{item.subModule}</td>
<td className="p-3 sm:p-2">{item.activity}</td>
 <td className="p-3 text-gray-500 sm:p-2">{item.date}</td>
 <td className="p-3 font-medium sm:p-2">{item.employee}</td>
</tr>
))
) : (
 <tr>
 <td
 colSpan="6"
 className="text-center text-gray-500 p-6 italic sm:p-2"
 >
 No results found
</td>
</tr>
)}
 </tbody>
 </table>
 </div>
</div> */}

<div className="relative rounded-xl shadow-md border border-gray-100">
  {/* Scrollable area */}
  <div className="max-h-[550px] overflow-y-auto overflow-x-auto rounded-xl">
    <table className="w-full border-collapse text-sm">
      <thead className="sticky top-0 bg-gray-100 z-10 hidden md:table-header-group">
        <tr className="text-left text-[16px] text-[#0F172A]">
          <th className="p-5">#</th>
          <th className="p-3">Module</th>
          <th className="p-3">Sub-module</th>
          <th className="p-3">Activity</th>
          <th className="p-3">Date</th>
          <th className="p-3">Employee</th>
        </tr>
      </thead>

      <tbody className="block md:table-row-group">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((item) => (
            <tr
              key={item.id}
              className="border-b hover:bg-gray-50 transition text-[#0F172A] block md:table-row mb-6 md:mb-0 rounded-lg shadow-sm md:shadow-none p-4 md:p-0"
            >
              {/* Mobile card layout */}
              <td className="block md:table-cell p-3">
                <span className="font-semibold md:hidden">#:</span> {item.id}
              </td>
              <td className="block md:table-cell p-3">
                <span className="font-semibold md:hidden">Module:</span> {item.module}
              </td>
              <td className="block md:table-cell p-3">
                <span className="font-semibold md:hidden">Sub-module:</span> {item.subModule}
              </td>
              <td className="block md:table-cell p-3">
                <span className="font-semibold md:hidden">Activity:</span> {item.activity}
              </td>
              <td className="block md:table-cell p-3">
                <span className="font-semibold md:hidden">Date:</span> {item.date}
              </td>
              <td className="block md:table-cell p-3">
                <span className="font-semibold md:hidden">Employee:</span> {item.employee}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan="6"
              className="text-center text-gray-500 p-6 italic"
            >
              No results found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>



      </div>
    </div>
  );
};

export default EmployeeActivityHistory;
