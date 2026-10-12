"use client";

import { Suspense, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import BookCard from "@/components/BookCard";
import { useBooks } from "@/hooks/use-books";
import { useCategories } from "@/hooks/use-categories";
import { useCategory } from "@/hooks/use-categories";
import { Book } from "@/lib/types";

const CategoryPageContent = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const { data: categories = [] } = useCategories();
  const category = useMemo(() => {
    return categories.find((c) => c.slug === slug || c.route === `/${slug}`);
  }, [categories, slug]);

  const { data: booksData = [], isLoading, error } = useBooks(
    undefined,
    category?.id || undefined
  );

  const books = booksData;

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

  if (error || !category) {
    return (
      <div className="min-h-screen bg-background">
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h1 className="font-display text-2xl font-bold mb-4">Category Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The category you&apos;re looking for doesn&apos;t exist.
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
            <nav className="mb-4 text-sm text-muted-foreground">
              <ol className="flex items-center gap-2">
                <li>
                  <button
                    onClick={() => router.push("/")}
                    className="hover:text-primary transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>/</li>
                <li className="text-foreground font-medium">{category.name}</li>
              </ol>
            </nav>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-2">
              {category.name}
            </h1>
            <p className="text-muted-foreground">
              Browse books in {category.name}
            </p>
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
                  onClick={() => router.push(`/book/${book.id}?categoryId=${category.id}`)}
                  className="cursor-pointer"
                >
                  <BookCard book={book} delay={index * 0.05} categoryId={category.id} />
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <h2 className="font-display text-xl font-semibold mb-2">
                No books found
              </h2>
              <p className="text-muted-foreground mb-6">
                No books available for this category yet.
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
