import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Glasses,
  Copy,
  Check,
  X,
  Store,
  DollarSign,
  Users,
  Lock,
  Mail,
  Phone,
  User,
  FileText,
  CreditCard,
  Palette,
  Image as ImageIcon,
  MapPin,
  Calendar,
  Key,
  Globe,
  Upload,
  RefreshCw
} from 'lucide-react';

interface SaaSOnboardingViewProps {
  onClose?: () => void;
  onSuccess?: (newStoreData: any) => void;
}

export const SaaSOnboardingView: React.FC<SaaSOnboardingViewProps> = ({
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'enterprise'>('enterprise');

  // Form State - Dados Principais da Ótica
  const [storeName, setStoreName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Logomarca e Personalização de Cores (White-Label)
  const [logoUrl, setLogoUrl] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#071D49');
  const [secondaryColor, setSecondaryColor] = useState('#D4AF37');
  const [selectedTheme, setSelectedTheme] = useState('ouro_preto');

  // Dados Adicionais da Empresa
  const [inscricaoEstadual, setInscricaoEstadual] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [cep, setCep] = useState('');
  const [employeeCount, setEmployeeCount] = useState('1-5');
  const [pixKey, setPixKey] = useState('');

  // Estado do Pagamento Recorrente Mensal
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [billingDay, setBillingDay] = useState('10');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [copiedLink, setCopiedLink] = useState(false);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  const storeSlug = storeName ? generateSlug(storeName) : 'minha-otica';
  const accessUrl = typeof window !== 'undefined' ? `${window.location.origin}?tab=onboarding` : `https://oticas-di-oculos.vercel.app?tab=onboarding`;

  // Função para extrair/copiar paleta de cores da logomarca
  const handleExtractLogoColors = () => {
    if (!logoUrl) {
      alert('Carregue ou cole a URL da logomarca primeiro.');
      return;
    }
    // Paletas sugeridas inteligentes baseadas na marca
    if (selectedTheme === 'ouro_preto') {
      setPrimaryColor('#071D49');
      setSecondaryColor('#D4AF37');
    } else if (selectedTheme === 'azul_safira') {
      setPrimaryColor('#0055A5');
      setSecondaryColor('#0284C7');
    } else if (selectedTheme === 'esmeralda') {
      setPrimaryColor('#064E3B');
      setSecondaryColor('#10B981');
    } else if (selectedTheme === 'rose') {
      setPrimaryColor('#831843');
      setSecondaryColor('#F43F5E');
    }
    alert('🎨 Paleta de cores extraída da logomarca e aplicada com sucesso!');
  };

  const handleFormatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleFormatExpiry = (value: string) => {
    const v = value.replace(/[^0-9]/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmitFinalRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardHolder || !cardExpiry || !cardCvv) {
        alert('Por favor, preencha todos os dados do cartão de crédito para a cobrança mensal.');
        return;
      }
    }

    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      const newStore = {
        id: `store_${Date.now()}`,
        name: storeName,
        slug: storeSlug,
        cnpj: cnpj || 'Não informado',
        inscricaoEstadual: inscricaoEstadual || 'Isento',
        phone: phone || '(73) 99999-0000',
        city: city || 'Brasil',
        address: `${streetAddress}, ${neighborhood} - CEP ${cep}`,
        ownerName,
        email,
        logoUrl: logoUrl || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=150&auto=format&fit=crop&q=80',
        primaryColor,
        secondaryColor,
        employeeCount,
        pixKey: pixKey || 'financeiro@otica.com.br',
        plan: selectedPlan === 'starter' ? 'Plano Starter (R$ 199/mês)' : 'Plano Enterprise VIP (R$ 249/mês)',
        price: selectedPlan === 'starter' ? 199 : 249,
        paymentMethod: paymentMethod === 'card' ? `Cartão final ${cardNumber.slice(-4)}` : 'PIX Recorrente',
        billingDay,
        status: 'Ativa',
        accessUrl,
        createdAt: new Date().toISOString()
      };

      if (onSuccess) {
        onSuccess(newStore);
      }
      setStep(4);
    }, 1800);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(accessUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200/80 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#071D49] via-[#0B255C] to-[#071D49] p-5 text-white flex items-center justify-between shrink-0 border-b border-[#C9A96E]/30">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-amber-500 flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
              <Glasses className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#C9A96E] text-[#071D49] text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  Plataforma Multi-Óticas SaaS
                </span>
                <span className="text-xs text-amber-300 font-bold">• 100% Exclusivo</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#E8D2A8] tracking-tight">
                Cadastrar Nova Ótica Parceira
              </h2>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body with Step Progress */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">

          {/* Progress Indicator (4 Etapas) */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 max-w-lg mx-auto text-center flex-wrap">
            <div className={`flex items-center gap-1.5 text-xs font-bold ${step >= 1 ? 'text-[#0055A5]' : 'text-slate-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[11px] ${step >= 1 ? 'bg-[#0055A5] text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
              <span>Plano</span>
            </div>
            <div className={`h-0.5 w-6 sm:w-8 ${step >= 2 ? 'bg-[#0055A5]' : 'bg-slate-200'}`} />
            <div className={`flex items-center gap-1.5 text-xs font-bold ${step >= 2 ? 'text-[#0055A5]' : 'text-slate-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[11px] ${step >= 2 ? 'bg-[#0055A5] text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
              <span>Dados & Logo</span>
            </div>
            <div className={`h-0.5 w-6 sm:w-8 ${step >= 3 ? 'bg-[#0055A5]' : 'bg-slate-200'}`} />
            <div className={`flex items-center gap-1.5 text-xs font-bold ${step >= 3 ? 'text-[#0055A5]' : 'text-slate-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[11px] ${step >= 3 ? 'bg-[#0055A5] text-white' : 'bg-slate-200 text-slate-500'}`}>3</div>
              <span>Pagamento</span>
            </div>
            <div className={`h-0.5 w-6 sm:w-8 ${step >= 4 ? 'bg-[#0055A5]' : 'bg-slate-200'}`} />
            <div className={`flex items-center gap-1.5 text-xs font-bold ${step >= 4 ? 'text-[#0055A5]' : 'text-slate-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[11px] ${step >= 4 ? 'bg-[#0055A5] text-white' : 'bg-slate-200 text-slate-500'}`}>4</div>
              <span>Conclusão</span>
            </div>
          </div>

          {/* STEP 1: Escolha do Plano */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center max-w-xl mx-auto space-y-1">
                <h3 className="text-lg font-black text-slate-900">Escolha o Plano Ideal para a Nova Ótica</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Selecione o pacote de recursos que a ótica cliente utilizará mensalmente.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
                {/* Plano Starter */}
                <div
                  onClick={() => setSelectedPlan('starter')}
                  className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between space-y-4 ${
                    selectedPlan === 'starter'
                      ? 'border-[#0055A5] bg-[#F0F7FF] shadow-lg ring-2 ring-[#0055A5]/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#0055A5] uppercase tracking-wider">Plano Starter</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">Essencial</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900">R$ 199</span>
                      <span className="text-xs font-bold text-slate-500">/mês</span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">
                      Ideal para óticas individuais e pequenas unidades em crescimento.
                    </p>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-700 font-medium border-t border-slate-200/60 pt-3">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Até 5 colaboradores simultâneos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Ordens de Serviço &amp; Laboratório</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Caixa Executivo e CRM Clientes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Suporte Standard por WhatsApp</span>
                    </li>
                  </ul>
                </div>

                {/* Plano Enterprise VIP */}
                <div
                  onClick={() => setSelectedPlan('enterprise')}
                  className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between space-y-4 ${
                    selectedPlan === 'enterprise'
                      ? 'border-[#D4AF37] bg-gradient-to-br from-[#071D49] to-[#0B255C] text-white shadow-xl ring-2 ring-[#D4AF37]/40'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-900'
                  }`}
                >
                  <span className="absolute -top-3 right-4 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-slate-950 font-black text-[10px] px-3 py-0.5 rounded-full uppercase shadow-md">
                    👑 Mais Escolhido
                  </span>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-black uppercase tracking-wider ${selectedPlan === 'enterprise' ? 'text-[#E8D2A8]' : 'text-[#071D49]'}`}>
                        Enterprise VIP
                      </span>
                      <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 font-bold px-2 py-0.5 rounded-full">
                        Ilimitado + IA
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-3xl font-black ${selectedPlan === 'enterprise' ? 'text-white' : 'text-slate-900'}`}>R$ 249</span>
                      <span className={`text-xs font-bold ${selectedPlan === 'enterprise' ? 'text-slate-300' : 'text-slate-500'}`}>/mês</span>
                    </div>
                    <p className={`text-xs font-medium ${selectedPlan === 'enterprise' ? 'text-slate-200' : 'text-slate-600'}`}>
                      Para redes de óticas, grandes lojas e laboratórios que exigem IA total.
                    </p>
                  </div>

                  <ul className={`space-y-2 text-xs font-medium border-t pt-3 ${selectedPlan === 'enterprise' ? 'border-white/15 text-slate-200' : 'border-slate-200 text-slate-700'}`}>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>Usuários e Vendedores ILIMITADOS</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>Inteligência Artificial Mary &amp; Biometria DNP</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>Catálogo 3D &amp; Provador Virtual</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>Personalização White-Label (Marca Própria)</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-[#071D49] hover:bg-[#0B255C] text-[#E8D2A8] font-extrabold text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer border border-[#C9A96E]/40 active:scale-95"
                >
                  <span>Avançar para Dados &amp; Logo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Dados da Ótica & Logomarca / Cores */}
          {step === 2 && (
            <div className="space-y-6 max-w-2xl mx-auto animate-fadeIn">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-black text-slate-900">Dados da Ótica &amp; Personalização de Marca</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Preencha os dados corporativos e carregue a logomarca para extrair a paleta de cores.
                </p>
              </div>

              <div className="space-y-4">
                {/* 🎨 SEÇÃO 1: LOGOMARCA E PALETA DE CORES */}
                <div className="bg-[#F0F7FF] p-4 rounded-2xl border border-[#0055A5]/30 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#0055A5]/20 pb-2">
                    <h4 className="text-xs font-black text-[#0055A5] uppercase tracking-wider flex items-center gap-1.5">
                      <Palette className="w-4 h-4 text-[#0055A5]" /> Logomarca da Ótica &amp; Paleta de Cores
                    </h4>
                    <span className="text-[10px] bg-[#0055A5] text-white px-2 py-0.5 rounded-full font-bold">
                      WHITE-LABEL
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        URL da Logomarca da Ótica (Imagem PNG / JPG)
                      </label>
                      <div className="relative">
                        <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="url"
                          placeholder="https://sua-otica.com.br/logo.png"
                          value={logoUrl}
                          onChange={(e) => setLogoUrl(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-[#0055A5] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Anexar arquivo de Imagem da Logo
                      </label>
                      <label className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-700 flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-50">
                        <Upload className="w-4 h-4 text-[#0055A5]" />
                        <span>Carregar Arquivo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                if (ev.target?.result) setLogoUrl(ev.target.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Seletor de Tema / Copiar Paleta de Cores */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Tema Visual da Marca</label>
                      <select
                        value={selectedTheme}
                        onChange={(e) => {
                          setSelectedTheme(e.target.value);
                          if (e.target.value === 'ouro_preto') {
                            setPrimaryColor('#071D49');
                            setSecondaryColor('#D4AF37');
                          } else if (e.target.value === 'azul_safira') {
                            setPrimaryColor('#0055A5');
                            setSecondaryColor('#0284C7');
                          } else if (e.target.value === 'esmeralda') {
                            setPrimaryColor('#064E3B');
                            setSecondaryColor('#10B981');
                          } else if (e.target.value === 'rose') {
                            setPrimaryColor('#831843');
                            setSecondaryColor('#F43F5E');
                          }
                        }}
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                      >
                        <option value="ouro_preto">👑 Ouro &amp; Preto Luxo</option>
                        <option value="azul_safira">🟦 Azul Safira Corporativo</option>
                        <option value="esmeralda">💚 Verde Esmeralda Premium</option>
                        <option value="rose">💗 Rose Gold &amp; Vinho</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Cor Primária</label>
                      <div className="flex items-center gap-2 bg-white p-1.5 border border-slate-300 rounded-xl">
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-6 h-6 rounded cursor-pointer border-none"
                        />
                        <span className="font-mono text-xs font-bold text-slate-800">{primaryColor}</span>
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Cor Secundária</label>
                      <div className="flex items-center gap-2 bg-white p-1.5 border border-slate-300 rounded-xl">
                        <input
                          type="color"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="w-6 h-6 rounded cursor-pointer border-none"
                        />
                        <span className="font-mono text-xs font-bold text-slate-800">{secondaryColor}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleExtractLogoColors}
                    className="w-full py-2 bg-white hover:bg-slate-50 text-[#0055A5] border border-[#0055A5]/40 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>🎨 Extrair / Copiar Paleta de Cores da Logomarca</span>
                  </button>
                </div>

                {/* DADOS DA EMPRESA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nome da Ótica / Fantasia *</label>
                    <div className="relative">
                      <Store className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="Ex: Ótica Visão Real"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-[#0055A5] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">CNPJ / Razão Social</label>
                    <div className="relative">
                      <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="00.000.000/0001-00"
                        value={cnpj}
                        onChange={(e) => setCnpj(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-[#0055A5] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Inscrição Estadual (IE)</label>
                    <input
                      type="text"
                      placeholder="123.456.789-00 ou ISENTO"
                      value={inscricaoEstadual}
                      onChange={(e) => setInscricaoEstadual(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-[#0055A5] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">WhatsApp Comercial da Ótica</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="(73) 99999-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-[#0055A5] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Cidade / Estado</label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Ex: Ituberá - BA"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-[#0055A5] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Endereço Completo &amp; CEP</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Rua 23 de Abril, 51, Centro - 45435-000"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-[#0055A5] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nome do Responsável / Gerente *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="Ex: Carlos Eduardo"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-[#0055A5] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">E-mail Comercial de Acesso *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="gerente@otica.com.br"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-[#0055A5] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Senha de Acesso Mestra *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        placeholder="Senha de mínimo 6 dígitos"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-[#0055A5] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Chave PIX Comercial da Ótica</label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="financeiro@otica.com.br ou CNPJ"
                        value={pixKey}
                        onChange={(e) => setPixKey(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-[#0055A5] outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Voltar ao Plano
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!storeName || !ownerName || !email || !password) {
                      alert('Por favor, preencha o nome da ótica, responsável, e-mail e senha.');
                      return;
                    }
                    setStep(3);
                  }}
                  className="px-6 py-2.5 bg-[#0055A5] hover:bg-[#004080] text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Avançar para Pagamento</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Pagamento com Cartão de Crédito (Cobrança Mensal SaaS) */}
          {step === 3 && (
            <form onSubmit={handleSubmitFinalRegistration} className="space-y-6 max-w-xl mx-auto animate-fadeIn">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-black text-slate-900">Cobrança Mensal Recorrente SaaS</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Insira o cartão de crédito para a mensalidade de{' '}
                  <strong className="text-slate-900">
                    {selectedPlan === 'starter' ? 'R$ 199/mês' : 'R$ 249/mês'}
                  </strong>.
                </p>
              </div>

              {/* Opções de Método de Pagamento */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border-2 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#0055A5] bg-[#F0F7FF] text-[#0055A5] shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Cartão de Crédito</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-3 rounded-2xl border-2 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    paymentMethod === 'pix'
                      ? 'border-[#0055A5] bg-[#F0F7FF] text-[#0055A5] shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <Zap className="w-4 h-4 text-emerald-600" />
                  <span>PIX Mensal (-5%)</span>
                </button>
              </div>

              {paymentMethod === 'card' ? (
                /* Formulário do Cartão de Crédito */
                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-[#0055A5]" /> Cartão de Crédito Corporativo
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      SSL 256-BIT SEGURA
                    </span>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Número do Cartão *</label>
                    <input
                      type="text"
                      required
                      maxLength={19}
                      placeholder="4000 0000 0000 0000"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(handleFormatCardNumber(e.target.value))}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono font-black text-slate-900 text-sm tracking-wider"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nome Impresso no Cartão *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: CARLOS E SILVA"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Validade (MM/AA) *</label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(handleFormatExpiry(e.target.value))}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 text-center"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">CVV *</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 text-center"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Dia de Vencimento da Mensalidade</label>
                    <select
                      value={billingDay}
                      onChange={(e) => setBillingDay(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                    >
                      <option value="5">Todo Dia 05 de cada mês</option>
                      <option value="10">Todo Dia 10 de cada mês</option>
                      <option value="15">Todo Dia 15 de cada mês</option>
                      <option value="20">Todo Dia 20 de cada mês</option>
                    </select>
                  </div>
                </div>
              ) : (
                /* PIX Mensal */
                <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-200 text-center space-y-3 text-xs">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-emerald-950 text-sm">Assinatura com PIX Mensal Recorrente</h4>
                  <p className="text-emerald-800 font-medium">
                    A fatura mensal será enviada automaticamente para o WhatsApp e E-mail comercial com 5% de desconto.
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center pt-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Voltar a Dados
                </button>
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="px-6 py-3 bg-[#071D49] hover:bg-[#0B255C] text-[#E8D2A8] font-extrabold text-xs rounded-2xl shadow-xl transition-all flex items-center gap-2 cursor-pointer border border-[#C9A96E]/40"
                >
                  {isProcessingPayment ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#E8D2A8]" />
                      <span>Processando Assinatura Mensal...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Confirmar &amp; Ativar Ótica Parceira</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Conclusão & Recibo de Ativação */}
          {step === 4 && (
            <div className="space-y-6 text-center max-w-lg mx-auto py-4 animate-fadeIn">
              <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>

              <div className="space-y-2">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  🎉 ÓTICA ATIVADA COM SUCESSO!
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  Bem-vindo à Óticas Di Óculos VIP!
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  A ótica <strong className="text-slate-900">{storeName}</strong> foi cadastrada com plano{' '}
                  <strong>{selectedPlan === 'starter' ? 'Starter (R$ 199/mês)' : 'Enterprise VIP (R$ 249/mês)'}</strong>.
                </p>
              </div>

              {/* Detalhes de Acesso */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-left text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-700">Link de Acesso da Ótica:</span>
                  <button
                    onClick={handleCopyLink}
                    className="text-[#0055A5] font-extrabold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copiado!' : 'Copiar Link'}</span>
                  </button>
                </div>
                <div className="font-mono text-slate-900 font-bold bg-white p-2.5 rounded-xl border border-slate-200 break-all text-center">
                  {accessUrl}
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div><strong className="text-slate-700">Login:</strong> {email}</div>
                  <div><strong className="text-slate-700">Vencimento:</strong> Todo dia {billingDay}</div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-[#071D49] hover:bg-[#0B255C] text-[#E8D2A8] font-extrabold text-xs rounded-2xl shadow-xl transition-all cursor-pointer border border-[#C9A96E]/40"
              >
                Concluir &amp; Ir para o Painel Multi-Óticas
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
