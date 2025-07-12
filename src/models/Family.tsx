
export interface Address {
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  postal_code: string;
}

export interface Contact {
  contact_type: string;
  contact_value: string;
  note?: string;
}

export interface Family {
  id: string;
  representative_name: string;
  representative_birth_date: string;
  representative_gender: 'Masculino' | 'Feminino';
  people_count: number;
  children_count: number;
  current_benefit: string;
  benefit_status: string;
  last_presence_date: string;
  presence_status: string;
  address: Address;
  contacts: Contact[];
  children: Child[];
  created_at?: string;
  updated_at?: string;
}

export interface FamilyFormData {
  representative_name: string;
  representative_birth_date: string;
  representative_gender: 'Masculino' | 'Feminino';
  people_count: number;
  children_count: number;
  current_benefit: string;
  benefit_status: string;
  presence_status: string;
  address: Address;
  contacts: Contact[];
  children: Child[];
}
