'use client'
import { Eye, Phone, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

export default function DriverCards({ driver }) {

const router = useRouter();
var imageBaseUrl = process.env.NEXT_IMG_BASE_URL?process.env.NEXT_IMG_BASE_URL:"";

useEffect(()=>{
 imageBaseUrl  = process.env.NEXT_IMG_BASE_URL? process.env.NEXT_IMG_BASE_URL: "";
},[process])

  const handleGo = (id) => {
    router.push(`/rbFleetManagement/rbDriver/driverDetails/${id}`);
  };

    return (
        <div className="w-full min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-semibold mb-4">All Drivers</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {driver?.length > 0 ? (
                    driver.map((drv, index) => (
                        <div key={index} className="bg-white shadow-md rounded-xl p-4 w-full text-gray-800">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={drv.driverImage? `${"https://api.rodbez.com"}/${drv.driverImage}`:'/images/kumar.jpg'}
                                        alt='driver images'
                                        width={50}
                                        height={50}
                                        className="rounded-full object-cover"
                                    />
                                    <h3 className="font-semibold text-gray-800 capitalize">{drv?.driverName}</h3>
                                </div>
                                <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${drv?.status?.toLowerCase() === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                    <span className={`h-2 w-2 rounded-full capitalize ${drv?.status?.toLowerCase() === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}></span>{drv?.status}
                                </span>
                            </div>

                            {/* <p className="text-sm mb-1 text-gray-800">
                                Cab No. <span className="font-semibold"> BR01AB12345 </span>
                            </p> */}

                            <p className="flex items-center text-sm mb-1">
                                <Phone className="w-4 h-4 mr-1 text-gray-800" /> {drv?.driverMobile}
                            </p>

                            <p className="flex items-center text-sm mb-4 text-gray-800">
                                <Star className="w-4 h-4 mr-1 text-gray-500" /> Rating: <span className="ml-1 font-semibold">{drv?.avgRating}</span>
                            </p>

                            <button onClick={()=>handleGo(drv?.id)} className="w-full flex items-center justify-center gap-2 text-white text-sm font-medium py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition">
                                <Eye className="w-4 h-4" />
                                View Profile
                            </button>  
                        </div>
                    ))
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    );
}
