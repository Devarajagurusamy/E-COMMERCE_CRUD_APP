"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, Info, X, Trash2 } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "default";
  onConfirm: () => void | Promise<void>;
}

interface ToastContextType {
  toast: {
    success: (msg: string) => void;
    error: (msg: string) => void;
    info: (msg: string) => void;
  };
  confirm: (options: ConfirmOptions) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmModal, setConfirmModal] = useState<ConfirmOptions | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useMemo(
    () => ({
      success: (msg: string) => addToast("success", msg),
      error: (msg: string) => addToast("error", msg),
      info: (msg: string) => addToast("info", msg),
    }),
    [addToast]
  );

  const confirm = useCallback((options: ConfirmOptions) => {
    setConfirmModal(options);
  }, []);

  const handleConfirmAction = async () => {
    if (!confirmModal) return;
    setConfirmLoading(true);
    try {
      await confirmModal.onConfirm();
      setConfirmModal(null);
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <ToastContext.Provider value={{ toast, confirm }}>
      {children}

      {/* Floating Toast Stack */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-md w-full px-4 sm:px-0 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5 duration-200 ${
              t.type === "success"
                ? "bg-emerald-950/90 text-emerald-100 border-emerald-800/80 dark:bg-emerald-950/95 dark:text-emerald-50"
                : t.type === "error"
                ? "bg-red-950/90 text-red-100 border-red-800/80 dark:bg-red-950/95 dark:text-red-50"
                : "bg-zinc-900/90 text-zinc-100 border-zinc-700/80 dark:bg-zinc-900/95 dark:text-zinc-50"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {t.type === "success" && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              )}
              {t.type === "error" && (
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              )}
              {t.type === "info" && (
                <Info className="w-5 h-5 text-blue-400 shrink-0" />
              )}
              <span className="text-sm font-medium leading-snug break-words">
                {t.message}
              </span>
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0 text-white/70 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Confirmation Modal Popup */}
      {confirmModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-card text-card-foreground border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3.5">
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  confirmModal.variant === "destructive"
                    ? "bg-red-500/10 text-red-500"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {confirmModal.variant === "destructive" ? (
                  <Trash2 className="w-5 h-5" />
                ) : (
                  <Info className="w-5 h-5" />
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold tracking-tight text-foreground">
                  {confirmModal.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {confirmModal.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={confirmLoading}
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted rounded-xl transition-colors disabled:opacity-50"
              >
                {confirmModal.cancelText || "Cancel"}
              </button>
              <button
                type="button"
                disabled={confirmLoading}
                onClick={handleConfirmAction}
                className={`px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-sm transition-all disabled:opacity-50 ${
                  confirmModal.variant === "destructive"
                    ? "bg-red-600 hover:bg-red-700 active:scale-[0.98]"
                    : "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]"
                }`}
              >
                {confirmLoading
                  ? "Processing..."
                  : confirmModal.confirmText || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
