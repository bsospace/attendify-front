// Common type definitions used across the application
export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface SelectOption {
  label: string;
  value: string | number;
}

export type Theme = 'light' | 'dark' | 'system';