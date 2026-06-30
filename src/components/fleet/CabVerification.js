"use client";
import React, { useState, useEffect } from "react";
import { IoHomeOutline } from "react-icons/io5";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { FaEye, FaPhoneAlt } from "react-icons/fa";
import { SiGooglemaps } from "react-icons/si";
import { ExternalLink, Trash2 } from "lucide-react";
import { BsCheck2Circle, BsClockHistory } from "react-icons/bs";
import Link from "next/link";
import BlockDriverModal from "../modals/BlockDriverModal";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { apiClient } from "@/app/lib/apiClient";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import CommonModal from "@/components/common/CommonModal";
import {
  fetchCabModelList,
  fetchCabTypeList,
  fetchCabFuelList,
} from "@/redux/features/rbCabMainSlice";

import { useDispatch, useSelector } from "react-redux";



const IMAGE_BASE_URL = "https://api.rodbez.com";

// const getImageUrl = (path, fallback) => {
//   if (!path || path.includes("undefined")) return fallback;
//   return `${IMAGE_BASE_URL}${path}`;
// };



const getImageUrl = (path, fallback = "/images/aadhaar.png") => {
  if (!path || path === "" || path.includes("undefined")) {
    return fallback;
  }

  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

const cabList = [
  { number: "BR 12 AB 1234", status: "Active" },
  { number: "BR 12 AB 1234", status: "Active" },
  { number: "BR 12 AB 1234", status: "Active" },
  { number: "BR 12 AB 1234", status: "Inactive" },
  { number: "BR 12 AB 1234", status: "Active" },
  { number: "BR 12 AB 1234", status: "Active" },
  { number: "BR 12 AB 1234", status: "Active" },
  { number: "BR 12 AB 1234", status: "Active" },
];

const getStatusStyles = (status) => {
  switch (status) {
    case "approved":
      return {
        border: "border-green-400",
        bg: "bg-green-50",
        icon: <BsCheck2Circle className="text-green-600 text-lg" />,
      };

    case "rejected":
      return {
        border: "border-red-400",
        bg: "bg-red-50",
        icon: <FaTimes className="text-red-600 text-lg" />,
      };

    case "pending":
      return {
        border: "border-yellow-400",
        bg: "bg-yellow-50",
        icon: <BsClockHistory className="text-yellow-500 text-lg" />,
      };

    default:
      return {
        border: "border-gray-300",
        bg: "bg-white",
        icon: null,
      };
  }
};

const DOC_FIELD_MAP = {
  RC_Front: "rc_front_approved",
  RC_Back: "rc_back_approved",
  Pollutions: "pollution_approved",
  Fitness: "fitness_approved",
  Permit: "permit_approved",
};

const DOC_IMAGE_MAP = {
  RC_Front: "rc_front",
  RC_Back: "rc_back",
  Pollutions: "pollution",
  Fitness: "fitness",
  Permit: "permit",
};

// const IMAGE_BASE_URL = "https://api.rodbez.com";

const CabVerification = ({ id }) => {
  const [blockModal, setBlockModal] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  

  // const [cabDocs, setCabDocs] = useState(null);
  const [cabDocs, setCabDocs] = useState(null);
  const [cabDetails, setCabDetails] = useState(null);
  const [cabOwner, setCabOwner] = useState(null);
  const [cabDriver, setCabDriver] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [imgOpen, setImgOpen] = useState(false);

const [cabModes, setCabModes] = useState(null);
const [selectedCabType, setSelectedCabType] = useState("");
const [tempCabType, setTempCabType] = useState("");
const [showConfirm, setShowConfirm] = useState(false);

const [confirmOpen, setConfirmOpen] = useState(false);
const [pendingChange, setPendingChange] = useState(null);
const [bookedStatus, setBookedStatus] = useState("unbooked");
const [driverUpdateOpen, setDriverUpdateOpen] = useState(false);
const [addDriverOpen, setAddDriverOpen] = useState(false);
const [driverName, setDriverName] = useState("");
const [driverMobile, setDriverMobile] = useState("");
const [driverAadhar, setDriverAadhar] = useState("");
const [driverDocs, setDriverDocs] = useState({});
const [loading, setLoading] = useState(false);
const longitude = cabDetails?.cab_gps_data?.location?.coordinates?.[0];
const latitude = cabDetails?.cab_gps_data?.location?.coordinates?.[1];
const [driverUpdateData, setDriverUpdateData] = useState({
  driver_name: "",
  driver_mobile: "",
  cab_type: "",
});
const [cabMeta, setCabMeta] = useState({
  cab_type: "",
  cab_model: "",
  fuel_type: "",
  cab_status: "",
});
const isDocsValid = Object.keys(driverDocs).length === 5;


  const document = [
    {
      title: "RC_Front",
      status:
        cabDocs?.rc_front_approved === true
          ? "approved"
          : cabDocs?.rc_front_approved === false
          ? "rejected"
          : "pending",
    },
    {
      title: "RC_Back",
      status:
        cabDocs?.rc_back_approved === true
          ? "approved"
          : cabDocs?.rc_back_approved === false
          ? "rejected"
          : "pending",
    },
    {
      title: "Pollutions",
      status:
        cabDocs?.pollution_approved === true
          ? "approved"
          : cabDocs?.pollution_approved === false
          ? "rejected"
          : "pending",
    },
    {
      title: "Fitness",
      status:
        cabDocs?.fitness_approved === true
          ? "approved"
          : cabDocs?.fitness_approved === false
          ? "rejected"
          : "pending",
    },
    {
      title: "Permit",
      status:
        cabDocs?.permit_approved === true
          ? "approved"
          : cabDocs?.permit_approved === false
          ? "rejected"
          : "pending",
    },
  ];

  

  const MODE_LABELS = {
  localOn: "Local On",
  intraCityOn: "Intra City On",
  interCityOn: "Inter City On",
  goToHome: "Go To Home",
  rental: "Rental",
  booked_status: "Booking Status",
};


  

  const fetchCabDocuments = async () => {
    try {
      if (!id) return;

      const res = await apiClient("GET", `/fleet/CabDocumentsByoperator/${id}`);

      if (res?.success && res?.data) {
        setCabDocs(res.data.cabDocs);
        setCabDetails(res.data.cabDetails);
        setCabOwner(res.data.cabOwnerDetails);
        setCabDriver(res.data.cabDriverDetails);
        

              setCabModes({
        localOn: res.data.cabDetails?.localOn ?? false,
        intraCityOn: res.data.cabDetails?.intraCityOn ?? false,
        interCityOn: res.data.cabDetails?.interCityOn ?? false,
        goToHome: res.data.cabDetails?.goToHome ?? false,
        rental: res.data.cabDetails?.rental ?? false,
      });
      setBookedStatus(res.data.cabDetails?.booked_status || "unbooked");

      setCabMeta({
  cab_type: res.data.cabDetails?.cab_type || "",
  cab_model: res.data.cabDetails?.cab_model || "",
  fuel_type: res.data.cabDetails?.fuel_type || "",
  cab_status: res.data.cabDetails?.cab_status || "",
});

      } else {
        toast.error("No data found");
      }
    } catch (error) {
      toast.error("Failed to load cab details");
    }
  };

  useEffect(() => {
    if (id) {
      fetchCabDocuments();
    }
  }, [id]);

  const openImage = (imgUrl) => {
    if (!imgUrl) {
      toast.error("Image not found");
      return;
    }

    const fullUrl = imgUrl.startsWith("http")
      ? imgUrl
      : `https://api.rodbez.com${imgUrl}`;

    setPreviewImg(fullUrl);
    setImgOpen(true);
  };

//   const handleVerifyDoc = async (docTitle, value) => {
//   try {
//     const fieldName = DOC_FIELD_MAP[docTitle];

//     if (!fieldName) {
//       toast.error("Invalid document");
//       return;
//     }

//     const payload = {
//       cab_docs: {
//         [fieldName]: value,
//       },
//       driver_id: cabDriver?.driver_id,
//       operator_id: cabOwner?.operator_id,
//     };

//     const res = await apiClient(
//       "PUT",
//       `/fleet/CabDetailVerification/${id}`,
//       payload
//     );

//     if (res?.success) {
//       toast.success("Document updated successfully");

//       setCabDocs((prev) => ({
//         ...prev,
//         [fieldName]: value,
//       }));
//     } else {
//       toast.error("Update failed");
//     }
//   } catch (error) {
//     toast.error("Something went wrong");
//   }
// };


// const handleOwnerDocVerify = async (key, value) => {
//   try {
//     const payload = {
//       cab_owner_docs: {
//         [key]: value,
//       },
//       driver_id: cabDriver?.driver_id,
//       operator_id: cabOwner?.operator_id,
//     };

//     const res = await apiClient(
//       "PUT",
//       `/fleet/CabDetailVerification/${id}`,
//       payload
//     );

//     if (res?.success) {
//       toast.success("Owner document updated");
//     } else {
//       toast.error("Update failed");
//     }
//   } catch (error) {
//     toast.error("Something went wrong");
//   }
// };

   const updateCabVerification = async (payload, successMsg) => {
  try {
    const res = await apiClient(
      "PUT",
      `/fleet/CabDetailVerification/${id}`,
      payload
    );

    if (res?.success) {
      toast.success(successMsg);
      return true;
    } else {
      toast.error(res?.message || "Update failed");
      return false;
    }
  } catch (error) {
    toast.error("Something went wrong");
    return false;
  }
};

const handleVerifyDoc = async (docTitle, value) => {
  const fieldName = DOC_FIELD_MAP[docTitle];

  if (!fieldName) {
    toast.error("Invalid document");
    return;
  }

  const payload = {
    cab_docs: {
      [fieldName]: value,
    },
    driver_id: cabDriver?.driver_id,
    operator_id: cabOwner?.operator_id,
  };

  const success = await updateCabVerification(
    payload,
    "Document updated successfully"
  );

  if (success) {
    setCabDocs((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  }
};

const handleOwnerDocVerify = async (key, value) => {
  const payload = {
    cab_owner_docs: {
      [key]: value,
    },
    driver_id: cabDriver?.driver_id,
    operator_id: cabOwner?.operator_id,
  };

  const success = await updateCabVerification(
    payload,
    "Owner document updated"
  );

  if (success) {
    setCabOwner((prev) => ({
      ...prev,
      [key]: value,
    }));
  }
};

  // const DRIVER_DOCS = [
  //   {
  //     title: "Aadhar Front",
  //     imageKey: "aadhar_front",
  //   },
  //   {
  //     title: "Aadhar Back",
  //     imageKey: "aadhar_back",
  //   },
  //   {
  //     title: "DL Front",
  //     imageKey: "dl_front",
  //   },
  //   {
  //     title: "DL Back",
  //     imageKey: "dl_back",
  //   },
  // ];

  const DRIVER_DOCS = [
  {
    title: "Aadhar Front",
    imageKey: "aadhar_front",
    approveKey: "aadhar_front_verified",
  },
  {
    title: "Aadhar Back",
    imageKey: "aadhar_back",
    approveKey: "aadhar_back_verified",
  },
  {
    title: "DL Front",
    imageKey: "dl_front",
    approveKey: "dl_front_verified",
  },
  {
    title: "DL Back",
    imageKey: "dl_back",
    approveKey: "dl_back_verified",
  },
];

  const OWNER_DOCS = [
    {
      title: "Aadhar Front",
      imageKey: "aadhar_front",
      approveKey: "aadhar_front_verified",
    },
    {
      title: "Aadhar Back",
      imageKey: "aadhar_back",
      approveKey: "aadhar_back_verified",
    },
  ];


  const handleDriverDocVerify = async (key, value) => {
  const payload = {
    driver_docs: {
      [key]: value,
    },
    driver_id: cabDriver?.driver_id,
    operator_id: cabOwner?.operator_id,
  };

  const success = await updateCabVerification(
    payload,
    "Driver document updated"
  );

  if (success) {
    setCabDriver((prev) => ({
      ...prev,
      [key]: value,
    }));
  }
};

  const handleCheckClick = (key, value) => {
  setPendingChange({ key, value });
  setConfirmOpen(true);
};

const confirmUpdate = async () => {
  if (!pendingChange) return;

  let payload = {};

    if (cabModes && pendingChange.key in cabModes) {
    payload = {
      ...cabModes,
      [pendingChange.key]: pendingChange.value,
    };
    setCabModes(payload);
  }

  else if (pendingChange.key === "booked_status") {
    payload = { booked_status: pendingChange.value };
    setBookedStatus(pendingChange.value);
  }
  else {
  const updatedMeta = {
    ...cabMeta,
    [pendingChange.key]: pendingChange.value,
  };


  payload = updatedMeta;
  setCabMeta(updatedMeta);
}

  setConfirmOpen(false);

  try {
    const res = await apiClient(
      "PUT",
      `/fleet/update-operator-cab/${id}`,
      payload
    );

    if (res?.success) {
      toast.success("Updated successfully");
    } else {
      toast.error(res?.message || "Update failed");
    }
  } catch (error) {
    toast.error("Something went wrong");
  }
};

const handleMetaChange = (key, value) => {
  setPendingChange({ key, value });
  setConfirmOpen(true);
};

const cancelUpdate = () => {
  setPendingChange(null);
  setConfirmOpen(false);
};

useEffect(() => {
  dispatch(fetchCabTypeList());
  dispatch(fetchCabModelList());
  dispatch(fetchCabFuelList()); 

}, [dispatch]);

const { cabTypes, cabModels, cabFuel } = useSelector((state) => state.rbCabMain);
const rbState = useSelector((state) => state.rbCabMain);



const mapUrl =
  latitude && longitude
    ? `https://www.google.com/maps?q=${latitude},${longitude}`
    : null;


//     const updateDriver = async () => {
//   try {
//     const payload = {
//       full_name: driverUpdateData.driver_name,
//       mobile_no: driverUpdateData.driver_mobile,
//     };

//     const res = await apiClient(
//       "PUT",
//       `/fleet/update-operator/${cabDriver?.driver?.id}`,
//       payload
//     );
//     console.log(payload, "driverUpdate")

//     if (res?.success) {
//       toast.success("Driver updated successfully");
//       setDriverUpdateOpen(false);

//       fetchCabDocuments(); 
//     } else {
//       toast.error(res?.message || "Update failed");
//     }
//   } catch (error) {
//     toast.error("Something went wrong");
//   }
// };


//   const handleFile = (type, e) => {
//   const file = e.target.files[0];

//   setDriverDocs((prev) => ({
//     ...prev,
//     [type]: { file },
//   }));
// };


const handleFile = (key, e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onloadend = () => {
    setDriverDocs((prev) => ({
      ...prev,
      [key]: {
        file,
        preview: reader.result,
      },
    }));
  };

  reader.readAsDataURL(file);

  e.target.value = "";
};

const handleDriverSubmit = async () => {
  try {
    setLoading(true);

       const requiredDocs = [
      "Driver Photo",
      "Aadhar Front",
      "Aadhar Back",
      "DL Front",
      "DL Back",
    ];

    const uploadedDocsCount = requiredDocs.filter(
      (doc) => driverDocs[doc]?.file
    ).length;

    if (uploadedDocsCount !== requiredDocs.length) {
      toast.error("Please upload all driver documents");
      return;
    }
    // if (!driverName || driverMobile.length !== 10) {
    //   toast.error("Please fill all required fields properly");
    //   return;
    // }
    const name = cabDriver?.driver?.id
  ? driverUpdateData.driver_name
  : driverName;

const mobile = cabDriver?.driver?.id
  ? driverUpdateData.driver_mobile
  : driverMobile;

if (!name || mobile.length !== 10) {
  toast.error("Please fill all required fields properly");
  return;
}

    let res;

    // if (cabDriver?.driver?.id) {
    //   const payload = {
    //     full_name: driverUpdateData.driver_name,
    //     mobile_no: driverUpdateData.driver_mobile,
    //   };

    //   res = await apiClient(
    //     "PUT",
    //     `/fleet/update-operator/${cabDriver?.driver?.id}`,
    //     payload
    //   );
    if (cabDriver?.driver?.id) {
  const formData = new FormData();

  // formData.append("full_name", driverUpdateData.driver_name);
  // formData.append("mobile_no", driverUpdateData.driver_mobile);

  if (driverUpdateData.driver_name)
  formData.append("full_name", driverUpdateData.driver_name);

if (driverUpdateData.driver_mobile)
  formData.append("mobile_no", driverUpdateData.driver_mobile);

  // files (same like add)
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

  res = await apiClient(
    "PUT",
    `/fleet/update-operator/${cabDriver?.driver?.id}`,
    formData,
    { "Content-Type": "multipart/form-data" }
  );

    } else {
//       const formData = new FormData();

//       formData.append("operator_id", cabDetails?.operator_id);
//       formData.append("cab_id", cabDetails?.id);
//    formData.append("full_name", driverName);
// formData.append("mobile_no", driverMobile);
// formData.append("aadhar_no", driverAadhar);

const formData = new FormData();

formData.append("operator_id", cabDetails?.operator_id);
formData.append("cab_id", cabDetails?.id);
formData.append("full_name", driverName);
formData.append("mobile_no", driverMobile);
formData.append("aadhar_no", driverAadhar);

// files
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

      res = await apiClient(
        "POST",
        "/fleet/admin/driver/add-new",
        formData,
        { "Content-Type": "multipart/form-data" }
      );
    }

    if (res?.success) {
      toast.success(
        cabDriver?.driver?.id
          ? "Driver updated successfully"
          : "Driver created successfully"
      );
        setDriverName("");
  setDriverMobile("");
  setDriverAadhar("");
  setDriverDocs({});

  setDriverUpdateData({
    driver_name: "",
    driver_mobile: "",
  });

      setDriverUpdateOpen(false);
      fetchCabDocuments();
    } else {
      toast.error(res?.message || "Failed");
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
  }  finally {
    setLoading(false); 
  }
};

useEffect(() => {
  if (cabDriver?.driver) {
    setDriverUpdateData({
      driver_name: cabDriver.driver.full_name || "",
      driver_mobile: cabDriver.driver.mobile_no || "",
    });
  }
}, [cabDriver]);


// const resetDriverForm = () => {
//   setDriverUpdateData({
//     driver_name: cabDriver?.driver?.full_name || "",
//     driver_mobile: cabDriver?.driver?.mobile_no || "",
//     cab_type: "",
//   });
// };

const resetDriverForm = () => {
  setDriverName("");
  setDriverMobile("");
  setDriverAadhar("");
  setDriverDocs({});

  setDriverUpdateData({
    driver_name: "",
    driver_mobile: "",
  });
};


// const UploadBox = ({ label }) => {
//   const uploaded = driverDocs[label];

//   return (
//     <label className="border-2 border-dashed rounded-xl h-28 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
//       <input
//         type="file"
//         accept="image/*"
//         className="hidden"
//         onChange={(e) => handleFile(label, e)}
//       />

//       {uploaded ? (
//         <div className="flex flex-col items-center text-center">
//           <img
//             src={uploaded.preview}
//             className="h-12 w-12 object-cover rounded mb-1"
//           />
//           <p className="text-xs truncate">{uploaded.file.name}</p>

//           <button
//             onClick={(e) => {
//               e.preventDefault();
//               setDriverDocs((prev) => {
//                 const copy = { ...prev };
//                 delete copy[label];
//                 return copy;
//               });
//             }}
//             className="text-red-500 text-xs mt-1"
//           >
//             Remove
//           </button>
//         </div>
//       ) : (
//         <>
//           <p className="text-sm font-medium">{label}</p>
//           <span className="text-xs text-gray-400">Click to upload</span>
//         </>
//       )}
//     </label>
//   );
// };


const UploadBox = ({ label }) => {
  const uploaded = driverDocs[label];

  return (
    <div className="border-2 border-dashed rounded-xl p-3 flex flex-col items-center justify-center text-center relative h-32">

      <input
        type="file"
        accept="image/*"
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={(e) => handleFile(label, e)}
      />

      {uploaded ? (
        <>
          <img
            src={uploaded.preview}
            className="h-12 w-12 object-cover rounded-md mb-1"
          />

          <p className="text-[10px] text-gray-600 truncate w-full px-1">
            {uploaded.file.name}
          </p>

          <button
            onClick={(e) => {
              e.preventDefault();
              setDriverDocs((prev) => {
                const copy = { ...prev };
                delete copy[label];
                return copy;
              });
            }}
            className="text-red-500 text-[10px] mt-1"
          >
            Remove
          </button>
        </>
      ) : (
        <>
          <p className="text-xs font-medium">{label}</p>
          <span className="text-[10px] text-gray-400">
            Click to upload
          </span>
        </>
      )}
    </div>
  );
};


  return (
    <div className="space-y-2">
      {/* <div className="border border-[#babbba] p-2 flex items-center gap-2 bg-white dark:bg-gray-900 mt-1">
        <IoHomeOutline className="text-gray-400" size={18} />
        <MdKeyboardDoubleArrowLeft className="text-gray-400 w-4 h-4" />
        <span className="text-sm text-gray-600 font-medium">
          Fleet Dashboard
        </span>
        <MdKeyboardDoubleArrowLeft className="text-gray-400 w-4 h-4" />
        <Link
          href="#"
          className="text-sm text-gray-600 font-medium hover:underline hover:text-blue-600"
        >
          Active Fleets Kumar Murari
        </Link>
        <MdKeyboardDoubleArrowLeft className="text-gray-400 w-4 h-4" />
        <Link
          href="#"
          className="text-sm text-gray-600 font-medium hover:underline hover:text-blue-600"
        >
          Total Cabs
        </Link>
        <MdKeyboardDoubleArrowLeft className="text-gray-400 w-4 h-4" />
        <Link
          href="#"
          className="text-sm text-blue-600 font-medium hover:underline"
        >
          Cab Details-BR 12 AB 1234
        </Link>
      </div> */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm text-blue-600 font-medium">
            {cabDetails?.registration_no || "N/A"}
          </span>
          <Link
            href="/fleetManagement/fleetDetails"
            className="text-sm text-blue-600 font-medium hover:underline"
          >
            ← Back to Fleet
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-6 p-4">
          <div className="md:basis-[65%] bg-white border rounded-2xl p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Cab Images
            </h2>
            <div className="flex flex-wrap gap-4">
              <div className="bg-[url('/images/carbg.svg')] bg-cover bg-center p-4 rounded-lg border w-full md:w-[48%]">
                <Image
                  src="/images/fleetCar.png"
                  alt="Cab"
                  width={150}
                  height={150}
                  className="mx-auto h-32 object-contain"
                />
              </div>
              <div className="bg-[url('/images/carbg.svg')] bg-cover bg-center p-4 rounded-lg border w-full md:w-[48%]">
                <Image
                  src="/images/carBack.png"
                  alt="Cab"
                  width={150}
                  height={150}
                  className="mx-auto h-32 object-contain"
                />
              </div>
            </div>
          </div>

          <div className="md:basis-[35%] bg-white border rounded-2xl p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Important Dates
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-[12px] text-gray-700 font-medium flex items-center gap-2">
                  <input type="checkbox" className="accent-blue-600" />
                  Pollution End Date
                </label>
                <input
                  type="date"
                  defaultValue="2025-12-31"
                  className="w-full px-4 py-1.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px]"
                />
              </div>

              <div>
                <label className="text-[12px] text-gray-700 font-medium flex items-center gap-2">
                  <input type="checkbox" className="accent-blue-600" />
                  Insurance End Date
                </label>
                <input
                  type="date"
                  defaultValue="2025-12-31"
                  className="w-full px-4 py-1.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {cabModes && (
<div className="bg-white border flex justify-between rounded-2xl px-4 py-4 shadow-sm mt-6">
  <div className="flex flex-col gap-4">
    <h2 className="text-sm font-semibold">
      Cab Service Modes
    </h2>
    <div className="flex flex-wrap gap-3">
      {Object.keys(cabModes).map((key) => (
        <label
          key={key}
          className="flex items-center gap-2 border rounded-lg px-3 py-1.5 text-sm"
        >
          <input
            type="checkbox"
            checked={cabModes[key]}
            onChange={(e) => handleCheckClick(key, e.target.checked)}
            className="accent-blue-600"
          />
          {MODE_LABELS[key]}
        </label>
      ))}

      <label className="flex items-center gap-2 border rounded-lg px-3 py-1.5 text-sm">
        <input
          type="checkbox"
          checked={bookedStatus === "booked"}
          onChange={(e) =>
            handleCheckClick(
              "booked_status",
              e.target.checked ? "booked" : "unbooked"
            )
          }
          className="accent-blue-600"
        />
        {bookedStatus === "booked" ? "Booked" : "Unbooked"}
      </label>
    </div>
    <div className="flex flex-wrap gap-3">
      <div className="border rounded-lg px-3 py-1.5 text-sm w-full sm:w-auto">
        <select
          value={cabMeta.cab_type}
          onChange={(e) => handleMetaChange("cab_type", e.target.value)}
          className="outline-none bg-transparent w-full"
        >
          <option value="">Cab Type</option>
          {(cabTypes || []).map((cab) => (
            <option key={cab.id} value={cab.id}>
              {cab.cab_type}
            </option>
          ))}
        </select>
      </div>
      <div className="border rounded-lg px-3 py-1.5 text-sm w-full sm:w-auto">
        <select
          value={cabMeta.cab_model}
          onChange={(e) => handleMetaChange("cab_model", e.target.value)}
          className="outline-none bg-transparent w-full"
        >
          <option value="">Cab Model</option>
          {(cabModels || []).map((model) => (
            <option key={model.id} value={model.id}>
              {model.make_name} - {model.make_model}
            </option>
          ))}
        </select>
      </div>

      {/* Fuel */}
      <div className="border rounded-lg px-3 py-1.5 text-sm w-full sm:w-auto">
        <select
          value={cabMeta.fuel_type}
          onChange={(e) => handleMetaChange("fuel_type", e.target.value)}
          className="outline-none bg-transparent w-full"
        >
          <option value="">Fuel Type</option>
          {(cabFuel || []).map((fuel) => (
            <option key={fuel.id} value={fuel.id}>
              {fuel.fuel_type}
            </option>
          ))}
        </select>
      </div>
      <div
        onClick={() => {
          const newStatus =
  cabMeta.cab_status === "verified" ? "pending" : "verified";
          setPendingChange({ key: "cab_status", value: newStatus });
          setConfirmOpen(true);
        }}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer text-sm font-medium
          ${
            // cabStatus === "verified"
            cabMeta.cab_status === "verified"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
      >
        <div
          className={`w-3 h-3 rounded-full ${
            // cabStatus === "verified"
            cabMeta.cab_status === "verified"
              ? "bg-green-600"
              : "bg-red-600"
          }`}
        ></div>
        {cabMeta.cab_status === "verified" ? "Verified" : "Pending"}
      </div>

    </div>
  </div>
<div className="lg:w-1/3 flex justify-end items-center">
  {mapUrl && (
    <button
      onClick={() => window.open(mapUrl, "_blank")}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition"
      title="Open in Google Maps"
    >
      <SiGooglemaps  className="text-blue-600 text-lg" />
    </button>
  )}
</div>
</div>

      )}

      {showConfirm && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
    <div className="bg-white p-5 rounded-xl w-80 shadow-lg">
      <h3 className="text-base font-semibold mb-4">
        Change cab type?
      </h3>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowConfirm(false)}
          className="border px-3 py-1 rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={async () => {
            setSelectedCabType(tempCabType);
            setShowConfirm(false);
            await updateCabTypeAPI(tempCabType);
          }}
          className="bg-blue-600 text-white px-3 py-1 rounded-lg"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}

      <div className="bg-white border rounded-2xl p-6 shadow-sm mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Documents</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {document.map((doc, index) => {
            const { border, bg, icon } = getStatusStyles(doc.status);

            return (
    <div
  key={index}
  className={`rounded-xl border-2  ${border} shadow-sm flex flex-col justify-between overflow-hidden`}
>

  {/* Image Section */}
  <div className="relative h-24 w-full">
    {/* <Image
      src={getImageUrl(
        cabDocs?.[DOC_IMAGE_MAP[doc.title]],
        ""
      )}
      alt={doc.title}
      fill
      className="object-cover"
    /> */}
    <Image
  src={getImageUrl(cabDocs?.[DOC_IMAGE_MAP[doc.title]])}
  alt={doc.title}
  fill
  className="object-cover"
/>

    {/* Eye Button */}
    <button
      onClick={() => {
        const imgKey = DOC_IMAGE_MAP[doc.title];
        openImage(cabDocs?.[imgKey]);
      }}
      className="absolute top-2 right-2 bg-white p-1 rounded"
    >
      <FaEye />
    </button>
  </div>

  {/* Title + Status */}
  <div className="flex flex-col items-center justify-center gap-1 py-2">
    <span>{doc.title}</span>

    {doc.status === "pending" && (
      <div className="text-yellow-600 text-xs">Pending</div>
    )}
    {doc.status === "approved" && (
      <div className="text-green-600 text-xs">Approved</div>
    )}
    {doc.status === "rejected" && (
      <div className="text-red-600 text-xs">Rejected</div>
    )}
  </div>

  {/* Buttons */}
  {/* <div className="flex gap-2 p-2 border-t">
    <button
      onClick={() => handleVerifyDoc(doc.title, false)}
      className="flex-1 text-red-600 border border-red-600 text-sm rounded-md"
    >
      Reject
    </button>

    <button
      onClick={() => handleVerifyDoc(doc.title, true)}
      className="flex-1 text-blue-600 border border-blue-600 text-sm rounded-md"
    >
      Approve
    </button>
  </div> */}
  {doc.status !== "approved" && (
  <div className="flex gap-2 p-2 border-t">
    <button
      onClick={() => handleVerifyDoc(doc.title, false)}
      className="flex-1 text-red-600 border border-red-600 text-sm rounded-md"
    >
      Reject
    </button>

    <button
      onClick={() => handleVerifyDoc(doc.title, true)}
      className="flex-1 text-blue-600 border border-blue-600 text-sm rounded-md"
    >
      Approve
    </button>
  </div>
)}

</div>
            );
          })}
        </div>
      </div>
      <div className="bg-white border rounded-2xl p-4 sm:p-6 shadow-sm mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 sm:mb-6">
          Cab Owner Documents
        </h2>

        <div className="flex flex-wrap md:flex-nowrap lg:justify-between gap-6">
          {/* Left Column */}
          <div className="w-full md:w-1/3 space-y-4">
            <div>
              <label className="text-[12px] font-medium text-gray-700 block">
                Owner Aadhar Number
              </label>
              <input
                type="text"
                value={cabOwner?.aadhar_no || ""}
                readOnly
                className="w-full px-4 py-1.5 rounded-md border border-gray-300 focus:outline-none text-[12px]"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-gray-700 block">
                Name (as per aadhar)<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                // value="Abhishek kumar"
                value={cabOwner?.operator?.full_name || ""}
                readOnly
                className="w-full px-4 py-1.5 rounded-md border border-gray-300 focus:outline-none text-[12px]"
              />
            </div>
          </div>

          {/* Center Column */}
          <div className="w-full md:w-1/3 flex md:justify-between gap-4">
            {OWNER_DOCS.map((doc, i) => (
              <div
                key={i}
             
className={`w-[220px] rounded-xl border-2 relative overflow-hidden ${
  cabOwner?.[doc.approveKey] === true
    ? "border-green-500"
    : cabOwner?.[doc.approveKey] === false
    ? "border-red-500"
    : "border-yellow-500"
}`}

      >
                <div className="relative h-[120px]">
                  <Image
                    src={getImageUrl(
                      cabOwner?.[doc.imageKey],
                      "/images/aadhaar.png"
                    )}
                    alt={doc.title}
                    fill
                    className="object-cover"
                  />

                  <FaEye
                    onClick={() => openImage(cabOwner?.[doc.imageKey])}
                    className="absolute top-2 right-2 cursor-pointer bg-white p-1 rounded"
                  />
                </div>

                {/* <div className="flex gap-2 px-3 py-2">
                  <button
                    onClick={() => handleOwnerDocVerify(doc.approveKey, false)}
                    className="flex-1 text-red-600 border border-red-500 px-3 py-1 text-xs rounded"
                  >
                    Reject
                  </button>
                
  <button
    onClick={() => handleOwnerDocVerify(doc.approveKey, true)}
    className="flex-1 text-blue-600 border border-blue-500 px-3 py-1 text-xs rounded"
  >
    Approve
  </button>

                </div> */}


                
                {cabOwner?.[doc.approveKey] ? (
  <div className="px-3 py-2 text-center text-green-600 text-xs font-semibold">
    Approved
  </div>
) : (
  <div className="flex gap-2 px-3 py-2">
    <button
      onClick={() => handleOwnerDocVerify(doc.approveKey, false)}
      className="flex-1 text-red-600 border border-red-500 px-3 py-1 text-xs rounded"
    >
      Reject
    </button>

    <button
      onClick={() => handleOwnerDocVerify(doc.approveKey, true)}
      className="flex-1 text-blue-600 border border-blue-500 px-3 py-1 text-xs rounded"
    >
      Approve
    </button>
  </div>
)}
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="w-full md:w-1/3 flex flex-col items-start sm:items-center gap-4">
            <button
              onClick={() => {
                router.push("/fleetManagement/cabRideLists");
              }}
              className="relative flex items-center justify-between px-4 sm:px-6 py-4 text-white rounded-md bg-gradient-to-r from-[#005FE2] to-[#00347C] shadow-md w-full sm:w-[320px]"
            >
              <span className="text-[14px] font-medium">
                View Booking Rides lists
              </span>
              <span className="absolute right-0 top-[22px] -translate-y-1/2 rotate-[6deg] origin-left-bottom bg-[#005FE2] px-4 py-3 rounded-lg shadow-md">
                <ExternalLink className="text-white w-5 h-5 rotate-[-6deg]" />
              </span>
            </button>
            <button
              onClick={() => setBlockModal(true)}
              className="relative flex items-center justify-between px-4 sm:px-6 py-4 text-white rounded-md bg-gradient-to-r from-[#E30613] to-[#7D030A] shadow-md w-full sm:w-[320px]"
            >
              <span className="text-[14px] font-medium">Block this Driver</span>
              <span className="absolute right-0 top-[22px] -translate-y-1/2 rotate-[6deg] bg-[#E30613] px-4 py-3 rounded-md shadow-md">
                <Trash2 className="text-white w-5 h-5" />
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between">
        <h2 className="text-[16px] font-semibold text-gray-900 mb-4">
          Cab Driver Documents
        </h2>


<button
  // onClick={() => setDriverUpdateOpen(true)}
  onClick={() => {
  if (cabDriver?.driver?.id) {
    setDriverUpdateOpen(true); // update
  } else {
    setAddDriverOpen(true); // add
  }
}}
  className="bg-blue-600 text-white  px-4 py-2 rounded-md text-sm mt-3 mb-3"
>
  {cabDriver?.driver?.id ? "Update Driver" : "Add Driver"}
</button>

<CommonModal
  open={driverUpdateOpen}
  onClose={() => {
    resetDriverForm();
    setDriverDocs({});
    setDriverUpdateOpen(false);
  }}
  title={cabDriver?.driver?.id ? "Update Driver Details" : "Add Driver"}
  actions={[
    {
      label: "Cancel",
      onClick: () => {
        resetDriverForm();
        setDriverDocs({});
        setDriverUpdateOpen(false);
      },
      variant: "outlined",
      color: "inherit",
    },
    {
      label: cabDriver?.driver?.id ? "Update Driver" : "Add Driver",
      onClick: handleDriverSubmit,
      disabled: loading || !isDocsValid, 
    },
  ]}
>
  <div className="space-y-4">

    {/* Inputs */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
      <input
        placeholder="Driver Name *"
        value={driverUpdateData.driver_name}
        onChange={(e) => {
          const value = e.target.value.replace(/[^a-zA-Z\s.-]/g, "");
          setDriverUpdateData((prev) => ({
            ...prev,
            driver_name: value,
          }));
        }}
        className="border px-3 py-2 rounded-md w-full"
      />

      <input
        placeholder="Driver Mobile *"
        value={driverUpdateData.driver_mobile}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, "").slice(0, 10);
          setDriverUpdateData((prev) => ({
            ...prev,
            driver_mobile: value,
          }));
        }}
        className="border px-3 py-2 rounded-md w-full"
      />
    </div>

    {/* Upload Section */}
    <div>
      <h3 className="font-semibold mb-3">Driver Documents</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <UploadBox label="Driver Photo" />
        <UploadBox label="Aadhar Front" />
        <UploadBox label="Aadhar Back" />
        <UploadBox label="DL Front" />
        <UploadBox label="DL Back" />
      </div>
    </div>

  </div>
</CommonModal>











<CommonModal
  open={addDriverOpen}
  onClose={() => setAddDriverOpen(false)}
  title="Add Driver"
  actions={[
    {
      label: "Cancel",
      onClick: () => setAddDriverOpen(false),
    },
    {
      label: "Add Driver",
      onClick: handleDriverSubmit,
      disabled: loading || !isDocsValid,
    },
  ]}
>
  <div className="space-y-4">

    {/* Inputs */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <input
        placeholder="Driver Name"
        value={driverName}
        onChange={(e) => setDriverName(e.target.value)}
        className="border px-3 py-2 rounded-md"
      />

      {/* <input
        placeholder="Mobile"
        value={driverMobile}
        onChange={(e) => setDriverMobile(e.target.value)}
        className="border px-3 py-2 rounded-md"
      /> */}

      <input
  placeholder="Mobile"
  value={driverMobile}
  maxLength={10} 
  onChange={(e) =>
    setDriverMobile(e.target.value.replace(/\D/g, "")) 
  }
  className="border px-3 py-2 rounded-md"
/>

      {/* <input
        placeholder="Aadhar Number"
        value={driverAadhar}
        onChange={(e) => setDriverAadhar(e.target.value)}
        className="border px-3 py-2 rounded-md"
      /> */}
      <input
  placeholder="Aadhar Number"
  value={driverAadhar}
  maxLength={12} 
  onChange={(e) =>
    setDriverAadhar(e.target.value.replace(/\D/g, ""))
  }
  className="border px-3 py-2 rounded-md"
/>
    </div>

    {/* Upload Section */}
    <div>
      <h3 className="font-semibold mb-3">Driver Documents</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <UploadBox label="Driver Photo" />
        <UploadBox label="Aadhar Front" />
        <UploadBox label="Aadhar Back" />
        <UploadBox label="DL Front" />
        <UploadBox label="DL Back" />
      </div>
    </div>

  </div>
</CommonModal>

</div>

        <div className="flex flex-col md:flex-row gap-6 flex-nowrap items-start">
          <div className="w-full md:w-[28%] space-y-2">
            <div className="flex items-center gap-4">
              <Image
                src="/images/driverplaceholderimg.png"
                alt="Driver"
                width={150}
                height={150}
                className="w-12 h-12 rounded-full object-cover ring-1 ring-green-400"
              />
              <div>
                <p className="text-gray-700 text-[12px]">Driver Name</p>
                {/* <h3 className="text-[16px] font-semibold text-black -mt-1">Jethalal Gada</h3>
                                <p className="text-gray-600 text-sm flex items-center gap-1">
                                    <FaPhoneAlt className="text-[10px" /> <span className="text-[12px]">+91-9693189968</span>
                                </p> */}
                <h3 className="text-[16px] font-semibold">
                  {cabDriver?.driver?.full_name || "N/A"}
                </h3>

                <span className="text-[12px]">
                  +91-{cabDriver?.driver?.mobile_no || ""}
                </span>
              </div>
            </div>

            <div>
              <label className="text-[12px] text-gray-700 font-medium block">
                Whatsapp Number
              </label>
              <input
                type="text"
                className="w-full px-4 py-1.5 rounded-md border border-gray-300 focus:outline-none text-[12px]"
                defaultValue={cabDriver?.driver?.whatsapp || cabDriver?.driver?.mobile_no}
              />
            </div>

            <div>
              <label className="text-[12px] text-gray-700 font-medium block">
                Aadhar Card Number
              </label>
              <input
                type="text"
                className="w-full px-4 py-1.5 rounded-md border border-gray-300 focus:outline-none text-[12px]"
                defaultValue={cabDriver?.aadhar_no}
              />
            </div>
          </div>

          <div className="w-full md:w-[72%] flex flex-wrap gap-4">
            {/* {documents.map((doc, index) => (
              <div
                key={index}
                className="w-[220px] rounded-xl border border-blue-500 relative overflow-hidden flex flex-col justify-between"
              >
                <div className="relative h-[120px]">
                  <Image
                    src={doc.image}
                    alt={doc.title}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                  <FaEye className="absolute top-2 right-2 text-gray-700 bg-white rounded-md p-1 text-lg shadow cursor-pointer" />

                
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <BsCheck2Circle className="text-blue-500 text-lg" />
                    <div className="text-center font-semibold text-sm text-black">
                      {doc.title}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 px-3 py-2">
                  <button className="flex-1 text-red-600 border border-red-500 px-3 py-1 text-xs rounded hover:bg-red-50">
                    Reject
                  </button>
                  <button className="flex-1 text-blue-600 border border-blue-500 px-3 py-1 text-xs rounded hover:bg-blue-50">
                    Aprove
                  </button>
                </div>
              </div>
            ))} */}
            {DRIVER_DOCS.map((doc, index) => (
              <div
                key={index}
                // className="w-[220px] rounded-xl border border-blue-500 relative overflow-hidden"
                className={`w-[220px] rounded-xl border-2 relative overflow-hidden ${
  cabDriver?.[doc.approveKey] === true
    ? "border-green-500"
    : cabDriver?.[doc.approveKey] === false
    ? "border-red-500"
    : "border-yellow-500"
}`}
              >
                <div className="relative h-[120px]">
                  {cabDriver?.[doc.imageKey] && (
                    // <Image
                    //   src={getImageUrl(cabDriver?.[doc.imageKey])}
                    //   alt={doc.title}
                    //   fill
                    //   className="object-cover"
                    // />
                    <Image
  src={getImageUrl(cabDriver?.[doc.imageKey])}
  alt={doc.title}
  fill
  className="object-cover"
/>
                  )}

                  <FaEye
                    onClick={() => openImage(cabDriver?.[doc.imageKey])}
                    className="absolute top-2 right-2 cursor-pointer bg-white p-1 rounded"
                  />

                  <div className="absolute bottom-2 left-2 bg-white/80 px-2 py-0.5 rounded text-xs font-medium">
                    {doc.title}
                  </div>
                </div>

                {/* <div className="flex gap-2 px-3 py-2">
                  <button className="flex-1 text-red-600 border border-red-500 px-3 py-1 text-xs rounded">
                    Reject
                  </button>
                  <button className="flex-1 text-blue-600 border border-blue-500 px-3 py-1 text-xs rounded">
                    Approve
                  </button>
                </div> */}
                {cabDriver?.[doc.approveKey] === true ? (
  <div className="px-3 py-2 text-center text-green-600 text-xs font-semibold">
    Approved
  </div>
) : (
  <div className="flex gap-2 px-3 py-2">
    <button
      onClick={() => handleDriverDocVerify(doc.approveKey, false)}
      className="flex-1 text-red-600 border border-red-500 px-3 py-1 text-xs rounded"
    >
      Reject
    </button>

    <button
      onClick={() => handleDriverDocVerify(doc.approveKey, true)}
      className="flex-1 text-blue-600 border border-blue-500 px-3 py-1 text-xs rounded"
    >
      Approve
    </button>
  </div>
)}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center py-4">
        <button
          className="bg-gray-400 text-white text-sm font-medium px-6 py-2 rounded-md shadow-md cursor-not-allowed opacity-80"
          disabled
        >
          Approved
        </button>
      </div>
      <BlockDriverModal
        isOpen={blockModal}
        onClose={() => setBlockModal(false)}
      />

      {imgOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg relative max-w-[90%]">
            <button
              onClick={() => setImgOpen(false)}
              className="absolute top-2 right-2 text-red-600 font-bold"
            >
              ✕
            </button>

            <Image
              src={previewImg}
              alt="Document"
              width={500}
              height={500}
              className="object-contain max-h-[80vh]"
            />
          </div>
        </div>
      )}

      {confirmOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[320px]">
            <h3 className="text-lg font-semibold mb-2">Confirm Update</h3>

            <p className="text-sm text-gray-600 mb-4">
              Do you want to{" "}
              <span className="font-semibold">
                {pendingChange?.key === "booked_status"
                  ? pendingChange?.value === "booked"
                    ? "mark as Booked"
                    : "mark as Unbooked"
                  : pendingChange?.value
                  ? "enable"
                  : "disable"}
              </span>{" "}
              {/* <span className="font-semibold text-gray-900">
                {MODE_LABELS[pendingChange?.key]}
              </span> */}
              <span className="font-semibold text-gray-900">
  {MODE_LABELS[pendingChange?.key] ||
   pendingChange?.key.replace("_", " ")}
</span>
              ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={cancelUpdate}
                className="px-4 py-2 text-sm border rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={confirmUpdate}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md"
              >
                Yes, Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CabVerification;