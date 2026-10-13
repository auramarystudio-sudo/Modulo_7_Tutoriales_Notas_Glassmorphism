/**
 * TutorialesLibrary.jsx
 * 
 * Componente principal de la biblioteca de tutoriales y notas.
 * Incluye: Dashboard, Pin, Duplicar, Importar/Exportar, Búsqueda rápida,
 * Plantillas, Toast, Vista de lectura, Snippets, Auto-suggest de tags.
 */
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Search,
  Plus,
  BookOpen,
  Loader2,
  Inbox,
  Keyboard,
  Sparkles,
  ArrowDownAZ,
  Clock,
  Star,
  LayoutGrid,
  List,
  Pin,
  PinOff,
  Copy,
  Download,
  Upload,
  BarChart3,
  Library,
} from 'lucide-react';
import {
  getAllNotas,
  createNota,
  updateNota,
  deleteNota,
  toggleFavorito,
  togglePin,
  duplicarNota,
  exportarBiblioteca,
  importarBiblioteca,
} from '../../lib/localStore';
import NotaCard from './NotaCard';
import NotaDetail from './NotaDetail';
import NotaForm from './NotaForm';
import CategoryFilter from './CategoryFilter';
import VistaLectura from './VistaLectura';
import BusquedaRapida from './BusquedaRapida';
import PlantillaSelector from './PlantillaSelector';
import ConfirmDialog from './ConfirmDialog';
import Dashboard from './Dashboard';
import { ToastProvider, useToast } from './Toast';

/**
 * Contenido interno de la biblioteca (con acceso a toast)
 */
function BibliotecaContent() {
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  
  // Estado principal
  const [notas, setNotas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [ordenamiento, setOrdenamiento] = useState('recientes');
  const [vistaGrid, setVistaGrid] = useState(true);
  const [vistaActual, setVistaActual] = useState('biblioteca'); // 'biblioteca' | 'dashboard'
  
  // Modales
  const [modalFormulario, setModalFormulario] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarVistaLectura, setMostrarVistaLectura] = useState(null);
  const [mostrarBusquedaRapida, setMostrarBusquedaRapida] = useState(false);
  const [mostrarPlantillas, setMostrarPlantillas] = useState(false);
  
  // Confirmación de eliminación
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(null);

  /**
   * Cargar notas
   */
  const cargarNotas = async () => {
    setCargando(true);
    try {
      const datos = await getAllNotas('-fecha_creacion');
      setNotas(datos);
    } catch (error) {
      console.error('Error al cargar notas:', error);
      showToast('Error al cargar las notas', 'error');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarNotas();
  }, []);

  /**
   * Atajos de teclado globales
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+K: búsqueda rápida
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setMostrarBusquedaRapida(prev => !prev);
      }
      // Ctrl+N: nueva nota
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setMostrarPlantillas(true);
      }
      // Ctrl+D: dashboard
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        setVistaActual(prev => prev === 'dashboard' ? 'biblioteca' : 'dashboard');
      }
      // Escape
      if (e.key === 'Escape') {
        setMostrarBusquedaRapida(false);
        setMostrarPlantillas(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /**
   * Filtrar y ordenar notas (con pins arriba)
   */
  const notasFiltradas = useMemo(() => {
    let resultado = [...notas];

    // Filtrar por categoría
    if (filtroCategoria !== 'todas') {
      resultado = resultado.filter(nota => nota.categoria === filtroCategoria);
    }

    // Filtrar por búsqueda
    if (busqueda.trim()) {
      const termino = busqueda.toLowerCase().trim();
      resultado = resultado.filter(nota => {
        if (nota.titulo.toLowerCase().includes(termino)) return true;
        if (nota.contenido.toLowerCase().includes(termino)) return true;
        if (nota.tags && nota.tags.some(tag => tag.toLowerCase().includes(termino))) return true;
        return false;
      });
    }

    // Ordenar
    switch (ordenamiento) {
      case 'alfabetico':
        resultado.sort((a, b) => a.titulo.localeCompare(b.titulo));
        break;
      case 'favoritos':
        resultado.sort((a, b) => (b.es_favorito ? 1 : 0) - (a.es_favorito ? 1 : 0));
        break;
      case 'recientes':
      default:
        resultado.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
        break;
    }

    // Pins siempre arriba
    const pinned = resultado.filter(n => n.pinned);
    const unpinned = resultado.filter(n => !n.pinned);
    
    return [...pinned, ...unpinned];
  }, [notas, filtroCategoria, busqueda, ordenamiento]);

  /**
   * Contador por categoría
   */
  const contadorNotas = useMemo(() => {
    const contadores = {};
    notas.forEach(nota => {
      contadores[nota.categoria] = (contadores[nota.categoria] || 0) + 1;
    });
    return contadores;
  }, [notas]);

  /**
   * Guardar nota
   */
  const handleGuardar = async (data) => {
    try {
      if (modalFormulario?.id) {
        await updateNota(modalFormulario.id, data);
        showToast('Nota actualizada correctamente', 'success');
      } else {
        await createNota(data);
        showToast('Nota creada correctamente', 'success');
      }
      await cargarNotas();
      setMostrarFormulario(false);
      setModalFormulario(null);
    } catch (error) {
      console.error('Error al guardar:', error);
      showToast('Error al guardar la nota', 'error');
      throw error;
    }
  };

  /**
   * Eliminar nota
   */
  const handleEliminar = (id) => {
    setConfirmarEliminacion(id);
  };

  const confirmarEliminar = async () => {
    try {
      await deleteNota(confirmarEliminacion);
      await cargarNotas();
      setMostrarVistaLectura(null);
      showToast('Nota eliminada', 'info');
    } catch (error) {
      showToast('Error al eliminar la nota', 'error');
    } finally {
      setConfirmarEliminacion(null);
    }
  };

  /**
   * Toggle favorito
   */
  const handleToggleFavorito = async (id) => {
    try {
      await toggleFavorito(id);
      await cargarNotas();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  /**
   * Toggle pin
   */
  const handleTogglePin = async (id) => {
    try {
      await togglePin(id);
      await cargarNotas();
      const nota = notas.find(n => n.id === id);
      showToast(nota?.pinned ? 'Nota desfijada' : 'Nota fijada arriba', 'success');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  /**
   * Duplicar nota
   */
  const handleDuplicar = async (id) => {
    try {
      await duplicarNota(id);
      await cargarNotas();
      showToast('Nota duplicada correctamente', 'success');
    } catch (error) {
      showToast('Error al duplicar la nota', 'error');
    }
  };

  /**
   * Exportar nota como .md
   */
  const handleExportarNota = useCallback((nota) => {
    const contenido = `# ${nota.titulo}\n\n${nota.contenido}`;
    const blob = new Blob([contenido], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${nota.titulo.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Nota exportada como .md', 'success');
  }, [showToast]);

  /**
   * Exportar toda la biblioteca
   */
  const handleExportarBiblioteca = async () => {
    try {
      const json = await exportarBiblioteca();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tutoriales-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Biblioteca exportada correctamente', 'success');
    } catch (error) {
      showToast('Error al exportar la biblioteca', 'error');
    }
  };

  /**
   * Importar biblioteca
   */
  const handleImportarBiblioteca = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const resultado = await importarBiblioteca(text);
      await cargarNotas();
      showToast(`${resultado.importadas} notas importadas correctamente`, 'success');
    } catch (error) {
      showToast(error.message || 'Error al importar', 'error');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Abrir formulario
   */
  const handleEditar = (nota) => {
    setMostrarVistaLectura(null);
    setModalFormulario(nota);
    setMostrarFormulario(true);
  };

  const handleNuevaNota = () => {
    setMostrarPlantillas(true);
  };

  const handleSeleccionarPlantilla = (plantilla) => {
    setMostrarPlantillas(false);
    if (plantilla) {
      setModalFormulario({
        titulo: '',
        contenido: plantilla.contenido,
        categoria: plantilla.categoria,
        tags: plantilla.tags,
        es_favorito: false,
      });
    } else {
      setModalFormulario(null);
    }
    setMostrarFormulario(true);
  };

  const handleCerrarFormulario = () => {
    setMostrarFormulario(false);
    setModalFormulario(null);
  };

  const handleSeleccionarBusquedaRapida = (nota) => {
    setMostrarBusquedaRapida(false);
    setMostrarVistaLectura(nota);
  };

  return (
    <div className="space-y-6">
      {/* Input oculto para importar */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImportarBiblioteca}
        className="hidden"
      />

      {/* Barra superior con toggle vista */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-slate-800/30 border border-slate-800/50 rounded-xl p-1">
          <button
            onClick={() => setVistaActual('biblioteca')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
              vistaActual === 'biblioteca'
                ? 'bg-cyan-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Library size={14} />
            <span className="hidden sm:inline">Biblioteca</span>
          </button>
          <button
            onClick={() => setVistaActual('dashboard')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
              vistaActual === 'dashboard'
                ? 'bg-cyan-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 size={14} />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
        </div>

        {/* Acciones de biblioteca */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportarBiblioteca}
            className="p-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition"
            title="Exportar biblioteca"
          >
            <Download size={15} />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition"
            title="Importar biblioteca"
          >
            <Upload size={15} />
          </button>
        </div>
      </div>

      {/* Vista Dashboard */}
      {vistaActual === 'dashboard' && (
        <Dashboard
          notas={notas}
          onVerNota={(nota) => setMostrarVistaLectura(nota)}
        />
      )}

      {/* Vista Biblioteca */}
      {vistaActual === 'biblioteca' && (
        <>
          {/* Barra de búsqueda y acciones */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por título, contenido o tags..."
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-10 pr-20 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/80 text-[10px] text-slate-500 font-mono border border-slate-700/50">
                <Keyboard size={9} />
                Ctrl+K
              </kbd>
            </div>

            <div className="flex items-center gap-2">
              {/* Toggle vista */}
              <button
                onClick={() => setVistaGrid(!vistaGrid)}
                className="p-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition"
                title={vistaGrid ? 'Vista lista' : 'Vista grid'}
              >
                {vistaGrid ? <List size={16} /> : <LayoutGrid size={16} />}
              </button>

              {/* Ordenamiento */}
              <div className="relative group">
                <button className="p-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition">
                  {ordenamiento === 'recientes' && <Clock size={16} />}
                  {ordenamiento === 'alfabetico' && <ArrowDownAZ size={16} />}
                  {ordenamiento === 'favoritos' && <Star size={16} />}
                </button>
                <div className="absolute right-0 top-full mt-1 w-44 bg-slate-900/95 border border-slate-800/50 rounded-xl shadow-xl backdrop-blur-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-30">
                  <button
                    onClick={() => setOrdenamiento('recientes')}
                    className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-slate-800/50 transition rounded-t-xl ${ordenamiento === 'recientes' ? 'text-cyan-400' : 'text-slate-400'}`}
                  >
                    <Clock size={13} /> Más recientes
                  </button>
                  <button
                    onClick={() => setOrdenamiento('alfabetico')}
                    className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-slate-800/50 transition ${ordenamiento === 'alfabetico' ? 'text-cyan-400' : 'text-slate-400'}`}
                  >
                    <ArrowDownAZ size={13} /> Alfabético A-Z
                  </button>
                  <button
                    onClick={() => setOrdenamiento('favoritos')}
                    className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-slate-800/50 transition rounded-b-xl ${ordenamiento === 'favoritos' ? 'text-cyan-400' : 'text-slate-400'}`}
                  >
                    <Star size={13} /> Favoritos primero
                  </button>
                </div>
              </div>

              {/* Nueva nota */}
              <button
                onClick={handleNuevaNota}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition shadow-lg whitespace-nowrap"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Nueva Nota</span>
              </button>
            </div>
          </div>

          {/* Filtros por categoría */}
          <CategoryFilter
            categoriaActiva={filtroCategoria}
            onCategoriaChange={setFiltroCategoria}
            contadorNotas={contadorNotas}
          />

          {/* Contenido */}
          {cargando ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={32} className="text-cyan-400 animate-spin mb-4" />
              <p className="text-slate-400 text-sm">Cargando tutoriales...</p>
            </div>
          ) : notasFiltradas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 border border-slate-800/50 rounded-2xl backdrop-blur-sm">
              {busqueda || filtroCategoria !== 'todas' ? (
                <>
                  <Search size={40} className="text-slate-600 mb-4" />
                  <p className="text-slate-400 text-lg font-medium mb-2">No se encontraron resultados</p>
                  <p className="text-slate-500 text-sm text-center max-w-md">
                    {busqueda ? `No hay notas que coincidan con "${busqueda}"` : 'No hay notas en esta categoría'}
                  </p>
                  <button
                    onClick={() => { setBusqueda(''); setFiltroCategoria('todas'); }}
                    className="mt-4 text-sm text-cyan-400 hover:text-cyan-300 transition"
                  >
                    Limpiar filtros
                  </button>
                </>
              ) : (
                <>
                  <Inbox size={40} className="text-slate-600 mb-4" />
                  <p className="text-slate-400 text-lg font-medium mb-2">Tu biblioteca está vacía</p>
                  <p className="text-slate-500 text-sm text-center max-w-md mb-4">
                    Comienza creando tu primera nota o tutorial
                  </p>
                  <button
                    onClick={handleNuevaNota}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition shadow-lg"
                  >
                    <BookOpen size={15} />
                    Crear primera nota
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              {/* Info */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  {notasFiltradas.length} {notasFiltradas.length === 1 ? 'nota' : 'notas'}
                  {busqueda && ` para "${busqueda}"`}
                  {notasFiltradas.some(n => n.pinned) && (
                    <span className="ml-2 text-cyan-400/60">
                      · {notasFiltradas.filter(n => n.pinned).length} fijada{notasFiltradas.filter(n => n.pinned).length > 1 ? 's' : ''}
                    </span>
                  )}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-slate-600">
                  <Sparkles size={10} />
                  <span>Ctrl+N nueva · Ctrl+D dashboard</span>
                </div>
              </div>

              {/* Grid/Lista */}
              <div className={
                vistaGrid
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
                  : 'flex flex-col gap-3'
              }>
                {notasFiltradas.map((nota) => (
                  <NotaCard
                    key={nota.id}
                    nota={nota}
                    compacto={!vistaGrid}
                    onVer={(n) => setMostrarVistaLectura(n)}
                    onEditar={handleEditar}
                    onEliminar={handleEliminar}
                    onToggleFavorito={handleToggleFavorito}
                    onTogglePin={handleTogglePin}
                    onDuplicar={handleDuplicar}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Vista de lectura inmersiva */}
      {mostrarVistaLectura && (
        <VistaLectura
          nota={mostrarVistaLectura}
          onCerrar={() => setMostrarVistaLectura(null)}
          onEditar={() => handleEditar(mostrarVistaLectura)}
          onExportar={() => handleExportarNota(mostrarVistaLectura)}
        />
      )}

      {/* Modal de formulario */}
      {mostrarFormulario && (
        <NotaForm
          nota={modalFormulario}
          onGuardar={handleGuardar}
          onCancelar={handleCerrarFormulario}
        />
      )}

      {/* Búsqueda rápida */}
      <BusquedaRapida
        abierto={mostrarBusquedaRapida}
        notas={notas}
        onCerrar={() => setMostrarBusquedaRapida(false)}
        onSeleccionar={handleSeleccionarBusquedaRapida}
      />

      {/* Selector de plantillas */}
      <PlantillaSelector
        abierto={mostrarPlantillas}
        onSeleccionar={handleSeleccionarPlantilla}
        onCerrar={() => setMostrarPlantillas(false)}
      />

      {/* Diálogo de confirmación */}
      <ConfirmDialog
        abierto={!!confirmarEliminacion}
        titulo="Eliminar nota"
        mensaje="¿Estás seguro de que deseas eliminar esta nota? Esta acción no se puede deshacer."
        textoConfirmar="Eliminar"
        textoCancelar="Cancelar"
        variant="danger"
        onConfirmar={confirmarEliminar}
        onCancelar={() => setConfirmarEliminacion(null)}
      />
    </div>
  );
}

/**
 * Wrapper con ToastProvider
 */
export default function TutorialesLibrary() {
  return (
    <ToastProvider>
      <BibliotecaContent />
    </ToastProvider>
  );
}
