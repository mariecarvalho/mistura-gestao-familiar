export interface Address {
  id?: number; // se for usado em edição, opcional
  family_id: string; // UUID
  street?: string;
  number?: string;
  complement?: string;
  district?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  created_at?: string;
  updated_at?: string;
}

