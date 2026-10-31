"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Truck,
  Lock,
  Check,
  MapPin,
  Plus,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Separator } from "../../components/ui/separator";

import { useCartContext } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { useCreateOrder } from "../../hooks/use-orders";
import { useAddresses } from "../../hooks/use-addresses";
import { AddressFormDialog } from "@/components/AddressFormDialog";
import { Address } from "../../lib/types";
import { toast } from "sonner";
import { getEffectivePrice, formatPrice } from "@/lib/price-utils";

// Shared look for every card on the page
const cardClass =
  "relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm shadow-slate-200/60 sm:p-6";

// Radio rows highlight themselves when their radio is checked (Tailwind v4 has-[] variant)
const radioRowClass =
  "flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5";

const primaryBtnClass =
  "h-12 rounded-xl border border-primary/20 bg-orange-500 font-semibold text-white shadow-lg shadow-primary/20 transition-transform hover:bg-orange-600 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] cursor-pointer";

const secondaryBtnClass =
  "h-12 rounded-xl border-border bg-card px-6 text-body transition-transform hover:border-primary/40 hover:bg-muted active:scale-[0.98]";

const CheckoutPage = () => {
  const { items, totalPrice, clearCart, isLoading: cartLoading } = useCartContext();
  const { user, mounted } = useAuth();
  const createOrderMutation = useCreateOrder();
  const { data: addresses = [], isLoading: addressesLoading } = useAddresses(user?.id);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [newlyCreatedAddress, setNewlyCreatedAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  const selectedAddress =
    addresses.find((a) => a.id === selectedAddressId) || newlyCreatedAddress;

  // Checkout requires an account — send guests to login
  useEffect(() => {
    if (mounted && !user) {
      toast.error("Please login to checkout");
      const queryString = searchParams.toString();
      const callbackUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }
  }, [mounted, user, router, pathname, searchParams]);

  if (!mounted || !user) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p className="text-sm">Redirecting to login…</p>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !cartLoading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
        <div className="relative z-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <ShoppingBag className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-2 font-display text-2xl font-bold text-heading">
            Your cart is empty
          </h1>
          <p className="mb-6 text-muted-foreground">
            Add some books to get started!
          </p>
          <Button
            onClick={() => router.push("/")}
            className="h-12 rounded-xl border border-primary/20 bg-gradient-to-r from-primary via-primary-hover to-primary px-8 text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
          >
            Browse Books
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    setIsProcessing(true);

    try {
      if (!selectedAddressId) {
        toast.error("Please select or create an address");
        return;
      }

      const order = await createOrderMutation.mutateAsync({
        addressId: selectedAddressId,
        discount: 0,
        paymentMethod,
        notes: "",
      });

      clearCart();
      router.push(`/orders/success?orderId=${order.id}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const isSubmitting = isProcessing || createOrderMutation.isPending;

  const handleAddressCreated = (address?: Address) => {
    if (address) {
      setNewlyCreatedAddress(address);
      setSelectedAddressId(address.id);
    }
  };

  const steps = [
    { number: 1, label: "Shipping" },
    { number: 2, label: "Payment" },
    { number: 3, label: "Review" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* pt-20 clears the floating brand badge on mobile; step 3 gets extra bottom room for the sticky bar */}
      <main
        className={`relative z-10 pt-20 sm:pt-24 lg:pb-16 ${
          step === 3 ? "pb-44" : "pb-24"
        }`}
      >
        <div className="container mx-auto max-w-6xl px-4 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 sm:mb-8"
          >
            <Link
              href="/"
              className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
            <h1 className="font-display text-2xl font-bold text-heading sm:text-3xl lg:text-4xl">
              Checkout
            </h1>
          </motion.div>

          {/* Progress: compact bar on phones */}
          <div className="mb-5 sm:hidden">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-foreground">
                {steps[step - 1].label}
              </span>
              <span className="text-muted-foreground">
                Step {step} of {steps.length}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-accent"
                initial={false}
                animate={{ width: `${(step / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Progress: full stepper from sm up */}
          <div className="mb-10 hidden items-center sm:flex">
            {steps.map((s, i) => (
              <div
                key={s.number}
                className={`flex items-center ${
                  i < steps.length - 1 ? "flex-1" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-all duration-300 ${
                      step >= s.number
                        ? "border-primary/20 bg-accent text-white shadow-lg shadow-primary/20"
                        : "border-border bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > s.number ? <Check className="h-5 w-5" /> : s.number}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      step >= s.number
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`mx-4 h-0.5 flex-1 rounded-full transition-colors duration-300 ${
                      step > s.number ? "bg-accent" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
            {/* Form Section */}
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 lg:col-span-2"
            >
              {/* Step 1: Shipping */}
              {step === 1 && (
                <div className={cardClass}>
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.04] via-transparent to-transparent" />

                  <h2 className="relative z-10 mb-5 flex items-center gap-3 font-display text-lg font-semibold text-heading sm:text-xl">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                      <Truck className="h-5 w-5 text-primary" />
                    </span>
                    Shipping Information
                  </h2>

                  <h3 className="relative z-10 mb-3 flex items-center gap-2 font-semibold text-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    Select an address
                  </h3>

                  {addressesLoading ? (
                    <div className="relative z-10 mb-4 grid gap-3 md:grid-cols-2">
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-28 rounded-xl bg-muted" />
                        </div>
                      ))}
                    </div>
                  ) : addresses.length > 0 ? (
                    <div className="relative z-10 mb-4 grid gap-3 md:grid-cols-2">
                      {addresses.map((addr) => (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => setSelectedAddressId(addr.id)}
                          aria-pressed={selectedAddressId === addr.id}
                          className={`touch-target relative flex w-full items-start gap-3 rounded-xl border-2 p-4 text-left transition-all active:scale-[0.99] ${
                            selectedAddressId === addr.id
                              ? "border-primary bg-primary/5 shadow-md"
                              : "border-border bg-card hover:border-primary/40"
                          }`}
                        >
                          <MapPin
                            className={`mt-0.5 h-5 w-5 shrink-0 ${
                              selectedAddressId === addr.id
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                          <div className="min-w-0 flex-1 pr-6">
                            <p className="font-medium text-foreground">{addr.name}</p>
                            <p className="break-words text-sm text-muted-foreground">
                              {addr.addressLine}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {addr.district}
                              {addr.area && `, ${addr.area}`}
                            </p>
                            {addr.country && (
                              <p className="text-sm text-muted-foreground">
                                {addr.country}
                                {addr.postalCode && ` ${addr.postalCode}`}
                              </p>
                            )}
                            <p className="mt-1 text-sm font-medium text-foreground/80">
                              {addr.phone}
                            </p>
                          </div>
                          {selectedAddressId === addr.id && (
                            <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                              <Check className="h-3 w-3 text-white" />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="relative z-10 mb-4 rounded-xl border-2 border-dashed border-border py-8 text-center">
                      <MapPin className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
                      <p className="text-muted-foreground">No saved addresses yet</p>
                    </div>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    className="relative z-10 h-12 w-full justify-between rounded-xl active:scale-[0.99]"
                    onClick={() => setIsAddressDialogOpen(true)}
                  >
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Create New Address
                    </span>
                    <Plus className="h-4 w-4" />
                  </Button>

                  <Separator className="my-6 bg-border" />

                  <h3 className="relative z-10 mb-3 font-semibold text-foreground">
                    Shipping Method
                  </h3>
                  <RadioGroup
                    value={shippingMethod}
                    onValueChange={setShippingMethod}
                    className="relative z-10 space-y-3"
                  >
                    <label className={radioRowClass}>
                      <RadioGroupItem
                        value="standard"
                        className="mt-1 border-border text-primary"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground">Standard Shipping</p>
                        <p className="text-sm text-muted-foreground">
                          2-3 business days
                        </p>
                        <p className="mt-1 text-sm font-medium text-primary">
                          Delivery charge will depend on your location
                        </p>
                      </div>
                    </label>
                  </RadioGroup>

                  <Button
                    className={`relative z-10 mt-6 w-full ${primaryBtnClass}`}
                    onClick={() => setStep(2)}
                  >
                    Continue to Payment
                  </Button>
                </div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <div className={cardClass}>
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/[0.04] via-transparent to-transparent" />

                  <h2 className="relative z-10 mb-5 flex items-center gap-3 font-display text-lg font-semibold text-heading sm:text-xl">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </span>
                    Payment Method
                  </h2>

                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="relative z-10 mb-6 space-y-3"
                  >
                    <label className={`${radioRowClass} items-center`}>
                      <RadioGroupItem value="COD" className="border-border text-primary" />
                      <CreditCard className="h-5 w-5 text-primary" />
                      <span className="font-medium text-foreground">
                        Cash on Delivery
                      </span>
                    </label>
                  </RadioGroup>

                  <div className="relative z-10 flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      className={secondaryBtnClass}
                    >
                      Back
                    </Button>
                    <Button
                      className={`flex-1 ${primaryBtnClass}`}
                      onClick={() => setStep(3)}
                    >
                      Review Order
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className={cardClass}>
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/[0.04] via-transparent to-transparent" />

                  <h2 className="relative z-10 mb-5 flex items-center gap-3 font-display text-lg font-semibold text-heading sm:text-xl">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10">
                      <Check className="h-5 w-5 text-accent" />
                    </span>
                    Review Your Order
                  </h2>

                  <div className="relative z-10 mb-5 grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-border bg-muted p-4">
                      <h3 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        Shipping Address
                      </h3>
                      {selectedAddress ? (
                        <p className="break-words text-sm leading-relaxed text-muted-foreground">
                          <span className="font-medium text-foreground">
                            {selectedAddress.name}
                          </span>
                          <br />
                          {selectedAddress.addressLine}
                          <br />
                          {selectedAddress.district}
                          {selectedAddress.area && `, ${selectedAddress.area}`}
                          {selectedAddress.country && (
                            <>
                              <br />
                              {selectedAddress.country}
                              {selectedAddress.postalCode &&
                                ` ${selectedAddress.postalCode}`}
                            </>
                          )}
                          <br />
                          Phone: {selectedAddress.phone}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No address selected
                        </p>
                      )}
                    </div>

                    <div className="rounded-xl border border-border bg-muted p-4">
                      <h3 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                        <CreditCard className="h-4 w-4 text-primary" />
                        Payment Method
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {paymentMethod === "COD"
                          ? "Cash on Delivery"
                          : paymentMethod}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 mb-6 flex items-center gap-3 rounded-xl border border-accent/20 bg-accent/10 p-4">
                    <Lock className="h-5 w-5 shrink-0 text-accent" />
                    <p className="text-sm text-body">
                      Your payment information is secure and encrypted
                    </p>
                  </div>

                  <div className="relative z-10 flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setStep(2)}
                      className={`${secondaryBtnClass} max-lg:flex-1`}
                    >
                      Back
                    </Button>
                    {/* Phones use the sticky bar at the bottom instead */}
                    <Button
                      className={`hidden flex-1 lg:inline-flex ${primaryBtnClass}`}
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Place Order"}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-1"
            >
              <div className={`${cardClass} lg:sticky lg:top-24`}>
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.04] via-transparent to-transparent" />
                <h2 className="relative z-10 mb-5 font-display text-lg font-semibold text-heading sm:text-xl">
                  Order Summary
                </h2>

                <div className="relative z-10 mb-5 max-h-[360px] space-y-4 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.paper?.thumbnail || item.book.thumbnail}
                        alt={item.book.title}
                        className="h-20 w-16 shrink-0 rounded-lg border border-border bg-muted object-cover"
                      />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
                          {item.book.title}
                        </h3>
                        {item.paper && (
                          <p className="truncate text-xs font-medium text-primary">
                            {item.paper.name}
                          </p>
                        )}
                        <div className="mt-auto flex items-center justify-between pt-1">
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-semibold text-primary">
                            {formatPrice(getEffectivePrice(item.paper) * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="relative z-10 space-y-3 border-t border-border pt-4">
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-foreground">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="max-w-[60%] text-right font-medium text-foreground">
                      Delivery charge will depend on your location
                    </span>
                  </div>
                  <Separator className="bg-border" />
                  <div className="flex items-baseline justify-between text-lg font-bold">
                    <span className="text-foreground">Total</span>
                    <span className="text-xl text-primary">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <AddressFormDialog
        open={isAddressDialogOpen}
        onOpenChange={setIsAddressDialogOpen}
        onSuccess={handleAddressCreated}
      />

      {/* Sticky Place Order bar: phones, review step only */}
      {step === 3 && (
        <div className="safe-bottom fixed inset-x-0 bottom-16 z-40 border-t border-slate-200 bg-white/90 px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.15)] backdrop-blur-xl lg:hidden">
          <div className="flex items-center gap-4">
            <div className="shrink-0">
              <p className="text-[11px] leading-none text-muted-foreground">Total</p>
              <p className="text-lg font-bold leading-tight text-primary">
                {formatPrice(totalPrice)}
              </p>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="touch-target h-12 flex-1 rounded-xl bg-orange-500 font-semibold text-white shadow-lg shadow-orange-500/25 transition-transform hover:bg-orange-600 active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Place Order"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;