/**
 * TableOfContents.jsx
 * 
 * Tabla de contenidos automática generada desde los headings del Markdown.
 * Con scroll-spy para resaltar la sección activa.
 */
import { useState, useEffect, useMemo } from 'react';
import { List, ChevronRight } from 'lucide-react';

/**
 * Extrae los headings del contenido Markdown
 */
const extraerHeadings = (contenido) => {
  if (!contenido) return [];
  
  const regex = /^(#{1,3})\s+(.+)$/gm;
  const headings = [];
  let match;
  
  while ((match = regex.exec(contenido)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2].trim(),
      id: match[2].trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
    });
  }
  
  return headings;
};

/**
 * Tabla de contenidos con scroll-spy
 * 
 * @param {Object} props
 * @param {string} props.contenido - Contenido Markdown del que extraer headings
 * @param {string} props.containerId - ID del contenedor donde se renderiza el contenido
 */
export default function TableOfContents({ contenido, containerId = 'markdown-content' }) {
  const [activeId, setActiveId] = useState('');
  
  const headings = useMemo(() => extraerHeadings(contenido), [contenido]);
  
  // Si hay menos de 3 headings, no mostrar TOC
  if (headings.length < 3) return null;

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const handleScroll = () => {
      const headingElements = container.querySelectorAll('h1, h2, h3');
      let current = '';
      
      headingElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 150) {
          current = el.textContent.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
        }
      });
      
      setActiveId(current);
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerId, headings]);

  const handleClick = (id) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const target = container.querySelector(`[id="${id}"]`) || 
                   Array.from(container.querySelectorAll('h1, h2, h3')).find(
                     el => el.textContent.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') === id
                   );
    
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-3">
        <List size={14} className="text-cyan-400" />
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Contenido
        </span>
      </div>
      <nav className="space-y-1">
        {headings.map((heading, index) => (
          <button
            key={index}
            onClick={() => handleClick(heading.id)}
            className={`
              flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg text-sm transition
              ${heading.level === 1 ? 'pl-2 font-medium' : ''}
              ${heading.level === 2 ? 'pl-5' : ''}
              ${heading.level === 3 ? 'pl-8 text-xs' : ''}
              ${activeId === heading.id
                ? 'text-cyan-400 bg-cyan-950/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
              }
            `}
          >
            {activeId === heading.id && <ChevronRight size={10} className="text-cyan-400 shrink-0" />}
            <span className="truncate">{heading.text}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
