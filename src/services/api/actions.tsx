import { config } from '@/config/environment';

const API_BASE_URL = config.API_BASE_URL;

export const actionService = {
  create: async (actionData: any) => {
    const response = await fetch(`${API_BASE_URL}/actions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(actionData),
    });

    if (!response.ok) throw new Error('Erro ao criar ação');
    return response.json();
  },

  update: async (id: string, actionData: any) => {
    const response = await fetch(`${API_BASE_URL}/actions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(actionData),
    });

    if (!response.ok) throw new Error('Erro ao atualizar ação');
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/actions/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Erro ao deletar ação');
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/actions`);
    if (!response.ok) throw new Error('Erro ao buscar ações');
    return response.json();
  },
};
