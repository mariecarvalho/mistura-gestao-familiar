import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, UserCheck, Soup, Baby, Heart, Clock, TrendingUp, Loader2, HandCoins } from 'lucide-react';
import { config } from '@/config/environment';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line,
} from 'recharts';

interface DashboardData {
  counters: {
    families_active: number;
    families_inactive: number;
    families_without_children: number;
    actions_completed: number;
    total_families_served: number;
    total_meals_distributed: number;
    volunteers_active: number;
    volunteers_total: number;
    single_mothers: number;
    elderly_families: number;
    donations_received: number;
  };
  meals_by_month: { month: string; families_served: number; meals_distributed: number }[];
  families_by_action: { title: string; families_served: number; meals_distributed: number; date_label: string }[];
  upcoming_actions: { id: string; title: string; date: string; status: string; families_served: number }[];
  recent_families: { id: string; representative_name: string; people_count: number; benefit_status: string }[];
}

const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${config.API_BASE_URL}/dashboard`)
      .then(r => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const c = data?.counters;

  const stats = [
    { title: 'Famílias Ativas',         value: c?.families_active ?? 0,           icon: Users,      color: 'bg-soft-green',  isCurrency: false },
    { title: 'Famílias Inativas',        value: c?.families_inactive ?? 0,         icon: Users,      color: 'bg-slate-400',   isCurrency: false },
    { title: 'Ações Realizadas',         value: c?.actions_completed ?? 0,         icon: Calendar,   color: 'bg-warm-yellow', isCurrency: false },
    { title: 'Voluntários Ativos',       value: c?.volunteers_active ?? 0,         icon: UserCheck,  color: 'bg-salmon-pink', isCurrency: false },
    { title: 'Marmitas Distribuídas',    value: c?.total_meals_distributed ?? 0,   icon: Soup,       color: 'bg-soft-peach',  isCurrency: false },
    { title: 'Total de Voluntários',     value: c?.volunteers_total ?? 0,          icon: TrendingUp, color: 'bg-green-500',   isCurrency: false },
    { title: 'Famílias sem Crianças',    value: c?.families_without_children ?? 0, icon: Baby,       color: 'bg-blue-400',    isCurrency: false },
    { title: 'Mães Solo',                value: c?.single_mothers ?? 0,            icon: Heart,      color: 'bg-pink-400',    isCurrency: false },
    { title: 'Famílias com Idosos',      value: c?.elderly_families ?? 0,          icon: Clock,      color: 'bg-purple-400',  isCurrency: false },
    { title: 'Total Arrecadado',         value: c?.donations_received ?? 0,        icon: HandCoins,  color: 'bg-emerald-500', isCurrency: true  },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do Projeto Mistura</p>
      </div>

      {/* Contadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.isCurrency ? fmt(stat.value) : stat.value.toLocaleString('pt-BR')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Famílias atendidas por mês */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Famílias Atendidas por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            {(data?.meals_by_month?.length ?? 0) === 0 ? (
              <p className="text-muted-foreground text-center py-8">Nenhuma ação concluída ainda</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data!.meals_by_month} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="families_served" name="Famílias" fill="#f97316" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Marmitas distribuídas por mês */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Voluntários por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            {(data?.meals_by_month?.length ?? 0) === 0 ? (
              <p className="text-muted-foreground text-center py-8">Nenhuma ação concluída ainda</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={data!.meals_by_month} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="meals_distributed"
                    name="Voluntários"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Famílias atendidas por ação */}
        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-foreground">Famílias Atendidas por Ação (últimas 10)</CardTitle>
          </CardHeader>
          <CardContent>
            {(data?.families_by_action?.length ?? 0) === 0 ? (
              <p className="text-muted-foreground text-center py-8">Nenhuma ação concluída ainda</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={data!.families_by_action}
                  margin={{ top: 4, right: 8, left: -16, bottom: 48 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="title"
                    tick={{ fontSize: 11 }}
                    angle={-30}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Legend verticalAlign="top" />
                  <Bar dataKey="families_served"    name="Famílias"    fill="#f97316" radius={[4,4,0,0]} />
                  <Bar dataKey="meals_distributed"  name="Voluntários" fill="#3b82f6" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Listas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Próximas ações */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Próximas Ações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(data?.upcoming_actions?.length ?? 0) === 0 ? (
                <p className="text-muted-foreground text-center py-4">Nenhuma ação planejada</p>
              ) : data!.upcoming_actions.map((action) => (
                <div key={action.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{action.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(action.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {action.status === 'planned' ? 'Planejada' : 'Em andamento'}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">{action.families_served} famílias</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Últimas famílias */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Últimas Famílias Cadastradas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(data?.recent_families?.length ?? 0) === 0 ? (
                <p className="text-muted-foreground text-center py-4">Nenhuma família cadastrada</p>
              ) : data!.recent_families.map((family) => (
                <div key={family.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{family.representative_name}</p>
                    <p className="text-sm text-muted-foreground">{family.people_count} membros</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    family.benefit_status === 'Ativo'
                      ? 'bg-soft-green text-green-800'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {family.benefit_status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
