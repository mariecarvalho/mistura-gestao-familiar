
export interface Child {
  id?: string;
  name: string;
  birth_date: string;
  relationship: string;
  gender: 'Masculino' | 'Feminino';
  status: 'Ativo' | 'Inativo';
  age?: number;
}
