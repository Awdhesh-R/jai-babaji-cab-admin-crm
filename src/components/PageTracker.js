"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useNavHistory } from "./stores/navHistory";

export default function PageTracker() {
  const pathname = usePathname();
  const { addPage, reset, setRoot } = useNavHistory();

  useEffect(() => {
    const sidebarRoot = sessionStorage.getItem("sidebar-root");

    if (sidebarRoot) {
      reset();
      setRoot(sidebarRoot);
      sessionStorage.removeItem("sidebar-root");
    }

    if (pathname === "/dashboard") {
      reset();
      return;
    }

    addPage(pathname);
  }, [pathname]);

  return null;
}
