"use client";
import { useState, useRef, useEffect } from "react";
import { FaCarSide } from "react-icons/fa";
// import { useDispatch } from "react-redux";
import { setPage } from "@/redux/features/signInPageSlice";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { setMobile } from "@/redux/features/signInPageSlice";
import { apiClient } from "@/app/lib/apiClient";
import Cookies from "js-cookie";


export default function PageTwo() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const inputRefs = useRef([]);
    const [timer, setTimer] = useState(30); // 30 seconds countdown
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");


    const { mobile } = useSelector(state => state.signInPage);

    // Handle OTP input change
    const handleChange = (e, index) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        if (value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Auto-focus next input
            if (value && index < otp.length - 1) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    // Handle backspace
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };


    const handleVerifyOtp = async () => {
        const otpValue = otp.join(""); // OTP as string

        if (otpValue.length !== 6) return;

        try {
            const response = await apiClient("POST", "/rbac/verify-otp-rod-yaan", {
                mobile_no: mobile,
                otp: otpValue
            });

            if (response.success) {
                const data = response;
                dispatch(setPage("pageFour"));
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data));
                Cookies.set('adminAuthToken', data.data.token, { expires: 7, path: '/' });
                
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 2000);
            } else {
                setModalMessage(response.message || "Invalid OTP. Please try again.");
                setShowModal(true);
            }
        } catch (err) {
            setModalMessage("Something went wrong!");
            setShowModal(true);
        }
    };
    // Countdown timer
    useEffect(() => {
        if (timer === 0) {
            dispatch(setPage("pageThree")); // ✅ Timer khatam hone par page aage
            return;
        }

        const interval = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer, dispatch]);




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
                            <span className="text-white">rod</span>
                            <span className="text-yellow-400">Yaan</span>
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
                                <h2 className="text-lg text-white font-bold  font-nunito">Welcome to rodYaan</h2>
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

                        {/* OTP fields */}
                        <div className="grid grid-cols-6 gap-5 px-1">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    value={digit}
                                    onChange={(e) => handleChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)} // ✅ Backspace handling
                                    maxLength={1}
                                    ref={el => (inputRefs.current[index] = el)}
                                    className="h-12 w-12 bg-gray-700 text-white text-center text-xl rounded-xl focus:outline-none"
                                />
                            ))}

                        </div>

                        {/* Timer */}
                        <span className="text-white text-[12px] underline underline-offset-4 ml-auto pr-3 mt-2">
                            00:{timer.toString().padStart(2, "0")}
                        </span>

                        <button
                            onClick={handleVerifyOtp}
                            disabled={otp.some(d => d === "")} // Disable if any input empty
                            className={`w-full bg-gradient-to-r from-orange-400 to-yellow-400 text-black font-semibold py-3 rounded-lg hover:opacity-90 mt-4 ${otp.some(d => d === "") ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                        >
                            Verify OTP
                        </button>

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
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-gray-900 text-white rounded-3xl shadow-2xl p-6 w-80 flex flex-col items-center transform transition-transform duration-200 hover:scale-105">

                        {/* Icon */}
                        <div className="bg-yellow-400 text-black rounded-full p-3 mb-4 shadow-md">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                            </svg>
                        </div>

                        {/* Message */}
                        <p className="text-center text-sm font-medium mb-6">{modalMessage}</p>

                        {/* Button */}
                        <button
                            className="w-full bg-yellow-400 text-black font-semibold py-2 rounded-xl hover:brightness-110 transition-all duration-200 shadow-md"
                            onClick={() => setShowModal(false)}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}



        </div>
    );
}
