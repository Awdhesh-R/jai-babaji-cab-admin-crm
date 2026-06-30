import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export default function StarRating({ value = 0, max = 5, showValue = true, size = 16 }) {
    const rating = Number(value) || 0;

    return (
        <div className="flex items-center gap-1 text-[#FBBF24]">
            {[...Array(max)].map((_, i) => {
                const idx = i + 1;
                if (rating >= idx) {
                    return <FaStar key={i} size={size} className="text-yellow-500" />;
                } else if (rating >= idx - 0.5) {
                    return <FaStarHalfAlt key={i} size={size} className="text-yellow-500" />;
                } else {
                    return <FaRegStar key={i} size={size} className="text-gray-400" />;
                }
            })}

            {showValue && (
                <span className="text-[13px] text-gray-700 ml-1">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
}
