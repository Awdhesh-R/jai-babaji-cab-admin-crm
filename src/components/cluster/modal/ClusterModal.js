import React, { useState , useEffect} from 'react';
import { RxCross2 } from "react-icons/rx";

const modalConfig = {
  offer: {
    title: "Offer Discount",
    subtitle: "Select a discount percentage for source or destination.",
    tabs: ["Source Discount", "Destination Discount"],
    colors: {
      active: "bg-blue-600",
      text: "text-blue-600",
    },
    options: ["10% Off", "20% Off", "30% Off", "40% Off"],
  },
  realtime: {
    title: "Real-Time Discount",
    subtitle: "Apply dynamic discounts to your fleet or market fleet.",
    tabs: ["Own Fleet", "Market Fleet"],
    colors: {
      active: "bg-orange-600",
      text: "text-orange-600",
    },
    options: ["5% Off", "10% Off", "15% Off"],
  },
  price: {
    title: "Change Price",
    subtitle: "Change price for high price or low price.",
    tabs: ["High Price", "Reduce Price"],
    colors: {
      active: "bg-red-600",
      text: "text-red-600",
    },
    options: ["-10% Reduce", "-20% Reduce", "-30% Reduce", "-40% Reduce"],
  }
};

const ClusterModal = ({ type, onClose, isOpen }) => {
  const config = modalConfig[type];
  const [activeTab, setActiveTab] = useState(0);

  if (!config || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="w-[90%] max-w-[400px] bg-white p-6 rounded-xl shadow-md relative"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <RxCross2 size={20} />
        </button>

        {/* Title */}
        <h2 className={`text-xl font-bold ${config.colors.text}`}>
          {config.title}
        </h2>
        <p className="text-gray-500 mt-1">{config.subtitle}</p>

        {/* Tabs */}
        <div className="flex mt-4 bg-gray-200 rounded-full overflow-hidden">
          {config.tabs.map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setActiveTab(idx)}
              className={`flex-1 py-2 text-sm font-medium transition ${activeTab === idx
                ? `${config.colors.active} text-white`
                : "text-gray-600"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {config.options.map((option, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-lg p-4 text-center font-semibold hover:shadow-md cursor-pointer"
            >
              {option}
            </div>
          ))}
        </div>

        {/* Close Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-500 hover:text-black"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClusterModal;