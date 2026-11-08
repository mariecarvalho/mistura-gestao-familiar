
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Users, ToggleLeft, ToggleRight, ClipboardList } from 'lucide-react';
import { FamilyFormModal } from '@/components/families/FamilyFormModal';
import { FamilyDeleteModal } from '@/components/families/FamilyDeleteModal';
import { FamilyPresenceModal } from '@/components/families/FamilyPresenceModal';
import { useEffect, useState } from 'react';
import { familyService } from '@/services/api/family';
import { authHeaders } from '@/services/api/headers';
import { config } from '@/config/environment';
import { Family } from '@/models/Family';
import { toast } from '@/components/ui/use-toast';

export function Families() {
  const [families, setFamilies] = useState<Family[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Ativo' | 'Inativo'>('all');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPresenceModalOpen, setIsPresenceModalOpen] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);

  const fetchFamilies = async () => {
    try {
      const response = await familyService.getAll();
      setFamilies(response);
    } catch (error) {
      console.error('Erro ao buscar famílias:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchFamilies(); }, []);

  const filteredFamilies = families.filter(family => {
    const matchSearch =
      family.representative_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (family.address?.street || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || family.benefit_status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleToggleStatus = async (family: Family) => {
    try {
      const r = await fetch(`${config.API_BASE_URL}/families/${family.id}/toggle-status`, {
        method: 'PATCH',
        headers: authHeaders(),
      });
      const updated = await r.json();
      setFamilies(prev => prev.map(f => f.id === updated.id ? { ...f, benefit_status: updated.benefit_status } : f));
      toast({
        title: updated.benefit_status === 'Ativo' ? 'Família ativada' : 'Família inativada',
        description: `${updated.representative_name} está agora ${updated.benefit_status.toLowerCase()}.`,
      });
    } catch {
      toast({ title: 'Erro ao atualizar status', variant: 'destructive' });
    }
  };

  const handlePresence = (family: Family) => {
    setSelectedFamily(family);
    setIsPresenceModalOpen(true);
  };

  const countAtivo = families.filter(f => f.benefit_status === 'Ativo').length;
  const countInativo = families.filter(f => f.benefit_status !== 'Ativo').length;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Famílias</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Gerencie as famílias beneficiadas pelo projeto</p>
        </div>
        <Button className="bg-warm-orange hover:bg-warm-orange/90 w-full sm:w-auto shrink-0" onClick={() => { setSelectedFamily(null); setIsFormModalOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Nova Família
        </Button>
      </div>

      {/* Filtros rápidos */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {(['all', 'Ativo', 'Inativo'] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-colors whitespace-nowrap shrink-0 ${
              statusFilter === s
                ? 'bg-warm-orange text-white border-warm-orange shadow-xs'
                : 'border-border text-muted-foreground hover:bg-muted'
            }`}
          >
            {s === 'all' ? `Todas (${families.length})` : s === 'Ativo' ? `Ativas (${countAtivo})` : `Inativas (${countInativo})`}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar famílias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-12 text-muted-foreground">Carregando...</p>
          ) : filteredFamilies.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma família encontrada</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Tente buscar com outros termos.' : 'Comece cadastrando sua primeira família.'}
              </p>
              <Button className="bg-warm-orange hover:bg-warm-orange/90" onClick={() => { setSelectedFamily(null); setIsFormModalOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" /> Cadastrar Família
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFamilies.map((family) => {
                const isActive = family.benefit_status === 'Ativo';
                return (
                  <Card key={family.id} className={`border-border ${!isActive ? 'opacity-70' : ''}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base text-foreground truncate">{family.representative_name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{family.people_count} membros</p>
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                          <Badge className={isActive ? 'bg-soft-green text-green-800' : 'bg-slate-200 text-slate-600'}>
                            {family.benefit_status ?? 'Ativo'}
                          </Badge>
                          {family.has_elderly && (
                            <Badge className="bg-purple-100 text-purple-700 text-xs">👴 Idoso</Badge>
                          )}
                          {family.is_single_mother && (
                            <Badge className="bg-pink-100 text-pink-700 text-xs">♀ Mãe Solo</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-1 mb-4 text-sm text-muted-foreground">
                        <p><strong>Endereço:</strong> {family.address?.street || 'Não informado'}</p>
                        <p><strong>Telefone:</strong> {family.contacts?.[0]?.contact_value || 'Não informado'}</p>
                        {Array.isArray(family.current_benefit) && family.current_benefit.length > 0 && (
                          <p><strong>Benefícios:</strong> {family.current_benefit.join(', ')}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-border/50">
                        <Button variant="outline" size="sm" className="flex-1 min-w-[80px]" onClick={() => { setSelectedFamily(family); setIsFormModalOpen(true); }}>
                          <Edit className="h-3.5 w-3.5 mr-1" /> Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          title="Ver / registrar presença"
                          onClick={() => handlePresence(family)}
                          className="px-2.5"
                        >
                          <ClipboardList className="h-4 w-4 text-warm-orange" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          title={isActive ? 'Inativar família' : 'Ativar família'}
                          onClick={() => handleToggleStatus(family)}
                          className="px-2.5"
                        >
                          {isActive
                            ? <ToggleRight className="h-4 w-4 text-green-600" />
                            : <ToggleLeft className="h-4 w-4 text-slate-400" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => { setSelectedFamily(family); setIsDeleteModalOpen(true); }}
                          className="text-destructive hover:text-destructive px-2.5"
                          title="Excluir família"
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

      <FamilyFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        family={selectedFamily || undefined}
        onSave={fetchFamilies}
      />

      <FamilyDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        family={selectedFamily || undefined}
      />

      <FamilyPresenceModal
        isOpen={isPresenceModalOpen}
        onClose={() => setIsPresenceModalOpen(false)}
        family={selectedFamily}
      />
    </div>
  );
}
