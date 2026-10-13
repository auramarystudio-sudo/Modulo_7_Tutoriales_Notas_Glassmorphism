/**
 * BusquedaAvanzada.jsx
 * 
 * Panel de búsqueda avanzada con filtros combinados,
 * búsqueda en código, expresiones regulares y operadores.
 */
import { useState, useMemo } from 'react';
import {
  Search,
  X,
  Filter,
  Code,
  Regex,
  Calendar,
  Tag,
  Star,
  Pin,
} from 'lucide-react';
import { CATEGORIAS } from './CategoryFilter';

/**
 * Panel de búsqueda avanzada
 * 
 * @param {Object} props
 * @param {boolean} props.abierto - Si el panel está visible
 * @param {Array} props.notas - Lista de notas
 * @param {Function} props.onSeleccionar - Callback al seleccionar una nota
 * @param {Function} props.onCerrar - Callback al cerrar
 */
export default function BusquedaAvanzada({ abierto, notas = [], onSeleccionar, onCerrar }) {
  const [query, setQuery] = useState('');
  const [usarRegex, setUsarRegex] = useState(false);
  const [buscarEnCodigo, setBuscarEnCodigo] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const [soloPinned, setSoloPinned] = useState(false);
  const [tagsSeleccionados, setTagsSeleccionados] = useState([]);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  // Obtener todos los tags únicos
  const todosLosTags = useMemo(() => {
    const tags = new Set();
    notas.forEach(nota => {
      if (nota.tags) nota.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [notas]);

  // Filtrar notas
  const resultados = useMemo(() => {
    let filtered = [...notas];

    // Filtro por categoría
    if (filtroCategoria !== 'todas') {
      filtered = filtered.filter(n => n.categoria === filtroCategoria);
    }

    // Filtro por favoritos
    if (soloFavoritos) {
      filtered = filtered.filter(n => n.es_favorito);
    }

    // Filtro por pinned
    if (soloPinned) {
      filtered = filtered.filter(n => n.pinned);
    }

    // Filtro por tags
    if (tagsSeleccionados.length > 0) {
      filtered = filtered.filter(n => 
        tagsSeleccionados.every(tag => n.tags?.includes(tag))
      );
    }

    // Filtro por fecha
    if (fechaDesde) {
      const desde = new Date(fechaDesde);
      filtered = filtered.filter(n => new Date(n.fecha_creacion) >= desde);
    }
    if (fechaHasta) {
      const hasta = new Date(fechaHasta);
      hasta.setHours(23, 59, 59);
      filtered = filtered.filter(n => new Date(n.fecha_creacion) <= hasta);
    }

    // Búsqueda de texto
    if (query.trim()) {
      const termino = query.trim();
      
      filtered = filtered.filter(nota => {
        try {
          if (usarRegex) {
            const regex = new RegExp(termino, 'i');
            return regex.test(nota.titulo) || regex.test(nota.contenido);
          } else {
            const t = termino.toLowerCase();
            
            // Buscar en título
            if (nota.titulo.toLowerCase().includes(t)) return true;
            
            // Buscar en contenido
            if (buscarEnCodigo) {
              // Buscar en todo el contenido incluyendo código
              if (nota.contenido.toLowerCase().includes(t)) return true;
            } else {
              // Buscar solo en texto (sin bloques de código)
              const textoSinCodigo = nota.contenido.replace(/```[\s\S]*?```/g, '');
              if (textoSinCodigo.toLowerCase().includes(t)) return true;
            }
            
            // Buscar en tags
            if (nota.tags?.some(tag => tag.toLowerCase().includes(t))) return true;
            
            return false;
          }
        } catch (e) {
          // Si hay error en regex, no filtrar
          return false;
        }
      });
    }

    return filtered.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
  }, [notas, query, usarRegex, buscarEnCodigo, filtroCategoria, soloFavoritos, soloPinned, tagsSeleccionados, fechaDesde, fechaHasta]);

  const toggleTag = (tag) => {
    setTagsSeleccionados(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const limpiarFiltros = () => {
    setQuery('');
    setUsarRegex(false);
    setBuscarEnCodigo(false);
    setFiltroCategoria('todas');
    setSoloFavoritos(false);
    setSoloPinned(false);
    setTagsSeleccionados([]);
    setFechaDesde('');
    setFechaHasta('');
  };

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCerrar} />

      <div className="relative w-full max-w-4xl bg-slate-900/95 border border-slate-800/50 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950/50 border border-cyan-800/30">
              <Search size={18} className="text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Búsqueda Avanzada</h2>
              <p className="text-xs text-slate-500">{resultados.length} resultados</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={limpiarFiltros}
              className="px-3 py-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-medium transition"
            >
              Limpiar
            </button>
            <button
              onClick={onCerrar}
              className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Búsqueda principal */}
        <div className="p-5 border-b border-slate-800/50">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar..."
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl pl-12 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition"
              autoFocus
            />
          </div>

          {/* Opciones de búsqueda */}
          <div className="flex items-center gap-4 mt-3">
            <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer hover:text-slate-300 transition">
              <input
                type="checkbox"
                checked={usarRegex}
                onChange={(e) => setUsarRegex(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-cyan-600 focus:ring-cyan-500/20"
              />
              <Regex size={14} />
              Regex
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer hover:text-slate-300 transition">
              <input
                type="checkbox"
                checked={buscarEnCodigo}
                onChange={(e) => setBuscarEnCodigo(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-cyan-600 focus:ring-cyan-500/20"
              />
              <Code size={14} />
              Incluir código
            </label>
          </div>
        </div>

        {/* Filtros */}
        <div className="p-5 border-b border-slate-800/50 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Filter size={14} className="text-slate-500" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Filtros</span>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-xs text-slate-500 mb-2">Categoría</label>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500/50 transition"
            >
              <option value="todas">Todas</option>
              {Object.entries(CATEGORIAS)
                .filter(([key]) => key !== 'todas')
                .map(([key, cat]) => (
                  <option key={key} value={key}>{cat.label}</option>
                ))}
            </select>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer hover:text-slate-300 transition">
              <input
                type="checkbox"
                checked={soloFavoritos}
                onChange={(e) => setSoloFavoritos(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-yellow-600 focus:ring-yellow-500/20"
              />
              <Star size={14} />
              Solo favoritos
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer hover:text-slate-300 transition">
              <input
                type="checkbox"
                checked={soloPinned}
                onChange={(e) => setSoloPinned(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-cyan-600 focus:ring-cyan-500/20"
              />
              <Pin size={14} />
              Solo fijadas
            </label>
          </div>

          {/* Tags */}
          {todosLosTags.length > 0 && (
            <div>
              <label className="block text-xs text-slate-500 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {todosLosTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition ${
                      tagsSeleccionados.includes(tag)
                        ? 'bg-purple-950/50 text-purple-300 border-purple-700/50'
                        : 'bg-slate-800/30 text-slate-500 border-slate-700/30 hover:border-slate-600/50'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-2">Desde</label>
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500/50 transition"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-2">Hasta</label>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500/50 transition"
              />
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="max-h-[40vh] overflow-y-auto p-5">
          {resultados.length === 0 ? (
            <p className="text-center text-slate-500 py-8">No se encontraron resultados</p>
          ) : (
            <div className="space-y-2">
              {resultados.map(nota => {
                const categoria = CATEGORIAS[nota.categoria] || CATEGORIAS.general;
                return (
                  <button
                    key={nota.id}
                    onClick={() => onSeleccionar(nota)}
                    className="w-full text-left p-3 rounded-xl bg-slate-800/20 hover:bg-slate-800/40 border border-slate-800/30 hover:border-cyan-800/30 transition group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${categoria.color}`}>
                        {categoria.label}
                      </span>
                      {nota.es_favorito && <Star size={10} className="text-yellow-400 fill-yellow-400" />}
                      {nota.pinned && <Pin size={10} className="text-cyan-400" />}
                    </div>
                    <h4 className="text-sm font-medium text-slate-200 group-hover:text-cyan-400 transition">
                      {nota.titulo}
                    </h4>
                    <p className="text-xs text-slate-500 truncate mt-1">
                      {nota.contenido?.replace(/[#*`\[\]]/g, '').substring(0, 80)}...
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
