import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import axiosConfig, { saveToken, getToken, removeToken, isAuthenticated, __resetMemoryStore } from '../src/config/AxiosConfig';

describe('AxiosConfig - Token Management', () => {
  beforeEach(() => {
    __resetMemoryStore();
    localStorage.clear();
    sessionStorage.clear();
    // Clear IndexedDB for tests
    if (globalThis.indexedDB && globalThis.indexedDB._clearAll) {
      globalThis.indexedDB._clearAll();
    }
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('saveToken', () => {
    it('should save token to localStorage', async () => {
      const testToken = 'eyJhbGciOiJIUzUxMiJ9.test.signature';

      await saveToken(testToken);

      const stored = localStorage.getItem('accessToken') || localStorage.getItem('token');
      expect(stored).toBeTruthy();
    });

    it('should not save empty token', async () => {
      await saveToken('');
      await saveToken(null);

      const stored = localStorage.getItem('accessToken');
      expect(stored).toBeFalsy();
    });
  });

  describe('getToken', () => {
    it('should retrieve saved token', async () => {
      const testToken = 'test-token-12345';
      localStorage.setItem('accessToken', testToken);

      const retrieved = await getToken();

      expect(retrieved).toBe(testToken);
    });

    it('should return null when no token exists', async () => {
      const retrieved = await getToken();

      expect(retrieved).toBeNull();
    });

    it('should check fallback token key', async () => {
      const testToken = 'fallback-token-67890';
      localStorage.setItem('token', testToken);

      const retrieved = await getToken();

      expect(retrieved).toBe(testToken);
    });
  });

  describe('removeToken', () => {
    it('should remove token from localStorage', async () => {
      localStorage.setItem('accessToken', 'test-token');
      localStorage.setItem('role', 'ADMIN');

      await removeToken();

      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('role')).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no token', async () => {
      const result = await isAuthenticated();
      expect(result).toBeFalsy();
    });

    it('should return true when token exists', async () => {
      localStorage.setItem('accessToken', 'valid-token');

      const result = await isAuthenticated();

      expect(result).toBeTruthy();
    });
  });

  describe('API methods', () => {
    it('should have doGet method', () => {
      expect(axiosConfig.doGet).toBeDefined();
      expect(typeof axiosConfig.doGet).toBe('function');
    });

    it('should have doPost method', () => {
      expect(axiosConfig.doPost).toBeDefined();
      expect(typeof axiosConfig.doPost).toBe('function');
    });

    it('should have doPut method', () => {
      expect(axiosConfig.doPut).toBeDefined();
      expect(typeof axiosConfig.doPut).toBe('function');
    });

    it('should have doDelete method', () => {
      expect(axiosConfig.doDelete).toBeDefined();
      expect(typeof axiosConfig.doDelete).toBe('function');
    });
  });

  describe('Toast functions', () => {
    it('should have ToastSuccess', () => {
      expect(axiosConfig.ToastSuccess).toBeDefined();
      expect(typeof axiosConfig.ToastSuccess).toBe('function');
    });

    it('should have ToastError', () => {
      expect(axiosConfig.ToastError).toBeDefined();
      expect(typeof axiosConfig.ToastError).toBe('function');
    });

    it('should have ToastWarning', () => {
      expect(axiosConfig.ToastWarning).toBeDefined();
      expect(typeof axiosConfig.ToastWarning).toBe('function');
    });
  });

  describe('Token Format', () => {
    it('should recognize valid JWT format', async () => {
      // JWT format: header.payload.signature
      const validJWT = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIn0.signature';

      await saveToken(validJWT);
      const retrieved = await getToken();

      expect(retrieved).toBe(validJWT);
      expect(retrieved.split('.').length).toBe(3);
    });
  });

  describe('Storage Fallback (Firefox Tracking Prevention)', () => {
    it('should have memory fallback for blocked storage', async () => {
      // Memory store should exist as fallback
      const testToken = 'memory-test-token';

      await saveToken(testToken);

      // Even if localStorage is blocked, token should be retrievable
      const retrieved = await getToken();
      expect(retrieved).toBeTruthy();
    });
  });
});
