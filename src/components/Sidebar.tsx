import React, { useState } from 'react';
import {
  BarChart3,
  MessageSquare,
  Users,
  FileText,
  Glasses,
  Camera,
  Settings,
  Wallet,
  LogOut,
  TableProperties,
  Receipt,
  Megaphone,
  ChevronRight,
  ChevronLeft,
  Star,
  ShoppingCart,
  Tag,
  DollarSign,
  Briefcase,
  Layers,
  Sparkles,
  ClipboardCheck,
  UserCheck,
  Building2,
  Eye,
  Clock,
} from 'lucide-react';
import { OticasLogo } from './brand/OticasLogo';
import { TrialFrameIcon } from './brand/TrialFrameIcon';

export type ActiveTab =
  | 'dashboard'
  | 'news'
  | 'chat'
  | 'clients'
  | 'sellers'
  | 'ai-quotes'
  | 'cashflow'
  | 'os'
  | 'lab'
  | 'catalog'
  | 'camera'
  | 'pricetable'
  | 'ai-settings'
  | 'saas-admin'
  | 'exam-room'
  | 'timecard';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  unreadCountTotal: number;
  inLabCount: number;
  onLogout?: () => void;
  onOpenSmartOSWizard?: () => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
  userRole?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  unreadCountTotal,
  inLabCount,
  onLogout,
  onOpenSmartOSWizard,
  isMobileOpen = false,
  setIsMobileOpen,
  userRole,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Fecha o menu automaticamente após selecionar uma opção
  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  // Categorias organizadas de navegação (restauradas e completas)
  const navGroups = [
    {
      groupTitle: 'PRODUTOS & CATÁLOGO',
      items: [
        {
          id: 'pricetable' as ActiveTab,
          title: 'Tabela de Preços (Lentes)',
          icon: TableProperties,
        },
        {
          id: 'catalog' as ActiveTab,
          title: 'Catálogo de Armações & Lentes',
          icon: Glasses,
        },
        {
          id: 'cashflow' as ActiveTab,
          title: 'Vendas & Financeiro',
          icon: ShoppingCart,
        },
      ],
    },
    {
      groupTitle: 'ATENDIMENTO & GESTÃO',
      items: [
        {
          id: 'chat' as ActiveTab,
          title: 'Chat IA & Atendimento',
          icon: MessageSquare,
          badge: unreadCountTotal > 0 ? unreadCountTotal : undefined,
        },
        {
          id: 'clients' as ActiveTab,
          title: 'Clientes & Prescrições',
          icon: Users,
        },
        {
          id: 'sellers' as ActiveTab,
          title: 'Equipe de Vendas',
          icon: UserCheck,
        },
        {
          id: 'timecard' as ActiveTab,
          title: 'Ponto & Horas Extras',
          icon: Clock,
        },
        {
          id: 'ai-quotes' as ActiveTab,
          title: 'Orçamentos IA',
          icon: Sparkles,
        },
      ],
    },
    {
      groupTitle: 'CLÍNICA & LABORATÓRIO',
      items: [
        {
          id: 'exam-room' as ActiveTab,
          title: 'Sala de Exames',
          icon: TrialFrameIcon,
          isStar: true,
        },
        {
          id: 'lab' as ActiveTab,
          title: 'Laboratório & Status',
          icon: Layers,
        },
        {
          id: 'camera' as ActiveTab,
          title: 'Câmeras IA & DNP',
          icon: Camera,
        },
        {
          id: 'dashboard' as ActiveTab,
          title: 'Painel & Indicadores',
          icon: BarChart3,
        },
      ],
    },
  ];

  if (userRole === 'ceo') {
    navGroups.push({
      groupTitle: 'GESTÃO SAAS',
      items: [
        {
          id: 'saas-admin' as ActiveTab,
          title: 'Painel Multi-Óticas',
          icon: Building2,
        },
      ],
    });
  }

  return (
    <>
      {/* Overlay Escuro com Desfoque ao Abrir no Celular */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-[#090D16]/90 backdrop-blur-md z-[180] sm:hidden animate-in fade-in"
          onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
        />
      )}

      {/* Container Adaptável: Relativo no Desktop, Fixo em Drawer no Mobile */}
      <aside
        className={`bg-[#090D16]/98 sm:bg-[#090D16]/95 backdrop-blur-xl text-white flex flex-col justify-between py-3 shrink-0 z-[190] sm:z-30 transition-all duration-300 ease-in-out select-none ${
          isMobileOpen
            ? 'fixed inset-y-0 left-0 w-[280px] h-full my-0 ml-0 rounded-r-3xl border-r-2 border-[#D4AF37]/40 shadow-2xl flex'
            : 'hidden sm:flex sm:relative sm:my-2 sm:ml-2 sm:rounded-[24px] sm:border-2 sm:border-[#D4AF37]/25 sm:shadow-[0_0_30px_rgba(0,0,0,0.8)] sm:h-[calc(100%-16px)]'
        } ${
          isExpanded || isMobileOpen ? 'w-[280px] sm:w-[280px]' : 'sm:w-[72px]'
        }`}
      >
      {/* Botão de Expandir / Recolher na borda - Sem piscadas */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3.5 top-6 z-50 bg-[#D4AF37] hover:bg-[#E8D2A8] text-slate-950 p-1.5 rounded-full shadow-lg border-2 border-[#090D16] hover:scale-110 active:scale-95 transition-all cursor-pointer hidden sm:flex"
        title={isExpanded ? 'Recolher Barra Lateral' : 'Expandir Barra Lateral'}
      >
        {isExpanded ? (
          <ChevronLeft className="w-4 h-4 stroke-[3]" />
        ) : (
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        )}
      </button>

      {/* Brand Header - Clickable to Return Home */}
      <div className="px-2 flex flex-col items-center border-b border-[#D4AF37]/15 pb-3 mb-1">
        {isExpanded || isMobileOpen ? (
          <button
            onClick={() => handleSelectTab('chat')}
            className="w-full bg-[#161D2A] hover:bg-[#1E293B] border border-[#D4AF37]/30 text-white py-2 px-3 rounded-2xl flex items-center justify-center shadow-md transition-all cursor-pointer active:scale-95"
            title="Voltar para o Chat de Atendimento"
          >
            <OticasLogo size="sm" variant="light-text" />
          </button>
        ) : (
          <button
            onClick={() => handleSelectTab('chat')}
            className="w-11 h-10 rounded-2xl bg-[#161D2A] hover:bg-[#1E293B] border-2 border-[#D4AF37]/50 flex items-center justify-center p-1 cursor-pointer hover:scale-105 transition-all shadow-md active:scale-95"
            title="Voltar para o Chat de Atendimento"
          >
            <OticasLogo size="sm" variant="icon-only" />
          </button>
        )}

        {/* Informações da loja - Visível apenas no Mobile quando aberto */}
        {(isExpanded || isMobileOpen) && (
          <div className="mt-2 text-center flex flex-col items-center gap-1 select-text sm:hidden">
            <span className="text-[9px] bg-[#D4AF37]/10 text-[#D4AF37] font-bold px-2 py-0.5 rounded-full border border-[#D4AF37]/30 flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
              PRIME ENTERPRISE
            </span>
            <div className="text-[11px] font-bold text-[#E8D2A8] mt-0.5">
              Matriz Centro (Ituberá - BA)
            </div>
            <div className="text-[9px] text-slate-300/80 font-normal leading-tight text-center max-w-[220px]">
              Rua 23 de Abril, 51, Centro • (73) 98112-8923
            </div>
          </div>
        )}
      </div>

      {/* Fixed OS Button (Novo Módulo OS Inteligente) */}
      <div className="px-2 mb-2">
        {isExpanded || isMobileOpen ? (
          <button
            onClick={() => {
              handleSelectTab('os');
            }}
            className="w-full bg-gradient-to-r from-[#D4AF37] to-amber-600 hover:from-[#E5C158] hover:to-amber-500 text-slate-950 font-black text-xs py-2.5 px-3 rounded-2xl border-2 border-amber-300/30 flex items-center justify-between shadow-lg shadow-[#D4AF37]/20 transition-all cursor-pointer active:scale-95 group"
          >
            <div className="flex items-center gap-2.5">
              <ClipboardCheck className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
              <span className="tracking-wider uppercase text-sm font-black">Ordens de Serviço</span>
            </div>
          </button>
        ) : (
          <button
            onClick={() => {
              handleSelectTab('os');
            }}
            className="w-11 h-11 mx-auto bg-gradient-to-r from-[#D4AF37] to-amber-600 hover:from-[#E5C158] hover:to-amber-500 text-slate-950 rounded-2xl border-2 border-amber-300/30 flex items-center justify-center shadow-lg shadow-[#D4AF37]/20 transition-all cursor-pointer active:scale-95"
            title="Ordens de Serviço"
          >
            <ClipboardCheck className="w-6 h-6 text-slate-950" />
          </button>
        )}
      </div>

      {/* Grouped Navigation Items */}
      <div className="flex-1 overflow-y-auto px-2 space-y-3 w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {(isExpanded || isMobileOpen) && (
              <div className="px-2 pt-1 pb-0.5 text-[9px] font-black text-[#D4AF37]/50 tracking-widest uppercase">
                {group.groupTitle}
              </div>
            )}
            {group.items.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectTab(item.id)}
                  title={item.title}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all duration-200 cursor-pointer relative ${
                    isActive
                      ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40 font-bold shadow-md'
                      : 'text-slate-200 hover:text-[#D4AF37] hover:bg-[#D4AF37]/8 border border-transparent font-medium'
                  } ${!(isExpanded || isMobileOpen) ? 'justify-center' : 'justify-between'}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-6 h-6 shrink-0 transition-transform ${isActive ? 'text-[#D4AF37] scale-105' : 'text-slate-300 hover:scale-105'}`} />
                    {(isExpanded || isMobileOpen) && (
                      <span className="text-xs truncate tracking-tight text-left">
                        {item.title}
                      </span>
                    )}
                  </div>

                  {(isExpanded || isMobileOpen) && (
                    <div className="flex items-center gap-1 shrink-0 ml-1">
                      {item.isStar && (
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      )}
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="bg-[#D4AF37] text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}

                  {!(isExpanded || isMobileOpen) && item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#090D16]" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Floating Chat Button at Bottom */}
      <div className="px-2 pt-2 border-t border-[#D4AF37]/15 space-y-2 mt-1 shrink-0">
        {isExpanded || isMobileOpen ? (
          <button
            onClick={() => handleSelectTab('chat')}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-2.5 px-3 rounded-2xl flex items-center justify-between shadow-lg transition-all cursor-pointer active:scale-95"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 fill-current shrink-0" />
              <span className="tracking-wide">Chat de Atendimento</span>
            </div>
            {unreadCountTotal > 0 && (
              <span className="bg-white text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                {unreadCountTotal}
              </span>
            )}
          </button>
        ) : (
          <button
            onClick={() => handleSelectTab('chat')}
            className="w-11 h-11 mx-auto bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-md transition-all cursor-pointer active:scale-95 relative"
            title="Chat de Atendimento"
          >
            <MessageSquare className="w-5 h-5 fill-current" />
            {unreadCountTotal > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-[#090D16]">
                {unreadCountTotal}
              </span>
            )}
          </button>
        )}

        {/* Settings & Logout */}
        <div className={`flex items-center gap-1 ${isExpanded || isMobileOpen ? 'justify-between' : 'justify-center'}`}>
          <button
            onClick={() => handleSelectTab('ai-settings')}
            title="Configurações do Agente IA"
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'ai-settings'
                ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30'
                : 'text-slate-300 hover:text-[#D4AF37] hover:bg-[#D4AF37]/8'
            } ${isExpanded || isMobileOpen ? 'flex items-center gap-2 text-xs font-bold' : ''}`}
          >
            <Settings className="w-4 h-4 text-[#D4AF37]" />
            {isExpanded || isMobileOpen ? <span>Ajustes</span> : null}
          </button>

          <button
            onClick={onLogout ? onLogout : () => alert('Sessão encerrada.')}
            title="Sair do Sistema"
            className={`p-2 rounded-xl text-slate-300 hover:text-rose-400 hover:bg-rose-500/8 transition-all cursor-pointer ${
              isExpanded || isMobileOpen ? 'flex items-center gap-2 text-xs font-bold' : ''
            }`}
          >
            <LogOut className="w-4 h-4 text-[#D4AF37]" />
            {isExpanded || isMobileOpen ? <span>Sair</span> : null}
          </button>
        </div>
      </div>
    </aside>
  </>
);
};
