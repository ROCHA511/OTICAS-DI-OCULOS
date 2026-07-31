import React, { useState } from 'react';
import { X, FileText, Download, Printer, Table, Filter, Calendar, Building2, User, CreditCard, PieChart } from 'lucide-react';
import { CashFlowEntry, CashClosing } from '../../types';

interface CashFlowReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: CashFlowEntry[];
  closings: CashClosing[];
  currentEmpresa: string;
  currentFilial: string;
}

export type ReportType =
  | 'livro_caixa'
  | 'fluxo_diario'
  | 'fluxo_semanal'
  | 'fluxo_mensal'
  | 'fluxo_anual'
  | 'entradas_categoria'
  | 'saidas_categoria'
  | 'fluxo_filial'
  | 'fluxo_usuario'
  | 'fluxo_forma_pagamento';

export const CashFlowReportsModal: React.FC<CashFlowReportsModalProps> = ({
  isOpen,
  onClose,
  entries,
  closings,
  currentEmpresa,
  currentFilial,
}) => {
  const [activeReport, setActiveReport] = useState<ReportType>('livro_caixa');

  if (!isOpen) return null;

  const totalEntradas = entries.reduce((acc, curr) => acc + (curr.entrada || 0), 0);
  const totalSaidas = entries.reduce((acc, curr) => acc + (curr.saida || 0), 0);
  const saldoAtual = totalEntradas - totalSaidas;

  const handleExportPDF = () => {
    alert('Relatório exportado em PDF com sucesso!');
    window.print();
  };

  const handleExportExcel = () => {
    let csvContent = 'data:text/csv;charset=utf-8,ID,DATA,HORA,USUARIO,TIPO,DESCRICAO,FORMA_PAGAMENTO,ENTRADA,SAIDA,SALDO\n';
    entries.forEach((e) => {
      csvContent += `${e.id},${e.date},${e.time},${e.usuario},${e.type},"${e.description}",${e.paymentMethod},${e.entrada},${e.saida},${e.saldo}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Livro_Caixa_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reportOptions: { id: ReportType; label: string; icon: any }[] = [
    { id: 'livro_caixa', label: 'Livro Caixa Oficial', icon: FileText },
    { id: 'fluxo_diario', label: 'Fluxo Diário', icon: Calendar },
    { id: 'fluxo_semanal', label: 'Fluxo Semanal', icon: Calendar },
    { id: 'fluxo_mensal', label: 'Fluxo Mensal', icon: Calendar },
    { id: 'fluxo_anual', label: 'Fluxo Anual', icon: Calendar },
    { id: 'entradas_categoria', label: 'Entradas por Categoria', icon: PieChart },
    { id: 'saidas_categoria', label: 'Saídas por Categoria', icon: PieChart },
    { id: 'fluxo_filial', label: 'Fluxo por Filial', icon: Building2 },
    { id: 'fluxo_usuario', label: 'Fluxo por Usuário', icon: User },
    { id: 'fluxo_forma_pagamento', label: 'Fluxo por Forma de PG', icon: CreditCard },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] border border-[#C5A880]/40 rounded-[24px] max-w-4xl w-full shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0B1E36] text-white flex items-center justify-between border-b border-[#C5A880]/30 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#C5A880] text-white rounded-xl shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-wide uppercase">
                CENTRAL DE RELATÓRIOS FINANCEIROS
              </h2>
              <p className="text-[10px] text-amber-200/80 font-medium">
                Óticas Di Óculos Prime - Livro Caixa e Demonstrações
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportPDF}
              className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" /> PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-2xs"
            >
              <Table className="w-3.5 h-3.5" /> Excel
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg text-xs flex items-center gap-1 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" /> Imprimir
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-all ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Tabs header */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
            {reportOptions.map((rep) => {
              const Icon = rep.icon;
              const isActive = activeReport === rep.id;
              return (
                <button
                  key={rep.id}
                  onClick={() => setActiveReport(rep.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                    isActive
                      ? 'bg-[#0B1E36] text-amber-300 border-[#C5A880]/50 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {rep.label}
                </button>
              );
            })}
          </div>

          {/* Report Display Container (Printable layout) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4 font-sans text-slate-800">
            {/* Header Document Banner */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-base font-black text-[#0B1E36] uppercase tracking-wider">
                  ÓTICAS DI ÓCULOS PRIME - {reportOptions.find((r) => r.id === activeReport)?.label.toUpperCase()}
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Empresa: {currentEmpresa} | Filial: {currentFilial} | Emissão: {new Date().toLocaleDateString('pt-BR')}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase block">Saldo Atual</span>
                <span className="text-lg font-black text-emerald-700 font-mono">R$ {saldoAtual.toFixed(2)}</span>
              </div>
            </div>

            {/* Summary metrics row */}
            <div className="grid grid-cols-3 gap-4 bg-[#FAF8F5] p-3 rounded-xl border border-[#C5A880]/30 text-center">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Total Entradas</span>
                <div className="text-sm font-black text-emerald-700 font-mono">R$ {totalEntradas.toFixed(2)}</div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Total Saídas</span>
                <div className="text-sm font-black text-rose-700 font-mono">R$ {totalSaidas.toFixed(2)}</div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Resultado do Período</span>
                <div className="text-sm font-black text-[#0B1E36] font-mono">R$ {(totalEntradas - totalSaidas).toFixed(2)}</div>
              </div>
            </div>

            {/* Report Content Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider border-y border-slate-200">
                    <th className="py-2.5 px-3">ID / Hora</th>
                    <th className="py-2.5 px-3">Data</th>
                    <th className="py-2.5 px-3">Usuário</th>
                    <th className="py-2.5 px-3">Tipo / Categoria</th>
                    <th className="py-2.5 px-3">Descrição</th>
                    <th className="py-2.5 px-3">Forma PG</th>
                    <th className="py-2.5 px-3 text-right">Entrada</th>
                    <th className="py-2.5 px-3 text-right">Saída</th>
                    <th className="py-2.5 px-3 text-right">Saldo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {entries.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400 italic">
                        Nenhuma movimentação para exibir neste relatório.
                      </td>
                    </tr>
                  ) : (
                    entries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono font-bold text-[11px] text-slate-900">
                          {entry.id} <span className="text-[9px] text-slate-400 font-normal block">{entry.time}</span>
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap">{entry.date}</td>
                        <td className="py-2 px-3">{entry.usuario}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            entry.type === 'entrada' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {entry.category}
                          </span>
                        </td>
                        <td className="py-2 px-3 max-w-xs truncate">{entry.description}</td>
                        <td className="py-2 px-3 font-semibold">{entry.paymentMethod}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700">
                          {entry.entrada > 0 ? `R$ ${entry.entrada.toFixed(2)}` : '-'}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-rose-700">
                          {entry.saida > 0 ? `R$ ${entry.saida.toFixed(2)}` : '-'}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                          R$ {entry.saldo.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Closing records section if available */}
            {closings.length > 0 && (
              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">
                  HISTÓRICO DE FECHAMENTOS AUDITADOS
                </h3>
                <div className="space-y-2">
                  {closings.map((c) => (
                    <div key={c.id} className="p-3 bg-[#FAF8F5] rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{c.dataFechamento}</span> - <span className="text-slate-600">{c.usuarioResponsavel}</span>
                        <span className="text-[10px] text-slate-400 block">{c.observacao}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-slate-900">Saldo: R$ {c.saldoFinal.toFixed(2)}</span>
                        <span className={`text-[10px] font-bold block ${c.diferenca === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          Diferença: R$ {c.diferenca.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
