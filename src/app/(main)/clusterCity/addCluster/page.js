"use client";
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { IoLocationOutline } from "react-icons/io5";
import ClusterSearchCity from '@/components/cluster/clusterSearchCity/ClusterSearchCity';
import CityDetails from '@/components/cluster/CityDetails';
import PatnaRentar from '@/components/cluster/renterCity/PatnaRentar';
// import CabOverview from '@/components/jaibabajicabCabs/CabOverview';
import CabDriverPage from '../../cabManagement/cabDriver/page';
import { apiClient } from '@/app/lib/apiClient';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCityList, fetchGlobalPriceDetails } from '@/redux/features/clusterMainSlice';
import { fetchClusterByCity } from '@/redux/features/clusterMainSlice';
import { current } from '@reduxjs/toolkit';


const Page = () => {
  const [activeCity, setActiveCity] = useState('Patna')
  const [showMore, setShowMore] = useState(false);
  const [ride_type, setRideType] = useState("oneway");
  const [cities, setCities] = useState([]);
  const [cityId, setCityId] = useState(28);
  const dispatch = useDispatch();
  const { cityList, cluster, clusters, loading, error, fareList } = useSelector((state) => state.clusterMain);
  useEffect(() => {
    dispatch(fetchCityList());
    dispatch(fetchGlobalPriceDetails());
  }, [dispatch]);

  const [visibleCities, setVisibleCities] = useState([]);
  const [extraCities, setExtraCities] = useState([]);

  // Whenever cityId changes, fetch clusters
  useEffect(() => {
    if (cityId) {
      dispatch(fetchClusterByCity(cityId));
    }
  }, [cityId, dispatch]);

  useEffect(() => {
    setVisibleCities(cityList?.filter((city) => city?.is_cluster?.toLowerCase() === "yes"));
    setExtraCities(cityList?.filter((city) => city?.is_cluster?.toLowerCase() === "no"));
    if(cityList?.length <10) {
      setShowMore(true);
    } else {
      setShowMore(false);
    }
  }, [cityList]);

  // Handle city click (updates state)
  const handleCityClick = (city) => {
    setActiveCity(city.city_name);
    setCityId(city.id);
    const existing = visibleCities?.find(c => c.id === city.id);
    if(!existing) {
      let updatedVisible = [...cityList.filter(c => c.is_cluster?.toLowerCase() === "yes"), city];
      setVisibleCities(updatedVisible);
      let updatedExtra = cityList.filter((city) => city?.is_cluster?.toLowerCase() === "no").filter(c => c.id !== city.id);
      setExtraCities(updatedExtra);
    }
  };

  // Render clusters or fallback
  const renderCityDetails = () => {
    if (clusters ) {
      if(ride_type === "rental") {
        let fareData = fareList.find(fare => fare.ride_type.toLowerCase() === "rental")?.global_price_json;
        return <CityDetails  clusters={clusters} globalFareList={fareData} ride_type={ride_type}/>;
      } else {
        let fareData = fareList.find(fare => fare.ride_type.toLowerCase() === "oneway")?.global_price_json;
        return <CityDetails  clusters={clusters} globalFareList={fareData} ride_type={ride_type}/>;
      }
    } else {
      return (
        <div className="text-gray-500">
          No data available for {activeCity}
        </div>
      );
    }
  };

  return (

    <div className='w-full bg-gray-100 flex flex-col gap-1'>
      {/* Header Section */}
      <div className='flex justify-center flex-col gap-1 bg-[linear-gradient(135deg,_#F8FAFC_0%,_#EFF6FF_50%, _#E0E7FF_100%)] rounded-lg  p-4'>

        <div className='flex items-center gap-1 bg-[linear-gradient(90deg,_rgba(37,99,235,0.1)_0%,_rgba(147,51,234,0.1)_50%,_rgba(219,39,119,0.1)_100%)] p-4 rounded-lg'>
          <div className='flex items-center justify-center bg-gradient-to-r from-[#2563EB] to-[#9333EA] rounded-md p-1'>
            <Image
              src="/icons/clusterlogo.png"
              alt='icon'
              height={28}
              width={28}
              className='rounded-md object-contain'
            />
          </div>
          <div className='flex flex-col items-start space-y-[-4px]'>
            <span className="text-transparent bg-clip-text bg-[linear-gradient(90deg,_#111827_0%,_#1E40AF_50%,_#6B21A8_100%)] text-[20px] font-bold text-3xlc">
              Our Cluster
            </span>
            <p className="text-[14px] font-medium text-[#4B5563]">
              Manage clusters and service distances by city
            </p>
          </div>
        </div>


        <div className='flex flex-col p-4 rounded-lg'>


          <div className="flex items-center space-x-2 p-4 rounded-md bg-[linear-gradient(90deg,_#EFF8EF_0%,_#EEF2FF_100%)] gap-1">
            <div className='bg-[linear-gradient(90deg,_#3B82F6_0%,_#4F46E5_100%)] rounded-lg'>
              <IoLocationOutline className="text-white text-2xl m-2" />
            </div>
            <span className="text-gray-800 text-lg font-medium ">Select City</span>

            <div className='flex flex-grow'>
              <ClusterSearchCity cities={cities} />
            </div>

            <div className='flex gap-4 items-center'>
              <button onClick={()=>setRideType("oneway")} className={`items-center rounded-lg p-2 transition-transform duration-300 hover:scale-105 ${ride_type === "oneway"? "bg-[linear-gradient(270deg,_#8E3FD3_0%,_#2563EB_100%)] text-white ":"bg-white  border border-solid border-[#005FE2] text-[#2563EB]"}`}>
                <span className=''>OneWay</span>
              </button>
              <button  onClick={()=>setRideType("rental")} className={`items-cente rounded-lg p-2 transition-transform duration-300 hover:scale-105 px-4 ${ride_type === "rental"? "bg-[linear-gradient(270deg,_#8E3FD3_0%,_#2563EB_100%)] text-white ":"bg-white  border border-solid border-[#005FE2] text-[#2563EB]"}`}>
                <span className='' >Rental</span>
              </button>
            </div>
          </div>

          {/* 👉 Yahi pe buttons aur city details aayenge */}
          <div className='bg-white rounded-md p-4 shadow space-y-4'>
            {/* City Buttons */}
            <div className='flex flex-wrap gap-2'>
              {visibleCities?.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleCityClick(city)}

                  className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${activeCity === city.city_name
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-black border border-gray-300 hover:bg-gray-100'
                    }`}
                >
                  {city.city_name}
                </button>
              ))}

              {showMore && extraCities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleCityClick(city)}
                  className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${activeCity === city.city_name
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-black border border-gray-300 hover:bg-gray-100'
                    }`}
                >
                  {city.city_name}
                </button>
              ))}

              {extraCities?.length > 0 && (
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-blue-600 border border-blue-600 bg-white hover:bg-blue-50"
                >
                  {showMore ? 'Less ▲' : 'More ▼'}
                </button>
              )}
            </div>
          </div>
          {/* Selected City Details */}
          <div className="pt-2">
            {renderCityDetails()}
          </div>
        </div>

      </div>


      {/* <Global /> */}
      {/* <PatnaRental /> */}
      {/* <CabOverview /> */}

    </div>
  )
}

export default Page
