/**
 * Configuración de PocketBase
 * 
 * Este módulo inicializa la conexión con PocketBase.
 * Si no hay servidor disponible, usa un almacenamiento en memoria como fallback.
 */
import PocketBase from 'pocketbase';

// URL del servidor PocketBase (cambiar según entorno)
const POCKETBASE_URL = import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090';

// Intentar conectar con PocketBase
let pb;
try {
  pb = new PocketBase(POCKETBASE_URL);
} catch (error) {
  console.warn('No se pudo inicializar PocketBase, usando modo offline:', error);
  pb = null;
}

export default pb;

/**
 * Función auxiliar para verificar si PocketBase está disponible
 */
export const isPocketBaseAvailable = async () => {
  if (!pb) return false;
  try {
    await pb.health.check();
    return true;
  } catch {
    return false;
  }
};
