"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import BookCard from "@/components/BookCard";
import { Book } from "@/lib/types";
import { TreeListing } from "@/hooks/use-tree-listing";

/**
 * Shared listing UI for the dynamic category / publication / subject pages.
 * Handles loading, not-found, empty, and grid states in one place.
 */
export default function TreeListingView({
  listing,
  books,
  isLoading,
}: {
  listing: TreeListing | null;
  books: Book[];
  isLoading: boolean;
}) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded mb-4" />
              <div className="h-6 bg-muted rounded w-1/3 mb-8" />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-64 bg-muted rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h1 className="font-display text-2xl font-bold mb-4 text-foreground">
              Page Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              The category or publication you&apos;re looking for
              doesn&apos;t exist.
            </p>
            <Button onClick={() => router.push("/")}>Go Home</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {/* Breadcrumbs */}
            <nav className="mb-4 text-sm text-muted-foreground">
              <ol className="flex items-center gap-2 flex-wrap">
                {listing.breadcrumb.map((item, index) => (
                  <li
                    key={`${item.label}-${index}`}
                    className="flex items-center gap-2"
                  >
                    {item.href ? (
                      <button
                        onClick={() => router.push(item.href!)}
                        className="hover:text-primary transition-colors"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <span className="text-foreground font-medium">
                        {item.label}
                      </span>
                    )}
                    {index < listing.breadcrumb.length - 1 && (
                      <span aria-hidden="true">/</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-2">
              {listing.title}
            </h1>
            <p className="text-muted-foreground">{listing.subtitle}</p>
          </motion.div>

          {books.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
            >
              {books.map((book, index) => (
                <div
                  key={book.id}
                  onClick={() =>
                    router.push(`/book/${book.id}?categoryId=${listing.categoryId}`)
                  }
                  className="cursor-pointer"
                >
                  <BookCard
                    book={book}
                    delay={index * 0.05}
                    categoryId={listing.categoryId}
                  />
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <h2 className="font-display text-xl font-semibold mb-2 text-foreground">
                No books found
              </h2>
              <p className="text-muted-foreground mb-6">
                No books are available here yet. Please check back later.
              </p>
              <Button onClick={() => router.push("/books")} variant="outline">
                View All Books
              </Button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
