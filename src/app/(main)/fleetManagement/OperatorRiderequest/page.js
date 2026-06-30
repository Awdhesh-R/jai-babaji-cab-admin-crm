"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiX } from "react-icons/fi";
import { IoPersonCircleOutline } from "react-icons/io5";
import { apiClient } from "@/app/lib/apiClient";
import { toast } from "react-toastify";
import { FiSearch } from "react-icons/fi";

export default function RidesPage() {
  const observerRef = useRef();
  const [hasMore, setHasMore] = useState(true);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedRide, setSelectedRide] = useState(null);
  const [selectedCab, setSelectedCab] = useState("");
  const [viewRideIndex, setViewRideIndex] = useState(null);
  const [uridInput, setUridInput] = useState("");
  const [unlinkData, setUnlinkData] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [places, setPlaces] = useState([]);
  const [operatorSearch, setOperatorSearch] = useState("");
  const [cancelData, setCancelData] = useState(null);
  const [originalRide, setOriginalRide] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isSelecting, setIsSelecting] = useState(false);
  const [sourcePlaces, setSourcePlaces] = useState([]);
  const [destinationPlaces, setDestinationPlaces] = useState([]);
  const [destinationSearch, setDestinationSearch] = useState("");
  const [operatorList, setOperatorList] = useState([]);
  const [operatorSearchText, setOperatorSearchText] = useState("");
  const [showOperatorDropdown, setShowOperatorDropdown] = useState(false);
  const [cabList, setCabList] = useState([]);
  const [showCabDropdown, setShowCabDropdown] = useState(false);
  const cabDropdownRef = useRef(null);

  const initialRideState = {
    operator_id: "",
    source_name: "",
    source_address: "",
    source_lat: "",
    source_lng: "",
    destination_name: "",
    destination_address: "",
    destination_lat: "",
    destination_lng: "",
    travelDate: "",
    travelTime: "",
    selectedCabs: [],
  };
  const [newRide, setNewRide] = useState(initialRideState);

  const router = useRouter();

  const fetchOperatorRequests = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const response = await apiClient(
        "GET",
        `/operator-request/list/${pageNumber}?limit=100&`,
      );

      const newData = (response?.data || []).map((ride) => ({
        ...ride,
        request_cabs: ride.request_cabs.map((cab) => ({
          ...cab,
          isConnected: !!cab.urid,
        })),
      }));

      setRides((prev) => (pageNumber === 1 ? newData : [...prev, ...newData]));
      if (newData.length < 10) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperatorRequests(page);
  }, [page]);

  const searchPlace = async (query, type) => {
    try {
      if (!query || query.trim().length < 3) return;

      const payload = {
        placeName: query.trim(),
      };

      const response = await apiClient(
        "POST",
        "/place/search-place",
        payload,
        {},
        false,
      );

      if (response?.success) {
        if (type === "source") {
          setSourcePlaces(response.data || []);
        } else {
          setDestinationPlaces(response.data || []);
        }
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleCancel = async (index) => {
    try {
      const ride = rides[index];

      const payload = {
        operator_request_id: ride.operator_request_id,
      };

      const response = await apiClient(
        "POST",
        "/operator-request/cancel",
        payload,
      );

      console.log("Cancel Response:", response);

      fetchOperatorRequests(page);
    } catch (error) {
      console.error("Cancel API Error:", error);
    }
  };

  const handleConnect = (index) => {
    setOriginalRide(JSON.parse(JSON.stringify(rides[index])));
    setSelectedRide(index);
  };

  const handleConnectRequest = async () => {
    try {
      const ride = rides[selectedRide];

      const selectedCabs = ride.request_cabs
        .filter((cab) => cab.urid && cab.urid.trim() !== "")
        .map((cab) => ({
          operator_request_cab_id: Number(cab.operator_request_cab_id),
          urid: cab.urid,
        }));

      if (selectedCabs.length === 0) {
        alert("Please enter at least one URID");
        return;
      }

      const payload = {
        operator_request_id: Number(ride.operator_request_id),
        cabs: selectedCabs,
      };

      const response = await apiClient(
        "POST",
        "/operator-request/connect",
        payload,
      );

      if (!response?.success) {
        toast.error(response?.message);
        return;
      }

      toast.success("Connected successfully");

      fetchOperatorRequests(page);
      setSelectedRide(null);
    } catch (error) {
      console.error("Connect API Error:", error);
    }
  };

  const searchOperator = async (query) => {
    try {
      if (!query || query.trim().length < 2) {
        setOperatorList([]);
        return;
      }

      const response = await apiClient(
        "GET",
        `/operator-request/operators?search=${query.trim()}&limit=2000`,
      );

      if (response?.success) {
        setOperatorList(response.data || []);
        setShowOperatorDropdown(true);
      } else {
        setOperatorList([]);
      }
    } catch (error) {
      console.error("Operator Search Error:", error);
    }
  };

  useEffect(() => {
    searchOperator();
  }, []);

  const fetchCabsByFleetId = async (fleetId) => {
    try {
      const response = await apiClient(
        "GET",
        `/fleet/getTotalCabsList-by-fleetId/${fleetId}`,
      );
      if (response?.success) {
        setCabList(response.data || []);
      }
    } catch (error) {
      console.error("Cab API Error:", error);
    }
  };

  const filteredOperators = operatorList.filter((op) =>
    op.full_name?.toLowerCase().includes(operatorSearchText.toLowerCase()),
  );

  const filteredRides = rides.filter((ride) => {
    const matchesSearch = (ride.operator?.full_name || "")
      .toLowerCase()
      .includes(operatorSearch.toLowerCase());

    const matchesStatus =
      statusFilter === "all"
        ? true
        : ride.status?.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cabDropdownRef.current &&
        !cabDropdownRef.current.contains(event.target)
      ) {
        setShowCabDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCreateRide = async () => {
    try {
      const payload = {
        operator_id: Number(newRide.operator_id),
        source_name: newRide.source_name,
        source_address: newRide.source_address,
        source_lat: Number(newRide.source_lat),
        source_lng: Number(newRide.source_lng),
        destination_name: newRide.destination_name,
        destination_address: newRide.destination_address,
        destination_lat: Number(newRide.destination_lat),
        destination_lng: Number(newRide.destination_lng),
        travelDate: newRide.travelDate,
        travelTime: newRide.travelTime,
        cab_ids: newRide.selectedCabs.map(Number),
      };
      const response = await apiClient(
        "POST",
        "/operator-request/create",
        payload,
      );

      if (!response?.success) {
        toast.error(response?.message);
        return;
      }

      toast.success("Ride created successfully");

      setNewRide(initialRideState);
      setSearchText("");
      setDestinationSearch("");
      setOperatorSearchText("");
      setCabList([]);
      setShowCabDropdown(false);

      setShowCreateModal(false);
      fetchOperatorRequests(1);
      setShowCreateModal(false);
      fetchOperatorRequests(1);
    } catch (error) {
      console.error("Create Ride Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <div className=" mb-4 gap-4">
          <div className=" flex justify-between">
            <h2 className="text-2xl font-bold mb-6">
              Operator Ride Request List
            </h2>

            <button
              onClick={() => setShowCreateModal(true)}
              className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Create Ride Request
            </button>
          </div>

          <div className="flex gap-3 mt-5 justify-between">
            <div className="relative w-96">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                placeholder="Search operator..."
                value={operatorSearch}
                onChange={(e) => setOperatorSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border bg-gray-50 rounded-xl text-sm 
               focus:outline-none focus:ring-2 focus:ring-blue-400 
               transition"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border px-3 py-2 rounded-lg text-sm"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancalled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4 text-left">Operator</th>
                <th className="p-4 text-left">Source</th>
                <th className="p-4 text-left">Destination</th>
                <th className="p-4 text-left">Schedule Time</th>
                <th className="p-4 text-left">Connected Cabs</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRides.map((ride, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 text-blue-600 font-medium cursor-pointer">
                    {ride.operator?.full_name}
                  </td>
                  <td>
                    <div className="overflow-hidden">
                      <p className="font-medium text-sm truncate">
                        {ride.source_name}
                      </p>
                      <p
                        className="text-xs text-gray-500 truncate"
                        title={ride.source_address}
                      >
                        {ride.source_address?.slice(0, 40)}
                        {ride.source_address?.length > 40 && "..."}
                      </p>
                    </div>
                  </td>
                  <td>
                    <p className="font-medium text-sm truncate">
                      {ride.destination_name}
                    </p>
                    <p
                      className="text-xs text-gray-500"
                      title={ride.destination_address}
                    >
                      {ride.destination_address?.slice(0, 40)}
                      {ride.destination_address?.length > 40 && "..."}
                    </p>
                  </td>
                  <td className="p-4">{ride?.date_and_time}</td>
                  <td className="p-4">
                    <span
                      onClick={() => setViewRideIndex(index)}
                      className=" px-3 py-1 rounded-full text-xs font-semibold cursor-pointer"
                    >
                      {ride.connected_cabs}
                    </span>
                  </td>

                  <td className="p-4 capitalize">{ride.status}</td>
                  <td className="p-4 text-center">
                    {["pending", "in-progress"].includes(ride.status) && (
                      <div className="flex gap-2 justify-center">
                        {ride.connected_cabs?.startsWith("0/") && (
                          <button
                            onClick={() => setCancelData({ index })}
                            className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-red-200 transition"
                          >
                            Cancel
                          </button>
                        )}

                        <button
                          onClick={() => handleConnect(index)}
                          className="bg-green-100 text-green-600 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-green-200 transition"
                        >
                          Connect
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            ref={observerRef}
            className="h-10 flex justify-center items-center"
          >
            {loading && <p>Loading...</p>}
          </div>
        </div>
      </div>
      {selectedRide !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {rides[selectedRide].operator?.full_name}
            </h3>
            <div className="space-y-3">
              {rides[selectedRide].request_cabs?.map((cab, i) => (
                <div
                  key={i}
                  className="flex justify-between items-start border p-4 rounded-xl hover:shadow-sm transition"
                >
                  <div className="flex flex-col">
                    <p className="font-semibold text-sm">
                      {cab?.cab?.registration_no}
                    </p>
                    <p className="text-xs text-gray-500">
                      {cab?.cab?.base_price?.cab_type} •{" "}
                      {cab?.cab?.cab_make?.make_model}
                    </p>
                    <div className="mt-1 text-xs text-gray-600 flex items-start gap-3">
                      <IoPersonCircleOutline
                        size={30}
                        className="text-gray-500"
                      />

                      <div>
                        <p className="font-medium">
                          {cab?.cab?.driver?.full_name}
                        </p>
                        <p>{cab?.cab?.driver?.mobile_no}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="Enter URID"
                      value={cab.urid || ""}
                      disabled={cab.isConnected}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");

                        setRides((prev) =>
                          prev.map((ride, rideIndex) => {
                            if (rideIndex !== selectedRide) return ride;

                            return {
                              ...ride,
                              request_cabs: ride.request_cabs.map(
                                (cabItem, cabIndex) => {
                                  if (cabIndex !== i) return cabItem;
                                  return {
                                    ...cabItem,
                                    urid: value,
                                    isConnected: false,
                                  };
                                },
                              ),
                            };
                          }),
                        );
                      }}
                      className={`border rounded-lg p-2 text-sm w-78 ${
                        cab.isConnected ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                    />
                    {cab.isConnected && (
                      <FiX
                        onClick={async () => {
                          try {
                            const ride = rides[selectedRide];

                            const payload = {
                              operator_request_id: Number(
                                ride.operator_request_id,
                              ),
                              operator_request_cab_ids: [
                                Number(cab.operator_request_cab_id),
                              ],
                            };

                            const response = await apiClient(
                              "POST",
                              "/operator-request/disconnect",
                              payload,
                            );

                            if (!response?.success) {
                              toast.error(response?.message);
                              return;
                            }

                            toast.success("Cab disconnected successfully");

                            await fetchOperatorRequests(page);
                            setSelectedRide(null);
                          } catch (error) {
                            toast.error("Something went wrong");
                          }
                        }}
                        className="text-red-600 cursor-pointer hover:text-red-800"
                        size={18}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  if (originalRide !== null) {
                    const updated = [...rides];
                    updated[selectedRide] = originalRide;
                    setRides(updated);
                  }

                  setSelectedRide(null);
                }}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Close
              </button>

              <button
                onClick={handleConnectRequest}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      )}
      {viewRideIndex !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {rides[viewRideIndex].operator?.full_name} - Connected Cabs
            </h3>

            {rides[viewRideIndex].request_cabs?.filter((c) => c.urid).length ===
            0 ? (
              <p className="text-sm text-gray-500">No cab connected yet.</p>
            ) : (
              <div className="space-y-3">
                {rides[viewRideIndex].request_cabs
                  .filter((c) => c.urid)
                  .map((cab, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center border p-3 rounded-lg"
                    >
                      <div className="flex flex-col">
                        <p className="font-semibold text-sm">
                          {cab?.cab?.registration_no}
                        </p>

                        <p className="text-xs text-gray-500">
                          {cab?.cab?.base_price?.cab_type} •{" "}
                          {cab?.cab?.cab_make?.make_model}
                        </p>

                        <div className="mt-1 text-xs text-gray-600 flex items-start gap-3">
                          <IoPersonCircleOutline
                            size={30}
                            className="text-gray-500"
                          />
                          <div>
                            <p className="font-medium">
                              {cab?.cab?.driver?.full_name}
                            </p>
                            <p>{cab?.cab?.driver?.mobile_no}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <a
                          href={`/ridesManagement/details?urid=${cab.urid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gray-100 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
                        >
                          {cab.urid}
                        </a>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setViewRideIndex(null)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {unlinkData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Unlink</h3>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to unlink this cab?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setUnlinkData(null)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                No
              </button>

              <button
                onClick={async () => {
                  try {
                    const { rideIndex, cabIndex } = unlinkData;

                    const ride = rides[rideIndex];
                    const cab = ride.request_cabs[cabIndex];

                    const payload = {
                      operator_request_id: Number(ride.operator_request_id),
                      operator_request_cab_ids: [
                        Number(cab.operator_request_cab_id),
                      ],
                    };

                    const response = await apiClient(
                      "POST",
                      "/operator-request/disconnect",
                      payload,
                    );

                    if (!response?.success) {
                      toast.error(response?.message || "Failed to disconnect");
                      return;
                    }

                    toast.success("Cab disconnected successfully");

                    const updated = [...rides];
                    updated[rideIndex].request_cabs =
                      response.data.request_cabs;
                    updated[rideIndex].connected_cabs =
                      response.data.request_cabs.filter((c) => c.urid).length +
                      "/" +
                      response.data.request_cabs.length;

                    setRides(updated);
                    setUnlinkData(null);
                  } catch (error) {
                    console.error("Disconnect API Error:", error);
                    toast.error("Something went wrong");
                  }
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Yes, Unlink
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Create Ride Request</h3>

            <div className="space-y-3">
              <div className="flex justify-between gap-5">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Source "
                    className="border p-2 rounded-lg w-full"
                    value={searchText}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSearchText(value);
                      searchPlace(value, "source");
                    }}
                  />
                  {sourcePlaces.length > 0 && (
                    <div className="absolute top-full left-0 w-full bg-white border rounded-lg shadow z-50">
                      {sourcePlaces.map((place, i) => (
                        <div
                          key={i}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setSearchText(place.name);

                            setNewRide((prev) => ({
                              ...prev,
                              source_name: place.name,
                              source_address: place.address,
                              source_lat: place.lat,
                              source_lng: place.lng,
                            }));

                            setSourcePlaces([]);
                          }}
                        >
                          <p className="text-sm font-medium">{place.name}</p>
                          <p className="text-xs text-gray-500 truncate">
                            {place.address}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Destination"
                    className="w-full border p-2 rounded-lg"
                    value={destinationSearch}
                    onChange={(e) => {
                      const value = e.target.value;
                      setDestinationSearch(value);
                      searchPlace(value, "destination");
                    }}
                  />

                  {destinationPlaces.length > 0 && (
                    <div className="absolute top-full left-0 w-full bg-white border rounded-lg shadow z-50">
                      {destinationPlaces.map((place, i) => (
                        <div
                          key={i}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setDestinationSearch(place.name);

                            setNewRide((prev) => ({
                              ...prev,
                              destination_name: place.name,
                              destination_address: place.address,
                              destination_lat: place.lat,
                              destination_lng: place.lng,
                            }));

                            setDestinationPlaces([]);
                          }}
                        >
                          <p className="text-sm font-medium">{place.name}</p>
                          <p className="text-xs text-gray-500 truncate">
                            {place.address}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600">Travel Date</label>
                  <input
                    type="date"
                    className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={(e) =>
                      setNewRide((prev) => ({
                        ...prev,
                        travelDate: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Travel Time</label>
                  <input
                    type="time"
                    className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={(e) =>
                      setNewRide((prev) => ({
                        ...prev,
                        travelTime: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Operator Name"
                  className="w-full border p-2 rounded-lg"
                  value={operatorSearchText}
                  onChange={(e) => {
                    const value = e.target.value;
                    setOperatorSearchText(value);
                    searchOperator(value);
                  }}
                />

                {showOperatorDropdown && operatorList.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-white border rounded-lg shadow z-50 max-h-60 overflow-y-auto">
                    {operatorList.map((op) => (
                      <div
                        key={op.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setOperatorSearchText(op.full_name);
                          setNewRide({
                            ...newRide,
                            operator_id: op.id,
                          });

                          fetchCabsByFleetId(op.id);
                          setShowOperatorDropdown(false);
                        }}
                      >
                        {op.full_name} - {op?.mobile_no}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative w-full" ref={cabDropdownRef}>
                <input
                  type="text"
                  placeholder="Select Cabs"
                  className="w-full border p-2 rounded-lg"
                  value={
                    newRide.selectedCabs.length > 0
                      ? `${newRide.selectedCabs.length} Cab Selected`
                      : ""
                  }
                  readOnly
                  onClick={() => setShowCabDropdown(!showCabDropdown)}
                />

                {/* {showCabDropdown && cabList.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-white border rounded-lg shadow z-50 max-h-60 overflow-y-auto">
                    {cabList.map((cab) => {
                      const isSelected = newRide.selectedCabs.includes(cab.id);

                      return (
                        <div
                          key={cab.id}
                          className="flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            if (isSelected) {
                              setNewRide({
                                ...newRide,
                                selectedCabs: newRide.selectedCabs.filter(
                                  (id) => id !== cab.id,
                                ),
                              });
                            } else {
                              setNewRide({
                                ...newRide,
                                selectedCabs: [...newRide.selectedCabs, cab.id],
                              });
                            }
                          }}
                        >
                          <span>{cab.registration_no}</span>

                          <div
                            className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                              isSelected
                                ? "bg-green-500 border-green-500 text-white"
                                : "border-gray-400"
                            }`}
                          >
                            {isSelected && "✓"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )} */}
                {showCabDropdown && (
                  <div className="absolute top-full left-0 w-full bg-white border rounded-lg shadow z-50 max-h-60 overflow-y-auto">
                    {!newRide.operator_id ? (
                      <div className="p-3 text-sm text-gray-500 text-center">
                        Select operator first
                      </div>
                    ) : cabList.length === 0 ? (
                      <div className="p-3 text-sm text-gray-500 text-center">
                        No cabs found
                      </div>
                    ) : (
                      cabList.map((cab) => {
                        const isSelected = newRide.selectedCabs.includes(
                          cab.id,
                        );

                        return (
                          <div
                            key={cab.id}
                            className="flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              if (isSelected) {
                                setNewRide({
                                  ...newRide,
                                  selectedCabs: newRide.selectedCabs.filter(
                                    (id) => id !== cab.id,
                                  ),
                                });
                              } else {
                                setNewRide({
                                  ...newRide,
                                  selectedCabs: [
                                    ...newRide.selectedCabs,
                                    cab.id,
                                  ],
                                });
                              }
                            }}
                          >
                            <span>{cab.registration_no}</span>

                            <div
                              className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                                isSelected
                                  ? "bg-green-500 border-green-500 text-white"
                                  : "border-gray-400"
                              }`}
                            >
                              {isSelected && "✓"}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setNewRide(initialRideState);
                  setSearchText("");
                  setDestinationSearch("");
                  setOperatorSearchText("");
                  setCabList([]);
                  setShowCreateModal(false);
                }}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateRide}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {cancelData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Cancel</h3>

            <p className="text-sm text-gray-600 mb-6">
              Do you want to cancel this ride request?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCancelData(null)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                No
              </button>

              <button
                onClick={async () => {
                  await handleCancel(cancelData.index);
                  setCancelData(null);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
