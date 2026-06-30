// components/ImageModal.js
'use client';
import Image from 'next/image';
import { useEffect } from 'react';

export default function ImageModal({ isOpen, onClose, imageUrl }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative max-w-3xl w-full p-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-5 text-red-600 text-2xl hover:text-red-400"
        >
          &times;
        </button>

        {/* Image */}
        <Image
          src={imageUrl}
          alt="Preview"
          fill
          className="rounded-lg shadow-lg w-full max-h-[80vh] object-cover"
        />
      </div>
    </div>
  );
}
