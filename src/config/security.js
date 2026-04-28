/**
 * Protección de seguridad del frontend
 * Previene técnicas comunes de inspección y debugging
 */

// Detectar si DevTools está abierto
const detectDevTools = () => {
  const threshold = 160;

  // Método 1: Usar setInterval para detectar cambios en el tamaño
  setInterval(() => {
    if (window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold) {
      onDevToolsDetected();
    }
  }, 500);

  // Método 2: Detectar función de debugging
  try {
    let before = new Date().getTime();
    debugger;
    let after = new Date().getTime();

    if (after - before > 100) {
      onDevToolsDetected();
    }
  } catch (e) {
    // Nada
  }
};

const onDevToolsDetected = () => {
  if (process.env.NODE_ENV !== 'production') {
    console.clear();
    console.log('%c⚠️ ADVERTENCIA DE SEGURIDAD', 'color: red; font-size: 20px; font-weight: bold;');
    console.log('%cNo está permitido inspeccionar esta aplicación.', 'color: red; font-size: 14px;');
    console.log('%cEsta acción está prohibida según nuestros términos de servicio.', 'color: orange; font-size: 12px;');
  }

  // Bloquear acceso
  if (process.env.NODE_ENV === 'production') {
    // En producción, puedes desconectar el usuario o redirigir
    // window.location.href = '/';
  }
};

// Prevenir usando console
const disableConsole = () => {
  const noop = () => {};

  // Solo en producción
  if (process.env.NODE_ENV === 'production') {
    console.log = noop;
    console.warn = noop;
    console.error = noop;
    console.info = noop;
    console.debug = noop;
  }
};

// Prevenir que se acceda a objetos del navegador
const protectGlobals = () => {
  // Proteger window.chrome
  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'chrome', {
      value: {},
      writable: false,
      configurable: false,
    });
  }
};

// Deshabilitar clic derecho (opcional)
const disableRightClick = () => {
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (process.env.NODE_ENV !== 'production') {
      console.log('%c❌ Clic derecho deshabilitado', 'color: red;');
    }
    return false;
  }, false);
};

// Deshabilitar atajos de teclado para DevTools
const disableDevToolsShortcuts = () => {
  document.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }

    // Ctrl+Shift+I (Chrome, Edge, Firefox)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
      e.preventDefault();
      return false;
    }

    // Ctrl+Shift+J (Chrome, Edge)
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
      e.preventDefault();
      return false;
    }

    // Ctrl+Shift+C (Chrome, Edge)
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
      e.preventDefault();
      return false;
    }

    // Ctrl+Shift+K (Firefox)
    if (e.ctrlKey && e.shiftKey && e.key === 'K') {
      e.preventDefault();
      return false;
    }

    // Ctrl+I (Firefox - Inspector)
    if (e.ctrlKey && e.key === 'I') {
      e.preventDefault();
      return false;
    }
  });
};

// Inicializar todas las protecciones
export const initSecurityProtections = (options = {}) => {
  const {
    detectDevTools: dt = true,
    disableConsole: dc = process.env.NODE_ENV === 'production',
    protectGlobals: pg = true,
    disableRightClick: rc = false,
    disableDevToolsShortcuts: dds = false,
  } = options;

  if (dt) detectDevTools();
  if (dc) disableConsole();
  if (pg) protectGlobals();
  if (rc) disableRightClick();
  if (dds) disableDevToolsShortcuts();
};

// Información sobre la aplicación sin exponer detalles sensibles
export const getAppInfo = () => {
  return {
    name: 'Mueblería Plaza Reforma',
    version: '1.0.0',
    // No exponer información sensible del servidor o framework
  };
};

