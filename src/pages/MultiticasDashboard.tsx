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
  ArrowUpRight,
  Link,
  Copy,
  Check,
  Settings,
  Eye,
  Edit,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { SaaSOnboardingView } from '../components/saas/SaaSOnboardingView';

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
  cnpj?: string;
  plan?: string;
  price?: number;
}

export const MultiticasDashboard: React.FC = () => {
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [copiedPublicLink, setCopiedPublicLink] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchData | null>(null);

  const [branches, setBranches] = useState<BranchData[]>([
    {
      id: 'b1',
      name: 'Matriz Centro - Óticas Di Óculos',
      location: 'Ituberá - BA',
      address: 'Rua 23 de Abril, 51, Centro',
      phone: '(73) 98112-8923',
      manager: 'Dioenne Rocha (CEO)',
      monthlyRevenue: 148500.0,
      ordersToday: 24,
      activeSellers: 8,
      status: 'Ativa',
      growth: 14.8,
      cnpj: '12.345.678/0001-90',
      plan: 'Plano Enterprise VIP (R$ 249/mês)',
      price: 249
    },
    {
      id: 'b2',
      name: 'Shopping Prime Óticas',
      location: 'Valença - BA',
      address: 'Av. ACM, 400 - Loja 12',
      phone: '(75) 99823-4411',
      manager: 'Mariana Santos',
      monthlyRevenue: 92300.0,
      ordersToday: 15,
      activeSellers: 5,
      status: 'Ativa',
      growth: 9.2,
      cnpj: '98.765.432/0001-10',
      plan: 'Plano Enterprise VIP (R$ 249/mês)',
      price: 249
    },
    {
      id: 'b3',
      name: 'Ótica Visão Sul',
      location: 'Ilhéus - BA',
      address: 'Av. Soares Lopes, 820',
      phone: '(73) 99104-5522',
      manager: 'Carlos Eduardo',
      monthlyRevenue: 64200.0,
      ordersToday: 9,
      activeSellers: 4,
      status: 'Ativa',
      growth: 6.4,
      cnpj: '44.555.666/0001-22',
      plan: 'Plano Starter (R$ 199/mês)',
      price: 199
    },
  ]);

  const publicLink = typeof window !== 'undefined' ? `${window.location.origin}/cadastrar-otica` : 'https://dioculos.com.br/cadastrar-otica';

  const handleCopyPublicLink = () => {
    navigator.clipboard.writeText(publicLink);
    setCopiedPublicLink(true);
    setTimeout(() => setCopiedPublicLink(false), 2500);
  };

  const handleAddNewStore = (newStore: any) => {
    const created: BranchData = {
      id: newStore.id,
      name: newStore.name,
      location: newStore.city || 'Brasil',
      address: newStore.cnpj ? `CNPJ: ${newStore.cnpj}` : 'Endereço Comercial',
      phone: newStore.phone || '(00) 00000-0000',
      manager: newStore.ownerName || 'Gerente Responsável',
      monthlyRevenue: 0,
      ordersToday: 0,
      activeSellers: 1,
      status: 'Ativa',
      growth: 0,
      cnpj: newStore.cnpj,
      plan: newStore.plan,
      price: newStore.price
    };
    setBranches((prev) => [created, ...prev]);
  };

  const totalMonthlyRevenue = branches.reduce((sum, b) => sum + b.monthlyRevenue, 0);
  const totalOrdersToday = branches.reduce((sum, b) => sum + b.ordersToday, 0);
  const totalActiveSellers = branches.reduce((sum, b) => sum + b.activeSellers, 0);

  return (
    <div className="w-full h-full min-h-0 overflow-y-auto bg-[#F0F7FF] p-3 sm:p-6 space-y-6 text-slate-800 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#071D49] via-[#0B255C] to-[#071D49] p-5 sm:p-6 rounded-3xl border-2 border-[#C9A96E]/50 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-[#C9A96E]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#C9A96E] text-[#071D49] px-2.5 py-0.5 rounded-full border border-white/20">
              PAINEL MULTI-ÓTICAS MASTER (CEO)
            </span>
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {branches.length} Óticas Sincronizadas
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#E8D2A8] tracking-tight">
            Gestão de Redes de Óticas & SaaS Multitenant
          </h1>
          <p className="text-xs text-slate-200 font-medium">
            Cadastre novas lojas nos planos de <span className="text-amber-300 font-bold">R$ 199/mês</span> e <span className="text-amber-300 font-bold">R$ 249/mês</span>. Cada cliente terá seu ambiente 100% exclusivo.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleCopyPublicLink}
            className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Copiar Link de Cadastro para enviar no WhatsApp"
          >
            {copiedPublicLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Link className="w-4 h-4 text-[#D4AF37]" />}
            <span>{copiedPublicLink ? 'Link Copiado!' : 'Copiar Link de Auto-Cadastro'}</span>
          </button>

          <button
            onClick={() => setShowOnboardingModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:from-[#E5C158] hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Cadastrar Nova Ótica
          </button>
        </div>
      </div>

      {/* Public Link Callout Box for CEO */}
      <div className="bg-white border-2 border-[#0055A5]/30 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0055A5] flex items-center justify-center shrink-0">
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-[#0055A5] uppercase tracking-wider">
              Link de Auto-Cadastro Público para Clientes (WhatsApp / Vendas)
            </h4>
            <p className="text-xs text-slate-600 font-medium">
              Envie este link para os clientes se cadastrarem e escolherem o plano de R$ 199 ou R$ 249/mês.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl border border-slate-200 shrink-0">
          <span className="text-xs font-mono font-bold text-slate-800 px-2 truncate max-w-xs">{publicLink}</span>
          <button
            onClick={handleCopyPublicLink}
            className="px-3 py-1.5 bg-[#0055A5] hover:bg-[#004080] text-white font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer transition-all shrink-0"
          >
            {copiedPublicLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copiar</span>
          </button>
        </div>
      </div>

      {/* High-Level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-blue-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Faturamento Consolidado</span>
            <DollarSign className="w-5 h-5 text-[#0055A5]" />
          </div>
          <div className="text-2xl font-black text-[#071D49]">
            R$ {totalMonthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +14.8% vs mês anterior
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-blue-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Vendas Hoje (Rede)</span>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalOrdersToday} Serviços</div>
          <p className="text-xs text-slate-500 font-medium">Ticket Médio: R$ 1.840,00</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-blue-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Equipe de Vendas Ativa</span>
            <Users className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalActiveSellers} Vendedores</div>
          <p className="text-xs text-slate-500 font-medium">Em {branches.length} óticas cadastradas</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-blue-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Assinaturas SaaS</span>
            <Globe2 className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-base font-black text-emerald-700 flex items-center gap-1.5 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            {branches.length} Óticas Ativas
          </div>
          <p className="text-xs text-slate-500 font-medium">Planos R$ 199 / R$ 249 ativas</p>
        </div>
      </div>

      {/* Stores List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-black text-[#071D49] tracking-tight">
              Óticas Cadastradas no Sistema (Rede & Assinantes)
            </h2>
            <p className="text-xs text-slate-500">
              Gerencie cada ótica isolada. O CEO pode editar configurações, comissões, logomarcas e alterar planos.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {branches.map((b) => (
            <div
              key={b.id}
              className="bg-[#F8FAFC] border border-slate-200/80 hover:border-[#0055A5]/40 rounded-2xl p-4 transition-all space-y-3 relative group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#071D49] text-[#D4AF37] flex items-center justify-center font-black">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 leading-snug">{b.name}</h3>
                    <p className="text-[11px] text-slate-500 font-semibold">{b.location}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full uppercase">
                  {b.status}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200/60 font-medium">
                <div><span className="font-bold text-slate-800">Gerente:</span> {b.manager}</div>
                <div><span className="font-bold text-slate-800">Telefone:</span> {b.phone}</div>
                <div><span className="font-bold text-slate-800">Plano:</span> {b.plan || 'Enterprise VIP (R$ 249/mês)'}</div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Faturamento</span>
                  <span className="font-black text-[#071D49]">
                    R$ {b.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setEditingBranch(b)}
                    className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer transition-all"
                    title="Editar Módulos & CNPJ da Ótica"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Configurações</span>
                  </button>

                  <button
                    onClick={() => alert(`Alternando ambiente para: ${b.name}`)}
                    className="px-2.5 py-1.5 bg-[#0055A5] hover:bg-[#004080] text-white font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer transition-all"
                    title="Acessar a visão desta ótica"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Entrar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SaaS Self-Registration Modal */}
      {showOnboardingModal && (
        <SaaSOnboardingView
          onClose={() => setShowOnboardingModal(false)}
          onSuccess={handleAddNewStore}
        />
      )}

      {/* CEO Store Settings Modal */}
      {editingBranch && (
        <div className="fixed inset-0 z-[200] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-[#071D49]">Configurações da Ótica (Visão CEO)</h3>
              <button
                onClick={() => setEditingBranch(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nome da Ótica</label>
                <input
                  type="text"
                  defaultValue={editingBranch.name}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">CNPJ</label>
                <input
                  type="text"
                  defaultValue={editingBranch.cnpj || '12.345.678/0001-90'}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Plano Contratado</label>
                <select
                  defaultValue={editingBranch.price === 199 ? '199' : '249'}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                >
                  <option value="199">Plano Starter - R$ 199/mês</option>
                  <option value="249">Plano Enterprise VIP - R$ 249/mês</option>
                </select>
              </div>

              <div className="bg-[#F0F7FF] p-3 rounded-xl border border-[#0055A5]/20 space-y-2">
                <span className="font-bold text-[#0055A5] block">Módulos Habilitados para esta Ótica:</span>
                <div className="grid grid-cols-2 gap-2 text-slate-700 font-medium">
                  <label className="flex items-center gap-1.5"><input type="checkbox" defaultChecked /> IA Mary Atendimento</label>
                  <label className="flex items-center gap-1.5"><input type="checkbox" defaultChecked /> Provador 3D</label>
                  <label className="flex items-center gap-1.5"><input type="checkbox" defaultChecked /> Câmera DNP</label>
                  <label className="flex items-center gap-1.5"><input type="checkbox" defaultChecked /> Laboratório Sync</label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingBranch(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  alert('Configurações salvas pelo CEO com sucesso!');
                  setEditingBranch(null);
                }}
                className="px-5 py-2 bg-[#0055A5] text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
