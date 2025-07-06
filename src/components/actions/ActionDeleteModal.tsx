
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAppStore } from '@/store/useAppStore';
import { toast } from '@/components/ui/use-toast';

interface ActionDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: any;
}

export function ActionDeleteModal({ isOpen, onClose, action }: ActionDeleteModalProps) {
  const { removeAction } = useAppStore();

  const handleDelete = () => {
    removeAction(action.id);
    toast({
      title: "Ação removida",
      description: "A ação foi removida com sucesso.",
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
            Tem certeza que deseja excluir a ação <strong>{action?.title}</strong>?
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
