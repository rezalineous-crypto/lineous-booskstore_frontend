"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const MobileBrandBadge = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -24, y: -8, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="md:hidden fixed top-3 -left-1 z-50"
      style={{ marginTop: "env(safe-area-inset-top)" }}
    >
      <Link
        href="/"
        aria-label="Core Learning Centre home"
        className="flex items-center gap-2 rounded-r-lg border border-white/30 bg-white/60 py-1.5 pl-1.5 pr-3.5 shadow-lg shadow-black/10 backdrop-blur-md active:scale-95 transition-transform touch-target"
      >
        <img src="/logo.png" alt="" className="h-9 w-9 object-contain" />
        <div className="flex flex-col leading-none">
          <span className="font-display text-sm font-semibold tracking-tight text-slate-900">
            Core <span className="text-primary">Learning</span> Centre
          </span>
          <span className="mt-0.5 font-display text-[9px] font-medium uppercase tracking-widest text-slate-500">
            Learn with Excellence
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

export default MobileBrandBadge;
