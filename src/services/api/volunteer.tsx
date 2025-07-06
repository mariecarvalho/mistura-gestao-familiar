import { config } from '@/config/environment';

const API_BASE_URL = config.API_BASE_URL;

export const volunteerService = {
  create: async (volunteerData: any) => {
    const response = await fetch(`${API_BASE_URL}/volunteers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(volunteerData),
    });

    if (!response.ok) throw new Error('Erro ao criar voluntário');
    return response.json();
  },

  update: async (id: string, volunteerData: any) => {
    const response = await fetch(`${API_BASE_URL}/volunteers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(volunteerData),
    });

    if (!response.ok) throw new Error('Erro ao atualizar voluntário');
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/volunteers/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Erro ao deletar voluntário');
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/volunteers`);
    if (!response.ok) throw new Error('Erro ao buscar voluntários');
    return response.json();
  },
};
