import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const ToastContext = createContext({
  toasts: [],
  push: () => {},
  remove: () => {},
});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (toast) => {
      const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const full = { id, tone: "info", duration: 4000, ...toast };
      setToasts((prev) => [...prev, full]);
      if (full.duration > 0) {
        setTimeout(() => remove(id), full.duration);
      }
      return id;
    },
    [remove],
  );

  const value = useMemo(() => ({ toasts, push, remove }), [toasts, push, remove]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.tone}`} onClick={() => remove(t.id)}>
            {t.title && <strong>{t.title}</strong>}
            {t.message && <span>{t.message}</span>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
