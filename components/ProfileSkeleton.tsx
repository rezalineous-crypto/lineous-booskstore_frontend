"use client";

import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Edit2, LogOut, Package, Settings, ChevronRight } from "lucide-react";

export default function ProfileSkeleton() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
          >
            {/* Profile Hero Card Skeleton */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl shadow-slate-200/80 mb-8"
            >
              <div className="relative p-8 lg:p-10">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  {/* Avatar Skeleton */}
                  <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-slate-200 animate-pulse flex-shrink-0" />

                  <div className="flex-1 min-w-0">
                    <div className="h-8 bg-slate-200 rounded w-3/4 animate-pulse mb-2" />
                    <div className="h-5 bg-slate-200 rounded w-1/2 animate-pulse mb-3" />
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs font-medium animate-pulse">
                        <User className="w-3.5 h-3.5" />
                        <span className="h-3.5 bg-slate-200 rounded animate-pulse"></span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium animate-pulse">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="h-3.5 bg-slate-200 rounded animate-pulse"></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 shrink-0">
                    <div className="h-10 bg-slate-200 rounded-xl animate-pulse w-32" />
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Quick Nav Skeleton */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm"
                >
                  <nav className="space-y-2">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50/50 animate-pulse"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-200">
                          <div className="w-5 h-5 bg-slate-300 rounded animate-pulse" />
                        </div>
                        <div className="h-4 bg-slate-300 rounded w-24 animate-pulse" />
                        <div className="w-4 h-4 bg-slate-300 rounded animate-pulse ml-auto" />
                      </div>
                    ))}
                    <div className="pt-2 mt-2 border-t border-slate-100">
                      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50/50 animate-pulse">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-200">
                          <div className="w-5 h-5 bg-slate-300 rounded animate-pulse" />
                        </div>
                        <div className="h-4 bg-slate-300 rounded w-20 animate-pulse" />
                      </div>
                    </div>
                  </nav>
                </motion.div>
              </div>

              {/* Main Content Skeleton */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2 space-y-8"
              >
                {/* Personal Information Skeleton */}
                <div className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-6 bg-slate-200 rounded w-1/3 animate-pulse" />
                    <div className="h-4 bg-slate-200 rounded w-1/4 animate-pulse" />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-1/3 animate-pulse" />
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-300 rounded-full" />
                        <div className="h-10 pl-10 bg-slate-200 rounded animate-pulse" />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-1/3 animate-pulse" />
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-300 rounded-full" />
                        <div className="h-10 pl-10 bg-slate-200 rounded animate-pulse" />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-1/3 animate-pulse" />
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-300 rounded-full" />
                        <div className="h-10 pl-10 bg-slate-200 rounded animate-pulse" />
                      </div>
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-1/3 animate-pulse" />
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-300 rounded-full" />
                        <div className="h-10 pl-10 bg-slate-200 rounded animate-pulse" />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="sm:col-span-2 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-1/3 animate-pulse" />
                      <div className="h-10 bg-slate-200 rounded animate-pulse" />
                    </div>

                    {/* Bio */}
                    <div className="sm:col-span-2 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-1/3 animate-pulse" />
                      <div className="h-24 bg-slate-200 rounded animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Saved Addresses Skeleton */}
                <div className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-6 bg-slate-200 rounded w-1/3 animate-pulse" />
                    <div className="h-9 bg-slate-200 rounded w-20 animate-pulse" />
                  </div>

                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-6 bg-slate-200 rounded w-1/3 mb-2" />
                        <div className="h-4 bg-slate-100 rounded w-2/3" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
