import axios from "axios";
import Swal from "sweetalert2";

// URL del backend - Simple y directo
const API_URL = "http://localhost:8080";

axios.defaults.baseURL = API_URL;
axios.defaults.headers.common["Content-Type"] = "application/json";

// Función para mostrar mensajes de error
const ToastError = (title, message) => {
  Swal.fire({
    icon: "error",
    title: title,
    text: message,
  });
};



// Función para mostrar mensajes de advertencia
const ToastWarning = (title, message) => {
  Swal.fire({
    icon: "warning",
    title: title,
    text: message,
  });
};

// Función para mostrar mensajes de éxito
const ToastSuccess = (title, message) => {
  Swal.fire({
    icon: "success",
    title: title,
    text: message,
    timer: 2000,
    showConfirmButton: false,
  });
};

// Interceptores de solicitud
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    
    console.log('📡 [REQUEST]', config.method.toUpperCase(), config.url);
    console.log('   Token en localStorage:', token ? '✓ presente' : '✗ NO presente');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('   ✓ Authorization header establecido');
      console.log('   Token (primeros 50 caracteres):', token.substring(0, 50) + '...');
      console.log('   Formato:', token.startsWith('eyJ') ? '✓ JWT válido' : '✗ NO es JWT');
      
      // Debug: verificar que el token llegó al header
      console.log('   ✅ Token enviado en header:', !!config.headers.Authorization);
    } else {
      console.warn('   ⚠️ NO HAY TOKEN - Petición irá sin autenticación');
      console.warn('   AccessToken:', !!localStorage.getItem('accessToken'));
      console.warn('   Token:', !!localStorage.getItem('token'));
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptores de respuesta
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si no hay respuesta del servidor
    if (!error.response) {
      ToastError("Error de conexión", "No se pudo conectar con el servidor. Verifica tu conexión.");
      return Promise.reject(error);
    }

    const status = error.response.status;
    const requestUrl = error.config?.url || '';

    // Error 401 - No autorizado (token inválido o expirado)
    if (status === 401) {
      console.error('❌ [401 ERROR]', requestUrl, '| Error:', error.response.data);
      console.warn('⚠️  Token inválido o expirado. Limpiando datos locales...');
      
      // Limpiar tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      
      // Redirigir a login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      
      return Promise.reject(error);
    }

    // Error 403 - Prohibido (sin permisos)
    if (status === 403) {
      ToastWarning("Acceso denegado", "No tienes permisos para realizar esta acción.");
      return Promise.reject(error);
    }

    // Error 400 - Bad Request
    if (status === 400) {
      console.error("Bad Request:", error.response);
      const errorData = error.response.data;

      if (errorData && typeof errorData === 'object') {
        const firstKey = Object.keys(errorData)[0];
        const firstValue = errorData[firstKey];
        ToastWarning("¡Ups!", Array.isArray(firstValue) ? firstValue[0] : firstValue);
      } else {
        ToastWarning("¡Ups!", "Datos incorrectos. Verifica la información ingresada.");
      }
      return Promise.reject(error);
    }

    // Error 404 - No encontrado
    if (status === 404) {
      ToastWarning("No encontrado", "El recurso solicitado no existe.");
      return Promise.reject(error);
    }

    // Error 500 - Error del servidor
    if (status === 500) {
      ToastError("Error del servidor", "Ocurrió un error en el servidor. Por favor, inténtalo más tarde.");
      return Promise.reject(error);
    }

    // Otros errores
    ToastError("Vaya...", "Algo salió mal. Por favor, inténtalo más tarde.");
    return Promise.reject(error);
  }
);

export default {
  async doDelete(url, data) {
    return await axios.delete(url, { data });
  },
  async doPost(url, data, config = {}) {
    return await axios.post(url, data, config);
  },
  async doGet(url, config = {}) {
    return await axios.get(url, config);
  },
  async doPut(url, data, config = {}) {
    return await axios.put(url, data, config);
  },
  async doPostFile(url, data) {
    return await axios.post(url, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  async doPutFile(url, data) {
    return await axios.put(url, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  ToastSuccess,
  ToastError,
  ToastWarning,
};