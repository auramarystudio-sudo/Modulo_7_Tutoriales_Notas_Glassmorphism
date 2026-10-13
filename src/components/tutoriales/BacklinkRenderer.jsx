/**
 * BacklinkRenderer.jsx
 * 
 * Componente que detecta y renderiza enlaces internos [[nota]]
 * en el contenido Markdown. Los convierte en links clickeables.
 */
import { useMemo } from 'react';
import { Link2 } from 'lucide-react';

/**
 * Procesa el contenido Markdown y convierte [[enlaces]] en HTML clickable
 * 
 * @param {string} contenido - Contenido Markdown con posibles [[enlaces]]
 * @param {Array} notas - Lista de notas para resolver los enlaces
 * @param {Function} onVerNota - Callback al hacer clic en un enlace
 * @returns {string} Contenido procesado con los enlaces convertidos
 */
export const procesarBacklinks = (contenido, notas, onVerNota) => {
  if (!contenido) return contenido;
  
  // Regex para encontrar [[nombre de nota]]
  const regex = /\[\[([^\]]+)\]\]/g;
  
  return contenido.replace(regex, (match, nombreNota) => {
    const notaEncontrada = notas.find(n => 
      n.titulo.toLowerCase() === nombreNota.toLowerCase()
    );
    
    if (notaEncontrada) {
      // Retornar un placeholder que será reemplazado por el componente
      return `__BACKLINK_${notaEncontrada.id}__`;
    }
    
    // Si no se encuentra, mostrar como texto con estilo de "nota inexistente"
    return `__BACKLINK_MISSING_${nombreNota}__`;
  });
};

/**
 * Componente que renderiza un backlink individual
 */
export function Backlink({ notaId, notas, onVerNota, missing = false, missingName = '' }) {
  if (missing) {
    return (
      <span className="inline-flex items-center gap-1 text-red-400/70 bg-red-950/20 px-1.5 py-0.5 rounded border border-red-800/20 text-sm font-mono cursor-not-allowed" title="Nota no encontrada">
        <Link2 size={11} />
        {missingName}
      </span>
    );
  }

  const nota = notas.find(n => n.id === notaId);
  if (!nota) return null;

  return (
    <button
      onClick={() => onVerNota(nota)}
      className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 bg-cyan-950/30 hover:bg-cyan-950/50 px-1.5 py-0.5 rounded border border-cyan-800/30 text-sm font-medium transition"
      title={`Ir a: ${nota.titulo}`}
    >
      <Link2 size={11} />
      {nota.titulo}
    </button>
  );
}
