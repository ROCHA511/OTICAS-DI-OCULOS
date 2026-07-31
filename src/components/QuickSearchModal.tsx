import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  FileText,
  User,
  Glasses,
  UserCheck,
  Zap,
  ArrowRight,
  Plus,
  Calculator,
  DollarSign
} from 'lucide-react';
import { Client, ServiceOrder, Frame, Lens } from '../types';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  serviceOrders: ServiceOrder[];
  frames: Frame[];
  lenses: Lens[];
  onSelectClient: (clientId: string) => void;
  onNavigateTab: (tab: any) => void;
  onOpenSmartOS: () => void;
  onOpenNewClient: () => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  clients,
  serviceOrders,
  frames,
  lenses,
  onSelectClient,
  onNavigateTab,
  onOpenSmartOS,
  onOpenNewClient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setSearchTerm('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cpf.includes(searchTerm) ||
      c.phone.includes(searchTerm)
  );

  const filteredOS = serviceOrders.filter(
    (os) =>
      os.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      os.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      os.frameBrand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = [
    ...frames.map((f) => ({ id: f.id, name: `${f.brand} - ${f.model}`, type: 'Armação', price: f.price })),
    ...lenses.map((l) => ({ id: l.id, name: `${l.brand} - ${l.type}`, type: 'Lente', price: l.price })),
  ].filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 bg-[#071D49]/80 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Header Input */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-[#C9A96E] shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por Cliente, N° da OS, Armação, Lente ou digite um atalho... (Esc para fechar)"
            autoFocus
            className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none placeholder:text-slate-400"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results / Fast Action Shortcuts */}
        <div className="p-4 overflow-y-auto space-y-5 divide-y divide-slate-100">
          
          {/* Quick Shortcuts Section */}
          {!searchTerm && (
            <div className="space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                ⚡ Atalhos Rápidos de Balcão Óptico
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onOpenSmartOS();
                    onClose();
                  }}
                  className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-2xl flex items-center gap-3 text-left cursor-pointer transition-all"
                >
                  <div className="p-2 bg-[#071D49] text-[#E8D2A8] rounded-xl shrink-0">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-xs font-black text-slate-900 block">Nova Ordem de Serviço (OS)</strong>
                    <span className="text-[10px] text-slate-500 font-medium">Assistente Inteligente de Prescrição</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onOpenNewClient();
                    onClose();
                  }}
                  className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-2xl flex items-center gap-3 text-left cursor-pointer transition-all"
                >
                  <div className="p-2 bg-emerald-700 text-white rounded-xl shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-xs font-black text-slate-900 block">Cadastrar Novo Cliente</strong>
                    <span className="text-[10px] text-slate-500 font-medium">Ficha do Paciente com CPF e Anamnese</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onNavigateTab('sellers');
                    onClose();
                  }}
                  className="p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-2xl flex items-center gap-3 text-left cursor-pointer transition-all"
                >
                  <div className="p-2 bg-[#071D49] text-[#C9A96E] rounded-xl shrink-0">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-xs font-black text-slate-900 block">Módulo de Vendedores</strong>
                    <span className="text-[10px] text-slate-500 font-medium">Metas, Comissões e Ranking do Mês</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onNavigateTab('cashflow');
                    onClose();
                  }}
                  className="p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-2xl flex items-center gap-3 text-left cursor-pointer transition-all"
                >
                  <div className="p-2 bg-purple-700 text-white rounded-xl shrink-0">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-xs font-black text-slate-900 block">Fluxo de Caixa & Fechamento</strong>
                    <span className="text-[10px] text-slate-500 font-medium">Entradas, Saídas e Cartão</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Results: Clients */}
          {filteredClients.length > 0 && (
            <div className="pt-3 space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                👤 Clientes Encontrados ({filteredClients.length})
              </span>
              <div className="space-y-1">
                {filteredClients.slice(0, 4).map((client) => (
                  <div
                    key={client.id}
                    onClick={() => {
                      onSelectClient(client.id);
                      onNavigateTab('chat');
                      onClose();
                    }}
                    className="p-2.5 rounded-2xl hover:bg-slate-100 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#071D49] text-[#E8D2A8] font-black text-xs rounded-xl">
                        {client.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <strong className="text-xs font-bold text-slate-900 block">{client.name}</strong>
                        <span className="text-[10px] text-slate-500 font-mono">CPF: {client.cpf} • {client.phone}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results: Service Orders */}
          {filteredOS.length > 0 && (
            <div className="pt-3 space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                📄 Ordens de Serviço Ópticas ({filteredOS.length})
              </span>
              <div className="space-y-1">
                {filteredOS.slice(0, 4).map((os) => (
                  <div
                    key={os.id}
                    onClick={() => {
                      onNavigateTab('os');
                      onClose();
                    }}
                    className="p-2.5 rounded-2xl hover:bg-slate-100 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[#C9A96E]" />
                      <div>
                        <strong className="text-xs font-bold text-slate-900 block">
                          OS {os.orderNumber} • {os.clientName}
                        </strong>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {os.frameBrand} • {os.status} • R$ {os.totalValue.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black bg-[#071D49] text-[#E8D2A8] px-2 py-0.5 rounded-full">
                      {os.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results: Products */}
          {filteredProducts.length > 0 && (
            <div className="pt-3 space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                👓 Lentes & Armações do Catálogo ({filteredProducts.length})
              </span>
              <div className="space-y-1">
                {filteredProducts.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onNavigateTab('catalog');
                      onClose();
                    }}
                    className="p-2.5 rounded-2xl hover:bg-slate-100 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Glasses className="w-4 h-4 text-slate-600" />
                      <div>
                        <strong className="text-xs font-bold text-slate-900 block">{p.name}</strong>
                        <span className="text-[10px] text-slate-500 font-medium">{p.type}</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-slate-900">
                      R$ {p.price.toLocaleString('pt-BR')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-100 border-t text-[10px] text-slate-500 flex justify-between font-mono">
          <span>Pressione <strong>Ctrl + K</strong> a qualquer momento para abrir esta busca</span>
          <span>Dioculos ERP v2.0</span>
        </div>

      </div>
    </div>
  );
};
