import React, { useState } from 'react';
import { X, Lock, CheckCircle2, AlertTriangle, FileText, Printer, ShieldAlert, Sparkles, DollarSign } from 'lucide-react';
import { CashFlowEntry, CashClosing, UserRole } from '../../types';

interface CashClosingModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: CashFlowEntry[];
  currentEmpresa: string;
  currentFilial: string;
  currentUser: string;
  currentRole: UserRole;
  onSaveClosing: (closing: CashClosing) => void;
}

export const CashClosingModal: React.FC<CashClosingModalProps> = ({
  isOpen,
  onClose,
  entries,
  currentEmpresa,
  currentFilial,
  currentUser,
  currentRole,
  onSaveClosing,
}) => {
  const [dinheiroEncontrado, setDinheiroEncontrado] = useState<string>('');
  const [pixConferido, setPixConferido] = useState<string>('');
  const [cartaoConferido, setCartaoConferido] = useState<string>('');
  const [observacao, setObservacao] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  if (!isOpen) return null;

  // Role check: Only GERENTE and ADMIN can close or re-open cash
  const canManageClosing = currentRole === 'ADMIN' || currentRole === 'GERENTE';

  // Calculations for current active entries
  const totalEntradas = entries.reduce((acc, curr) => acc + (curr.entrada || 0), 0);
  const totalSaidas = entries.reduce((acc, curr) => acc + (curr.saida || 0), 0);
  const saldoFinal = totalEntradas - totalSaidas;

  // Breakdown by expected payment methods
  const dinheiroEsperado = entries.reduce((acc, curr) => {
    if (curr.paymentMethod === 'Dinheiro') {
      return acc + (curr.entrada - curr.saida);
    }
    return acc;
  }, 0);

  const pixRecebido = entries.reduce((acc, curr) => {
    if (curr.paymentMethod === 'Pix') {
      return acc + (curr.entrada - curr.saida);
    }
    return acc;
  }, 0);

  const cartoesRecebidos = entries.reduce((acc, curr) => {
    if (curr.paymentMethod === 'Cartão Débito' || curr.paymentMethod === 'Cartão Crédito') {
      return acc + (curr.entrada - curr.saida);
    }
    return acc;
  }, 0);

  // Parsed conferência values
  const dinNum = parseFloat(dinheiroEncontrado.replace(',', '.')) || 0;
  const pixNum = parseFloat(pixConferido.replace(',', '.')) || 0;
  const cartNum = parseFloat(cartaoConferido.replace(',', '.')) || 0;

  const totalConferido = dinNum + pixNum + cartNum;
  const totalEsperado = dinheiroEsperado + pixRecebido + cartoesRecebidos;
  const diferencaCaixa = totalConferido - totalEsperado;

  const handlePreFill = () => {
    setDinheiroEncontrado(dinheiroEsperado.toFixed(2));
    setPixConferido(pixRecebido.toFixed(2));
    setCartaoConferido(cartoesRecebidos.toFixed(2));
  };

  const handleConfirmClosing = () => {
    if (!canManageClosing) {
      alert('Somente usuários com perfil GERENTE ou ADMIN podem fechar o caixa.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const closingRecord: CashClosing = {
      id: `fech-${Date.now()}`,
      empresa: currentEmpresa,
      filial: currentFilial,
      dataFechamento: todayStr,
      saldoAnterior: 500.00, // example previous balance
      totalEntradas,
      totalSaidas,
      saldoFinal,
      dinheiroConferido: dinNum,
      pixConferido: pixNum,
      cartaoConferido: cartNum,
      diferenca: diferencaCaixa,
      usuarioResponsavel: currentUser,
      observacao: observacao.trim() || 'Fechamento de caixa concluído com sucesso.',
      status: 'fechado',
      createdAt: new Date().toISOString(),
    };

    onSaveClosing(closingRecord);
    setIsCompleted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] border border-[#C5A880]/40 rounded-[24px] max-w-2xl w-full shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0B1E36] text-white flex items-center justify-between border-b border-[#C5A880]/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#C5A880] text-white rounded-xl shadow-xs">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-wide uppercase">
                FECHAMENTO E CONFERÊNCIA DE CAIXA
              </h2>
              <p className="text-[10px] text-amber-200/80 font-medium">
                Auditoria de Valores & Bloqueio Diário - Óticas Di Óculos Prime
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!canManageClosing ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900">Permissão Insuficiente</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Seu perfil atual (<span className="font-bold text-amber-900">{currentRole}</span>) não possui permissão para fechar o caixa. Solicite a um <span className="font-bold">GERENTE</span> ou <span className="font-bold">ADMIN</span>.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#0B1E36] text-white font-bold rounded-xl text-xs hover:bg-[#112d52]"
            >
              Fechar
            </button>
          </div>
        ) : isCompleted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-black text-slate-900">CAIXA FECHADO COM SUCESSO!</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Relatório de Fechamento gerado. Todas as movimentações do dia foram bloqueadas para alteração por vendedores.
            </p>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Responsável:</span>
                <span className="font-bold text-slate-900">{currentUser}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Saldo Final em Caixa:</span>
                <span className="font-black text-emerald-700">R$ {saldoFinal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Diferença de Caixa:</span>
                <span className={`font-bold ${diferencaCaixa === 0 ? 'text-slate-700' : diferencaCaixa > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  R$ {diferencaCaixa.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Imprimir Relatório PDF
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#0B1E36] hover:bg-[#112d52] text-white font-black rounded-xl text-xs"
              >
                Concluir
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Automatic Calculations Box */}
            <div className="bg-white rounded-2xl p-4 border border-[#C5A880]/30 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#C5A880]" /> RESUMO CALCULADO PELO SISTEMA
                </h3>
                <span className="text-[10px] font-bold bg-amber-50 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200 uppercase">
                  Automático
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#C5A880]/20">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Total Entradas</div>
                  <div className="text-sm font-black text-emerald-700 mt-0.5">R$ {totalEntradas.toFixed(2)}</div>
                </div>

                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#C5A880]/20">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Total Saídas</div>
                  <div className="text-sm font-black text-rose-700 mt-0.5">R$ {totalSaidas.toFixed(2)}</div>
                </div>

                <div className="bg-[#0B1E36] p-3 rounded-xl text-white shadow-xs">
                  <div className="text-[10px] font-bold text-amber-200 uppercase">Saldo Final Esperado</div>
                  <div className="text-sm font-black text-amber-300 mt-0.5">R$ {saldoFinal.toFixed(2)}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs pt-2 text-slate-700 font-semibold border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Dinheiro Esperado</span>
                  <span className="font-bold text-slate-900">R$ {dinheiroEsperado.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Pix Recebido</span>
                  <span className="font-bold text-slate-900">R$ {pixRecebido.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Cartões (Débito/Crédito)</span>
                  <span className="font-bold text-slate-900">R$ {cartoesRecebidos.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Conferência de Caixa Box */}
            <div className="bg-white rounded-2xl p-4 border border-[#C5A880]/30 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  CONFERÊNCIA FÍSICA DE VALORES (CONTAGEM)
                </h3>
                <button
                  type="button"
                  onClick={handlePreFill}
                  className="text-[10px] bg-[#C5A880] text-white font-bold px-2.5 py-1 rounded-lg hover:bg-[#b0936b] transition-all"
                >
                  Preencher com Valores Esperados
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Dinheiro Encontrado
                  </label>
                  <input
                    type="text"
                    placeholder="0,00"
                    value={dinheiroEncontrado}
                    onChange={(e) => setDinheiroEncontrado(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Pix Conferido
                  </label>
                  <input
                    type="text"
                    placeholder="0,00"
                    value={pixConferido}
                    onChange={(e) => setPixConferido(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Cartões Conferidos
                  </label>
                  <input
                    type="text"
                    placeholder="0,00"
                    value={cartaoConferido}
                    onChange={(e) => setCartaoConferido(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                  />
                </div>
              </div>

              {/* Difference Result Banner */}
              <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${
                diferencaCaixa === 0
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : diferencaCaixa > 0
                  ? 'bg-blue-50 border-blue-200 text-blue-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                <div className="flex items-center gap-2">
                  {diferencaCaixa === 0 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                  )}
                  <span>
                    {diferencaCaixa === 0
                      ? 'Caixa Perfeito (Sem Divergências)'
                      : diferencaCaixa > 0
                      ? 'Diferença Positiva (Sobra de Caixa)'
                      : 'Diferença Negativa (Falta de Caixa)'}
                  </span>
                </div>
                <span className="text-sm font-black">
                  {diferencaCaixa > 0 ? `+ R$ ${diferencaCaixa.toFixed(2)}` : `R$ ${diferencaCaixa.toFixed(2)}`}
                </span>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                  Observações do Fechamento / Justificativas
                </label>
                <textarea
                  rows={2}
                  placeholder="Informe qualquer observação relevante ou motivo para eventuais divergências..."
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                />
              </div>
            </div>

            {/* Submit Bar */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-slate-500 font-medium">
                Responsável: <span className="font-bold text-slate-800">{currentUser}</span> ({currentRole})
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmClosing}
                  className="px-6 py-2.5 bg-[#0B1E36] hover:bg-[#112d52] text-amber-300 font-black rounded-xl text-xs shadow-md uppercase tracking-wider flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" /> CONFERIR E FECHAR CAIXA
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
