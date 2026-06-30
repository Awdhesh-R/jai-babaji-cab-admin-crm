"use client";
import React, { useState, useEffect } from "react";
import EditUserModal from "../modals/EditUserModal";
import EditUserAddress from "../modals/EditUserAddress";
import Image from "next/image";

export default function UserInfoCard() {
  const [isPersonalModalOpen, setPersonalModalOpen] = useState(false);
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);
  const [theme, setTheme] = useState("dark");

  const userData = {
    firstName: "Murari Kumar",
    lastName: "Pathak",
    email: "starkmurari@gmail.com",
    phone: "+91 8825114911",
    bio: "Software Developer",
    facebook: "https://facebook.com/murari",
    x: "https://twitter.com/murari",
    linkedin: "https://linkedin.com/in/murari",
    instagram: "https://instagram.com/murari",
    country: "India",
    cityState: "Patna Danapur Bihar.",
    postalCode: "801503",
  };

  useEffect(() => {
    const checkTheme = () => {
      if (document.documentElement.classList.contains("dark")) {
        setTheme("dark");
      } else {
        setTheme("light");
      }
    };

    checkTheme(); 
    const observer = new MutationObserver(checkTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="p-6 md:p-10 text-black dark:text-white">
      <div className="w-full mx-auto bg-white dark:bg-[#0C111F] rounded-2xl p-6 space-y-6">

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border border-gray-300 dark:border-[#1F2937] rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <Image
              src="/images/kumar.jpg"
              alt="Profile"
              width={46}
              height={46}
              className="rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-bold">{`${userData.firstName} ${userData.lastName}`}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Software Developer | Patna Bihar India
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {["facebook", "x", "linkedin", "instagram"].map((item, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border border-gray-400 dark:border-gray-600 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
              >
                <span className="text-sm">{item[0].toUpperCase()}</span>
              </div>
            ))}
            <button
              className="rounded-full bg-gray-100 dark:bg-[#1F2937] px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
              onClick={() => setPersonalModalOpen(true)}
            >
              ✏️ Edit
            </button>
          </div>
        </div>

        <div className="border border-gray-300 dark:border-[#1F2937] rounded-2xl p-6 relative">
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <button
            onClick={() => setPersonalModalOpen(true)}
            className="absolute top-4 right-4 rounded-full bg-gray-100 dark:bg-[#1F2937] px-4 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
          >
            ✏️ Edit
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">First Name</p>
              <p className="font-semibold">{userData.firstName}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Last Name</p>
              <p className="font-semibold">{userData.lastName}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Email address</p>
              <p className="font-semibold">{userData.email}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Phone</p>
              <p className="font-semibold">{userData.phone}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-gray-600 dark:text-gray-400 text-sm">Bio</p>
              <p className="font-semibold">{userData.bio}</p>
            </div>
          </div>
        </div>

        <div className="border border-gray-300 dark:border-[#1F2937] rounded-2xl p-6 relative">
          <h3 className="text-lg font-semibold mb-4">Address</h3>
          <button
            onClick={() => setAddressModalOpen(true)}
            className="absolute top-4 right-4 rounded-full bg-gray-100 dark:bg-[#1F2937] px-4 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
          >
            ✏️ Edit
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Country</p>
              <p className="font-semibold">{userData.country}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">City/State</p>
              <p className="font-semibold">{userData.cityState}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Postal Code</p>
              <p className="font-semibold">{userData.postalCode}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditUserModal
        isOpen={isPersonalModalOpen}
        onClose={() => setPersonalModalOpen(false)}
        userData={userData}
        theme={theme}
      />

      <EditUserAddress
        isOpen={isAddressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        userData={userData}
        theme={theme}
      />
    </div>
  );
}
