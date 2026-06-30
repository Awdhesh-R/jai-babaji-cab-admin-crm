
"use client";
import { useState } from "react";
import { HiOutlineBars4 } from "react-icons/hi2";
import { MdNavigateNext } from "react-icons/md";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { FaPlus } from "react-icons/fa6";
import SalesAndCollections from "@/components/modals/loginPageform/SalesAndCollections";

import {
    Calendar,
    Car,
    Users,
    Plus,
    Globe,
    MapPin,
    DollarSign,
    LayoutGrid,
    Clock,
    AlertCircle,
    Activity,
    ChevronRight,
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";
import { TrendingUp } from "lucide-react";
import FleetCommandCenter from "@/components/modals/loginPageform/FleetCommandCenter";

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

const PageFive = () => {
    const [active, setActive] = useState("Booking");

   

    return (
        <div className="flex gap-0">

            
            <FleetCommandCenter />
            <SalesAndCollections/>

        </div >
    );
}

export default PageFive