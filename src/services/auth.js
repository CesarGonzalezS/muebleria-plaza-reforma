import axios from '../config/AxiosConfig';
import { saveToken, removeToken } from '../config/AxiosConfig';

export const authService = {
  register(userData) {
    return axios.doPost('/api/auth/register', userData);
  },

  login(email, password) {
    return axios.doPost('/api/auth/login', { email, password });
  },

  logout() {
    removeToken();
    return axios.doPost(`/api/auth/logout`);
  },

  setTokens(accessToken, refreshToken) {
    saveToken(accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  },

  getTokens() {
    return {
      accessToken: localStorage.getItem('accessToken') || localStorage.getItem('token'),
      refreshToken: localStorage.getItem('refreshToken')
    };
  },

  clearTokens() {
    removeToken();
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
  },

  isAuthenticated() {
    return !!localStorage.getItem('accessToken') || !!localStorage.getItem('token');
  },

  changePassword(currentPassword, newPassword) {
    return axios.doPost('/api/auth/change-password', {
      currentPassword,
      newPassword,
      confirmPassword: newPassword
    });
  },

  getPasswordStatus(userId) {
    return axios.doGet(`/api/auth/password-status/${userId}`);
  },

  forgotPassword(email) {
    return axios.doPost(`/api/auth/forgot-password?email=${encodeURIComponent(email)}`);
  },

  validateResetToken(token) {
    return axios.doGet(`/api/auth/validate-reset-token?token=${encodeURIComponent(token)}`);
  },

  resetPassword(token, newPassword, confirmPassword) {
    return axios.doPost('/api/auth/reset-password', {
      token,
      newPassword,
      confirmPassword
    });
  }
};

