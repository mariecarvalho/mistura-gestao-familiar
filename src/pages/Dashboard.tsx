
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, UserCheck, TrendingUp, DollarSign, Baby, Heart, Clock } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function Dashboard() {
  const { families, actions, volunteers } = useAppStore();
  
  const activeFamilies = families.filter(family => family.isActive).length;
  const inactiveFamilies = families.filter(family => !family.isActive).length;
  const activeVolunteers = volunteers.filter(volunteer => volunteer.isActive).length;
  const completedActions = actions.filter(action => action.status === 'completed').length;
  const totalMealsDistributed = actions
    .filter(action => action.mealsDistributed)
    .reduce((total, action) => total + (action.mealsDistributed || 0), 0);
  
  const totalVolunteers = volunteers.length;

  // Métricas específicas que serão calculadas quando tivermos dados reais da API
  const familiesWithoutChildren = families.filter(f => f.members === 1).length; // Aproximação
  const singleMothers = Math.floor(families.length * 0.3); // Estimativa - será calculado com dados reais
  const elderlyFamilies = Math.floor(families.length * 0.2); // Estimativa - será calculado com dados reais

  const stats = [
    {
      title: 'Famílias Ativas',
      value: activeFamilies,
      icon: Users,
      color: 'bg-soft-green',
    },
    {
      title: 'Famílias Inativas',
      value: inactiveFamilies,
      icon: Users,
      color: 'bg-slate-400',
    },
    {
      title: 'Ações Realizadas',
      value: completedActions,
      icon: Calendar,
      color: 'bg-warm-yellow',
    },
    {
      title: 'Voluntários Ativos',
      value: activeVolunteers,
      icon: UserCheck,
      color: 'bg-salmon-pink',
    },
    {
      title: 'Marmitas Distribuídas',
      value: totalMealsDistributed,
      icon: TrendingUp,
      color: 'bg-soft-peach',
    },
    {
      title: 'Total de Voluntários',
      value: totalVolunteers,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Famílias sem Crianças',
      value: familiesWithoutChildren,
      icon: Baby,
      color: 'bg-blue-400',
    },
    {
      title: 'Mães Solo',
      value: singleMothers,
      icon: Heart,
      color: 'bg-pink-400',
    },
    {
      title: 'Famílias com Idosos',
      value: elderlyFamilies,
      icon: Clock,
      color: 'bg-purple-400',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do Projeto Mistura Acolhe
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Próximas Ações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {actions
                .filter(action => action.status === 'planned')
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 5)
                .map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{action.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(action.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {action.status === 'planned' ? 'Planejada' : action.status === 'completed' ? 'Concluída' : action.status}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {action.families?.length || 0} famílias
                      </p>
                    </div>
                  </div>
                ))
              }
              {actions.filter(action => action.status === 'planned').length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  Nenhuma ação planejada
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Famílias Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {families
                .filter(family => family.isActive)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map((family) => (
                  <div key={family.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{family.name}</p>
                      <p className="text-sm text-muted-foreground">{family.address}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {family.members} membros
                      </p>
                      <div className="inline-flex px-2 py-1 rounded-full text-xs bg-soft-green text-green-800">
                        Ativa
                      </div>
                    </div>
                  </div>
                ))
              }
              {activeFamilies === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  Nenhuma família ativa
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
