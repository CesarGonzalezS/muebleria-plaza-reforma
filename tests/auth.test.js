import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { authService } from '../src/services/auth';

describe('Auth Service', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should have login method', () => {
      expect(authService.login).toBeDefined();
      expect(typeof authService.login).toBe('function');
    });

    it('should be callable with email and password', () => {
      // Just verify the function is callable, don't actually call it (no network)
      expect(authService.login.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('logout', () => {
    it('should have logout method', () => {
      expect(authService.logout).toBeDefined();
      expect(typeof authService.logout).toBe('function');
    });
  });

  describe('setTokens', () => {
    it('should save tokens to localStorage', () => {
      const mockToken = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyIiwicm9sZSI6IkFETUlOIn0.test';
      const mockRefresh = 'refresh-token-67890';

      authService.setTokens(mockToken, mockRefresh);

      // Verify tokens saved
      const saved = localStorage.getItem('accessToken') || localStorage.getItem('token');
      expect(saved).toBeTruthy();
    });
  });

  describe('getTokens', () => {
    it('should return stored tokens', () => {
      const mockToken = 'test-token';
      localStorage.setItem('accessToken', mockToken);
      localStorage.setItem('refreshToken', 'refresh-token');

      const tokens = authService.getTokens();

      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no token exists', () => {
      const result = authService.isAuthenticated();
      expect(result).toBeFalsy();
    });

    it('should return true when token exists', () => {
      localStorage.setItem('accessToken', 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyIn0.test');
      const result = authService.isAuthenticated();
      expect(result).toBeTruthy();
    });
  });

  describe('changePassword', () => {
    it('should have changePassword method', () => {
      expect(authService.changePassword).toBeDefined();
      expect(typeof authService.changePassword).toBe('function');
    });
  });

  describe('forgotPassword', () => {
    it('should have forgotPassword method', () => {
      expect(authService.forgotPassword).toBeDefined();
      expect(typeof authService.forgotPassword).toBe('function');
    });
  });

  describe('resetPassword', () => {
    it('should have resetPassword method', () => {
      expect(authService.resetPassword).toBeDefined();
      expect(typeof authService.resetPassword).toBe('function');
    });
  });

  describe('validateResetToken', () => {
    it('should have validateResetToken method', () => {
      expect(authService.validateResetToken).toBeDefined();
      expect(typeof authService.validateResetToken).toBe('function');
    });
  });

  describe('getPasswordStatus', () => {
    it('should have getPasswordStatus method', () => {
      expect(authService.getPasswordStatus).toBeDefined();
      expect(typeof authService.getPasswordStatus).toBe('function');
    });
  });
});
