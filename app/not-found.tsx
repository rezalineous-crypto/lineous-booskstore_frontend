import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="font-display text-6xl font-bold text-primary mb-4">404</p>
        <h1 className="font-display text-3xl font-bold text-slate-900 mb-4">
          Page not found
        </h1>
        <p className="text-slate-500 mb-8">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/">Go to Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/books">Browse Books</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
