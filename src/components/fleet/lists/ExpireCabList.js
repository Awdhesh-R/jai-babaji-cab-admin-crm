import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { CiLocationOn } from "react-icons/ci";
import { BsExclamationTriangle } from "react-icons/bs";
import { FiAlertTriangle, FiEdit } from 'react-icons/fi';
import { ChevronDown } from 'lucide-react';
import EditDocumentModal from '../modals/EditDocumentModal';

const fleetData = [
    {
        name: 'Abhishek kumar',
        phone: '+91 9876543210',
        cabs: 25,
        drivers: 30,
        image: '/images/kumar.jpg',
        city: 'Saharsa'
    },
    {
        name: 'Royal Riders',
        phone: '+91 8765432109',
        cabs: 18,
        drivers: 22,
        image: '/images/Murari.jpg',
        city: 'Saharsa'
    },
    {
        name: 'Swift Movers',
        phone: '+91 7654321098',
        cabs: 35,
        drivers: 42,
        image: '/images/kumar.jpg',
        city: 'Saharsa'
    },
    {
        name: 'City Express',
        phone: '+91 6543210987',
        cabs: 20,
        drivers: 25,
        image: '/images/Murari.jpg',
        city: 'Saharsa'
    },
    {
        name: 'Blue Star Fleet',
        phone: '+91 9876543210',
        cabs: 25,
        drivers: 30,
        image: '/images/kumar.jpg',
        city: 'Saharsa'
    },
    {
        name: 'Abhishek kumar',
        phone: '+91 9876543210',
        cabs: 25,
        drivers: 30,
        image: '/images/kumar.jpg',
        city: 'Saharsa'
    },
    {
        name: 'Royal Riders',
        phone: '+91 8765432109',
        cabs: 18,
        drivers: 22,
        image: '/images/Murari.jpg',
        city: 'Saharsa'
    },
    {
        name: 'Swift Movers',
        phone: '+91 7654321098',
        cabs: 35,
        drivers: 42,
        image: '/images/kumar.jpg',
        city: 'Saharsa'
    },
    {
        name: 'City Express',
        phone: '+91 6543210987',
        cabs: 20,
        drivers: 25,
        image: '/images/Murari.jpg',
        city: 'Saharsa'
    },
    {
        name: 'Blue Star Fleet',
        phone: '+91 9876543210',
        cabs: 25,
        drivers: 30,
        image: '/images/kumar.jpg',
        city: 'Saharsa'
    },
    {
        name: 'Abhishek kumar',
        phone: '+91 9876543210',
        cabs: 25,
        drivers: 30,
        image: '/images/kumar.jpg',
        city: 'Saharsa'
    },
    {
        name: 'Royal Riders',
        phone: '+91 8765432109',
        cabs: 18,
        drivers: 22,
        image: '/images/Murari.jpg',
        city: 'Saharsa'
    },
    {
        name: 'Swift Movers',
        phone: '+91 7654321098',
        cabs: 35,
        drivers: 42,
        image: '/images/kumar.jpg',
        city: 'Saharsa'
    },
    {
        name: 'City Express',
        phone: '+91 6543210987',
        cabs: 20,
        drivers: 25,
        image: '/images/Murari.jpg',
        city: 'Saharsa'
    },
    {
        name: 'Blue Star Fleet',
        phone: '+91 9876543210',
        cabs: 25,
        drivers: 30,
        image: '/images/kumar.jpg',
        city: 'Saharsa'
    },
    {
        name: 'City Express',
        phone: '+91 6543210987',
        cabs: 20,
        drivers: 25,
        image: '/images/Murari.jpg',
        city: 'Saharsa'
    },
];

const data = new Array(20).fill({
    cabId: 'CAB001',
    type: 'Insurance',
    name: 'John Doe',
    expiryDate: '2025-08-15',
    status: 'Expiring Soon',
});

const ExpireCabList = () => {

    const [filter, setFilter] = useState('Expiring Soon');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const goToDetail = () => {
        router.push('/fleetManagement/fleetDetails');
    };

    return (
        <div className="border border-[#ACCFFF] rounded-md p-4 bg-[#F3F4F6] dark:bg-gray-900 shadow">
            <div className="rounded-md bg-[#FFF7ED] shadow-lg pb-1">
                <div className="flex items-center justify-between bg-[#FFEDD5] flex-wrap gap-4 mb-6 p-4 rounded-t-md border-b-2 border-[#FED7AA]">
                    <div className="flex items-center gap-2">
                        <BsExclamationTriangle className='text-[#EA580C] text-lg font-bold' />
                        <h2 className="text-[18px] font-semibold text-[#9A3412]">Cab Documents Are Expired Soon!</h2>
                    </div>
                </div>
                <div className="w-full bg-[#FFFAF2] px-4">
                    <div className="flex items-center justify-between ">
                        <div className="relative inline-block w-[180px]">
                            <button className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 flex justify-between items-center shadow-sm hover:border-gray-400 transition">
                                {filter}
                                <ChevronDown className="w-4 h-4 ml-2" />
                            </button>
                        </div>

                        <input
                            type="text"
                            placeholder="Search documents..."
                            className="w-[280px] bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-300"
                        />
                    </div>
                </div>
                <div className="min-h-screen bg-[#FFF7ED] py-4 px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {data.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white border border-orange-100 rounded-md p-4 shadow-sm hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-1">
                                    <FiAlertTriangle className="text-orange-500" />
                                    <span>{item.cabId} - {item.type}</span>
                                </div>
                                <p className="text-gray-600 text-sm"> {item.name}</p>
                                <p className="text-gray-600 text-sm mt-1">
                                    Expiry Date: <span className="font-medium">{item.expiryDate}</span>
                                </p>
                                <p className="text-sm mt-1">
                                    Status: <span className="text-orange-600 text-[12px] font-semibold">{item.status}</span>
                                </p>
                                <div className="flex justify-end items-center mt-4 gap-4">
                                    <button className="text-sm text-orange-500 border border-orange-300 px-2 py-[4px] rounded-md hover:bg-orange-50 transition">
                                        View
                                    </button>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        <FiEdit className="text-gray-500 hover:text-gray-800 cursor-pointer" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end mx-6 mb-4">
                    <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-full hover:bg-blue-50 transition">
                        Show More..
                    </button>
                </div>
            </div>
            <EditDocumentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    )
}

export default ExpireCabList