import { useEffect, useState, useRef } from "react";
import api from "../services/api";

// Custom hook to fetch data from an API using Axios
export default function useFetch(url, opts = {}) {
  const { params, immediate = true } = opts;

  // State for storing response data, loading status, and any error
  const [data, setData] = useState(opts.initial || null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  // Ref to track if the component is unmounted or fetch is cancelled
  const cancelRef = useRef(false);

  // Function to execute the API request
  const execute = async (extra = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(url, { params: { ...params, ...extra } });
      if (cancelRef.current) return;
      setData(res.data);
      return res.data;
    } catch (err) {
      if (cancelRef.current) return;
      setError(err);
      console.error("useFetch error", err);
      throw err;
    } finally {
      if (!cancelRef.current) setLoading(false);
    }
  };

  // Automatically fetch on mount or when URL/params change (if immediate is true)
  useEffect(() => {
    cancelRef.current = false;
    if (immediate) execute();
    return () => (cancelRef.current = true); // Cancel fetch on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, JSON.stringify(params)]);

  // Expose state and execute function to the component
  return { data, loading, error, execute, setData };
}
