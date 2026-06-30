"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { FaAngleDown } from "react-icons/fa";
import DateRangePicker from "@/components/common/DateRange";
import { apiClient } from "@/app/lib/apiClient";
import moment from "moment";
import { FaSyncAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const data = [
  {
    id: 1,
    name: "Rahul Kumar",
    userId: "U1023",
    paymentId: "PAY987654",
    refundId: "REF12345",
    amount: "₹450",
    status: "Complete",
    requestDate: "2026-02-12",
    completeDate: "2026-02-13",
  },
  {
    id: 2,
    name: "Anjali Singh",
    userId: "U2045",
    paymentId: "PAY234567",
    refundId: "REF12346",
    amount: "₹320",
    status: "Pending",
    requestDate: "2026-02-11",
    completeDate: "-",
  },
  {
    id: 3,
    name: "Amit Verma",
    userId: "U3098",
    paymentId: "PAY345678",
    refundId: "REF12347",
    amount: "₹780",
    status: "Complete",
    requestDate: "2026-02-10",
    completeDate: "2026-02-11",
  },
  {
    id: 4,
    name: "Priya Sharma",
    userId: "U4123",
    paymentId: "PAY456789",
    refundId: "REF12348",
    amount: "₹250",
    status: "Failed",
    requestDate: "2026-02-09",
    completeDate: "-",
  },
  {
    id: 5,
    name: "Suresh Patel",
    userId: "U5234",
    paymentId: "PAY567890",
    refundId: "REF12349",
    amount: "₹999",
    status: "Pending",
    requestDate: "2026-02-08",
    completeDate: "-",
  },
  {
    id: 6,
    name: "Neha Gupta",
    userId: "U6345",
    paymentId: "PAY678901",
    refundId: "REF12350",
    amount: "₹150",
    status: "Complete",
    requestDate: "2026-02-07",
    completeDate: "2026-02-08",
  },
  {
    id: 7,
    name: "Rohan Mehta",
    userId: "U7456",
    paymentId: "PAY789012",
    refundId: "REF12351",
    amount: "₹620",
    status: "Pending",
    requestDate: "2026-02-06",
    completeDate: "-",
  },
  {
    id: 8,
    name: "Kavita Rao",
    userId: "U8567",
    paymentId: "PAY890123",
    refundId: "REF12352",
    amount: "₹430",
    status: "Complete",
    requestDate: "2026-02-05",
    completeDate: "2026-02-06",
  },
  {
    id: 9,
    name: "Vikram Singh",
    userId: "U9678",
    paymentId: "PAY901234",
    refundId: "REF12353",
    amount: "₹275",
    status: "Failed",
    requestDate: "2026-02-04",
    completeDate: "-",
  },
  {
    id: 10,
    name: "Pooja Nair",
    userId: "U1089",
    paymentId: "PAY112233",
    refundId: "REF12354",
    amount: "₹510",
    status: "Complete",
    requestDate: "2026-02-03",
    completeDate: "2026-02-04",
  },
];

export default function RefundPage() {
  const [showFilter, setShowFilter] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [refundRecords, setRefundRecords] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [limit] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState({
    startsAt: "",
    endsAt: "",
  });

  const loadRefundHistory = useCallback(
    async (page) => {
      if (loading) return;

      setLoading(true);

      try {
        const params = {
          page,
          limit,
          startDate: dateFilter.startsAt || null,
          endDate: dateFilter.endsAt || null,
          search,
          status: statusFilter || null,
          sortBy: "createdAt",
          sortOrder: "DESC",
        };

        const response = await apiClient(
          "GET",
          "/ride_management/refund-history",
          params,
        );

        const apiData = response?.data;

        const list = apiData?.items || [];

        if (page === 1) {
          setRefundRecords(list);
        } else {
          setRefundRecords((prev) => [...prev, ...list]);
        }
        setHasMore(list.length === limit);
      } catch (err) {
        console.error("Refund history error:", err);
      } finally {
        setLoading(false);
      }
    },
    [search, statusFilter, dateFilter],
  );

  useEffect(() => {
    setRefundRecords([]);
    setHasMore(true);
    setPageNo(1);
  }, [search, statusFilter, dateFilter]);

  useEffect(() => {
    loadRefundHistory(pageNo);
  }, [pageNo, loadRefundHistory]);

  const observerRef = useRef();

  const lastRowRef = useCallback(
    (node) => {
      if (loading) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNo((prev) => prev + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore],
  );

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.userId.toLowerCase().includes(search.toLowerCase()) ||
        item.paymentId.toLowerCase().includes(search.toLowerCase());

      const matchDate = dateFilter ? item.requestDate === dateFilter : true;

      const matchStatus = statusFilter ? item.status === statusFilter : true;

      return matchSearch && matchDate && matchStatus;
    });
  }, [search, dateFilter, statusFilter]);

  const exportCSV = () => {
    if (!refundRecords.length) return;

    const headers = [
      "Mobile No",
      "User ID",
      "Payment ID",
      "Refund ID",
      "Amount",
      "Status",
      "Request Date",
      "Complete Date",
    ];

    const rows = refundRecords.map((item) => [
      item?.user?.mobile_no || "-",
      item?.user_id || "-",
      item?.payment_id || "-",
      item?.refund_id || "-",
      item?.refund_amount || 0,
      item?.refund_status || "-",
      item?.updatedAt || "-",
      item?.processedAt ? moment(item.processedAt).format("YYYY-MM-DD") : "-",
    ]);

    const csvContent =
      headers.join(",") + "\n" + rows.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "refund-history.csv";
    link.click();
  };

  return (
    // <div className="p-6 bg-gray-50 min-h-screen">
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Razorpay Refund History</h1>
      <div className="bg-white p-4 rounded-lg shadow mb-6 border">
        {/* <div className="flex gap-3 mb-4"> */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Search by name, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border px-3 py-2 rounded-md"
          />

          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 px-4 py-2 
                 bg-white border border-gray-300 
                 rounded-xl text-sm font-medium 
                 shadow-sm hover:shadow-md transition"
            >
              Filters
              <FaAngleDown
                className={`transition-transform duration-200 ${
                  showFilter ? "rotate-180" : ""
                }`}
              />
            </button>

            {showFilter && (
              <div
                // className="absolute right-0 mt-2 w-44
                //       bg-white border border-gray-200
                //       rounded-xl shadow-xl p-2 z-50"
                className="absolute sm:right-0 left-0 sm:left-auto mt-2 w-44 
bg-white border border-gray-200 
rounded-xl shadow-xl p-2 z-[9999]"
              >
                {["All", "Processing", "Pending", "Failed"].map((status) => (
                  <div
                    key={status}
                    onClick={() => {
                      const statusMap = {
                        All: "",
                        Processing: "processed",
                        Pending: "pending",
                        Failed: "failed",
                      };

                      setStatusFilter(statusMap[status] || "");
                      setShowFilter(false);
                    }}
                    // className={`px-3 py-2 rounded-lg text-sm
                    //     cursor-pointer transition
                    //     hover:bg-gray-100
                    //     ${
                    //       statusFilter === status
                    //         ? "bg-gray-100 font-semibold"
                    //         : ""
                    //     }`}
                    className={`px-3 py-2 rounded-lg text-sm 
  cursor-pointer transition 
  hover:bg-gray-100
  ${
    (status === "All" && statusFilter === "") ||
    (status === "Processing" && statusFilter === "processed") ||
    (status === "Pending" && statusFilter === "pending") ||
    (status === "Failed" && statusFilter === "failed")
      ? "bg-gray-100 font-semibold"
      : ""
  }
`}
                  >
                    {status}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="min-w-[220px]">
          <DateRangePicker
            onChange={(date) => {
              setDateFilter({
                startsAt: date.startDate
                  ? moment(date.startDate).format("YYYY-MM-DD")
                  : null,
                endsAt: date.endDate
                  ? moment(date.endDate).format("YYYY-MM-DD")
                  : null,
              });
            }}
          />
        </div>
      </div>

      {/* <div className="flex justify-between items-center mb-4 relative"> */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4 relative">
        <button
          onClick={exportCSV}
          className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-100"
        >
          Export CSV
        </button>
      </div>
      {/* <div className="bg-white rounded-lg shadow border overflow-hidden"> */}
      <div className="bg-white rounded-lg shadow border">
        <div className="w-full overflow-x-auto">
          {/* <table className="w-full text-sm"> */}
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Expand</th>
                <th className="p-3">Mobile no</th>
                <th className="p-3">User Name</th>
                <th className="p-3">Payment ID</th>
                <th className="p-3">Refund ID</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Request Date</th>
                <th className="p-3">Bank Deposit </th>
                <th className="p-3"> </th>
              </tr>
            </thead>

            <tbody>
              {refundRecords.map((item, index) => {
                const isLast = index === refundRecords.length - 1;

                return [
                  <tr
                    key={`row-${item.id}`}
                    ref={isLast ? lastRowRef : null}
                    className="border-t hover:bg-gray-50"
                  >
                    <td
                      className="p-3 cursor-pointer"
                      onClick={() =>
                        setExpandedRow(expandedRow === item.id ? null : item.id)
                      }
                    >
                      {expandedRow === item.id ? "▲" : "▼"}
                    </td>

                    <td className="p-3">{item?.user?.mobile_no || "-"}</td>
                    <td className="p-3">
                      {item?.user
                        ? `${item.user.first_name} ${item.user.last_name}`.trim()
                        : "-"}
                    </td>
                    <td className="p-3">{item?.payment_id || "-"}</td>
                    <td className="p-3">{item?.refund_id || "-"}</td>

                    <td className="p-3 font-semibold">
                      ₹
                      {Number(item?.refund_amount || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          item?.refund_status === "processed"
                            ? "bg-green-100 text-green-600"
                            : item?.refund_status === "pending"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item?.refund_status}
                      </span>
                    </td>

                    <td className="p-3">{item?.createdAt}</td>

                    {/* <td className="p-3">
                      {item?.processedAt
                        ? moment(item.processedAt).format("YYYY-MM-DD")
                        : "-"}
                    </td> */}

                    <td className="p-3">{item?.updatedAt}</td>
                    <td className="p-3 text-center">
                      {item?.refund_status === "pending" && (
                        <FaSyncAlt
                          size={14}
                          className="cursor-pointer text-blue-500  transition"
                          onClick={async () => {
                            try {
                              const response = await apiClient(
                                "GET",
                                `/ride_management/update-refund-status/${item?.refund_id}`,
                              );
                              if (response?.success === true) {
                                toast.success(
                                  response?.message || "Status Updated",
                                );

                                setRefundRecords((prev) =>
                                  prev.map((r) =>
                                    r.refund_id === item.refund_id
                                      ? { ...r, refund_status: "processed" }
                                      : r,
                                  ),
                                );
                              } else {
                                toast.error(
                                  response?.message || "Failed to update",
                                );
                              }
                            } catch (error) {
                              console.error(error);
                              toast.error("Something went wrong");
                            }
                          }}
                        />
                      )}
                    </td>
                  </tr>,

                  expandedRow === item.id && (
                    <tr key={`expand-${item.id}`} className="bg-gray-50">
                      <td colSpan={9} className="p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium">Payment Method:</p>
                            <p>{item?.payment_method || "-"}</p>
                          </div>

                          <div>
                            <p className="font-medium">Email:</p>
                            <p>{item?.user?.email || "-"}</p>
                          </div>

                          <div>
                            <p className="font-medium">Created By:</p>
                            <p>{item?.createdBy || "-"}</p>
                          </div>

                          <div>
                            <p className="font-medium">Refund ID:</p>
                            <p>{item?.refund_id}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ),
                ];
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
