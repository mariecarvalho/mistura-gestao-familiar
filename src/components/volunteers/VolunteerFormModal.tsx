
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppStore } from '@/store/useAppStore';
import { toast } from '@/components/ui/use-toast';

interface VolunteerFormData {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  availability: string[];
  isActive: boolean;
}

interface VolunteerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  volunteer?: any;
  mode: 'create' | 'edit';
}

const skillsOptions = [
  'Cozinha', 'Logística', 'Atendimento', 'Transporte', 'Organização', 'Limpeza'
];

const availabilityOptions = [
  'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'
];

export function VolunteerFormModal({ isOpen, onClose, volunteer, mode }: VolunteerFormModalProps) {
  const { addVolunteer, updateVolunteer } = useAppStore();
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<VolunteerFormData>();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);

  useEffect(() => {
    if (volunteer && mode === 'edit') {
      setValue('name', volunteer.name);
      setValue('email', volunteer.email);
      setValue('phone', volunteer.phone);
      setValue('isActive', volunteer.isActive);
      setSelectedSkills(volunteer.skills || []);
      setSelectedAvailability(volunteer.availability || []);
    }
  }, [volunteer, mode, setValue]);

  const handleSkillChange = (skill: string, checked: boolean) => {
    if (checked) {
      setSelectedSkills([...selectedSkills, skill]);
    } else {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    }
  };

  const handleAvailabilityChange = (day: string, checked: boolean) => {
    if (checked) {
      setSelectedAvailability([...selectedAvailability, day]);
    } else {
      setSelectedAvailability(selectedAvailability.filter(d => d !== day));
    }
  };

  const onSubmit = (data: VolunteerFormData) => {
    const volunteerData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      skills: selectedSkills,
      availability: selectedAvailability,
      isActive: data.isActive,
    };

    if (mode === 'create') {
      addVolunteer(volunteerData);
      toast({
        title: "Voluntário cadastrado",
        description: "O voluntário foi cadastrado com sucesso.",
      });
    } else {
      updateVolunteer(volunteer.id, volunteerData);
      toast({
        title: "Voluntário atualizado",
        description: "Os dados do voluntário foram atualizados com sucesso.",
      });
    }

    reset();
    setSelectedSkills([]);
    setSelectedAvailability([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Cadastrar Novo Voluntário' : 'Editar Voluntário'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                {...register('name', { required: 'Nome é obrigatório' })}
                placeholder="Nome completo do voluntário"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', { required: 'Email é obrigatório' })}
                  placeholder="email@exemplo.com"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  {...register('phone', { required: 'Telefone é obrigatório' })}
                  placeholder="(11) 99999-9999"
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label>Habilidades</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {skillsOptions.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={skill}
                      checked={selectedSkills.includes(skill)}
                      onCheckedChange={(checked) => handleSkillChange(skill, checked as boolean)}
                    />
                    <Label htmlFor={skill} className="text-sm font-normal">
                      {skill}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Disponibilidade</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availabilityOptions.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={selectedAvailability.includes(day)}
                      onCheckedChange={(checked) => handleAvailabilityChange(day, checked as boolean)}
                    />
                    <Label htmlFor={day} className="text-sm font-normal">
                      {day}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                {...register('isActive')}
                defaultChecked={mode === 'create'}
              />
              <Label htmlFor="isActive">Voluntário ativo</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-warm-orange hover:bg-warm-orange/90">
              {mode === 'create' ? 'Cadastrar' : 'Atualizar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
