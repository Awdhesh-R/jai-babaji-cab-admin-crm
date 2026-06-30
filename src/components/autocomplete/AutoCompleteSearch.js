'use client';
import { Loader } from "lucide-react";
import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { FaTimes } from "react-icons/fa";

const AutoCompleteSearch = ({ options = [], value, label, formatLable, onChange, onSelect, placeholder, className, loading, showCross  = false}) => {
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
        !loading? <ul
            className="z-[9999] max-h-60 overflow-auto bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-lg absolute"
            style={{
                position: "absolute",
                top: position?.top,
                left: position?.left,
                width: position?.width,
            }}
        >
            {options.map((obj, index) => (
                <li
                    key={index}
                    onClick={() => onSelect(obj)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                >
                    {formatLable? formatLable(obj) : obj[label]}
                </li>
            ))}
        </ul>
        : <div className="flex items-center justify-center h-[100px]"><Loader size={30} className="animate-spin duration-200"/> </div>
    ) : null;

    return (
        <>
            <div className="flex items-center gap-2">
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onBlur={()=>!value && setIsMounted(false)}
                    onFocus={()=>value && setIsMounted(true)}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full ${className}`}
                />
                {!showCross && <FaTimes className="text-red-600" onClick={()=>{onChange("");setIsMounted(false)}}/>}
            </div>
            {typeof window !== "undefined" &&
                position &&
                ReactDOM.createPortal(dropdown, document.body)}
        </>
    );
};

export default AutoCompleteSearch;