"use client";

import React, { useState } from 'react';

import { useDispatch, useSelector } from "react-redux";
import { setPage, setCabId } from "@/redux/features/rbCabMainSlice";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

const Page = () => {   // 👈 Capital letter
    const dispatch = useDispatch();
    // const { page } = useSelector((state) => state.rbCabMain);
    // console.log("page ka name jo hai: ", page)
    const router = useRouter();

    useEffect(() => {
        
        let targetUrl = "/rbFleetManagement/rbCabs/myCabs";
        // if (!page) return;
        // alert("target Url", targetUrl);
        // console.log("Current Page from Redux:", page);

        // switch (page) {
        //     case "CabOverview":
        //         targetUrl = "/rbFleetManagement/rbCabs/CabOverView";
        //         break;
        //     case "AddRbCabs":
        //         targetUrl = "/rbFleetManagement/rbCabs/AddCabs";
        //         break;
        //     default:
        //         targetUrl = "/rbFleetManagement/rbCabs/myCabs";
        // }

        router.push(targetUrl);
    }, [router]);

  

    return (
        null
    )
}

export default Page;   // 👈 yaha bhi capital
