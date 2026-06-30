"use client";

import React, { useEffect, useState } from "react";

const PaymentModal = ({ open, onClose, amount, invoiceType, showOtpField, processing, verifyOtp, onPaymentSuccess, onSubmitClick }) => {
  const [otp, setOtp] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null); // 'online' or 'cash'
  const [cashAmount, setCashAmount] = useState(0);

  const [onlineGateway, setOnlineGateway] = useState("");
  const [otpSent, setOtpSent] = useState(showOtpField); // Simulate OTP sent for demo

  useEffect(()=>{
    setOtpSent(showOtpField);
  }, [showOtpField])

  useEffect(() => {
    setPaymentMethod("online");
  }, [open]);

  if (!open) return null;

  const onlineAmount = Math.max(amount - cashAmount, 0);

  const handleConfirmPayment = () => {
    if (onPaymentSuccess) {
      onPaymentSuccess();
    }
  };

  const handleClose = () => {
    setOtp("");
    setPaymentSuccess(false);
    setPaymentMethod(null);
    setCashAmount(0);
    onClose();
  };
  const handleSubmit = () => {
    console.log("submit clicked", {paymentMethod, onlineAmount, cashAmount, amount});
    onSubmitClick(paymentMethod, {onlineAmount: (onlineAmount || 0), cashAmount: (cashAmount || 0), finalAmount: amount}, invoiceType);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm px-2"
      // onClick={handleClose}
    >
      <div
        className="
      bg-white
      rounded-md sm:rounded-xl
      shadow-md sm:shadow-lg
      py-2 px-2 sm:py-8 sm:px-8
      w-[87vw] max-w-[200px] sm:w-full sm:max-w-lg
      relative
    "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-green-100 text-green-700 text-[12px] md:text-2xl font-bold rounded mb-2 sm:mb-4 py-1 sm:py-4 text-center">
          Final Amount: ₹{amount}
        </div>
        <div className="flex mb-2 sm:mb-6 text-xs sm:text-sm font-medium text-gray-700 gap-1 sm:gap-2">
          {/* Online Payment Option */}
          <label
            className={`flex-1 cursor-pointer border rounded p-1  sm:rounded-lg sm:p-3 flex flex-col items-center gap-1 ${
              paymentMethod === "online"
                ? "border-blue-500 ring-1 ring-blue-500"
                : "border-gray-300"
            }`}
            onClick={() => {
              setPaymentMethod("online");
              setCashAmount(0);
            }}
          >
            <div className="flex items-center gap-1 w-full justify-center text-[8px] sm:text-lg">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "online"}
                readOnly
                className="md:w-5 md:h-5 w-2 h-2"
              />
              Online Payment
            </div>
          </label>
          {/* Cash Payment Option */}
          <label
            className={`flex-1 cursor-pointer border rounded p-1 sm:rounded-lg sm:p-3 flex flex-col items-center gap-1 ${
              paymentMethod === "cash"
                ? "border-blue-500 ring-1 ring-blue-500"
                : "border-gray-300"
            }`}
            onClick={() => {
              setPaymentMethod("cash");
              setCashAmount(amount);
            }}
          >
            <div className="flex items-center gap-1 w-full justify-center text-[8px] sm:text-lg">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "cash"}
                readOnly
                className="md:w-5 md:h-5 w-2 h-2"
              />
              Cash Payment
            </div>
            
          </label>
        </div>
        <div>
          {paymentMethod === "online" && ( <>
            <div className="flex items-center gap-2 justify-between text-gray-700 text-[8px] sm:text-base mb-1 sm:mb-3">
              <span>Payable Amount:</span>
              <span>{` ₹${amount} `}</span>
            </div>
            {invoiceType !== "regular" && <div className="w-full flex flex-col gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <label className="text-gray-700 text-xs sm:text-sm">Select Payment Gateway</label>

                <select
                  value={onlineGateway}
                  onChange={(e) => setOnlineGateway(e.target.value)}
                  className="border-2 border-green-500 p-2 rounded text-xs sm:text-sm w-full"
                >
                  <option value="">Choose Method</option>
                  <option value="qr">QR Code</option>
                  <option value="upi">UPI ID</option>
                </select>
              </div>

              {onlineGateway === "qr" && (
                <div className="flex flex-col justify-center items-center border-2 border-dashed rounded-xl p-4">
                  <img
                    src="/images/qr.png"
                    alt="QR Code"
                    className="w-48 h-48 object-contain mb-3 border rounded-lg p-2 shadow-sm"
                  />

                  <button className="bg-green-600 text-white px-4 py-2 rounded-md text-xs sm:text-sm">
                    Pay Now
                  </button>

                  <p className="text-[10px] sm:text-xs text-gray-600 mt-2 text-center">
                    Scan this QR Code to complete payment
                  </p>
                </div>
              )}

              {onlineGateway === "upi" && (
                <div className="text-center text-sm text-gray-700 font-medium">
                  UPI ID: <span className="font-bold">7644895292@kotak</span>
                </div>
              )}
            </div>}
          </>
          )}
          {paymentMethod === "cash" && (
            <div className="flex flex-col gap-2 text-gray-700 text-[8px] sm:text-base mb-1 sm:mb-3">
              <div className="flex items-center gap-2 justify-between">
                <span>Online Amount:</span>
                <span>{` ₹${amount-cashAmount} `}</span>
              </div>
              <div className="flex items-center gap-2 justify-between">
                <span>Cash Amount:</span>
                <div className="flex items-center gap-2 w-1/3">
                  ₹<input
                    type="number"
                    min={0}
                    max={amount}
                    disabled={processing || otpSent}
                    value={cashAmount}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (val === "") {
                        setCashAmount("");
                        return;
                      }
                      val = Number(val);
                      if (isNaN(val) || val < 0) val = 0;
                      if (val > amount) val = amount;
                      setCashAmount(val);
                    }}
                    className="border border-gray-300 rounded p-1 text-right w-full mt-1 text-[8px] sm:text-sm"
                    placeholder="Enter cash amount"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            </div>
            )}
        </div>
        {/* <div className="mb-1 sm:mb-3">
          <textarea
            placeholder="Add any remarks..."
            className="w-full border border-gray-300 rounded p-1  sm:rounded-lg sm:p-3 resize-none text-[8px] sm:text-sm"
            rows={2}
          />
        </div> */}
        {otpSent && <div className="bg-blue-50 p-1 sm:p-4 rounded sm:rounded-lg">
          <div className="text-blue-700 font-semibold text-center mb-1 sm:mb-2 text-[8px] sm:text-base">
            Enter OTP
          </div>
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="text-center border border-blue-400 rounded p-1 sm:rounded-md sm:p-2 w-full mb-1 sm:mb-2 text-[8px] sm:text-base"
            placeholder="Enter 6 - digit OTP"
          />
          <div className="flex justify-between mb-1 sm:mb-2 px-1 sm:px-2">
            <button
              type="button"
              className="text-blue-600 underline text-[8px] sm:text-xs "
              onClick={() => alert("OTP resent!")}
            >
              Resend OTP
            </button>
          </div>
          <button
            type="button"
            disabled={otp.length !== 6 || paymentMethod === null}
            onClick={()=>{verifyOtp(otp, invoiceType)}}
            className={`w-full py-1 sm:py-3 rounded text-white font-semibold flex justify-center items-center gap-2 text-[8px] sm:text-base ${
              otp.length === 6 && paymentMethod
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            ✔ Verify &amp; Confirm Payment
          </button>
        </div>}

        {!otpSent && <button
          type="button"
          disabled={processing || paymentMethod === null || (paymentMethod === "cash" && (cashAmount < 0 || cashAmount > amount)) || (paymentMethod === "online" && amount <= 0)}
          onClick={()=>{handleSubmit();}}
          className={`w-full py-1 sm:py-3 border bg-brand-yellowDetail1 rounded text-gray-500 font-semibold flex justify-center items-center gap-2`}
        >
          Proceed
        </button>}
        <button
          type="button"
          className="absolute top-1 right-2 text-gray-500 text-lg sm:text-2xl font-semibold"
          onClick={handleClose}
          aria-label="Close payment modal"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
