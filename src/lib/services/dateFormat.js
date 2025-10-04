// lib/services/dateFormat.js
import { format, formatDistanceToNow, parseISO, isValid } from "date-fns";

/**
 * Safely parses a date string/Date object and returns a Date.
 */
const parseDate = (date) => {
    if (!date) return null;
    const parsed = typeof date === "string" ? parseISO(date) : date;
    return isValid(parsed) ? parsed : null;
};

/**
 * Format: 14 Aug 2025
 */
export const formatDate_DD_MMM_YYYY = (date) => {
    const d = parseDate(date);
    return d ? format(d, "dd MMM yyyy") : "";
};

/**
 * Format: 14/08/2025
 */
export const formatDate_DD_MM_YYYY = (date) => {
    const d = parseDate(date);
    return d ? format(d, "dd/MM/yyyy") : "";
};

/**
 * Format: August 14, 2025
 */
export const formatDate_FullMonth_DD_YYYY = (date) => {
    const d = parseDate(date);
    return d ? format(d, "MMMM dd, yyyy") : "";
};

/**
 * Format: 14 Aug 2025, 10:35 AM
 */
export const formatDateWithTime = (date) => {
    const d = parseDate(date);
    return d ? format(d, "dd MMM yyyy, hh:mm a") : "";
};

/**
 * Format: Time Ago (e.g., "3 days ago")
 */
export const formatRelativeTime = (date) => {
    const d = parseDate(date);
    return d ? formatDistanceToNow(d, { addSuffix: true }) : "";
};

/**
 * Format: ISO Date String (for API use)
 */
export const formatISODate = (date) => {
    const d = parseDate(date);
    return d ? format(d, "yyyy-MM-dd") : "";
};
