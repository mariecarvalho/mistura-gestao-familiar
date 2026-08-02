import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { config } from '@/config/environment';
import { authHeaders } from '@/services/api/headers';
import { Calendar, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  family: any;
}

interface PresenceRecord {
  id: string;
  action_title: string;
  action_date: string;
  date: string;
  meals_taken: number;
}

interface PresenceStats {
  total_actions: number;
  attended: number;
  missed: number;
  attendance_pct: number;
  last_presence: string | null;
}

export function FamilyPresenceModal({ isOpen, onClose, family }: Props) {
  const [history, setHistory] = useState<PresenceRecord[]>([]);
  const [stats, setStats] = useState<PresenceStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !family?.id) return;
    setLoading(true);

    Promise.all([
      fetch(`${config.API_BASE_URL}/families/${family.id}/presence`, { headers: authHeaders() }).then(r => r.json()),
      fetch(`${config.API_BASE_URL}/families/${family.id}/presence/stats`, { headers: authHeaders() }).then(r => r.json()),
    ])
      .then(([hist, st]) => { setHistory(hist); setStats(st); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isOpen, family?.id]);

  const pct = Number(stats?.attendance_pct ?? 0);
  const pctColor = pct >= 75 ? 'text-green-600' : pct >= 50 ? 'text-yellow-600' : 'text-red-600';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-warm-orange" />
            Presença — {family?.representative_name}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <Tabs defaultValue="stats">
            <TabsList className="w-full">
              <TabsTrigger value="stats" className="flex-1">Resumo</TabsTrigger>
              <TabsTrigger value="history" className="flex-1">Histórico</TabsTrigger>
            </TabsList>

            {/* Resumo */}
            <TabsContent value="stats" className="space-y-4 pt-2">
              {!stats || Number(stats.total_actions) === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  <p>Nenhuma ação concluída registrada ainda.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-2xl font-bold">{stats.attended}</p>
                      <p className="text-xs text-muted-foreground">Presenças</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-red-500">{stats.missed}</p>
                      <p className="text-xs text-muted-foreground">Faltas</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className={`text-2xl font-bold ${pctColor}`}>{pct}%</p>
                      <p className="text-xs text-muted-foreground">Frequência</p>
                    </div>
                  </div>

                  {/* Barra de progresso */}
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Últimas {stats.total_actions} ações</span>
                      <span className={pctColor}>{pct}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${pct >= 75 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {stats.last_presence && (
                    <p className="text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4 inline mr-1" />
                      Última presença: <strong>{new Date(stats.last_presence).toLocaleDateString('pt-BR')}</strong>
                    </p>
                  )}

                  {pct === 0 && Number(stats.total_actions) > 0 && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      Esta família não apareceu nas últimas {stats.total_actions} ações.
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            {/* Histórico */}
            <TabsContent value="history" className="pt-2">
              {history.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">Nenhuma presença registrada.</p>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {history.map(h => (
                    <div key={h.id} className="flex items-center justify-between p-3 border rounded-lg text-sm">
                      <div>
                        <p className="font-medium">{h.action_title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(h.action_date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {h.meals_taken > 0 && (
                          <span className="text-xs text-orange-600 font-medium">{h.meals_taken} marmita{h.meals_taken !== 1 ? 's' : ''}</span>
                        )}
                        <Badge className="bg-soft-green text-green-800">Presente</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
