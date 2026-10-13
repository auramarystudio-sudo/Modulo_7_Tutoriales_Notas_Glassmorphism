/**
 * BusquedaRapida.jsx
 * 
 * Command palette estilo Ctrl+K para búsqueda rápida de notas.
 * Se activa con el atajo de teclado Ctrl+K o Cmd+K.
 */
import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Star,
  ArrowRight,
  Keyboard,
  X,
} from 'lucide-react';
import { CATEGORIAS } from './CategoryFilter';

/**
 * Busqueda rápida (Command Palette)
 * 
 * @param {Object} props
 * @param {boolean} props.abierto - Si la búsqueda está visible
 * @param {Array} props.notas - Lista de notas para buscar
 * @param {Function} props.onCerrar - Callback al cerrar
 * @param {Function} props.onSeleccionar - Callback al seleccionar una nota
 */
export default function BusquedaRapida({ abierto, notas, onCerrar, onSeleccionar }) {
  const [query, setQuery] = useState('');
  const [indiceSeleccionado, setIndiceSeleccionado] = useState(0);
  const inputRef = useRef(null);

  // Reset al abrir
  useEffect(() => {
    if (abierto) {
      setQuery('');
      setIndiceSeleccionado(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [abierto]);

  // Filtrar notas según la búsqueda
  const resultados = useMemo(() => {
    if (!query.trim()) {
      // Mostrar las más recientes (máximo 8)
      return notas.slice(0, 8);
    }
    
    const termino = query.toLowerCase().trim();
    return notas
      .filter(nota => {
        if (nota.titulo.toLowerCase().includes(termino)) return true;
        if (nota.contenido.toLowerCase().includes(termino)) return true;
        if (nota.tags && nota.tags.some(tag => tag.toLowerCase().includes(termino))) return true;
        return false;
      })
      .slice(0, 10);
  }, [notas, query]);

  // Manejar navegación con teclado
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIndiceSeleccionado(prev => Math.min(prev + 1, resultados.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIndiceSeleccionado(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && resultados[indiceSeleccionado]) {
      e.preventDefault();
      onSeleccionar(resultados[indiceSeleccionado]);
    } else if (e.key === 'Escape') {
      onCerrar();
    }
  };

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center pt-[15vh] px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCerrar}
      />

      {/* Panel de búsqueda */}
      <div className="relative w-full max-w-xl bg-slate-900/95 border border-slate-800/50 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden animate-[scaleIn_0.15s_ease-out]">
        {/* Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800/50">
          <Search size={18} className="text-slate-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndiceSeleccionado(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Buscar notas, tutoriales, comandos..."
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-base focus:outline-none"
          />
          <button
            onClick={onCerrar}
            className="p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-500 hover:text-white transition"
          >
            <X size={14} />
          </button>
        </div>

        {/* Resultados */}
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {resultados.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-slate-500 text-sm">
                No se encontraron resultados para "{query}"
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {resultados.map((nota, index) => {
                const categoria = CATEGORIAS[nota.categoria] || CATEGORIAS.general;
                const isSelected = index === indiceSeleccionado;
                
                // Extraer extracto
                let extracto = nota.contenido
                  .replace(/#{1,6}\s/g, '')
                  .replace(/\*\*(.*?)\*\*/g, '$1')
                  .replace(/`{1,3}[^`]*`{1,3}/g, '')
                  .replace(/\n/g, ' ')
                  .replace(/\s+/g, ' ')
                  .trim()
                  .substring(0, 60);

                return (
                  <button
                    key={nota.id}
                    onClick={() => onSeleccionar(nota)}
                    onMouseEnter={() => setIndiceSeleccionado(index)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition
                      ${isSelected
                        ? 'bg-cyan-950/30 border border-cyan-800/30'
                        : 'hover:bg-slate-800/30 border border-transparent'
                      }
                    `}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-medium truncate ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                          {nota.titulo}
                        </h4>
                        {nota.es_favorito && (
                          <Star size={11} className="text-yellow-400 fill-yellow-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {extracto}...
                      </p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded border shrink-0 ${categoria.color}`}>
                      {categoria.label}
                    </span>
                    <ArrowRight size={14} className={`shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer con atajos */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800/50 bg-slate-900/50">
          <div className="flex items-center gap-3 text-[10px] text-slate-600">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 font-mono">↑↓</kbd>
              navegar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 font-mono">↵</kbd>
              abrir
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 font-mono">esc</kbd>
              cerrar
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-600">
            <Keyboard size={10} />
            <span>Ctrl+K</span>
          </div>
        </div>
      </div>
    </div>
  );
}
