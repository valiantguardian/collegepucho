"use client"
import { useState, useEffect } from "react";

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // Use 768px breakpoint for better mobile detection
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial state
    handleResize();
    setIsHydrated(true);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Return false during SSR/hydration to prevent mismatch
  if (!isHydrated) {
    return false;
  }

  return isMobile;
}
