import React, { useState } from 'react';

export default function OCRReceita() {
  const [loading, setLoading] = useState(false);
  const [grauDetectado, setGrauDetectado] = useState<any>(null);

  // Simulação de OCR de Alta Precisão baseado em IA
  const handleUploadSimulado = () => {
    setLoading(true);
    setTimeout(() => {
      setGrauDetectado({
        esferico_od: -2.50,
        cilindrico_od: -0.75,
        eixo_od: 180,
        dnp_od: 31.5,
        esferico_oe: -2.25,
        cilindrico_oe: -1.00,
        eixo_oe: 175,
        dnp_oe: 32.0,
        medico: 'Dr. Roberto Lins (CRM 12345)',
        validade: '2027-07-31'
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          🔍 Scanner Inteligente de Receitas (OCR + IA)
        </h2>
        <p className="text-xs text-slate-500 mt-1">Extração automática de grau esférico, cilíndrico, eixo e DNP a partir da câmera ou upload.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lado esquerdo: Dropzone de Imagem */}
        <div className="flex flex-col gap-4">
          <div className="p-10 border-2 border-dashed border-slate-800 hover:border-cyan-500/40 rounded-xl flex flex-col items-center justify-center gap-4 transition-all bg-slate-950/40">
            <span className="text-4xl">📄</span>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-300">Selecione o arquivo da Receita</p>
              <p className="text-xs text-slate-500 mt-1">Suporta JPG, PNG ou PDF digitalizado</p>
            </div>
            <button 
              onClick={handleUploadSimulado}
              disabled={loading}
              className="mt-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition-all disabled:opacity-50"
            >
              {loading ? 'Processando Imagem...' : 'Simular Leitura OCR'}
            </button>
          </div>
          
          {loading && (
            <div className="flex items-center gap-3 bg-cyan-950/20 border border-cyan-800/30 p-3 rounded-lg text-xs text-cyan-400">
              <span className="animate-spin">🔄</span>
              <span>Analisando eixos, esféricos e assinaturas do médico...</span>
            </div>
          )}
        </div>

        {/* Lado direito: Campos de Formulário Preenchidos Automaticamente */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-2">Dados Extraídos da Receita</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Olho Direito (OD) */}
            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/60">
              <h4 className="text-xs font-bold text-cyan-400 mb-2">Olho Direito (OD)</h4>
              <div className="flex flex-col gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold">ESFÉRICO</label>
                  <input type="text" readOnly value={grauDetectado ? grauDetectado.esferico_od.toFixed(2) : ''} placeholder="0.00" className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 p-1.5 rounded" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold">CILÍNDRICO</label>
                  <input type="text" readOnly value={grauDetectado ? grauDetectado.cilindrico_od.toFixed(2) : ''} placeholder="0.00" className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 p-1.5 rounded" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold">EIXO (º)</label>
                  <input type="text" readOnly value={grauDetectado ? grauDetectado.eixo_od : ''} placeholder="0" className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 p-1.5 rounded" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold">DNP (mm)</label>
                  <input type="text" readOnly value={grauDetectado ? grauDetectado.dnp_od : ''} placeholder="0.0" className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 p-1.5 rounded" />
                </div>
              </div>
            </div>

            {/* Olho Esquerdo (OE) */}
            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/60">
              <h4 className="text-xs font-bold text-cyan-400 mb-2">Olho Esquerdo (OE)</h4>
              <div className="flex flex-col gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold">ESFÉRICO</label>
                  <input type="text" readOnly value={grauDetectado ? grauDetectado.esferico_oe.toFixed(2) : ''} placeholder="0.00" className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 p-1.5 rounded" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold">CILÍNDRICO</label>
                  <input type="text" readOnly value={grauDetectado ? grauDetectado.cilindrico_oe.toFixed(2) : ''} placeholder="0.00" className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 p-1.5 rounded" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold">EIXO (º)</label>
                  <input type="text" readOnly value={grauDetectado ? grauDetectado.eixo_oe : ''} placeholder="0" className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 p-1.5 rounded" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold">DNP (mm)</label>
                  <input type="text" readOnly value={grauDetectado ? grauDetectado.dnp_oe : ''} placeholder="0.0" className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 p-1.5 rounded" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 flex flex-col gap-2">
            <div>
              <label className="text-[10px] text-slate-500 font-bold">MÉDICO PRESCRITOR</label>
              <input type="text" readOnly value={grauDetectado ? grauDetectado.medico : ''} placeholder="Nome do Oftalmologista" className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 p-2 rounded" />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-bold">VALIDADE DA RECEITA</label>
              <input type="text" readOnly value={grauDetectado ? grauDetectado.validade : ''} placeholder="AAAA-MM-DD" className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 p-2 rounded" />
            </div>
          </div>

          <button 
            disabled={!grauDetectado}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold p-2.5 rounded-lg text-xs transition-all disabled:opacity-40"
          >
            Salvar e Associar ao Prontuário do Cliente
          </button>
        </div>
      </div>
    </div>
  );
}
