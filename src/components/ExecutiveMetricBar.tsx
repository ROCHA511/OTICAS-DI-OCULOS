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

interface ExecutiveMetricBarProps {
  totalTodaySales: number;
  activeChatsCount: number;
  inLabCount: number;
  onOpenNews?: () => void;
}

export const ExecutiveMetricBar: React.FC<ExecutiveMetricBarProps> = ({
  totalTodaySales,
  activeChatsCount,
  inLabCount,
  onOpenNews,
}) => {
  const metrics = [
    {
      label: 'Atendimento Hoje',
      value: `${activeChatsCount + 18}`,
      icon: Users,
      color: 'text-[#C9A96E]',
    },
    {
      label: 'Vendas Hoje',
      value: `R$ ${(totalTodaySales + 4200).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      color: 'text-[#10B981]',
    },
    {
      label: 'Ticket Médio',
      value: 'R$ 1.240,00',
      icon: Award,
      color: 'text-[#C9A96E]',
    },
    {
      label: 'Conversão',
      value: '68%',
      icon: Percent,
      color: 'text-[#10B981]',
    },
    {
      label: 'IA Status',
      value: 'Mary Online (98%)',
      icon: Sparkles,
      color: 'text-[#C9A96E]',
      badge: 'Ativa',
    },
    {
      label: 'OS Laboratório',
      value: `${inLabCount + 8} Ativas`,
      icon: Clock,
      color: 'text-[#E8D2A8]',
    },
    {
      label: 'Meta do Dia',
      value: '84% (R$ 8.420 / 10k)',
      icon: Target,
      color: 'text-[#C9A96E]',
    },
    {
      label: 'Meta do Mês',
      value: '72% (R$ 130k / 180k)',
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
      value: '5 Clientes',
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
