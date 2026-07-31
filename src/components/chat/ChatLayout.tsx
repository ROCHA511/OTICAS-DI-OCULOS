import React, { useState } from 'react';
import { ClientListPanel } from './ClientListPanel';
import { ChatWindowPanel } from './ChatWindowPanel';
import { ClientDetailsPanel } from './ClientDetailsPanel';
import { MessageSquare, Users, FileText, Columns, Plus } from 'lucide-react';
import {
  Client,
  ChatMessage,
  OpticalPrescription,
  DnpMeasurement,
  Frame,
  Lens,
  ServiceOrder,
  AiSettings
} from '../../types';

interface ChatLayoutProps {
  clients: Client[];
  selectedClientId: string;
  onSelectClient: (id: string) => void;
  onAddNewClient: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string, mediaUrl?: string, mediaType?: 'image' | 'pdf') => void;
  onToggleAiControl: (clientId: string) => void;
  onGenerateAiSuggestion: () => Promise<void>;
  isGeneratingAi: boolean;
  onSelectQuickAction: (actionType: 'pix' | 'dnp_request' | 'recipe_request' | 'catalog') => void;
  frames: Frame[];
  lenses: Lens[];
  aiSettings: AiSettings;
  onUpdateClientPrescription: (clientId: string, rx: OpticalPrescription) => void;
  onUpdateClientDnp: (clientId: string, dnp: DnpMeasurement) => void;
  onSelectFrameAndLens: (clientId: string, frameId: string, lensId: string) => void;
  onCreateServiceOrder: (client: Client) => void;
  onConfirmPixPayment: (osId: string) => void;
  currentOS?: ServiceOrder;
}

export type ActiveTabType = 'overview' | 'clients' | 'chat' | 'details';

export const ChatLayout: React.FC<ChatLayoutProps> = ({
  clients,
  selectedClientId,
  onSelectClient,
  onAddNewClient,
  messages,
  onSendMessage,
  onToggleAiControl,
  onGenerateAiSuggestion,
  isGeneratingAi,
  onSelectQuickAction,
  aiSettings,
  onCreateServiceOrder,
  onConfirmPixPayment,
  currentOS,
}) => {
  const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0];
  const [activeTab, setActiveTab] = useState<ActiveTabType>('overview');

  const handleSelectClient = (id: string) => {
    onSelectClient(id);
    if (activeTab === 'clients') {
      setActiveTab('chat');
    }
  };

  return (
    <div className="flex flex-col h-full flex-1 w-full max-w-full overflow-hidden bg-gradient-to-br from-[#ECE8E1] via-[#E2E6ED] to-[#D8DEE4] p-2 sm:p-3 md:p-3.5 box-border">
      {/* Top Navigation Bar with Golden Active Tab Border & + Novo Cliente Button */}
      <div className="flex items-center justify-between bg-[#0B1E36] text-white rounded-2xl p-1.5 mb-2 shrink-0 shadow-md border border-[#C5A059]/40 w-full max-w-full box-border gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs font-black cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#0F2D59] text-amber-300 border-2 border-[#C5A059] shadow-md ring-1 ring-amber-400/30'
                : 'bg-transparent text-slate-300 hover:text-white hover:bg-white/5 border-2 border-transparent'
            }`}
          >
            <Columns className="w-3.5 h-3.5 text-amber-400" /> Visão Geral
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs font-black cursor-pointer whitespace-nowrap ${
              activeTab === 'clients'
                ? 'bg-[#0F2D59] text-amber-300 border-2 border-[#C5A059] shadow-md ring-1 ring-amber-400/30'
                : 'bg-transparent text-slate-300 hover:text-white hover:bg-white/5 border-2 border-transparent'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-amber-400" /> Clientes
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs font-black cursor-pointer whitespace-nowrap ${
              activeTab === 'chat'
                ? 'bg-[#0F2D59] text-amber-300 border-2 border-[#C5A059] shadow-md ring-1 ring-amber-400/30'
                : 'bg-transparent text-slate-300 hover:text-white hover:bg-white/5 border-2 border-transparent'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" /> Chat
          </button>

          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs font-black cursor-pointer whitespace-nowrap ${
              activeTab === 'details'
                ? 'bg-[#0F2D59] text-amber-300 border-2 border-[#C5A059] shadow-md ring-1 ring-amber-400/30'
                : 'bg-transparent text-slate-300 hover:text-white hover:bg-white/5 border-2 border-transparent'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" /> Detalhes
          </button>
        </div>

        {/* Prominent + Novo Cliente Button Available in All Horizontal Tabs */}
        <button
          onClick={onAddNewClient}
          className="px-3 sm:px-4 py-1.5 bg-gradient-to-r from-[#C5A059] via-amber-400 to-[#C5A059] hover:brightness-110 text-slate-950 rounded-xl transition-all shadow-md font-black text-xs flex items-center gap-1.5 shrink-0 border border-amber-200 cursor-pointer"
          title="Cadastrar Novo Cliente Completo"
        >
          <Plus className="w-4 h-4 text-slate-950 font-black" />
          <span className="hidden sm:inline">Novo Cliente</span>
          <span className="sm:hidden">Novo</span>
        </button>
      </div>

      {/* Main 3-Column / Tab View Layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-3 md:gap-3.5 overflow-hidden min-h-0">
        {/* Column 1: CLIENT CHATS (30% Width in overview) */}
        <div
          className={`${
            activeTab === 'overview'
              ? 'hidden lg:flex w-full lg:w-[30%]'
              : activeTab === 'clients'
              ? 'flex w-full lg:max-w-2xl mx-auto'
              : 'hidden'
          } h-full shrink-0 bg-white/85 backdrop-blur-md border border-slate-300/80 rounded-[20px] overflow-hidden shadow-sm flex-col transition-all`}
        >
          <ClientListPanel
            clients={clients}
            selectedClientId={selectedClientId}
            onSelectClient={handleSelectClient}
            onAddNewClient={onAddNewClient}
            onBackToOverview={activeTab !== 'overview' ? () => setActiveTab('overview') : undefined}
          />
        </div>

        {/* Column 2: JANELA DE CHAT E CRONOGRAMA (45% Width in overview) */}
        <div
          className={`${
            activeTab === 'overview'
              ? 'flex flex-1'
              : activeTab === 'chat'
              ? 'flex flex-1 w-full'
              : 'hidden'
          } h-full min-w-0 bg-white/85 backdrop-blur-md border border-slate-300/80 rounded-[20px] overflow-hidden shadow-sm flex-col transition-all`}
        >
          <ChatWindowPanel
            client={selectedClient}
            messages={messages}
            onSendMessage={onSendMessage}
            onToggleAiControl={onToggleAiControl}
            onGenerateAiSuggestion={onGenerateAiSuggestion}
            isGeneratingAi={isGeneratingAi}
            onSelectQuickAction={onSelectQuickAction}
            onBackToOverview={activeTab !== 'overview' ? () => setActiveTab('overview') : undefined}
          />
        </div>

        {/* Column 3: DETAILS PANEL (25% Width in overview) */}
        <div
          className={`${
            activeTab === 'overview'
              ? 'hidden lg:flex w-full lg:w-[25%] xl:w-[28%]'
              : activeTab === 'details'
              ? 'flex w-full lg:max-w-3xl mx-auto'
              : 'hidden'
          } h-full shrink-0 bg-white/85 backdrop-blur-md border border-slate-300/80 rounded-[20px] overflow-hidden shadow-sm flex-col transition-all`}
        >
          <ClientDetailsPanel
            client={selectedClient}
            aiSettings={aiSettings}
            onCreateServiceOrder={onCreateServiceOrder}
            onConfirmPixPayment={onConfirmPixPayment}
            currentOS={currentOS}
            onSendMsgToChat={(text) => onSendMessage(text)}
            onBackToOverview={activeTab !== 'overview' ? () => setActiveTab('overview') : undefined}
          />
        </div>
      </div>
    </div>
  );
};


