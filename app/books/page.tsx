"use client";

import { Suspense, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import BookCard from "@/components/BookCard";
import { useBooks } from "@/hooks/use-books";
import { useSubjects } from "@/hooks/use-subjects";
import { useCategory } from "@/hooks/use-categories";
import { useBookTree } from "@/hooks/use-book-tree";
import { Book } from "@/lib/types";
import { getFriendlyErrorMessage } from "@/lib/error-messages";

const BooksContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get subjectId from URL params using useMemo to avoid state update in effect
  const selectedSubjectId = useMemo(() => {
    return searchParams.get("subjectId");
  }, [searchParams]);
  const selectedCategoryId = useMemo(() => {
    return searchParams.get("categoryId");
  }, [searchParams]);
  const searchQuery = useMemo(() => {
    return searchParams.get("search") || searchParams.get("q") || "";
  }, [searchParams]);

  const { data: category } = useCategory(selectedCategoryId || "");
  const { data: bookTree = [] } = useBookTree(selectedCategoryId || undefined);
  const { data: subjects = [] } = useSubjects();
  const { data: booksData = [], isLoading, error } = useBooks(
    selectedSubjectId || undefined,
    selectedCategoryId || undefined,
    searchQuery || undefined
  );

  // Client-side filtering for search results by category if needed (as per requirements)
  const books = useMemo(() => {
    if (!selectedCategoryId) return booksData;
    return booksData.filter((book) => {
      // Check if book belongs to the selected category
      if (book.categories && book.categories.length > 0) {
        return book.categories.some((cat) => cat.id === selectedCategoryId);
      }
      return true;
    });
  }, [booksData, selectedCategoryId]);

  const handleSubjectClick = (subjectId: string) => {
    router.push(`/books?subjectId=${subjectId}`);
  };

  const handleBookClick = (book: Book) => {
    const url = selectedCategoryId ? `/book/${book.id}?categoryId=${selectedCategoryId}` : `/book/${book.id}`;
    router.push(url);
  };

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

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h1 className="font-display text-2xl font-bold mb-4">Error Loading Books</h1>
            <p className="text-muted-foreground mb-6">{getFriendlyErrorMessage(error)}</p>
            <Button onClick={() => router.push("/")}>Go Home</Button>
          </div>
        </main>
      </div>
    );
  }

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {/* Breadcrumbs */}
            <nav className="mb-4 text-sm text-muted-foreground">
              <ol className="flex items-center gap-2">
                <li>
                  <button onClick={() => router.push("/")} className="hover:text-primary transition-colors">
                    Home
                  </button>
                </li>
                <li>/</li>
                {category && (
                  <>
                    <li className="text-foreground font-medium">{category.name}</li>
                  </>
                )}
                {!category && selectedSubject && (
                  <>
                    <li className="text-foreground font-medium">{selectedSubject.name}</li>
                  </>
                )}
                {!category && !selectedSubject && (
                  <>
                    <li className="text-foreground font-medium">All Books</li>
                  </>
                )}
              </ol>
            </nav>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-2">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : (category ? category.name : (selectedSubject ? selectedSubject.name : "All Books"))
              }
            </h1>
            <p className="text-muted-foreground">
              {searchQuery
                ? `Found ${books.length} book${books.length === 1 ? "" : "s"}`
                : (category
                  ? `Browse books in ${category.name}`
                  : (selectedSubject
                    ? `Browse all past papers for ${selectedSubject.name}`
                    : "Explore our collection of past papers"
                  )
                )}
            </p>
          </motion.div>

          {/* Subject Filter Tabs */}
          {subjects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8 overflow-x-auto"
            >
              <div className="flex gap-2 pb-2">
                <button
                  onClick={() => router.push("/books")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    !selectedSubjectId
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground/70 hover:bg-muted/80"
                  }`}
                >
                  All Subjects
                </button>
                {subjects.map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => handleSubjectClick(subject.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      selectedSubjectId === subject.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground/70 hover:bg-muted/80"
                    }`}
                  >
                    {subject.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Books Grid */}
          {books.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
            >
              {books.map((book, index) => (
                <div key={book.id} onClick={() => handleBookClick(book)} className="cursor-pointer">
                  <BookCard book={book} delay={index * 0.05} categoryId={selectedCategoryId || undefined} />
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <h2 className="font-display text-xl font-semibold mb-2">No books found</h2>
              <p className="text-muted-foreground mb-6">
                {selectedSubjectId
                  ? "No books available for this subject yet."
                  : "No books available at the moment."
                }
              </p>
              {selectedSubjectId && (
                <Button onClick={() => router.push("/books")} variant="outline">
                  View All Books
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

const BooksPage = () => {
  return (
    <Suspense fallback={
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
    }>
      <BooksContent />
    </Suspense>
  );
};

export default BooksPage;