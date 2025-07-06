
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, PieChart, TrendingUp, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';

export function Reports() {
  const { families, actions, volunteers } = useAppStore();

  const totalFamilies = families.length;
  const activeFamilies = families.filter(f => f.isActive).length;
  const totalActions = actions.length;
  const completedActions = actions.filter(a => a.status === 'completed').length;
  const totalVolunteers = volunteers.length;
  const activeVolunteers = volunteers.filter(v => v.isActive).length;
  
  const totalMealsDistributed = actions
    .filter(action => action.mealsDistributed)
    .reduce((total, action) => total + (action.mealsDistributed || 0), 0);

  const averageMembersPerFamily = totalFamilies > 0 
    ? (families.reduce((sum, f) => sum + f.members, 0) / totalFamilies).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">
            Análises e estatísticas do Projeto Mistura Acolhe
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Famílias Ativas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {totalFamilies > 0 ? Math.round((activeFamilies / totalFamilies) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {activeFamilies} de {totalFamilies} famílias
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Conclusão
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {completedActions} de {totalActions} ações
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Média de Membros
            </CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {averageMembersPerFamily}
            </div>
            <p className="text-xs text-muted-foreground">
              membros por família
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Voluntários Ativos
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {totalVolunteers > 0 ? Math.round((activeVolunteers / totalVolunteers) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {activeVolunteers} de {totalVolunteers} voluntários
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Resumo Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="font-medium text-foreground">Total de Famílias</span>
                <span className="text-foreground">{totalFamilies}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="font-medium text-foreground">Total de Ações</span>
                <span className="text-foreground">{totalActions}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="font-medium text-foreground">Total de Voluntários</span>
                <span className="text-foreground">{totalVolunteers}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-soft-green rounded-lg">
                <span className="font-medium text-green-800">Marmitas Distribuídas</span>
                <span className="font-bold text-green-800">{totalMealsDistributed}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Ações por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['planned', 'in-progress', 'completed', 'cancelled'].map((status) => {
                const count = actions.filter(a => a.status === status).length;
                const percentage = totalActions > 0 ? (count / totalActions) * 100 : 0;
                const statusLabels = {
                  planned: 'Planejadas',
                  'in-progress': 'Em Andamento', 
                  completed: 'Concluídas',
                  cancelled: 'Canceladas'
                };
                
                return (
                  <div key={status} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">
                        {statusLabels[status as keyof typeof statusLabels]}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {count} ({Math.round(percentage)}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-warm-orange h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
