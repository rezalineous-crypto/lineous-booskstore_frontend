"use client";

import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import CartDrawer from "@/components/CartDrawer";
import { AddressProvider } from "@/contexts/AddressContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { SocialLoginProvider } from "@/contexts/SocialLoginContext";
import TopLoader from "@/components/TopLoader";
import { initGoogle } from "@/lib/social-login";
// Facebook and Apple sign-in are not configured yet (buttons are commented
// out on the login page), so their SDKs are not initialized either.
// import { initFacebook, initApple } from "@/lib/social-login";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    initGoogle(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!);
    // Facebook/Apple SDK init is disabled until those providers are configured.
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        {/* Top-of-viewport loading indicator for route/data loading */}
        <TopLoader />
        <AuthProvider>
          <SocialLoginProvider>
            <CartProvider>
              <WishlistProvider>
                <AddressProvider>
                  <OrderProvider>
                    <TooltipProvider>
                      <Toaster richColors position="bottom-right" />
                      <CartDrawer />
                      {children}
                    </TooltipProvider>
                  </OrderProvider>
                </AddressProvider>
              </WishlistProvider>
            </CartProvider>
          </SocialLoginProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}