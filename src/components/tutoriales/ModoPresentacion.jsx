/**
 * ModoPresentacion.jsx
 * 
 * Convierte una nota en una presentación de slides.
 * Divide el contenido por headings (##) y muestra cada sección como slide.
 * Navegación con teclado y controles.
 */
import { useState, useMemo, useEffect } from 'react';
import {
  Presentation,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize,
  Minimize,
} from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

/**
 * Divide el contenido en slides por headings
 */
const dividirEnSlides = (contenido) => {
  if (!contenido) return [{ titulo: 'Sin contenido', contenido: '' }];

  // Dividir por headings de nivel 2 (##)
  const partes = contenido.split(/^## /m);
  
  if (partes.length === 1) {
    // Si no hay ##, dividir por headings de nivel 1 (#)
    const partesH1 = contenido.split(/^# /m);
    if (partesH1.length > 1) {
      return partesH1.slice(1).map((parte, index) => {
        const lineas = parte.split('\n');
        const titulo = lineas[0].trim();
        const contenido = lineas.slice(1).join('\n').trim();
        return { titulo, contenido: `## ${titulo}\n\n${contenido}` };
      });
    }
    // Si no hay headings, devolver todo como un slide
    return [{ titulo: 'Contenido', contenido }];
  }

  // Extraer título del primer bloque (antes del primer ##)
  const primerBloque = partes[0].trim();
  const tituloPrincipal = primerBloque.split('\n')[0].replace(/^#+\s*/, '').trim();
  
  const slides = [];
  
  // Slide de título
  if (tituloPrincipal) {
    slides.push({
      titulo: tituloPrincipal,
      contenido: `# ${tituloPrincipal}`,
    });
  }

  // Slides por cada sección ##
  partes.slice(1).forEach(parte => {
    const lineas = parte.split('\n');
    const titulo = lineas[0].trim();
    const contenido = lineas.slice(1).join('\n').trim();
    slides.push({
      titulo,
      contenido: `## ${titulo}\n\n${contenido}`,
    });
  });

  return slides;
};

/**
 * Modo presentación
 * 
 * @param {Object} props
 * @param {Object} props.nota - Nota a presentar
 * @param {Array} props.todasLasNotas - Lista de notas (para backlinks)
 * @param {Function} props.onCerrar - Callback al cerrar
 */
export default function ModoPresentacion({ nota, todasLasNotas = [], onCerrar }) {
  const [slideActual, setSlideActual] = useState(0);
  const [pantallaCompleta, setPantallaCompleta] = useState(false);

  const slides = useMemo(() => dividirEnSlides(nota?.contenido || ''), [nota]);

  // Navegación con teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setSlideActual(prev => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSlideActual(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        onCerrar();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, onCerrar]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setPantallaCompleta(true);
    } else {
      document.exitFullscreen();
      setPantallaCompleta(false);
    }
  };

  if (!nota) return null;

  const slide = slides[slideActual];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
      {/* Header minimalista */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between bg-gradient-to-b from-slate-950/90 to-transparent">
        <div className="flex items-center gap-3">
          <Presentation size={18} className="text-cyan-400" />
          <span className="text-sm text-slate-400">{nota.titulo}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            {slideActual + 1} / {slides.length}
          </span>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            {pantallaCompleta ? <Minimize size={14} /> : <Maximize size={14} />}
          </button>
          <button
            onClick={onCerrar}
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Slide */}
      <div className="flex-1 flex items-center justify-center p-8 pt-20 pb-20">
        <div className="max-w-4xl w-full">
          <div className="bg-slate-900/30 border border-slate-800/30 rounded-3xl p-12 shadow-2xl">
            <MarkdownRenderer
              contenido={slide.contenido}
              notas={todasLasNotas}
              className="text-xl leading-relaxed [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-8 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-6 [&_p]:text-lg [&_li]:text-lg [&_code]:text-base [&_pre]:text-base"
            />
          </div>
        </div>
      </div>

      {/* Controles de navegación */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-center bg-gradient-to-t from-slate-950/90 to-transparent">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSlideActual(prev => Math.max(prev - 1, 0))}
            disabled={slideActual === 0}
            className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Indicadores de slides */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setSlideActual(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === slideActual
                    ? 'bg-cyan-400 w-6'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setSlideActual(prev => Math.min(prev + 1, slides.length - 1))}
            disabled={slideActual === slides.length - 1}
            className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Atajos de teclado */}
      <div className="absolute bottom-4 right-4 text-[10px] text-slate-600 flex items-center gap-3">
        <span>← → navegar</span>
        <span>F fullscreen</span>
        <span>Esc salir</span>
      </div>
    </div>
  );
}
