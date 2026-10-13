/**
 * NotaCard.jsx
 * 
 * Tarjeta de vista previa de una nota/tutorial.
 * Muestra título, categoría, tags, extracto del contenido y acciones.
 */
import {
  Star,
  Eye,
  Pencil,
  Trash2,
  Brain,
} from 'lucide-react';
import { CATEGORIAS } from './CategoryFilter';

/**
 * Extrae texto plano del contenido Markdown (sin formato)
 */
const extraerTextoPlano = (markdown, maxLength = 100) => {
  if (!markdown) return '';
  // Eliminar sintaxis Markdown básica
  let texto = markdown
    .replace(/#{1,6}\s/g, '')           // Headers
    .replace(/\*\*(.*?)\*\*/g, '$1')     // Bold
    .replace(/\*(.*?)\*/g, '$1')         // Italic
    .replace(/`{1,3}[^`]*`{1,3}/g, '')   // Code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
    .replace(/>\s/g, '')                 // Blockquotes
    .replace(/[-*+]\s/g, '')            // List items
    .replace(/\n/g, ' ')                // Saltos de línea
    .replace(/\s+/g, ' ')              // Espacios múltiples
    .trim();
  
  if (texto.length > maxLength) {
    texto = texto.substring(0, maxLength) + '...';
  }
  return texto;
};

/**
 * Componente de tarjeta de nota
 * 
 * @param {Object} props
 * @param {Object} props.nota - Datos de la nota
 * @param {Function} props.onVer - Callback al hacer clic en "Ver"
 * @param {Function} props.onEditar - Callback al hacer clic en "Editar"
 * @param {Function} props.onEliminar - Callback al hacer clic en "Eliminar"
 * @param {Function} props.onToggleFavorito - Callback al toggle favorito
 */
export default function NotaCard({ nota, onVer, onEditar, onEliminar, onToggleFavorito }) {
  const categoria = CATEGORIAS[nota.categoria] || CATEGORIAS.general;
  const CategoriaIcon = categoria.icon;
  const tags = nota.tags || [];
  const tagsVisibles = tags.slice(0, 3);
  const tagsRestantes = tags.length - 3;
  const extracto = extraerTextoPlano(nota.contenido);

  return (
    <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-5 backdrop-blur-sm shadow-xl hover:border-slate-700/50 transition-all duration-300 group flex flex-col">
      {/* Header de la tarjeta */}
      <div className="flex items-start justify-between gap-2 mb-3">
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

      {/* Badge de categoría */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs px-2 py-1 rounded-md border flex items-center gap-1 ${categoria.color}`}>
          <CategoriaIcon size={11} />
          {categoria.label}
        </span>
      </div>

      {/* Extracto del contenido */}
      <p className="text-sm text-slate-400 leading-relaxed mb-3 flex-1 line-clamp-3">
        {extracto || 'Sin contenido'}
      </p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
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

      {/* Placeholder para Módulo 8: AI Learning Mentor */}
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
          onClick={() => onEditar(nota)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-medium transition"
        >
          <Pencil size={13} />
          Editar
        </button>
        <button
          onClick={() => onEliminar(nota.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-950/60 text-red-400/70 hover:text-red-300 text-xs font-medium transition ml-auto"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
