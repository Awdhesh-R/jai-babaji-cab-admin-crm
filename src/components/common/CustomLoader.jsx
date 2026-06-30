"use client";
import React from "react";
import { Loader} from "lucide-react";

export default function CustomLoader({ size = 40, text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-6">
      <Loader
        size={size}
        className="text-blue-600 animate-spin"
        strokeWidth={2.5}
      />

      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </div>
  );
}
