
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAppStore } from '@/store/useAppStore';
import { toast } from '@/components/ui/use-toast';

interface FamilyDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  family: any;
}

export function FamilyDeleteModal({ isOpen, onClose, family }: FamilyDeleteModalProps) {
  const { removeFamily } = useAppStore();

  const handleDelete = () => {
    removeFamily(family.id);
    toast({
      title: "Família removida",
      description: "A família foi removida com sucesso.",
      variant: "destructive"
    });
    onClose();
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
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
