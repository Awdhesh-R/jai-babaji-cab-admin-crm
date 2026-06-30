// 'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation'; 

// const useAuthRedirect = (shouldBeLoggedIn = true, redirectTo = '/login') => {
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem('token');

//     // If the user should be logged in but there's no token
//     if (shouldBeLoggedIn && !token) {
//       router.push(redirectTo); // Redirect to login
//     }

//     // If user should NOT be logged in but token exists (e.g., on login page)
//     if (!shouldBeLoggedIn && token) {
//       router.push('/dashboard'); // Already logged in, redirect to dashboard
//     }
//   }, []);
// };

// export default useAuthRedirect;
