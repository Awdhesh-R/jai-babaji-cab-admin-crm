export default function RideStatCard({ title, valueKey, isActive, rideserviceTypeData }) {
  return (
    <div
      className={`p-2 h-full shadow-md bg-gray-50 rounded-md cursor-pointer transition-all duration-200 border-green-600
        ${isActive ? 'border bg-gray-700 border-green-600 shadow-lg' : ''}
      `}
    >
      <div className="flex gap-2 items-center justify-between">
        <span className={`${isActive?"text-white":"text-gray-500"} text-[10px] md:text-xs  font-semibold text-gray-500`}>{title}</span>
        <span className={`border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center px-3 text-xs ${isActive?"text-white":"text-gray-500"}`}>{rideserviceTypeData?.[valueKey]}</span>
      </div>
    </div>
  );
}
