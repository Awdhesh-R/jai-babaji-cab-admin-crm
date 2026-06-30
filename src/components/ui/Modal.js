'use client';

import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null; 

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center w-full">
      <div className="bg-[#0E1629] text-white w-full max-w-[40%] p-6 rounded-xl shadow-xl relative">
        <button
          className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div>{children}</div>
      </div>
    </div>
  );
}
