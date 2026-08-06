import React, { useState } from 'react';
import {
  Users,
  BarChart3,
  Target,
  DollarSign,
  Trophy,
  FileText,
  Gift,
  Sparkles,
  Shield,
  Building2,
  CheckCircle2,
  UserCheck,
  Settings
} from 'lucide-react';
import {
  Seller,
  UserRole,
  PeriodFilter,
  SellerGoal,
  CommissionRule,
  CommissionMovement,
  SellerSale,
  AwardCampaign
} from '../../types/sellers';
import {
  INITIAL_SELLERS,
  INITIAL_COMMISSION_RULES,
  INITIAL_GOALS,
  INITIAL_SALES,
  INITIAL_COMMISSION_MOVEMENTS,
  INITIAL_CAMPAIGNS
} from '../../data/mockSellersData';

import { DashboardSubView } from './DashboardSubView';
import { SellersListSubView } from './SellersListSubView';
import { GoalsSubView } from './GoalsSubView';
import { CommissionsSubView } from './CommissionsSubView';
import { RankingSubView } from './RankingSubView';
import { ReportsSubView } from './ReportsSubView';
import { CampaignsSubView } from './CampaignsSubView';
import { AiSalesAssistantSubView } from './AiSalesAssistantSubView';
import { SellerModal } from './SellerModal';

type SellersSubtab =
  | 'dashboard'
  | 'vendedores'
  | 'metas'
  | 'comissoes'
  | 'ranking'
  | 'relatorios'
  | 'premiacoes'
  | 'configuracoes';

export const SellersModule: React.FC = () => {
  // Active Role State (CEO, GERENTE, VENDEDOR) - User can switch roles to inspect permissions!
  const [currentRole, setCurrentRole] = useState<UserRole>('CEO');

  // Active Subtab
  const [activeSubtab, setActiveSubtab] = useState<SellersSubtab>('dashboard');

  // Selected Period Filter
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilter>('Mês');

  // Data States
  const [sellers, setSellers] = useState<Seller[]>(INITIAL_SELLERS);
  const [rules, setRules] = useState<CommissionRule[]>(INITIAL_COMMISSION_RULES);
  const [goals, setGoals] = useState<SellerGoal[]>(INITIAL_GOALS);
  const [sales, setSales] = useState<SellerSale[]>(INITIAL_SALES);
  const [movements, setMovements] = useState<CommissionMovement[]>(
    INITIAL_COMMISSION_MOVEMENTS
  );
  const [campaigns, setCampaigns] = useState<AwardCampaign[]>(INITIAL_CAMPAIGNS);

  // Active Current Seller Context
  const currentSeller =
    sellers.find((s) => s.role === currentRole) || sellers[0];

  // Modals
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [sellerToEdit, setSellerToEdit] = useState<Seller | null>(null);

  // Handlers
  const handleSaveSeller = (sellerData: Seller) => {
    if (sellerToEdit) {
      setSellers((prev) =>
        prev.map((s) => (s.id === sellerData.id ? sellerData : s))
      );
    } else {
      setSellers((prev) => [sellerData, ...prev]);
    }
    setShowSellerModal(false);
    setSellerToEdit(null);
  };

  const handleDeleteSeller = (sellerId: string) => {
    if (confirm('Tem certeza que deseja remover este vendedor do cadastro ERP?')) {
      setSellers((prev) => prev.filter((s) => s.id !== sellerId));
    }
  };

  const handleToggleBlockSeller = (sellerId: string) => {
    setSellers((prev) =>
      prev.map((s) => {
        if (s.id === sellerId) {
          const newStatus = s.status === 'Inativo' ? 'Ativo' : 'Inativo';
          return { ...s, status: newStatus };
        }
        return s;
      })
    );
  };

  const handleSaveGoal = (newGoal: SellerGoal) => {
    setGoals((prev) => [newGoal, ...prev]);
  };

  const handleSaveRule = (newRule: CommissionRule) => {
    setRules((prev) => [newRule, ...prev]);
  };

  const handleApproveMovement = (movId: string) => {
    setMovements((prev) =>
      prev.map((m) => (m.id === movId ? { ...m, status: 'APROVADO' } : m))
    );
  };

  const handlePayMovement = (movId: string) => {
    setMovements((prev) =>
      prev.map((m) => (m.id === movId ? { ...m, status: 'PAGO' } : m))
    );
  };

  const handleSaveCampaign = (newCamp: AwardCampaign) => {
    setCampaigns((prev) => [newCamp, ...prev]);
  };

  // Submenu configuration
  const subnavItems = [
    { id: 'dashboard' as SellersSubtab, label: 'Dashboard', icon: BarChart3 },
    { id: 'vendedores' as SellersSubtab, label: 'Vendedores', icon: Users },
    { id: 'metas' as SellersSubtab, label: 'Metas', icon: Target },
    { id: 'comissoes' as SellersSubtab, label: 'Comissões', icon: DollarSign },
    { id: 'ranking' as SellersSubtab, label: 'Ranking', icon: Trophy },
    { id: 'relatorios' as SellersSubtab, label: 'Relatórios', icon: FileText },
    { id: 'premiacoes' as SellersSubtab, label: 'Premiações', icon: Gift },
    { id: 'configuracoes' as SellersSubtab, label: 'IA & Ajustes', icon: Sparkles },
  ];

  return (
    <div className="min-h-full bg-slate-100 p-3 sm:p-6 space-y-5 font-sans">
      
      {/* Role Switcher Toolbar (Top Bar for easy testing of permissions!) */}
      <div className="bg-gradient-to-r from-[#071D49] via-[#0B255C] to-[#071D49] p-3 sm:p-4 rounded-3xl border-2 border-[#C9A96E]/60 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#C9A96E]/20 border border-[#C9A96E]/50 rounded-2xl text-[#E8D2A8]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-black text-[#E8D2A8] uppercase tracking-wider flex items-center gap-2">
              Gestão de Vendedores & Comissões • Óticas Di Óculos ERP
            </h2>
            <p className="text-[11px] text-slate-300">
              Módulo de alta performance comercial com níveis de permissão em tempo real
            </p>
          </div>
        </div>

        {/* Role Switcher Selector */}
        <div className="flex items-center gap-2 bg-[#071D49] p-1.5 rounded-2xl border border-[#C9A96E]/40 shrink-0 w-full sm:w-auto justify-center">
          <span className="text-[10px] font-extrabold text-[#E8D2A8] uppercase px-2 hidden sm:inline">
            Modo Visualização:
          </span>
          {(['CEO', 'Gerente', 'Supervisor', 'Vendedor', 'Recepcionista', 'Caixa', 'Laboratório', 'Administrador'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => setCurrentRole(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                currentRole === r
                  ? 'bg-[#C9A96E] text-[#071D49] shadow-md scale-105'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Submenu Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {subnavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSubtab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSubtab(item.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#071D49] text-[#E8D2A8] shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#C9A96E]' : 'text-slate-400'}`} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Subview Content Rendering */}
      {activeSubtab === 'dashboard' && (
        <DashboardSubView
          currentRole={currentRole}
          currentSeller={currentSeller}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          sales={sales}
          goals={goals}
          movements={movements}
          sellers={sellers}
          onNavigateSubtab={(subtab) => setActiveSubtab(subtab as SellersSubtab)}
        />
      )}

      {activeSubtab === 'vendedores' && (
        <SellersListSubView
          currentRole={currentRole}
          sellers={sellers}
          onOpenNewSellerModal={() => {
            setSellerToEdit(null);
            setShowSellerModal(true);
          }}
          onEditSeller={(s) => {
            setSellerToEdit(s);
            setShowSellerModal(true);
          }}
          onDeleteSeller={handleDeleteSeller}
          onToggleBlockSeller={handleToggleBlockSeller}
        />
      )}

      {activeSubtab === 'metas' && (
        <GoalsSubView
          currentRole={currentRole}
          goals={goals}
          sellers={sellers}
          onSaveGoal={handleSaveGoal}
        />
      )}

      {activeSubtab === 'comissoes' && (
        <CommissionsSubView
          currentRole={currentRole}
          rules={rules}
          movements={movements}
          onSaveRule={handleSaveRule}
          onApproveMovement={handleApproveMovement}
          onPayMovement={handlePayMovement}
        />
      )}

      {activeSubtab === 'ranking' && <RankingSubView sellers={sellers} />}

      {activeSubtab === 'relatorios' && (
        <ReportsSubView
          sellers={sellers}
          sales={sales}
          goals={goals}
          movements={movements}
        />
      )}

      {activeSubtab === 'premiacoes' && (
        <CampaignsSubView
          currentRole={currentRole}
          campaigns={campaigns}
          sellers={sellers}
          onSaveCampaign={handleSaveCampaign}
        />
      )}

      {activeSubtab === 'configuracoes' && (
        <AiSalesAssistantSubView
          currentRole={currentRole}
          currentSeller={currentSeller}
        />
      )}

      {/* Modal New/Edit Seller */}
      {showSellerModal && (
        <SellerModal
          sellerToEdit={sellerToEdit}
          onClose={() => {
            setShowSellerModal(false);
            setSellerToEdit(null);
          }}
          onSave={handleSaveSeller}
        />
      )}

    </div>
  );
};
