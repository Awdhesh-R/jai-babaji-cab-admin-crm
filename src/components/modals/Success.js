'use client';
import { useState } from 'react';
import { FiCheck } from 'react-icons/fi';

const Success = ({ isOpen, onClose, info }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-xl w-[320px] text-center p-6 relative">
                <button
                    className="absolute top-3 right-4 text-gray-400 hover:text-gray-600"
                    onClick={onClose}
                >
                    &#x2715;
                </button>

                <div className="flex items-center justify-center mb-4">
                    <div className="bg-green-100 p-3 rounded-full">
                        <FiCheck className="text-green-500 text-2xl" />
                    </div>
                </div>

                <h2 className="text-lg font-semibold text-gray-800 mb-1">Success!</h2>
                <p className="text-sm text-gray-600 mb-6">{info?.message}</p>

                <button
                    onClick={onClose}
                    className="w-full bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition"
                >
                    Continue
                </button>
            </div>
        </div>
    )
}

export default Success