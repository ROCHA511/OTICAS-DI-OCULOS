import React from 'react';
import {
  DollarSign,
  TrendingUp,
  Award,
  Users,
  Target,
  ShoppingBag,
  Clock,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  PieChart
} from 'lucide-react';
import { Seller, UserRole, PeriodFilter, SellerSale, SellerGoal, CommissionMovement } from '../../types/sellers';

interface DashboardSubViewProps {
  currentRole: UserRole;
  currentSeller: Seller;
  selectedPeriod: PeriodFilter;
  setSelectedPeriod: (period: PeriodFilter) => void;
  sales: SellerSale[];
  goals: SellerGoal[];
  movements: CommissionMovement[];
  sellers: Seller[];
  onNavigateSubtab: (subtab: string) => void;
}

export const DashboardSubView: React.FC<DashboardSubViewProps> = ({
  currentRole,
  currentSeller,
  selectedPeriod,
  setSelectedPeriod,
  sales,
  goals,
  movements,
  sellers,
  onNavigateSubtab,
}) => {
  // Compute metrics based on role
  const isSellerOnly = currentRole === 'VENDEDOR';
  const filteredSales = isSellerOnly
    ? sales.filter((s) => s.sellerId === currentSeller.id)
    : sales;

  const totalSalesValue = filteredSales.reduce((acc, s) => acc + s.value, 0);
  const totalSalesCount = filteredSales.length;
  const avgTicket = totalSalesCount > 0 ? totalSalesValue / totalSalesCount : 0;

  const filteredMovements = isSellerOnly
    ? movements.filter((m) => m.sellerId === currentSeller.id)
    : movements;

  const totalCommission = filteredMovements.reduce((acc, m) => acc + m.commissionAmount, 0);
  const pendingCommission = filteredMovements
    ? filteredMovements.filter((m) => m.status === 'PENDENTE').reduce((acc, m) => acc + m.commissionAmount, 0)
    : 0;

  // Goals
  const sellerGoalObj = goals.find((g) => g.sellerId === currentSeller.id) || {
    targetValue: currentSeller.monthlyGoal,
    currentValue: totalSalesValue,
  };

  const targetGoal = isSellerOnly ? sellerGoalObj.targetValue : 120000;
  const currentGoalValue = isSellerOnly ? totalSalesValue : sales.reduce((acc, s) => acc + s.value, 0);
  const goalPercent = Math.min(Math.round((currentGoalValue / (targetGoal || 1)) * 100), 100);

  const periodOptions: PeriodFilter[] = [
    'Hoje',
    'Ontem',
    'Semana',
    'Mês',
    'Trimestre',
    'Ano',
    'Personalizado',
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Welcome & Period Selector Bar */}
      <div className="bg-[#071D49] text-white p-5 rounded-3xl border-2 border-[#C9A96E]/50 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-[#C9A96E]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <img
            src={currentSeller.photo}
            alt={currentSeller.fullName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#C9A96E] shadow-md shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-[#C9A96E] text-[#071D49] font-black px-2 py-0.5 rounded-md uppercase">
                {currentRole}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {currentSeller.branch}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-[#E8D2A8] mt-0.5">
              Olá, {currentSeller.fullName.split(' ')[0]}! 👋
            </h1>
            <p className="text-xs text-slate-300">
              {currentRole === 'CEO'
                ? 'Painel Executivo Geral de Vendas & Performance Financeira das Óticas Di Óculos'
                : currentRole === 'GERENTE'
                ? 'Acompanhamento em tempo real da equipe e metas da Filial'
                : 'Seu Painel Pessoal de Vendas, Comissões e Evolução de Metas'}
            </p>
          </div>
        </div>

        {/* Period Filter Selector */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#0B255C] p-1.5 rounded-2xl border border-[#C9A96E]/40 relative z-10 w-full md:w-auto">
          {periodOptions.map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedPeriod === period
                  ? 'bg-[#C9A96E] text-[#071D49] font-black shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Vendas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 relative overflow-hidden group hover:border-[#071D49] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
              {isSellerOnly ? 'Suas Vendas no Período' : 'Faturamento Total Vendas'}
            </span>
            <div className="p-2 bg-blue-50 text-blue-900 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            R$ {totalSalesValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-emerald-600 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2%
            </span>
            <span className="text-slate-400">vs. período anterior</span>
          </div>
        </div>

        {/* KPI 2: Comissão */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 relative overflow-hidden group hover:border-[#C9A96E] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
              {isSellerOnly ? 'Sua Comissão Acumulada' : 'Comissões Geradas'}
            </span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-700">
            R$ {totalCommission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">A Receber / Pendente:</span>
            <span className="text-amber-800 font-black">
              R$ {pendingCommission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* KPI 3: Metas & Progresso */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 relative overflow-hidden group hover:border-[#071D49] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
              Atingimento da Meta
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 flex items-baseline gap-2">
            <span>{goalPercent}%</span>
            <span className="text-xs text-slate-400 font-normal">
              de R$ {targetGoal.toLocaleString('pt-BR')}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#071D49] to-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${goalPercent}%` }}
            />
          </div>
        </div>

        {/* KPI 4: Ticket Médio & Atendimentos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 relative overflow-hidden group hover:border-[#071D49] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
              Ticket Médio por Venda
            </span>
            <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-900">
            R$ {avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Vendas Realizadas:</span>
            <span className="font-extrabold text-slate-800">{totalSalesCount} OS</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Progress Visuals & Ranking Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Goal Progress Detailed Box */}
        <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#071D49] text-[#E8D2A8] rounded-xl">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase">
                  Progresso das Metas de Vendas (Julho 2026)
                </h3>
                <p className="text-xs text-slate-500">
                  Acompanhamento de metas por valor, multifocais e tratamentos
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateSubtab('metas')}
              className="text-xs font-bold text-[#071D49] hover:underline flex items-center gap-1"
            >
              Ver Todas as Metas <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Meta 1: Valor em Vendas */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Meta de Faturamento (R$)</span>
                <span className="text-[#071D49] font-black">
                  R$ {currentGoalValue.toLocaleString('pt-BR')} / R$ {targetGoal.toLocaleString('pt-BR')} ({goalPercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border">
                <div
                  className="bg-gradient-to-r from-[#071D49] via-blue-600 to-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${goalPercent}%` }}
                />
              </div>
            </div>

            {/* Meta 2: Lentes Multifocais */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Meta Lentes Multifocais (Varilux / Zeiss / Hoya)</span>
                <span className="text-amber-800 font-black">10 / 12 un (83%)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: '83%' }}
                />
              </div>
            </div>

            {/* Meta 3: Tratamentos Antirreflexo */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Meta Tratamentos Premium (BlueControl / Crizal)</span>
                <span className="text-purple-800 font-black">15 / 18 un (83%)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: '83%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top Sellers Ranking Preview */}
        <div className="bg-[#071D49] text-white p-5 rounded-3xl border-2 border-[#C9A96E]/40 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#C9A96E]/30 pb-2">
              <h3 className="text-xs font-black text-[#E8D2A8] uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-[#C9A96E]" /> Ranking de Vendedores
              </h3>
              <button
                onClick={() => onNavigateSubtab('ranking')}
                className="text-[10px] text-[#E8D2A8] underline hover:text-white"
              >
                Ver Completo
              </button>
            </div>

            <div className="space-y-2.5">
              {sellers.slice(0, 3).map((seller, index) => {
                const medals = ['🥇', '🥈', '🥉'];
                return (
                  <div
                    key={seller.id}
                    className="flex items-center justify-between p-2.5 bg-white/10 hover:bg-white/15 rounded-2xl border border-white/10 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{medals[index] || '🎖️'}</span>
                      <img
                        src={seller.photo}
                        alt={seller.fullName}
                        className="w-8 h-8 rounded-xl object-cover border border-[#C9A96E]"
                      />
                      <div>
                        <div className="text-xs font-bold text-white leading-tight">
                          {seller.fullName.split(' ')[0]} {seller.fullName.split(' ')[1]}
                        </div>
                        <div className="text-[10px] text-slate-300">{seller.branch}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-black text-[#E8D2A8]">
                        R$ {seller.monthlyGoal ? Math.round(seller.monthlyGoal * 0.95).toLocaleString('pt-BR') : '28.450'}
                      </div>
                      <div className="text-[9px] text-emerald-400 font-bold">
                        {index === 0 ? '104% da Meta' : index === 1 ? '98% da Meta' : '85% da Meta'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => onNavigateSubtab('premiacoes')}
            className="w-full py-2.5 bg-[#C9A96E] hover:bg-[#b5955a] text-[#071D49] font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> Ver Campanhas e Prêmios Ativos
          </button>
        </div>
      </div>

      {/* Recent Sales List */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-xs font-black text-[#071D49] uppercase tracking-wider flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#C9A96E]" /> Últimas Vendas & Comissões Calculadas
          </h3>
          <button
            onClick={() => onNavigateSubtab('vendedores')}
            className="text-xs font-bold text-[#071D49] hover:underline"
          >
            Ver Histórico Completo
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#071D49] text-[#E8D2A8] font-black uppercase text-[10px]">
              <tr>
                <th className="p-3">OS / Data</th>
                <th className="p-3">Vendedor</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Produto Vendido</th>
                <th className="p-3 text-right">Valor Venda</th>
                <th className="p-3 text-right">Comissão (R$)</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-mono font-bold text-blue-900">
                    <div>{sale.osNumber}</div>
                    <div className="text-[10px] text-slate-400">{sale.date}</div>
                  </td>
                  <td className="p-3 font-bold text-slate-800">{sale.sellerName}</td>
                  <td className="p-3 font-medium text-slate-700">{sale.clientName}</td>
                  <td className="p-3 font-bold text-slate-900 max-w-xs truncate">
                    {sale.productName}
                  </td>
                  <td className="p-3 text-right font-black text-slate-900">
                    R$ {sale.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-right font-black text-emerald-600">
                    R$ {sale.commissionAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
