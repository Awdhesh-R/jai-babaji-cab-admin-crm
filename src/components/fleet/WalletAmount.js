"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Clock, Search, Calendar } from "lucide-react";
import {
  FiArrowDownLeft,
  FiArrowUpRight,
  FiCheckCircle,
  FiExternalLink,
} from "react-icons/fi";
import { BsWallet, BsCashCoin } from "react-icons/bs";
import { FaArrowTrendUp, FaArrowRight, FaRegCalendar } from "react-icons/fa6";
import { CiLocationOn } from "react-icons/ci";
import { GoClock } from "react-icons/go";
import DateRangePicker from "@/components/common/DateRange";
import { apiClient } from "@/app/lib/apiClient";
import { useParams } from "next/navigation";

const walletCards = [
  {
    label: "Wallet Points",
    amount: "₹ 4,500",
    subtext: "Available balance",
    icon: <BsWallet />,
    bgColor: "bg-[#FFC667]",
    iconColor: "text-white",
    textColor: "text-black",
    image: "/images/walletPoints.png",
  },
  {
    label: "Earned from RodBez",
    amount: "₹ 6,800",
    subtext: "Total earnings",
    icon: <FaArrowTrendUp />,
    bgColor: "bg-[#C5FBD8]",
    iconColor: "text-[#2FAE5E]",
    textColor: "text-white",
    image: "/images/totalEarning.png",
  },
  {
    label: "Rodbez Commission",
    amount: "₹ 1,200",
    subtext: "Total Commission",
    icon: <BsCashCoin />,
    bgColor: "bg-[#F95900]",
    iconColor: "text-white",
    textColor: "text-white",
    image: "/images/totalCommission.png",
  },
];


const earningData = [
  {
    id: 1,
    from: "Harlakhi",
    to: "Patna",
    rideId: "RID1234567991",
    txId: "TXN7890123",
    earned: 1500,
    commission: 500,
    date: "10 July 2025",
    time: "03:30 PM",
    status: "Completed",
  },
  {
    id: 2,
    from: "Harlakhi",
    to: "Patna",
    rideId: "RID1234567992",
    txId: "TXN7890124",
    earned: 1500,
    commission: 500,
    date: "10 July 2025",
    time: "03:30 PM",
    status: "Cancelled",
  },

  // ⭐ 10 new data items below
  {
    id: 3,
    from: "Madhubani",
    to: "Darbhanga",
    rideId: "RID1234568001",
    txId: "TXN7890131",
    earned: 1200,
    commission: 300,
    date: "11 July 2025",
    time: "09:10 AM",
    status: "Completed",
  },
  {
    id: 4,
    from: "Patna",
    to: "Harlakhi",
    rideId: "RID1234568002",
    txId: "TXN7890132",
    earned: 1800,
    commission: 450,
    date: "11 July 2025",
    time: "10:45 AM",
    status: "Completed",
  },
  {
    id: 5,
    from: "Samastipur",
    to: "Patna",
    rideId: "RID1234568003",
    txId: "TXN7890133",
    earned: 900,
    commission: 200,
    date: "11 July 2025",
    time: "12:15 PM",
    status: "Cancelled",
  },
  {
    id: 6,
    from: "Patna",
    to: "Muzaffarpur",
    rideId: "RID1234568004",
    txId: "TXN7890134",
    earned: 1600,
    commission: 400,
    date: "12 July 2025",
    time: "08:20 AM",
    status: "Completed",
  },
  {
    id: 7,
    from: "Darbhanga",
    to: "Patna",
    rideId: "RID1234568005",
    txId: "TXN7890135",
    earned: 1400,
    commission: 350,
    date: "12 July 2025",
    time: "01:50 PM",
    status: "Completed",
  },
  {
    id: 8,
    from: "Harlakhi",
    to: "Muzaffarpur",
    rideId: "RID1234568006",
    txId: "TXN7890136",
    earned: 1100,
    commission: 270,
    date: "12 July 2025",
    time: "05:30 PM",
    status: "Cancelled",
  },
  {
    id: 9,
    from: "Patna",
    to: "Harlakhi",
    rideId: "RID1234568007",
    txId: "TXN7890137",
    earned: 2000,
    commission: 550,
    date: "13 July 2025",
    time: "09:45 AM",
    status: "Completed",
  },
  {
    id: 10,
    from: "Darbhanga",
    to: "Samastipur",
    rideId: "RID1234568008",
    txId: "TXN7890138",
    earned: 1000,
    commission: 260,
    date: "13 July 2025",
    time: "11:20 AM",
    status: "Completed",
  },
  {
    id: 11,
    from: "Muzaffarpur",
    to: "Patna",
    rideId: "RID1234568009",
    txId: "TXN7890139",
    earned: 1700,
    commission: 450,
    date: "13 July 2025",
    time: "07:15 PM",
    status: "Completed",
  },
  {
    id: 12,
    from: "Patna",
    to: "Madhubani",
    rideId: "RID1234568010",
    txId: "TXN7890140",
    earned: 1300,
    commission: 330,
    date: "14 July 2025",
    time: "10:10 AM",
    status: "Cancelled",
  },
];

function formatDateLocal(dateInput) {
  const date = new Date(dateInput);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const WalletAmount = ({ operatorId }) => {
  const [mainTab, setMainTab] = useState("transactions");
  const [filterTab, setFilterTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState({
    startDate: null,
    endDate: null,
  });

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef();

  // ⭐ FINAL FIXED lastCardRef
  const lastCardRef = useCallback(
    (node) => {
      if (!hasMore || loading) return; // FIX

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPageNo((prev) => prev + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [hasMore, loading]
  );

  // ⭐ MAIN API CALL
  useEffect(() => {
    if (mainTab !== "transactions") return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const payload = {
          operator_id: operatorId,
          page: pageNo,
          limit: 10,
        };

        if (filterTab !== "all") payload.transaction_type = filterTab;
        if (searchTerm.trim()) payload.transaction_id = searchTerm.trim();

        if (dateFilter.startDate)
          payload.date_from = formatDateLocal(dateFilter.startDate);

        if (dateFilter.endDate)
          payload.date_to = formatDateLocal(dateFilter.endDate);

        const res = await apiClient(
          "POST",
          "/fleet/opertor-transaction-history",
          payload
        );

        const newData = res.data.data || [];

        setTransactions((prev) =>
          pageNo === 1 ? newData : [...prev, ...newData]
        );

        setHasMore(res.data.meta?.hasNextPage ?? false);
      } catch (err) {
        setHasMore(false);
      }
      setLoading(false);
    };

    fetchData();
  }, [pageNo, filterTab, searchTerm, dateFilter, mainTab]);

  // ⭐ Reset on filters
  useEffect(() => {
    setPageNo(1);
    setTransactions([]);
    setHasMore(true);
  }, [filterTab, searchTerm, dateFilter, mainTab]);

  const getTypeInfo = (type) => {
    if (type === "credit")
      return { label: "Credited", color: "text-[#059669]" };
    if (type === "debit") return { label: "Debited", color: "text-[#DC2626]" };
    return { label: type, color: "text-gray-700" };
  };

  return (
    <div className="flex flex-col">
      {/* ---------------- Wallet Cards  (UI SAME) ---------------- */}
      <div
        className="rounded-xl border border-[#d7e7ff] bg-white p-4 shadow-md w-full bg-cover"
        style={{ backgroundImage: "url('/images/walletBackground.png')" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mx-4 sm:mx-6 md:mx-10 mt-8">
          {walletCards.map((card, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-xl p-4 shadow min-h-[140px] flex flex-col justify-between bg-right-bottom bg-cover transition-all"
              style={{ backgroundImage: `url(${card.image})` }}
            >
              <div className="flex items-center gap-2">
                <div className={`${card.bgColor} ${card.iconColor} p-2 rounded-md`}>
                  {card.icon}
                </div>
                <span className={`text-sm font-medium ${card.textColor}`}>
                  {card.label}
                </span>
              </div>

              <div className="pt-2">
                <h3 className={`text-2xl font-semibold ${card.textColor}`}>
                  {card.amount}
                </h3>
                <p className={`text-sm ${card.textColor} opacity-80`}>
                  {card.subtext}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- Filters + Tabs (UI SAME) ---------------- */}
      <div className="w-full flex flex-wrap p-4 sm:p-5 justify-between items-center gap-3">
        <div className="flex flex-wrap border border-blue-300 rounded-full p-1 gap-1">
          <button
            onClick={() => setMainTab("transactions")}
            className={`px-4 sm:px-6 py-2 text-sm sm:text-base font-medium rounded-full ${
              mainTab === "transactions" ? "text-white" : "text-gray-600"
            }`}
            style={
              mainTab === "transactions"
                ? { background: "linear-gradient(90deg,#2563EB,#153885)" }
                : {}
            }
          >
            Transactions
          </button>

          <button
            onClick={() => setMainTab("earning")}
            className={`px-4 sm:px-6 py-2 text-sm sm:text-base font-medium rounded-full ${
              mainTab === "earning" ? "text-white" : "text-gray-600"
            }`}
            style={
              mainTab === "earning"
                ? { background: "linear-gradient(90deg,#2563EB,#153885)" }
                : {}
            }
          >
            Earning
          </button>
        </div>

        {/* Filters same */}
        {mainTab === "transactions" && (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilterTab("credit")}
              className={`px-4 py-2 rounded-md text-sm font-semibold ${
                filterTab === "credit"
                  ? "bg-[#059669] text-white"
                  : "bg-white border text-gray-700"
              }`}
            >
              Credit
            </button>

            <button
              onClick={() => setFilterTab("debit")}
              className={`px-4 py-2 rounded-md text-sm font-semibold ${
                filterTab === "debit"
                  ? "bg-[#DC2626] text-white"
                  : "bg-white border text-gray-700"
              }`}
            >
              Debit
            </button>

            <button
              onClick={() => setFilterTab("all")}
              className={`px-4 py-2 rounded-md text-sm font-semibold ${
                filterTab === "all"
                  ? "bg-[#2563EB] text-white"
                  : "bg-white border text-gray-700"
              }`}
            >
              All
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-4 ml-auto items-center w-full sm:w-auto">
          <DateRangePicker
            onChange={(date) =>
              setDateFilter({
                startDate: date.startDate,
                endDate: date.endDate,
              })
            }
          />

          <div
            className="flex items-center rounded-lg px-4 py-2 w-full sm:w-[300px] gap-2"
            style={{
              background: "linear-gradient(90deg, #2563EB 0%, #153885 100%)",
            }}
          >
            <Search className="w-5 h-5 text-white" />
            <input
              type="text"
              placeholder="Search by Txn ID"
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent placeholder-white text-white focus:outline-none text-sm w-full"
            />
          </div>
        </div>
      </div>



            <div className="flex flex-col sm:flex-row items-center justify-between bg-white shadow p-3 rounded-xl w-full mt-6 gap-4">
        <div className="flex items-center gap-2">
          <Clock className="text-blue-500 w-5 h-5" />
          <div>
            <h2 className="font-semibold text-gray-800 text-[16px]">
              Total Collections & Rides
            </h2>
            <p className="text-xs text-gray-500">
              View and manage your recent transactions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-[300px] px-4 py-3 rounded-full border border-[#dce9ff] bg-white shadow-[0_0_8px_rgba(214,228,255,0.7)]">
          <Search className="w-5 h-5 text-[#7da4ff]" />
          <input
            type="text"
            placeholder="Search by transaction ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent outline-none text-[#7da4ff] placeholder-[#9bbdff] text-base"
          />
        </div>
      </div>


      {/* ---------------- LIST (UI SAME, LOGIC FIXED) ---------------- */}
      <div className="flex flex-col">
        {mainTab === "transactions" && (
          <>
            {transactions.length === 0 && !loading && (
              <div className="my-8 text-center text-gray-500">
                No records found.
              </div>
            )}

            {transactions.map((txn, idx) => {
              const tInfo = getTypeInfo(txn.transaction_type);
              const isLast = idx === transactions.length - 1;

              return (
                <div
                  key={txn.id}
                  ref={isLast ? lastCardRef : null}
                  className="relative rounded-xl mb-5 shadow-lg bg-white mt-4"
                >
                  <div
                    className={`absolute left-0 top-0 p-4 w-full border-t-2 rounded-t-xl ${
                      txn.transaction_type === "credit"
                        ? "border-t-[#15803D]"
                        : "border-t-[#F80000]"
                    }`}
                  />

                  <div className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-0">
                      <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
                        {txn.transaction_type === "credit" ? (
                          <div className="p-2 bg-green-50 rounded-xl">
                            <FiArrowDownLeft className="text-[#059669] text-xl" />
                          </div>
                        ) : (
                          <div className="p-2 bg-red-50 rounded-lg">
                            <FiArrowUpRight className="text-[#DC2626] text-xl" />
                          </div>
                        )}

                        <span
                          className={`font-semibold ${tInfo.color} w-20 capitalize text-sm md:text-base`}
                        >
                          {tInfo.label}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`font-bold text-lg flex justify-end md:text-xl ${
                        txn.transaction_type === "credit"
                          ? "text-[#059669]"
                          : "text-[#DC2626]"
                      }`}
                    >
                      {txn.transaction_type === "credit" ? "+" : "-"}₹
                      {(txn.amount / 100).toFixed(2)}
                    </span>

                    <div className="flex flex-col md:flex-row items-start gap-1 md:gap-4 mt-2 text-xs md:text-sm text-gray-500">
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        <FaRegCalendar />
                        {txn.createdAt?.slice(0, 10)}
                      </span>

                      <span className="flex items-center gap-1 whitespace-nowrap">
                        <GoClock />
                        {txn.createdAt?.slice(11, 16)}
                      </span>

                      <span className="whitespace-nowrap">
                        Transaction ID:{" "}
                        <span className="font-bold text-gray-700">
                          {txn.transaction_id}
                        </span>
                      </span>

                      <span className="whitespace-nowrap">
                        Mode:{" "}
                        <span className="font-bold text-gray-700">
                          {txn.payment_gateway || "N/A"}
                        </span>
                      </span>

                      {txn.order_id && (
                        <span className="whitespace-nowrap">
                          Invoice:{" "}
                          <span className="font-bold text-gray-700">
                            {txn.order_id}
                          </span>
                        </span>
                      )}

                      {txn.booking_id && (
                        <span className="whitespace-nowrap">
                          Ride:{" "}
                          <span className="font-bold text-gray-700">
                            {txn.booking_id}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="py-4 text-center text-blue-500">
                Loading more...
              </div>
            )}
          </>
        )}
                 
                             {mainTab === "earning" && (
              <>
                {earningData.map((item) => (
                  <div
                    key={item.id}
                    className={`relative rounded-2xl mb-5 shadow-[0_2px_6px_rgba(0,0,0,0.07)] bg-white mt-4 overflow-hidden border-t-2
            ${
              item.status === "Completed"
                ? "border-[#16A249]"
                : "border-[#F80000]"
            }
          `}
                  >
                    <div
                      className={`absolute top-0 left-0 w-full
              ${item.status === "Completed" ? "bg-[#16A249]" : "bg-[#F80000]"}
            `}
                    />

                    <div className="p-4 md:p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-[18px] font-semibold text-gray-800">
                        <div className="flex flex-row items-center  gap-2 text-[12px] md:text-[18px]  font-semibold text-gray-800">
                          <div className="flex items-center gap-1 text-[#000000]">
                            <CiLocationOn className="text-[#F80000] text-[18px]" />
                            {item.from}
                          </div>
                          <FaArrowRight className="text-gray-500 text-[16px]" />
                          <div className="flex items-center gap-1 text-[#000000]">
                            <CiLocationOn className="text-[#16A249] text-[18px]" />
                            {item.to}
                          </div>
                          <FiExternalLink />
                        </div>

                        <span
                          className={`sm:ml-auto text-xs px-4 py-1 min-w-[110px] h-7 rounded-full border font-semibold flex items-center gap-2
      ${
        item.status === "Completed"
          ? "text-[#059669] border-[#15803D] bg-[#DCFCE7CC]"
          : "text-[#F80000] border-[#F80000] bg-[#FFFDFD]"
      }
    `}
                        >
                          {item.status === "Completed" && (
                            <FiCheckCircle className="w-4 h-4 text-[#059669]" />
                          )}
                          {item.status}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-3 text-[14px] text-gray-600">
                        <div>
                          <span className="block text-[#00000099]">
                            Ride ID
                          </span>
                          <div className="font-semibold text-[#2563EB]">
                            {item.rideId}
                          </div>
                        </div>
                        <div>
                          <span className="block text-[#00000099]">
                            Transaction ID
                          </span>
                          <div className="font-semibold text-[#172C4F]">
                            {item.txId}
                          </div>
                        </div>
                        <div>
                          <span className="block text-[#00000099]">Earned</span>
                          <div className="font-semibold text-[#109E45]">
                            ₹{item.earned}
                          </div>
                        </div>
                        <div>
                          <span className="block text-[#00000099]">
                            Commission
                          </span>
                          <div className="font-semibold text-[#9333EA]">
                            ₹{item.commission}
                          </div>
                        </div>
                        <div>
                          <span className="block text-[#00000099]"></span>
                          <div className="font-semibold text-[#9333EA]">
                            {/* ₹{item.commission} */}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start gap-4 mt-4 text-[13px] text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" /> {item.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {item.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

        
      </div>
    </div>
  );
};

export default WalletAmount;
