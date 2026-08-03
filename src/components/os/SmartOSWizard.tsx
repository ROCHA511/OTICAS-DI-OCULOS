import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Search,
  UserPlus,
  CheckCircle2,
  Camera,
  Glasses,
  Eye,
  Calculator,
  FileText,
  DollarSign,
  Lock,
  Unlock,
  Printer,
  QrCode,
  Sparkles,
  ShieldAlert,
  Info,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Home,
  UserCheck,
  Zap,
  Image as ImageIcon,
  Check,
  RefreshCw,
  Layers,
  Scale,
  Ruler,
  Sliders,
  Scissors
} from 'lucide-react';
import { Client, Frame, Lens, ServiceOrder, OpticalPrescription, DnpMeasurement, LensType } from '../../types';
import { OticasLogo } from '../brand/OticasLogo';
import { ServiceOrderDocument } from './ServiceOrderDocument';
import FaceMeshOverlay from '../biometria/FaceMeshOverlay';
import { calcularGeometriaOptica, estimarEspessuraLente, validarCompatibilidadePreditiva } from '../../utils/CalculadoraOptica';
import { OFFICIAL_PRICE_TABLE } from '../../data/priceTableData';

interface SmartOSWizardProps {
  clients: Client[];
  frames: Frame[];
  lenses: Lens[];
  serviceOrders: ServiceOrder[];
  onSaveOS: (newOS: ServiceOrder) => void;
  onClose: () => void;
  onAddClient?: (client: Client) => void;
}

export const SmartOSWizard: React.FC<SmartOSWizardProps> = ({
  clients,
  frames,
  lenses,
  serviceOrders,
  onSaveOS,
  onClose,
  onAddClient,
}) => {
  const [currentStage, setCurrentStage] = useState<number>(1);

  // Stage 1: Client Search & Selection
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(clients[0] || null);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientCpf, setNewClientCpf] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');

  // Stage 2: Frame Selection
  const [selectedFrame, setSelectedFrame] = useState<Frame>(frames[0] || {
    id: 'f_default',
    brand: 'DI Óticas Design',
    model: 'Titanium Flex Pro',
    code: 'ARM-2026-01',
    color: 'Preto Fosco / Dourado',
    material: 'Titânio Ultra Leve',
    eyeSize: 52,
    bridge: 18,
    temple: 140,
    price: 390.00,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
    stock: 8,
  });

  // Extended frame measurements for optical calculations
  const frameED = 55; // Diâmetro Efetivo (mm)
  const frameDiagonal = 56; // Diagonal Maior (mm)

  // Stage 3: Lens Selection
  const [selectedLens, setSelectedLens] = useState<Lens>(lenses[0] || {
    id: 'l_default',
    brand: 'Varilux',
    name: 'Physio 3.0 Digital Orma 1.67 Crizal Sapphire',
    type: 'multifocal_digital',
    indexRefraction: 1.67,
    price: 1890.00,
    description: 'Lente multifocal digital com campo de visão estendido e antirreflexo contra reflexos de LED/sol.',
    idealForRange: 'Presbiopia e Graus Moderados a Altos',
  });

  // Lentes oficiais mapeadas da tabela de preços
  const officialLenses: Lens[] = React.useMemo(() => {
    return OFFICIAL_PRICE_TABLE.map((item, index) => {
      let type: LensType = 'visao_simples';
      const categoryLower = item.category.toLowerCase();
      const nameLower = item.name.toLowerCase();

      if (categoryLower.includes('visao simples') || categoryLower.includes('visão simples')) {
        type = 'visao_simples';
      } else if (categoryLower.includes('multifocal')) {
        type = 'multifocal_digital';
      } else if (categoryLower.includes('bifocal')) {
        type = 'bifocal';
      }

      if (nameLower.includes('sensity') || nameLower.includes('photofusion') || nameLower.includes('transitions') || nameLower.includes('foto')) {
        type = 'fotocromatica';
      } else if (nameLower.includes('bluecontrol') || nameLower.includes('blue') || nameLower.includes('crizal') || nameLower.includes('antirreflexo')) {
        type = 'antirreflexo_blue';
      }

      let indexRefraction = 1.5;
      const refMatch = nameLower.match(/1\.\d+/);
      if (refMatch) {
        indexRefraction = parseFloat(refMatch[0]);
      } else if (item.refractionIndex) {
        indexRefraction = parseFloat(item.refractionIndex);
      }

      return {
        id: `lens_price_${item.code}_${index}`,
        brand: item.brand,
        name: item.name,
        type: type,
        indexRefraction: indexRefraction,
        price: item.price,
        description: `Lente ${item.category} ${item.brand} de alta precisão óptica digital com tratamentos especiais.`,
        idealForRange: item.protections || 'Graus esféricos e cilíndricos variados',
        fabricante: item.brand,
        garantiaMeses: 24,
        tratamentos: item.protections ? item.protections.split(',') : ['Antirreflexo', 'Proteção UV']
      };
    });
  }, []);

  // Filtros do Catálogo de Lentes (Etapa 3)
  const [lensSearchTerm, setLensSearchTerm] = useState('');
  const [lensFilterBrand, setLensFilterBrand] = useState('todos');
  const [lensFilterCategory, setLensFilterCategory] = useState('todos');

  // Consulta de Ordens de Serviço (Etapa 3)
  const [osSearchTerm, setOsSearchTerm] = useState('');
  const [selectedOldOS, setSelectedOldOS] = useState<ServiceOrder | null>(null);

  const handleImportOSData = (oldOS: ServiceOrder) => {
    const clientMatch = clients.find(c => c.id === oldOS.clientId || c.name.toLowerCase() === oldOS.clientName.toLowerCase());
    if (clientMatch) {
      setSelectedClient(clientMatch);
    }
    if (oldOS.frame) {
      setSelectedFrame(oldOS.frame);
    }
    if (oldOS.lens) {
      const matchInOfficial = officialLenses.find(l => l.name === oldOS.lens.name) || oldOS.lens;
      setSelectedLens(matchInOfficial);
    }
    if (oldOS.dnp) {
      setBiometrics({
        dnpOD: oldOS.dnp.dnpOD || 32.0,
        dnpOE: oldOS.dnp.dnpOE || 32.0,
        dpTotal: oldOS.dnp.dpTotal || 64.0,
        alturaOD: oldOS.dnp.alturaCentroOD || 29.0,
        alturaOE: oldOS.dnp.alturaCentroOE || 29.0,
        centroHorizOD: oldOS.dnp.dnpOD || 32.0,
        centroHorizOE: oldOS.dnp.dnpOE || 32.0,
        centroVertOD: oldOS.dnp.alturaCentroOD || 29.0,
        centroVertOE: oldOS.dnp.alturaCentroOE || 29.0,
        distanciaVertice: 12.5,
        faceForm: 5.0,
        anguloPantoscopico: 8.0,
        assimetriaFacial: 0.4,
        inclinacaoCabeca: 1.2,
        confidenceScore: 99.8
      });
    }
    if (oldOS.prescription) {
      setPrescription(oldOS.prescription);
    }
    alert(`Dados da OS ${oldOS.osNumber} do paciente ${oldOS.clientName} importados com sucesso!`);
    setSelectedOldOS(null);
  };

  // Stage 4: Biometric AI Camera Capture
  const [isCapturingCam, setIsCapturingCam] = useState(false);
  const [showRealCamera, setShowRealCamera] = useState(false);
  const [camDistance, setCamDistance] = useState<number>(100); // 100 cm target
  const [capturedFrontPhoto, setCapturedFrontPhoto] = useState<string | null>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
  );
  const [capturedRightPhoto, setCapturedRightPhoto] = useState<string | null>(
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80'
  );
  const [capturedLeftPhoto, setCapturedLeftPhoto] = useState<string | null>(
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80'
  );
  const [isAiMeasuring, setIsAiMeasuring] = useState(false);
  const [camValidated, setCamValidated] = useState({
    iluminacao: true,
    enquadramento: true,
    foco: true,
    posicaoCabeca: true,
  });

  // Stage 5: Calculated Biometrics
  const [biometrics, setBiometrics] = useState({
    dnpOD: 32.0,
    dnpOE: 32.0,
    dpTotal: 64.0,
    alturaOD: 29.0,
    alturaOE: 29.0,
    centroHorizOD: 32.0,
    centroHorizOE: 32.0,
    centroVertOD: 29.0,
    centroVertOE: 29.0,
    distanciaVertice: 12.5, // mm
    faceForm: 5.0, // graus
    anguloPantoscopico: 8.0, // graus
    assimetriaFacial: 0.4, // mm
    inclinacaoCabeca: 1.2, // graus
    confidenceScore: 99.8,
  });

  // Stage 7: Prescription
  const [prescription, setPrescription] = useState<OpticalPrescription>({
    od: { esferico: -2.50, cilindrico: -0.75, eixo: 90 },
    oe: { esferico: -2.75, cilindrico: -0.50, eixo: 85 },
    adicao: 2.00,
    medicoName: 'Dr. Lauro / Dr. Roberto Silveira',
    crm: 'CRM-BA 48291',
    dataExame: '2026-07-15',
  });

  // Stage 10: Financial & Payment
  const [discountValue, setDiscountValue] = useState<number>(150.00);
  const [advancePayment, setAdvancePayment] = useState<number>(500.00);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao_credito' | 'dinheiro'>('pix');
  const [installments, setInstallments] = useState<number>(3);
  const [isPaid, setIsPaid] = useState<boolean>(false);

  // OS Identification Number - Sequencial iniciando de 1
  const nextOSInt = React.useMemo(() => {
    if (!serviceOrders || serviceOrders.length === 0) return 1;
    const numbers = serviceOrders.map(os => {
      const match = os.osNumber.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    });
    const maxNum = Math.max(...numbers, 0);
    return maxNum > 0 ? maxNum + 1 : serviceOrders.length + 1;
  }, [serviceOrders]);

  const [osNumber, setOsNumber] = useState(`OS-${nextOSInt}`);

  useEffect(() => {
    setOsNumber(`OS-${nextOSInt}`);
  }, [nextOSInt]);

  // ESC Key listener to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Client filtering
  const filteredClients = clients.filter((c) => {
    const q = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.cpf && c.cpf.includes(q)) ||
      c.phone.includes(q) ||
      c.id.toLowerCase().includes(q)
    );
  });

  // Frame compatibility & Optical Math (Consuming CalculadoraOptica)
  const paramArmacao = {
    aroHorizontalA: selectedFrame.eyeSize,
    aroVerticalB: selectedFrame.eyeSize - 10,
    ponteDbl: selectedFrame.bridge,
    ed: frameED
  };
  const paramReceita = {
    dnpOD: biometrics.dnpOD,
    dnpOE: biometrics.dnpOE,
    alturaOD: biometrics.alturaOD,
    alturaOE: biometrics.alturaOE
  };

  const calculosOpticos = calcularGeometriaOptica(paramArmacao, paramReceita);
  const espessurasFisicas = estimarEspessuraLente(
    prescription.od.esferico,
    prescription.od.cilindrico || 0,
    paramArmacao,
    paramReceita,
    selectedLens.indexRefraction || 1.5
  );

  const compatibilidadePreditiva = validarCompatibilidadePreditiva(
    prescription.od.esferico,
    prescription.od.cilindrico || 0,
    paramArmacao,
    paramReceita,
    selectedLens.indexRefraction || 1.5
  );

  const dbc = calculosOpticos.dbc;
  const centroGeometrico = calculosOpticos.centroGeometrico;
  const descentracaoOD = calculosOpticos.descentracaoOD;
  const descentracaoOE = calculosOpticos.descentracaoOE;
  const descentracaoTotal = calculosOpticos.descentracaoTotal;
  const diametroMinimoLente = calculosOpticos.diametroMinimoLente;
  const espessuraEstimada = `OD: ${espessurasFisicas.espessuraBordaOD}mm (Borda) / OE: ${espessurasFisicas.espessuraBordaOE}mm (Borda)`;
  const pesoEstimado = espessurasFisicas.pesoEstimadoGramas;

  // Price totals
  const framePrice = selectedFrame.price;
  const lensPrice = selectedLens.price;
  const subtotal = framePrice + lensPrice;
  const totalValue = Math.max(0, subtotal - discountValue);
  const aReceber = Math.max(0, totalValue - advancePayment);

  // Handle Client creation
  const handleCreateClient = () => {
    if (!newClientName) return;
    const newCode = `CLI-0000000${clients.length + 1}`;
    const newC: Client = {
      id: newCode,
      name: newClientName,
      cpf: newClientCpf || '000.000.000-00',
      phone: newClientPhone || '(73) 99999-0000',
      status: 'active',
      isAiHandled: false,
      lastInteraction: 'Agora',
      unreadCount: 0,
      tags: ['Novo Cliente OS'],
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    };
    if (onAddClient) onAddClient(newC);
    setSelectedClient(newC);
    setShowNewClientForm(false);
  };

  // Trigger Real Camera Biometric Scanning
  const handleStartAiScan = () => {
    setShowRealCamera(true);
  };

  const handleCaptureComplete = (medidas: any) => {
    setBiometrics({
      dnpOD: medidas.dnpOD,
      dnpOE: medidas.dnpOE,
      dpTotal: medidas.dpTotal,
      alturaOD: medidas.alturaOD,
      alturaOE: medidas.alturaOE,
      centroHorizOD: medidas.dnpOD,
      centroHorizOE: medidas.dnpOE,
      centroVertOD: medidas.alturaOD,
      centroVertOE: medidas.alturaOE,
      distanciaVertice: medidas.distanciaVertice,
      faceForm: medidas.faceForm,
      anguloPantoscopico: medidas.anguloPantoscopico,
      assimetriaFacial: medidas.assimetriaFacial,
      inclinacaoCabeca: medidas.inclinacaoCabeca,
      confidenceScore: medidas.indiceConfianca,
    });
    setIsCapturingCam(true);
    setShowRealCamera(false);
  };

  // Save Final OS
  const handleFinalizeOS = (forcePaid = false) => {
    const finalPaidStatus = forcePaid || isPaid;
    const osStatus = finalPaidStatus ? 'pago' : 'aguardando_pagamento';

    const newOS: ServiceOrder = {
      id: `os_${Date.now()}`,
      osNumber,
      clientId: selectedClient?.id || 'c1',
      clientName: selectedClient?.name || 'Cliente Sem Nome',
      clientCPF: selectedClient?.cpf || '000.000.000-00',
      clientPhone: selectedClient?.phone || '(73) 99999-0000',
      vendedor: 'John Rocha',
      cnpj: '12.348.411/0001-51',
      lojaEndereco: 'Rua 23 de Abril, 51, Otica DI Oculos, Centro',
      lojaTelefone: '(73) 3256-1599',
      dataEntrada: new Date().toLocaleDateString('pt-BR'),
      prevEntrega: new Date(Date.now() + 15 * 86400000).toLocaleDateString('pt-BR'),
      tipoOS: 'Otica',
      subtotal,
      discount: discountValue,
      totalValue,
      adiantamento: advancePayment,
      aReceber,
      medicoName: prescription.medicoName,
      possuiReceita: true,
      armacaoPropria: false,
      armacaoSegue: false,
      distPupilar: biometrics.dpTotal,
      prescription,
      dnp: {
        dnpOD: biometrics.dnpOD,
        dnpOE: biometrics.dnpOE,
        dpTotal: biometrics.dpTotal,
        alturaCentroOD: biometrics.alturaOD,
        alturaCentroOE: biometrics.alturaOE,
        cardDetected: true,
        confidenceScore: biometrics.confidenceScore,
        measuredAt: new Date().toISOString(),
      },
      frame: selectedFrame,
      lens: selectedLens,
      framePrice,
      lensPrice,
      status: osStatus,
      paymentMethod,
      pixCode: '00020126580014BR.GOV.BCB.PIX0136342189002885204000053039865406800.005802BR5917OTICA DI OCULOS',
      nfceNumber: `NFC-e ${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      labEstimatedCompletion: new Date(Date.now() + 15 * 86400000).toLocaleDateString('pt-BR'),
      ceoNotified: true,
      ceoApprovalNeeded: false,
      ceoApproved: true,
      itemsList: [
        {
          ref: `ARMACAO - ${selectedFrame.brand} ${selectedFrame.model}`,
          qtde: 1,
          valUnit: framePrice,
          acrescimo: 0,
          desconto: Math.round(discountValue * 0.2),
          total: framePrice - Math.round(discountValue * 0.2),
        },
        {
          ref: `${selectedLens.brand} ${selectedLens.name}`,
          qtde: 1,
          valUnit: lensPrice,
          acrescimo: 0,
          desconto: Math.round(discountValue * 0.8),
          total: lensPrice - Math.round(discountValue * 0.8),
        },
      ],
      adiantamentoHistory: [
        {
          data: new Date().toLocaleDateString('pt-BR'),
          formaPagamento: paymentMethod.toUpperCase(),
          valor: advancePayment,
          responsavel: 'Oticas DI Oculos',
        },
      ],
    };

    onSaveOS(newOS);
  };

  const stages = [
    { num: 1, name: 'Cliente', icon: UserCheck },
    { num: 2, name: 'Armação', icon: Glasses },
    { num: 3, name: 'Lentes', icon: Eye },
    { num: 4, name: 'Medição IA', icon: Camera },
    { num: 5, name: 'Cálculos, Receita & Anexos', icon: Calculator },
    { num: 6, name: 'Geração OS', icon: QrCode },
    { num: 7, name: 'Orçamento', icon: DollarSign },
    { num: 8, name: 'PDF Técnico', icon: Printer },
    { num: 9, name: 'Produção', icon: Lock },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#071D49]/95 backdrop-blur-md flex flex-col overflow-hidden text-slate-100 font-sans">
      {/* Top Title Bar */}
      <div className="bg-[#071D49] border-b-2 border-[#C9A96E] px-3 sm:px-4 py-2.5 flex items-center justify-between shadow-xl shrink-0 gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 border border-rose-400/30"
            title="Voltar ao Sistema / Fechar Tela"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">← VOLTAR AO SISTEMA</span>
            <span className="sm:hidden">VOLTAR</span>
          </button>

          <button
            onClick={onClose}
            className="bg-white p-1 rounded-xl shadow-md hidden md:block cursor-pointer hover:scale-105 active:scale-95 transition-all"
            title="Voltar para a Página Inicial do Sistema"
          >
            <OticasLogo size="sm" variant="dark-text" />
          </button>

          <div
            onClick={onClose}
            className="cursor-pointer group"
            title="Voltar para a Página Inicial do Sistema"
          >
            <h1 className="text-xs sm:text-base font-black text-[#E8D2A8] group-hover:text-white uppercase tracking-wider flex items-center gap-1.5 transition-colors">
              <Sparkles className="w-4 h-4 text-[#C9A96E]" /> Ordem de Serviço Inteligente
            </h1>
            <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium hidden lg:block group-hover:text-[#E8D2A8] transition-colors">
              Óticas DI Óculos | Medição Facial 3D, Cálculos de Montagem e Lentes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden md:inline-block bg-[#0B255C] border border-[#C9A96E] text-[#C9A96E] text-xs font-mono font-bold px-3 py-1 rounded-full">
            {osNumber}
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl transition-all cursor-pointer shadow-lg flex items-center gap-1.5 active:scale-90 border border-white/20"
            title="Fechar Tela (ou Pressione ESC)"
          >
            <X className="w-4.5 h-4.5" />
            <span className="hidden sm:inline">SAIR (X)</span>
          </button>
        </div>
      </div>

      {/* 12-Stage Stepper Header */}
      <div className="bg-[#0B255C] border-b border-[#C9A96E]/40 px-3 py-2 overflow-x-auto [scrollbar-width:none] shrink-0">
        <div className="flex items-center min-w-max gap-1 sm:gap-2 justify-between">
          {stages.map((st) => {
            const IconComponent = st.icon;
            const isDone = currentStage > st.num;
            const isCurrent = currentStage === st.num;

            return (
              <button
                key={st.num}
                onClick={() => setCurrentStage(st.num)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#C9A96E] text-[#071D49] shadow-lg scale-105 ring-2 ring-white'
                    : isDone
                    ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/50'
                    : 'bg-[#071D49]/60 text-slate-400 border border-slate-700 hover:text-slate-200'
                }`}
              >
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black bg-black/20">
                  {st.num}
                </span>
                <IconComponent className="w-3.5 h-3.5" />
                <span>{st.name}</span>
                {isDone && <Check className="w-3 h-3 text-emerald-300 ml-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950 text-slate-100">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* ====================================================
              ETAPA 01 - IDENTIFICAÇÃO DO CLIENTE
             ==================================================== */}
          {currentStage === 1 && (
            <div className="bg-[#071D49]/80 border-2 border-[#C9A96E]/50 rounded-3xl p-6 space-y-6 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#C9A96E]/30 pb-4">
                <div>
                  <h2 className="text-lg font-black text-[#E8D2A8] uppercase flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-[#C9A96E]" /> Etapa 01 - Identificação Inteligente do Cliente
                  </h2>
                  <p className="text-xs text-slate-300">
                    Pesquise por Nome Completo, CPF, Telefone, Código CLI, QR Code ou Código de Barras.
                  </p>
                </div>
                <button
                  onClick={() => setShowNewClientForm(!showNewClientForm)}
                  className="px-4 py-2 bg-[#C9A96E] hover:bg-[#b8985d] text-[#071D49] font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" /> [ CADASTRAR CLIENTE ]
                </button>
              </div>

              {/* Smart Search Bar */}
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-3.5 text-[#C9A96E]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Pesquisar cliente em tempo real por Nome, CPF, Telefone ou Código CLI..."
                  className="w-full pl-12 pr-4 py-3 bg-[#0B255C] border-2 border-[#C9A96E]/60 rounded-2xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9A96E] text-sm font-medium"
                />
              </div>

              {/* Modal/Form for New Client Registration */}
              {showNewClientForm && (
                <div className="p-4 bg-[#0B255C] border-2 border-[#C9A96E] rounded-2xl space-y-3 animate-fadeIn">
                  <h3 className="text-xs font-bold text-[#E8D2A8] uppercase">Novo Cadastro de Cliente (Código Automático)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Nome Completo *"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      className="p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs"
                    />
                    <input
                      type="text"
                      placeholder="CPF"
                      value={newClientCpf}
                      onChange={(e) => setNewClientCpf(e.target.value)}
                      className="p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Telefone com DDD"
                      value={newClientPhone}
                      onChange={(e) => setNewClientPhone(e.target.value)}
                      className="p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowNewClientForm(false)}
                      className="px-3 py-1.5 bg-slate-700 text-xs rounded-xl"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleCreateClient}
                      className="px-4 py-1.5 bg-emerald-600 font-bold text-white text-xs rounded-xl"
                    >
                      Salvar em clientes.codigo_cliente (CLI-0000000{clients.length + 1})
                    </button>
                  </div>
                </div>
              )}

              {/* Selected Customer Card or Search Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Search Results */}
                <div className="bg-[#0B255C]/60 border border-slate-700 rounded-2xl p-3 space-y-2 max-h-80 overflow-y-auto">
                  <span className="text-xs font-bold text-[#C9A96E] uppercase">Clientes Encontrados ({filteredClients.length})</span>
                  {filteredClients.map((c) => {
                    const isSelected = selectedClient?.id === c.id;
                    return (
                      <div
                        key={c.id}
                        onClick={() => setSelectedClient(c)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#C9A96E] text-[#071D49] border-white font-bold shadow-lg'
                            : 'bg-slate-900/80 border-slate-800 hover:border-[#C9A96E]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img src={c.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'} className="w-10 h-10 rounded-full object-cover border border-slate-500" alt={c.name} />
                          <div>
                            <div className="text-xs font-extrabold">{c.name}</div>
                            <div className="text-[10px] opacity-80">CPF: {c.cpf || 'Não informado'} • Tel: {c.phone}</div>
                            <div className="text-[9px] opacity-70">Código: {c.id}</div>
                          </div>
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-[#071D49]" />}
                      </div>
                    );
                  })}
                </div>

                {/* Selected Customer Complete Biometric & Financial Profile */}
                {selectedClient ? (
                  <div className="bg-slate-900 border-2 border-[#C9A96E] rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                      <img src={selectedClient.avatar} className="w-14 h-14 rounded-2xl object-cover border-2 border-[#C9A96E]" alt={selectedClient.name} />
                      <div>
                        <div className="text-sm font-black text-[#E8D2A8]">{selectedClient.name}</div>
                        <div className="text-xs text-slate-300">CPF: <strong>{selectedClient.cpf || '123.456.789-01'}</strong> • Tel: {selectedClient.phone}</div>
                        <div className="text-[10px] text-emerald-400 font-mono">Código: {selectedClient.id}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                      <div className="bg-slate-800/60 p-2 rounded-xl">Última Compra: <strong>11/07/2026</strong></div>
                      <div className="bg-slate-800/60 p-2 rounded-xl">Última Receita: <strong>Lauro (-9.50 / -15.00)</strong></div>
                      <div className="bg-slate-800/60 p-2 rounded-xl">Última Armação: <strong>DI Titanium 52mm</strong></div>
                      <div className="bg-slate-800/60 p-2 rounded-xl">Última DNP: <strong>32.0 / 32.0 mm</strong></div>
                      <div className="bg-slate-800/60 p-2 rounded-xl">Última Altura: <strong>29.0 mm</strong></div>
                      <div className="bg-slate-800/60 p-2 rounded-xl">Histórico Financeiro: <strong className="text-emerald-400">Sem Pendências</strong></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center p-8 bg-slate-900 border border-dashed border-slate-700 rounded-2xl text-slate-400 text-xs">
                    Selecione um cliente para prosseguir
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ====================================================
              ETAPA 02 - ESCOLHA DA ARMAÇÃO (CATÁLOGO VISUAL CARDS)
             ==================================================== */}
          {currentStage === 2 && (
            <div className="bg-[#071D49]/80 border-2 border-[#C9A96E]/50 rounded-3xl p-6 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#C9A96E]/30 pb-4">
                <div>
                  <h2 className="text-lg font-black text-[#E8D2A8] uppercase flex items-center gap-2">
                    <Glasses className="w-5 h-5 text-[#C9A96E]" /> Etapa 02 - Catálogo Visual de Armações (Cards Completo)
                  </h2>
                  <p className="text-xs text-slate-300">
                    Selecione a armação ideal com especificações completas (Aro, Ponte, Haste, ED, Diagonal Maior).
                  </p>
                </div>
              </div>

              {/* Grid of Frame Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {frames.map((f) => {
                  const isSelected = selectedFrame.id === f.id;
                  return (
                    <div
                      key={f.id}
                      className={`bg-slate-900 border-2 rounded-2xl p-4 space-y-3 transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#C9A96E] ring-2 ring-[#C9A96E] shadow-xl'
                          : 'border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="space-y-2">
                        {/* Frame Image & Angle Views */}
                        <div className="relative rounded-xl overflow-hidden bg-slate-950 h-36 border border-slate-800">
                          <img src={f.image} className="w-full h-full object-cover" alt={f.model} />
                          <span className="absolute top-2 left-2 bg-[#071D49]/90 text-[#C9A96E] text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-[#C9A96E]">
                            {f.brand}
                          </span>
                          <span className="absolute bottom-2 right-2 bg-emerald-900/90 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            Estoque: {f.stock} un
                          </span>
                        </div>

                        <div>
                          <h3 className="text-sm font-black text-slate-100">{f.model}</h3>
                          <p className="text-[11px] text-slate-400">Código: {f.code} • Cor: {f.color}</p>
                        </div>

                        {/* Geometric Specs Grid */}
                        <div className="grid grid-cols-3 gap-1.5 text-[10px] text-slate-300 bg-slate-800/60 p-2 rounded-xl text-center">
                          <div>Aro: <strong>{f.eyeSize} mm</strong></div>
                          <div>Ponte: <strong>{f.bridge} mm</strong></div>
                          <div>Haste: <strong>{f.temple} mm</strong></div>
                          <div>ED: <strong>55 mm</strong></div>
                          <div>Diag. Maior: <strong>56 mm</strong></div>
                          <div>Mat.: <strong>{f.material.split(' ')[0]}</strong></div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-sm font-black text-[#E8D2A8]">
                          R$ {f.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <button
                          onClick={() => setSelectedFrame(f)}
                          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#C9A96E] text-[#071D49]'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          {isSelected ? '✓ ESCOLHIDO' : '[ ESCOLHER ]'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ====================================================
              ETAPA 03 - ESCOLHA DAS LENTES (CATÁLOGO VISUAL CARDS)
             ==================================================== */}
          {currentStage === 3 && (
            <div className="bg-[#071D49]/80 border-2 border-[#C9A96E]/50 rounded-3xl p-6 space-y-6 shadow-2xl">
              {/* Cabeçalho */}
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#C9A96E]/30 pb-4 gap-4">
                <div>
                  <h2 className="text-lg font-black text-[#E8D2A8] uppercase flex items-center gap-2">
                    <Eye className="w-5 h-5 text-[#C9A96E]" /> Etapa 03 - Catálogo de Lentes Inteligente (Tabela Completa de Preços)
                  </h2>
                  <p className="text-xs text-slate-300">
                    Todas as marcas e lentes cadastradas na tabela oficial do laboratório. Filtre ou consulte uma OS anterior para importar.
                  </p>
                </div>
              </div>

              {/* Seção 1: Filtros de Lente & Consulta de OS Anterior */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0B255C]/40 p-5 rounded-2xl border border-[#C9A96E]/20">
                {/* Lado Esquerdo: Filtros e Pesquisa de Lentes (8 Colunas) */}
                <div className="lg:col-span-8 space-y-4">
                  <h3 className="text-xs font-black text-[#C9A96E] uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-4 h-4" /> Filtros e Busca de Lentes
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Input de Busca */}
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={lensSearchTerm}
                        onChange={(e) => setLensSearchTerm(e.target.value)}
                        placeholder="Buscar lente ou fabricante..."
                        className="w-full bg-slate-950 border border-[#C9A96E]/30 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C9A96E]"
                      />
                    </div>

                    {/* Filtro Fabricante */}
                    <div>
                      <select
                        value={lensFilterBrand}
                        onChange={(e) => setLensFilterBrand(e.target.value)}
                        className="w-full bg-slate-950 border border-[#C9A96E]/30 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#C9A96E]"
                      >
                        <option value="todos">Todos os Fabricantes</option>
                        <option value="ZEISS">Zeiss</option>
                        <option value="HOYA">Hoya</option>
                        <option value="VARILUX">Varilux</option>
                        <option value="KODAK">Kodak</option>
                        <option value="GALAXY">Galaxy</option>
                        <option value="MULTIFOCAIS C.O">Multifocais C.O</option>
                        <option value="VISÃO SIMPLES & TRATAMENTOS">Visão Simples & Tratamentos</option>
                      </select>
                    </div>

                    {/* Filtro Categoria */}
                    <div>
                      <select
                        value={lensFilterCategory}
                        onChange={(e) => setLensFilterCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-[#C9A96E]/30 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#C9A96E]"
                      >
                        <option value="todos">Todas as Categorias</option>
                        <option value="visao_simples">Visão Simples</option>
                        <option value="multifocal_digital">Multifocal Digital</option>
                        <option value="bifocal">Bifocal</option>
                        <option value="fotocromatica">Fotocromática (Transitions/PhotoFusion)</option>
                        <option value="antirreflexo_blue">Antirreflexo Blue Control</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Lado Direito: Consulta de OS Anterior por Nome ou Nº (4 Colunas) */}
                <div className="lg:col-span-4 space-y-4 border-t lg:border-t-0 lg:border-l border-[#C9A96E]/20 pt-4 lg:pt-0 lg:pl-6">
                  <h3 className="text-xs font-black text-[#C9A96E] uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4" /> Consultar OS Anterior
                  </h3>

                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={osSearchTerm}
                      onChange={(e) => setOsSearchTerm(e.target.value)}
                      placeholder="Nome do paciente ou Nº da OS..."
                      className="w-full bg-slate-950 border border-[#C9A96E]/30 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C9A96E]"
                    />
                  </div>

                  {/* Resultados da Busca de OS */}
                  {osSearchTerm.trim() && (
                    <div className="absolute z-[100] mt-1 bg-slate-950 border border-[#C9A96E]/40 rounded-xl max-h-48 overflow-y-auto w-[calc(100%-2rem)] max-w-sm shadow-2xl p-2 space-y-1">
                      <div className="text-[10px] text-slate-400 font-bold px-2 py-1">
                        Resultados encontrados: {serviceOrders.filter(os => 
                          os.clientName.toLowerCase().includes(osSearchTerm.toLowerCase()) || 
                          os.osNumber.toLowerCase().includes(osSearchTerm.toLowerCase()) ||
                          os.osNumber.replace('OS-', '').includes(osSearchTerm.toLowerCase())
                        ).length}
                      </div>
                      
                      {serviceOrders
                        .filter(os => 
                          os.clientName.toLowerCase().includes(osSearchTerm.toLowerCase()) || 
                          os.osNumber.toLowerCase().includes(osSearchTerm.toLowerCase()) ||
                          os.osNumber.replace('OS-', '').includes(osSearchTerm.toLowerCase())
                        )
                        .map(os => (
                          <button
                            key={os.id}
                            onClick={() => setSelectedOldOS(os)}
                            className="w-full text-left bg-slate-900/60 hover:bg-[#0B255C] border border-slate-800 hover:border-[#C9A96E]/50 rounded-lg p-2 transition-all flex flex-col gap-1 cursor-pointer text-xs"
                          >
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="text-[#C9A96E] font-black">{os.osNumber}</span>
                              <span className="text-slate-400">{os.status.replace('_', ' ').toUpperCase()}</span>
                            </div>
                            <div className="font-bold text-white truncate">{os.clientName}</div>
                            <div className="text-[9px] text-slate-400 truncate">{os.lens?.name || 'Sem lente vinculada'}</div>
                          </button>
                        ))
                      }
                      
                      {serviceOrders.filter(os => 
                        os.clientName.toLowerCase().includes(osSearchTerm.toLowerCase()) || 
                        os.osNumber.toLowerCase().includes(osSearchTerm.toLowerCase()) ||
                        os.osNumber.replace('OS-', '').includes(osSearchTerm.toLowerCase())
                      ).length === 0 && (
                        <div className="text-xs text-slate-500 text-center py-4">Nenhuma OS encontrada.</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Detalhes da OS selecionada para importação (se houver) */}
              {selectedOldOS && (
                <div className="bg-[#0B255C]/90 border border-[#C9A96E] rounded-2xl p-5 space-y-4 shadow-xl relative animate-zoom-in">
                  <button 
                    onClick={() => setSelectedOldOS(null)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-white hover:bg-white/10 p-1 rounded-full cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2 border-b border-[#C9A96E]/20 pb-2">
                    <Info className="w-5 h-5 text-[#C9A96E]" />
                    <h4 className="text-sm font-black text-[#E8D2A8] uppercase">Visualizar e Copiar Dados da {selectedOldOS.osNumber}</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
                    <div>
                      <p className="text-slate-400 text-[10px] uppercase font-bold">Paciente</p>
                      <p className="font-bold text-white">{selectedOldOS.clientName}</p>
                      <p className="text-[11px]">{selectedOldOS.clientPhone}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] uppercase font-bold">Armação</p>
                      <p className="font-bold text-white">{selectedOldOS.frame?.brand} - {selectedOldOS.frame?.model}</p>
                      <p className="text-[11px]">R$ {selectedOldOS.frame?.price?.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] uppercase font-bold">Lente Selecionada</p>
                      <p className="font-bold text-white">{selectedOldOS.lens?.name}</p>
                      <p className="text-[11px] text-[#C9A96E]">R$ {selectedOldOS.lens?.price?.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => setSelectedOldOS(null)}
                      className="px-4 py-2 border border-[#C9A96E]/30 hover:border-slate-400 text-slate-300 font-bold rounded-xl text-xs transition-all cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleImportOSData(selectedOldOS)}
                      className="px-5 py-2 bg-[#C9A96E] hover:bg-[#E8D2A8] text-[#071D49] font-black rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-lg active:scale-95"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Copiar Todos os Dados para Nova OS</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Catálogo de Cards de Lentes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {officialLenses
                  .filter(l => {
                    const matchesSearch = l.name.toLowerCase().includes(lensSearchTerm.toLowerCase()) || 
                                          l.brand.toLowerCase().includes(lensSearchTerm.toLowerCase());
                    const matchesBrand = lensFilterBrand === 'todos' || l.brand.toLowerCase() === lensFilterBrand.toLowerCase();
                    const matchesCategory = lensFilterCategory === 'todos' || 
                                            (lensFilterCategory === 'visao_simples' && l.type === 'visao_simples') || 
                                            (lensFilterCategory === 'multifocal_digital' && l.type === 'multifocal_digital') ||
                                            (lensFilterCategory === 'bifocal' && l.type === 'bifocal') ||
                                            (lensFilterCategory === 'fotocromatica' && l.type === 'fotocromatica') ||
                                            (lensFilterCategory === 'antirreflexo_blue' && l.type === 'antirreflexo_blue');
                    return matchesSearch && matchesBrand && matchesCategory;
                  })
                  .slice(0, 18) // Exibe os 18 primeiros resultados mais relevantes para melhor performance
                  .map((l) => {
                    const isSelected = selectedLens.name === l.name; // Compara por nome para suportar lentes locais/remotas perfeitamente
                    return (
                      <div
                        key={l.id}
                        className={`bg-slate-900 border-2 rounded-2xl p-4 space-y-3 transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#C9A96E] ring-2 ring-[#C9A96E] shadow-xl'
                            : 'border-slate-800 hover:border-slate-600'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="bg-[#0B255C] text-[#C9A96E] text-[10px] font-black px-2.5 py-1 rounded-lg border border-[#C9A96E]">
                              Fabricante: {l.brand}
                            </span>
                            <span className="bg-slate-800 text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                              Índice {l.indexRefraction}
                            </span>
                          </div>

                          <h3 className="text-sm font-black text-slate-100 min-h-[40px] flex items-center">{l.name}</h3>
                          <p className="text-[11px] text-slate-400 leading-snug">{l.description}</p>

                          <div className="bg-slate-800/60 p-2.5 rounded-xl space-y-1 text-[10px] text-slate-300">
                            <div><strong>Tipo:</strong> {l.type.replace('_', ' ').toUpperCase()}</div>
                            <div><strong>Proteções:</strong> {l.idealForRange || 'Anti-Riscos, Antirreflexo, Proteção UV'}</div>
                            <div><strong>Garantia:</strong> 2 Anos de Fábrica</div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                          <span className="text-sm font-black text-[#E8D2A8]">
                            R$ {l.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                          <button
                            onClick={() => setSelectedLens(l)}
                            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#C9A96E] text-[#071D49]'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                          >
                            {isSelected ? '✓ SELECIONADO' : '[ SELECIONAR LENTE ]'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Caso de catálogo vazio */}
              {officialLenses.filter(l => {
                const matchesSearch = l.name.toLowerCase().includes(lensSearchTerm.toLowerCase()) || 
                                      l.brand.toLowerCase().includes(lensSearchTerm.toLowerCase());
                const matchesBrand = lensFilterBrand === 'todos' || l.brand.toLowerCase() === lensFilterBrand.toLowerCase();
                const matchesCategory = lensFilterCategory === 'todos' || 
                                        (lensFilterCategory === 'visao_simples' && l.type === 'visao_simples') || 
                                        (lensFilterCategory === 'multifocal_digital' && l.type === 'multifocal_digital') ||
                                        (lensFilterCategory === 'bifocal' && l.type === 'bifocal') ||
                                        (lensFilterCategory === 'fotocromatica' && l.type === 'fotocromatica') ||
                                        (lensFilterCategory === 'antirreflexo_blue' && l.type === 'antirreflexo_blue');
                return matchesSearch && matchesBrand && matchesCategory;
              }).length === 0 && (
                <div className="text-slate-400 text-center py-8">Nenhuma lente corresponde aos filtros ativos.</div>
              )}
            </div>
          )}

          {/* ====================================================
              ETAPA 04 - CAPTURA FACIAL INTELIGENTE (IA BIOMETRIA)
             ==================================================== */}
          {currentStage === 4 && (
            <div className="bg-[#071D49]/80 border-2 border-[#C9A96E]/50 rounded-3xl p-6 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#C9A96E]/30 pb-4">
                <div>
                  <h2 className="text-lg font-black text-[#E8D2A8] uppercase flex items-center gap-2">
                    <Camera className="w-5 h-5 text-[#C9A96E]" /> Etapa 04 - Captura Facial Inteligente IA (MediaPipe & Depth Mapping)
                  </h2>
                  <p className="text-xs text-slate-300">
                    Posicione o cliente a 100 cm da câmera para escanear DP, DNP, Alturas e Ângulo Pantoscópico.
                  </p>
                </div>
                <button
                  onClick={handleStartAiScan}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" /> [ INICIAR MEDIÇÃO IA ]
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Camera Viewport Simulation */}
                <div className="lg:col-span-2 bg-slate-950 border-2 border-[#C9A96E] rounded-2xl relative h-80 overflow-hidden flex flex-col items-center justify-center p-4">
                  {/* Face Overlay Frame */}
                  <div className="w-48 h-60 border-2 border-emerald-400/80 rounded-full relative flex items-center justify-center animate-pulse">
                    <div className="w-full h-0.5 bg-emerald-400/50 absolute top-1/2"></div>
                    <div className="h-full w-0.5 bg-emerald-400/50 absolute left-1/2"></div>
                    <span className="text-[10px] font-mono text-emerald-300 bg-black/70 px-2 py-0.5 rounded absolute -top-3">
                      Distância: {camDistance} cm (Ideal: 100cm)
                    </span>
                  </div>

                  {isAiMeasuring && (
                    <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-xs flex flex-col items-center justify-center space-y-3 z-10">
                      <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                      <span className="text-xs font-black text-emerald-300 uppercase tracking-widest">
                        Processando Mapeamento 3D Facial...
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-bold bg-black/70 p-2 rounded-xl text-slate-200">
                    <span>✓ Iluminação OK</span>
                    <span>✓ Enquadramento OK</span>
                    <span>✓ Foco OK</span>
                    <span>✓ Posição da Cabeça OK</span>
                  </div>
                </div>

                {/* Captured Photos Preview */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#E8D2A8] uppercase">Capturas Anexadas</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1 text-center">
                      <img src={capturedFrontPhoto!} className="w-full h-20 object-cover rounded-xl border border-slate-700" alt="Frontal" />
                      <span className="text-[9px] text-slate-400 font-bold">Foto Frontal</span>
                    </div>
                    <div className="space-y-1 text-center">
                      <img src={capturedRightPhoto!} className="w-full h-20 object-cover rounded-xl border border-slate-700" alt="Lat. Direita" />
                      <span className="text-[9px] text-slate-400 font-bold">Lat. Direita</span>
                    </div>
                    <div className="space-y-1 text-center">
                      <img src={capturedLeftPhoto!} className="w-full h-20 object-cover rounded-xl border border-slate-700" alt="Lat. Esquerda" />
                      <span className="text-[9px] text-slate-400 font-bold">Lat. Esquerda</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1 text-[11px] text-slate-300">
                    <div className="text-emerald-400 font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Score de Confiabilidade: {biometrics.confidenceScore}%
                    </div>
                    <div>Medição efetuada com MediaPipe Face Landmarker & Vision Framework.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
                  {/* ====================================================
              NOVA ETAPA 05 - PARÂMETROS CLÍNICOS, RECEITA & MONTAGEM
             ==================================================== */}
          {currentStage === 5 && (
            <div className="bg-[#071D49]/80 border-2 border-[#C9A96E]/50 rounded-3xl p-6 space-y-6 shadow-2xl">
              {/* Cabeçalho */}
              <div className="flex items-center justify-between border-b border-[#C9A96E]/30 pb-4">
                <div>
                  <h2 className="text-lg font-black text-[#E8D2A8] uppercase flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-[#C9A96E]" /> Etapa 05 - Parâmetros Clínicos, Receita & Montagem (Cálculos de IA & Anexos)
                  </h2>
                  <p className="text-xs text-slate-300">
                    Confirme os graus da receita, verifique as descentrações calculadas e os anexos na mesma tela.
                  </p>
                </div>
              </div>

              {/* Grid Principal de Conteúdo */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Coluna Esquerda: Receita + Cálculos e Montagem (8 Colunas) */}
                <div className="xl:col-span-8 space-y-6">
                  {/* Seção A: Digitação da Receita */}
                  <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-md">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                      <FileText className="w-4.5 h-4.5 text-[#C9A96E]" />
                      <span className="text-xs font-black text-[#E8D2A8] uppercase tracking-wider">Receita Médica Optométrica</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Olho Direito */}
                      <div className="space-y-2 md:border-r border-slate-800 pr-0 md:pr-4">
                        <span className="text-[11px] font-black text-slate-300 uppercase">Olho Direito (OD)</span>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-400 block">Esférico</label>
                            <input
                              type="number"
                              step="0.25"
                              value={prescription.od.esferico}
                              onChange={(e) => setPrescription({
                                ...prescription,
                                od: { ...prescription.od, esferico: parseFloat(e.target.value) || 0 }
                              })}
                              className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-center text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block">Cilindrico</label>
                            <input
                              type="number"
                              step="0.25"
                              value={prescription.od.cilindrico}
                              onChange={(e) => setPrescription({
                                ...prescription,
                                od: { ...prescription.od, cilindrico: parseFloat(e.target.value) || 0 }
                              })}
                              className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-center text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block">Eixo (°)</label>
                            <input
                              type="number"
                              value={prescription.od.eixo}
                              onChange={(e) => setPrescription({
                                ...prescription,
                                od: { ...prescription.od, eixo: parseInt(e.target.value) || 0 }
                              })}
                              className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-center text-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Olho Esquerdo */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-black text-slate-300 uppercase">Olho Esquerdo (OE)</span>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-400 block">Esférico</label>
                            <input
                              type="number"
                              step="0.25"
                              value={prescription.oe.esferico}
                              onChange={(e) => setPrescription({
                                ...prescription,
                                oe: { ...prescription.oe, esferico: parseFloat(e.target.value) || 0 }
                              })}
                              className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-center text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block">Cilindrico</label>
                            <input
                              type="number"
                              step="0.25"
                              value={prescription.oe.cilindrico}
                              onChange={(e) => setPrescription({
                                ...prescription,
                                oe: { ...prescription.oe, cilindrico: parseFloat(e.target.value) || 0 }
                              })}
                              className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-center text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block">Eixo (°)</label>
                            <input
                              type="number"
                              value={prescription.oe.eixo}
                              onChange={(e) => setPrescription({
                                ...prescription,
                                oe: { ...prescription.oe, eixo: parseInt(e.target.value) || 0 }
                              })}
                              className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-center text-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-400 block">Adição (Multifocal)</label>
                        <input
                          type="number"
                          step="0.25"
                          value={prescription.adicao || 0}
                          onChange={(e) => setPrescription({
                            ...prescription,
                            adicao: parseFloat(e.target.value) || 0
                          })}
                          className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-emerald-400 text-center"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block">Médico / Optometrista</label>
                        <input
                          type="text"
                          value={prescription.medicoName || ''}
                          onChange={(e) => setPrescription({
                            ...prescription,
                            medicoName: e.target.value
                          })}
                          className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Seção B: Cálculos Biométricos & Parâmetros de Montagem */}
                  <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-md">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                      <Calculator className="w-4.5 h-4.5 text-[#C9A96E]" />
                      <span className="text-xs font-black text-[#E8D2A8] uppercase tracking-wider">Parâmetros Biométricos de IA & Descentração</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-slate-950 border border-slate-800/80 p-2.5 rounded-xl text-center">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">DNP OD</span>
                        <span className="text-sm font-black text-[#E8D2A8]">{biometrics.dnpOD} mm</span>
                      </div>
                      <div className="bg-slate-950 border border-slate-800/80 p-2.5 rounded-xl text-center">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">DNP OE</span>
                        <span className="text-sm font-black text-[#E8D2A8]">{biometrics.dnpOE} mm</span>
                      </div>
                      <div className="bg-slate-950 border border-slate-800/80 p-2.5 rounded-xl text-center">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">DP Total</span>
                        <span className="text-sm font-black text-emerald-400">{biometrics.dpTotal} mm</span>
                      </div>
                      <div className="bg-slate-950 border border-slate-800/80 p-2.5 rounded-xl text-center">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Alturas OD/OE</span>
                        <span className="text-sm font-black text-[#E8D2A8]">{biometrics.alturaOD} / {biometrics.alturaOE} mm</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div className="bg-slate-950 border border-slate-800/60 p-3.5 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-[#C9A96E] uppercase block">DBC & Centro Geométrico</span>
                        <div className="text-xs text-slate-300">DBC: Aro({selectedFrame.eyeSize}) + Ponte({selectedFrame.bridge}) = <strong>{dbc} mm</strong></div>
                        <div className="text-xs text-slate-300">CG: <strong>{centroGeometrico} mm</strong></div>
                      </div>

                      <div className="bg-slate-950 border border-slate-800/60 p-3.5 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-[#C9A96E] uppercase block">Descentração Necessária</span>
                        <div className="text-xs text-slate-300">OD: <strong>{descentracaoOD.toFixed(1)} mm</strong> | OE: <strong>{descentracaoOE.toFixed(1)} mm</strong></div>
                        <div className="text-xs text-emerald-400 font-bold">Total: {descentracaoTotal.toFixed(1)} mm</div>
                      </div>

                      <div className="bg-slate-950 border border-slate-800/60 p-3.5 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-[#C9A96E] uppercase block">Lente & Espessura</span>
                        <div className="text-xs text-slate-300">Diâmetro Mínimo: <strong>{diametroMinimoLente.toFixed(1)} mm</strong></div>
                        <div className="text-xs text-slate-300">Espessura/Peso: <strong>{espessuraEstimada} / {pesoEstimado}g</strong></div>
                      </div>
                    </div>

                    {/* OpticMesh AI Validador */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-[#C9A96E]/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span className="text-[11px] font-bold text-[#E8D2A8] uppercase tracking-wider">Score de Adaptação Preditiva (OpticMesh AI)</span>
                        </div>
                        <span className={`px-2 py-0.5 text-xs font-black rounded-lg ${
                          compatibilidadePreditiva.score >= 80 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                          compatibilidadePreditiva.score >= 60 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40' :
                          'bg-red-500/20 text-red-400 border border-red-500/40'
                        }`}>
                          {compatibilidadePreditiva.score} / 100
                        </span>
                      </div>

                      {compatibilidadePreditiva.riscos.length > 0 && (
                        <div className="text-[11px] text-red-300 space-y-0.5 border-t border-slate-900 pt-2">
                          {compatibilidadePreditiva.riscos.map((r, idx) => (
                            <div key={idx} className="pl-3 relative before:content-['•'] before:absolute before:left-0 text-justify">{r}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Coluna Direita: Fotos e Anexos (4 Colunas) */}
                <div className="xl:col-span-4 space-y-6">
                  <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-md h-full flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-4">
                        <ImageIcon className="w-4.5 h-4.5 text-[#C9A96E]" />
                        <span className="text-xs font-black text-[#E8D2A8] uppercase tracking-wider">Fotos e Documentos Anexados</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-950 border border-slate-800 p-2 rounded-xl text-center space-y-1">
                          <img src={capturedFrontPhoto!} className="w-full h-20 object-cover rounded-lg" alt="Foto Frontal" />
                          <span className="text-[9px] font-bold text-slate-300 block">Foto Frontal</span>
                        </div>
                        <div className="bg-slate-950 border border-slate-800 p-2 rounded-xl text-center space-y-1">
                          <img src={capturedRightPhoto!} className="w-full h-20 object-cover rounded-lg" alt="Foto Lateral D" />
                          <span className="text-[9px] font-bold text-slate-300 block">Foto Lateral D</span>
                        </div>
                        <div className="bg-slate-950 border border-slate-800 p-2 rounded-xl text-center space-y-1">
                          <img src={selectedFrame.image} className="w-full h-20 object-cover rounded-lg" alt="Armação" />
                          <span className="text-[9px] font-bold text-slate-300 block">Foto Armação</span>
                        </div>
                        <div className="bg-slate-950 border border-slate-800 p-2 rounded-xl text-center space-y-1">
                          <img src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500&auto=format&fit=crop&q=80" className="w-full h-20 object-cover rounded-lg" alt="Receita" />
                          <span className="text-[9px] font-bold text-slate-300 block">Foto Receita</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl text-[10px] text-slate-300 space-y-2">
                      <div className="font-bold text-[#E8D2A8] uppercase">Resumo Clínico da OS:</div>
                      <div><strong>Paciente:</strong> {selectedClient?.name || 'Não selecionado'}</div>
                      <div><strong>Armação:</strong> {selectedFrame.brand} ({selectedFrame.model})</div>
                      <div><strong>Lente:</strong> {selectedLens.name}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              NOVA ETAPA 06 - GERAÇÃO AUTOMÁTICA DA OS (3 VIAS OFICIAIS)
             ==================================================== */}
          {currentStage === 6 && (
            <div className="bg-[#071D49]/80 border-2 border-[#C9A96E]/50 rounded-3xl p-6 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#C9A96E]/30 pb-4">
                <div>
                  <h2 className="text-lg font-black text-[#E8D2A8] uppercase flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-[#C9A96E]" /> Etapa 06 - Gerador Oficial de Impressão (Modelo DI Óticas)
                  </h2>
                  <p className="text-xs text-slate-300">
                    Visualização idêntica ao documento impresso oficial de 3 vias (Laboratório, Ótica e Cliente).
                  </p>
                </div>
              </div>

              <div className="max-h-[500px] overflow-y-auto rounded-2xl border border-slate-700 bg-white p-2 text-slate-900">
                <ServiceOrderDocument
                  order={{
                    id: 'temp_os',
                    osNumber,
                    clientId: selectedClient?.id || 'c1',
                    clientName: selectedClient?.name || 'Cliente Exemplo',
                    clientCPF: selectedClient?.cpf || '123.456.789-01',
                    clientPhone: selectedClient?.phone || '(73) 99999-0000',
                    vendedor: 'John Rocha',
                    cnpj: '12.348.411/0001-51',
                    lojaEndereco: 'Rua 23 de Abril, 51, Otica DI Oculos, Centro',
                    dataEntrada: new Date().toLocaleDateString('pt-BR'),
                    prevEntrega: new Date(Date.now() + 15 * 86400000).toLocaleDateString('pt-BR'),
                    tipoOS: 'Otica',
                    subtotal,
                    discount: discountValue,
                    totalValue,
                    adiantamento: advancePayment,
                    aReceber,
                    medicoName: prescription.medicoName,
                    possuiReceita: true,
                    armacaoPropria: false,
                    armacaoSegue: false,
                    distPupilar: biometrics.dpTotal,
                    prescription,
                    dnp: {
                      dnpOD: biometrics.dnpOD,
                      dnpOE: biometrics.dnpOE,
                      dpTotal: biometrics.dpTotal,
                      alturaCentroOD: biometrics.alturaOD,
                      alturaCentroOE: biometrics.alturaOE,
                      cardDetected: true,
                      confidenceScore: biometrics.confidenceScore,
                    },
                    frame: selectedFrame,
                    lens: selectedLens,
                    framePrice,
                    lensPrice,
                    status: isPaid ? 'pago' : 'aguardando_pagamento',
                    createdAt: new Date().toLocaleDateString('pt-BR'),
                    ceoNotified: true,
                    ceoApprovalNeeded: false,
                  }}
                />
              </div>
            </div>
          )}

          {/* ====================================================
              NOVA ETAPA 07 - ORÇAMENTO E CONDIÇÕES DE PAGAMENTO
             ==================================================== */}
          {currentStage === 7 && (
            <div className="bg-[#071D49]/80 border-2 border-[#C9A96E]/50 rounded-3xl p-6 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#C9A96E]/30 pb-4">
                <div>
                  <h2 className="text-lg font-black text-[#E8D2A8] uppercase flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#C9A96E]" /> Etapa 07 - Fechamento do Orçamento e Adiantamento
                  </h2>
                  <p className="text-xs text-slate-300">
                    Defina descontos, entrada/adiantamento e parcelamento.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <span className="text-xs font-black text-[#E8D2A8] uppercase">Resumo de Valores</span>
                  <div className="flex justify-between text-xs py-1 border-b border-slate-800">
                    <span>Armação ({selectedFrame.brand}):</span>
                    <span>R$ {framePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-slate-800">
                    <span>Lente ({selectedLens.brand}):</span>
                    <span>R$ {lensPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-slate-800 font-bold">
                    <span>Subtotal:</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-slate-800 text-emerald-400 font-bold">
                    <span>(-) Desconto Concedido:</span>
                    <input
                      type="number"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                      className="w-24 p-1 bg-slate-950 border border-slate-700 rounded text-right text-xs"
                    />
                  </div>
                  <div className="flex justify-between text-sm py-2 text-[#E8D2A8] font-black">
                    <span>(=) Valor Total da OS:</span>
                    <span>R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <span className="text-xs font-black text-[#E8D2A8] uppercase">Pagamento e Entrada</span>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Entrada / Adiantamento (R$)</label>
                    <input
                      type="number"
                      value={advancePayment}
                      onChange={(e) => setAdvancePayment(parseFloat(e.target.value) || 0)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-bold text-emerald-400 animate-pulse-once"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Forma de Pagamento</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-white"
                    >
                      <option value="pix">Pix (Confirmação Instantânea)</option>
                      <option value="cartao_credito">Cartão de Crédito</option>
                      <option value="dinheiro">Dinheiro no Balcão</option>
                    </select>
                  </div>

                  <div className="pt-2 text-right">
                    <span className="text-xs text-rose-400 font-extrabold block">
                      Saldo a Receber: R$ {aReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              NOVA ETAPA 08 - PDF TÉCNICO COMPLETO
             ==================================================== */}
          {currentStage === 8 && (
            <div className="bg-[#071D49]/80 border-2 border-[#C9A96E]/50 rounded-3xl p-6 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#C9A96E]/30 pb-4">
                <div>
                  <h2 className="text-lg font-black text-[#E8D2A8] uppercase flex items-center gap-2">
                    <Printer className="w-5 h-5 text-[#C9A96E]" /> Etapa 08 - PDF Técnico do Laboratório
                  </h2>
                  <p className="text-xs text-slate-300">
                    Ficha Técnica completa com todas as especificações ópticas pronta para exportação.
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Gerar Impressão / PDF
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl font-mono text-xs text-slate-200 space-y-3">
                <div className="text-center font-bold text-[#E8D2A8] border-b border-slate-800 pb-2 uppercase">
                  *** FICHA TÉCNICA DE LABORATÓRIO INTELIGENTE - DI ÓTICAS ***
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>OS: {osNumber}</div>
                  <div>Cliente: {selectedClient?.name}</div>
                  <div>DP Total: {biometrics.dpTotal} mm</div>
                  <div>DNP OD/OE: {biometrics.dnpOD} / {biometrics.dnpOE} mm</div>
                  <div>Altura OD/OE: {biometrics.alturaOD} / {biometrics.alturaOE} mm</div>
                  <div>Pantoscópico: {biometrics.anguloPantoscopico}°</div>
                  <div>Vértice: {biometrics.distanciaVertice} mm</div>
                  <div>DBC / CG: {dbc} mm / {centroGeometrico} mm</div>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              NOVA ETAPA 09 - BLOQUEIO E LIBERAÇÃO DE PRODUÇÃO
             ==================================================== */}
          {currentStage === 9 && (
            <div className="bg-[#071D49]/80 border-2 border-[#C9A96E]/50 rounded-3xl p-6 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#C9A96E]/30 pb-4">
                <div>
                  <h2 className="text-lg font-black text-[#E8D2A8] uppercase flex items-center gap-2">
                    {isPaid ? <Unlock className="w-5 h-5 text-emerald-400" /> : <Lock className="w-5 h-5 text-rose-500" />}
                    Etapa 09 - Status de Produção & Trava de Segurança
                  </h2>
                  <p className="text-xs text-slate-300">
                    A produção e os arquivos de corte no laboratório somente são liberados após confirmação do pagamento.
                  </p>
                </div>
              </div>

              {isPaid ? (
                <div className="p-6 bg-emerald-950/80 border-2 border-emerald-500 rounded-2xl text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h3 className="text-base font-black text-emerald-200 uppercase">PRODUÇÃO LIBERADA AUTOMATICAMENTE</h3>
                  <p className="text-xs text-emerald-300 max-w-lg mx-auto">
                    Pagamento confirmado! A ordem de serviço {osNumber} foi transmitida diretamente para o laboratório de surfaçagem digital e montagem.
                  </p>
                  <button
                    onClick={() => handleFinalizeOS(true)}
                    className="mt-4 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm rounded-2xl shadow-xl transition-all cursor-pointer"
                  >
                    FINALIZAR E CONCLUIR OS
                  </button>
                </div>
              ) : (
                <div className="p-6 bg-rose-950/80 border-2 border-rose-500 rounded-2xl text-center space-y-3">
                  <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto" />
                  <h3 className="text-base font-black text-rose-200 uppercase">PRODUÇÃO BLOQUEADA (PAGAMENTO PENDENTE)</h3>
                  <p className="text-xs text-rose-300 max-w-lg mx-auto">
                    A receita e os arquivos de laboratório estão bloqueados até o recebimento da entrada ou quitação.
                  </p>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() => handleFinalizeOS(false)}
                      className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl cursor-pointer shadow-md"
                    >
                      Salvar OS como Pendente
                    </button>
                    <button
                      onClick={() => {
                        setIsPaid(true);
                        handleFinalizeOS(true);
                      }}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> [ LIBERAR PRODUÇÃO - CONFIRMAR PAGAMENTO ]
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Bottom Footer Navigation Bar */}
      <div className="bg-[#071D49] border-t border-[#C9A96E]/40 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 border border-rose-300/30"
            title="Sair / Fechar Módulo OS"
          >
            <X className="w-4 h-4" />
            <span>SAIR DA TELA (X)</span>
          </button>

          {currentStage > 1 ? (
            <button
              onClick={() => setCurrentStage(Math.max(1, currentStage - 1))}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer border border-slate-600"
            >
              <ChevronLeft className="w-4 h-4" /> Etapa Anterior
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer border border-slate-600"
              title="Voltar ao Início do Sistema"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar ao Início
            </button>
          )}
        </div>

        <div className="text-xs font-bold text-[#E8D2A8] text-center">
          Etapa {currentStage} de 9 • {stages[currentStage - 1].name}
        </div>

        {currentStage < 9 ? (
          <button
            onClick={() => setCurrentStage(Math.min(9, currentStage + 1))}
            className="px-5 py-2 bg-[#C9A96E] hover:bg-[#b8985d] text-[#071D49] font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
          >
            Avançar Etapa <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => handleFinalizeOS(isPaid)}
            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer"
          >
            Concluir Cadastro OS
          </button>
        )}
      </div>
      
      {showRealCamera && (
        <FaceMeshOverlay
          onCaptureComplete={handleCaptureComplete}
          onClose={() => setShowRealCamera(false)}
        />
      )}
    </div>
  );
};
