"use client";
import { useState } from "react";
import { FaCarSide } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setPage, sendOtp, setMobile } from "@/redux/features/signInPageSlice";

export default function PageOne() {
    const dispatch = useDispatch();
    const { loading, mobile } = useSelector((state) => state.signInPage);

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const handleSendOtp = () => {
        if (mobile.length !== 10) {
            setModalMessage("Please enter a valid 10-digit mobile number.");
            setShowModal(true);
            return;
        }

        dispatch(sendOtp(mobile))
            .then((res) => {
                if (res.meta.requestStatus === "fulfilled") {
                    const response = res.payload;

                    if (response.message === "Please enter the OTP!") {
                        dispatch(setPage("pageTwo")); // move to next page
                    } else {
                        // Show any other success or API message in modal
                        setModalMessage(response.message || "Something went wrong.");
                        setShowModal(true);
                    }
                } else {
                    // rejected case (API returned error)
                    setModalMessage(res.payload || "Something went wrong. Please try again.");
                    setShowModal(true);
                }
            })
            .catch(() => {
                setModalMessage("Unexpected error. Please try again.");
                setShowModal(true);
            });
    };

    return (
        <div className="fixed inset-0 z-50 flex">
            {/* Background */}
            <div className="absolute inset-0 bg-black/20" />

            {/* Main modal */}
            <div className="fixed w-[450px] p-6 flex flex-col z-10 right-[5%] top-[5%] bottom-[5%] rounded-3xl">
                <div className="absolute inset-0 rounded-3xl p-[3px] bg-gradient-to-r from-blue-400/50 to-blue-400/10">
                    <div className="w-full h-full rounded-3xl bg-black"></div>
                </div>

                <div className="relative z-10 flex flex-col h-full">
                    {/* Brand */}
                    <div className="w-full flex justify-center items-center mb-6">
                        <h1 className="text-3xl font-bold">
                            <span className="text-white">Rod</span>
                            <span className="text-yellow-400">B</span>
                            <span className="text-white">ez</span>
                        </h1>
                    </div>

                    {/* Middle */}
                    <div className="w-full flex flex-col justify-start items-start flex-1">
                        <div className="flex items-start gap-3 mb-3">
                            <div className="bg-yellow-400 p-3 rounded-lg">
                                <FaCarSide className="text-black text-xl" />
                            </div>
                            <div>
                                <h2 className="text-lg text-white font-bold font-nunito">
                                    Welcome to RodBez
                                </h2>
                                <p className="text-gray-400 text-sm">Sign in to your dashboard</p>
                            </div>
                        </div>

                        <p className="text-gray-400 text-sm font-nunito">
                            Enter your registered mobile number
                        </p>

                        {/* Input */}
                        <div className="flex w-full gap-2 mb-4 mt-6">
                            <input
                                type="text"
                                value="+91"
                                readOnly
                                className="w-20 bg-[#1e2330] text-white p-3 rounded-lg outline-none"
                            />
                            <input
                                type="text"
                                placeholder="Enter number"
                                value={mobile}
                                maxLength={10}
                                className="flex-1 bg-[#1e2330] text-white p-3 rounded-lg outline-none"
                                onChange={(e) =>
                                    dispatch(setMobile(e.target.value.replace(/[^0-9]/g, "")))
                                }
                            />
                        </div>

                        {/* Send OTP */}
                        <button
                            onClick={handleSendOtp}
                            disabled={mobile.length !== 10 || loading}
                            className={`w-full bg-gradient-to-r from-orange-400 to-yellow-400 text-black font-semibold py-3 rounded-lg hover:opacity-90 ${
                                mobile.length !== 10 || loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </button>

                        <p className="text-gray-400 text-xs mt-3 font-nunito">
                            We will send a one time password (OTP) to this number
                        </p>
                    </div>

                    {/* Bottom */}
                    <div className="w-full text-center mt-6">
                        <p className="text-gray-500 text-xs">
                            By continuing you agree to our{" "}
                            <span className="underline cursor-pointer text-white">terms</span> and{" "}
                            <span className="underline cursor-pointer text-white">privacy policy</span>.
                        </p>
                    </div>
                </div>
            </div>

            {/* Error/Info Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fadeIn">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl shadow-2xl p-6 w-80 flex flex-col items-center transform transition-transform duration-200 scale-100">
                        <div className="bg-yellow-400 text-black rounded-full p-3 mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                                />
                            </svg>
                        </div>

                        <p className="text-center text-sm font-medium mb-6">{modalMessage}</p>

                        <button
                            className="w-full bg-yellow-400 text-black font-semibold py-2 rounded-xl hover:brightness-110 transition-all duration-200"
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
