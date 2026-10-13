/**
 * VistaLectura.jsx
 * 
 * Vista de lectura inmersiva tipo Medium/Notion.
 * Centra el contenido, usa tipografía grande y elimina distracciones.
 * Incluye tabla de contenidos lateral.
 */
import {
  X,
  Calendar,
  Clock,
  FileText,
  ArrowLeft,
  Pencil,
  Download,
  Tag,
} from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import TableOfContents from './TableOfContents';
import { CATEGORIAS } from './CategoryFilter';

/**
 * Calcula el tiempo de lectura estimado
 */
const calcularTiempoLectura = (contenido) => {
  if (!contenido) return '1 min';
  const palabras = contenido.split(/\s+/).length;
  const minutos = Math.ceil(palabras / 200); // ~200 palabras por minuto
  return minutos <= 1 ? '1 min' : `${minutos} min`;
};

/**
 * Cuenta las palabras del contenido
 */
const contarPalabras = (contenido) => {
  if (!contenido) return 0;
  return contenido.split(/\s+/).filter(Boolean).length;
};

/**
 * Vista de lectura inmersiva
 * 
 * @param {Object} props
 * @param {Object} props.nota - Datos de la nota
 * @param {Function} props.onCerrar - Callback al cerrar
 * @param {Function} props.onEditar - Callback al editar
 * @param {Function} props.onExportar - Callback al exportar
 */
export default function VistaLectura({ nota, onCerrar, onEditar, onExportar }) {
  if (!nota) return null;

  const categoria = CATEGORIAS[nota.categoria] || CATEGORIAS.general;
  const CategoriaIcon = categoria.icon;
  const tags = nota.tags || [];
  const tiempoLectura = calcularTiempoLectura(nota.contenido);
  const totalPalabras = contarPalabras(nota.contenido);

  const fechaFormateada = new Date(nota.fecha_creacion).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 overflow-hidden flex flex-col">
      {/* Header minimalista */}
      <header className="border-b border-slate-800/30 bg-slate-950/95 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onCerrar}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white text-sm transition"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Volver</span>
            </button>
            <span className={`text-xs px-2 py-1 rounded-md border hidden sm:flex items-center gap-1 ${categoria.color}`}>
              <CategoriaIcon size={10} />
              {categoria.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onExportar}
              className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition"
              title="Exportar como Markdown"
            >
              <Download size={15} />
            </button>
            <button
              onClick={onEditar}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition"
            >
              <Pencil size={13} />
              <span className="hidden sm:inline">Editar</span>
            </button>
            <button
              onClick={onCerrar}
              className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 lg:py-16">
          <div className="lg:grid lg:grid-cols-[1fr_250px] lg:gap-8">
            {/* Columna principal */}
            <article className="max-w-3xl">
              {/* Título */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-100 leading-tight mb-6">
                {nota.titulo}
              </h1>

              {/* Meta información */}
              <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-slate-800/30">
                <span className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Calendar size={14} />
                  {fechaFormateada}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Clock size={14} />
                  {tiempoLectura} de lectura
                </span>
                <span className="flex items-center gap-1.5 text-sm text-slate-500">
                  <FileText size={14} />
                  {totalPalabras.toLocaleString()} palabras
                </span>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-8">
                  <Tag size={13} className="text-slate-500" />
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs px-2.5 py-1 rounded-full bg-purple-950/50 text-purple-300 border border-purple-800/30"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Contenido Markdown */}
              <div id="markdown-content" className="text-lg leading-relaxed">
                <MarkdownRenderer contenido={nota.contenido} />
              </div>
            </article>

            {/* Sidebar con TOC (solo en desktop) */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <TableOfContents
                  contenido={nota.contenido}
                  containerId="markdown-content"
                />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
