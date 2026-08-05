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
  const shareUrl =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://ais-dev-qz7lavammczznxwgiawjko-248777919228.us-east5.run.app';

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
    <div className="flex-1 overflow-y-auto bg-[#080C14] p-4 sm:p-6 space-y-5">

      {/* ═══════════════════════════════════════════
          HERO HEADER — Executive Identity Bar
      ═══════════════════════════════════════════ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#131B2E] to-[#0A0E17] border border-[#D4AF37]/25 rounded-2xl p-4 sm:p-5 shadow-2xl">
        {/* Ambient glows */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#D4AF37]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Brand Identity Icon */}
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-amber-600 flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                <Glasses className="w-7 h-7 text-slate-950" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#0F172A] rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 uppercase">
                  <ShieldCheck className="w-3 h-3" /> Prime Enterprise
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Sistema Ativo
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-white mt-1 tracking-tight">
                Dashboard Executivo <span className="text-[#D4AF37]">&</span> CRM
              </h1>
              <p className="text-xs text-slate-400 mt-0.5 font-normal">
                Métricas estratégicas · Faturamento · Conversão · Rankings Corporativos
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={onOpenProfessionalsModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:from-[#E5C158] hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-[#D4AF37]/10 transition-all active:scale-95 cursor-pointer border border-amber-300/30"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Cadastrar Profissional</span>
            </button>
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#161D2A] hover:bg-[#1E293B] text-white font-semibold text-xs transition-all border border-white/10 cursor-pointer active:scale-95">
              <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" /> Atualizar
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          BENTO GRID — Primary KPI Cards (4 metrics)
      ═══════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`relative overflow-hidden bg-gradient-to-br ${card.bg} backdrop-blur-sm border border-white/8 rounded-2xl p-4 shadow-xl hover:border-white/15 transition-all group`}
              style={{ background: `linear-gradient(135deg, ${card.accent}12 0%, #0F172A 100%)` }}
            >
              {/* Corner glow */}
              <div
                className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20 pointer-events-none"
                style={{ background: card.accent }}
              />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{card.label}</span>
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: `${card.accent}20` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: card.accent }} />
                  </div>
                </div>
                <div className="text-lg sm:text-xl font-bold text-white tracking-tight">{card.value}</div>
                <div
                  className={`flex items-center gap-1 text-[11px] font-semibold mt-1.5 ${card.deltaUp ? 'text-emerald-400' : 'text-rose-400'}`}
                >
                  {card.deltaUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {card.delta}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════
          FINANCE STRIP — Secondary Indicators
      ═══════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {financeCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-[#0F172A] border border-white/8 rounded-2xl p-4 shadow-lg hover:border-[#D4AF37]/20 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{card.label}</span>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <div className={`text-base sm:text-lg font-bold ${card.color} tracking-tight`}>{card.value}</div>
              {card.progress !== undefined ? (
                <div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-amber-400 transition-all"
                      style={{ width: `${card.progress}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">{card.sub}</div>
                </div>
              ) : (
                <div className="text-[10px] text-slate-500">{card.sub}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════
          ALITA AI — Executive Assistant Banner
      ═══════════════════════════════════════════ */}
      <AlitaOticaInteligenteBanner
        shareUrl={shareUrl}
        onCopy={handleCopyBannerLink}
        copied={bannerCopied}
      />

      {/* ═══════════════════════════════════════════
          RANKINGS GRID — 3 Column Bento
      ═══════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">

        {/* — Ranking Vendedores — */}
        <div className="bg-[#0F172A] border border-white/8 rounded-2xl p-4 shadow-xl space-y-3 hover:border-[#D4AF37]/20 transition-all">
          <div className="flex items-center justify-between pb-2.5 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
              </div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Ranking Vendedores</h3>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Comissão 5%</span>
          </div>

          <div className="space-y-2">
            {vendedores.map((v, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 bg-[#161D2A] rounded-xl border border-white/5 text-xs hover:border-[#D4AF37]/20 transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                    style={{
                      background: i === 0 ? '#D4AF3730' : '#FFFFFF10',
                      color: i === 0 ? '#D4AF37' : '#94A3B8',
                    }}
                  >
                    {i === 0 ? '🥇' : `#${i + 1}`}
                  </span>
                  <div className="min-w-0">
                    <div className="font-semibold text-white truncate">{v.name}</div>
                    <div className="text-[10px] text-slate-500">{v.os} OS</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-emerald-400 text-xs">{v.vendas}</div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${v.metaOk ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}
                  >
                    {v.meta}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* — Ranking Filiais — */}
        <div className="bg-[#0F172A] border border-white/8 rounded-2xl p-4 shadow-xl space-y-3 hover:border-[#D4AF37]/20 transition-all">
          <div className="flex items-center justify-between pb-2.5 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Ranking Filiais</h3>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">3 Unidades</span>
          </div>

          <div className="space-y-2">
            {filiais.map((f, i) => {
              const pct = [108, 95, 88][i];
              return (
                <div key={i} className="p-3 bg-[#161D2A] rounded-xl border border-white/5 space-y-2 hover:border-indigo-500/20 transition-all">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-white">{f.name}</div>
                      <div className="text-[10px] text-slate-500">{f.loc}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#D4AF37] text-xs">{f.faturamento}</div>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${f.ok ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}
                      >
                        Meta {f.meta}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${f.ok ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-amber-500 to-amber-400'}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* — Produtos Mais Vendidos — */}
        <div className="bg-[#0F172A] border border-white/8 rounded-2xl p-4 shadow-xl space-y-3 hover:border-[#D4AF37]/20 transition-all">
          <div className="flex items-center justify-between pb-2.5 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center">
                <Glasses className="w-3.5 h-3.5 text-[#D4AF37]" />
              </div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Mais Vendidos</h3>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Lentes & Armações</span>
          </div>

          <div className="space-y-2">
            {produtosMaisVendidos.map((p, i) => (
              <div
                key={i}
                className="p-2.5 bg-[#161D2A] rounded-xl border border-white/5 hover:border-[#D4AF37]/15 transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base shrink-0">{p.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-[11px] truncate">{p.name}</div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[10px] text-slate-500">{p.qtd} unid.</span>
                      <span className="text-[11px] font-bold text-[#D4AF37]">{p.valor}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          GOOGLE BUSINESS PROFILE — Premium Card
      ═══════════════════════════════════════════ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#141C2D] to-[#0A0E17] border border-[#D4AF37]/25 rounded-2xl p-4 sm:p-5 shadow-2xl">
        <div className="absolute -top-12 -right-12 w-56 h-56 bg-[#D4AF37]/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                <ShieldCheck className="w-3 h-3" /> Google Meu Negócio Verificado
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
                SEO Top #1 Ituberá - BA
              </span>
            </div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Óticas Di Óculos — Rua 23 de Abril, 51, Centro, Ituberá - BA</span>
            </h2>
            <p className="text-xs text-slate-400">
              Relevância regional otimizada para "ótica em Ituberá", "óculos de grau" e "exame de vista" no Google.
            </p>
          </div>

          {/* Stars & Metrics */}
          <div className="flex items-center gap-3 bg-[#161D2A] p-3 rounded-xl border border-[#D4AF37]/20 shrink-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#D4AF37] flex items-center justify-center gap-1">
                5.0 <Star className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">148 avaliações</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <div className="text-lg font-bold text-emerald-400">+1.8k</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Cliques / Mês</div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/5">
          <div className="bg-[#161D2A] p-2.5 rounded-xl border border-white/5 flex items-center justify-between text-xs">
            <span className="text-slate-400">Visualizações Google</span>
            <span className="font-bold text-white">4.290/mês</span>
          </div>
          <div className="bg-[#161D2A] p-2.5 rounded-xl border border-white/5 flex items-center justify-between text-xs">
            <span className="text-slate-400">Leads WhatsApp</span>
            <span className="font-bold text-[#D4AF37]">312 clientes</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const msg = `Obrigado por escolher a Óticas Di Óculos! Poderia nos avaliar com 5 Estrelas no Google? Link: https://maps.google.com/?q=Oticas+Di+Oculos+Itubera`;
                navigator.clipboard?.writeText(msg);
                alert('Mensagem de Avaliação 5 Estrelas copiada!');
              }}
              className="flex-1 bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:from-[#E5C158] hover:to-amber-400 text-slate-950 font-bold py-2 px-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer text-[11px] active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" /> Pedir Avaliação
            </button>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 bg-[#161D2A] hover:bg-[#1E293B] text-[#D4AF37] rounded-xl border border-[#D4AF37]/30 transition-all flex items-center justify-center"
              title="Abrir Google Meu Negócio"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          QUICK ACTIONS FOOTER BAR
      ═══════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-20 sm:pb-4">
        {[
          { icon: BarChart3, label: 'Relatórios', color: '#D4AF37', bg: '#D4AF3715' },
          { icon: MessageSquare, label: 'Chat Equipe', color: '#10B981', bg: '#10B98115' },
          { icon: Sparkles, label: 'IA Alita', color: '#6366F1', bg: '#6366F115' },
          { icon: CheckCircle2, label: 'OS Prontas', color: '#D4AF37', bg: '#D4AF3715' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              className="flex items-center gap-2.5 p-3 rounded-xl border border-white/8 transition-all cursor-pointer active:scale-95 hover:border-white/15"
              style={{ background: `linear-gradient(135deg, ${item.bg} 0%, #0F172A 100%)` }}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${item.color}20` }}>
                <Icon className="w-4 h-4" style={{ color: item.color }} />
              </div>
              <span className="text-xs font-semibold text-white">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
