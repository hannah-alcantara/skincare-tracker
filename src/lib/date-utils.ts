import { format } from "date-fns";
import { Product } from "@/utils/supabase/types";

export type ProductStatus = "active" | "expiring-soon" | "expired" | "finished";

export interface ProductStatusInfo {
  status: ProductStatus;
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
  className: string;
}

export interface BadgeProps {
  variant: "default" | "secondary" | "destructive" | "outline";
  className: string;
}

/**
 * Format a date for display
 * @param date - Date object, string, null, or undefined
 * @returns Formatted date string or "Not set" if no date
 */
export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return "Not set";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "MMM d, yyyy");
};

/**
 * Calculate days difference between two dates
 * @param targetDate - The target date to compare
 * @param fromDate - The reference date (defaults to now)
 * @returns Number of days (positive if target is in future, negative if in past)
 */
export const getDaysDifference = (
  targetDate: Date | string,
  fromDate: Date = new Date()
): number => {
  const target = typeof targetDate === "string" ? new Date(targetDate) : targetDate;
  const timeDiff = target.getTime() - fromDate.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

/**
 * Check if a date is in the past
 * @param date - Date to check
 * @returns True if date is in the past
 */
export const isDateInPast = (date: Date | string | null | undefined): boolean => {
  if (!date) return false;
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj < new Date();
};

/**
 * Check if a date is within a certain number of days from now
 * @param date - Date to check
 * @param days - Number of days to check within
 * @returns True if date is within the specified days
 */
export const isDateWithinDays = (
  date: Date | string | null | undefined,
  days: number
): boolean => {
  if (!date) return false;
  const daysDiff = getDaysDifference(date);
  return daysDiff >= 0 && daysDiff <= days;
};

/**
 * Determine product status based on dates
 * @param product - Product to analyze
 * @returns Product status
 */
export const getProductStatus = (product: Product): ProductStatus => {
  const now = new Date();

  // Product is finished if it has a date_finished
  if (product.date_finished) {
    return "finished";
  }

  if (product.expiration_date) {
    const expirationDate = new Date(product.expiration_date);
    const timeDiff = expirationDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) {
      return "expired";
    } else if (daysDiff <= 30) {
      return "expiring-soon";
    }
  }
  return "active";
};

/**
 * Get detailed product status information with styling
 * @param product - Product to analyze
 * @returns Product status with label and styling information
 */
export const getProductStatusInfo = (product: Product): ProductStatusInfo => {
  const now = new Date();

  // Product is finished if it has a date_finished
  if (product.date_finished) {
    return {
      status: "finished",
      label: "Finished",
      variant: "secondary" as const,
      className: "",
    };
  }

  // Check expiration status
  if (product.expiration_date) {
    const expirationDate = new Date(product.expiration_date);
    const timeDiff = expirationDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) {
      return {
        status: "expired",
        label: "Expired",
        variant: "destructive" as const,
        className: "bg-red-100 text-red-800 border-red-200",
      };
    } else if (daysDiff <= 7) {
      return {
        status: "expiring-soon",
        label: `Expires in ${daysDiff} day${daysDiff === 1 ? "" : "s"}`,
        variant: "destructive" as const,
        className: "bg-red-50 text-red-700 border-red-200",
      };
    } else if (daysDiff <= 14) {
      return {
        status: "expiring-soon",
        label: `Expires in ${daysDiff} days`,
        variant: "default" as const,
        className: "bg-orange-50 text-orange-700 border-orange-200",
      };
    } else if (daysDiff <= 30) {
      return {
        status: "expiring-soon",
        label: `Expires in ${daysDiff} days`,
        variant: "secondary" as const,
        className: "bg-yellow-50 text-yellow-700 border-yellow-200",
      };
    }
  }

  return {
    status: "active",
    label: "Active",
    variant: "outline" as const,
    className: "",
  };
};

/**
 * Get badge properties for expiration urgency display
 * @param product - Product to analyze
 * @returns Badge variant and styling
 */
export const getBadgeProps = (product: Product): BadgeProps => {
  if (!product.expiration_date) {
    return { variant: "secondary" as const, className: "" };
  }

  const now = new Date();
  const expirationDate = new Date(product.expiration_date);
  const timeDiff = expirationDate.getTime() - now.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  if (daysDiff < 0) {
    return { variant: "destructive" as const, className: "bg-red-100 text-red-800 border-red-300" };
  } else if (daysDiff <= 7) {
    return { variant: "destructive" as const, className: "bg-red-50 text-red-700 border-red-200" };
  } else if (daysDiff <= 14) {
    return { variant: "default" as const, className: "bg-orange-50 text-orange-700 border-orange-200" };
  } else if (daysDiff <= 30) {
    return { variant: "secondary" as const, className: "bg-yellow-50 text-yellow-700 border-yellow-200" };
  }
  
  return { variant: "secondary" as const, className: "" };
};

/**
 * Check if a product is finished/expired (for filtering)
 * @param product - Product to check
 * @returns True if product is finished or expired
 */
export const isProductFinished = (product: Product): boolean => {
  // Product is finished if it has a date_finished
  if (product.date_finished) {
    return true;
  }

  // Product is expired if expiration_date has passed
  if (product.expiration_date) {
    const now = new Date();
    const expirationDate = new Date(product.expiration_date);
    return expirationDate < now;
  }

  return false;
};

/**
 * Sort products by expiration date (earliest first)
 * @param products - Array of products to sort
 * @returns Sorted array of products
 */
export const sortProductsByExpiration = (products: Product[]): Product[] => {
  return products.sort((a, b) => {
    // Products without expiration dates go to the end
    if (!a.expiration_date && !b.expiration_date) return 0;
    if (!a.expiration_date) return 1;
    if (!b.expiration_date) return -1;
    
    return new Date(a.expiration_date).getTime() - new Date(b.expiration_date).getTime();
  });
};