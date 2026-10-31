/* eslint-disable @next/next/no-img-element */
"use client";
import { motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartContext } from "@/contexts/CartContext";
import { Book } from "@/lib/types";

interface BookCardProps {
  book: Book;
  delay?: number;
  categoryId?: string;
}

const BookCard = ({ book, delay = 0, categoryId }: BookCardProps) => {
  const { addToCart } = useCartContext();
  // categoryId comes from the parent (listing pages pass it explicitly).
  // Reading useSearchParams here would force a Suspense boundary on every
  // page that renders a BookCard (including the homepage).
  const currentCategoryId = categoryId;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const defaultPaper =
      book.papers?.find((p) => p.isDefault && p.isInStock) || book.papers?.[0];
    if (defaultPaper) {
      addToCart(book.id, defaultPaper.id, 1, currentCategoryId);
    }
  };

  const priceDisplay = book.priceRange?.display || "Price not available";
  const hasMultiplePapers = book.papers && book.papers.length > 1;

  const avgRating =
    book.reviews && book.reviews.length > 0
      ? Math.round(
          book.reviews.reduce((sum, r) => sum + r.rating, 0) /
            book.reviews.length
        )
      : 0;

  return (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.4 }}
    whileHover={{ y: -8 }}
    whileTap={{ scale: 0.99 }}
    className="group relative flex flex-row md:flex-col rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-lg shadow-slate-200/80 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20"
  >
    <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
  
    {/* Image: fixed width on mobile, full width on md+ */}
    <div className="relative w-28 sm:w-32 min-h-36 shrink-0 md:w-full md:min-h-0 md:aspect-3/4 overflow-hidden bg-slate-100">
      <img
        src={book.thumbnail}
        alt={book.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent opacity-60 hidden md:block" />
  
      {hasMultiplePapers && (
        <div className="absolute top-2 left-2 md:top-3 md:left-3">
          <Badge className="bg-white border border-slate-200 text-slate-700 text-[10px] font-medium shadow-sm px-1.5 py-0">
            {book.papers.length} variants
          </Badge>
        </div>
      )}
  
      {/* Subject badge only on md+ (on mobile it moves into the content) */}
      {book.subject && (
        <div className="absolute top-3 right-3 hidden md:block">
          <Badge
            variant="secondary"
            className="text-[10px] font-medium bg-white border border-slate-200 text-slate-700 shadow-sm"
          >
            {book.subject.name}
          </Badge>
        </div>
      )}
    </div>
  
    {/* Content */}
    <div className="flex flex-col flex-1 min-w-0 p-3 md:p-4">
      {/* {book.subject && (
        <span className="md:hidden text-[10px] font-medium uppercase tracking-wide text-primary mb-1 truncate">
          {book.subject.name}
        </span>
      )} */}
  
      <h3 className="font-semibold text-sm text-slate-900 mb-1 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
        {book.title}
      </h3>
  
      <p className="text-xs text-slate-500 mb-2 truncate">
        {book.publication?.name || "Unknown Author"}
      </p>
  
      {book.reviews && book.reviews.length > 0 && (
        <div className="flex items-center gap-1 mb-2 md:mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < avgRating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-400">({book.reviews.length})</span>
        </div>
      )}
  
      <div className="mt-auto flex items-center justify-between gap-2">
        <span className="text-base md:text-lg font-bold text-primary truncate">
          {priceDisplay}
        </span>
        <Button
          size="sm"
          aria-label="Add to cart"
          className="h-9 w-12 md:h-8 md:w-8 p-0 shrink-0 rounded-lg bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-primary/20 transition-all duration-300 active:scale-95"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-4 h-4" />
        </Button>
      </div>
    </div>
  </motion.div>
  );
};

export default BookCard;
