"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";

export default function PageFour({ onClose }) {
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if(user) {
      const userData = JSON.parse(user) || JSON.parse(user);
      console.log("User Data:", userData);
      if(userData && userData.user) {
        setUserData(userData.user);
      } else {
        console.log("User name not found in the user data.");
        setUserData(null);
      }
    }
    const timer = setTimeout(() => {
      router.push('/dashboard');
      // router.push("/auth/signin/pageFive"); // ✅ Next.js way
    },100);

    return () => clearTimeout(timer);
  }, [router]);

  const getGreeting = () => {
    const currentHour = moment().hour(); // Get the current hour (0-23)
    if (currentHour >= 5 && currentHour < 12) {
      return "Good Morning";
    } else if (currentHour >= 12 && currentHour < 17) {
      return "Good Afternoon";
    } else if (currentHour >= 17 && currentHour < 22) {
      return "Good Evening";
    } else {
      return "Hello"; // Or "Hello" for late night/early morning
    }

  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay with blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-[390px] p-8 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 shadow-lg text-center">
        {/* Logo */}
        <h1 className="text-3xl font-bold mb-6">
          <span className="text-white">rod</span>
          <span className="text-yellow-400">Yaan</span>
        </h1>

        {/* Success Icon */}
        <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-gradient-to-b from-yellow-400 to-orange-500 shadow-lg mb-6">
          <Check className="w-8 h-8 text-white" />
        </div>

        {/* Text */}
        <h2 className="text-2xl font-semibold text-white mb-2">
          Login Successful
        </h2>
        <p className="text-lg text-gray-200 mb-1">{getGreeting()}, {userData?.name}</p>
        <p className="text-sm text-gray-400">
          Welcome back! You can now access your dashboard.
        </p>
      </div>
    </div>
  );
}
