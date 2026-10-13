/**
 * MermaidRenderer.jsx
 * 
 * Componente para renderizar diagramas Mermaid en el contenido Markdown.
 * Soporta diagramas de flujo, secuencias, clases, estados, etc.
 */
import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

// Inicializar mermaid con tema oscuro
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'ui-sans-serif, system-ui, sans-serif',
});

/**
 * Componente para renderizar un diagrama Mermaid
 * 
 * @param {Object} props
 * @param {string} props.codigo - Código del diagrama Mermaid
 */
export default function MermaidRenderer({ codigo }) {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);
  const [svg, setSvg] = useState('');

  useEffect(() => {
    const renderDiagram = async () => {
      if (!codigo) return;

      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg: renderedSvg } = await mermaid.render(id, codigo);
        setSvg(renderedSvg);
        setError(null);
      } catch (err) {
        console.error('Error renderizando Mermaid:', err);
        setError(err.message || 'Error al renderizar el diagrama');
        setSvg('');
      }
    };

    renderDiagram();
  }, [codigo]);

  if (error) {
    return (
      <div className="bg-red-950/20 border border-red-800/30 rounded-lg p-4 my-4">
        <p className="text-red-400 text-sm font-medium mb-2">Error en diagrama Mermaid:</p>
        <pre className="text-red-300/70 text-xs font-mono overflow-x-auto">{error}</pre>
        <pre className="text-slate-500 text-xs font-mono mt-2 p-2 bg-slate-950/50 rounded overflow-x-auto">
          {codigo}
        </pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-lg p-4 my-4 flex items-center justify-center">
        <div className="animate-pulse text-slate-500 text-sm">Renderizando diagrama...</div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="bg-slate-900/30 border border-slate-800/50 rounded-lg p-4 my-4 overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
