
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Family {
  id: string;
  name: string;
  address: string;
  phone: string;
  members: number;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
}

interface Action {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  mealsPlanned: number;
  mealsDistributed?: number;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  volunteers: string[];
  families: string[];
  createdAt: Date;
}

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  availability: string[];
  isActive: boolean;
  actionsParticipated: number;
  createdAt: Date;
}

interface AppState {
  // Families
  families: Family[];
  addFamily: (family: Omit<Family, 'id' | 'createdAt'>) => void;
  updateFamily: (id: string, family: Partial<Family>) => void;
  removeFamily: (id: string) => void;
  
  // Actions
  actions: Action[];
  addAction: (action: Omit<Action, 'id' | 'createdAt'>) => void;
  updateAction: (id: string, action: Partial<Action>) => void;
  removeAction: (id: string) => void;
  
  // Volunteers
  volunteers: Volunteer[];
  addVolunteer: (volunteer: Omit<Volunteer, 'id' | 'createdAt' | 'actionsParticipated'>) => void;
  updateVolunteer: (id: string, volunteer: Partial<Volunteer>) => void;
  removeVolunteer: (id: string) => void;
  
  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Families
      families: [],
      addFamily: (family) => set((state) => ({
        families: [...state.families, {
          ...family,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        }]
      })),
      updateFamily: (id, updates) => set((state) => ({
        families: state.families.map(family => 
          family.id === id ? { ...family, ...updates } : family
        )
      })),
      removeFamily: (id) => set((state) => ({
        families: state.families.filter(family => family.id !== id)
      })),
      
      // Actions
      actions: [],
      addAction: (action) => set((state) => ({
        actions: [...state.actions, {
          ...action,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        }]
      })),
      updateAction: (id, updates) => set((state) => ({
        actions: state.actions.map(action => 
          action.id === id ? { ...action, ...updates } : action
        )
      })),
      removeAction: (id) => set((state) => ({
        actions: state.actions.filter(action => action.id !== id)
      })),
      
      // Volunteers
      volunteers: [],
      addVolunteer: (volunteer) => set((state) => ({
        volunteers: [...state.volunteers, {
          ...volunteer,
          id: crypto.randomUUID(),
          actionsParticipated: 0,
          createdAt: new Date(),
        }]
      })),
      updateVolunteer: (id, updates) => set((state) => ({
        volunteers: state.volunteers.map(volunteer => 
          volunteer.id === id ? { ...volunteer, ...updates } : volunteer
        )
      })),
      removeVolunteer: (id) => set((state) => ({
        volunteers: state.volunteers.filter(volunteer => volunteer.id !== id)
      })),
      
      // UI State
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'mistura-acolhe-storage',
    }
  )
);
