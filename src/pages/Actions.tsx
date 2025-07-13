
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Calendar, MapPin, Users, Edit, Trash2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { ActionFormModal } from '@/components/actions/ActionFormModal';
import { ActionDeleteModal } from '@/components/actions/ActionDeleteModal';

export function Actions() {
  const { actions } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);

  const filteredActions = actions.filter(action =>
    action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    action.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateAction = () => {
    setSelectedAction(null);
    setIsFormModalOpen(true);
  };

  const handleEditAction = (action: any) => {
    setSelectedAction(action);
    setIsFormModalOpen(true);
  };

  const handleDeleteAction = (action: any) => {
    setSelectedAction(action);
    setIsDeleteModalOpen(true);
  };

  const handleSaveAction = () => {
    // Aqui você pode recarregar as ações se necessário
    console.log('Ação salva com sucesso');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-warm-yellow text-yellow-800';
      case 'completed': return 'bg-soft-green text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planned': return 'Planejada';
      case 'in-progress': return 'Em Andamento';
      case 'completed': return 'Concluída';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ações</h1>
          <p className="text-muted-foreground">
            Gerencie as ações de distribuição de marmitas
          </p>
        </div>
        <Button 
          className="bg-warm-orange hover:bg-warm-orange/90"
          onClick={handleCreateAction}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Ação
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar ações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredActions.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhuma ação encontrada
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Tente buscar com outros termos.' : 'Comece planejando sua primeira ação.'}
              </p>
              <Button 
                className="bg-warm-orange hover:bg-warm-orange/90"
                onClick={handleCreateAction}
              >
                <Plus className="h-4 w-4 mr-2" />
                Planejar Ação
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredActions.map((action) => (
                <Card key={action.id} className="border-border">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl text-foreground">{action.title}</CardTitle>
                          <Badge className={getStatusColor(action.status)}>
                            {getStatusText(action.status)}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          {new Date(action.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{action.location || 'Não informado'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          {action.families?.length || 0} famílias
                        </span>
                      </div>
                      <div className="text-sm text-foreground">
                        <strong>Marmitas:</strong> {action.mealsDistributed || 0}/{action.mealsPlanned || 0}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditAction(action)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteAction(action)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Excluir
                      </Button>
                      {action.status === 'planned' && (
                        <Button size="sm" className="bg-warm-orange hover:bg-warm-orange/90">
                          Iniciar Ação
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ActionFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        action={selectedAction}
        onSave={handleSaveAction}
      />

      <ActionDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        action={selectedAction}
      />
    </div>
  );
}
