"use client";

import { useState } from "react";
import { Loader } from "@/components/ui/loader";

/**
 * Hook for showing/hiding manual loading state
 * Useful for data fetching, form submission, etc.
 * 
 * Usage:
 * ```
 * const { isLoading, showLoader, hideLoader } = useManualLoader();
 * 
 * async function handleSubmit() {
 *   showLoader();
 *   try {
 *     await submitData();
 *   } finally {
 *     hideLoader();
 *   }
 * }
 * 
 * return (
 *   <>
 *     {isLoading && <Loader />}
 *     <button onClick={handleSubmit}>Submit</button>
 *   </>
 * );
 * ```
 */
export function useManualLoader() {
  const [isLoading, setIsLoading] = useState(false);

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);

  return {
    isLoading,
    showLoader,
    hideLoader,
  };
}

/**
 * Manual Loader Display Component
 * Use with the useManualLoader hook for manual control
 */
export function ManualLoaderDisplay({
  show,
}: {
  show: boolean;
}) {
  if (!show) return null;
  return <Loader />;
}
