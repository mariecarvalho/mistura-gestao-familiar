import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Trash } from 'lucide-react';
import { Family, FamilyFormData } from '@/models/Family';
import { createFamily, updateFamily } from '@/services/families';
import { toast } from '@/hooks/use-toast';

interface FamilyFormModalProps {
  family?: Family;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function FamilyFormModal({ family, isOpen, onClose, onSave }: FamilyFormModalProps) {
  const [formData, setFormData] = useState({
    representative_name: family?.representative_name || '',
    representative_birth_date: family?.representative_birth_date || '',
    representative_gender: family?.representative_gender || 'Masculino',
    people_count: family?.people_count || 1,
    children_count: family?.children_count || 0,
    current_benefit: family?.current_benefit || '',
    benefit_status: family?.benefit_status || 'Ativo',
    presence_status: family?.presence_status || 'Regular',
    address: family?.address || {
      street: '',
      number: '',
      complement: '',
      district: '',
      city: '',
      state: '',
      postal_code: '',
    },
    contacts: family?.contacts || [],
    children: family?.children || [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
  };

  const handleContactChange = (index: number, field: string, value: string) => {
    const newContacts = [...formData.contacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setFormData(prev => ({ ...prev, contacts: newContacts }));
  };

  const handleAddContact = () => {
    setFormData(prev => ({
      ...prev,
      contacts: [...prev.contacts, { contact_type: '', contact_value: '', note: '' }]
    }));
  };

  const handleRemoveContact = (index: number) => {
    const newContacts = [...formData.contacts];
    newContacts.splice(index, 1);
    setFormData(prev => ({ ...prev, contacts: newContacts }));
  };

  const handleChildrenChange = (index: number, field: string, value: string) => {
    const newChildren = [...formData.children];
    newChildren[index] = { ...newChildren[index], [field]: value };
    setFormData(prev => ({ ...prev, children: newChildren }));
  };

  const handleAddChildren = () => {
    setFormData(prev => ({
      ...prev,
      children: [...prev.children, { name: '', birth_date: '', gender: 'Masculino' }]
    }));
  };

  const handleRemoveChildren = (index: number) => {
    const newChildren = [...formData.children];
    newChildren.splice(index, 1);
    setFormData(prev => ({ ...prev, children: newChildren }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const familyData: FamilyFormData = {
        representative_name: formData.representative_name,
        representative_birth_date: formData.representative_birth_date,
        representative_gender: formData.representative_gender,
        people_count: parseInt(formData.people_count.toString()),
        children_count: parseInt(formData.children_count.toString()),
        current_benefit: formData.current_benefit,
        benefit_status: formData.benefit_status,
        presence_status: formData.presence_status,
        address: formData.address,
        contacts: formData.contacts,
        children: formData.children,
      };

      if (family) {
        await updateFamily(family.id, familyData);
      } else {
        await createFamily(familyData);
      }
      
      onSave();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar família:', error);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle>{family ? 'Editar Família' : 'Cadastrar Nova Família'}</AlertDialogTitle>
          <AlertDialogDescription>
            Preencha os campos abaixo para {family ? 'editar' : 'cadastrar'} uma família.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="representative_gender">Gênero</Label>
                <Select value={formData.representative_gender} onValueChange={(value: string) => setFormData(prev => ({ ...prev, representative_gender: value as 'Masculino' | 'Feminino' }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
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
                  value={formData.people_count}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="children_count">Número de Crianças</Label>
                <Input
                  id="children_count"
                  type="number"
                  name="children_count"
                  value={formData.children_count}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="current_benefit">Benefício Atual</Label>
                <Input
                  id="current_benefit"
                  name="current_benefit"
                  value={formData.current_benefit}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="benefit_status">Status do Benefício</Label>
                <Select value={formData.benefit_status} onValueChange={(value: string) => setFormData(prev => ({ ...prev, benefit_status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="presence_status">Status de Presença</Label>
                <Select value={formData.presence_status} onValueChange={(value: string) => setFormData(prev => ({ ...prev, presence_status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Regular">Regular</SelectItem>
                    <SelectItem value="Irregular">Irregular</SelectItem>
                    <SelectItem value="Novo">Novo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-semibold">Endereço</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="street">Rua</Label>
                  <Input
                    id="street"
                    name="street"
                    value={formData.address.street}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    name="number"
                    value={formData.address.number}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    id="complement"
                    name="complement"
                    value={formData.address.complement}
                    onChange={handleAddressChange}
                  />
                </div>
                <div>
                  <Label htmlFor="district">Bairro</Label>
                  <Input
                    id="district"
                    name="district"
                    value={formData.address.district}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.address.city}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.address.state}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="postal_code">CEP</Label>
                <Input
                  id="postal_code"
                  name="postal_code"
                  value={formData.address.postal_code}
                  onChange={handleAddressChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-semibold">Contatos</h4>
              {formData.contacts.map((contact, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <Label htmlFor={`contact_type_${index}`}>Tipo de Contato</Label>
                    <Input
                      id={`contact_type_${index}`}
                      type="text"
                      value={contact.contact_type}
                      onChange={(e) => handleContactChange(index, 'contact_type', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`contact_value_${index}`}>Contato</Label>
                    <Input
                      id={`contact_value_${index}`}
                      type="text"
                      value={contact.contact_value}
                      onChange={(e) => handleContactChange(index, 'contact_value', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveContact(index)}>
                      <Trash className="h-4 w-4 mr-2" />
                      Remover
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="button" variant="secondary" size="sm" onClick={handleAddContact}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Contato
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-semibold">Filhos</h4>
              {formData.children.map((child, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <Label htmlFor={`child_name_${index}`}>Nome</Label>
                    <Input
                      id={`child_name_${index}`}
                      type="text"
                      value={child.name}
                      onChange={(e) => handleChildrenChange(index, 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`child_birth_date_${index}`}>Data de Nascimento</Label>
                    <Input
                      id={`child_birth_date_${index}`}
                      type="date"
                      value={child.birth_date}
                      onChange={(e) => handleChildrenChange(index, 'birth_date', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`child_gender_${index}`}>Gênero</Label>
                    <Select value={child.gender} onValueChange={(value: string) => {
                      const newChildren = [...formData.children];
                      newChildren[index] = { ...newChildren[index], gender: value as 'Masculino' | 'Feminino' };
                      setFormData(prev => ({ ...prev, children: newChildren }));
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Masculino">Masculino</SelectItem>
                        <SelectItem value="Feminino">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveChildren(index)}>
                      <Trash className="h-4 w-4 mr-2" />
                      Remover
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="button" variant="secondary" size="sm" onClick={handleAddChildren}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Filho
              </Button>
            </div>
          </form>
        </CardContent>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button type="submit" onClick={handleSubmit}>Salvar</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
