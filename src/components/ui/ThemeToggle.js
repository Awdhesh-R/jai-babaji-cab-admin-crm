// 'use client';

// import { useTheme } from 'next-themes';
// import { useEffect, useState } from 'react';

// export default function ThemeToggle() {
//   const { theme, setTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => setMounted(true), []);

//   if (!mounted) return null;

//   return (
//     <button
//       onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
//       className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
//     >
//       {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
//     </button>
//   );
// }

'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`relative inline-flex items-center h-8 w-16 rounded-full transition-colors duration-300 focus:outline-none
        ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}
    >
      <span
        className={`absolute left-1 top-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-lg shadow transition-transform duration-300
        ${isDark ? 'translate-x-8 bg-yellow-500' : 'translate-x-0 bg-blue-500'}`}
      >
        {isDark ? <MdLightMode /> : <MdDarkMode />}
      </span>
    </button>
  );
}
