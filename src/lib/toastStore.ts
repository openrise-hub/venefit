import { useState, useEffect } from 'react';

export type ToastType = 'info' | 'success' | 'error';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

type ToastListener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
let listeners: ToastListener[] = [];

function notify() {
  listeners.forEach((listener) => listener([...toasts]));
}

export function showToast(message: string, type: ToastType = 'info') {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast: Toast = { id, message, type };

  toasts = [...toasts, newToast];
  notify();

  setTimeout(() => {
    removeToast(id);
  }, 4000);
}

export function removeToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  notify();
}

export function subscribeToasts(listener: ToastListener) {
  listeners.push(listener);
  listener([...toasts]);

  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function useToast() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>(toasts);

  useEffect(() => {
    return subscribeToasts((newToasts) => {
      setCurrentToasts(newToasts);
    });
  }, []);

  const activeToast = currentToasts.length > 0 ? currentToasts[currentToasts.length - 1] : null;

  return {
    toast: activeToast,
    toasts: currentToasts,
    clearToast: () => {
      if (activeToast) removeToast(activeToast.id);
    }
  };
}
