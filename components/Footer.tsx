/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { motion } from "framer-motion";
import { Send, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Footer = () => {
  const pathname = usePathname();

  const footerLinks = {
    "Quick Links": [
      "Home",
      "New Releases",
      "Bestsellers",
      "Coming Soon",
      "Deals",
    ],
    Categories: [
      "Fiction",
      "Non-Fiction",
      "Children",
      "Biography",
      "Self-Help",
    ],
    Help: ["FAQ", "Shipping", "Returns", "Track Order", "Contact Us"],
  };

  // const socialLinks = [
  //   { icon: Facebook, href: "#" },
  //   { icon: Twitter, href: "#" },
  //   { icon: Instagram, href: "#" },
  //   { icon: Youtube, href: "#" },
  // ];

  if (pathname === "/login") return null;

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className=" gap-6 lg:gap-8">
          <div className="col-span-1 md:col-span-4 lg:col-span-2">
            {/* Brand — same logo file and text style as the navbar */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img
                  src="/logo.png"
                  className="w-20 h-20 object-contain hidden md:block transition-transform duration-300 group-hover:scale-105"
                />
                <img
                  src="/logowtext.png"
                  className="w-9 h-9 object-contain block md:hidden transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="hidden md:block">
                <div>
                  <span className="font-display text-xl font-semibold tracking-tight text-white">
                    Core
                  </span>
                  <span className="font-display text-xl font-semibold tracking-tight text-primary ml-1">
                    Learning
                  </span>
                  <span className="font-display text-xl font-semibold tracking-tight text-white ml-1">
                    Centre
                  </span>
                </div>
                {/* Tagline */}
                <p className="text-sm font-display font-medium text-gray-500 tracking-widest">
                  Learn with Excellence
                </p>
              </div>
            </Link>

            <div className="mt-4 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 w-full">
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline">
                    Sector-5, Uttara, Dhaka, 1230
                  </span>
                  <span className="sm:hidden">
                    Sector-5, Uttara, Dhaka, 1230
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <div className="flex flex-col">
                    <span>+8801764415165</span>
                    <span>+8801968524143</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>hello@bookhaven.com</span>
                </div>
              </div>
              <div className="flex flex-col items-start lg:items-end gap-3">
                <span className="text-sm font-medium text-white">
                  Get updates
                </span>
                <div className="flex flex-col gap-2">
                  <Link
                    href="https://www.facebook.com/share/1GhURu7yHh/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                    aria-label="Facebook"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">Facebook</span>
                  </Link>
                  <Link
                    href="https://www.instagram.com/clcresourses?psln=aWtiOG15Y29pbDNr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                    aria-label="Instagram"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">Instagram</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 lg:px-8 py-6 pb-20 lg:pb-6">
          <div className="flex justify-center">
            <p className="text-sm text-white/60 text-center">
              © 2026 Core Learning Centre. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
