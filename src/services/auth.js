import axios from '../config/AxiosConfig';

export const authService = {
  // Registro de cliente
  register(userData) {
    return axios.doPost('/api/auth/register', userData);
  },

  // Iniciar sesión
  login(email, password) {
    return axios.doPost('/api/auth/login', { email, password });
  },

  // Refrescar token
  refreshToken(refreshToken) {
    return axios.doPost('/api/auth/refresh', null, {
      params: { refreshToken }
    });
  },

  // Cerrar sesión
  logout(accessToken, refreshToken) {
    return axios.doPost('/api/auth/logout', null, {
      params: {
        accessToken: accessToken || undefined,
        refreshToken: refreshToken || undefined
      }
    });
  },

  // Guardar tokens en localStorage
  setTokens(accessToken, refreshToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },

  // Obtener tokens
  getTokens() {
    return {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken')
    };
  },

  // Limpiar tokens
  clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('token'); // Para compatibilidad con código existente
    localStorage.removeItem('role');
  },

  // Verificar si está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  },

  // Cambiar contraseña
  changePassword(userId, currentPassword, newPassword) {
    return axios.doPut(`/api/auth/change-password?userId=${userId}`, {
      currentPassword,
      newPassword,
      confirmPassword: newPassword
    });
  },

  // Obtener estado de contraseña
  getPasswordStatus(userId) {
    return axios.doGet(`/api/auth/password-status/${userId}`);
  },

  // Solicitar reset de contraseña
  forgotPassword(email) {
    return axios.doPost(`/api/auth/forgot-password?email=${encodeURIComponent(email)}`);
  },

  // Validar token de reset
  validateResetToken(token) {
    return axios.doGet(`/api/auth/validate-reset-token?token=${encodeURIComponent(token)}`);
  },

  // Resetear contraseña con token
  resetPassword(token, newPassword, confirmPassword) {
    return axios.doPost('/api/auth/reset-password', {
      token,
      newPassword,
      confirmPassword
    });
  }
};

