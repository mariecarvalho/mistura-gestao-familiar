import { config } from '@/config/environment';
import { authHeaders } from './headers';

const API_BASE_URL = config.API_BASE_URL;

export const volunteerService = {
  create: async (volunteerData: any) => {
    const response = await fetch(`${API_BASE_URL}/volunteers`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(volunteerData),
    });
    if (!response.ok) throw new Error('Erro ao criar voluntário');
    return response.json();
  },

  update: async (id: string, volunteerData: any) => {
    const response = await fetch(`${API_BASE_URL}/volunteers/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(volunteerData),
    });
    if (!response.ok) throw new Error('Erro ao atualizar voluntário');
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/volunteers/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao deletar voluntário');
  },

  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/volunteers`, {
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao buscar voluntários');
    return response.json();
  },
};
