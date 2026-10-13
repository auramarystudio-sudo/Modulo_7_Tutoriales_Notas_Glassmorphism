/**
 * Tutoriales.jsx
 * 
 * Página principal del módulo de Tutoriales y Notas.
 * Experiencia cinemática con:
 * - Visualizer de fondo animado
 * - Mascota guía (Pixel)
 * - Títulos estilo lyric video
 * - Transiciones suaves
 */
import { useState, useEffect } from 'react';
import {
  BookOpen,
  Sparkles,
  Zap,
} from 'lucide-react';
import TutorialesLibrary from '../components/tutoriales/TutorialesLibrary';
import VisualizerBackground from '../components/tutoriales/VisualizerBackground';
import MascotaGuia from '../components/tutoriales/MascotaGuia';
import LyricTitle, { LyricSubtitle } from '../components/tutoriales/LyricTitle';

/**
 * Pantalla de intro cinemática
 */
function IntroScreen({ onComplete }) {
  const [fase, setFase] = useState(0); // 0: logo, 1: título, 2: subtítulo, 3: done

  useEffect(() => {
    const timers = [
      setTimeout(() => setFase(1), 300),
      setTimeout(() => setFase(2), 1200),
      setTimeout(() => setFase(3), 2800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (fase === 3) {
      const timer = setTimeout(onComplete, 800);
      return () => clearTimeout(timer);
    }
  }, [fase, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950">
      <VisualizerBackground />
      
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Logo animado */}
        <div
          className={`
            transition-all duration-1000 ease-out
            ${fase >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
          `}
        >
          <div className="relative">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-950/50 to-purple-950/50 border border-cyan-800/30 animate-glow-pulse">
              <BookOpen size={48} className="text-cyan-400" />
            </div>
            {/* Partículas alrededor del logo */}
            <div className="absolute inset-0 -m-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-cyan-400 animate-ping"
                  style={{
                    top: `${50 + Math.sin(i * 1.05) * 45}%`,
                    left: `${50 + Math.cos(i * 1.05) * 45}%`,
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: '2s',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Título lyric video */}
        <div
          className={`
            transition-all duration-700 ease-out text-center
            ${fase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
        >
          <LyricTitle
            text="Tutoriales y Notas"
            delay={0}
            className="text-4xl sm:text-5xl font-bold"
          />
        </div>

        {/* Subtítulo typing */}
        <div
          className={`
            transition-all duration-700 ease-out
            ${fase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          <LyricSubtitle
            text="Tu base de conocimiento personal, con vida propia ✨"
            delay={0}
            className="text-base sm:text-lg text-center"
          />
        </div>

        {/* Barra de progreso sutil */}
        <div
          className={`
            w-48 h-0.5 bg-slate-800 rounded-full overflow-hidden transition-opacity duration-500
            ${fase >= 2 ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full transition-all duration-[2500ms] ease-out"
            style={{ width: fase >= 3 ? '100%' : '0%' }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Página principal de Tutoriales
 */
export default function Tutoriales() {
  const [introCompleta, setIntroCompleta] = useState(false);
  const [contextoMascota, setContextoMascota] = useState('bienvenida');
  const [totalNotas, setTotalNotas] = useState(0);

  // Después de la intro, cambiar contexto de la mascota
  useEffect(() => {
    if (introCompleta) {
      const timer = setTimeout(() => setContextoMascota('idle'), 3000);
      return () => clearTimeout(timer);
    }
  }, [introCompleta]);

  if (!introCompleta) {
    return <IntroScreen onComplete={() => setIntroCompleta(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 relative overflow-hidden">
      {/* Fondo visualizer */}
      <VisualizerBackground />

      {/* Gradiente overlay para legibilidad */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/60 pointer-events-none z-[1]" />

      {/* Contenido principal */}
      <div className="relative z-10">
        {/* Header flotante */}
        <header className="border-b border-slate-800/30 bg-slate-900/70 backdrop-blur-xl sticky top-0 z-40 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-950/50 to-purple-950/50 border border-cyan-800/30 animate-glow-pulse">
                    <BookOpen size={22} className="text-cyan-400" />
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift">
                    Tutoriales y Notas
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <Sparkles size={10} className="text-cyan-400/60" />
                    <span>Markdown · Mermaid · Grafo · Presentación · Recordatorios</span>
                  </p>
                </div>
              </div>
              
              {/* Atajos visibles */}
              <div className="hidden lg:flex items-center gap-3 text-[10px] text-slate-600">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800/60 text-slate-500 font-mono border border-slate-700/30">Ctrl+K</kbd>
                  Buscar
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800/60 text-slate-500 font-mono border border-slate-700/30">Ctrl+F</kbd>
                  Avanzada
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800/60 text-slate-500 font-mono border border-slate-700/30">Ctrl+N</kbd>
                  Nueva
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TutorialesLibrary onContextChange={setContextoMascota} onNotasChange={setTotalNotas} />
        </main>
      </div>

      {/* Mascota guía */}
      <MascotaGuia contexto={contextoMascota} totalNotas={totalNotas} />
    </div>
  );
}
