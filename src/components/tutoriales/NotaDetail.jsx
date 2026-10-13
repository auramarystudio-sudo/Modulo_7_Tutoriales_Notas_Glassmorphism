/**
 * NotaDetail.jsx
 * 
 * Modal de vista expandida de una nota con renderizado completo de Markdown.
 * Incluye notas relacionadas y opción de exportar.
 */
import {
  X,
  Pencil,
  Trash2,
  Calendar,
  Tag,
  Download,
  Clock,
  FileText,
} from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import NotasRelacionadas from './NotasRelacionadas';
import { CATEGORIAS } from './CategoryFilter';

/**
 * Calcula el tiempo de lectura estimado
 */
const calcularTiempoLectura = (contenido) => {
  if (!contenido) return '1 min';
  const palabras = contenido.split(/\s+/).length;
  const minutos = Math.ceil(palabras / 200);
  return minutos <= 1 ? '1 min' : `${minutos} min`;
};

/**
 * Modal de detalle de nota
 * 
 * @param {Object} props
 * @param {Object} props.nota - Datos de la nota a mostrar
 * @param {Function} props.onCerrar - Callback al cerrar el modal
 * @param {Function} props.onEditar - Callback al hacer clic en "Editar"
 * @param {Function} props.onEliminar - Callback al hacer clic en "Eliminar"
 * @param {Function} props.onExportar - Callback al exportar
 * @param {Array} props.todasLasNotas - Lista de todas las notas (para relacionadas)
 * @param {Function} props.onSeleccionarRelacionada - Callback al seleccionar nota relacionada
 */
export default function NotaDetail({ nota, onCerrar, onEditar, onEliminar, onExportar, todasLasNotas = [], onSeleccionarRelacionada }) {
  if (!nota) return null;

  const categoria = CATEGORIAS[nota.categoria] || CATEGORIAS.general;
  const CategoriaIcon = categoria.icon;
  const tags = nota.tags || [];
  const tiempoLectura = calcularTiempoLectura(nota.contenido);
  const totalPalabras = nota.contenido ? nota.contenido.split(/\s+/).filter(Boolean).length : 0;

  const fechaFormateada = new Date(nota.fecha_creacion).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCerrar}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900/95 border border-slate-800/50 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col">
        {/* Header del modal */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800/50">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent truncate">
              {nota.titulo}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className={`text-xs px-2 py-1 rounded-md border flex items-center gap-1 ${categoria.color}`}>
                <CategoriaIcon size={11} />
                {categoria.label}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar size={11} />
                {fechaFormateada}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock size={11} />
                {tiempoLectura}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <FileText size={11} />
                {totalPalabras} palabras
              </span>
            </div>
          </div>
          <button
            onClick={onCerrar}
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition ml-4"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="px-6 pt-4 flex items-center gap-2 flex-wrap">
            <Tag size={13} className="text-slate-500" />
            {tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 rounded-md bg-purple-950/50 text-purple-300 border border-purple-800/30"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Contenido Markdown */}
        <div className="flex-1 overflow-y-auto p-6 mt-2">
          <MarkdownRenderer contenido={nota.contenido} />
        </div>

        {/* Notas relacionadas */}
        {todasLasNotas.length > 0 && (
          <div className="px-6 pb-4">
            <NotasRelacionadas
              notaActual={nota}
              todasLasNotas={todasLasNotas}
              onSeleccionar={(n) => {
                if (onSeleccionarRelacionada) {
                  onSeleccionarRelacionada(n);
                }
              }}
            />
          </div>
        )}

        {/* Footer con acciones */}
        <div className="flex items-center justify-between p-6 border-t border-slate-800/50">
          <button
            onClick={onExportar}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white text-sm font-medium transition"
          >
            <Download size={15} />
            Exportar .md
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onEliminar(nota.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-950/40 hover:bg-red-950/70 text-red-400 hover:text-red-300 text-sm font-medium transition"
            >
              <Trash2 size={15} />
              Eliminar
            </button>
            <button
              onClick={() => onEditar(nota)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition shadow-lg"
            >
              <Pencil size={15} />
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
