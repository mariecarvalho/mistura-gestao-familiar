
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Trash, AlertTriangle, Baby, UserRound } from 'lucide-react';
import { FamilyFormData, FamilyOutput } from '@/models/Family';
import { Member } from '@/models/Member';
import { useCep } from '@/hooks/use-cep';
import { familyService } from '@/services/api/family';
import { Loader2 } from 'lucide-react';

interface FamilyFormModalProps {
  family?: FamilyOutput;
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

const benefitOptions = [
  'Marmitas Mistura',
  'Sopa',
  'Cesta Básica',
  'Doação de Roupa',
  'Doação de Alimentos'
];

// Parentescos que indicam menor de idade (padrão)
const MINOR_RELATIONSHIPS = ['Filho(a)', 'Neto(a)', 'Sobrinho(a)'];

const RELATIONSHIP_OPTIONS = [
  // Menores
  { value: 'Filho(a)',        label: 'Filho(a)',        minor: true  },
  { value: 'Neto(a)',         label: 'Neto(a)',         minor: true  },
  { value: 'Sobrinho(a)',     label: 'Sobrinho(a)',     minor: true  },
  // Adultos
  { value: 'Cônjuge',         label: 'Cônjuge',         minor: false },
  { value: 'Pai/Mãe',         label: 'Pai/Mãe',         minor: false },
  { value: 'Avô/Avó',         label: 'Avô/Avó',         minor: false },
  { value: 'Irmão/Irmã',      label: 'Irmão/Irmã',      minor: false },
  { value: 'Outro adulto',    label: 'Outro adulto',    minor: false },
  { value: 'Outro',           label: 'Outro',           minor: false },
];

/** Normaliza ISO date para YYYY-MM-DD que o <input type="date"> aceita */
const toDateInput = (v?: string | null): string => {
  if (!v) return '';
  return v.slice(0, 10); // "2000-02-05T00:00:00.000Z" → "2000-02-05"
};

const calcAge = (bd: string): number => {
  const today = new Date();
  const birth = new Date(bd);
  let age = today.getFullYear() - birth.getFullYear();
  if (today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
  return age;
};

const isMinorAge = (bd: string): boolean => !!bd && calcAge(bd) < 18;

export function FamilyFormModal({ family, isOpen, onClose, onSave }: FamilyFormModalProps) {
  const { fetchCep, loading: cepLoading, error: cepError } = useCep();

  const [formData, setFormData] = useState<FamilyFormData>({
    representative_name: family?.representative_name || '',
    representative_birth_date: toDateInput(family?.representative_birth_date),
    representative_gender: family?.representative_gender || 'Masculino',
    people_count: family?.people_count || 1,
    children_count: family?.children_count || 0,
    current_benefit: Array.isArray(family?.current_benefit) ? family.current_benefit : [],
    benefit_status: family?.benefit_status || 'Ativo',
    presence_status: family?.presence_status || 'Regular',
    is_single_mother: family?.is_single_mother ?? false,
    address: family?.address || {
      street: '', number: '', complement: '', district: '', city: '', state: '', postal_code: '',
    },
    contacts: family?.contacts || [],
    members: family?.members || [],
  });

  useEffect(() => {
    if (family) {
      setFormData({
        representative_name: family.representative_name,
        representative_birth_date: toDateInput(family.representative_birth_date),
        representative_gender: family.representative_gender,
        people_count: family.people_count,
        children_count: family.children_count,
        current_benefit: Array.isArray(family.current_benefit) ? family.current_benefit : [],
        benefit_status: family.benefit_status,
        presence_status: family.presence_status,
        is_single_mother: family.is_single_mother ?? false,
        address: family.address,
        contacts: family.contacts,
        members: (family.members || []).map(m => ({
          ...m,
          birth_date: toDateInput(m.birth_date),
        })),
      });
    }
  }, [family]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, address: { ...prev.address, [name]: value } }));
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, address: { ...prev.address, postal_code: cep } }));
    if (cep.length === 8) {
      const cepData = await fetchCep(cep);
      if (cepData) {
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            street: cepData.logradouro,
            district: cepData.bairro,
            city: cepData.localidade,
            state: cepData.uf,
            complement: cepData.complemento || prev.address.complement,
          }
        }));
      }
    }
  };

  const handleBenefitChange = (benefit: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      current_benefit: checked
        ? [...prev.current_benefit, benefit]
        : prev.current_benefit.filter(b => b !== benefit)
    }));
  };

  const handleContactChange = (index: number, field: string, value: string) => {
    const updated = [...formData.contacts];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, contacts: updated }));
  };

  const handleAddContact = () => {
    setFormData(prev => ({
      ...prev,
      contacts: [...prev.contacts, { contact_type: '', contact_value: '', contact_note: '' }]
    }));
  };

  const handleRemoveContact = (index: number) => {
    const updated = [...formData.contacts];
    updated.splice(index, 1);
    setFormData(prev => ({ ...prev, contacts: updated }));
  };

  // ── Membros ──────────────────────────────────────────────────────────────
  const handleMemberChange = (index: number, field: string, value: string) => {
    const updated = [...formData.members];
    updated[index] = { ...updated[index], [field]: value };
    // recalcula is_minor ao mudar birth_date ou relationship
    if (field === 'birth_date') {
      updated[index].is_minor = value ? isMinorAge(value) : undefined;
      updated[index].age = value ? calcAge(value) : undefined;
    }
    if (field === 'relationship') {
      // se não tem data, herda pela heurística do parentesco
      if (!updated[index].birth_date) {
        updated[index].is_minor = MINOR_RELATIONSHIPS.includes(value);
      }
    }
    setFormData(prev => ({ ...prev, members: updated }));
  };

  const handleAddMember = () => {
    const newMember: Member = {
      name: '',
      birth_date: '',
      relationship: 'Filho(a)',
      gender: 'Masculino',
      is_minor: true,
    };
    setFormData(prev => ({ ...prev, members: [...prev.members, newMember] }));
  };

  const handleRemoveMember = (index: number) => {
    const updated = [...formData.members];
    updated.splice(index, 1);
    setFormData(prev => ({ ...prev, members: updated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        people_count: parseInt(formData.people_count.toString()),
        children_count: parseInt(formData.children_count.toString()),
        // backend ainda espera campo "children" — mantemos compatibilidade
        children: formData.members,
      };
      if (family) {
        await familyService.update(family.id, payload as any);
      } else {
        await familyService.create(payload as any);
      }
      if (onSave) onSave();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar família:', error);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle>{family ? 'Editar Família' : 'Cadastrar Nova Família'}</AlertDialogTitle>
          <AlertDialogDescription>
            Preencha os campos abaixo para {family ? 'editar' : 'cadastrar'} uma família.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Dados do Representante */}
          <Card>
            <CardContent className="p-3.5 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Dados do Representante</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="representative_name">Nome do Representante</Label>
                  <Input
                    id="representative_name"
                    name="representative_name"
                    value={formData.representative_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="representative_birth_date">Data de Nascimento</Label>
                  <Input
                    id="representative_birth_date"
                    type="date"
                    name="representative_birth_date"
                    value={formData.representative_birth_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gênero</Label>
                  <Select
                    value={formData.representative_gender}
                    onValueChange={(v) => setFormData(prev => ({ ...prev, representative_gender: v as 'Masculino' | 'Feminino' }))}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Feminino">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="people_count">Número de Pessoas na Família</Label>
                  <Input
                    id="people_count"
                    type="number"
                    name="people_count"
                    min="1"
                    value={formData.people_count}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Mãe Solo — span 2 colunas */}
                {formData.representative_gender === 'Feminino' && (
                  <div className="md:col-span-2 flex items-start gap-3 pt-1">
                    <Checkbox
                      id="is_single_mother"
                      checked={formData.is_single_mother}
                      onCheckedChange={(v) =>
                        setFormData(prev => ({ ...prev, is_single_mother: v as boolean }))
                      }
                    />
                    <div>
                      <Label htmlFor="is_single_mother" className="font-medium cursor-pointer">
                        Mãe Solo
                      </Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Marcado automaticamente quando gênero é Feminino e há filhos cadastrados. Pode ser ajustado manualmente.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card>
            <CardContent className="p-3.5 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Endereço</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="postal_code">CEP</Label>
                    <div className="relative">
                      <Input
                        id="postal_code"
                        name="postal_code"
                        value={formData.address.postal_code}
                        onChange={handleCepChange}
                        placeholder="00000-000"
                        maxLength={8}
                        required
                      />
                      {cepLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />}
                    </div>
                    {cepError && <p className="text-sm text-destructive">{cepError}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="sm:col-span-2 space-y-1.5 sm:space-y-2">
                    <Label htmlFor="street">Rua</Label>
                    <Input id="street" name="street" value={formData.address.street} onChange={handleAddressChange} required />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="number">Número</Label>
                    <Input id="number" name="number" value={formData.address.number} onChange={handleAddressChange} required />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="complement">Complemento</Label>
                    <Input id="complement" name="complement" value={formData.address.complement} onChange={handleAddressChange} />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="district">Bairro</Label>
                    <Input id="district" name="district" value={formData.address.district} onChange={handleAddressChange} required />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input id="city" name="city" value={formData.address.city} onChange={handleAddressChange} required />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input id="state" name="state" value={formData.address.state} onChange={handleAddressChange} required />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefícios */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">Benefícios</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Benefícios Atuais (múltipla escolha)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {benefitOptions.map((benefit) => (
                      <div key={benefit} className="flex items-center space-x-2">
                        <Checkbox
                          id={benefit}
                          checked={formData.current_benefit.includes(benefit)}
                          onCheckedChange={(c) => handleBenefitChange(benefit, c as boolean)}
                        />
                        <Label htmlFor={benefit} className="text-sm font-normal">{benefit}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Status do Benefício</Label>
                  <Select value={formData.benefit_status} onValueChange={(v) => setFormData(prev => ({ ...prev, benefit_status: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contatos */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Contatos</h3>
                <Button type="button" variant="outline" size="sm" onClick={handleAddContact}>
                  <Plus className="h-4 w-4 mr-2" /> Adicionar Contato
                </Button>
              </div>
              <div className="space-y-4">
                {formData.contacts.map((contact, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-3.5 sm:p-4 border rounded-lg bg-card">
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label>Tipo</Label>
                      <Select value={contact.contact_type} onValueChange={(v) => handleContactChange(index, 'contact_type', v)}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Telefone">Telefone</SelectItem>
                          <SelectItem value="Celular">Celular</SelectItem>
                          <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                          <SelectItem value="Email">Email</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label>Contato</Label>
                      <Input value={contact.contact_value} onChange={(e) => handleContactChange(index, 'contact_value', e.target.value)} required />
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label>Observação</Label>
                      <Input value={contact.contact_note || ''} onChange={(e) => handleContactChange(index, 'contact_note', e.target.value)} />
                    </div>
                    <div className="flex items-end justify-end sm:justify-start pt-1 sm:pt-0">
                      <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveContact(index)} className="w-full sm:w-auto">
                        <Trash className="h-4 w-4 mr-1 sm:mr-0" />
                        <span className="sm:hidden">Remover Contato</span>
                      </Button>
                    </div>
                  </div>
                ))}
                {formData.contacts.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">Nenhum contato adicionado</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Membros da família */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Membros da Família</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Além do representante. Menores de 18 anos são identificados automaticamente pela data de nascimento.
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={handleAddMember}>
                  <Plus className="h-4 w-4 mr-2" /> Adicionar Membro
                </Button>
              </div>

              <div className="space-y-4">
                {formData.members.map((member, index) => {
                  const hasDate = !!member.birth_date;
                  const isAdult = hasDate && !isMinorAge(member.birth_date!);
                  const age = hasDate ? calcAge(member.birth_date!) : null;
                  const effectiveMinor = hasDate
                    ? !isAdult
                    : MINOR_RELATIONSHIPS.includes(member.relationship);

                  return (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      {/* indicador de tipo */}
                      <div className="flex items-center gap-2">
                        {effectiveMinor ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                            <Baby className="h-3 w-3" /> Menor de idade
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                            <UserRound className="h-3 w-3" /> Adulto
                          </span>
                        )}
                        {age !== null && (
                          <span className="text-xs text-muted-foreground">{age} anos</span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label>Nome</Label>
                          <Input
                            value={member.name}
                            onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Data de Nascimento</Label>
                          <Input
                            type="date"
                            value={member.birth_date || ''}
                            onChange={(e) => handleMemberChange(index, 'birth_date', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Gênero</Label>
                          <Select value={member.gender} onValueChange={(v) => handleMemberChange(index, 'gender', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Masculino">Masculino</SelectItem>
                              <SelectItem value="Feminino">Feminino</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Parentesco</Label>
                          <Select value={member.relationship} onValueChange={(v) => handleMemberChange(index, 'relationship', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="—" disabled className="text-muted-foreground text-xs">── Menores ──</SelectItem>
                              {RELATIONSHIP_OPTIONS.filter(r => r.minor).map(r => (
                                <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                              ))}
                              <SelectItem value="—2" disabled className="text-muted-foreground text-xs">── Adultos ──</SelectItem>
                              {RELATIONSHIP_OPTIONS.filter(r => !r.minor).map(r => (
                                <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {isAdult && (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            Este membro tem {age} anos. Adultos podem ter cadastro próprio como representante de família.
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="flex justify-end">
                        <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveMember(index)}>
                          <Trash className="h-4 w-4 mr-2" /> Remover
                        </Button>
                      </div>
                    </div>
                  );
                })}
                {formData.members.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">Nenhum membro adicionado além do representante</p>
                )}
              </div>
            </CardContent>
          </Card>

          <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-3 border-t">
            <AlertDialogCancel type="button" className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
            <Button type="submit" className="bg-warm-orange hover:bg-warm-orange/90 w-full sm:w-auto">
              {family ? 'Salvar' : 'Cadastrar'}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
