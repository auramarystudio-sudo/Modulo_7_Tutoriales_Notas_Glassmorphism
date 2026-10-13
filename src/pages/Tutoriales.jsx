/**
 * Tutoriales.jsx
 * 
 * Página principal del módulo de Tutoriales y Notas.
 * Aplica estrictamente el estilo "Glassmorphism Dark Pro v3.0".
 * 
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
} from 'lucide-react';
import TutorialesLibrary from '../components/tutoriales/TutorialesLibrary';
import VisualizerBackground from '../components/tutoriales/VisualizerBackground';
import MascotaGuia from '../components/tutoriales/MascotaGuia';
import LyricTitle, { LyricSubtitle } from '../components/tutoriales/LyricTitle';
import { COMPONENTS, BACKGROUNDS, BORDERS, TYPOGRAPHY, EFFECTS } from '../utils/designTokens';

/**
 * Pantalla de intro cinemática
 */
function IntroScreen({ onComplete }) {
  const [fase, setFase] = useState(0);

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
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${BACKGROUNDS.main}`}>
      <VisualizerBackground />
      
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Logo animado */}
        <div className={`transition-all duration-1000 ease-out ${fase >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          <div className="relative">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/50 to-purple-950/50 border border-cyan-800/30 shadow-2xl animate-glow-pulse">
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
        <div className={`transition-all duration-700 ease-out text-center ${fase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <LyricTitle
            text="Tutoriales y Notas"
            delay={0}
            className="text-4xl sm:text-5xl font-bold"
          />
        </div>

        {/* Subtítulo typing */}
        <div className={`transition-all duration-700 ease-out ${fase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <LyricSubtitle
            text="Tu base de conocimiento personal, con vida propia ✨"
            delay={0}
            className="text-base sm:text-lg text-center"
          />
        </div>

        {/* Barra de progreso sutil */}
        <div className={`w-48 h-0.5 bg-slate-800/50 rounded-full overflow-hidden transition-opacity duration-500 ${fase >= 2 ? 'opacity-100' : 'opacity-0'}`}>
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
 * Layout principal según Glassmorphism Dark Pro v3.0
 */
export default function Tutoriales() {
  const [introCompleta, setIntroCompleta] = useState(false);
  const [contextoMascota, setContextoMascota] = useState('bienvenida');
  const [totalNotas, setTotalNotas] = useState(0);

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
    <div className={`${COMPONENTS.mainLayout} relative overflow-hidden`}>
      {/* Fondo visualizer */}
      <VisualizerBackground />

      {/* Gradiente overlay para legibilidad */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/60 pointer-events-none z-[1]" />

      {/* Contenido principal */}
      <div className="relative z-10">
        {/* Header — Glassmorphism Dark Pro v3.0 */}
        <header className={`${COMPONENTS.header}`}>
          <div className={`${COMPONENTS.headerContent} flex items-center justify-between`}>
            {/* Logo + Título */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              </div>
              <div>
                <h1 className={`${TYPOGRAPHY.titleGradient}`}>
                  Tutoriales y Notas
                </h1>
                <p className={`${TYPOGRAPHY.tertiary} flex items-center gap-1 mt-0.5`}>
                  <Sparkles size={10} className="text-cyan-400/60" />
                  <span>Markdown · Mermaid · Grafo · Presentación · Recordatorios</span>
                </p>
              </div>
            </div>
            
            {/* Atajos de teclado */}
            <div className="hidden lg:flex items-center gap-3">
              {[
                { key: 'Ctrl+K', label: 'Buscar' },
                { key: 'Ctrl+F', label: 'Avanzada' },
                { key: 'Ctrl+N', label: 'Nueva' },
              ].map(({ key, label }) => (
                <span key={key} className="flex items-center gap-1.5 text-xs text-slate-500">
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800/50 text-slate-400 font-mono text-[10px] border border-slate-700/50">
                    {key}
                  </kbd>
                  <span className="text-slate-600">{label}</span>
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Contenido Principal — max-w-[1800px] */}
        <main className="max-w-[1800px] mx-auto px-6 py-6">
          <TutorialesLibrary onContextChange={setContextoMascota} onNotasChange={setTotalNotas} />
        </main>
      </div>

      {/* Mascota guía */}
      <MascotaGuia contexto={contextoMascota} totalNotas={totalNotas} />
    </div>
  );
}
