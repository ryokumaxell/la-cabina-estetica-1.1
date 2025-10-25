import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';
import { mockUsuarios } from '../data/mockData';

// Mock de localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('useAuth Hook', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it('should start with user as null', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
  });

  it('should login successfully with valid credentials', () => {
    const { result } = renderHook(() => useAuth());
    
    act(() => {
      result.current.login('leonel.acosta11@gmail.com', 'password');
    });
    
    // Verificar que el usuario sea el administrador
    expect(result.current.user).not.toBeNull();
    expect(result.current.user?.email).toBe('leonel.acosta11@gmail.com');
  });

  it('should not login with invalid credentials', () => {
    const { result } = renderHook(() => useAuth());
    
    act(() => {
      result.current.login('invalid@example.com', 'wrongpassword');
    });
    
    expect(result.current.user).toBeNull();
  });

  it('should logout successfully', () => {
    const { result } = renderHook(() => useAuth());
    
    // Primero hacemos login
    act(() => {
      result.current.login('leonel.acosta11@gmail.com', 'password');
    });
    
    // Verificamos que el usuario esté logueado
    expect(result.current.user).not.toBeNull();
    
    // Hacemos logout
    act(() => {
      result.current.logout();
    });
    
    // Verificamos que el usuario sea null después del logout
    expect(result.current.user).toBeNull();
  });
});