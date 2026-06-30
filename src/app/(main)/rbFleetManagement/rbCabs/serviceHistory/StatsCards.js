"use client";
import React from "react";
import {
  IoSettingsOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import { RiErrorWarningLine } from "react-icons/ri";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { FiTrendingUp } from "react-icons/fi";

export default function StatsCards() {
  const cards = [
    {
      id: 1,
      title: "Total Services",
      value: "5",
      icon: <IoSettingsOutline size={32} className="opacity-90" />,
      gradient: "from-[#4c84ff] to-[#6a5af9]",
    },
    {
      id: 2,
      title: "Pending Amount",
      value: "7,700",
      icon: <RiErrorWarningLine size={32} className="opacity-90" />,
      gradient: "from-[#ff9b44] to-[#ff6a00]",
    },
    {
      id: 3,
      title: "Settled Amount",
      value: "2,650",
      icon: <IoCheckmarkCircleOutline size={32} className="opacity-90" />,
      gradient: "from-[#3fd57d] to-[#0ea55b]",
    },
    {
      id: 4,
      title: "Avg. Cost",
      value: "2070",
      icon: <LiaRupeeSignSolid size={32} className="opacity-90" />,
      gradient: "from-[#a65efb] to-[#ff3ea5]",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-6">
      {cards.map((c) => (
        <div
          key={c.id}
          className={`relative rounded-2xl text-white overflow-hidden p-6 bg-gradient-to-br ${c.gradient} hover:scale-[1.03] transition-transform duration-300`}
        >
          {/* 📈 Arrow BELOW the circle */}
          <div className="absolute top-14 right-5 z-[1] opacity-80">
            <FiTrendingUp size={18} />
          </div>

          {/* 🔵 Circle reflection ABOVE arrow, with clipping */}
          <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-full translate-x-8 -translate-y-8 z-[2] pointer-events-none">
            <div className="w-full h-full bg-white/20 rounded-full"></div>
          </div>

          {/* 🧩 Content */}
          <div className="relative z-[5] flex flex-col justify-between h-full">
            {/* Main icon */}
            <div className="text-white/90 mb-2">{c.icon}</div>

            {/* Value */}
            <div className="text-3xl font-bold tracking-tight leading-snug">
              {c.value}
            </div>

            {/* Label */}
            <div className="text-sm font-medium opacity-90 mt-1">
              {c.title}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
