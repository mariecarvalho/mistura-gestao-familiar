import { config } from '@/config/environment';

const API_BASE_URL = config.API_BASE_URL; // Exemplo: http://localhost:5000/api

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'volunteer';
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<{ token: string; user: User }> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Credenciais inválidas');
    }

    return response.json(); // { token, user }
  },

  verify: async (token: string): Promise<{ user: User }> => {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Token inválido');
    }

    return response.json(); // { user }
  },

  getProfile: async (token: string): Promise<{ user: User }> => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Não autorizado');
    }

    return response.json(); // { user }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
  },
};
