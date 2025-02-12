import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * pagination.util.ts
 * This file contains utility functions for handling pagination.
 * Created: 21/09/2024
 */

/**
 * Handle page change
 * @param setPage - set page function
 * @param page - page number
 */

export const handlePageChange = (
  setPage: (page: number) => void,
  page: number
) => {
  setPage(page);
};

/**
 * Handle items per page change
 * @param setItemsPerPage - set items per page function
 * @param setPage - set page function
 * @param items - number of items
 */

export const handleItemsPerPageChange = (
  setItemsPerPage: (items: number) => void,
  setPage: (page: number) => void,
  items: number
) => {
  setItemsPerPage(items);
  setPage(1);
};


export function getDateFromMinutes(minutes: number) {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Set time to midnight
  now.setMinutes(minutes);
  return now;
}
