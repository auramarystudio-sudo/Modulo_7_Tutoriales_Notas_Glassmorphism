/**
 * LyricTitle.jsx
 * 
 * Componente de título con animación cinemática tipo lyric video.
 * Las letras aparecen una por una con efectos de glow, fade y slide.
 */
import { useState, useEffect } from 'react';

/**
 * Título animado estilo lyric video
 * 
 * @param {Object} props
 * @param {string} props.text - El texto a animar
 * @param {string} props.className - Clases CSS adicionales
 * @param {number} props.delay - Delay inicial en ms
 * @param {boolean} props.loop - Si debe repetirse
 * @param {string} props.gradientFrom - Color inicial del gradiente
 * @param {string} props.gradientTo - Color final del gradiente
 */
export default function LyricTitle({ 
  text, 
  className = '',
  delay = 0,
  loop = false,
  gradientFrom = 'from-cyan-400',
  gradientTo = 'to-purple-400',
}) {
  const [visibleChars, setVisibleChars] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setStarted(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    const interval = setInterval(() => {
      setVisibleChars(prev => {
        if (prev >= text.length) {
          if (loop) {
            setTimeout(() => setVisibleChars(0), 2000);
            return prev;
          }
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [started, text.length, loop]);

  return (
    <h1 className={`relative inline-block ${className}`}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className={`
            inline-block transition-all duration-500
            bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent
            ${index < visibleChars 
              ? 'opacity-100 translate-y-0 blur-0' 
              : 'opacity-0 translate-y-4 blur-sm'
            }
          `}
          style={{
            transitionDelay: `${index * 30}ms`,
            textShadow: index < visibleChars ? '0 0 20px rgba(6, 182, 212, 0.3)' : 'none',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
      
      {/* Cursor parpadeante */}
      {visibleChars < text.length && started && (
        <span className="inline-block w-0.5 h-full bg-cyan-400 animate-pulse ml-0.5 align-middle" />
      )}
    </h1>
  );
}

/**
 * Subtítulo con efecto de typing
 */
export function LyricSubtitle({ text, delay = 500, className = '' }) {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= text.length) {
          setDisplayText(text.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
          setTimeout(() => setShowCursor(false), 1500);
        }
      }, 40);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay]);

  return (
    <p className={`text-slate-400 ${className}`}>
      {displayText}
      {showCursor && (
        <span className="inline-block w-0.5 h-4 bg-slate-400 animate-pulse ml-0.5 align-middle" />
      )}
    </p>
  );
}
