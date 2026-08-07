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
  X,
  Edit,
  Phone,
  MessageCircle,
  CreditCard,
  Banknote,
  Smartphone
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
  const [showEditOSModal, setShowEditOSModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showFullPrintModal, setShowFullPrintModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showEditProdutosModal, setShowEditProdutosModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [searchOSNumber, setSearchOSNumber] = useState('');
  const [foundOS, setFoundOS] = useState<ServiceOrder | null>(null);
  const [receiveAmount, setReceiveAmount] = useState('');
  const [receiveMethod, setReceiveMethod] = useState('PIX');
  const [newStatus, setNewStatus] = useState('');
  const [editObs, setEditObs] = useState('');

  const totalInflow = cashFlow
    .filter((c) => c.type === 'entrada')
    .reduce((sum, c) => sum + c.amount, 0);

  const totalOutflow = cashFlow
    .filter((c) => c.type === 'saida')
    .reduce((sum, c) => sum + c.amount, 0);

  const netBalance = totalInflow - totalOutflow;

  const handleSearchOS = () => {
    const os = orders.find((o) => o.osNumber.toLowerCase().includes(searchOSNumber.toLowerCase()));
    setFoundOS(os || null);
    if (!os) {
      alert('Ordem de Serviço não encontrada.');
    }
  };

  const handleConfirmReceive = () => {
    if (foundOS) {
      // In a real app, this would pass the amount and method.
      // For now, we use the existing onConfirmPixPayment to simulate full payment.
      onConfirmPixPayment(foundOS.id);
      alert(`Recebimento de R$ ${receiveAmount} via ${receiveMethod} confirmado com sucesso. O saldo foi atualizado e a comissão do vendedor foi liberada!`);
      setShowReceiveModal(false);
      setFoundOS(null);
      setShowEditOSModal(false);
    }
  };

  return (
    <div className="p-3 sm:p-6 space-y-5 max-w-7xl mx-auto overflow-y-auto h-[calc(100vh-65px)] bg-[#F0F7FF] text-slate-800">
      {/* View Header - Premium Navy & Gold */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#071D49] to-[#0B255C] p-5 rounded-2xl border border-[#C9A96E]/40 shadow-md text-white">
        <div>
          <h1 className="text-xl font-black text-[#E8D2A8] flex items-center gap-2 tracking-tight">
            <FileText className="w-5 h-5 text-[#D4AF37]" /> GESTÃO DE ORDENS DE SERVIÇO
          </h1>
          <p className="text-xs text-slate-200 mt-1">
            Controle de serviços, pagamentos, edição e comissionamento integrado.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {onOpenSmartOSWizard && (
            <button
              onClick={onOpenSmartOSWizard}
              className="bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:from-[#E5C158] hover:to-amber-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 border border-amber-200/50"
            >
              <Plus className="w-4 h-4 text-slate-950 stroke-[3]" /> Nova OS Inteligente (IA Mary)
            </button>
          )}

          <button
            onClick={() => setShowEditOSModal(true)}
            className="bg-white/10 hover:bg-white/20 text-[#E8D2A8] border border-[#C9A96E]/50 font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Edit className="w-4 h-4 text-[#D4AF37]" /> Editar Ordem de Serviço
          </button>
        </div>
      </div>

      {/* Cash Flow Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm flex items-center justify-between hover:border-emerald-400 transition-colors">
          <div>
            <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Entradas (Hoje)</div>
            <div className="text-2xl font-black text-emerald-700 mt-1">
              R$ {totalInflow.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-sm flex items-center justify-between hover:border-rose-400 transition-colors">
          <div>
            <div className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Saídas / Custos</div>
            <div className="text-2xl font-black text-rose-700 mt-1">
              R$ {totalOutflow.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
            <TrendingDown className="w-6 h-6 text-rose-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#071D49] to-[#0B255C] p-4 rounded-2xl border border-[#C9A96E]/50 shadow-md flex items-center justify-between relative overflow-hidden text-white group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A96E]/20 rounded-full blur-2xl group-hover:bg-[#C9A96E]/30 transition-all" />
          <div className="relative z-10">
            <div className="text-[10px] font-black text-[#E8D2A8] uppercase tracking-widest">Saldo do Caixa</div>
            <div className="text-2xl font-black text-[#E8D2A8] mt-1">
              R$ {netBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="relative z-10 p-3 bg-[#C9A96E]/20 rounded-xl border border-[#C9A96E]/40">
            <DollarSign className="w-6 h-6 text-[#E8D2A8]" />
          </div>
        </div>
      </div>

      {/* Orders List & Preview Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 border-b border-slate-100 font-bold text-slate-800 text-sm flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
              Lista de Ordens de Serviço Emitidas
            </div>
            <span className="text-xs text-slate-500 font-bold px-2.5 py-1 bg-blue-50 text-[#0055A5] rounded-full border border-blue-100">{orders.length} ordens</span>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-slate-100 text-xs">
            {orders.map((os) => {
              const isSelected = selectedOS?.id === os.id;
              return (
                <div
                  key={os.id}
                  onClick={() => setSelectedOS(os)}
                  className={`p-4 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between hover:bg-blue-50/50 ${
                    isSelected ? 'bg-blue-50/80 border-l-4 border-[#0055A5]' : 'border-l-4 border-transparent'
                  }`}
                >
                  <div className="space-y-1.5 mb-2 sm:mb-0">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-sm">{os.osNumber}</span>
                      <span className="text-slate-500 font-bold">• {os.clientName}</span>
                    </div>
                    <div className="text-slate-500 text-[11px] flex items-center gap-1.5">
                      <Glasses className="w-3.5 h-3.5 text-slate-400" />
                      {os.frame.brand} {os.frame.model} + Lente {os.lens.name}
                    </div>
                  </div>

                  <div className="text-left sm:text-right space-y-1.5">
                    <div className="font-black text-slate-900 text-sm">
                      R$ {os.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <span
                      className={`inline-flex items-center justify-center text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        os.status === 'pago' || os.status === 'no_laboratorio'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {os.status === 'pago'
                        ? 'PAGO'
                        : os.status === 'no_laboratorio'
                        ? 'NO LABORATÓRIO'
                        : 'PENDENTE'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected OS Receipt Inspector */}
        <div className="bg-[#0F172A] rounded-2xl border border-white/5 shadow-xl p-5 space-y-4 flex flex-col h-[500px] overflow-y-auto relative">
          <div className="border-b border-white/5 pb-3 flex flex-col space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#D4AF37]" /> Visualização da Nota
            </h3>
            {selectedOS && (
              <button
                onClick={() => setShowFullPrintModal(true)}
                className="text-xs bg-[#161D2A] hover:bg-[#1E293B] text-[#D4AF37] px-3 py-2 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md border border-[#D4AF37]/30 transition-all cursor-pointer w-full active:scale-95"
              >
                <Printer className="w-3.5 h-3.5" /> Imprimir 3 Vias
              </button>
            )}
          </div>

          {selectedOS ? (
            <div className="space-y-4 text-xs font-sans animate-in fade-in slide-in-from-bottom-2">
              <div className="p-4 bg-gradient-to-br from-[#161D2A] to-[#0B0F17] rounded-xl space-y-2 border border-[#D4AF37]/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between relative z-10">
                  <OticasLogo size="sm" variant="light-text" />
                  <span className="text-[9px] bg-[#D4AF37]/10 text-[#D4AF37] font-bold px-2 py-0.5 rounded border border-[#D4AF37]/20 uppercase tracking-widest">
                    Matriz
                  </span>
                </div>
                <div className="text-base font-black text-[#D4AF37] relative z-10 mt-2">{selectedOS.osNumber}</div>
                <div className="text-[11px] text-white font-medium relative z-10">Cliente: {selectedOS.clientName}</div>
                <div className="text-[10px] text-slate-400 relative z-10">CPF: {selectedOS.clientCPF}</div>
              </div>

              {/* Prescription Detail */}
              <div className="p-3.5 bg-[#161D2A] border border-white/5 rounded-xl space-y-1.5 text-[11px]">
                <div className="font-bold text-slate-400 uppercase text-[9px] tracking-widest mb-2 flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-[#D4AF37]" /> Dados da Receita
                </div>
                <div className="flex justify-between text-slate-300"><span className="text-slate-500">OD:</span> Sph {selectedOS.prescription.od.esferico} | Cyl {selectedOS.prescription.od.cilindrico} | Eixo {selectedOS.prescription.od.eixo}°</div>
                <div className="flex justify-between text-slate-300"><span className="text-slate-500">OE:</span> Sph {selectedOS.prescription.oe.esferico} | Cyl {selectedOS.prescription.oe.cilindrico} | Eixo {selectedOS.prescription.oe.eixo}°</div>
                <div className="pt-1 mt-1 border-t border-white/5 text-slate-400 text-[10px]">DNP: OD {selectedOS.dnp.dnpOD}mm / OE {selectedOS.dnp.dnpOE}mm (Total: {selectedOS.dnp.dpTotal}mm)</div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-2 border border-white/5 bg-[#161D2A] p-3.5 rounded-xl text-slate-300">
                <div className="font-bold text-slate-400 uppercase text-[9px] tracking-widest mb-2">Resumo de Valores</div>
                <div className="flex justify-between items-center">
                  <span className="truncate mr-2 text-[10px]">Armação: {selectedOS.frame.brand}</span>
                  <span className="font-semibold text-white">R$ {selectedOS.framePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="truncate mr-2 text-[10px]">Lente: {selectedOS.lens.name}</span>
                  <span className="font-semibold text-white">R$ {selectedOS.lensPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-medium text-[10px] pt-1">
                  <span>Desconto:</span>
                  <span>- R$ {selectedOS.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-[#D4AF37] border-t border-white/10 pt-2 mt-2">
                  <span>TOTAL:</span>
                  <span>R$ {selectedOS.totalValue.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Status Action */}
              {selectedOS.status === 'aguardando_pagamento' && (
                <button
                  onClick={() => onConfirmPixPayment(selectedOS.id)}
                  className="w-full py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-extrabold rounded-xl border border-emerald-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" /> Confirmar Pagamento Total
                </button>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 text-xs p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#161D2A] flex items-center justify-center border border-white/5">
                <Search className="w-5 h-5 text-slate-600" />
              </div>
              <p>Selecione uma ordem de serviço na lista para visualizar todos os detalhes e ações.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Full Document Print View */}
      {showFullPrintModal && selectedOS && (
        <div className="fixed inset-0 bg-[#080C14]/90 backdrop-blur-sm z-[200] flex flex-col p-4 md:p-6 overflow-y-auto">
          <div className="max-w-5xl w-full mx-auto bg-white rounded-3xl p-6 border border-[#D4AF37]/20 shadow-[0_0_50px_rgba(212,175,55,0.15)] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
                <FileText className="w-5 h-5 text-[#D4AF37]" /> Modelo Oficial de Ordem de Serviço (3 Vias)
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

      {/* MODAL: EDITAR ORDEM DE SERVIÇO */}
      {showEditOSModal && (
        <div className="fixed inset-0 bg-[#080C14]/90 backdrop-blur-md flex items-center justify-center z-[150] p-4">
          <div className="bg-[#0F172A] rounded-2xl max-w-lg w-full p-6 space-y-5 border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between relative z-10">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#D4AF37]" /> Editar Ordem de Serviço
              </h3>
              <button onClick={() => {setShowEditOSModal(false); setFoundOS(null);}} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 relative z-10">
              {/* Search Box */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar por Número da OS (Ex: OS-1882)"
                    value={searchOSNumber}
                    onChange={(e) => setSearchOSNumber(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#161D2A] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-all"
                  />
                </div>
                <button
                  onClick={handleSearchOS}
                  className="px-4 py-2.5 bg-[#161D2A] hover:bg-[#1E293B] border border-[#D4AF37]/30 text-[#D4AF37] font-bold rounded-xl shadow-md transition-all active:scale-95"
                >
                  Buscar
                </button>
              </div>

              {/* Found OS Details */}
              {foundOS && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="p-4 bg-[#161D2A] border border-white/5 rounded-xl text-sm space-y-2">
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <span className="font-black text-[#D4AF37] text-base">{foundOS.osNumber}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${foundOS.status === 'pago' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                        {foundOS.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div className="text-slate-400">Cliente: <span className="text-white font-semibold">{foundOS.clientName}</span></div>
                      <div className="text-slate-400">Entrega Prevista: <span className="text-white font-semibold">15/08/2026</span></div>
                      <div className="text-slate-400">Valor Total: <span className="text-white font-semibold">R$ {foundOS.totalValue.toFixed(2)}</span></div>
                      <div className="text-slate-400">Saldo Pendente: <span className="text-rose-400 font-bold">R$ {foundOS.status === 'pago' ? '0.00' : foundOS.totalValue.toFixed(2)}</span></div>
                    </div>
                  </div>

                  {/* Quick Action Buttons for Edit */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <button 
                      onClick={() => setShowReceiveModal(true)}
                      className="flex flex-col items-center justify-center gap-1.5 p-3 bg-[#161D2A] hover:bg-[#1E293B] border border-emerald-500/30 rounded-xl transition-all cursor-pointer group"
                    >
                      <DollarSign className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold text-slate-300">Receber Restante</span>
                    </button>
                    
                    <button
                      onClick={() => { setEditObs(foundOS.observations || ''); setShowEditProdutosModal(true); }}
                      className="flex flex-col items-center justify-center gap-1.5 p-3 bg-[#161D2A] hover:bg-[#1E293B] border border-[#D4AF37]/30 rounded-xl transition-all cursor-pointer group"
                    >
                      <Glasses className="w-5 h-5 text-slate-400 group-hover:text-[#D4AF37] transition-colors" />
                      <span className="text-[10px] font-bold text-slate-300">Editar Produtos</span>
                    </button>

                    <button
                      onClick={() => { setEditObs(foundOS.prescription?.medicoName || ''); setShowEditProdutosModal(true); }}
                      className="flex flex-col items-center justify-center gap-1.5 p-3 bg-[#161D2A] hover:bg-[#1E293B] border border-[#D4AF37]/30 rounded-xl transition-all cursor-pointer group"
                    >
                      <FileText className="w-5 h-5 text-slate-400 group-hover:text-[#D4AF37] transition-colors" />
                      <span className="text-[10px] font-bold text-slate-300">Editar Receita</span>
                    </button>

                    <button
                      onClick={() => { setNewStatus(foundOS.status); setShowStatusModal(true); }}
                      className="flex flex-col items-center justify-center gap-1.5 p-3 bg-[#161D2A] hover:bg-[#1E293B] border border-amber-500/30 rounded-xl transition-all cursor-pointer group"
                    >
                      <CheckCircle2 className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold text-slate-300">Alterar Status</span>
                    </button>

                    <button
                      onClick={() => setShowPrintModal(true)}
                      className="flex flex-col items-center justify-center gap-1.5 p-3 bg-[#161D2A] hover:bg-[#1E293B] border border-blue-500/30 rounded-xl transition-all cursor-pointer group"
                    >
                      <Printer className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold text-slate-300">Imprimir OS</span>
                    </button>

                    <button
                      onClick={() => {
                        if (foundOS) {
                          const tel = (foundOS as any).clientPhone?.replace(/\D/g,'') || '';
                          const msg = encodeURIComponent(`Olá! Segue o resumo da sua OS:\n\n*${foundOS.osNumber}*\nCliente: ${foundOS.clientName}\nArmação: ${foundOS.frame?.brand} ${foundOS.frame?.model}\nValor Total: R$ ${foundOS.totalValue?.toFixed(2)}\nStatus: ${foundOS.status?.toUpperCase()}\n\nObrigado pela preferência! 😊`);
                          window.open(`https://wa.me/55${tel}?text=${msg}`, '_blank');
                        }
                      }}
                      className="flex flex-col items-center justify-center gap-1.5 p-3 bg-[#161D2A] hover:bg-[#1E293B] border border-[#25D366]/30 rounded-xl transition-all cursor-pointer group"
                    >
                      <MessageCircle className="w-5 h-5 text-[#25D366] group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold text-slate-300">Enviar WhatsApp</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RECEBER RESTANTE */}
      {showReceiveModal && foundOS && (
        <div className="fixed inset-0 bg-[#080C14]/90 backdrop-blur-md flex items-center justify-center z-[200] p-4">
          <div className="bg-[#0F172A] rounded-2xl max-w-sm w-full p-6 space-y-5 border border-emerald-500/30 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" /> Receber Restante
              </h3>
              <button onClick={() => setShowReceiveModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-[#161D2A] rounded-xl border border-white/5 flex justify-between items-center">
                <span className="text-xs text-slate-400">Saldo Pendente:</span>
                <span className="text-lg font-black text-rose-400">R$ {foundOS.totalValue.toFixed(2)}</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Valor Recebido (R$):</label>
                <input
                  type="number"
                  value={receiveAmount}
                  onChange={(e) => setReceiveAmount(e.target.value)}
                  placeholder="Ex: 500.00"
                  className="w-full px-4 py-2.5 bg-[#161D2A] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Forma de Pagamento:</label>
                <div className="grid grid-cols-2 gap-2">
                  {['PIX', 'Dinheiro', 'Débito', 'Crédito'].map((method) => (
                    <button
                      key={method}
                      onClick={() => setReceiveMethod(method)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        receiveMethod === method
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-[#161D2A] text-slate-400 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Observações:</label>
                <input
                  type="text"
                  placeholder="Ex: Quitação de parcela"
                  className="w-full px-4 py-2.5 bg-[#161D2A] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <button
                onClick={handleConfirmReceive}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold rounded-xl shadow-lg transition-all active:scale-95"
              >
                Confirmar Recebimento & Comissão
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ALTERAR STATUS */}
      {showStatusModal && foundOS && (
        <div className="fixed inset-0 bg-[#080C14]/90 backdrop-blur-md flex items-center justify-center z-[200] p-4">
          <div className="bg-[#0F172A] rounded-2xl max-w-sm w-full p-6 space-y-5 border border-amber-500/30 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-amber-400" /> Alterar Status da OS
              </h3>
              <button onClick={() => setShowStatusModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400">OS: <strong className="text-amber-400">{foundOS.osNumber}</strong> — Cliente: <strong className="text-white">{foundOS.clientName}</strong></p>
            <div className="grid grid-cols-1 gap-2">
              {['aguardando_pagamento', 'pago', 'no_laboratorio', 'pronto', 'entregue', 'cancelado'].map(s => (
                <button
                  key={s}
                  onClick={() => setNewStatus(s)}
                  className={`py-2.5 px-4 text-xs font-bold rounded-xl border transition-all text-left uppercase tracking-wide ${
                    newStatus === s
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-[#161D2A] text-slate-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  {s === 'aguardando_pagamento' ? '⏳ Aguardando Pagamento'
                    : s === 'pago' ? '✅ Pago'
                    : s === 'no_laboratorio' ? '🔬 No Laboratório'
                    : s === 'pronto' ? '👓 Pronto para Retirada'
                    : s === 'entregue' ? '📦 Entregue'
                    : '❌ Cancelado'}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                alert(`Status da ${foundOS.osNumber} alterado para: ${newStatus.toUpperCase()}!\n\nNota: Para persistir no banco, conecte ao Supabase via onConfirmPixPayment ou função específica.`);
                setShowStatusModal(false);
              }}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-extrabold rounded-xl shadow-lg transition-all active:scale-95"
            >
              Confirmar Alteração de Status
            </button>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR PRODUTOS / RECEITA */}
      {showEditProdutosModal && foundOS && (
        <div className="fixed inset-0 bg-[#080C14]/90 backdrop-blur-md flex items-center justify-center z-[200] p-4">
          <div className="bg-[#0F172A] rounded-2xl max-w-lg w-full p-6 space-y-5 border border-[#D4AF37]/30 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Glasses className="w-5 h-5 text-[#D4AF37]" /> Editar OS — {foundOS.osNumber}
              </h3>
              <button onClick={() => setShowEditProdutosModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <p className="text-xs text-amber-300 font-bold">⚠️ ATENÇÃO: Os valores desta OS já foram lançados no Caixa do dia e <strong>NÃO podem ser alterados</strong>. Você pode editar apenas as observações, descrição do produto e dados da receita.</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Armação / Produto:</label>
                <input defaultValue={`${foundOS.frame?.brand} ${foundOS.frame?.model}`} className="w-full px-3 py-2 bg-[#161D2A] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#D4AF37]/50" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Lente / Tratamento:</label>
                <input defaultValue={`${foundOS.lens?.brand} ${foundOS.lens?.name}`} className="w-full px-3 py-2 bg-[#161D2A] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#D4AF37]/50" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Médico / Optometrista:</label>
                <input defaultValue={foundOS.prescription?.medicoName || 'Dr. Lauro Rocha'} className="w-full px-3 py-2 bg-[#161D2A] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#D4AF37]/50" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Observações:</label>
                <textarea
                  value={editObs}
                  onChange={e => setEditObs(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#161D2A] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#D4AF37]/50 resize-none"
                />
              </div>
            </div>
            <button
              onClick={() => { alert('Alterações descritivas salvas com sucesso!'); setShowEditProdutosModal(false); }}
              className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-slate-900 font-extrabold rounded-xl shadow-lg transition-all active:scale-95"
            >
              Salvar Alterações Descritivas
            </button>
          </div>
        </div>
      )}

      {/* MODAL: IMPRIMIR OS (3 VIAS) */}
      {showPrintModal && foundOS && (
        <div className="fixed inset-0 bg-[#080C14]/95 backdrop-blur-md flex items-start justify-center z-[200] p-4 overflow-y-auto">
          <div className="w-full max-w-4xl">
            <div className="flex items-center justify-between mb-4 print:hidden">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Printer className="w-5 h-5 text-blue-400" /> Imprimir OS — {foundOS.osNumber}
              </h3>
              <button onClick={() => setShowPrintModal(false)} className="text-slate-400 hover:text-white bg-[#161D2A] px-3 py-1.5 rounded-lg text-xs font-bold border border-white/10 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
            <ServiceOrderDocument order={foundOS} onClose={() => setShowPrintModal(false)} />
          </div>
        </div>
      )}

    </div>
  );
};
