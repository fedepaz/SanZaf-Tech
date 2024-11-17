import { useState, useCallback } from "react";
import axios from "axios";

interface ErrorResponse {
  error: {
    message: string;
    status: number;
  } | null;
  isServerDown: boolean;
}

const useErrorHandler = () => {
  const [error, setError] = useState<ErrorResponse>({
    error: null,
    isServerDown: false,
  });

  const handleError = useCallback((err: any) => {
    if (axios.isAxiosError(err) && err.response) {
      const errorData = err.response.data as ErrorResponse;
      setError(errorData);
      if (err.response.status === 401 || err.response.status === 403) {
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
    } else {
      setError({
        error: {
          message: "An unexpected error occurred",
          status: 500,
        },
        isServerDown: true,
      });
    }
  }, []);

  const clearError = useCallback(() => {
    setError({ error: null, isServerDown: false });
  }, []);

  return { error, handleError, clearError };
};

export default useErrorHandler;
