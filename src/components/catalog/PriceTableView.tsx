import React, { useState, useEffect } from 'react';
import { Search, Glasses, Tag, Sparkles, Filter, CheckCircle2, Plus, Camera, FileSpreadsheet, Trash2, Package } from 'lucide-react';
import { OFFICIAL_PRICE_TABLE, LensPriceItem } from '../../data/priceTableData';
import { AddProductModal } from './AddProductModal';

export const PriceTableView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('TODOS');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Load items from local storage if available, otherwise default to OFFICIAL_PRICE_TABLE
  const [priceItems, setPriceItems] = useState<LensPriceItem[]>(() => {
    try {
      const saved = localStorage.getItem('oticas_price_table_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading custom price items:', e);
    }
    return OFFICIAL_PRICE_TABLE;
  });

  // Save to local storage on updates
  useEffect(() => {
    try {
      localStorage.setItem('oticas_price_table_items', JSON.stringify(priceItems));
    } catch (e) {
      console.error('Error saving price items:', e);
    }
  }, [priceItems]);

  const handleAddItems = (newItems: LensPriceItem[]) => {
    setPriceItems((prev) => [...newItems, ...prev]);
  };

  const handleDeleteItem = (indexToDelete: number) => {
    setPriceItems((prev) => prev.filter((_, idx) => idx !== indexToDelete));
  };

  const brands = [
    'TODOS',
    'HOYA',
    'ZEISS',
    'VARILUX',
    'KODAK',
    'GALAXY',
    'MULTIFOCAIS C.O',
    'VISÃO SIMPLES & TRATAMENTOS',
  ];

  const filteredItems = priceItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.supplier && item.supplier.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesBrand =
      selectedBrand === 'TODOS' ||
      item.brand.toUpperCase() === selectedBrand ||
      item.brand.toUpperCase().includes(selectedBrand);

    const matchesCategory =
      selectedCategory === 'TODAS' || item.category === selectedCategory;

    return matchesSearch && matchesBrand && matchesCategory;
  });

  return (
    <div className="h-full w-full max-w-7xl mx-auto overflow-y-auto p-3 sm:p-4 md:p-5 space-y-4 box-border flex-1">
      {/* Banner / Header */}
      <div className="bg-gradient-to-r from-[#0B1E36] via-[#12396B] to-[#0A2244] p-5 rounded-2xl border border-[#C5A059]/40 shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[11px] font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Tabela Oficial de Preços de Lentes
            </div>
            <h1 className="text-xl md:text-2xl font-black text-amber-300 tracking-wide flex items-center gap-2">
              Óticas Di Óculos <span className="text-white font-light text-base md:text-lg">| Tabela de Lentes</span>
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl">
              Consulte os códigos e valores oficiais atualizados para Lentes HOYA, ZEISS, Varilux, Kodak, Galaxy, Visão Simples, Crizal e Transitions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#C5A059] hover:bg-[#b08d48] text-[#0B1E36] font-black text-xs px-4 py-2.5 rounded-xl shadow-[0_0_20px_rgba(197,160,89,0.4)] transition-all flex items-center justify-center gap-2 border border-white/20 cursor-pointer active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4 text-[#0B1E36]" />
              <span>[ + INCLUIR PRODUTO ]</span>
              <span className="text-[10px] bg-[#0B1E36] text-amber-300 px-1.5 py-0.5 rounded font-extrabold uppercase">
                Manual / Foto IA
              </span>
            </button>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15 text-xs">
              <div>
                <span className="block text-[10px] text-amber-200 font-bold uppercase">Itens Catalogados</span>
                <span className="text-base font-black text-white">{priceItems.length} Lentes</span>
              </div>
              <div className="h-7 w-px bg-white/20" />
              <div>
                <span className="block text-[10px] text-amber-200 font-bold uppercase">Marcas Principais</span>
                <span className="text-base font-black text-amber-300">HOYA • ZEISS • VX</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3 justify-between">
          {/* Search bar */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por código, nome da lente ou fornecedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner font-medium"
            />
          </div>

          {/* Action Buttons & Category Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSelectedCategory('TODAS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === 'TODAS'
                    ? 'bg-[#0B1E36] text-amber-300 border border-[#C5A059]'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setSelectedCategory('Visão Simples')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === 'Visão Simples'
                    ? 'bg-[#0B1E36] text-amber-300 border border-[#C5A059]'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Visão Simples
              </button>
              <button
                onClick={() => setSelectedCategory('Multifocal')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === 'Multifocal'
                    ? 'bg-[#0B1E36] text-amber-300 border border-[#C5A059]'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Multifocais
              </button>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#0B1E36] hover:bg-[#12396B] text-amber-300 border border-[#C5A059] font-black text-xs px-3.5 py-1.5 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-amber-300" /> Incluir Produto
            </button>
          </div>
        </div>

        {/* Brand Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 scrollbar-none">
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBrand(b)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                selectedBrand === b
                  ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-500'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-3.5 bg-[#FAF8F5] border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Listagem de Preços ({filteredItems.length} registros)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
              Preços válidos para Óticas Di Óculos
            </span>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="text-xs text-blue-900 font-extrabold underline hover:text-amber-600 flex items-center gap-1 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" /> Ler Foto de Tabela
            </button>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs space-y-3">
            <div>Nenhuma lente encontrada com os filtros informados.</div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-[#0B1E36] text-amber-300 rounded-xl font-bold text-xs inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Cadastrar Novo Produto
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B1E36] text-amber-300 uppercase font-black text-[10px] tracking-wider border-b border-[#C5A059]/30">
                <tr>
                  <th className="py-3 px-4">Código</th>
                  <th className="py-3 px-4">Marca / Fornecedor</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Lente & Tratamento</th>
                  <th className="py-3 px-4 text-center">Índice</th>
                  <th className="py-3 px-4 text-center">Estoque</th>
                  <th className="py-3 px-4 text-right">Preço Custo</th>
                  <th className="py-3 px-4 text-right">Valor Oficial</th>
                  <th className="py-3 px-4 text-center w-12">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredItems.map((item, idx) => (
                  <tr
                    key={`${item.code}-${idx}`}
                    className="hover:bg-amber-50/50 transition-colors"
                  >
                    <td className="py-2.5 px-4 font-mono font-extrabold text-blue-900 bg-slate-50/80 w-28">
                      {item.code}
                    </td>
                    <td className="py-2.5 px-4 font-extrabold text-slate-900">
                      <div className="space-y-0.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] border border-slate-200">
                          {item.brand}
                        </span>
                        {item.supplier && (
                          <span className="block text-[9px] text-slate-500 font-normal truncate max-w-[120px]">
                            {item.supplier}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          item.category === 'Visão Simples'
                            ? 'bg-blue-100 text-blue-800'
                            : item.category === 'Multifocal'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-900">
                      <div>{item.name}</div>
                      {item.protections && (
                        <div className="text-[10px] text-slate-500 font-normal">
                          {item.protections}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-700">
                      {item.refractionIndex || '-'}
                    </td>
                    <td className="py-2.5 px-4 text-center font-bold text-slate-700">
                      {item.quantity !== undefined ? `${item.quantity} un` : '-'}
                    </td>
                    <td className="py-2.5 px-4 text-right font-medium text-slate-500 text-xs">
                      {item.costPrice
                        ? `R$ ${item.costPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                        : '-'}
                    </td>
                    <td className="py-2.5 px-4 text-right font-black text-emerald-700 text-sm">
                      R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <button
                        onClick={() => handleDeleteItem(priceItems.indexOf(item))}
                        title="Remover produto da tabela"
                        className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <AddProductModal
          onClose={() => setIsAddModalOpen(false)}
          onAddItems={(newItems) => {
            handleAddItems(newItems);
            setIsAddModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
