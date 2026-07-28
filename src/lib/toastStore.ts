import { useState, useEffect } from 'react';

let listeners = [];

export function showToast(message, type = 'error') {
  listeners.forEach((listener) => listener({ id: Date.now(), message, type }));
}

export function useToast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleToast = (newToast) => {
      setToast(newToast);
    };

    listeners.push(handleToast);
    return () => {
      listeners = listeners.filter((l) => l !== handleToast);
    };
  }, []);

  const clearToast = () => setToast(null);

  return { toast, clearToast };
}
