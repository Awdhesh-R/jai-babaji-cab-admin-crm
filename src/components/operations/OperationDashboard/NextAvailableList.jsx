import { apiClient } from "@/app/lib/apiClient";
import { useEffect, useState, useRef } from "react";
import {
  FaCheck,
  FaCheckCircle,
  FaEdit,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";
import { toast } from "react-toastify";
import {
  PhoneOff,
  Clock,
  Search,
  Filter,
  Download,
  Calendar,
  X,
} from "lucide-react";

const NextAvailableList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [cityList, setCityList] = useState([]);
  const [allCitiesLoaded, setAllCitiesLoaded] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCabId, setSelectedCabId] = useState(null);
  const [reason, setReason] = useState("");
  const [date, setDate] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const dateRef = useRef(null);
  const timeRef = useRef(null);
  const [selectedCityForCallback, setSelectedCityForCallback] = useState("");
  const [time, setTime] = useState("");
  const [sourceCoordinate, setSourceCoordinate] = useState(null);
  const [selectedCityIdForCallback, setSelectedCityIdForCallback] =
    useState("");
  const [openCityDropdown, setOpenCityDropdown] = useState(false);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const [submitting, setSubmitting] = useState(false);
  const [callbackCityList, setCallbackCityList] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const dropdownRef = useRef(null);
  const [searchCab, setSearchCab] = useState("");

  const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const debouncedSearch = debounce((value, city) => {
  fetchList(city, value);
}, 200);



  const cityClusters = [
    "Patna",
    "Muzaffarpur",
    "Darbhanga",
    "Chapra",
    "Samastipur",
  ];

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    if (timeStr.includes(":") && timeStr.length === 5) return timeStr;

    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
    if (!match) return "";

    let [, h, m, ap] = match;
    h = Number(h);

    if (ap.toUpperCase() === "PM" && h !== 12) h += 12;
    if (ap.toUpperCase() === "AM" && h === 12) h = 0;

    return `${String(h).padStart(2, "0")}:${m}`;
  };

  const toBackendTime = (time) => {
    const [h, m] = time.split(":");
    let hour = Number(h);
    const period = hour >= 12 ? "pm" : "am";
    hour = hour % 12 || 12;
    return `${hour}:${m} ${period}`;
  };

  const handleEditTime = (id, idx, time) => {
    setSelectedTime((prev) => formatTime(time));
    setEditingIndex((prev) => idx);
    setIsEditing((prev) => true);
  };
  // const fetchList = async (city = "") => {

const fetchList = async (city = "", cabReg = "") => {
    try {
      setLoading(true);

      // const url = city
      //   ? `/rb_cabs/rbNextAvailabilityCabList?city_name=${city}`
      //   : `/rb_cabs/rbNextAvailabilityCabList`;
      const params = new URLSearchParams();

if (city) params.append("city_name", city);
if (cabReg) params.append("cab_reg", cabReg);

const query = params.toString();
const url = query
  ? `/rb_cabs/rbNextAvailabilityCabList?${query}`
  : `/rb_cabs/rbNextAvailabilityCabList`;


      const response = await apiClient("GET", url);

      if (response.status || response.success) {
        setList(response.data);
        if (!allCitiesLoaded) {
          const uniqueCities = response.data
            .filter((item) => item.json_cab_avability_details?.city_name)
            .map((item) => ({
              name: item.json_cab_avability_details.city_name,
              id: item.json_cab_avability_details.city_id,
            }));
          const cleanedCities = uniqueCities.filter(
            (v, i, arr) => arr.findIndex((c) => c.name === v.name) === i,
          );

          setCityList(cleanedCities);

          setAllCitiesLoaded(true);
        }
      } else {
        toast.error(response.message);
      }

      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const fetchCallbackCities = async () => {
    try {
      setLoadingCities(true);

      const res = await apiClient("GET", "/city/getCityList");

      if (res?.data) {
        setCallbackCityList(
          res.data.map((city) => ({
            id: city.id,
            name: city.city_name,
          })),
        );
      }

      setLoadingCities(false);
    } catch (e) {
      console.log(e);
      setLoadingCities(false);
    }
  };

  useEffect(() => {
    fetchList();
    fetchCallbackCities();
  }, []);

  const handleEditTimeSubmit = async (cabId, idx) => {
    try {
      const payload = {
        cab_id: cabId,
        next_available_time: toBackendTime(selectedTime),
      };
      const res = await apiClient(
        "POST",
        "/rb_cabs/rbUpdateNextAvailabilityTime",
        payload,
      );

      if (res.status || res.success) {
        toast.success("Time updated successfully");
        setList((prev) =>
          prev.map((item, i) =>
            i === idx
              ? {
                  ...item,
                  json_cab_avability_details: {
                    ...item.json_cab_avability_details,
                    Next_avilable_time: selectedTime,
                  },
                }
              : item,
          ),
        );

        setIsEditing(false);
      } else {
        toast.error(res.message || "Update failed");
      }
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  const filteredList = list.filter((item) => {
    if (statusFilter === "all") return true;
    return item.ride_status === statusFilter;
  });

  const handleCallBackSubmit = async () => {
    if (submitting) return;

    setSubmitting(true);

    const dateTime = `${date}T${time}:00.000+05:30`;
    const payload = {
      cab_id: selectedCabId,
      sourceCoordinate: sourceCoordinate,
      reason: reason,
      date: dateTime,
      destination: destination || "",
      city_id: Number(selectedCityIdForCallback),
    };

    try {
      const res = await apiClient("POST", "/rb_cabs/callback-request", payload);

      if (res.status || res.success) {
        toast.success("Call back scheduled");
        setSelectedCabId(null);
        setReason("");
        setDate("");
        setTime("");
        setDestination("");
        setSelectedCityForCallback("");
        setSelectedCityIdForCallback("");
        setSourceCoordinate(null);
        setSelectedItem(null);
        setCitySearch("");

        setIsOpen(false);
      } else {
        toast.error(res.message || "Failed");
      }
    } catch (e) {
      toast.error("Something went wrong");
    }

    setSubmitting(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const resetCallbackForm = () => {
    setSelectedCityForCallback("");
    setSelectedCityIdForCallback("");
    setCitySearch("");
    setOpenCityDropdown(false);
    setReason("");
    setDate("");
    setTime("");
  };

  useEffect(() => {
    if (isOpen) {
      setCitySearch("");
      setOpenCityDropdown(false); 
    }
  }, [isOpen]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-4  mx-auto w-full">
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-1 h-3 sm:h-6 rounded-md bg-green-700 mr-2 sm:mr-3"></div>
            <h2 className=" text-[16px] md:text-2xl font-bold font-nunito bg-gradient-to-r from-[#15803D] to-[#81CA18] bg-clip-text text-transparent">
              Next Available Cab List
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 ">
            <button
              onClick={() => {
                setSelectedCity("");
                fetchList("");
              }}
              className={`px-4 py-1.5 rounded-md text-sm border transition
                ${
                  selectedCity === ""
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-green-50"
                }`}
            >
              All
            </button>




            {cityClusters.map((city) => (
              <button
                key={city}
                onClick={() => {
                  setSelectedCity(city);
                  fetchList(city);
                }}
                className={`px-4 py-1.5 rounded-md text-sm border transition
        ${
          selectedCity === city
            ? "bg-green-600 text-white border-green-600"
            : "bg-white text-gray-700 border-gray-300 hover:bg-green-50"
        }`}
              >
                {city}
              </button>
              
            ))}
                        <button
  onClick={() => {
    setSelectedCity("other");
    fetchList("other", searchCab);
  }}
  className={`px-4 py-1.5 rounded-md text-sm border transition
    ${
      selectedCity === "other"
        ? "bg-green-600 text-white border-green-600"
        : "bg-white text-gray-700 border-gray-300 hover:bg-green-50"
    }`}
>
  Other
</button>
          </div>

          {/* <div className="relative w-56">
          <select
            value={selectedCity}
            onMouseDown={() => setOpen((prev) => !prev)}
            onChange={(e) => {
              const city = e.target.value;
              setSelectedCity(city);
              fetchList(city);
              setOpen(false);
            }}
            className="appearance-none w-full border-2 border-gray-400 px-3 py-2 pr-10 rounded-md bg-white text-sm focus:outline-none focus:border-green-500 cursor-pointer"
          >
            <option value="">All Cities</option>
            {cityList.map((city, i) => (
              <option key={i} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>

          <FaChevronDown
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 transition-transform duration-200 pointer-events-none ${
              open ? "rotate-180" : "rotate-0"
            }`}
          />
        </div> */}

          <div className="relative w-56" ref={dropdownRef}>
            <div
              onClick={() => setOpen(!open)}
              className="w-full border-2 border-gray-400 px-3 py-2 pr-10 rounded-md bg-white text-sm cursor-pointer"
            >
              {selectedCity || "All Cities"}
            </div>

            <FaChevronDown
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 transition-transform ${
                open ? "rotate-180" : "rotate-0"
              }`}
            />

            {open && (
              <div className="absolute left-0 w-full mt-1 bg-white border rounded-md shadow-md z-50">
                <input
                  type="text"
                  placeholder="Search city..."
                  className="w-full px-3 py-2 border-b outline-none"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                />
                <div className="max-h-48 overflow-y-auto">
                  <div
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedCity("");
                      fetchList("");
                      setOpen(false);
                    }}
                  >
                    All Cities
                  </div>

                  {cityList
                    .filter((c) =>
                      c.name.toLowerCase().includes(citySearch.toLowerCase()),
                    )
                    .map((city, i) => (
                      <div
                        key={i}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedCity(city.name);
                          fetchList(city.name);
                          setOpen(false);
                        }}
                      >
                        {city.name}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3 mb-4 bg-gray-200 rounded-full p-1 w-fit">
          <button
            onClick={() => setStatusFilter("booked")}
            className={`px-6 py-1.5 rounded-full text-sm transition ${
              statusFilter === "booked"
                ? "bg-red-600 text-white"
                : "text-gray-700"
            }`}
          >
            Booked
          </button>

          <button
            onClick={() => setStatusFilter("free")}
            className={`px-6 py-1.5 rounded-full text-sm transition ${
              statusFilter === "free"
                ? "bg-green-600 text-white"
                : "text-gray-700"
            }`}
          >
            Free
          </button>
        </div>

        <div className="flex gap-2 items-center">
  <input
  placeholder="Search cab number..."
  value={searchCab}
  onChange={(e) => {
    const value = e.target.value;
    setSearchCab(value);
    debouncedSearch(value, selectedCity);
  }}
  className="border px-3 py-2 rounded-md text-sm"
/>
</div>
</div>


        <div className="max-w-full bg-white md:p-0 p-2  shadow-md rounded-lg">
          <table className="min-w-full border-collapse block md:table">
            <thead className="hidden md:table-header-group">
              <tr className="text-left text-gray-600 font-semibold border-b border-gray-300 block md:table-row">
                <th className="p-1 text-[14px] block md:table-cell">S.No</th>

                <th className="p-1 md:py-4   text-[14px]   block md:table-cell">
                  Cab Reg
                </th>
                <th className="p-1 text-[14px]   block md:table-cell">
                  Driver Name
                </th>
                <th className="p-1 text-[14px]   block md:table-cell">
                  Driver Mobile
                </th>
                <th className="p-1 text-[14px]   block md:table-cell">
                  Status
                </th>
                <th className="p-1 text-[14px]   block md:table-cell">
                  Next Available City
                </th>
                <th className="p-1 text-[14px]   block md:table-cell">
                  Next Available Time
                </th>
                <th className="p-1 text-[14px]   block md:table-cell">
                  Availability City
                </th>
                <th className="p-1 text-[14px]   block md:table-cell">
                  Free in Time
                </th>
              </tr>
            </thead>

            <tbody className="block md:table-row-group">
              {filteredList.map(
                (
                  {
                    id,
                    cab_driver_details,
                    cab_gps_details_json,
                    cab_model,
                    cab_name,
                    cab_reg,
                    cab_service_type,
                    cab_status,
                    driver_id,
                    fuel_type,
                    is_intracity,
                    is_local,
                    json_cab_avability_details,
                    ride_status,
                    status,
                    current_city,
                    trip_end_time_ago,
                    cab_gps_data,
                    callback_time,
                  },
                  idx,
                ) => (
                  <tr
                    key={id}
                    className="mb-4 text-sm block md:table-row border-b border-gray-300"
                  >
                    <td
                      className="p-3 md:py-4 block md:table-cell"
                      data-label="S.No"
                    >
                      <div className="flex justify-between md:block">
                        <span className="font-bold text-gray-500 md:hidden">
                          S.No:
                        </span>
                        <span>{idx + 1}</span>
                      </div>
                    </td>

                    <td
                      className="p-3 md:py-4  font-nunito text-[#15803D] whitespace-nowrap font-semibold hover:underline cursor-pointer block md:table-cell"
                      data-label="Cab Reg"
                    >
                      <div className="flex justify-between md:block">
                        <span className="font-bold  text-gray-500 md:hidden">
                          Cab Reg:
                        </span>
                        <span className="flex items-center gap-2">
                          {cab_reg}
                        </span>
                      </div>
                    </td>
                    <td
                      className="p-3 md:py-4  font-nunito text-[#15803D] whitespace-nowrap font-semibold hover:underline cursor-pointer block md:table-cell"
                      data-label="Driver Name"
                    >
                      <div className="flex justify-between md:block">
                        <span className="font-bold  text-gray-500 md:hidden">
                          Driver Name:
                        </span>
                        <span className="flex items-center gap-2">
                          {cab_driver_details?.driverName || "-"}
                        </span>
                      </div>
                    </td>
                    <td
                      className="p-3 md:py-4  font-nunito text-[#15803D] whitespace-nowrap font-semibold hover:underline cursor-pointer block md:table-cell"
                      data-label="Drvier Mobile"
                    >
                      <div className="flex justify-between md:block">
                        <span className="font-bold  text-gray-500 md:hidden">
                          Driver Mobile:
                        </span>
                        <span className="flex items-center gap-2">
                          {cab_driver_details?.driverMobile || "-"}
                        </span>
                      </div>
                    </td>
                    <td
                      className="p-3 md:py-4 font-nunito whitespace-nowrap font-semibold hover:underline cursor-pointer block md:table-cell"
                      data-label="Driver Mobile"
                    >
                      <div className="flex justify-between md:block">
                        <span className="font-bold text-gray-500 md:hidden">
                          Status:
                        </span>

                        <span
                          className={`flex items-center capitalize gap-2 ${
                            ride_status === "booked"
                              ? "text-red-600"
                              : ride_status === "free"
                                ? "text-green-600"
                                : "text-gray-400"
                          }`}
                        >
                          {ride_status || "-"}
                        </span>
                      </div>
                    </td>

                    <td
                      className="p-3 md:py-4  font-nunito text-[#15803D] whitespace-nowrap font-semibold hover:underline cursor-pointer block md:table-cell"
                      data-label="Next Available City"
                    >
                      <div className="flex justify-between md:block">
                        <span className="font-bold  text-gray-500 md:hidden">
                          Next Available City:
                        </span>
                        {ride_status === "booked" && (
                          <span className="flex items-center gap-2">
                            {json_cab_avability_details?.city_name}
                          </span>
                        )}
                      </div>
                    </td>

                    <td
                      className="p-3 md:py-4  font-nunito text-[#15803D] whitespace-nowrap font-semibold hover:underline cursor-pointer block md:table-cell"
                      data-label="Next Available Time"
                    >
                      <div className="flex justify-between md:block">
                        <span className="font-bold  text-gray-500 md:hidden">
                          Next Available Time:
                        </span>
                        {ride_status === "booked" && (
                          <>
                            {!(isEditing && editingIndex === idx) && (
                              <div className="flex gap-4 items-center">
                                <span className="flex items-center gap-2">
                                  {
                                    json_cab_avability_details?.Next_avilable_time
                                  }
                                </span>
                                <FaEdit
                                  className="text-blue-500 cursor-pointer"
                                  onClick={() => {
                                    handleEditTime(
                                      id,
                                      idx,
                                      json_cab_avability_details?.Next_avilable_time,
                                    );
                                  }}
                                />
                              </div>
                            )}

                            {isEditing && editingIndex === idx && (
                              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                                <input
                                  type="time"
                                  value={selectedTime}
                                  onChange={(e) =>
                                    setSelectedTime(e.target.value)
                                  }
                                  className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <button
                                  onClick={() => handleEditTimeSubmit(id, idx)}
                                  className="w-8 h-8 flex items-center justify-center rounded-md bg-green-600 hover:bg-green-700 transition"
                                  title="Save"
                                >
                                  <FaCheck className="text-white text-sm" />
                                </button>
                                <button
                                  onClick={() => setIsEditing(false)}
                                  className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-200 hover:bg-gray-300 transition"
                                  title="Cancel"
                                >
                                  <FaTimes className="text-gray-700 text-sm" />
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                    <td
                      className="p-3 md:py-4  font-nunito text-[#15803D] whitespace-nowrap font-semibold hover:underline cursor-pointer block md:table-cell"
                      data-label="Next Available City"
                    >
                      <div className="flex justify-between md:block">
                        <span className="font-bold  text-gray-500 md:hidden">
                          Availability City:
                        </span>
                        {ride_status === "free" && (
                          <span className="flex items-center gap-2">
                            {current_city}
                          </span>
                        )}
                      </div>
                    </td>
                    {ride_status === "free" && (
                      <td
                        className="p-3 md:py-4 font-nunito text-[#15803D] whitespace-nowrap font-semibold hover:underline cursor-pointer block md:table-cell"
                        data-label="Free in Time"
                      >
                        <div className="flex justify-between md:block">
                          <span className="font-bold text-gray-500 md:hidden">
                            Free in Time:
                          </span>

                          <div className="flex gap-3 justify-between items-center">
                            {/* <span className="flex items-center gap-2">
                              {trip_end_time_ago}
                                   {callback_time
        ? `Callback Time: ${new Date(callback_time).toLocaleString()}`
        : trip_end_time_ago} */}
                            <span className="flex flex-col md:flex-row md:items-center md:gap-2">
                              {callback_time ? (
                                <>
                                  <span className="flex flex-col gap-1">
                                    <span>
                                      {new Date(
                                        callback_time,
                                      ).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      })}
                                    </span>

                                    <span>
                                      {new Date(
                                        callback_time,
                                      ).toLocaleTimeString("en-IN", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                      })}
                                    </span>
                                  </span>
                                </>
                              ) : (
                                trip_end_time_ago
                              )}
                            </span>

                            {!(isEditing && editingIndex === idx) && (
                              <button
                                onClick={() => {
                                  setSelectedCabId(id);

                                  const lat =
                                    cab_gps_details_json?.location?.latitude ||
                                    cab_gps_details_json?.alerts?.latitude ||
                                    cab_gps_data?.coordinates?.[1];

                                  const long =
                                    cab_gps_details_json?.location?.longitude ||
                                    cab_gps_details_json?.alerts?.longitude ||
                                    cab_gps_data?.coordinates?.[0];

                                  setSourceCoordinate({ lat, long });

                                  setSelectedItem({
                                    captain:
                                      cab_driver_details?.driverName || "-",
                                    date: new Date()
                                      .toISOString()
                                      .split("T")[0],
                                    time: "",
                                  });

                                  setDate(
                                    new Date().toISOString().split("T")[0],
                                  );
                                  setIsOpen(true);
                                }}
                                className="px-3 py-1 text-xs bg-blue-400 text-white rounded-full hover:bg-blue-600 transition"
                              >
                                Callback
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    )}
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
        {isOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 ">
            <div className="w-full max-w-sm rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-lg ">
              <div className="border-b border-[#E5E5E5] px-5 py-4 flex items-center justify-between">
                <h2 className="text-md font-bold text-[#0A0A0A]">
                  {" "}
                  Schedule Call Back
                </h2>
                <button
                  onClick={() => {
                    // setCitySearch("");
                    // setOpenCityDropdown(false);
                    resetCallbackForm();
                    setIsOpen(false);
                  }}
                >
                  {" "}
                  X{" "}
                </button>
              </div>

              <div className="p-4 space-y-2">
                <div className="space-y-1">
                  <p className=" text-sm text-[#0A0A0A] font-medium">
                    {" "}
                    Call Back City Name
                  </p>

                  <div className="relative w-full">
                    <div
                      className="border border-[#E5E5E5] px-3 py-2 rounded-lg bg-white cursor-pointer"
                      onClick={() => setOpenCityDropdown(!openCityDropdown)}
                    >
                      {selectedCityForCallback || "Select City"}
                    </div>

                    {openCityDropdown && (
                      <div className="absolute left-0 right-0 mt-1 bg-white border rounded-lg shadow-md max-h-56 overflow-y-auto z-50">
                        <div
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setSelectedCityForCallback("");
                            setSelectedCityIdForCallback("");
                            setOpenCityDropdown(false);
                          }}
                        ></div>
                        {/* 
                      {cityList.map((city) => (
                        <div
                          key={city.id}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setSelectedCityForCallback(city.name);
                            setSelectedCityIdForCallback(city.id);
                            setOpenCityDropdown(false);
                          }}
                        >
                          {city.name}
                        </div>
                      ))} */}

                        {/* {loadingCities ? (
  <div className="px-3 py-2 text-gray-500">Loading cities...</div>
) : (
  callbackCityList.map((city) => (
    <div
      key={city.id}
      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
      onClick={() => {
        setSelectedCityForCallback(city.name);
        setSelectedCityIdForCallback(city.id);
        setOpenCityDropdown(false);
      }}
    >
      {city.name}
    </div>
  ))
)} */}

                        {loadingCities ? (
                          <div className="px-3 py-2 text-gray-500 ">
                            Loading cities...
                          </div>
                        ) : (
                          <>
                            <input
                              type="text"
                              placeholder="Search city..."
                              className="w-full px-3 py-2 border-b outline-none"
                              value={citySearch}
                              onChange={(e) => setCitySearch(e.target.value)}
                            />
                            {callbackCityList
                              .filter((city) =>
                                city.name
                                  .toLowerCase()
                                  .includes(citySearch.toLowerCase()),
                              )
                              .map((city) => (
                                <div
                                  key={city.id}
                                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => {
                                    setSelectedCityForCallback(city.name);
                                    setSelectedCityIdForCallback(city.id);
                                    setOpenCityDropdown(false);
                                  }}
                                >
                                  {city.name}
                                </div>
                              ))}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* <div className="space-y-1">
                <div className="flex items-center gap-1"> 
                <p className="text-sm text-[#0A0A0A] font-medium">
                  {" "}
                  Call Back Destination Name
                </p>
                <p className="text-gray-400 text-sm"> (optional)</p>
                </div>
<input
  value={destination}
  onChange={(e) => setDestination(e.target.value)}
  placeholder="Select destination"
  className="border border-[#E5E5E5] w-full rounded-lg p-2"
/>


              </div> */}

                <div className="space-y-1">
                  <p className=" text-sm text-[#0A0A0A] font-medium">
                    {" "}
                    Driver Name
                  </p>
                  <input
                    value={selectedItem?.captain || ""}
                    readOnly
                    className="border border-[#E5E5E5] w-full rounded-lg p-2 bg-[#E5E5E5] text-[#737373] text-sm"
                  />
                </div>

                <div>
                  <p className=" text-sm mb-1 text-[#0A0A0A] font-medium">
                    Call Back Date
                  </p>
                  <div className=" flex  flex-row gap-4">
                    <div className="flex items-center justify-between border border-[#E5E5E5] w-full rounded-lg p-2">
                      <span className="text-sm text-gray-700">
                        {" "}
                        {date || selectedItem?.date}
                      </span>

                      <button
                        type="button"
                        onClick={() => dateRef.current?.showPicker()}
                      >
                        <Calendar size={18} className="text-gray-500" />
                      </button>

                      <input
                        ref={dateRef}
                        type="date"
                        className="absolute opacity-0 pointer-events-none"
                        onChange={(e) => {
                          setDate(e.target.value);
                          setSelectedItem((prev) => ({
                            ...prev,
                            date: e.target.value,
                          }));
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between border border-[#E5E5E5] w-full rounded-lg p-2">
                      <span className="text-sm text-gray-700">
                        {time || selectedItem?.time}
                      </span>

                      <button
                        type="button"
                        onClick={() => timeRef.current?.showPicker()}
                      >
                        <Clock size={18} className="text-gray-500" />
                      </button>

                      <input
                        ref={timeRef}
                        type="time"
                        className="absolute opacity-0 pointer-events-none"
                        onChange={(e) => {
                          setTime(e.target.value);
                          setSelectedItem((prev) => ({
                            ...prev,
                            time: e.target.value,
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[#0A0A0A] font-medium"> Reason </p>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter reason (optional)"
                    className="w-full h-20 rounded-lg border border-[#E5E5E5] bg-[#E5E5E5] p-2 text-sm"
                  />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      // setCitySearch("");
                      // setOpenCityDropdown(false);
                      resetCallbackForm();
                      setIsOpen(false);
                    }}
                    className="text-[#0A0A0A] border border-[#E5E5E5] px-6 py-2 md:text-[14px] rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCallBackSubmit}
                    disabled={submitting}
                    className={`py-2 md:px-4 px-2 rounded-lg md:text-[14px] text-sm text-white 
    ${submitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#267722]"}`}
                  >
                    {submitting ? "Submitting..." : "Confirm Call Back"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default NextAvailableList;
