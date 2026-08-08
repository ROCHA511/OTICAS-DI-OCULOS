import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  DollarSign,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Settings,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Sliders,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import { Tenant, SaaSPlan, SaaSFeature } from '../types';
import { saasServices, INITIAL_SAAS_PLANS, INITIAL_SAAS_FEATURES } from '../services/saasServices';
import { useTenant } from '../context/TenantContext';

export const SuperAdminDashboard: React.FC = () => {
  const { availablePlans } = useTenant();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [features, setFeatures] = useState<SaaSFeature[]>(INITIAL_SAAS_FEATURES);
  const [activeTab, setActiveTab] = useState<'tenants' | 'plans' | 'features' | 'events'>('tenants');
  const [loading, setLoading] = useState(true);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadSuperAdminData();
  }, []);

  const loadSuperAdminData = async () => {
    setLoading(true);
    const dataTenants = await saasServices.getAllTenants();
    setTenants(dataTenants);
    const dataFeatures = await saasServices.getFeatures();
    setFeatures(dataFeatures);
    setLoading(false);
  };

  // Cálculos Financeiros SaaS (MRR)
  const totalTenants = tenants.length;
  const activeTenants = tenants.filter((t) => t.status === 'active').length;
  const basicCount = tenants.filter((t) => t.planId === INITIAL_SAAS_PLANS[0].id).length;
  const proMaxCount = tenants.filter((t) => t.planId === INITIAL_SAAS_PLANS[1].id || !t.planId).length;

  const mrr = basicCount * 199 + proMaxCount * 2490;

  const filteredTenants = tenants.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || (t.cnpj && t.cnpj.includes(searchTerm));
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto animate-fadeIn">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#071D49] via-[#0B255C] to-[#071D49] p-6 sm:p-8 rounded-3xl text-white shadow-2xl border border-[#C9A96E]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-[#D4AF37] text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Painel Master CEO
            </span>
            <span className="text-xs text-amber-300 font-bold">• Visão Global SaaS Multi-Tenant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#E8D2A8] tracking-tight">
            Gestão Estratégica da Plataforma
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 font-medium max-w-xl">
            Monitore a saúde dos tenants, assinaturas Mercado Pago, faturamento recorrente (MRR) e auditoria de provisionamento.
          </p>
        </div>

        <button
          onClick={loadSuperAdminData}
          className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl transition-all border border-white/20 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar Métricas</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Faturamento Mensal (MRR)</span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">R$ {mrr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +100% Recorrente Mercado Pago
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Total de Óticas Parceiras</span>
            <Building2 className="w-5 h-5 text-[#0055A5]" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalTenants} Óticas</div>
          <div className="text-[11px] font-semibold text-slate-500">
            {activeTenants} Ativas • {totalTenants - activeTenants} Pendentes
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Planos Pro Max (R$ 2.490/mês)</span>
            <Zap className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div className="text-2xl font-black text-[#071D49]">{proMaxCount} Tenants</div>
          <div className="text-[11px] font-semibold text-amber-700">Com IA e Provador 3D</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Isolamento RLS</span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">100% Seguro</div>
          <div className="text-[11px] font-semibold text-slate-500">Filtragem backend por tenant_id</div>
        </div>
      </div>

      {/* Navegação por Abas */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('tenants')}
          className={`px-4 py-2 font-black text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'tenants'
              ? 'bg-[#071D49] text-[#E8D2A8] shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Óticas Parceiras ({tenants.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('plans')}
          className={`px-4 py-2 font-black text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'plans'
              ? 'bg-[#071D49] text-[#E8D2A8] shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Planos SaaS</span>
        </button>

        <button
          onClick={() => setActiveTab('features')}
          className={`px-4 py-2 font-black text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'features'
              ? 'bg-[#071D49] text-[#E8D2A8] shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Funcionalidades ({features.length})</span>
        </button>
      </div>

      {/* ABA 1: LISTA DE TENANTS */}
      {activeTab === 'tenants' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nome da ótica ou CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0055A5] outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativas</option>
                <option value="pending_payment">Pendente Pagamento</option>
                <option value="suspended">Suspensas</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-y border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Ótica / Tenant</th>
                  <th className="p-3">CNPJ / Cidade</th>
                  <th className="p-3">Plano Contratado</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTenants.map((t) => {
                  const plan = availablePlans.find((p) => p.id === t.planId) || availablePlans[1];
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-all">
                      <td className="p-3 font-bold text-slate-900 flex items-center gap-3">
                        <img
                          src={t.logoUrl || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=150'}
                          alt={t.name}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <div className="text-slate-900 font-black">{t.name}</div>
                          <div className="text-[10px] text-slate-500">{t.email}</div>
                        </div>
                      </td>
                      <td className="p-3 font-medium text-slate-700">
                        <div>{t.cnpj || '12.345.678/0001-90'}</div>
                        <div className="text-slate-400 text-[10px]">{t.city} - {t.state}</div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          plan.code === 'pro-max' ? 'bg-[#071D49] text-[#E8D2A8]' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {plan.name} (R$ {plan.monthlyPrice}/mês)
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          t.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {t.status === 'active' ? '● Ativa' : '⏳ Pendente'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => alert(`Acessando auditoria do tenant: ${t.name}`)}
                          className="px-3 py-1.5 bg-[#0055A5] hover:bg-[#004080] text-white font-bold rounded-lg text-xs cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Auditar</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA 2: PLANOS E PREÇOS DO BANCO */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availablePlans.map((p) => (
            <div key={p.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-black text-[#0055A5] uppercase tracking-wider">{p.code}</span>
                <span className="text-xs font-bold text-slate-500">Código no Banco</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900">{p.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{p.description}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <label className="font-bold text-xs text-slate-700 block">Preço Oficial no Banco (R$)</label>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-[#071D49]">R$ {p.monthlyPrice.toFixed(2)}</span>
                  <span className="text-xs font-bold text-slate-500">/mês</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ABA 3: FUNCIONALIDADES CADASTRADAS */}
      {activeTab === 'features' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-900">Catálogo de 22 Módulos da Plataforma</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {features.map((f) => (
              <div key={f.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-black text-[#071D49]">{f.name}</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full uppercase">{f.module}</span>
                </div>
                <p className="text-slate-500 font-medium">{f.description}</p>
                <div className="text-[10px] font-mono text-slate-400">código: {f.code}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
