import axiosConfig from '../config/AxiosConfig';

export const homeSettingsService = {
  getSettings() {
    return axiosConfig.doGet('/api/settings/home');
  },
  saveSettings(data) {
    return axiosConfig.doPut('/api/settings/home', data);
  },
};
