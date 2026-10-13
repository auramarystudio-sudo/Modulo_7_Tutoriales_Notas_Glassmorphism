/**
 * designTokens.js
 * 
 * Sistema de diseño "Glassmorphism Dark Pro v3.0"
 * 
 * Tokens centralizados para mantener consistencia visual
 * en todo el módulo de Tutoriales y Notas.
 * 
 * Reglas de Oro:
 * ✅ Bordes siempre con opacidad /50
 * ✅ backdrop-blur en cards y header
 * ✅ Espaciado generoso (p-6, gap-6)
 * ✅ Gradientes sutiles
 * ✅ Transiciones en todo elemento interactivo
 * ✅ Solo Lucide React para iconos
 */

// ============================================
// LAYOUT
// ============================================
export const LAYOUT = {
  maxWidth: 'max-w-[1800px]',
  containerPadding: 'px-4 sm:px-6 lg:px-8',
  sectionGap: 'gap-6',
  cardPadding: 'p-6',
  innerPadding: 'p-4',
};

// ============================================
// FONDOS
// ============================================
export const BACKGROUNDS = {
  // Fondo principal de la app
  main: 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950',
  
  // Cards y contenedores principales
  card: 'bg-slate-900/50 backdrop-blur-sm',
  
  // Cards elevadas/modales
  cardElevated: 'bg-slate-900/95 backdrop-blur-xl',
  
  // Inputs y campos
  input: 'bg-slate-800/50',
  
  // Header flotante
  header: 'bg-slate-900/90 backdrop-blur-xl',
  
  // Badges por color
  badge: {
    cyan: 'bg-cyan-950/50',
    purple: 'bg-purple-950/50',
    pink: 'bg-pink-950/50',
    green: 'bg-green-950/50',
    yellow: 'bg-yellow-950/50',
    blue: 'bg-blue-950/50',
    red: 'bg-red-950/50',
    amber: 'bg-amber-950/50',
    indigo: 'bg-indigo-950/50',
    rose: 'bg-rose-950/50',
    orange: 'bg-orange-950/50',
    slate: 'bg-slate-800/50',
  },
  
  // Gradientes premium
  gradient: {
    cyanPurple: 'bg-gradient-to-r from-cyan-600 to-purple-600',
    cyanBlue: 'bg-gradient-to-r from-cyan-600 to-blue-600',
    purplePink: 'bg-gradient-to-r from-purple-600 to-pink-600',
    purpleIndigo: 'bg-gradient-to-r from-purple-600 to-indigo-600',
    cardGlow: 'bg-gradient-to-br from-cyan-950/20 to-purple-950/20',
  },
};

// ============================================
// BORDES
// ============================================
export const BORDERS = {
  // Default (cards, contenedores)
  default: 'border border-slate-800/50',
  
  // Inputs
  input: 'border border-slate-700/50',
  
  // Hover
  hover: 'hover:border-slate-700/50',
  
  // Focus
  focus: 'focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20',
  
  // Por color (premium)
  color: {
    cyan: 'border border-cyan-800/30',
    purple: 'border border-purple-800/30',
    pink: 'border border-pink-800/30',
    green: 'border border-green-800/30',
    yellow: 'border border-yellow-800/30',
    blue: 'border border-blue-800/30',
    red: 'border border-red-800/30',
    amber: 'border border-amber-800/30',
    indigo: 'border border-indigo-800/30',
    orange: 'border border-orange-800/30',
  },
  
  // Separadores sutiles
  divider: 'border-t border-slate-800/30',
  dividerBottom: 'border-b border-slate-800/50',
};

// ============================================
// ESQUINAS REDONDEADAS
// ============================================
export const RADIUS = {
  // Cards grandes
  card: 'rounded-2xl',
  
  // Botones, inputs, badges medianos
  default: 'rounded-lg',
  
  // Badges pequeños, tags
  small: 'rounded-md',
  
  // Iconos circulares, avatares
  full: 'rounded-full',
  
  // Iconos del header
  icon: 'rounded-xl',
};

// ============================================
// SOMBRAS
// ============================================
export const SHADOWS = {
  // Cards principales
  card: 'shadow-xl',
  
  // Cards flotantes, modales, popovers
  elevated: 'shadow-2xl',
  
  // Botones activos
  button: 'shadow-lg',
  
  // Sin sombra
  none: 'shadow-none',
};

// ============================================
// TIPOGRAFÍA
// ============================================
export const TYPOGRAPHY = {
  // Títulos principales (H1 de módulo)
  titleMain: 'text-xl font-bold text-slate-100',
  
  // Títulos con gradiente
  titleGradient: 'text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent',
  
  // Títulos de sección (H2 dentro de cards)
  sectionTitle: 'text-sm font-semibold text-slate-300',
  
  // Labels de formularios
  label: 'text-xs font-medium text-slate-400',
  
  // Texto principal
  body: 'text-sm text-slate-200',
  
  // Texto secundario
  secondary: 'text-xs text-slate-400',
  
  // Texto terciario
  tertiary: 'text-xs text-slate-500',
  
  // Texto brillante (destacado)
  highlight: 'text-sm text-slate-100',
  
  // Código inline
  code: 'text-sm font-mono text-cyan-300',
};

// ============================================
// COLORES DE TEXTO
// ============================================
export const TEXT_COLORS = {
  primary: 'text-slate-100',
  body: 'text-slate-200',
  secondary: 'text-slate-300',
  muted: 'text-slate-400',
  subtle: 'text-slate-500',
  faint: 'text-slate-600',
  
  // Colores de acento
  cyan: 'text-cyan-400',
  purple: 'text-purple-400',
  pink: 'text-pink-400',
  green: 'text-green-400',
  yellow: 'text-yellow-400',
  blue: 'text-blue-400',
  red: 'text-red-400',
  amber: 'text-amber-400',
  orange: 'text-orange-400',
};

// ============================================
// BOTONES
// ============================================
export const BUTTONS = {
  // Primario (acciones principales)
  primary: 'flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition shadow-lg',
  
  // Premium (con gradiente)
  premium: 'flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-medium transition shadow-lg',
  
  // Secundario (acciones secundarias)
  secondary: 'p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition',
  
  // Ghost (terciario, sutil)
  ghost: 'p-2 rounded-lg hover:bg-slate-800/50 text-slate-500 hover:text-slate-300 transition',
  
  // Danger
  danger: 'flex items-center gap-2 px-4 py-2 rounded-lg bg-red-950/40 hover:bg-red-950/70 text-red-400 hover:text-red-300 text-sm font-medium transition',
  
  // Small
  small: 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition',
};

// ============================================
// INPUTS
// ============================================
export const INPUTS = {
  // Text input estándar
  text: 'w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition',
  
  // Select
  select: 'w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition',
  
  // Textarea
  textarea: 'w-full bg-slate-950 border border-slate-800/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-600 font-mono text-sm leading-relaxed focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition resize-none',
  
  // Search (con icono)
  search: 'w-full bg-slate-800/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition',
};

// ============================================
// BADGES
// ============================================
export const BADGES = {
  // Default (purple)
  default: 'text-xs px-2 py-1 rounded-md bg-purple-950/50 text-purple-300 border border-purple-800/30',
  
  // Por categoría
  category: {
    instalacion: 'text-xs px-2 py-1 rounded-md bg-blue-950/50 text-blue-300 border border-blue-800/30',
    optimizacion: 'text-xs px-2 py-1 rounded-md bg-green-950/50 text-green-300 border border-green-800/30',
    prompts: 'text-xs px-2 py-1 rounded-md bg-purple-950/50 text-purple-300 border border-purple-800/30',
    comandos: 'text-xs px-2 py-1 rounded-md bg-cyan-950/50 text-cyan-300 border border-cyan-800/30',
    troubleshooting: 'text-xs px-2 py-1 rounded-md bg-red-950/50 text-red-300 border border-red-800/30',
    general: 'text-xs px-2 py-1 rounded-md bg-amber-950/50 text-amber-300 border border-amber-800/30',
  },
  
  // Tag
  tag: 'text-[10px] px-2 py-0.5 rounded-full bg-slate-800/60 text-slate-400 border border-slate-700/30',
  
  // Status
  status: {
    success: 'text-[10px] px-2 py-0.5 rounded bg-green-950/50 text-green-400 border border-green-800/30',
    warning: 'text-[10px] px-2 py-0.5 rounded bg-yellow-950/50 text-yellow-400 border border-yellow-800/30',
    error: 'text-[10px] px-2 py-0.5 rounded bg-red-950/50 text-red-400 border border-red-800/30',
    info: 'text-[10px] px-2 py-0.5 rounded bg-cyan-950/50 text-cyan-400 border border-cyan-800/30',
  },
};

// ============================================
// EFECTOS ESPECIALES
// ============================================
export const EFFECTS = {
  // Glassmorphism
  glass: 'backdrop-blur-sm',
  glassHeavy: 'backdrop-blur-xl',
  
  // Transiciones
  transition: 'transition',
  transitionAll: 'transition-all duration-200',
  transitionSlow: 'transition-all duration-300',
  
  // Hover states
  hoverCard: 'hover:border-slate-700/50',
  hoverLift: 'hover:-translate-y-0.5',
  
  // Animaciones
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  
  // Glow effects
  glowCyan: 'shadow-[0_0_20px_rgba(6,182,212,0.2)]',
  glowPurple: 'shadow-[0_0_20px_rgba(168,85,247,0.2)]',
};

// ============================================
// COMPOSICIONES (clases completas pre-armadas)
// ============================================
export const COMPONENTS = {
  // Card principal
  card: 'bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl',
  
  // Card compacta
  cardCompact: 'bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 backdrop-blur-sm shadow-xl',
  
  // Modal/Popover
  modal: 'fixed bottom-6 right-6 w-[500px] bg-slate-900 border border-slate-800/50 rounded-2xl p-6 shadow-2xl z-40 max-h-[80vh] overflow-y-auto backdrop-blur-xl',
  
  // Modal centrado
  modalCenter: 'fixed inset-0 z-50 flex items-center justify-center p-4',
  modalOverlay: 'absolute inset-0 bg-black/60 backdrop-blur-sm',
  modalContent: 'relative w-full max-w-4xl max-h-[90vh] bg-slate-900/95 border border-slate-800/50 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col',
  
  // Header
  header: 'border-b border-slate-800/50 bg-slate-900/90 backdrop-blur-xl sticky top-0 z-40 shadow-lg',
  headerContent: 'max-w-[1800px] mx-auto px-6 py-4',
  
  // Icon container
  iconContainer: (from = 'cyan', to = 'purple') => 
    `p-2 rounded-xl bg-gradient-to-br from-${from}-950/50 to-${to}-950/50 border border-${from}-800/30`,
  
  // Layout principal
  mainLayout: 'min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100',
  contentWrapper: 'max-w-[1800px] mx-auto px-6 py-6',
  twoColumnLayout: 'grid gap-6 lg:grid-cols-[1fr_400px]',
};
