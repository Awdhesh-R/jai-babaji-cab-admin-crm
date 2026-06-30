"use client";
import { useEffect } from "react";

export default function AuthWatcher({ children }) {
  // Session expiration is now handled by the backend via secure httpOnly cookies
  // The backend will return 401/403 responses when the session expires, which is handled by apiClient
  // No need to check cookies here since httpOnly cookies are not accessible via JavaScript
  // The middleware handles authentication checks on the server side

  return children;
}