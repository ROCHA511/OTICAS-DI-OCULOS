import React, { useState } from 'react';

export default function TelaAprovacaoDiretor() {
  const [solicitacoes, setSolicitacoes] = useState<any[]>([
    { id: 1, vendedor: 'Mariana Costa', cliente: 'Lucas Antunes', produto: 'Lente Multifocal Varilux X', valor_original: 1800.0, desconto_pedido: 450.0, justificativa: 'Cliente comprou 2 óculos completos' },
    { id: 2, vendedor: 'Dioenne Silva', cliente: 'Clara Maria', produto: 'Armação Prada Sport', valor_original: 1200.0, desconto_pedido: 300.0, justificativa: 'Fidelidade - cliente antiga da ótica' }
  ]);

  const handleDecidir = (id: number, aprovado: boolean) => {
    setSolicitacoes((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          🔑 Painel de Auditoria & Aprovações Estratégicas
        </h2>
        <p className="text-xs text-slate-500 mt-1">Autorização de descontos especiais acima do limite padrão e controle de fechamento de caixa.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lado Esquerdo (2 Colunas): Solicitações de Desconto */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-300">Solicitações de Desconto Pendentes</h3>
          
          {solicitacoes.length === 0 ? (
            <div className="p-8 border border-slate-800 rounded-xl text-center text-slate-500 text-xs">
              🎉 Nenhuma solicitação de desconto pendente de aprovação.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {solicitacoes.map((sol) => (
                <div key={sol.id} className="p-5 rounded-xl bg-slate-950 border border-slate-850 flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                    <div>
                      <h4 className="text-xs font-bold text-white">Vendedor: {sol.vendedor}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Cliente: {sol.cliente}</p>
                    </div>
                    <span className="bg-amber-500/10 text-amber-500 text-[10px] px-2.5 py-1 rounded-full border border-amber-500/20 font-bold">
                      Desconto de {((sol.desconto_pedido / sol.valor_original) * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-xs text-slate-400">
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block">PRODUTO</span>
                      <strong className="text-slate-300">{sol.produto}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block">VALOR ORIGINAL</span>
                      <strong className="text-slate-300">R$ {sol.valor_original.toFixed(2)}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block">VALOR FINAL PROP.</span>
                      <strong className="text-emerald-400 font-bold">R$ {(sol.valor_original - sol.desconto_pedido).toFixed(2)}</strong>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 p-2.5 rounded text-[11px] text-slate-400 border border-slate-800/40">
                    <strong className="text-slate-500">Justificativa:</strong> {sol.justificativa}
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-2">
                    <button 
                      onClick={() => handleDecidir(sol.id, false)}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                    >
                      Negar
                    </button>
                    <button 
                      onClick={() => handleDecidir(sol.id, true)}
                      className="bg-emerald-500 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs transition-all hover:bg-emerald-400"
                    >
                      Aprovar Desconto
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lado Direito (1 Coluna): Resumos de Fechamentos */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-2">Auditoria de Caixa Recentes</h3>
          
          <div className="flex flex-col gap-3">
            <div className="p-3 rounded-lg bg-slate-900/30 border border-slate-800 text-xs">
              <div className="flex justify-between font-bold text-slate-300">
                <span>Caixa #4301 - Mariana</span>
                <span className="text-emerald-400">Batido</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Data: 30/07/2026</p>
              <div className="flex justify-between text-slate-400 mt-2 border-t border-slate-900 pt-2">
                <span>Declarado: R$ 2.450,00</span>
                <span>Auditado: R$ 2.450,00</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/30 border border-slate-800 text-xs">
              <div className="flex justify-between font-bold text-slate-300">
                <span>Caixa #4300 - Dioenne</span>
                <span className="text-amber-500">Divergência (R$ -10,00)</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Data: 29/07/2026</p>
              <div className="flex justify-between text-slate-400 mt-2 border-t border-slate-900 pt-2">
                <span>Declarado: R$ 1.820,00</span>
                <span>Auditado: R$ 1.830,00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
