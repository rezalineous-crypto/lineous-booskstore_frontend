"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useIsFetching } from "@tanstack/react-query";

/**
 * Custom animated loader pinned to the top of the viewport.
 *
 * Shows while a route segment is changing or any query is in flight, so a
 * page never sits silently empty (which used to make the footer jump to the
 * top of the screen while content loaded).
 */
export default function TopLoader() {
  const pathname = usePathname();
  const isFetching = useIsFetching();

  const [prevPathname, setPrevPathname] = useState(pathname);
  // Starts true so the very first page load also shows the loader
  const [routeLoading, setRouteLoading] = useState(true);

  // Adjust state during render when the route changes (React's recommended
  // pattern for "adjusting state when a prop changes" — avoids a sync
  // setState inside an effect). useSearchParams is intentionally not used
  // here so this global component never forces a Suspense boundary on pages.
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setRouteLoading(true);
  }

  useEffect(() => {
    if (!routeLoading) return;
    const timer = setTimeout(() => setRouteLoading(false), 500);
    return () => clearTimeout(timer);
  }, [routeLoading]);

  const isVisible = routeLoading || isFetching > 0;

  return (
    <div
      role="status"
      aria-label="Loading"
      aria-hidden={!isVisible}
      className={`fixed top-0 inset-x-0 z-[100] h-[3px] pointer-events-none transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Track */}
      <div className="relative h-full w-full overflow-hidden bg-primary/10">
        {/* Sliding gradient bar with a soft brand-colored glow */}
        <div className="animate-toploader-bar h-full w-1/3 rounded-r-full bg-gradient-to-r from-primary via-accent to-primary shadow-[0_0_12px_rgba(24,125,151,0.65)]" />
      </div>
    </div>
  );
}
