



"use client";
import { useState } from "react";
import { FaCarSide } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setPage, sendOtp, setMobile } from "@/redux/features/signInPageSlice";


export default function PageThree() {
    const dispatch = useDispatch();
    const { loading, error, mobile } = useSelector((state) => state.signInPage);

    const handleSendOtp = () => {
        if (mobile.length !== 10) return; // Safety check

        dispatch(sendOtp(mobile)).then((res) => {
            if (res.meta.requestStatus === "fulfilled") {
                dispatch(setPage("pageTwo")); // ✅ Only change page if OTP sent
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex">
            {/* Background (no blur, semi-transparent) */}
            <div className="absolute inset-0 bg-black/20" />

            {/* Modal content */}
            <div
                className=" fixed w-[450px] p-6 flex flex-col z-10 right-[5%] top-[5%] bottom-[5%]
                   rounded-3xl "
            >
                {/* Gradient border wrapper */}
                <div className="absolute inset-0 rounded-3xl p-[3px] bg-gradient-to-r from-blue-400/50 to-blue-400/10 ">
                    <div className="w-full h-full rounded-3xl bg-black"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                    {/* TOP: Brand Name row */}
                    <div className="w-full flex justify-center items-center mb-6">
                        <h1 className="text-3xl font-bold">
                            <span className="text-white ">Rod</span>
                            <span className="text-yellow-400">B</span>
                            <span className="text-white">ez</span>

                        </h1>
                    </div>

                    {/* MIDDLE: Content */}
                    <div className="w-full flex flex-col justify-start items-start flex-1">
                        {/* Welcome section */}
                        <div className="flex items-start gap-3 mb-3">
                            <div className="bg-yellow-400 p-3 rounded-lg">
                                <FaCarSide className="text-black text-xl" />
                            </div>
                            <div>
                                <h2 className="text-lg text-white font-bold  font-nunito">Welcome to jaiBabajiCab</h2>
                                <p className="text-gray-400 text-sm">Sign in to your dashboard</p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm  font-nunito">Enter your registered mobile number</p>

                        {/* Input fields */}
                        <div className="flex w-full gap-2 mb-4 mt-6">
                            <input
                                type="text"
                                value="+91"
                                readOnly
                                className="w-20 bg-[#1e2330] text-white p-3 rounded-lg outline-none"
                            />
                            <input
                                type="text"
                                placeholder={mobile || "Enter number"}
                                className="flex-1 bg-[#1e2330] text-white p-3 rounded-lg outline-none"
                            />
                        </div>

                        {/* Button */}
                        <div className="grid grid-cols-6 gap-5 px-1">
                            <div className="h-12 w-12 bg-gray-700 rounded-xl">

                            </div>
                            <div className="h-12 w-12 bg-gray-700 rounded-xl">

                            </div>
                            <div className="h-12 w-12 bg-gray-700 rounded-xl">

                            </div>
                            <div className="h-12 w-12 bg-gray-700 rounded-xl">

                            </div>
                            <div className="h-12 w-12 bg-gray-700 rounded-xl">

                            </div>
                            <div className="h-12 w-12 bg-gray-700 rounded-xl">

                            </div>

                        </div>
                        <button className="text-white text-[12px]  underline underline-offset-4 ml-auto pr-3 mt-2"
                            onClick={handleSendOtp}
                        >
                            Resent OTP
                        </button>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}


                        <button
                            onClick={() => (dispatch(setPage("pageFour")))}
                            className="w-full bg-gray-700 text-white font-semibold py-3 rounded-lg hover:opacity-90 mt-4">
                            Login
                        </button>

                        {/* Info text */}
                        {/* <p className="text-gray-400 text-xs mt-3  font-nunito">
                            We will send a one time password (OTP) to this number
                        </p> */}
                    </div>

                    {/* BOTTOM: Terms */}
                    <div className="w-full text-center mt-6">
                        <p className="text-gray-500 text-xs">
                            By continuing you agree to our{" "}
                            <span className="underline cursor-pointer text-white">terms</span> and{" "}
                            <span className="underline cursor-pointer text-white">privacy policy</span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
