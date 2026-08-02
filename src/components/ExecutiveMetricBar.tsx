import React from 'react';
import {
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  PackageCheck,
  Target,
  TrendingUp,
  Percent,
  Award,
  Sparkles,
} from 'lucide-react';
import { Client, ServiceOrder, CashFlowEntry } from '../types';

interface ExecutiveMetricBarProps {
  orders: ServiceOrder[];
  cashFlow: CashFlowEntry[];
  clients: Client[];
  onOpenNews?: () => void;
}

export const ExecutiveMetricBar: React.FC<ExecutiveMetricBarProps> = ({
  orders,
  cashFlow,
  clients,
  onOpenNews,
}) => {
  const hoje = new Date().toISOString().split('T')[0];
  const mesAtual = new Date().toISOString().substring(0, 7); // YYYY-MM

  // 1. Atendimento Hoje (número de clientes ativos no CRM)
  const atendimentosHojeCount = clients.length;

  // 2. Vendas Hoje (soma das entradas financeiras de hoje no caixa)
  const totalTodaySales = cashFlow
    .filter((c) => c.type === 'entrada' && c.date === hoje)
    .reduce((sum, c) => sum + c.amount, 0);

  // 3. Ticket Médio (valor total de OS ativas dividido pela quantidade de OS)
  const totalSalesValue = orders.reduce((sum, o) => sum + o.totalValue, 0);
  const ticketMedio = orders.length > 0 ? totalSalesValue / orders.length : 0;

  // 4. Taxa de Conversão (OS geradas em relação aos clientes cadastrados)
  const conversao = clients.length > 0 ? Math.min(Math.round((orders.length / clients.length) * 100), 100) : 0;

  // 5. OS Laboratório (OS ativas em laboratório)
  const inLabCount = orders.filter((os) => os.status === 'no_laboratorio').length;

  // 6. Meta do Dia (proporção contra a meta diária de R$ 10.000)
  const metaDia = 10000;
  const percentMetaDia = Math.min(Math.round((totalTodaySales / metaDia) * 100), 100);

  // 7. Meta do Mês (soma de entradas do mês contra a meta de R$ 180.000)
  const totalMonthSales = cashFlow
    .filter((c) => c.type === 'entrada' && c.date.startsWith(mesAtual))
    .reduce((sum, c) => sum + c.amount, 0);
  const metaMes = 180000;
  const percentMetaMes = Math.min(Math.round((totalMonthSales / metaMes) * 100), 100);

  // 8. Retiradas Prontas (OS com status 'pronto' aguardando cliente)
  const retiradasProntasCount = orders.filter((os) => os.status === 'pronto').length;

  const metrics = [
    {
      label: 'Atendimento Hoje',
      value: `${atendimentosHojeCount}`,
      icon: Users,
      color: 'text-[#C9A96E]',
    },
    {
      label: 'Vendas Hoje',
      value: `R$ ${totalTodaySales.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      color: 'text-[#10B981]',
    },
    {
      label: 'Ticket Médio',
      value: `R$ ${ticketMedio.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: Award,
      color: 'text-[#C9A96E]',
    },
    {
      label: 'Conversão',
      value: `${conversao}%`,
      icon: Percent,
      color: 'text-[#10B981]',
    },
    {
      label: 'IA Status',
      value: 'Mary Online (100%)',
      icon: Sparkles,
      color: 'text-[#C9A96E]',
      badge: 'Ativa',
    },
    {
      label: 'OS Laboratório',
      value: `${inLabCount} Ativas`,
      icon: Clock,
      color: 'text-[#E8D2A8]',
    },
    {
      label: 'Meta do Dia',
      value: `${percentMetaDia}% (R$ ${totalTodaySales.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} / 10k)`,
      icon: Target,
      color: 'text-[#C9A96E]',
    },
    {
      label: 'Meta do Mês',
      value: `${percentMetaMes}% (R$ ${(totalMonthSales / 1000).toFixed(0)}k / 180k)`,
      icon: TrendingUp,
      color: 'text-[#10B981]',
    },
    {
      label: 'Garantia OS',
      value: '0 Atrasos',
      icon: CheckCircle,
      color: 'text-[#10B981]',
    },
    {
      label: 'Retiradas Hoje',
      value: `${retiradasProntasCount} Clientes`,
      icon: PackageCheck,
      color: 'text-[#C9A96E]',
    },
  ];

  return (
    <div className="bg-[#071D49]/80 backdrop-blur-md border-b-2 border-[#C9A96E]/50 px-4 py-2 overflow-x-auto scrollbar-none shrink-0 shadow-sm relative z-10">
      <div className="flex items-center space-x-3 min-w-max text-xs">
        <button
          onClick={onOpenNews}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#0B255C]/80 hover:bg-[#153270] rounded-full border border-[#C9A96E] text-[#C9A96E] font-bold text-[10px] tracking-wider uppercase shrink-0 shadow-xs cursor-pointer active:scale-95 transition-all"
          title="Ver Central de Informativos e Detalhamento dos KPIs"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
          KPIS ENTERPRISE ➔
        </button>

        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              onClick={onOpenNews}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-[20px] bg-[#0B255C]/70 backdrop-blur-sm border border-[#C9A96E]/40 hover:border-[#C9A96E] transition-all cursor-pointer hover:bg-[#0B255C]"
              title="Clique para ver o relatório de Informativos completo"
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${m.color}`} />
              <div className="flex items-center space-x-1.5 leading-tight">
                <span className="text-[10px] text-slate-300 font-medium">
                  {m.label}:
                </span>
                <span className="font-bold text-white text-xs">
                  {m.value}
                </span>
                {m.badge && (
                  <span className="text-[9px] bg-[#10B981]/20 text-[#10B981] px-1.5 py-0.2 rounded-full font-semibold">
                    {m.badge}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
