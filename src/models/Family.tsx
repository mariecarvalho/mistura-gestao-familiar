import { Child } from "./Child";

export interface Family {
  id: string;
  representative_name: string;
  representative_birth_date: string;
  representative_gender: string;
  people_count: number;
  children_count: number;
  current_benefit?: string;
  benefit_status?: string;
  presence_status?: string;
  postal_code?: string;
  street?: string;
  number?: string;
  complement?: string;
  district?: string;
  city?: string;
  state?: string;
  contact_type?: string;
  contact_value?: string;
  contact_note?: string;
  children: Child[];
}
