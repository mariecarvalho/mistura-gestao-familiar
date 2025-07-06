export interface Contact {
  id?: number;
  family_id: string; // UUID
  contact_type?: 'phone' | 'whatsapp' | 'email';
  contact_value?: string;
  contact_note?: string;
  created_at?: string;
  updated_at?: string;
}
