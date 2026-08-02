
export interface Member {
  id?: string;
  name: string;
  birth_date?: string;
  relationship: string;
  gender: 'Masculino' | 'Feminino';
  /** Calculado automaticamente pelo backend via trigger (< 18 anos) */
  is_minor?: boolean;
  age?: number;
}

/** Alias retrocompatível */
export type Child = Member;
