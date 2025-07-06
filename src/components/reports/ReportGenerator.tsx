
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileSpreadsheet } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { toast } from '@/components/ui/use-toast';

export function ReportGenerator() {
  const { families, actions } = useAppStore();

  const generateFamiliesReport = () => {
    try {
      const csvHeader = [
        'ID',
        'Nome do Representante',
        'Endereço',
        'Telefone',
        'Número de Membros',
        'Status',
        'Benefício Atual',
        'Status do Benefício',
        'Observações',
        'Data de Cadastro'
      ].join(',');

      const csvData = families.map(family => [
        family.id,
        `"${family.name}"`,
        `"${family.address}"`,
        `"${family.phone}"`,
        family.members,
        family.isActive ? 'Ativa' : 'Inativa',
        `"${family.currentBenefit || ''}"`,
        `"${family.benefitStatus || ''}"`,
        `"${family.notes || ''}"`,
        new Date(family.createdAt).toLocaleDateString('pt-BR')
      ].join(',')).join('\n');

      const csv = csvHeader + '\n' + csvData;
      downloadCSV(csv, 'relatorio-familias.csv');

      toast({
        title: "Relatório gerado",
        description: "O relatório de famílias foi baixado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar o relatório de famílias.",
        variant: "destructive"
      });
    }
  };

  const generateActionsReport = () => {
    try {
      const csvHeader = [
        'ID',
        'Título',
        'Descrição',
        'Data',
        'Local',
        'Prato do Dia',
        'Marmitas Planejadas',
        'Marmitas Distribuídas',
        'Custo da Ação',
        'Status'
      ].join(',');

      const csvData = actions.map(action => [
        action.id,
        `"${action.title}"`,
        `"${action.description || ''}"`,
        new Date(action.date).toLocaleDateString('pt-BR'),
        `"${action.location}"`,
        `"${action.dishOfTheDay || ''}"`,
        action.mealsPlanned,
        action.mealsDistributed || 0,
        `R$ ${(action.actionCost || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        action.status
      ].join(',')).join('\n');

      const csv = csvHeader + '\n' + csvData;
      downloadCSV(csv, 'relatorio-acoes.csv');

      toast({
        title: "Relatório gerado",
        description: "O relatório de ações foi baixado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar o relatório de ações.",
        variant: "destructive"
      });
    }
  };

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
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
          <p className="text-muted-foreground mb-4">
            Gere uma planilha com todas as informações das famílias cadastradas.
          </p>
          <Button 
            onClick={generateFamiliesReport}
            className="w-full"
            disabled={families.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Baixar Relatório de Famílias
          </Button>
          {families.length === 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Nenhuma família cadastrada
            </p>
          )}
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
          <p className="text-muted-foreground mb-4">
            Gere uma planilha com todas as informações das ações realizadas.
          </p>
          <Button 
            onClick={generateActionsReport}
            className="w-full"
            disabled={actions.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Baixar Relatório de Ações
          </Button>
          {actions.length === 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Nenhuma ação cadastrada
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
