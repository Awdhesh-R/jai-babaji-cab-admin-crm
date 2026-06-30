'use client';
import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";

const SearchCity = ({ options = [], value, onChange, onSelect, placeholder, className }) => {
    const inputRef = useRef(null);
    const [position, setPosition] = useState(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        if (inputRef.current) {
            const rect = inputRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
            });
            setIsMounted(true);
        }
    }, [value, options.length]);

    const dropdown = options.length > 0 && isMounted ? (
        <ul
            className="z-[9999] max-h-60 overflow-auto bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-lg absolute"
            style={{
                position: "absolute",
                top: position?.top,
                left: position?.left,
                width: position?.width,
            }}
        >
            {options.map((city, index) => (
                <li
                    key={index}
                    onClick={() => onSelect(city.city_name)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                >
                    {city.city_name}
                </li>
            ))}
        </ul>
    ) : null;

    return (
        <>
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full ${className}`}
            />
            {typeof window !== "undefined" &&
                position &&
                ReactDOM.createPortal(dropdown, document.body)}
        </>
    );
};

export default SearchCity;