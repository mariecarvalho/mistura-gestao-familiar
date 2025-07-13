
export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

export const getChildStatus = (birthDate: string): 'Ativo' | 'Inativo' => {
  const age = calculateAge(birthDate);
  return age >= 18 ? 'Inativo' : 'Ativo';
};

export const isChildAdult = (birthDate: string): boolean => {
  return calculateAge(birthDate) >= 18;
};
