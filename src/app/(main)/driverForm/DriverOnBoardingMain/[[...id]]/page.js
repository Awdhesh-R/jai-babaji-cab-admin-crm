"use client"
import React, { useState, useEffect, useRef } from "react";
import {
    User,
    IdCard,
    Upload,
    CreditCard
} from "lucide-react";
import { FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import { fetchCityList } from '@/redux/features/clusterMainSlice';
import Image from "next/image"
import AutoCompletePage from "@/components/autocomplete/AutoComplete";
import { useDispatch, useSelector } from "react-redux";
import { apiClient } from "@/app/lib/apiClient";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";



const Page = () => {
    const {id} = useParams();
    console.log(id)
    // 👇 yeh teen variable define karne honge
    const step = 1; // current step (1 to 4)
    const steps = ["Basic Info", "Identity", "Licence", "Address"];
    const progress = (step / steps.length) * 100;
    const [sameAsMobile, setSameAsMobile] = useState(false);
    const [driver, setDriver] = useState();

  const [imageUrl, setImageUrl] = useState('/icons/plus.svg'); 
    const {cityList} = useSelector((state)=> state.clusterMain)
    const [mobile, setMobile] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const inputRef = useRef(null);
    const [query, setQuery] = useState("");
    const [driverName, setDriverName] = useState("");
    const [alternateNumber, setAlternateNumer] = useState("");
    const [familyContactNo, setFamilyContactNo] = useState("");
    const [aadharNo, setAadharNo] = useState("");
    const [dlNumber, setDlNumber] = useState("");
    const [dlValidDate, setDlValidDate] = useState("");
    const [driverImage, setDriverImage] = useState();
    const [isEdit, setIsEdit] = useState(false);
    const [driverDocuments, setDriverDocument] = useState();
    const dispatch = useDispatch();

    useEffect(()=>{
        if(!cityList?.length && dispatch) dispatch(fetchCityList());
    }, [cityList, dispatch]);

    useEffect(()=>{
        if(id){
            setIsEdit(true);
            fetchDriver(id[0]);
            fetchDriverDocuments(id[0]);
        }
    }, [id]);

    useEffect(()=>{
        if(driver) {
            setDriverName(driver.driverName || "");
            setAadharNo(driver.driverAadharNo || "");
            setDlNumber(driver.drvLicenseNumber || "");
            setAddress(driver.driverAddress || "");
            setCity(driver.driverCity || "");
            setQuery(driver.driverCity || "");
            setWhatsapp(driver.driverWaMobile|| "");
            setMobile(driver.driverMobile|| "");
            setSameAsMobile(driver.driverMobile == driver.driverWaMobile);
            setAlternateNumer(driver.driverAlternateNumber || "");
            if (driver.driverImage) {
                if (driver.driverImage.startsWith('http') || driver.driverImage.startsWith('data:')) {
                    setImageUrl(driver.driverImage);
                } else {
                    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";
                    setImageUrl(`${baseUrl.replace(/\/$/, "")}/${driver.driverImage.replace(/^\//, "")}`);
                }
            }
        }
    }, [driver]);
    const fetchDriver = async (id) => {
        const res = await apiClient("GET", `/rb_drivers/getDriverById/${id}`);
        if (res?.success) {
            setDriver(res?.data);
        } else {
            console.error("API error:", res.message);
        }
    };
    const fetchDriverDocuments = async (id) => {
        const res = await apiClient("GET", `/rb_drivers/getdriverdocumentbydriverId/${id}`);
        if(res.success) {
            console.log(res);
            setDriverDocument(res.data);
        } else {
            toast.error(res.message);
        }
    }
    const handleCheckbox = () => {
        setSameAsMobile(!sameAsMobile);
        if (!sameAsMobile) {
            setWhatsapp(mobile);
        } else {
            setWhatsapp("");
        }
    };

    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");

    const handleReset = () => {
        setAddress("");
        setCity("");
        setMobile("");
        setWhatsapp("");
        setSameAsMobile(false);
        setDriverImage(null);
        setDlNumber("");
        setAadharNo("");
        setAlternateNumer("");
        setDlValidDate("");
        setFamilyContactNo("");
        setDriverName("");
        setQuery("");
    };

    const isValidForm = () => {
        if (!driverImage && !isEdit) {
            toast.warning("Driver photo is required.");
            return false;
        }
        if (!driverName) {
            toast.warning("Driver name is required.");
            return false;
        }
        if (!mobile) {
            toast.warning("Mobile number is required.");
            return false;
        }
        if (!sameAsMobile && !whatsapp) {
            toast.warning("WhatsApp number is required.");
            return false;
        }
        if (!aadharNo) {
            toast.warning("Aadhar card number is required.");
            return false;
        }
        if (!dlNumber) {
            toast.warning("Driving licence number is required.");
            return false;
        }
        if (!dlValidDate) {
            toast.warning("Licence validity date is required.");
            return false;
        }
        if (!address) {
            toast.warning("Complete address is required.");
            return false;
        }
        if (!city) {
            toast.warning("City is required.");
            return false;
        }
        return true;
    }
    const formatFormData = () => {
        const payload = new FormData();
        payload.append("drvLicenseNumber", dlNumber);
        payload.append("driverName", driverName);
        payload.append("driverCity", city);
        payload.append("driverMobile", mobile);
        if (driverImage) {
            payload.append("driverImage", driverImage);
        }
        payload.append("driverAddress", address);
        payload.append("driverWhatsAppNumber", sameAsMobile? mobile : whatsapp);
        payload.append("aadharNo", aadharNo);
        payload.append("alternateNumber", alternateNumber);
        if (id && id[0]) {
            payload.append("id", id[0]);
        }
        return payload;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(!isValidForm()) return;
            const payload = formatFormData();
            setUploading(true);
            const response = await apiClient("POST", "/rb_drivers/addDriver", payload, {'Content-Type': "multipart/form-data"});
            if(response.status) {

                toast.success(response.message);
            } else {
                toast.error(response.message);
            }
        } catch (err) {
            console.log(err)
            toast.error("Something went wrong!");
        } finally {
            setUploading(false);
        }
    };

    const [frontImage, setFrontImage] = useState(null);
    const [backImage, setBackImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleImageChange = (e, setImage) => {
        if (e.target.files && e.target.files[0]) {
            // Always set the File object, not a URL
            setImage(e.target.files[0]);
            readURL(e.target.files)

        }
    };
    function readURL(files) {
        if (files && files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                setImageUrl(e.target.result);
            };
            reader.readAsDataURL(files[0]);
        }
    }

    const [dlFrontImage, setDlFrontImage] = useState(null);
    const [dlBackImage, setDlBackImage] = useState(null);
    const handleDLImageChange = (e, setImage) => {
        if (e.target.files && e.target.files[0]) {
            // Set the File object, not a URL, for FormData compatibility
            setImage(e.target.files[0]);
        }
    };

    const handleDivClickForImageUpload = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    }

    return (
        <div className="flex flex-col">
            <form
                onSubmit={handleSubmit}
                className="shadow-lg rounded-2xl "
            >
                <div className="">
                    <div className="p-8 bg-white shadow-lg rounded-2xl mb-8">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-6">
                            <div className="bg-[linear-gradient(90deg,#4777F4_0%,#863EEC_100%)] rounded-2xl h-12 w-12 items-center justify-center px-2 py-2">
                                <User className="w-8 h-8 text-white " />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">
                                Driver Basic Information
                            </h2>
                        </div>
                        <div className="flex items-center gap-6 ">
                            <label className="block text-gray-700 font-medium">Driver Photo *</label>
                        </div>
                        <div className="flex items-center justify-center mb-8">
                            <div onClick={handleDivClickForImageUpload} className="w-28 h-28 rounded-full border-2 border-dashed border-blue-400 flex items-center justify-center overflow-hidden bg-gray-600">
                                <Image
                                    src={imageUrl || "/icons/plus.svg"}
                                    alt="Driver"
                                    id="driverImg"
                                    width={150}
                                    height={150}
                                    className="object-cover"
                                />
                                <input type="file" name="file-upload" ref={inputRef} onChange={(e)=> handleImageChange(e, setDriverImage)} style={{display: "none"}}/>

                            </div>
                        </div>

                        {/* Form Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Driver Name */}
                            <div>
                                <label className="block text-gray-700 font-medium">
                                    Driver Name *
                                </label>
                                <input
                                    type="text"
                                    value={driverName}
                                    onChange={e=> setDriverName(e.target.value)}
                                    placeholder="Enter full name" required
                                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:blue-pink-500"
                                />
                            </div>

                            {/* Mobile Number */}
                            <div>
                                <label className="block text-gray-700 font-medium">
                                    Mobile Number *
                                </label>
                                <input
                                    type="text"
                                    value={mobile}
                                    required
                                    onChange={(e) => setMobile(e.target.value)}
                                    placeholder="10 digit mobile number"
                                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:blue-pink-500"
                                />
                            </div>

                            {/* WhatsApp Number */}
                            <div>
                                <label className="block text-gray-700 font-medium">
                                    WhatsApp Number *
                                </label>
                                <input
                                    type="text"
                                    value={whatsapp}
                                    onChange={(e) => setWhatsapp(e.target.value)}
                                    placeholder="WhatsApp number"
                                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:blue-pink-500"
                                />
                                <div className="flex items-center gap-2 mt-2">
                                    <input
                                        type="checkbox"
                                        checked={sameAsMobile}
                                        onChange={handleCheckbox}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-gray-600 text-sm">Same as mobile number</span>
                                </div>
                            </div>

                            {/* Alternative Number */}
                            <div>
                                <label className="block text-gray-700 font-medium">
                                    Alternative Number (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={alternateNumber}
                                    onChange={e=> setAlternateNumer(e.target.value)}
                                    placeholder="Alternative contact"
                                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:blue-pink-500"
                                />
                            </div>
                        </div>

                        {/* Family Contact */}
                        <div className="mt-6">
                            <label className="block text-gray-700 font-medium">
                                Family Contact Number (Optional)
                            </label>
                            <input
                                type="text"
                                value={familyContactNo}
                                onChange={e=> setFamilyContactNo(e.target.value)}
                                placeholder="Emergency contact number"
                                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:blue-pink-500"
                            />
                        </div>
                    </div>
                    <div className="p-8 bg-white shadow-lg rounded-2xl mx-auto mb-8">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-6">
                            <IdCard className="w-6 h-6 text-pink-600" />
                            <h2 className="text-xl font-semibold text-gray-800">
                                Identity Verification
                            </h2>
                        </div>

                        {/* Aadhar Input */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium">
                                Aadhar Card Number *
                            </label>
                            <input
                                type="text"
                                maxLength="12"
                                value={aadharNo}
                                onChange={e=> setAadharNo(e.target.value)}
                                required
                                placeholder="12 digit Aadhar number"
                                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:blue-pink-500"
                            />
                        </div>

                        {/* Upload Boxes */}
                        {isEdit && <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Upload Aadhar Front Image *
                            </label>
                            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-300 transition">
                                {frontImage ? (
                                    <Image
                                        src={frontImage instanceof File ? URL.createObjectURL(frontImage) : frontImage}
                                        alt="Front Preview"
                                        width={300}
                                        height={200}
                                        className="w-full h-full object-cover rounded-lg"
                                    />

                                ) : (
                                    <div className="flex flex-col items-center text-center">
                                        <Upload className="w-8 h-8 text-blue-400 mb-2" />
                                        <p className="text-blue-400 font-medium">Click to upload</p>
                                        <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    className="hidden"
                                    onChange={(e) => handleImageChange(e, setFrontImage)}
                                />
                            </label>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Upload Aadhar Back Image *
                            </label>
                            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-300 transition">
                                {backImage ? (
                                    <Image
                                        src={backImage instanceof File ? URL.createObjectURL(backImage) : backImage}
                                        alt="Back Preview"
                                        width={300}
                                        height={200}
                                        className="w-full h-full object-cover rounded-lg"
                                    />

                                ) : (
                                    <div className="flex flex-col items-center text-center">
                                        <Upload className="w-8 h-8 text-blue-400 mb-2" />
                                        <p className="text-blue-400 font-medium">Click to upload</p>
                                        <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    className="hidden"
                                    onChange={(e) => handleImageChange(e, setBackImage)}
                                />
                            </label>
                        </div>
                    </div>}
                    </div>
                    <div className="p-8 bg-white shadow-lg rounded-2xl  mx-auto mb-8">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-6">
                            <CreditCard className="w-6 h-6 text-green-600" />
                            <h2 className="text-xl font-semibold text-gray-800">
                                Driving Licence Details
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-gray-700 font-medium">
                                    Driving Licence Number *
                                </label>
                                <input
                                    type="text"
                                    value={dlNumber}
                                    onChange={e=> setDlNumber(e.target.value)}
                                    placeholder="DL number"
                                    required
                                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:blue-pink-500"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium">
                                    Licence Validity Date *
                                </label>
                                <input
                                    type="date"
                                    placeholder="dd-mm-yyyy"
                                    value={dlValidDate}
                                    onChange={e=> setDlValidDate(e.target.value)}
                                    required
                                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:blue-pink-500"
                                />
                            </div>
                        </div>

                        {/* Upload Section */}
                        {isEdit && <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Upload Licence Front Image *
                            </label>
                            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-300 transition">
                                {dlFrontImage ? (
                                    <Image
                                        src={dlFrontImage instanceof File ? URL.createObjectURL(dlFrontImage) : dlFrontImage}
                                        alt="Licence Front"
                                        width={300}
                                        height={200}
                                        className="w-full h-full object-cover rounded-lg"
                                    />

                                ) : (
                                    <div className="flex flex-col items-center text-center">
                                        <Upload className="w-8 h-8 text-blue-400 mb-2" />
                                        <p className="text-blue-400 font-medium">Click to upload</p>
                                        <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    className="hidden"
                                    onChange={(e) => handleDLImageChange(e, setDlFrontImage)}
                                />
                            </label>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Upload Licence Back Image *
                            </label>
                            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-300 transition">
                                {dlBackImage ? (
                                    <Image
                                        src={dlBackImage instanceof File ? URL.createObjectURL(dlBackImage) : dlBackImage}
                                        alt="Driver"
                                        width={150}
                                        height={150}
                                        className="object-cover"
                                    />

                                ) : (
                                    <div className="flex flex-col items-center text-center">
                                        <Upload className="w-8 h-8 text-blue-400 mb-2" />
                                        <p className="text-blue-400 font-medium">Click to upload</p>
                                        <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    className="hidden"
                                    onChange={(e) => handleDLImageChange(e, setDlBackImage)}
                                />
                            </label>
                        </div>
                    </div>}
                    </div>
                    {/* Header */}
                    <div className="p-8 bg-white shadow-lg rounded-2xl  mx-auto mb-8">

                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-red-500 p-2 rounded-xl text-white">
                                <FaMapMarkerAlt size={18} />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-800">Address Details</h2>
                        </div>

                        {/* Complete Address */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                                Complete Address <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                rows="3"
                                placeholder="Enter complete address with landmarks"
                                value={address}
                                required
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>

                        {/* City */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                                City <span className="text-red-500">*</span>
                            </label>
                            
                            <AutoCompletePage
                                options={cityList}
                                value={query}
                                selectedDefaultCity={city}
                                onChange={(text) => setQuery(text)}
                                onSelect={(cityName) => {
                                    setQuery(cityName);
                                    setCity(cityName);
                                }}
                                custom={true}
                                required
                                placeholder={`Search city`}
                                className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>
                    {/* Buttons */}
                    <div className="flex justify-between items-center">
                        <button
                            type="submit"
                            disabled={uploading}
                            className="px-6 py-2 w-[75%] rounded-lg text-white text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 flex flex-col items-center gap-2"
                        >
                            <span className="flex items-center gap-4"> <FaPaperPlane size={14} /> <span> Submit Application</span></span>
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={uploading}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 flex items-center gap-2"
                        >
                            Reset Form
                        </button>

                    </div>
                </div>
            </form>
        </div>
    );
};

export default Page;
