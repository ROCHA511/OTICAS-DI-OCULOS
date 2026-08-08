import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Award,
  Target,
  Clock,
  Building2,
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
  BarChart3,
  RefreshCw,
  Sparkles,
  PackageCheck,
  MessageSquare,
} from 'lucide-react';
import { CashFlowEntry, ServiceOrder } from '../../types';

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
  const shareUrl =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://oticas-di-oculos.vercel.app';

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

  const vendasHoje = 8420.0;
  const vendasMes = totalEntradas + 128450.0;
  const metaMes = 180000.0;
  const percentMeta = Math.min(Math.round((vendasMes / metaMes) * 100), 100);
  const conversaoRate = '68.4%';
  const ticketMedio = 'R$ 1.240,00';
  const contasAReceber = 24800.0;
  const contasAPagar = totalSaidas + 14200.0;
  const saldoCaixa = vendasMes - contasAPagar;

  const vendedores = [
    { name: 'Julia Martins', vendas: 'R$ 38.450,00', os: 28, meta: '112%', metaOk: true },
    { name: 'Carlos Eduardo', vendas: 'R$ 29.800,00', os: 22, meta: '98%', metaOk: true },
    { name: 'Mariana Souza', vendas: 'R$ 24.300,00', os: 19, meta: '91%', metaOk: true },
    { name: 'Roberto Lima', vendas: 'R$ 18.200,00', os: 14, meta: '82%', metaOk: false },
  ];

  const filiais = [
    { name: 'Matriz Centro', loc: 'Ituberá - BA', faturamento: 'R$ 62.400,00', meta: '108%', ok: true },
    { name: 'Shopping Prime', loc: 'Unidade 2', faturamento: 'R$ 48.350,00', meta: '95%', ok: true },
    { name: 'Zona Sul', loc: 'Unidade 3', faturamento: 'R$ 34.100,00', meta: '88%', ok: false },
  ];

  const produtosMaisVendidos = [
    { name: 'Crizal Sapphire Anti-reflexo', qtd: 84, valor: 'R$ 58.800,00', icon: '🔬' },
    { name: 'Ray-Ban Wayfarer Acetato', qtd: 42, valor: 'R$ 29.400,00', icon: '👓' },
    { name: 'Varilux Comfort Multifocal', qtd: 28, valor: 'R$ 39.200,00', icon: '🔭' },
    { name: 'Oakley Metal Titânio', qtd: 24, valor: 'R$ 18.000,00', icon: '⚡' },
  ];

  const kpiCards = [
    {
      label: 'Vendas do Dia',
      value: `R$ ${vendasHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      delta: '+14% vs ontem',
      deltaUp: true,
      icon: DollarSign,
      accent: '#D4AF37',
      bg: 'from-[#D4AF37]/10 to-[#D4AF37]/5',
    },
    {
      label: 'Faturamento do Mês',
      value: `R$ ${vendasMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      delta: `${percentMeta}% da meta`,
      deltaUp: percentMeta >= 70,
      icon: TrendingUp,
      accent: '#10B981',
      bg: 'from-emerald-500/10 to-emerald-500/5',
    },
    {
      label: 'Taxa de Conversão',
      value: conversaoRate,
      delta: 'Alta taxa de fechamento',
      deltaUp: true,
      icon: Percent,
      accent: '#6366F1',
      bg: 'from-indigo-500/10 to-indigo-500/5',
    },
    {
      label: 'Ticket Médio',
      value: ticketMedio,
      delta: 'Por cliente atendido',
      deltaUp: true,
      icon: Award,
      accent: '#D4AF37',
      bg: 'from-[#D4AF37]/10 to-[#D4AF37]/5',
    },
  ];

  const financeCards = [
    {
      label: 'Saldo de Caixa',
      value: `R$ ${saldoCaixa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      sub: 'Fluxo operacional',
      color: 'text-emerald-400',
      icon: Wallet,
    },
    {
      label: 'Contas a Receber',
      value: `R$ ${contasAReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      sub: 'Anotações & parcelamentos',
      color: 'text-[#D4AF37]',
      icon: PackageCheck,
    },
    {
      label: 'Contas a Pagar',
      value: `R$ ${contasAPagar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      sub: 'Fornecedores e lentes',
      color: 'text-rose-400',
      icon: ArrowDownRight,
    },
    {
      label: 'Atingimento Meta',
      value: `${percentMeta}%`,
      sub: `R$ ${Math.round(vendasMes / 1000)}k de R$ 180k`,
      color: percentMeta >= 70 ? 'text-emerald-400' : 'text-amber-400',
      icon: Target,
      progress: percentMeta,
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-4 sm:p-6 space-y-6 text-slate-800">

      {/* ═══════════════════════════════════════════════════════════════
          WIDGET 3×1 HERO CARD — Destaque Visual em 3 Colunas no Topo
      ═══════════════════════════════════════════════════════════════ */}
      <div
        onClick={() => (onOpenProfessionalsModal ? onOpenProfessionalsModal() : null)}
        className="w-full relative overflow-hidden bg-gradient-to-r from-[#03060D] via-[#080E1B] to-[#03060D] rounded-3xl border-2 border-[#D4AF37] shadow-[0_15px_50px_rgba(212,175,55,0.25)] text-white p-5 sm:p-8 cursor-pointer group hover:border-amber-300 transition-all duration-300 transform active:scale-[0.99]"
      >
        {/* Glow Effects & Metallic Highlights */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none group-hover:bg-[#D4AF37]/30 transition-all" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center relative z-10">
          
          {/* Widget Image / Showcase Frame (3 Columns Banner Visual) */}
          <div className="lg:col-span-2 relative flex flex-col items-start justify-center space-y-4">
            
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#D4AF37] to-amber-500 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-md">
                <Sparkles className="w-3.5 h-3.5" /> HERO WIDGET 3×1 VIP
              </span>
              <span className="text-xs text-amber-300 font-bold hidden sm:inline">• Ótica Inteligente 2.0</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E8D2A8] via-[#D4AF37] to-amber-200 tracking-tight leading-tight drop-shadow-md">
              TECNOLOGIA, ÓCULOS &amp; SOFISTICAÇÃO
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 font-semibold max-w-xl leading-relaxed">
              Destaque absoluto com provador 3D, biometria DNP facial, leitor de prescrições por câmera e inteligência artificial Mary.
            </p>

            {/* Quick Metrics Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="bg-[#0B1528] border border-[#D4AF37]/40 px-3.5 py-1.5 rounded-2xl flex items-center gap-2 text-xs font-bold text-[#E8D2A8] shadow-sm">
                <Glasses className="w-4 h-4 text-[#D4AF37]" />
                <span>2.356 Vendas no Mês</span>
              </div>
              <div className="bg-[#0B1528] border border-emerald-500/40 px-3.5 py-1.5 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-400 shadow-sm">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>IA Mary 100% Ativa</span>
              </div>
            </div>

          </div>

          {/* Right Visual Element: 3D Luxury Optical Frame */}
          <div className="lg:col-span-1 relative flex items-center justify-center">
            <div className="relative group-hover:scale-105 transition-transform duration-500">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-tr from-[#D4AF37] via-amber-400 to-[#E8D2A8] p-1 shadow-2xl shadow-[#D4AF37]/30">
                <div className="w-full h-full bg-[#050810] rounded-[22px] flex items-center justify-center p-2 relative overflow-hidden">
                  <img
                    src="/hero_3x1_widget.jpg"
                    alt="Ótica Inteligente 3x1 Widget"
                    className="w-full h-full object-cover rounded-xl opacity-90 group-hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <Glasses className="w-20 h-20 text-[#D4AF37] stroke-[2.5] absolute inset-0 m-auto drop-shadow-[0_5px_15px_rgba(212,175,55,0.6)]" />
                </div>
              </div>
              <span className="absolute -bottom-3 -right-2 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-slate-950 font-black text-[10px] px-3 py-0.5 rounded-full border-2 border-[#050810] shadow-md uppercase">
                EXCLUSIVO 3×1
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>{card.label}</span>
                <Icon className="w-4 h-4" style={{ color: card.accent }} />
              </div>
              <div className="text-2xl font-black text-slate-900">{card.value}</div>
              <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> {card.delta}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
