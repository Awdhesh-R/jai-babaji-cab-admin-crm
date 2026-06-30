'use client';
import { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [expanded, setExpanded] = useState(true);
  const toggleSidebar = () => setExpanded((prev) => !prev);
  return (
    <SidebarContext.Provider value={{ expanded, setExpanded }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}

// Special hook for layout
export function useLayoutMargin() {
  const { expanded } = useContext(SidebarContext);
  return expanded ? 'ml-60' : 'ml-20';
}