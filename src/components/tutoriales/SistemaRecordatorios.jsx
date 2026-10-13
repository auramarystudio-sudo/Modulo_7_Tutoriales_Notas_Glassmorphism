/**
 * SistemaRecordatorios.jsx
 * 
 * Panel de recordatorios para programar revisiones de notas.
 * Los recordatorios se guardan en localStorage y muestran notificaciones.
 */
import { useState, useEffect } from 'react';
import {
  Bell,
  X,
  Plus,
  Trash2,
  Calendar,
  Clock,
  CheckCircle,
} from 'lucide-react';

const STORAGE_KEY = 'tutoriales_recordatorios';

/**
 * Cargar recordatorios desde localStorage
 */
const cargarRecordatorios = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

/**
 * Guardar recordatorios en localStorage
 */
const guardarRecordatorios = (recordatorios) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recordatorios));
  } catch (e) {
    console.error('Error al guardar recordatorios:', e);
  }
};

/**
 * Panel de recordatorios
 * 
 * @param {Object} props
 * @param {boolean} props.abierto - Si el panel está visible
 * @param {Array} props.notas - Lista de notas
 * @param {Function} props.onVerNota - Callback al ver una nota
 * @param {Function} props.onCerrar - Callback al cerrar
 */
export default function SistemaRecordatorios({ abierto, notas = [], onVerNota, onCerrar }) {
  const [recordatorios, setRecordatorios] = useState(cargarRecordatorios());
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nuevoRecordatorio, setNuevoRecordatorio] = useState({
    notaId: '',
    fecha: '',
    hora: '09:00',
    mensaje: '',
  });

  // Guardar cuando cambian los recordatorios
  useEffect(() => {
    guardarRecordatorios(recordatorios);
  }, [recordatorios]);

  // Verificar recordatorios vencidos cada minuto
  useEffect(() => {
    const verificar = () => {
      const ahora = new Date();
      let actualizado = false;

      recordatorios.forEach((rec, index) => {
        if (!rec.completado && !rec.notificado) {
          const fechaRec = new Date(`${rec.fecha}T${rec.hora}`);
          if (ahora >= fechaRec) {
            recordatorios[index] = { ...rec, notificado: true };
            actualizado = true;
            
            // Mostrar notificación del browser
            if ('Notification' in window && Notification.permission === 'granted') {
              const nota = notas.find(n => n.id === rec.notaId);
              new Notification('📚 Recordatorio de Tutoriales', {
                body: rec.mensaje || `Es hora de revisar: ${nota?.titulo || 'una nota'}`,
                icon: '/favicon.ico',
              });
            }
          }
        }
      });

      if (actualizado) {
        setRecordatorios([...recordatorios]);
      }
    };

    // Pedir permiso de notificaciones
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    verificar();
    const interval = setInterval(verificar, 60000); // Cada minuto
    return () => clearInterval(interval);
  }, [recordatorios, notas]);

  const agregarRecordatorio = () => {
    if (!nuevoRecordatorio.notaId || !nuevoRecordatorio.fecha) {
      alert('Selecciona una nota y una fecha');
      return;
    }

    const recordatorio = {
      id: Date.now().toString(),
      ...nuevoRecordatorio,
      completado: false,
      notificado: false,
      creado: new Date().toISOString(),
    };

    setRecordatorios([...recordatorios, recordatorio]);
    setNuevoRecordatorio({ notaId: '', fecha: '', hora: '09:00', mensaje: '' });
    setMostrarForm(false);
  };

  const marcarCompletado = (id) => {
    setRecordatorios(recordatorios.map(r =>
      r.id === id ? { ...r, completado: true } : r
    ));
  };

  const eliminarRecordatorio = (id) => {
    setRecordatorios(recordatorios.filter(r => r.id !== id));
  };

  const recordatoriosPendientes = recordatorios.filter(r => !r.completado);
  const recordatoriosCompletados = recordatorios.filter(r => r.completado);

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCerrar} />

      <div className="relative w-full max-w-2xl max-h-[80vh] bg-slate-900/95 border border-slate-800/50 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-950/50 border border-amber-800/30">
              <Bell size={18} className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Recordatorios</h2>
              <p className="text-xs text-slate-500">
                {recordatoriosPendientes.length} pendientes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMostrarForm(!mostrarForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition"
            >
              <Plus size={14} />
              Nuevo
            </button>
            <button
              onClick={onCerrar}
              className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Formulario */}
        {mostrarForm && (
          <div className="p-5 border-b border-slate-800/50 space-y-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Nota</label>
              <select
                value={nuevoRecordatorio.notaId}
                onChange={(e) => setNuevoRecordatorio({ ...nuevoRecordatorio, notaId: e.target.value })}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500/50 transition"
              >
                <option value="">Seleccionar nota...</option>
                {notas.map(nota => (
                  <option key={nota.id} value={nota.id}>{nota.titulo}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Fecha</label>
                <input
                  type="date"
                  value={nuevoRecordatorio.fecha}
                  onChange={(e) => setNuevoRecordatorio({ ...nuevoRecordatorio, fecha: e.target.value })}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500/50 transition"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Hora</label>
                <input
                  type="time"
                  value={nuevoRecordatorio.hora}
                  onChange={(e) => setNuevoRecordatorio({ ...nuevoRecordatorio, hora: e.target.value })}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500/50 transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Mensaje (opcional)</label>
              <input
                type="text"
                value={nuevoRecordatorio.mensaje}
                onChange={(e) => setNuevoRecordatorio({ ...nuevoRecordatorio, mensaje: e.target.value })}
                placeholder="Ej: Revisar antes de la reunión"
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition"
              />
            </div>
            <button
              onClick={agregarRecordatorio}
              className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition"
            >
              Agregar Recordatorio
            </button>
          </div>
        )}

        {/* Lista de recordatorios */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Pendientes */}
          {recordatoriosPendientes.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Pendientes
              </h3>
              <div className="space-y-2">
                {recordatoriosPendientes
                  .sort((a, b) => new Date(`${a.fecha}T${a.hora}`) - new Date(`${b.fecha}T${b.hora}`))
                  .map(rec => {
                    const nota = notas.find(n => n.id === rec.notaId);
                    const fechaRec = new Date(`${rec.fecha}T${rec.hora}`);
                    const esVencido = new Date() > fechaRec;

                    return (
                      <div
                        key={rec.id}
                        className={`p-3 rounded-xl border transition ${
                          esVencido
                            ? 'bg-red-950/20 border-red-800/30'
                            : 'bg-slate-800/20 border-slate-800/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <button
                              onClick={() => nota && onVerNota(nota)}
                              className="text-sm font-medium text-slate-200 hover:text-cyan-400 transition text-left truncate block"
                            >
                              {nota?.titulo || 'Nota eliminada'}
                            </button>
                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Calendar size={10} />
                                {fechaRec.toLocaleDateString('es-ES')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={10} />
                                {rec.hora}
                              </span>
                              {esVencido && (
                                <span className="text-red-400 font-medium">Vencido</span>
                              )}
                            </div>
                            {rec.mensaje && (
                              <p className="text-xs text-slate-400 mt-1">{rec.mensaje}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => marcarCompletado(rec.id)}
                              className="p-1.5 rounded-lg hover:bg-green-950/50 text-slate-500 hover:text-green-400 transition"
                              title="Marcar como completado"
                            >
                              <CheckCircle size={14} />
                            </button>
                            <button
                              onClick={() => eliminarRecordatorio(rec.id)}
                              className="p-1.5 rounded-lg hover:bg-red-950/50 text-slate-500 hover:text-red-400 transition"
                              title="Eliminar"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Completados */}
          {recordatoriosCompletados.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Completados
              </h3>
              <div className="space-y-2">
                {recordatoriosCompletados.map(rec => {
                  const nota = notas.find(n => n.id === rec.notaId);
                  return (
                    <div
                      key={rec.id}
                      className="p-3 rounded-xl bg-slate-800/10 border border-slate-800/20 opacity-60"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-400 line-through truncate">
                            {nota?.titulo || 'Nota eliminada'}
                          </p>
                        </div>
                        <button
                          onClick={() => eliminarRecordatorio(rec.id)}
                          className="p-1.5 rounded-lg hover:bg-red-950/50 text-slate-500 hover:text-red-400 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {recordatorios.length === 0 && (
            <div className="text-center py-12">
              <Bell size={40} className="text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500 text-sm">No hay recordatorios</p>
              <p className="text-slate-600 text-xs mt-1">
                Crea uno para revisar tus notas periódicamente
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
