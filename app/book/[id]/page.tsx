"use client";

import { useParams, useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  BookOpen,
  Tag,
  Package,
  Hash,
  Calendar,
  Globe,
  Loader2,
} from "lucide-react";
import { useState, useEffect, useRef, Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCartContext } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useBook } from "@/hooks/use-books";
import { getEffectivePrice, formatPrice } from "@/lib/price-utils";
import { toast } from "sonner";

const BookDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { addToCart, isAddingToCart } = useCartContext();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
  const initializedRef = useRef(false);

  const categoryIdFromUrl = searchParams.get("categoryId");

  const getCallbackUrl = () => {
    const queryString = searchParams.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
  };
  const { data: book, isLoading, error } = useBook(params?.id as string);

  // Set default paper on book load
  useEffect(() => {
    if (book && book.papers && !initializedRef.current) {
      initializedRef.current = true;
      const defaultPaper = book.papers.find(
        (p) => p.isDefault && p.status === "PUBLISHED"
      );
      const paperId = defaultPaper
        ? defaultPaper.id
        : book.papers.length > 0
        ? book.papers[0].id
        : null;
      if (paperId) {
        setTimeout(() => {
          setSelectedPaperId(paperId);
        }, 0);
      }
    }
  }, [book]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please log in to add items to your cart", {
        description: "You need to be logged in to add books to your cart.",
      });
      router.push(`/login?callbackUrl=${encodeURIComponent(getCallbackUrl())}`);
      return;
    }
    if (book) {
      if (!selectedPaperId) {
        alert("Please select a paper variant");
        return;
      }
      addToCart(
        book.id,
        selectedPaperId,
        quantity,
        categoryIdFromUrl || undefined
      );
    }
  };

  // Get selected paper
  const selectedPaper = book?.papers?.find((p) => p.id === selectedPaperId);

  // Main preview image follows the selected paper
  const mainImage = selectedPaper?.thumbnail || book?.thumbnail;

  // Scroll the selected thumbnail/chip into view (skip first render so the page doesn't jump)
  const didMount = useRef(false);
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    if (!selectedPaperId) return;
    document
      .querySelectorAll(`[data-paper-id="${selectedPaperId}"]`)
      .forEach((el) =>
        el.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        })
      );
  }, [selectedPaperId]);

  // Max quantity based on stock
  // const maxQuantity = selectedPaper?.stock != null ? selectedPaper.stock : 99;

  // Price display logic
  const getDisplayPrice = () => {
    if (!selectedPaper) return { price: 0, originalPrice: null, discount: 0 };

    const price =
      typeof selectedPaper.price === "string"
        ? parseFloat(selectedPaper.price)
        : selectedPaper.price;
    const effectivePrice = getEffectivePrice(selectedPaper);

    const now = new Date();
    const isDiscounted =
      selectedPaper.discountPrice &&
      selectedPaper.discountStartDate &&
      selectedPaper.discountEndDate &&
      now >= new Date(selectedPaper.discountStartDate) &&
      now <= new Date(selectedPaper.discountEndDate);

    if (isDiscounted) {
      return {
        price: effectivePrice,
        originalPrice: price,
        discount: Math.round((1 - effectivePrice / price) * 100),
      };
    }

    return {
      price: price,
      originalPrice: null,
      discount: 0,
    };
  };

  const features = [
    { icon: Truck, text: "Delivery charge will depend on your location" },
    { icon: Shield, text: "Secure payment" },
    { icon: RotateCcw, text: "30-day returns" },
  ];

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-white overflow-hidden">
        <main className="pt-24 pb-16 relative z-10">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 rounded mb-4 w-40" />
              <div className="grid md:grid-cols-2 gap-8">
                <div className="h-96 bg-slate-200 rounded-2xl" />
                <div className="space-y-4">
                  <div className="h-12 bg-slate-200 rounded-xl" />
                  <div className="h-6 bg-slate-200 rounded-xl w-3/4" />
                  <div className="h-8 bg-slate-200 rounded-xl w-1/2" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="relative min-h-screen bg-white">
        <main className="pt-24 pb-16 relative z-10">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h1 className="font-display text-2xl font-bold mb-4 text-slate-900">
              Book not found
            </h1>
            <p className="text-slate-500 mb-6">
              The book you are looking for doesnt exist or is not available.
            </p>
            <Button onClick={() => router.push("/")}>Browse Books</Button>
          </div>
        </main>
      </div>
    );
  }

  const priceInfo = getDisplayPrice();
  const thumbnail = book.thumbnail;

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* pt-20 leaves room for the floating brand badge; pb-28 leaves room for the sticky bar */}
      <main className="pt-20 md:pt-24 pb-28 md:pb-16 relative z-10">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 md:mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary transition-colors mb-3 md:mb-4 touch-target"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Store
            </Link>

            {/* Full breadcrumb: tablet and desktop only */}
            <nav className="hidden md:block text-sm text-muted-foreground">
              <ol className="flex items-center gap-2 flex-wrap">
                <li>
                  <button
                    onClick={() => router.push("/")}
                    className="hover:text-primary transition-colors"
                  >
                    Home
                  </button>
                </li>
                {book.categories && book.categories[0] && (
                  <>
                    <li>/</li>
                    <li>
                      <button
                        onClick={() => {
                          const catId = book.categories?.[0]?.id;
                          if (catId) router.push(`/books?categoryId=${catId}`);
                        }}
                        className="hover:text-primary transition-colors"
                      >
                        {book.categories[0].name}
                      </button>
                    </li>
                  </>
                )}
                <li>/</li>
                <li className="text-foreground font-medium truncate max-w-md">
                  {book.title}
                </li>
              </ol>
            </nav>
          </motion.div>

          {/* Book Details */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-16">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {/* Soft backdrop on mobile, plain on desktop */}
              <div className="rounded-3xl bg-gradient-to-b from-slate-100 to-slate-50 py-6 md:bg-none md:py-0">
                <div className="relative mx-auto w-3/5 max-w-[240px] md:w-full md:max-w-none rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xl shadow-slate-300/60 md:shadow-slate-200/80">
                  <motion.img
                    key={mainImage}
                    src={mainImage}
                    alt={selectedPaper?.name || book.title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent opacity-40" />

                  {priceInfo.discount > 0 && (
                    <Badge className="absolute top-2 left-2 md:top-4 md:left-4 bg-primary text-white border border-primary-hover/30 shadow-lg shadow-primary/20 text-[10px] md:text-xs">
                      -{priceInfo.discount}% OFF
                    </Badge>
                  )}
                </div>
              </div>

              {/* Part thumbnails: swipeable row on mobile, grid on sm+ */}
              {book.papers && book.papers.length > 0 && (
                <div className="mt-3 md:mt-4 flex gap-2 overflow-x-auto -mx-4 px-4 pb-1 snap-x sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4 sm:gap-3 sm:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {book.papers
                    .filter((p) => p.status === "PUBLISHED")
                    .map((paper) => (
                      <button
                        key={paper.id}
                        onClick={() => {
                          setSelectedPaperId(paper.id);
                          setQuantity(1);
                        }}
                        className={`relative shrink-0 snap-start w-16 sm:w-auto rounded-lg overflow-hidden border-2 transition-all touch-target ${
                          selectedPaperId === paper.id
                            ? "border-primary shadow-md"
                            : "border-slate-200 opacity-80"
                        }`}
                      >
                        <img
                          src={paper.thumbnail || book.thumbnail}
                          alt={paper.name}
                          className="w-full h-16 sm:h-52 object-cover"
                        />
                        {selectedPaperId === paper.id && (
                          <div className="absolute inset-0 bg-primary/10" />
                        )}
                      </button>
                    ))}
                </div>
              )}
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col"
            >
              {/* Subject + rating on one row */}
              <div className="flex items-center justify-between gap-3 mb-2 md:mb-4">
                <Badge
                  variant="outline"
                  className="w-fit bg-white border-slate-200 text-slate-700 text-[11px] md:text-xs"
                >
                  {book.subject?.name || "Uncategorized"}
                </Badge>

                {book.reviews && book.reviews.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-slate-900">
                      {(
                        book.reviews.reduce((sum, r) => sum + r.rating, 0) /
                        book.reviews.length
                      ).toFixed(1)}
                    </span>
                    <span className="text-xs text-slate-500">
                      ({book.reviews.length})
                    </span>
                  </div>
                )}
              </div>

              <h1 className="font-display text-xl sm:text-3xl lg:text-5xl font-bold text-slate-900 mb-1 tracking-tight leading-snug">
                {book.title}
              </h1>

              <p className="text-sm md:text-lg text-slate-500 mb-3 md:mb-4">
                by {book.publication?.name || "Unknown Author"}
              </p>

              {/* Short description */}
              <p className="text-sm md:text-base text-slate-600/90 leading-relaxed mb-5 md:mb-6">
                {book.shortDescription}
              </p>

              {/* Price: inline on mobile too, so it is visible without scrolling to the bar */}
              <div className="flex items-baseline gap-2 md:gap-3 mb-5 md:mb-6">
                <span className="text-2xl sm:text-4xl font-bold text-primary">
                  {formatPrice(priceInfo.price)}
                </span>
                {priceInfo.originalPrice && (
                  <span className="text-base md:text-xl text-slate-500 line-through">
                    {formatPrice(priceInfo.originalPrice)}
                  </span>
                )}
              </div>

              {/* Format selection */}
              {book.papers && book.papers.length > 0 && (
                <div className="mb-5 md:mb-6">
                  <h3 className="text-sm md:text-base font-semibold mb-2 md:mb-3 text-slate-900">
                    Select Format
                  </h3>

                  {/* Mobile: chips */}
                  <div className="md:hidden flex gap-2 overflow-x-auto -mx-4 px-4 pb-1 snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {book.papers
                      .filter((p) => p.status === "PUBLISHED")
                      .map((paper) => (
                        <button
                          key={paper.id}
                          onClick={() => {
                            setSelectedPaperId(paper.id);
                            setQuantity(1);
                          }}
                          className={`shrink-0 snap-start rounded-full border px-4 py-2 text-sm font-medium transition-colors touch-target ${
                            selectedPaperId === paper.id
                              ? "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/20"
                              : "border-slate-200 bg-white text-slate-700 active:bg-slate-100"
                          }`}
                        >
                          {paper.name}
                        </button>
                      ))}
                  </div>

                  {/* Tablet/desktop: your original Select */}
                  <div className="hidden md:block">
                    <Select
                      value={selectedPaperId || ""}
                      onValueChange={(value) => {
                        setSelectedPaperId(value);
                        setQuantity(1);
                      }}
                    >
                      <SelectTrigger className="w-full bg-white border-orange-500 focus:ring-orange-600 cursor-pointer hover:bg-orange-100">
                        <SelectValue placeholder="Choose a format" />
                      </SelectTrigger>
                      <SelectContent>
                        {book.papers
                          .filter((p) => p.status === "PUBLISHED")
                          .map((paper) => (
                            <SelectItem key={paper.id} value={paper.id}>
                              <span className="font-medium">{paper.name}</span>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Selected paper info: compact strip */}
              {selectedPaper && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 md:mb-6 p-3 md:p-4 bg-slate-50 rounded-2xl border border-slate-100"
                >
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <h4 className="text-sm md:text-base font-semibold text-slate-900">
                      {selectedPaper.name}
                    </h4>
                    {priceInfo.discount > 0 && (
                      <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px] md:text-xs">
                        -{priceInfo.discount}% OFF
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[11px] md:text-xs text-slate-500">
                        ISBN
                      </p>
                      <p className="font-semibold text-slate-900 text-xs md:text-sm break-all">
                        {selectedPaper.isbn || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] md:text-xs text-slate-500">
                        Pages
                      </p>
                      <p className="font-semibold text-slate-900 text-xs md:text-sm">
                        {selectedPaper.pageCount || "N/A"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quantity & Add to Cart: tablet/desktop only (mobile uses the sticky bar) */}
              <div className="hidden md:flex flex-row gap-4 mb-8">
                <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-sm w-auto">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-slate-50 transition-colors active:scale-95 text-slate-600 touch-target"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 font-semibold text-slate-900 flex-1 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-3 hover:bg-slate-50 transition-colors active:scale-95 text-slate-600 touch-target"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <Button
                  size="lg"
                  disabled={isAddingToCart}
                  className="flex-1 active:scale-95 transition-transform h-14 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl border border-primary/20 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 touch-target"
                  onClick={handleAddToCart}
                >
                  {isAddingToCart ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <ShoppingCart className="w-5 h-5 mr-2" />
                  )}
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </Button>
              </div>

              {/* Features: 3 small tiles on mobile, inline list on md+ */}
              <div className="grid grid-cols-3 gap-2 md:flex md:flex-wrap md:gap-4">
                {features.map((feature) => (
                  <div
                    key={feature.text}
                    className="flex flex-col md:flex-row items-center text-center md:text-left gap-1 md:gap-2 p-2.5 md:p-0 rounded-xl bg-slate-50 md:bg-transparent text-[11px] leading-tight md:text-sm text-slate-500"
                  >
                    <feature.icon className="w-4 h-4 text-primary" />
                    {feature.text}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Tabs: now uses the same container padding as the rest of the page */}
        <Tabs
          defaultValue="details"
          className="mb-8 container mx-auto px-4 lg:px-8"
        >
          <TabsList className="bg-slate-100 w-full md:w-auto grid grid-cols-2 md:inline-flex h-11 rounded-xl p-1">
            <TabsTrigger
              value="details"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Details
            </TabsTrigger>
            <TabsTrigger
              value="infos"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Tag className="w-4 h-4 mr-2" />
              Infos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4">
            <p className="text-sm md:text-base text-slate-600/90 leading-relaxed whitespace-pre-line">
              {book.description}
            </p>
          </TabsContent>

          <TabsContent value="infos" className="mt-4">
            <div className="grid grid-cols-2 gap-2.5 md:gap-4">
              {[
                {
                  icon: BookOpen,
                  label: "Pages",
                  value: selectedPaper?.pageCount || book.edition,
                },
                {
                  icon: Calendar,
                  label: "Published",
                  value: new Date(book.publicationDate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  ),
                },
                {
                  icon: Hash,
                  label: "ISBN",
                  value: selectedPaper?.isbn || book.isbn,
                },
                { icon: Globe, label: "Language", value: book.language },
                { icon: Tag, label: "Edition", value: book.edition },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100 min-w-0"
                >
                  <item.icon className="w-4 h-4 md:w-5 md:h-5 text-primary mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] md:text-sm text-slate-500">
                      {item.label}
                    </p>
                    <p className="text-xs md:text-base font-semibold text-slate-900 break-words">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* ── Sticky bottom bar: mobile only ── */}
      <div
        className="md:hidden fixed bottom-16 inset-x-0 z-40 border-t border-slate-200 bg-white/80 backdrop-blur-xl px-4 pt-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.15)]"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl border border-slate-200 bg-white">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              aria-label="Decrease quantity"
              className="h-12 w-10 flex items-center justify-center text-slate-600 active:bg-slate-100 rounded-l-xl"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-7 text-center text-sm font-semibold text-slate-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
              className="h-12 w-10 flex items-center justify-center text-slate-600 active:bg-slate-100 rounded-r-xl"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <Button
            disabled={isAddingToCart}
            onClick={handleAddToCart}
            className="flex-1 h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg shadow-orange-500/25 active:scale-95 transition-transform"
          >
            {isAddingToCart ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <ShoppingCart className="w-4 h-4 mr-2" />
            )}
            {isAddingToCart
              ? "Adding..."
              : `Add · ${formatPrice(priceInfo.price * quantity)}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

// useSearchParams() requires a Suspense boundary during static rendering
export default function BookDetailsPageRoute() {
  return (
    <Suspense
      fallback={
        <div className="relative min-h-screen bg-white overflow-hidden">
          <main className="pt-24 pb-16 relative z-10">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="animate-pulse">
                <div className="h-8 bg-slate-200 rounded mb-4 w-40" />
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="h-96 bg-slate-200 rounded-2xl" />
                  <div className="space-y-4">
                    <div className="h-12 bg-slate-200 rounded-xl" />
                    <div className="h-6 bg-slate-200 rounded-xl w-3/4" />
                    <div className="h-8 bg-slate-200 rounded-xl w-1/2" />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      }
    >
      <BookDetailsPage />
    </Suspense>
  );
}
