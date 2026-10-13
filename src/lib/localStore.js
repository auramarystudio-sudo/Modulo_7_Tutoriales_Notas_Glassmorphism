/**
 * Almacenamiento local en memoria (fallback cuando PocketBase no está disponible)
 * 
 * Soporta: CRUD, pin, duplicar, versiones, archivado, tags, import/export.
 */

// Datos de ejemplo iniciales
const notasIniciales = [
  {
    id: '1',
    titulo: 'Comandos esenciales de Docker',
    contenido: `# Comandos esenciales de Docker

## Contenedores

\`\`\`bash
# Listar contenedores activos
docker ps

# Listar todos los contenedores
docker ps -a

# Detener un contenedor
docker stop <container_id>
\`\`\`

## Imágenes

\`\`\`bash
# Listar imágenes
docker images

# Construir una imagen
docker build -t mi-app:latest .
\`\`\`

> **Tip:** Relacionado con [[Optimización de React: useMemo y useCallback]] para CI/CD.`,
    categoria: 'comandos',
    tags: ['docker', 'contenedores', 'devops'],
    es_favorito: true,
    pinned: true,
    archivado: false,
    fecha_creacion: '2024-01-15T10:00:00.000Z',
  },
  {
    id: '2',
    titulo: 'Prompt para generar código limpio',
    contenido: `# Prompt para Código Limpio

## Prompt base

\`\`\`
Actúa como un desarrollador senior experto en [tecnología].
Genera código que siga los principios SOLID y las mejores prácticas.
\`\`\`

## Variantes útiles

### Para refactoring:
\`\`\`
Analiza el siguiente código y sugiere mejoras.
[pegar código aquí]
\`\`\`

Ver también: [[Instalación de Tailwind CSS v4 con Vite]] para setup de proyectos.`,
    categoria: 'prompts',
    tags: ['ai', 'codigo-limpio', 'prompts'],
    es_favorito: true,
    pinned: false,
    archivado: false,
    fecha_creacion: '2024-01-20T14:30:00.000Z',
  },
  {
    id: '3',
    titulo: 'Optimización de React: useMemo y useCallback',
    contenido: `# Optimización de React

## Flujo de decisión

\`\`\`mermaid
graph TD
    A[¿Cálculo costoso?] -->|Sí| B[Usar useMemo]
    A -->|No| C[No optimizar]
    D[¿Función como prop?] -->|Sí| E[Usar useCallback]
    D -->|No| F[Función normal]
    B --> G[¿Componente hijo usa React.memo?]
    G -->|Sí| H[✅ Optimización efectiva]
    G -->|No| I[⚠️ Sin beneficio real]
\`\`\`

## ¿Cuándo usar useMemo?

\`\`\`jsx
const datosFiltrados = useMemo(() => {
  return items.filter(item => item.categoria === filtro);
}, [items, filtro]);
\`\`\`

## ¿Cuándo usar useCallback?

\`\`\`jsx
const handleClick = useCallback((id) => {
  setItems(prev => prev.filter(item => item.id !== id));
}, []);
\`\`\`

> **Nota:** Combinar con [[Comandos esenciales de Docker]] para testing de performance.`,
    categoria: 'optimizacion',
    tags: ['react', 'performance', 'hooks'],
    es_favorito: false,
    pinned: false,
    archivado: false,
    fecha_creacion: '2024-02-01T09:15:00.000Z',
  },
  {
    id: '4',
    titulo: 'Instalación de Tailwind CSS v4 con Vite',
    contenido: `# Tailwind CSS v4 + Vite

## Instalación

\`\`\`bash
npm install tailwindcss @tailwindcss/vite
\`\`\`

## Configuración de Vite

\`\`\`js
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  plugins: [tailwindcss()],
});
\`\`\`

Ver: [[Solución: Error CORS en desarrollo]] para problemas comunes.`,
    categoria: 'instalacion',
    tags: ['tailwind', 'vite', 'css'],
    es_favorito: false,
    pinned: false,
    archivado: false,
    fecha_creacion: '2024-02-10T16:45:00.000Z',
  },
  {
    id: '5',
    titulo: 'Solución: Error CORS en desarrollo',
    contenido: `# Error CORS en Desarrollo

## El problema

\`\`\`
Access to fetch at 'http://api.example.com' has been blocked by CORS policy
\`\`\`

## Soluciones

### Proxy en Vite

\`\`\`js
export default defineConfig({
  server: {
    proxy: {
      '/api': { target: 'http://api.example.com' }
    }
  }
});
\`\`\`

- [x] Proxy configurado
- [ ] Headers en producción
- [ ] Tests de integración`,
    categoria: 'troubleshooting',
    tags: ['cors', 'vite', 'api', 'debug'],
    es_favorito: true,
    pinned: false,
    archivado: false,
    fecha_creacion: '2024-02-15T11:20:00.000Z',
  },
];

// Estado en memoria
let notas = [...notasIniciales];
let nextId = 6;
let versiones = {}; // { notaId: [{ id, contenido, fecha }] }

/**
 * Obtener todas las notas
 */
export const getAllNotas = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...notas].sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
};

/**
 * Obtener notas no archivadas
 */
export const getNotasActivas = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return notas
    .filter(n => !n.archivado)
    .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
};

/**
 * Obtener notas archivadas
 */
export const getNotasArchivadas = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return notas
    .filter(n => n.archivado)
    .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
};

/**
 * Crear una nueva nota
 */
export const createNota = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const nuevaNota = {
    id: String(nextId++),
    ...data,
    pinned: data.pinned || false,
    archivado: data.archivado || false,
    fecha_creacion: data.fecha_creacion || new Date().toISOString(),
  };
  
  notas.unshift(nuevaNota);
  return nuevaNota;
};

/**
 * Actualizar una nota existente (guarda versión anterior)
 */
export const updateNota = async (id, data) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const index = notas.findIndex(n => n.id === id);
  if (index === -1) throw new Error('Nota no encontrada');
  
  // Guardar versión anterior antes de actualizar
  const notaActual = notas[index];
  if (!versiones[id]) versiones[id] = [];
  versiones[id].unshift({
    id: String(versiones[id].length + 1),
    contenido: notaActual.contenido,
    titulo: notaActual.titulo,
    fecha: new Date().toISOString(),
  });
  
  // Limitar a 20 versiones por nota
  if (versiones[id].length > 20) {
    versiones[id] = versiones[id].slice(0, 20);
  }
  
  notas[index] = { ...notas[index], ...data };
  return notas[index];
};

/**
 * Eliminar una nota
 */
export const deleteNota = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const index = notas.findIndex(n => n.id === id);
  if (index === -1) throw new Error('Nota no encontrada');
  
  notas.splice(index, 1);
  delete versiones[id];
  return true;
};

/**
 * Toggle favorito
 */
export const toggleFavorito = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const nota = notas.find(n => n.id === id);
  if (!nota) throw new Error('Nota no encontrada');
  
  nota.es_favorito = !nota.es_favorito;
  return nota;
};

/**
 * Toggle pin
 */
export const togglePin = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const nota = notas.find(n => n.id === id);
  if (!nota) throw new Error('Nota no encontrada');
  
  nota.pinned = !nota.pinned;
  return nota;
};

/**
 * Toggle archivado
 */
export const toggleArchivado = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const nota = notas.find(n => n.id === id);
  if (!nota) throw new Error('Nota no encontrada');
  
  nota.archivado = !nota.archivado;
  return nota;
};

/**
 * Duplicar una nota
 */
export const duplicarNota = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const original = notas.find(n => n.id === id);
  if (!original) throw new Error('Nota no encontrada');
  
  const copia = {
    ...original,
    id: String(nextId++),
    titulo: `${original.titulo} (copia)`,
    pinned: false,
    archivado: false,
    fecha_creacion: new Date().toISOString(),
  };
  
  notas.unshift(copia);
  return copia;
};

/**
 * Obtener versiones de una nota
 */
export const getVersiones = async (notaId) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return versiones[notaId] || [];
};

/**
 * Revertir a una versión anterior
 */
export const revertirVersion = async (notaId, versionId) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const notaVersiones = versiones[notaId] || [];
  const version = notaVersiones.find(v => v.id === versionId);
  if (!version) throw new Error('Versión no encontrada');
  
  const index = notas.findIndex(n => n.id === notaId);
  if (index === -1) throw new Error('Nota no encontrada');
  
  // Guardar versión actual antes de revertir
  const notaActual = notas[index];
  notaVersiones.unshift({
    id: String(notaVersiones.length + 1),
    contenido: notaActual.contenido,
    titulo: notaActual.titulo,
    fecha: new Date().toISOString(),
  });
  
  // Aplicar versión antigua
  notas[index] = {
    ...notas[index],
    contenido: version.contenido,
    titulo: version.titulo,
  };
  
  return notas[index];
};

/**
 * Obtener todos los tags únicos
 */
export const getAllTags = async () => {
  await new Promise(resolve => setTimeout(resolve, 50));
  
  const tagsSet = new Set();
  notas.forEach(nota => {
    if (nota.tags) nota.tags.forEach(tag => tagsSet.add(tag));
  });
  
  return Array.from(tagsSet).sort();
};

/**
 * Buscar notas por título (para backlinks [[...]])
 */
export const buscarNotasPorTitulo = async (termino) => {
  await new Promise(resolve => setTimeout(resolve, 50));
  
  if (!termino.trim()) return [];
  
  const t = termino.toLowerCase();
  return notas
    .filter(n => n.titulo.toLowerCase().includes(t))
    .map(n => ({ id: n.id, titulo: n.titulo }))
    .slice(0, 10);
};

/**
 * Obtener backlinks de una nota (notas que la enlazan)
 */
export const getBacklinks = async (notaId) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const nota = notas.find(n => n.id === notaId);
  if (!nota) return [];
  
  const tituloNota = nota.titulo;
  
  return notas
    .filter(n => n.id !== notaId && n.contenido.includes(`[[${tituloNota}]]`))
    .map(n => ({ id: n.id, titulo: n.titulo }));
};

/**
 * Exportar toda la biblioteca
 */
export const exportarBiblioteca = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return JSON.stringify({
    version: '2.0',
    exportado: new Date().toISOString(),
    notas,
    versiones,
  }, null, 2);
};

/**
 * Importar biblioteca
 */
export const importarBiblioteca = async (jsonString) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const data = JSON.parse(jsonString);
    
    if (!data.notas || !Array.isArray(data.notas)) {
      throw new Error('Formato inválido');
    }
    
    const notasImportadas = data.notas.map(nota => ({
      ...nota,
      id: String(nextId++),
      archivado: nota.archivado || false,
      pinned: nota.pinned || false,
    }));
    
    notas = [...notasImportadas, ...notas];
    
    if (data.versiones) {
      Object.entries(data.versiones).forEach(([key, vers]) => {
        versiones[key] = vers;
      });
    }
    
    return { importadas: notasImportadas.length, total: notas.length };
  } catch (error) {
    throw new Error(`Error al importar: ${error.message}`);
  }
};
