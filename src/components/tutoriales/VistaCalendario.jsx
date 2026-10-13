/**
 * VistaCalendario.jsx
 * 
 * Vista de calendario que muestra las notas organizadas por fecha de creación.
 * Permite navegar entre meses y ver qué días tienen notas.
 */
import { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Eye,
} from 'lucide-react';

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

/**
 * Vista de calendario de notas
 * 
 * @param {Object} props
 * @param {Array} props.notas - Lista de notas (incluye archivadas)
 * @param {Function} props.onVerNota - Callback al hacer clic en una nota
 */
export default function VistaCalendario({ notas = [], onVerNota }) {
  const [fechaActual, setFechaActual] = useState(new Date());
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);

  const anio = fechaActual.getFullYear();
  const mes = fechaActual.getMonth();

  // Notas agrupadas por día
  const notasPorDia = useMemo(() => {
    const agrupado = {};
    notas.forEach(nota => {
      const fecha = new Date(nota.fecha_creacion);
      const key = `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}`;
      if (!agrupado[key]) agrupado[key] = [];
      agrupado[key].push(nota);
    });
    return agrupado;
  }, [notas]);

  // Generar días del mes
  const diasDelMes = useMemo(() => {
    const primerDia = new Date(anio, mes, 1);
    const ultimoDia = new Date(anio, mes + 1, 0);
    const dias = [];

    // Días vacíos antes del primer día (lunes = 0)
    let primerDiaSemana = primerDia.getDay();
    if (primerDiaSemana === 0) primerDiaSemana = 7; // Domingo = 7
    for (let i = 1; i < primerDiaSemana; i++) {
      dias.push(null);
    }

    // Días del mes
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      const fecha = new Date(anio, mes, dia);
      const key = `${anio}-${mes}-${dia}`;
      dias.push({
        dia,
        fecha,
        key,
        notas: notasPorDia[key] || [],
        esHoy: new Date().toDateString() === fecha.toDateString(),
      });
    }

    return dias;
  }, [anio, mes, notasPorDia]);

  // Navegar entre meses
  const mesAnterior = () => {
    setFechaActual(new Date(anio, mes - 1, 1));
    setDiaSeleccionado(null);
  };

  const mesSiguiente = () => {
    setFechaActual(new Date(anio, mes + 1, 1));
    setDiaSeleccionado(null);
  };

  const irAHoy = () => {
    setFechaActual(new Date());
    setDiaSeleccionado(null);
  };

  // Notas del día seleccionado
  const notasDelDia = diaSeleccionado
    ? (notasPorDia[diaSeleccionado.key] || [])
    : [];

  // Total de notas este mes
  const notasEsteMes = diasDelMes
    .filter(d => d && d.notas.length > 0)
    .reduce((sum, d) => sum + d.notas.length, 0);

  return (
    <div className="space-y-6">
      {/* Header del calendario */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-950/50 border border-indigo-800/30">
              <Calendar size={18} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                {MESES[mes]} {anio}
              </h2>
              <p className="text-xs text-slate-500">
                {notasEsteMes} {notasEsteMes === 1 ? 'nota' : 'notas'} este mes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={irAHoy}
              className="px-3 py-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-medium transition"
            >
              Hoy
            </button>
            <button
              onClick={mesAnterior}
              className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={mesSiguiente}
              className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Grid de días de la semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DIAS_SEMANA.map(dia => (
            <div key={dia} className="text-center text-xs font-medium text-slate-500 py-2">
              {dia}
            </div>
          ))}
        </div>

        {/* Grid de días del mes */}
        <div className="grid grid-cols-7 gap-1">
          {diasDelMes.map((dia, index) => {
            if (!dia) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const tieneNotas = dia.notas.length > 0;
            const esSeleccionado = diaSeleccionado?.key === dia.key;

            return (
              <button
                key={dia.key}
                onClick={() => setDiaSeleccionado(tieneNotas ? dia : null)}
                className={`
                  aspect-square rounded-xl flex flex-col items-center justify-center relative transition
                  ${dia.esHoy ? 'ring-1 ring-cyan-500/50' : ''}
                  ${esSeleccionado
                    ? 'bg-indigo-950/50 border border-indigo-700/50'
                    : tieneNotas
                      ? 'bg-slate-800/30 hover:bg-slate-800/50 border border-slate-800/30'
                      : 'hover:bg-slate-800/20'
                  }
                `}
              >
                <span className={`text-sm font-medium ${
                  dia.esHoy ? 'text-cyan-400' : tieneNotas ? 'text-slate-200' : 'text-slate-500'
                }`}>
                  {dia.dia}
                </span>
                {tieneNotas && (
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {dia.notas.length > 3 ? (
                      <span className="text-[8px] text-indigo-400 font-bold">
                        {dia.notas.length}
                      </span>
                    ) : (
                      dia.notas.slice(0, 3).map((_, i) => (
                        <div key={i} className="w-1 h-1 rounded-full bg-indigo-400" />
                      ))
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notas del día seleccionado */}
      {diaSeleccionado && notasDelDia.length > 0 && (
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-5 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
            <Calendar size={14} className="text-indigo-400" />
            Notas del {diaSeleccionado.dia} de {MESES[mes]}
          </h3>
          <div className="space-y-2">
            {notasDelDia.map(nota => (
              <button
                key={nota.id}
                onClick={() => onVerNota(nota)}
                className="flex items-center gap-3 w-full text-left p-3 rounded-xl bg-slate-800/20 hover:bg-slate-800/40 border border-slate-800/30 hover:border-slate-700/50 transition group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 group-hover:text-cyan-400 truncate transition">
                    {nota.titulo}
                  </p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {nota.contenido?.replace(/[#*`>\[\]]/g, '').substring(0, 60)}...
                  </p>
                </div>
                <Eye size={14} className="text-slate-600 group-hover:text-cyan-400 transition shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {diaSeleccionado && notasDelDia.length === 0 && (
        <div className="bg-slate-900/30 border border-slate-800/30 rounded-2xl p-8 text-center">
          <p className="text-slate-500 text-sm">
            No hay notas creadas el {diaSeleccionado.dia} de {MESES[mes]}
          </p>
        </div>
      )}
    </div>
  );
}
