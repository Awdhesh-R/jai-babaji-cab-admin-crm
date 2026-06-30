"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { apiClient } from "@/app/lib/apiClient";


const SignoutPage = () => {
    const router = useRouter();
    useEffect(()=> {
        const handleLogout = async () => {
            try {
                await apiClient('POST', '/rbac/logout', {});
            } catch (error) {
                console.log("Logout API Error:", error);
            } finally {
                localStorage.clear();
                Cookies.remove('adminAuthToken');
                router.push("/auth/signin");
            }
        };
        handleLogout();
    }, [router]);
}
export default SignoutPage;