'use client';
import React from 'react';
import { FaMapMarkerAlt, FaUser, FaPhone, FaCarSide, FaRupeeSign } from 'react-icons/fa';

const RideCard = ({ ride }) => {
  return (
    <div className="bg-blue-100 dark:bg-blue-900 shadow-lg rounded-3xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition duration-300 flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Ride {ride.rideNumber}</h2>
        <span className="text-sm font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100">{ride.status}</span>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
        <div className="flex items-center gap-2"><FaUser /><span className="font-medium">Assign:</span> {ride.assign}</div>
        <div className="flex items-center gap-2"><FaUser /><span className="font-medium">Name:</span> {ride.userName}</div>
        <div className="flex items-center gap-2"><FaPhone /><span className="font-medium">Mobile:</span> {ride.userMobile}</div>
        <div className="font-medium text-gray-700 dark:text-gray-200">Connect Date: {ride.connectDate}</div>
        <div className="flex items-start gap-2">
          <FaMapMarkerAlt className="mt-1" />
          <div>
            <div><span className="font-medium">From:</span> {ride.source}</div>
            <div><span className="font-medium">To:</span> {ride.destination}</div>
          </div>
        </div>
        <div className="flex items-center gap-2"><FaCarSide /><span className="font-medium">Cab:</span> {ride.cab} | <span className="font-medium">Type:</span> {ride.rideType}</div>
        <div><span className="font-medium">Distance:</span> {ride.distance} | <span className="font-medium">Time:</span> {ride.duration}</div>
      </div>

      <div className="text-sm text-gray-700 dark:text-gray-200 border-t pt-3 mt-3 space-y-1">
        <div className="flex items-center gap-2"><FaRupeeSign /><span className="font-medium">Total:</span> ₹{ride.total} /-</div>
        <div><span className="font-medium">Advance:</span> ₹{ride.advance} (GST ₹{ride.gst})</div>
        <div><span className="font-medium">Rest:</span> ₹{ride.remaining} /-</div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold">Assign</button>
        <button className="flex-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-semibold">Add Cab</button>
        <button className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold">Mark External</button>
      </div>
    </div>
  );
};

const baseRide = {
  rideNumber: '250529266156',
  assign: 'Mirza (7717749578)',
  userName: 'user',
  userMobile: '0',
  connectDate: '29-May, 07:40 PM',
  source: 'Samanpura, Patna, Bihar, India',
  destination: 'Jalley High School, Pupri',
  status: 'Pending',
  payment: 'Unpaid',
  cab: 'Sedan',
  rideType: 'One Way',
  distance: '142 Km',
  duration: '03:44',
  total: 2702,
  advance: 615,
  gst: 93.89,
  remaining: 2087,
};

const rides = Array.from({ length: 9 }, (_, i) => ({
  ...baseRide,
  rideNumber: `${baseRide.rideNumber}-${i + 1}`,
}));

export default function RideCardGrid() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#1e1e2f] p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {rides.map((ride, idx) => (
          <RideCard key={idx} ride={ride} />
        ))}
      </div>
    </div>
  );
}