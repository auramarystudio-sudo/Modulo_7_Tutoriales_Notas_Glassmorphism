/**
 * Componentes personalizados para el renderizado de Markdown
 * 
 * Define los estilos Glassmorphism Dark Pro v3.0 para cada elemento
 * de Markdown (headings, código, blockquotes, listas, etc.)
 */

/**
 * Componente personalizado para headings h1
 */
const H1 = ({ node, ...props }) => (
  <h1 className="text-2xl font-bold text-slate-100 mb-4 mt-6 first:mt-0" {...props} />
);

/**
 * Componente personalizado para headings h2
 */
const H2 = ({ node, ...props }) => (
  <h2
    className="text-xl font-semibold text-cyan-400 mb-3 mt-5 border-b border-slate-800/50 pb-2"
    {...props}
  />
);

/**
 * Componente personalizado para headings h3
 */
const H3 = ({ node, ...props }) => (
  <h3 className="text-lg font-medium text-slate-200 mb-2 mt-4" {...props} />
);

/**
 * Componente personalizado para headings h4
 */
const H4 = ({ node, ...props }) => (
  <h4 className="text-base font-medium text-slate-300 mb-2 mt-3" {...props} />
);

/**
 * Componente personalizado para párrafos
 */
const P = ({ node, ...props }) => (
  <p className="text-slate-300 leading-relaxed mb-4" {...props} />
);

/**
 * Componente personalizado para bloques de código
 * Soporta tanto código inline como bloques de código multilínea
 */
const Code = ({ node, inline, className, children, ...props }) => {
  // Extraer el lenguaje del className si existe
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';

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

/**
 * Componente personalizado para blockquotes
 */
const Blockquote = ({ node, ...props }) => (
  <blockquote
    className="border-l-4 border-purple-500 bg-purple-950/20 pl-4 py-3 my-4 text-slate-300 italic rounded-r-lg"
    {...props}
  />
);

/**
 * Componente personalizado para listas desordenadas
 */
const Ul = ({ node, ...props }) => (
  <ul className="list-disc list-inside text-slate-300 space-y-2 mb-4 ml-2" {...props} />
);

/**
 * Componente personalizado para listas ordenadas
 */
const Ol = ({ node, ...props }) => (
  <ol className="list-decimal list-inside text-slate-300 space-y-2 mb-4 ml-2" {...props} />
);

/**
 * Componente personalizado para items de lista
 */
const Li = ({ node, ...props }) => (
  <li className="text-slate-300" {...props} />
);

/**
 * Componente personalizado para enlaces
 */
const A = ({ node, ...props }) => (
  <a
    className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition"
    target="_blank"
    rel="noopener noreferrer"
    {...props}
  />
);

/**
 * Componente personalizado para tablas
 */
const Table = ({ node, ...props }) => (
  <div className="overflow-x-auto mb-4">
    <table className="w-full border-collapse border border-slate-800/50 rounded-lg" {...props} />
  </div>
);

/**
 * Componente personalizado para headers de tabla
 */
const Th = ({ node, ...props }) => (
  <th
    className="border border-slate-800/50 bg-slate-800/50 px-4 py-2 text-left text-sm font-semibold text-slate-200"
    {...props}
  />
);

/**
 * Componente personalizado para celdas de tabla
 */
const Td = ({ node, ...props }) => (
  <td className="border border-slate-800/50 px-4 py-2 text-sm text-slate-300" {...props} />
);

/**
 * Componente personalizado para separadores horizontales
 */
const Hr = ({ node, ...props }) => (
  <hr className="border-slate-800/50 my-6" {...props} />
);

/**
 * Componente personalizado para imágenes
 */
const Img = ({ node, ...props }) => (
  <img className="rounded-lg border border-slate-800/50 max-w-full my-4" {...props} />
);

/**
 * Objeto exportado con todos los componentes personalizados
 */
export const customComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  p: P,
  code: Code,
  blockquote: Blockquote,
  ul: Ul,
  ol: Ol,
  li: Li,
  a: A,
  table: Table,
  th: Th,
  td: Td,
  hr: Hr,
  img: Img,
};
