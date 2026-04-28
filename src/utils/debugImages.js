/**
 * Script de diagnóstico para imágenes (DESHABILITADO EN PRODUCCIÓN)
 * Este archivo está deshabilitado en producción para evitar exponer información sensible
 */

export async function debugProductImages() {
  // Función de debugging deshabilitada en producción
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  // Resto de la función comentado
}

// Exportar para usar en consola (deshabilitado en producción)
// window.debugProductImages = debugProductImages;
