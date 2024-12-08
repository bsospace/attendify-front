import { useState, useCallback } from 'react';
import { ApiError } from '@/types/api';
import { Status } from '@/types/common';
import { toast } from '@/hooks/use-toast';

interface UseApiOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: ApiError) => void;
  showErrorToast?: boolean;
}

export function useApi<T>(apiCall: () => Promise<T>, options: UseApiOptions = {}) {
  const [status, setStatus] = useState<Status>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(async () => {
    setStatus('loading');
    try {
      const result = await apiCall();
      setData(result);
      setStatus('success');
      options.onSuccess?.(result);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      setStatus('error');
      options.onError?.(apiError);
      
      if (options.showErrorToast) {
        toast({
          title: 'Error',
          description: apiError.message,
          variant: 'destructive',
        });
      }
    }
  }, [apiCall, options]);

  return { execute, status, data, error, isLoading: status === 'loading' };
}