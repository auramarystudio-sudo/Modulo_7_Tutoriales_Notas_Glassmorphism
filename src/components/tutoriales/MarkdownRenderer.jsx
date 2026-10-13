/**
 * MarkdownRenderer.jsx
 * 
 * Componente wrapper para react-markdown con estilos Glassmorphism.
 * Soporta backlinks [[nota]] y componentes personalizados.
 */
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { customComponents } from '../../utils/markdown-components';
import { Backlink } from './BacklinkRenderer';

/**
 * Procesa el contenido para convertir [[backlinks]] en marcadores
 */
const procesarContenido = (contenido, notas) => {
  if (!contenido || !notas) return contenido || '';
  
  // Reemplazar [[nombre]] con un marcador especial
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
 * Componentes extendidos con soporte para backlinks
 */
const getComponentesExtendidos = (notas, onVerNota) => {
  const base = { ...customComponents };
  
  // Override del componente de enlace para detectar backlinks
  base.a = ({ node, href, children, ...props }) => {
    // Detectar backlinks
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
    
    // Links normales
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
 * 
 * @param {Object} props
 * @param {string} props.contenido - Texto en formato Markdown
 * @param {Array} props.notas - Lista de notas (para resolver backlinks)
 * @param {Function} props.onVerNota - Callback al hacer clic en un backlink
 * @param {string} props.className - Clases CSS adicionales
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
