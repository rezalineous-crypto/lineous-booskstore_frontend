"use client";

import { useEffect, useState, useCallback } from "react";
import { useSocialLoginContext } from "@/contexts/SocialLoginContext";
import { toast } from "sonner";
import {
  promptGoogle,
  subscribeGoogleAuth,
  subscribeGoogleError,
  isGoogleInitialized,
} from "@/lib/social-login";
import { SocialLoginError } from "@/lib/social-login";

export default function GoogleButton({
  onSuccess,
  className = "",
}: {
  onSuccess?: () => void;
  className?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { authenticate } = useSocialLoginContext();

  useEffect(() => {
    const unsub = subscribeGoogleAuth(async (profile) => {
      setIsLoading(true);
      try {
        await authenticate({ ...profile, provider: "GOOGLE" });
        toast.success("Welcome!", { description: "Signed in with Google." });
        onSuccess?.();
      } catch {
        toast.error("Sign-in failed", { description: "Please try again." });
      } finally {
        setIsLoading(false);
      }
    });

    const unsubError = subscribeGoogleError((error: SocialLoginError) => {
      toast.error(error.message || "Google sign-in failed", {
        description: "Please try again.",
      });
    });

    return () => {
      unsub();
      unsubError();
    };
  }, [authenticate, onSuccess]);

  const handleClick = useCallback(() => {
    if (!isGoogleInitialized()) {
      toast.error("Google Sign-In is not ready yet. Please wait a moment.");
      return;
    }
    promptGoogle();
  }, []);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      aria-busy={isLoading}
      className={`group relative w-full h-12 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm lg:text-base font-medium
        flex items-center justify-center gap-3 shadow-sm
        transition-all duration-300 touch-target
        active:scale-[0.98] active:bg-slate-50
        lg:text-slate-700 lg:hover:bg-slate-50 lg:hover:border-slate-300 lg:hover:shadow-md
        disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 ${className}`}
    >
      {isLoading ? (
        <span className="w-5 h-5 rounded-full border-2 border-slate-300 border-t-slate-700 animate-spin" />
      ) : (
        <GoogleIcon className="w-5 h-5 shrink-0" />
      )}
      <span>{isLoading ? "Signing in..." : "Continue with Google"}</span>
    </button>
  );
}

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    {/* Colored by default (phones/tablets). From lg: up, grey that turns colored on hover, as before. */}
    <path
      className="text-[#4285F4] transition-colors duration-300 lg:text-slate-700 lg:group-hover:!text-[#4285F4]"
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.03 2.53-2.18 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      className="text-[#34A853] transition-colors duration-300 lg:text-slate-700 lg:group-hover:!text-[#34A853]"
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.02 7.7 23 12 23z"
    />
    <path
      className="text-[#FBBC05] transition-colors duration-300 lg:text-slate-700 lg:group-hover:!text-[#FBBC05]"
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      className="text-[#EA4335] transition-colors duration-300 lg:text-slate-700 lg:group-hover:!text-[#EA4335]"
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.98 2.18 7.93l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);
