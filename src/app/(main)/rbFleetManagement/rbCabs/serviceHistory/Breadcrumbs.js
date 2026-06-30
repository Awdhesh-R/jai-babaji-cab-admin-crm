import React from "react";

export default function Breadcrumbs() {
  return (
    <div className="bg-white rounded-md  p-3 mb-4">
      <div className="flex items-center md:gap-2 text-sm text-gray-500">
        <div className="flex items-center  md:text-sm text-[10px] gap-2">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L2 9h2v7h4v-5h4v5h4V9h2L10 2z" fill="#8D99AE" />
          </svg>
          <span className="">Home</span>
        </div>
        <span className="text-gray-300 ">{'<'}</span>
        <span className="text-black-600 text-[10px] md:text-sm font-semibold">Service History</span>
        <span className="text-gray-300 ">{'<'}</span>
        {/* <span className="text-black-600 text-[10px] md:text-sm font-semibold">BR 01AB 1234</span> */}
      </div>
    </div>
  );
}
