
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, Users } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function Families() {
  const { families, removeFamily } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFamilies = families.filter(family =>
    family.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    family.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Famílias</h1>
          <p className="text-muted-foreground">
            Gerencie as famílias beneficiadas pelo projeto
          </p>
        </div>
        <Button className="bg-warm-orange hover:bg-warm-orange/90">
          <Plus className="h-4 w-4 mr-2" />
          Nova Família
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar famílias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredFamilies.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhuma família encontrada
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Tente buscar com outros termos.' : 'Comece cadastrando sua primeira família.'}
              </p>
              <Button className="bg-warm-orange hover:bg-warm-orange/90">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Família
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFamilies.map((family) => (
                <Card key={family.id} className="border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg text-foreground">{family.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{family.members} membros</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        family.isActive 
                          ? 'bg-soft-green text-green-800' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {family.isActive ? 'Ativa' : 'Inativa'}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-muted-foreground">
                        <strong>Endereço:</strong> {family.address}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Telefone:</strong> {family.phone}
                      </p>
                      {family.notes && (
                        <p className="text-sm text-muted-foreground">
                          <strong>Observações:</strong> {family.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeFamily(family.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
