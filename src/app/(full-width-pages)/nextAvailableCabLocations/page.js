"use client";
import React, { useEffect, useState, useRef } from "react";

import { apiClient } from "@/app/lib/apiClient";
import { toast } from "react-toastify";
import Image from "next/image";
import { useRouter } from "next/navigation";

const NextAvailableCabLocationsMap = () => {
  const olaMapsRef = useRef(null);
  const router = useRouter();
  const ride_status_enum = {
    booked: "booked",
    free: "free",
    rest: "rest",
    breakdown: "breakdown",
    official_duty: "official duty",
    leave: "leave",
  };
  const tabOptions = [
    { label: "Next Available RB Cabs", value: "nextAvailable" },
  ];
  const [tab, setTab] = useState("nextAvailable");
  // const [cabLocations, setCabLocations] = useState([]);
  const [nextAvailableCabLocation, setNextAvailableCabLocation] = useState([]);
  const center = { lat: 25.6209, lng: 85.0441 }; // Default to Patna
  // const [operatorCabLocations, setOperatorCabLocations] = useState([]);
  const [query, setQuery] = useState("");
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);
  let initializing = true;

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

  const handleAddMarker = async () => {
    switch (tab) {
      case "nextAvailable": {
        setTimeout(() => {
          addMarkerHandler([...nextAvailableCabLocation]);
        }, 200);
        return;
      }
    }
  };

  function redirectToDriverPage(id) {
    window.open(`/rbFleetManagement/rbDriver/driverDetails/${id}`, "_blank");
  }
  const getPopUpcontent = (cab) => {
    let driver = null;
    if (cab.driver_details_json || cab.cab_driver_details) {
      driver = cab.driver_details_json || cab.cab_driver_details || false;
    }
    const html = `
            <div class="rounded bg-white shadow text-[black]">
                <div class="flex justify-between items-center border-b gap-4">
                    <div class="flex items-center gap-4 py-2 pl-2">
                        <img src="/images/car.svg" alt="Cab Icon" style="width: 30px; height: 30px;" />
                        <div class='flex flex-col gap-[2px]'>
                            <div class'flex flex-col'>
                                <div class='flex gap-[5px] items-center'>
                                    <span class="font-bold">${
                                      cab.cab_reg ||
                                      cab.registration_no ||
                                      "N/A"
                                    }</span>
                                </div>
                                <div class="text-gray-500"> ${
                                  cab.cab_model || "N/A"
                                } - ${cab.cab_name || "N/A"}</div>
                            </div>
                            ${
                              tab === "nextAvailable"
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
                    <div class="pr-4 flex">
                        <span class='${
                          (cab.cab_avalibility_status === "booked"
                            ? "bg-[#08875D] text-white rounded-full"
                            : "bg-red-500 text-white rounded-full") +
                          " font-semibold px-2.5 py-1.5"
                        }'>${
      cab.cab_avalibility_status === "booked" ? "Booked" : "Unbooked"
    }</span>
                    </div>
                </div>
                ${
                  driver
                    ? `
                <div class="flex justify-between items-center border-b gap-4">
                    <div class="flex items-center gap-4 py-2 pl-2">
                        <span class="font-bold">${
                          driver.full_name || driver.driverName || "N/A"
                        }</span>
                    </div>
                    <div class="pr-4 flex">
                        <span class='font-bold'>${
                          driver.mobile_no || driver?.driverMobile
                        }</span>
                    </div>
                </div>`
                    : ``
                }
                <div class="flex justify-between items-center">
                    <div class="py-2 px-4" >
                        <span class="text-gray-500">Last Ride:</span>
                        <span class="font-bold">${
                          cab.cab_status || "N/A"
                        }</span>
                    </div>
                    <div class="text-[#2F6FED] py-2 id=${
                      driver.id || cab.driver_id
                    }  px-4 cursor-pointer hover:underline">
                        <a href='${
                          tab === "operator"
                            ? `fleetManagement/cabDetailsVerification?id=${cab.id}`
                            : `/driverForm/RodBezDriverWallet/${
                                driver.id || cab.driver_id
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
    console.log(tab);
    if (tab === "operator") {
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
      } else if (
        cab.ride_status === "Probabal" ||
        cab.cab_avalibility_status === "booked"
      ) {
        customMarker.innerHTML += `<img src="/images/car_icon_yellow.svg" alt="Cab Icon" style="width: 100%; height: 100%;">`;
      } else if (
        cab.ride_status === "booked" ||
        cab.cab_avalibility_status === "unbooked"
      ) {
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
    // const carSvg = document.getElementsByClassName(`customMarkerClass`);
    // Array.from(carSvg).forEach(ele => {
    //     ele.addEventListener("click", () => {
    //         const circles = ele.querySelector(".circles");
    //         if (circles.classList.contains("hidden")) {
    //             circles.classList.remove("hidden");
    //         } else {
    //             circles.classList.add("hidden");
    //         }
    //     })
    // });
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
    if (!map || locations.length === 0) return;
    await locations.forEach((cab) => {
      let isCoordinateAvailable =
        cab.cab_gps_data?.coordinates || cab.cab_gps_data?.location.coordinates;
      let coordinates =
        cab.cab_gps_data?.coordinates || cab.cab_gps_data?.location.coordinates;
      if (tab == "nextAvailable") {
        isCoordinateAvailable = true;
        coordinates =
          cab?.json_cab_avability_details?.customer_destination_coordinate?.coordinates
            .sort()
            .reverse() || coordinates;
      }
      if (coordinates && isCoordinateAvailable && olaMapsRef.current) {
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
      let tempArr = [...nextAvailableCabLocation];
      if (!searchQuery) {
        setTimeout(() => {
          handleAddMarker();
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

  const fetchNextAvailableCabLocations = async () => {
    try {
      const response = await apiClient(
        "GET",
        "/cab_management/getListOfNextCabAvailability"
      ); // Update with your API endpoint
      if (response.success) {
        setNextAvailableCabLocation(response.data);
      } else {
        toast.error(
          "Error fetching Next Available RB cab locations: " + response.message
        );
      }
    } catch (error) {
      console.error("Failed to fetch cab locations", error);
    }
  };

  const getCount = (label) => {
    if (label === "nextAvailable") {
      return nextAvailableCabLocation.length || 0;
    }
  };

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
    if (!initializing) return;
    fetchNextAvailableCabLocations();
  }, []);

  useEffect(() => {
    if (query.length > 3) {
      setTimeout(() => {
        searchCabs(query);
      }, 200);
    }
    if (!query.length && !initializing) {
      handleAddMarker();
    }
  }, [query]);

  const handleClick = () => {
    router.push("/");
  };

  useEffect(() => {
    setQuery((prev) => "");
    setTimeout(() => {
      if (nextAvailableCabLocation.length > 0) handleAddMarker();
    }, 200);
  }, [tab, nextAvailableCabLocation]);

  return (
    <div className="w-full px-4">
      {/* <div className="flex">
            </div> */}
      <div className="flex items-center justify-between gap-2">
        <div
          className="bg-white rounded-xl shadow flex justify-between items-center w-full"
          style={{ minHeight: "68px" }}
        >
          <button onClick={handleClick} className="px-3">
            <div className="flex gap-2">
              <div>
                <span className="font-bold text-black  text-2xl">Rod</span>
                <span className="text-2xl font-bold bg-gradient-to-br from-[#FFC403] to-[#e96303] bg-clip-text text-transparent">
                  B
                </span>
                <span className="font-bold text-black  text-2xl">ez</span>
              </div>
            </div>
          </button>
          {tabOptions.map((tabOpt) => (
            <button
              key={tabOpt.value}
              onClick={() => setTab(tabOpt.value)}
              className={`flex items-center w-full justify-center font-medium transition px-2 py-3 mx-2
                                        ${
                                          tab === tabOpt.value
                                            ? "bg-gradient-to-r from-[#2882F6] to-[#1667DD] text-white rounded-[1rem] shadow-lg"
                                            : "bg-transparent text-gray-700"
                                        }
                                    `}
            >
              <span className="mr-2">{tabOpt.label}</span>
              {tab === tabOpt.value ? (
                <span className="bg-white/30 rounded-full px-4 py-2 text-white text-xs font-bold ml-1">
                  {getCount(tabOpt.value)}
                </span>
              ) : (
                <span className="px-4 py-2 text-xs font-semibold ml-1 bg-gradient-to-r from-[#2882F6] to-[#1667DD] text-white rounded-[1rem] shadow-lg">
                  {getCount(tabOpt.value)}
                </span>
              )}
            </button>
          ))}
        </div>
        {/* <div className="flex items-center gap-2">
                    <Image
                        src="/images/location-pin.svg"
                        alt="Map Icon"
                        width={30}
                        height={30}
                    />
                    <h1 className="text-2xl font-bold">Available Cabs</h1>
                </div> */}
        {/* <div className="bg-white rounded shadow-md">
                    <select name="status" id="status" className="focus:outline-none border-0 text-black bg-white rounded p-3" onChange={(e) => {
                        const status = e.target.value;
                        if (status === "all") {
                            addMarkerHandler(cabLocations);
                        } else {
                            const filteredCabs = cabLocations.filter(cab => cab.ride_status === status);
                            // map.destroy();
                            console.log(filteredCabs.map(cab => cab.ride_status), status, "filteredCabs");
                            addMarkerHandler(filteredCabs);
                        }
                    }}>
                        <option className="focus:outline-none" value="all" defaultChecked>All</option>
                        <option className="focus:outline-none" value="free">Free</option>
                        <option className="focus:outline-none" value="booked">On-Ride</option>
                        <option className="focus:outline-none" value="leave">Leave</option>
                    </select>
                </div> */}
      </div>
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
          <div className="absolute flex justify-between gap-4 items-center top-[20px] right-[15px] z-20">
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
  );
};

export default NextAvailableCabLocationsMap;
