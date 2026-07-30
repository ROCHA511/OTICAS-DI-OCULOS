import React, { useState } from 'react';
import { Search, SlidersHorizontal, Plus, ArrowLeft, Users } from 'lucide-react';
import { Client } from '../../types';

interface ClientListPanelProps {
  clients: Client[];
  selectedClientId: string;
  onSelectClient: (id: string) => void;
  onAddNewClient: () => void;
  onBackToChat?: () => void;
  onBackToOverview?: () => void;
}

export const ClientListPanel: React.FC<ClientListPanelProps> = ({
  clients,
  selectedClientId,
  onSelectClient,
  onAddNewClient,
  onBackToOverview,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('todos');

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      (c.cpf && c.cpf.includes(searchTerm));

    if (!matchesSearch) return false;
    if (selectedFilter === 'todos') return true;
    const tag = c.tags?.[0] || 'Orçamento';
    return tag.toLowerCase().includes(selectedFilter.toLowerCase());
  });

  const getStatusBadge = (tags?: string[]) => {
    const mainTag = tags?.[0] || 'Orçamento';

    if (['Novo Atendimento', 'Receita Recebida'].includes(mainTag)) {
      return (
        <span className="bg-[#071D49] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap border border-[#C9A96E]/30">
          {mainTag}
        </span>
      );
    }
    if (['Orçamento', 'Aguardando Pagamento'].includes(mainTag)) {
      return (
        <span className="bg-[#C9A96E] text-[#071D49] text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
          {mainTag}
        </span>
      );
    }
    if (['Em Produção', 'Em Laboratório', 'Montagem'].includes(mainTag)) {
      return (
        <span className="bg-[#0B255C] text-[#E8D2A8] text-[10px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap border border-[#C9A96E]/40">
          Laboratório
        </span>
      );
    }
    if (['Para Retirada', 'Pronto', 'Entregue'].includes(mainTag)) {
      return (
        <span className="bg-[#10B981] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap">
          Pronto
        </span>
      );
    }

    return (
      <span className="bg-slate-500 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap">
        {mainTag}
      </span>
    );
  };

  return (
    <div className="w-full h-full bg-[#F7F8FA] flex flex-col min-h-0 rounded-[20px]">
      {/* Panel Header */}
      <div className="p-3.5 pb-2.5 border-b border-[#C9A96E]/20 shrink-0 bg-white rounded-t-[20px]">
        {/* Top Header Row */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center space-x-2">
            {onBackToOverview && (
              <button
                onClick={onBackToOverview}
                className="px-2.5 py-1 bg-[#071D49] hover:bg-[#0B255C] text-[#E8D2A8] border border-[#C9A96E]/40 rounded-xl transition-all shadow-xs flex items-center gap-1.5 text-xs font-semibold shrink-0 cursor-pointer"
                title="Voltar para Visão Geral"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#C9A96E]" />
                <span>Visão Geral</span>
              </button>
            )}
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#C9A96E]" />
              <h2 className="text-xs font-bold text-[#111827] tracking-wider uppercase">
                LISTA DE CLIENTES
              </h2>
            </div>
          </div>

          <button
            onClick={onAddNewClient}
            title="Novo Cliente"
            className="px-2.5 py-1 bg-[#071D49] hover:bg-[#0B255C] text-[#C9A96E] border border-[#C9A96E]/40 rounded-xl transition-all flex items-center gap-1 text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#C9A96E]" />
            <span>Novo</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-2">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar Nome, CPF, WhatsApp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-8 py-1.5 text-xs bg-[#F7F8FA] border border-[#C9A96E]/30 rounded-full focus:outline-none focus:ring-1 focus:ring-[#C9A96E] text-[#111827] placeholder-slate-400 font-normal"
          />
          <SlidersHorizontal className="w-3.5 h-3.5 absolute right-3 top-2.5 text-slate-400 cursor-pointer" />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1 text-[10px]">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'atendimento', label: 'Atendimento' },
            { id: 'orçamento', label: 'Orçamento' },
            { id: 'laboratório', label: 'Laboratório' },
            { id: 'retirada', label: 'Pronto' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`px-3 py-1 rounded-full font-semibold whitespace-nowrap transition-all border ${
                selectedFilter === f.id
                  ? 'bg-[#071D49] text-[#C9A96E] border-[#C9A96E]/50'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Client List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 bg-[#F7F8FA]">
        {filteredClients.map((client) => {
          const isSelected = client.id === selectedClientId;
          return (
            <div
              key={client.id}
              onClick={() => onSelectClient(client.id)}
              className={`p-2.5 rounded-[16px] cursor-pointer transition-all flex items-center justify-between gap-2 relative border ${
                isSelected
                  ? 'bg-white border-[#C9A96E] shadow-xs ring-1 ring-[#C9A96E]/30'
                  : 'bg-white/80 border-slate-200/80 hover:bg-white hover:border-[#C9A96E]/30'
              }`}
            >
              {isSelected && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#C9A96E] rounded-r-md"></div>
              )}

              <div className="flex items-center space-x-2.5 min-w-0 flex-1 pl-1">
                <div className="relative shrink-0">
                  <img
                    src={
                      client.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                    }
                    alt={client.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#C9A96E]/40"
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-[#10B981] absolute bottom-0 right-0 ring-1 ring-white"
                    title="Online"
                  ></span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-[#111827] truncate">
                      {client.name}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {client.lastInteraction}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B7280] truncate font-normal">
                    {client.lastMessageText || 'Olá! Preciso de ajuda com...'}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="shrink-0 ml-1">{getStatusBadge(client.tags)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
