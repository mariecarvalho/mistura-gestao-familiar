
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
import { Plus, Trash, AlertTriangle, Loader2 } from 'lucide-react';
import { FamilyFormData, FamilyOutput } from '@/models/Family';
import { Child } from '@/models/Child';
import { useCep } from '@/hooks/use-cep';
import { familyService } from '@/services/api/family';
import { calculateAge, getChildStatus, isChildAdult } from '@/utils/childUtils';

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

export function FamilyFormModal({ family, isOpen, onClose, onSave }: FamilyFormModalProps) {
  const { fetchCep, loading: cepLoading, error: cepError } = useCep();

  const [formData, setFormData] = useState<FamilyFormData>({
    representative_name: family?.representative_name || '',
    representative_birth_date: family?.representative_birth_date || '',
    representative_gender: family?.representative_gender || 'Masculino',
    people_count: family?.people_count || 1,
    children_count: family?.children_count || 0,
    current_benefit: Array.isArray(family?.current_benefit) ? family.current_benefit : [],
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

  useEffect(() => {
    if (family) {
      setFormData({
        representative_name: family.representative_name,
        representative_birth_date: family.representative_birth_date,
        representative_gender: family.representative_gender,
        people_count: family.people_count,
        children_count: family.children_count,
        current_benefit: Array.isArray(family.current_benefit) ? family.current_benefit : [],
        benefit_status: family.benefit_status,
        presence_status: family.presence_status,
        address: family.address,
        contacts: family.contacts,
        children: family.children,
      });
    }
  }, [family]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, postal_code: cep }
    }));

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
    const newContacts = [...formData.contacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setFormData(prev => ({ ...prev, contacts: newContacts }));
  };

  const handleAddContact = () => {
    setFormData(prev => ({
      ...prev,
      contacts: [...prev.contacts, { contact_type: '', contact_value: '', contact_note: '' }]
    }));
  };

  const handleRemoveContact = (index: number) => {
    const newContacts = [...formData.contacts];
    newContacts.splice(index, 1);
    setFormData(prev => ({ ...prev, contacts: newContacts }));
  };

  const handleChildrenChange = (index: number, field: string, value: string) => {
    const newChildren = [...formData.children];
    const updatedChild = { ...newChildren[index], [field]: value };
    
    if (field === 'birth_date') {
      updatedChild.status = getChildStatus(value);
      updatedChild.age = calculateAge(value);
    }
    
    newChildren[index] = updatedChild;
    setFormData(prev => ({ ...prev, children: newChildren }));
  };

  const handleAddChildren = () => {
    const newChild: Child = {
      name: '',
      birth_date: '',
      relationship: 'Filho(a)',
      gender: 'Masculino',
      status: 'Ativo'
    };
    
    setFormData(prev => ({
      ...prev,
      children: [...prev.children, newChild]
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
        await familyService.update(family.id, familyData);
      } else {
        await familyService.create(familyData);
      }
      
      if (onSave) {
        onSave();
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar família:', error);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>{family ? 'Editar Família' : 'Cadastrar Nova Família'}</AlertDialogTitle>
          <AlertDialogDescription>
            Preencha os campos abaixo para {family ? 'editar' : 'cadastrar'} uma família.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados do Representante */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">Dados do Representante</h3>
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

                <div className="space-y-2">
                  <Label htmlFor="representative_gender">Gênero</Label>
                  <Select 
                    value={formData.representative_gender} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, representative_gender: value as 'Masculino' | 'Feminino' }))}
                  >
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
                    min="1"
                    value={formData.people_count}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">Endereço</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
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
                      {cepLoading && (
                        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin" />
                      )}
                    </div>
                    {cepError && (
                      <p className="text-sm text-destructive">{cepError}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="street">Rua</Label>
                    <Input
                      id="street"
                      name="street"
                      value={formData.address.street}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="complement">Complemento</Label>
                    <Input
                      id="complement"
                      name="complement"
                      value={formData.address.complement}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">Bairro</Label>
                    <Input
                      id="district"
                      name="district"
                      value={formData.address.district}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.address.city}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
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
                          onCheckedChange={(checked) => handleBenefitChange(benefit, checked as boolean)}
                        />
                        <Label htmlFor={benefit} className="text-sm font-normal">
                          {benefit}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="benefit_status">Status do Benefício</Label>
                  <Select 
                    value={formData.benefit_status} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, benefit_status: value }))}
                  >
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
              </div>
            </CardContent>
          </Card>

          {/* Contatos */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Contatos</h3>
                <Button type="button" variant="outline" size="sm" onClick={handleAddContact}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Contato
                </Button>
              </div>
              
              <div className="space-y-4">
                {formData.contacts.map((contact, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor={`contact_type_${index}`}>Tipo</Label>
                      <Select
                        value={contact.contact_type}
                        onValueChange={(value) => handleContactChange(index, 'contact_type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Telefone">Telefone</SelectItem>
                          <SelectItem value="Celular">Celular</SelectItem>
                          <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                          <SelectItem value="Email">Email</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`contact_value_${index}`}>Contato</Label>
                      <Input
                        id={`contact_value_${index}`}
                        value={contact.contact_value}
                        onChange={(e) => handleContactChange(index, 'contact_value', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`contact_note_${index}`}>Observação</Label>
                      <Input
                        id={`contact_note_${index}`}
                        value={contact.contact_note || ''}
                        onChange={(e) => handleContactChange(index, 'contact_note', e.target.value)}
                      />
                    </div>
                    
                    <div className="flex items-end">
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleRemoveContact(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {formData.contacts.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhum contato adicionado
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Crianças */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Crianças</h3>
                <Button type="button" variant="outline" size="sm" onClick={handleAddChildren}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Criança
                </Button>
              </div>
              
              <div className="space-y-4">
                {formData.children.map((child, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`child_name_${index}`}>Nome</Label>
                        <Input
                          id={`child_name_${index}`}
                          value={child.name}
                          onChange={(e) => handleChildrenChange(index, 'name', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`child_birth_date_${index}`}>Data de Nascimento</Label>
                        <Input
                          id={`child_birth_date_${index}`}
                          type="date"
                          value={child.birth_date}
                          onChange={(e) => handleChildrenChange(index, 'birth_date', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`child_gender_${index}`}>Gênero</Label>
                        <Select
                          value={child.gender}
                          onValueChange={(value) => handleChildrenChange(index, 'gender', value)}
                        >
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
                        <Label htmlFor={`child_relationship_${index}`}>Parentesco</Label>
                        <Select
                          value={child.relationship}
                          onValueChange={(value) => handleChildrenChange(index, 'relationship', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Filho(a)">Filho(a)</SelectItem>
                            <SelectItem value="Neto(a)">Neto(a)</SelectItem>
                            <SelectItem value="Sobrinho(a)">Sobrinho(a)</SelectItem>
                            <SelectItem value="Outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {child.birth_date && isChildAdult(child.birth_date) && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Esta pessoa tem {calculateAge(child.birth_date)} anos e foi marcada como inativa. 
                          Para maiores de 18 anos, é recomendado fazer um cadastro próprio.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          child.status === 'Ativo' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {child.status}
                        </span>
                        {child.age !== undefined && (
                          <span className="text-sm text-muted-foreground">
                            ({child.age} anos)
                          </span>
                        )}
                      </div>
                      
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleRemoveChildren(index)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Remover
                      </Button>
                    </div>
                  </div>
                ))}
                
                {formData.children.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhuma criança adicionada
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button type="submit" onClick={handleSubmit}>
            {family ? 'Salvar' : 'Cadastrar'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
