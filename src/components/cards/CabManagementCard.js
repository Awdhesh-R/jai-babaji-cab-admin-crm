'use client';
import React from 'react';
import { FaMapMarkerAlt, FaCarSide, FaPhone, FaUsers, FaLuggageCart, FaClock, FaArrowCircleRight, FaPhoneAlt, FaTaxi, FaUserTie, FaRupeeSign } from 'react-icons/fa';
import { SiTicktick } from "react-icons/si";
import { BsLink, BsArrowRightCircle } from "react-icons/bs";
import { MdEdit } from 'react-icons/md';
import Image from 'next/image';


const CabManagementCard = ({ title, actions = [] }) => {

    return (
        <div className="flex flex-col w-full px-4 mt-4">
            <div className="w-full mb-6 flex justify-between items-center">
                <div className="text-left border-l-4 border-blue-500 pl-4 flex gap-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
                    {/* <div className="flex items-center flex-wrap gap-2">
                        {subtitle.map((action, i) => (
                            <button
                                key={i}
                                className={`${action.customColor || `bg-${action.color}-600 hover:bg-${action.color}-700`} font-normal px-2 rounded-md shadow text-[12px]`}
                            >
                                {action.label}
                            </button>
                        ))}
                    </div> */}
                </div>
                <div className="flex items-center flex-wrap gap-2">
                    {actions.map((action, i) =>
                        action.isCustom ? (
                            <div key={i}>{action.element}</div>
                        ) : (
                            <button
                                key={i}
                                // onClick={action.onClick}     
                                className={`font-medium`}
                            >
                                <span className='text-gray-500'>{action.label} : {action.value}</span>
                            </button>
                        )
                    )}
                </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-[2%]">
                {[...Array(10)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 w-full sm:w-[48%] md:w-[31%] lg:w-[19%] relative hover:scale-[1.02] transition-all duration-300 mb-[2%]"
                    >
                        {/* Profile Image */}
                        <div className="flex justify-center -mt-16 mb-2">
                            <Image
                                src="/images/kumar.jpg"
                                alt="Driver"
                                width={100}
                                height={100}
                                className="rounded-full border-4 border-white dark:border-gray-800 shadow-md"
                            />
                        </div>

                        {/* Driver Info */}
                        <div className="text-center text-gray-800 dark:text-gray-100 mb-4">
                            <h2 className="text-lg font-semibold">VISHWASH KUMAR GUPTA</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">8860132608 (Saharsa)</p>
                        </div>

                        {/* Car Info Grid */}
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-200 border-t pt-4 border-gray-200 dark:border-gray-600">
                            <div>
                                <p className="font-semibold">Mfg Year:</p>
                                <p>2024</p>
                            </div>
                            <div>
                                <p className="font-semibold">Type:</p>
                                <p>Sedan</p>
                            </div>
                            <div>
                                <p className="font-semibold">Reg. No:</p>
                                <p>BR01AB007</p>
                            </div>
                            <div>
                                <p className="font-semibold">Fuel:</p>
                                <p>CNG</p>
                            </div>
                            <div>
                                <p className="font-semibold">Rides:</p>
                                <p>650</p>
                            </div>
                            <div>
                                <p className="font-semibold">Carrier:</p>
                                <p>No</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CabManagementCard;