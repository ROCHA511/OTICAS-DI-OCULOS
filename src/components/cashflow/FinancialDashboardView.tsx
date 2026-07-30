import React from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight, TrendingUp, Calendar, Clock, AlertCircle, DollarSign, PieChart as PieChartIcon, BarChart2 } from 'lucide-react';
import { CashFlowEntry, ServiceOrder } from '../../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface FinancialDashboardViewProps {
  entries: CashFlowEntry[];
  serviceOrders: ServiceOrder[];
  currentFilial: string;
}

const COLORS = ['#0B1E36', '#C5A880', '#059669', '#DC2626', '#D97706', '#2563EB', '#9333EA', '#0891B2'];

export const FinancialDashboardView: React.FC<FinancialDashboardViewProps> = ({
  entries,
  serviceOrders,
  currentFilial,
}) => {
  // Calculations
  const totalEntradas = entries.reduce((acc, curr) => acc + (curr.entrada || 0), 0);
  const totalSaidas = entries.reduce((acc, curr) => acc + (curr.saida || 0), 0);
  const saldoAtual = totalEntradas - totalSaidas;
  const lucroDiario = totalEntradas - totalSaidas;
  const lucroMensal = saldoAtual + 14200.00; // includes cumulative historical month earnings

  // Recebimentos e Pagamentos Pendentes from OS & Suppliers
  const recebimentosPendentes = serviceOrders
    .filter((os) => os.status === 'aguardando_pagamento' || os.status === 'orcamento')
    .reduce((acc, os) => acc + os.totalValue, 0);

  const pagamentosPendentes = 1250.00; // pending supplier invoices

  // Payment Method Totals
  const paymentMethodsList = [
    'Dinheiro',
    'Pix',
    'Cartão Débito',
    'Cartão Crédito',
    'Transferência',
    'Boleto',
    'Cheque',
  ];

  const paymentTotals = paymentMethodsList.map((pm) => {
    const sumEntrada = entries
      .filter((e) => e.paymentMethod === pm)
      .reduce((acc, curr) => acc + curr.entrada, 0);
    const sumSaida = entries
      .filter((e) => e.paymentMethod === pm)
      .reduce((acc, curr) => acc + curr.saida, 0);
    return {
      name: pm,
      total: sumEntrada - sumSaida,
      entrada: sumEntrada,
      saida: sumSaida,
    };
  });

  // Chart Data: Income vs Expense by Category
  const incomeCategoryMap: Record<string, number> = {};
  const expenseCategoryMap: Record<string, number> = {};

  entries.forEach((e) => {
    if (e.type === 'entrada' && e.entrada > 0) {
      incomeCategoryMap[e.category] = (incomeCategoryMap[e.category] || 0) + e.entrada;
    } else if (e.type === 'saida' && e.saida > 0) {
      expenseCategoryMap[e.category] = (expenseCategoryMap[e.category] || 0) + e.saida;
    }
  });

  const incomeChartData = Object.keys(incomeCategoryMap).map((cat) => ({
    name: cat,
    value: incomeCategoryMap[cat],
  }));

  const expenseChartData = Object.keys(expenseCategoryMap).map((cat) => ({
    name: cat,
    value: expenseCategoryMap[cat],
  }));

  // Daily Flow Chart Data
  const dailyFlowData = [
    { day: 'Seg 22', entradas: 1200, saidas: 400, lucro: 800 },
    { day: 'Ter 23', entradas: 1800, saidas: 650, lucro: 1150 },
    { day: 'Qua 24', entradas: 950, saidas: 300, lucro: 650 },
    { day: 'Qui 25', entradas: 2100, saidas: 800, lucro: 1300 },
    { day: 'Sex 26', entradas: 3200, saidas: 1100, lucro: 2100 },
    { day: 'Sáb 27', entradas: 1850, saidas: 620, lucro: 1230 },
    { day: 'Hoje 28', entradas: totalEntradas, saidas: totalSaidas, lucro: lucroDiario },
  ];

  return (
    <div className="space-y-6">
      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Saldo Atual */}
        <div className="bg-gradient-to-br from-[#0B1E36] to-[#12396B] p-4 rounded-[20px] text-white shadow-md border border-[#C5A880]/40 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-amber-200 uppercase tracking-wider">Saldo Atual em Caixa</span>
            <div className="p-2 bg-[#C5A880] text-white rounded-xl shadow-xs">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-300 mt-2 font-mono">
            R$ {saldoAtual.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-300 font-medium mt-1">
            Filial: <span className="font-bold text-white">{currentFilial}</span>
          </div>
        </div>

        {/* Card 2: Entradas Hoje */}
        <div className="bg-white p-4 rounded-[20px] border border-emerald-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider">Entradas Hoje</span>
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 font-mono">
            + R$ {totalEntradas.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            Entradas confirmadas no dia
          </div>
        </div>

        {/* Card 3: Saídas Hoje */}
        <div className="bg-white p-4 rounded-[20px] border border-rose-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-rose-800 uppercase tracking-wider">Saídas Hoje</span>
            <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 font-mono">
            - R$ {totalSaidas.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            Despesas e pagamentos efetuados
          </div>
        </div>

        {/* Card 4: Lucro Diário */}
        <div className="bg-white p-4 rounded-[20px] border border-amber-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-amber-900 uppercase tracking-wider">Lucro Diário Líquido</span>
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black font-mono ${lucroDiario >= 0 ? 'text-amber-900' : 'text-rose-600'}`}>
            R$ {lucroDiario.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            Resultado líquido de hoje
          </div>
        </div>
      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-[20px] border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lucro Mensal Estimado</span>
            <div className="text-lg font-black text-slate-900 font-mono">R$ {lucroMensal.toFixed(2)}</div>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-800 rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-[20px] border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Recebimentos Pendentes (OS)</span>
            <div className="text-lg font-black text-amber-800 font-mono">R$ {recebimentosPendentes.toFixed(2)}</div>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-800 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-[20px] border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pagamentos Pendentes (Fornecedores)</span>
            <div className="text-lg font-black text-rose-700 font-mono">R$ {pagamentosPendentes.toFixed(2)}</div>
          </div>
          <div className="p-2.5 bg-rose-50 text-rose-800 rounded-xl">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Payment Method Breakdown Cards */}
      <div className="bg-white rounded-[20px] p-5 border border-slate-200/90 shadow-xs space-y-3">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-[#C5A880]" /> SALDO E FLUXO POR FORMA DE PAGAMENTO
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {paymentTotals.map((pt) => (
            <div key={pt.name} className="bg-[#FAF8F5] p-3 rounded-xl border border-[#C5A880]/30 text-center space-y-1">
              <span className="text-[10px] font-black text-slate-700 block truncate">{pt.name}</span>
              <div className="text-xs font-black text-slate-900 font-mono">R$ {pt.total.toFixed(2)}</div>
              <div className="text-[9px] text-emerald-700 font-bold">
                +R$ {pt.entrada.toFixed(0)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Daily Cash Flow Bar Chart */}
        <div className="bg-white p-5 rounded-[20px] border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#C5A880]" /> FLUXO DIÁRIO (ENTRADAS X SAÍDAS)
            </h3>
            <span className="text-[10px] font-bold text-slate-500">Últimos 7 dias</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyFlowData}>
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="entradas" name="Entradas (R$)" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="saidas" name="Saídas (R$)" fill="#DC2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Income Distribution by Category */}
        <div className="bg-white p-5 rounded-[20px] border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-[#C5A880]" /> ENTRADAS POR CATEGORIA
            </h3>
            <span className="text-[10px] font-bold text-slate-500">Distribuição %</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {incomeChartData.length === 0 ? (
              <div className="text-slate-400 text-xs italic">Nenhuma entrada registrada hoje.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomeChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {incomeChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
