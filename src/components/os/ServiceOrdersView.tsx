import React, { useState } from 'react';
import {
  FileText,
  Plus,
  CheckCircle2,
  Clock,
  Printer,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  Building,
  Eye,
  Glasses,
  QrCode,
  Maximize2,
  X
} from 'lucide-react';
import { ServiceOrder, CashFlowEntry, Client, Frame, Lens } from '../../types';
import { OticasLogo } from '../brand/OticasLogo';
import { ServiceOrderDocument } from './ServiceOrderDocument';

interface ServiceOrdersViewProps {
  orders: ServiceOrder[];
  cashFlow: CashFlowEntry[];
  clients: Client[];
  frames: Frame[];
  lenses: Lens[];
  onCreateNewOS: (clientId: string, frameId: string, lensId: string) => void;
  onConfirmPixPayment: (osId: string) => void;
  onOpenSmartOSWizard?: () => void;
}

export const ServiceOrdersView: React.FC<ServiceOrdersViewProps> = ({
  orders,
  cashFlow,
  clients,
  frames,
  lenses,
  onCreateNewOS,
  onConfirmPixPayment,
  onOpenSmartOSWizard,
}) => {
  const [selectedOS, setSelectedOS] = useState<ServiceOrder | null>(orders[0] || null);
  const [showNewOSModal, setShowNewOSModal] = useState(false);
  const [showFullPrintModal, setShowFullPrintModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');
  const [selectedFrameId, setSelectedFrameId] = useState(frames[0]?.id || '');
  const [selectedLensId, setSelectedLensId] = useState(lenses[0]?.id || '');

  const totalInflow = cashFlow
    .filter((c) => c.type === 'entrada')
    .reduce((sum, c) => sum + c.amount, 0);

  const totalOutflow = cashFlow
    .filter((c) => c.type === 'saida')
    .reduce((sum, c) => sum + c.amount, 0);

  const netBalance = totalInflow - totalOutflow;

  const handleCreateOSSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) return;
    onCreateNewOS(selectedClientId, selectedFrameId, selectedLensId);
    setShowNewOSModal(false);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto h-[calc(100vh-65px)]">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" /> PAINEL DE ORDENS DE SERVIÇO & FLUXO DE CAIXA
          </h1>
          <p className="text-xs text-slate-500">
            Gerenciamento de vendas de óculos, emissão de NFC-e, notas de serviço e entradas financeiras.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenSmartOSWizard && (
            <button
              onClick={onOpenSmartOSWizard}
              className="bg-[#071D49] hover:bg-[#0B255C] text-[#C9A96E] border-2 border-[#C9A96E] font-black text-xs px-4 py-2.5 rounded-xl shadow-[0_0_15px_rgba(201,169,110,0.3)] transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 text-[#C9A96E]" /> [ OS ] Nova Ordem de Serviço Inteligente (12 Etapas IA)
            </button>
          )}

          <button
            onClick={() => setShowNewOSModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Lançamento Rápido OS
          </button>
        </div>
      </div>

      {/* Cash Flow Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Entradas de Vendas (Hoje)</div>
            <div className="text-2xl font-extrabold text-emerald-600">
              R$ {totalInflow.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Saídas / Custos Lab</div>
            <div className="text-2xl font-extrabold text-rose-600">
              R$ {totalOutflow.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-md flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Saldo do Caixa Ótica</div>
            <div className="text-2xl font-extrabold text-cyan-300">
              R$ {netBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl text-cyan-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Orders List & Preview Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 font-bold text-slate-800 text-sm flex items-center justify-between">
            <span>Lista de Ordens de Serviço Emitidas</span>
            <span className="text-xs text-slate-400 font-normal">{orders.length} ordens</span>
          </div>

          <div className="overflow-x-auto divide-y divide-slate-100 text-xs">
            {orders.map((os) => {
              const isSelected = selectedOS?.id === os.id;
              return (
                <div
                  key={os.id}
                  onClick={() => setSelectedOS(os)}
                  className={`p-3.5 cursor-pointer transition-all flex items-center justify-between hover:bg-blue-50/50 ${
                    isSelected ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900">{os.osNumber}</span>
                      <span className="text-slate-500">• {os.clientName}</span>
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      {os.frame.brand} {os.frame.model} + Lente {os.lens.name}
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="font-extrabold text-blue-900">
                      R$ {os.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <span
                      className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        os.status === 'pago' || os.status === 'no_laboratorio'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {os.status === 'pago'
                        ? 'PAGO'
                        : os.status === 'no_laboratorio'
                        ? 'NO LABORATÓRIO'
                        : 'AGUARDANDO PIX'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected OS Receipt Inspector */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Visualização da Nota de Serviço</h3>
            {selectedOS && (
              <button
                onClick={() => setShowFullPrintModal(true)}
                className="text-xs bg-[#071D49] hover:bg-blue-900 text-[#E8D2A8] px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" /> Abrir Impressão OS (3 Vias)
              </button>
            )}
          </div>

          {selectedOS ? (
            <div className="space-y-3.5 text-xs font-sans">
              <div className="p-3 bg-[#071D49] text-white rounded-xl space-y-1.5 border border-[#C9A96E]/40">
                <div className="flex items-center justify-between">
                  <OticasLogo size="sm" variant="light-text" />
                  <span className="text-[10px] bg-[#C9A96E] text-[#071D49] font-bold px-2 py-0.5 rounded-full uppercase">
                    Ituberá - BA
                  </span>
                </div>
                <div className="text-sm font-extrabold text-[#C9A96E]">{selectedOS.osNumber}</div>
                <div className="text-[11px] text-slate-200">Cliente: {selectedOS.clientName}</div>
                <div className="text-[10px] text-slate-400">CPF: {selectedOS.clientCPF}</div>
              </div>

              {/* Action Button to Open Official Print Document */}
              <button
                onClick={() => setShowFullPrintModal(true)}
                className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-900 font-extrabold rounded-xl border border-blue-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4 text-blue-600" /> Visualizar Modelo Completo de Impressão (3 Vias)
              </button>

              {/* Prescription Detail */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-[11px]">
                <div className="font-bold text-slate-700 uppercase text-[10px]">Dados da Receita</div>
                <div>OD: Sph {selectedOS.prescription.od.esferico} | Cyl {selectedOS.prescription.od.cilindrico} | Eixo {selectedOS.prescription.od.eixo}°</div>
                <div>OE: Sph {selectedOS.prescription.oe.esferico} | Cyl {selectedOS.prescription.oe.cilindrico} | Eixo {selectedOS.prescription.oe.eixo}°</div>
                <div>DNP: OD {selectedOS.dnp.dnpOD}mm / OE {selectedOS.dnp.dnpOE}mm (DP Total: {selectedOS.dnp.dpTotal}mm)</div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-1.5 border-t border-slate-200 pt-2 text-slate-700">
                <div className="flex justify-between">
                  <span>Armação: {selectedOS.frame.brand} {selectedOS.frame.model}</span>
                  <span className="font-semibold">R$ {selectedOS.framePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lente: {selectedOS.lens.brand} {selectedOS.lens.name}</span>
                  <span className="font-semibold">R$ {selectedOS.lensPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Desconto Aplicado:</span>
                  <span>- R$ {selectedOS.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t pt-1">
                  <span>VALOR TOTAL:</span>
                  <span>R$ {selectedOS.totalValue.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Status Action */}
              {selectedOS.status === 'aguardando_pagamento' && (
                <button
                  onClick={() => onConfirmPixPayment(selectedOS.id)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" /> Confirmar Pagamento Pix de R$ {selectedOS.totalValue.toFixed(2)}
                </button>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              Selecione uma ordem de serviço na lista ao lado para ver os detalhes.
            </div>
          )}
        </div>
      </div>

      {/* Modal Full Document Print View */}
      {showFullPrintModal && selectedOS && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex flex-col p-4 md:p-6 overflow-y-auto">
          <div className="max-w-5xl w-full mx-auto bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
                <FileText className="w-5 h-5 text-blue-600" /> Modelo Oficial de Ordem de Serviço (3 Vias)
              </div>
              <button
                onClick={() => setShowFullPrintModal(false)}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ServiceOrderDocument
              order={selectedOS}
              onClose={() => setShowFullPrintModal(false)}
            />
          </div>
        </div>
      )}

      {/* Modal Launch New OS */}
      {showNewOSModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" /> Cadastrar Nova Ordem de Serviço
            </h3>

            <form onSubmit={handleCreateOSSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700">Cliente WhatsApp:</label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-xs font-medium text-slate-800"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Armação Escolhida:</label>
                <select
                  value={selectedFrameId}
                  onChange={(e) => setSelectedFrameId(e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-xs font-medium text-slate-800"
                >
                  {frames.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.brand} - {f.model} (R$ {f.price.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Lente do Catálogo:</label>
                <select
                  value={selectedLensId}
                  onChange={(e) => setSelectedLensId(e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-xs font-medium text-slate-800"
                >
                  {lenses.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.brand} - {l.name} (R$ {l.price.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewOSModal(false)}
                  className="w-1/2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md"
                >
                  Gerar OS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
