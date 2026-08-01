import React, { useState } from 'react';
import { Bell, ChevronDown, Sparkles, MessageCircle, Building2, ShieldCheck, UserPlus, Share2, Menu } from 'lucide-react';
import { AiSettings } from '../types';
import { OticasLogo } from './brand/OticasLogo';
import { InstallButton } from './InstallButton';

interface NavbarProps {
  aiSettings: AiSettings;
  setAiSettings: React.Dispatch<React.SetStateAction<AiSettings>>;
  totalTodaySales: number;
  activeChatsCount: number;
  currentUser?: { name: string; role: 'ceo' | 'admin' | 'attendant'; phone: string } | null;
  onLogout?: () => void;
  onOpenProfessionalsModal?: () => void;
  onOpenShareModal?: () => void;
  onNavigateTab?: (tab: any) => void;
  onOpenQuickSearch?: () => void;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  aiSettings,
  setAiSettings,
  currentUser,
  onLogout,
  onOpenProfessionalsModal,
  onOpenShareModal,
  onNavigateTab,
  onOpenQuickSearch,
  isMobileMenuOpen = false,
  setIsMobileMenuOpen,
}) => {
  const [selectedBranch, setSelectedBranch] = useState('Filial Matriz Centro');
  const [showMessagesMenu, setShowMessagesMenu] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);

  return (
    <header className="bg-[#071D49]/95 backdrop-blur-md text-white px-2.5 sm:px-5 py-2 sticky top-0 z-[100] border-b-2 border-[#C9A96E]/70 shadow-xl flex items-center justify-between relative shrink-0 w-full min-w-0 box-border">
      {/* Subtle Blue/Gold Ambient Glow (Contained in isolated overflow-hidden wrapper) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/3 w-96 h-24 bg-[#C9A96E]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-12 w-64 h-16 bg-[#0B255C]/50 rounded-full blur-2xl" />
      </div>

      {/* Backdrop overlay to close dropdowns when clicking outside */}
      {(showMessagesMenu || showNotificationsMenu) && (
        <div
          className="fixed inset-0 z-[102] bg-black/10"
          onClick={() => {
            setShowMessagesMenu(false);
            setShowNotificationsMenu(false);
          }}
        />
      )}

      {/* Left Branding - Clickable to Return Home */}
      <div
        onClick={() => onNavigateTab && onNavigateTab('dashboard')}
        className="flex items-center space-x-2 sm:space-x-3 relative z-10 shrink-0 min-w-0 cursor-pointer hover:opacity-90 active:scale-95 transition-all group"
        title="Voltar para a Página Inicial (Dashboard)"
      >
        <div className="p-1.5 bg-[#0B255C]/80 backdrop-blur-sm rounded-2xl border-2 border-[#C9A96E] shadow-md flex items-center justify-center shrink-0 group-hover:border-[#E8D2A8] transition-all">
          <OticasLogo size="md" variant="light-text" />
        </div>

        {/* Mobile-only compact store name */}
        <div className="block sm:hidden text-left min-w-0">
          <div className="text-[11px] font-black text-[#E8D2A8] group-hover:text-white tracking-tight truncate max-w-[130px] transition-colors">
            Óticas Di Óculos
          </div>
          <div className="text-[9px] text-[#C9A96E] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Matriz Ituberá</span>
          </div>
        </div>

        {/* Desktop store & address info */}
        <div className="hidden sm:block min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] bg-[#C9A96E]/20 text-[#E8D2A8] font-bold px-2 py-0.5 rounded-full border border-[#C9A96E]/60 flex items-center gap-1 shrink-0">
              <ShieldCheck className="w-3 h-3 text-[#10B981]" /> PRIME ENTERPRISE
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#C9A96E] font-medium mt-0.5 min-w-0">
            <Building2 className="w-3.5 h-3.5 text-[#C9A96E] shrink-0" />
            <select
              value={selectedBranch}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-transparent text-[#E8D2A8] font-medium focus:outline-none cursor-pointer hover:text-white truncate max-w-[180px] md:max-w-[220px]"
            >
              <option value="Filial Matriz Centro" className="bg-[#071D49] text-white">
                Matriz Centro (Ituberá - BA)
              </option>
              <option value="Shopping Prime" className="bg-[#071D49] text-white">
                Shopping Prime
              </option>
              <option value="Filial Zona Sul" className="bg-[#071D49] text-white">
                Zona Sul
              </option>
            </select>
          </div>
          <div className="text-[10px] text-slate-300/80 font-normal truncate max-w-[220px] md:max-w-[320px] block">
            Rua 23 de Abril, 51, Centro • Tel: (73) 98112-8923
          </div>
        </div>
      </div>

      {/* Center Title Logo (Desktop XL only) - Clickable to Return Home */}
      <div
        onClick={() => onNavigateTab && onNavigateTab('dashboard')}
        className="hidden xl:flex flex-col items-center relative z-10 shrink-0 px-2 cursor-pointer hover:opacity-90 active:scale-95 transition-all group"
        title="Voltar para a Página Inicial (Dashboard)"
      >
        <OticasLogo size="lg" variant="light-text" showSubtext={true} />
        <div className="h-0.5 w-24 bg-[#C9A96E] group-hover:bg-[#E8D2A8] rounded-full mt-1 shadow-[0_0_8px_#C9A96E] transition-colors"></div>
      </div>

      {/* Right Controls & User Profile */}
      <div className="flex items-center space-x-1 sm:space-x-2 relative z-10 shrink-0">
        {/* PWA Install Button & Online/Offline Status */}
        <div className="shrink-0">
          <InstallButton />
        </div>

        {/* Global Quick Search Button (Ctrl + K) */}
        {onOpenQuickSearch && (
          <button
            onClick={onOpenQuickSearch}
            className="bg-[#0B255C]/80 hover:bg-[#153270] text-[#E8D2A8] font-black text-xs px-2 sm:px-3 py-1.5 rounded-xl border border-[#C9A96E]/60 shadow-sm flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shrink-0"
            title="Abrir Busca Geral e Atalhos (Ctrl + K)"
          >
            <span className="text-[#C9A96E]">🔍</span>
            <span className="hidden lg:inline font-mono text-[11px]">Busca (Ctrl+K)</span>
          </button>
        )}

        {/* Compartilhar com Equipe Button */}
        <button
          onClick={onOpenShareModal}
          className="bg-[#0B255C]/80 hover:bg-[#153270] text-[#C9A96E] font-bold text-xs px-2 sm:px-3 py-1.5 rounded-full transition-all shadow-xs hidden md:flex items-center gap-1.5 cursor-pointer border border-[#C9A96E] active:scale-95 shrink-0"
          title="Compartilhar Link do Sistema com a Equipe"
        >
          <Share2 className="w-3.5 h-3.5 text-[#C9A96E]" />
          <span className="hidden 2xl:inline">Link Equipe</span>
        </button>

        {/* Cadastrar Profissional Button */}
        <button
          onClick={onOpenProfessionalsModal}
          className="bg-[#C9A96E] hover:bg-[#E8D2A8] text-[#071D49] font-extrabold text-xs px-2.5 sm:px-3 py-1.5 rounded-full transition-all shadow-md hidden sm:flex items-center gap-1.5 cursor-pointer border border-white/30 active:scale-95 shrink-0"
          title="Cadastrar e Gerenciar Médicos, Optometristas e Equipe"
        >
          <UserPlus className="w-3.5 h-3.5 text-[#071D49]" />
          <span className="hidden lg:inline">+ Profissionais</span>
        </button>

        {/* AI Copilot Status Badge */}
        <button
          onClick={() =>
            setAiSettings((prev) => ({ ...prev, active: !prev.active }))
          }
          className={`flex items-center space-x-1 px-2 sm:px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs border cursor-pointer shrink-0 ${
            aiSettings.active
              ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/60 hover:bg-[#10B981]/30'
              : 'bg-[#0B255C]/80 text-slate-300 border-[#C9A96E]/50 hover:bg-[#0B255C]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" />
          <span className="hidden md:inline">● IA {aiSettings.active ? 'Mary' : 'Pausada'}</span>
        </button>

        {/* Message Indicator (3 Unread Customer Messages) */}
        <div className="relative shrink-0">
          <button
            onClick={() => {
              setShowMessagesMenu(!showMessagesMenu);
              setShowNotificationsMenu(false);
            }}
            title="3 Mensagens Recentes no WhatsApp / Atendimento"
            className="relative p-2 bg-[#0B255C]/80 hover:bg-[#153270] rounded-full text-[#C9A96E] transition-all border border-[#C9A96E]/50 cursor-pointer shrink-0 active:scale-95"
          >
            <MessageCircle className="w-4 h-4 text-[#C9A96E]" />
            <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-[#C9A96E] text-[#071D49] text-[9px] font-bold rounded-full shadow-xs">
              3
            </span>
          </button>

          {/* Messages Dropdown */}
          {showMessagesMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#071D49] text-white border-2 border-[#C9A96E] rounded-2xl shadow-2xl z-[110] p-3 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-[#C9A96E]/30 pb-2">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#C9A96E]" />
                  <span className="text-xs font-bold text-white">Mensagens Pendentes (3)</span>
                </div>
                <span className="text-[10px] bg-[#10B981]/20 text-[#10B981] font-bold px-2 py-0.5 rounded-full border border-[#10B981]/40">
                  WhatsApp IA Mary
                </span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                <div
                  onClick={() => {
                    setShowMessagesMenu(false);
                    if (onNavigateTab) onNavigateTab('chat');
                  }}
                  className="p-2.5 rounded-xl bg-[#0B255C]/90 hover:bg-[#153270] border border-[#C9A96E]/40 cursor-pointer transition-all space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[#E8D2A8]">Carlos Silva (Cliente)</span>
                    <span className="text-[10px] text-slate-300">há 5 min</span>
                  </div>
                  <p className="text-[11px] text-slate-200 line-clamp-2">
                    "Olá! Gostaria de saber se meu óculos multifocal Zeiss está pronto para retirada na loja Centro?"
                  </p>
                </div>

                <div
                  onClick={() => {
                    setShowMessagesMenu(false);
                    if (onNavigateTab) onNavigateTab('chat');
                  }}
                  className="p-2.5 rounded-xl bg-[#0B255C]/90 hover:bg-[#153270] border border-[#C9A96E]/40 cursor-pointer transition-all space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[#E8D2A8]">Mariana Santos (Orçamento)</span>
                    <span className="text-[10px] text-slate-300">há 12 min</span>
                  </div>
                  <p className="text-[11px] text-slate-200 line-clamp-2">
                    "Aprovado o orçamento de R$ 890,00 pelo PIX! Agente Mary gerou a ordem de serviço."
                  </p>
                </div>

                <div
                  onClick={() => {
                    setShowMessagesMenu(false);
                    if (onNavigateTab) onNavigateTab('chat');
                  }}
                  className="p-2.5 rounded-xl bg-[#0B255C]/90 hover:bg-[#153270] border border-[#C9A96E]/40 cursor-pointer transition-all space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[#E8D2A8]">Dra. Luciana (Optometria)</span>
                    <span className="text-[10px] text-slate-300">há 25 min</span>
                  </div>
                  <p className="text-[11px] text-slate-200 line-clamp-2">
                    "Encaminhei a receita médica atualizada para acuidade visual do paciente João Pedro."
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowMessagesMenu(false);
                  if (onNavigateTab) onNavigateTab('chat');
                }}
                className="w-full py-2 bg-[#C9A96E] hover:bg-[#E8D2A8] text-[#071D49] font-extrabold text-xs rounded-xl transition-all text-center cursor-pointer shadow-md"
              >
                Abrir Central de Atendimentos & Chat ➔
              </button>
            </div>
          )}
        </div>

        {/* Notification Bell (Enterprise System Alerts) */}
        <div className="relative shrink-0">
          <button
            onClick={() => {
              setShowNotificationsMenu(!showNotificationsMenu);
              setShowMessagesMenu(false);
            }}
            title="Notificações & Alertas Enterprise em Tempo Real"
            className="relative p-2 bg-[#0B255C]/80 hover:bg-[#153270] rounded-full text-[#C9A96E] transition-all border border-[#C9A96E]/50 cursor-pointer shrink-0 active:scale-95"
          >
            <Bell className="w-4 h-4 text-[#C9A96E]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotificationsMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#071D49] text-white border-2 border-[#C9A96E] rounded-2xl shadow-2xl z-[110] p-3 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-[#C9A96E]/30 pb-2">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#C9A96E]" />
                  <span className="text-xs font-bold text-white">Central de Alertas & Notificações</span>
                </div>
                <span className="text-[10px] bg-[#C9A96E]/20 text-[#E8D2A8] font-bold px-2 py-0.5 rounded-full border border-[#C9A96E]/40">
                  Sistema Dioculos
                </span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                <div
                  onClick={() => {
                    setShowNotificationsMenu(false);
                    if (onNavigateTab) onNavigateTab('news');
                  }}
                  className="p-2.5 rounded-xl bg-[#0B255C]/90 hover:bg-[#153270] border border-[#C9A96E]/40 cursor-pointer transition-all space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[#10B981]">🟢 Óculos Prontos para Retirada</span>
                    <span className="text-[10px] text-slate-300">Hoje</span>
                  </div>
                  <p className="text-[11px] text-slate-200">
                    5 montagens multifocais finalizadas no laboratório e disponíveis no balcão da Matriz Ituberá.
                  </p>
                </div>

                <div
                  onClick={() => {
                    setShowNotificationsMenu(false);
                    if (onNavigateTab) onNavigateTab('news');
                  }}
                  className="p-2.5 rounded-xl bg-[#0B255C]/90 hover:bg-[#153270] border border-[#C9A96E]/40 cursor-pointer transition-all space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[#C9A96E]">💰 Meta do Dia Atingida (84%)</span>
                    <span className="text-[10px] text-slate-300">Hoje</span>
                  </div>
                  <p className="text-[11px] text-slate-200">
                    Vendas totais da rede alcançaram R$ 12.620,00 com excelente conversão de armações de luxo.
                  </p>
                </div>

                <div
                  onClick={() => {
                    setShowNotificationsMenu(false);
                    if (onNavigateTab) onNavigateTab('lab');
                  }}
                  className="p-2.5 rounded-xl bg-[#0B255C]/90 hover:bg-[#153270] border border-[#C9A96E]/40 cursor-pointer transition-all space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[#E8D2A8]">🔬 Laboratório Braslab</span>
                    <span className="text-[10px] text-slate-300">Hoje</span>
                  </div>
                  <p className="text-[11px] text-slate-200">
                    12 Ordens de serviço em tratamento antirreflexo digital. Prazo estimado: 24h.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowNotificationsMenu(false);
                  if (onNavigateTab) onNavigateTab('news');
                }}
                className="w-full py-2 bg-[#C9A96E] hover:bg-[#E8D2A8] text-[#071D49] font-extrabold text-xs rounded-xl transition-all text-center cursor-pointer shadow-md"
              >
                Ver Mural de Informativos Completo ➔
              </button>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div
          onClick={onLogout}
          title="Clique para Sair / Trocar Usuário"
          className="flex items-center space-x-2 bg-[#0B255C]/80 border border-[#C9A96E] py-1 px-2.5 sm:px-3 rounded-full cursor-pointer hover:border-[#E8D2A8] transition-all shadow-xs shrink-0"
        >
          <img
            src={
              currentUser?.role === 'ceo'
                ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
                : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
            }
            alt={currentUser?.name || 'Operador'}
            className="w-7 h-7 rounded-full object-cover border border-[#C9A96E]"
          />
          <div className="text-left leading-tight hidden sm:block">
            <div className="text-[9px] text-[#C9A96E] font-bold uppercase tracking-wider">
              {currentUser?.role === 'ceo' ? 'CEO / Direção' : currentUser?.role === 'admin' ? 'Gerente' : 'Atendente'}
            </div>
            <div className="font-semibold text-white text-xs">{currentUser?.name || 'Dioenne Rocha'}</div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#C9A96E]" />
        </div>

        {/* Botão Hambúrguer Mobile na extremidade da Navbar */}
        <button
          onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="sm:hidden p-1.5 bg-[#C9A96E] hover:bg-[#E8D2A8] text-[#071D49] rounded-xl font-bold transition-all border border-white/30 shadow-md active:scale-95 flex items-center justify-center shrink-0 cursor-pointer ml-1"
          title="Abrir Menu do Sistema"
        >
          <Menu className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </header>
  );
};
