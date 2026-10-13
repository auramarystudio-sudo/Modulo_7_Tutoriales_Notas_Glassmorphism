/**
 * VersionHistory.jsx
 * 
 * Panel de historial de versiones de una nota.
 * Permite ver versiones anteriores y revertir cambios.
 */
import { useState } from 'react';
import {
  History,
  X,
  RotateCcw,
  Clock,
  Eye,
} from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

/**
 * Panel de historial de versiones
 * 
 * @param {Object} props
 * @param {boolean} props.abierto - Si el panel está visible
 * @param {Object} props.nota - Nota actual
 * @param {Array} props.versiones - Lista de versiones anteriores
 * @param {Function} props.onRevertir - Callback al revertir a una versión
 * @param {Function} props.onCerrar - Callback al cerrar
 */
export default function VersionHistory({ abierto, nota, versiones = [], onRevertir, onCerrar }) {
  const [versionSeleccionada, setVersionSeleccionada] = useState(null);

  if (!abierto || !nota) return null;

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCerrar}
      />

      {/* Panel */}
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-slate-900/95 border border-slate-800/50 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-950/50 border border-orange-800/30">
              <History size={18} className="text-orange-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Historial de Versiones</h2>
              <p className="text-xs text-slate-500">{nota.titulo}</p>
            </div>
          </div>
          <button
            onClick={onCerrar}
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-0">
          {/* Lista de versiones */}
          <div className="border-r border-slate-800/50 overflow-y-auto p-4 space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Versiones ({versiones.length})
            </h3>
            
            {versiones.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">
                No hay versiones anteriores
              </p>
            ) : (
              versiones.map((version, index) => (
                <button
                  key={version.id}
                  onClick={() => setVersionSeleccionada(version)}
                  className={`w-full text-left p-3 rounded-xl border transition ${
                    versionSeleccionada?.id === version.id
                      ? 'bg-orange-950/30 border-orange-800/50'
                      : 'bg-slate-800/20 border-slate-800/30 hover:border-slate-700/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Clock size={12} className="text-slate-500" />
                    <span className="text-xs text-slate-400">
                      {formatearFecha(version.fecha)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 line-clamp-2">
                    {version.contenido.substring(0, 80)}...
                  </p>
                  {index === 0 && (
                    <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded bg-green-950/50 text-green-400 border border-green-800/30">
                      Actual
                    </span>
                  )}
                </button>
              ))
            )}
          </div>

          {/* Vista previa de versión */}
          <div className="overflow-y-auto p-6">
            {versionSeleccionada ? (
              <>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800/50">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200 mb-1">
                      Versión del {formatearFecha(versionSeleccionada.fecha)}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {versionSeleccionada.contenido.split(/\s+/).length} palabras
                    </p>
                  </div>
                  <button
                    onClick={() => onRevertir(versionSeleccionada)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium transition"
                  >
                    <RotateCcw size={14} />
                    Revertir a esta versión
                  </button>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  <MarkdownRenderer contenido={versionSeleccionada.contenido} />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Eye size={40} className="text-slate-600 mb-4" />
                <p className="text-slate-400 text-sm">
                  Selecciona una versión para ver su contenido
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
