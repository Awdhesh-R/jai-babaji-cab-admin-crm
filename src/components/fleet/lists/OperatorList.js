import React from 'react'
import { useRouter } from 'next/navigation';
import { CiLocationOn } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";
import Image from 'next/image';



// const OperatorList = ({fleetData = []}) => 
    const OperatorList = ({ fleetData = [], searchQuery = '', setSearchQuery }) => 
    {
    const router = useRouter();
    const goToDetail = (id) => {
        router.push(`/fleetManagement/fleetDetails/${id}`);
    };
    return (
        <div className="border border-[#ACCFFF] rounded-xl p-4 bg-[#F3F4F6] dark:bg-gray-900 shadow">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <h2 className="text-[18px] font-bold text-green-600">Total Fleet</h2>
                </div>

                <div className="flex flex-1 gap-3">
                    <div className="relative w-full max-w-xs">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                       
                         <input
                         type="text"
                         placeholder="Search mobile number or name"
                         value={searchQuery}
                         onChange={e => setSearchQuery(e.target.value)} 
                         className="w-full pl-10 pr-4 py-2 text-sm border border-blue-200 rounded-full shadow"
                        />
                    </div>

                    <div className="relative w-full max-w-xs">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                        <input
                            type="text"
                            placeholder="Search District...."
                            className="w-full pl-10 pr-4 py-2 text-sm border border-blue-200 rounded-full"
                        />
                    </div>
                </div>

                <div className="text-sm text-blue-600 font-semibold border border-blue-300 px-3 py-1 rounded-full">{fleetData.length} Total</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {fleetData.map((fleet) => (
                    <button
                        key={fleet.id}
                        onClick={() => goToDetail(fleet.id)}
                        className="flex items-center gap-4 p-4 border border-[#E5E5E5] rounded-md shadow-sm bg-white hover:shadow-md transition cursor-pointer w-full"
                    >
                        {/* Profile Image + Status Indicator */}
                        <div className="relative">
                            <Image
                                src={fleet.profile_pic || "/images/cab-captian-avator-default.png"}
                                alt={fleet.full_name || "Operator"}
                                width={64}
                                height={64}
                                className="w-16 h-16 rounded-full object-cover ring-4 ring-[#DBEAFE]"
                            />
                            {fleet.login_status && (
                            <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-gradient-to-r from-[#4ADE80] to-[#22C55E] border-2 border-white" />
                            )}
                        </div>

                        {/* Details */}
                        <div className="flex flex-col justify-start items-start flex-1">
                            <h3 className="text-[14px] font-semibold text-[#0e1a2b]">{fleet.full_name}</h3>
                            <div className="flex items-start flex-col">
                                <span className='text-[#4B5563] text-[12px]'>{fleet.mobile_no}{" "}</span>
                                <div className="flex items-center gap-1">
                                    <CiLocationOn className='text-[#4B5563] ' />
                                    <span className='text-[#4B5563] text-[12px]'>{fleet.city}</span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-2 mt-3">
                                <span className="px-3 py-1 text-[12px] bg-blue-100 text-blue-600 rounded-full">
                                    {fleet.cabs} Cabs
                                </span>
                                <span className="px-3 py-1 text-[12px] bg-green-100 text-green-700 rounded-full">
                                    {fleet.drivers} Drivers
                                </span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
            {fleetData.length > 0 && (
            <div className="flex justify-end mt-4">
                <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-full hover:bg-blue-50 transition">
                    Show More..
                </button>
                
            </div>
            )}
        </div>
    )
}

export default OperatorList