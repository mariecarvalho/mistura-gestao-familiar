import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Clock, UserCheck, ClipboardList } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { config } from '@/config/environment';
import { authHeaders } from '@/services/api/headers';
import { Action } from '@/models/Action';
import { ActionPresenceModal } from '@/components/actions/ActionPresenceModal';

export function VolunteerPortal() {
  const { user } = useAuth();
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [presenceAction, setPresenceAction] = useState<Action | null>(null);

  const fetchActions = () => {
    fetch(`${config.API_BASE_URL}/actions`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => setActions(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchActions(); }, []);

  const upcoming = actions
    .filter(a => a.status === 'planned' || a.status === 'in-progress')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 10);

  const past = actions
    .filter(a => a.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const statusLabel: Record<string, string> = {
    planned:       'Planejada',
    'in-progress': 'Em Andamento',
    completed:     'Concluída',
    cancelled:     'Cancelada',
  };

  const statusColor: Record<string, string> = {
    planned:       'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    completed:     'bg-green-100 text-green-800',
    cancelled:     'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      {/* Perfil */}
      <div className="flex items-center gap-4 p-6 bg-warm-orange/10 rounded-xl border border-warm-orange/20">
        <div className="w-16 h-16 rounded-full bg-warm-orange flex items-center justify-center text-white text-2xl font-bold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{user?.name}</h1>
          <p className="text-muted-foreground">{user?.email}</p>
          <Badge className="mt-1 bg-warm-orange text-white">Voluntário</Badge>
        </div>
      </div>

      {/* Resumo rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Próximas Ações</CardTitle>
            <Calendar className="h-5 w-5 text-warm-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcoming.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ações Realizadas</CardTitle>
            <UserCheck className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{past.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Ações</CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{actions.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Próximas ações — com botão de presença para ações em andamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-warm-orange" />
            Próximas Ações
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-center py-8">Carregando...</p>
          ) : upcoming.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhuma ação planejada no momento.</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map(action => (
                <div key={action.id} className="flex items-start justify-between p-4 border rounded-lg gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-foreground">{action.title}</span>
                      <Badge className={statusColor[action.status] ?? ''}>
                        {statusLabel[action.status] ?? action.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(action.date).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {action.volunteer_count} voluntários esperados
                      </span>
                    </div>
                  </div>

                  {/* Botão de presença: disponível para ações em andamento E planejadas */}
                  <Button
                    size="sm"
                    className="bg-warm-orange hover:bg-warm-orange/90 shrink-0"
                    onClick={() => setPresenceAction(action)}
                  >
                    <ClipboardList className="h-4 w-4 mr-1" />
                    Registrar Presença
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ações recentes */}
      {past.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-green-600" />
              Ações Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {past.map(action => (
                <div key={action.id} className="flex items-center justify-between p-4 border rounded-lg bg-muted/40 gap-4">
                  <div>
                    <p className="font-medium text-foreground">{action.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(action.date).toLocaleDateString('pt-BR')} · {action.families_served} famílias previstas
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge className="bg-green-100 text-green-800">Concluída</Badge>
                    {/* Voluntário pode corrigir presenças mesmo após conclusão */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPresenceAction(action)}
                    >
                      <ClipboardList className="h-4 w-4 mr-1" />
                      Ver Presença
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de presença — reutiliza o mesmo do admin */}
      <ActionPresenceModal
        isOpen={!!presenceAction}
        onClose={() => { setPresenceAction(null); fetchActions(); }}
        action={presenceAction}
      />
    </div>
  );
}
