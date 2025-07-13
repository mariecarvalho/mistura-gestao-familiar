
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDown, FileSpreadsheet } from 'lucide-react';
import { Family } from '@/models/Family';
import { Action } from '@/models/Action';

interface ReportGeneratorProps {
  families: Family[];
  actions: Action[];
}

export function ReportGenerator({ families, actions }: ReportGeneratorProps) {
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
      family.representative_name,
      family.representative_birth_date,
      family.representative_gender,
      family.people_count,
      family.children_count,
      Array.isArray(family.current_benefit) ? family.current_benefit.join('; ') : (family.current_benefit || 'Não informado'),
      family.benefit_status || 'Não informado',
      family.address?.street || 'Não informado',
      family.address?.city || 'Não informado',
      family.address?.state || 'Não informado',
      family.address?.postal_code || 'Não informado',
      family.contacts?.[0]?.contact_value || 'Não informado',
      family.contacts?.[0]?.contact_type || 'Não informado',
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
      action.date,
      action.type,
      action.status,
      action.volunteer_count,
      action.families_served,
      action.dishOfTheDay || 'Não informado',
      action.actionCost ? `R$ ${action.actionCost.toFixed(2)}` : 'R$ 0,00',
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>
  );
}
