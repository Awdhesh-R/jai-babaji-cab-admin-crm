"use client";
import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function InvoiceModal({ isOpen, onClose, data }) {
  const invoiceRef = useRef();

  if (!isOpen) return null;

  // 🧾 PDF Download Function
  const handleDownload = async () => {
    const element = invoiceRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${data.title || "invoice"}.pdf`);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl p-3 md:p-6 w-full max-w-[750px] shadow-2xl"
      >
        {/* 🧾 Invoice Layout */}
        <div
          ref={invoiceRef}
          className="border border-gray-200 rounded-lg p-4 text-slate-800"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-blue-500">
                rodYaan Auto Services
              </h1>
              <p className="text-gray-500 text-sm">
                Bihar, India • support@jaibabajicab.com
              </p>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-semibold text-blue-500">Invoice</h3>
              <p className="text-gray-500 text-sm">Date: {data.date}</p>
            </div>
          </div>

          <hr className="border-blue-500 mb-6" />

          {/* Service Info */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[15px] leading-relaxed text-gray-700">
            <p>
              <strong >Service Name:</strong> {data.title}
            </p>
            <p>
              <strong>Part Used:</strong> {data.part}
            </p>
            <p>
              <strong>Priority:</strong> {data.priority}
            </p>
            <p>
              <strong>Status:</strong> {data.status}
            </p>
            <p>
              <strong>Changed By:</strong> {data.changedBy}
            </p>
            <p>
              <strong>Approved By:</strong> {data.approvedBy}
            </p>
          </div>

          {/* Description */}
          <div className="mt-6 bg-gray-50 border border-gray-200 p-4 rounded-md">
            <p className="font-semibold text-gray-800">Description:</p>
            <p className="text-gray-600 mt-1 leading-relaxed text-[15px]">
              {data.description}
            </p>
          </div>

          {/* Total Section */}
          <div className="mt-8 flex justify-end">
            <div className="text-right">
              <h3 className="text-green-600 text-lg font-semibold">
                Total Amount
              </h3>
              <h2 className="text-2xl font-bold text-green-700">
                ₹ {data.amount}
              </h2>
            </div>
          </div>

          {/* Footer */}
          <hr className="my-6 border-gray-200" />
          <p className="text-center text-gray-500 text-xs leading-snug">
            Thank you for choosing{" "}
            <span className="font-semibold text-slate-700">
              rodYaan Auto Services
            </span>
            . <br />
            This invoice was generated automatically and does not require a
            signature.
          </p>
        </div>

        {/* 🔘 Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            ⬇ Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
