import React from 'react';
import {
  MoreVertical,
  Shield,
  ShieldCheck,
  Glasses,
  FileText,
  CheckCircle2,
  Sparkles,
  User,
  Phone,
  Settings,
  ArrowLeft,
} from 'lucide-react';
import { Client, ServiceOrder, AiSettings } from '../../types';

interface ClientDetailsPanelProps {
  client: Client;
  aiSettings: AiSettings;
  onCreateServiceOrder: (client: Client) => void;
  onConfirmPixPayment: (osId: string) => void;
  currentOS?: ServiceOrder;
  onSendMsgToChat: (msg: string) => void;
  onBackToChat?: () => void;
  onBackToOverview?: () => void;
}

export const ClientDetailsPanel: React.FC<ClientDetailsPanelProps> = ({
  client,
  onCreateServiceOrder,
  onConfirmPixPayment,
  currentOS,
  onSendMsgToChat,
  onBackToOverview,
}) => {
  return (
    <div className="w-full h-full bg-[#F7F8FA] flex flex-col min-h-0 overflow-y-auto rounded-[20px] border border-slate-200/80 shadow-xs">
      {/* Header */}
      <div className="p-3.5 border-b border-[#C9A96E]/20 bg-white flex items-center justify-between shrink-0 sticky top-0 z-10 rounded-t-[20px]">
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
          <div className="p-1.5 bg-[#071D49] text-[#C9A96E] rounded-xl border border-[#C9A96E]/30">
            <User className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-[#111827] tracking-wider uppercase">
              DETALHES DO CLIENTE
            </h2>
            <span className="text-[10px] text-[#6B7280] font-normal">
              Ficha & Dados Ópticos
            </span>
          </div>
        </div>
        <button className="hover:text-[#111827] p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-all cursor-pointer">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3.5 space-y-3.5">
        {/* Client Profile Card */}
        <div className="bg-white border border-[#C9A96E]/30 rounded-[20px] p-3.5 shadow-xs space-y-2 text-center flex flex-col items-center justify-center">
          <div className="relative">
            <img
              src={
                client.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
              }
              alt={client.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#C9A96E]"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] absolute bottom-0 right-0 ring-2 ring-white"></span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#111827]">{client.name}</h3>
            <div className="flex items-center justify-center text-[11px] text-[#6B7280] gap-1 mt-0.5 font-normal">
              <Phone className="w-3 h-3 text-[#C9A96E]" />
              <span>{client.phone}</span>
            </div>
          </div>
        </div>

        {/* DADOS ÓPTICOS (Prescription Table) */}
        <div className="bg-white border border-slate-200 rounded-[20px] p-3.5 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-[11px] font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
              <Glasses className="w-3.5 h-3.5 text-[#C9A96E]" /> RECEITA ÓPTICA
            </h3>
            <span className="text-[9px] bg-[#071D49]/10 text-[#071D49] font-semibold px-2.5 py-0.5 rounded-full border border-[#071D49]/20 uppercase">
              Válida
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-[11px] font-mono border-collapse">
              <thead>
                <tr className="bg-[#F7F8FA] text-[#6B7280] text-[10px] font-semibold uppercase">
                  <th className="p-1.5 text-left font-sans">OLHO</th>
                  <th className="p-1.5">SPH</th>
                  <th className="p-1.5">CYL</th>
                  <th className="p-1.5">EIXO</th>
                  <th className="p-1.5">ADD</th>
                  <th className="p-1.5">DNP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-[11px] text-[#111827]">
                <tr className="hover:bg-slate-50 transition-all">
                  <td className="p-1.5 text-left font-sans font-bold text-[#071D49]">OD</td>
                  <td className="p-1.5">{client.prescription?.od.esferico !== undefined ? client.prescription.od.esferico.toFixed(2) : '-2.00'}</td>
                  <td className="p-1.5">{client.prescription?.od.cilindrico !== undefined ? client.prescription.od.cilindrico.toFixed(2) : '-0.50'}</td>
                  <td className="p-1.5">{client.prescription?.od.eixo ?? 90}°</td>
                  <td className="p-1.5">+{client.prescription?.adicao ?? '1.50'}</td>
                  <td className="p-1.5 text-[#071D49] font-bold">{client.dnp?.dnpOD ?? 32.5}mm</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-all">
                  <td className="p-1.5 text-left font-sans font-bold text-[#071D49]">OE</td>
                  <td className="p-1.5">{client.prescription?.oe.esferico !== undefined ? client.prescription.oe.esferico.toFixed(2) : '-2.00'}</td>
                  <td className="p-1.5">{client.prescription?.oe.cilindrico !== undefined ? client.prescription.oe.cilindrico.toFixed(2) : '-0.50'}</td>
                  <td className="p-1.5">{client.prescription?.oe.eixo ?? 90}°</td>
                  <td className="p-1.5">+{client.prescription?.adicao ?? '1.50'}</td>
                  <td className="p-1.5 text-[#071D49] font-bold">{client.dnp?.dnpOE ?? 32.5}mm</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* TRATAMENTOS DE LENTE SELECIONADOS */}
        <div className="bg-white border border-slate-200 rounded-[20px] p-3.5 shadow-xs space-y-2.5">
          <h3 className="text-[11px] font-bold text-[#111827] uppercase tracking-wider border-b border-slate-100 pb-1.5">
            TRATAMENTO DA LENTE
          </h3>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-[#F7F8FA] border border-[#C9A96E]/20 rounded-[14px] flex items-center gap-2.5 text-[#111827] font-semibold">
              <div className="p-1.5 bg-[#071D49] text-[#C9A96E] rounded-lg shrink-0">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px]">Anti-reflexo Premium (Crizal Sapphire)</span>
            </div>

            <div className="p-2.5 bg-[#F7F8FA] border border-[#C9A96E]/20 rounded-[14px] flex items-center gap-2.5 text-[#111827] font-semibold">
              <div className="p-1.5 bg-[#071D49] text-[#C9A96E] rounded-lg shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px]">Filtro Blue-Control (Proteção Digital)</span>
            </div>
          </div>
        </div>

        {/* MATERIAL DA ARMAÇÃO */}
        <div className="bg-white border border-slate-200 rounded-[20px] p-3.5 shadow-xs space-y-2.5">
          <h3 className="text-[11px] font-bold text-[#111827] uppercase tracking-wider border-b border-slate-100 pb-1.5">
            ARMAÇÃO SELECIONADA
          </h3>

          <div className="p-3 bg-[#F7F8FA] border border-[#C9A96E]/20 rounded-[14px] flex items-center gap-3 text-[#111827] font-semibold text-xs">
            <div className="p-2 bg-[#071D49] text-[#C9A96E] rounded-xl shrink-0">
              <Glasses className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#111827]">Modelo: Acetato Premium Preto Fosco</div>
              <div className="text-[10px] text-[#6B7280]">Aro: 52mm | Ponte: 18mm | Haste: 140mm</div>
            </div>
          </div>
        </div>

        {/* Copilot Sugestões */}
        <div className="bg-white border border-slate-200 rounded-[20px] p-3.5 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <h3 className="text-[11px] font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" /> Sugestões Copilot
            </h3>
            <Settings className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-slate-700 transition-all" />
          </div>

          <div className="space-y-2 text-xs">
            <button
              onClick={() =>
                onSendMsgToChat(
                  '💡 Oferecer Lentes Anti-reflexo e Filtro Blue-Control para maior proteção e conforto visual.'
                )
              }
              className="w-full text-left p-2.5 bg-[#F7F8FA] hover:bg-slate-100 rounded-[12px] border border-[#C9A96E]/20 transition-all text-[#111827] text-[11px] font-semibold cursor-pointer"
            >
              1. Oferecer Lentes Anti-reflexo e Blue-Control
            </button>

            <button
              onClick={() =>
                onSendMsgToChat(
                  '📅 Agendar Próximo Exame de Vista (Previsão: Novembro 2026).'
                )
              }
              className="w-full text-left p-2.5 bg-[#F7F8FA] hover:bg-slate-100 rounded-[12px] border border-[#C9A96E]/20 transition-all text-[#111827] text-[11px] font-semibold cursor-pointer"
            >
              2. Agendar Próximo Exame (Nov 2026)
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => onCreateServiceOrder(client)}
            className="w-full py-3 bg-[#071D49] hover:bg-[#0B255C] text-[#C9A96E] font-semibold rounded-[14px] shadow-xs transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider border border-[#C9A96E]/40 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[#C9A96E]" /> Gerar Ordem de Serviço (OS)
          </button>

          {currentOS && currentOS.status !== 'pago' && (
            <button
              onClick={() => onConfirmPixPayment(currentOS.id)}
              className="w-full py-3 bg-[#10B981] hover:bg-[#059669] text-white font-semibold rounded-[14px] shadow-xs transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" /> Validar Pagamento Pix
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
