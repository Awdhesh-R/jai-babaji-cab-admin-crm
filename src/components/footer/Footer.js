// export default function Footer() {
//   return (
//     <footer className="bg-white shadow px-4 py-3 text-center text-sm text-gray-500">
//       © {new Date().getFullYear()} Your Company. All rights reserved.
//     </footer>
//   )
// }

const Footer = () => (
  <footer className="bg-gray-800 text-center text-white py-2">
    &copy; {new Date().getFullYear()} COREUI. All rights reserved.
  </footer>
);

export default Footer;
