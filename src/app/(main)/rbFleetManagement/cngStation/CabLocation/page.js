"use client";

import dynamic from "next/dynamic";

// Dynamically import the client component with SSR disabled
// This prevents the olamaps-web-sdk from being evaluated during server-side rendering
const CabLocationClient = dynamic(() => import("./CabLocationClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

export default function CabLocationPage() {
  return <CabLocationClient />;
}
