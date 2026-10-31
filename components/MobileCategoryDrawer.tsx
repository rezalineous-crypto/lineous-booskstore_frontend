"use client";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Loader2, Folder, BookOpen, Book } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCategoriesMenuTree } from "@/hooks/use-categories";
import {
  MenuTreeCategory,
  MenuTreePublication,
  MenuTreeSubject,
} from "@/lib/types";
import { useState, useEffect } from "react";

interface MobileCategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileCategoryDrawer = ({
  isOpen,
  onClose,
}: MobileCategoryDrawerProps) => {
  const router = useRouter();
  const { data: menuTree = [], isLoading } = useCategoriesMenuTree();
  const [activeCategory, setActiveCategory] = useState<MenuTreeCategory | null>(
    null
  );
  const [activePublication, setActivePublication] =
    useState<MenuTreePublication | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const handleNavigate = (href: string) => {
    onClose();
    router.push(href);
  };

  const reset = () => {
    setActiveCategory(null);
    setActivePublication(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // SSR-safe portal: only render portal on client
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 h-dvh bg-black/50 z-[60] backdrop-blur-xs"
            onClick={handleClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 h-[70dvh] bg-white z-[70] rounded-t-3xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h2 className="font-display text-lg font-semibold">
                {activePublication
                  ? activePublication.name
                  : activeCategory
                  ? activeCategory.name
                  : "Categories"}
              </h2>
              <button
                onClick={handleClose}
                className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-slate-100 touch-target"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-12 bg-slate-200 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : activePublication ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-2 space-y-2"
                >
                  {activePublication.subjects?.map(
                    (subject: MenuTreeSubject, idx: number) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          const href = `/${activeCategory?.slug}/${activePublication.slug}/${subject.slug}`;
                          handleNavigate(href);
                        }}
                        className="flex items-center justify-between w-full p-4 rounded-xl hover:bg-slate-50 text-slate-700 touch-target group group-active:bg-orange-50 active:text-orange-600"
                      >
                        <div className="flex items-center gap-3">
                          <Book className="w-5 h-5 text-slate-400 group-active:text-orange-600" />
                          <span className="font-medium text-sm group-active:text-orange-600">
                            {subject.name}
                          </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-active:text-orange-600" />
                      </motion.button>
                    )
                  )}
                </motion.div>
              ) : activeCategory ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-2 space-y-2"
                >
                  {activeCategory.publications?.map(
                    (pub: MenuTreePublication, idx: number) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActivePublication(pub)}
                        className="flex items-center justify-between w-full p-4 rounded-xl hover:bg-slate-50 text-slate-700 touch-target group group-active:bg-orange-50 active:text-orange-600"
                      >
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-5 h-5 text-slate-400 group-active:text-orange-600" />
                          <span className="font-medium text-sm">
                            {pub.name}
                          </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-active:text-orange-600" />
                      </motion.button>
                    )
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-2 space-y-2"
                >
                  {menuTree.map((category: MenuTreeCategory, idx: number) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveCategory(category)}
                      className="flex items-center justify-between w-full p-4 rounded-xl hover:bg-slate-50 text-slate-700 active:text-orange-600 touch-target active:bg-orange-50 group"
                    >
                      <div className="flex items-center gap-3">
                        <Folder className="w-5 h-5 text-slate-400 group-active:text-orange-600" />
                        <span className="font-medium text-sm">
                          {category.name}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-active:text-orange-600" />
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>

            {(activeCategory || activePublication) && (
              <div className="p-3 border-t border-slate-200">
                <button
                  onClick={() => {
                    if (activePublication) {
                      setActivePublication(null);
                    } else if (activeCategory) {
                      setActiveCategory(null);
                    }
                  }}
                  className="w-full p-2 text-sm text-primary font-medium touch-target"
                >
                  Back
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default MobileCategoryDrawer;
