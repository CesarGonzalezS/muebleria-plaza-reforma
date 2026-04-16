import axios from '../config/AxiosConfig';

export const authService = {
  register(userData) {
    return axios.doPost('/api/auth/register', userData);
  },

  login(email, password) {
    return axios.doPost('/api/auth/login', { email, password });
  },

  logout(accessToken, refreshToken) {
    const params = new URLSearchParams();
    if (accessToken) params.append('accessToken', accessToken);
    if (refreshToken) params.append('refreshToken', refreshToken);
    const query = params.toString() ? `?${params.toString()}` : '';
    return axios.doPost(`/api/auth/logout${query}`);
  },

  setTokens(accessToken, refreshToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },

  getTokens() {
    return {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken')
    };
  },

  clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  },

  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  },

  changePassword(userId, currentPassword, newPassword) {
    return axios.doPost(`/api/auth/change-password?userId=${userId}`, {
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

