/**
 * MarkdownRenderer.jsx
 * 
 * Componente wrapper para react-markdown con estilos Glassmorphism.
 * Soporta: backlinks [[nota]], diagramas Mermaid, componentes personalizados.
 */
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { customComponents } from '../../utils/markdown-components';
import { Backlink } from './BacklinkRenderer';
import MermaidRenderer from './MermaidRenderer';

/**
 * Procesa el contenido para convertir [[backlinks]] en marcadores
 */
const procesarContenido = (contenido, notas) => {
  if (!contenido || !notas) return contenido || '';
  
  return contenido.replace(/\[\[([^\]]+)\]\]/g, (match, nombreNota) => {
    const nota = notas.find(n => 
      n.titulo.toLowerCase().trim() === nombreNota.toLowerCase().trim()
    );
    
    if (nota) {
      return `[🔗 ${nota.titulo}](__backlink:${nota.id}__)`;
    }
    return `[⚠ ${nombreNota}](__backlink_missing:${nombreNota}__)`;
  });
};

/**
 * Componentes extendidos con soporte para backlinks y Mermaid
 */
const getComponentesExtendidos = (notas, onVerNota) => {
  const base = { ...customComponents };
  
  // Override del componente de código para detectar Mermaid
  base.code = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';

    // Renderizar Mermaid
    if (language === 'mermaid' && !inline) {
      const codigo = String(children).replace(/\n$/, '');
      return <MermaidRenderer codigo={codigo} />;
    }

    // Código inline normal
    if (inline) {
      return (
        <code
          className="bg-slate-800/80 text-cyan-300 px-1.5 py-0.5 rounded text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      );
    }

    // Bloque de código normal
    return (
      <div className="mb-4">
        {language && (
          <div className="bg-slate-900 border border-slate-800/50 rounded-t-lg px-3 py-1.5 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono uppercase">{language}</span>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60"></div>
            </div>
          </div>
        )}
        <pre
          className={`bg-slate-950 border border-slate-800 ${language ? 'rounded-b-lg border-t-0' : 'rounded-lg'} p-4 overflow-x-auto`}
        >
          <code className="text-cyan-300 text-sm font-mono leading-relaxed" {...props}>
            {children}
          </code>
        </pre>
      </div>
    );
  };

  // Override del componente de enlace para detectar backlinks
  base.a = ({ node, href, children, ...props }) => {
    if (href?.startsWith('__backlink:')) {
      const notaId = href.replace('__backlink:', '').replace('__', '');
      return (
        <Backlink
          notaId={notaId}
          notas={notas}
          onVerNota={onVerNota}
        />
      );
    }
    
    if (href?.startsWith('__backlink_missing:')) {
      const nombre = href.replace('__backlink_missing:', '').replace('__', '');
      return (
        <Backlink
          missing={true}
          missingName={nombre}
        />
      );
    }
    
    return (
      <a
        href={href}
        className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  };
  
  return base;
};

/**
 * Componente para renderizar contenido Markdown
 */
export default function MarkdownRenderer({ contenido, notas = [], onVerNota, className = '' }) {
  if (!contenido) {
    return (
      <p className="text-slate-500 italic text-center py-8">
        Sin contenido para mostrar
      </p>
    );
  }

  const contenidoProcesado = procesarContenido(contenido, notas);
  const componentes = getComponentesExtendidos(notas, onVerNota);

  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={componentes}
      >
        {contenidoProcesado}
      </ReactMarkdown>
    </div>
  );
}
