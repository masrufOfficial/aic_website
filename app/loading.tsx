"use client";

import { useEffect, useState } from "react";
import { Loader } from "@/components/ui/loader";

/**
 * Global loading component (enhanced)
 * Adds smooth fade + minimum display time
 */
export default function Loading() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Delay before showing loader (prevents flicker)
    const showTimer = setTimeout(() => setVisible(true), 120);

    return () => clearTimeout(showTimer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-900/60 backdrop-blur-md transition-opacity duration-500">
      <Loader />
    </div>
  );
}