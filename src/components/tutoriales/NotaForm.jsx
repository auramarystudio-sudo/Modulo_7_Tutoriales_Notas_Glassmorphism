/**
 * NotaForm.jsx
 * 
 * Formulario modal para crear/editar notas con editor Markdown.
 * Incluye vista previa en vivo del contenido Markdown renderizado.
 * En desktop: dos columnas (editor + preview).
 * En móvil: tabs para alternar entre editor y preview.
 */
import { useState, useEffect } from 'react';
import {
  X,
  Save,
  Eye,
  Code,
  Plus,
} from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import { CATEGORIAS } from './CategoryFilter';

/**
 * Formulario de nota con editor Markdown y vista previa
 * 
 * @param {Object} props
 * @param {Object|null} props.nota - Nota a editar (null para crear nueva)
 * @param {Function} props.onGuardar - Callback al guardar
 * @param {Function} props.onCancelar - Callback al cancelar
 */
export default function NotaForm({ nota, onGuardar, onCancelar }) {
  // Estado del formulario
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [categoria, setCategoria] = useState('general');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [tabActiva, setTabActiva] = useState('editor'); // 'editor' o 'preview'
  const [guardando, setGuardando] = useState(false);

  // Si estamos editando, cargar datos existentes
  useEffect(() => {
    if (nota) {
      setTitulo(nota.titulo || '');
      setContenido(nota.contenido || '');
      setCategoria(nota.categoria || 'general');
      setTags(nota.tags || []);
    }
  }, [nota]);

  /**
   * Agregar un tag
   */
  const agregarTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput('');
  };

  /**
   * Eliminar un tag
   */
  const eliminarTag = (tagAEliminar) => {
    setTags(tags.filter(t => t !== tagAEliminar));
  };

  /**
   * Manejar Enter en el input de tags
   */
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      agregarTag();
    }
    if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  /**
   * Guardar la nota
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!titulo.trim()) {
      alert('El título es obligatorio');
      return;
    }
    if (!contenido.trim()) {
      alert('El contenido es obligatorio');
      return;
    }

    setGuardando(true);
    
    try {
      await onGuardar({
        titulo: titulo.trim(),
        contenido,
        categoria,
        tags,
        es_favorito: nota?.es_favorito || false,
        fecha_creacion: nota?.fecha_creacion || new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar la nota');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancelar}
      />

      {/* Modal */}
      <div className="relative w-full max-w-6xl max-h-[95vh] bg-slate-900/95 border border-slate-800/50 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800/50">
          <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {nota ? 'Editar Nota' : 'Nueva Nota / Tutorial'}
          </h2>
          <button
            onClick={onCancelar}
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Título
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Comandos esenciales de Git"
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition"
              required
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Categoría
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition"
            >
              {Object.entries(CATEGORIAS)
                .filter(([key]) => key !== 'todas')
                .map(([key, cat]) => (
                  <option key={key} value={key} className="bg-slate-900">
                    {cat.label}
                  </option>
                ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tags
            </label>
            <div className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 focus-within:border-cyan-500/50 focus-within:ring-2 focus-within:ring-cyan-500/20 transition">
              <div className="flex flex-wrap items-center gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-purple-950/50 text-purple-300 border border-purple-800/30"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => eliminarTag(tag)}
                      className="text-purple-400 hover:text-purple-200 transition"
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={agregarTag}
                  placeholder={tags.length === 0 ? 'Escribe y presiona Enter...' : ''}
                  className="flex-1 min-w-[120px] bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none py-1"
                />
                <button
                  type="button"
                  onClick={agregarTag}
                  className="p-1 rounded text-slate-500 hover:text-cyan-400 transition"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Editor Markdown con vista previa */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Contenido (Markdown)
            </label>

            {/* Tabs para móvil */}
            <div className="flex lg:hidden gap-1 mb-3">
              <button
                type="button"
                onClick={() => setTabActiva('editor')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                  tabActiva === 'editor'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white'
                }`}
              >
                <Code size={13} />
                Editor
              </button>
              <button
                type="button"
                onClick={() => setTabActiva('preview')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                  tabActiva === 'preview'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white'
                }`}
              >
                <Eye size={13} />
                Vista Previa
              </button>
            </div>

            {/* Layout de dos columnas (desktop) o tabs (móvil) */}
            <div className="grid lg:grid-cols-2 gap-4 min-h-[350px]">
              {/* Columna del editor */}
              <div className={`${tabActiva === 'editor' ? 'block' : 'hidden'} lg:block`}>
                <div className="flex items-center gap-2 mb-2">
                  <Code size={14} className="text-cyan-400" />
                  <span className="text-xs text-slate-500 font-medium">Markdown</span>
                </div>
                <textarea
                  value={contenido}
                  onChange={(e) => setContenido(e.target.value)}
                  placeholder={`# Mi Tutorial\n\nEscribe tu contenido en **Markdown** aquí...\n\n\`\`\`bash\n# Ejemplo de código\necho "Hola mundo"\n\`\`\``}
                  className="w-full h-[350px] lg:h-[400px] bg-slate-950 border border-slate-800/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-600 font-mono text-sm leading-relaxed focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition resize-none"
                  required
                />
              </div>

              {/* Columna de vista previa */}
              <div className={`${tabActiva === 'preview' ? 'block' : 'hidden'} lg:block`}>
                <div className="flex items-center gap-2 mb-2">
                  <Eye size={14} className="text-purple-400" />
                  <span className="text-xs text-slate-500 font-medium">Vista Previa</span>
                </div>
                <div className="w-full h-[350px] lg:h-[400px] bg-slate-950/50 border border-slate-800/50 rounded-lg p-4 overflow-y-auto">
                  {contenido ? (
                    <MarkdownRenderer contenido={contenido} />
                  ) : (
                    <p className="text-slate-600 italic text-sm text-center mt-8">
                      La vista previa aparecerá aquí mientras escribes...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer con acciones */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800/50">
          <button
            type="button"
            onClick={onCancelar}
            className="px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white text-sm font-medium transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={guardando}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={15} />
            {guardando ? 'Guardando...' : (nota ? 'Actualizar' : 'Guardar')}
          </button>
        </div>
      </div>
    </div>
  );
}
