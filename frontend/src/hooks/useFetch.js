import { useEffect, useState, useRef } from "react";
import api from "../services/api";

export default function useFetch(url, opts = {}) {
  const { params, immediate = true } = opts;
  const [data, setData] = useState(opts.initial || null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const cancelRef = useRef(false);

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

  useEffect(() => {
    cancelRef.current = false;
    if (immediate) execute();
    return () => (cancelRef.current = true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, JSON.stringify(params)]);

  return { data, loading, error, execute, setData };
}
