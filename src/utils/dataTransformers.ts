import { Child } from "@/models/Child";

// Transformer para dados da família
export const transformFamilyDataForAPI = (formData: any) => {
  return {
    representative_name: formData.representative_name,
    representative_birth_date: formData.representative_birth_date,
    representative_gender: formData.representative_gender,
    people_count: parseInt(formData.people_count),
    children_count: parseInt(formData.children_count) || 0,
    current_benefit: formData.current_benefit || null,
    benefit_status: formData.benefit_status || 'active',
    presence_status: formData.presence_status || 'present',
    address: {
      street: formData.street || '',
      number: formData.number || '',
      complement: formData.complement || '',
      district: formData.district || '',
      city: formData.city || '',
      state: formData.state || '',
      postal_code: formData.postal_code || '',
    },
    contacts: [
      {
        contact_type: formData.contact_type || 'phone',
        contact_value: formData.contact_value || '',
        contact_note: formData.contact_note || '',
      }
    ],
    children: formData.children?.map((child: Child) => ({
      name: child.name,
      birth_date: child.birth_date,
      relationship: child.relationship,
      gender: child.gender,
    })) || []
  };
};

// Transformer para dados da ação
export const transformActionDataForAPI = (formData: any) => {
  return {
    title: formData.title,
    description: formData.description || '',
    date: formData.date,
    location: formData.location || '',
    meals_planned: parseInt(formData.mealsPlanned) || 0,
    meals_distributed: parseInt(formData.mealsDistributed) || 0,
    status: formData.status || 'planned',
    dish_of_the_day: formData.dish_of_the_day || '',
    action_cost: parseFloat(formData.action_cost) || 0,
    volunteers: formData.volunteers || [],
    families: formData.families || [],
  };
};

// Transformer para dados do voluntário
export const transformVolunteerDataForAPI = (formData: any) => {
  return {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    skills: formData.skills || [],
    availability: formData.availability || [],
    is_active: formData.isActive !== false,
  };
};

// Transformers para converter dados da API para o formato do formulário
export const transformAPIFamilyToForm = (apiData: any) => {
  return {
    representative_name: apiData.representative_name,
    representative_birth_date: apiData.representative_birth_date,
    representative_gender: apiData.representative_gender,
    people_count: apiData.people_count,
    children_count: apiData.children_count,
    current_benefit: apiData.current_benefit,
    benefit_status: apiData.benefit_status,
    presence_status: apiData.presence_status,
    street: apiData.address?.street || '',
    number: apiData.address?.number || '',
    complement: apiData.address?.complement || '',
    district: apiData.address?.district || '',
    city: apiData.address?.city || '',
    state: apiData.address?.state || '',
    postal_code: apiData.address?.postal_code || '',
    contact_type: apiData.contacts?.[0]?.contact_type || 'phone',
    contact_value: apiData.contacts?.[0]?.contact_value || '',
    contact_note: apiData.contacts?.[0]?.contact_note || '',
    children: apiData.children || [],
  };
};

export const transformAPIActionToForm = (apiData: any) => {
  return {
    title: apiData.title,
    description: apiData.description,
    date: apiData.date,
    location: apiData.location,
    mealsPlanned: apiData.meals_planned,
    mealsDistributed: apiData.meals_distributed,
    status: apiData.status,
    dish_of_the_day: apiData.dish_of_the_day,
    action_cost: apiData.action_cost,
    volunteers: apiData.volunteers,
    families: apiData.families,
  };
};

export const transformAPIVolunteerToForm = (apiData: any) => {
  return {
    name: apiData.name,
    email: apiData.email,
    phone: apiData.phone,
    skills: apiData.skills,
    availability: apiData.availability,
    isActive: apiData.is_active,
  };
};
