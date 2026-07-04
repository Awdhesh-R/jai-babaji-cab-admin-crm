'use client';
import { motion, useMotionValue } from 'framer-motion';
import { useRef, useState } from 'react';
import '../ui/AnimatedButton.css';
import { LuCircleCheckBig } from "react-icons/lu";
// import PageOnec from '@/components/modals/loginPageform/PageOne';
import PageOne from '@/components/modals/loginPageform/PageOne';
import PageTwo from '../modals/loginPageform/PageTwo';

import constant from '@/helpers/constant';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/app/lib/apiClient';
import Cookies from 'js-cookie';
import PageThree from '../modals/loginPageform/PageThree';
import PageFour from '../modals/loginPageform/PageFour';
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPage, resetPage } from '@/redux/features/signInPageSlice';


export default function LoginForm() {
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.signInPage.currentPage);
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  // const [loading, setLoading] = useState(false);
  // const cardRef = useRef(null);
  // const mouseX = useMotionValue(0);
  // const mouseY = useMotionValue(0);
  // const router = useRouter();
  // console.log(constant.AUTHAPI.POSTURL.adminLogin);

  // const handleMouseMove = (e) => {
  //   const { left, top } = cardRef.current.getBoundingClientRect();
  //   const x = e.clientX - left;
  //   const y = e.clientY - top;
  //   mouseX.set(x);
  //   mouseY.set(y);
  // };

  // const loginUser = async (e) => {
  //   e.preventDefault();

  //   if (!user.email.trim() || !user.password.trim()) {
  //     return alert('Please enter both email and password');
  //   }

  //   try {
  //     setLoading(true);

  //     const data = await apiClient('POST', '/rbac/login', user);

  //     if (data.success) {
  //       // Store in localStorage 
        // localStorage.setItem('token', data.data.token);
        // localStorage.setItem('user', JSON.stringify(data.data));

  //       // Store in cookies (for middleware/server-side access 7 days)
        // Cookies.set('token', data.data.token, { expires: 7 });

        // // Redirect to dashboard
        // router.push('/dashboard');
  //     } else {
  //       alert(data.message);
  //     }
  //   } catch (error) {
  //     console.error('Login Error:', error.message);
  //     alert(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (

    <div
      className="relative h-screen w-full"
      style={{
        backgroundImage: "url('/Login_page_bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className='absolute  left-16 bottom-24'>
        <span className="text-white items-center font-bold text-[28px] ">
          Join Thousands of Riders & Drivers that<br></br>
        </span>
        <span className="text-white items-center font-bold text-[28px] ">
          Trust jaiBabajiCab.<br></br>
        </span>
        <div className="flex items-center gap-6 text-white mt-2">
          <span className="flex items-center gap-2">
            <LuCircleCheckBig />
            Manage Customers & Drivers
          </span>
          <span className="flex items-center gap-2">
            <LuCircleCheckBig />
            Track Bookings & Transactions
          </span>
          <span className="flex items-center gap-2">
            <LuCircleCheckBig />
            Real-time Reports & Insights
          </span>
        </div>

      </div>
      {
        currentPage === "pageOne" && <PageOne />
      }
      {
        currentPage === "pageTwo" && <PageTwo />
      }
      {
        currentPage === "pageThree" && <PageThree />
      }
      {
        currentPage === "pageFour" && <PageFour />
      }
      
    </div>

  )
}