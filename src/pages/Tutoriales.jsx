/**
 * Tutoriales.jsx
 * 
 * Página principal del módulo de Tutoriales y Notas.
 * Contiene el header flotante y renderiza la biblioteca de notas.
 */
import {
  BookOpen,
  Sparkles,
} from 'lucide-react';
import TutorialesLibrary from '../components/tutoriales/TutorialesLibrary';

/**
 * Página de Tutoriales y Notas
 * Base de conocimiento personal con soporte Markdown completo
 */
export default function Tutoriales() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Header flotante */}
      <header className="border-b border-slate-800/50 bg-slate-900/90 backdrop-blur-xl sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-950/50 border border-cyan-800/30">
                <BookOpen size={22} className="text-cyan-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Tutoriales y Notas
                </h1>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                  <Sparkles size={10} />
                  Markdown · Mermaid · Grafo · Presentación · Recordatorios · Búsqueda Avanzada
                </p>
              </div>
            </div>
            
            {/* Atajos visibles */}
            <div className="hidden lg:flex items-center gap-3 text-[10px] text-slate-600">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800/60 text-slate-500 font-mono border border-slate-700/30">Ctrl+K</kbd>
                Buscar
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800/60 text-slate-500 font-mono border border-slate-700/30">Ctrl+F</kbd>
                Avanzada
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800/60 text-slate-500 font-mono border border-slate-700/30">Ctrl+N</kbd>
                Nueva
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TutorialesLibrary />
      </main>
    </div>
  );
}
