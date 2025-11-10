import axios from "axios";
import Swal from "sweetalert2";

// Cargar la URL del backend desde el entorno
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";


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
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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

    // Error 401 - No autorizado (token inválido o expirado)
    if (status === 401) {
      ToastWarning("Sesión expirada", "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      localStorage.removeItem("token");
      window.location.href = "/login";
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
  async doPost(url, data) {
    return await axios.post(url, data);
  },
  async doGet(url) {
    return await axios.get(url);
  },
  async doPut(url, data) {
    return await axios.put(url, data);
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