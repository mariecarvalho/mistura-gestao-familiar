
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/store/useAppStore';
import { toast } from '@/components/ui/use-toast';
import { familyService } from '@/services/api';
import { transformFamilyDataForAPI, transformAPIFamilyToForm } from '@/utils/dataTransformers';

interface FamilyFormData {
  representative_name: string;
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
}

interface FamilyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  family?: any;
  mode: 'create' | 'edit';
}

export function FamilyFormModal({ isOpen, onClose, family, mode }: FamilyFormModalProps) {
  const { addFamily, updateFamily } = useAppStore();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FamilyFormData>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (family && mode === 'edit') {
      const formData = transformAPIFamilyToForm(family);
      Object.keys(formData).forEach((key) => {
        setValue(key as keyof FamilyFormData, formData[key]);
      });
    }
  }, [family, mode, setValue]);

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Cadastrar Nova Família' : 'Editar Família'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Dados Básicos */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Dados Básicos</h3>
            
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Endereço</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <div>
                <Label htmlFor="postal_code">CEP</Label>
                <Input
                  id="postal_code"
                  {...register('postal_code')}
                  placeholder="12345-678"
                />
              </div>
            </div>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contato</h3>
            
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
          </div>

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
