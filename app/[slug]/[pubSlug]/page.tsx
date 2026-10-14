"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import TreeListingView from "@/components/TreeListingView";
import { useTreeListing } from "@/hooks/use-tree-listing";

const PublicationPageContent = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const pubSlug = params?.pubSlug as string;

  // /{categorySlug}/{pubSlug} — publication listing
  const { listing, books, isLoading } = useTreeListing(slug, pubSlug);

  return (
    <TreeListingView listing={listing} books={books} isLoading={isLoading} />
  );
};

const PublicationPage = () => {
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
      <PublicationPageContent />
    </Suspense>
  );
};

export default PublicationPage;
