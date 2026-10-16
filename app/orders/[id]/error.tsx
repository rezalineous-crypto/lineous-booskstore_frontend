"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getFriendlyErrorMessage, logError } from "@/lib/error-messages";

export default function OrderError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    logError(error, "app/orders/[id]/error");
  }, [error]);

  return (
    <div className="relative min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-display text-3xl font-bold text-slate-900 mb-4">
          Could not load order
        </h1>
        <p className="text-slate-500 mb-8">{getFriendlyErrorMessage(error)}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => unstable_retry()}>Try again</Button>
          <Button variant="outline" asChild>
            <Link href="/orders">Go to Orders</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
