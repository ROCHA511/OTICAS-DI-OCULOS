import React, { useState } from 'react';
import { Glasses, Search, Plus, Tag, ShieldCheck, DollarSign, Sparkles } from 'lucide-react';
import { Frame, Lens } from '../../types';

interface CatalogViewProps {
  frames: Frame[];
  lenses: Lens[];
  onAddFrame: (newFrame: Omit<Frame, 'id'>) => void;
  onAddLens: (newLens: Omit<Lens, 'id'>) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  frames,
  lenses,
  onAddFrame,
  onAddLens,
}) => {
  const [activeTab, setActiveTab] = useState<'frames' | 'lenses'>('frames');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFrames = frames.filter(
    (f) =>
      f.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.material.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLenses = lenses.filter(
    (l) =>
      l.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto h-[calc(100vh-65px)]">
      {/* Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
            <Glasses className="w-5 h-5 text-amber-600" /> TABELA DE PREÇOS, ARMAÇÕES & LENTES
          </h1>
          <p className="text-xs text-slate-500">
            Catálogo completo de produtos ópticos consultado pela IA em tempo real para cálculo de orçamentos.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('frames')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'frames'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Armações ({frames.length})
          </button>
          <button
            onClick={() => setActiveTab('lenses')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'lenses'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Lentes & Tratamentos ({lenses.length})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar no catálogo por marca, modelo ou tratamento..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
        />
      </div>

      {/* Frames Catalog Cards */}
      {activeTab === 'frames' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFrames.map((f) => (
            <div
              key={f.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col hover:shadow-md transition-all"
            >
              <div className="h-44 bg-slate-100 relative overflow-hidden">
                <img src={f.image} alt={f.model} className="w-full h-full object-cover" />
                <span className="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Estoque: {f.stock} un
                </span>
              </div>
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-extrabold text-amber-600 uppercase tracking-wider">
                    {f.brand}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{f.model}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {f.color} • {f.material} {f.peso ? `• ${f.peso}g` : ''}
                  </p>
                  
                  {/* Dimensões Geométricas Avançadas */}
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 bg-slate-50 p-2 rounded-xl border border-slate-100 text-[10px] font-mono text-slate-600 mt-2">
                    <div>Aro: <strong>{f.eyeSize} mm</strong></div>
                    <div>Ponte: <strong>{f.bridge} mm</strong></div>
                    <div>Haste: <strong>{f.temple} mm</strong></div>
                    <div>ED (Diâmetro): <strong>{f.ed || 55} mm</strong></div>
                    {f.diagonalMaior && <div>Diagonal: <strong>{f.diagonalMaior} mm</strong></div>}
                    {f.baseCurva && <div>Curvatura: <strong>Base {f.baseCurva}</strong></div>}
                  </div>
                </div>

                <div className="pt-2 border-t flex items-center justify-between gap-2">
                  <div className="text-left">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">Preço de Tabela:</span>
                    <span className="text-sm font-extrabold text-slate-900">
                      R$ {f.price.toFixed(2)}
                    </span>
                  </div>
                  
                  <button className="px-3 py-1.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 border border-teal-500/30 rounded-lg text-[10px] font-extrabold transition-all flex items-center gap-1 active:scale-95">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" /> PROVAR 3D
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lenses Catalog List */}
      {activeTab === 'lenses' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {filteredLenses.map((l) => (
            <div key={l.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-all text-xs">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-blue-900">{l.brand}</span>
                  <span className="font-bold text-slate-800">{l.name}</span>
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Índice {l.indexRefraction}
                  </span>
                  {l.garantiaMeses && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Garantia: {l.garantiaMeses} meses
                    </span>
                  )}
                </div>
                <p className="text-slate-500">{l.description}</p>
                
                {/* Exibição de Tratamentos (Módulo 02) */}
                {l.tratamentos && l.tratamentos.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap pt-1">
                    {l.tratamentos.map((t, idx) => (
                      <span key={idx} className="bg-slate-100 border text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                
                <p className="text-[11px] text-indigo-600 font-semibold pt-0.5">
                  💡 Indicado para: {l.idealForRange}
                </p>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Valor da Lente:</div>
                <div className="text-lg font-extrabold text-slate-900">
                  R$ {l.price.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
