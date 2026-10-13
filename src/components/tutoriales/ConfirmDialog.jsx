/**
 * ConfirmDialog.jsx
 * 
 * Diálogo de confirmación elegante con estilo Glassmorphism.
 * Reemplaza el confirm() nativo del browser.
 */
import { AlertTriangle, X } from 'lucide-react';

/**
 * Diálogo de confirmación
 * 
 * @param {Object} props
 * @param {boolean} props.abierto - Si el diálogo está visible
 * @param {string} props.titulo - Título del diálogo
 * @param {string} props.mensaje - Mensaje descriptivo
 * @param {string} props.textoConfirmar - Texto del botón confirmar
 * @param {string} props.textoCancelar - Texto del botón cancelar
 * @param {string} props.variant - 'danger' | 'warning' | 'info'
 * @param {Function} props.onConfirmar - Callback al confirmar
 * @param {Function} props.onCancelar - Callback al cancelar
 */
export default function ConfirmDialog({
  abierto,
  titulo = '¿Estás seguro?',
  mensaje = 'Esta acción no se puede deshacer.',
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  variant = 'danger',
  onConfirmar,
  onCancelar,
}) {
  if (!abierto) return null;

  const variantStyles = {
    danger: {
      icon: 'text-red-400',
      iconBg: 'bg-red-950/50 border-red-800/30',
      button: 'bg-red-600 hover:bg-red-500',
    },
    warning: {
      icon: 'text-yellow-400',
      iconBg: 'bg-yellow-950/50 border-yellow-800/30',
      button: 'bg-yellow-600 hover:bg-yellow-500',
    },
    info: {
      icon: 'text-cyan-400',
      iconBg: 'bg-cyan-950/50 border-cyan-800/30',
      button: 'bg-cyan-600 hover:bg-cyan-500',
    },
  };

  const styles = variantStyles[variant] || variantStyles.danger;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancelar}
      />

      {/* Diálogo */}
      <div className="relative w-full max-w-md bg-slate-900/95 border border-slate-800/50 rounded-2xl shadow-2xl backdrop-blur-xl p-6 animate-[scaleIn_0.2s_ease-out]">
        {/* Icono */}
        <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${styles.iconBg}`}>
          <AlertTriangle size={22} className={styles.icon} />
        </div>

        {/* Contenido */}
        <h3 className="text-lg font-semibold text-slate-100 mb-2">{titulo}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{mensaje}</p>

        {/* Botones */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onCancelar}
            className="px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white text-sm font-medium transition"
          >
            {textoCancelar}
          </button>
          <button
            onClick={onConfirmar}
            className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition shadow-lg ${styles.button}`}
          >
            {textoConfirmar}
          </button>
        </div>

        {/* Botón cerrar */}
        <button
          onClick={onCancelar}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-500 hover:text-white transition"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
