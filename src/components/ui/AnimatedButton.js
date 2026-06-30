'use client';

import React from 'react';
import './AnimatedButton.css';

const AnimatedButton = () => {
  return (
    <div className="relative inline-block">
      <button className="group relative overflow-visible px-8 py-3 text-[17px] font-medium border-4 border-[#fec195] bg-[#fec195] text-[#181818] rounded-lg shadow transition-all duration-300 ease-in-out hover:bg-transparent hover:text-[#fec195] hover:shadow-[0_0_25px_#fec1958c]">
        Login
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div key={num} className={`star star-${num}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 784.11 815.53"
              className="w-full h-auto"
            >
              <path
                d="M392.05 0c-20.9 210.08-184.06 378.41-392.05 407.78 207.96 29.37 371.12 197.68 392.05 407.74 20.93-210.06 184.09-378.37 392.05-407.74C576.11 378.41 412.93 210.08 392.05 0z"
                fill="#fffdef"
              />
            </svg>
          </div>
        ))}
      </button>
    </div>
  );
};

export default AnimatedButton;
