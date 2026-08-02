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
} from 'lucide-react';
import { OticasLogo } from './brand/OticasLogo';

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
  | 'saas-admin';

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

  // Categorias organizadas de navegação
  const navGroups = [
    {
      groupTitle: 'PRINCIPAL',
      items: [
        {
          id: 'dashboard' as ActiveTab,
          title: 'Painel de Informações',
          icon: BarChart3,
        },
        {
          id: 'clients' as ActiveTab,
          title: 'Clientes',
          icon: Users,
        },
        {
          id: 'sellers' as ActiveTab,
          title: 'Vendedores',
          icon: UserCheck,
          isStar: true,
        },
      ],
    },
    {
      groupTitle: 'VENDAS & OS',
      items: [
        {
          id: 'catalog' as ActiveTab,
          title: 'Produtos & Armações',
          icon: Glasses,
        },
        {
          id: 'pricetable' as ActiveTab,
          title: 'Tabelas de Lentes',
          icon: TableProperties,
        },
        {
          id: 'ai-quotes' as ActiveTab,
          title: 'Orçamentos & Ofertas',
          icon: Tag,
        },
        {
          id: 'os' as ActiveTab,
          title: 'Ordens de Serviço',
          icon: FileText,
          badge: inLabCount > 0 ? inLabCount : undefined,
        },
        {
          id: 'cashflow' as ActiveTab,
          title: 'Vendas & Financeiro',
          icon: ShoppingCart,
        },
      ],
    },
    {
      groupTitle: 'IA & RECURSOS',
      items: [
        {
          id: 'camera' as ActiveTab,
          title: 'Câmeras IA & DNP',
          icon: Camera,
        },
        {
          id: 'lab' as ActiveTab,
          title: 'Laboratório & Status',
          icon: Layers,
        },
        {
          id: 'chat' as ActiveTab,
          title: 'Chat IA & Atendimento',
          icon: MessageSquare,
          badge: unreadCountTotal > 0 ? unreadCountTotal : undefined,
        },
        {
          id: 'ai-settings' as ActiveTab,
          title: 'Nossas Soluções',
          icon: Briefcase,
          isStar: true,
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
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-[180] sm:hidden animate-in fade-in"
          onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
        />
      )}

      {/* Container Adaptável: Relativo no Desktop, Fixo em Drawer no Mobile */}
      <aside
        className={`bg-[#071D49]/98 sm:bg-[#071D49]/95 backdrop-blur-xl text-white flex flex-col justify-between py-3 shrink-0 z-[190] sm:z-30 transition-all duration-300 ease-in-out select-none ${
          isMobileOpen
            ? 'fixed inset-y-0 left-0 w-[280px] h-full my-0 ml-0 rounded-r-3xl border-r-2 border-[#C9A96E] shadow-2xl flex'
            : 'hidden sm:flex sm:relative sm:my-2 sm:ml-2 sm:rounded-[24px] sm:border-2 sm:border-[#C9A96E] sm:shadow-[0_0_25px_rgba(201,169,110,0.3)] sm:h-[calc(100%-16px)]'
        } ${
          isExpanded || isMobileOpen ? 'w-[280px] sm:w-[280px]' : 'sm:w-[72px]'
        }`}
      >
      {/* Botão de Expandir / Recolher na borda - Sem piscadas */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3.5 top-6 z-50 bg-[#C9A96E] hover:bg-[#E8D2A8] text-[#071D49] p-1.5 rounded-full shadow-lg border-2 border-[#071D49] hover:scale-110 active:scale-95 transition-all cursor-pointer hidden sm:flex"
        title={isExpanded ? 'Recolher Barra Lateral' : 'Expandir Barra Lateral'}
      >
        {isExpanded ? (
          <ChevronLeft className="w-4 h-4 stroke-[3]" />
        ) : (
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        )}
      </button>

      {/* Brand Header - Clickable to Return Home */}
      <div className="px-2 flex flex-col items-center border-b border-[#C9A96E]/30 pb-3 mb-1">
        {isExpanded || isMobileOpen ? (
          <button
            onClick={() => handleSelectTab('dashboard')}
            className="w-full bg-white hover:bg-slate-100 text-[#071D49] py-2 px-3 rounded-2xl flex items-center justify-center shadow-md transition-all cursor-pointer active:scale-95"
            title="Voltar para a Página Inicial (Dashboard)"
          >
            <OticasLogo size="sm" variant="full" />
          </button>
        ) : (
          <button
            onClick={() => handleSelectTab('dashboard')}
            className="w-11 h-10 rounded-2xl bg-[#0B255C] hover:bg-[#153270] border-2 border-[#C9A96E] flex items-center justify-center p-1 cursor-pointer hover:scale-105 transition-all shadow-md active:scale-95"
            title="Voltar para a Página Inicial (Dashboard)"
          >
            <OticasLogo size="sm" variant="icon-only" />
          </button>
        )}

        {/* Informações da loja - Visível apenas no Mobile quando aberto */}
        {(isExpanded || isMobileOpen) && (
          <div className="mt-2 text-center flex flex-col items-center gap-1 select-text sm:hidden">
            <span className="text-[9px] bg-[#C9A96E]/20 text-[#E8D2A8] font-bold px-2 py-0.5 rounded-full border border-[#C9A96E]/60 flex items-center gap-1 shrink-0">
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
              if (onOpenSmartOSWizard) onOpenSmartOSWizard();
              handleSelectTab('os');
            }}
            className="w-full bg-[#071D49] hover:bg-[#0B255C] text-[#C9A96E] font-black text-xs py-2.5 px-3 rounded-2xl border-2 border-[#C9A96E] flex items-center justify-between shadow-[0_0_15px_rgba(201,169,110,0.4)] transition-all cursor-pointer active:scale-95 group"
          >
            <div className="flex items-center gap-2.5">
              <ClipboardCheck className="w-5 h-5 text-[#C9A96E] group-hover:scale-110 transition-transform" />
              <span className="tracking-wider uppercase text-sm font-black">[ OS ]</span>
            </div>
            <span className="text-[9px] bg-[#C9A96E] text-[#071D49] font-black px-1.5 py-0.5 rounded-md">
              12 ETAPAS
            </span>
          </button>
        ) : (
          <button
            onClick={() => {
              if (onOpenSmartOSWizard) onOpenSmartOSWizard();
              handleSelectTab('os');
            }}
            className="w-11 h-11 mx-auto bg-[#071D49] hover:bg-[#0B255C] text-[#C9A96E] rounded-2xl border-2 border-[#C9A96E] flex items-center justify-center shadow-[0_0_15px_rgba(201,169,110,0.4)] transition-all cursor-pointer active:scale-95"
            title="[ OS ] Nova Ordem de Serviço Inteligente (12 Etapas)"
          >
            <ClipboardCheck className="w-6 h-6 text-[#C9A96E]" />
          </button>
        )}
      </div>

      {/* Grouped Navigation Items */}
      <div className="flex-1 overflow-y-auto px-2 space-y-3 w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {(isExpanded || isMobileOpen) && (
              <div className="px-2 pt-1 pb-0.5 text-[9px] font-black text-[#C9A96E]/80 tracking-widest uppercase">
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
                      ? 'bg-[#0B255C] text-[#C9A96E] border border-[#C9A96E] font-bold shadow-md'
                      : 'text-slate-200 hover:text-[#C9A96E] hover:bg-[#0B255C]/60 border border-transparent font-medium'
                  } ${!(isExpanded || isMobileOpen) ? 'justify-center' : 'justify-between'}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#C9A96E]' : 'text-slate-300'}`} />
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
                        <span className="bg-[#C9A96E] text-[#071D49] font-black text-[10px] px-1.5 py-0.2 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}

                  {!(isExpanded || isMobileOpen) && item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-[#071D49]" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Floating Chat Button at Bottom */}
      <div className="px-2 pt-2 border-t border-[#C9A96E]/30 space-y-2 mt-1 shrink-0">
        {isExpanded || isMobileOpen ? (
          <button
            onClick={() => handleSelectTab('chat')}
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs py-2.5 px-3 rounded-2xl flex items-center justify-between shadow-lg transition-all cursor-pointer active:scale-95"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 fill-current shrink-0" />
              <span className="tracking-wide">Chat IA & Atendimento</span>
            </div>
            {unreadCountTotal > 0 && (
              <span className="bg-white text-[#25D366] text-[10px] font-black px-1.5 py-0.5 rounded-full">
                {unreadCountTotal}
              </span>
            )}
          </button>
        ) : (
          <button
            onClick={() => handleSelectTab('chat')}
            className="w-11 h-11 mx-auto bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-2xl flex items-center justify-center shadow-md transition-all cursor-pointer active:scale-95 relative"
            title="Chat IA WhatsApp"
          >
            <MessageSquare className="w-5 h-5 fill-current" />
            {unreadCountTotal > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-[#071D49] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-[#071D49]">
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
                ? 'bg-[#0B255C] text-[#C9A96E] border border-[#C9A96E]'
                : 'text-slate-300 hover:text-[#C9A96E] hover:bg-[#0B255C]/70'
            } ${isExpanded || isMobileOpen ? 'flex items-center gap-2 text-xs font-bold' : ''}`}
          >
            <Settings className="w-4 h-4 text-[#C9A96E]" />
            {isExpanded || isMobileOpen ? <span>Ajustes</span> : null}
          </button>

          <button
            onClick={onLogout ? onLogout : () => alert('Sessão encerrada.')}
            title="Sair do Sistema"
            className={`p-2 rounded-xl text-slate-300 hover:text-[#C9A96E] hover:bg-[#0B255C]/80 transition-all cursor-pointer ${
              isExpanded || isMobileOpen ? 'flex items-center gap-2 text-xs font-bold' : ''
            }`}
          >
            <LogOut className="w-4 h-4 text-[#C9A96E]" />
            {isExpanded || isMobileOpen ? <span>Sair</span> : null}
          </button>
        </div>
      </div>
    </aside>
  </>
);
};

