
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAppStore } from '@/store/useAppStore';
import { toast } from '@/components/ui/use-toast';
import { familyService } from '@/services/api/family';

interface FamilyDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  family: any;
}

export function FamilyDeleteModal({ isOpen, onClose, family }: FamilyDeleteModalProps) {
  const { removeFamily } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
      console.log('family',family)
    try {
      await familyService.delete(family.id);
      removeFamily(family.id);
      
      toast({
        title: "Família removida",
        description: "A família foi removida com sucesso.",
        variant: "destructive"
      });
      
      onClose();
    } catch (error) {
      console.error('Erro ao deletar família:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover família.",
        variant: "destructive"
      });
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
            Tem certeza que deseja excluir a família <strong>{family?.name}</strong>?
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
