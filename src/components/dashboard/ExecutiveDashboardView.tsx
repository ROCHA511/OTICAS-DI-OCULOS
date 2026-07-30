import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Award,
  Target,
  Clock,
  Building2,
  BarChart2,
  CheckCircle2,
  Zap,
  MapPin,
  Star,
  ExternalLink,
  Share2,
  ShieldCheck,
  Glasses,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Wallet,
  UserPlus,
  Stethoscope,
} from 'lucide-react';
import { CashFlowEntry, ServiceOrder } from '../../types';
import { OticasLogo } from '../brand/OticasLogo';
import { AlitaOticaInteligenteBanner } from '../AlitaOticaInteligenteBanner';

interface ExecutiveDashboardViewProps {
  cashFlow: CashFlowEntry[];
  serviceOrders: ServiceOrder[];
  onOpenProfessionalsModal?: () => void;
}

export const ExecutiveDashboardView: React.FC<ExecutiveDashboardViewProps> = ({
  cashFlow,
  serviceOrders,
  onOpenProfessionalsModal,
}) => {
  const [bannerCopied, setBannerCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://ais-dev-qz7lavammczznxwgiawjko-248777919228.us-east5.run.app';

  const handleCopyBannerLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setBannerCopied(true);
    setTimeout(() => setBannerCopied(false), 2500);
  };
  const totalEntradas = cashFlow
    .filter((c) => c.type === 'entrada')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalSaidas = cashFlow
    .filter((c) => c.type === 'saida')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const vendasHoje = 8420.00;
  const vendasMes = totalEntradas + 128450.00;
  const metaMes = 180000.00;
  const conversaoRate = '68.4%';
  const ticketMedio = 'R$ 1.240,00';
  const contasAReceber = 24800.00;
  const contasAPagar = totalSaidas + 14200.00;
  const saldoCaixa = vendasMes - contasAPagar;

  const vendedores = [
    { name: 'Julia Martins', vendas: 'R$ 38.450,00', os: 28, meta: '112%', ticket: 'R$ 1.373,00' },
    { name: 'Carlos Eduardo', vendas: 'R$ 29.800,00', os: 22, meta: '98%', ticket: 'R$ 1.354,00' },
    { name: 'Mariana Souza', vendas: 'R$ 24.300,00', os: 19, meta: '91%', ticket: 'R$ 1.278,00' },
    { name: 'Roberto Lima', vendas: 'R$ 18.200,00', os: 14, meta: '82%', ticket: 'R$ 1.300,00' },
  ];

  const filiais = [
    { name: 'Matriz Centro (Ituberá - BA)', faturamento: 'R$ 62.400,00', meta: '108%', ticket: 'R$ 1.310,00' },
    { name: 'Shopping Prime', faturamento: 'R$ 48.350,00', meta: '95%', ticket: 'R$ 1.240,00' },
    { name: 'Zona Sul', faturamento: 'R$ 34.100,00', meta: '88%', ticket: 'R$ 1.180,00' },
  ];

  const produtosMaisVendidos = [
    { name: 'Lente Crizal Sapphire Anti-reflexo', qtd: 84, valor: 'R$ 58.800,00' },
    { name: 'Armação Ray-Ban Wayfarer Acetato', qtd: 42, valor: 'R$ 29.400,00' },
    { name: 'Lente Multifocal Varilux Comfort', qtd: 28, valor: 'R$ 39.200,00' },
    { name: 'Armação Oakley Metal Titânio', qtd: 24, valor: 'R$ 18.000,00' },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#F7F8FA] p-4 sm:p-6 space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-[20px] border border-[#C9A96E]/20 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#071D49] rounded-2xl border border-[#C9A96E]/40 shrink-0">
            <OticasLogo size="md" variant="light-text" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#071D49] text-[#C9A96E] text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border border-[#C9A96E]/30">
                PRIME ENTERPRISE
              </span>
              <h1 className="text-base font-bold text-[#111827] tracking-tight">
                Dashboard Executivo & CRM
              </h1>
            </div>
            <p className="text-xs text-[#6B7280] font-normal mt-0.5">
              Métricas estratégicas de faturamento, vendas, conversão, ticket médio e rankings corporativos.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenProfessionalsModal}
            className="px-4 py-2 bg-[#071D49] hover:bg-[#0B255C] text-[#C9A96E] font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 border border-[#C9A96E]/50 cursor-pointer active:scale-95"
            title="Cadastrar Médicos, Optometristas e Vendedores"
          >
            <UserPlus className="w-4 h-4 text-[#C9A96E]" />
            <span>+ Cadastrar Profissional</span>
          </button>

          <button className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 border border-slate-300 cursor-pointer">
            <Zap className="w-3.5 h-3.5 text-slate-600" /> Atualizar
          </button>
        </div>
      </div>

      {/* Alita Android Official Link Banner for 10 Testers */}
      <AlitaOticaInteligenteBanner
        shareUrl={shareUrl}
        onCopy={handleCopyBannerLink}
        copied={bannerCopied}
      />

      {/* Google Business Profile Banner */}
      <div className="bg-[#071D49] text-white p-4 sm:p-5 rounded-[20px] border border-[#C9A96E]/40 shadow-sm relative overflow-hidden space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-[#10B981]/20 text-[#10B981] text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full border border-[#10B981]/40 flex items-center gap-1 shrink-0">
                <ShieldCheck className="w-3 h-3 text-[#10B981]" /> Google Meu Negócio Verificado
              </span>
              <span className="bg-[#C9A96E]/20 text-[#E8D2A8] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#C9A96E]/30 shrink-0">
                SEO Top #1 Ituberá - BA
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 flex-wrap min-w-0">
              <MapPin className="w-4 h-4 text-[#C9A96E] shrink-0" />
              <span>Óticas Di Óculos - Rua 23 de Abril, 51, Centro, Ituberá - BA</span>
            </h2>
            <p className="text-xs text-slate-300 font-normal">
              Relevância regional otimizada para pesquisas no Google ("ótica em Ituberá", "óculos de grau", "exame de vista").
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#0B255C] p-3 rounded-[16px] border border-[#C9A96E]/30 shrink-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#C9A96E] flex items-center justify-center gap-1">
                5.0 <Star className="w-4 h-4 fill-[#C9A96E] text-[#C9A96E]" />
              </div>
              <div className="text-[10px] text-slate-300 font-medium">148 Avaliações 5 Estrelas</div>
            </div>

            <div className="h-8 w-px bg-[#C9A96E]/30" />

            <div className="text-center">
              <div className="text-lg font-bold text-[#10B981]">+1.8k</div>
              <div className="text-[10px] text-slate-300 font-medium">Cliques Maps/Mês</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#C9A96E]/20 text-xs relative z-10">
          <div className="bg-[#0B255C]/80 p-2.5 rounded-xl border border-[#C9A96E]/20 flex items-center justify-between">
            <span className="text-slate-300">Visualizações no Google:</span>
            <span className="font-bold text-white">4.290 / mês</span>
          </div>

          <div className="bg-[#0B255C]/80 p-2.5 rounded-xl border border-[#C9A96E]/20 flex items-center justify-between">
            <span className="text-slate-300">Leads Convertidos WhatsApp:</span>
            <span className="font-bold text-[#C9A96E]">312 clientes</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const msg = `Agradecemos por escolher a Óticas Di Óculos! Poderia nos avaliar com 5 Estrelas no Google? Link: https://maps.google.com/?q=Oticas+Di+Oculos+Itubera`;
                navigator.clipboard?.writeText(msg);
                alert('Link de Avaliação 5 Estrelas copiado!');
              }}
              className="flex-1 bg-[#C9A96E] hover:bg-[#B89659] text-[#071D49] font-bold py-2 px-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer text-[11px]"
            >
              <Share2 className="w-3.5 h-3.5" /> Pedir Avaliação Google
            </button>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-[#0B255C] hover:bg-[#153270] text-[#C9A96E] rounded-xl border border-[#C9A96E]/40 transition-all flex items-center justify-center"
              title="Abrir Google Meu Negócio"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Primary Executive KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Vendas do Dia */}
        <div className="bg-white p-4 rounded-[20px] border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
              Vendas do Dia
            </span>
            <div className="p-2 bg-[#071D49]/10 text-[#071D49] rounded-xl">
              <DollarSign className="w-4 h-4 text-[#071D49]" />
            </div>
          </div>
          <div className="text-xl font-bold text-[#111827]">
            R$ {vendasHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#10B981] font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" /> +14% vs ontem
          </div>
        </div>

        {/* Vendas do Mês */}
        <div className="bg-white p-4 rounded-[20px] border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
              Vendas do Mês
            </span>
            <div className="p-2 bg-[#071D49]/10 text-[#071D49] rounded-xl">
              <TrendingUp className="w-4 h-4 text-[#071D49]" />
            </div>
          </div>
          <div className="text-xl font-bold text-[#111827]">
            R$ {vendasMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[#6B7280]">Meta de R$ 180.000,00</div>
        </div>

        {/* Conversão */}
        <div className="bg-white p-4 rounded-[20px] border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
              Taxa de Conversão
            </span>
            <div className="p-2 bg-[#10B981]/10 text-[#10B981] rounded-xl">
              <Percent className="w-4 h-4 text-[#10B981]" />
            </div>
          </div>
          <div className="text-xl font-bold text-[#111827]">{conversaoRate}</div>
          <div className="text-[11px] text-[#10B981] font-semibold">Alta taxa de fechamento</div>
        </div>

        {/* Ticket Médio */}
        <div className="bg-white p-4 rounded-[20px] border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
              Ticket Médio
            </span>
            <div className="p-2 bg-[#C9A96E]/20 text-[#071D49] rounded-xl">
              <Award className="w-4 h-4 text-[#071D49]" />
            </div>
          </div>
          <div className="text-xl font-bold text-[#111827]">{ticketMedio}</div>
          <div className="text-[11px] text-[#6B7280]">Média por cliente</div>
        </div>
      </div>

      {/* Secondary Financial Indicators (Fluxo de Caixa, Contas a Receber, Contas a Pagar, Meta) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-[20px] border border-slate-200 shadow-xs space-y-1.5">
          <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
            Saldo de Caixa
          </div>
          <div className="text-lg font-bold text-[#10B981]">
            R$ {saldoCaixa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-[#6B7280]">Fluxo de Caixa Operacional</div>
        </div>

        <div className="bg-white p-4 rounded-[20px] border border-slate-200 shadow-xs space-y-1.5">
          <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
            Contas a Receber
          </div>
          <div className="text-lg font-bold text-[#071D49]">
            R$ {contasAReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-[#6B7280]">Anotações & Parcelamentos</div>
        </div>

        <div className="bg-white p-4 rounded-[20px] border border-slate-200 shadow-xs space-y-1.5">
          <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
            Contas a Pagar
          </div>
          <div className="text-lg font-bold text-[#EF4444]">
            R$ {contasAPagar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-[#6B7280]">Fornecedores e Lentes</div>
        </div>

        <div className="bg-white p-4 rounded-[20px] border border-slate-200 shadow-xs space-y-1.5">
          <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider flex items-center justify-between">
            <span>Atingimento da Meta</span>
            <span className="text-[#071D49] font-bold">72.4%</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div className="bg-[#071D49] h-full rounded-full" style={{ width: '72.4%' }} />
          </div>
          <div className="text-[10px] text-[#6B7280]">R$ 130k de R$ 180k</div>
        </div>
      </div>

      {/* Rankings Grid: Vendedores, Filiais, Produtos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ranking Vendedores */}
        <div className="bg-white p-4 rounded-[20px] border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-[#C9A96E]" /> Ranking Vendedores
            </h3>
            <span className="text-[10px] text-[#6B7280]">Comissão 5%</span>
          </div>

          <div className="space-y-2">
            {vendedores.map((v, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 bg-[#F7F8FA] rounded-xl border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-[#071D49] text-[#C9A96E] font-bold text-[11px] flex items-center justify-center shrink-0">
                    #{i + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="font-bold text-[#111827] truncate">{v.name}</div>
                    <div className="text-[10px] text-[#6B7280]">{v.os} OS • Ticket {v.ticket}</div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-bold text-[#10B981]">{v.vendas}</div>
                  <span className="text-[10px] bg-[#10B981]/15 text-[#10B981] px-1.5 py-0.2 rounded font-semibold">
                    Meta: {v.meta}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ranking Filiais */}
        <div className="bg-white p-4 rounded-[20px] border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#C9A96E]" /> Ranking Filiais
            </h3>
            <span className="text-[10px] text-[#6B7280]">3 Unidades</span>
          </div>

          <div className="space-y-2">
            {filiais.map((f, i) => (
              <div
                key={i}
                className="p-3 bg-[#F7F8FA] rounded-xl border border-slate-100 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#111827]">{f.name}</span>
                  <span className="font-bold text-[#071D49]">{f.faturamento}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#6B7280]">
                  <span>Meta: {f.meta}</span>
                  <span className="text-[#10B981] font-semibold">Ticket {f.ticket}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ranking Produtos */}
        <div className="bg-white p-4 rounded-[20px] border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2">
              <Glasses className="w-4 h-4 text-[#C9A96E]" /> Produtos Mais Vendidos
            </h3>
            <span className="text-[10px] text-[#6B7280]">Lentes & Armações</span>
          </div>

          <div className="space-y-2">
            {produtosMaisVendidos.map((p, i) => (
              <div
                key={i}
                className="p-2.5 bg-[#F7F8FA] rounded-xl border border-slate-100 text-xs space-y-0.5"
              >
                <div className="font-bold text-[#111827] text-[11px] truncate">{p.name}</div>
                <div className="flex items-center justify-between text-[10px] text-[#6B7280]">
                  <span>{p.qtd} unidades vendidas</span>
                  <span className="font-bold text-[#071D49]">{p.valor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
