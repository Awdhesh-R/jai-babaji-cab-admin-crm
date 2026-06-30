'use client';
import React, { useEffect, useState } from 'react';
import { RxCross2 } from "react-icons/rx";
import { apiClient } from '@/app/lib/apiClient';
import moment from 'moment';

const FareSection = ({ userDetails, updatedFareData,modifyFareData, setUserDetails, estimateFare, rideData, setCheckUpdate }) => {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (estimateFare) {
            setUserDetails(prev => ({
                ...prev,
                estKm: estimateFare?.distanceInKm || prev.estKm,
                reqTime: estimateFare?.durationInMin || formatTime(prev.reqTime),
                estimatedFare: estimateFare?.estimated_fare || prev.estimatedFare,
                advanceAmount: estimateFare?.advanceToBe || prev.advanceAmount,
            }));
        }
    }, [estimateFare, setUserDetails]);

    //REMOVE COUPON WHEN COUPON APPLIED
    const removeCoupon = async () => {
        try {
            const response = await apiClient('GET', `/coupon/removeApplyCouponByAdmin/${rideData?.urid}`, '', true);
            // if (response?.success) {
                console.log("Coupon Removed", response);
            // }
        } catch (error) {
            console.error(error.message);
        }
    }
    const formatTime = (timeinMin) => {
        console.log(timeinMin)
        if(isNaN(timeinMin)) return timeinMin;
        if (!Number.isFinite(timeinMin) || timeinMin < 0) return "00:00:00";
        const totalSeconds = Math.floor(timeinMin * 60);
        const hours = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        const pad = (n) => String(n).padStart(2, "0");
        return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;

    }

    const fetchUpdatedEstimatedFare = async (enteredKm) => {
        console.log(userDetails, estimateFare, rideData)
        const param = {
            bothInCluster: rideData?.cluster_details?.bothInCluster,
            durationInMin: parseFloat(enteredKm) * 2,
            distance: enteredKm,
            source_city: updatedFareData?.sourceCity || rideData?.near_ct_id,
            dest_city: updatedFareData?.destCity || rideData?.near_ctd_id,
            rideServiceType: updatedFareData?.serviceType || rideData?.cluster_details?.rideServiceType,
            ...rideData?.cluster_details
        };
        const response = await apiClient("POST", `/ride_management/getEstimatedPriceByKilometer`, param);
        if(response.success || response.status)  {
            console.log(response);
            modifyFareData(prev=>({...prev, estimatedFareList: response.data?.estimatedPrice?.cabList}));
            if(response.data?.estimatedPrice?.cabList) {
                const currentCab = await response.data?.estimatedPrice?.cabList?.find(cab=> cab.id === (rideData?.op_cab_details_json? rideData?.op_cab_details_json?.cab_type_id: userDetails?.cabTypeId));
                console.log(currentCab, userDetails?.cabTypeId);
                setUserDetails(prev=> ({
                    ...prev,
                    estimatedFare: currentCab?.estimated_fare,
                    advanceAmount: ((rideData?.status === 'pending' || rideData?.status === "processing")? currentCab?.advanceToBe: rideData?.price_details_json?.advance_amount) || 0,
                    collected_by_driver: parseFloat(currentCab?.estimated_fare || 0) - parseFloat(((rideData?.status === 'pending' || rideData?.status === "processing")? currentCab?.advanceToBe: rideData?.price_details_json?.advance_amount) || 0) - parseFloat(userDetails?.discount || 0),
                    reqTime: formatTime(parseFloat(enteredKm)* 2)
                }))
            }
        }
    }

    const handleKmChange = (e) => {
        setUserDetails(prev => ({ ...prev, estKm: e.target.value }));
        const km = e.target.value;
        setTimeout(()=>{
            fetchUpdatedEstimatedFare(km);
        }, 200);
    }

    return (
        <div className="bg-[#f9fafb] dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm w-[95%] transition-colors duration-300 mx-auto mt-4">
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-9 gap-4"> */}
            <div className="w-full flex items-end gap-4">
                <div className='flex w-full gap-2 items-center'>
                    <div className='w-full'>
                        <label className="block text-[12px] text-gray-400 dark:text-gray-300">Distance (KM)</label>
                        <input
                            type="text"
                            value={userDetails?.estKm}
                            onChange={(e) => handleKmChange(e)}
                            className="w-full px-4 py-1.5 rounded-[5px] text-[14px] border border-blue-300 focus:ring-2 focus:ring-blue-400 text-blue-600 dark:text-blue-400 dark:bg-gray-800 dark:border-blue-500"
                        />
                    </div>
                </div>

                <div className='w-full'>
                    <label className="block text-[12px] text-gray-400 dark:text-gray-300">Time (Minutes)</label>
                    <input
                        type="text"
                        disabled
                        value={userDetails?.reqTime}
                        onChange={(e) => setUserDetails(prev => ({ ...prev, reqTime: e.target.value }))}
                        className="w-full px-4 py-1.5 rounded-[5px] text-[14px] border border-blue-300 focus:ring-2 focus:ring-blue-400 text-blue-600 dark:text-blue-400 dark:bg-gray-800 dark:border-blue-500"
                    />
                </div>

                <div className='w-full'>
                    <label className="block text-[12px] text-gray-400 dark:text-gray-300">Estimated Fare</label>
                    <input
                        type="text"
                        disabled
                        value={userDetails?.estimatedFare}
                        onChange={(e) => setUserDetails(prev => ({ ...prev, estimatedFare: e.target.value }))}
                        className="w-full px-4 py-1.5 rounded-[5px] text-[14px] border border-blue-300 focus:ring-2 focus:ring-blue-400 text-blue-600 dark:text-blue-400 dark:bg-gray-800 dark:border-blue-500"
                    />
                </div>

                <div className='w-full'>
                    <label className="block text-[12px] text-gray-400 dark:text-gray-300">Advance Amount</label>
                    <input
                        type="text"
                        disabled
                        value={userDetails?.advanceAmount}
                        onChange={(e) => setUserDetails(prev => ({ ...prev, advanceAmount: e.target.value }))}
                        className="w-full px-4 py-1.5 rounded-[5px] text-[14px] border border-blue-300 focus:ring-2 focus:ring-blue-400 text-blue-600 dark:text-blue-400 dark:bg-gray-800 dark:border-blue-500"
                    />
                </div>
                {/* <div className='w-full'>
                    <label className="block text-[12px] text-gray-400 dark:text-gray-300">Extra Per Km</label>
                    <input
                        type="text"
                        disabled
                        value={userDetails?.extra_per_km}
                        onChange={(e) => setUserDetails(prev => ({ ...prev, advanceAmount: e.target.value }))}
                        className="w-full px-4 py-1.5 rounded-[5px] text-[14px] border border-blue-300 focus:ring-2 focus:ring-blue-400 text-blue-600 dark:text-blue-400 dark:bg-gray-800 dark:border-blue-500"
                    />
                </div>
                <div className='w-full'>
                    <label className="block text-[12px] text-gray-400 dark:text-gray-300">Extra Per Min</label>
                    <input
                        type="text"
                        disabled
                        value={userDetails?.extra_time_per_minutes}
                        onChange={(e) => setUserDetails(prev => ({ ...prev, advanceAmount: e.target.value }))}
                        className="w-full px-4 py-1.5 rounded-[5px] text-[14px] border border-blue-300 focus:ring-2 focus:ring-blue-400 text-blue-600 dark:text-blue-400 dark:bg-gray-800 dark:border-blue-500"
                    />
                </div> */}

                <div className='w-full'>
                    <label className="block text-[12px] text-gray-400 dark:text-gray-300">Rest Amount</label>
                    <input
                        type="text"
                        readOnly
                        value={( userDetails?.collected_by_driver || (parseFloat(userDetails?.estimatedFare || 0) - parseFloat(userDetails?.advanceAmount || 0)).toFixed(2))}
                        className="w-full px-4 py-1.5 rounded-[5px] text-[14px] border border-blue-300 text-red-600 font-medium bg-white dark:bg-gray-800 dark:border-blue-500 dark:text-red-400"
                    />
                </div>

                <div className='w-full'>
                    <label className="block text-[12px] text-gray-400 dark:text-gray-300">Wallet</label>
                    <input
                        type="text"
                        value={userDetails?.walletAmount}
                        onChange={(e) => setUserDetails(prev => ({ ...prev, walletAmount: e.target.value }))}
                        className="w-full px-4 py-1.5 rounded-[5px] text-[14px] border border-blue-300 focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-blue-500 dark:text-white"
                    />
                </div>

                <div className='relative w-full'>
                    <label className="block text-[12px] text-gray-400 dark:text-gray-300">Coupon</label>
                    <input
                        type="text"
                        value={userDetails?.couponCode}
                        onChange={(e) => setUserDetails(prev => ({ ...prev, couponCode: e.target.value }))}
                        className="w-full px-4 py-1.5 rounded-[5px] text-[14px] border border-blue-300 focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-blue-500 dark:text-white"
                    />
                    {userDetails?.couponCode && (
                        <button 
                            onClick={removeCoupon}
                            className='absolute right-2 bottom-1 rounded-md bg-[#f1c1c2] p-1 cursor-pointer'>
                            <RxCross2 className='text-[#f30d11] text-lg' />
                        </button>
                    )}
                </div>

                <div className='w-full'>
                    <label className="block text-[12px] text-gray-400 dark:text-gray-300">Discount</label>
                    <input
                        type="text"
                        value={userDetails?.discount}
                        onChange={(e) => setUserDetails(prev => ({ ...prev, discount: (!isNaN(e.target.value)? e.target.value: 0) }))}
                        className="w-full px-4 py-1.5 rounded-[5px] text-[14px] border border-blue-300 focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-blue-500 dark:text-white"
                    />
                </div>
                <div className='w-full flex justify-end'>
                    <button
                        onClick={() => setShowModal(true)}
                        className="text-[12px] px-4 py-2 rounded-md font-medium text-blue-600 border border-blue-300 hover:bg-blue-700 dark:bg-blue-500 dark:text-white dark:border-blue-400 dark:hover:bg-blue-600 transition-colors duration-200"
                    >
                        Additional Charge
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Additional Charges</h2>

                        <div className="space-y-1">
                            <div>
                                <label className="text-sm text-gray-600 dark:text-gray-300">Toll Charge</label>
                                <input
                                    type="text"
                                    value={userDetails?.tollCharge || ''}
                                    onChange={(e) => setUserDetails(prev => ({ ...prev, tollCharge: e.target.value }))}
                                    className="w-full px-3 py-1.5 border rounded-md border-blue-300 dark:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 dark:text-gray-300">Parking Charge</label>
                                <input
                                    type="text"
                                    value={userDetails?.parkingCharge || ''}
                                    onChange={(e) => setUserDetails(prev => ({ ...prev, parkingCharge: e.target.value }))}
                                    className="w-full px-3 py-1.5 border rounded-md border-blue-300 dark:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 dark:text-gray-300">Waiting Charge</label>
                                <input
                                    type="text"
                                    value={userDetails?.waitingCharge || ''}
                                    onChange={(e) => setUserDetails(prev => ({ ...prev, waitingCharge: e.target.value }))}
                                    className="w-full px-3 py-1.5 border rounded-md border-blue-300 dark:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 dark:text-gray-300">Other Charges</label>
                                <input
                                    type="text"
                                    value={userDetails?.other_charge || ''}
                                    onChange={(e) => setUserDetails(prev => ({ ...prev, other_charge: e.target.value }))}
                                    className="w-full px-3 py-1.5 border rounded-md border-blue-300 dark:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
                            >
                                Close
                            </button>

                            <button
                                onClick={() => {
                                    setShowModal(false);
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default FareSection;