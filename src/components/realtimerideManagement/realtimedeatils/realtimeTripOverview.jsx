import React, { useState } from 'react'
import { BsLink } from 'react-icons/bs'
import { FaClock } from 'react-icons/fa'
import { FiSend } from 'react-icons/fi'
import PublishModal from './realtimepublishModal'
import moment from 'moment'

const TripOverview = ({ rideDetails, setCheckUpdate }) => {
    const [modalOpen, setModalOpen] = useState(false);

    const handlePublishButton = () => {
        setModalOpen(true);
    }
    return (
        <div className="w-full bg-white rounded-b-lg shadow-md ">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-3 flex items-center justify-between">
                <div className='flex items-center gap-1'>
                    <div className='bg-white/20 p-2 rounded-md'><FiSend className="text-lg" /></div>
                    <h2 className="text-lg font-semibold">Trip Overview</h2>
                </div>
                <div className='gap-2 flex'>
                    <button
                        onClick={handlePublishButton}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900 border border-indigo-200 dark:border-indigo-700 shadow-sm"
                    >
                        <BsLink className='text-indigo-900 dark:text-white font-bold' />
                        <span className="text-[12px] font-bold text-indigo-900 dark:text-white">{rideDetails?.assigned_to_fleet === "unpublished"?"Publish Ride": "Published"}</span>
                    </button>
                    <button
                        onClick={() => {
                            if(!rideDetails?.connected_ride_id){
                                window.open(`/ridesManagement/searchRideConnection/${rideDetails?.urid}`, "_blank");
                                return;
                            }
                        }}
                        disabled={rideDetails?.connected_ride_id}
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-md  shadow-sm ${rideDetails?.connected_ride_id ? 'bg-green-300 cursor-not-allowed border border-gray-400' : 'bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900 border border-indigo-200 dark:border-indigo-700'}`}
                    >
                        <BsLink className='text-indigo-900 dark:text-white font-bold' />
                        <span className="text-[12px] font-bold text-indigo-900 dark:text-white">{rideDetails?.connected_ride_id?"Connected Ride":"Search Connection"}</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-8 p-4">
                <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-sm font-semibold text-blue-700 mb-1">
                        <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                        ORIGIN -
                        <span className='text-lg font-semibold'>{rideDetails?.source_city_name}</span>
                    </div>
                    <h3 className="text-[14px] font-semibold text-gray-900">{rideDetails?.location_details?.source}</h3>
                    <p className="text-sm text-gray-600 flex items-center justify-center md:justify-start gap-1 mt-1">
                        <FaClock /><strong> Departure:</strong> {moment(rideDetails?.booking_travel_date, 'DD-MM-YYYY').format("DD-MMM-YYYY")} <strong>{rideDetails?.bookingTime}</strong> 
                    </p>
                    <p className="text-sm text-gray-600 mt-3">Start Ordometer Km: <strong>{rideDetails?.start_odometer_km ? rideDetails?.start_odometer_km + " km" : "Not Updated"}</strong></p>
                    <p className="text-sm text-gray-600 mt-1"> Our Start km: <strong>{rideDetails?.price_details_json?.start_km ? rideDetails?.price_details_json?.start_km + " km" : "Not Updated"}</strong></p>
                </div>

                {/* Route */}
                <div className="flex flex-col items-center text-center">
                    <div className="bg-blue-600 text-white rounded-full p-4 shadow-lg relative">
                        <FiSend size={20} />
                        <span className="absolute top-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-white" />
                    </div>
                    <div className="mt-2">
                        <div className="text-blue-700 font-bold">{rideDetails?.price_details_json?.estimated_km} km</div>
                        <div className="text-xs text-gray-500">{rideDetails?.distance_time_google_data?.durationText}</div>
                    </div>
                </div>

                {/* Destination */}
                <div className="flex-1 text-center md:text-right">
                    <div className="flex items-center justify-center md:justify-end gap-2 text-sm font-semibold text-red-700 mb-1">
                        <span className="h-2 w-2 bg-red-500 rounded-full"></span>
                        DESTINATION -
                        <span className='text-lg font-semibold text-red-700'>{rideDetails?.destination_city_name}</span>
                    </div>
                    <h3 className="text-[14px] font-semibold text-gray-900">{rideDetails?.location_details?.destination}</h3>
                    <p className="text-sm text-gray-600 flex items-center justify-center md:justify-end gap-1 mt-1">
                        <FaClock /> {`Arrival: ${moment(rideDetails?.booking_travel_date+" "+ rideDetails?.bookingTime, 'DD-MM-YYYY hh:mm A').add(rideDetails?.distance_time_google_data?.durationValue + 3600, "seconds").format("DD-MMM-YYYY hh:mm A")}`}
                    </p>
                     <p className="text-sm text-gray-600 mt-3">End Odometer Km: <strong>{rideDetails?.end_odometer_km ? rideDetails?.end_odometer_km + " km" : "Not Updated"}</strong></p>
                     <p className="text-sm text-gray-600 mt-1"> Our End km: <strong>{rideDetails?.price_details_json?.end_km ? rideDetails?.price_details_json?.end_km + " km" : "Not Updated"}</strong></p>
                </div>
                <PublishModal open={modalOpen} details={rideDetails} onClose={()=>setModalOpen(false)} onConfirm={()=>{setCheckUpdate((prev) => !prev);setModalOpen(false)}}/>
            </div>
        </div>
    )
}

export default TripOverview
