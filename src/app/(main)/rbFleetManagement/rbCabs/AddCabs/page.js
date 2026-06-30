
"use client";
import React, { useEffect, useCallback } from "react";
import { FiArrowLeft, FiUpload } from "react-icons/fi";
import { FaCar } from "react-icons/fa";
import { HiLink } from "react-icons/hi";
import { apiClient } from "@/app/lib/apiClient";
import CabFormVerify from "@/components/rbCabs/CabFormVerify";
import { GrLinkNext } from "react-icons/gr";
import Image from "next/image";
import Swal from "sweetalert2";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { setPage, setCabId, fetchCabModelList, fetchCabTypeList, fetchCabFuelList } from "@/redux/features/rbCabMainSlice";

import {
    setFormData,
    setUploads,
    setProgress,
    setShowPopup,
    setFlagForPopUp,
    setUploadImageCount,
} from "@/redux/features/rbCabSlice";

const AddRbCab = () => {
    const dispatch = useDispatch();
    const { page, selectedCabId, cabModels, cabTypes, cabFuel, loading, error } = useSelector(
        (state) => state.rbCabMain
    );

    useEffect(() => {
        dispatch(fetchCabModelList());
        dispatch(fetchCabTypeList());
        dispatch(fetchCabFuelList());
    }, [dispatch]);

    // const kkk uniqueCabs = [
    //     ...new Map(
    //         cabModels.map(item => [`${item.make_name}-${item.make_model}`, item])
    //     ).values()
    // ];

    // console.log("CabModels from Redux  car modales:", cabFuel);

    const {
        formData,
        uploads,
        progressPercentage,
        showPopup,
        flagForPopUp,
        uploadImageCount,
    } = useSelector((state) => state.rbCab);

    const documents = [
        { key: "rcFront", title: "RC - Front Image", required: true },
        { key: "rcBack", title: "RC - Back Image", required: true },
        { key: "insurance", title: "Insurance Document", required: true },
        { key: "pollution", title: "Pollution Certificate", required: true },
        { key: "permit", title: "Permit Certificate", required: true },
        { key: "fitness", title: "Fitness Certificate", required: true },
    ];

    const carImages = [
        { key: "carFront", title: "Front Side of Car", required: true },
        { key: "carBack", title: "Back Side of Car", required: true },
    ];

    const handleInputChange = (field, value) => {
        dispatch(setFormData({ [field]: value }));
    };

    const handleFileUpload = async (key, file) => {
        const fileURL = URL.createObjectURL(file);
        dispatch(setUploads({ [key]: { file, preview: fileURL } }));
        return true;
    };

    const calculateProgress = useCallback(() => {
        const totalFields = 6;
        let filledFields = 0;

        for (const key in formData) {
            if (formData[key] && formData[key].trim() !== "") filledFields++;
        }
        return (filledFields / totalFields) * 100;
    }, [formData]);


    useEffect(() => {
        const progress = calculateProgress();
        dispatch(setProgress(progress));
    }, [calculateProgress, dispatch]);

    const addCab = async () => {
        const payData = {
            cab_name: formData.carType,
            cab_type_id:
                formData.carType === "Mini"
                    ? 1
                    : formData.carType === "Sedan"
                        ? 2
                        : 3,
            cab_reg: formData.registrationNumber,
            cab_service_type: "fulltime",
            own_driver: formData.carrier?.toLowerCase() === "yes" ? "yes" : "no",
            cab_model: formData.carModel,
        };
        try {
            const response = await apiClient(
                "POST",
                "/rb_cabs/rbCreateCab",
                JSON.stringify(payData),
                true
            );
            if (response?.success) {
                dispatch(setShowPopup(false));
                dispatch(setFlagForPopUp(true));
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "submitted successfully.",
                    confirmButtonText: "OK",
                });
            } else {
                dispatch(setShowPopup(false));
                dispatch(setFlagForPopUp(false));
                dispatch(setCabId(formData.registrationNumber));
                dispatch(setPage("CabOverview"))
                Swal.fire({
                    icon: "warning",
                    title: "Cab Already Exists!",
                    text: "Duplicate entry detected.",
                    showConfirmButton: false,
                    timer: 1800,
                    width: "320px",
                    background: "#fefefe",
                    iconColor: "#f87171",
                });
            }
        } catch (error) {
            dispatch(setShowPopup(false));
            Swal.fire({
                icon: "warning",
                title: "Cab Already Exists!",
                text: "Duplicate entry detected.",
                showConfirmButton: false,
                timer: 1800,
                width: "320px",
                background: "#fefefe",
                iconColor: "#f87171",
            });
        }
    };

    return (
        <div className="mb-24 mx-[60px] md:mx-[200px]">
            <div className="flex gap-8 items-center bg-white mx-6 p-4 rounded-lg shadow-sm">
                {/* <div className="flex items-center gap-2 text-gray-700 text-sm font-medium mb-4 cursor-pointer">
                    <FiArrowLeft className="text-lg" />
                    <span>Back to Dashboard</span>
                </div> */}
                <div className="flex flex-col items-start gap-2">
                    <h1 className="text-xl font-semibold bg-gradient-to-r from-[#2662EB] to-[#7F3CEA] bg-clip-text text-transparent">
                        Add Cabs Details
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Complete Cab registration for RodBez
                    </p>
                </div>
            </div>
            <div className="mx-6">
                <div className="flex justify-between items-center mt-4 mb-2">
                    <span className="text-sm font-medium text-gray-600">Progress</span>
                    <span className="text-sm font-medium text-blue-600">
                        {progressPercentage?.toFixed?.(0) || 0}%
                    </span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                            width: `${progressPercentage}%`,
                        }}
                    ></div>
                </div>
            </div>
            <div className="bg-white shadow-md rounded-2xl m-6 pb-4">
                <div className="flex items-center gap-2 p-4">
                    <div className="flex items-center justify-center bg-gradient-to-r from-[#2662EB] to-[#7F3CEA] p-2 rounded-lg text-white">
                        <FaCar size={18} />
                    </div>
                    <h2 className="text-lg font-semibold">Basic Cab Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 py-2 pb-6">
                    {[
                        {
                            label: "Registration Number",
                            key: "registrationNumber",
                            placeholder: "Enter Registration Number",
                            type: "text",
                        },
                        {
                            label: "Car Type",
                            key: "carType",
                            placeholder: "e.g., Sedan, SUV, Mini",
                            type: "select",
                            options: (cabTypes || []).map((cab) => ({
                                label: cab.cab_type,
                                value: cab.cab_type,
                                key: cab.id,
                            })),
                        },
                        {
                            label: "Car Service Type",
                            key: "cabServiceType",
                            placeholder: "e.g., Agreement, Not Agreement",
                            type: "select",
                            options: ["Agreement", "Not Agreement"],
                        },


                        {
                            label: "Car Model",
                            key: "carModel",
                            placeholder: "e.g., Ertiga",
                            type: "select",
                            // options: ["Agreement", "Not Agreement"],
                            options: (cabModels || []).map((cab) => ({
                                label: `${cab.make_model} (${cab.make_name})`,
                                value: cab.make_model,
                                key: cab.id,
                            })),
                        },
                        {
                            label: "Fuel Type",
                            key: "fuelType",
                            placeholder: "e.g., Petrol, Diesel, CNG, Electric",
                            type: "select",
                            // options: ["Yes", "No"],
                            options: (cabFuel || []).map((cab) => ({
                                label: cab.fuel_type,
                                value: cab.fuel_type,
                                key: cab.id,
                            })),
                        },
                        {
                            label: "Carrier",
                            key: "carrier",
                            placeholder: "e.g., Yes, No",
                            type: "select",
                            options: ["Yes", "No"],
                        },

                    ].map((field) => (
                        <div key={field.key}>
                            <label className="block text-sm font-medium mb-2">
                                {field.label} <span className="text-red-500">*</span>
                            </label>
                            {field.type === "text" ? (
                                <input
                                    type="text"
                                    placeholder={field.placeholder}
                                    value={formData?.[field?.key] || ""}
                                    onChange={(e) => {
                                        // space hatao aur uppercase me convert karo
                                        const formattedValue = e.target.value.replace(/\s+/g, "").toUpperCase();
                                        handleInputChange(field.key, formattedValue);
                                    }}
                                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition 
                                    ${formData?.[field?.key] ? "bg-blue-50 border-blue-300 text-black" : "bg-white border-gray-300 text-gray-500"}`}
                                />

                            ) : (
                                <select
                                    value={formData?.[field?.key] || ""}
                                    onChange={(e) =>
                                        handleInputChange(field.key, e.target.value)
                                    }
                                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition 
                        ${formData?.[field?.key] ? "bg-blue-50 border-blue-300 text-black" : "bg-white border-gray-300 text-gray-500"}`}
                                >
                                    <option value="">{field.placeholder}</option>
                                    {(field.options || []).map((opt) =>
                                        typeof opt === "string" ? (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ) : (
                                            <option key={opt.key || opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        )
                                    )}

                                </select>
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-end mx-6">
                    <button
                        onClick={() => {
                            if ((progressPercentage === 100) && (flagForPopUp === false)) {
                                dispatch(setFlagForPopUp(true));
                                dispatch(setShowPopup(true));
                            }
                        }}
                        disabled={(progressPercentage !== 100) || (flagForPopUp === true)}
                        className={`py-2 px-4 rounded-full font-medium transition-colors duration-300 
      ${(progressPercentage === 100) && (flagForPopUp === false)
                                ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                                : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
                    >
                        Submit form
                    </button>
                </div>
            </div>
            <div
                className={`bg-white rounded-2xl shadow m-6 pb-4 ${flagForPopUp ? "blur-0 opacity-100 scale-100" : "blur-[1px] opacity-70 scale-95"
                    } transition-all duration-300`}
            >
                <div className="flex items-center gap-2 p-4">
                    <div className="bg-purple-500 p-2 rounded-lg bg-gradient-to-r from-[#A94BDB] to-[#D32F8D] text-white">
                        <FaCar size={20} />
                    </div>
                    <h2 className="text-lg font-semibold">
                        Registration & Compliance Documents
                    </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-4 pb-8">
                    {documents.map((doc) => (
                        <div key={doc.key}
                            className="flex flex-col w-full">
                            <p className="text-sm font-semibold text-gray-800 mb-2">
                                {doc.title} {doc.required && <span className="text-red-500">*</span>}
                            </p>

                            <label
                                className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-xl p-6 text-center hover:border-blue-500 cursor-pointer transition  ">
                                {uploads?.[doc?.key]?.preview ? (
                                    <div className="relative w-full h-40">
                                        <Image
                                            src={uploads?.[doc?.key]?.preview}
                                            alt="Preview"
                                            fill
                                            className="object-cover rounded-lg"
                                        />
                                    </div>

                                ) : (
                                    <>
                                        <FiUpload className="text-blue-500 mb-2" size={24} />
                                        <span className="text-blue-500 mt-1">
                                            {doc.title === "RC - Back Image" ? "Upload Back Image" : "Upload Front Image"}
                                        </span>

                                        <span className=" flex items-center text-sm text-blue-500 mt-1"><HiLink /> Click to upload</span>
                                    </>
                                )}
                                <input
                                    disabled={progressPercentage !== 100}
                                    type="file"
                                    accept="image/*,application/pdf"
                                    hidden
                                    onChange={(e) => {
                                        if (e.target.files[0]) {
                                            handleFileUpload(doc.key, e.target.files[0])
                                                .then((success) => {
                                                    if (success) {
                                                    }
                                                })
                                                .catch(() => {
                                                    console.error("Upload failed");
                                                });
                                        }
                                    }}

                                />

                            </label>
                        </div>
                    ))}
                </div>
            </div>
            <div
                className={`m-6 rounded-xl shadow-md bg-white ${flagForPopUp
                    ? "blur-0 opacity-100 scale-100"
                    : "blur-[1px] opacity-70 scale-95"
                    } transition-all duration-300`}
            >

                <div className="flex items-center gap-2 p-4">
                    <div className="bg-purple-500 p-2 rounded-lg bg-gradient-to-r from-[#A94BDB] to-[#D32F8D] text-white">
                        <FaCar size={20} />
                    </div>
                    <h2 className="text-lg font-semibold" style={{ color: "#2C2C2C" }}>
                        Upload Car Image
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    <div>
                        <p className="mb-1 text-sm font-medium" style={{ color: "#2C2C2C" }}>
                            Front side of car <span className="text-red-500">*</span>
                        </p>
                        <label className="rounded-lg p-4 flex flex-col items-center justify-center border-2 border-dashed border-blue-300 hover:border-blue-500 cursor-pointer">
                            {uploads?.["carFront"]?.preview ? (
                                <div className="relative w-full h-40">
                                    <Image
                                        src={uploads?.["carFront"]?.preview}
                                        alt="Preview"
                                        fill
                                        className="object-cover rounded-lg"
                                    />
                                </div>

                            ) : (
                                <>
                                    <FiUpload className="text-blue-500 mb-2" size={24} />
                                    <span className="text-md text-blue-500 mt-1">Click to upload</span>
                                </>
                            )}
                            <input
                                disabled={progressPercentage !== 100}
                                type="file"
                                accept="image/*,application/pdf"
                                hidden
                                onChange={(e) => {
                                    if (e.target.files[0]) {
                                        handleFileUpload("carFront", e.target.files[0])
                                            .then((success) => {
                                                if (success) {
                                                }
                                            })
                                            .catch(() => {
                                                console.error("Upload failed");
                                            });
                                    }
                                }}
                            />
                        </label>
                    </div>
                    <div>
                        <p className="mb-1 text-sm font-medium" style={{ color: "#2C2C2C" }}>
                            Back side of car <span className="text-red-500">*</span>
                        </p>
                        <label className="rounded-lg p-4 flex flex-col items-center justify-center border-2 border-dashed border-blue-300 hover:border-blue-500 cursor-pointer">
                            {uploads?.["carBack"]?.preview ? (
                                <div className="relative w-full h-40">
                                    <Image

                                        src={uploads?.["carBack"]?.preview}
                                        alt="Preview"
                                        fill
                                        className="object-cover rounded-lg"
                                    />
                                </div>

                            ) : (
                                <>
                                    <FiUpload className="text-blue-500 mb-2" size={24} />
                                    <span className="text-md text-blue-500 mt-1">Click to upload</span>
                                </>
                            )}
                            <input
                                disabled={progressPercentage !== 100}
                                type="file"
                                accept="image/*,application/pdf"
                                hidden
                                onChange={(e) => {
                                    if (e.target.files[0]) {
                                        handleFileUpload("carBack", e.target.files[0])
                                            .then((success) => {
                                                if (success) {
                                                    dispatch(setUploadImageCount((uploadImageCount) => uploadImageCount + 1));
                                                }
                                            })
                                            .catch(() => {
                                                console.error("Upload failed");
                                            });
                                    }
                                }}
                            />
                        </label>
                    </div>
                </div>
                <div className="flex justify-end px-4 pb-3">
                    <button

                        disabled={(progressPercentage !== 100) || (flagForPopUp === false) || (!uploadImageCount)}

                        className={`flex py-2 px-8 rounded-full font-medium transition-colors duration-300 items-center justify-center gap-2
                        ${(uploadImageCount)
                                ? "bg-blue-600 hover:bg-blue-700 text-white "
                                : "bg-gray-200 text-gray-500 "}`}
                    >
                        <span className="text-[14px]">Next</span>
                        <GrLinkNext />
                    </button>
                </div>
            </div>
            {showPopup && (
                <CabFormVerify
                    payData={formData}
                    onConfirm={() => {
                        addCab(); // existing confirm function
                        dispatch(setShowPopup(false)); // close popup
                        dispatch(setFlagForPopUp(false)); // reset flag
                        // dispatch(setPage("CabOverview")); // redirect to another page
                    }}
                    onCancel={() => {
                        dispatch(setShowPopup(false));
                        dispatch(setFlagForPopUp(false));
                        // dispatch(setPage("CabOverview")); // bhi cancel ke baad page change kar sakte ho
                    }}
                />
            )}
        </div>
    );
};

export default AddRbCab;
