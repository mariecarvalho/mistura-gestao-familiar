import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Search, Pencil, Trash2, HandCoins, Loader2, TrendingUp, Clock } from 'lucide-react';
import { donationService } from '@/services/api/donations';
import { toast } from '@/components/ui/use-toast';

interface Donation {
  id: string;
  type: string;
  amount: string;
  description: string;
  date: string;
  status: 'Recebido' | 'Pendente';
  created_at: string;
}

const EMPTY_FORM = { type: '', amount: '', description: '', date: '', status: 'Recebido' };

export function Donations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Donation | null>(null);
  const [form, setForm] = useState<typeof EMPTY_FORM>({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setDonations(await donationService.getAll());
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setSelected(null); setForm({ ...EMPTY_FORM }); setFormOpen(true); };
  const openEdit   = (d: Donation) => {
    setSelected(d);
    setForm({ type: d.type, amount: d.amount, description: d.description ?? '', date: d.date?.slice(0,10) ?? '', status: d.status });
    setFormOpen(true);
  };
  const openDelete = (d: Donation) => { setSelected(d); setDeleteOpen(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (selected) {
        await donationService.update(selected.id, form);
        toast({ title: 'Arrecadação atualizada' });
      } else {
        await donationService.create(form);
        toast({ title: 'Arrecadação registrada' });
      }
      setFormOpen(false);
      load();
    } catch {
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      await donationService.delete(selected.id);
      toast({ title: 'Arrecadação removida', variant: 'destructive' });
      setDeleteOpen(false);
      load();
    } catch {
      toast({ title: 'Erro ao remover', variant: 'destructive' });
    }
  };

  const filtered = donations.filter(d =>
    d.type.toLowerCase().includes(search.toLowerCase()) ||
    (d.description ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const totalReceived = donations
    .filter(d => d.status === 'Recebido')
    .reduce((s, d) => s + Number(d.amount), 0);

  const totalPending = donations
    .filter(d => d.status === 'Pendente')
    .reduce((s, d) => s + Number(d.amount), 0);

  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Arrecadações</h1>
          <p className="text-muted-foreground">Registre doações e entradas no caixa do projeto</p>
        </div>
        <Button className="bg-warm-orange hover:bg-warm-orange/90" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" /> Nova Arrecadação
        </Button>
      </div>

      {/* Cards de totais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Recebido</CardTitle>
            <div className="w-10 h-10 rounded-lg bg-soft-green flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{fmt(totalReceived)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendente</CardTitle>
            <div className="w-10 h-10 rounded-lg bg-warm-yellow flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{fmt(totalPending)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Registros</CardTitle>
            <div className="w-10 h-10 rounded-lg bg-warm-orange flex items-center justify-center">
              <HandCoins className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donations.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista */}
      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por tipo ou descrição..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <HandCoins className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {search ? 'Nenhum resultado.' : 'Nenhuma arrecadação registrada ainda.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(d => (
                <div key={d.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-foreground truncate">{d.type}</span>
                      <Badge className={d.status === 'Recebido' ? 'bg-soft-green text-green-800' : 'bg-warm-yellow text-yellow-800'}>
                        {d.status}
                      </Badge>
                    </div>
                    {d.description && (
                      <p className="text-sm text-muted-foreground truncate">{d.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(d.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <span className="text-lg font-bold text-green-700 whitespace-nowrap">{fmt(Number(d.amount))}</span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(d)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => openDelete(d)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal cadastro/edição */}
      <AlertDialog open={formOpen} onOpenChange={setFormOpen}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>{selected ? 'Editar Arrecadação' : 'Nova Arrecadação'}</AlertDialogTitle>
            <AlertDialogDescription>Preencha os dados da arrecadação ou doação.</AlertDialogDescription>
          </AlertDialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo *</Label>
              <Input
                placeholder="Ex: Doação, Rifa, Evento, Bazar..."
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor (R$) *</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0,00"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Data *</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Recebido">Recebido</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                placeholder="Detalhes sobre a arrecadação, quem doou, etc."
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel type="button">Cancelar</AlertDialogCancel>
              <Button type="submit" className="bg-warm-orange hover:bg-warm-orange/90" disabled={saving}>
                {saving ? 'Salvando...' : selected ? 'Salvar' : 'Registrar'}
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal exclusão */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Remover a arrecadação <strong>{selected?.type}</strong> de <strong>{fmt(Number(selected?.amount ?? 0))}</strong>? Esta ação não pode ser desfeita.
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
    </div>
  );
}
