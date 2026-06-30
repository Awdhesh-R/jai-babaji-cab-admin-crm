import { useState, useEffect } from "react";
import { FaCaretDown, FaPhoneAlt } from "react-icons/fa";
import { apiClient } from "@/app/lib/apiClient";
import { FaLink } from "react-icons/fa6";

const statusColors = {
  pending: 'bg-[#FFC107] text-white',
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

export default function PreviousRides({ userID }) {
    
    const [showContent, setShowContent] = useState(false);
    const [expandedRideId, setExpandedRideId] = useState(null);
    const [pastRides, setPastRides] = useState([]);

    useEffect(() => {
        if (!userID) return;

        const previousRideDetails = async () => {
            try {
                const response = await apiClient('GET', `/ride_management/pastRideListOfUser/${userID}`);
                setPastRides(response?.data);
                // console.log("=====userId", userID);
                // console.log("=========", response?.data);
            } catch (error) {
                console.error('Error fetching ride details:', error);
            }
        };

        previousRideDetails();
    }, [userID]);

    const handleToggleDetails = (rideId) => {
        setExpandedRideId(prevId => prevId === rideId ? null : rideId);
    };

    return (
        <div className="rounded-md overflow-hidden shadow-md border border-slate-200 dark:border-slate-700 my-4">
            {/* Header */}
            <div className="flex md:flex-row items-start md:items-center justify-between gap-4 p-4 text-sm bg-gradient-to-r from-[#F0F5FD] to-[#B9EAFF] dark:from-[#1E1F2D] dark:to-[#2C3245]">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="font-semibold text-[14px] text-[#0B132A] dark:text-white">Previous Rides</h2>
                </div>
                <div className="flex items-center gap-4">
                    <div className="inline-block bg-[#F0F5FD] dark:bg-[#1E1F2D] px-3 py-0.5 rounded-3xl shadow-sm">
                        <span className="text-blue-800 dark:text-white text-[12px]">{pastRides?.length} Rides</span>
                    </div>
                    <button
                        onClick={() => setShowContent(!showContent)}
                        className="text-black dark:text-white cursor-pointer text-xl transition-transform duration-300"
                    >
                        <FaCaretDown className={`text-2xl transform transition-transform duration-300 ${showContent ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>

            {showContent && (
                <div className="w-[95%] border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden mx-10 my-4">
                    <table className="w-full text-left text-sm text-gray-800 dark:text-gray-200">
                        <thead className="uppercase text-xs text-gray-600 dark:text-white bg-gray-100 dark:bg-[#2B2840]">
                            <tr>
                                <th className="px-4 py-3">Ride ID</th>
                                <th className="px-4 py-3">Date & Time</th>
                                <th className="px-4 py-3">Route</th>
                                <th className="px-4 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pastRides?.map((ride) => (
                                <>
                                    <tr
                                        key={ride.urid}
                                        className="border-t border-gray-200 dark:border-[#312950] hover:bg-gray-100 dark:hover:bg-[#29253F] transition-colors duration-200"
                                    >
                                        <td className="px-4 py-3">
                                            <button onClick={() => handleToggleDetails(ride?.urid)} className="text-blue-600 underline">
                                                {ride.urid}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">{ride.booking_travel_date}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-start flex-col">
                                                <span>{ride.booking_source}</span> 
                                                <span>{ride.booking_destination}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`px-4 py-1 rounded-full text-sm font-medium w-24 inline-block ${statusColors[ride.status] || 'bg-gray-600'}`}>
                                                {ride.status}
                                            </span>
                                        </td>
                                    </tr>

                                    {expandedRideId === ride.urid && (
                                        <tr className="bg-white dark:bg-[#1E1B2E]">
                                            <td colSpan={4} className="p-4">
                                                <div className="p-4 border rounded-md space-y-4 text-sm dark:border-gray-600">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div className="border rounded-md p-4 space-y-2">
                                                            <h3 className="font-semibold text-gray-700 dark:text-gray-200">Customer Information</h3>
                                                            <p className="text-gray-900 dark:text-white font-medium">{ride.c_name}</p>
                                                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-400">
                                                                <FaPhoneAlt className="text-xs" />
                                                                <span>{ride.book_contact}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-400">
                                                                <FaPhoneAlt className="text-xs" />
                                                                <span>{ride.book_contact}</span>
                                                                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-[1px] rounded">{ride.book_for}</span>
                                                            </div>
                                                        </div>
                                                        <div className="border rounded-md p-4 space-y-3 bg-white dark:bg-[#1e1e2f]">
                                                            <h3 className="font-semibold text-gray-700 dark:text-gray-200">Location Details</h3>
                                                            <div className="flex items-start gap-2 text-green-600">
                                                                <div className="w-2 h-2 rounded-full bg-green-500 mt-1"></div>
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium">Pickup</span>
                                                                    <span className="text-gray-600 dark:text-gray-400">{ride.booking_source}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start gap-2 text-red-600">
                                                                <div className="w-2 h-2 rounded-full bg-red-500 mt-1"></div>
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium">Drop</span>
                                                                    <span className="text-gray-600 dark:text-gray-400">{ride.booking_destination}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="border rounded-md p-4 bg-white dark:bg-[#1e1e2f]">
                                                            <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Trip Details</h3>
                                                            <div className="space-y-2 text-sm">
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-600 dark:text-gray-400">Distance:</span>
                                                                    <span className="text-gray-800 dark:text-gray-200">{ride.base_km}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                                                                    <span className="text-gray-800 dark:text-gray-200">{ride.rq_time}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-600 dark:text-gray-400">Total:</span>
                                                                    <span className="text-violet-600 font-semibold">₹{ride.estimated_price}/-</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-600 dark:text-gray-400">Rest:</span>
                                                                    <span className="text-orange-600 font-semibold">₹ {ride.advance_to_be}/-</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-600 dark:text-gray-400">Extra:</span>
                                                                    <span className="text-red-600 font-semibold">₹ 60/- [3Km]</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-4">
                                                        <div className="flex-1 min-w-[300px] md:min-w-[40%] border rounded-md p-4 bg-blue-50 dark:bg-[#273855] text-blue-900 dark:text-white shadow-sm">
                                                            <h3 className="text-sm font-semibold mb-2">Cab & Driver</h3>
                                                            <div className="flex flex-wrap items-center gap-2 text-sm">
                                                                <FaLink className="text-blue-600 dark:text-white" />
                                                                <span>BR01PM1708</span>
                                                                <span>•</span>
                                                                <span>SUSHIL D</span>
                                                                <span className="ml-auto text-sm">📞 7739930742</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex-1 min-w-[180px] md:max-w-[200px] border rounded-md p-4 shadow-sm bg-white dark:bg-[#1e1e2f]">
                                                            <h3 className="text-sm font-semibold mb-1 text-gray-800 dark:text-gray-100">Remarks</h3>
                                                            <p className="text-xs text-gray-500 dark:text-gray-300">No remarks</p>
                                                        </div>

                                                        <div className="flex-1 min-w-[180px] md:max-w-[200px] border rounded-md p-4 shadow-sm bg-white dark:bg-[#1e1e2f]">
                                                            <h3 className="text-sm font-semibold mb-1 text-gray-800 dark:text-gray-100">View Details</h3>
                                                            <a href="#" className="text-blue-600 text-xs underline hover:text-blue-800 transition">Click Here</a>
                                                        </div>

                                                        <div className="flex-1 min-w-[250px] border rounded-md p-4 shadow-sm bg-white dark:bg-[#1e1e2f]">
                                                            <h3 className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-100">Map Details</h3>
                                                            <div className="flex flex-wrap gap-4 text-xs text-blue-600 mt-1">
                                                                <a href="#" className="underline hover:text-blue-800 transition">Booking Map</a>
                                                                <a href="#" className="underline hover:text-blue-800 transition">Extra Km Map</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="border-t pt-3 flex items-center gap-4 text-sm">
                                                        <span className="font-medium text-gray-700 dark:text-gray-300">Journey</span>
                                                        <a href="#" className="text-blue-600 underline text-sm">Map</a>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}