/**
 * MarkdownRenderer.jsx
 * 
 * Componente wrapper para react-markdown con estilos Glassmorphism Dark Pro v3.0.
 * Renderiza contenido Markdown con componentes personalizados para una vista premium.
 */
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { customComponents } from '../../utils/markdown-components';

/**
 * Componente para renderizar contenido Markdown con estilos personalizados
 * 
 * @param {Object} props
 * @param {string} props.contenido - El texto en formato Markdown a renderizar
 * @param {string} props.className - Clases CSS adicionales (opcional)
 */
export default function MarkdownRenderer({ contenido, className = '' }) {
  if (!contenido) {
    return (
      <p className="text-slate-500 italic text-center py-8">
        Sin contenido para mostrar
      </p>
    );
  }

  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={customComponents}
      >
        {contenido}
      </ReactMarkdown>
    </div>
  );
}
