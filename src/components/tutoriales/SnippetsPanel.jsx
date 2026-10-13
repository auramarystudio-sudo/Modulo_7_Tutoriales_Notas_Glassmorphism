/**
 * SnippetsPanel.jsx
 * 
 * Panel de fragmentos de código/texto reutilizables que se pueden
 * insertar rápidamente en el editor Markdown.
 */
import { useState } from 'react';
import {
  Code2,
  X,
  Search,
  Copy,
  Check,
  Zap,
} from 'lucide-react';

/**
 * Snippets predefinidos organizados por categoría
 */
const SNIPPETS = [
  {
    id: 'bash-template',
    nombre: 'Bloque Bash',
    categoria: 'código',
    icono: '⌨️',
    contenido: '```bash\n# Descripción del comando\ncomando --flag argumento\n```',
  },
  {
    id: 'js-template',
    nombre: 'Bloque JavaScript',
    categoria: 'código',
    icono: '🟨',
    contenido: '```javascript\n// Descripción\nconst ejemplo = () => {\n  return resultado;\n};\n```',
  },
  {
    id: 'jsx-template',
    nombre: 'Bloque JSX/React',
    categoria: 'código',
    icono: '⚛️',
    contenido: '```jsx\nfunction Componente({ prop }) {\n  return (\n    <div className="...">\n      {prop}\n    </div>\n  );\n}\n```',
  },
  {
    id: 'python-template',
    nombre: 'Bloque Python',
    categoria: 'código',
    icono: '🐍',
    contenido: '```python\n# Descripción\ndef funcion(param):\n    """Docstring"""\n    return resultado\n```',
  },
  {
    id: 'sql-template',
    nombre: 'Bloque SQL',
    categoria: 'código',
    icono: '🗃️',
    contenido: '```sql\nSELECT columnas\nFROM tabla\nWHERE condicion\nORDER BY columna;\n```',
  },
  {
    id: 'json-template',
    nombre: 'Bloque JSON',
    categoria: 'código',
    icono: '📋',
    contenido: '```json\n{\n  "clave": "valor",\n  "array": [1, 2, 3]\n}\n```',
  },
  {
    id: 'warning-box',
    nombre: '⚠️ Caja de Advertencia',
    categoria: 'formato',
    icono: '⚠️',
    contenido: '> ⚠️ **Advertencia:** Descripción del warning importante.',
  },
  {
    id: 'tip-box',
    nombre: '💡 Caja de Tip',
    categoria: 'formato',
    icono: '💡',
    contenido: '> 💡 **Tip:** Descripción del consejo útil.',
  },
  {
    id: 'info-box',
    nombre: 'ℹ️ Caja de Info',
    categoria: 'formato',
    icono: 'ℹ️',
    contenido: '> ℹ️ **Nota:** Información adicional relevante.',
  },
  {
    id: 'checklist',
    nombre: '✅ Checklist',
    categoria: 'formato',
    icono: '✅',
    contenido: '- [ ] Tarea pendiente 1\n- [ ] Tarea pendiente 2\n- [x] Tarea completada',
  },
  {
    id: 'table-template',
    nombre: '📊 Tabla',
    categoria: 'formato',
    icono: '📊',
    contenido: '| Columna 1 | Columna 2 | Columna 3 |\n|-----------|-----------|----------|\n| Dato 1    | Dato 2    | Dato 3   |\n| Dato 4    | Dato 5    | Dato 6   |',
  },
  {
    id: 'details-collapse',
    nombre: '📂 Details/Collapse',
    categoria: 'formato',
    icono: '📂',
    contenido: '<details>\n<summary>Haz clic para expandir</summary>\n\nContenido oculto aquí...\n\n</details>',
  },
  {
    id: 'link-ref',
    nombre: '🔗 Referencia de Link',
    categoria: 'formato',
    icono: '🔗',
    contenido: '[Texto del enlace](https://ejemplo.com "Tooltip")',
  },
  {
    id: 'separator',
    nombre: '— Separador',
    categoria: 'formato',
    icono: '—',
    contenido: '\n---\n',
  },
];

/**
 * Panel de snippets
 * 
 * @param {Object} props
 * @param {boolean} props.abierto - Si el panel está visible
 * @param {Function} props.onInsertar - Callback al insertar un snippet (recibe el contenido)
 * @param {Function} props.onCerrar - Callback al cerrar
 */
export default function SnippetsPanel({ abierto, onInsertar, onCerrar }) {
  const [busqueda, setBusqueda] = useState('');
  const [copiado, setCopiado] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState('todos');

  if (!abierto) return null;

  const categorias = ['todos', ...new Set(SNIPPETS.map(s => s.categoria))];
  
  const snippetsFiltrados = SNIPPETS.filter(s => {
    const matchBusqueda = s.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const matchCategoria = filtroCategoria === 'todos' || s.categoria === filtroCategoria;
    return matchBusqueda && matchCategoria;
  });

  const handleCopiar = (snippet) => {
    navigator.clipboard.writeText(snippet.contenido);
    setCopiado(snippet.id);
    setTimeout(() => setCopiado(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCerrar}
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-slate-900/95 border border-slate-800/50 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950/50 border border-cyan-800/30">
              <Zap size={16} className="text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Snippets</h2>
              <p className="text-xs text-slate-500">Inserta fragmentos reutilizables</p>
            </div>
          </div>
          <button
            onClick={onCerrar}
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Búsqueda y filtros */}
        <div className="px-5 pt-4 space-y-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar snippet..."
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition"
            />
          </div>
          <div className="flex gap-1.5">
            {categorias.map(cat => (
              <button
                key={cat}
                onClick={() => setFiltroCategoria(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  filtroCategoria === cat
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'todos' ? 'Todos' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de snippets */}
        <div className="p-5 max-h-[50vh] overflow-y-auto space-y-2">
          {snippetsFiltrados.map(snippet => (
            <div
              key={snippet.id}
              className="group bg-slate-800/30 border border-slate-800/50 rounded-xl p-3 hover:border-cyan-800/30 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{snippet.icono}</span>
                  <span className="text-sm font-medium text-slate-200">{snippet.nombre}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopiar(snippet)}
                    className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-500 hover:text-slate-300 transition"
                    title="Copiar al portapapeles"
                  >
                    {copiado === snippet.id ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  </button>
                  <button
                    onClick={() => onInsertar(snippet.contenido)}
                    className="px-2.5 py-1 rounded-lg bg-cyan-600/80 hover:bg-cyan-600 text-white text-xs font-medium transition"
                  >
                    Insertar
                  </button>
                </div>
              </div>
              <pre className="text-[11px] text-slate-500 font-mono bg-slate-950/50 rounded-lg p-2 overflow-x-auto line-clamp-3">
                {snippet.contenido}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
