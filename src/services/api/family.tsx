import { config } from '@/config/environment';
import { Family, FamilyFormData } from '@/models/Family';
import { authHeaders } from './headers';

const API_BASE_URL = config.API_BASE_URL;

export const familyService = {
  create: async (familyData: FamilyFormData) => {
    const response = await fetch(`${API_BASE_URL}/families`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(familyData),
    });
    if (!response.ok) throw new Error('Erro ao criar família');
    return response.json();
  },

  update: async (id: string, familyData: FamilyFormData) => {
    const response = await fetch(`${API_BASE_URL}/families/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(familyData),
    });
    if (!response.ok) throw new Error('Erro ao atualizar família');
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/families/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao deletar família');
  },

  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/families`, {
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao buscar famílias');
    return response.json();
  },
};
