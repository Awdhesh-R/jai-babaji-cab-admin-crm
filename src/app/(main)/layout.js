"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { SidebarProvider, useSidebar } from "@/components/sidebar/SidebarContext";
import Sidebar from "@/components/sidebar/Sidebar";
import Header from "@/components/header/Header";
import Breadcrumbs from '@/components/Breadcrumb/Breadcrumb';
import SessionExpire from "@/components/commom/SessionExpire";

function LayoutContent({ children }) {
  const { expanded } = useSidebar();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <Sidebar />
      <div className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ${expanded ? "ml-[80px]" : "ml-[350px]"}`}>
      
        <Header />
       
        {/* <main className="flex-1 p-6 mt-[70px] text-gray-900 dark:text-white transition-colors duration-300"> */}
        <main className="flex-1 p-6 mt-[70px] text-gray-900 dark:text-gray-900 bg-white dark:bg-white transition-colors duration-300">
           <Breadcrumbs />
          <SessionExpire>
          {children}
          </SessionExpire>
        </main>
        
        
      </div>
    </div>

  );
}

export default function DashboardLayout({ children }) {
  return (
    <Provider store={store}>
      <SidebarProvider>
         
        <LayoutContent>{children}</LayoutContent>
        
      </SidebarProvider>
    </Provider>
  );
}
