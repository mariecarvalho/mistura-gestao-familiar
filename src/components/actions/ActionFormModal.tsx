
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
import { actionService } from '@/services/api/actions';
import { transformActionDataForAPI, transformAPIActionToForm } from '@/utils/dataTransformers';

interface ActionFormData {
  title: string;
  description: string;
  date: string;
  location: string;
  mealsPlanned: number;
  mealsDistributed?: number;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  dish_of_the_day: string;
  action_cost: number;
}

interface ActionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  action?: any;
  mode: 'create' | 'edit';
}

export function ActionFormModal({ isOpen, onClose, action, mode }: ActionFormModalProps) {
  const { addAction, updateAction } = useAppStore();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ActionFormData>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (action && mode === 'edit') {
      const formData = transformAPIActionToForm(action);
      Object.keys(formData).forEach((key) => {
        setValue(key as keyof ActionFormData, formData[key]);
      });
    }
  }, [action, mode, setValue]);

  const onSubmit = async (data: ActionFormData) => {
    setIsLoading(true);
    
    try {
      const apiData = transformActionDataForAPI(data);
      
      if (mode === 'create') {
        const response = await actionService.create(apiData);
        addAction({
          id: response.id,
          title: data.title,
          description: data.description,
          date: new Date(data.date),
          location: data.location,
          mealsPlanned: data.mealsPlanned,
          mealsDistributed: data.mealsDistributed || 0,
          status: data.status,
          volunteers: [],
          families: [],
          dishOfTheDay: data.dish_of_the_day,
          actionCost: data.action_cost,
        });
        
        toast({
          title: "Ação cadastrada",
          description: "A ação foi cadastrada com sucesso.",
        });
      } else {
        await actionService.update(action.id, apiData);
        updateAction(action.id, {
          title: data.title,
          description: data.description,
          date: new Date(data.date),
          location: data.location,
          mealsPlanned: data.mealsPlanned,
          mealsDistributed: data.mealsDistributed || 0,
          status: data.status,
          dishOfTheDay: data.dish_of_the_day,
          actionCost: data.action_cost,
        });
        
        toast({
          title: "Ação atualizada",
          description: "Os dados da ação foram atualizados com sucesso.",
        });
      }

      reset();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar ação:', error);
      toast({
        title: "Erro",
        description: mode === 'create' ? "Erro ao cadastrar ação." : "Erro ao atualizar ação.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Cadastrar Nova Ação' : 'Editar Ação'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título da Ação *</Label>
              <Input
                id="title"
                {...register('title', { required: 'Título é obrigatório' })}
                placeholder="Ex: Distribuição de Marmitas - Centro"
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Descreva os detalhes da ação..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Data da Ação *</Label>
                <Input
                  id="date"
                  type="date"
                  {...register('date', { required: 'Data é obrigatória' })}
                />
                {errors.date && (
                  <p className="text-sm text-destructive">{errors.date.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="location">Local *</Label>
                <Input
                  id="location"
                  {...register('location', { required: 'Local é obrigatório' })}
                  placeholder="Ex: Praça Central"
                />
                {errors.location && (
                  <p className="text-sm text-destructive">{errors.location.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="dish_of_the_day">Prato do Dia *</Label>
              <Input
                id="dish_of_the_day"
                {...register('dish_of_the_day', { required: 'Prato do dia é obrigatório' })}
                placeholder="Ex: Frango com arroz e feijão"
              />
              {errors.dish_of_the_day && (
                <p className="text-sm text-destructive">{errors.dish_of_the_day.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mealsPlanned">Marmitas Planejadas *</Label>
                <Input
                  id="mealsPlanned"
                  type="number"
                  min="1"
                  {...register('mealsPlanned', { required: 'Número de marmitas é obrigatório', min: 1 })}
                />
                {errors.mealsPlanned && (
                  <p className="text-sm text-destructive">{errors.mealsPlanned.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="mealsDistributed">Marmitas Distribuídas</Label>
                <Input
                  id="mealsDistributed"
                  type="number"
                  min="0"
                  {...register('mealsDistributed')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="action_cost">Custo da Ação (R$) *</Label>
                <Input
                  id="action_cost"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('action_cost', { required: 'Custo da ação é obrigatório', min: 0 })}
                  placeholder="0,00"
                />
                {errors.action_cost && (
                  <p className="text-sm text-destructive">{errors.action_cost.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={(value) => setValue('status', value as any)}>
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
