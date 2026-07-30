import React from 'react';
import { Clock, CheckCircle2, Send, Glasses, AlertCircle, Building, Sparkles } from 'lucide-react';
import { ServiceOrder } from '../../types';

interface LabTrackingViewProps {
  orders: ServiceOrder[];
  onUpdateOSStatus: (osId: string, newStatus: ServiceOrder['status']) => void;
  onSendWhatsAppNotification: (phone: string, msg: string) => void;
}

export const LabTrackingView: React.FC<LabTrackingViewProps> = ({
  orders,
  onUpdateOSStatus,
  onSendWhatsAppNotification,
}) => {
  const labOrders = orders.filter((o) => o.status !== 'orcamento');

  const columns = [
    { id: 'no_laboratorio', title: '🔬 No Laboratório (Surfaçagem)', color: 'bg-purple-100 text-purple-900 border-purple-300' },
    { id: 'pronto', title: '✨ Óculos Pronto (Montagem Concluída)', color: 'bg-blue-100 text-blue-900 border-blue-300' },
    { id: 'entregue', title: '🎉 Entregue ao Cliente', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto h-[calc(100vh-65px)]">
      {/* Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" /> ACOMPANHAMENTO DE LABORATÓRIO & MONTAGEM
          </h1>
          <p className="text-xs text-slate-500">
            Pipeline de produção dos óculos de grau em tempo real com envio automático de status pelo WhatsApp.
          </p>
        </div>
      </div>

      {/* Kanban Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => {
          const colOrders = labOrders.filter((o) => o.status === col.id || (col.id === 'no_laboratorio' && o.status === 'pago'));

          return (
            <div key={col.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4 flex flex-col h-full min-h-[450px]">
              <div className={`p-2.5 rounded-xl border text-xs font-extrabold flex items-center justify-between ${col.color}`}>
                <span>{col.title}</span>
                <span className="bg-white/80 px-2 py-0.5 rounded-full text-[10px]">{colOrders.length}</span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {colOrders.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs italic">
                    Nenhum pedido nesta fase.
                  </div>
                ) : (
                  colOrders.map((os) => (
                    <div
                      key={os.id}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2.5 text-xs hover:border-blue-400 transition-all"
                    >
                      <div className="flex items-center justify-between border-b pb-1.5">
                        <span className="font-extrabold text-blue-900">{os.osNumber}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{os.createdAt}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="font-bold text-slate-800">{os.clientName}</div>
                        <div className="text-[11px] text-slate-500">
                          {os.frame.brand} {os.frame.model} + Lente {os.lens.name}
                        </div>
                      </div>

                      <div className="p-2 bg-slate-50 rounded-lg text-[10px] space-y-0.5 border text-slate-600">
                        <div><strong>DNP:</strong> OD {os.dnp.dnpOD}mm / OE {os.dnp.dnpOE}mm</div>
                        <div><strong>Previsão Lab:</strong> {os.labEstimatedCompletion || 'Em 2 dias úteis'}</div>
                      </div>

                      {/* Status Transition Action Buttons */}
                      <div className="pt-1 flex flex-col gap-1.5">
                        {os.status !== 'pronto' && os.status !== 'entregue' && (
                          <button
                            onClick={() => {
                              onUpdateOSStatus(os.id, 'pronto');
                              onSendWhatsAppNotification(
                                os.clientPhone,
                                `✨ **ÓCULOS PRONTO!**\nOlá ${os.clientName}! Seus óculos referente à Ordem de Serviço ${os.osNumber} ficaram prontos e já passaram pelo controle de qualidade! Pode vir retirar na Ótica Inteligente.`
                              );
                            }}
                            className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[11px] flex items-center justify-center gap-1 shadow-2xs"
                          >
                            <Sparkles className="w-3.5 h-3.5" /> Marcar Pronto + Avisar WhatsApp
                          </button>
                        )}

                        {os.status === 'pronto' && (
                          <button
                            onClick={() => {
                              onUpdateOSStatus(os.id, 'entregue');
                              onSendWhatsAppNotification(
                                os.clientPhone,
                                `🎉 **ENTREGA CONCLUÍDA!**\nObrigado por escolher a Ótica Inteligente, ${os.clientName}! Qualquer ajuste na armação ou garantia, estamos à disposição.`
                              );
                            }}
                            className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] flex items-center justify-center gap-1 shadow-2xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Marcar Entregue
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
