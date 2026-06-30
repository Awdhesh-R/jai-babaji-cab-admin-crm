"use client";
import React from "react";

import { useState } from "react";
import { BsCashStack } from "react-icons/bs";
import { AiOutlineFileText } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import { FaCarSide } from "react-icons/fa";
import { useRouter } from "next/navigation";
import DateRangePicker from "@/components/common/DateRange";
import moment from "moment";
import { useCallback, useEffect, useRef } from "react";
import { apiClient } from "@/app/lib/apiClient";
import CustomLoader from "@/components/common/CustomLoader";
import Link from "next/link";

const transactions = [
  {
    id: "TXN-001",
    date: "2024-01-15 10:30 AM",
    amount: "₹250",
    mode: "UPI",
    through: "User",
    type: "Final Fare",
    user: "John Doe (+91-9876543210)",
    driver: "Raj Kumar (DRV-101)",
    admin: "Admin Panel",
    operator: "N/A",
  },
  {
    id: "TXN-002",
    date: "2024-01-15 11:45 AM",
    amount: "₹500",
    mode: "Cash",
    through: "Driver",
    type: "User Advance",
    user: "Sarah Smith (+91-9123456789)",
    driver: "Amit Singh (DRV-102)",
    admin: "N/A",
    operator: "FleetCorp (OP-201)",
  },
  {
    id: "TXN-003",
    date: "2024-01-16 09:20 AM",
    amount: "₹150",
    mode: "Online",
    through: "User",
    type: "RodBez Fee",
    user: "Ravi Patel (+91-9988776655)",
    driver: "Sunil Sharma (DRV-103)",
    admin: "Admin Panel",
    operator: "N/A",
  },
  {
    id: "TXN-004",
    date: "2024-01-17 12:45 PM",
    amount: "₹300",
    mode: "UPI",
    through: "User",
    type: "Driver Due",
    user: "Anita Gupta (+91-9876501234)",
    driver: "Karan Mehta (DRV-104)",
    admin: "N/A",
    operator: "N/A",
  },
  {
    id: "TXN-005",
    date: "2024-01-18 06:20 PM",
    amount: "₹700",
    mode: "Cash",
    through: "Driver",
    type: "Fare Collection",
    user: "Vikram Singh (+91-9090909090)",
    driver: "Rohit Yadav (DRV-105)",
    admin: "Admin Panel",
    operator: "DriveIndia (OP-202)",
  },
  {
    id: "TXN-006",
    date: "2024-01-19 09:00 AM",
    amount: "₹1200",
    mode: "Online",
    through: "User",
    type: "Operator Due",
    user: "Meena Rani (+91-9812345678)",
    driver: "Deepak Kumar (DRV-106)",
    admin: "N/A",
    operator: "FleetGo (OP-204)",
  },
  {
    id: "TXN-007",
    date: "2024-01-20 02:15 PM",
    amount: "₹450",
    mode: "UPI",
    through: "User",
    type: "Final Fare",
    user: "Ajay Verma (+91-9855852250)",
    driver: "Suresh Das (DRV-107)",
    admin: "Admin Panel",
    operator: "RideQuick (OP-203)",
  },
  {
    id: "TXN-008",
    date: "2024-01-21 10:40 AM",
    amount: "₹880",
    mode: "Cash",
    through: "Driver",
    type: "User Advance",
    user: "Priya Sharma (+91-9321654789)",
    driver: "Mohit Kapoor (DRV-108)",
    admin: "N/A",
    operator: "N/A",
  },
  {
    id: "TXN-009",
    date: "2024-01-22 03:30 PM",
    amount: "₹560",
    mode: "Online",
    through: "User",
    type: "RodBez Fee",
    user: "Nikhil Jain (+91-9871203456)",
    driver: "Arun Chauhan (DRV-109)",
    admin: "Admin Panel",
    operator: "FleetGo (OP-205)",
  },
  {
    id: "TXN-010",
    date: "2024-01-23 06:15 PM",
    amount: "₹690",
    mode: "UPI",
    through: "User",
    type: "Driver Due",
    user: "Geeta Kumari (+91-9345678123)",
    driver: "Harsh Vardhan (DRV-110)",
    admin: "N/A",
    operator: "Cabify (OP-206)",
  },
  {
    id: "TXN-011",
    date: "2024-01-24 11:50 AM",
    amount: "₹300",
    mode: "Cash",
    through: "Driver",
    type: "Fare Collection",
    user: "Ramesh Kumar (+91-9911223344)",
    driver: "Irfan Ali (DRV-111)",
    admin: "Admin Panel",
    operator: "N/A",
  },
  {
    id: "TXN-012",
    date: "2024-01-25 08:25 PM",
    amount: "₹1050",
    mode: "Online",
    through: "User",
    type: "Operator Due",
    user: "Sneha Roy (+91-9797979797)",
    driver: "Abhishek Singh (DRV-112)",
    admin: "N/A",
    operator: "RideHub (OP-207)",
  },
];

const summaryData2 = [
  {
    label: "-",
    amount: "₹-",
    // gradient: "linear-gradient(135deg, #7de787 55%, #35dc67 100%)"
    gradient: "linear-gradient(135deg, #67C900 60%, #15803D 100%)", // Green
  },
  {
    label: "-",
    amount: "₹-",
    // gradient: "linear-gradient(135deg, #fd977a 60%, #ffad95 100%)"
    gradient: "linear-gradient(135deg, #FFEEAD 0%, #FF8A8AD2 100%)", // Orange-Pink
  },
  {
    label: "-",
    amount: "₹-",
    // gradient: "linear-gradient(135deg, #bcd0fa 60%, #184acf 100%)"
    gradient: "linear-gradient(135deg, #D1E9F6 60%, #7695FF 100%)", // Blue
  },
  {
    label: "-",
    amount: "₹",
    // gradient: "linear-gradient(135deg, #feb678 60%, #ff7300 100%)"
    gradient: "linear-gradient(135deg, #F8A348 60%, #E87015 100%)", // Orange
  },
];

const invoiceData = [
  {
    id: "INV-001",
    ride_id: "RID-001",
    type: "Ride Fare",
    hsn: "996511",
    amount: "₹250",
    sgst: "₹22.5",
    cgst: "₹22.5",
    igst: "₹0",
    payout: "₹295",
    mode: "UPI",
    date: "2025-01-15 10:30 AM",
  },
  {
    id: "INV-002",
    ride_id: "RID-002",
    type: "Convenience Fee",
    hsn: "998314",
    amount: "₹15",
    sgst: "₹1.35",
    cgst: "₹1.35",
    igst: "₹0",
    payout: "₹17.7",
    mode: "Card",
    date: "2025-01-20 09:00 AM",
  },
  {
    id: "INV-003",
    ride_id: "RID-003",
    type: "RodBez Fee",
    hsn: "998314",
    amount: "₹25",
    sgst: "₹2.25",
    cgst: "₹2.25",
    igst: "₹0",
    payout: "₹29.5",
    mode: "Cash",
    date: "2025-02-05 04:45 PM",
  },
  {
    id: "INV-004",
    ride_id: "RID-004",
    type: "Cancellation Fee",
    hsn: "996511",
    amount: "₹50",
    sgst: "₹4.5",
    cgst: "₹4.5",
    igst: "₹0",
    payout: "₹59",
    mode: "UPI",
    date: "2025-02-10 11:30 AM",
  },
  {
    id: "INV-005",
    ride_id: "RID-005",
    type: "Ride Fare",
    hsn: "996511",
    amount: "₹180",
    sgst: "₹16.2",
    cgst: "₹16.2",
    igst: "₹0",
    payout: "₹212.4",
    mode: "Card",
    date: "2025-02-15 01:10 PM",
  },
  {
    id: "INV-006",
    ride_id: "RID-006",
    type: "Waiting Charges",
    hsn: "996511",
    amount: "₹30",
    sgst: "₹2.7",
    cgst: "₹2.7",
    igst: "₹0",
    payout: "₹35.4",
    mode: "UPI",
    date: "2025-02-20 05:20 PM",
  },
  {
    id: "INV-007",
    ride_id: "RID-007",
    type: "Ride Fare",
    hsn: "996511",
    amount: "₹320",
    sgst: "₹28.8",
    cgst: "₹28.8",
    igst: "₹0",
    payout: "₹377.6",
    mode: "Cash",
    date: "2025-03-01 09:10 AM",
  },
  {
    id: "INV-008",
    ride_id: "RID-008",
    type: "Convenience Fee",
    hsn: "998314",
    amount: "₹20",
    sgst: "₹1.8",
    cgst: "₹1.8",
    igst: "₹0",
    payout: "₹23.6",
    mode: "UPI",
    date: "2025-03-03 07:30 PM",
  },
  {
    id: "INV-009",
    ride_id: "RID-009",
    type: "Peak Hour Charge",
    hsn: "996511",
    amount: "₹45",
    sgst: "₹4.05",
    cgst: "₹4.05",
    igst: "₹0",
    payout: "₹53.1",
    mode: "Card",
    date: "2025-03-05 02:45 PM",
  },
  {
    id: "INV-010",
    ride_id: "RID-010",
    type: "RodBez Fee",
    hsn: "998314",
    amount: "₹35",
    sgst: "₹3.15",
    cgst: "₹3.15",
    igst: "₹0",
    payout: "₹41.3",
    mode: "UPI",
    date: "2025-03-10 06:15 PM",
  },
  {
    id: "INV-011",
    ride_id: "RID-011",
    type: "Ride Fare",
    hsn: "996511",
    amount: "₹400",
    sgst: "₹36",
    cgst: "₹36",
    igst: "₹0",
    payout: "₹472",
    mode: "Card",
    date: "2025-03-15 12:00 PM",
  },
  {
    id: "INV-012",
    ride_id: "RID-012",
    type: "Convenience Fee",
    hsn: "998314",
    amount: "₹30",
    sgst: "₹2.7",
    cgst: "₹2.7",
    igst: "₹0",
    payout: "₹35.4",
    mode: "UPI",
    date: "2025-03-18 11:20 AM",
  },
  {
    id: "INV-013",
    ride_id: "RID-013",
    type: "Cancellation Fee",
    hsn: "996511",
    amount: "₹60",
    sgst: "₹5.4",
    cgst: "₹5.4",
    igst: "₹0",
    payout: "₹70.8",
    mode: "Cash",
    date: "2025-03-22 03:15 PM",
  },
  {
    id: "INV-014",
    ride_id: "RID-014",
    type: "Waiting Charges",
    hsn: "996511",
    amount: "₹25",
    sgst: "₹2.25",
    cgst: "₹2.25",
    igst: "₹0",
    payout: "₹29.5",
    mode: "UPI",
    date: "2025-04-02 10:30 AM",
  },
  {
    id: "INV-015",
    ride_id: "RID-015",
    type: "Ride Fare",
    hsn: "996511",
    amount: "₹280",
    sgst: "₹25.2",
    cgst: "₹25.2",
    igst: "₹0",
    payout: "₹330.4",
    mode: "Card",
    date: "2025-04-06 05:45 PM",
  },
  {
    id: "INV-016",
    ride_id: "RID-016",
    type: "RodBez Fee",
    hsn: "998314",
    amount: "₹40",
    sgst: "₹3.6",
    cgst: "₹3.6",
    igst: "₹0",
    payout: "₹47.2",
    mode: "Cash",
    date: "2025-04-10 09:30 AM",
  },
  {
    id: "INV-017",
    ride_id: "RID-017",
    type: "Peak Hour Charge",
    hsn: "996511",
    amount: "₹55",
    sgst: "₹4.95",
    cgst: "₹4.95",
    igst: "₹0",
    payout: "₹64.9",
    mode: "UPI",
    date: "2025-04-14 01:00 PM",
  },
  {
    id: "INV-018",
    ride_id: "RID-018",
    type: "Ride Fare",
    hsn: "996511",
    amount: "₹190",
    sgst: "₹17.1",
    cgst: "₹17.1",
    igst: "₹0",
    payout: "₹224.2",
    mode: "Card",
    date: "2025-04-18 07:30 PM",
  },
  {
    id: "INV-019",
    ride_id: "RID-019",
    type: "Cancellation Fee",
    hsn: "996511",
    amount: "₹70",
    sgst: "₹6.3",
    cgst: "₹6.3",
    igst: "₹0",
    payout: "₹82.6",
    mode: "UPI",
    date: "2025-05-01 08:20 AM",
  },
  {
    id: "INV-020",
    ride_id: "RID-020",
    type: "Waiting Charges",
    hsn: "996511",
    amount: "₹20",
    sgst: "₹1.8",
    cgst: "₹1.8",
    igst: "₹0",
    payout: "₹23.6",
    mode: "Cash",
    date: "2025-05-05 06:15 PM",
  },
  {
    id: "INV-021",
    ride_id: "RID-021",
    type: "Ride Fare",
    hsn: "996511",
    amount: "₹310",
    sgst: "₹27.9",
    cgst: "₹27.9",
    igst: "₹0",
    payout: "₹365.8",
    mode: "UPI",
    date: "2025-05-08 11:10 AM",
  },
  {
    id: "INV-022",
    ride_id: "RID-022",
    type: "RodBez Fee",
    hsn: "998314",
    amount: "₹28",
    sgst: "₹2.52",
    cgst: "₹2.52",
    igst: "₹0",
    payout: "₹33.04",
    mode: "Card",
    date: "2025-05-11 01:40 PM",
  },
  {
    id: "INV-023",
    ride_id: "RID-023",
    type: "Peak Hour Charge",
    hsn: "996511",
    amount: "₹40",
    sgst: "₹3.6",
    cgst: "₹3.6",
    igst: "₹0",
    payout: "₹47.2",
    mode: "UPI",
    date: "2025-06-02 10:00 AM",
  },
  {
    id: "INV-024",
    ride_id: "RID-024",
    type: "Ride Fare",
    hsn: "996511",
    amount: "₹270",
    sgst: "₹24.3",
    cgst: "₹24.3",
    igst: "₹0",
    payout: "₹318.6",
    mode: "Card",
    date: "2025-06-05 03:00 PM",
  },
  {
    id: "INV-025",
    ride_id: "RID-025",
    type: "Convenience Fee",
    hsn: "998314",
    amount: "₹18",
    sgst: "₹1.62",
    cgst: "₹1.62",
    igst: "₹0",
    payout: "₹21.24",
    mode: "Cash",
    date: "2025-06-10 02:15 PM",
  },
  {
    id: "INV-026",
    ride_id: "RID-026",
    type: "Ride Fare",
    hsn: "996511",
    amount: "₹340",
    sgst: "₹30.6",
    cgst: "₹30.6",
    igst: "₹0",
    payout: "₹401.2",
    mode: "UPI",
    date: "2025-06-12 09:30 PM",
  },
  {
    id: "INV-027",
    ride_id: "RID-027",
    type: "Waiting Charges",
    hsn: "996511",
    amount: "₹35",
    sgst: "₹3.15",
    cgst: "₹3.15",
    igst: "₹0",
    payout: "₹41.3",
    mode: "Card",
    date: "2025-07-01 04:45 PM",
  },
  {
    id: "INV-028",
    ride_id: "RID-028",
    type: "Ride Fare",
    hsn: "996511",
    amount: "₹295",
    sgst: "₹26.55",
    cgst: "₹26.55",
    igst: "₹0",
    payout: "₹348.1",
    mode: "UPI",
    date: "2025-07-10 08:20 AM",
  },
  {
    id: "INV-029",
    ride_id: "RID-029",
    type: "Cancellation Fee",
    hsn: "996511",
    amount: "₹65",
    sgst: "₹5.85",
    cgst: "₹5.85",
    igst: "₹0",
    payout: "₹76.7",
    mode: "Cash",
    date: "2025-07-15 10:15 AM",
  },
  {
    id: "INV-030",
    ride_id: "RID-030",
    type: "RodBez Fee",
    hsn: "998314",
    amount: "₹32",
    sgst: "₹2.88",
    cgst: "₹2.88",
    igst: "₹0",
    payout: "₹37.76",
    mode: "Card",
    date: "2025-07-20 03:30 PM",
  },
];

const driverDuesData = [
  {
    driverName: "Ramesh Kumar",
    cabNumber: "BR01AB1234",
    cabType: "Swift Dzire",
  },
  {
    driverName: "Amit Verma",
    cabNumber: "DL05CD5678",
    cabType: "Sedan",
  },
  {
    driverName: "Abhishek Kumar",
    cabNumber: "MH12EF9012",
    cabType: "Sedan",
  },
  {
    driverName: "Rajesh Singh",
    cabNumber: "UP32GH3456",
    cabType: "Sedan",
  },
  {
    driverName: "Vikash Kumar",
    cabNumber: "RJ14JY7890",
    cabType: "SUV",
  },
  {
    driverName: "Deepak Singh",
    cabNumber: "GJ01KL2345",
    cabType: "Swift Dzire",
  },
  // Extra 20 entries
  {
    driverName: "Suresh Yadav",
    cabNumber: "KA05MN6789",
    cabType: "Sedan",
  },
  {
    driverName: "Manoj Sharma",
    cabNumber: "TN10PQ1234",
    cabType: "SUV",
  },
  {
    driverName: "Anil Mehta",
    cabNumber: "PB11RS4567",
    cabType: "Hatchback",
  },
  {
    driverName: "Sunil Gupta",
    cabNumber: "HR26TU8901",
    cabType: "Sedan",
  },
  {
    driverName: "Ravi Prasad",
    cabNumber: "WB20VW2345",
    cabType: "SUV",
  },
  {
    driverName: "Arun Mishra",
    cabNumber: "CH01XY6789",
    cabType: "Swift Dzire",
  },
  {
    driverName: "Lokesh Tiwari",
    cabNumber: "OD05ZA1234",
    cabType: "Sedan",
  },
  {
    driverName: "Kunal Sinha",
    cabNumber: "MP09BC5678",
    cabType: "SUV",
  },
  {
    driverName: "Pankaj Kumar",
    cabNumber: "JK02DE9012",
    cabType: "Sedan",
  },
  {
    driverName: "Ashok Reddy",
    cabNumber: "AP16FG3456",
    cabType: "SUV",
  },
  {
    driverName: "Harish Chauhan",
    cabNumber: "UK07HI7890",
    cabType: "Sedan",
  },
  {
    driverName: "Praveen Nair",
    cabNumber: "KL08JK2345",
    cabType: "Swift Dzire",
  },
  {
    driverName: "Sanjay Joshi",
    cabNumber: "CG10LM6789",
    cabType: "SUV",
  },
  {
    driverName: "Mohit Bansal",
    cabNumber: "HP12NO1234",
    cabType: "Sedan",
  },
  {
    driverName: "Nitin Arora",
    cabNumber: "GA03PQ5678",
    cabType: "Sedan",
  },
  {
    driverName: "Yogesh Patil",
    cabNumber: "MH31QR9012",
    cabType: "SUV",
  },
  {
    driverName: "Tarun Kapoor",
    cabNumber: "DL09ST3456",
    cabType: "Sedan",
  },
  {
    driverName: "Rohit Malhotra",
    cabNumber: "BR21UV7890",
    cabType: "Swift Dzire",
  },
  {
    driverName: "Kishor Das",
    cabNumber: "AS04WX2345",
    cabType: "Sedan",
  },
  {
    driverName: "Vishal Singh",
    cabNumber: "UP14YZ6789",
    cabType: "SUV",
  },
];

function getCollectionTypeClasses(type) {
  switch (type.toLowerCase()) {
    case "final fare":
      return "border-[#15803D33] text-[#15803D]";
    case "user advance":
      return "border-[#84CC1633] text-[#84CC16]";
    // case "rodbez fee":
    //   return "border-blue-400 text-blue-600";
    // case "driver due":
    //   return "border-orange-400 text-orange-600";
    // case "fare collection":
    //   return "border-purple-400 text-purple-600";
    // case "operator due":
    //   return "border-pink-400 text-pink-600";
    default:
      return "border-gray-300 text-gray-600";
  }
}


// Utility to format numbers as lakhs with "L"
function formatToLakh(amount) {
  if (amount >= 100000) {
    return (amount / 100000).toFixed(2) + "L";
  }
  return amount?.toLocaleString("en-IN"); // Fallback to normal format
}


function formatAmount(num) {
  if (!num && num !== 0) return "";
  if (num >= 10000000) return (num / 10000000).toFixed(2) + " Cr";
  if (num >= 100000) return (num / 100000).toFixed(2) + " L";
  return Number(num).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });
}

// Card component
const RevenueCard = ({ amount, label, gradient, textColor }) => {
  const [hovered, setHovered] = React.useState(false);

  const compactAmount = formatAmount(amount);
  const fullAmount = Number(amount).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });

  return (
    <div
      className="relative rounded-2xl shadow-md border border-gray-200 p-4 flex flex-col justify-center items-center transition-all hover:scale-105 flex-grow flex-shrink basis-[220px]"
      style={{
        background: gradient,
        minWidth: "220px",
        minHeight: "180px",
        opacity: 0.9,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="absolute rounded-xl"
        style={{
          width: "70%",
          height: "80%",
          right: "-15%",
          top: "-10%",
          background: "rgba(255,255,255,0.18)",
          transform: "rotate(150deg)",
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.5,
        }}
      />
      <div className="relative z-10 text-center" style={{ width: "100%" }}>
        <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
          <p
            className={`text-base md:text-2xl lg:text-4xl font-bold font-nunito ${textColor}`}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "95%",
              margin: "0 auto",
              cursor: "pointer",
            }}
            title={fullAmount} // native tooltip on hover
          >
            ₹{hovered ? fullAmount : compactAmount}
          </p>
        </div>
        <p className="text-[10px] md:text-lg font-nunito text-gray-700 mt-1 font-medium">
          {label}
        </p>
      </div>
    </div>
  );
};

const CollectionCard = ({ amount, label, gradient, textColor }) => {
  const [hovered, setHovered] = React.useState(false);

  // Compact for card: lakh/crore/normal
  const compactAmount = formatAmount(amount);

  // Full for hover/tooltip: full value commas
  const fullAmount =
    amount !== null && amount !== undefined && !isNaN(Number(amount))
      ? Number(amount).toLocaleString("en-IN", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 0,
        })
      : "-";

  return (
    <div
      className={`relative rounded-2xl shadow-md border border-gray-200 p-4 flex flex-col justify-center items-center transition-all hover:scale-105 flex-grow flex-shrink basis-[120px]`}
      style={{
        background: gradient,
        minWidth: "120px",
        minHeight: "180px",
        opacity: 0.9,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* overlay */}
      <div
        className="absolute rounded-xl"
        style={{
          width: "70%",
          height: "80%",
          right: "-15%",
          top: "-10%",
          background: "rgba(255,255,255,0.18)",
          transform: "rotate(150deg)",
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.5,
        }}
      />
      <div className="relative z-10 w-full text-center">
        <div className="w-full flex justify-center">
          <p
            className={`text-base md:text-2xl lg:text-4xl font-bold font-nunito ${textColor}`}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "95%",
              margin: "0 auto",
              cursor: "pointer",
            }}
            title={fullAmount}
          >
            ₹{hovered ? fullAmount : compactAmount}
          </p>
        </div>
        <p className="text-[12px] md:text-lg font-nunito text-gray-700 mt-2 font-medium">
          {label}
        </p>
      </div>
    </div>
  );
};


function getPaymentModeClasses(mode) {
  switch (mode.toLowerCase()) {
    case "upi":
      return "bg-[#15803D1A] text-[#15803D]";
    case "cash":
      return "bg-[#FFEDD4] text-[#CA3500]";
    case "online":
      return "bg-[#84CC161A] text-[#84CC16]";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

   

export default function FleetCommandCenter() {
  const router = useRouter();

  const [view, setView] = useState("sales"); // default to collections

  const [show, setShow] = useState(false);
  const [nameSearch, setNameSearch] = useState("");
  const [cabSearch, setCabSearch] = useState("");
  const [searchRideId, setSearchRideId] = useState("");
  const [invoicesList, setInvoiceList] = useState([]);
  const [dateFilter, setDateFilter] = useState({
    startDate: null,
    endDate: null,
  });

  

  const filteredData = driverDuesData.filter(
    (d) =>
      d.driverName.toLowerCase().includes(nameSearch.toLowerCase()) &&
      d.cabNumber.toLowerCase().includes(cabSearch.toLowerCase())
  );
  const filteredInvoiceData = invoiceData.filter((item) => {
    // Date filter
    if (dateFilter.startDate && dateFilter.endDate) {
      const itemDate = new Date(item.date);
      const start = new Date(dateFilter.startDate);
      const end = new Date(dateFilter.endDate);
      if (itemDate < start || itemDate > end) return false; // Date filter ke bahar
    }
    // Search filter
    if (
      searchRideId &&
      item.ride_id.toLowerCase().indexOf(searchRideId.toLowerCase()) === -1
    ) {
      return false;
    }
    return true;
  });

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState();
  const [searchURID, setSearchURID] = useState("");
  const observerRef = useRef();
   const [data, setData] = useState("");

  const filterInvoiceList = invoicesList.filter((invoice) => {
    if (
      invoice?.ride_id
        ?.toString()
        .toLowerCase()
        .includes(searchURID.toLowerCase())
    ) {
      return true;
    }
    return false;
  });

  const fetchInvoices = useCallback(
    async (pageNo) => {
      try {
        setLoading(true);
        const params = {
          page: pageNo,
          startsAt: dateFilter.startDate
            ? moment(dateFilter.startDate).format()
            : null,
          endsAt: dateFilter.endDate
            ? moment(dateFilter.endDate)
                .add(23, "hours")
                .add(59, "minutes")
                .add(59, "seconds")
                .format()
            : null,
          limit: 100,
        };
        const response = await apiClient(
          "GET",
          "/ride_management/rides-revenue",
          params
        );
        if (response.status || response.success) {
          setInvoiceDetails(response.data.meta);
          console.log(response);
          const temppArr = response.data.data;
          if (pageNo === 1) {
            setInvoiceList(temppArr);
          } else {
            if (temppArr?.length > 0) {
              setInvoiceList((prev) => [...prev, ...temppArr]);
            } else {
              setHasMore(false);
            }
          }
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    },
    [dateFilter]
  );

  const lastCardRef = useCallback(
    (node) => {
      if (!hasMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [hasMore]
  );

  useEffect(() => {
    if (!hasMore && page > 1) return;
    setLoading(true);
    if (page === 1) {
      setInvoiceList([]);
    }
    fetchInvoices(page).finally(() => setLoading(false));
  }, [page, hasMore, fetchInvoices]);

  useEffect(() => {
    fetchInvoices(1).finally(() => setLoading(false));
  }, [dateFilter.startDate, dateFilter.endDate, fetchInvoices]);


   
 useEffect(() => {
  const fetchCollectionRevenue = async () => {
    setLoading(true);
try {
  const response = await apiClient("GET", "/ride_management/collection-revenue");
  console.log("Response", response);
  setData(response.data);
} catch (error) {
  console.error("Error fetching collection revenue", error.response || error.message || error);
} finally {
      setLoading(false);
    }
  };

  fetchCollectionRevenue();
}, []);


const summaryData = data ?[

] : [];


  return (
    // <div className="bg-green-50 min-h-screen p-6">
    <div className="bg-[#f6fcff]  min-h-screen  px-2 ">
      <div className="flex space-x-2 py-2 md:py-2 mb-6  mx-auto">
        <button
          className={`md:px-4 md:py-2 px-2 py-2 rounded-2xl font-medium border ${
            view === "sales"
              ? "bg-gradient-to-r from-[#15803D] to-[#81CA18] text-white border-0"
              : "bg-white text-green-600 border-green-300"
          }`}
          onClick={() => setView("sales")}
        >
          <span className="flex font-nunito md:text-base text-[14px] items-center md:gap-2 gap-1">
            <AiOutlineFileText />
            Sales Invoice
          </span>
        </button>

        <button
          className={`md:px-4 md:py-2 rounded-2xl font-medium border
    px-2 py-1
    ${
      view === "collections"
        ? "bg-gradient-to-r from-[#15803D] to-[#81CA18] text-white border-0"
        : "bg-white text-green-600 border-green-300"
    }`}
          onClick={() => setView("collections")}
        >
          <span className="flex font-nunito md:text-base text-[14px] items-center gap-2 sm:gap-1 sm:text-xs">
            <BsCashStack className="md:text-base" />
            Collections
          </span>
        </button>
      </div>

      {/* Conditional rendering */}
      {view === "collections" && (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mt-4  mx-auto w-full">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className="w-1 h-3 sm:h-6 rounded-md bg-green-700 mr-2 sm:mr-3"></div>
                <h2 className=" text-[16px] md:text-2xl font-bold font-nunito bg-gradient-to-r from-[#15803D] to-[#81CA18] bg-clip-text text-transparent">
                  Collections
                </h2>
              </div>

              <div>
                <button
                  className="bg-gradient-to-r from-[#15803D] to-[#81CA18] font-nunito text-white px-2 md:px-4 py-1 md:py-2 rounded-2xl font-medium shadow flex items-center text-[10px] sm:text-base"
                  onClick={() => setShow(true)}
                >
                  Drivers Dues
                </button>

                {show && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-lg w-[95vw] max-w-[340px] sm:max-w-[650px] h-[330px] sm:h-[500px]">
                      <div className="flex items-center justify-between px-3 pt-4 pb-2 sm:px-6 sm:pt-6 sm:pb-3">
                        <span className="font-bold text-base sm:text-lg">
                          <span className=" font-nunito bg-gradient-to-r from-[#15803D] to-[#81CA18] bg-clip-text text-transparent">
                            Driver Dues
                          </span>
                        </span>
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg p-[2px] bg-gradient-to-r from-[#15803D] to-[#81CA18] shadow">
                          <button
                            className="w-full h-full flex items-center justify-center rounded-lg text-green-700 hover:bg-gray-200 text-base sm:text-xl bg-white"
                            onClick={() => setShow(false)}
                            aria-label="Close"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-2 sm:gap-3 px-3 pb-2 sm:px-6 sm:pb-4">
                        <div className="relative w-1/2">
                          <CiSearch className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-base sm:text-xl" />
                          <input
                            type="text"
                            placeholder="Search by Name"
                            value={nameSearch}
                            onChange={(e) => setNameSearch(e.target.value)}
                            className="w-full border-gray-300 rounded-lg pl-8 sm:pl-10 pr-2 sm:pr-3 py-1 sm:py-1.5 shadow-sm outline-none text-xs sm:text-base"
                          />
                        </div>
                        <div className="relative w-1/2">
                          <FaCarSide className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm sm:text-lg" />
                          <input
                            type="text"
                            placeholder="Search by Cab No."
                            value={cabSearch}
                            onChange={(e) => setCabSearch(e.target.value)}
                            className="w-full border-gray-300 rounded-lg pl-8 sm:pl-10 pr-2 sm:pr-3 py-1 sm:py-1.5 shadow-sm outline-none text-xs sm:text-base"
                          />
                        </div>
                      </div>
                      <div
                        className="px-3 pb-3 sm:px-6 sm:pb-6 overflow-x-auto max-h-[180px] sm:max-h-[340px] overflow-y-auto scroll-smooth scrollbar-hide"
                        style={{
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }}
                      >
                        <table className="w-full text-xs sm:text-sm border-separate [border-spacing:0]">
                          <thead className="sticky top-0 bg-gradient-to-r from-[#18A83E] to-[#B6F162] z-10">
                            <tr>
                              <th className="text-left text-white px-2 py-1 sm:px-3 sm:py-2 rounded-tl-xl font-normal text-xs sm:text-sm">
                                Driver Name
                              </th>
                              <th className="text-left text-white px-2 py-1 sm:px-3 sm:py-2 font-normal text-xs sm:text-sm">
                                Cab Number
                              </th>
                              <th className="text-left text-white px-2 py-1 sm:px-3 sm:py-2 rounded-tr-xl font-normal text-xs sm:text-sm">
                                Cab Type
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredData.map((d, i) => (
                              <tr
                                key={i}
                                className="border-b last:border-0 cursor-pointer hover:bg-gray-200 transition"
                                onClick={() =>
                                  router.push(
                                    "/driverForm/RodBezDriverWallet/1"
                                  )
                                }
                              >
                                <td className="py-1 px-2 sm:py-2 sm:px-3 text-xs sm:text-sm">
                                  {d.driverName}
                                </td>
                                <td className="py-1 px-2 sm:py-2 sm:px-3 text-xs sm:text-sm">
                                  {d.cabNumber}
                                </td>
                                <td className="py-1 px-2 sm:py-2 sm:px-3 text-xs sm:text-sm">
                                  <span className="bg-gray-100 rounded px-2 py-0.5 text-xs sm:text-sm">
                                    {d.cabType}
                                  </span>
                                </td>
                              </tr>
                            ))}
                            {filteredData.length === 0 && (
                              <tr>
                                <td
                                  colSpan={3}
                                  className="py-2 sm:py-4 text-center text-gray-400 text-xs sm:text-base"
                                >
                                  No records found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cards Container */}

<div className="flex w-full gap-4 justify-center px-4 py-4 flex-wrap">
  {[
  {
    label: "Total Collections",
      amount: data.totalCollections || 0,
    color: "",
    gradient: "linear-gradient(135deg, #F8A348 60%, #E87015 100%)", // Orange
  },
  {
    label: "Ride Advance",
        amount: data.rideAdvance || 0,
    color: "",
    gradient: "linear-gradient(135deg, #B4E380 60%, #A2CA71 100%)", // Green
  },
  {
    label: "Operator Advance",
            amount: data.operatorAdvance || 0,
    color: "",
    gradient: "linear-gradient(135deg, #FFEEAD 0%, #F4CE14D2 100%)", // Yellow
  },
  {
    label: "Fare Collections",
        amount: data.fareCollections || 0,
    color: "",
    gradient: "linear-gradient(135deg, #FFEEAD 0%, #FF8A8AD2 100%)", // Red
  },
  {
    label: "Driver Due",
    amount: data.driverDue || 0,
    color: "",
    gradient: "linear-gradient(135deg, #D1E9F6 60%, #7695FF 100%)", // Blue
  },
  {
    label: "Operator Due",
        amount: data.operatorDue || 0,
    color: "",
    gradient: "linear-gradient(135deg, #67C900 60%, #15803D 100%)", // Green
  },
    // ... more cards
  ].map((item, idx) => (
    <CollectionCard key={idx} {...item} />
  ))}
</div>


            {/* Transactions Table Container */}

            <div className="max-w-full bg-white md:p-0 p-2  shadow-md rounded-lg">
              <table className="min-w-full border-collapse block md:table">
                <thead className="hidden md:table-header-group">
                  <tr className="text-left text-gray-600 font-semibold border-b border-gray-300 block md:table-row">
                    <th className="p-1 md:py-4   text-[14px]   block md:table-cell">
                      Transaction ID
                    </th>
                    <th className="p-1 text-[14px]   block md:table-cell">
                      Date and Time
                    </th>
                    <th className="p-1 text-[14px]   block md:table-cell">
                      Amount
                    </th>
                    <th className="p-1 text-[14px]   block md:table-cell">
                      Payment Mode
                    </th>
                    <th className="p-1 text-[14px]   block md:table-cell">
                      Payment Through
                    </th>
                    <th className="p-1 text-[14px]   block md:table-cell">
                      Collection Type
                    </th>
                    <th className="p-1 text-[14px]   block md:table-cell">
                      User Details
                    </th>
                    <th className="p-1 text-[14px]   block md:table-cell">
                      Driver Details
                    </th>
                    <th className="p-1 text-[14px]   block md:table-cell">
                      collected By
                    </th>
                    <th className="p-1 text-[14px]   block md:table-cell">
                      Operator Details
                    </th>
                  </tr>
                </thead>

                <tbody className="block md:table-row-group">
                  {transactions.map(
                    ({
                      id,
                      date,
                      amount,
                      mode,
                      through,
                      type,
                      user,
                      driver,
                      admin,
                      operator,
                    }) => (
                      <tr
                        key={id}
                        className="mb-4 text-sm block md:table-row border-b border-gray-300"
                      >
                        <td
                          className="p-3 md:py-4  font-nunito text-[#15803D] whitespace-nowrap font-semibold hover:underline cursor-pointer block md:table-cell"
                          data-label="Transaction ID"
                        >
                          <div className="flex justify-between md:block">
                            <span className="font-bold  text-gray-500 md:hidden">
                              Transaction ID:
                            </span>
                            <span className="flex items-center gap-2">
                              {id}
                            </span>
                          </div>
                        </td>
                        <td
                          className="p-3 md:1  font-nunito block md:table-cell"
                          data-label="Date and Time"
                        >
                          {/* <div className="flex justify-between md:block">
                            <span className="font-bold  text-gray-500 md:hidden">
                              Date and Time:
                            </span>
                            <span className="  flex items-center gap-2"> */}
                          <div className="flex justify-between md:block">
                            <span className="font-bold text-gray-500 md:hidden">
                              Date and Time:
                            </span>
                            <span className="text-right md:text-left flex flex-col items-end md:items-start">
                              {date}
                            </span>
                          </div>
                        </td>
                        <td
                          className="p-3 md:1  font-nunito text-black block md:table-cell"
                          data-label="Amount"
                        >
                          <div className="flex justify-between md:block">
                            <span className="font-bold text-gray-500 md:hidden">
                              Amount:
                            </span>
                            <span className=" flex items-center font-semibold gap-2">
                              {amount}
                            </span>
                          </div>
                        </td>
                        <td
                          className="md:p-1 p-3  font-nunito block md:table-cell"
                          data-label="Payment Mode"
                        >
                          <div className="flex justify-between md:block">
                            <span className="font-bold text-gray-500 md:hidden">
                              Payment Mode:
                            </span>
                            <span className="flex items-center  gap-2">
                              <span
                                className={`md:px-3 md:py-0.4 px-2 py-0 rounded-xl  ${getPaymentModeClasses(
                                  mode
                                )}`}
                              >
                                {mode}
                              </span>
                            </span>
                          </div>
                        </td>
                        <td
                          className="md:p-1 p-3 font-nunito  block md:table-cell"
                          data-label="Payment Through"
                        >
                          <div className="flex justify-between md:block">
                            <span className="font-bold text-gray-500 md:hidden">
                              Payment Through:
                            </span>
                            <span className="flex items-center gap-2">
                              <span className="border border-gray-200 md:px-2 md:py-0.4 px-1 py-0.3   rounded-xl">
                                {through}
                              </span>
                            </span>
                          </div>
                        </td>
                        <td
                          className="font-nunito md:p-1 p-3  block md:table-cell"
                          data-label="Collection Type"
                        >
                          <div className="flex justify-between md:block">
                            <span className="font-bold text-gray-500 md:hidden">
                              Collection Type:
                            </span>
                            <span className="flex items-center gap-2">
                              <span
                                className={`md:px-3 md:py-0.5 px-1 py-0 md:rounded-3xl rounded-full  border whitespace-nowrap ${getCollectionTypeClasses(
                                  type
                                )}`}
                              >
                                {type}
                              </span>
                            </span>
                          </div>
                        </td>
                        <td
                          className="font-nunito md:p-1 p-3  block md:table-cell"
                          data-label="User Details"
                        >
                          {/* <div className="flex items-center md:block w-full">
                            <span className="font-bold text-gray-500 md:hidden">
                              User:
                            </span>
                            <span className="ml-auto  md:ml-0 text-gray-800"> */}
                          <div className="flex justify-between md:block">
                            <span className="font-bold text-gray-500 md:hidden">
                              User:
                            </span>
                            <span className="text-right md:text-left flex flex-col items-end md:items-start">
                              {user}
                            </span>
                          </div>
                        </td>
                        <td
                          className="font-nunito md:p-1 p-3  block md:table-cell"
                          data-label="Driver Details"
                        >
                          <div className="flex justify-between md:block">
                            <span className="font-bold text-gray-500 md:hidden">
                              Driver Details:
                            </span>
                            <span className="text-right md:text-left flex flex-col items-end md:items-start">
                              {driver}
                            </span>
                          </div>
                        </td>
                        <td
                          className="font-nunito md:p-1 p-3  block md:table-cell"
                          data-label="Admin Details"
                        >
                          <div className="flex justify-between md:block">
                            <span className="font-bold text-gray-500 md:hidden">
                              collected By:
                            </span>
                            <span className="flex items-center  gap-2">
                              {admin}
                            </span>
                          </div>
                        </td>
                        <td
                          className="font-nunito md:p-1 p-3 block md:table-cell"
                          data-label="Operator Details"
                        >
                          <div className="flex justify-between md:block">
                            <span className="font-bold text-gray-500 md:hidden">
                              Operator Details:
                            </span>
                            <span className="flex items-center  gap-2">
                              {operator}
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {view === "sales" && (
        <>
          <div className="bg-white rounded-lg shadow-md mt-4 max-auto w-full  p-6">
            <div className="flex items-center mb-6">
              {/* <div className="w-1 h-6 rounded-md bg-green-700 mr-3"></div> */}
              <div className="w-1 h-3 sm:h-6 rounded-md bg-green-700 mr-2 sm:mr-3"></div>
              <h2 className="md:text-2xl text-[16px] font-bold  font-nunito bg-gradient-to-r from-[#15803D] to-[#81CA18]  bg-clip-text text-transparent">
                Sales Invoice
              </h2>
            </div>
            {/* Summary Cards */}

 <div className="flex w-full gap-4 justify-center px-4 py-4 md:flex-row flex-col opacity-80 overflow-hidden flex-wrap">
  {[
    {
      label: "Total Revenue",
      amount: invoiceDetails?.totalRevenue || 0,
      gradient: "linear-gradient(135deg, #67C900 60%, #15803D 100%)",
      textColor: "text-black",
    },
    {
      label: "Own Fleet",
      amount: invoiceDetails?.ownFleetRevenue || 0,
      gradient: "linear-gradient(135deg, #FFEEAD 0%, #FF8A8AD2 100%)",
      textColor: "text-black",
    },
    {
      label: "Operator Fleet",
      amount: invoiceDetails?.operatorFleetRevenue || 0,
      gradient: "linear-gradient(135deg, #D1E9F6 60%, #7695FF 100%)",
      textColor: "text-black",
    },
    {
      label: "Other Fee",
      amount: invoiceDetails?.otherFeesRevenue || 0,
      gradient: "linear-gradient(135deg, #F8A348 60%, #E87015 100%)",
      textColor: "text-black",
    },
  ].map((item, idx) => (
    <RevenueCard key={idx} {...item} />
  ))}
</div>

            <div className="w-full flex gap-4 justify-end items-center  flex-col sm:flex-row">
              <input
                value={searchURID}
                onChange={(e) => setSearchURID(e.target.value)}
                className="px-4 py-2 rounded-lg focus:outline-none border text-black"
                placeholder="Search Ride ID"
              />

              <DateRangePicker
                onChange={(date) => {
                  setDateFilter({
                    startDate: date.startDate
                      ? moment(date.startDate).format()
                      : null,
                    endDate: date.endDate
                      ? moment(date.endDate).format()
                      : null,
                  });
                }}
              />
            </div>

            {/* Invoice Table */}

            <div className="max-w-full bg-white md:p-0 p-2 mt-5 shadow-md rounded-lg">
              <table className="min-w-full border-collapse block md:table">
                <thead className="hidden md:table-header-group">
                  <tr className="text-left text-gray-600 font-semibold border-b border-gray-300 block md:table-row">
                    <th className="p-1 md:py-4   text-[14px]   block md:table-cell">
                      Invoice ID
                    </th>
                    <th className="p-3 font-semibold block md:table-cell">
                      Ride Id
                    </th>
                    <th className="p-3 font-semibold block md:table-cell">
                      Invoice Type
                    </th>
                    <th className="p-3 font-nunito block md:table-cell">
                      Date
                    </th>
                    <th className="p-3 font-semibold block md:table-cell">
                      HSN Code
                    </th>
                    <th className="p-3 font-semibold block md:table-cell">
                      Amount
                    </th>
                    <th className="p-3 font-semibold block md:table-cell">
                      SGST
                    </th>
                    <th className="p-3 font-semibold block md:table-cell">
                      CGST
                    </th>
                    <th className="p-3 font-semibold block md:table-cell">
                      IGST
                    </th>
                    <th className="p-3 font-semibold block md:table-cell">
                      Total Payout
                    </th>
                  </tr>
                </thead>

                <tbody className="block md:table-row-group">
                  {/* {invoiceData.map( */}
                  {filterInvoiceList.length > 0 &&
                    filterInvoiceList.map((invoice, i) => {
                      const isLastCard = i === filterInvoiceList.length - 1;
                      return (
                        <tr
                          key={invoice.id}
                          ref={isLastCard ? lastCardRef : null}
                          className="border-b"
                        >
                          <td
                            className="block md:table-cell md:w-auto p-3 font-nunito text-[#15803D] font-semibold"
                            data-label="Invoice ID"
                          >
                            <div className="flex justify-between md:block">
                              <span className="font-bold text-gray-500 md:hidden">
                                Invoice ID:
                              </span>
                              <span>{invoice.invoice_id}</span>
                            </div>
                          </td>
                          {/* <td >
                            {invoice.invoice_id}
                          </td> */}

                          <td
                            className="block md:table-cell md:w-auto p-3 font-nunito text-[#15803D] font-semibold"
                            data-label="Invoice ID"
                          >
                            <div className="flex justify-between md:block">
                              <span className="font-bold text-gray-500 md:hidden">
                                Ride Id:
                              </span>
                              <Link
                                href={`/ridesManagement/details?urid=${invoice.ride_id}`}
                                target="_blank"
                                className="hover:underline"
                              >
                                {invoice.ride_id}
                              </Link>
                            </div>
                          </td>
                          {/* <td className="p-2 text-green-700 font-medium">
                            <Link
                              href={`/ridesManagement/details?urid=${invoice.ride_id}`}
                              target="_blank"
                              className="hover:underline"
                            >
                              {invoice.ride_id}
                            </Link>
                          </td> */}

                          <td
                            className="block md:table-cell md:w-auto p-3 font-nunito"
                            data-label="Invoice Type"
                          >
                            <div className="flex justify-between md:block">
                              <span className="font-bold text-gray-500 md:hidden">
                                Invoice Type:
                              </span>
                            </div>
                            <span className="md:px-1 md:py-0.5 px-1 py-0   ">
                              {invoice.invoice_type
                                ? invoice.invoice_type.split("_").join(" ")
                                : "-"}
                            </span>
                          </td>

                          {/* <td className="p-2 text-gray-800 capitalize">
                            {invoice.invoice_type
                              ? invoice.invoice_type.split("_").join(" ")
                              : "-"}
                          </td> */}

                          <td
                            className="block md:table-cell md:w-auto p-3 font-nunito"
                            data-label="Date"
                          >
                            <div className="flex justify-between md:block">
                              <span className="font-bold text-gray-500 md:hidden">
                                Date
                              </span>
                              <span className="text-right md:text-left flex flex-col items-end md:items-start">
                                {invoice.invoice_generate_date
                                  ? moment(invoice.invoice_generate_date).format(
                                      "DD/MM/YYYY"
                                    )
                                  : "-"}
                              </span>
                            </div>
                          </td>
                          {/* <td className="p-2 text-gray-500 ">
                            {invoice.updatedAt
                              ? moment(invoice.updatedAt).format(
                                  "DD/MM/YYYY hh:mm A"
                                )
                              : "-"}
                          </td> */}

                          <td
                            className="block md:table-cell md:w-auto p-3 font-nunito"
                            data-label="HSN Code"
                          >
                            <div className="flex justify-between md:block">
                              <span className="font-bold text-gray-500 md:hidden">
                                HSN Code:
                              </span>
                              <span> {invoice.hsn_code}</span>
                            </div>
                          </td>
                          {/* <td className="p-2 text-gray-500">
                            {invoice.hsn_code}
                          </td> */}

                          <td
                            className="block md:table-cell md:w-auto p-3 font-nunito"
                            data-label="Amount"
                          >
                            <div className="flex justify-between md:block">
                              <span className="font-bold text-gray-500 md:hidden">
                                Amount:
                              </span>
                              <span className="font-semibold">
                                ₹{invoice.taxableValue}
                              </span>
                            </div>
                          </td>
                          {/* <td className="p-2 text-right text-gray-800">
                            ₹{invoice.taxableValue}
                          </td> */}

                          <td
                            className="block md:table-cell md:w-auto p-3 font-nunito"
                            data-label="SGST"
                          >
                            <div className="flex justify-between md:block">
                              <span className="font-bold text-gray-500 md:hidden">
                                SGST:
                              </span>
                              <span>₹{invoice.sgst}</span>
                            </div>
                          </td>
                          {/* <td className="p-2 text-right text-gray-800">
                            ₹{invoice.sgst}
                          </td> */}

                          {/* <td className="p-2 text-right text-gray-800">
                            ₹{invoice.cgst}
                          </td> */}
                          <td
                            className="block md:table-cell md:w-auto p-3 font-nunito"
                            data-label="CGST"
                          >
                            <div className="flex justify-between md:block">
                              <span className="font-bold text-gray-500 md:hidden">
                                CGST:
                              </span>
                              <span> ₹{invoice.cgst}</span>
                            </div>
                          </td>

                          {/* <td className="p-2 text-right text-gray-800">
                            ₹{invoice.igst}
                          </td> */}
                          <td
                            className="block md:table-cell md:w-auto p-3 font-nunito"
                            data-label="IGST"
                          >
                            <div className="flex justify-between md:block">
                              <span className="font-bold text-gray-500 md:hidden">
                                IGST:
                              </span>
                              <span> ₹{invoice.igst}</span>
                            </div>
                          </td>
                          {/* <td className="p-2 text-right text-green-700 font-semibold">
                            ₹{invoice.total_payable_amount}
                          </td> */}
                          <td
                            className="block md:table-cell md:w-auto p-3 font-nunito font-bold text-[#15803D]"
                            data-label="Total Payout"
                          >
                            <div className="flex justify-between md:block">
                              <span className="font-bold text-gray-500 md:hidden">
                                Total Payout:
                              </span>
                              <span>₹{invoice.total_payable_amount}</span>
                            </div>
                          </td>
                          {/* <td className="p-2 text-right text-green-700 font-semibold">₹{invoice.final_collection_by_driver}</td>
                                                      <td className="p-2">
                                                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${invoice.payment_mode ==='online'? "bg-green-100 text-green-700 ": "bg-yellow-100 text-yellow-700 "}`}>{invoice.payment_mode}</span>
                                                      </td> */}
                        </tr>
                      );
                    })}

                  {loading && invoicesList === 0 && (
                    <tr>
                      <td colSpan={11}>
                        <div className="flex justify-center">
                          <CustomLoader />
                        </div>
                      </td>
                    </tr>
                  )}
                  {!hasMore && (
                    <tr>
                      <td colSpan={11}>
                        <div className="text-center text-gray-500 dark:text-gray-400">
                          🚫 No more Revenue data to load
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
