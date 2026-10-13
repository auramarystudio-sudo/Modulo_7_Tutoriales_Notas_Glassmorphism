/**
 * NotasRelacionadas.jsx
 * 
 * Muestra notas relacionadas basándose en tags y categoría similares.
 * Útil para descubrir contenido conectado en la biblioteca.
 */
import { useMemo } from 'react';
import { Link2, ArrowRight } from 'lucide-react';
import { CATEGORIAS } from './CategoryFilter';

/**
 * Calcula la similitud entre dos notas basada en tags y categoría
 */
const calcularSimilitud = (nota1, nota2) => {
  let score = 0;
  
  // Misma categoría = +2 puntos
  if (nota1.categoria === nota2.categoria) score += 2;
  
  // Tags en común = +1 punto por cada tag compartido
  const tags1 = new Set(nota1.tags || []);
  const tags2 = nota2.tags || [];
  tags2.forEach(tag => {
    if (tags1.has(tag)) score += 1;
  });
  
  return score;
};

/**
 * Componente de notas relacionadas
 * 
 * @param {Object} props
 * @param {Object} props.notaActual - Nota actual para encontrar relacionadas
 * @param {Array} props.todasLasNotas - Lista completa de notas
 * @param {Function} props.onSeleccionar - Callback al seleccionar una nota
 */
export default function NotasRelacionadas({ notaActual, todasLasNotas, onSeleccionar }) {
  const relacionadas = useMemo(() => {
    if (!notaActual || !todasLasNotas) return [];
    
    return todasLasNotas
      .filter(n => n.id !== notaActual.id) // Excluir la nota actual
      .map(n => ({
        ...n,
        similitud: calcularSimilitud(notaActual, n),
      }))
      .filter(n => n.similitud > 0) // Solo notas con alguna relación
      .sort((a, b) => b.similitud - a.similitud) // Ordenar por similitud
      .slice(0, 4); // Máximo 4 relacionadas
  }, [notaActual, todasLasNotas]);

  if (relacionadas.length === 0) return null;

  return (
    <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-3">
        <Link2 size={14} className="text-purple-400" />
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Relacionadas
        </span>
      </div>
      <div className="space-y-2">
        {relacionadas.map((nota) => {
          const categoria = CATEGORIAS[nota.categoria] || CATEGORIAS.general;
          return (
            <button
              key={nota.id}
              onClick={() => onSeleccionar(nota)}
              className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/30 transition group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-300 group-hover:text-cyan-400 truncate transition">
                  {nota.titulo}
                </p>
                <p className="text-[10px] text-slate-600 mt-0.5">
                  {nota.similitud} punto{nota.similitud > 1 ? 's' : ''} en común
                </p>
              </div>
              <ArrowRight size={12} className="text-slate-600 group-hover:text-cyan-400 transition shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
