
import { Member } from './Member';

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
  contact_note?: string;
}

export interface Family {
  id: string;
  representative_name: string;
  representative_birth_date: string;
  representative_gender: 'Masculino' | 'Feminino';
  people_count: number;
  children_count: number;
  current_benefit: string[];
  benefit_status: string;
  last_presence_date: string;
  presence_status: string;
  has_elderly: boolean;
  is_single_mother: boolean;
  address: Address;
  contacts: Contact[];
  members: Member[];
  created_at?: string;
  updated_at?: string;
  // compatibilidade com o store
  street?: string;
  contact_value?: string;
  contact_note?: string;
}

export interface FamilyFormData {
  representative_name: string;
  representative_birth_date: string;
  representative_gender: 'Masculino' | 'Feminino';
  people_count: number;
  children_count: number;
  current_benefit: string[];
  benefit_status: string;
  presence_status: string;
  is_single_mother: boolean;
  address: Address;
  contacts: Contact[];
  members: Member[];
}

export type FamilyOutput = {
  id: string;
  representative_name: string;
  representative_birth_date: string;
  representative_gender: 'Masculino' | 'Feminino';
  people_count: number;
  children_count: number;
  current_benefit: string[];
  benefit_status: string;
  last_presence_date: string;
  presence_status: string;
  has_elderly: boolean;
  is_single_mother: boolean;
  address: {
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
    postal_code: string;
  };
  contacts: {
    contact_type: string;
    contact_value: string;
    contact_note?: string;
  }[];
  members: Member[];
  created_at?: string;
  updated_at?: string;
  street?: string;
  contact_value?: string;
  contact_note?: string;
};
