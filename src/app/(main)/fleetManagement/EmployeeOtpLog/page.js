"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { apiClient } from "@/app/lib/apiClient";

const PAGE_SIZE = 20;

const OTPLogs = () => {
  const [logs, setLogs] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const scrollRef = useRef(null);

  const observerRef = useRef(null);

  const loadMoreRef = useCallback(
    (node) => {
      if (loading) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore]
  );

  const observerMobile = useRef(null);

  const lastMobileRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;

      if (observerMobile.current) observerMobile.current.disconnect();

      observerMobile.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observerMobile.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchOtpHistory = async (pageNo = 1) => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);

      const res = await apiClient(
        "GET",
        `/rbac/get-otp-history?page=${pageNo}&limit=${PAGE_SIZE}`
      );

      const rows = res.data?.rows || [];
      const pagination = res.data?.pagination;

      setLogs((prev) => [...prev, ...rows]);
      setHasMore(pagination?.hasNextPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOtpHistory(page);
  }, [page]);

  useEffect(() => {
    setPage(1);
    setLogs([]);
  }, []);

  const formatDate = (date) => moment(date).format("DD MMM, YYYY hh:mm A");

  return (
    <div className="p-4 md:p-6 w-full bg-gray-50 min-h-[50vh]">
      <div className="w-full bg-white rounded-xl shadow-sm border flex flex-col h-[80vh]">
        <div className="p-4 md:p-6 border-b bg-white sticky top-0 z-30">
          <h2 className="text-lg md:text-xl font-semibold">
            OTP Verification Logs
          </h2>
          <p className="text-xs md:text-sm text-gray-500">
            Monitor and review all OTP verification attempts
          </p>
        </div>
        <div
          ref={scrollRef}
          className="hidden md:block overflow-y-auto h-[65vh]"
        >
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="sticky top-0 bg-gray-50 px-4 py-3 text-left z-20">
                  ID
                </th>
                <th className="sticky top-0 bg-gray-50 px-4 py-3 text-left z-20">
                  Mobile
                </th>
                <th className="sticky top-0 bg-gray-50 px-4 py-3 text-left z-20">
                  Name
                </th>
                <th className="sticky top-0 bg-gray-50 px-4 py-3 text-left z-20">
                  Date & Time
                </th>
                <th className="sticky top-0 bg-gray-50 px-4 py-3 text-left z-20">
                  IP
                </th>
                <th className="sticky top-0 bg-gray-50 px-4 py-3 text-left z-20">
                  Location
                </th>
                <th className="sticky top-0 bg-gray-50 px-4 py-3 text-left z-20">
                  State
                </th>
                <th className="sticky top-0 bg-gray-50 px-4 py-3 text-left z-20">
                  City
                </th>
                <th className="sticky top-0 bg-gray-50 px-4 py-3 text-left z-20">
                  Postal Code
                </th>
                <th className="sticky top-0 bg-gray-50 px-4 py-3 text-left z-20">
                  Country
                </th>
                <th className="sticky top-0 bg-gray-50 px-4 py-3 text-left z-20">
                  OTP
                </th>
                <th className="sticky top-0 bg-gray-50 px-4 py-3 text-left z-20">
                  Status
                </th>
                <th className="sticky top-0 bg-gray-50 px-4 py-3 text-left z-20">
                  Opt Verify Time
                </th>
              </tr>
            </thead>

            <tbody>
              {logs.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-2 py-3">{item.id}</td>
                  <td className="px-2 py-3">{item.mobile_no}</td>
                  <td className="px-2 py-3">{item.user?.name || "-"}</td>
                  <td className="px-2 py-3">
                    {(() => {
                      const [date, time] = item.login_time_ist.split(", ");
                      const [dd, mm, yyyy] = date.split("/");
                      const istDate = new Date(
                        `${yyyy}-${mm}-${dd} ${time} GMT+0530`
                      );

                      return istDate.toLocaleString("en-GB", {
                        timeZone: "UTC",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      });
                    })()}
                  </td>

                  <td className="px-2 py-3">{item.ip_address}</td>
                  <td className="px-2 py-3">{item.address || "-"}</td>
                  <td className="px-2 py-3">{item.state || "-"}</td>
                  <td className="px-2 py-3">{item.city || "-"}</td>
                  <td className="px-2 py-3">{item.postal_code || "-"}</td>
                  <td className="px-2 py-3">{item.country || "-"}</td>
                  <td className="px-2 py-3 font-mono">{item.otp}</td>
                  <td className="px-2 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.otp_verified
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {item.otp_verified ? "Verified" : "Failed"}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    {(() => {
                      const [date, time] = item.updatedAt_ist.split(", ");
                      const [dd, mm, yyyy] = date.split("/");
                      const istDate = new Date(
                        `${yyyy}-${mm}-${dd} ${time} GMT+0530`
                      );

                      return istDate.toLocaleString("en-GB", {
                        timeZone: "UTC",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      });
                    })()}
                  </td>
                </tr>
              ))}

              {hasMore && (
                <tr>
                  <td colSpan="13">
                    <div ref={loadMoreRef} className="h-6"></div>
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan="13" className="text-center py-4 text-gray-400">
                    Loading more OTP logs...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="block md:hidden h-[70vh] overflow-y-auto space-y-4 p-2">
          {logs.map((item, idx) => {
            const isLast = idx === logs.length - 1;

            return (
              <div
                key={item.id}
                ref={isLast ? lastMobileRef : null}
                className="bg-white border rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold">ID: {item.id}</span>

                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.otp_verified
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.otp_verified ? "Verified" : "Failed"}
                  </span>
                </div>

                <div className="text-sm space-y-1">
                  <p>
                    <b>Mobile:</b> {item.mobile_no}
                  </p>
                  <p>
                    <b>Name:</b> {item.user?.name || "-"}
                  </p>
                  <p>
                    <b>Time:</b>{" "}
                    {(() => {
                      const [date, time] = item.login_time_ist.split(", ");
                      const [dd, mm, yyyy] = date.split("/");
                      const istDate = new Date(
                        `${yyyy}-${mm}-${dd} ${time} GMT+0530`
                      );

                      return istDate.toLocaleString("en-GB", {
                        timeZone: "UTC",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      });
                    })()}
                  </p>
                  <p>
                    <b>IP:</b> {item.ip_address}
                  </p>
                  <p>
                    <b>Location:</b> {item.address || "-"}
                  </p>
                  <p>
                    <b>State:</b> {item.state || "-"}
                  </p>
                  <p>
                    <b>City:</b> {item.city || "-"}
                  </p>
                  <p>
                    <b>Postal Code:</b> {item.postal_code || "-"}
                  </p>
                  <p>
                    <b>Country:</b> {item.country || "-"}
                  </p>
                  <p>
                    <b>OTP:</b> <span className="font-mono">{item.otp}</span>
                  </p>
                  <p>
                    <b>Opt Verify Time:</b>{" "}
                    {(() => {
                      const [date, time] = item.updatedAt_ist.split(", ");
                      const [dd, mm, yyyy] = date.split("/");

                      // Create IST date properly
                      const istDate = new Date(
                        `${yyyy}-${mm}-${dd} ${time} GMT+0530`
                      );

                      return istDate.toLocaleString("en-GB", {
                        timeZone: "UTC",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      });
                    })()}
                  </p>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="text-center text-gray-500 py-4">
              Loading more...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPLogs;
