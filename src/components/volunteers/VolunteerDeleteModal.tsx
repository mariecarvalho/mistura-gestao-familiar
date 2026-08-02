
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/use-toast';
import { volunteerService } from '@/services/api/volunteer';

interface VolunteerDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  volunteer: any;
}

export function VolunteerDeleteModal({ isOpen, onClose, volunteer }: VolunteerDeleteModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await volunteerService.delete(volunteer.id);
      toast({
        title: 'Voluntário removido',
        description: 'O voluntário foi removido com sucesso.',
        variant: 'destructive',
      });
      onClose();
    } catch (error) {
      console.error('Erro ao deletar voluntário:', error);
      toast({ title: 'Erro', description: 'Erro ao remover voluntário.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o voluntário <strong>{volunteer?.name}</strong>?
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/90"
            disabled={isLoading}
          >
            {isLoading ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
