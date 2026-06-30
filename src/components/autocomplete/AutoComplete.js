'use client';
import { useState, useEffect, useRef } from 'react';

const AutoCompletePage = ({ options, value, onChange, placeholder = "Search...", fieldType, custom, required, onSelect, selectedDefaultCity }) => {

    const [filteredOptions, setFilteredOptions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedCity, setSelectedCity] = useState(selectedDefaultCity || null);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (fieldType === 'Mobile') {
            if (value.trim() === '') {
                setFilteredOptions([]);
            } else {
                const search = value.toLowerCase();
                const filtered = options.filter((option) =>
                    [option.name, option.mobile, option.urid]
                        .some(field => field?.toLowerCase?.().includes(search))
                );
                setFilteredOptions(filtered);
            }
        } else {
            if (value.trim() === '') {
                setFilteredOptions([]);
            } else {
                const search = value.toLowerCase();
                const filtered = options.filter((option) =>
                    [option.city_name]
                        .some(field => field?.toLowerCase?.().includes(search))
                );
                setFilteredOptions(filtered);
            }
        }
    }, [value, options, fieldType]);


    const handleSelect = (item) => {
        onChange(item);
        setShowDropdown(false);
        onSelect && onSelect(item)
        if(required) setSelectedCity(item);
    };

    // const goToDetail = (urid) => {
    //     if (urid) {
    //         router.push(`/ridesManagement/details?urid=${urid}`);
    //     }
    // };

    return (
        <div ref={wrapperRef} className={`relative w-full ${custom? "":"max-w-md"}`}>
            <input
                type="text"
                className="w-full px-4 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none text-[12px] min-w-[220px]"
                placeholder={placeholder}
                name='autoComplete-search'
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
            />

            {showDropdown && filteredOptions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-y-auto">
                    {filteredOptions.map((option, index) => (
                        fieldType === 'Mobile' ? (
                            <li
                                key={index}
                                className="px-4 py-1.5 hover:bg-blue-100 cursor-pointer"
                                onClick={() => {
                                    handleSelect(option.mobile);
                                    // goToDetail(option.urid);
                                }}
                            >
                                {option.mobile} {option.urid}
                            </li>
                        ) : (
                            <li
                                key={index}
                                className="px-4 py-1.5 hover:bg-blue-100 cursor-pointer text-gray-700"
                                onClick={() => handleSelect(option.city_name)}
                            >
                                {option.city_name}
                            </li>
                        )
                    ))}
                </ul>
            )}
            {required && !selectedCity && <p className='text-red-600 text-base'>City is Required</p>}
        </div>
    );
}

export default AutoCompletePage;