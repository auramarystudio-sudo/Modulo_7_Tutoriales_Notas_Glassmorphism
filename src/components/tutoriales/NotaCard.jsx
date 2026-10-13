/**
 * NotaCard.jsx
 * 
 * Tarjeta de vista previa de una nota/tutorial.
 * Soporta modo grid y modo lista.
 * Incluye: Pin, Duplicar, Favorito, Placeholder Módulo 8.
 */
import {
  Star,
  Eye,
  Pencil,
  Trash2,
  Brain,
  Clock,
  Pin,
  PinOff,
  Copy,
} from 'lucide-react';
import { CATEGORIAS } from './CategoryFilter';

/**
 * Extrae texto plano del contenido Markdown
 */
const extraerTextoPlano = (markdown, maxLength = 100) => {
  if (!markdown) return '';
  let texto = markdown
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/>\s/g, '')
    .replace(/[-*+]\s/g, '')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  if (texto.length > maxLength) {
    texto = texto.substring(0, maxLength) + '...';
  }
  return texto;
};

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
 * Componente de tarjeta de nota
 */
export default function NotaCard({ 
  nota, 
  compacto = false, 
  onVer, 
  onEditar, 
  onEliminar, 
  onToggleFavorito,
  onTogglePin,
  onDuplicar,
}) {
  const categoria = CATEGORIAS[nota.categoria] || CATEGORIAS.general;
  const CategoriaIcon = categoria.icon;
  const tags = nota.tags || [];
  const tagsVisibles = tags.slice(0, 3);
  const tagsRestantes = tags.length - 3;
  const extracto = extraerTextoPlano(nota.contenido);
  const tiempoLectura = calcularTiempoLectura(nota.contenido);

  // Modo lista compacta
  if (compacto) {
    return (
      <div className={`bg-slate-900/50 border rounded-xl p-4 backdrop-blur-sm hover:border-slate-700/50 transition-all duration-300 group flex items-center gap-4 ${
        nota.pinned ? 'border-cyan-800/30 bg-cyan-950/10' : 'border-slate-800/50'
      }`}>
        {/* Indicador de pin */}
        {nota.pinned && (
          <div className="absolute -top-1 -left-1">
            <Pin size={10} className="text-cyan-400 fill-cyan-400" />
          </div>
        )}
        
        {/* Icono de categoría */}
        <div className={`p-2.5 rounded-xl border shrink-0 ${categoria.color}`}>
          <CategoriaIcon size={16} />
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {nota.pinned && <Pin size={11} className="text-cyan-400 shrink-0" />}
            <h3 className="text-sm font-semibold text-slate-100 truncate">
              {nota.titulo}
            </h3>
            {nota.es_favorito && (
              <Star size={12} className="text-yellow-400 fill-yellow-400 shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock size={10} />
              {tiempoLectura}
            </span>
            {tags.length > 0 && (
              <div className="flex items-center gap-1">
                {tags.slice(0, 2).map((tag, i) => (
                  <span key={i} className="text-[10px] text-slate-600">#{tag}</span>
                ))}
                {tagsRestantes > 0 && (
                  <span className="text-[10px] text-slate-600">+{tagsRestantes}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={() => onTogglePin(nota.id)}
            className={`p-2 rounded-lg hover:bg-slate-800 transition ${nota.pinned ? 'text-cyan-400' : 'text-slate-500 hover:text-cyan-400'}`}
            title={nota.pinned ? 'Desfijar' : 'Fijar'}
          >
            {nota.pinned ? <PinOff size={14} /> : <Pin size={14} />}
          </button>
          <button
            onClick={() => onDuplicar(nota.id)}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition"
            title="Duplicar"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={() => onVer(nota)}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-cyan-400 transition"
            title="Ver"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={() => onEditar(nota)}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition"
            title="Editar"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onEliminar(nota.id)}
            className="p-2 rounded-lg hover:bg-red-950/50 text-slate-500 hover:text-red-400 transition"
            title="Eliminar"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    );
  }

  // Modo grid (tarjeta completa)
  return (
    <div className={`bg-slate-900/50 border rounded-2xl p-5 backdrop-blur-sm shadow-xl hover:border-slate-700/50 transition-all duration-300 group flex flex-col relative ${
      nota.pinned ? 'border-cyan-800/30 bg-gradient-to-br from-cyan-950/10 to-slate-900/50' : 'border-slate-800/50'
    }`}>
      {/* Indicador de pin */}
      {nota.pinned && (
        <div className="absolute top-3 right-3">
          <Pin size={12} className="text-cyan-400 fill-cyan-400" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3 pr-4">
        <h3 className="text-base font-semibold text-slate-100 line-clamp-2 flex-1">
          {nota.titulo}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorito(nota.id);
          }}
          className={`p-1 rounded-lg transition ${
            nota.es_favorito
              ? 'text-yellow-400 hover:text-yellow-300'
              : 'text-slate-600 hover:text-slate-400'
          }`}
          title={nota.es_favorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          <Star size={16} fill={nota.es_favorito ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Categoría + tiempo */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs px-2 py-1 rounded-md border flex items-center gap-1 ${categoria.color}`}>
          <CategoriaIcon size={11} />
          {categoria.label}
        </span>
        <span className="text-[10px] text-slate-600 flex items-center gap-1">
          <Clock size={9} />
          {tiempoLectura}
        </span>
      </div>

      {/* Extracto */}
      <p className="text-sm text-slate-400 leading-relaxed mb-3 flex-1 line-clamp-3">
        {extracto || 'Sin contenido'}
      </p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tagsVisibles.map((tag, index) => (
            <span
              key={index}
              className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/60 text-slate-400 border border-slate-700/30"
            >
              #{tag}
            </span>
          ))}
          {tagsRestantes > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/40 text-slate-500">
              +{tagsRestantes}
            </span>
          )}
        </div>
      )}

      {/* Placeholder Módulo 8 */}
      <button className="text-xs text-cyan-400/70 hover:text-cyan-300 flex items-center gap-1 mb-3 transition w-fit">
        <Brain size={12} />
        <span>Preguntar al Mentor IA</span>
      </button>

      {/* Acciones */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-800/30">
        <button
          onClick={() => onVer(nota)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-medium transition"
        >
          <Eye size={13} />
          Ver
        </button>
        <button
          onClick={() => onTogglePin(nota.id)}
          className={`p-1.5 rounded-lg transition ${
            nota.pinned 
              ? 'bg-cyan-950/40 text-cyan-400 hover:bg-cyan-950/60' 
              : 'bg-slate-800/50 text-slate-500 hover:text-cyan-400 hover:bg-slate-800'
          }`}
          title={nota.pinned ? 'Desfijar' : 'Fijar arriba'}
        >
          {nota.pinned ? <PinOff size={13} /> : <Pin size={13} />}
        </button>
        <button
          onClick={() => onDuplicar(nota.id)}
          className="p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-500 hover:text-white transition"
          title="Duplicar nota"
        >
          <Copy size={13} />
        </button>
        <button
          onClick={() => onEditar(nota)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-medium transition"
        >
          <Pencil size={13} />
          Editar
        </button>
        <button
          onClick={() => onEliminar(nota.id)}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-950/60 text-red-400/70 hover:text-red-300 text-xs font-medium transition ml-auto"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
