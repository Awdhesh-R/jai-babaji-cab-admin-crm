"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { CheckCircle, Clock, Calendar, MapPin } from "lucide-react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { LuCarTaxiFront, LuPhone } from "react-icons/lu";
import Image from "next/image";
import { BsWallet } from "react-icons/bs";
import { FaArrowTrendUp } from "react-icons/fa6";
import { BsCashCoin } from "react-icons/bs";
import { HiOutlineClock } from "react-icons/hi";
import { FiFilter, FiSearch } from "react-icons/fi";
import { useParams } from "next/navigation";
import CustomLoader from "@/components/common/CustomLoader";
import { apiClient } from "@/app/lib/apiClient";
import DateRangePicker from "@/components/common/DateRange";
import moment from "moment";
import { useRouter } from "next/navigation";
import PaymentModal from "@/components/modals/paymentmodel/paymentmodel";
import { GrShare } from "react-icons/gr";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { toast } from "react-toastify";
import AllRideTable from "@/components/cards/AllRideTable";
import { collectCash } from "@/services/rideManagement";

const RodYaanDriverWalletPage = () => {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [selectedRides, setSelectedRides] = React.useState(new Set());
  const [selectedRideIDs, setSelectedRideIds] = React.useState(new Set());
  const [singleSelectedRide, setSingleSelectedRide] = useState(null);

  const { id } = useParams();
  const observerRef = useRef();
  const RideObserverRed = useRef();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [moreData, setMoreData] = useState(true);
  const [ridePage, CurrentRidePage] = useState(1);
  const [modalFor, setModalFor] = useState("single"); // 'all' or 'single'
  const [driverDetails, setDriverDetails] = useState();
  const [rodYaanCollectionAmount, setrodYaanCollectionAmount] = useState(0);
  const [earnedAmount, setEarnedAmount] = useState(0);
  const [walletPoints, setWalletPoints] = useState(0);
  const [totalRides, setTotalRide] = useState();
  const [otpSent, setOtpSent] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false); // New state for payment processing
  const [selectedInvoiceList, setSelectedInvoiceList] = useState([]);
  const [rideList, setRideList] = useState([]);
  const [upcomingList, setUpcomingList] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoiceType, setSelectedInvoiceType] = useState("");
  const [dateFilter, setDateFilter] = useState({
    startsAt: "",
    endsAt: "",
  });
  const getAmount = (key) => {
    return key;
  };
  const walletCards = [
    {
      label: "rodYaan colletions",
      amount: () => getAmount(rodYaanCollectionAmount),
      subtext: "Total Collections",
      icon: <BsWallet className="w-5 h-5" />,
      bgColor: "bg-[#FFC667]",
      iconColor: "text-white",
      textColor: "text-black",
      image: "/images/walletPoints.png",
    },
    {
      label: "Earned from rodYaan",
      amount: () => getAmount(earnedAmount),
      subtext: "Total Earnings",
      icon: <FaArrowTrendUp className="w-5 h-5" />,
      bgColor: "bg-[#C5FBD8]",
      iconColor: "text-[#2FAE5E]",
      textColor: "text-white",
      image: "/images/totalEarning.png",
    },
    {
      label: "Wallet Points",
      amount: () => getAmount(walletPoints),
      subtext: "Available Balance",
      icon: <BsCashCoin className="w-5 h-5" />,
      bgColor: "bg-[#F95900]",
      iconColor: "text-white",
      textColor: "text-white",
      image: "/images/totalCommission.png",
    },
  ];

  const lastCardRef = useCallback(
    (node) => {
      if (!hasMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [hasMore]
  );
  const lastCardRefForRide = useCallback(
    (node) => {
      if (!moreData) return;
      if (RideObserverRed.current) RideObserverRed.current.disconnect();

      RideObserverRed.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          CurrentRidePage((prev) => prev + 1);
        }
      });
      if (node) RideObserverRed.current.observe(node);
    },
    [moreData]
  );

  const fetchWalletTransactions = useCallback(
    async (pageNo) => {
      try {
        const params = {
          page: pageNo,
          limit: 10,
          startsAt: dateFilter.startsAt
            ? moment(dateFilter.startsAt).format()
            : null,
          endsAt: dateFilter.endsAt ? moment(dateFilter.endsAt).format() : null,
        };
        const response = await apiClient(
          "GET",
          `/rb_drivers/driver-details-with-collections/${id}`,
          params
        );
        let tempArr = [];
        if (response.status && response?.data) {
          setrodYaanCollectionAmount(response?.data?.rodYaan_collection);
          setWalletPoints(response?.data?.wallet_points);
          setEarnedAmount(response?.data?.earned_from_rodYaan);
          setTotalRide(response?.data?.total_collections_rides);
          setDriverDetails({
            ...response?.data?.driver_details,
            cabReg: response?.data?.driver_details?.cabs?.[0]?.cab_reg || "-",
          });
          if (
            response?.data?.invoices &&
            Array.isArray(response.data.invoices)
          ) {
            tempArr = response.data.invoices;
          }
        }
        if (pageNo === 1) {
          setTransactions(tempArr);
        } else {
          if (tempArr?.length > 0) {
            setTransactions((prev) => [...prev, ...tempArr]);
          } else {
            setHasMore(false);
          }
        }
      } catch (error) {
        console.log("Error fetching transactions:", error.message || error);
      }
    },
    [dateFilter.startsAt, dateFilter.endsAt]
  );

  const [selectedTab, setSelectedTab] = useState("All");

  const totalRidesCount = totalRides?.all || 0;

  // const filteredTransactions =
  //   selectedTab === "Settlement"
  //     ? transactions.filter((ride) => ride.collected_by_admin_status)
  //     : transactions;
  // new changes end here

  // State

  function getStatusClass(status) {
    const map = {
      assigned: "bg-blue-500 text-white",
      arrived: "bg-purple-500 text-white",
      // Started: "bg-green-500 text-white",
      confirmed: "bg-emerald-600 text-white",
      // Cancelled: "bg-red-500 text-white",
      // Pending: "bg-yellow-400 text-black",
    };

    return map[status] || "bg-gray-300 text-black";
  }

  function getBorderTopClass(status) {
    switch (status) {
      case "assigned":
        return "border-t-blue-500";

      case "arrived":
        return "border-t-purple-500";

      case "confirmed":
        return "border-t-green-500";

      case "Cancelled":
        return "border-t-red-500";

      default:
        return "border-t-gray-300";
    }
  }

  const filteredTransactions = (() => {
    if (statusFilter === "settled") {
      return transactions.filter((ride) => ride.collected_by_admin_status);
    }
    if (statusFilter === "unsettled") {
      return transactions.filter((ride) => !ride.collected_by_admin_status);
    }
    // All: no filter
    return transactions;
  })();

  const [totalSelectedFare, setTotalSelectedFare] = useState(0);

  // const [totalSelectedFare, setTotalSelectedFare] = useState(0);
  // const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const rideOptions = [
    { key: "all", label: `All Rides (${totalRides?.all || 0})` },
    { key: "upcoming", label: `Upcoming (${totalRides?.all || 0})` },
    { key: "complete", label: `Complete (${totalRides?.all || 0})` },
    { key: "cancelled", label: `Cancelled (${totalRides?.all || 0})` },
  ];

  const filterLabelMap = {
    all: `All (${totalRides?.delay ?? 0})`,
    settled: `Settled (${totalRides?.delay ?? 0})`,
    unsettled: `Unsettled (${totalRides?.delay ?? 0})`,
    delay: `Delay (${totalRides?.delay ?? 0})`,
    ontime: `On Time (${totalRides?.ontime ?? 0})`,
    upcoming: `Upcoming (${totalRides?.upcoming ?? 0})`,
  };

  // Calculate total fare when selectedRides or transactions change
  useEffect(() => {
    if (selectedRides.size > 0) calculateTotalSelectedFare();
  }, [selectedRides, transactions]);

  const calculateTotalSelectedFare = () => {
    const total = transactions
      .filter((t) => selectedRides.has(t.invoice_id))
      .reduce(
        (sum, t) =>
          sum + (t.booking?.price_details_json?.collected_by_driver || 0),
        0
      );
    setTotalSelectedFare((prev) => total);
  };

  // Checkbox onChange handler
  // const handleCheckboxChange = (e, ride, checked) => {
  //   e.preventDefault();
  //   const invoiceId = ride.invoice_id;
  //   const urid = ride?.booking?.urid;
  //   const invoiceType = ride?.invoice_type;
  //   setSelectedRides((prev) => {
  //     const newSet = new Set(prev);
  //     if (checked) {
  //       if(selectedInvoiceType) {
  //         if(selectedInvoiceType === invoiceType) {
  //           newSet.add(invoiceId);
  //         } else {
  //           toast.error("Cannot add both type of invoices");
  //         }
  //       } else {
  //         newSet.add(invoiceId);
  //         setSelectedInvoiceType(_prev => invoiceType);
  //       }
  //     } else {
  //       newSet.delete(invoiceId)
  //       if(!newSet.size) {
  //         setSelectedInvoiceType(prev=> "");
  //       }
  //     };
  //     return newSet;
  //   });

  //   setSelectedRideIds((prev) => {
  //     const newSet = new Set(prev);
  //     if (checked) {
  //       if(selectedInvoiceType) {
  //         if(selectedInvoiceType === invoiceType) {
  //           newSet.add(urid);
  //         } else {
  //           // toast.error("Cannot add both type of invoices");
  //         }
  //       } else {
  //         newSet.add(urid);
  //         setSelectedInvoiceType(_prev => invoiceType);
  //       }
  //     } else {
  //       newSet.delete(urid)
  //       if(!newSet.size) {
  //         setSelectedInvoiceType(prev=> "");
  //       }
  //     };
  //     return newSet;
  //   });
  // };

  // Checkbox onChange handler
  const handleCheckboxChange = (e, ride, checked) => {
    const invoiceId = ride.invoice_id;
    if (!ride.invoice_id) return;
    const urid = ride?.booking?.urid;
    const invoiceType = ride?.invoice_type;
    setSelectedRides((prev) => {
      const newSet = new Set(prev);
      if (checked) newSet.add(invoiceId);
      else newSet.delete(invoiceId);
      return newSet;
    });

    setSelectedRideIds((prev) => {
      const newSet = new Set(prev);
      if (checked) newSet.add(urid);
      else newSet.delete(urid);
      return newSet;
    });

    if (checked) {
      if (!selectedInvoiceType) {
        setSelectedInvoiceType((prev) => invoiceType);
      } else if (selectedInvoiceType !== invoiceType) {
        toast.error("Cannot set both type of Invoices");
        setSelectedRides((prev) => {
          const newSet = new Set(prev);
          newSet.delete(invoiceId);
          return newSet;
        });

        setSelectedRideIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(urid);
          return newSet;
        });
      }
    } else {
      let tempArr = Array.from(selectedRides);
      if (tempArr.length === 1) {
        setSelectedInvoiceType((_prev) => "");
      }
    }
  };

  const fetchNotCollectedRides = useCallback(
    async (pageNo) => {
      try {
        const params = {
          page: pageNo,
          cab_source: "rodYaan",
          driver_id: id,
          limit: 100,
        };
        const response = await apiClient(
          "GET",
          `/ride_management/getBookingListCashNotCollected`,
          params
        );
        let tempArr = [];
        if (response.status || response.success) {
          tempArr = response.data;
          if (pageNo === 1) {
            setRideList(tempArr);
          } else {
            if (tempArr?.length > 0) {
              setRideList((prev) => [...prev, ...tempArr]);
            } else {
              setHasMore(false);
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    [id]
  );
  useEffect(() => {
    fetchWalletTransactions(1).finally(() => setLoading(false));
  }, [dateFilter, fetchWalletTransactions]);

  useEffect(() => {
    if (!hasMore && page > 1) return;
    setLoading(true);
    if (page === 1) {
      setTransactions([]);
    }
    fetchWalletTransactions(page).finally(() => setLoading(false));
  }, [page, hasMore, fetchWalletTransactions]);

  useEffect(() => {
    if (!moreData && ridePage > 1) return;
    setLoading(true);
    if (ridePage === 1) {
      setRideList([]);
    }
    fetchNotCollectedRides(ridePage).finally(() => setLoading(false));
  }, [ridePage, moreData, fetchNotCollectedRides]);

  const addPayment = async (referenceNo, amount) => {
    try {
      if (!referenceNo) toast.error("Reference number is required");
      const response = await apiClient(
        "POST",
        `/rb_drivers/add-driver-payment`,
        {
          referenceNo: referenceNo,
          subMerchantId: "25",
          amount: amount,
          mobile: "UPIVPA",
          paymode: 9,
        }
      );
      console.log(response);
      const html = response?.data?.html;
      if (!html) throw new Error("Payment HTML missing");
      //document.open();
      document.write(html);
      document.close();
    } catch (error) {
      console.error("Payment initiation failed:", error);
    }
  };

  const handlePayNow = (mode, idx, invoiceType, urid, amount) => {
    setModalFor((prev) => mode);
    if (mode === "single") {
      setSelectedInvoiceType((prev) => invoiceType);
      setSingleSelectedRide(urid);
    }
    setPaymentAmount(amount);
    setPaymentModalOpen(true);
  };

  const handleSubmit = async (paymentMethod, data, invoiceType) => {
    try {
      if (invoiceType === "regular") {
        handleLeasePayment(paymentMethod, data);
      } else {
        handleFullTimePayment(paymentMethod, data);
      }
    } catch (error) {
      console.error("Payment processing failed", error);
    }
  };

  const handleLeasePayment = async (paymentMethod, data) => {
    setPaymentProcessing(true);
    const payload = {
      urid_list:
        modalFor === "single"
          ? [singleSelectedRide]
          : Array.from(selectedRideIDs),
      totals: { ...data },
      driver_id: id,
      cab_reg: driverDetails?.cabReg,
      payment_user_type: "accountant", //static
      source: "web",
    };
    const response = await apiClient(
      "POST",
      "/rb_drivers/send-collection-request-of-rb-driver",
      payload
    );
    if (response?.status || response?.success) {
      toast.success(response?.message || "Payment Initialized successfully");
      const transactionId = response?.data?.id;
      setTransactionDetails({ transactionId, data });
      if (!transactionId) {
        toast.error("Transaction ID missing");
        return;
      }
      if (paymentMethod === "online") {
        await handleOnlinePayment(transactionId, data?.finalAmount);
        setPaymentProcessing(false);
      } else if (paymentMethod === "cash") {
        await handleOfflinePayment();
        setPaymentProcessing(false);
      }
    }
  };

  const handleFullTimePayment = async (paymentMethod, data) => {
    setPaymentProcessing(true);
    const payload = {
      urid_list:
        modalFor === "single"
          ? [singleSelectedRide]
          : Array.from(selectedRideIDs),
      totals: { ...data },
      driver_id: id,
      source: "web",
    };
    const response = await apiClient(
      "POST",
      "/rb_drivers/add-fulltime-driver-payment-request",


      payload,
      {},
      true
    );
    if (response?.status || response?.success) {
      toast.success(response?.message || "Payment Initialized successfully");
      const transactionId = response?.data?.data?.id;
      setTransactionDetails({ transactionId, data });
      if (!transactionId) {
        toast.error("Transaction ID missing");
        return;
      }
      await handleOfflinePayment();
    }
  };

  const handleOnlinePayment = async (transactionId, amount) => {
    setPaymentModalOpen(false);
    await addPayment(transactionId, amount);
  };

  const handleOfflinePayment = async () => {
    try {
      const parsedData = JSON.parse(localStorage.getItem("user"));
      const user = parsedData?.user || parsedData;
      const adminMobile = user?.mobile_no || user?.mobile || "";

      if (!adminMobile) {
        toast.error("Admin mobile number not found. Please log in with OTP or update your profile.");
        return;
      }

      const response = await apiClient(
        "POST",
        "/rbac/send-otp-rodyaan",
        {
          mobile_no: adminMobile, //otp to admin mobile
        }
      );
      if (response?.status || response?.success) {
        setOtpSent(true);
        toast.success(response?.message || "OTP sent successfully");
      } else {
        toast.error(response?.message || "OTP sending failed");
      }
    } catch (error) {
      console.error("Offline payment processing failed", error);
    }
  };

  const verifyOtp = async (otp, invoiceType) => {
    try {
      const parsedData = JSON.parse(localStorage.getItem("user"));
      const user = parsedData?.user || parsedData;
      const response = await apiClient("POST", "/rbac/verify-otp-rod-yaan", {
        mobile_no: user?.mobile_no || user?.mobile || "",
        otp: otp,
      });
      if (response?.status || response?.success) {
        toast.success("OTP verified successfully");
        if (invoiceType === "regular") {
          if (transactionDetails?.data?.onlineAmount > 0) {
            await addPayment(
              transactionDetails?.transactionId,
              transactionDetails?.data?.onlineAmount
            );
          } else {
            await handleCashPaymentUpdate();
          }
        } else {
          await fullTimeDriverPaymentUpdate();
        }
      } else {
        toast.error(response?.message || "OTP verification failed");
      }
    } catch (error) {
      console.error("OTP verification failed", error);
    }
  };

  const fullTimeDriverPaymentUpdate = async () => {
    const res = await apiClient(
      "PUT",
      // `/rb_drivers/fulltime-driver-update-payment-status/${transactionDetails?.transactionId}`,
       `/rb_drivers/fulltime-driver-update-payment-status/${transactionDetails?.transactionId}`,
      {},
      {},
      true
    );
    if (res?.status || res?.success) {
      toast.success(res?.message || "Full time payment updated successfully");
      window.location.reload();
    } else {
      toast.error(res?.message || "Full time payment update failed");
    }
  };

  const handleCashPaymentUpdate = async () => {
    const res = await apiClient(
      "PUT",
      `/rb_drivers/update-cash-status-after-verify-otp/${transactionDetails?.transactionId}`
    );
    if (res?.status || res?.success) {
      toast.success(res?.message || "Cash payment updated successfully");
      window.location.reload();
    } else {
      toast.error(res?.message || "Cash payment update failed");
    }
  };

  const handleBackClick = () => {
    router.push(`/rbFleetManagement/rbDriver/driverDetails/${id}`);
  };

  const handleCashCollect = async (rideDetails) => {
    console.log(rideDetails);
    if (!rideDetails?.urid) return;
    try {
      const response = await collectCash(
        rideDetails.urid,
        rideDetails?.cab_details_json?.cab_source
      );
      if (response?.success) {
        toast.success("Cash collected successfully!");
        fetchNotCollectedRides(1).then(() => setLoading(false));
      } else {
        toast.error(response?.message || "Failed to collect cash");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchUpcomingRides = async (driverId) => {
    try {
      setLoading(true);

      const response = await apiClient(
        "GET",
        `/rb_drivers/getDriverRidesByStatus/${driverId}?status=upcoming`
      );

      setUpcomingList(response?.data || []);
    } catch (err) {
      console.log("Upcoming Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (statusFilter === "upcoming") {
  //     fetchUpcomingRides();
  //   }
  // }, [statusFilter]);

  useEffect(() => {
    if (statusFilter === "upcoming" && driverDetails?.id) {
      fetchUpcomingRides(driverDetails.id);
    }
  }, [statusFilter, driverDetails]);

  const formatTime = (timeString) => {
    if (!timeString) return "";

    const [h, m] = timeString.split(":");
    return `${h}h ${m}m`;
  };

  useEffect(() => {
    if (driverDetails?.driverName && id) {
      const label = driverDetails.driverName;

      sessionStorage.setItem(`label-driver-${id}`, label);

      if (window.updateBreadcrumbName) {
        window.updateBreadcrumbName(id, label);
      }
    }
  }, [driverDetails?.driverName, id]);

  return (
    <div className="bg-white min-h-screen py-0 px-1">
      {/* <div className="border mb-2">
        <div className="flex gap-6 items-center">
          <div
            className="flex items-center cursor-pointer"
            onClick={handleBackClick}
          >
            <IoIosArrowRoundBack className="font-bold text-black md:w-8 md:h-6" />
            <span className="text-[8px] font-semibold md:text-[12px]">
              Back to driver Form
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[10px] md:text-[18px] bg-gradient-to-r from-[#2563EB] to-[#9333EA] bg-clip-text text-transparent">
              rodYaan Driver Wallet
            </span>
            <span className="text-[6px] md:text-[9px] text-gray-500 ">
              Please select one of the following driver plans to begin earning
              with rodYaan
            </span>
          </div>
        </div>
      </div> */}

      {/* new change hererrereer */}
      <div
        className="rounded-lg border p-5 bg-cover"
        style={{ backgroundImage: "url('/images/rodYaanDriverWallet1.png')" }}
      >
        <span className="text-gray-700 text-[16px] font-bold">
          Wallet Overview
        </span>
        <div className="flex flex-col md:flex-row gap-4 w-full mt-2 overflow-auto">
          {/* <div className="w-full relative rounded-lg ">
            <Image
              src={driverDetails?.driverImage || "/images/profile.svg"}
              alt="Profile Picture"
              fill
              className=" border-2 border-gray-300"
            />
          </div> */}
          <div
            className="
              w-full
              p-4 sm:p-3
              border border-gray-500 rounded-lg bg-cover bg-center bg-right-center bg-[#EBFAFF]
            "
            style={{ backgroundImage: "url('/images/walletoverviewDiv1.png')" }}
          >
            <div>
              <div className="flex flex-row sm:flex-row gap-2 items-center sm:items-start">
                <div className="flex md:flex-row flex-col mb-1 gap-1 items-center sm:items-start">
                  <div className="relative w-16 h-16 flex-row rounded-full overflow-hidden border-2 border-gray-300">
                    <Image
                      src={driverDetails?.driverImage || "/images/profile.svg"}
                      alt="Profile Picture"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <span className="text-black px-2 py-2 font-bold text-[22px]">
                    {driverDetails?.driverName}

                    <span className="flex items-center py-2 font-semibold text-[10px] sm:text-[14px] text-gray-600">
                      <LuPhone className="text-black text-xs sm:text-[14px]" />
                      +91-{driverDetails?.driverMobile}
                    </span>

                    <div className="flex gap-2">
                      <span className="text-gray-500 text-[10px] py-1 sm:text-[14px]">
                        <LuCarTaxiFront className="text-black text-xs sm:text-[14px]" />
                      </span>
                      <span className="text-black font-bold text-[10px] sm:text-[14px]">
                        {driverDetails?.cabReg}
                      </span>
                    </div>
                  </span>
                </div>
              </div>
              {/* <div className="flex flex-row sm:flex-row gap-2 items-center sm:items-start"> */}

              {/* <div className="flex justify-center mt-3">
                <button className="w-full sm:w-[250px] bg-blue-600 hover:bg-blue-700 text-white text-[10px] sm:text-lg py-2 px-6 rounded-md transition">
                  Go to Profile
                </button>
              </div> */}
            </div>
          </div>

          {walletCards.map((card, idx) => (
            <div
              key={idx}
              className="w-full rounded-xl p-4 shadow-md flex flex-col justify-between bg-no-repeat bg-right-bottom bg-cover"
              style={{
                backgroundImage: `url(${card.image})`,
              }}
            >
              {/* Main Content */}
              <div className="flex flex-col sm:flex-row items-start md:items-start justify-between">
                <div className="relative z-10 flex flex-col justify-between">
                  {/* Icon + Label */}
                  <div className="flex items-center pt-4 gap-2">
                    <div
                      className={`${card?.bgColor} ${card?.iconColor} rounded-xl`}
                    >
                      {card.icon}
                    </div>
                    <span className={`text-lg font-medium ${card.textColor}`}>
                      {card.label}
                    </span>
                  </div>

                  {/* Amount + Subtext */}
                  <div className="pt-4 pl-3 space-y-1">
                    <h3 className={`text-2xl font-semibold ${card.textColor}`}>
                      ₹ {card.amount()}
                    </h3>
                    <p className={`text-sm ${card.textColor} opacity-80`}>
                      {card.subtext}
                    </p>
                  </div>
                </div>
                {card?.label === "rodYaan Commission" && (
                  <div className="my-4 sm:my-0">
                    <Image
                      src="/images/money.svg"
                      alt="Money"
                      width={120}
                      height={120}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedRides.size > 0 && (
        <div className="flex justify-end items-center mt-2">
          <button
            className="flex items-center gap-2 bg-gradient-to-r from-green-700 to-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow"
            onClick={() => handlePayNow("all")} // or pass needed params
          >
            Pay total:{" "}
            <span className="font-bold text-white text-lg">
              ₹{totalSelectedFare}
            </span>
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </button>
        </div>
      )}

      <div className="">
        <div className="bg-[#f5f8fd]">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center p-4 gap-3 md:gap-2 mt-5 rounded-xl border bg-white shadow-sm">
            {/* Left: Summary Title */}
            <div className="flex flex-col w-full md:w-auto">
              <div className="flex items-start gap-4">
                <span className="bg-blue-100 text-blue-700 p-2 rounded-full">
                  <HiOutlineClock className="w-5 h-5" />
                </span>
                <div className="flex flex-col">
                  <span className="text-gray-800 font-bold md:text-xl">
                    Total Collections & Rides
                  </span>
                  <span className="text-xs text-gray-400">
                    View and manage your recent transactions
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            {/* <div className="flex flex-row sm:flex-row gap-2  w-full">
              <div className="flex">
                <span className="border border-red-400  text-red-600 font-semibold p-1 md:p-3  rounded-xl bg-white text-sm md:text-lg">
                  Delay Ride: {totalRides?.delay_ride || 0}
                </span>
              </div>
              <div className="flex">
                <span className="border border-green-500 text-green-700 font-semibold p-1 md:p-3 rounded-xl bg-white text-sm md:text-lg">
                  On-Time Ride: {totalRides?.on_time_ride || 0}
                </span>
              </div>
            </div> */}

            {/* Date Filter */}
            {/* <div className="w-full md:w-auto flex items-center gap-2 bg-white text-gray-700 font-semibold text-sm mt-2 md:mt-0">
              <FiFilter className="text-gray-400 w-6 h-6" />
              <DateRangePicker
                onChange={(date) => {
                  setDateFilter((prev) => ({
                    startsAt: date.startDate
                      ? moment(date.startDate).format()
                      : null,
                    endsAt: date.endDate ? moment(date.endDate).format() : null,
                  }));
                }}
              />
            </div> */}

            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-white cursor-pointer select-none">
                <FiFilter className="text-gray-400 w-6 h-6" />
                <DateRangePicker
                  onChange={(date) => {
                    setDateFilter((prev) => ({
                      startsAt: date.startDate
                        ? moment(date.startDate).format()
                        : null,
                      endsAt: date.endDate
                        ? moment(date.endDate).format()
                        : null,
                    }));
                  }}
                />
              </div>

              {/* Search */}
              <div className="flex items-center gap-3 border border-blue-200 px-4 py-2 rounded-xl bg-white mt-2 md:mt-0 min-w-0 w-full md:w-[260px]">
                <FiSearch className="text-blue-500 w-7 h-7" />
                <input
                  type="text"
                  placeholder="Search by Booking ID"
                  className="outline-none border-none bg-transparent text-sm text-blue-500 w-full"
                />
              </div>

              <div ref={dropdownRef} className="relative w-fit">
                <button
                  className="flex items-center justify-center rounded-xl border bg-white px-5 py-2.5 shadow border-[#DCDCDC] text-gray-500"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <FiFilter className="w-6 h-6" />
                  <span className="px-2 font-semibold">
                    {filterLabelMap[statusFilter]}
                  </span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-52 text-sm bg-white rounded-lg shadow-lg border z-10">
                    <ul className="py-2">
                      <li>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-blue-100"
                          onClick={() => {
                            setStatusFilter("all");
                            setShowDropdown(false);
                          }}
                        >
                          All ({totalRides?.delay ?? 0})
                        </button>
                      </li>
                      <li>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-blue-100"
                          onClick={() => {
                            setStatusFilter("settled");
                            setShowDropdown(false);
                          }}
                        >
                          Settled ({totalRides?.delay ?? 0})
                        </button>
                      </li>

                      <li>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-blue-100"
                          onClick={() => {
                            setStatusFilter("unsettled");
                            setShowDropdown(false);
                          }}
                        >
                          Unsettled ({totalRides?.delay ?? 0})
                        </button>
                      </li>
                      <li>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-blue-100"
                          onClick={() => {
                            setStatusFilter("delay");
                            setShowDropdown(false);
                          }}
                        >
                          Delay ({totalRides?.delay ?? 0})
                        </button>
                      </li>
                      <li>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-blue-100"
                          onClick={() => {
                            setStatusFilter("ontime");
                            setShowDropdown(false);
                          }}
                        >
                          On Time ({totalRides?.ontime ?? 0})
                        </button>
                      </li>
                      <li>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-blue-100"
                          onClick={() => {
                            setStatusFilter("upcoming");
                            setShowDropdown(false);
                          }}
                        >
                          Upcoming ({totalRides?.upcoming ?? 0})
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {statusFilter === "upcoming" && (
            <div className="flex flex-col gap-4 mt-4">
              {upcomingList.length === 0 ? (
                <p className="text-center text-gray-500">No Upcoming Rides</p>
              ) : (
                upcomingList.map((ride) => (
                  <div
                    key={ride.id}
                    className={`border rounded-2xl px-4 py-3 bg-white shadow-sm border-t-2 ${getBorderTopClass(
                      ride.status
                    )}`}
                  >
                    {/* TOP ROW */}
                    <div className="flex flex-wrap justify-between py-2 items-start gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <MapPin className="text-red-500 w-5 h-5" />
                        <span className="font-semibold text-black text-base sm:text-lg">
                          {ride.source_city_name}
                        </span>

                        <span className="text-gray-500 font-bold">→</span>

                        <MapPin className="text-green-500 w-5 h-5" />
                        <span className="font-semibold text-black text-base sm:text-lg">
                          {ride.destination_city_name}
                        </span>

                        <AiOutlineExclamationCircle className="text-gray-400 ml-1" />
                      </div>

                      <span className="flex items-start px-1 py-1 rounded-full border border-[#000000] bg-white text-[#111827] font-bold text-xs">
                        {ride.price_details_json.estimated_time || "0"}m ·{" "}
                        {ride.price_details_json.estimated_km || "0"}km
                      </span>

                      <span
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusClass(
                          ride.status
                        )}`}
                      >
                        {ride.status}
                      </span>
                    </div>

                    {/* BOTTOM ROW */}
                    <div className="flex flex-wrap justify-between items-center mt-4 gap-4 text-xs text-gray-600">
                      {/* LEFT INFO */}
                      <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-500 font-medium gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} />
                          {ride.date ||
                            moment(ride.travel_date).format("DD MMM YYYY")}
                        </span>

                        <span className="flex items-center gap-1">
                          <Clock size={13} />
                          {ride.time ||
                            moment(ride.travel_date).format("hh:mm A")}
                        </span>

                        <span className="whitespace-nowrap">
                          ID: {ride.rideId || ride.urid}
                        </span>
                      </div>

                      {/* Upcoming Button */}
                      <button className="text-blue-600 text-sm hover:underline whitespace-nowrap">
                        Upcoming
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {statusFilter !== "upcoming" && (
            <>
              {rideList.length > 0 ? (
                <AllRideTable
                  custom={true}
                  rides={rideList || []}
                  checklastCardRef={lastCardRefForRide}
                  moreData={moreData}
                  handleCashCollect={handleCashCollect}
                />
              ) : (
                <>
                  <div className="flex flex-col py-5 w-full gap-4">
                    {filteredTransactions.map((ride, idx) => {
                      const isLastCard =
                        idx === filteredTransactions.length - 1;

                      // const isLastCard = idx === filteredTransactions.length - 1;
                      // const isUpcoming =
                      //   ride?.booking?.status?.toLowerCase() === "upcoming";
                      // const isUpcoming = ["upcoming", "upcoming ride"].includes(
                      //   ride?.booking?.status?.toLowerCase()
                      // );

                      return (
                        <div
                          key={ride.invoice_id}
                          ref={isLastCard ? lastCardRef : null}
                          className={`rounded-xl shadow bg-white flex flex-col px-2 sm:px-1 py-2 border-t-[1px] justify-between items-center ${
                            ride.collected_by_admin_status
                              ? "border-green-500"
                              : "border-red-500"
                          }`}
                        >
                          {/* Location/Details */}
                          <div className="flex flex-col sm:flex-row w-full justify-between items-center gap-2 ">
                            {/* <div className="w-full flex-1 basis-full sm:basis-3/7 flex flex-col justify-center border-gray-200 px-1 sm:px-2">
                        <div className="w-full justify-center border-gray-200 px-2">
                          <div className="flex items-center mb-4 whitespace-nowrap">
                            <MapPin className="text-red-500 w-3 h-3 md:w-6 md:h-6 text-sm sm:text-xl" />
                            <span className="font-semibold text-gray-800 text-xs sm:text-xl">
                              {
                                ride?.booking?.location_details?.source?.split(
                                  " "
                                )[0]
                              }
                            </span>
                            <span className="mx-2 text-blue-300 font-bold text-xs sm:text-xl select-none">
                              →
                            </span>
                            <MapPin className="text-green-500 w-3 h-3 md:w-6 md:h-6 text-sm sm:text-xl" />
                            <span className="font-semibold text-gray-800 text-xs sm:text-xl truncate mx-1">
                              {
                                ride?.booking?.location_details?.destination?.split(
                                  " "
                                )[0]
                              }
                            </span>
                            <span className="ml-2 text-gray-400 font-medium text-xs sm:text-lg">
                              <AiOutlineExclamationCircle  />
                            </span>
                             <span className="whitespace-nowrap font-bold pl-10">
                        ·{" "}
                        {(+ride?.booking?.price_details_json?.estimated_km ||
                          0) +
                          (+ride?.booking?.price_details_json?.extra_km ||
                            0)}{" "}
                        km
                      </span>
                          </div>
                          
                        </div>
                        <div className="flex w-full justify-start flex-wrap gap-2 sm:gap-6 text-xs sm:text-sm text-gray-500 font-medium">
                      <span className="flex items-center gap-2 whitespace-nowrap">
                        <Calendar size={14} />{" "}
                        {moment(ride?.booking?.booking_travel_date).format(
                          "DD-MM-YYYY"
                        )}
                      </span>
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        <Clock size={14} />{" "}
                        {moment(ride?.booking?.booking_travel_date).format(
                          "hh:mm A"
                        )}
                      </span>
                      <span className="text-gray-400 whitespace-nowrap">
                            Ride ID:{" "}
                            <button
                            onClick={() => alert(`Ride ID: ${ride?.booking?.urid}`)}
                             className="text-blue-600 hover:underline cursor-pointer"
                            >
                            {ride?.booking?.urid || "N/A"}
                           </button>
                      </span>
                     
                      <span className="text-gray-400 whitespace-nowrap">
                        Invoice ID:{" "}
                        {ride.collected_by_admin_status && ride.txnId
                          ? ride.txnId
                          : ride.invoice_id}
                      </span>
                      
                        </div>
                      </div> */}

                            <div className="w-full flex-1 basis-full sm:basis-3/7 flex flex-col justify-center border-gray-200 px-1 sm:px-2">
                              <div className="w-full flex items-center md:flex-row flex-col gap-5 justify-between px-2 mb-6">
                                <div className="flex items-center  justify-between flex-row gap-1 sm:gap-2">
                                  <MapPin className="text-red-500  w-6 h-6" />
                                  <span className="font-semibold text-gray-800 text-xl">
                                    {
                                      ride?.booking?.location_details?.source?.split(
                                        " "
                                      )[0]
                                    }
                                  </span>
                                  <span className="mx-2 text-blue-300 font-bold text-xl select-none">
                                    →
                                  </span>
                                  <MapPin className="text-green-500  w-6 h-6" />
                                  <span className="font-semibold text-gray-800 text-xl truncate mx-1">
                                    {
                                      ride?.booking?.location_details?.destination?.split(
                                        " "
                                      )[0]
                                    }
                                  </span>
                                  <span className="ml-2 text-gray-400 font-medium text-lg">
                                    <AiOutlineExclamationCircle />
                                  </span>
                                </div>
                                <span className="flex items-center  py-1">
                                  {/* Value pill */}
                                  <span className="flex items-start px-1 py-1 rounded-full border border-[#000000] bg-white text-[#111827] font-bold text-xs">
                                    {`${formatTime(
                                      ride?.booking?.price_details_json
                                        ?.estimated_time || 0
                                    )} · ${
                                      (+ride?.booking?.price_details_json
                                        ?.estimated_km || 0) +
                                      (+ride?.booking?.price_details_json
                                        ?.extra_km || 0)
                                    }km`}
                                  </span>
                                </span>
                                <span className="flex items-center  whitespace-nowrap font-bold ml-4 sm:ml-0 flex-shrink-0 gap-3">
                                  {/* ·{" "}
                              {(+ride?.booking?.price_details_json
                                ?.estimated_km || 0) +
                                (+ride?.booking?.price_details_json?.extra_km ||
                                  0)}{" "}
                              km */}
                                  <span className="bg-green-100 border border-[#15803D] text-green-700 rounded-full px-2 py-1 sm:px-3 sm:py-1 text-sm font-semibold flex items-center whitespace-nowrap overflow-hidden text-ellipsis">
                                    <CheckCircle size={18} className="mr-1" />
                                    {ride?.booking?.status}
                                  </span>
                                </span>
                              </div>

                              <div className="flex w-full flex-wrap gap-2 sm:gap-6 text-xs sm:text-sm text-gray-500 font-medium justify-start">
                                <span className="flex items-center gap-2 whitespace-nowrap">
                                  <Calendar size={14} />
                                  {moment(
                                    ride?.booking?.booking_travel_date
                                  ).format("DD-MM-YYYY")}
                                </span>
                                <span className="flex items-center gap-1 whitespace-nowrap">
                                  <Clock size={14} />
                                  {moment(
                                    ride?.booking?.booking_travel_date
                                  ).format("hh:mm A")}
                                </span>
                                <span className="text-gray-400 whitespace-nowrap">
                                  Ride ID:{" "}
                                  <button
                                    onClick={() => {
                                      if (ride?.booking?.urid) {
                                        window.open(
                                          `/ridesManagement/details?urid=${ride?.booking?.urid}`
                                        );
                                      }
                                    }}
                                    className="text-blue-600 hover:underline cursor-pointer"
                                  >
                                    {ride?.booking?.urid || "N/A"}
                                  </button>
                                </span>
                                <span className="text-gray-400 whitespace-nowrap">
                                  Invoice ID:{" "}
                                  {ride.collected_by_admin_status && ride.txnId
                                    ? ride.txnId
                                    : ride.invoice_id}
                                </span>
                                <span className="text-gray-400 whitespace-nowrap">
                                  Invoice Type: {ride.invoice_type}
                                </span>
                              </div>
                            </div>
                            {/* <div className="flex flex-col gap-1 px-1 py-1 sm:px-2 sm:py-2 border-gray-200"> */}
                            <div className="min-w-[120px] w-[120px] flex flex-col items-center justify-center">
                              <span className="text-[#15803D] whitespace-nowrap text-[16px]">
                                {ride.collected_by_admin_status
                                  ? "Collected"
                                  : "Collections"}{" "}
                                <div className="text-green-700 font-bold">
                                  ₹
                                  {
                                    ride?.booking?.price_details_json
                                      ?.collected_by_driver
                                  }
                                </div>
                              </span>
                            </div>

                            {/* <div className="min-w-0 flex-1 basis-full flex flex-row items-center border-gray-200 px-2 py-1 gap-2">

                        <span className="text-gray-400 font-medium text-xs md:text-sm">
                          Mode...
                          {ride?.booking?.mode && <span className="font-bold md:text-sm text-xs text-black ml-1">
                            Via {ride?.booking?.mode || "N/A"}
                          </span>}
                        </span>
                        <span
                          className="
                              px-2 sm:px-3 
                              py-0.5 sm:py-1
                              border border-[#CA3500] 
                              bg-orange-50 
                              text-[#CA3500] 
                              rounded-lg sm:rounded-xl 
                              font-semibold 
                              text-xs sm:text-sm
                              whitespace-nowrap
                            "
                        >
                          Cash: +₹{ride?.booking?.price_details_json?.cash || 0}
                        </span>
                        <span
                          className=" px-2 sm:px-3 
                            py-0.5 sm:py-1 border border-[#7ABA18] bg-green-50 text-[#7ABA18]   rounded-lg sm:rounded-xl 
                            font-semibold 
                            text-xs sm:text-sm
                            whitespace-nowrap"
                        >
                          Online: +₹
                          {ride?.booking?.price_details_json?.online || 0}
                        </span>
                      </div> */}
                            {/* Status + Actions Container */}
                            <div className="flex flex-row sm:flex-row gap-2 items-center md:justify-between">
                              {/* Status */}

                              {/* Actions */}
                              {/* <div className="flex-1 sm:flex-[0.4] flex flex-row-reverse items-center  justify-start gap-4 px-1"> */}
                              <div className=" flex flex-row-reverse  items-center gap-2 px-1 md:w-64">
                                {!ride.collected_by_admin_status &&
                                  ride.invoice_id && (
                                    <input
                                      type="checkbox"
                                      checked={selectedRides.has(
                                        ride.invoice_id
                                      )}
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          e,
                                          ride,
                                          e.target.checked
                                        )
                                      }
                                      className=" scale-125 accent-blue-500 cursor-pointer"
                                      aria-label="Select ride"
                                    />
                                  )}
                                <div className="min-w-[120px] w-[120px] flex justify-center">
                                  {!ride.collected_by_admin_status ? (
                                    <button
                                      onClick={() =>
                                        handlePayNow(
                                          "single",
                                          idx,
                                          ride?.invoice_type,
                                          ride?.booking?.urid,
                                          ride?.booking?.price_details_json
                                            ?.collected_by_driver
                                        )
                                      }
                                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg px-2 py-1 sm:px-4 sm:py-3 flex items-center  gap-2 shadow whitespace-nowrap"
                                    >
                                      {/* check where is problem */}
                                      Pay Now
                                      <GrShare />
                                    </button>
                                  ) : (
                                    // <Image
                                    //   src={"/images/paid.png"}
                                    //   alt="Paid"
                                    //   width={100}
                                    //   height={100}
                                    //   className="md:w-20 w-20 h-20 object-contain"
                                    //   aria-label="Paid stamp"
                                    // />
                                    <div className="min-w-[120px] w-[120px] ">
                                      <Image
                                        src={"/images/paid.png"}
                                        alt="Paid"
                                        width={40}
                                        height={40}
                                        className="w-20 h-20 object-contain"
                                        aria-label="Paid stamp"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {loading && transactions?.length == 0 && <CustomLoader />}
                  {loading && transactions?.length > 0 && <CustomLoader />}
                  {!hasMore && (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      🚫 No more transactions data to load
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      <PaymentModal
        open={paymentModalOpen}
        processing={paymentProcessing}
        verifyOtp={verifyOtp}
        invoiceType={selectedInvoiceType}
        showOtpField={otpSent}
        amount={modalFor === "single" ? paymentAmount : totalSelectedFare}
        onClose={() => setPaymentModalOpen(false)}
        onSubmitClick={handleSubmit}
      />
    </div>
  );
};

export default RodYaanDriverWalletPage;
