/**
 * PlantillaSelector.jsx
 * 
 * Selector de plantillas predefinidas para crear notas rápidamente.
 * Se muestra como un modal con las plantillas disponibles.
 */
import { X, Sparkles } from 'lucide-react';
import { PLANTILLAS } from '../../utils/plantillas';

/**
 * Selector de plantillas
 * 
 * @param {Object} props
 * @param {boolean} props.abierto - Si el selector está visible
 * @param {Function} props.onSeleccionar - Callback al seleccionar una plantilla
 * @param {Function} props.onCerrar - Callback al cerrar
 */
export default function PlantillaSelector({ abierto, onSeleccionar, onCerrar }) {
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCerrar}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-slate-900/95 border border-slate-800/50 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-950/50 border border-purple-800/30">
              <Sparkles size={18} className="text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                Elegir Plantilla
              </h2>
              <p className="text-xs text-slate-500">
                Comienza con una estructura predefinida
              </p>
            </div>
          </div>
          <button
            onClick={onCerrar}
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Lista de plantillas */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
          {PLANTILLAS.map((plantilla) => (
            <button
              key={plantilla.id}
              onClick={() => onSeleccionar(plantilla)}
              className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-800/50 hover:border-cyan-500/30 hover:bg-slate-800/50 text-left transition group"
            >
              <span className="text-2xl shrink-0">{plantilla.icono}</span>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-200 group-hover:text-cyan-400 transition">
                  {plantilla.nombre}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {plantilla.descripcion}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {plantilla.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/60 text-slate-500"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={() => onSeleccionar(null)}
            className="w-full py-3 rounded-xl bg-slate-800/30 border border-slate-800/50 hover:border-slate-700/50 text-slate-400 hover:text-slate-200 text-sm font-medium transition"
          >
            Empezar desde cero (nota en blanco)
          </button>
        </div>
      </div>
    </div>
  );
}
