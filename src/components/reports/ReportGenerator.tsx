
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDown, FileSpreadsheet } from 'lucide-react';

interface Family {
  id: string;
  name: string;
  address: string;
  phone: string;
  members: number;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
}

interface Action {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  mealsPlanned: number;
  mealsDistributed?: number;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  volunteers: string[];
  families: string[];
  createdAt: Date;
}

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  availability: string[];
  isActive: boolean;
  actionsParticipated: number;
  createdAt: Date;
}

interface ReportGeneratorProps {
  families: Family[];
  actions: Action[];
  volunteers: Volunteer[];
}

export function ReportGenerator({ families, actions, volunteers }: ReportGeneratorProps) {
  const generateFamiliesCSV = () => {
    const headers = [
      'ID',
      'Nome do Representante',
      'Data de Nascimento',
      'Gênero',
      'Pessoas na Família',
      'Crianças',
      'Benefício Atual',
      'Status do Benefício',
      'Endereço',
      'Cidade',
      'Estado',
      'CEP',
      'Contato',
      'Tipo de Contato',
    ];

    const csvData = families.map(family => [
      family.id,
      family.name,
      family.createdAt ? new Date(family.createdAt).toLocaleDateString('pt-BR') : 'Não informado',
      '',
      family.members,
      0,
      'Não informado',
      family.isActive ? 'Ativo' : 'Inativo',
      family.address,
      '',
      '',
      '',
      family.phone,
      'Telefone',
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `familias_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateActionsCSV = () => {
    const headers = [
      'ID',
      'Título',
      'Descrição',
      'Data',
      'Tipo',
      'Status',
      'Voluntários',
      'Famílias Servidas',
      'Prato do Dia',
      'Custo (R$)',
    ];

    const csvData = actions.map(action => [
      action.id,
      action.title,
      action.description,
      action.date ? new Date(action.date).toLocaleDateString('pt-BR') : 'Não informado',
      'Distribuição de Alimentos',
      action.status,
      action.volunteers?.length || 0,
      action.families?.length || 0,
      'Não informado',
      `R$ ${action.mealsPlanned || 0}`,
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `acoes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateVolunteersCSV = () => {
    const headers = [
      'ID',
      'Nome',
      'Email',
      'Telefone',
      'Habilidades',
      'Disponibilidade',
      'Status',
      'Ações Participadas',
      'Data de Cadastro',
    ];

    const csvData = volunteers.map(volunteer => [
      volunteer.id,
      volunteer.name,
      volunteer.email,
      volunteer.phone,
      Array.isArray(volunteer.skills) ? volunteer.skills.join('; ') : (volunteer.skills || 'Não informado'),
      Array.isArray(volunteer.availability) ? volunteer.availability.join('; ') : (volunteer.availability || 'Não informado'),
      volunteer.isActive ? 'Ativo' : 'Inativo',
      volunteer.actionsParticipated,
      volunteer.createdAt ? new Date(volunteer.createdAt).toLocaleDateString('pt-BR') : 'Não informado',
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `voluntarios_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Relatório de Famílias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Exportar dados das famílias cadastradas em formato CSV
          </p>
          <Button onClick={generateFamiliesCSV} className="w-full">
            <FileDown className="h-4 w-4 mr-2" />
            Baixar Relatório de Famílias
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Relatório de Ações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Exportar dados das ações realizadas em formato CSV
          </p>
          <Button onClick={generateActionsCSV} className="w-full">
            <FileDown className="h-4 w-4 mr-2" />
            Baixar Relatório de Ações
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Relatório de Voluntários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Exportar dados dos voluntários cadastrados em formato CSV
          </p>
          <Button onClick={generateVolunteersCSV} className="w-full">
            <FileDown className="h-4 w-4 mr-2" />
            Baixar Relatório de Voluntários
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
