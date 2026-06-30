"use client";
import React, { useState } from "react";
import {
  FiTool,
  FiUser,
  FiEye,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { BsCalendar } from "react-icons/bs";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { MdOutlineFileDownload } from "react-icons/md";
import InvoiceModal from "./InvoiceModal"; // ✅ import sahi jagah
import { downloadInvoice } from "./DownloadInvoice";

const PRIORITY = {
  High: { color: "#f75555", bg: "bg-[#fff4f4]" },
  Medium: { color: "#5286fa", bg: "bg-[#f3f7ff]" },
  Low: { color: "#31cf6c", bg: "bg-[#e6fff3]" },
};

const STATUS = {
  Settled: {
    color: "#27c48a",
    bg: "bg-[#ebfff7]",
    icon: <FiCheckCircle size={16} />,
  },
  Pending: {
    color: "#ffbe37",
    bg: "bg-[#fffbe8]",
    icon: <FiAlertCircle size={16} />,
  },
};

export default function ServiceCard({ item }) {
  // ✅ useState ab component ke andar
  const [invoiceOpen, setInvoiceOpen] = useState(false);

  return (
    <>
      <div
        className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-purple-400 transform transition hover:scale-[1.02]
                 w-full overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          {/* 🔧 Title & Part */}
          <div className="flex-1 min-w-0 text-[16px]">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="bg-[#e9f1ff] p-2.5 rounded-md shrink-0">
                <FiTool className="text-[#619cf7] text-[18px]" />
              </div>

              <div>
                <div className="font-semibold text-slate-900 truncate">
                  {item.title}
                </div>
                <div className="text-slate-400 mt-1 text-[14px]">
                  Part: {item.part}
                </div>
              </div>
            </div>

            {/* 📅 Date & Priority */}
            <div className="mt-3 flex items-center justify-between md:justify-start md:gap-3">
              <div className="flex items-center gap-2 text-slate-500 text-[14px]">
                <BsCalendar className="text-slate-400" />
                <span>{item.date}</span>
              </div>

              <span
                className={`font-semibold rounded-full px-3 py-1  
                          text-[13px]  
                          ${PRIORITY[item.priority]?.bg || "bg-gray-100"}`}
                style={{ color: PRIORITY[item.priority]?.color || "#374151" }}
              >
                {item.priority}
              </span>
            </div>
          </div>

          {/* 👤 Changed / Approved */}
          <div className="flex-1 min-w-0">
            <div className="text-slate-500 flex items-center gap-2 flex-wrap">
              <FiUser className="text-[14px]" />
              <span className="font-semibold text-slate-700">Changed By:</span>
              <span className="text-slate-600">{item.changedBy}</span>
            </div>

            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <FiCheckCircle className="text-[14px]" />
              <span className="font-semibold text-slate-700">Approved By:</span>
              <span className="text-slate-600">{item.approvedBy}</span>
            </div>
          </div>

          {/* 💰 Amount & Status */}
          <div className="flex flex-col items-end gap-3 min-w-[160px] max-sm:items-start">
            <div className="flex items-center gap-2 text-lg font-bold text-emerald-600 justify-end max-sm:justify-start w-full">
              <LiaRupeeSignSolid />
              <span>₹ {item.amount}</span>
            </div>

            <div
              className={`text-xs font-semibold px-3 py-1 rounded
                        ${STATUS[item.status]?.bg || "bg-gray-100"}`}
              style={{ color: STATUS[item.status]?.color || "#374151" }}
            >
              <div className="flex items-center gap-2 flex-wrap">
                {STATUS[item.status]?.icon}
                <span>{item.status}</span>
              </div>
            </div>
          </div>

          {/* 📝 Description + Buttons */}
          <div className="flex-1 min-w-0 text-[13px]">
            <div className="flex justify-between items-start flex-wrap">
              <div className="w-[70%] max-sm:w-fit">
                <div className="text-blue-500 font-semibold text-sm">
                  Service Description
                </div>
                <div className="mt-2 text-slate-700 bg-slate-50 p-3 rounded-md text-sm sm:p-2">
                  {item.description}
                </div>
              </div>

              {/* 👁 View + Download Buttons Start */}
              <div className="flex flex-row md:flex-col gap-2 mt-3 md:mt-0 items-end">
                <button
                  onClick={() => setInvoiceOpen(true)} // 👁 view opens modal
                  className="flex items-center gap-1 bg-sky-50 text-sky-600 font-semibold text-[12px] rounded-full hover:bg-sky-100 transition px-3 py-1"
                >
                  <FiEye className="text-[13px]" /> View
                </button>

                <button
                  onClick={() => downloadInvoice(item)}
                  className="flex items-center gap-1 bg-emerald-50 text-emerald-600 font-semibold text-[12px] rounded-full hover:bg-emerald-100 transition px-3 py-1"
                >
                  <MdOutlineFileDownload className="text-[13px]" /> Download
                </button>
              </div>
              {/* 👁 View + Download Buttons End */}
            </div>
          </div>
        </div>
      </div>

      {/* 🧾 Invoice Modal — ✅ Ye yahan likhna hai */}
      <InvoiceModal
        isOpen={invoiceOpen}
        onClose={() => setInvoiceOpen(false)}
        data={item}
      />
    </>
  );
}
