
import { config } from '@/config/environment';

const API_BASE_URL = config.API_BASE_URL;

// Family API calls
export const familyService = {
  create: async (familyData: any) => {
    console.log('Enviando dados para API:', familyData);
    const response = await fetch(`${API_BASE_URL}/families`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(familyData),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao criar família');
    }
    
    return response.json();
  },

  update: async (id: string, familyData: any) => {
    console.log('Atualizando família:', id, familyData);
    const response = await fetch(`${API_BASE_URL}/families/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(familyData),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao atualizar família');
    }
    
    return response.json();
  },

  delete: async (id: string) => {
    console.log('Deletando família:', id);
    const response = await fetch(`${API_BASE_URL}/families/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Erro ao deletar família');
    }
    
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/families`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar famílias');
    }
    
    return response.json();
  },
};

// Actions API calls
export const actionService = {
  create: async (actionData: any) => {
    const response = await fetch(`${API_BASE_URL}/actions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(actionData),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao criar ação');
    }
    
    return response.json();
  },

  update: async (id: string, actionData: any) => {
    const response = await fetch(`${API_BASE_URL}/actions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(actionData),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao atualizar ação');
    }
    
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/actions/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Erro ao deletar ação');
    }
    
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/actions`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar ações');
    }
    
    return response.json();
  },
};

// Volunteers API calls
export const volunteerService = {
  create: async (volunteerData: any) => {
    const response = await fetch(`${API_BASE_URL}/volunteers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(volunteerData),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao criar voluntário');
    }
    
    return response.json();
  },

  update: async (id: string, volunteerData: any) => {
    const response = await fetch(`${API_BASE_URL}/volunteers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(volunteerData),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao atualizar voluntário');
    }
    
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/volunteers/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Erro ao deletar voluntário');
    }
    
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/volunteers`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar voluntários');
    }
    
    return response.json();
  },
};
