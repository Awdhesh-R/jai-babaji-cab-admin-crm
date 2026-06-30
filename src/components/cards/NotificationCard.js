import { FiBell } from 'react-icons/fi';
import { MdOutlineMarkEmailRead } from 'react-icons/md';

const NotificationCard = ({ notifications }) => {
  return (
    <div className="w-full sm:w-[28rem] md:w-[32rem] max-w-full mx-auto bg-white dark:bg-[#1e1e2f] shadow-xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-black dark:text-white">
          <FiBell size={20} /> Notifications
        </h2>
        <button className="text-sm text-blue-500 hover:underline">Mark all as read</button>
      </div>

      <ul className="max-h-[22rem] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
        {notifications && notifications.length > 0 ? (
          notifications.map((notif) => (
            <li
              key={notif.id}
              className="px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-start gap-3">
                <MdOutlineMarkEmailRead className="mt-1 text-blue-500" size={20} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-black dark:text-white">{notif.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{notif.message}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{notif.time}</p>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="px-5 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
            No new notifications
          </li>
        )}
      </ul>
    </div>
  );
};

export default NotificationCard;