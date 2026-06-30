"use client";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

export default function AuthLayout({ children }) {
  return (
    <Provider store={store}>
      <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-gray-900">
        {children}
      </div>
    </Provider>
  );
}
