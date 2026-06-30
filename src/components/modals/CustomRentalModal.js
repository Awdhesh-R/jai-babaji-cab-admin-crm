'use client';
import React from 'react';

export default function CustomRentalModal({ onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
            <div className="w-full max-w-2xl bg-white rounded-md shadow-lg p-8 dark:bg-gray-900">
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                    Create Custom Package
                </h2>
                <p className="text-center text-gray-500 mb-6 text-sm dark:text-gray-300">
                    Design your perfect rental experience with flexible timing and routes
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pickup Date */}
                    <div>
                        <label className="text-[12px] font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                            <span>📅</span> Pickup Date
                        </label>
                        <input
                            type="date"
                            className="w-full text-[12px] px-3 py-1.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                            placeholder="dd-mm-yyyy"
                        />
                    </div>

                    {/* Pickup Time */}
                    <div>
                        <label className="text-[12px] font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                            <span>⏰</span> Pickup Time
                        </label>
                        <input
                            type="time"
                            defaultValue="09:00"
                            className="w-full text-[12px] px-3 py-1.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    {/* Drop Date */}
                    <div>
                        <label className="text-[12px] font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                            <span>📅</span> Drop Date
                        </label>
                        <input
                            type="date"
                            className="w-full text-[12px] px-3 py-1.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                            placeholder="dd-mm-yyyy"
                        />
                    </div>

                    {/* Drop Time */}
                    <div>
                        <label className="text-[12px] font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                            <span>⏰</span> Drop Time
                        </label>
                        <input
                            type="time"
                            defaultValue="18:00"
                            className="w-full px-3 py-1.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-[12px]"
                        />
                    </div>
                </div>

                {/* Button */}
                <div className="mt-8">
                    <button
                        className="w-full py-2 rounded-md font-semibold text-white text-center bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition"
                        onClick={() => { onClose() }}
                    >
                        Continue to Vehicle Selection
                    </button>
                </div>
            </div>
        </div>
    );
}
