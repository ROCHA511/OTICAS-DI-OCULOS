import React, { useState } from 'react';
import {
  Zap,
  Plus,
  UserPlus,
  Glasses,
  Calculator,
  MessageCircle,
  X,
  FileText,
  DollarSign,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface QuickActionBarProps {
  onOpenSmartOS: () => void;
  onOpenNewClient: () => void;
  onOpenAiConsultant: () => void;
  onNavigateTab: (tab: any) => void;
  onOpenQuickSearch: () => void;
}

export const QuickActionBar: React.FC<QuickActionBarProps> = ({
  onOpenSmartOS,
  onOpenNewClient,
  onOpenAiConsultant,
  onNavigateTab,
  onOpenQuickSearch,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5 font-sans">
      
      {/* Expanded Speed-Dial Options */}
      {isOpen && (
        <div className="flex flex-col items-end gap-2 animate-fadeIn">
          
          {/* Action 1: Nova OS Óptica */}
          <button
            onClick={() => {
              onOpenSmartOS();
              setIsOpen(false);
            }}
            className="flex items-center gap-2.5 bg-[#071D49] text-[#E8D2A8] hover:bg-[#0B255C] px-4 py-2.5 rounded-2xl border-2 border-[#C9A96E] shadow-xl text-xs font-black uppercase transition-all cursor-pointer hover:scale-105"
          >
            <span>⚡ Nova Ordem de Serviço Óptica (OS)</span>
            <div className="p-1 bg-[#C9A96E] text-[#071D49] rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
          </button>

          {/* Action 2: Cadastrar Cliente */}
          <button
            onClick={() => {
              onOpenNewClient();
              setIsOpen(false);
            }}
            className="flex items-center gap-2.5 bg-emerald-700 text-white hover:bg-emerald-800 px-4 py-2.5 rounded-2xl border-2 border-emerald-400 shadow-xl text-xs font-black uppercase transition-all cursor-pointer hover:scale-105"
          >
            <span>👤 Novo Paciente / Cliente</span>
            <div className="p-1 bg-white text-emerald-700 rounded-lg">
              <UserPlus className="w-4 h-4" />
            </div>
          </button>

          {/* Action 3: Assistente de Vendas IA */}
          <button
            onClick={() => {
              onOpenAiConsultant();
              setIsOpen(false);
            }}
            className="flex items-center gap-2.5 bg-gradient-to-r from-purple-900 to-[#071D49] text-white hover:opacity-95 px-4 py-2.5 rounded-2xl border-2 border-purple-400 shadow-xl text-xs font-black uppercase transition-all cursor-pointer hover:scale-105"
          >
            <span>🤖 Assistente Óptico de Vendas IA</span>
            <div className="p-1 bg-purple-500 text-white rounded-lg">
              <Sparkles className="w-4 h-4" />
            </div>
          </button>

          {/* Action 4: Busca Rápida Ctrl+K */}
          <button
            onClick={() => {
              onOpenQuickSearch();
              setIsOpen(false);
            }}
            className="flex items-center gap-2.5 bg-white text-slate-800 hover:bg-slate-50 px-4 py-2.5 rounded-2xl border-2 border-slate-300 shadow-xl text-xs font-black uppercase transition-all cursor-pointer hover:scale-105"
          >
            <span>🔍 Pesquisa Geral (Ctrl + K)</span>
            <div className="p-1 bg-slate-200 text-slate-700 rounded-lg">
              <Zap className="w-4 h-4" />
            </div>
          </button>

        </div>
      )}

      {/* Primary Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-3xl border-2 border-[#C9A96E] shadow-2xl flex items-center justify-center transition-all cursor-pointer hover:scale-105 ${
          isOpen
            ? 'bg-red-600 text-white rotate-45 border-red-300'
            : 'bg-[#071D49] text-[#E8D2A8]'
        }`}
        title="Menu de Ações Rápidas de Balcão Óptico"
      >
        <Zap className="w-6 h-6 text-[#C9A96E]" />
      </button>

    </div>
  );
};
