
export interface Action {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  status: string;
  volunteer_count: number;
  families_served: number;
  dishOfTheDay: string;
  actionCost: number;
  created_at?: string;
  updated_at?: string;
}

export interface ActionFormData {
  title: string;
  description: string;
  date: string;
  type: string;
  status: string;
  volunteer_count: number;
  families_served: number;
  dishOfTheDay: string;
  actionCost: number;
}
