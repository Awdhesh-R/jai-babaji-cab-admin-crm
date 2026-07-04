import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageTracker from "@/components/PageTracker";
import DevToolsProtection from "@/components/DevToolsProtection";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "jaiBabajiCab Admin Dashboard",
  description: "jaiBabajiCab Customer Relationship Management",
};

export default function RootLayout({ children }) {
  // Check if we're in development mode
  const webappEnv = process.env.WEBAPP_ENV?.toLowerCase() || "";
  const isDevelopment = ["development", "dev", "develop"].includes(webappEnv);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-x-hidden`}>
        <PageTracker />
        <DevToolsProtection enabled={!isDevelopment} />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}

          {/* Global Toast Container (works everywhere in project) */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            theme="colored" // use "light", "dark" or "colored"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
