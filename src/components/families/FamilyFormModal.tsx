
import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { toast } from '@/components/ui/use-toast';
import { familyService } from '@/services/api';
import { transformFamilyDataForAPI, transformAPIFamilyToForm } from '@/utils/dataTransformers';

interface Child {
  name: string;
  birth_date: string;
  relationship: string;
  gender: string;
}

interface FamilyFormData {
  representative_name: string;
  representative_birth_date: string;
  representative_gender: string;
  people_count: number;
  children_count: number;
  current_benefit: string;
  benefit_status: string;
  presence_status: string;
  // Address
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  postal_code: string;
  // Contact
  contact_type: string;
  contact_value: string;
  contact_note: string;
  // Children
  children: Child[];
}

interface FamilyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  family?: any;
  mode: 'create' | 'edit';
}

export function FamilyFormModal({ isOpen, onClose, family, mode }: FamilyFormModalProps) {
  const { addFamily, updateFamily } = useAppStore();
  const { register, handleSubmit, reset, setValue, watch, control, formState: { errors } } = useForm<FamilyFormData>({
    defaultValues: {
      children: []
    }
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "children"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);

  const watchedCep = watch('postal_code');

  useEffect(() => {
    if (family && mode === 'edit') {
      const formData = transformAPIFamilyToForm(family);
      Object.keys(formData).forEach((key) => {
        setValue(key as keyof FamilyFormData, formData[key]);
      });
    }
  }, [family, mode, setValue]);

  // Buscar CEP
  useEffect(() => {
    if (watchedCep && watchedCep.replace(/\D/g, '').length === 8) {
      fetchAddressByCep(watchedCep.replace(/\D/g, ''));
    }
  }, [watchedCep]);

  const fetchAddressByCep = async (cep: string) => {
    setAddressLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setValue('street', data.logradouro || '');
        setValue('district', data.bairro || '');
        setValue('city', data.localidade || '');
        setValue('state', data.uf || '');
      } else {
        toast({
          title: "CEP não encontrado",
          description: "Verifique se o CEP está correto.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      toast({
        title: "Erro ao buscar CEP",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setAddressLoading(false);
    }
  };

  const addChild = () => {
    append({
      name: '',
      birth_date: '',
      relationship: 'filho',
      gender: 'masculino'
    });
  };

  const onSubmit = async (data: FamilyFormData) => {
    setIsLoading(true);
    
    try {
      const apiData = transformFamilyDataForAPI(data);
      
      if (mode === 'create') {
        const response = await familyService.create(apiData);
        addFamily({
          id: response.id,
          name: data.representative_name,
          address: `${data.street}, ${data.number} - ${data.district}, ${data.city}/${data.state}`,
          phone: data.contact_value,
          members: data.people_count,
          notes: data.contact_note,
          isActive: data.benefit_status === 'active',
          createdAt: new Date(),
        });
        
        toast({
          title: "Família cadastrada",
          description: "A família foi cadastrada com sucesso.",
        });
      } else {
        await familyService.update(family.id, apiData);
        updateFamily(family.id, {
          name: data.representative_name,
          address: `${data.street}, ${data.number} - ${data.district}, ${data.city}/${data.state}`,
          phone: data.contact_value,
          members: data.people_count,
          notes: data.contact_note,
          isActive: data.benefit_status === 'active',
        });
        
        toast({
          title: "Família atualizada",
          description: "Os dados da família foram atualizados com sucesso.",
        });
      }

      reset();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar família:', error);
      toast({
        title: "Erro",
        description: mode === 'create' ? "Erro ao cadastrar família." : "Erro ao atualizar família.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Cadastrar Nova Família' : 'Editar Família'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Dados do Representante */}
          <Card>
            <CardHeader>
              <CardTitle>Dados do Representante</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="representative_name">Nome do Representante *</Label>
                  <Input
                    id="representative_name"
                    {...register('representative_name', { required: 'Nome é obrigatório' })}
                  />
                  {errors.representative_name && (
                    <p className="text-sm text-destructive">{errors.representative_name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="representative_birth_date">Data de Nascimento *</Label>
                  <Input
                    id="representative_birth_date"
                    type="date"
                    {...register('representative_birth_date', { required: 'Data de nascimento é obrigatória' })}
                  />
                  {errors.representative_birth_date && (
                    <p className="text-sm text-destructive">{errors.representative_birth_date.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="representative_gender">Gênero *</Label>
                  <Select onValueChange={(value) => setValue('representative_gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o gênero" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dados da Família */}
          <Card>
            <CardHeader>
              <CardTitle>Dados da Família</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="people_count">Número de Pessoas *</Label>
                  <Input
                    id="people_count"
                    type="number"
                    min="1"
                    {...register('people_count', { required: 'Número de pessoas é obrigatório', min: 1 })}
                  />
                  {errors.people_count && (
                    <p className="text-sm text-destructive">{errors.people_count.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="children_count">Número de Crianças</Label>
                  <Input
                    id="children_count"
                    type="number"
                    min="0"
                    {...register('children_count')}
                  />
                </div>

                <div>
                  <Label htmlFor="current_benefit">Benefício Atual</Label>
                  <Input
                    id="current_benefit"
                    {...register('current_benefit')}
                    placeholder="Ex: Bolsa Família, Auxílio Brasil"
                  />
                </div>

                <div>
                  <Label htmlFor="benefit_status">Status do Benefício</Label>
                  <Select onValueChange={(value) => setValue('benefit_status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="presence_status">Status de Presença</Label>
                  <Select onValueChange={(value) => setValue('presence_status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="present">Presente</SelectItem>
                      <SelectItem value="absent">Ausente</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="postal_code">CEP</Label>
                  <Input
                    id="postal_code"
                    {...register('postal_code')}
                    placeholder="12345-678"
                    disabled={addressLoading}
                  />
                  {addressLoading && <p className="text-sm text-muted-foreground">Buscando...</p>}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="street">Rua/Avenida</Label>
                  <Input
                    id="street"
                    {...register('street')}
                    placeholder="Nome da rua ou avenida"
                  />
                </div>

                <div>
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    {...register('number')}
                    placeholder="123"
                  />
                </div>

                <div>
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    id="complement"
                    {...register('complement')}
                    placeholder="Apto, casa, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="district">Bairro</Label>
                  <Input
                    id="district"
                    {...register('district')}
                    placeholder="Nome do bairro"
                  />
                </div>

                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    {...register('city')}
                    placeholder="Nome da cidade"
                  />
                </div>

                <div>
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    {...register('state')}
                    placeholder="SP"
                    maxLength={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card>
            <CardHeader>
              <CardTitle>Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_type">Tipo de Contato</Label>
                  <Select onValueChange={(value) => setValue('contact_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phone">Telefone</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="contact_value">Contato</Label>
                  <Input
                    id="contact_value"
                    {...register('contact_value')}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="contact_note">Observações</Label>
                  <Textarea
                    id="contact_note"
                    {...register('contact_note')}
                    placeholder="Observações sobre a família..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Crianças */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Crianças (Opcional)</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addChild}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Criança
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {fields.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhuma criança adicionada
                </p>
              ) : (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Criança {index + 1}</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`children.${index}.name`}>Nome</Label>
                          <Input
                            {...register(`children.${index}.name` as const, { required: 'Nome é obrigatório' })}
                            placeholder="Nome da criança"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`children.${index}.birth_date`}>Data de Nascimento</Label>
                          <Input
                            type="date"
                            {...register(`children.${index}.birth_date` as const, { required: 'Data é obrigatória' })}
                          />
                        </div>

                        <div>
                          <Label htmlFor={`children.${index}.gender`}>Gênero</Label>
                          <Select onValueChange={(value) => setValue(`children.${index}.gender`, value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="masculino">Masculino</SelectItem>
                              <SelectItem value="feminino">Feminino</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor={`children.${index}.relationship`}>Parentesco</Label>
                          <Select onValueChange={(value) => setValue(`children.${index}.relationship`, value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="filho">Filho(a)</SelectItem>
                              <SelectItem value="neto">Neto(a)</SelectItem>
                              <SelectItem value="sobrinho">Sobrinho(a)</SelectItem>
                              <SelectItem value="outro">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-warm-orange hover:bg-warm-orange/90" disabled={isLoading}>
              {isLoading ? 'Salvando...' : (mode === 'create' ? 'Cadastrar' : 'Atualizar')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
