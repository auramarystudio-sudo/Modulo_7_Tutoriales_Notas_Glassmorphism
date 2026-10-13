/**
 * CategoryFilter.jsx
 * 
 * Componente de filtro por categoría para las notas/tutoriales.
 * Muestra botones con los colores correspondientes a cada categoría.
 */
import {
  Package,
  Zap,
  MessageSquare,
  Terminal,
  Bug,
  FileText,
  LayoutGrid,
} from 'lucide-react';

// Definición de categorías con sus colores e iconos
export const CATEGORIAS = {
  todas: {
    label: 'Todas',
    color: 'bg-slate-800/50 text-slate-300 border-slate-700/50',
    activeColor: 'bg-slate-700/80 text-white border-slate-600/50',
    icon: LayoutGrid,
  },
  instalacion: {
    label: 'Instalación',
    color: 'bg-blue-950/50 text-blue-300 border-blue-800/30',
    activeColor: 'bg-blue-900/60 text-blue-200 border-blue-600/50',
    icon: Package,
  },
  optimizacion: {
    label: 'Optimización',
    color: 'bg-green-950/50 text-green-300 border-green-800/30',
    activeColor: 'bg-green-900/60 text-green-200 border-green-600/50',
    icon: Zap,
  },
  prompts: {
    label: 'Prompts',
    color: 'bg-purple-950/50 text-purple-300 border-purple-800/30',
    activeColor: 'bg-purple-900/60 text-purple-200 border-purple-600/50',
    icon: MessageSquare,
  },
  comandos: {
    label: 'Comandos',
    color: 'bg-cyan-950/50 text-cyan-300 border-cyan-800/30',
    activeColor: 'bg-cyan-900/60 text-cyan-200 border-cyan-600/50',
    icon: Terminal,
  },
  troubleshooting: {
    label: 'Troubleshooting',
    color: 'bg-red-950/50 text-red-300 border-red-800/30',
    activeColor: 'bg-red-900/60 text-red-200 border-red-600/50',
    icon: Bug,
  },
  general: {
    label: 'General',
    color: 'bg-amber-950/50 text-amber-300 border-amber-800/30',
    activeColor: 'bg-amber-900/60 text-amber-200 border-amber-600/50',
    icon: FileText,
  },
};

/**
 * Componente de filtro por categoría
 * 
 * @param {Object} props
 * @param {string} props.categoriaActiva - Categoría actualmente seleccionada
 * @param {Function} props.onCategoriaChange - Callback al cambiar la categoría
 * @param {number} props.contadorNotas - Número total de notas por categoría
 */
export default function CategoryFilter({ categoriaActiva, onCategoriaChange, contadorNotas = {} }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(CATEGORIAS).map(([key, cat]) => {
        const Icon = cat.icon;
        const isActive = categoriaActiva === key;
        const count = key === 'todas'
          ? Object.values(contadorNotas).reduce((sum, val) => sum + val, 0)
          : (contadorNotas[key] || 0);

        return (
          <button
            key={key}
            onClick={() => onCategoriaChange(key)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium
              transition-all duration-200
              ${isActive ? cat.activeColor + ' shadow-lg' : cat.color + ' hover:opacity-80'}
            `}
          >
            <Icon size={13} />
            <span>{cat.label}</span>
            {count > 0 && (
              <span className={`
                ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold
                ${isActive ? 'bg-white/10' : 'bg-white/5'}
              `}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
