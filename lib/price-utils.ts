import { BookPaper } from "./types";

// Format a price (string | number) as BDT with 2 decimals, e.g. "৳350.00".
// Centralized so float artifacts (0.30000000000000004) never reach the UI.
export function formatPrice(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "৳0.00";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(num)) return "৳0.00";
  return `৳${num.toFixed(2)}`;
}

export function getEffectivePrice(paper: BookPaper | null): number {
  if (!paper) return 0;

  // If effectivePrice is provided, use it
  if (paper.effectivePrice !== undefined) {
    return paper.effectivePrice;
  }

  // Calculate from price and discount
  const price = typeof paper.price === "string" ? parseFloat(paper.price) : paper.price;
  const discountPrice = paper.discountPrice
    ? typeof paper.discountPrice === "string"
      ? parseFloat(paper.discountPrice)
      : paper.discountPrice
    : null;

  // Check if discount is active
  if (discountPrice && paper.discountStartDate && paper.discountEndDate) {
    const now = new Date();
    const startDate = new Date(paper.discountStartDate);
    const endDate = new Date(paper.discountEndDate);
    if (now >= startDate && now <= endDate) {
      return discountPrice;
    }
  }

  return price;
}
