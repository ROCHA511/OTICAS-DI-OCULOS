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
  FileText
} from 'lucide-react';

interface SaaSOnboardingViewProps {
  onClose?: () => void;
  onSuccess?: (newStoreData: any) => void;
}

export const SaaSOnboardingView: React.FC<SaaSOnboardingViewProps> = ({
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'enterprise'>('enterprise');

  // Form State
  const [storeName, setStoreName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [copiedLink, setCopiedLink] = useState(false);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  const storeSlug = storeName ? generateSlug(storeName) : 'minha-otica';
  const accessUrl = typeof window !== 'undefined' ? `${window.location.origin}/loja/${storeSlug}` : `https://dioculos.com.br/loja/${storeSlug}`;

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName || !ownerName || !email || !password) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const newStore = {
      id: `store_${Date.now()}`,
      name: storeName,
      slug: storeSlug,
      cnpj: cnpj || 'Não informado',
      phone: phone || '(73) 99999-0000',
      city: city || 'Brasil',
      ownerName,
      email,
      plan: selectedPlan === 'starter' ? 'Plano Starter (R$ 199/mês)' : 'Plano Enterprise VIP (R$ 249/mês)',
      price: selectedPlan === 'starter' ? 199 : 249,
      status: 'Ativa',
      accessUrl,
      createdAt: new Date().toISOString()
    };

    if (onSuccess) {
      onSuccess(newStore);
    }
    setStep(3);
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

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
            <div className={`flex items-center gap-2 text-xs font-bold ${step >= 1 ? 'text-[#0055A5]' : 'text-slate-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black ${step >= 1 ? 'bg-[#0055A5] text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
              <span>Plano</span>
            </div>
            <div className={`h-0.5 w-12 ${step >= 2 ? 'bg-[#0055A5]' : 'bg-slate-200'}`} />
            <div className={`flex items-center gap-2 text-xs font-bold ${step >= 2 ? 'text-[#0055A5]' : 'text-slate-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black ${step >= 2 ? 'bg-[#0055A5] text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
              <span>Dados da Ótica</span>
            </div>
            <div className={`h-0.5 w-12 ${step >= 3 ? 'bg-[#0055A5]' : 'bg-slate-200'}`} />
            <div className={`flex items-center gap-2 text-xs font-bold ${step >= 3 ? 'text-[#0055A5]' : 'text-slate-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black ${step >= 3 ? 'bg-[#0055A5] text-white' : 'bg-slate-200 text-slate-500'}`}>3</div>
              <span>Conclusão</span>
            </div>
          </div>

          {/* STEP 1: Escolha do Plano */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center max-w-xl mx-auto space-y-1">
                <h3 className="text-lg font-black text-slate-900">Escolha o Plano Ideal para a Nova Ótica</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Selecione a assinatura mensal. A loja terá ambiente isolado com sua própria logo, vendedores e comissões.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
                {/* Plano Starter */}
                <div
                  onClick={() => setSelectedPlan('starter')}
                  className={`cursor-pointer relative rounded-3xl p-6 border-2 transition-all space-y-4 ${
                    selectedPlan === 'starter'
                      ? 'border-[#0055A5] bg-[#F0F7FF] shadow-lg ring-2 ring-[#0055A5]/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {selectedPlan === 'starter' && (
                    <span className="absolute top-4 right-4 bg-[#0055A5] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                      Selecionado
                    </span>
                  )}
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#0055A5] flex items-center justify-center">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900">Plano Starter</h4>
                    <p className="text-xs text-slate-500">Ideal para óticas individuais e pequenas lojas</p>
                  </div>
                  <div className="text-2xl font-black text-[#0055A5]">
                    R$ 199 <span className="text-xs text-slate-500 font-bold">/mês</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-2 font-medium">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Até 3 Vendedores Cadastrados</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Emissão de OS e Pedidos</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Atendimento Inteligente Mary</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Controle de Caixa Básico</li>
                  </ul>
                </div>

                {/* Plano Enterprise VIP */}
                <div
                  onClick={() => setSelectedPlan('enterprise')}
                  className={`cursor-pointer relative rounded-3xl p-6 border-2 transition-all space-y-4 ${
                    selectedPlan === 'enterprise'
                      ? 'border-[#D4AF37] bg-gradient-to-br from-[#FFFDF8] via-[#FFF9ED] to-[#FFFDF8] shadow-xl ring-2 ring-[#D4AF37]/30'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="absolute top-4 right-4 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase shadow-xs">
                    Mais Popular VIP
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Zap className="w-6 h-6 fill-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900">Plano Enterprise VIP</h4>
                    <p className="text-xs text-slate-500">Para redes e óticas de alta performance</p>
                  </div>
                  <div className="text-2xl font-black text-amber-700">
                    R$ 249 <span className="text-xs text-slate-500 font-bold">/mês</span>
                  </div>
                  <ul className="text-xs text-slate-700 space-y-2 font-medium">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" /> Vendedores e Equipes Ilimitados</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" /> Provador 3D & Medição DNP por Câmera</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" /> IA Mary Ilimitada + WhatsApp API</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" /> Integração com Laboratórios e Tabela Surfaçada</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-[#0055A5] hover:bg-[#004080] text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Avançar para Dados da Empresa</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Dados da Ótica */}
          {step === 2 && (
            <form onSubmit={handleSubmitRegistration} className="space-y-6 max-w-2xl mx-auto animate-fadeIn">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-black text-slate-900">Preencha os Dados da Empresa e Administrador</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Estes dados criarão o link de acesso exclusivo da ótica com isolamento total.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nome da Ótica */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nome da Ótica / Fantasia *
                  </label>
                  <div className="relative">
                    <Store className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: Ótica Visão Real"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0055A5] focus:bg-white transition-all outline-none"
                    />
                  </div>
                </div>

                {/* CNPJ */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    CNPJ / Razão Social
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="00.000.000/0001-00"
                      value={cnpj}
                      onChange={(e) => setCnpj(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0055A5] focus:bg-white transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Telefone WhatsApp */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp Comercial da Ótica
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="(73) 99999-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0055A5] focus:bg-white transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Cidade / UF */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cidade / Estado
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Ex: Ituberá - BA"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0055A5] focus:bg-white transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Nome do Responsável */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nome do Responsável / Gerente *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: Carlos Eduardo"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0055A5] focus:bg-white transition-all outline-none"
                    />
                  </div>
                </div>

                {/* E-mail de Login */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    E-mail Comercial de Acesso *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="gerente@otica.com.br"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0055A5] focus:bg-white transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Senha */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Senha de Acesso Mestra da Ótica *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="Crie uma senha segura (mínimo 6 caracteres)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0055A5] focus:bg-white transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Preview URL */}
              <div className="bg-[#F0F7FF] border border-[#0055A5]/30 rounded-2xl p-4 space-y-1">
                <span className="text-[11px] font-bold text-[#0055A5] uppercase tracking-wider">
                  Link Exclusivo de Acesso da Ótica:
                </span>
                <div className="text-xs font-mono font-bold text-slate-800 break-all">
                  {accessUrl}
                </div>
              </div>

              <div className="flex justify-between items-center pt-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Voltar ao Plano
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#0055A5] hover:bg-[#004080] text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Finalizar Cadastro e Criar Ótica</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Conclusão & Link Gerado */}
          {step === 3 && (
            <div className="space-y-6 text-center max-w-lg mx-auto py-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900">Ótica Cadastrada com Sucesso!</h3>
                <p className="text-xs text-slate-600 font-medium">
                  A nova loja <span className="font-bold text-[#0055A5]">{storeName}</span> foi provisionada no plano{' '}
                  <span className="font-bold text-amber-600">{selectedPlan === 'starter' ? 'Starter (R$ 199/mês)' : 'Enterprise VIP (R$ 249/mês)'}</span> com isolamento total de dados.
                </p>
              </div>

              {/* Link Box */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 text-left space-y-2 shadow-lg">
                <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">
                  Link de Acesso Direto para o Cliente:
                </span>
                <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 gap-2">
                  <span className="text-xs font-mono text-cyan-300 truncate">{accessUrl}</span>
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#E5C158] text-slate-950 font-black text-xs rounded-lg flex items-center gap-1 shrink-0 cursor-pointer transition-all"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                {onClose && (
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Fechar
                  </button>
                )}
                <button
                  onClick={() => {
                    alert(`Redirecionando para o ambiente de ${storeName}...`);
                    if (onClose) onClose();
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg hover:brightness-110 transition-all cursor-pointer"
                >
                  Entrar na Ótica Agora
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
