import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { apiClient } from '@/app/lib/apiClient';

export default function ProfileModal({ user, onClose }) {

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await apiClient('POST', '/rbac/logout', {});
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Remove cookie used by middleware (backend handles secure cookie deletion via logout API)
      Cookies.remove('adminAuthToken');

      // Redirect to signin
      router.push('/auth/signin');
    } catch (error) {
      console.log("Logout Error:", error);
      // Even if API call fails, clear local storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      Cookies.remove('adminAuthToken');
      router.push('/auth/signin');
    }
  };

  return (
    <div
      className="w-72 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-5 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
    >
      <div className="flex items-center gap-4">
        <Image
          src='/images/kumar.jpg'
          alt="User Avatar"
          className="rounded-full object-cover border-2 border-gray-300 dark:border-gray-600 shadow-sm"
          width={50}
          height={50}
        />
        <div>
          <h2 className="text-base font-semibold">{user?.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
        </div>
      </div>

      <hr className="my-4 border-gray-300 dark:border-gray-600" />

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md transition duration-200"
        >
          <Link href="/dashboard/profile">View Profile</Link>
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600
          text-white rounded-md transition duration-200"
        >
          Settings
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-md transition duration-200"
        >
          Cancel
        </button>
        <button
          // onClick={onClose}
          onClick={() => {
            handleLogout();
            onClose();
          }}
          className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-gray-700 dark:bg-red-500 dark:hover:bg-gray-600 text-white rounded-md transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

