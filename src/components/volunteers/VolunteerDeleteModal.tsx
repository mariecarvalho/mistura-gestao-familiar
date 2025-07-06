
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAppStore } from '@/store/useAppStore';
import { toast } from '@/components/ui/use-toast';

interface VolunteerDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  volunteer: any;
}

export function VolunteerDeleteModal({ isOpen, onClose, volunteer }: VolunteerDeleteModalProps) {
  const { removeVolunteer } = useAppStore();

  const handleDelete = () => {
    removeVolunteer(volunteer.id);
    toast({
      title: "Voluntário removido",
      description: "O voluntário foi removido com sucesso.",
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
            Tem certeza que deseja excluir o voluntário <strong>{volunteer?.name}</strong>?
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
