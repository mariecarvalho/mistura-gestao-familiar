
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, UserCheck, Mail, Phone, Edit, Trash2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { VolunteerFormModal } from '@/components/volunteers/VolunteerFormModal';
import { VolunteerDeleteModal } from '@/components/volunteers/VolunteerDeleteModal';

export function Volunteers() {
  const { volunteers } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const filteredVolunteers = volunteers.filter(volunteer =>
    volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    volunteer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateVolunteer = () => {
    setModalMode('create');
    setSelectedVolunteer(null);
    setIsFormModalOpen(true);
  };

  const handleEditVolunteer = (volunteer: any) => {
    setModalMode('edit');
    setSelectedVolunteer(volunteer);
    setIsFormModalOpen(true);
  };

  const handleDeleteVolunteer = (volunteer: any) => {
    setSelectedVolunteer(volunteer);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Voluntários</h1>
          <p className="text-muted-foreground">
            Gerencie os voluntários do projeto
          </p>
        </div>
        <Button 
          className="bg-warm-orange hover:bg-warm-orange/90"
          onClick={handleCreateVolunteer}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Voluntário
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar voluntários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredVolunteers.length === 0 ? (
            <div className="text-center py-12">
              <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhum voluntário encontrado
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Tente buscar com outros termos.' : 'Comece cadastrando seu primeiro voluntário.'}
              </p>
              <Button 
                className="bg-warm-orange hover:bg-warm-orange/90"
                onClick={handleCreateVolunteer}
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Voluntário
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVolunteers.map((volunteer) => (
                <Card key={volunteer.id} className="border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg text-foreground">{volunteer.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {volunteer.actionsParticipated} ações participadas
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        volunteer.isActive 
                          ? 'bg-soft-green text-green-800' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {volunteer.isActive ? 'Ativo' : 'Inativo'}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{volunteer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{volunteer.phone}</span>
                      </div>
                    </div>
                    
                    {volunteer.skills.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-foreground mb-2">Habilidades:</p>
                        <div className="flex flex-wrap gap-1">
                          {volunteer.skills.map((skill: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEditVolunteer(volunteer)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteVolunteer(volunteer)}
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

      <VolunteerFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        volunteer={selectedVolunteer}
        mode={modalMode}
      />

      <VolunteerDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        volunteer={selectedVolunteer}
      />
    </div>
  );
}
