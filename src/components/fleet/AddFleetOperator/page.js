"use client";
import { useState, useEffect } from "react";
import { Check, Upload } from "lucide-react";
import {
  fetchCabModelList,
  fetchCabTypeList,
  fetchCabFuelList,
} from "@/redux/features/rbCabMainSlice";
import { useDispatch, useSelector } from "react-redux";
import { apiClient } from "@/app/lib/apiClient";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";

export default function OperatorOnboarding() {
  const pathname = usePathname();
  // const [step, setStep] = useState(1);
  const [step, setStep] = useState(() => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("onboardingStep")) || 1;
    }
    return 1;
  });
  const [mobile, setMobile] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [driverMobile, setDriverMobile] = useState("");
  const [driverWhatsapp, setDriverWhatsapp] = useState("");
  const [operatorCreated, setOperatorCreated] = useState(false);
  const [cabCreated, setCabCreated] = useState(false);
  // const [sameAsMobile, setSameAsMobile] = useState(false);
  const [sameAsMobileOperator, setSameAsMobileOperator] = useState(false);
  const [sameAsMobileDriver, setSameAsMobileDriver] = useState(false);
  const [errors, setErrors] = useState({});
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [altNumber, setAltNumber] = useState("");
  const [carErrors, setCarErrors] = useState({});
  const [vehicleDocs, setVehicleDocs] = useState({});
  const [vehicleImages, setVehicleImages] = useState({});
  const [driverName, setDriverName] = useState("");
  const [driverAadhar, setDriverAadhar] = useState("");
  const [driverDocs, setDriverDocs] = useState({});
  const [driverErrors, setDriverErrors] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [markMyself, setMarkMyself] = useState(false);
  const [mobileError, setMobileError] = useState("");
  const [driverMobileError, setDriverMobileError] = useState("");
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    whatsapp: "",
    gender: "",
    address: "",
  });

  const [operatorId, setOperatorId] = useState(null);
  const [cabId, setCabId] = useState(null);

  const validateStep1 = () => {
    const newErrors = {};
    if (!fullName) newErrors.fullName = "Full name is required";
    if (mobile.length !== 10) newErrors.mobile = "Enter valid mobile number";
    if (whatsapp.length !== 10)
      newErrors.whatsapp = "Enter valid WhatsApp number";
    if (altNumber && altNumber.length !== 10)
      newErrors.altNumber = "Enter valid 10 digit alternative number";
    if (!gender) newErrors.gender = "Gender is required";
    // if (!address) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const searchAddress = async (value) => {
    setSelectedPlace(null);
    setAddress(value);

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await apiClient(
        "POST",
        "/place/search-place",
        {
          placeName: value,
        },
        null,
        false,
      );

      if (res?.success) {
        setSuggestions(res.data || []);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const checkOperatorExists = async (mobileNo) => {
  try {
    const res = await apiClient(
      "GET",
      "/fleet/getAllFeetlOperatorList"
    );

    if (res && res.success) {
      const list = res.data || [];

      const exists = list.find(
        (item) => item.mobile_no === mobileNo
      );

      return exists;
    }
  } catch (error) {
    console.error(error);
  }
  return null;
};

  const createOperator = async () => {
    try {
      setLoading(true);
        const exists = await checkOperatorExists(mobile);

    if (exists) {
      toast.error("Driver or Operator already exists");
      return;
    }
      const payload = {
        mobile_no: mobile,
        full_name: fullName,
        whatsapp: whatsapp,
        gender: gender,
        address: address,
        add_latitude: selectedPlace?.lat,
        add_longitude: selectedPlace?.lng,
      };

      const res = await apiClient(
        "POST",
        "/fleet/admin/operator/onboard",
        payload,
      );

      if (res?.success) {
        toast.success(res?.message || "Operator created successfully");

        //  setOperatorId(res.data.operator_id);
        const id = res.data.operator_id;

        setOperatorId(id);
        localStorage.setItem("operatorId", id);
        setStep(2);
      } else {
        toast.error(res?.message || "Failed to create operator");
        return;
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const { cabTypes, cabModels, cabFuel } = useSelector(
    (state) => state.rbCabMain,
  );
  const [cabMeta, setCabMeta] = useState({
    cab_type: "",
    cab_model: "",
    fuel_type: "",
    cab_status: "",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCabTypeList());
    dispatch(fetchCabModelList());
    dispatch(fetchCabFuelList());
  }, [dispatch]);

  useEffect(() => {
    const storedOperatorId = localStorage.getItem("operatorId");
    const storedCabId = localStorage.getItem("cabId");

    if (storedOperatorId) {
      setOperatorId(storedOperatorId);
    }

    if (storedCabId) {
      setCabId(storedCabId);
    }
  }, []);

  const handleMetaChange = (key, value) => {
    setCabMeta((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validateStep2 = () => {
    const errors = {};
    if (!cabMeta.registration_number)
      errors.registration_number = "Registration number required";
    if (!cabMeta.cab_type) errors.cab_type = "Cab type required";
    if (!cabMeta.cab_model) errors.cab_model = "Cab model required";
    if (!cabMeta.fuel_type) errors.fuel_type = "Fuel type required";
    if (Object.keys(vehicleDocs).length < 6)
      errors.docs = "Upload all vehicle documents";
    if (
      !vehicleImages["Front Side Image"] ||
      !vehicleImages["Back Side Image"]
    ) {
      errors.images = "Upload vehicle images";
    }
    setCarErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = () => {
    const errors = {};
    if (!driverName) errors.driverName = "Driver name required";
    if (driverMobile.length !== 10)
      errors.driverMobile = "Enter valid mobile number";
    if (driverWhatsapp.length !== 10)
      errors.driverWhatsapp = "Enter valid WhatsApp number";
    if (driverAadhar.length !== 12)
      errors.driverAadhar = "Enter valid 12 digit Aadhar";
    if (Object.keys(driverDocs).length < 5)
      errors.docs = "Upload all driver documents";
    setDriverErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const createCab = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("operator_id", operatorId);
      formData.append("registration_no", cabMeta.registration_number);
      formData.append("cab_type", cabMeta.cab_type);
      formData.append("cab_model", cabMeta.cab_model);
      formData.append("fuel_type", cabMeta.fuel_type);
      formData.append("longitude", selectedPlace?.lng);
      formData.append("latitude", selectedPlace?.lat);
      formData.append("address", address);

      formData.append("rc_front", vehicleDocs["RC Front"]?.file);
      formData.append("rc_back", vehicleDocs["RC Back"]?.file);
      formData.append("insurance", vehicleDocs["Insurance"]?.file);
      formData.append("pollution", vehicleDocs["Pollution"]?.file);
      formData.append("permit", vehicleDocs["Permit"]?.file);
      formData.append("fitness", vehicleDocs["Fitness"]?.file);

      formData.append("cab_front", vehicleImages["Front Side Image"]?.file);
      formData.append("cab_back", vehicleImages["Back Side Image"]?.file);

      const res = await apiClient(
        "POST",
        "/fleet/admin/operator-cab/add-cab-with-docs",
        formData,
        { "Content-Type": "multipart/form-data" },
      );

      if (res?.success) {
        toast.success(res?.message || "Cab created successfully");

        // setCabId(res.data.cab_id);
        const id = res.data.cab_id;

        setCabId(id);
        localStorage.setItem("cabId", id);
        setStep(3);
      } else {
        toast.error(res?.message || "Failed to create cab");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const createDriver = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("operator_id", operatorId);
      formData.append("cab_id", cabId);
      formData.append("aadhar_no", driverAadhar);
      formData.append("full_name", driverName);
      formData.append("mobile_no", driverMobile);

      if (driverDocs["Aadhar Front"]?.file)
        formData.append("aadhar_front", driverDocs["Aadhar Front"].file);

      if (driverDocs["Aadhar Back"]?.file)
        formData.append("aadhar_back", driverDocs["Aadhar Back"].file);

      if (driverDocs["DL Front"]?.file)
        formData.append("dl_front", driverDocs["DL Front"].file);

      if (driverDocs["DL Back"]?.file)
        formData.append("dl_back", driverDocs["DL Back"].file);

      if (driverDocs["Driver Photo"]?.file)
        formData.append("driver_selfie", driverDocs["Driver Photo"].file);

      const res = await apiClient(
        "POST",
        "/fleet/admin/driver/add-new",
        formData,
        { "Content-Type": "multipart/form-data" },
      );

      if (res?.success) {
        toast.success(res?.message || "Driver created successfully");

        resetForm();

        router.push("/fleetManagement/FleetOperator");
      } else {
        toast.error(res?.message || "Failed to create driver");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const fetchOperatorData = async () => {
    try {
      const res = await apiClient(
        "GET",
        `/operator-request/operators?operator_id=${operatorId}`,
      );

      if (res?.success) {
        const operator = res.data?.[0];

        if (!operator) return;

        setDriverName(operator.full_name || "");
        setDriverMobile(operator.mobile_no || "");
        setDriverWhatsapp(operator.whatsapp || operator.mobile_no || "");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const markMyselfAsDriver = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("operator_id", operatorId);
      formData.append("cab_id", cabId);
      formData.append("aadhar_no", driverAadhar);
      formData.append("full_name", driverName);
      formData.append("mobile_no", driverMobile);

      if (driverDocs["Aadhar Front"]?.file)
        formData.append("aadhar_front", driverDocs["Aadhar Front"].file);

      if (driverDocs["Aadhar Back"]?.file)
        formData.append("aadhar_back", driverDocs["Aadhar Back"].file);

      if (driverDocs["DL Front"]?.file)
        formData.append("dl_front", driverDocs["DL Front"].file);

      if (driverDocs["DL Back"]?.file)
        formData.append("dl_back", driverDocs["DL Back"].file);

      if (driverDocs["Driver Photo"]?.file)
        formData.append("driver_selfie", driverDocs["Driver Photo"].file);

      const res = await apiClient(
        "POST",
        "/fleet/admin/driver/mark-myself-as-driver",
        formData,
        { "Content-Type": "multipart/form-data" },
      );

      if (res?.success) {
        toast.success(res.message || "Driver marked successfully");

        resetForm();

        router.push("/fleetManagement/FleetOperator");
      } else {
        toast.error(res?.message || "Failed to mark driver");
        return;
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
      return;
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    localStorage.removeItem("onboardingStep");
    localStorage.removeItem("operatorId");
    localStorage.removeItem("cabId");

    setFullName("");
    setMobile("");
    setWhatsapp("");
    setAltNumber("");
    setGender("");
    setAddress("");
    setSameAsMobileOperator(false);

    setCabMeta({
      cab_type: "",
      cab_model: "",
      fuel_type: "",
      cab_status: "",
      registration_number: "",
    });

    setVehicleDocs({});
    setVehicleImages({});

    setDriverName("");
    setDriverMobile("");
    setDriverWhatsapp("");
    setDriverAadhar("");
    setDriverDocs({});
    setSameAsMobileDriver(false);
    setMarkMyself(false);

    setStep(1);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setShowSuggestions(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    localStorage.setItem("onboardingStep", step);
  }, [step]);



  const isStep2Valid =
  cabMeta.registration_number &&
  cabMeta.cab_type &&
  cabMeta.cab_model &&
  cabMeta.fuel_type &&
  Object.keys(vehicleDocs).length === 6 &&
  vehicleImages["Front Side Image"] &&
  vehicleImages["Back Side Image"];


  const isStep3Valid =
  driverName &&
  driverMobile.length === 10 &&
  driverWhatsapp.length === 10 &&
  driverAadhar.length === 12 &&
  Object.keys(driverDocs).length === 5;


  useEffect(() => {
  return () => {
    // jab page leave hoga tab chalega
    resetForm();
  };
}, [pathname]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center bg-white py-5 px-6 mb-6">
        <div>
          <h1 className="text-xl font-semibold">Operator Onboarding</h1>
          <p className="text-sm text-gray-500">
            Add and verify new fleet operator
          </p>
        </div>

        {/* <div className="flex gap-3">
          <button
            onClick={close}
            className="border px-4 py-2 rounded-lg text-sm bg-white"
          >
            View List
          </button>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
            + Add Operator
          </button>
        </div> */}
      </div>
      <div className="flex justify-center items-center gap-5">
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white
      ${step > 1 ? "bg-green-600" : "bg-blue-600"}`}
          >
            {step > 1 ? <Check size={18} /> : "1"}
          </div>
          <p className="text-xs mt-2">Operator Info</p>
        </div>
        <div
          className={`w-60 h-[2px] ${
            step > 1 ? "bg-green-600" : "bg-gray-300"
          }`}
        ></div>
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white
      ${step === 2 ? "bg-blue-600" : step > 2 ? "bg-green-600" : "bg-gray-300"}`}
          >
            {step > 2 ? <Check size={18} /> : "2"}
          </div>
          <p className="text-xs mt-2">Car Details</p>
        </div>
        <div
          className={`w-60 h-[2px] ${
            step > 2 ? "bg-green-600" : "bg-gray-300"
          }`}
        ></div>
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white
      ${step === 3 ? "bg-blue-600" : "bg-gray-300"}`}
          >
            3
          </div>
          <p className="text-xs mt-2">Driver Details</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        {step === 1 && (
          <div className="bg-white border rounded-xl p-8">
            <h2 className="font-semibold mb-6">Operator Information</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm">Full Name</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border bg-gray-50 rounded-lg p-2 mt-1"
                  placeholder="Enter full name"
                />

                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>
              <div>
                <label className="text-sm">Mobile Number</label>
                {/* <input
                  value={mobile}
                  maxLength={10}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setMobile(value);

                    if (sameAsMobileOperator) {
                      setWhatsapp(value);
                    }
                  }}
                  className="w-full border bg-gray-50 rounded-lg p-2 mt-1"
                  placeholder="Enter mobile number"
                /> */}
                <input
  value={mobile}
  maxLength={10}
  // onChange={async (e) => {
  //   const value = e.target.value.replace(/\D/g, "");
  //   setMobile(value);

  //   if (sameAsMobileOperator) {
  //     setWhatsapp(value);
  //   }

  //   // ✅ check only when 10 digit
  //   if (value.length === 10) {
  //     const exists = await checkOperatorExists(value);

  //     if (exists) {
  //       toast.error("Driver or Operator already exists");
  //     }
  //   }
  // }}
  onChange={async (e) => {
  const value = e.target.value.replace(/\D/g, "");
  setMobile(value);

  if (sameAsMobileOperator) {
    setWhatsapp(value);
  }

  if (value.length === 10) {
    const exists = await checkOperatorExists(value);

    if (exists) {
      setMobileError("Driver or Operator already exists");
    } else {
      setMobileError("");
    }
  } else {
    setMobileError("");
  }
}}
  className="w-full border bg-gray-50 rounded-lg p-2 mt-1"
  placeholder="Enter mobile number"
/>

                {/* {errors.mobile && (
                  <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
                )} */}
                {mobileError && (
  <p className="text-red-500 text-xs mt-1">{mobileError}</p>
)}
              </div>
              <div>
                <label className="text-sm">WhatsApp Number</label>
                <input
                  value={whatsapp}
                  maxLength={10}
                  onChange={(e) =>
                    setWhatsapp(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full border bg-gray-50 rounded-lg p-2 mt-1"
                  placeholder="Enter WhatsApp number"
                />

                {errors.whatsapp && (
                  <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsMobileOperator}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSameAsMobileOperator(checked);

                        if (checked) {
                          setWhatsapp(mobile);
                        } else {
                          setWhatsapp("");
                        }
                      }}
                      className="hidden"
                    />

                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center
      ${sameAsMobileOperator ? "border-blue-600" : "border-gray-400"}`}
                    >
                      {sameAsMobileOperator && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>

                    <span className="text-sm text-gray-600">
                      Same as Mobile
                    </span>
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm">Alternative Number</label>

                <input
                  value={altNumber}
                  maxLength={10}
                  onChange={(e) =>
                    setAltNumber(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full border bg-gray-50 rounded-lg p-2 mt-1"
                  placeholder="Enter alternative number"
                />

                {errors.altNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.altNumber}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full border bg-gray-50 rounded-lg p-2 mt-1"
                >
                  <option>Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                )}
              </div>
            </div>
            {/* <div className="mt-6">
              <label className="text-sm">Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border bg-gray-50 rounded-lg p-2 mt-1 h-24"
                placeholder="Enter full address"
              />

              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div> */}
            <div className="relative mt-6">
              <label className="text-sm">Address</label>

              <input
                value={address}
                onChange={(e) => searchAddress(e.target.value)}
                className="w-full border bg-gray-50 rounded-lg p-2 mt-1 h-14"
                placeholder="Enter full address"
              />

              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute bg-white border w-full mt-1 rounded-lg shadow z-10 max-h-60 overflow-y-auto">
                  {suggestions.map((item, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={(e) => {
                        e.stopPropagation();

                        // set address
                        setAddress(`${item.name}, ${item.address}`);
                        setSelectedPlace(item);

                        // close dropdown
                        setShowSuggestions(false);

                        // clear suggestions
                        setSuggestions([]);
                      }}
                    >
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.address}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-between gap-3 mt-6">
              <button
                onClick={resetForm}
                className="border px-5 py-2 rounded-lg"
              >
                Cancel
              </button>

              {/* <button
                onClick={() => {
                  if (validateStep1()) {
                    setStep(2);
                    createOperator();
                  }
                }}
                disabled={
                  !fullName ||
                  mobile.length !== 10 ||
                  whatsapp.length !== 10 ||
                  !gender ||
                  !address
                }
                className={`px-5 py-2 rounded-lg text-white 
  ${
    !fullName ||
    mobile.length !== 10 ||
    whatsapp.length !== 10 ||
    !gender ||
    !address
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-blue-600"
  }`}
              >
                Next →
              </button> */}

              <button
                onClick={() => {
                  if (!validateStep1()) return;
                  {
                    createOperator();
                  }
                  // if (validateStep1()) {
                  //   if (operatorId) {
                  //     setStep(2); // already created
                  //   } else {
                  //     createOperator();
                  //   }
                  // }
                }}
                disabled={
                  loading ||
                  !fullName ||
                  !! mobileError ||
                  mobile.length !== 10 ||
                  whatsapp.length !== 10 ||
                  !gender ||
                  !address
                }
                className={`px-5 py-2 rounded-lg text-white flex items-center justify-center gap-2
  ${
    loading ||
    !fullName ||
     !! mobileError ||
    mobile.length !== 10 ||
    whatsapp.length !== 10 ||
    !gender ||
    !address
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-blue-600"
  }`}
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Creating...
                  </>
                ) : (
                  "Next →"
                )}
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-white border rounded-xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm">Registration Number</label>
                  <input
                    value={cabMeta.registration_number || ""}
                    maxLength={10}
                    onChange={(e) => {
                      let value = e.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, "");
                      handleMetaChange("registration_number", value);
                    }}
                    className="w-full border bg-gray-50 rounded-lg px-3 py-2 mt-1"
                    placeholder="Enter registration number"
                  />
                  {carErrors.registration_number && (
                    <p className="text-red-500 text-xs mt-1">
                      {carErrors.registration_number}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm">Cab Type</label>
                  <div className="border bg-gray-50 rounded-lg px-3 py-2 mt-1">
                    <select
                      value={cabMeta.cab_type}
                      onChange={(e) =>
                        handleMetaChange("cab_type", e.target.value)
                      }
                      className="outline-none bg-transparent w-full"
                    >
                      <option value="">Select cab type</option>

                      {(cabTypes || []).map((cab) => (
                        <option key={cab.id} value={cab.id}>
                          {cab.cab_type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm">Cab Model</label>
                  <div className="border bg-gray-50 rounded-lg px-3 py-2 mt-1">
                    <select
                      value={cabMeta.cab_model}
                      onChange={(e) =>
                        handleMetaChange("cab_model", e.target.value)
                      }
                      className="outline-none bg-transparent w-full"
                    >
                      <option value="">Select cab model</option>

                      {(cabModels || []).map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.make_name} - {model.make_model}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm">Fuel Type</label>
                  <div className="border bg-gray-50 rounded-lg px-3 py-2 mt-1">
                    <select
                      value={cabMeta.fuel_type}
                      onChange={(e) =>
                        handleMetaChange("fuel_type", e.target.value)
                      }
                      className="outline-none bg-transparent w-full"
                    >
                      <option value="">Select fuel type</option>

                      {(cabFuel || []).map((fuel) => (
                        <option key={fuel.id} value={fuel.id}>
                          {fuel.fuel_type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-xl p-8">
              <h2 className="font-semibold mb-6">Vehicle Documents</h2>
              <div className="grid grid-cols-3 gap-6">
                {
                  // [
                  //   "RC_Front",
                  //   "RC_Back",
                  //   "Insurance",
                  //   "Pollution",
                  //   "Permit",
                  //   "Fitness",
                  // ]
                  [
                    "RC Front",
                    "RC Back",
                    "Insurance",
                    "Pollution",
                    "Permit",
                    "Fitness",
                  ].map((doc) => {
                    const uploadedDoc = vehicleDocs[doc];

                    return (
                      <label
                        key={doc}
                        className="border-2 border-dashed rounded-xl h-28 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-400"
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;

                            const reader = new FileReader();

                            reader.onloadend = () => {
                              const preview = reader.result;
                              setVehicleDocs((prev) => ({
                                ...prev,
                                [doc]: {
                                  file,
                                  preview,
                                },
                              }));
                            };

                            reader.readAsDataURL(file);

                            e.target.value = "";
                          }}
                        />
                        {uploadedDoc ? (
                          <div className="flex flex-col items-center text-center">
                            <img
                              src={uploadedDoc?.preview}
                              alt="uploaded"
                              className="h-16 w-auto object-contain rounded-md mb-1"
                            />

                            <p className="text-xs text-gray-500 truncate max-w-[140px]">
                              {uploadedDoc.file.name}
                            </p>

                            <button
                              onClick={(e) => {
                                e.preventDefault();

                                setVehicleDocs((prev) => {
                                  const updated = { ...prev };
                                  delete updated[doc];
                                  return updated;
                                });
                              }}
                              className="text-red-500 text-xs mt-1 hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <>
                            <Upload size={22} className="mb-1 text-gray-400" />

                            <p className="text-sm font-medium text-gray-500">
                              {doc}
                            </p>

                            <span className="text-xs text-gray-400">
                              Drag & drop or click
                            </span>
                          </>
                        )}
                      </label>
                    );
                  })
                }
              </div>
              {carErrors.docs && (
                <p className="text-red-500 text-xs mt-3">{carErrors.docs}</p>
              )}
            </div>
            <div className="bg-white border rounded-xl p-8">
              <h2 className="font-semibold mb-6">Vehicle Images</h2>

              <div className="grid grid-cols-2 gap-6">
                {["Front Side Image", "Back Side Image"].map((imageType) => {
                  const uploadedImage = vehicleImages[imageType];

                  return (
                    <label
                      key={imageType}
                      className="border-2 border-dashed rounded-xl h-28 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-400"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;

                          const reader = new FileReader();

                          reader.onloadend = () => {
                            setVehicleImages((prev) => ({
                              ...prev,
                              [imageType]: {
                                file: file,
                                preview: reader.result,
                              },
                            }));
                          };

                          reader.readAsDataURL(file);
                          e.target.value = "";
                        }}
                      />

                      {uploadedImage ? (
                        <div className="flex flex-col items-center text-center">
                          <img
                            src={uploadedImage.preview}
                            alt="uploaded"
                            className="h-16 w-auto object-contain rounded-md mb-1"
                          />

                          <p className="text-xs text-gray-500 truncate max-w-[140px]">
                            {uploadedImage.file.name}
                          </p>

                          <button
                            onClick={(e) => {
                              e.preventDefault();

                              URL.revokeObjectURL(uploadedImage.preview);

                              setVehicleImages((prev) => {
                                const updated = { ...prev };
                                delete updated[imageType];
                                return updated;
                              });
                            }}
                            className="text-red-500 text-xs mt-1 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload size={22} className="mb-1 text-gray-400" />

                          <p className="text-sm font-medium text-gray-500">
                            {imageType}
                          </p>

                          <span className="text-xs text-gray-400">
                            Drag & drop or click
                          </span>
                        </>
                      )}
                    </label>
                  );
                })}
              </div>

              {carErrors.images && (
                <p className="text-red-500 text-xs mt-3">{carErrors.images}</p>
              )}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="border px-6 py-2 rounded-lg flex items-center gap-2"
              >
                ← Back
              </button>

              {/* <button
                onClick={() => {
                  if (validateStep2()) {
                    createCab();
                  }
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
              >
                Next →
              </button> */}

              {/* <button
                onClick={() => {
                  if (!validateStep2()) return;
                  {
                    createCab();
                  }
                  // if (validateStep2()) {
                  //   if (cabId) {
                  //     setStep(3);
                  //   } else {
                  //     createCab();
                  //   }
                  // }
                }}
                // disabled={loading || !isStep2Valid}
                 disabled={loading || !isStep2Valid} 
                className={`px-6 py-2 rounded-lg flex items-center gap-2 text-white
  ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600"}`}
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Processing...
                  </>
                ) : (
                  "Next →"
                )}
              </button> */}
              <button
  onClick={() => {
    if (!validateStep2()) return;
    createCab();
  }}
  disabled={loading || !isStep2Valid}
  className={`px-6 py-2 rounded-lg flex items-center gap-2 text-white
  ${
    loading || !isStep2Valid
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-blue-600"
  }`}
>
  {loading ? (
    <>
      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
      Processing...
    </>
  ) : (
    "Next →"
  )}
</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-white border rounded-xl p-8">
              <div className="flex justify-between">
                <h2 className="font-semibold mb-6">Driver Information</h2>
                <div className="flex items-center gap-2 mb-4">
                  {/* <input
                    type="checkbox"
                    checked={markMyself}
                    onChange={async (e) => {
                      const checked = e.target.checked;
                      setMarkMyself(checked);

                      if (checked) {
                      }
                    }}
                  /> */}
                  <input
                    type="checkbox"
                    checked={markMyself}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setMarkMyself(checked);

                      // if (checked) {
                      //   markMyselfAsDriver();
                      // }

                      if (checked) {
                        fetchOperatorData();
                      } else {
                        setDriverName("");
                        setDriverMobile("");
                        setDriverWhatsapp("");
                        setDriverAadhar("");
                        // setDriverDocs({});
                      }
                    }}
                  />

                  <span className="text-sm text-gray-700">
                    Mark myself as driver
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm">Driver Name</label>
                  <input
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full border bg-gray-50 rounded-lg px-3 py-2 mt-1"
                    placeholder="Enter driver name"
                  />

                  {driverErrors.driverName && (
                    <p className="text-red-500 text-xs mt-1">
                      {driverErrors.driverName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm">Mobile Number</label>
                  {/* <input
                    value={driverMobile}
                    maxLength={10}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setDriverMobile(value);

                      if (sameAsMobileDriver) {
                        setDriverWhatsapp(value);
                      }
                    }}
                    className="w-full border bg-gray-50 rounded-lg px-3 py-2 mt-1"
                    placeholder="Enter mobile number"
                  /> */}
                  <input
  value={driverMobile}
  maxLength={10}
  onChange={async (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setDriverMobile(value);

    if (sameAsMobileDriver) {
      setDriverWhatsapp(value);
    }

    // ✅ API check
    if (value.length === 10) {
      const exists = await checkOperatorExists(value);

      if (exists) {
        setDriverMobileError("Driver or Operator already exists");
      } else {
        setDriverMobileError("");
      }
    } else {
      setDriverMobileError("");
    }
  }}
  className="w-full border bg-gray-50 rounded-lg px-3 py-2 mt-1"
  placeholder="Enter mobile number"
/>

                  {/* {driverErrors.driverMobile && (
                    <p className="text-red-500 text-xs mt-1">
                      {driverErrors.driverMobile}
                    </p>
                  )} */}
                  {driverMobileError && (
  <p className="text-red-500 text-xs mt-1">{driverMobileError}</p>
)}
                </div>

                <div>
                  <label className="text-sm">WhatsApp Number</label>
                  <input
                    value={driverWhatsapp}
                    maxLength={10}
                    onChange={(e) =>
                      setDriverWhatsapp(e.target.value.replace(/\D/g, ""))
                    }
                    className="w-full border bg-gray-50 rounded-lg px-3 py-2 mt-1"
                    placeholder="Enter WhatsApp number"
                  />

                  {driverErrors.driverWhatsapp && (
                    <p className="text-red-500 text-xs mt-1">
                      {driverErrors.driverWhatsapp}
                    </p>
                  )}
                  <div
                    className="flex items-center gap-2 mt-2 cursor-pointer"
                    onClick={() => {
                      const newValue = !sameAsMobileDriver;
                      setSameAsMobileDriver(newValue);

                      if (newValue) {
                        setDriverWhatsapp(driverMobile);
                      } else {
                        setDriverWhatsapp("");
                      }
                    }}
                  >
                    {/* <div className="w-4 h-4 border rounded-full flex items-center justify-center"> */}
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center
      ${sameAsMobileDriver ? "border-blue-600" : "border-gray-400"}`}
                    >
                      {sameAsMobileDriver && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>

                    <span className="text-sm text-gray-600">
                      Same as Mobile
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm">Aadhar Number</label>
                  <input
                    value={driverAadhar}
                    maxLength={12}
                    onChange={(e) =>
                      setDriverAadhar(e.target.value.replace(/\D/g, ""))
                    }
                    className="w-full border bg-gray-50 rounded-lg px-3 py-2 mt-1"
                    placeholder="Enter Aadhar number"
                  />

                  {driverErrors.driverAadhar && (
                    <p className="text-red-500 text-xs mt-1">
                      {driverErrors.driverAadhar}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-white border rounded-xl p-8">
              <h2 className="font-semibold mb-6">Driver Documents</h2>

              <div className="grid grid-cols-3 gap-6">
                {[
                  "Driver Photo",
                  "Aadhar Front",
                  "Aadhar Back",
                  "DL Front",
                  "DL Back",
                ].map((doc) => {
                  const uploadedDoc = driverDocs[doc];

                  return (
                    <label
                      key={doc}
                      className="border-2 border-dashed rounded-xl h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const reader = new FileReader();

                          reader.onloadend = () => {
                            setDriverDocs((prev) => ({
                              ...prev,
                              [doc]: {
                                file,
                                preview: reader.result,
                              },
                            }));
                          };

                          reader.readAsDataURL(file);
                          e.target.value = "";
                        }}
                      />

                      {uploadedDoc ? (
                        <div className="flex flex-col items-center text-center">
                          <img
                            src={uploadedDoc.preview}
                            alt="uploaded"
                            className="h-16 w-16 object-cover rounded-md mb-1"
                          />

                          <p className="text-xs text-gray-600 truncate max-w-[140px]">
                            {uploadedDoc.file.name}
                          </p>

                          <button
                            onClick={(e) => {
                              e.preventDefault();

                              URL.revokeObjectURL(uploadedDoc.preview);

                              setDriverDocs((prev) => {
                                const updated = { ...prev };
                                delete updated[doc];
                                return updated;
                              });
                            }}
                            className="text-red-500 text-xs mt-1 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-center">
                          <div className="p-2 bg-gray-100 rounded-full mb-2">
                            <Upload size={20} className="text-gray-600" />
                          </div>

                          <p className="text-sm font-medium text-gray-600">
                            {doc}
                          </p>

                          <span className="text-xs text-gray-400">
                            Drag & drop or click
                          </span>
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>

              {driverErrors.docs && (
                <p className="text-red-500 text-xs mt-3">{driverErrors.docs}</p>
              )}
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="border px-6 py-2 rounded-lg flex items-center gap-2"
              >
                ← Back
              </button>
              {/* <button
                onClick={() => {
                  if (!validateStep3()) return;

                  const operatorData = {
                    name: fullName,
                    mobile,
                    whatsapp,
                    gender,
                    address,
                    vehicle: cabMeta.registration_number,
                  };

                  createDriver();
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                Submit
              </button> */}
              <button        
               onClick={() => {
  if (!validateStep3()) return; 

  if (markMyself) {
    markMyselfAsDriver();
  } else {
    createDriver();
  }
}}
  //               disabled={loading || !isStep3Valid}
  //               className={`px-6 py-2 rounded-lg text-white flex items-center gap-2
  // ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600"}`}
    disabled={loading ||
       !!driverMobileError || 
        !isStep3Valid}
  className={`px-6 py-2 rounded-lg text-white flex items-center gap-2
  ${
    loading ||
     !!driverMobileError || 
      !isStep3Valid
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-blue-600"
  }`}
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Processing...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
