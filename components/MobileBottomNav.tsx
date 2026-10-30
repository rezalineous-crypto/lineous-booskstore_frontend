/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Home, Grid3x3, ShoppingCart, User, LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartContext } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  active: boolean;
  badge?: number;
  onClick?: (e: React.MouseEvent) => void;
};

const MobileBottomNav = () => {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCartContext();
  const { isAuthenticated } = useAuth();

  if (pathname === "/login") return null;

  const navItems: NavItem[] = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      active: pathname === "/",
    },
    {
      name: "Categories",
      href: "/books",
      icon: Grid3x3,
      active: pathname.startsWith("/books"),
    },
    {
      name: "Cart",
      href: "#cart",
      icon: ShoppingCart,
      active: false,
      badge: totalItems > 0 ? totalItems : undefined,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        setIsCartOpen(true);
      },
    },
    {
      name: isAuthenticated ? "Profile" : "Login",
      href: isAuthenticated ? "/profile" : "/login",
      icon: User,
      active: pathname === "/profile",
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200 safe-bottom">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.active;

          if (item.onClick) {
            return (
              <button
                key={item.name}
                onClick={item.onClick}
                className="flex flex-col items-center justify-center gap-1 touch-target transition-colors relative"
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-primary" : "text-slate-600"
                    }`}
                  />
                  {item.badge && item.badge > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 text-[9px] font-semibold bg-primary text-white rounded-full flex items-center justify-center"
                    >
                      {item.badge > 99 ? "99+" : item.badge}
                    </motion.span>
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium ${
                    isActive ? "text-primary" : "text-slate-600"
                  }`}
                >
                  {item.name}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 touch-target transition-colors relative"
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? "text-primary" : "text-slate-600"
                  }`}
                />
                {item.badge && item.badge > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 text-[9px] font-semibold bg-primary text-white rounded-full flex items-center justify-center"
                  >
                    {item.badge > 99 ? "99+" : item.badge}
                  </motion.span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-primary" : "text-slate-600"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
