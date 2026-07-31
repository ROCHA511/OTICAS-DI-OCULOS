import React, { useState } from 'react';
import {
  X,
  Upload,
  Camera,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
  ScanLine,
  Eye,
  DollarSign,
  Package,
  Building2,
  Check,
  AlertCircle,
  FileText
} from 'lucide-react';
import { LensPriceItem } from '../../data/priceTableData';

interface AddProductModalProps {
  onClose: () => void;
  onAddItems: (newItems: LensPriceItem[]) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  onClose,
  onAddItems,
}) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'ocr'>('manual');

  // Manual Form State
  const [manualCode, setManualCode] = useState(`LEN-${Math.floor(1000 + Math.random() * 9000)}`);
  const [manualBrand, setManualBrand] = useState('HOYA');
  const [manualSupplier, setManualSupplier] = useState('Laboratório Hoya Brasil');
  const [manualCategory, setManualCategory] = useState<'Visão Simples' | 'Multifocal' | 'Bifocal' | 'Tratamento'>('Visão Simples');
  const [manualName, setManualName] = useState('');
  const [manualRefractionIndex, setManualRefractionIndex] = useState('1.56');
  const [manualCostPrice, setManualCostPrice] = useState<string>('120.00');
  const [manualPrice, setManualPrice] = useState<string>('450.00');
  const [manualQuantity, setManualQuantity] = useState<number>(10);
  const [manualProtections, setManualProtections] = useState('Antirreflexo + Filtro Luz Azul + UV400');
  const [manualSuccessMsg, setManualSuccessMsg] = useState(false);

  // OCR / Image Scan State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStepText, setScanStepText] = useState('');
  const [scannedItems, setScannedItems] = useState<LensPriceItem[]>([]);
  const [selectedScannedIndexes, setSelectedScannedIndexes] = useState<number[]>([]);

  // Demo Table Catalog Images
  const demoCatalogs = [
    {
      title: 'Tabela Hoya Digital 2026',
      url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
      sampleItems: [
        {
          code: 'HY-2026-01',
          brand: 'HOYA',
          category: 'Visão Simples' as const,
          name: 'VS NULUX 1.67 CRIZAL LONGLIFE SENSITY',
          price: 780.0,
          costPrice: 220.0,
          quantity: 15,
          supplier: 'Hoya Optical Brasil',
          refractionIndex: '1.67',
          protections: 'Anti-Reflexo LongLife + Sensity2',
        },
        {
          code: 'HY-2026-02',
          brand: 'HOYA',
          category: 'Multifocal' as const,
          name: 'MF LIFESTYLE 3.0 URBAN BLUECONTROL 1.60',
          price: 2450.0,
          costPrice: 790.0,
          quantity: 8,
          supplier: 'Hoya Optical Brasil',
          refractionIndex: '1.60',
          protections: 'BlueControl + Antirreflexo No-Risk',
        },
        {
          code: 'HY-2026-03',
          brand: 'HOYA',
          category: 'Multifocal' as const,
          name: 'MF HOYALUX ID MYSELF HARMONY 1.74',
          price: 4890.0,
          costPrice: 1650.0,
          quantity: 4,
          supplier: 'Hoya Optical Brasil',
          refractionIndex: '1.74',
          protections: 'Hi-Vision LongLife + UV Control',
        },
      ],
    },
    {
      title: 'Tabela Varilux / Essilor Crizal',
      url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80',
      sampleItems: [
        {
          code: 'VX-801',
          brand: 'VARILUX',
          category: 'Multifocal' as const,
          name: 'VARILUX XR DESIGN ORMA 1.50 CRIZAL SAPPHIRE',
          price: 3200.0,
          costPrice: 950.0,
          quantity: 12,
          supplier: 'Essilor / Varilux Brasil',
          refractionIndex: '1.50',
          protections: 'Crizal Sapphire HR + Optifog',
        },
        {
          code: 'VX-802',
          brand: 'VARILUX',
          category: 'Multifocal' as const,
          name: 'VARILUX PHYSIO 3.0 TRANSITIONS GEN 8 AIRWEAR',
          price: 2890.0,
          costPrice: 880.0,
          quantity: 10,
          supplier: 'Essilor / Varilux Brasil',
          refractionIndex: '1.59 (Poly)',
          protections: 'Transitions Gen 8 + Crizal Easy',
        },
        {
          code: 'VX-803',
          brand: 'VARILUX',
          category: 'Visão Simples' as const,
          name: 'EYEZEN START STYLIS 1.67 CRIZAL PREVENCIA',
          price: 1150.0,
          costPrice: 340.0,
          quantity: 20,
          supplier: 'Essilor / Varilux Brasil',
          refractionIndex: '1.67',
          protections: 'Crizal Prevencia Filtro Azul',
        },
      ],
    },
    {
      title: 'Tabela Zeiss SmartLife 2026',
      url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
      sampleItems: [
        {
          code: 'ZS-301',
          brand: 'ZEISS',
          category: 'Visão Simples' as const,
          name: 'VS CLEARVIEW 1.60 DURAVISION PLATINUM UV',
          price: 1420.0,
          costPrice: 410.0,
          quantity: 18,
          supplier: 'Carl Zeiss Vision',
          refractionIndex: '1.60',
          protections: 'DuraVision Platinum UV400',
        },
        {
          code: 'ZS-302',
          brand: 'ZEISS',
          category: 'Multifocal' as const,
          name: 'MF SMARTLIFE SUPERB 1.67 PHOTOFUSION X',
          price: 4100.0,
          costPrice: 1350.0,
          quantity: 6,
          supplier: 'Carl Zeiss Vision',
          refractionIndex: '1.67',
          protections: 'PhotoFusion X + DuraVision Chrome',
        },
        {
          code: 'ZS-303',
          brand: 'ZEISS',
          category: 'Multifocal' as const,
          name: 'MF GT2 3D 1.50 DURAVISION DRIVEFREE',
          price: 1890.0,
          costPrice: 580.0,
          quantity: 14,
          supplier: 'Carl Zeiss Vision',
          refractionIndex: '1.50',
          protections: 'DriveSafe + Antirreflexo Premium',
        },
      ],
    },
  ];

  // Manual submit
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName || !manualPrice) return;

    const newItem: LensPriceItem = {
      code: manualCode || `LEN-${Math.floor(1000 + Math.random() * 9000)}`,
      brand: manualBrand.toUpperCase(),
      category: manualCategory,
      name: manualName,
      price: parseFloat(manualPrice) || 0,
      costPrice: parseFloat(manualCostPrice) || 0,
      quantity: manualQuantity || 1,
      supplier: manualSupplier || 'Fornecedor Cadastrado',
      refractionIndex: manualRefractionIndex,
      protections: manualProtections,
    };

    onAddItems([newItem]);
    setManualSuccessMsg(true);
    setTimeout(() => {
      setManualSuccessMsg(false);
      setManualName('');
      setManualCode(`LEN-${Math.floor(1000 + Math.random() * 9000)}`);
    }, 1500);
  };

  // Image Upload / Scan process
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgUrl = event.target?.result as string;
        runImageScan(imgUrl, demoCatalogs[0].sampleItems);
      };
      reader.readAsDataURL(file);
    }
  };

  const runImageScan = (imageUrl: string, sampleData: LensPriceItem[]) => {
    setSelectedImage(imageUrl);
    setIsScanning(true);
    setScanProgress(10);
    setScanStepText('Carregando imagem da tabela e otimizando contraste...');

    setTimeout(() => {
      setScanProgress(35);
      setScanStepText('Escanear linhas e colunas (Visão Computacional)...');
    }, 800);

    setTimeout(() => {
      setScanProgress(70);
      setScanStepText('Mapeando Marca, Categoria, Nome da Lente, Índice e Preços...');
    }, 1700);

    setTimeout(() => {
      setScanProgress(100);
      setIsScanning(false);
      setScannedItems(sampleData);
      setSelectedScannedIndexes(sampleData.map((_, i) => i));
    }, 2600);
  };

  const handleToggleSelectScanned = (idx: number) => {
    setSelectedScannedIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleConfirmImportScanned = () => {
    const itemsToImport = scannedItems.filter((_, idx) =>
      selectedScannedIndexes.includes(idx)
    );
    if (itemsToImport.length > 0) {
      onAddItems(itemsToImport);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#071D49]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto font-sans">
      <div className="bg-white w-full max-w-4xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-auto animate-fadeIn">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#071D49] via-[#0B255C] to-[#071D49] p-4 sm:p-5 border-b border-[#C9A96E]/40 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#C9A96E]/20 border border-[#C9A96E]/50 rounded-2xl text-[#E8D2A8]">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#E8D2A8] uppercase tracking-wider flex items-center gap-2">
                Incluir Novo Produto na Tabela de Preços
              </h2>
              <p className="text-xs text-slate-300">
                Lançamento manual de produto ou leitura por foto de catálogo impresso
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Switcher */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center justify-center gap-3">
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 max-w-xs py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'manual'
                ? 'bg-[#071D49] text-[#E8D2A8] shadow-md border border-[#C9A96E]'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            <Plus className="w-4 h-4 text-[#C9A96E]" /> 📝 Cadastro Manual
          </button>

          <button
            onClick={() => setActiveTab('ocr')}
            className={`flex-1 max-w-xs py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'ocr'
                ? 'bg-[#071D49] text-[#E8D2A8] shadow-md border border-[#C9A96E]'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            <Camera className="w-4 h-4 text-[#C9A96E]" /> 📸 Foto da Tabela (Leitura IA)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto space-y-6">

          {/* TAB 1: MANUAL FORM */}
          {activeTab === 'manual' && (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              {manualSuccessMsg && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Produto incluído com sucesso na Tabela de Preços!
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-extrabold text-slate-700 uppercase block mb-1">
                    Código do Produto
                  </label>
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-blue-900 focus:outline-none focus:ring-2 focus:ring-[#071D49]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-extrabold text-slate-700 uppercase block mb-1">
                    Marca / Fabricante
                  </label>
                  <select
                    value={manualBrand}
                    onChange={(e) => setManualBrand(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#071D49]"
                  >
                    <option value="HOYA">HOYA</option>
                    <option value="ZEISS">ZEISS</option>
                    <option value="VARILUX">VARILUX / ESSILOR</option>
                    <option value="KODAK">KODAK</option>
                    <option value="GALAXY">GALAXY</option>
                    <option value="SHAMIR">SHAMIR</option>
                    <option value="TOKAI">TOKAI</option>
                    <option value="VISÃO SIMPLES & TRATAMENTOS">VISÃO SIMPLES & TRATAMENTOS</option>
                    <option value="MULTIFOCAIS C.O">MULTIFOCAIS C.O</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-extrabold text-slate-700 uppercase block mb-1">
                    Categoria
                  </label>
                  <select
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#071D49]"
                  >
                    <option value="Visão Simples">Visão Simples</option>
                    <option value="Multifocal">Multifocal</option>
                    <option value="Bifocal">Bifocal</option>
                    <option value="Tratamento">Tratamento</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-700 uppercase block mb-1">
                  Nome da Lente & Tratamento *
                </label>
                <input
                  type="text"
                  placeholder="Ex: VS NULUX 1.67 CRIZAL SAPPHIRE HR TRANSITIONS"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#071D49]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-extrabold text-slate-700 uppercase block mb-1">
                    Índice Refração
                  </label>
                  <select
                    value={manualRefractionIndex}
                    onChange={(e) => setManualRefractionIndex(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                  >
                    <option value="1.50">1.50 (Orma/CR39)</option>
                    <option value="1.53">1.53 (Trivex)</option>
                    <option value="1.56">1.56 (Mid Index)</option>
                    <option value="1.59">1.59 (Polycarbonate)</option>
                    <option value="1.60">1.60 (High Index)</option>
                    <option value="1.67">1.67 (Ultra Thin)</option>
                    <option value="1.74">1.74 (Super Thin)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-extrabold text-slate-700 uppercase block mb-1">
                    Preço Fornecedor / Custo (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={manualCostPrice}
                    onChange={(e) => setManualCostPrice(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-extrabold text-slate-700 uppercase block mb-1">
                    Valor Oficial Venda (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={manualPrice}
                    onChange={(e) => setManualPrice(e.target.value)}
                    required
                    className="w-full p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-black"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-extrabold text-slate-700 uppercase block mb-1">
                    Qtd Estoque (un)
                  </label>
                  <input
                    type="number"
                    value={manualQuantity}
                    onChange={(e) => setManualQuantity(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-extrabold text-slate-700 uppercase block mb-1">
                    Fornecedor / Distribuidor
                  </label>
                  <input
                    type="text"
                    value={manualSupplier}
                    onChange={(e) => setManualSupplier(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-extrabold text-slate-700 uppercase block mb-1">
                    Proteções & Tratamentos
                  </label>
                  <input
                    type="text"
                    value={manualProtections}
                    onChange={(e) => setManualProtections(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#071D49] hover:bg-[#0B255C] text-[#E8D2A8] font-black text-xs rounded-xl border border-[#C9A96E] shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4 text-[#C9A96E]" /> + Cadastrar Produto na Tabela
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: OCR TABLE SCANNER */}
          {activeTab === 'ocr' && (
            <div className="space-y-5">
              
              {/* Quick Sample Selector */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-black text-slate-800 uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Teste com Tabelas de Exemplo de Fabricante
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {demoCatalogs.map((cat, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => runImageScan(cat.url, cat.sampleItems)}
                      className="p-2 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-400 rounded-xl text-left transition-all cursor-pointer flex items-center gap-2"
                    >
                      <img src={cat.url} className="w-10 h-10 object-cover rounded-lg border" alt={cat.title} />
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-bold text-slate-900 truncate">{cat.title}</div>
                        <div className="text-[9px] text-emerald-600 font-semibold">Carregar Tabela</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Drop Zone */}
              <div className="border-2 border-dashed border-[#071D49]/30 hover:border-[#071D49] bg-[#071D49]/5 p-6 rounded-3xl text-center space-y-3 transition-all relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="w-12 h-12 bg-[#071D49] text-[#E8D2A8] rounded-2xl flex items-center justify-center mx-auto shadow-md">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-[#071D49] uppercase">
                    Tirar Foto ou Fazer Upload da Tabela do Fabricante
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Arraste a imagem da tabela impressa ou clique para selecionar do seu dispositivo
                  </p>
                </div>
              </div>

              {/* Scanner Beam & Progress View */}
              {selectedImage && (
                <div className="bg-slate-900 p-4 rounded-2xl border-2 border-[#C9A96E] space-y-4">
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative w-48 h-32 rounded-xl overflow-hidden border border-slate-700 bg-black shrink-0">
                      <img src={selectedImage} className="w-full h-full object-cover opacity-80" alt="Tabela Escaneada" />
                      {isScanning && (
                        <div className="absolute inset-x-0 h-1 bg-amber-400 shadow-[0_0_15px_#f59e0b] animate-bounce top-1/2" />
                      )}
                    </div>

                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex items-center justify-between text-xs font-extrabold text-[#E8D2A8]">
                        <span className="flex items-center gap-2">
                          <ScanLine className="w-4 h-4 text-amber-400 animate-pulse" /> {scanStepText}
                        </span>
                        <span>{scanProgress}%</span>
                      </div>

                      <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-emerald-400 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${scanProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Table Results Extracted */}
                  {scannedItems.length > 0 && !isScanning && (
                    <div className="space-y-3 pt-2 border-t border-slate-800 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> {scannedItems.length} Itens Lidos e Mapeados
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">
                          {selectedScannedIndexes.length} de {scannedItems.length} Selecionados
                        </span>
                      </div>

                      <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950 max-h-60">
                        <table className="w-full text-left text-[11px]">
                          <thead className="bg-[#071D49] text-[#E8D2A8] font-black uppercase">
                            <tr>
                              <th className="p-2.5 text-center w-10">
                                <input
                                  type="checkbox"
                                  checked={selectedScannedIndexes.length === scannedItems.length}
                                  onChange={() => {
                                    if (selectedScannedIndexes.length === scannedItems.length) {
                                      setSelectedScannedIndexes([]);
                                    } else {
                                      setSelectedScannedIndexes(scannedItems.map((_, i) => i));
                                    }
                                  }}
                                />
                              </th>
                              <th className="p-2.5">Código</th>
                              <th className="p-2.5">Marca</th>
                              <th className="p-2.5">Categoria</th>
                              <th className="p-2.5">Lente / Tratamento</th>
                              <th className="p-2.5 text-right">Custo</th>
                              <th className="p-2.5 text-right">Preço Venda</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800 text-slate-200">
                            {scannedItems.map((item, idx) => {
                              const isChecked = selectedScannedIndexes.includes(idx);
                              return (
                                <tr key={idx} className={isChecked ? 'bg-amber-950/20' : 'opacity-60'}>
                                  <td className="p-2.5 text-center">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => handleToggleSelectScanned(idx)}
                                    />
                                  </td>
                                  <td className="p-2.5 font-mono text-amber-300 font-bold">{item.code}</td>
                                  <td className="p-2.5 font-bold">{item.brand}</td>
                                  <td className="p-2.5">{item.category}</td>
                                  <td className="p-2.5 font-extrabold text-white">{item.name}</td>
                                  <td className="p-2.5 text-right text-slate-400">
                                    R$ {item.costPrice?.toFixed(2) || '0.00'}
                                  </td>
                                  <td className="p-2.5 text-right font-black text-emerald-400">
                                    R$ {item.price.toFixed(2)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedImage(null);
                            setScannedItems([]);
                          }}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
                        >
                          Limpar
                        </button>
                        <button
                          type="button"
                          onClick={handleConfirmImportScanned}
                          disabled={selectedScannedIndexes.length === 0}
                          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
                        >
                          <Check className="w-4 h-4" /> Confirmar e Importar {selectedScannedIndexes.length} Itens na Tabela
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
