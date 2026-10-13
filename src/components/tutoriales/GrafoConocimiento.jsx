/**
 * GrafoConocimiento.jsx
 * 
 * Visualización interactiva del grafo de conexiones entre notas.
 * Muestra las notas como nodos y los backlinks como aristas.
 * Implementación con Canvas para mejor performance.
 */
import { useState, useEffect, useRef, useMemo } from 'react';
import {
  GitBranch,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
} from 'lucide-react';

/**
 * Extrae los enlaces [[...]] del contenido
 */
const extraerEnlaces = (contenido) => {
  if (!contenido) return [];
  const regex = /\[\[([^\]]+)\]\]/g;
  const enlaces = [];
  let match;
  while ((match = regex.exec(contenido)) !== null) {
    enlaces.push(match[1].trim());
  }
  return enlaces;
};

/**
 * Grafo de conocimiento interactivo
 * 
 * @param {Object} props
 * @param {Array} props.notas - Lista de todas las notas
 * @param {Function} props.onVerNota - Callback al hacer clic en una nota
 * @param {Function} props.onCerrar - Callback al cerrar
 */
export default function GrafoConocimiento({ notas = [], onVerNota, onCerrar }) {
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [nodoSeleccionado, setNodoSeleccionado] = useState(null);
  const [arrastrando, setArrastrando] = useState(false);
  const [ultimaPosicion, setUltimaPosicion] = useState({ x: 0, y: 0 });

  // Construir el grafo
  const grafo = useMemo(() => {
    const nodos = notas.map((nota, index) => ({
      id: nota.id,
      titulo: nota.titulo,
      x: Math.cos(index * 2.4) * 200 + 400,
      y: Math.sin(index * 2.4) * 200 + 300,
      vx: 0,
      vy: 0,
      nota,
    }));

    const aristas = [];
    notas.forEach(nota => {
      const enlaces = extraerEnlaces(nota.contenido);
      enlaces.forEach(enlace => {
        const notaDestino = notas.find(n => 
          n.titulo.toLowerCase().trim() === enlace.toLowerCase().trim()
        );
        if (notaDestino) {
          aristas.push({
            from: nota.id,
            to: notaDestino.id,
          });
        }
      });
    });

    return { nodos, aristas };
  }, [notas]);

  // Simulación de fuerzas (simplificada)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrame;

    const simular = () => {
      // Aplicar fuerzas
      grafo.nodos.forEach(nodo => {
        // Repulsión entre nodos
        grafo.nodos.forEach(otro => {
          if (nodo.id !== otro.id) {
            const dx = nodo.x - otro.x;
            const dy = nodo.y - otro.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0) {
              const fuerza = 500 / (dist * dist);
              nodo.vx += (dx / dist) * fuerza;
              nodo.vy += (dy / dist) * fuerza;
            }
          }
        });

        // Atracción en aristas
        grafo.aristas.forEach(arista => {
          if (arista.from === nodo.id || arista.to === nodo.id) {
            const otro = grafo.nodos.find(n => 
              n.id === (arista.from === nodo.id ? arista.to : arista.from)
            );
            if (otro) {
              const dx = otro.x - nodo.x;
              const dy = otro.y - nodo.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist > 0) {
                const fuerza = (dist - 150) * 0.01;
                nodo.vx += (dx / dist) * fuerza;
                nodo.vy += (dy / dist) * fuerza;
              }
            }
          }
        });

        // Aplicar velocidad con amortiguación
        nodo.x += nodo.vx;
        nodo.y += nodo.vy;
        nodo.vx *= 0.9;
        nodo.vy *= 0.9;
      });

      // Dibujar
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(offset.x, offset.y);
      ctx.scale(zoom, zoom);

      // Dibujar aristas
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
      ctx.lineWidth = 1;
      grafo.aristas.forEach(arista => {
        const from = grafo.nodos.find(n => n.id === arista.from);
        const to = grafo.nodos.find(n => n.id === arista.to);
        if (from && to) {
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.stroke();
        }
      });

      // Dibujar nodos
      grafo.nodos.forEach(nodo => {
        const esSeleccionado = nodoSeleccionado === nodo.id;
        const radio = esSeleccionado ? 12 : 8;

        ctx.fillStyle = esSeleccionado ? '#06b6d4' : '#64748b';
        ctx.beginPath();
        ctx.arc(nodo.x, nodo.y, radio, 0, Math.PI * 2);
        ctx.fill();

        // Label
        if (zoom > 0.7) {
          ctx.fillStyle = '#e2e8f0';
          ctx.font = `${12 / zoom}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(nodo.titulo.substring(0, 20), nodo.x, nodo.y + radio + 15);
        }
      });

      ctx.restore();
      animationFrame = requestAnimationFrame(simular);
    };

    simular();

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [grafo, zoom, offset, nodoSeleccionado]);

  // Manejar clicks en el canvas
  const handleClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x) / zoom;
    const y = (e.clientY - rect.top - offset.y) / zoom;

    const nodoClickeado = grafo.nodos.find(nodo => {
      const dx = nodo.x - x;
      const dy = nodo.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 15;
    });

    if (nodoClickeado) {
      setNodoSeleccionado(nodoClickeado.id);
    }
  };

  // Manejar drag
  const handleMouseDown = (e) => {
    setArrastrando(true);
    setUltimaPosicion({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (arrastrando) {
      const dx = e.clientX - ultimaPosicion.x;
      const dy = e.clientY - ultimaPosicion.y;
      setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setUltimaPosicion({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setArrastrando(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-800/50 bg-slate-900/95 backdrop-blur-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-950/50 border border-purple-800/30">
            <GitBranch size={20} className="text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Grafo de Conocimiento</h2>
            <p className="text-xs text-slate-500">
              {grafo.nodos.length} notas · {grafo.aristas.length} conexiones
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(z => Math.min(z * 1.2, 3))}
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(z / 1.2, 0.3))}
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }}
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <Maximize2 size={16} />
          </button>
          <button
            onClick={onCerrar}
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          width={window.innerWidth}
          height={window.innerHeight - 80}
          onClick={handleClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full h-full cursor-move"
        />

        {/* Info de nodo seleccionado */}
        {nodoSeleccionado && (
          <div className="absolute bottom-6 left-6 bg-slate-900/95 border border-slate-800/50 rounded-xl p-4 backdrop-blur-xl max-w-sm">
            <h3 className="text-sm font-semibold text-slate-200 mb-2">
              {grafo.nodos.find(n => n.id === nodoSeleccionado)?.titulo}
            </h3>
            <button
              onClick={() => {
                const nota = grafo.nodos.find(n => n.id === nodoSeleccionado)?.nota;
                if (nota) onVerNota(nota);
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 transition"
            >
              Abrir nota →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
