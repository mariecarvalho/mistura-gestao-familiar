
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Action, ActionFormData } from '@/models/Action';
import { actionService } from '@/services/api/actions';
import { toast } from '@/components/ui/use-toast';

interface ActionFormModalProps {
  action?: Action;
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

export function ActionFormModal({ action, isOpen, onClose, onSave }: ActionFormModalProps) {
  const [formData, setFormData] = useState<ActionFormData>({
    title: action?.title || '',
    description: action?.description || '',
    date: action?.date || '',
    type: action?.type || '',
    status: action?.status || 'planned',
    volunteer_count: action?.volunteer_count || 0,
    families_served: action?.families_served || 0,
    dishOfTheDay: action?.dishOfTheDay || '',
    actionCost: action?.actionCost || 0,
  });

  useEffect(() => {
    if (action) {
      setFormData({
        title: action.title,
        description: action.description,
        date: action.date,
        type: action.type,
        status: action.status,
        volunteer_count: action.volunteer_count,
        families_served: action.families_served,
        dishOfTheDay: action.dishOfTheDay || '',
        actionCost: action.actionCost || 0,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        date: '',
        type: '',
        status: 'planned',
        volunteer_count: 0,
        families_served: 0,
        dishOfTheDay: '',
        actionCost: 0,
      });
    }
  }, [action]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'volunteer_count' || name === 'families_served' || name === 'actionCost'
        ? Number(value) || 0
        : value
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (action) {
        await actionService.update(action.id, formData);
        toast({ title: 'Ação atualizada', description: 'Ação atualizada com sucesso.' });
      } else {
        await actionService.create(formData);
        toast({ title: 'Ação criada', description: 'Ação criada com sucesso.' });
      }
      if (onSave) onSave();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar ação:', error);
      toast({ title: 'Erro', description: 'Erro ao salvar ação.', variant: 'destructive' });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle>
            {action ? 'Editar Ação' : 'Nova Ação'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Preencha os campos abaixo para {action ? 'editar' : 'criar'} uma ação.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Distribuição de Marmitas">Distribuição de Marmitas</SelectItem>
                  <SelectItem value="Eventos de Arrecadação">Eventos de Arrecadação</SelectItem>
                  <SelectItem value="Eventos Parceiros">Eventos Parceiros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">Planejada</SelectItem>
                <SelectItem value="in-progress">Em Andamento</SelectItem>
                <SelectItem value="completed">Concluída</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="volunteer_count">Número de Voluntários</Label>
              <Input
                id="volunteer_count"
                name="volunteer_count"
                type="number"
                min="0"
                value={formData.volunteer_count}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="families_served">Número de Famílias Servidas</Label>
              <Input
                id="families_served"
                name="families_served"
                type="number"
                min="0"
                value={formData.families_served}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dishOfTheDay">Prato do Dia</Label>
            <Input
              id="dishOfTheDay"
              name="dishOfTheDay"
              value={formData.dishOfTheDay}
              onChange={handleInputChange}
              placeholder="Ex: Feijoada, Lasanha, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="actionCost">Custo da Ação (R$)</Label>
            <Input
              id="actionCost"
              name="actionCost"
              type="number"
              min="0"
              step="0.01"
              value={formData.actionCost}
              onChange={handleInputChange}
              placeholder="0.00"
            />
          </div>
          <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-3 border-t">
            <AlertDialogCancel type="button" onClick={onClose} className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
            <Button type="submit" className="bg-warm-orange hover:bg-warm-orange/90 w-full sm:w-auto">
              {action ? 'Salvar' : 'Criar'}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
