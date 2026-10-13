/**
 * plantillas.js
 * 
 * Plantillas predefinidas para crear notas rápidamente.
 * Cada plantilla tiene un título, categoría, tags y contenido Markdown de ejemplo.
 */

export const PLANTILLAS = [
  {
    id: 'tutorial',
    nombre: 'Nuevo Tutorial',
    icono: '📚',
    descripcion: 'Estructura base para un tutorial paso a paso',
    categoria: 'general',
    tags: ['tutorial', 'guia'],
    contenido: `# Título del Tutorial

## Introducción

Breve descripción de qué aprenderás en este tutorial y por qué es útil.

## Requisitos previos

- Requisito 1
- Requisito 2
- Requisito 3

## Paso 1: Configuración inicial

Descripción del primer paso...

\`\`\`bash
# Comando de ejemplo
npm install paquete-necesario
\`\`\`

## Paso 2: Implementación

Descripción del segundo paso...

\`\`\`javascript
// Código de ejemplo
const ejemplo = () => {
  console.log('Hola mundo');
};
\`\`\`

## Paso 3: Verificación

Cómo verificar que todo funciona correctamente.

## Conclusión

Resumen de lo aprendido y próximos pasos.

---

> **Nota:** Agregar referencias o enlaces útiles aquí.`,
  },
  {
    id: 'comando',
    nombre: 'Comando Útil',
    icono: '⌨️',
    descripcion: 'Plantilla para documentar un comando o snippet',
    categoria: 'comandos',
    tags: ['comando', 'terminal'],
    contenido: `# Nombre del Comando

## Descripción

Qué hace este comando y cuándo usarlo.

## Sintaxis

\`\`\`bash
comando [opciones] [argumentos]
\`\`\`

## Ejemplos

### Ejemplo básico

\`\`\`bash
comando --flag
\`\`\`

### Ejemplo avanzado

\`\`\`bash
comando --flag1 --flag2 valor | pipe | otro-comando
\`\`\`

## Opciones útiles

| Opción | Descripción |
|--------|-------------|
| \`-h\` | Mostrar ayuda |
| \`-v\` | Modo verbose |
| \`--flag\` | Descripción del flag |

## Tips

> 💡 Tip: Combinar con \`grep\` para filtrar resultados.

## Ver también

- [Documentación oficial](https://ejemplo.com)
- Comando relacionado 1
- Comando relacionado 2`,
  },
  {
    id: 'prompt',
    nombre: 'Prompt para IA',
    icono: '🤖',
    descripcion: 'Estructura para guardar prompts efectivos',
    categoria: 'prompts',
    tags: ['ai', 'prompt', 'chatgpt'],
    contenido: `# Nombre del Prompt

## Caso de uso

Cuándo y para qué usar este prompt.

## Prompt

\`\`\`
Actúa como un [rol específico].

Contexto:
- [contexto 1]
- [contexto 2]

Tarea:
[Descripción clara de la tarea]

Formato de salida:
- [requisito de formato 1]
- [requisito de formato 2]

Restricciones:
- [restricción 1]
- [restricción 2]
\`\`\`

## Variantes

### Variante para [caso específico]

\`\`\`
Prompt modificado para este caso...
\`\`\`

## Resultados esperados

Descripción de lo que deberías obtener.

## Tips de uso

> ⚡ **Tip:** Agregar ejemplos de input/output esperados mejora significativamente los resultados.

## Métricas

- **Efectividad:** ⭐⭐⭐⭐⭐
- **Modelos compatibles:** GPT-4, Claude, Gemini`,
  },
  {
    id: 'troubleshooting',
    nombre: 'Solución de Error',
    icono: '🐛',
    descripcion: 'Documentar un error y su solución',
    categoria: 'troubleshooting',
    tags: ['error', 'debug', 'solucion'],
    contenido: `# Nombre del Error

## El problema

\`\`\`
Mensaje de error exacto aquí
\`\`\`

## Contexto

- **Entorno:** [OS, versión, etc.]
- **Cuándo ocurre:** [descripción del escenario]
- **Frecuencia:** [siempre/intermitente/bajo ciertas condiciones]

## Causa raíz

Explicación de por qué ocurre este error.

## Solución

### Opción 1: [Nombre de la solución]

\`\`\`bash
# Pasos para aplicar la solución
paso 1
paso 2
\`\`\`

### Opción 2: [Alternativa]

\`\`\`bash
# Pasos alternativos
paso 1
paso 2
\`\`\`

## Prevención

Cómo evitar que este error ocurra en el futuro.

## Referencias

- [Link al issue/report](https://...)
- [Documentación relevante](https://...)`,
  },
  {
    id: 'optimizacion',
    nombre: 'Tip de Optimización',
    icono: '⚡',
    descripcion: 'Documentar una técnica de optimización',
    categoria: 'optimizacion',
    tags: ['performance', 'optimizacion'],
    contenido: `# Título de la Optimización

## Problema de performance

Descripción del problema que se resuelve.

### Antes (lento)

\`\`\`javascript
// Código sin optimizar
const resultado = array.filter(...).map(...).reduce(...);
\`\`\`

**Métrica:** ~500ms para 10k elementos

## Solución optimizada

### Después (rápido)

\`\`\`javascript
// Código optimizado
const resultado = array.reduce((acc, item) => {
  // Lógica combinada
  return acc;
}, inicial);
\`\`\`

**Métrica:** ~50ms para 10k elementos (10x más rápido)

## Por qué funciona

Explicación técnica de por qué esta solución es más eficiente.

## Cuándo aplicar

- ✅ Caso donde vale la pena
- ✅ Otro caso aplicable
- ❌ Caso donde NO aplicar (over-engineering)

## Benchmarks

| Escenario | Antes | Después | Mejora |
|-----------|-------|---------|--------|
| 1k items | 50ms | 5ms | 10x |
| 10k items | 500ms | 50ms | 10x |
| 100k items | 5s | 400ms | 12x |

## Referencias

- [Artículo sobre el tema](https://...)`,
  },
];

/**
 * Obtener una plantilla por su ID
 */
export const getPlantillaById = (id) => {
  return PLANTILLAS.find(p => p.id === id) || null;
};
