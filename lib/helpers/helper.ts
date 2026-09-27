import { format, parseISO } from 'date-fns';

/**
 * Safely formats a date string, Date object, or timestamp into an international format.
 * @param dateValue - The date to format (string, Date, number, null, or undefined)
 * @param formatStr - The date-fns format token (defaults to 'yyyy-MM-dd')
 * @returns The formatted date string, or an empty string if the input is invalid
 */
export const safeFormatDate = (
    dateValue: string | Date | number | null | undefined,
    formatStr: string = 'yyyy-MM-dd'
): string => {
    if (!dateValue) return '';

    try {
        // 1. If it's already a native Date object
        if (dateValue instanceof Date) {
            return isNaN(dateValue.getTime()) ? '' : format(dateValue, formatStr);
        }

        // 2. If it's a string (ISO or standard date string)
        if (typeof dateValue === 'string') {
            const parsed = parseISO(dateValue);
            if (!isNaN(parsed.getTime())) {
                return format(parsed, formatStr);
            }

            // Fallback for non-ISO string formats
            const nativeDate = new Date(dateValue);
            return isNaN(nativeDate.getTime()) ? '' : format(nativeDate, formatStr);
        }

        // 3. If it's a Unix timestamp (number)
        const fallbackDate = new Date(dateValue);
        return isNaN(fallbackDate.getTime()) ? '' : format(fallbackDate, formatStr);
    } catch (error) {
        console.error("Date formatting error:", error);
        return '';
    }
};
