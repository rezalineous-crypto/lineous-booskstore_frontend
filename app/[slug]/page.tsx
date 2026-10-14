"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import TreeListingView from "@/components/TreeListingView";
import { useTreeListing } from "@/hooks/use-tree-listing";

const CategoryPageContent = () => {
  const params = useParams();
  const slug = params?.slug as string;

  // /{slug} — category listing, with a publication-slug fallback
  const { listing, books, isLoading } = useTreeListing(slug);

  return (
    <TreeListingView listing={listing} books={books} isLoading={isLoading} />
  );
};

const CategoryPage = () => {
  return (
    <Suspense
      fallback={
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
      }
    >
      <CategoryPageContent />
    </Suspense>
  );
};

export default CategoryPage;
