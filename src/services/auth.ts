
import { config } from '@/config/environment';

const API_BASE_URL = config.API_BASE_URL;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'volunteer';
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
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

    return response.json();
  },

  register: async (userData: RegisterData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar usuário');
    }

    return response.json();
  },

  verify: async (token: string) => {
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

    return response.json();
  },

  logout: async () => {
    localStorage.removeItem('auth_token');
  },
};
