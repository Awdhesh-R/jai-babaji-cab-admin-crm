'use client'
import { apiClient } from "@/app/lib/apiClient";
import { useEffect, useState, useRef } from "react";
import { FaBell, FaCaretDown } from "react-icons/fa";

const statusColors = {
    pending: 'bg-[#FFC107]  text-white',
    taxiPool: 'bg-[#03A9F4] text-white',
    confirmed: 'bg-[#009688] text-white',
    assigned: 'bg-[#3F51B5] text-white',
    arrived: 'bg-[#673AB7] text-white',
    started: 'bg-[#1B59F8] text-white',
    completed: 'bg-[#16A34A] text-white',
    cancelled: 'bg-[#F44336] text-white',
    cabFound: 'bg-[#8BC34A] text-white',
    needCab: 'bg-[#FF9800] text-white',
    cancellation: 'bg-[#E57373] text-white',
    linkSent: 'bg-[#00BCD4] text-white',
    all: 'bg-[#9E9E9E] text-white',
    notVerified: 'bg-[#FFB300] text-white',
    activeRides: 'bg-[#1E88E5] text-white',
};

const statusTextColors = {
    pending: 'text-[#FFC107]',
    taxiPool: 'text-[#03A9F4]',
    confirmed: 'text-[#009688]',
    assigned: 'text-[#3F51B5]',
    arrived: 'text-[#673AB7]',
    started: 'text-[#1B59F8]',
    completed: 'text-[#16A34A]',
    cancelled: 'text-[#F44336]',
    cabFound: 'text-[#8BC34A]',
    needCab: 'text-[#FF9800]',
    cancellation: 'text-[#E57373]',
    linkSent: 'text-[#00BCD4]',
    all: 'text-[#9E9E9E]',
    notVerified: 'text-[#FFB300]',
    activeRides: 'text-[#1E88E5]',
};

export default function Remarks({ rideDetails, actData, genTemplates, canTemplates }) {
    const [selectedCancelTemplate, setSelectedCancelTemplate] = useState("");
    const [selectedWhatsappTemplate, setSelectedWhatsappTemplate] = useState("");
    const [remark, setRemark] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [showContent, setShowContent] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showDropdown1, setShowDropdown1] = useState(false);
    // const [activityData, setActivityData] = useState([]);
    // const [cancelTemplates, setCancelTemplates] = useState([]);
    // const [generalTemplates, setGeneralTemplates] = useState([]);
    const [selectedRemark, setSelectedRemark] = useState('');

    const dropdownRef = useRef();
    const cancelRef = useRef();

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    //RIDE ACTIVITY HISTORY
    // useEffect(() => {
    //     const rideActivityHistory = async () => {
    //         try {
    //             const response = await apiClient('POST', '/ride_management/rideActivityHistory', JSON.stringify({ urid: rideDetails?.urid }), true);
    //             if (response?.success) {
    //                 setActivityData(response?.data);
    //             }
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };
    //     rideActivityHistory();
    // }, [rideDetails?.urid]);

    // CANCEL WHATSAPP TEMPLATES 
    // useEffect(() => {
    //     const generalTemplate = async () => {
    //         try {
    //             const response = await apiClient('GET', '/rbWaTemplate/cancelTemplateList', '', true);
    //             if (response?.success) {
    //                 setCancelTemplates(response?.data);
    //             }
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };
    //     generalTemplate();
    // }, []);

    // GENERAL WHATSAPP TEMPLATES
    // useEffect(() => {
    //     const generalTemplate = async () => {
    //         try {
    //             const response = await apiClient('GET', '/rbWaTemplate/InGeneralTemplateList', '', true);
    //             if (response?.success) {
    //                 setGeneralTemplates(response?.data);
    //             }
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };
    //     generalTemplate();
    // }, []);

    const handleCheckboxChange = (label) => {
        setSelectedRemark(prev => (prev === label ? "" : label));
        console.log(selectedRemark)
    };

    // ADD REMARKS
    const addRemarks = async () => {
        let payData = {
            urid: rideDetails?.urid,
            status: rideDetails?.status,
            remark: remark,
            template_id: String(selectedTemplate)
        };
        console.log("pay Data remarks", payData);
        try {
            const response = await apiClient('POST', '/ride_management/addRemark', JSON.stringify(payData), true);
            if(response?.success){
                console.log(response);
            }else{
                alert("Something went wrong");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="rounded-md overflow-hidden shadow-md border dark:border-slate-700 mx-2 my-4">
            {/* Header */}
            <div className="flex md:flex-row items-start md:items-center justify-between gap-4 p-4 text-sm bg-gradient-to-r from-[#F0F5FD] to-[#B9EAFF] dark:from-[#1E1F2D] dark:to-[#2C3245]">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white flex items-center justify-center">
                        <FaBell className="w-5 h-5" />
                    </div>
                    <h2 className="font-semibold text-[14px] text-[#0B132A] dark:text-white">Remarks</h2>
                </div>

                <button
                    onClick={() => setShowContent(!showContent)}
                    className="text-black dark:text-white cursor-pointer text-xl transition-transform duration-300"
                >
                    <FaCaretDown className={`text-2xl transform transition-transform duration-300 ${showContent ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {showContent && (
                <div className="bg-white dark:bg-[#1E1B2E] border border-gray-200 dark:border-gray-600 rounded-b-md p-6 mt-1 flex flex-col lg:flex-row gap-6">
                    {/* Left Section */}
                    <div className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md p-4">
                        <span className="text-[14px] font-semibold border-l-4 border-blue-600 pl-2 dark:text-white">Activity History</span>
                        <ul className="space-y-4 text-sm text-gray-800 dark:text-gray-200 mt-2 max-h-64 overflow-y-auto">
                            {actData.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                    <div className={`mt-1 w-7 h-7 flex items-center justify-center rounded-full text-white ${statusColors[item.activity_status]}`}>
                                        <FaBell className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p><span className={`font-semibold ${statusTextColors[item?.activity_status]}`}>{item?.activity_status}:</span> {item?.remark}</p>
                                        {item?.detail && <p className="text-xs text-gray-500 dark:text-gray-400">{item?.detail}</p>}
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400">{item?.created_at} By: {item?.created_by_name}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right Section */}
                    <div className="w-full lg:w-[35%] border border-gray-300 dark:border-gray-600 rounded-md p-4">
                        <h3 className="text-sm font-semibold border-l-4 border-blue-600 pl-2 mb-4 dark:text-white">New Remark</h3>
                        <div className="flex items-center justify-between flex-wrap gap-4 text-sm text-gray-800 dark:text-gray-200">
                            {['Search Cab', 'Connectivity Found', 'Cancel Ride'].map((label, i) => (
                                <label key={i} className="flex items-center gap-1">
                                    <input
                                        type="checkbox"
                                        className="accent-blue-600"
                                        checked={selectedRemark === label}
                                        onChange={() => handleCheckboxChange(label)}
                                    />
                                    {label}
                                </label>
                            ))}
                        </div>

                        {/* Custom Dropdown */}
                        <div className="mb-3 relative" ref={dropdownRef}>
                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Whatsapp Template</label>

                            {/* Dropdown Toggle */}
                            <div
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1E1B2E] text-gray-800 dark:text-gray-200 rounded px-3 py-2 text-sm cursor-pointer relative"
                            >
                                {selectedWhatsappTemplate
                                    ? genTemplates.find(t => t.id === selectedWhatsappTemplate)?.name
                                    : 'Select Whatsapp template'}
                                <FaCaretDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>

                            {/* Dropdown List */}
                            {showDropdown && (
                                <ul className="absolute z-50 mt-1 max-h-48 overflow-y-auto w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1E1B2E] rounded shadow text-sm">
                                    {genTemplates.map((template) => (
                                        <li
                                            key={template.id}
                                            onClick={() => {
                                                setSelectedWhatsappTemplate(template.id);
                                                setShowDropdown(false);
                                            }}
                                            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedWhatsappTemplate === template.id
                                                ? 'bg-blue-100 dark:bg-gray-700 font-semibold'
                                                : ''
                                                }`}
                                        >
                                            {template.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="mb-3 relative" ref={cancelRef}>
                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Cancel Template</label>

                            {/* Dropdown Toggle */}
                            <div
                                onClick={() => setShowDropdown1(!showDropdown1)}
                                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1E1B2E] text-gray-800 dark:text-gray-200 rounded px-3 py-2 text-sm cursor-pointer relative"
                            >
                                {selectedCancelTemplate
                                    ? canTemplates.find(t => t.id === selectedCancelTemplate)?.name
                                    : 'Select Cancel template'}
                                <FaCaretDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>

                            {/* Dropdown List */}
                            {showDropdown1 && (
                                <ul className="absolute z-50 mt-1 max-h-48 overflow-y-auto w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1E1B2E] rounded shadow text-sm">
                                    {canTemplates.map((template) => (
                                        <li
                                            key={template.id}
                                            onClick={() => {
                                                setSelectedCancelTemplate(template.id);
                                                setShowDropdown1(false);
                                            }}
                                            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedCancelTemplate === template.id
                                                ? 'bg-blue-100 dark:bg-gray-700 font-semibold'
                                                : ''
                                                }`}
                                        >
                                            {template.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Remark */}
                        <div className="mb-3">
                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Remark</label>
                            <textarea
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                                rows={3}
                                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1E1B2E] text-gray-800 dark:text-gray-200 rounded px-2 py-1 text-sm"
                                placeholder="Type your remark"
                            />
                        </div>

                        {/* Date/Time Inputs */}
                        <div className="flex items-center gap-2 mb-4">
                            <input
                                type="text"
                                placeholder="DD-MM-YY"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1E1B2E] text-gray-800 dark:text-gray-200 rounded px-2 py-1 text-sm w-full"
                            />
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1E1B2E] text-gray-800 dark:text-gray-200 rounded px-2 py-1 text-sm w-full"
                            />
                        </div>

                        <button 
                            onClick={()=>{
                                addRemarks();
                            }}
                            className="w-full bg-gradient-to-r from-green-400 to-green-700 text-white font-semibold py-2 rounded hover:opacity-90"
                        >
                            Add Remark
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}