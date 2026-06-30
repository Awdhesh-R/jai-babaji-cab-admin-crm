"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/app/lib/apiClient";
import { toast } from "react-toastify";

/**
 * CabLocation.jsx (Next.js client)
 *
 * - CNG pumps: always visible from API.
 * - Cabs: NOT visible by default.
 * - When you search cab number:
 *    → Finds that cab from /rb_cabs/getAllRbCabsWithDriver
 *    → Shows only that cab marker on map
 *    → Centers map on that cab
 *    → Click cab = 40km circle + nearby CNG markers
 */

/* ---------- CONFIG ---------- */
const center = { lat: 25.5941, lng: 85.1376 };

/* ---------- GEO HELPERS ---------- */
// Haversine distance (km)
const getDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Destination point: given start lat/lng, bearing in degrees, distance (km) -> lat/lng
const destinationPoint = (lat, lng, bearingDeg, distanceKm) => {
  const R = 6371; // km
  const bearing = (bearingDeg * Math.PI) / 180;
  const φ1 = (lat * Math.PI) / 180;
  const λ1 = (lng * Math.PI) / 180;
  const δ = distanceKm / R; // angular distance
  const φ2 = Math.asin(
    Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(bearing)
  );
  const λ2 =
    λ1 +
    Math.atan2(
      Math.sin(bearing) * Math.sin(δ) * Math.cos(φ1),
      Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2)
    );
  return { lat: (φ2 * 180) / Math.PI, lng: (λ2 * 180) / Math.PI };
};

// create GeoJSON polygon circle (approx)
const createCircleGeoJSON = (centerLat, centerLng, radiusKm, points = 64) => {
  const coords = [];
  for (let i = 0; i < points; i++) {
    const bearing = (i * 360) / points;
    const p = destinationPoint(centerLat, centerLng, bearing, radiusKm);
    coords.push([p.lng, p.lat]);
  }
  coords.push(coords[0]);
  return {
    type: "Feature",
    geometry: { type: "Polygon", coordinates: [coords] },
  };
};

const formatDistance = (km) => {
  if (km < 1) {
    const m = Math.round((km * 1000) / 50) * 50;
    return `${m} m`;
  } else {
    return `${Math.round(km)} km`;
  }
};

/* ---------- COMPONENT ---------- */
export default function CabLocationClient() {
  const router = useRouter();
  const mapRef = useRef(null);
  const olaMapsRef = useRef(null);

  const [searchValue, setSearchValue] = useState("");
  const [activeCabId, setActiveCabId] = useState(null);
  const [circleCabId, setCircleCabId] = useState(null);

  const [showPopup, setShowPopup] = useState(false);
  const [userData, setUserData] = useState({
    pumpName: "",
    cityId: "",
    lat: "",
    lng: "",
    phone: "",
    status: "active",
  });
  const [errors, setErrors] = useState({});
  const [cngStations, setCngStations] = useState([]);

  // Dynamic cabs from API
  const [cabStations, setCabStations] = useState([]);

  // STATE
  const [pumps, setPumps] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const dropdownRef = useRef(null);

  const setGlobalActiveCab = (id) => {
    setActiveCabId(id);
    window.__ACTIVE_CAB_ID = id ?? null;
  };

  // const validateForm = () => {
  //   const newErrors = {};
  //   if (!userData.pumpName.trim()) newErrors.pumpName = "Pump name required";
  //   if (!userData.cityId.trim()) newErrors.cityId = "City required";
  //   if (!userData.lat.trim()) newErrors.lat = "Latitude required";
  //   if (!userData.lng.trim()) newErrors.lng = "Longitude required";
  //   // if (!userData.phone.trim()) newErrors.phone = "Mobile number required";
  //   if (!userData.status.trim()) newErrors.status = "Status required";
  //   if (userData.phone && !/^\d{10}$/.test(userData.phone))
  //     newErrors.phone = "Enter valid 10-digit number";
  //   if (userData.lat && isNaN(userData.lat))
  //     newErrors.lat = "Latitude must be numeric";
  //   if (userData.lng && isNaN(userData.lng))
  //     newErrors.lng = "Longitude must be numeric";
  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  const validateForm = () => {
  const newErrors = {};

  if ((userData.pumpName || "").trim() === "")
    newErrors.pumpName = "Pump name required";

  if ((userData.cityId || "").trim() === "")
    newErrors.cityId = "City required";

  if ((userData.lat || "").trim() === "")
    newErrors.lat = "Latitude required";

  if ((userData.lng || "").trim() === "")
    newErrors.lng = "Longitude required";

if (!userData.status) {
  newErrors.status = "Status required";
}


  const phone = (userData.phone || "").trim();

  if (phone !== "" && !/^\d{10}$/.test(phone)) {
    newErrors.phone = "Enter valid 10-digit number";
  }

  if (userData.lat && isNaN(userData.lat))
    newErrors.lat = "Latitude must be numeric";

  if (userData.lng && isNaN(userData.lng))
    newErrors.lng = "Longitude must be numeric";

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const handleSubmit = async () => {
    if (!validateForm()) return;

    const body = {
      pump_name: userData.pumpName.trim(),
      city_name: userData.cityId.trim(),
      // pump_mobile_number: userData.phone.trim(),
      // pump_status: "active",
      pump_status: userData.status,

      pump_coordinate: {
        type: "Point",
        coordinates: [Number(userData.lng), Number(userData.lat)],
      },
    };
//     if (userData.phone.trim()) {
//   body.pump_mobile_number = userData.phone.trim();
// }
const phone = (userData.phone || "").trim();
if (phone !== "") {
  body.pump_mobile_number = phone;
}


    try {
      const res = await apiClient("POST", "/rb_pump/create-rb-pump", body);

      console.log("Pump create response:", res);

      if (res?.success === false || res?.status === false) {
        const errMsg =
          res?.message || res?.error?.[0]?.message || "Failed to create pump";

        toast.error(errMsg);
        return;
      }

      toast.success(res?.message || "Pump created successfully!");

      setShowPopup(false);
      setUserData({ pumpName: "", cityId: "", lat: "", lng: "", phone: "", status: "active", });
      setErrors({});
      fetchPumps();
    } catch (err) {
      console.error("Pump create error:", err);

      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error?.[0]?.message ||
        "Failed to create pump";

      toast.error(errorMessage);
    }
  };

  const fetchPumps = async (pageToLoad = 1) => {
    if (loading) return;
    setLoading(true);

    const params = {
      page: pageToLoad,
      pageSize: 100,
      search: "",
    };

    try {
      const res = await apiClient("GET", `/rb_pump/all-rb-pump`, params);

      const list = res?.data?.pumps || [];

      const formatted = list.map((p) => {
        const coord = p?.pump_coordinate?.coordinates || [];
        return {
          id: p.id,
          name: p.pump_name || "",
          address: p.city_name || "",
          phone: p.pump_mobile_number || "",
          lat: coord[1] || "",
          lng: coord[0] || "",
          status: p.pump_status || "inactive",
        };
      });

      // ADD TO STATE
      if (pageToLoad === 1) {
        setCngStations(formatted);
      } else {
        setCngStations((prev) => [...prev, ...formatted]);
      }

      // CHECK HAS MORE
      setHasMore(list.length === 10);
    } catch (err) {
      console.error("Pagination Pump Fetch ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPumps(1);
  }, []);

  /* ---------- FETCH CABS (DYNAMIC) ---------- */
  const fetchCabs = async () => {
    try {
      const res = await apiClient("GET", "/rb_cabs/getAllRbCabsWithDriver");

      // adjust this line according to your real response:
      // if backend = { success, data: { cabs: [...] } } then use res.data.cabs
      const list = res?.data?.cabs || res?.data || [];

      const formatted = list.map((c) => {
        const fullReg = c.cab_reg ? String(c.cab_reg) : "";
        return {
          id: c.id,
          name: c.cab_driver_details?.driverName || "Unknown",
          fullReg,
          cabNumber: fullReg.slice(-4), // last 4 digits
          lat: c.cab_gps_details_json?.location?.latitude,
          lng: c.cab_gps_details_json?.location?.longitude,
          phone: c.cab_driver_details?.driverMobile,
          cabName: c.cab_name,
          // normalize status to lowercase keywords we use in UI logic
          status:
            c.ride_status === "booked"
              ? "onride"
              : c.ride_status === "leave"
              ? "leave"
              : "free",
        };
      });

      console.log("Cabs formatted:", formatted);
      setCabStations(formatted);
    } catch (err) {
      console.log("Cab fetch error", err);
    }
  };

  useEffect(() => {
    fetchCabs();
  }, []);

  /* ---------- SAFE REMOVE HELPERS ---------- */
  const safeRemoveLayer = (map, id) => {
    try {
      if (!map) return;
      if (map.getLayer && map.getLayer(id)) map.removeLayer(id);
    } catch {}
  };
  const safeRemoveSource = (map, id) => {
    try {
      if (!map) return;
      if (map.getSource && map.getSource(id)) map.removeSource(id);
    } catch {}
  };

  /* ---------- REMOVE CIRCLE + NEARBY MARKERS ---------- */
  const removeCircle = () => {
    const map = mapRef.current;
    if (!map) return;

    (window.__nearbyCngMarkers || []).forEach((m) => {
      try {
        m.remove();
      } catch {}
    });
    window.__nearbyCngMarkers = [];

    safeRemoveLayer(map, "cabCircleFill");
    safeRemoveLayer(map, "cabCircleLine");
    safeRemoveSource(map, "cabCircle");
  };

  /* ---------- DRAW CIRCLE + NEARBY CNG ---------- */
  const drawCircleForCab = (cab) => {
    const map = mapRef.current;
    const olaMaps = olaMapsRef.current;
    if (!map || !olaMaps) return;
    if (!cab.lat || !cab.lng) return;

    removeCircle();

    const radiusKm = 40;
    const geo = createCircleGeoJSON(cab.lat, cab.lng, radiusKm, 128);

    try {
      map.addSource("cabCircle", { type: "geojson", data: geo });

      map.addLayer({
        id: "cabCircleFill",
        type: "fill",
        source: "cabCircle",
        paint: { "fill-color": "#bfe4ff", "fill-opacity": 0.25 },
      });

      map.addLayer({
        id: "cabCircleLine",
        type: "line",
        source: "cabCircle",
        paint: { "line-color": "#2b8cff", "line-width": 2 },
      });
    } catch (e) {
      console.warn("addSource/addLayer skipped (API difference)", e);
    }

    const inside = cngStations.filter((s) => {
      const d = getDistance(cab.lat, cab.lng, s.lat, s.lng);
      return d <= radiusKm + 1e-9;
    });

    window.__nearbyCngMarkers = window.__nearbyCngMarkers || [];
    inside.forEach((s) => {
      const markerEl = document.createElement("div");
      markerEl.className =
        "relative w-[30px] h-[30px] rounded-full bg-white  flex items-center justify-center shadow";
      markerEl.innerHTML = `<img src="/icons/cng-pump.png" class="w-[16px] h-[16px]" />`;

      const distKm = getDistance(cab.lat, cab.lng, s.lat, s.lng);
      const distText = formatDistance(distKm);

      const popupHTML = `
        <div class="font-sans text-sm p-2">
          <b class="text-green-600">${s.name}</b><br/>
          <span>${s.address}</span><br/>
          <span class="text-xs text-gray-600">Distance: ${distText}</span><br/>
          <button class="py-1" onclick="window.__shareSingle(${s.id}, ${cab.id})">
            <img src="/icons/wtpone.jpg" class="w-14 h-11" />
          </button>
        </div>
      `;

      try {
        const popup = olaMaps
          .addPopup({ closeButton: false })
          .setHTML(popupHTML);
        const marker = olaMaps
          .addMarker({ element: markerEl })
          .setLngLat([s.lng, s.lat])
          .setPopup(popup)
          .addTo(map);
        window.__nearbyCngMarkers.push(marker);
      } catch (e) {
        console.warn("Nearby marker add failed", e);
      }
    });
  };

  const drawStaticCngMarkers = () => {
    const map = mapRef.current;
    const ola = olaMapsRef.current;
    if (!map || !ola) return;
    if (cngStations.length === 0) return;

    // remove old markers
    window.__STATIC_CNG_MARKERS?.forEach((m) => m.remove());
    window.__STATIC_CNG_MARKERS = [];

    cngStations.forEach((s) => {
      if (!s.lat || !s.lng) return;

      // ---------- STATUS COLORS ----------
      const status = (s.status || "").toLowerCase(); // active / inactive
      const statusColor =
        status === "active" ? "text-green-600" : "text-red-600";
      const borderColor =
        status === "active" ? "border-green-600" : "border-red-600";

      // ---------- MARKER UI ----------
      const el = document.createElement("div");
      el.className = `
      relative
      w-[34px] h-[34px]
      rounded-full bg-white border-2 ${borderColor}
      flex items-center justify-center shadow-lg
    `;

      // ▼ Arrow Pointer
      const pointer = document.createElement("div");
      pointer.className = `
      absolute -bottom-2 left-1/2 -translate-x-1/2
      w-0 h-0
      border-l-[8px] border-l-transparent
      border-r-[8px] border-r-transparent
      border-t-[12px] ${borderColor}
    `;

      const img = document.createElement("img");
      img.src = "/icons/cng-pump.png";
      img.className = "w-[16px] h-[16px]";

      el.appendChild(pointer);
      el.appendChild(img);

      // ---------- POPUP ----------
      const popupHTML = `
      <div class="font-sans text-sm p-2">
        <b class="text-green-600">${s.name}</b><br/>
        <span>${s.address}</span><br/>

        <span class="font-semibold">Status:</span>
        <span class="${statusColor} font-bold">
          ${status === "active" ? "Active" : "Inactive"}
        </span>
        <br/>
        <button class="py-1" onclick="window.__shareSingle(${s.id})">
          <img src="/icons/wtpone.jpg" class="w-14 h-11" />
        </button>
      </div>
    `;

      const popup = ola.addPopup({ closeButton: false }).setHTML(popupHTML);

      const marker = ola
        .addMarker({ element: el })
        .setLngLat([s.lng, s.lat])
        .setPopup(popup)
        .addTo(map);

      window.__STATIC_CNG_MARKERS.push(marker);
    });
  };

  window.__shareAll = (cabId) => {
    const cab = cabStations.find((c) => c.id === cabId);
    if (!cab) return alert("No cab selected");

    const inside = cngStations
      .map((s) => ({
        ...s,
        dist: getDistance(cab.lat, cab.lng, s.lat, s.lng),
      }))
      .filter((s) => s.dist <= 40);

    if (inside.length === 0) {
      return alert("No CNG pump within 40 km.");
    }

    let msg = `CNG Stations within 40km:\n\n`;

    inside.forEach((s) => {
      msg += `${s.name} — ${formatDistance(
        s.dist
      )}\nhttps://www.google.com/maps?q=${s.lat},${s.lng}\n\n`;
    });

    window.open(
      `https://web.whatsapp.com/send?phone=91${
        cab.phone
      }&text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  /* ---------- SEARCH: SHOW ONLY MATCHING CAB ---------- */
  const showOnlyMatchingCab = (rawQuery) => {
    const query = rawQuery.trim();
    setSearchValue(rawQuery);

    console.log("Search query:", query);
    console.log("cabStations:", cabStations);

    // remove existing cab markers/popups
    cabStations.forEach((c) => {
      try {
        if (c.marker && c.marker.remove) c.marker.remove();
      } catch {}
      try {
        if (c.popup && c.popup.remove) c.popup.remove();
      } catch {}
      delete c.marker;
      delete c.popup;
    });

    removeCircle();
    setCircleCabId(null);
    setGlobalActiveCab(null);

    if (!query) return;
    if (!mapRef.current || !olaMapsRef.current) {
      console.warn("Map not ready yet");
      return;
    }

    const q = query.toLowerCase();

    const cab = cabStations.find((c) => {
      const full = (c.fullReg || "").toLowerCase();
      const last4 = (c.cabNumber || "").toLowerCase();
      return (
        full.startsWith(q) ||
        full.includes(q) ||
        last4 === q ||
        last4.includes(q)
      );
    });

    console.log("Found cab:", cab);

    if (!cab) {
      toast.error("No cab found for this number");
      return;
    }

    if (!cab.lat || !cab.lng) {
      toast.error("Cab location not available");
      return;
    }

    try {
      const el = document.createElement("div");
      el.className = "flex items-center justify-center";
      el.innerHTML = `<img src="/images/car_icon.svg" class="w-[34px] h-[34px]" />`;

      const statusDotClass =
        cab.status === "free"
          ? "bg-yellow-500"
          : cab.status === "leave"
          ? "bg-red-600"
          : "bg-green-600";

      const statusBadgeClass =
        cab.status === "free"
          ? "bg-yellow-500 text-black"
          : cab.status === "leave"
          ? "bg-red-600 text-white"
          : "bg-green-600 text-white";

      const statusText =
        cab.status === "onride"
          ? "On Ride"
          : cab.status === "leave"
          ? "Leave"
          : "Free";

      const popupHTML = `
<div class="font-sans p-3 w-full max-w-auto bg-white shadow-md border rounded">
  <div class="flex justify-between items-center pb-2 border-b">
    <div class="flex items-center gap-2">
      <img src="/icons/cab.png" class="w-10 h-10 rounded-full border" />
      <div>
        <div class="flex items-center gap-1">
          <span class="w-2 h-2 rounded-full ${statusDotClass}"></span>
          <span class="font-semibold text-sm">${
            cab.fullReg || cab.cabNumber
          }</span>
        </div>
        <p class="text-xs text-gray-500 -mt-1">${cab.cabName || ""}</p>
      </div>
    </div>
    <div class="${statusBadgeClass} text-xs px-3 py-1 rounded-full">
      ${statusText}
    </div>
  </div>

  <div class="flex justify-between text-sm font-semibold py-2 border-b">
    <span>${cab.name}</span>
    <span>${cab.phone || ""}</span>
  </div>

  <div class="flex justify-between items-center text-sm py-2">
    <button onclick="window.__shareAll && window.__shareAll(${cab.id})">
      <img src="/icons/wtpall.png" class="w-14 h-11" />
    </button>
  </div>
</div>
`;

      const popup = olaMapsRef.current
        .addPopup({ closeButton: false })
        .setHTML(popupHTML);

      const marker = olaMapsRef.current
        .addMarker({ element: el })
        .setLngLat([cab.lng, cab.lat])
        .setPopup(popup)
        .addTo(mapRef.current);

      cab.marker = marker;
      cab.popup = popup;

      setGlobalActiveCab(cab.id);

      try {
        const markerEl = marker.getElement ? marker.getElement() : el;
        markerEl.addEventListener("click", () => {
          if (circleCabId === cab.id) {
            removeCircle();
            setCircleCabId(null);
          } else {
            drawCircleForCab(cab);
            setCircleCabId(cab.id);
          }
        });
      } catch (e) {}

      try {
        mapRef.current.easeTo?.({
          center: [cab.lng, cab.lat],
          zoom: 13,
          duration: 600,
        });
      } catch {
        mapRef.current.setCenter?.([cab.lng, cab.lat]);
        mapRef.current.setZoom?.(13);
      }
    } catch (e) {
      console.error("Add marker error", e);
    }
  };

  /* ---------- GLOBAL SHARE HANDLERS ---------- */
  useEffect(() => {
    window.__ACTIVE_CAB_ID = window.__ACTIVE_CAB_ID || null;
    window.__nearbyCngMarkers = window.__nearbyCngMarkers || [];

    window.__shareSingle = (cngId, cabId) => {
      const s = cngStations.find((x) => x.id === cngId);
      const targetId = cabId || window.__ACTIVE_CAB_ID;
      const cab = cabStations.find((c) => c.id === targetId);
      // if (!s) {
      //   alert("CNG not found");
      //   return;
      // }
      // if (!cab) {
      //   alert("No active cab selected. Search a cab first.");
      //   return;
      // }

      if (!s) {
        toast.error("CNG not found");
        return;
      }

      if (!cab) {
        toast.error("No active cab selected. Search a cab first.");
        return;
      }

      const dist = getDistance(cab.lat, cab.lng, s.lat, s.lng);
      const message = `CNG Station: ${s.name}\nAddress: ${
        s.address
      }\nDistance: ${formatDistance(
        dist
      )}\nLink: https://www.google.com/maps?q=${s.lat},${s.lng}`;
      window.open(
        `https://web.whatsapp.com/send?phone=91${
          cab.phone
        }&text=${encodeURIComponent(message)}`,
        "_blank"
      );
    };

    // window.__shareCNGStatic = (cngId) => {
    //   const activeId = window.__ACTIVE_CAB_ID || null;
    //   if (!activeId) {
    //     alert("Search and select a cab first to determine driver number.");
    //     return;
    //   }
    //   window.__shareSingle(cngId, activeId);
    // };

    window.__shareCNGStatic = (cngId) => {
      const activeId = window.__ACTIVE_CAB_ID;
      const cab = cabStations.find((c) => c.id === activeId);
      const s = cngStations.find((x) => x.id === cngId);

      const msg = `${s.name}\n${s.address}\nPh: ${s.phone}\nhttps://www.google.com/maps?q=${s.lat},${s.lng}`;

      window.open(
        `https://web.whatsapp.com/send?phone=91${
          cab.phone
        }&text=${encodeURIComponent(msg)}`,
        "_blank"
      );
    };

    return () => {
      try {
        delete window.__shareSingle;
      } catch {}
      try {
        delete window.__shareAll;
      } catch {}
      try {
        delete window.__shareCNGStatic;
      } catch {}
    };
  }, [cngStations, cabStations]);

  /* ---------- MAP INIT ---------- */
  useEffect(() => {
    let mounted = true;

    import("olamaps-web-sdk")
      .then(({ OlaMaps }) => {
        if (!mounted) return;
        const olaMaps = new OlaMaps({
          apiKey: [
            process.env.OLA_KEY || "OYZHLli2k5i9JrcOqveiL2wG5dxJ0A08blmHWFSa",
          ],
          style:
            "https://api.olamaps.io/tiles/vector/v1/styles/default-light/style.json",
        });

        const map = olaMaps.init({
          container: "map",
          center: [center.lng, center.lat],
          zoom: 12,
          mode: "2d",
        });

        mapRef.current = map;
        olaMapsRef.current = olaMaps;

        map.on("load", () => {
          window.__MAP_READY = true;

          if (cngStations.length > 0) {
            drawStaticCngMarkers();
          }
        });

        map.on("moveend", () => {
          if (hasMore && !loading) {
            setPage((prev) => {
              const nextPage = prev + 1;
              fetchPumps(nextPage);
              return nextPage;
            });
          }
        });
      })
      .catch((err) => {
        console.error("OlaMaps load failed", err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!olaMapsRef.current) return;
    if (cngStations.length === 0) return;

    drawStaticCngMarkers();
  }, [mapRef.current, olaMapsRef.current, cngStations]);

  const handleAutoSearch = (value) => {
    showOnlyMatchingCab(value);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowPopup(false); // popup close
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="w-full bg-white flex items-center justify-between px-4 py-4 border-b shadow md:flex-row flex-col">
        <h1 className="text-lg font-bold md:text-2xl ">
          Rod
          <span className="md:text-2xl font-bold bg-gradient-to-br from-[#FFC403] to-[#E96303] bg-clip-text text-transparent text-lg">
            B
          </span>
          ez <span className="text-gray-700">CNG Map</span>
        </h1>

        <div className="flex items-center gap-3 md:flex-row flex-col">
          <input
            type="text"
            placeholder="Search Cab…"
            className="border px-4 py-2 rounded-lg md:w-48 w-36"
            value={searchValue}
            onChange={(e) => handleAutoSearch(e.target.value)}
          />

          <div className="flex gap-2 md:flex-row flex-col">
            <button
              onClick={() => setShowPopup(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              + Add CNG Pump
            </button>
            <button
              onClick={() =>
                router.push("/rbFleetManagement/cngStation/CngList")
              }
              className="bg-gray-700 text-white px-4 py-2 rounded-lg"
            >
              Pump List
            </button>
          </div>
        </div>
      </div>

      {/* Add Pump Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div
            ref={dropdownRef}
            className="bg-white p-6 rounded-lg w-80 shadow relative"
          >
            <button
              className="absolute top-2 right-2 text-red-600 text-2xl"
              onClick={() => setShowPopup(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-3">Add Pump</h2>

            <input
              type="text"
              placeholder="Pump Name"
              className={`w-full px-3 py-2 rounded mb-1 border ${
                errors.pumpName ? "border-red-500" : "border-gray-300"
              }`}
              value={userData.pumpName}
              onChange={(e) =>
                setUserData({ ...userData, pumpName: e.target.value })
              }
            />
            {errors.pumpName && (
              <p className="text-red-500 text-sm mb-2">{errors.pumpName}</p>
            )}

            <input
              type="text"
              placeholder="City Name"
              className={`w-full px-3 py-2 rounded mb-1 border ${
                errors.cityId ? "border-red-500" : "border-gray-300"
              }`}
              value={userData.cityId}
              onChange={(e) =>
                setUserData({ ...userData, cityId: e.target.value })
              }
            />
            {errors.cityId && (
              <p className="text-red-500 text-sm mb-2">{errors.cityId}</p>
            )}

            <input
              type="text"
              placeholder="Latitude"
              className={`w-full px-3 py-2 rounded mb-1 border ${
                errors.lat ? "border-red-500" : "border-gray-300"
              }`}
              value={userData.lat}
              onChange={(e) =>
                setUserData({ ...userData, lat: e.target.value })
              }
            />
            {errors.lat && (
              <p className="text-red-500 text-sm mb-2">{errors.lat}</p>
            )}

            <input
              type="text"
              placeholder="Longitude"
              className={`w-full px-3 py-2 rounded mb-1 border ${
                errors.lng ? "border-red-500" : "border-gray-300"
              }`}
              value={userData.lng}
              onChange={(e) =>
                setUserData({ ...userData, lng: e.target.value })
              }
            />
            {errors.lng && (
              <p className="text-red-500 text-sm mb-2">{errors.lng}</p>
            )}

            <input
              type="text"
              placeholder="Mobile Number"
              maxLength={10}
              className={`w-full px-3 py-2 rounded mb-1 border ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              value={userData.phone}
              onChange={(e) =>
                setUserData({ ...userData, phone: e.target.value })
              }
            />
            {/* {errors.phone && (
              <p className="text-red-500 text-sm mb-2">{errors.phone}</p>
            )} */}

            <select
              className={`w-full px-3 py-2 rounded mb-1 border ${
                errors.status ? "border-red-500" : "border-gray-300"
              }`}
              value={userData.status || "active"} 
              onChange={(e) =>
                setUserData({ ...userData, status: e.target.value })
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {errors.status && (
              <p className="text-red-500 text-sm mb-2">{errors.status}</p>
            )}

            <button
              className="bg-green-600 text-white w-full py-2 rounded mt-2"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Map */}
      <div className="flex-grow">
        <div id="map" className="w-full h-full" />
      </div>
    </div>
  );
}
