import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';
import type { AxiosError } from 'axios';

type ToastType = 'success' | 'error' | 'info';

type Toast = {
  id: string;
  type: ToastType;
  message: string;
};

type ToastContextValue = {
  toast: (type: ToastType, message: string) => void;
  toastError: (error: unknown, fallbackMessage?: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function getErrorMessage(
  error: unknown,
  fallbackMessage = 'Une erreur est survenue.',
) {
  const maybeAxios = error as AxiosError<any>;
  const msg =
    maybeAxios?.response?.data?.message ??
    maybeAxios?.response?.data?.error ??
    maybeAxios?.message;

  if (Array.isArray(msg)) return msg.join(', ');
  if (typeof msg === 'string' && msg.trim().length > 0) return msg;
  if (error instanceof Error && error.message) return error.message;
  return fallbackMessage;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Record<string, number>>({});

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const t = timers.current[id];
    if (t) window.clearTimeout(t);
    delete timers.current[id];
  }, []);

  const toast = useCallback(
    (type: ToastType, message: string) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      setToasts((prev) => [...prev, { id, type, message }]);
      timers.current[id] = window.setTimeout(() => remove(id), 5000);
    },
    [remove],
  );

  const toastError = useCallback(
    (error: unknown, fallbackMessage?: string) => {
      toast('error', getErrorMessage(error, fallbackMessage));
    },
    [toast],
  );

  const value = useMemo(() => ({ toast, toastError }), [toast, toastError]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        className='fixed right-4 top-4 z-[9999] flex w-[min(420px,calc(100vw-2rem))] flex-col gap-2'
        role='region'
        aria-label='Notifications'
      >
        {toasts.map((t) => {
          const meta =
            t.type === 'success'
              ? {
                  icon: <CheckCircle2 className='h-4 w-4 text-emerald-600' />,
                  ring: 'ring-emerald-200',
                }
              : t.type === 'error'
                ? {
                    icon: <TriangleAlert className='h-4 w-4 text-rose-600' />,
                    ring: 'ring-rose-200',
                  }
                : {
                    icon: <Info className='h-4 w-4 text-sky-600' />,
                    ring: 'ring-sky-200',
                  };

          return (
            <div
              key={t.id}
              className={`flex items-start gap-3 rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 shadow-lg ring-1 ${meta.ring}`}
              role='status'
              aria-live='polite'
            >
              <div className='mt-0.5'>{meta.icon}</div>
              <div className='flex-1'>{t.message}</div>
              <button
                type='button'
                className='rounded-full p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                onClick={() => remove(t.id)}
                aria-label='Fermer'
              >
                <X className='h-4 w-4' />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
