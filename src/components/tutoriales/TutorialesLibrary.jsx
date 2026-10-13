/**
 * TutorialesLibrary.jsx
 * 
 * Componente principal de la biblioteca de tutoriales y notas.
 * Integra: Dashboard, Calendario, Archivo, Historial, Backlinks,
 * Pomodoro, Grafo, Mermaid, Búsqueda Avanzada, Presentación, Recordatorios.
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
  Copy,
  Download,
  Upload,
  BarChart3,
  Library,
  Calendar,
  Archive,
  History,
  GitBranch,
  Filter,
  Bell,
  Presentation,
} from 'lucide-react';
import {
  getNotasActivas,
  getNotasArchivadas,
  getAllNotas,
  createNota,
  updateNota,
  deleteNota,
  toggleFavorito,
  togglePin,
  toggleArchivado,
  duplicarNota,
  exportarBiblioteca,
  importarBiblioteca,
  getVersiones,
  revertirVersion,
} from '../../lib/localStore';
import NotaCard from './NotaCard';
import NotaForm from './NotaForm';
import CategoryFilter from './CategoryFilter';
import VistaLectura from './VistaLectura';
import BusquedaRapida from './BusquedaRapida';
import BusquedaAvanzada from './BusquedaAvanzada';
import PlantillaSelector from './PlantillaSelector';
import ConfirmDialog from './ConfirmDialog';
import Dashboard from './Dashboard';
import VistaCalendario from './VistaCalendario';
import VersionHistory from './VersionHistory';
import GrafoConocimiento from './GrafoConocimiento';
import ModoPresentacion from './ModoPresentacion';
import SistemaRecordatorios from './SistemaRecordatorios';
import { ToastProvider, useToast } from './Toast';

/**
 * Contenido interno de la biblioteca
 */
function BibliotecaContent() {
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  
  // Estado principal
  const [notas, setNotas] = useState([]);
  const [notasArchivadas, setNotasArchivadas] = useState([]);
  const [todasLasNotas, setTodasLasNotas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [ordenamiento, setOrdenamiento] = useState('recientes');
  const [vistaGrid, setVistaGrid] = useState(true);
  const [vistaActual, setVistaActual] = useState('biblioteca');
  const [mostrarArchivadas, setMostrarArchivadas] = useState(false);
  
  // Modales
  const [modalFormulario, setModalFormulario] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarVistaLectura, setMostrarVistaLectura] = useState(null);
  const [mostrarBusquedaRapida, setMostrarBusquedaRapida] = useState(false);
  const [mostrarBusquedaAvanzada, setMostrarBusquedaAvanzada] = useState(false);
  const [mostrarPlantillas, setMostrarPlantillas] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(null);
  const [versiones, setVersiones] = useState([]);
  const [mostrarGrafo, setMostrarGrafo] = useState(false);
  const [mostrarPresentacion, setMostrarPresentacion] = useState(null);
  const [mostrarRecordatorios, setMostrarRecordatorios] = useState(false);
  
  // Confirmación
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(null);

  /**
   * Cargar notas
   */
  const cargarNotas = async () => {
    setCargando(true);
    try {
      const [activas, archivadas, todas] = await Promise.all([
        getNotasActivas(),
        getNotasArchivadas(),
        getAllNotas(),
      ]);
      setNotas(activas);
      setNotasArchivadas(archivadas);
      setTodasLasNotas(todas);
    } catch (error) {
      showToast('Error al cargar notas', 'error');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarNotas();
  }, []);

  /**
   * Atajos de teclado
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setMostrarBusquedaRapida(prev => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setMostrarBusquedaAvanzada(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setMostrarPlantillas(true);
      }
      if (e.key === 'Escape') {
        setMostrarBusquedaRapida(false);
        setMostrarBusquedaAvanzada(false);
        setMostrarPlantillas(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /**
   * Filtrar y ordenar notas
   */
  const notasFiltradas = useMemo(() => {
    const listaBase = mostrarArchivadas ? notasArchivadas : notas;
    let resultado = [...listaBase];

    if (filtroCategoria !== 'todas') {
      resultado = resultado.filter(nota => nota.categoria === filtroCategoria);
    }

    if (busqueda.trim()) {
      const termino = busqueda.toLowerCase().trim();
      resultado = resultado.filter(nota => {
        if (nota.titulo.toLowerCase().includes(termino)) return true;
        if (nota.contenido.toLowerCase().includes(termino)) return true;
        if (nota.tags?.some(tag => tag.toLowerCase().includes(termino))) return true;
        return false;
      });
    }

    switch (ordenamiento) {
      case 'alfabetico':
        resultado.sort((a, b) => a.titulo.localeCompare(b.titulo));
        break;
      case 'favoritos':
        resultado.sort((a, b) => (b.es_favorito ? 1 : 0) - (a.es_favorito ? 1 : 0));
        break;
      default:
        resultado.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
    }

    const pinned = resultado.filter(n => n.pinned);
    const unpinned = resultado.filter(n => !n.pinned);
    return [...pinned, ...unpinned];
  }, [notas, notasArchivadas, filtroCategoria, busqueda, ordenamiento, mostrarArchivadas]);

  const contadorNotas = useMemo(() => {
    const contadores = {};
    notas.forEach(nota => {
      contadores[nota.categoria] = (contadores[nota.categoria] || 0) + 1;
    });
    return contadores;
  }, [notas]);

  /**
   * Handlers
   */
  const handleGuardar = async (data) => {
    try {
      if (modalFormulario?.id) {
        await updateNota(modalFormulario.id, data);
        showToast('Nota actualizada', 'success');
      } else {
        await createNota(data);
        showToast('Nota creada', 'success');
      }
      await cargarNotas();
      setMostrarFormulario(false);
      setModalFormulario(null);
    } catch (error) {
      showToast('Error al guardar', 'error');
    }
  };

  const handleEliminar = (id) => setConfirmarEliminacion(id);

  const confirmarEliminar = async () => {
    try {
      await deleteNota(confirmarEliminacion);
      await cargarNotas();
      setMostrarVistaLectura(null);
      showToast('Nota eliminada', 'info');
    } catch {
      showToast('Error al eliminar', 'error');
    } finally {
      setConfirmarEliminacion(null);
    }
  };

  const handleToggleFavorito = async (id) => {
    await toggleFavorito(id);
    await cargarNotas();
  };

  const handleTogglePin = async (id) => {
    await togglePin(id);
    await cargarNotas();
    showToast('Estado de pin actualizado', 'success');
  };

  const handleToggleArchivado = async (id) => {
    await toggleArchivado(id);
    await cargarNotas();
    const nota = todasLasNotas.find(n => n.id === id);
    showToast(nota?.archivado ? 'Nota desarchivada' : 'Nota archivada', 'success');
    if (mostrarVistaLectura?.id === id) {
      setMostrarVistaLectura(null);
    }
  };

  const handleDuplicar = async (id) => {
    await duplicarNota(id);
    await cargarNotas();
    showToast('Nota duplicada', 'success');
  };

  const handleExportarNota = useCallback((nota) => {
    const contenido = `# ${nota.titulo}\n\n${nota.contenido}`;
    const blob = new Blob([contenido], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${nota.titulo.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Nota exportada', 'success');
  }, [showToast]);

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
      showToast('Biblioteca exportada', 'success');
    } catch {
      showToast('Error al exportar', 'error');
    }
  };

  const handleImportarBiblioteca = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const resultado = await importarBiblioteca(text);
      await cargarNotas();
      showToast(`${resultado.importadas} notas importadas`, 'success');
    } catch (error) {
      showToast(error.message || 'Error al importar', 'error');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEditar = (nota) => {
    setMostrarVistaLectura(null);
    setMostrarPresentacion(null);
    setModalFormulario(nota);
    setMostrarFormulario(true);
  };

  const handleVerHistorial = async (nota) => {
    const vers = await getVersiones(nota.id);
    setVersiones(vers);
    setMostrarHistorial(nota);
  };

  const handleRevertirVersion = async (version) => {
    try {
      await revertirVersion(mostrarHistorial.id, version.id);
      await cargarNotas();
      setMostrarHistorial(null);
      showToast('Nota revertida a versión anterior', 'success');
    } catch {
      showToast('Error al revertir', 'error');
    }
  };

  const handleVerNota = (nota) => {
    setMostrarVistaLectura(nota);
  };

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImportarBiblioteca}
        className="hidden"
      />

      {/* Toggle de vistas */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1 bg-slate-800/30 border border-slate-800/50 rounded-xl p-1 flex-wrap">
          {[
            { key: 'biblioteca', icon: Library, label: 'Biblioteca' },
            { key: 'dashboard', icon: BarChart3, label: 'Dashboard' },
            { key: 'calendario', icon: Calendar, label: 'Calendario' },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => { setVistaActual(key); setMostrarArchivadas(false); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                vistaActual === key && !mostrarArchivadas
                  ? 'bg-cyan-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
          <button
            onClick={() => setMostrarGrafo(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white transition"
          >
            <GitBranch size={14} />
            <span className="hidden sm:inline">Grafo</span>
          </button>
          <button
            onClick={() => setMostrarRecordatorios(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white transition"
          >
            <Bell size={14} />
            <span className="hidden sm:inline">Recordatorios</span>
          </button>
          <button
            onClick={() => { setMostrarArchivadas(!mostrarArchivadas); setVistaActual('biblioteca'); }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
              mostrarArchivadas
                ? 'bg-amber-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Archive size={14} />
            <span className="hidden sm:inline">Archivo</span>
            {notasArchivadas.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10">
                {notasArchivadas.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMostrarBusquedaAvanzada(true)}
            className="p-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition"
            title="Búsqueda avanzada (Ctrl+F)"
          >
            <Filter size={15} />
          </button>
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
      {vistaActual === 'dashboard' && !mostrarArchivadas && (
        <Dashboard notas={notas} onVerNota={handleVerNota} />
      )}

      {/* Vista Calendario */}
      {vistaActual === 'calendario' && !mostrarArchivadas && (
        <VistaCalendario notas={todasLasNotas} onVerNota={handleVerNota} />
      )}

      {/* Vista Biblioteca / Archivo */}
      {(vistaActual === 'biblioteca' || mostrarArchivadas) && (
        <>
          {/* Búsqueda y acciones */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder={mostrarArchivadas ? "Buscar en archivo..." : "Buscar por título, contenido o tags..."}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-10 pr-20 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/80 text-[10px] text-slate-500 font-mono border border-slate-700/50">
                <Keyboard size={9} />
                Ctrl+K
              </kbd>
            </div>

            {!mostrarArchivadas && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVistaGrid(!vistaGrid)}
                  className="p-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition"
                >
                  {vistaGrid ? <List size={16} /> : <LayoutGrid size={16} />}
                </button>
                <div className="relative group">
                  <button className="p-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition">
                    {ordenamiento === 'recientes' && <Clock size={16} />}
                    {ordenamiento === 'alfabetico' && <ArrowDownAZ size={16} />}
                    {ordenamiento === 'favoritos' && <Star size={16} />}
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-44 bg-slate-900/95 border border-slate-800/50 rounded-xl shadow-xl backdrop-blur-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-30">
                    <button onClick={() => setOrdenamiento('recientes')} className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-slate-800/50 transition rounded-t-xl ${ordenamiento === 'recientes' ? 'text-cyan-400' : 'text-slate-400'}`}>
                      <Clock size={13} /> Más recientes
                    </button>
                    <button onClick={() => setOrdenamiento('alfabetico')} className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-slate-800/50 transition ${ordenamiento === 'alfabetico' ? 'text-cyan-400' : 'text-slate-400'}`}>
                      <ArrowDownAZ size={13} /> Alfabético
                    </button>
                    <button onClick={() => setOrdenamiento('favoritos')} className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-slate-800/50 transition rounded-b-xl ${ordenamiento === 'favoritos' ? 'text-cyan-400' : 'text-slate-400'}`}>
                      <Star size={13} /> Favoritos
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setMostrarPlantillas(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition shadow-lg whitespace-nowrap"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Nueva Nota</span>
                </button>
              </div>
            )}
          </div>

          {/* Filtros por categoría */}
          {!mostrarArchivadas && (
            <CategoryFilter
              categoriaActiva={filtroCategoria}
              onCategoriaChange={setFiltroCategoria}
              contadorNotas={contadorNotas}
            />
          )}

          {/* Banner de archivo */}
          {mostrarArchivadas && (
            <div className="bg-amber-950/20 border border-amber-800/30 rounded-xl p-4 flex items-center gap-3">
              <Archive size={18} className="text-amber-400" />
              <div>
                <p className="text-sm font-medium text-amber-300">Modo Archivo</p>
                <p className="text-xs text-amber-400/60">
                  {notasArchivadas.length} notas archivadas
                </p>
              </div>
            </div>
          )}

          {/* Contenido */}
          {cargando ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={32} className="text-cyan-400 animate-spin mb-4" />
              <p className="text-slate-400 text-sm">Cargando...</p>
            </div>
          ) : notasFiltradas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 border border-slate-800/50 rounded-2xl backdrop-blur-sm">
              <Inbox size={40} className="text-slate-600 mb-4" />
              <p className="text-slate-400 text-lg font-medium mb-2">
                {mostrarArchivadas ? 'No hay notas archivadas' : 'No hay notas'}
              </p>
              <p className="text-slate-500 text-sm">
                {busqueda ? `Sin resultados para "${busqueda}"` : 'Tu biblioteca está vacía'}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  {notasFiltradas.length} {notasFiltradas.length === 1 ? 'nota' : 'notas'}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-slate-600">
                  <Sparkles size={10} />
                  <span>Ctrl+N nueva · Ctrl+K buscar · Ctrl+F avanzado</span>
                </div>
              </div>

              <div className={vistaGrid ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'flex flex-col gap-3'}>
                {notasFiltradas.map((nota) => (
                  <NotaCard
                    key={nota.id}
                    nota={nota}
                    compacto={!vistaGrid}
                    onVer={handleVerNota}
                    onEditar={handleEditar}
                    onEliminar={handleEliminar}
                    onToggleFavorito={handleToggleFavorito}
                    onTogglePin={handleTogglePin}
                    onDuplicar={handleDuplicar}
                    onArchivar={handleToggleArchivado}
                    onHistorial={() => handleVerHistorial(nota)}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Vista de lectura */}
      {mostrarVistaLectura && (
        <VistaLectura
          nota={mostrarVistaLectura}
          todasLasNotas={todasLasNotas}
          onCerrar={() => setMostrarVistaLectura(null)}
          onEditar={() => handleEditar(mostrarVistaLectura)}
          onExportar={() => handleExportarNota(mostrarVistaLectura)}
          onVerNota={handleVerNota}
          onToggleArchivado={handleToggleArchivado}
          onPresentacion={() => {
            setMostrarPresentacion(mostrarVistaLectura);
            setMostrarVistaLectura(null);
          }}
        />
      )}

      {/* Modo presentación */}
      {mostrarPresentacion && (
        <ModoPresentacion
          nota={mostrarPresentacion}
          todasLasNotas={todasLasNotas}
          onCerrar={() => setMostrarPresentacion(null)}
        />
      )}

      {/* Formulario */}
      {mostrarFormulario && (
        <NotaForm
          nota={modalFormulario}
          onGuardar={handleGuardar}
          onCancelar={() => { setMostrarFormulario(false); setModalFormulario(null); }}
        />
      )}

      {/* Búsqueda rápida */}
      <BusquedaRapida
        abierto={mostrarBusquedaRapida}
        notas={notas}
        onCerrar={() => setMostrarBusquedaRapida(false)}
        onSeleccionar={handleVerNota}
      />

      {/* Búsqueda avanzada */}
      <BusquedaAvanzada
        abierto={mostrarBusquedaAvanzada}
        notas={todasLasNotas}
        onSeleccionar={(nota) => {
          setMostrarBusquedaAvanzada(false);
          handleVerNota(nota);
        }}
        onCerrar={() => setMostrarBusquedaAvanzada(false)}
      />

      {/* Plantillas */}
      <PlantillaSelector
        abierto={mostrarPlantillas}
        onSeleccionar={(plantilla) => {
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
        }}
        onCerrar={() => setMostrarPlantillas(false)}
      />

      {/* Grafo de conocimiento */}
      {mostrarGrafo && (
        <GrafoConocimiento
          notas={todasLasNotas}
          onVerNota={handleVerNota}
          onCerrar={() => setMostrarGrafo(false)}
        />
      )}

      {/* Historial de versiones */}
      {mostrarHistorial && (
        <VersionHistory
          abierto={!!mostrarHistorial}
          nota={mostrarHistorial}
          versiones={versiones}
          onRevertir={handleRevertirVersion}
          onCerrar={() => setMostrarHistorial(null)}
        />
      )}

      {/* Recordatorios */}
      <SistemaRecordatorios
        abierto={mostrarRecordatorios}
        notas={notas}
        onVerNota={handleVerNota}
        onCerrar={() => setMostrarRecordatorios(false)}
      />

      {/* Confirmación */}
      <ConfirmDialog
        abierto={!!confirmarEliminacion}
        titulo="Eliminar nota"
        mensaje="¿Eliminar esta nota? Esta acción no se puede deshacer."
        textoConfirmar="Eliminar"
        variant="danger"
        onConfirmar={confirmarEliminar}
        onCancelar={() => setConfirmarEliminacion(null)}
      />
    </div>
  );
}

export default function TutorialesLibrary() {
  return (
    <ToastProvider>
      <BibliotecaContent />
    </ToastProvider>
  );
}
