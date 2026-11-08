
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Calendar, Users, Edit, Trash2, ClipboardList, Soup } from 'lucide-react';
import { ActionFormModal } from '@/components/actions/ActionFormModal';
import { ActionDeleteModal } from '@/components/actions/ActionDeleteModal';
import { ActionPresenceModal } from '@/components/actions/ActionPresenceModal';
import { actionService } from '@/services/api/actions';
import { Action } from '@/models/Action';
import { config } from '@/config/environment';
import { authHeaders } from '@/services/api/headers';

interface PresenceSummary {
  families_present: number;
  meals_realized: number;
}

export function Actions() {
  const [actions, setActions] = useState<Action[]>([]);
  const [summaries, setSummaries] = useState<Record<string, PresenceSummary>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [isPresenceModalOpen, setIsPresenceModalOpen] = useState(false);
  const [presenceAction, setPresenceAction] = useState<Action | null>(null);

  const fetchActions = async () => {
    try {
      const data = await actionService.getAll();
      setActions(data);
      // Fetch presence summaries for completed actions
      const completed = data.filter((a: Action) => a.status === 'completed');
      const results = await Promise.all(
        completed.map((a: Action) =>
          fetch(`${config.API_BASE_URL}/actions/${a.id}/presence/summary`, { headers: authHeaders() })
            .then(r => r.ok ? r.json() : { families_present: 0, meals_realized: 0 })
            .catch(() => ({ families_present: 0, meals_realized: 0 }))
        )
      );
      const map: Record<string, PresenceSummary> = {};
      completed.forEach((a: Action, i: number) => { map[a.id] = results[i]; });
      setSummaries(map);
    } catch (error) {
      console.error('Erro ao buscar ações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
  }, []);

  const filteredActions = actions.filter(action =>
    action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    action.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateAction = () => {
    setSelectedAction(null);
    setIsFormModalOpen(true);
  };

  const handleEditAction = (action: Action) => {
    setSelectedAction(action);
    setIsFormModalOpen(true);
  };

  const handleDeleteAction = (action: Action) => {
    setSelectedAction(action);
    setIsDeleteModalOpen(true);
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Ações</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Gerencie as ações de distribuição de marmitas
          </p>
        </div>
        <Button
          className="bg-warm-orange hover:bg-warm-orange/90 w-full sm:w-auto shrink-0"
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
          {isLoading ? (
            <p className="text-center py-12 text-muted-foreground">Carregando...</p>
          ) : filteredActions.length === 0 ? (
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
              {filteredActions.map((action) => {
                const summary = summaries[action.id];
                return (
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-sm text-foreground">
                            {new Date(action.date).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-sm text-foreground">
                            {action.volunteer_count} voluntários
                          </span>
                        </div>
                        {/* Famílias: Previsto / Realizado */}
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-sm text-foreground">
                            {summary ? (
                              <>
                                <span className="text-muted-foreground">Prev:</span> {action.families_served}{' '}
                                <span className="text-muted-foreground">· Real:</span>{' '}
                                <span className="font-medium text-green-700">{summary.families_present}</span>
                              </>
                            ) : (
                              <>{action.families_served} famílias</>
                            )}
                          </span>
                        </div>
                        {/* Marmitas: Previsto / Realizado */}
                        <div className="flex items-center gap-2">
                          <Soup className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-sm text-foreground">
                            {summary ? (
                              <>
                                <span className="text-muted-foreground">Real:</span>{' '}
                                <span className="font-medium text-orange-600">{summary.meals_realized} marmitas</span>
                              </>
                            ) : (
                              <span className="text-muted-foreground">{action.type || 'Não informado'}</span>
                            )}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-border/50">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditAction(action)}
                          className="flex-1 min-w-[90px]"
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          title="Registrar presença"
                          onClick={() => { setPresenceAction(action); setIsPresenceModalOpen(true); }}
                          className="flex-1 min-w-[100px] text-warm-orange hover:text-warm-orange"
                        >
                          <ClipboardList className="h-3.5 w-3.5 mr-1" />
                          Presença
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAction(action)}
                          className="text-destructive hover:text-destructive px-3"
                          title="Excluir ação"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <ActionFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        action={selectedAction || undefined}
        onSave={fetchActions}
      />

      <ActionDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          fetchActions();
        }}
        action={selectedAction}
      />

      <ActionPresenceModal
        isOpen={isPresenceModalOpen}
        onClose={() => { setIsPresenceModalOpen(false); fetchActions(); }}
        action={presenceAction}
      />
    </div>
  );
}
