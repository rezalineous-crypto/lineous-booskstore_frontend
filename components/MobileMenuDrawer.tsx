/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, ChevronRight, Home, BookOpen } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: any[];
}

const MobileMenuDrawer = ({ isOpen, onClose, navLinks }: MobileMenuDrawerProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const handleNavigate = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-[60]"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[70] flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h2 className="font-display text-lg font-semibold">Menu</h2>
              <button
                onClick={onClose}
                className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-slate-100 touch-target"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-4 border-b border-slate-200">
                {isAuthenticated && user ? (
                  <button
                    onClick={() => handleNavigate("/profile")}
                    className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-50 touch-target"
                  >
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-slate-900">{user.name || user.email}</p>
                      <p className="text-sm text-slate-500">View Profile</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </button>
                ) : (
                  <Button
                    onClick={() => handleNavigate("/login")}
                    className="w-full bg-primary hover:bg-primary-hover text-white h-11"
                  >
                    Sign In / Register
                  </Button>
                )}
              </div>

              <div className="p-4 space-y-1">
                <button
                  onClick={() => handleNavigate("/")}
                  className={`flex items-center gap-3 w-full p-3 rounded-xl touch-target ${
                    pathname === "/" ? "bg-primary/5 text-primary" : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Home</span>
                </button>

                <button
                  onClick={() => handleNavigate("/books")}
                  className={`flex items-center gap-3 w-full p-3 rounded-xl touch-target ${
                    pathname.startsWith("/books") ? "bg-primary/5 text-primary" : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  <span className="font-medium">All Books</span>
                </button>

                {navLinks.slice(1).map((link, idx) => (
                  link.name && !link.name.startsWith("skeleton") && (
                    <button
                      key={idx}
                      onClick={() => {
                        if (link.href) {
                          handleNavigate(link.href);
                        }
                      }}
                      className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-slate-50 text-slate-700 touch-target"
                    >
                      <span className="font-medium">{link.name}</span>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </button>
                  )
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenuDrawer;
