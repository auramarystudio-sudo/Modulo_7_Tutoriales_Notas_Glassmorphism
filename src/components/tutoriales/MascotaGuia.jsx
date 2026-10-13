/**
 * MascotaGuia.jsx
 * 
 * Personaje guía animado (mini-historia con personaje).
 * Un pequeño robot/espíritu que acompaña al usuario,
 * reacciona a sus acciones y da consejos con diálogos animados.
 */
import { useState, useEffect } from 'react';
import { X, MessageCircle } from 'lucide-react';

// Mensajes de la mascota según contexto
const MENSAJES = {
  bienvenida: [
    "¡Hey! Soy Pixel, tu guía digital ✨",
    "¿Listo para explorar tu biblioteca?",
    "Tip: Presiona Ctrl+K para buscar rápido",
  ],
  nuevaNota: [
    "¡Genial! Una nueva idea en camino 🚀",
    "Elige una plantilla o empieza desde cero",
    "Recuerda: puedes usar [[backlinks]] para conectar notas",
  ],
  leyendo: [
    "Modo lectura activado 📖",
    "Tip: Los [[enlaces]] conectan tus notas entre sí",
    "¿Sabías que puedes exportar como .md?",
  ],
  buscando: [
    "¿Qué estás buscando? 🔍",
    "Tip: Usa Ctrl+F para búsqueda avanzada",
    "Puedes buscar por tags, contenido o categoría",
  ],
  idle: [
    "¡Tu biblioteca te espera! 💡",
    "¿Necesitas inspiración? Prueba las plantillas",
    "Las notas fijadas siempre están arriba 📌",
    "El grafo muestra cómo se conectan tus ideas",
  ],
  logros: [
    "¡Wow! Ya tienes varias notas 🎉",
    "Tu racha de creación sigue fuerte 🔥",
    "¿Has probado el modo presentación?",
  ],
};

/**
 * Mascota guía animada
 */
export default function MascotaGuia({ contexto = 'idle', totalNotas = 0 }) {
  const [visible, setVisible] = useState(true);
  const [mensajeActual, setMensajeActual] = useState(0);
  const [mostrarDialogo, setMostrarDialogo] = useState(false);
  const [animacion, setAnimacion] = useState('idle'); // idle, happy, thinking, wave

  // Cambiar mensaje periódicamente
  useEffect(() => {
    const mensajes = MENSAJES[contexto] || MENSAJES.idle;
    const interval = setInterval(() => {
      setMensajeActual(prev => (prev + 1) % mensajes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [contexto]);

  // Animación según contexto
  useEffect(() => {
    if (contexto === 'nuevaNota') setAnimacion('happy');
    else if (contexto === 'buscando') setAnimacion('thinking');
    else if (contexto === 'bienvenida') setAnimacion('wave');
    else setAnimacion('idle');
  }, [contexto]);

  // Mostrar diálogo al cambiar contexto
  useEffect(() => {
    setMostrarDialogo(true);
    setMensajeActual(0);
    const timeout = setTimeout(() => setMostrarDialogo(false), 6000);
    return () => clearTimeout(timeout);
  }, [contexto]);

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="fixed bottom-6 right-6 z-30 p-3 rounded-full bg-slate-800/80 border border-slate-700/50 hover:border-cyan-500/50 text-cyan-400 hover:text-cyan-300 transition shadow-xl backdrop-blur-sm group"
        title="Mostrar a Pixel"
      >
        <MessageCircle size={18} />
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
      </button>
    );
  }

  const mensajes = MENSAJES[contexto] || MENSAJES.idle;
  const mensaje = mensajes[mensajeActual];

  return (
    <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-2 pointer-events-none">
      {/* Diálogo */}
      {mostrarDialogo && (
        <div className="pointer-events-auto animate-[slideUp_0.4s_ease-out] max-w-[240px]">
          <div className="bg-slate-900/95 border border-cyan-800/30 rounded-2xl rounded-br-sm px-4 py-3 backdrop-blur-xl shadow-xl relative">
            <p className="text-xs text-slate-200 leading-relaxed">
              {mensaje}
            </p>
            {/* Indicadores de mensajes */}
            <div className="flex gap-1 mt-2">
              {mensajes.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all ${
                    i === mensajeActual ? 'w-4 bg-cyan-400' : 'w-1 bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mascota (Robot SVG animado) */}
      <div className="pointer-events-auto relative">
        <div className={`
          w-14 h-14 relative
          ${animacion === 'idle' ? 'animate-[float_3s_ease-in-out_infinite]' : ''}
          ${animacion === 'happy' ? 'animate-[bounce_0.6s_ease-in-out_infinite]' : ''}
          ${animacion === 'thinking' ? 'animate-[wobble_2s_ease-in-out_infinite]' : ''}
          ${animacion === 'wave' ? 'animate-[wave_1s_ease-in-out_3]' : ''}
        `}>
          {/* Cuerpo del robot */}
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            {/* Antena */}
            <line x1="50" y1="15" x2="50" y2="5" stroke="#06b6d4" strokeWidth="2" />
            <circle cx="50" cy="4" r="3" fill="#06b6d4" className="animate-pulse" />
            
            {/* Cabeza */}
            <rect x="25" y="15" width="50" height="40" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            <rect x="25" y="15" width="50" height="40" rx="10" fill="url(#headGradient)" />
            
            {/* Ojos */}
            <g className={animacion === 'thinking' ? 'animate-[blink_3s_infinite]' : ''}>
              <circle cx="38" cy="32" r="6" fill="#0f172a" />
              <circle cx="62" cy="32" r="6" fill="#0f172a" />
              <circle cx="38" cy="32" r="4" fill="#06b6d4" className="animate-pulse" />
              <circle cx="62" cy="32" r="4" fill="#a855f7" className="animate-pulse" />
              {/* Brillo en ojos */}
              <circle cx="36" cy="30" r="1.5" fill="white" opacity="0.8" />
              <circle cx="60" cy="30" r="1.5" fill="white" opacity="0.8" />
            </g>
            
            {/* Boca */}
            {animacion === 'happy' ? (
              <path d="M 38 45 Q 50 52 62 45" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <rect x="40" y="44" width="20" height="3" rx="1.5" fill="#06b6d4" opacity="0.7" />
            )}
            
            {/* Cuerpo */}
            <rect x="30" y="58" width="40" height="30" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            <rect x="30" y="58" width="40" height="30" rx="8" fill="url(#bodyGradient)" />
            
            {/* Indicador de energía en el pecho */}
            <circle cx="50" cy="72" r="5" fill="#0f172a" />
            <circle cx="50" cy="72" r="3" fill="#06b6d4" className="animate-pulse" />
            
            {/* Brazos */}
            <rect x="18" y="62" width="10" height="20" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            <rect x="72" y="62" width="10" height="20" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            
            {/* Gradientes */}
            <defs>
              <linearGradient id="headGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(6,182,212,0.1)" />
                <stop offset="100%" stopColor="rgba(168,85,247,0.05)" />
              </linearGradient>
              <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(168,85,247,0.05)" />
                <stop offset="100%" stopColor="rgba(6,182,212,0.1)" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Aura/glow alrededor */}
          <div className="absolute inset-0 rounded-full bg-cyan-400/10 blur-xl animate-pulse" />
        </div>

        {/* Botón cerrar */}
        <button
          onClick={() => {
            setVisible(false);
            setMostrarDialogo(false);
          }}
          className="absolute -top-1 -right-1 p-1 rounded-full bg-slate-800 border border-slate-700/50 text-slate-500 hover:text-white hover:border-cyan-500/50 transition opacity-0 group-hover:opacity-100"
          title="Ocultar a Pixel"
        >
          <X size={10} />
        </button>
      </div>
    </div>
  );
}
