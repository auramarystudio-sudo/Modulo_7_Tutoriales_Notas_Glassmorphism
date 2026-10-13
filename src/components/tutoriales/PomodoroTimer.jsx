/**
 * PomodoroTimer.jsx
 * 
 * Timer Pomodoro integrado para sesiones de estudio profundo.
 * Incluye sesiones de 25 min trabajo + 5 min descanso.
 * Se puede activar desde la vista de lectura.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  X,
  Coffee,
  Brain,
  Volume2,
  VolumeX,
} from 'lucide-react';

const TIEMPO_TRABAJO = 25 * 60; // 25 minutos en segundos
const TIEMPO_DESCANSO = 5 * 60; // 5 minutos
const TIEMPO_DESCANSO_LARGO = 15 * 60; // 15 min cada 4 sesiones

/**
 * Timer Pomodoro
 * 
 * @param {Object} props
 * @param {boolean} props.abierto - Si el timer está visible
 * @param {Function} props.onCerrar - Callback al cerrar
 */
export default function PomodoroTimer({ abierto, onCerrar }) {
  const [tiempoRestante, setTiempoRestante] = useState(TIEMPO_TRABAJO);
  const [activo, setActivo] = useState(false);
  const [esDescanso, setEsDescanso] = useState(false);
  const [sesionesCompletadas, setSesionesCompletadas] = useState(0);
  const [conSonido, setConSonido] = useState(true);
  const intervalRef = useRef(null);

  // Formatear tiempo en MM:SS
  const formatearTiempo = (segundos) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Progreso del timer (0 a 100)
  const progreso = esDescanso
    ? ((TIEMPO_DESCANSO - tiempoRestante) / TIEMPO_DESCANSO) * 100
    : ((TIEMPO_TRABAJO - tiempoRestante) / TIEMPO_TRABAJO) * 100;

  // Reproducir sonido al completar
  const reproducirSonido = useCallback(() => {
    if (!conSonido) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      gain.gain.value = 0.3;
      osc.start();
      setTimeout(() => {
        osc.stop();
        ctx.close();
      }, 300);
    } catch (e) {
      // Silenciar errores de audio
    }
  }, [conSonido]);

  // Timer tick
  useEffect(() => {
    if (activo && tiempoRestante > 0) {
      intervalRef.current = setInterval(() => {
        setTiempoRestante(prev => prev - 1);
      }, 1000);
    } else if (tiempoRestante === 0 && activo) {
      // Timer completado
      reproducirSonido();
      
      if (esDescanso) {
        // Descanso terminado, volver a trabajo
        setEsDescanso(false);
        setTiempoRestante(TIEMPO_TRABAJO);
      } else {
        // Trabajo terminado, ir a descanso
        const nuevasSesiones = sesionesCompletadas + 1;
        setSesionesCompletadas(nuevasSesiones);
        
        if (nuevasSesiones % 4 === 0) {
          setTiempoRestante(TIEMPO_DESCANSO_LARGO);
        } else {
          setTiempoRestante(TIEMPO_DESCANSO);
        }
        setEsDescanso(true);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activo, tiempoRestante, esDescanso, sesionesCompletadas, reproducirSonido]);

  // Reset
  const handleReset = () => {
    setActivo(false);
    setEsDescanso(false);
    setTiempoRestante(TIEMPO_TRABAJO);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // Toggle play/pause
  const handleToggle = () => {
    setActivo(!activo);
  };

  if (!abierto) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="bg-slate-900/95 border border-slate-800/50 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden w-72">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/50">
          <div className="flex items-center gap-2">
            <Timer size={14} className={esDescanso ? 'text-green-400' : 'text-cyan-400'} />
            <span className="text-xs font-semibold text-slate-200">
              {esDescanso ? '☕ Descanso' : '🧠 Enfoque'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setConSonido(!conSonido)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition"
              title={conSonido ? 'Silenciar' : 'Activar sonido'}
            >
              {conSonido ? <Volume2 size={12} /> : <VolumeX size={12} />}
            </button>
            <button
              onClick={onCerrar}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition"
            >
              <X size={12} />
            </button>
          </div>
        </div>

        {/* Timer display */}
        <div className="p-6 flex flex-col items-center">
          {/* Círculo de progreso */}
          <div className="relative w-36 h-36 mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="45"
                fill="none"
                stroke="rgba(51,65,85,0.3)"
                strokeWidth="4"
              />
              <circle
                cx="50" cy="50" r="45"
                fill="none"
                stroke={esDescanso ? '#4ade80' : '#06b6d4'}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progreso / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-100 font-mono">
                {formatearTiempo(tiempoRestante)}
              </span>
              <span className="text-[10px] text-slate-500 mt-1">
                {esDescanso ? 'Relájate' : 'Concéntrate'}
              </span>
            </div>
          </div>

          {/* Controles */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition"
              title="Reiniciar"
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={handleToggle}
              className={`p-4 rounded-xl text-white transition shadow-lg ${
                activo
                  ? 'bg-red-600 hover:bg-red-500'
                  : esDescanso
                    ? 'bg-green-600 hover:bg-green-500'
                    : 'bg-cyan-600 hover:bg-cyan-500'
              }`}
            >
              {activo ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <div className="p-2.5 rounded-xl bg-slate-800/50 text-slate-400">
              <span className="text-xs font-bold">{sesionesCompletadas}</span>
            </div>
          </div>

          {/* Sesiones */}
          <div className="flex items-center gap-1.5 mt-4">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition ${
                  i <= (sesionesCompletadas % 4 || (sesionesCompletadas > 0 ? 4 : 0))
                    ? 'bg-cyan-400'
                    : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
