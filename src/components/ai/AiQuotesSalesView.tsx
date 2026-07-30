import React, { useState } from 'react';
import {
  Receipt,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Phone,
  Send,
  ShieldAlert,
  ArrowRight,
  Glasses,
  DollarSign,
  FileCheck,
  Building2,
  UserCheck,
} from 'lucide-react';
import { AiQuote, Client, ServiceOrder } from '../../types';

interface AiQuotesSalesViewProps {
  quotes: AiQuote[];
  onUpdateQuoteStatus: (quoteId: string, status: AiQuote['status']) => void;
  onConvertToOS: (quote: AiQuote) => void;
  onOpenAiConsultantModal: () => void;
}

export const AiQuotesSalesView: React.FC<AiQuotesSalesViewProps> = ({
  quotes,
  onUpdateQuoteStatus,
  onConvertToOS,
  onOpenAiConsultantModal,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  const filteredQuotes = quotes.filter((q) => {
    const matchSearch =
      q.clientName.toLowerCase().includes(search.toLowerCase()) ||
      q.clientPhone.includes(search) ||
      q.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'todos' || q.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalValueSum = quotes.reduce((acc, q) => acc + q.totalValue, 0);
  const approvedCount = quotes.filter((q) => q.status === 'aprovado_cliente' || q.status === 'convertido_os').length;
  const pendingCeoCount = quotes.filter((q) => q.status === 'aguardando_ceo').length;

  const handleSendWhatsapp = (quote: AiQuote) => {
    const text = `👓 *Orçamento Oficial Óticas Di Óculos*\nOlá ${quote.clientName}!\n\nSeu orçamento gerado via IA:\n• *Lente:* ${quote.recommendedLensName} (R$ ${quote.lensPrice.toFixed(2)})\n• *Armação:* ${quote.recommendedFrameName} (R$ ${quote.framePrice.toFixed(2)})\n• *Total:* R$ ${quote.totalValue.toFixed(2)}\n✨ *Pix c/ 10% OFF:* R$ ${quote.pixDiscountValue.toFixed(2)}\n💳 *Parcelado:* ${quote.installmentText}\n\n📍 Rua 23 de Abril, 51, Centro, Ituberá - BA\n📲 Whats: (73) 98112-8923`;
    alert(`Enviando mensagem via WhatsApp Cloud API Meta para ${quote.clientPhone}:\n\n${text}`);
    onUpdateQuoteStatus(quote.id, 'enviado');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0B1E36] text-white p-5 rounded-2xl border-2 border-[#C5A059] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#C5A059] text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
              Módulo Comercial IA
            </span>
            <span className="text-xs text-amber-200 font-bold flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-amber-300" /> Óticas Di Óculos - Ituberá BA
            </span>
          </div>
          <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-amber-300" /> Janela de Orçamentos e Vendas com IA
          </h1>
          <p className="text-xs text-sky-100 font-medium max-w-2xl mt-1">
            Gerenciamento centralizado de todos os orçamentos gerados autonomamente pelo Agente de IA Gemini no WhatsApp, com recomendação técnica de lentes, indicação de armações e aprovações do CEO Dioenne Rocha ((73) 99990-4727).
          </p>
        </div>

        <button
          onClick={onOpenAiConsultantModal}
          className="px-4 py-2.5 bg-gradient-to-r from-[#C5A059] via-amber-400 to-[#C5A059] hover:brightness-110 text-slate-950 font-black text-xs rounded-xl shadow-lg border border-amber-200 flex items-center gap-2 shrink-0 cursor-pointer transition-all"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>+ Novo Orçamento via Agente IA</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[10px] text-slate-500 font-extrabold uppercase">Total de Orçamentos IA</div>
          <div className="text-xl font-black text-slate-900">{quotes.length} Orçamentos</div>
          <div className="text-[10px] text-emerald-600 font-bold">100% via Gemini Agent</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[10px] text-slate-500 font-extrabold uppercase">Valor Orçado Total</div>
          <div className="text-xl font-black text-sky-700">R$ {totalValueSum.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          <div className="text-[10px] text-sky-600 font-bold">Incluso Lentes + Armações</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[10px] text-slate-500 font-extrabold uppercase">Orçamentos Aprovados</div>
          <div className="text-xl font-black text-emerald-600">{approvedCount} Vendas</div>
          <div className="text-[10px] text-emerald-700 font-bold">Prontos para Laboratório</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-[10px] text-slate-500 font-extrabold uppercase">Aguardando CEO (&gt; R$ 1.500)</div>
          <div className="text-xl font-black text-amber-600">{pendingCeoCount} Solicitados</div>
          <div className="text-[10px] text-amber-700 font-bold">Dioenne Rocha - WhatsApp</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por cliente, WhatsApp ou Nº do Orçamento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0284C7] text-slate-900"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs w-full sm:w-auto">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase shrink-0">Filtrar:</span>
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'enviado', label: 'Enviados' },
            { id: 'aprovado_cliente', label: 'Aprovados' },
            { id: 'aguardando_ceo', label: 'Aguardando CEO' },
            { id: 'convertido_os', label: 'Convertidos em OS' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1 rounded-full font-bold text-xs transition-all border shrink-0 cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quotes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuotes.map((quote) => {
          const isAwaitingCeo = quote.status === 'aguardando_ceo';
          const isConverted = quote.status === 'convertido_os';
          const isApproved = quote.status === 'aprovado_cliente';

          return (
            <div
              key={quote.id}
              className="bg-white rounded-2xl border-2 border-slate-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                {/* Header card */}
                <div className="flex items-start justify-between gap-2 border-b pb-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-black text-[#0284C7] bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                        {quote.id}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">{quote.createdAt}</span>
                    </div>
                    <h3 className="text-sm font-black text-slate-900 mt-1">{quote.clientName}</h3>
                    <p className="text-xs text-slate-600 font-bold flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-600" /> {quote.clientPhone}
                    </p>
                  </div>

                  {/* Status Badge */}
                  {isConverted ? (
                    <span className="bg-purple-100 text-purple-900 border border-purple-300 text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1">
                      <FileCheck className="w-3 h-3 text-purple-700" /> Convertido em OS
                    </span>
                  ) : isApproved ? (
                    <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Aprovado pelo Cliente
                    </span>
                  ) : isAwaitingCeo ? (
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1 animate-pulse">
                      <ShieldAlert className="w-3 h-3 text-amber-700" /> Aguardando CEO
                    </span>
                  ) : (
                    <span className="bg-sky-100 text-sky-900 border border-sky-300 text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1">
                      <Send className="w-3 h-3 text-sky-700" /> Enviado no Whats
                    </span>
                  )}
                </div>

                {/* Prescription Summary */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                    Grau da Receita Óptica
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono font-bold text-slate-800">
                    <div>OD: {quote.prescription.od.esferico} esf / {quote.prescription.od.cilindrico} cil</div>
                    <div>OE: {quote.prescription.oe.esferico} esf / {quote.prescription.oe.cilindrico} cil</div>
                  </div>
                </div>

                {/* Items & Prices */}
                <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/80 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-800">
                    <span className="font-extrabold flex items-center gap-1">
                      <Glasses className="w-3.5 h-3.5 text-[#0284C7]" /> Lente Recomendada:
                    </span>
                    <span className="font-bold text-slate-900">R$ {quote.lensPrice.toFixed(2)}</span>
                  </div>
                  <div className="text-[11px] text-slate-700 font-medium pl-4 line-clamp-1">
                    {quote.recommendedLensName}
                  </div>

                  <div className="flex items-center justify-between text-slate-800 border-t border-amber-200/60 pt-1.5">
                    <span className="font-extrabold flex items-center gap-1">
                      <Glasses className="w-3.5 h-3.5 text-amber-600" /> Armação Indicada:
                    </span>
                    <span className="font-bold text-slate-900">R$ {quote.framePrice.toFixed(2)}</span>
                  </div>
                  <div className="text-[11px] text-slate-700 font-medium pl-4 line-clamp-1">
                    {quote.recommendedFrameName}
                  </div>
                </div>

                {/* Total & Payment terms */}
                <div className="bg-slate-900 text-white p-3 rounded-xl space-y-1 shadow-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-extrabold uppercase text-[10px]">Total do Orçamento:</span>
                    <span className="text-base font-black text-amber-300">R$ {quote.totalValue.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold border-t border-slate-800 pt-1">
                    <span>À vista Pix (-10%): R$ {quote.pixDiscountValue.toFixed(2)}</span>
                    <span className="text-[#38BDF8]">{quote.installmentText}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                {!isConverted && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleSendWhatsapp(quote)}
                      className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                    >
                      <Send className="w-3.5 h-3.5" /> Reenviar Whats
                    </button>

                    <button
                      onClick={() => onConvertToOS(quote)}
                      className="py-2 bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:brightness-110 text-white font-black rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-amber-300" /> Gerar OS Lab
                    </button>
                  </div>
                )}

                {isAwaitingCeo && (
                  <div className="p-2 bg-amber-50 border border-amber-300 rounded-xl text-[11px] text-amber-900 flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-700" /> Valor {'>'} R$ 1.500: Alerta CEO enviado
                    </span>
                    <button
                      onClick={() => onUpdateQuoteStatus(quote.id, 'aprovado_cliente')}
                      className="px-2 py-1 bg-amber-600 text-white font-black rounded-lg text-[10px]"
                    >
                      Aprovar Manual
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
