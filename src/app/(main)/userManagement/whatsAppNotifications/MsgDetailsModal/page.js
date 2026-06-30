

 "use client";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { apiClient } from "@/app/lib/apiClient";

export default function MessageDetailsModal({ open, onClose, data, showToast }) {
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const isFailed = data?.status === "failed";


  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";

    return () => (document.body.style.overflow = "auto");
  }, [open]);


 const handleSendNow = async () => {
  if (!data?.urid) return;
  setLoading(true);
  setApiResponse(null);

  try {
    const res = await apiClient(
      "GET",
      `/rbWaTemplate/send-wa-templates/${data.urid}`
    );

    setApiResponse(res);

    if (res?.success) {
      showToast({
        show: true,
        type: "success",
        message: "Message sent successfully!",
      });

      setTimeout(() => showToast({ show: false }), 2000);
      onClose();
    } else {
      showToast({
        show: true,
        type: "error",
        message: "Failed to send message!",
      });

      setTimeout(() => showToast({ show: false }), 2000);
    }
  } catch (err) {
    showToast({
      show: true,
      type: "error",
      message: "API Error!",
    });

    setTimeout(() => showToast({ show: false }), 2000);
  }

  setLoading(false);
};


  return (
    <div
      className={`${open ? "fixed" : "hidden"} inset-0 bg-black/40 flex items-center justify-center z-50`}
    >
      {data && (
        <div className="w-[95%] max-w-sm bg-white rounded-xl shadow-xl overflow-hidden">

          {/* HEADER */}
          <div
            className={`p-4 flex justify-between items-center 
              ${isFailed ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}
          >
            <h2 className="text-lg font-semibold">Message Details</h2>
            <button onClick={onClose} className="text-xl">
              <IoClose />
            </button>
          </div>

          {/* BODY */}
          <div className="p-5 space-y-">

            {/* ID */}
            <p className="text-sm text-gray-600">
              <span className="font-semibold">ID:</span> {data.id}
            </p>

            {/* Resend Option */}
            <div>
              <label className="text-sm font-medium">Resend Option</label>
              <select className="w-full mt-1 p-2 border rounded-lg">
                <option value="now">Send Immediately</option>
                <option value="5">Retry after 5 minutes</option>
                <option value="30">Retry after 30 minutes</option>
              </select>
            </div>

            {/* Current Status */}
            <div className="space-y-2">
              <p className="font-medium">Current Status</p>

              <span
                className={`px-3 py-1 rounded-full text-xs ${
                  isFailed
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {data.status}
              </span>

              {isFailed && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  <p className="font-medium">Failure Reason</p>
                  <p>Phone number invalid or not registered on WhatsApp.</p>
                </div>
              )}
            </div>

            {/* PAYLOAD DATA */}
            <div>
              <p className="font-medium mb-1">Payload Data</p>

              <pre
                className="
                bg-[#0d1117] text-white p-4 rounded-lg text-xs
                max-h-64 overflow-y-auto whitespace-pre-wrap break-all
              "
              >
                {JSON.stringify(data.wa_template_payload_message_json, null, 2)}
              </pre>
            </div>

            {/* API RESPONSE BOX */}
            {/* {apiResponse && (
              <div className="p-3 bg-gray-100 border rounded text-sm">
                <p className="font-semibold">API Response:</p>
                <pre className="text-xs mt-2">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </div>
            )} */}
          </div>

          {/* FOOTER BUTTONS */}
          <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Close
            </button>

            <button
              disabled={loading}
              onClick={handleSendNow}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              {loading ? "Sending..." : "Send Now"}
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
