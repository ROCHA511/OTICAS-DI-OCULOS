import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  Users,
  DollarSign,
  Plus,
  Store,
  BarChart3,
  Globe2,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';

interface BranchData {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  manager: string;
  monthlyRevenue: number;
  ordersToday: number;
  activeSellers: number;
  status: 'Ativa' | 'Expansão' | 'Manutenção';
  growth: number;
}

export const MultiticasDashboard: React.FC = () => {
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [branches, setBranches] = useState<BranchData[]>([
    {
      id: 'b1',
      name: 'Matriz Centro',
      location: 'Ituberá - BA',
      address: 'Rua 23 de Abril, 51, Centro',
      phone: '(73) 98112-8923',
      manager: 'Dioenne Rocha',
      monthlyRevenue: 148500.0,
      ordersToday: 24,
      activeSellers: 8,
      status: 'Ativa',
      growth: 14.8,
    },
    {
      id: 'b2',
      name: 'Shopping Prime',
      location: 'Valença - BA',
      address: 'Av. ACM, 400 - Loja 12',
      phone: '(75) 99823-4411',
      manager: 'Mariana Santos',
      monthlyRevenue: 92300.0,
      ordersToday: 15,
      activeSellers: 5,
      status: 'Ativa',
      growth: 9.2,
    },
    {
      id: 'b3',
      name: 'Filial Zona Sul',
      location: 'Ilhéus - BA',
      address: 'Av. Soares Lopes, 820',
      phone: '(73) 99104-5522',
      manager: 'Carlos Eduardo',
      monthlyRevenue: 64200.0,
      ordersToday: 9,
      activeSellers: 4,
      status: 'Ativa',
      growth: 6.4,
    },
  ]);

  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [newBranch, setNewBranch] = useState({ name: '', location: '', address: '', phone: '', manager: '' });

  const totalMonthlyRevenue = branches.reduce((sum, b) => sum + b.monthlyRevenue, 0);
  const totalOrdersToday = branches.reduce((sum, b) => sum + b.ordersToday, 0);
  const totalActiveSellers = branches.reduce((sum, b) => sum + b.activeSellers, 0);

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranch.name || !newBranch.location) {
      alert('Preencha ao menos Nome e Cidade da Filial.');
      return;
    }
    const created: BranchData = {
      id: `b${Date.now()}`,
      name: newBranch.name,
      location: newBranch.location,
      address: newBranch.address || 'Endereço Comercial',
      phone: newBranch.phone || '(00) 00000-0000',
      manager: newBranch.manager || 'Gerente Responsável',
      monthlyRevenue: 0,
      ordersToday: 0,
      activeSellers: 1,
      status: 'Ativa',
      growth: 0,
    };
    setBranches((prev) => [...prev, created]);
    setShowAddBranchModal(false);
    setNewBranch({ name: '', location: '', address: '', phone: '', manager: '' });
    alert(`Nova Filial "${created.name}" cadastrada no ecossistema Multi-Óticas!`);
  };

  return (
    <div className="w-full h-full min-h-0 overflow-y-auto bg-[#F0F7FF] p-3 sm:p-6 space-y-6 text-slate-800 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#071D49] via-[#0B255C] to-[#071D49] p-5 sm:p-6 rounded-3xl border-2 border-[#C9A96E]/50 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-[#C9A96E]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#C9A96E] text-[#071D49] px-2.5 py-0.5 rounded-full border border-white/20">
              PAINEL MULTI-ÓTICAS VIP
            </span>
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 3 Filiais Sincronizadas
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#E8D2A8] tracking-tight">
            Gestão Consolidada de Redes de Óticas & Multitenant
          </h1>
          <p className="text-xs text-slate-200">
            Acompanhamento centralizado de faturamento, vendas diárias, metas e equipes por unidade em tempo real.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setShowAddBranchModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:from-[#E5C158] hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Nova Filial
          </button>
        </div>
      </div>

      {/* Corporate High-Level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-3xl border border-blue-100 shadow-xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Faturamento Consolidado</span>
            <DollarSign className="w-5 h-5 text-[#0055A5]" />
          </div>
          <div className="text-2xl font-black text-[#071D49]">
            R$ {totalMonthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +12.4% vs mês anterior
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-3xl border border-blue-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Vendas Hoje (Rede)</span>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalOrdersToday} Serviços</div>
          <p className="text-xs text-slate-500 font-medium">Ticket Médio: R$ 1.840,00</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-3xl border border-blue-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Equipe de Vendas Ativa</span>
            <Users className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalActiveSellers} Vendedores</div>
          <p className="text-xs text-slate-500 font-medium">Distribuídos em {branches.length} filiais</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-3xl border border-blue-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Status ERP Multitenant</span>
            <Globe2 className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-base font-black text-emerald-700 flex items-center gap-1.5 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" /> 100% Operacional
          </div>
          <p className="text-xs text-slate-500 font-medium">Cloud Supabase + RLS Ativos</p>
        </div>
      </div>

      {/* Branches List Table */}
      <div className="bg-white rounded-3xl border border-blue-100 shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-extrabold text-[#071D49] flex items-center gap-2">
              <Store className="w-5 h-5 text-[#D4AF37]" /> Unidades Ópticas Registradas ({branches.length})
            </h2>
            <p className="text-xs text-slate-500">Desempenho individual por filial da rede Óticas Di Óculos</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0055A5]"
            >
              <option value="all">Todas as Filiais</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.location})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {branches
            .filter((b) => selectedBranchId === 'all' || b.id === selectedBranchId)
            .map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-[#0055A5]/40 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-[#0055A5] px-2.5 py-0.5 rounded-full border border-blue-100">
                      {b.location}
                    </span>
                    <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                      {b.status}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900">{b.name}</h3>
                  <p className="text-xs text-slate-500 leading-snug">{b.address}</p>
                  <p className="text-xs text-slate-400 font-medium">{b.phone} • Gerente: <strong className="text-slate-700">{b.manager}</strong></p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Faturamento Mensal:</span>
                    <strong className="text-slate-900 font-black">R$ {b.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Vendas Hoje:</span>
                    <strong className="text-emerald-700 font-black">{b.ordersToday} ordens</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Vendedores Ativos:</span>
                    <span className="text-slate-700 font-bold">{b.activeSellers} operando</span>
                  </div>

                  <button className="w-full mt-2 py-2 bg-[#071D49] hover:bg-[#0B255C] text-[#E8D2A8] text-xs font-black rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95">
                    <BarChart3 className="w-4 h-4 text-[#D4AF37]" /> Gerenciar Filial
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Modal: Cadastrar Filial */}
      {showAddBranchModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black text-[#071D49] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#D4AF37]" /> Cadastrar Nova Filial
              </h3>
              <button onClick={() => setShowAddBranchModal(false)} className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBranch} className="space-y-3">
              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">Nome da Filial *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Filial Shopping Barra"
                  value={newBranch.name}
                  onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-[#0055A5] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">Cidade / Região *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Salvador - BA"
                  value={newBranch.location}
                  onChange={(e) => setNewBranch({ ...newBranch, location: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-[#0055A5] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">Endereço Completo</label>
                <input
                  type="text"
                  placeholder="Ex: Av. Centenário, 2992 - Loja 45"
                  value={newBranch.address}
                  onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-[#0055A5] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">Telefone</label>
                  <input
                    type="text"
                    placeholder="(71) 99888-0000"
                    value={newBranch.phone}
                    onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-[#0055A5] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">Gerente</label>
                  <input
                    type="text"
                    placeholder="Nome do Gerente"
                    value={newBranch.manager}
                    onChange={(e) => setNewBranch({ ...newBranch, manager: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-[#0055A5] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddBranchModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0055A5] hover:bg-[#004488] text-white font-black rounded-xl text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Salvar Filial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
