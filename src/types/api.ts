// Common API response types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  page: number;
  totalPages: number;
  totalItems: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}