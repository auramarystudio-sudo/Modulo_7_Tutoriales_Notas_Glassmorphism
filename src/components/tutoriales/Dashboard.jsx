/**
 * Dashboard.jsx
 * 
 * Panel de estadísticas de la biblioteca de notas.
 * Incluye gráfico de actividad, distribución por categoría,
 * racha de creación y nota del día.
 */
import { useMemo } from 'react';
import {
  BookOpen,
  Star,
  Tag,
  TrendingUp,
  Flame,
  Calendar,
  Sparkles,
  Eye,
  ArrowRight,
} from 'lucide-react';
import { CATEGORIAS } from './CategoryFilter';

/**
 * Calcula la racha de días consecutivos creando notas
 */
const calcularRacha = (notas) => {
  if (notas.length === 0) return 0;
  
  const fechas = notas
    .map(n => new Date(n.fecha_creacion).toDateString())
    .filter((v, i, a) => a.indexOf(v) === i) // únicas
    .map(f => new Date(f))
    .sort((a, b) => b - a);
  
  let racha = 0;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < fechas.length; i++) {
    const fechaEsperada = new Date(hoy);
    fechaEsperada.setDate(fechaEsperada.getDate() - i);
    
    if (fechas[i].toDateString() === fechaEsperada.toDateString()) {
      racha++;
    } else {
      break;
    }
  }
  
  return racha;
};

/**
 * Genera datos de actividad de los últimos 30 días
 */
const generarActividad = (notas) => {
  const dias = [];
  const hoy = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const fecha = new Date(hoy);
    fecha.setDate(fecha.getDate() - i);
    const fechaStr = fecha.toDateString();
    
    const count = notas.filter(n => 
      new Date(n.fecha_creacion).toDateString() === fechaStr
    ).length;
    
    dias.push({
      fecha: fecha,
      dia: fecha.getDate(),
      count,
      label: fecha.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
    });
  }
  
  return dias;
};

/**
 * Obtiene la "nota del día" (rotación diaria basada en la fecha)
 */
const getNotaDelDia = (notas) => {
  if (notas.length === 0) return null;
  const hoy = new Date();
  const indice = (hoy.getFullYear() * 366 + hoy.getMonth() * 31 + hoy.getDate()) % notas.length;
  return notas[indice];
};

/**
 * Dashboard de estadísticas
 * 
 * @param {Object} props
 * @param {Array} props.notas - Lista de todas las notas
 * @param {Function} props.onVerNota - Callback al ver una nota
 */
export default function Dashboard({ notas, onVerNota }) {
  const stats = useMemo(() => {
    const totalNotas = notas.length;
    const totalFavoritos = notas.filter(n => n.es_favorito).length;
    const totalTags = new Set(notas.flatMap(n => n.tags || [])).size;
    const racha = calcularRacha(notas);
    const actividad = generarActividad(notas);
    const notaDelDia = getNotaDelDia(notas);
    
    // Distribución por categoría
    const porCategoria = {};
    Object.keys(CATEGORIAS).forEach(key => {
      if (key !== 'todas') {
        porCategoria[key] = notas.filter(n => n.categoria === key).length;
      }
    });
    
    // Palabras totales
    const totalPalabras = notas.reduce((sum, n) => sum + (n.contenido?.split(/\s+/).length || 0), 0);
    
    return { totalNotas, totalFavoritos, totalTags, racha, actividad, notaDelDia, porCategoria, totalPalabras };
  }, [notas]);

  // Nivel de intensidad para el gráfico de actividad
  const getIntensidad = (count) => {
    if (count === 0) return 'bg-slate-800/40';
    if (count === 1) return 'bg-cyan-900/60';
    if (count === 2) return 'bg-cyan-700/70';
    if (count >= 3) return 'bg-cyan-500/80';
    return 'bg-cyan-400';
  };

  const notaDelDia = stats.notaDelDia;

  return (
    <div className="space-y-6">
      {/* Nota del día */}
      {notaDelDia && (
        <div className="bg-gradient-to-r from-cyan-950/40 to-purple-950/40 border border-cyan-800/30 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Nota del día
            </span>
          </div>
          <button
            onClick={() => onVerNota(notaDelDia)}
            className="text-left group w-full"
          >
            <h3 className="text-lg font-semibold text-slate-100 group-hover:text-cyan-400 transition mb-1">
              {notaDelDia.titulo}
            </h3>
            <p className="text-sm text-slate-400 line-clamp-2">
              {notaDelDia.contenido?.replace(/[#*`>\[\]]/g, '').substring(0, 120)}...
            </p>
            <span className="inline-flex items-center gap-1 text-xs text-cyan-400 mt-2 group-hover:gap-2 transition-all">
              Leer ahora <ArrowRight size={12} />
            </span>
          </button>
        </div>
      )}

      {/* Stats cards — Glassmorphism Dark Pro v3.0 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:border-slate-700/50 transition-all duration-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg">
              <BookOpen size={18} className="text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-100">{stats.totalNotas}</p>
          <p className="text-xs text-slate-500 mt-1">Notas totales</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:border-slate-700/50 transition-all duration-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-lg">
              <Star size={18} className="text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-100">{stats.totalFavoritos}</p>
          <p className="text-xs text-slate-500 mt-1">Favoritas</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:border-slate-700/50 transition-all duration-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Tag size={18} className="text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-100">{stats.totalTags}</p>
          <p className="text-xs text-slate-500 mt-1">Tags únicos</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:border-slate-700/50 transition-all duration-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
              <Flame size={18} className="text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-100">{stats.racha}</p>
          <p className="text-xs text-slate-500 mt-1">Días de racha 🔥</p>
        </div>
      </div>

      {/* Gráfico de actividad + Distribución por categoría */}
      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Gráfico de actividad (últimos 30 días) */}
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
              <TrendingUp size={16} className="text-white" />
            </div>
            <h3 className="text-sm font-semibold text-slate-300">Actividad (últimos 30 días)</h3>
          </div>
          
          {/* Grid de actividad */}
          <div className="flex gap-1 overflow-x-auto pb-2">
            {stats.actividad.map((dia, index) => (
              <div key={index} className="flex flex-col items-center gap-1 min-w-[18px]">
                <div
                  className={`w-4 h-4 rounded-sm ${getIntensidad(dia.count)} transition hover:scale-125 cursor-default`}
                  title={`${dia.label}: ${dia.count} nota${dia.count !== 1 ? 's' : ''}`}
                />
              </div>
            ))}
          </div>
          
          {/* Leyenda */}
          <div className="flex items-center gap-2 mt-3 justify-end">
            <span className="text-[10px] text-slate-600">Menos</span>
            <div className="w-3 h-3 rounded-sm bg-slate-800/40" />
            <div className="w-3 h-3 rounded-sm bg-cyan-900/60" />
            <div className="w-3 h-3 rounded-sm bg-cyan-700/70" />
            <div className="w-3 h-3 rounded-sm bg-cyan-500/80" />
            <span className="text-[10px] text-slate-600">Más</span>
          </div>
        </div>

        {/* Distribución por categoría */}
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Calendar size={16} className="text-white" />
            </div>
            <h3 className="text-sm font-semibold text-slate-300">Por categoría</h3>
          </div>
          
          <div className="space-y-3">
            {Object.entries(stats.porCategoria)
              .filter(([, count]) => count > 0)
              .sort(([, a], [, b]) => b - a)
              .map(([key, count]) => {
                const cat = CATEGORIAS[key];
                const porcentaje = stats.totalNotas > 0 ? (count / stats.totalNotas) * 100 : 0;
                
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400 flex items-center gap-1.5">
                        <cat.icon size={11} />
                        {cat.label}
                      </span>
                      <span className="text-xs text-slate-500">{count}</span>
                    </div>
                    <div className="h-1.5 bg-slate-800/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          key === 'instalacion' ? 'bg-blue-500/70' :
                          key === 'optimizacion' ? 'bg-green-500/70' :
                          key === 'prompts' ? 'bg-purple-500/70' :
                          key === 'comandos' ? 'bg-cyan-500/70' :
                          key === 'troubleshooting' ? 'bg-red-500/70' :
                          'bg-amber-500/70'
                        }`}
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Info adicional */}
      <div className="bg-slate-900/30 border border-slate-800/30 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <BookOpen size={11} />
            {stats.totalPalabras.toLocaleString()} palabras totales
          </span>
          <span className="flex items-center gap-1">
            <Eye size={11} />
            ~{Math.ceil(stats.totalPalabras / 200)} min de lectura total
          </span>
        </div>
      </div>
    </div>
  );
}
