import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Users, Calendar, UserCheck, Soup } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { config } from '@/config/environment';
import { authHeaders } from '@/services/api/headers';
import { ReportGenerator } from '@/components/reports/ReportGenerator';

// ── tipos ──────────────────────────────────────────────────────────────────
interface Family {
  id: string;
  representative_name: string;
  representative_birth_date: string;
  representative_gender: string;
  people_count: number;
  children_count: number;
  current_benefit: string;
  benefit_status: string;
  address?: {
    street: string; number: string; complement?: string;
    district: string; city: string; state: string; postal_code: string;
  };
  contacts?: { contact_type: string; contact_value: string; contact_note?: string }[];
  children?: { name: string; birth_date: string; gender: string; relationship: string }[];
  created_at?: string;
}

interface Action {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  status: string;
  volunteer_count: number;
  families_served: number;
  dish_of_the_day?: string;
  action_cost?: number;
  created_at?: string;
  // totais reais de presença
  families_present?: number;
  meals_realized?: number;
}

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string;
  availability: string;
  is_active: boolean;
  created_at?: string;
}

const STATUS_COLORS: Record<string, string> = {
  planned: '#3b82f6',
  'in-progress': '#f59e0b',
  completed: '#22c55e',
  cancelled: '#ef4444',
};

const STATUS_LABELS: Record<string, string> = {
  planned: 'Planejada',
  'in-progress': 'Em Andamento',
  completed: 'Concluída',
  cancelled: 'Cancelada',
};

const PIE_COLORS = ['#22c55e', '#94a3b8', '#3b82f6', '#f97316'];

export function Reports() {
  const [families, setFamilies]     = useState<Family[]>([]);
  const [actions, setActions]       = useState<Action[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [fams, acts, vols] = await Promise.all([
          fetch(`${config.API_BASE_URL}/families`,  { headers: authHeaders() }).then(r => r.json()),
          fetch(`${config.API_BASE_URL}/actions`,   { headers: authHeaders() }).then(r => r.json()),
          fetch(`${config.API_BASE_URL}/volunteers`,{ headers: authHeaders() }).then(r => r.json()),
        ]);

        // Busca summaries de presença para ações concluídas
        const completed: Action[] = (acts as Action[]).filter(a => a.status === 'completed');
        const summaries = await Promise.all(
          completed.map(a =>
            fetch(`${config.API_BASE_URL}/actions/${a.id}/presence/summary`, { headers: authHeaders() })
              .then(r => r.ok ? r.json() : { families_present: 0, meals_realized: 0 })
              .catch(() => ({ families_present: 0, meals_realized: 0 }))
          )
        );
        const actsWithSummary: Action[] = (acts as Action[]).map(a => {
          const idx = completed.findIndex(c => c.id === a.id);
          if (idx === -1) return a;
          return { ...a, families_present: summaries[idx].families_present, meals_realized: summaries[idx].meals_realized };
        });

        setFamilies(fams);
        setActions(actsWithSummary);
        setVolunteers(vols);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // ── métricas ──────────────────────────────────────────────────────────────
  const familiesActive   = families.filter(f => f.benefit_status === 'Ativo').length;
  const familiesInactive = families.filter(f => f.benefit_status !== 'Ativo').length;
  const actionsCompleted = actions.filter(a => a.status === 'completed').length;
  const volunteersActive = volunteers.filter(v => v.is_active).length;
  const totalMeals       = actions.reduce((s, a) => s + (a.meals_realized ?? 0), 0);
  const totalFamiliesServed = actions
    .filter(a => a.status === 'completed')
    .reduce((s, a) => s + (a.families_present ?? a.families_served ?? 0), 0);

  const counters = [
    { label: 'Famílias Ativas',     value: familiesActive,      icon: Users,     color: 'bg-soft-green'  },
    { label: 'Famílias Inativas',   value: familiesInactive,    icon: Users,     color: 'bg-slate-400'   },
    { label: 'Ações Realizadas',    value: actionsCompleted,    icon: Calendar,  color: 'bg-warm-yellow' },
    { label: 'Voluntários Ativos',  value: volunteersActive,    icon: UserCheck, color: 'bg-salmon-pink' },
    { label: 'Famílias Atendidas',  value: totalFamiliesServed, icon: Users,     color: 'bg-blue-400'    },
    { label: 'Marmitas Distribuídas', value: totalMeals,        icon: Soup,      color: 'bg-warm-orange' },
  ];

  // ── dados dos gráficos ─────────────────────────────────────────────────────
  const familyPieData = [
    { name: 'Ativas',   value: familiesActive   },
    { name: 'Inativas', value: familiesInactive },
  ].filter(d => d.value > 0);

  // Ações agrupadas por mês
  const byMonth: Record<string, number> = {};
  actions.forEach(a => {
    const m = new Date(a.date).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
    byMonth[m] = (byMonth[m] || 0) + 1;
  });
  const monthlyData = Object.entries(byMonth).map(([month, total]) => ({ month, total }));

  // Famílias atendidas por ação (últimas 8 concluídas)
  const actionPresenceData = actions
    .filter(a => a.status === 'completed')
    .slice(0, 8)
    .map(a => ({
      name: a.title.length > 18 ? a.title.slice(0, 18) + '…' : a.title,
      famílias: a.families_present ?? a.families_served ?? 0,
      marmitas: a.meals_realized ?? 0,
    }))
    .reverse();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
        <p className="text-muted-foreground">Análises e exportação de dados do projeto</p>
      </div>

      {/* Contadores */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {counters.map(c => (
          <Card key={c.label} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground leading-tight">{c.label}</CardTitle>
              <div className={`w-7 h-7 rounded-md ${c.color} flex items-center justify-center shrink-0`}>
                <c.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <p className="text-2xl font-bold">{c.value.toLocaleString('pt-BR')}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pizza — status das famílias */}
        <Card>
          <CardHeader><CardTitle className="text-foreground">Status das Famílias</CardTitle></CardHeader>
          <CardContent>
            {familyPieData.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">Sem dados</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={familyPieData} cx="50%" cy="50%" outerRadius={90} dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                    {familyPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Barras — ações por mês */}
        <Card>
          <CardHeader><CardTitle className="text-foreground">Ações por Mês</CardTitle></CardHeader>
          <CardContent>
            {monthlyData.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">Sem dados</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthlyData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="total" name="Ações" fill="#f97316" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Barras agrupadas — famílias + marmitas por ação */}
        {actionPresenceData.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="text-foreground">Famílias Atendidas e Marmitas por Ação (últimas 8)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={actionPresenceData} margin={{ top: 4, right: 8, left: -16, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" interval={0} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Legend verticalAlign="top" />
                  <Bar dataKey="famílias"  fill="#22c55e" radius={[4,4,0,0]} />
                  <Bar dataKey="marmitas" fill="#f97316" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Exportação */}
      <Card>
        <CardHeader><CardTitle className="text-foreground">Exportar Relatórios</CardTitle></CardHeader>
        <CardContent>
          <ReportGenerator families={families} actions={actions} volunteers={volunteers} />
        </CardContent>
      </Card>
    </div>
  );
}
