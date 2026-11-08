import writeXlsxFile from 'write-excel-file/browser';
import { Button } from '@/components/ui/button';
import { FileDown, Users, Calendar, UserCheck } from 'lucide-react';

// ── tipos espelhados de Reports.tsx ──────────────────────────────────────────
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
  families_present?: number;
  meals_realized?: number;
}

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string | string[];
  availability: string | string[];
  is_active: boolean;
  created_at?: string;
}

interface Props {
  families: Family[];
  actions: Action[];
  volunteers: Volunteer[];
}

// ── helpers ───────────────────────────────────────────────────────────────────

const fmtDate = (v?: string | null) => {
  if (!v) return '';
  const d = new Date(v);
  if (isNaN(d.getTime())) return v;
  return d.toLocaleDateString('pt-BR');
};

const fmtBool = (v: boolean) => (v ? 'Sim' : 'Não');

const fmtArray = (v: string | string[] | null | undefined): string => {
  if (!v) return '';
  if (Array.isArray(v)) return v.join(', ');
  return v;
};

const fmtStatus = (s: string) => {
  const m: Record<string, string> = {
    planned: 'Planejada',
    'in-progress': 'Em Andamento',
    completed: 'Concluída',
    cancelled: 'Cancelada',
  };
  return m[s] ?? s;
};

const fmtCurrency = (v?: number | null) => {
  if (v == null || isNaN(Number(v))) return 'R$ 0,00';
  return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const buildSheetData = (headers: string[], rows: (string | number)[][]) => {
  const headerRow = headers.map(h => ({
    value: h,
    fontWeight: 'bold',
  }));
  const dataRows = rows.map(row =>
    row.map(cell => ({
      value: cell ?? '',
      type: typeof cell === 'number' ? Number : String,
    }))
  );
  return [headerRow, ...dataRows];
};

// ── geradores de dados de abas ──────────────────────────────────────────────

const getFamiliesData = (families: Family[]) => {
  const headers = [
    'ID', 'Nome do Representante', 'Data de Nasc.', 'Gênero',
    'Pessoas na Família', 'Crianças', 'Benefício Atual', 'Status',
    'Endereço', 'Nº', 'Complemento', 'Bairro', 'Cidade', 'Estado', 'CEP',
    'Contato (tipo)', 'Contato (valor)', 'Qtd. Filhos cadastrados',
    'Cadastrado em',
  ];

  const rows = families.map(f => [
    String(f.id),
    f.representative_name ?? '',
    fmtDate(f.representative_birth_date),
    f.representative_gender ?? '',
    f.people_count ?? 0,
    f.children_count ?? 0,
    f.current_benefit ?? '',
    f.benefit_status ?? '',
    f.address?.street ?? '',
    f.address?.number ?? '',
    f.address?.complement ?? '',
    f.address?.district ?? '',
    f.address?.city ?? '',
    f.address?.state ?? '',
    f.address?.postal_code ?? '',
    f.contacts?.[0]?.contact_type ?? '',
    f.contacts?.[0]?.contact_value ?? '',
    f.children?.length ?? 0,
    fmtDate(f.created_at),
  ] as (string | number)[]);

  return buildSheetData(headers, rows);
};

const getActionsData = (actions: Action[]) => {
  const headers = [
    'ID', 'Título', 'Descrição', 'Data', 'Tipo', 'Status',
    'Voluntários', 'Famílias Previstas', 'Famílias Presentes (real)',
    'Marmitas Distribuídas (real)', 'Prato do Dia', 'Custo (R$)',
    'Cadastrado em',
  ];

  const rows = actions.map(a => [
    String(a.id),
    a.title ?? '',
    a.description ?? '',
    fmtDate(a.date),
    a.type ?? '',
    fmtStatus(a.status),
    a.volunteer_count ?? 0,
    a.families_served ?? 0,
    a.families_present ?? 0,
    a.meals_realized ?? 0,
    a.dish_of_the_day ?? '',
    fmtCurrency(a.action_cost),
    fmtDate(a.created_at),
  ] as (string | number)[]);

  return buildSheetData(headers, rows);
};

const getVolunteersData = (volunteers: Volunteer[]) => {
  const headers = [
    'ID', 'Nome', 'Email', 'Telefone',
    'Habilidades', 'Disponibilidade', 'Ativo?', 'Cadastrado em',
  ];

  const rows = volunteers.map(v => [
    String(v.id),
    v.name ?? '',
    v.email ?? '',
    v.phone ?? '',
    fmtArray(v.skills),
    fmtArray(v.availability),
    fmtBool(v.is_active),
    fmtDate(v.created_at),
  ] as (string | number)[]);

  return buildSheetData(headers, rows);
};

const today = () => new Date().toISOString().slice(0, 10);

// ── componente ─────────────────────────────────────────────────────────────────

export function ReportGenerator({ families, actions, volunteers }: Props) {

  const handleFamilies = async () => {
    await writeXlsxFile(getFamiliesData(families), {
      fileName: `Mistura_Familias_${today()}.xlsx`,
    });
  };

  const handleActions = async () => {
    await writeXlsxFile(getActionsData(actions), {
      fileName: `Mistura_Acoes_${today()}.xlsx`,
    });
  };

  const handleVolunteers = async () => {
    await writeXlsxFile(getVolunteersData(volunteers), {
      fileName: `Mistura_Voluntarios_${today()}.xlsx`,
    });
  };

  const handleComplete = async () => {
    await writeXlsxFile([getFamiliesData(families), getActionsData(actions), getVolunteersData(volunteers)], {
      sheets: ['Famílias', 'Ações', 'Voluntários'],
      fileName: `Mistura_Relatorio_Completo_${today()}.xlsx`,
    });
  };

  const cards = [
    {
      label: 'Relatório de Famílias',
      desc: `${families.length} família${families.length !== 1 ? 's' : ''} cadastrada${families.length !== 1 ? 's' : ''} — endereço, contatos, filhos e status`,
      icon: Users,
      color: 'bg-soft-green',
      onClick: handleFamilies,
      btnLabel: 'Baixar Famílias (.xlsx)',
    },
    {
      label: 'Relatório de Ações',
      desc: `${actions.length} ação${actions.length !== 1 ? 'ões' : ''} — datas, status, presenças reais e marmitas`,
      icon: Calendar,
      color: 'bg-warm-yellow',
      onClick: handleActions,
      btnLabel: 'Baixar Ações (.xlsx)',
    },
    {
      label: 'Relatório de Voluntários',
      desc: `${volunteers.length} voluntário${volunteers.length !== 1 ? 's' : ''} — contato, habilidades e disponibilidade`,
      icon: UserCheck,
      color: 'bg-salmon-pink',
      onClick: handleVolunteers,
      btnLabel: 'Baixar Voluntários (.xlsx)',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {cards.map(c => (
          <div key={c.label} className="border rounded-lg p-3.5 sm:p-4 space-y-3 flex flex-col justify-between bg-card">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-md ${c.color} flex items-center justify-center shrink-0`}>
                  <c.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <p className="font-semibold text-sm text-foreground">{c.label}</p>
              </div>
              <p className="text-xs text-muted-foreground">{c.desc}</p>
            </div>
            <Button
              onClick={c.onClick}
              className="w-full bg-warm-orange hover:bg-warm-orange/90 gap-2 mt-2"
              size="sm"
            >
              <FileDown className="h-4 w-4" />
              {c.btnLabel}
            </Button>
          </div>
        ))}
      </div>

      {/* Relatório completo */}
      <div className="border rounded-lg p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-muted/40">
        <div>
          <p className="font-semibold text-sm text-foreground">Relatório Completo</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Arquivo único com abas separadas: Famílias, Ações e Voluntários
          </p>
        </div>
        <Button
          onClick={handleComplete}
          className="bg-warm-orange hover:bg-warm-orange/90 gap-2 w-full sm:w-auto shrink-0"
        >
          <FileDown className="h-4 w-4" />
          Baixar Relatório Completo (.xlsx)
        </Button>
      </div>
    </div>
  );
}
