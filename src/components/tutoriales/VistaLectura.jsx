/**
 * VistaLectura.jsx
 * 
 * Vista de lectura inmersiva tipo Medium/Notion.
 * Incluye: TOC, Pomodoro, Backlinks, Notas relacionadas, Exportar.
 */
import { useState, useMemo } from 'react';
import {
  X,
  Calendar,
  Clock,
  FileText,
  ArrowLeft,
  Pencil,
  Download,
  Tag,
  Timer,
  Link2,
  Archive,
  ArchiveRestore,
} from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import TableOfContents from './TableOfContents';
import PomodoroTimer from './PomodoroTimer';
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
 * Extrae backlinks del contenido
 */
const extraerBacklinks = (contenido) => {
  if (!contenido) return [];
  const regex = /\[\[([^\]]+)\]\]/g;
  const matches = [];
  let match;
  while ((match = regex.exec(contenido)) !== null) {
    matches.push(match[1]);
  }
  return [...new Set(matches)];
};

/**
 * Vista de lectura inmersiva
 */
export default function VistaLectura({ 
  nota, 
  todasLasNotas = [],
  onCerrar, 
  onEditar, 
  onExportar,
  onVerNota,
  onToggleArchivado,
}) {
  const [mostrarPomodoro, setMostrarPomodoro] = useState(false);

  if (!nota) return null;

  const categoria = CATEGORIAS[nota.categoria] || CATEGORIAS.general;
  const CategoriaIcon = categoria.icon;
  const tags = nota.tags || [];
  const tiempoLectura = calcularTiempoLectura(nota.contenido);
  const totalPalabras = nota.contenido ? nota.contenido.split(/\s+/).filter(Boolean).length : 0;
  const backlinksEnContenido = extraerBacklinks(nota.contenido);

  // Resolver backlinks a notas reales
  const backlinksResueltos = useMemo(() => {
    return backlinksEnContenido.map(nombre => {
      const notaEncontrada = todasLasNotas.find(n => 
        n.titulo.toLowerCase().trim() === nombre.toLowerCase().trim()
      );
      return notaEncontrada || { titulo: nombre, missing: true };
    });
  }, [backlinksEnContenido, todasLasNotas]);

  // Notas que enlazan a esta nota (backlinks inversos)
  const backlinksInversos = useMemo(() => {
    return todasLasNotas.filter(n => 
      n.id !== nota.id && n.contenido?.includes(`[[${nota.titulo}]]`)
    );
  }, [nota, todasLasNotas]);

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
            {/* Pomodoro */}
            <button
              onClick={() => setMostrarPomodoro(!mostrarPomodoro)}
              className={`p-2 rounded-lg transition ${
                mostrarPomodoro
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Modo Pomodoro"
            >
              <Timer size={15} />
            </button>
            {/* Archivar/Desarchivar */}
            <button
              onClick={() => onToggleArchivado?.(nota.id)}
              className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition"
              title={nota.archivado ? 'Desarchivar' : 'Archivar'}
            >
              {nota.archivado ? <ArchiveRestore size={15} /> : <Archive size={15} />}
            </button>
            {/* Exportar */}
            <button
              onClick={onExportar}
              className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition"
              title="Exportar como Markdown"
            >
              <Download size={15} />
            </button>
            {/* Editar */}
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

              {/* Contenido Markdown con backlinks */}
              <div id="markdown-content" className="text-lg leading-relaxed">
                <MarkdownRenderer 
                  contenido={nota.contenido} 
                  notas={todasLasNotas}
                  onVerNota={onVerNota}
                />
              </div>

              {/* Backlinks inversos (notas que enlazan a esta) */}
              {backlinksInversos.length > 0 && (
                <div className="mt-12 pt-8 border-t border-slate-800/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Link2 size={16} className="text-purple-400" />
                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                      Enlazado desde ({backlinksInversos.length})
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {backlinksInversos.map(n => (
                      <button
                        key={n.id}
                        onClick={() => onVerNota(n)}
                        className="flex items-center gap-2 w-full text-left p-3 rounded-xl bg-slate-900/50 border border-slate-800/30 hover:border-purple-800/30 hover:bg-slate-900/70 transition group"
                      >
                        <Link2 size={12} className="text-purple-400 shrink-0" />
                        <span className="text-sm text-slate-300 group-hover:text-purple-400 transition">
                          {n.titulo}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar con TOC */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-4">
                <TableOfContents
                  contenido={nota.contenido}
                  containerId="markdown-content"
                />
                
                {/* Outgoing links (enlaces que esta nota hace) */}
                {backlinksResueltos.length > 0 && (
                  <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Link2 size={14} className="text-cyan-400" />
                      <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Enlaces ({backlinksResueltos.length})
                      </span>
                    </div>
                    <div className="space-y-1">
                      {backlinksResueltos.map((bl, i) => (
                        bl.missing ? (
                          <div key={i} className="flex items-center gap-2 px-2 py-1.5 text-xs text-red-400/60">
                            <span>⚠</span>
                            <span className="truncate">{bl.titulo}</span>
                          </div>
                        ) : (
                          <button
                            key={i}
                            onClick={() => onVerNota(bl)}
                            className="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg text-xs text-slate-400 hover:text-cyan-400 hover:bg-slate-800/30 transition"
                          >
                            <span className="truncate">{bl.titulo}</span>
                          </button>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Timer Pomodoro */}
      <PomodoroTimer
        abierto={mostrarPomodoro}
        onCerrar={() => setMostrarPomodoro(false)}
      />
    </div>
  );
}
