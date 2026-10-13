/**
 * Almacenamiento local en memoria (fallback cuando PocketBase no está disponible)
 * 
 * Simula las operaciones CRUD de PocketBase usando estado en memoria.
 * Incluye soporte para: pin, duplicar, nota del día, import/export.
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

# Eliminar un contenedor
docker rm <container_id>
\`\`\`

## Imágenes

\`\`\`bash
# Listar imágenes
docker images

# Eliminar una imagen
docker rmi <image_id>

# Construir una imagen
docker build -t mi-app:latest .
\`\`\`

## Docker Compose

\`\`\`bash
# Levantar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
\`\`\`

> **Tip:** Usa \`docker-compose --profile dev up\` para levantar solo los servicios de desarrollo.`,
    categoria: 'comandos',
    tags: ['docker', 'contenedores', 'devops'],
    es_favorito: true,
    pinned: true,
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

Requisitos:
1. Código limpio y legible
2. Comentarios en español
3. Manejo de errores apropiado
4. Tests unitarios incluidos
5. Documentación JSDoc
\`\`\`

## Variantes útiles

### Para refactoring:
\`\`\`
Analiza el siguiente código y sugiere mejoras:
- Legibilidad
- Performance
- Patrones de diseño aplicables
- Posibles bugs

[pegar código aquí]
\`\`\`

### Para debugging:
\`\`\`
Tengo el siguiente error: [error]
El código relevante es: [código]
Contexto: [descripción del problema]

Ayúdame a:
1. Identificar la causa raíz
2. Proponer una solución
3. Explicar por qué ocurre
\`\`\``,
    categoria: 'prompts',
    tags: ['ai', 'codigo-limpio', 'prompts'],
    es_favorito: true,
    pinned: false,
    fecha_creacion: '2024-01-20T14:30:00.000Z',
  },
  {
    id: '3',
    titulo: 'Optimización de React: useMemo y useCallback',
    contenido: `# Optimización de React

## ¿Cuándo usar useMemo?

\`\`\`jsx
// ✅ Úsalo para cálculos costosos
const datosFiltrados = useMemo(() => {
  return items.filter(item => item.categoria === filtro);
}, [items, filtro]);

// ❌ No lo uses para valores simples
const nombre = useMemo(() => usuario.nombre, [usuario]);
\`\`\`

## ¿Cuándo usar useCallback?

\`\`\`jsx
// ✅ Úsalo para funciones pasadas a componentes hijos memorizados
const handleClick = useCallback((id) => {
  setItems(prev => prev.filter(item => item.id !== id));
}, []);

// ✅ Úsalo en efectos con dependencias de función
useEffect(() => {
  fetchData();
}, [fetchData]); // fetchData debe estar en useCallback
\`\`\`

## Reglas de oro

1. **No optimices prematuramente** - mide primero
2. **useMemo** es para **valores** calculados
3. **useCallback** es para **funciones** estables
4. Si el componente hijo no está memorizado con \`React.memo\`, \`useCallback\` no ayuda

> **Nota:** En React 19, el compilador automático puede hacer estas optimizaciones por ti.`,
    categoria: 'optimizacion',
    tags: ['react', 'performance', 'hooks'],
    es_favorito: false,
    pinned: false,
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
// vite.config.js
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
});
\`\`\`

## CSS de entrada

\`\`\`css
/* src/index.css */
@import "tailwindcss";
\`\`\`

## Cambios en v4

- **No más** \`tailwind.config.js\` para la mayoría de casos
- **Configuración en CSS** con \`@theme\`
- **Mejor performance** con el nuevo motor Oxide
- **Variables CSS** nativas

\`\`\`css
@import "tailwindcss";

@theme {
  --color-primary: #06b6d4;
  --font-display: "Inter", sans-serif;
}
\`\`\``,
    categoria: 'instalacion',
    tags: ['tailwind', 'vite', 'css'],
    es_favorito: false,
    pinned: false,
    fecha_creacion: '2024-02-10T16:45:00.000Z',
  },
  {
    id: '5',
    titulo: 'Solución: Error CORS en desarrollo',
    contenido: `# Error CORS en Desarrollo

## El problema

\`\`\`
Access to fetch at 'http://api.example.com' from origin 
'http://localhost:5173' has been blocked by CORS policy
\`\`\`

## Soluciones

### 1. Proxy en Vite (recomendado para desarrollo)

\`\`\`js
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://api.example.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\\/api/, ''),
      },
    },
  },
});
\`\`\`

### 2. Headers en el servidor (producción)

\`\`\`
Access-Control-Allow-Origin: https://tudominio.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
\`\`\`

### 3. Extensión de navegador (SOLO desarrollo)

> ⚠️ **Nunca** uses esto en producción. Solo para debugging local.

## Checklist de troubleshooting

- [ ] ¿El servidor envía los headers correctos?
- [ ] ¿La URL del API es correcta?
- [ ] ¿Hay un proxy configurado?
- [ ] ¿El método HTTP está permitido?`,
    categoria: 'troubleshooting',
    tags: ['cors', 'vite', 'api', 'debug'],
    es_favorito: true,
    pinned: false,
    fecha_creacion: '2024-02-15T11:20:00.000Z',
  },
];

// Estado en memoria
let notas = [...notasIniciales];
let nextId = 6;

/**
 * Obtener todas las notas
 */
export const getAllNotas = async (sort = '-fecha_creacion') => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let resultado = [...notas];
  
  if (sort === '-fecha_creacion') {
    resultado.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
  } else if (sort === 'fecha_creacion') {
    resultado.sort((a, b) => new Date(a.fecha_creacion) - new Date(b.fecha_creacion));
  }
  
  return resultado;
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
    fecha_creacion: data.fecha_creacion || new Date().toISOString(),
  };
  
  notas.unshift(nuevaNota);
  return nuevaNota;
};

/**
 * Actualizar una nota existente
 */
export const updateNota = async (id, data) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const index = notas.findIndex(n => n.id === id);
  if (index === -1) throw new Error('Nota no encontrada');
  
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
 * Toggle pin (fijar nota)
 */
export const togglePin = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const nota = notas.find(n => n.id === id);
  if (!nota) throw new Error('Nota no encontrada');
  
  nota.pinned = !nota.pinned;
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
    fecha_creacion: new Date().toISOString(),
  };
  
  notas.unshift(copia);
  return copia;
};

/**
 * Obtener todos los tags únicos existentes
 */
export const getAllTags = async () => {
  await new Promise(resolve => setTimeout(resolve, 50));
  
  const tagsSet = new Set();
  notas.forEach(nota => {
    if (nota.tags) {
      nota.tags.forEach(tag => tagsSet.add(tag));
    }
  });
  
  return Array.from(tagsSet).sort();
};

/**
 * Exportar toda la biblioteca como JSON
 */
export const exportarBiblioteca = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const data = {
    version: '1.0',
    exportado: new Date().toISOString(),
    notas: notas,
  };
  
  return JSON.stringify(data, null, 2);
};

/**
 * Importar biblioteca desde JSON
 */
export const importarBiblioteca = async (jsonString) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const data = JSON.parse(jsonString);
    
    if (!data.notas || !Array.isArray(data.notas)) {
      throw new Error('Formato inválido: se espera un objeto con propiedad "notas"');
    }
    
    // Validar cada nota
    data.notas.forEach((nota, index) => {
      if (!nota.titulo || !nota.contenido || !nota.categoria) {
        throw new Error(`Nota #${index + 1} inválida: faltan campos obligatorios`);
      }
    });
    
    // Reasignar IDs para evitar conflictos
    const notasImportadas = data.notas.map(nota => ({
      ...nota,
      id: String(nextId++),
    }));
    
    notas = [...notasImportadas, ...notas];
    
    return {
      importadas: notasImportadas.length,
      total: notas.length,
    };
  } catch (error) {
    throw new Error(`Error al importar: ${error.message}`);
  }
};

/**
 * Obtener nota del día (rotación basada en fecha)
 */
export const getNotaDelDia = async () => {
  await new Promise(resolve => setTimeout(resolve, 50));
  
  if (notas.length === 0) return null;
  
  const hoy = new Date();
  const seed = hoy.getFullYear() * 366 + hoy.getMonth() * 31 + hoy.getDate();
  const indice = seed % notas.length;
  
  return notas[indice];
};
