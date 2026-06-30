'use client';
import React, { useState, useEffect, lazy, } from 'react';
const MarketBookingComponent = lazy(()=> import("@/components/operations/OperationDashboard/MarketBookingList"));
const AutoConfirmLBookingist = lazy(()=> import("@/components/operations/OperationDashboard/AutoConfirmBookingList"));
const Last24HrsBookingList = lazy(()=> import("@/components/operations/OperationDashboard/Last24HrsBookingList"));
const UpcomingRideList = lazy(()=> import("@/components/operations/OperationDashboard/UpcomingRides"));
const PublicRideList = lazy(()=> import("@/components/operations/OperationDashboard/PublicRideList"));
const AllRodbezRide = lazy(()=> import("@/components/operations/OperationDashboard/AllRodbezRide"));
const AllOperatorRide = lazy(()=> import("@/components/operations/OperationDashboard/AllOperatorRide"));
const AllOperatorUpcoming = lazy(()=> import("@/components/operations/OperationDashboard/AllOperatorUpcoming"));
const AllRodbezUpcoming = lazy(()=> import("@/components/operations/OperationDashboard/AllRodbezUpcoming"));
const AllConfirmWaiting = lazy(()=> import("@/components/operations/OperationDashboard/AllConfirmWaiting"));
const AllConfirmAll = lazy(()=> import("@/components/operations/OperationDashboard/AllConfirmAll"));
const AllCompleted = lazy(()=> import("@/components/operations/OperationDashboard/AllCompleted"));

const AllOperationsRidePage = () => {
    const statusColors = {
        "market_booking": "bg-blue-200 border border-blue-500 text-blue-700",
        "last_24_hrs_booking": "bg-gray-200 border border-gray-500 text-gray-700",
        "all_upcoming_booking": "bg-yellow-200 border border-yellow500 text-yellow-700",
        "auto_confirm_booking": "bg-green-200 border border-green-500 text-green-700",
        "public_booking": "bg-blue-200 border border-blue-500 text-blue-700",


        // ⭐ New Tabs Colors
    "allrodbezride": "bg-purple-200 border border-purple-500 text-purple-700",
    "alloperatorride": "bg-indigo-200 border border-indigo-500 text-indigo-700",
    "alloperatorupcoming": "bg-orange-200 border border-orange-500 text-orange-700",
    "allrodbezupcoming": "bg-teal-200 border border-teal-500 text-teal-700",
    "allconfirmwaiting": "bg-pink-200 border border-pink-500 text-pink-700",
    "allconfirmall": "bg-rose-200 border border-rose-500 text-rose-700",
    "allcompleted": "bg-lime-200 border border-lime-500 text-lime-700"
    }

    const tabs = [{
        label: "Market Booking",
        value: "market_booking",
        component: MarketBookingComponent
    }, {
        label: "Last 24 Hrs Booking",
        value: "last_24_hrs_booking",
        component: Last24HrsBookingList
    }, {
        label: "Auto Confirm Bookings",
        value: "auto_confirm_booking",
        component: AutoConfirmLBookingist
    }, {
        label: "All Upcoming Bookings",
        value: "all_upcoming_booking",
        component: UpcomingRideList
    }, {
        label: "All Public Bookings",
        value: "public_booking",
        component: PublicRideList
    },

    // new Changes
    {
        label: " RodBez Ride",
        value: "allrodbezride",
        component: AllRodbezRide
    },


    {
        label: " Operator Ride",
        value: "alloperatorride",
        component: AllOperatorRide
    },


    {
        label: " Operator Upcoming",
        value: "alloperatorupcoming",
        component: AllOperatorUpcoming
    },
    {
        label: " RodBez Upcoming",
        value: "allrodbezupcoming",
        component: AllRodbezUpcoming
    },
        {
        label: " Confirm Waiting",
        value: "allconfirmwaiting",
        component: AllConfirmWaiting
    },
        {
        label: " Confirm",
        value: "allconfirmall",
        component: AllConfirmAll
    },
        {
        label: " Completed",
        value: "allcompleted",
        component: AllCompleted
    },
];
    const [statusTab, setStatusTab] = useState("market_booking");
    const [ActiveComponent, setActiveComponent] = useState(MarketBookingComponent);

    return (
        <div className='flex flex-col gap-2'>
            <div className=''>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 w-full">
                    {tabs.map((tab, idx) => {
                        const isActive = statusTab.toLowerCase() === tab.value;
                        return (
                            <div className='w-full'
                                key={idx}>
                                <button
                                    onClick={() => {
                                        setStatusTab(tab.value);
                                        setActiveComponent(prev=> tab.component);
                                    }}
                                    className={`w-full px-4 py-1.5 rounded-md border text-center text-sm font-semibold transition-all duration-200
                                      ${isActive ? statusColors[statusTab] : 'bg-white text-gray-700 border-gray-300'}
                                    `}
                                >
                                    {tab.label}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div>
                {ActiveComponent? <ActiveComponent isChild={true}/>: null}
            </div>
        </div>
    );
};

export default AllOperationsRidePage;