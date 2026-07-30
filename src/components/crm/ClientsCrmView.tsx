import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  MessageSquare,
  Calendar,
  ShieldCheck,
  Tag,
  Clock,
  Sparkles,
  FileText,
  CheckCircle2,
  Stethoscope,
  UserPlus,
} from 'lucide-react';
import { Client } from '../../types';

interface ClientsCrmViewProps {
  clients: Client[];
  onAddNewClient: () => void;
  onSelectClientForChat: (clientId: string) => void;
  onOpenProfessionalsModal?: () => void;
}

export const ClientsCrmView: React.FC<ClientsCrmViewProps> = ({
  clients,
  onAddNewClient,
  onSelectClientForChat,
  onOpenProfessionalsModal,
}) => {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('todos');

  const filtered = clients.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.cpf && c.cpf.includes(search));
    
    let matchTag = true;
    if (selectedTag === 'online') {
      matchTag = c.isAiHandled === true || c.tags?.some(t => t.toLowerCase().includes('online'));
    } else if (selectedTag !== 'todos') {
      matchTag = c.tags?.includes(selectedTag) || c.status === selectedTag;
    }

    return matchSearch && matchTag;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
              Módulo CRM & LGPD
            </span>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              Gestão de Clientes & Relacionamento Óptico
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Registro completo de ligações, retornos periódicos, receitas cadastradas e lista exclusiva de Clientes Online IA.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onOpenProfessionalsModal}
            className="px-3.5 py-2 bg-[#071D49] hover:bg-[#0B255C] text-[#C9A96E] font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 border border-[#C9A96E]/40 cursor-pointer active:scale-95"
            title="Cadastrar Médicos, Optometristas e Consultores"
          >
            <UserPlus className="w-4 h-4 text-[#C9A96E]" /> Cadastrar Profissional
          </button>

          <button
            onClick={onAddNewClient}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Novo Cliente
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar cliente por Nome, CPF ou WhatsApp..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-300/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 text-xs w-full sm:w-auto overflow-x-auto">
          <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0">Filtro CRM:</span>
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'online', label: '🌐 Clientes Online (IA)' },
            { id: 'Atendimento', label: 'Atendimento' },
            { id: 'Orçamento', label: 'Orçamento' },
            { id: 'Laboratório', label: 'Laboratório' },
            { id: 'Retirada', label: 'Retirada' },
          ].map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id)}
              className={`px-3 py-1 rounded-full font-bold text-xs transition-all border shrink-0 cursor-pointer ${
                selectedTag === tag.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>


      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((client) => (
          <div
            key={client.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-3 min-w-0">
                  <img
                    src={
                      client.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                    }
                    alt={client.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-300 shrink-0 shadow-2xs"
                  />
                  <div className="min-w-0">
                    <h3 className="text-xs font-black text-slate-900 truncate">{client.name}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">{client.phone}</p>
                  </div>
                </div>

                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border border-blue-200">
                  {client.tags?.[0] || 'Atendimento'}
                </span>
              </div>

              {/* Prescription / DNP Summary */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-[11px] space-y-1">
                <div className="flex items-center justify-between text-slate-700 font-semibold">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3 text-blue-600" /> Receita:
                  </span>
                  <span className="font-mono font-bold">
                    OD: {client.prescription?.od.esferico ?? -2.0} / OE: {client.prescription?.oe.esferico ?? -2.0}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-700 font-semibold">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-600" /> DNP Medido:
                  </span>
                  <span className="font-mono font-bold">
                    {client.dnp?.dpTotal ?? 62.0} mm (IA 98%)
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
              <button
                onClick={() => onSelectClientForChat(client.id)}
                className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Abrir Chat WhatsApp
              </button>

              <button
                onClick={() => alert(`Visualizando histórico completo de ${client.name}`)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                title="Histórico Completo"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
