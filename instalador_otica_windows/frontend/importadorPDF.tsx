import React, { useState } from 'react';

export default function ImportadorPDF() {
  const [progresso, setProgresso] = useState<number | null>(null);
  const [tabelas, setTabelas] = useState<any[]>([
    { id: 1, nome: 'Tabela de Preços Essilor 2026.pdf', tamanho: '2.4 MB', data: '30/07/2026', registros: 142 },
    { id: 2, nome: 'Preços Lentes Hoya Prime.pdf', tamanho: '1.8 MB', data: '29/07/2026', registros: 89 }
  ]);

  const handleUploadSimulado = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setProgresso(0);
    const interval = setInterval(() => {
      setProgresso((prev) => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(interval);
          setTabelas((old) => [
            {
              id: Date.now(),
              nome: file.name,
              tamanho: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              data: new Date().toLocaleDateString('pt-BR'),
              registros: Math.floor(Math.random() * 100) + 20
            },
            ...old
          ]);
          return null;
        }
        return prev + 20;
      });
    }, 300);
  };

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          📁 Importador de PDFs de Laboratórios
        </h2>
        <p className="text-xs text-slate-500 mt-1">Envie tabelas de preços e catálogos de lentes para atualizar o estoque e preços integrados.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Zone (1 Coluna) */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="relative border-2 border-dashed border-slate-800 hover:border-cyan-500/40 rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all bg-slate-950/40 min-h-[220px]">
            <input 
              type="file" 
              accept=".pdf"
              onChange={handleUploadSimulado}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            />
            <span className="text-3xl mb-2">📥</span>
            <p className="text-sm font-semibold text-slate-300">Carregar PDF</p>
            <p className="text-xs text-slate-500 mt-1">Arraste a tabela de lentes ou clique aqui</p>
          </div>

          {progresso !== null && (
            <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>Extraindo dados do PDF...</span>
                <span>{progresso}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-cyan-500 h-full transition-all duration-300" style={{ width: `${progresso}%` }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Tabelas Importadas (2 Colunas) */}
        <div className="md:col-span-2 p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-2">Tabelas e Catálogos Importados</h3>
          
          <div className="flex flex-col gap-3">
            {tabelas.map((tab) => (
              <div key={tab.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-850/80 hover:border-slate-800 transition-all">
                <div className="flex items-start gap-3">
                  <span className="text-xl">📄</span>
                  <div>
                    <h4 className="text-xs font-bold text-white">{tab.nome}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Tamanho: {tab.tamanho} | Importado em: {tab.data}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-cyan-500/10 text-cyan-400 text-[10px] px-2.5 py-1 rounded-full border border-cyan-500/20 font-bold">
                    {tab.registros} Lentes
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
