'use client';
import React, { useEffect, useState } from 'react'
import { IoHomeOutline } from "react-icons/io5";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { BsExclamationTriangle } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import OperatorList from './lists/OperatorList';
import ExpireCabList from './lists/ExpireCabList';
import ActiveFleetList from './lists/ActiveFleetList';
import PendingCabList from './lists/PendingCabList';
import TotalDriverList from './lists/TotalDriverList';
import TotalDrivers from './TotalDrivers';
import { apiClient } from '@/app/lib/apiClient';
import { useRouter } from 'next/navigation';



const Dashboard = () => {

    const [stats, setStats] = useState([
  {
    label: 'Active Operator',
    value: 0,
    tabKey: 'active_operator',
    color: 'border-blue-400 bg-blue-50',
    ring: 'ring-blue-400',
  },
  {
    label: 'Total Active Cab',
    value: 10,
    tabKey: 'active_fleet',
    color: 'border-green-500 bg-green-50',
    ring: 'ring-green-500',
  },
  {
    label: 'Pending Cabs',
    value: 22,
    tabKey: 'pending_cabs',
    color: 'border-yellow-400 bg-yellow-50',
    ring: 'ring-yellow-400',
  },
  {
    label: 'Total Drivers',
    value: 22,
    tabKey: 'total_drivers',
    color: 'border-[#2563EB] bg-[#EAF0FD]',
    ring: 'ring-[#2563EB]',
  },
  {
    isExpired: 'expired',
    label: 'Cab Documents Are Expired Soon!',
    tabKey: 'expired_docs',
    color: 'border-[#B43412] bg-[#FFF7E9]',
    ring: 'ring-[#B43412]',
  },
]);

  const [fleetData, setFleetData] = useState([]);
  const [selectedTab, setSelectedTab] = useState('active_operator');
  const [fleetId, setFleetId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');



  useEffect(() =>{
    const SearchParams = new URLSearchParams(window.location.search);
    const id = SearchParams.get('id');
    if (id) {
      setFleetId(id);
    }
  }, []);

useEffect(() => {
  const getDashboard = async () => {
    
    if (!fleetId) return;
    try {
      const res = await apiClient("GET", `/fleet/getTotalCabsCount-by-fleetId/${fleetId}`, '', true);
      if (typeof res?.data === "number") {
        setStats(prevStats =>
          prevStats.map(stat =>
            stat.tabKey === "active_operator"
              ? { ...stat, value: res.data }
              : stat
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

 getDashboard();
}, [fleetId]);
  
//   useEffect(() => {
//     const getDashboard = async() => {
//         try{
//             const fleetRes = await apiClient("GET", "/fleet/geAllFeetlOperatorList", '', true);
//             setFleetData(fleetRes?.data);
//         } catch (error) {
//             console.error(error);
//         }
//     };
//     getDashboard();
// }, []);



useEffect(() => {
    const getDashboard = async () => {
      try {
        let url = "/fleet/getAllFeetlOperatorList";
        if (searchQuery && searchQuery.trim() !== '') {
         
          url = `/fleet/searchOperator?page=1&limit=10&q=${encodeURIComponent(searchQuery.trim())}`;
        }
        const fleetRes = await apiClient("GET", url, '', true);
        
        if (searchQuery && searchQuery.trim() !== '') {
          setFleetData(fleetRes?.data?.operators || []);
        } else {
          setFleetData(fleetRes?.data || []);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getDashboard();
  }, [searchQuery]);

    return (
        <div className='space-y-4'>
            <div className="border border-[#babbba] p-2 flex items-center gap-2 bg-white dark:bg-gray-900 mt-1">
                <IoHomeOutline className="text-gray-400" size={18} />
                <MdKeyboardDoubleArrowLeft className="text-gray-400 w-4 h-4" />
                <span className="text-sm text-gray-600 font-medium">Fleet Dashboard</span>
            </div>
            <div className="flex flex-wrap gap-3 w-full">
                {stats.map((stat, index) => {
                    const isActive = selectedTab === stat.tabKey;
                    return (
                        <div
                            key={index}
                            onClick={() => setSelectedTab(stat.tabKey)}
                            className={`cursor-pointer flex-1 min-w-[150px] p-3 rounded-md border border-l-4 ${stat.color} shadow-lg transition-all ${isActive ? `ring-2 ${stat.ring} scale-[1.02]` : ''
                                } ${stat?.isExpired === 'expired' && 'flex items-center justify-center'}`}
                        >
                            {
                                stat?.isExpired === 'expired' ? (
                                    <div className='flex items-center justify-center gap-1'>
                                        <BsExclamationTriangle className='text-[#EA580C] text-lg font-bold' />
                                        <p className="text-sm text-[#B43412] font-medium">{stat.label}</p>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm text-gray-600 font-medium">{stat?.label}</p>
                                        <h3 className="text-xl font-bold text-gray-900">{stat?.value ?? 0}</h3>
                                    </>
                                )
                            }
                        </div>
                    );
                })}
            </div>
            <div className="mt-6">
                {/* {selectedTab === 'active_operator' && <OperatorList  fleetData={fleetData}/>} */}
               {selectedTab === 'active_operator' &&  <OperatorList fleetData={fleetData} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}

                {selectedTab === 'active_fleet' && <ActiveFleetList />}
                {selectedTab === 'pending_cabs' && <PendingCabList />}
                {selectedTab === 'total_drivers' && <TotalDriverList fleetData={fleetData} />}
                {selectedTab === 'expired_docs' && <ExpireCabList />} 
            </div>
        </div>
    )
}

export default Dashboard
