



"use client";

import { HiChevronRight } from "react-icons/hi";
import { useNavHistory } from "@/components/stores/navHistory";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Breadcrumbs() {
  const { history, root, goBackTo } = useNavHistory();
  const [labels, setLabels] = useState({});
  const router = useRouter();

  useEffect(() => {
    const updated = {};

    history.forEach((path) => {
      const parts = path.split("/").filter(Boolean);
      const last = parts[parts.length - 1];

      const saved =
        sessionStorage.getItem(`label-driver-${last}`) ||
        sessionStorage.getItem(`label-customer-${last}`) ||
        sessionStorage.getItem(`label-cab-${last}`) ||
        sessionStorage.getItem(`label-wallet-${last}`) ||
        sessionStorage.getItem(`label-fleet-${last}`)||
        sessionStorage.getItem(`label-fuel-${last}`);

      if (saved) {
        updated[last] = saved;
      }
    });

    setLabels(updated);
  }, [history]);


  useEffect(() => {
    window.updateBreadcrumbName = (id, name) => {
      setLabels((prev) => ({ ...prev, [id]: name }));
    };
  }, []);


  const allCrumbs = [
    { label: root.toUpperCase(), href: "/dashboard" },
    ...history.map((p) => {
      const parts = p.split("/").filter(Boolean);
      const last = parts[parts.length - 1];

      const name = (labels[last] || last).toUpperCase();


      return { label: name, href: p };
    }),
  ];

  if (allCrumbs.length <= 1) return null;
  

  return (
    <nav className="flex items-center text-sm py-2 px-4 bg-white rounded-lg shadow mb-4">
      {allCrumbs.map((item, i) => {
        const isLast = i === allCrumbs.length - 1;

        return (
          <span key={i} className="flex items-center">
            {i > 0 && <HiChevronRight className="mx-1 text-gray-400" />}
            {isLast ? (
              <span className="text-green-700">{item.label}</span>
            ) : (
              <button
                onClick={() => {
                  goBackTo(item.href);
                  router.push(item.href);
                }}
                className="text-gray-700 hover:text-green-700"
              >
                {item.label}
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
}
