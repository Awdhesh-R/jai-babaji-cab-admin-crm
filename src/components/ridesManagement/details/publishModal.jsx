"use client";
const { apiClient } = require("@/app/lib/apiClient");
const { useEffect, useState } = require("react");
import { toast } from "react-toastify";

const PublishModal = ({details, open, onClose, onConfirm, isDirectAssigned= false }) => {
    const [amount, setAmount] = useState((details?.connected_ride_id? parseFloat(details?.fleet_rate_per_km): parseFloat(details?.fleet_fixed_rate)) || 0);
    const [loading, setLoading] = useState(false);
    useEffect(()=>{
        setAmount((details?.connected_ride_id? parseFloat(details?.fleet_rate_per_km): parseFloat(details?.fleet_fixed_rate)) || 0);
        console.log(details)
    },[])
  if (!open) return null; 
  const handleSave =async () => {
    try {
        if(!isDirectAssigned) {
            setLoading(true);
            if(details.connected_ride_id) {
                const maxAmount = (details?.agree_cab_details_json?.cab_type === "Mini" || details?.booking_type === "mini")? 11: (details?.agree_cab_details_json?.cab_type === "Sedan" || details?.booking_type === "sedan")? 13: 15;
                if(amount > maxAmount) {
                    toast.error(`Fleet Rate Per Km cannot be more than ${maxAmount} for ${details?.agree_cab_details_json?.cab_type || details?.booking_type} cab`)
                    return;
                }
            } else {
                const maxAmount = details?.price_details_json?.collected_by_driver * 1.4;
                if(amount > maxAmount) {
                    toast.error(`Fleet Rate Per Km cannot be more than ${maxAmount} for ${details?.agree_cab_details_json?.cab_type || details?.booking_type} cab`)
                    return;
                }
            }
            const res = await apiClient("POST", `/ride_management/public-ride`, {
                "urid": details.urid,
                "fleet_rate_per_km": details.connected_ride_id? parseFloat(amount): null,
                "fleet_fixed_rate": details.connected_ride_id? null: parseFloat(amount),
                "public": "yes"
            });
            if(res.success || res.success) {
                toast.success(res.message);
                onClose && onClose();
                onConfirm && onConfirm();
            }
        } else {
            onConfirm && onConfirm({
                "fleet_rate_per_km": details.connected_ride_id? amount: null,
                "fleet_fixed_rate": details.connected_ride_id? null: amount
            });
            onClose && onClose();

        }
        
    } catch (err) {
        console.error(err)
    } finally {
        setLoading(false);
    }
  }

  const unpublishRide = async () => {
      try {
          setLoading(true);
          const res = await apiClient("POST", `/ride_management/public-ride`, {
              "urid": details.urid,
              "fleet_rate_per_km": 0,
              "fleet_fixed_rate": 0,
              "public": "no"
          });
          if (res.success || res.success) {
              toast.success(res.message);
              onClose && onClose();
              onConfirm && onConfirm();
          } else {
            toast.error(res.message);
          }
    } catch (e) {
        console.log(e);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[500px] max-w-full relative text-gray-700 flex flex-col gap-4">
        <div className="flex justify-between w-full">
            <div>Booking ID : {details.urid}</div>
            {details?.assigned_to_fleet === "public"&& <button className="inline-flex items-center gap-2 px-3 py-1 border rounded-md shadow-lg border-red-600" disabled={loading} onClick={() => { unpublishRide() }}>
                <span className="text-[12px] font-bold text-red-900">Unpublish Ride</span>
            </button>}
        </div>
            {details.connected_ride_id ? 
            <div className="flex gap-8 justify-between">
                <div>Fleet rate per km</div>
                <div>
                    <input value={amount} max={(details?.agree_cab_details_json?.cab_type === "Mini" || details?.booking_type === "mini")? 11: (details?.agree_cab_details_json?.cab_type === "Sedan" || details?.booking_type === "sedan")? 13: 15} disabled={loading} className="bg-[white] outline-1 border border-gray-500 rounded-lg px-4" required={details.connected_ride_id} onChange={e=> setAmount(e.target.value)} type="number" name="ride-details-connected" id="ride-detials-connected" />
                </div>
            </div>: 
            <div className="flex gap-8 justify-between">
                <div>Fleet Fixed Rate</div>
                <div>
                    <input type="number" max={Math.max(((parseFloat(details?.price_details_json?.collected_by_driver) || 0) * 1.4), 0)} className="bg-[white] outline-1 border border-gray-500 rounded-lg px-4" disabled={loading} name="ride-details" id="ride-detials" value={amount} required={!details.connected_ride_id} onChange={e=> setAmount(e.target.value)}/>
                </div>
            </div>
            }
            <div className="px-10 flex gap-4 justify-center">
                <button className="inline-flex items-center gap-2 px-3 py-1 border rounded-md shadow-lg border-gray-600" disabled={loading} onClick={()=>{onClose && onClose()}}>
                        <span className="text-[12px] font-bold text-indigo-900">Cancel</span>
                </button>
                <button className="inline-flex items-center gap-2 px-3 py-1 rounded-md shadow-lg border border-gray-600" disabled={loading} onClick={handleSave}>
                        <span className="text-[12px] font-bold text-indigo-900">{isDirectAssigned? "Proceed": "Publish Ride"}</span>
                </button>
            </div>
      </div>
    </div>
  )
}
export default PublishModal