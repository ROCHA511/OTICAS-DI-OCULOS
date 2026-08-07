import React, { useState } from 'react';
import { Glasses, Search, Plus, Sparkles, Camera, X, Upload } from 'lucide-react';
import { Frame, Lens } from '../../types';
import { PriceTableView } from './PriceTableView';

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
  const [showAddFrameModal, setShowAddFrameModal] = useState(false);
  const [framePhoto, setFramePhoto] = useState<string | null>(null);
  const [frameForm, setFrameForm] = useState({
    brand: '',
    model: '',
    color: '',
    material: 'Acetato',
    eyeSize: '',
    bridge: '',
    temple: '',
    ed: '',
    price: '',
    stock: '',
    description: '',
  });

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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFramePhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveFrame = () => {
    if (!frameForm.brand || !frameForm.model || !frameForm.price) {
      alert('Preencha ao menos Marca, Modelo e Preço.');
      return;
    }
    onAddFrame({
      brand: frameForm.brand,
      model: frameForm.model,
      color: frameForm.color || 'Não informado',
      material: frameForm.material,
      eyeSize: Number(frameForm.eyeSize) || 0,
      bridge: Number(frameForm.bridge) || 0,
      temple: Number(frameForm.temple) || 0,
      ed: Number(frameForm.ed) || 55,
      price: Number(frameForm.price),
      stock: Number(frameForm.stock) || 0,
      image: framePhoto || 'https://placehold.co/400x200/e2e8f0/64748b?text=Armação',
      description: frameForm.description,
    } as any);
    setShowAddFrameModal(false);
    setFrameForm({ brand: '', model: '', color: '', material: 'Acetato', eyeSize: '', bridge: '', temple: '', ed: '', price: '', stock: '', description: '' });
    setFramePhoto(null);
    alert('Armação cadastrada com sucesso!');
  };

  return (
    <div className="p-3 sm:p-6 space-y-5 max-w-7xl mx-auto overflow-y-auto h-[calc(100vh-65px)] bg-[#F0F7FF] text-slate-800">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-blue-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-black text-[#071D49] flex items-center gap-2 tracking-tight">
            <Glasses className="w-5 h-5 text-[#D4AF37]" /> {activeTab === 'frames' ? 'LENTES E ARMAÇÕES - CATÁLOGO' : 'TABELAS DE PREÇOS DE LENTES'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {activeTab === 'frames' 
              ? 'Catálogo completo de produtos ópticos consultado pela IA em tempo real para cálculo de orçamentos.' 
              : 'Gerencie todas as tabelas de preços oficiais de marcas parceiras (Hoya, Zeiss, etc) e crie produtos customizados.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {activeTab === 'frames' && (
            <button
              onClick={() => setShowAddFrameModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-[#0055A5] to-[#0284C7] hover:from-[#004488] hover:to-[#0273B0] text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" /> Cadastrar Armação
            </button>
          )}
          <button
            onClick={() => setActiveTab('frames')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'frames'
                ? 'bg-[#071D49] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Armações ({frames.length})
          </button>
          <button
            onClick={() => setActiveTab('lenses')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'lenses'
                ? 'bg-[#0055A5] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Lentes & Tratamentos ({lenses.length})
          </button>
        </div>
      </div>

      {/* Search Bar (Apenas para Armações) */}
      {activeTab === 'frames' && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar no catálogo por marca, modelo ou tratamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-blue-100 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0055A5] shadow-xs"
          />
        </div>
      )}

      {/* Frames Catalog Cards */}
      {activeTab === 'frames' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFrames.map((f) => (
            <div
              key={f.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all group"
            >
              <div className="h-48 bg-slate-50 relative overflow-hidden flex items-center justify-center">
                <img src={f.image} alt={f.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <span className="absolute top-2.5 right-2.5 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
                  Estoque: {f.stock} un
                </span>
              </div>
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-black text-[#D4AF37] uppercase tracking-wider">
                    {f.brand}
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{f.model}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {f.color} • {f.material}
                  </p>
                  
                  {/* Dimensões Geométricas */}
                  <div className="text-[10px] text-slate-400 font-medium mt-1">
                    Aro: <span>{f.eyeSize}mm</span> • Ponte: <span>{f.bridge}mm</span> • Haste: <span>{f.temple}mm</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-end justify-between gap-2">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block">PREÇO DE TABELA:</span>
                    <span className="text-base font-black text-slate-900">
                      R$ {f.price.toFixed(2)}
                    </span>
                  </div>
                  
                  <button className="px-3 py-1.5 bg-[#0055A5]/10 hover:bg-[#0055A5]/20 text-[#0055A5] border border-[#0055A5]/30 rounded-xl text-[10px] font-extrabold transition-all flex items-center gap-1 cursor-pointer active:scale-95">
                    <Sparkles className="w-3.5 h-3.5 text-[#0055A5]" /> PROVAR 3D
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lenses Catalog (PriceTableView Completo com todas as opções: buscar, incluir, listagem de preços) */}
      {activeTab === 'lenses' && (
        <PriceTableView />
      )}

      {/* MODAL: CADASTRAR ARMAÇÃO */}
      {showAddFrameModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[200] p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl my-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Glasses className="w-5 h-5 text-amber-500" /> Cadastrar Nova Armação
              </h3>
              <button onClick={() => setShowAddFrameModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Foto da Armação */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-2">Foto da Armação</label>
              <div className="relative border-2 border-dashed border-slate-300 rounded-xl overflow-hidden hover:border-amber-400 transition-all">
                {framePhoto ? (
                  <div className="relative">
                    <img src={framePhoto} alt="Preview" className="w-full h-44 object-cover" />
                    <button
                      onClick={() => setFramePhoto(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-44 cursor-pointer gap-2 text-slate-400 hover:text-amber-500 transition-all">
                    <Camera className="w-10 h-10" />
                    <span className="text-xs font-semibold">Clique para adicionar foto</span>
                    <span className="text-[10px]">JPG, PNG ou WEBP</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                )}
              </div>
            </div>

            {/* Informações Básicas */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Marca *</label>
                <input
                  value={frameForm.brand}
                  onChange={e => setFrameForm(f => ({ ...f, brand: e.target.value }))}
                  placeholder="Ex: Ray-Ban"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Modelo *</label>
                <input
                  value={frameForm.model}
                  onChange={e => setFrameForm(f => ({ ...f, model: e.target.value }))}
                  placeholder="Ex: Aviator Classic"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Cor</label>
                <input
                  value={frameForm.color}
                  onChange={e => setFrameForm(f => ({ ...f, color: e.target.value }))}
                  placeholder="Ex: Dourado/Verde"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Material</label>
                <select
                  value={frameForm.material}
                  onChange={e => setFrameForm(f => ({ ...f, material: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  {['Acetato', 'Metal', 'Titânio', 'Alumínio', 'Nylon', 'Misto'].map(m => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Medidas */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-2">Medidas (mm)</label>
              <div className="grid grid-cols-4 gap-2">
                {[['Aro', 'eyeSize'], ['Ponte', 'bridge'], ['Haste', 'temple'], ['ED', 'ed']].map(([label, key]) => (
                  <div key={key}>
                    <label className="text-[10px] text-slate-500 block mb-1">{label}</label>
                    <input
                      type="number"
                      value={(frameForm as any)[key]}
                      onChange={e => setFrameForm(f => ({ ...f, [key]: e.target.value }))}
                      placeholder="0"
                      className="w-full px-2 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 text-center"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Preço e Estoque */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Preço de Tabela (R$) *</label>
                <input
                  type="number"
                  value={frameForm.price}
                  onChange={e => setFrameForm(f => ({ ...f, price: e.target.value }))}
                  placeholder="Ex: 580.00"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Estoque Inicial</label>
                <input
                  type="number"
                  value={frameForm.stock}
                  onChange={e => setFrameForm(f => ({ ...f, stock: e.target.value }))}
                  placeholder="Ex: 5"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Descrição / Observações</label>
              <textarea
                value={frameForm.description}
                onChange={e => setFrameForm(f => ({ ...f, description: e.target.value }))}
                rows={2}
                placeholder="Ex: Armação leve ideal para rostos ovais, design vintage clássico..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setShowAddFrameModal(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveFrame}
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold rounded-xl text-sm shadow-md hover:from-amber-400 hover:to-amber-500 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" /> Salvar Armação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

