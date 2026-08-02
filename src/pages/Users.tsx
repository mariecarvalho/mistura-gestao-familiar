import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, UserCog, ToggleLeft, ToggleRight, Trash2, Loader2 } from 'lucide-react';
import { config } from '@/config/environment';
import { toast } from '@/components/ui/use-toast';

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'volunteer';
  is_active: boolean;
  created_at: string;
}

const EMPTY = { name: '', email: '', password: '', role: 'volunteer' };

export function Users() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AppUser | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem('auth_token');
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const load = async () => {
    try {
      const r = await fetch(`${config.API_BASE_URL}/users`, { headers });
      setUsers(await r.json());
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await fetch(`${config.API_BASE_URL}/users`, {
        method: 'POST', headers, body: JSON.stringify(form),
      });
      if (!r.ok) {
        const err = await r.json();
        toast({ title: err.error ?? 'Erro ao criar usuário', variant: 'destructive' });
        return;
      }
      toast({ title: 'Acesso criado com sucesso!' });
      setFormOpen(false);
      setForm({ ...EMPTY });
      load();
    } catch {
      toast({ title: 'Erro ao criar usuário', variant: 'destructive' });
    } finally { setSaving(false); }
  };

  const handleToggle = async (user: AppUser) => {
    try {
      const r = await fetch(`${config.API_BASE_URL}/users/${user.id}/toggle`, {
        method: 'PATCH', headers,
      });
      const updated = await r.json();
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
      toast({ title: updated.is_active ? 'Usuário ativado' : 'Usuário desativado' });
    } catch {
      toast({ title: 'Erro ao atualizar usuário', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`${config.API_BASE_URL}/users/${deleteTarget.id}`, {
        method: 'DELETE', headers,
      });
      toast({ title: 'Usuário removido', variant: 'destructive' });
      setDeleteTarget(null);
      load();
    } catch {
      toast({ title: 'Erro ao remover usuário', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gerenciar Acessos</h1>
          <p className="text-muted-foreground">Crie e gerencie usuários do portal</p>
        </div>
        <Button className="bg-warm-orange hover:bg-warm-orange/90" onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Novo Acesso
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UserCog className="h-5 w-5" /> Usuários cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-3">
              {users.map(user => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{user.name}</span>
                      <Badge className={user.role === 'admin'
                        ? 'bg-warm-orange text-white'
                        : 'bg-blue-100 text-blue-800'}>
                        {user.role === 'admin' ? 'Admin' : 'Voluntário'}
                      </Badge>
                      {!user.is_active && (
                        <Badge className="bg-slate-100 text-slate-600">Inativo</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Criado em {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost" size="icon"
                      title={user.is_active ? 'Desativar' : 'Ativar'}
                      onClick={() => handleToggle(user)}
                    >
                      {user.is_active
                        ? <ToggleRight className="h-5 w-5 text-green-600" />
                        : <ToggleLeft className="h-5 w-5 text-slate-400" />}
                    </Button>
                    <Button
                      variant="ghost" size="icon"
                      className="text-destructive"
                      onClick={() => setDeleteTarget(user)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal criar acesso */}
      <AlertDialog open={formOpen} onOpenChange={setFormOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Novo Acesso</AlertDialogTitle>
            <AlertDialogDescription>
              Crie um login para um voluntário do portal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input
                placeholder="Nome completo"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                placeholder="email@exemplo.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Senha inicial *</Label>
              <Input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                minLength={6}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Perfil</Label>
              <Select value={form.role} onValueChange={v => setForm(f => ({ ...f, role: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="volunteer">Voluntário (somente leitura)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel type="button">Cancelar</AlertDialogCancel>
              <Button type="submit" className="bg-warm-orange hover:bg-warm-orange/90" disabled={saving}>
                {saving ? 'Criando...' : 'Criar Acesso'}
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal confirmar exclusão */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Acesso</AlertDialogTitle>
            <AlertDialogDescription>
              Remover o acesso de <strong>{deleteTarget?.name}</strong>? O usuário não conseguirá mais fazer login.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
