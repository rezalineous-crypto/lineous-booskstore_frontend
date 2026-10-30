"use client";

"use client";
import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, BookOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import heroImage from "@/assets/hero-bookstore.jpg";

// ─── Floating Book Card Component ────────────────────────
const FloatingBook = ({
  src,
  className,
  delay = 0,
  rotate = 0,
  yOffset = 0,
}: {
  src: string;
  className?: string;
  delay?: number;
  rotate?: number;
  yOffset?: number;
}) => (
  <motion.div
    className={`absolute rounded-2xl overflow-hidden shadow-2xl ${className}`}
    initial={{ opacity: 0, y: 60, rotate: rotate - 8 }}
    animate={{
      opacity: 1,
      y: [0, yOffset, 0],
      rotate: [rotate - 2, rotate + 2, rotate - 2],
    }}
    transition={{
      opacity: { delay, duration: 0.8 },
      y: { delay, duration: 5, repeat: Infinity, ease: "easeInOut" },
      rotate: { delay, duration: 6, repeat: Infinity, ease: "easeInOut" },
    }}
  >
    <img src={src} alt="Book cover" className="w-full h-full object-cover" />
  </motion.div>
);

// ─── Main Hero Banner ────────────────────────────────────
export default function HeroBanner() {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.3]);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
      {/* ── Background Layer ── */}
      <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url(${heroImage.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
      </motion.div>

      {/* ── Decorative Blobs ── */}
      <motion.div
        className="absolute top-20 right-[15%] w-48 h-48 md:w-64 md:h-64 lg:w-125 lg:h-125 rounded-full bg-primary/20 blur-[80px] md:blur-[100px] z-0"
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-[10%] w-40 h-40 md:w-64 md:h-64 lg:w-100 lg:h-100 rounded-full bg-accent/20 blur-[60px] md:blur-[80px] z-0"
        animate={{ scale: [1, 1.15, 1], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Content ── */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-[60%_40%] gap-12 lg:gap-16 items-center min-h-[80vh]">
          {/* ── Left Column: Text ── */}
          <motion.div style={{ opacity }} className="">
            {/* Badge */}
            {/* <motion.div
              initial={{ opacity: 0, x: -30, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-md border border-primary/30 text-charcoal px-5 py-2.5 rounded-full mb-8 shadow-lg"
            >
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold">
                New Collection Available
              </span>
            </motion.div> */}

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.4,
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94] as const,
              }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.15] mb-6 max-w-xl"
            >
              A journey to achieve the{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-orange-500 italic font-serif">
                  Milestone
                </span>
                <motion.svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                >
                  <motion.path
                    d="M2 8C50 2 150 2 198 8"
                    stroke="var(--color-accent)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                  />
                </motion.svg>
              </span>{" "}
              without agonizing pain
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="text-sm sm:text-base text-gray-300 leading-relaxed mb-8 sm:mb-10 max-w-2xl"
            >
              CLC Resource is an ultimate HUB for Paper based Workbooks featuring
              real exam-style layouts with dedicated space to write the answers
              covering the genre of Topical Past Papers, Year-wise Past Papers
              and Predicted Mock Papers for Cambridge, Edexcel and IB
              (International Baccalaureate) curricula designed to streamline the
              learning and boost the exam confidence. Explore the meticulously
              organized comprehensive collection to bridge the gap between
              studying and scoring.
            </motion.p>

            {/* Search Bar */}
            {/* <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="mb-10 max-w-lg"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    router.push(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
                  }
                }}
                className="flex gap-2"
              >
                <Input
                  placeholder="Search books, authors, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white text-base font-semibold shadow-xl shadow-primary/20 hover:shadow-2xl transition-all duration-300"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </form>
            </motion.div> */}

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Button
                size="lg"
                className="h-12 sm:h-14 px-6 sm:px-8 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-sm sm:text-base font-semibold shadow-xl shadow-charcoal/20 hover:shadow-2xl transition-all duration-300 group w-full sm:w-auto touch-target"
                onClick={() => {
                  const el = document.getElementById("new-releases");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Browse Collection
                <motion.span
                  className="ml-2 inline-block"
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </motion.span>
              </Button>
            </motion.div>
          </motion.div>

          {/* ── Right Column: Floating Books Visual ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="relative hidden lg:block h-150"
          >
            {/* Main featured book */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80 rounded-3xl overflow-hidden shadow-2xl shadow-charcoal/30 z-20"
              initial={{ scale: 0.8, rotate: -5, opacity: 0 }}
              animate={{
                scale: 1,
                rotate: [-3, 3, -3],
                opacity: 1,
                y: [0, -20, 0],
              }}
              transition={{
                scale: { delay: 0.6, duration: 0.8 },
                rotate: {
                  delay: 0.8,
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                y: {
                  delay: 0.8,
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                opacity: { delay: 0.6, duration: 0.8 },
              }}
            >
              <img
                src="/bannerImage/Biology.jpeg"
                alt="Featured book"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-charcoal/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-1 text-primary mb-2">
                  {[...Array(5)].map((_, i) => (
                    <BookOpen key={i} className="w-3 h-3" />
                  ))}
                </div>
                <p className="text-white text-sm font-semibold">
                  The Great Gatsby
                </p>
                <p className="text-white/60 text-xs">F. Scott Fitzgerald</p>
              </div>
            </motion.div>

            {/* Floating smaller books */}
            <FloatingBook
              src="/bannerImage/Chemistry.jpeg"
              className="w-36 h-48 top-8 right-8 z-10"
              delay={0.3}
              rotate={8}
              yOffset={-15}
            />
            <FloatingBook
              src="/bannerImage/Amath.jpeg"
              className="w-32 h-44 bottom-16 left-0 z-10"
              delay={0.5}
              rotate={-6}
              yOffset={15}
            />
            <FloatingBook
              src="/bannerImage/Gmath.jpeg"
              className="w-28 h-40 top-24 left-4 z-0 opacity-60"
              delay={0.7}
              rotate={-12}
              yOffset={-10}
            />

            {/* Decorative rings */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 rounded-full border-2 border-primary/20 z-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-80 rounded-full border-2 border-dashed border-primary/15 z-0"
              animate={{ rotate: -360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            />

            {/* Small decorative elements */}
            <motion.div
              className="absolute top-12 left-1/3 w-3 h-3 rounded-full bg-primary z-30"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-24 right-1/4 w-2 h-2 rounded-full bg-accent z-30"
              animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
