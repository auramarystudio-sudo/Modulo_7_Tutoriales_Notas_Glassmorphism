/**
 * Toast.jsx
 * 
 * Sistema de notificaciones toast elegante con estilo Glassmorphism.
 * Reemplaza los confirm() y alert() del browser por notificaciones visuales.
 */
import { useState, useCallback, createContext, useContext } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// Contexto para el sistema de toasts
const ToastContext = createContext(null);

/**
 * Hook para usar el sistema de toasts
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback si no hay provider
    return { showToast: () => {}, toasts: [] };
  }
  return context;
};

/**
 * Tipos de toast con sus configuraciones
 */
const TOAST_TYPES = {
  success: {
    icon: CheckCircle,
    color: 'text-green-400',
    bg: 'bg-green-950/40',
    border: 'border-green-800/30',
  },
  error: {
    icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-950/40',
    border: 'border-red-800/30',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-400',
    bg: 'bg-yellow-950/40',
    border: 'border-yellow-800/30',
  },
  info: {
    icon: Info,
    color: 'text-cyan-400',
    bg: 'bg-cyan-950/40',
    border: 'border-cyan-800/30',
  },
};

/**
 * Provider del sistema de toasts
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, toasts }}>
      {children}
      {/* Contenedor de toasts */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => {
          const config = TOAST_TYPES[toast.type] || TOAST_TYPES.info;
          const Icon = config.icon;
          
          return (
            <div
              key={toast.id}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl
                ${config.bg} ${config.border} shadow-2xl
                animate-[slideIn_0.3s_ease-out]
              `}
            >
              <Icon size={18} className={config.color} />
              <p className="text-sm text-slate-200 flex-1">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-lg hover:bg-slate-800/50 text-slate-500 hover:text-slate-300 transition"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
