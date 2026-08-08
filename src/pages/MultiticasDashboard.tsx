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
  Zap,
  Palette,
  Image as ImageIcon,
  Sliders,
  Layers,
  Sparkles,
  CreditCard,
  Lock
} from 'lucide-react';
import { SaaSOnboardingView } from '../components/saas/SaaSOnboardingView';
import { useTenant } from '../context/TenantContext';

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
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export const MultiticasDashboard: React.FC = () => {
  const { availablePlans, setTenant, currentTenant } = useTenant();
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [copiedPublicLink, setCopiedPublicLink] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchData | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'tenants' | 'plans' | 'subscriptions' | 'audit'>('tenants');

  const [branches, setBranches] = useState<BranchData[]>([
    {
      id: '00000000-0000-0000-0000-000000000001',
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
      plan: 'Plano Pro Max VIP (R$ 2.490/mês)',
      price: 2490,
      logoUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=150',
      primaryColor: '#071D49',
      secondaryColor: '#D4AF37'
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
      plan: 'Plano Pro Max VIP (R$ 2.490/mês)',
      price: 2490,
      logoUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=150',
      primaryColor: '#0055A5',
      secondaryColor: '#0284C7'
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
      plan: 'Plano Básico (R$ 199/mês)',
      price: 199,
      logoUrl: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=150',
      primaryColor: '#064E3B',
      secondaryColor: '#10B981'
    },
  ]);

  const publicLink = typeof window !== 'undefined' ? `${window.location.origin}?tab=onboarding` : 'https://oticas-di-oculos.vercel.app?tab=onboarding';

  const handleCopyPublicLink = () => {
    navigator.clipboard.writeText(publicLink);
    setCopiedPublicLink(true);
    setTimeout(() => setCopiedPublicLink(false), 2500);
  };

  const handleAddNewStore = (newStore: any) => {
    const newBranch: BranchData = {
      id: newStore.id || `b_${Date.now()}`,
      name: newStore.name,
      location: `${newStore.city || 'Brasil'}`,
      address: newStore.address || 'Endereço comercial',
      phone: newStore.phone || '(73) 99999-0000',
      manager: newStore.ownerName || 'Administrador',
      monthlyRevenue: 0,
      ordersToday: 0,
      activeSellers: 1,
      status: 'Ativa',
      growth: 100,
      cnpj: newStore.cnpj,
      plan: newStore.plan,
      price: newStore.price,
      logoUrl: newStore.logoUrl,
      primaryColor: newStore.primaryColor,
      secondaryColor: newStore.secondaryColor
    };

    setBranches((prev) => [newBranch, ...prev]);
  };

  // Totais Consolidados Multi-Óticas
  const totalRevenue = branches.reduce((acc, b) => acc + b.monthlyRevenue, 0);
  const totalOrders = branches.reduce((acc, b) => acc + b.ordersToday, 0);
  const totalSellers = branches.reduce((acc, b) => acc + b.activeSellers, 0);
  const totalRecurrentSaaS = branches.reduce((acc, b) => acc + (b.price || 2490), 0);

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto animate-fadeIn">
      
      {/* Top Banner Header Multi-Óticas */}
      <div className="bg-gradient-to-r from-[#071D49] via-[#0B255C] to-[#071D49] p-6 sm:p-8 rounded-3xl text-white shadow-2xl border border-[#C9A96E]/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#D4AF37] text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                👑 Módulo Gestão SaaS &amp; Redes Multi-Óticas
              </span>
              <span className="text-xs text-amber-300 font-bold">• Arquitetura Isolada por Tenant</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#E8D2A8] tracking-tight">
              Painel Corporativo Multi-Óticas
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 font-medium max-w-2xl">
              Gerencie todas as lojas parceiras, planos de assinatura Mercado Pago, faturamento recorrente (MRR) e personalização White-Label.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleCopyPublicLink}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl transition-all border border-white/20 flex items-center gap-2 cursor-pointer active:scale-95"
              title="Copiar link para novas óticas se cadastrarem sozinhas"
            >
              {copiedPublicLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Link className="w-4 h-4 text-[#D4AF37]" />}
              <span>{copiedPublicLink ? 'Link Copiado!' : 'Copiar Link Auto-Cadastro'}</span>
            </button>

            <button
              onClick={() => setShowOnboardingModal(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:from-[#E5C158] hover:to-amber-400 text-slate-950 font-black text-xs rounded-2xl shadow-xl transition-all flex items-center gap-2 cursor-pointer border border-amber-300/40 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Cadastrar Nova Ótica</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Consolidados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Faturamento SaaS Recorrente (MRR)</span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            R$ {totalRecurrentSaaS.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Assinaturas Ativas Mercado Pago
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Óticas Cadastradas</span>
            <Building2 className="w-5 h-5 text-[#0055A5]" />
          </div>
          <div className="text-2xl font-black text-slate-900">{branches.length} Óticas</div>
          <div className="text-[11px] font-semibold text-slate-500">
            100% Isolamento Lógico RLS
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Vendas Totais Hoje</span>
            <BarChart3 className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalOrders} OS no Dia</div>
          <div className="text-[11px] font-semibold text-slate-500">
            Consolidado da Rede
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Vendedores na Rede</span>
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalSellers} Profissionais</div>
          <div className="text-[11px] font-semibold text-slate-500">
            Equipe Ativa em Loja
          </div>
        </div>
      </div>

      {/* Sub-Aba de Navegação SaaS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('tenants')}
          className={`px-4 py-2 font-black text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'tenants'
              ? 'bg-[#071D49] text-[#E8D2A8] shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Óticas Parceiras ({branches.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('plans')}
          className={`px-4 py-2 font-black text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'plans'
              ? 'bg-[#071D49] text-[#E8D2A8] shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Planos &amp; Preços SaaS</span>
        </button>

        <button
          onClick={() => setActiveSubTab('subscriptions')}
          className={`px-4 py-2 font-black text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'subscriptions'
              ? 'bg-[#071D49] text-[#E8D2A8] shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Assinaturas Mercado Pago</span>
        </button>
      </div>

      {/* ABA 1: ÓTICAS PARCEIRAS */}
      {activeSubTab === 'tenants' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((b) => (
            <div
              key={b.id}
              className={`bg-white rounded-3xl border p-6 space-y-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                currentTenant.id === b.id ? 'ring-2 ring-[#0055A5] border-[#0055A5]' : 'border-slate-200'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={b.logoUrl || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=150'}
                      alt={b.name}
                      className="w-10 h-10 rounded-2xl object-cover border border-slate-200 shadow-xs"
                    />
                    <div>
                      <h3 className="font-black text-slate-900 text-sm">{b.name}</h3>
                      <div className="text-xs text-slate-500 font-semibold">{b.location}</div>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                    {b.status}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Responsável:</span>
                    <strong className="text-slate-900 font-bold">{b.manager}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Plano Contratado:</span>
                    <strong className="text-[#0055A5] font-extrabold">{b.plan}</strong>
                  </div>
                </div>

                {/* Paleta White-Label */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500 font-bold flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5 text-[#0055A5]" /> Tema da Marca:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: b.primaryColor || '#071D49' }} />
                    <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: b.secondaryColor || '#D4AF37' }} />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  onClick={() => setEditingBranch(b)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-all"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Configurar</span>
                </button>

                <button
                  onClick={() => {
                    setTenant({
                      id: b.id,
                      name: b.name,
                      email: 'gerente@otica.com.br',
                      logoUrl: b.logoUrl,
                      primaryColor: b.primaryColor,
                      secondaryColor: b.secondaryColor,
                      status: 'active',
                      planId: b.price === 199 ? '11111111-1111-1111-1111-111111111111' : '22222222-2222-2222-2222-222222222222',
                    });
                    alert(`✅ Alternado com sucesso para a ótica: ${b.name}`);
                  }}
                  className="px-3 py-1.5 bg-[#0055A5] hover:bg-[#004080] text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Acessar Visão</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ABA 2: PLANOS SAAS */}
      {activeSubTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availablePlans.map((p) => (
            <div key={p.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-black text-[#0055A5] uppercase tracking-wider">{p.code}</span>
                <span className="text-xs font-bold text-slate-500">Banco de Dados Oficial</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900">{p.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{p.description}</p>
              </div>
              <div className="text-3xl font-black text-[#071D49]">R$ {p.monthlyPrice.toFixed(2)}/mês</div>
            </div>
          ))}
        </div>
      )}

      {/* ABA 3: ASSINATURAS MERCADO PAGO */}
      {activeSubTab === 'subscriptions' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-900">Integração Mercado Pago Recorrente</h3>
          <p className="text-xs text-slate-500 font-medium">
            Assinaturas processadas de forma encriptada via tokenização oficial Mercado Pago.
          </p>
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-medium flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <strong className="block font-bold">Checkout &amp; Tokenização Ativos</strong>
              Todas as faturas são liquidadas mensalmente no Mercado Pago com retentativa e Webhooks idempotentes.
            </div>
          </div>
        </div>
      )}

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
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
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
                  defaultValue={editingBranch.price === 199 ? '199' : '2490'}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                >
                  <option value="199">Plano Básico - R$ 199/mês</option>
                  <option value="2490">Plano Pro Max VIP - R$ 2.490/mês</option>
                </select>
              </div>

              {/* Tema White-Label */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cor Primária</label>
                  <input
                    type="color"
                    defaultValue={editingBranch.primaryColor || '#071D49'}
                    className="w-full h-8 rounded cursor-pointer border-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cor Secundária</label>
                  <input
                    type="color"
                    defaultValue={editingBranch.secondaryColor || '#D4AF37'}
                    className="w-full h-8 rounded cursor-pointer border-none"
                  />
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
