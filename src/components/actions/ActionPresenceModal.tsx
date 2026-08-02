import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { config } from '@/config/environment';
import { authHeaders } from '@/services/api/headers';
import { Search, Loader2, Users } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface FamilyRow {
  id: string;
  representative_name: string;
  benefit_status: string;
  people_count: number;
  present: boolean;
  meals_taken: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  action: { id: string; title: string; date: string } | null;
}

export function ActionPresenceModal({ isOpen, onClose, action }: Props) {
  const [families, setFamilies] = useState<FamilyRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [changed, setChanged] = useState<Set<string>>(new Set());

  const load = async () => {
    if (!action) return;
    setLoading(true);
    try {
      const r = await fetch(`${config.API_BASE_URL}/actions/${action.id}/presence`, {
        headers: authHeaders(),
      });
      setFamilies(await r.json());
      setChanged(new Set());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (isOpen) load(); }, [isOpen, action?.id]);

  const toggle = (id: string) => {
    setFamilies(prev => prev.map(f =>
      f.id === id ? { ...f, present: !f.present } : f
    ));
    setChanged(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const setMeals = (id: string, value: number) => {
    setFamilies(prev => prev.map(f =>
      f.id === id ? { ...f, meals_taken: value } : f
    ));
    setChanged(prev => new Set(prev).add(id));
  };

  const handleSave = async () => {
    if (!action) return;
    setSaving(true);
    const date = action.date?.slice(0, 10) ?? new Date().toISOString().slice(0, 10);

    try {
      // Separate mark and unmark
      const toMark   = [...changed].filter(id => families.find(f => f.id === id)?.present);
      const toUnmark = [...changed].filter(id => !families.find(f => f.id === id)?.present);

      await Promise.all([
        ...toMark.map(id => {
          const f = families.find(fam => fam.id === id)!;
          return fetch(`${config.API_BASE_URL}/families/${id}/presence`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ actionId: action.id, date, mealsTaken: f.meals_taken }),
          });
        }),
        ...toUnmark.map(id =>
          fetch(`${config.API_BASE_URL}/families/${id}/presence`, {
            method: 'DELETE',
            headers: authHeaders(),
            body: JSON.stringify({ actionId: action.id }),
          })
        ),
      ]);

      toast({ title: 'Presenças salvas!', description: `${families.filter(f => f.present).length} famílias marcadas.` });
      setChanged(new Set());
      onClose();
    } catch {
      toast({ title: 'Erro ao salvar presenças', variant: 'destructive' });
    } finally { setSaving(false); }
  };

  const filtered = families.filter(f =>
    f.representative_name.toLowerCase().includes(search.toLowerCase())
  );

  const presentCount  = families.filter(f => f.present).length;
  const mealsRealized = families.filter(f => f.present).reduce((s, f) => s + (f.meals_taken || 0), 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Registrar Presença — {action?.title}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {new Date(action?.date ?? '').toLocaleDateString('pt-BR')} ·{' '}
            <span className="font-medium text-green-700">{presentCount} presente{presentCount !== 1 ? 's' : ''}</span>
            {' / '}{families.length} famílias
            {presentCount > 0 && (
              <> · <span className="font-medium text-orange-600">{mealsRealized} marmita{mealsRealized !== 1 ? 's' : ''}</span></>
            )}
          </p>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar família..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1 min-h-0">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2" />
              <p>Nenhuma família encontrada</p>
            </div>
          ) : filtered.map(f => (
            <div
              key={f.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                f.present ? 'bg-green-50 border-green-200' : 'hover:bg-muted border-transparent'
              }`}
            >
              <Checkbox
                checked={f.present}
                onCheckedChange={() => toggle(f.id)}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{f.representative_name}</p>
                <p className="text-xs text-muted-foreground">{f.people_count} membros</p>
              </div>
              <Badge className={f.benefit_status === 'Ativo' ? 'bg-soft-green text-green-800' : 'bg-slate-100 text-slate-500'}>
                {f.benefit_status}
              </Badge>
              {f.present && (
                <div className="flex items-center gap-1 shrink-0">
                  <label className="text-xs text-muted-foreground whitespace-nowrap">Marmitas:</label>
                  <Input
                    type="number"
                    min={0}
                    value={f.meals_taken}
                    onChange={e => setMeals(f.id, Number(e.target.value))}
                    onClick={e => e.stopPropagation()}
                    className="w-16 h-7 text-sm px-2"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <DialogFooter className="pt-2 border-t">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button
            className="bg-warm-orange hover:bg-warm-orange/90"
            onClick={handleSave}
            disabled={saving || changed.size === 0}
          >
            {saving ? 'Salvando...' : `Salvar (${changed.size} alteração${changed.size !== 1 ? 'ões' : ''})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
