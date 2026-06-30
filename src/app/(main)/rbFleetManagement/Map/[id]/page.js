"use client";
import { apiClient } from "@/app/lib/apiClient";
import moment from "moment";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
const center = { lat: 25.6167, lng: 85.1411 }; // Danapur/Patna for demo

export default function CabDashboardMap() {
  const { id: urid } = useParams();
  const router = useRouter();

  const olaMapsRef = useRef(null);
  const [query, setQuery] = useState("");
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);
  let initializing = true;
  const cabList = JSON.parse(localStorage.getItem("cabList") || "[]");
  const source = localStorage.getItem("cab_source");
  const distance = localStorage.getItem("radius");

  const handleSendNotification = async (selectedRideId) => {
    try {
      let tempArr = cabList.filter((cab) => selectedRideId == cab.id);
      const payload = {
        urid,
        type: "schedule",
        cabs: tempArr.map((cab) => ({
          id: cab.id,
          driver_id: cab.driver_id,
          distance_km: cab.distance_km,
        })),
      };
      console.log(payload);
      const response = await apiClient(
        "POST",
        "/ride_management/send-booking-request",
        payload
      );
      if (response.success || response.status) {
        toast.success(response.message);
        router.refresh();
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const initMap = () => {
    if (!mapRef.current && olaMapsRef.current) {
      console.log("in initMap");
      mapRef.current = null;
      const map = olaMapsRef.current?.init({
        container: "map",
        center: [center.lng, center.lat],
        zoom: 12,
        mode: "2d",
        width: "100%",
      });
      mapRef.current = map;
    }
    return mapRef.current;
  };

  const getPopUpcontent = (cab) => {
    let driver = null;
    if (cab.driver_id) {
      driver = true;
    }
    const html = `
            <div class="rounded bg-white shadow text-[black]">
                <div class="flex justify-between items-center border-b gap-4">
                    <div class="flex items-center gap-4 py-2 pl-2">
                        <img src="/images/car.svg" alt="Cab Icon" style="width: 30px; height: 30px;" />
                        <div class='flex flex-col gap-[2px]'>
                        <div class'flex flex-col'>
                            <div class='flex gap-[5px] items-center'>
                                <span class='rounded-full w-2 h-2 ${
                                  cab.is_local === "yes" || cab.localOn
                                    ? "bg-green-600"
                                    : "bg-red-600"
                                }'>&nbsp;</span> 
                                <span class="font-bold">${
                                  cab.cab_reg || cab.registration_no || "N/A"
                                }</span>
                            </div>
                                <div class="text-gray-500"> ${
                                  cab.cab_model || "N/A"
                                } - ${cab.cab_name || "N/A"}</div>
                        </div>
                            ${
                              source === "ownCabs" &&
                              cab.json_cab_avability_details
                                ? `
                                <div class="flex flex-col">
                                    <span class="font-bold"> City: ${
                                      cab.json_cab_avability_details
                                        ?.city_name || "N/A"
                                    }</span>
                                    <span class="font-bold"> Time: ${
                                      cab.json_cab_avability_details
                                        ?.Next_avilable_time || "N/A"
                                    } </span>
                                </div>
                                `
                                : ``
                            }
                        </div>
                    </div>
                    <div class="pr-4 flex flex-col gap-4 justify-end items-end">
                        <button class='bg-yellow-500 text-black px-3 py-1 border-0 rounded-lg' id='${
                          cab.id
                        }'>Notify</button>
                        <span class='${
                          (cab.ride_status === "free"
                            ? "bg-yellow-500 text-black rounded-lg"
                            : cab.ride_status === "booked"
                            ? "bg-[#08875D] text-white rounded-full"
                            : "bg-red-500 text-white rounded-full") +
                          " font-semibold px-2.5 py-1.5"
                        }'>${
      cab.ride_status === "free"
        ? "Free"
        : cab.ride_status === "booked"
        ? "On-Ride..."
        : "Leave"
    }</span>
                    </div>
                </div>
                ${
                  driver
                    ? `
                <div class="flex justify-between items-center border-b gap-4">
                    <div class="flex items-center gap-4 py-2 pl-2">
                        <span class="font-bold">${
                          cab["driver.driverName"] || "N/A"
                        }</span>
                    </div>
                    <div class="pr-4 flex">
                        <span class='font-bold'>${
                          cab["driver.driverMobile"] ||
                          driver?.driverMobile ||
                          "N/A"
                        }</span>
                    </div>
                </div>`
                    : ``
                }
                <div class="flex justify-between items-center">
                    <div class="py-2 px-4" >
                        <span class="text-gray-500">Last Ride:</span>
                        <span class="font-bold">${
                          cab.latestBooking?.trip_end_time
                            ? moment(cab?.latestBooking?.trip_end_time).format(
                                "DD-MM-YYYY hh:mm A"
                              )
                            : "N/A"
                        }</span>
                    </div>
                    <div class="text-[#2F6FED] py-2 id=${
                      cab["driver.id"] || cab.driver_id
                    }  px-4 cursor-pointer hover:underline">
                        <a href='${
                          source === "Operator"
                            ? `fleetManagement/cabDetailsVerification?id=${cab.id}`
                            : `/driverForm/RodBezDriverWallet/${
                                cab.driver_id || cab["driver.id"]
                              }`
                        }' target="_blank">View more Details...</a>
                    </div>
                </div>
            </div>`;
    return html;
  };

  const getCustomMarker = (cab) => {
    var customMarker = document.createElement("div");
    customMarker.classList.add("customMarkerClass");
    customMarker.id = cab.id;
    customMarker.innerHTML = "";

    if (source === "Operator") {
      if (cab.booked_status === "booked") {
        customMarker.innerHTML += `<img src="/images/car_icon_yellow.svg" alt="Cab Icon" style="width: 100%; height: 100%;">`;
      } else if (cab.cab_status !== "verified") {
        customMarker.innerHTML += `<img src="/images/car_icon_orange.svg" alt="Cab Icon" style="width: 100%; height: 100%;">`;
      } else if (cab.localOn || cab.interCityOn) {
        customMarker.innerHTML += `<img src="/images/car_icon_green.svg" alt="Cab Icon" style="width: 100%; height: 100%;">`;
      } else {
        customMarker.innerHTML += `<img src="/images/car_icon.svg" alt="Cab Icon" style="width: 100%; height: 100%;">`;
      }
    } else {
      if (cab.ride_status === "free" || cab.ride_status === "rest") {
        customMarker.innerHTML += `<img src="/images/car_icon_green.svg" alt="Cab Icon" style="width: 100%; height: 100%;">`;
      } else if (cab.ride_status === "Probabal") {
        customMarker.innerHTML += `<img src="/images/car_icon_yellow.svg" alt="Cab Icon" style="width: 100%; height: 100%;">`;
      } else if (cab.ride_status === "booked") {
        customMarker.innerHTML += `<img src="/images/car_icon.svg" alt="Cab Icon" style="width: 100%; height: 100%;">`;
      } else {
        customMarker.innerHTML += `<img src="/images/car_icon_orange.svg" alt="Cab Icon" style="width: 100%; height: 100%;">`;
      }
    }
    customMarker.style.width = "5% !important";
    customMarker.style.height = "5% !important";
    customMarker.innerHTML += `<div class="circles hidden">&nbsp;</div>`;
    `<div class="circles hidden">&nbsp;</div>`;
    customMarker.title = `Cab Number: ${
      cab.cab_reg || cab.registration_no
    }\nStatus: ${cab.cab_status || "N/A"}`;
    return customMarker;
  };

  const addMarkerHandler = async (locations) => {
    let map = null;
    // mapRef.current = null;
    try {
      map = initMap();
    } catch (error) {
      setTimeout(() => {
        map = initMap();
      }, 1000);
    }
    let markerArr = [...markers];
    if (markerArr.length > 0) {
      await markerArr.forEach((marker) => marker.remove());
      markerArr = [];
      setMarkers([]);
    }
    if (!map || locations?.length === 0) return;
    await locations?.forEach((cab) => {
      console.log(cab);
      const isCoordinateAvailable =
        cab.cab_gps_data?.coordinates || cab.cab_gps_data?.location.coordinates;
      let coordinates =
        cab.cab_gps_data?.coordinates || cab.cab_gps_data?.location.coordinates;

      if (cab.cab_gps_data && isCoordinateAvailable && olaMapsRef.current) {
        const popup = olaMapsRef.current
          .addPopup({ closeButton: false, offset: [0, -50] })
          .setHTML(getPopUpcontent(cab));

        const marker = olaMapsRef.current
          .addMarker({ element: getCustomMarker(cab) })
          .setLngLat(coordinates)
          .setPopup(popup)
          .addTo(map);
        initializing = false;
        markerArr.push(marker);
      }
    });
    setMarkers(markerArr);
  };

  const searchCabs = async (searchQuery) => {
    try {
      const list = JSON.parse(localStorage.getItem("cabList"));
      console.log(list);
      // setCabList(prev => [...list]);
      let tempArr = [...list];
      if (!searchQuery) {
        setTimeout(() => {
          handleAddMarker(list);
        }, 200);
        return;
      }
      const filteredCabs = tempArr.filter((cab) => {
        const regNo = cab.registration_no?.toLowerCase() || "";
        const cabReg = cab.cab_reg?.toLowerCase() || "";
        const driverName =
          cab.driver_details_json?.full_name?.toLowerCase() || "";
        const query = searchQuery.toLowerCase();

        // Match full or partial reg numbers
        if (
          regNo.includes(query) ||
          cabReg.includes(query) ||
          driverName.includes(query)
        ) {
          return true;
        }

        // Match against last 4 digits of cab_reg
        if (
          (cabReg && cabReg.slice(-4) === query) ||
          (regNo && regNo.slice(-4) === query)
        ) {
          return true;
        }

        return false;
      });
      if (filteredCabs.length > 0) {
        setTimeout(() => {
          addMarkerHandler(filteredCabs);
        }, 200);
      } else {
        addMarkerHandler([]);
      }
    } catch (error) {
      console.error("Failed to search cabs", error);
    }
  };
  const handleAddMarker = async () => {
    setTimeout(() => {
      const list = JSON.parse(localStorage.getItem("cabList"));
      console.log(list);
      // setCabList(prev => [...list]);
      addMarkerHandler(list);
    }, 200);
  };
  const linkEventListener = () => {
    document.getElementById("map")?.addEventListener("click", function (e) {
      if (e.target.tagName === "BUTTON" && e.target.id) {
        handleSendNotification(e.target.id);
      }
    });
  };

  // Initialize OlaMaps in useEffect to prevent SSR issues
  useEffect(() => {
    if (typeof window === "undefined") return;

    import("olamaps-web-sdk")
      .then((module) => {
        const { OlaMaps } = module;
        olaMapsRef.current = new OlaMaps({
          apiKey: [
            process.env.OLA_KEY || "OYZHLli2k5i9JrcOqveiL2wG5dxJ0A08blmHWFSa",
          ],
          style:
            "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
        });
      })
      .catch((error) => {
        console.error("Error loading OlaMaps module:", error);
      });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const list = JSON.parse(localStorage.getItem("cabList") || "[]");
    handleAddMarker();
    linkEventListener();
  }, []);
  useEffect(() => {
    if (query.length > 3) {
      setTimeout(() => {
        searchCabs(query);
      }, 200);
    } else if (!query || query?.length === 0) {
      const list = JSON.parse(localStorage.getItem("cabList"));
      console.log(list);
      // setCabList(prev => [...list]);
      setTimeout(() => {
        handleAddMarker();
      }, 400);
    }
  }, [query]);

  const handleClick = () => {
    router.push("/");
  };
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center px-2 py-6">
      {/* Map Section */}
      <div className="rounded-2xl shadow-lg w-full overflow-hidden relative h-[100vh]">
        {/* <button onClick={handleClick} className="px-3 py-1">
        <div className="flex gap-2">
          <div>
            <span className="font-bold text-black  text-2xl">
              Rod
            </span>
            <span className="text-2xl font-bold bg-gradient-to-br from-[#FFC403] to-[#e96303] bg-clip-text text-transparent">
              B
            </span>
            <span className="font-bold text-black  text-2xl">
              ez
            </span>
          </div>
        </div>
      </button> */}
        {/* Map Container */}

        <div className="overflow-auto max-h-[90vh]">
          <div
            id="map"
            style={{
              width: "100%",
              height: "90vh",
              borderRadius: "8px",
              padding: "10px",
              position: "relative",
            }}
          >
            <div className="absolute flex flex-col justify-end gap-4 top-[20px] right-[15px] z-20">
              <div className="flex items-center gap-4 text-lg">
                <span className="text-black font-medium ml-1 capitalize">
                  {source == "ownCabs" ? "RodBez" : "Market"} Cabs
                </span>
                <span className="text-blue-600 font-medium ml-1 capitalize">
                  {cabList?.[0]?.cab_name} within {distance} Km
                </span>
              </div>

              <div className="rounded bg-white text-black border-[#40404080] flex gap-1 items-center shadow-md">
                <Image
                  src="/images/search-icon.svg"
                  alt="Search Icon"
                  width={30}
                  height={30}
                />
                <input
                  type="text"
                  placeholder="Search Cab..."
                  className="p-2 bg-white text-[1rem] border-0 focus:outline-none"
                  name="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
