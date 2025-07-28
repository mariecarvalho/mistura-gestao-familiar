export interface Volunteer {
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

export interface VolunteerFormData {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  availability: string[];
  isActive: boolean;
}