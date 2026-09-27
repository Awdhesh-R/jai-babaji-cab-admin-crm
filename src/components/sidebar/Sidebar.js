"use client";
import { HiOutlineBars4 } from "react-icons/hi2";
import { RiRefund2Line } from "react-icons/ri";
import { MdNavigateNext } from "react-icons/md";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { FaGears, FaPlus, FaUserGroup } from "react-icons/fa6";
import SalesAndCollections from "@/components/modals/loginPageform/SalesAndCollections";
import {
  Home,
  User,
  Settings,
  LogOut,
  CalendarClock,
  CalendarCog,
} from "lucide-react";
import { MdLeaderboard } from "react-icons/md";
import { FaRegUser, FaWhatsapp, FaCar } from "react-icons/fa";
import { MdOutlineAccountBalance } from "react-icons/md";
import { FaUsersGear } from "react-icons/fa6";
import { GrTransaction } from "react-icons/gr";
import { MdManageAccounts } from "react-icons/md";
import { LuClipboardList } from "react-icons/lu";
import { usePathname } from "next/navigation";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { RiGasStationLine } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { IoLogoWhatsapp } from "react-icons/io5";
import { LuListCheck } from "react-icons/lu";
import { FaCircleUser } from "react-icons/fa6";
import { FaCity } from "react-icons/fa";

// import Link from "next/link";
import {
  Calendar,
  Car,
  Users,
  Plus,
  Globe,
  MapPin,
  DollarSign,
  LayoutGrid,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSidebar } from "./SidebarContext";
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiPieChart,
  FiChevronDown,
  FiChevronUp,
  FiLayout,
  FiTarget,
  FiBarChart,
} from "react-icons/fi";
import Link from "next/link";
import { apiClient } from "@/app/lib/apiClient";
import { useRouter } from "next/navigation";
import { MdOutlinePayment } from "react-icons/md";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";

const revenueData = [
  { month: "Jan", value: 4000 },
  { month: "Feb", value: 3000 },
  { month: "Mar", value: 5000 },
  { month: "Apr", value: 4500 },
  { month: "May", value: 6000 },
  { month: "Jun", value: 5200 },
];

const ridesData = [
  { month: "Jan", rides: 220 },
  { month: "Feb", rides: 160 },
  { month: "Mar", rides: 300 },
  { month: "Apr", rides: 280 },
  { month: "May", rides: 380 },
  { month: "Jun", rides: 340 },
];

const iconMap = {
  FiHome: <FiHome />,
  FiUsers: <FiUsers />,
  FiSettings: <FiSettings />,
  FiPieChart: <FiPieChart />,
  FiLayout: <FiLayout />,
  FiTarget: <FiTarget />,
  FiBarChart: <FiBarChart />,
};
import { setHeader } from "@/redux/features/headerSlice";
import { useDispatch } from "react-redux";
import Image from "next/image";
export default function Sidebar() {
  const [active, setActive] = useState("");
  const [userData, setUserData] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const [openSubMenu, setOpenSubMenu] = useState(null);

  useEffect(() => {
    const path = window.location.pathname;
    // const currentItem = menuItems.find(item => item.url === path);
    let currentItem = "";
    menuItems.map((item) => {
      if (item.subItems) {
        item.subItems.find((child) => {
          if (child.url === path) {
            console.log(currentItem);
            currentItem = child;
            setOpenMenu((prev) => item.name);
          }
        });
      } else {
        if (item.url === path) {
          currentItem = item;
        }
      }
    });
    if (currentItem) {
      setActive(currentItem.name);
      dispatch(
        setHeader({
          title: currentItem.title,
          subtitle: currentItem.subtitle,
        }),
      );
    }
    const user = localStorage.getItem("user");
    if (user && user !== "undefined") {
      try {
        const userData = JSON.parse(user);
        // console.log("User Data:", userData);
        if (userData && (userData.user || userData.name)) {
          setUserData(userData.user || userData);
        } else {
          // console.log("User name not found in the user data.");
          setUserData(null);
        }
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        setUserData(null);
      }
    } else {
      setUserData(null);
    }
  }, []);

  const dispatch = useDispatch();

  // const updateHeader = () => {
  //   dispatch(setHeader({
  //     title: 'My Custom Title',
  //     subtitle: 'Custom subtitle here'
  //   }));
  // };

  const handleClick = () => {
    sessionStorage.removeItem("nav-history");

    // 🧹 clear sidebar-root
    sessionStorage.removeItem("sidebar-root");

    setActive("");
    dispatch(
      setHeader({
        title: "rodYaan Fleet",
        subtitle: "Real-time fleet management and analytics",
      }),
    );
    router.push("/dashboard");
    // ya dusra route: router.push("/auth/signin/pageFive");
  };

  useEffect(() => {
    if (pathname === "/dashboard") {
      setActive("");
      setOpenMenu(null);
    }
  }, [pathname]);

  const menuItems = [
    {
      name: "All Booking",
      icon: <Calendar className="w-5 h-5" />,
      url: "/ridesManagement/allRides",
      title: "Booking Status",
      subtitle: "Real-time Booking Status Analysis",
    },
    {
      name: "All Real Time Booking",
      icon: <Calendar className="w-5 h-5" />,
      url: "/ridesManagement/allRealTimeBooking",
      title: "Booking Status",
      subtitle: "Real-time Booking Status Analysis",
    },
    {
      name: "Lead List",
      icon: <MdLeaderboard className="w-5 h-5" />,
      url: "/fleetManagement/leadList",
      title: "Lead List Management",
      subtitle: "",
    },
    {
      name: "Operations Booking",
      icon: <CalendarCog className="w-5 h-5" />,
      url: "/ridesManagement/allOperationsRides",
      title: "Operation Booking Status",
      subtitle: "Operations Booking Analysis",
    },
    {
      name: "RB Fleet",
      icon: <Car className="w-5 h-5" />,
      url: "/rbFleetManagement/rbCabs/RbCabs",
      title: "RB Cabs",
      subtitle: "All RB Cabs List",
    },
    {
      name: "Market Fleet",
      icon: <LayoutGrid className="w-5 h-5" />,
      url: "/fleetManagement/fleetDashboards",
      title: "Market Fleet",
      subtitle: "Real-time Market Fleet Analysis",
    },

    {
      name: "RB Drivers",
      icon: <Users className="w-5 h-5" />,
      url: "/rbFleetManagement/rbDriver/driverLists",
      title: "RB Drivers",
      subtitle: "All RB Drivers List",
    },
    {
      name: "Driver Due List",
      icon: <LuClipboardList className="w-5 h-5" />,
      url: "/driverForm/driverDues",
      title: "Driver Due List",
      subtitle: "All RB Drivers List",
    },
    {
      name: "City Management",
      icon: <FaCity className="w-5 h-5" />,
      url: "/rbFleetManagement/cityList",
      title: "City Management List",
      subtitle: "All City List",
    },
    {
      name: "Full time Driver Transaction List",
      icon: <LuClipboardList className="w-5 h-5" />,
      url: "/driverForm/FullTimeDriverDues",
      title: "Full Time Driver Transaction",
      subtitle: "Full Time RB Drivers Transaction List",
    },
    {
      name: "Add RB Cabs",
      icon: <Plus className="w-5 h-5" />,
      url: "/rbFleetManagement/rbCabs/AddCabs",
      title: "Add RB Cab",
      subtitle: "You can add a new Cab",
    },
    {
      name: "Add RB Drivers",
      icon: <Users className="w-5 h-5" />,
      url: "/driverForm/DriverOnBoardingMain",
      title: "Add RB Driver",
      subtitle: "You can add a driver details",
    },
        {
      name: "Add Fleet Operator",
      icon: <Users className="w-5 h-5" />,
      url: "/fleetManagement/FleetOperator",
      title: "Add Fleet Operator",
      subtitle: "You can add a driver details",
    },
    {
      name: "User Management",
      icon: <FaRegUser className="w-5 h-5" />,
      url: "/fleetManagement/customerList",
      title: "User Management",
      subtitle: "You can see User List",
      // subItems: [{
      //   name: "User List",
      //   icon : <FaRegUser className="w-5 h-5" />,
      //   url: '/fleetManagement/customerList', title: 'User Management',
      //   subtitle: 'You can see User List'
      // },{
      //   name: "Whatsapp Notification",
      //   icon : <FaWhatsapp className="w-5 h-5" />,
      //   url: '/userManagement/whatsAppNotifications', title: 'Whatsapp Notifications',
      //   subtitle: 'You can see Notification List'
      // }]
    },
    //   {
    //   name: "Payment History", icon:   <MdOutlinePayment className="w-5 h-5"  />, url: '/fleetManagement/paymentHistory', title: 'Payment History',
    //   subtitle: 'You can see the Payment History'
    // },
    //       {
    //   name: "Driver Transaction history", icon:   <GrTransaction  className="w-5 h-5"  />, url: '/driverForm/transaction', title: 'Driver Transaction history',
    //   subtitle: 'You can see the Driver Transaction history'
    // },
    //    {
    //   name: "Account Cash Flow", icon:   <MdOutlineAccountBalance className="w-5 h-5"  />, url: '/fleetManagement/AccountCashFlow', title: 'Account Cash Flow',
    //   subtitle: 'You can see the Account Cash Flow'
    // },
    {
      name: "Our Clusters & City",
      icon: <Globe className="w-5 h-5" />,
      url: "/clusterCity/addCluster",
      title: "Our Clusters & City",
      subtitle: "Manage clusters and service distances by city",
      allowedId: [1, 3, 36],
    },
    {
      name: "Real-Time Cab Locations",
      icon: <MapPin className="w-5 h-5" />,
      url: "/rbCabLocations",
      title: "Real Time Cab Locations",
      subtitle: "Real-Time Cab Locations Analysis",
    },
    // {
    //   name: "Real-Time RB Operators Fleet", icon: <MapPin className="w-5 h-5" />, url: '/ridesManagement/allRides', title: 'RB Operators Fleet',
    //   subtitle: 'Real-Time RB Operators Fleet Analysis'
    // },
    // {
    //   name: "Revenue & Rides", icon: <DollarSign className="w-5 h-5" />, url: '/revenueRides/salesAndCollections', title: 'Revenue & Rides',
    //   subtitle: 'Revenue & Rides Analysis'
    // },
    //  {
    //   name: "Role Management", icon:  <FaUsersGear className="w-5 h-5" />, url: '/roleManagement/roleAdmin', title: 'Role Management',
    //   subtitle: ' Manage user roles and permissions with precision'
    // },
    {
      name: "Operations Management",
      icon: <FaGears className="w-5 h-5" />,
      subItems: [
        {
          name: "Next Availability",
          icon: <Car className="w-5 h-5" />,
          url: "/operations/nextAvailability",
          title: "Next Availability",
          subtitle: "Next Available Car Location",
          // },{
          //   name: "Market Booking",
          //   icon: <Calendar className="w-5 h-5" />,
          //   url: '/operations/marketBookingList',
          //   title: 'Market Booking',
          //   subtitle: 'Booking list for market cabs',
          // },{
          //   name: "Auto Confirm Booking",
          //   icon: <Calendar className="w-5 h-5" />,
          //   url: '/operations/autoConfirmBookingList',
          //   title: 'Auto Confirm Booking List',
          //   subtitle: 'Auto Confirm Booking list',
          // },{
          //   name: "Last 24 Hrs Booking",
          //   icon: <CalendarClock className="w-5 h-5" />,
          //   url: '/operations/Last24HrsBookingList',
          //   title: 'Last 24 Hrs Booking List',
          //   subtitle: 'Last 24 Hrs Booking list',
        },
        {
          name: "Next Availability Map",
          icon: <Car className="w-5 h-5" />,
          url: "/nextAvailableCabLocations",
          title: "Next Availability Map",
          subtitle: "Next Available Car Location Map",
        },
      ],
    },
    {
      name: "Operator Ride Request",
      icon: <FaCircleUser className="w-5 h-5" />,
      url: "/fleetManagement/OperatorRiderequest",
      title: "Operaotr Ride Request",
      subtitle: "Operator Ride Request List",
    },
    {
      name: "Finance",
      icon: <RiMoneyRupeeCircleFill className="w-6 h-6" />,
      subItems: [
        {
          name: "Revenue & Ride",
          icon: <DollarSign className="w-5 h-5" />,
          url: "/revenueRides/salesAndCollections",
          title: "Employee Activity",
          subtitle: "Track all employee actions",
        },
        {
          name: "Payment History",
          icon: <MdOutlinePayment className="w-5 h-5" />,
          url: "/fleetManagement/paymentHistory",
          title: "Role Management",
          subtitle: "Manage user roles and permissions",
        },
        {
          name: "Account Cash Flow",
          icon: <MdOutlineAccountBalance className="w-5 h-5" />,
          url: "/fleetManagement/AccountCashFlow",
          title: "Employee Activity",
          subtitle: "Track all employee actions",
        },
        {
          name: "Ride Transaction History",
          icon: <GrTransaction className="w-5 h-5" />,
          url: "/fleetManagement/rideTransactionHistory",
          title: "Role Management",
          subtitle: "Manage user roles and permissions",
        },
        {
          name: "Driver Transaction History",
          icon: <GrTransaction className="w-5 h-5" />,
          url: "/driverForm/transaction",
          title: "Employee Activity",
          subtitle: "Track all employee actions",
        },
        {
          name: "Fuel Transaction History",
          icon: <BsFillFuelPumpFill className="w-4 h-4" />,
          url: "/fleetManagement/fuelTransactionHistory",
          title: "Role Management",
          subtitle: "Manage user roles and permissions",
        },
      ],
    },
    {
      name: "Admin",
      icon: <MdOutlineAdminPanelSettings className="w-6 h-6" />,
      subItems: [
        {
          name: "Razorpay Refund History",
          icon: <RiRefund2Line className="w-5 h-5" />,
          url: "/fleetManagement/razorPayRefund",
          title: "Razorpay Refund History",
          subtitle: "Razorpay Refund History ",
        },
        {
          name: "Cng station",
          icon: <RiGasStationLine className="w-5 h-5" />,
          url: "/rbFleetManagement/cngStation/CabLocation",
          title: "CNG station",
          subtitle: "Track all cng Station",
        },
        {
          name: "WhatsApp Message  List",
          icon: <IoLogoWhatsapp className="w-5 h-5" />,
          url: "/userManagement/whatsAppNotifications",
          title: "Role Management",
          subtitle: "Manage user roles and permissions",
        },
        {
          name: "Employee Management",
          icon: <MdManageAccounts className="w-5 h-5" />,
          subItems: [
            {
              name: "Employee Activity",
              icon: <FaUserGroup className="w-5 h-5" />,
              url: "/fleetManagement/EmployeeActivityHistory",
              title: "Employee Activity",
              subtitle: "Track all employee actions",
            },
            {
              name: "Role Management",
              icon: <FaUsersGear className="w-5 h-5" />,
              url: "/roleManagement/roleAdmin",
              title: "Role Management",
              subtitle: "Manage user roles and permissions",
            },
          ],
        },
        {
          name: "RB Cab callback History",
          icon: <FaCar className="w-5 h-5" />,
          url: "/callManagement",
          title: "Call Management",
          subtitle: "Manage all call related settings",
        },
        {
          name: "Driver Complaints List",
          icon: <LuListCheck className="w-5 h-5" />,
          url: "/rbFleetManagement/rbDriver/driverComplainList",
        },
        {
          name: "Setting",
          icon: <IoMdSettings className="w-5 h-5" />,
          url: "",
          title: "setting",
          subtitle: "",
        },
      ],
    },
    {
      name: "Logout",
      icon: <LogOut className="w-5 h-5" />,
      url: "/auth/signout",
      title: "Logout",
    },
  ];

  const { expanded, setExpanded } = useSidebar();
  const [openMenu, setOpenMenu] = useState(null);
  const [navItems, setNavItems] = useState([]);
  //const BASE_URL = "http://localhost:3000/";
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  // const toggleMenu = (text) => { setOpenMenu((prev) => (prev === text ? null : text)); };
  const toggleMenu = (text) => {
    setOpenMenu((prev) => (prev === text ? null : text));
    setOpenSubMenu(null); // 🔥 sub-menu auto close
  };

  useEffect(() => {
    const navContents = async () => {
      try {
        const data = await apiClient(
          "GET",
          "/rbac/get-all-module-and-submodule-list-by-user/:userId",
        );
        // console.log("module and sub-mdoule data", data);
        const formatted = data?.data?.map((mod) => ({
          name: mod?.name,
          slug_url: `${mod.slug_url || ""}`,
          icon: iconMap[mod?.icon] || <FiLayout />,
          submodules:
            mod?.submodules?.map((sub) => ({
              name: sub?.name,
              slug_url: `${sub.slug_url || ""}`,
            })) || [],
        }));
        // console.log(formatted);

        setNavItems(formatted);
      } catch (error) {
        console.log(error);
      }
    };
    // navContents();
  }, []);

  const toggleSubMenu = (name) => {
    setOpenSubMenu((prev) => (prev === name ? null : name));
  };

  // const isChildActive = (sub) => {
  //   return sub.subItems?.some(child => child.name === active);
  // };

  const isChildActive = (sub) => {
    if (openSubMenu !== sub.name) return false;
    return sub.subItems?.some((child) => child.name === active);
  };

  // useEffect(() => {
  //   if (userData?.id) {
  //     localStorage.setItem("admin_id", String(userData.id));
  //     console.log("SAVED ADMIN ID:", userData.id);
  //   }
  // }, [userData]);

  useEffect(() => {
    if (userData?.id) {
      localStorage.setItem("admin_id", String(userData.id));
      // console.log("SAVED ADMIN ID:", userData.id);
    }
  }, [userData]);

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-20 transition-all duration-300 
    ${!expanded ? "w-[350px]" : "w-[80px]"} bg-white shadow-md`}
    >
      <div className="h-screen overflow-hidden w-full flex flex-col justify-between">
        <nav className="relative mt-2 space-y-1 px-2 justify-start items-center">
          <div className="flex ">
            {!expanded && (
              <button onClick={handleClick} className="px-6 py-4">
                <div className="flex gap-2">
                  <div>
                    <span className="font-bold text-black  text-2xl">rod</span>
                    <span className="text-2xl font-bold bg-gradient-to-br from-[#FFC403] to-[#e96303] bg-clip-text text-transparent">
                      Yaan
                    </span>
                  </div>
                  <span className="font-bold text-black  text-2xl">
                    Dashboard
                  </span>
                </div>
                <span className="text-[15px] text-gray-600">
                  Modern Fleet Management
                </span>
              </button>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className={`items-center ${
                !expanded ? "ml-auto" : "ml-4"
              } justify-center py-6 pr-3`}
            >
              <HiOutlineBars4 className=" text-black h-6 w-6" />
            </button>
          </div>
          <div className="h-[70vh] overflow-y-auto">
            {menuItems
              .filter((route) => {
                if (route.allowedId) {
                  if (route.allowedId.includes(Number(userData?.id))) {
                    return true;
                  }
                  return false;
                }
                return true;
              })
              .map((item) => (
                <div key={item.name}>
                  {/* If item has subItems */}
                  {item.subItems ? (
                    <div>
                      <button
                        onClick={() => toggleMenu(item.name)}
                        className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-all
                      ${
                        openMenu === item.name
                          ? "bg-green-100 text-green-700 border-l-4 border-green-500 shadow-sm"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      >
                        {item.icon}
                        {!expanded && (
                          <span className="text-sm font-medium">
                            {item.name}
                          </span>
                        )}
                        {!expanded && (
                          <div className="ml-auto">
                            {openMenu === item.name ? (
                              <MdKeyboardArrowDown />
                            ) : (
                              <MdKeyboardArrowRight />
                            )}
                          </div>
                        )}
                      </button>

                      {/* Sub-menu items */}
                      {openMenu === item.name && (
                        <div
                          className={`flex flex-col gap-2 mt-2 ${
                            !expanded ? "ml-10" : ""
                          }`}
                        >
                          {item.subItems
                            .filter((route) => {
                              if (route.allowedId) {
                                if (route.allowedId.includes(Number(userData?.id))) {
                                  return true;
                                }
                                return false;
                              }
                              return true;
                            })

                            .map((sub) => (
                              <div key={sub.name}>
                                {sub.subItems ? (
                                  <>
                                    {/* LEVEL 2 BUTTON */}
                                    <button
                                      onClick={() => toggleSubMenu(sub.name)}
                                      className={`flex items-center gap-3 w-full px-4 py-3 rounded-md  transition-all
    ${
      openSubMenu === sub.name || isChildActive(sub)
        ? "bg-blue-100 text-blue-700 border-l-4 border-blue-500 shadow-sm"
        : "text-gray-700 hover:bg-gray-100"
    }`}
                                    >
                                      {sub.icon}
                                      {!expanded && <span>{sub.name}</span>}
                                      {!expanded && (
                                        <div className="ml-auto">
                                          {openSubMenu === sub.name ? (
                                            <MdKeyboardArrowDown />
                                          ) : (
                                            <MdKeyboardArrowRight />
                                          )}
                                        </div>
                                      )}
                                    </button>

                                    {/* LEVEL 3 ITEMS */}
                                    {openSubMenu === sub.name && (
                                      <div className="ml-6 flex flex-col gap-2">
                                        {sub.subItems.map((child) => (
                                          <Link
                                            key={child.name}
                                            href={child.url}
                                            onClick={() => {
                                              sessionStorage.setItem(
                                                "sidebar-root",
                                                "true",
                                              );
                                              setActive(child.name);
                                              dispatch(
                                                setHeader({
                                                  title: child.title,
                                                  subtitle: child.subtitle,
                                                }),
                                              );
                                            }}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-md mt-2  transition-all
  ${
    active === child.name
      ? "bg-red-100 text-red-700 border-l-4 border-red-500 shadow-sm"
      : "text-gray-700 hover:bg-gray-100"
  }`}
                                          >
                                            {child.icon}
                                            {!expanded && (
                                              <span className="text-sm font-medium">
                                                {child.name}
                                              </span>
                                            )}
                                            {!expanded && (
                                              <div className="ml-auto">
                                                <MdNavigateNext />
                                              </div>
                                            )}
                                          </Link>
                                        ))}
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  /* NORMAL SUB ITEM */

                                  <Link
                                    href={sub.url}
                                    onClick={() => {
                                      sessionStorage.setItem(
                                        "sidebar-root",
                                        "true",
                                      );
                                      setActive(sub.name);
                                      setOpenSubMenu(null);
                                      dispatch(
                                        setHeader({
                                          title: sub.title,
                                          subtitle: sub.subtitle,
                                        }),
                                      );
                                    }}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all
    ${
      active === sub.name
        ? "bg-blue-100 text-blue-700 border-l-4 border-blue-500 shadow-sm"
        : "text-gray-700 hover:bg-gray-100"
    }`}
                                  >
                                    {sub.icon}
                                    {!expanded && (
                                      <span className="text-sm font-medium">
                                        {sub.name}
                                      </span>
                                    )}
                                  </Link>
                                )}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.url}
                      target={
                        item.name === "Real-Time Cab Locations"
                          ? "_blank"
                          : "_self"
                      }
                      onClick={() => {
                        sessionStorage.setItem("sidebar-root");
                        setActive(item.name);
                        setOpenMenu(null);
                        dispatch(
                          setHeader({
                            title: item.title,
                            subtitle: item.subtitle,
                          }),
                        );
                      }}
                      className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-all
                        ${
                          active === item.name
                            ? "bg-green-100 text-green-700 border-l-4 border-green-500 shadow-sm"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      {item.icon}
                      {!expanded && (
                        <span className="text-sm font-medium">{item.name}</span>
                      )}
                      {!expanded && (
                        <div className="ml-auto">
                          <MdNavigateNext />
                        </div>
                      )}
                    </Link>
                  )}
                </div>
              ))}
          </div>
        </nav>
        <div className="absolute bottom-0 pr-2 w-full ">
          <div className="bg-white shadow rounded-xl py-3 px-5 flex items-center justify-start gap-3">
            <div
              className={`${
                expanded ? "h-8 w-8" : "h-12 w-12"
              } rounded-full bg-gray-200`}
            >
              {userData?.profile_image && (
                <Image
                  src={userData?.profile_image || "/default-profile.png"}
                  alt="Profile Picture"
                  layout="fill"
                  className="rounded-full"
                />
              )}
            </div>
            {!expanded && (
              <div className="flex flex-col">
                <strong className="text-sm font-medium text-black">
                  {userData?.name || "Admin User"}
                </strong>
                <p className="text-xs text-gray-500">
                  {userData?.email || "admin@crm.com"}
                </p>
                <p className="text-xs text-gray-500">
                  {userData?.mobile_no || "-"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
