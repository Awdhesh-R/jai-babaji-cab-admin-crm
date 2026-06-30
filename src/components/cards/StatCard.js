export default function StatCard({ title, value, change }) {
  const isPositive = change.startsWith('+');
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
      <p className={`mt-2 text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {change} {isPositive ? '↑' : '↓'}
      </p>
    </div>
  );
}