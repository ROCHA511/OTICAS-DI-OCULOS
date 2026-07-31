import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  Minus,
  RefreshCw,
  Lock,
  Unlock,
  FileText,
  Table as TableIcon,
  Printer,
  Filter,
  Search,
  Calendar,
  Building2,
  User,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Download,
  Eye,
  Trash2,
  Paperclip,
} from 'lucide-react';

import {
  CashFlowEntry,
  CashClosing,
  CashFlowFilterState,
  UserRole,
  ServiceOrder,
} from '../../types';

import { NewMovementModal } from './NewMovementModal';
import { CashClosingModal } from './CashClosingModal';
import { FinancialDashboardView } from './FinancialDashboardView';
import { CashFlowReportsModal } from './CashFlowReportsModal';
import { ContabilidadeView } from './ContabilidadeView';

interface CashFlowViewProps {
  cashFlow: CashFlowEntry[];
  setCashFlow: React.Dispatch<React.SetStateAction<CashFlowEntry[]>>;
  serviceOrders: ServiceOrder[];
  closings: CashClosing[];
  setClosings: React.Dispatch<React.SetStateAction<CashClosing[]>>;
}

export const CashFlowView: React.FC<CashFlowViewProps> = ({
  cashFlow,
  setCashFlow,
  serviceOrders,
  closings,
  setClosings,
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'movements' | 'dashboard' | 'reports' | 'contabilidade'>('movements');

  // Role permissions testing
  const [currentRole, setCurrentRole] = useState<UserRole>('ADMIN');
  const [currentUser, setCurrentUser] = useState<string>('Julia Martins');

  // Filters State
  const [filters, setFilters] = useState<CashFlowFilterState>({
    startDate: '2026-07-01',
    endDate: '2026-07-31',
    empresa: 'Óticas Di Óculos Prime',
    filial: 'Matriz Centro',
    usuario: 'Todos',
    type: 'todos',
    paymentMethod: 'Todos',
    searchQuery: '',
  });

  // Modal controls
  const [isNewMovementModalOpen, setIsNewMovementModalOpen] = useState(false);
  const [newMovementDefaultType, setNewMovementDefaultType] = useState<'entrada' | 'saida' | 'transferencia'>('entrada');
  const [isClosingModalOpen, setIsClosingModalOpen] = useState(false);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);

  // Cash status state (open or locked/closed)
  const isCashClosed = closings.some(
    (c) => c.dataFechamento === new Date().toISOString().split('T')[0] && c.status === 'fechado'
  );

  // Recalculate cumulative running balance for entries
  const calculateRunningBalances = (entries: CashFlowEntry[]): CashFlowEntry[] => {
    let currentBalance = 0;
    return entries
      .slice()
      .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
      .map((entry) => {
        const entrada = entry.entrada || 0;
        const saida = entry.saida || 0;
        currentBalance = currentBalance + entrada - saida;
        return {
          ...entry,
          saldo: currentBalance,
        };
      })
      .reverse(); // most recent on top
  };

  const processedEntries = calculateRunningBalances(cashFlow);

  // Filtered Entries
  const filteredEntries = processedEntries.filter((entry) => {
    if (filters.empresa !== 'Todas' && entry.empresa !== filters.empresa) return false;
    if (filters.filial !== 'Todas' && entry.filial !== filters.filial) return false;
    if (filters.usuario !== 'Todos' && entry.usuario !== filters.usuario) return false;
    if (filters.type !== 'todos' && entry.type !== filters.type) return false;
    if (filters.paymentMethod !== 'Todos' && entry.paymentMethod !== filters.paymentMethod) return false;
    if (filters.startDate && entry.date < filters.startDate) return false;
    if (filters.endDate && entry.date > filters.endDate) return false;

    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchDesc = entry.description.toLowerCase().includes(q);
      const matchCat = entry.category.toLowerCase().includes(q);
      const matchUser = entry.usuario.toLowerCase().includes(q);
      const matchId = entry.id.toLowerCase().includes(q);
      if (!matchDesc && !matchCat && !matchUser && !matchId) return false;
    }

    return true;
  });

  // Calculate Running Totals for active view
  const totalEntradas = filteredEntries.reduce((acc, curr) => acc + (curr.entrada || 0), 0);
  const totalSaidas = filteredEntries.reduce((acc, curr) => acc + (curr.saida || 0), 0);
  const saldoAtual = totalEntradas - totalSaidas;

  // Handlers
  const handleOpenNewMovement = (type: 'entrada' | 'saida' | 'transferencia') => {
    if (isCashClosed && currentRole !== 'ADMIN') {
      alert('O caixa do dia já foi FECHADO. Apenas Administradores podem adicionar movimentações em caixa fechado.');
      return;
    }
    setNewMovementDefaultType(type);
    setIsNewMovementModalOpen(true);
  };

  const handleSaveMovement = (newEntryData: Omit<CashFlowEntry, 'id' | 'saldo' | 'createdAt' | 'updatedAt'>) => {
    const newEntry: CashFlowEntry = {
      ...newEntryData,
      id: `cf-${Date.now()}`,
      saldo: 0, // will be auto-calculated
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCashFlow((prev) => [newEntry, ...prev]);
  };

  const handleSaveClosing = (closingRecord: CashClosing) => {
    setClosings((prev) => [closingRecord, ...prev]);
  };

  const handleReopenCash = () => {
    if (currentRole !== 'ADMIN' && currentRole !== 'GERENTE') {
      alert('Apenas usuários com perfil GERENTE ou ADMIN podem reabrir o caixa.');
      return;
    }

    if (confirm('Deseja realmente REABRIR O CAIXA do dia? Isso reativará as permissões de edição.')) {
      setClosings((prev) =>
        prev.map((c) =>
          c.dataFechamento === new Date().toISOString().split('T')[0]
            ? { ...c, status: 'reaberto' }
            : c
        )
      );
      alert('Caixa reaberto com sucesso!');
    }
  };

  const handleDeleteEntry = (id: string) => {
    if (currentRole !== 'ADMIN') {
      alert('Apenas Administradores podem excluir registros do Caixa.');
      return;
    }
    if (confirm('Deseja excluir permanentemente este registro do Movimento do Caixa?')) {
      setCashFlow((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,ID,DATA,HORA,USUARIO,TIPO,DESCRICAO,FORMA_PAGAMENTO,ENTRADA,SAIDA,SALDO,STATUS\n';
    filteredEntries.forEach((e) => {
      csvContent += `${e.id},${e.date},${e.time},${e.usuario},${e.type},"${e.description}",${e.paymentMethod},${e.entrada},${e.saida},${e.saldo},${e.status}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Movimento_Caixa_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full bg-[#FAF8F5] flex flex-col min-h-0 overflow-hidden rounded-[20px] p-4 sm:p-6 space-y-4">
      {/* Top Banner / Header */}
      <div className="bg-[#0B1E36] text-white p-4 rounded-[20px] shadow-md border border-[#C5A880]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-[#12396B] to-[#0A2244] text-amber-300 rounded-2xl border border-[#C5A880]/50 shadow-sm">
            <Wallet className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white uppercase font-serif">
                MOVIMENTO DE CAIXA
              </h1>
              <span className="px-2.5 py-0.5 bg-[#C5A880] text-white text-[10px] font-black rounded-full uppercase tracking-wider shadow-2xs">
                Versão 2026 Premium
              </span>
            </div>
            <p className="text-xs text-amber-200/80 font-medium">
              Óticas Di Óculos Prime CRM - Livro Caixa e Gestão Financeira Digital em Tempo Real
            </p>
          </div>
        </div>

        {/* Dynamic Role Switcher */}
        <div className="flex items-center gap-2 bg-[#0F2D59] p-1.5 rounded-2xl border border-[#C5A880]/40 text-xs shrink-0">
          <ShieldCheck className="w-4 h-4 text-amber-300 ml-1.5" />
          <span className="text-[10px] text-amber-200 font-bold uppercase hidden sm:inline">Perfil:</span>
          <select
            value={currentRole}
            onChange={(e) => {
              const r = e.target.value as UserRole;
              setCurrentRole(r);
              if (r === 'VENDEDOR') setCurrentUser('Carlos Vendedor');
              else if (r === 'FINANCEIRO') setCurrentUser('Roberto Financeiro');
              else if (r === 'AUDITOR') setCurrentUser('Auditor Externo');
              else setCurrentUser('Julia Martins');
            }}
            className="bg-[#0B1E36] text-amber-300 font-black rounded-xl px-2.5 py-1 text-xs focus:outline-none cursor-pointer border border-[#C5A880]/30"
          >
            <option value="ADMIN">ADMIN (Acesso Total)</option>
            <option value="GERENTE">GERENTE (Abrir/Fechar Caixa)</option>
            <option value="VENDEDOR">VENDEDOR (Movimentações)</option>
            <option value="FINANCEIRO">FINANCEIRO (Relatórios)</option>
            <option value="AUDITOR">AUDITOR (Somente Leitura)</option>
          </select>
        </div>
      </div>

      {/* Main Filter Bar */}
      <div className="bg-white p-3.5 rounded-[20px] border border-[#C5A880]/20 shadow-xs space-y-3 shrink-0">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 text-xs font-semibold">
          {/* Data Inicial */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
              Data Inicial
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
            />
          </div>

          {/* Data Final */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
              Data Final
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
            />
          </div>

          {/* Empresa */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
              Empresa
            </label>
            <select
              value={filters.empresa}
              onChange={(e) => setFilters((prev) => ({ ...prev, empresa: e.target.value }))}
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl px-2 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
            >
              <option value="Óticas Di Óculos Prime">Óticas Di Óculos Prime</option>
              <option value="Óticas Di Óculos LTDA">Óticas Di Óculos LTDA</option>
              <option value="Todas">Todas as Empresas</option>
            </select>
          </div>

          {/* Filial */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
              Filial
            </label>
            <select
              value={filters.filial}
              onChange={(e) => setFilters((prev) => ({ ...prev, filial: e.target.value }))}
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl px-2 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
            >
              <option value="Matriz Centro">Matriz Centro</option>
              <option value="Shopping Prime">Shopping Prime</option>
              <option value="Zona Sul">Zona Sul</option>
              <option value="Todas">Todas as Filiais</option>
            </select>
          </div>

          {/* Usuário */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
              Usuário
            </label>
            <select
              value={filters.usuario}
              onChange={(e) => setFilters((prev) => ({ ...prev, usuario: e.target.value }))}
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl px-2 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
            >
              <option value="Todos">Todos os Usuários</option>
              <option value="Julia Martins">Julia Martins</option>
              <option value="Carlos Vendedor">Carlos Vendedor</option>
              <option value="Roberto Financeiro">Roberto Financeiro</option>
            </select>
          </div>

          {/* Tipo Movimento */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
              Tipo Movimento
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value as any }))}
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl px-2 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
            >
              <option value="todos">Todos os Tipos</option>
              <option value="entrada">Entradas (+)</option>
              <option value="saida">Saídas (-)</option>
              <option value="transferencia">Transferências (⇄)</option>
            </select>
          </div>

          {/* Quick Search */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
              Buscar por Texto
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Descrição, OS..."
                value={filters.searchQuery}
                onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl pl-8 pr-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons Toolbar (Exactly as in prompt request) */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pt-2 border-t border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            {/* NOVA ENTRADA */}
            <button
              onClick={() => handleOpenNewMovement('entrada')}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-2xs flex items-center gap-1.5 uppercase tracking-wider transition-all"
            >
              <Plus className="w-4 h-4" /> NOVA ENTRADA
            </button>

            {/* NOVA SAÍDA */}
            <button
              onClick={() => handleOpenNewMovement('saida')}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs shadow-2xs flex items-center gap-1.5 uppercase tracking-wider transition-all"
            >
              <Minus className="w-4 h-4" /> NOVA SAÍDA
            </button>

            {/* TRANSFERÊNCIA */}
            <button
              onClick={() => handleOpenNewMovement('transferencia')}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-xl text-xs shadow-2xs flex items-center gap-1.5 uppercase tracking-wider transition-all"
            >
              <RefreshCw className="w-4 h-4" /> TRANSFERÊNCIA
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* FECHAR CAIXA */}
            <button
              onClick={() => setIsClosingModalOpen(true)}
              className={`px-3.5 py-2 text-white font-black rounded-xl text-xs shadow-2xs flex items-center gap-1.5 uppercase tracking-wider transition-all ${
                isCashClosed
                  ? 'bg-slate-700 hover:bg-slate-800'
                  : 'bg-[#0B1E36] hover:bg-[#112d52] border border-[#C5A880]/40 text-amber-300'
              }`}
            >
              <Lock className="w-4 h-4 text-amber-300" />
              {isCashClosed ? 'CAIXA FECHADO (Ver)' : 'FECHAR CAIXA'}
            </button>

            {/* REABRIR CAIXA */}
            {isCashClosed && (
              <button
                onClick={handleReopenCash}
                className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl text-xs shadow-2xs flex items-center gap-1.5 uppercase tracking-wider transition-all"
              >
                <Unlock className="w-4 h-4" /> REABRIR CAIXA
              </button>
            )}

            {/* EXPORTAR PDF */}
            <button
              onClick={() => window.print()}
              className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold rounded-xl text-xs flex items-center gap-1 transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-rose-600" /> PDF
            </button>

            {/* EXPORTAR EXCEL */}
            <button
              onClick={handleExportCSV}
              className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold rounded-xl text-xs flex items-center gap-1 transition-all"
            >
              <TableIcon className="w-3.5 h-3.5 text-emerald-600" /> EXCEL
            </button>

            {/* IMPRIMIR */}
            <button
              onClick={() => window.print()}
              className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold rounded-xl text-xs flex items-center gap-1 transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" /> IMPRIMIR
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-[#C5A880]/20 pb-1 shrink-0">
        <button
          onClick={() => setActiveTab('movements')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all border ${
            activeTab === 'movements'
              ? 'bg-[#0B1E36] text-amber-300 border-[#C5A880]/50 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <TableIcon className="w-4 h-4" /> Tabela de Movimentações ({filteredEntries.length})
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all border ${
            activeTab === 'dashboard'
              ? 'bg-[#0B1E36] text-amber-300 border-[#C5A880]/50 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Wallet className="w-4 h-4" /> Dashboard Financeiro
        </button>

        <button
          onClick={() => setIsReportsModalOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all border bg-white text-slate-700 border-slate-200 hover:bg-amber-50 hover:border-[#C5A880]"
        >
          <FileText className="w-4 h-4 text-[#C5A880]" /> Relatórios & Livro Caixa
        </button>

        <button
          onClick={() => setActiveTab('contabilidade')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all border ${
            activeTab === 'contabilidade'
              ? 'bg-[#0B1E36] text-amber-300 border-[#C5A880]/50 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" /> Módulo Contábil
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {activeTab === 'movements' && (
          <div className="bg-white rounded-[20px] border border-slate-200/90 shadow-xs overflow-hidden flex flex-col h-full">
            {/* Table Header Summary */}
            <div className="p-3.5 bg-[#FAF8F5] border-b border-[#C5A880]/20 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="text-slate-600">Total Entradas: <strong className="text-emerald-700">R$ {totalEntradas.toFixed(2)}</strong></span>
                <span className="text-slate-600">Total Saídas: <strong className="text-rose-700">R$ {totalSaidas.toFixed(2)}</strong></span>
                <span className="text-slate-900 font-black">Saldo do Período: <strong className="text-[#0B1E36]">R$ {saldoAtual.toFixed(2)}</strong></span>
              </div>

              <div className="text-[10px] text-slate-500 font-medium">
                Mostrando {filteredEntries.length} registros
              </div>
            </div>

            {/* TABELA PRINCIPAL (Exact Columns from user prompt) */}
            <div className="flex-1 overflow-x-auto overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 z-10 bg-[#0B1E36] text-amber-200 font-extrabold uppercase text-[10px] tracking-wider border-b border-[#C5A880]/30 shadow-xs">
                  <tr>
                    <th className="py-3 px-3">ID</th>
                    <th className="py-3 px-3">DATA</th>
                    <th className="py-3 px-3">HORA</th>
                    <th className="py-3 px-3">USUÁRIO</th>
                    <th className="py-3 px-3">TIPO</th>
                    <th className="py-3 px-3">DESCRIÇÃO</th>
                    <th className="py-3 px-3">FORMA PAGAMENTO</th>
                    <th className="py-3 px-3 text-right">ENTRADA</th>
                    <th className="py-3 px-3 text-right">SAÍDA</th>
                    <th className="py-3 px-3 text-right">SALDO</th>
                    <th className="py-3 px-3">OBSERVAÇÃO</th>
                    <th className="py-3 px-3 text-center">STATUS</th>
                    <th className="py-3 px-3 text-center">AÇÕES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {filteredEntries.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="py-12 text-center text-slate-400 italic">
                        Nenhuma movimentação registrada para os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    filteredEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-50/80 transition-all">
                        <td className="py-2.5 px-3 font-mono font-bold text-[11px] text-slate-900">
                          {entry.id}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">{entry.date}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">{entry.time}</td>
                        <td className="py-2.5 px-3 font-semibold">{entry.usuario}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              entry.type === 'entrada'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : entry.type === 'saida'
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {entry.type}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 max-w-xs">
                          <div className="font-bold text-slate-900">{entry.description}</div>
                          <div className="text-[10px] text-slate-500">{entry.category}</div>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-800">{entry.paymentMethod}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-black text-emerald-700">
                          {entry.entrada > 0 ? `R$ ${entry.entrada.toFixed(2)}` : '-'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-black text-rose-700">
                          {entry.saida > 0 ? `R$ ${entry.saida.toFixed(2)}` : '-'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-black text-[#0B1E36]">
                          R$ {entry.saldo.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-500 max-w-xs truncate">
                          {entry.observacao || '-'}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold rounded-md uppercase">
                            {entry.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            {entry.comprovanteUrl && (
                              <button
                                onClick={() => alert(`Visualizando comprovante: ${entry.comprovanteUrl}`)}
                                title="Ver Comprovante"
                                className="p-1 text-slate-500 hover:text-blue-600 rounded"
                              >
                                <Paperclip className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {currentRole === 'ADMIN' && (
                              <button
                                onClick={() => handleDeleteEntry(entry.id)}
                                title="Excluir Registro"
                                className="p-1 text-slate-400 hover:text-rose-600 rounded transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <FinancialDashboardView
            entries={filteredEntries}
            serviceOrders={serviceOrders}
            currentFilial={filters.filial}
          />
        )}

        {activeTab === 'contabilidade' && (
          <ContabilidadeView />
        )}
      </div>

      {/* Modals */}
      <NewMovementModal
        isOpen={isNewMovementModalOpen}
        onClose={() => setIsNewMovementModalOpen(false)}
        onSave={handleSaveMovement}
        defaultType={newMovementDefaultType}
        currentEmpresa={filters.empresa}
        currentFilial={filters.filial}
        currentUser={currentUser}
        currentRole={currentRole}
      />

      <CashClosingModal
        isOpen={isClosingModalOpen}
        onClose={() => setIsClosingModalOpen(false)}
        entries={filteredEntries}
        currentEmpresa={filters.empresa}
        currentFilial={filters.filial}
        currentUser={currentUser}
        currentRole={currentRole}
        onSaveClosing={handleSaveClosing}
      />

      <CashFlowReportsModal
        isOpen={isReportsModalOpen}
        onClose={() => setIsReportsModalOpen(false)}
        entries={filteredEntries}
        closings={closings}
        currentEmpresa={filters.empresa}
        currentFilial={filters.filial}
      />
    </div>
  );
};
