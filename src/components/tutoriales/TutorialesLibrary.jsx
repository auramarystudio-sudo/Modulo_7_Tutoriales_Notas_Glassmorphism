/**
 * TutorialesLibrary.jsx
 * 
 * Componente principal de la biblioteca de tutoriales y notas.
 * Gestiona el estado de notas, filtros, búsqueda y modales.
 * Carga datos desde PocketBase (o fallback local).
 */
import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Plus,
  BookOpen,
  Loader2,
  Inbox,
} from 'lucide-react';
import {
  getAllNotas,
  createNota,
  updateNota,
  deleteNota,
  toggleFavorito,
} from '../../lib/localStore';
import NotaCard from './NotaCard';
import NotaDetail from './NotaDetail';
import NotaForm from './NotaForm';
import CategoryFilter from './CategoryFilter';

/**
 * Biblioteca de tutoriales y notas
 * Componente principal con búsqueda, filtros, grid y CRUD
 */
export default function TutorialesLibrary() {
  // Estado principal
  const [notas, setNotas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [modalDetalle, setModalDetalle] = useState(null); // Nota seleccionada para ver detalle
  const [modalFormulario, setModalFormulario] = useState(null); // Nota a editar (null = nueva)
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  /**
   * Cargar notas desde el almacenamiento
   */
  const cargarNotas = async () => {
    setCargando(true);
    try {
      const datos = await getAllNotas('-fecha_creacion');
      setNotas(datos);
    } catch (error) {
      console.error('Error al cargar notas:', error);
    } finally {
      setCargando(false);
    }
  };

  // Cargar notas al montar el componente
  useEffect(() => {
    cargarNotas();
  }, []);

  /**
   * Filtrar notas por categoría y búsqueda
   * La búsqueda incluye título, contenido y tags
   */
  const notasFiltradas = useMemo(() => {
    let resultado = [...notas];

    // Filtrar por categoría
    if (filtroCategoria !== 'todas') {
      resultado = resultado.filter(nota => nota.categoria === filtroCategoria);
    }

    // Filtrar por búsqueda (incluye título, contenido y tags)
    if (busqueda.trim()) {
      const termino = busqueda.toLowerCase().trim();
      resultado = resultado.filter(nota => {
        // Buscar en título
        if (nota.titulo.toLowerCase().includes(termino)) return true;
        // Buscar en contenido (texto plano)
        if (nota.contenido.toLowerCase().includes(termino)) return true;
        // Buscar en tags
        if (nota.tags && nota.tags.some(tag => tag.toLowerCase().includes(termino))) return true;
        return false;
      });
    }

    return resultado;
  }, [notas, filtroCategoria, busqueda]);

  /**
   * Contador de notas por categoría (para los filtros)
   */
  const contadorNotas = useMemo(() => {
    const contadores = {};
    notas.forEach(nota => {
      contadores[nota.categoria] = (contadores[nota.categoria] || 0) + 1;
    });
    return contadores;
  }, [notas]);

  /**
   * Crear nueva nota
   */
  const handleGuardar = async (data) => {
    try {
      if (modalFormulario) {
        // Editar nota existente
        await updateNota(modalFormulario.id, data);
      } else {
        // Crear nueva nota
        await createNota(data);
      }
      // Recargar notas
      await cargarNotas();
      setMostrarFormulario(false);
      setModalFormulario(null);
    } catch (error) {
      console.error('Error al guardar:', error);
      throw error;
    }
  };

  /**
   * Eliminar nota
   */
  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta nota?')) return;
    
    try {
      await deleteNota(id);
      await cargarNotas();
      setModalDetalle(null);
    } catch (error) {
      console.error('Error al eliminar:', error);
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
      console.error('Error al toggle favorito:', error);
    }
  };

  /**
   * Abrir formulario para editar
   */
  const handleEditar = (nota) => {
    setModalDetalle(null);
    setModalFormulario(nota);
    setMostrarFormulario(true);
  };

  /**
   * Abrir formulario para nueva nota
   */
  const handleNuevaNota = () => {
    setModalFormulario(null);
    setMostrarFormulario(true);
  };

  /**
   * Cerrar formulario
   */
  const handleCerrarFormulario = () => {
    setMostrarFormulario(false);
    setModalFormulario(null);
  };

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda y botón nueva nota */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Campo de búsqueda */}
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por título, contenido o tags..."
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition"
          />
        </div>

        {/* Botón nueva nota */}
        <button
          onClick={handleNuevaNota}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition shadow-lg whitespace-nowrap"
        >
          <Plus size={16} />
          Nueva Nota / Tutorial
        </button>
      </div>

      {/* Filtros por categoría */}
      <CategoryFilter
        categoriaActiva={filtroCategoria}
        onCategoriaChange={setFiltroCategoria}
        contadorNotas={contadorNotas}
      />

      {/* Contenido principal */}
      {cargando ? (
        /* Estado de carga */
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={32} className="text-cyan-400 animate-spin mb-4" />
          <p className="text-slate-400 text-sm">Cargando tutoriales...</p>
        </div>
      ) : notasFiltradas.length === 0 ? (
        /* Estado vacío */
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 border border-slate-800/50 rounded-2xl backdrop-blur-sm">
          {busqueda || filtroCategoria !== 'todas' ? (
            <>
              <Search size={40} className="text-slate-600 mb-4" />
              <p className="text-slate-400 text-lg font-medium mb-2">
                No se encontraron resultados
              </p>
              <p className="text-slate-500 text-sm text-center max-w-md">
                {busqueda
                  ? `No hay notas que coincidan con "${busqueda}"`
                  : 'No hay notas en esta categoría'}
              </p>
              <button
                onClick={() => {
                  setBusqueda('');
                  setFiltroCategoria('todas');
                }}
                className="mt-4 text-sm text-cyan-400 hover:text-cyan-300 transition"
              >
                Limpiar filtros
              </button>
            </>
          ) : (
            <>
              <Inbox size={40} className="text-slate-600 mb-4" />
              <p className="text-slate-400 text-lg font-medium mb-2">
                Tu biblioteca está vacía
              </p>
              <p className="text-slate-500 text-sm text-center max-w-md mb-4">
                Comienza creando tu primera nota o tutorial con formato Markdown
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
        /* Grid de notas */
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {notasFiltradas.length} {notasFiltradas.length === 1 ? 'nota' : 'notas'}
              {busqueda && ` para "${busqueda}"`}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {notasFiltradas.map((nota) => (
              <NotaCard
                key={nota.id}
                nota={nota}
                onVer={(n) => setModalDetalle(n)}
                onEditar={handleEditar}
                onEliminar={handleEliminar}
                onToggleFavorito={handleToggleFavorito}
              />
            ))}
          </div>
        </>
      )}

      {/* Modal de detalle */}
      {modalDetalle && (
        <NotaDetail
          nota={modalDetalle}
          onCerrar={() => setModalDetalle(null)}
          onEditar={handleEditar}
          onEliminar={handleEliminar}
        />
      )}

      {/* Modal de formulario (crear/editar) */}
      {mostrarFormulario && (
        <NotaForm
          nota={modalFormulario}
          onGuardar={handleGuardar}
          onCancelar={handleCerrarFormulario}
        />
      )}
    </div>
  );
}
