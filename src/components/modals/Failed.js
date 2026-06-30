'use client';
import { useState } from 'react';
import { FiXCircle } from 'react-icons/fi';

const Failed = ({ isOpen, onClose, onRetry, info }) => {
    if (!isOpen) return null;

    console.log("===",info);
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center relative">
                {/* <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                    onClick={onClose}
                >
                    &times;
                </button> */}

                <div className="flex items-center justify-center mb-4">
                    <div className="bg-red-100 rounded-full p-3">
                        <FiXCircle className="text-red-500 text-3xl" />
                    </div>
                </div>

                <h2 className="text-lg font-semibold text-gray-900">{info?.message}</h2>
                {/* <p className="text-sm text-gray-600 mt-1">{info?.message}</p> */}

                <div className="mt-6 flex justify-center gap-3">
                    <button
                        className="px-6 py-2 rounded-md bg-gray-200 text-gray-700 text-sm hover:bg-gray-300"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-6 py-2 rounded-md bg-red-500 text-white text-sm hover:bg-red-600"
                        onClick={onRetry}
                    >
                        Retry
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Failed