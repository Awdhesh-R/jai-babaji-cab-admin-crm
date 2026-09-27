'use client';
import React from 'react';
import { FiX, FiCheckCircle } from 'react-icons/fi';
import { BsExclamationTriangle, BsSend } from "react-icons/bs";
import { LuMessageSquare, LuMessageCircle } from "react-icons/lu";


const UpdateDetailsModal = ({ isOpen, title, onClose, onSubmit, children, modalAction, payStatus, isSubmitting }) => {
  const colorConfig = {
    'confirm_ride': {
      border: 'border-blue-600',
      iconBg: 'bg-blue-500',
      gradient: 'from-blue-100 to-blue-50',
      submitBtn: 'bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500',
      label: payStatus === 'processing' ? 'Proceed To Payment' :'Confirm Ride',
    },
    'cancel_request': {
      border: 'border-red-600',
      iconBg: 'bg-red-500',
      gradient: 'from-red-100 to-red-50',
      submitBtn: 'bg-red-600 hover:bg-red-700',
      label: 'Cancel Request',
    },
    'add_remarks': {
      border: 'border-yellow-500',
      iconBg: 'bg-yellow-500',
      gradient: 'from-yellow-100 to-yellow-50',
      submitBtn: 'bg-yellow-500 hover:bg-yellow-600',
      label: 'Save Remarks',
    },
    'whatsapp_chat': {
      border: 'border-[#22C55E]',
      iconBg: 'bg-[#22C55E]',
      gradient: 'from-green-100 to-green-50',
      submitBtn: 'bg-[#22C55E] hover:bg-[#22C55E]',
      label: 'Send Message',
    },
  };

  if (!isOpen) return null;

  const { border, iconBg, gradient, submitBtn, label } = colorConfig[modalAction] || colorConfig['confirm_ride'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className={`w-full max-w-3xl bg-white dark:bg-gray-900 rounded-md shadow-xl relative border-t-8 ${border}`}>

        <div className={`flex items-start gap-4 border-b px-6 py-4 bg-gradient-to-r ${gradient} rounded-t-md`}>
          <div className={`flex-shrink-0 ${iconBg} rounded-md p-2`}>
            {modalAction === 'confirm_ride' && (<FiCheckCircle className="text-white text-2xl" />)}
            {modalAction === 'cancel_request' && (<BsExclamationTriangle className="text-white text-2xl" />)}
            {modalAction === 'add_remarks' && (<LuMessageSquare className="text-white text-2xl" />)}
            {modalAction === 'whatsapp_chat' && (<LuMessageCircle className="text-white text-2xl" />)}
          </div>

          <div className="flex-grow">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
            {modalAction === 'confirm_ride' && (<p className="text-sm text-gray-600">Complete the ride details and confirm the booking.</p>)}
            {modalAction === 'cancel_request' && (<p className="text-sm text-gray-600">Please provide a reason for cancelling this ride request.</p>)}
            {modalAction === 'add_remarks' && (<p className="text-sm text-gray-600">Add notes and update ride information.</p>)}
            {modalAction === 'whatsapp_chat' && (<p className="text-sm text-gray-600">Send a WhatsApp message to the customer.</p>)}
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-red-500 text-xl font-bold"><FiX /></button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto scroll-hide px-6 py-4">{children}</div>

        <div className="flex justify-end gap-4 px-6 py-4 border-t relative">
          <button onClick={onClose} disabled={isSubmitting} className="px-6 py-2 flex-1 rounded-lg border border-[#E5E7EB] text-black hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {modalAction === 'cancel_request' ? 'Keep Request' : 'Cancel'}
          </button>

          <button onClick={onSubmit} disabled={isSubmitting} className={`px-6 py-2 flex-1 rounded-lg text-white font-medium transition ${submitBtn} disabled:opacity-50 disabled:cursor-not-allowed`}>
            {isSubmitting ? 'Processing...' : label}
          </button>
          <div className='absolute left-[63%] bottom-7 z-12'>{modalAction === 'whatsapp_chat' && (<BsSend className='text-white text-lg font-bold' />)}</div>
        </div>
      </div>
    </div>
  );
};

export default UpdateDetailsModal;