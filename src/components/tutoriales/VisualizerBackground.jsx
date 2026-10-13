/**
 * VisualizerBackground.jsx
 * 
 * Fondo animado tipo visualizer de música abstracto.
 * Ondas que pulsan, partículas que flotan, gradientes que respiran.
 * Simula un ecualizador visual que late con "ritmo" propio.
 */
import { useEffect, useRef, useState } from 'react';

/**
 * Fondo visualizer con canvas animado
 */
export default function VisualizerBackground() {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resize();
    window.addEventListener('resize', resize);

    // Partículas flotantes
    const particulas = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
      hue: Math.random() * 60 + 170, // cyan-purple range
    }));

    // Ondas del visualizer
    const dibujarOndas = (time) => {
      const numOndas = 4;
      
      for (let i = 0; i < numOndas; i++) {
        const progress = i / numOndas;
        const amplitude = 30 + Math.sin(time * 0.001 + i) * 15;
        const frequency = 0.003 + i * 0.001;
        const speed = time * (0.0003 + i * 0.0001);
        const yBase = height * (0.5 + progress * 0.3);
        
        ctx.beginPath();
        ctx.moveTo(0, yBase);
        
        for (let x = 0; x <= width; x += 4) {
          const y = yBase + 
            Math.sin(x * frequency + speed) * amplitude +
            Math.sin(x * frequency * 2 + speed * 1.5) * (amplitude * 0.3);
          ctx.lineTo(x, y);
        }
        
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        
        const gradient = ctx.createLinearGradient(0, yBase - amplitude, 0, height);
        const alpha = 0.03 + Math.sin(time * 0.001 + i * 2) * 0.02;
        gradient.addColorStop(0, `hsla(${190 + i * 20}, 80%, 60%, ${alpha})`);
        gradient.addColorStop(1, `hsla(${270 + i * 10}, 70%, 30%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    };

    // Barras del ecualizador (sutil, en la parte inferior)
    const dibujarEcualizador = (time) => {
      const numBars = 64;
      const barWidth = width / numBars;
      const maxHeight = 80;
      
      for (let i = 0; i < numBars; i++) {
        const x = i * barWidth;
        // Simular frecuencias con múltiples senoides
        const h = maxHeight * (
          0.1 +
          Math.abs(Math.sin(time * 0.003 + i * 0.3)) * 0.4 +
          Math.abs(Math.sin(time * 0.005 + i * 0.15)) * 0.3 +
          Math.abs(Math.cos(time * 0.002 + i * 0.5)) * 0.2
        );
        
        const gradient = ctx.createLinearGradient(x, height - h, x, height);
        const hue = 190 + (i / numBars) * 80;
        gradient.addColorStop(0, `hsla(${hue}, 80%, 60%, 0.15)`);
        gradient.addColorStop(1, `hsla(${hue}, 80%, 40%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x + 1, height - h, barWidth - 2, h);
      }
    };

    // Pulsos circulares (latido)
    const dibujarPulsos = (time) => {
      const numPulsos = 3;
      const centerX = width * 0.5;
      const centerY = height * 0.4;
      
      for (let i = 0; i < numPulsos; i++) {
        const phase = (time * 0.001 + i * 2) % 6;
        const radius = phase * 100;
        const alpha = Math.max(0, 0.08 - phase * 0.013);
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${200 + i * 30}, 80%, 60%, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    };

    // Partículas
    const dibujarParticulas = (time) => {
      particulas.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Wrap around
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        
        const flicker = 0.5 + Math.sin(time * 0.003 + p.x * 0.01) * 0.5;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.opacity * flicker})`;
        ctx.fill();
        
        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.opacity * flicker * 0.2})`;
        ctx.fill();
      });
    };

    // Loop de animación
    const animate = (timestamp) => {
      timeRef.current = timestamp;
      
      ctx.clearRect(0, 0, width, height);
      
      dibujarPulsos(timestamp);
      dibujarOndas(timestamp);
      dibujarEcualizador(timestamp);
      dibujarParticulas(timestamp);
      
      animFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate(0);

    return () => {
      window.removeEventListener('resize', resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
