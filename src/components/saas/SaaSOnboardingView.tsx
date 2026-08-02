import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Glasses,
  Check,
  Palette,
  LayoutGrid,
  Download
} from 'lucide-react';
import { provisionTenantFromOnboarding, ProvisioningData } from '../../utils/saasOnboardingSync';
import { formatBrazilianPhone } from '../../utils/phoneValidator';

export const SaaSOnboardingView: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStepText, setCurrentStepText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successResult, setSuccessResult] = useState<{
    tenant_id: string;
    user_id: string;
    message: string;
  } | null>(null);

  // Etapa 1 - Escolha do Plano
  const [plano, setPlano] = useState<'trial' | 'basico' | 'promax'>('promax');

  // Etapa 2 - Dados da Empresa
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [telefoneLoja, setTelefoneLoja] = useState('');
  const [whatsappLoja, setWhatsappLoja] = useState('');
  const [emailLoja, setEmailLoja] = useState('');
  const [enderecoCompleto, setEnderecoCompleto] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');

  // Etapa 3 - Administrador
  const [nomeProprietario, setNomeProprietario] = useState('');
  const [cargo, setCargo] = useState('CEO / Proprietário');
  const [emailProprietario, setEmailProprietario] = useState('');
  const [senhaProprietario, setSenhaProprietario] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Etapa 4 - Personalização
  const [logoUrl, setLogoUrl] = useState('');
  const [corPrincipal, setCorPrincipal] = useState('#071D49');
  const [corSecundaria, setCorSecundaria] = useState('#C9A96E');
  const [tema, setTema] = useState<'claro' | 'escuro' | 'automatico'>('automatico');

  // Etapa 5 - Módulos
  const [modulos, setModulos] = useState({
    financeiro: true,
    agenda: true,
    estoque: true,
    crm: true,
    ia: true,
    caixa: true,
    relatorios: true,
    api: true,
    marketing: false,
    rh: false
  });

  const handleToggleModulo = (key: keyof typeof modulos) => {
    // Restrição do plano Básico
    if (plano === 'basico' && key === 'ia') {
      alert('O Plano Básico não inclui recursos de Inteligência Artificial.');
      return;
    }
    setModulos({
      ...modulos,
      [key]: !modulos[key]
    });
  };

  const handleGeneratePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSenhaProprietario(pass);
    setConfirmarSenha(pass);
    setShowPassword(true);
  };

  const handleNextStep = () => {
    if (step === 2) {
      if (!nomeFantasia.trim() || !cnpj.trim() || !telefoneLoja.trim() || !emailLoja.trim()) {
        alert('Por favor, preencha os campos obrigatórios da empresa (*).');
        return;
      }
    }
    if (step === 3) {
      if (!nomeProprietario.trim() || !emailProprietario.trim() || !senhaProprietario) {
        alert('Por favor, preencha todos os campos do administrador.');
        return;
      }
      if (senhaProprietario !== confirmarSenha) {
        alert('A senha e a confirmação de senha não coincidem.');
        return;
      }
      if (senhaProprietario.length < 6) {
        alert('A senha deve ter no mínimo 6 caracteres.');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const steps = [
      'Validando informações cadastrais...',
      'Alocando novo Tenant no Supabase...',
      'Isolando o banco de dados via RLS...',
      'Criptografando credenciais do Administrador...',
      'Provisionando módulos e paleta de cores...',
      'Liberando licenças de acesso...',
      'Finalizando instalação PWA do ambiente...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setCurrentStepText(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    try {
      const data: ProvisioningData = {
        nomeFantasia,
        razaoSocial: razaoSocial || nomeFantasia,
        cnpj,
        plano,
        emailProprietario,
        senhaProprietario,
        nomeProprietario,
        phoneProprietario: whatsappLoja || telefoneLoja
      };

      const result = await provisionTenantFromOnboarding(data);
      
      if (result.success) {
        setSuccessResult({
          tenant_id: result.tenant_id,
          user_id: result.user_id,
          message: result.message || 'Instalação concluída!'
        });
      } else {
        throw new Error(result.message || 'Erro no provisionamento.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Ocorreu um erro ao criar seu ambiente.');
    } finally {
      setIsSubmitting(false);
      setCurrentStepText('');
    }
  };

  const handleEnterSystem = () => {
    // Redireciona para o login principal limpo
    window.location.href = window.location.origin;
  };

  return (
    <div className="min-h-screen bg-[#071D49] flex flex-col justify-between select-none relative overflow-y-auto font-sans">
      {/* Background Decorative Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#C9A96E]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-white/10 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-2">
          <Glasses className="w-8 h-8 text-[#C9A96E]" />
          <span className="text-white text-lg font-black tracking-wider uppercase">
            Óticas Di Óculos <span className="text-[#C9A96E]">SaaS</span>
          </span>
        </div>
        <div className="text-white/60 text-xs font-semibold">
          Auto-Instalação e Setup Exclusivo
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 flex items-center justify-center relative z-10">
        
        {/* MODAL DE SUBMISSÃO E PROGRESSO */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[500] flex items-center justify-center p-4">
            <div className="bg-[#0B255C] border border-[#C9A96E] rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
              <div className="w-16 h-16 border-4 border-[#C9A96E] border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Criando Seu Ambiente</h3>
                <p className="text-[#C9A96E] text-sm font-semibold animate-pulse">{currentStepText}</p>
              </div>
              <p className="text-slate-400 text-xs">
                Por favor, aguarde. Estamos isolando seu banco de dados e preparando o Painel Executivo.
              </p>
            </div>
          </div>
        )}

        {/* TELA DE SUCESSO */}
        {successResult && (
          <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center text-white max-w-xl mx-auto">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-black">Seu ambiente foi criado com sucesso!</h2>
              <p className="text-slate-300 text-sm">
                A ótica **{nomeFantasia}** está ativa no sistema com o plano **{plano.toUpperCase()}**.
              </p>
            </div>

            <div className="bg-[#0B255C]/90 text-left p-5 rounded-2xl border border-white/10 space-y-2 font-mono text-xs text-slate-200">
              <div className="text-[#C9A96E] font-black pb-1.5 border-b border-white/10 uppercase text-[10px]">
                Dados do Seu Acesso
              </div>
              <div><span className="text-slate-400">ID da Ótica (Tenant):</span> <span className="text-emerald-400 select-all font-bold">{successResult.tenant_id}</span></div>
              <div><span className="text-slate-400">E-mail de Login:</span> <span className="text-slate-200 select-all">{emailProprietario}</span></div>
              <div><span className="text-slate-400">Senha Provisória:</span> <span className="text-slate-200 select-all font-bold">{senhaProprietario}</span></div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <button
                onClick={handleEnterSystem}
                className="px-6 py-3 bg-[#C9A96E] hover:bg-[#B39359] text-[#071D49] font-black text-sm rounded-xl cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Entrar no Sistema
              </button>
              <button
                onClick={() => alert('Download do instalador PWA iniciado. Siga os passos na barra de navegação para instalar.')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Instalar Aplicativo
              </button>
            </div>
          </div>
        )}

        {/* FLUXO DO WIZARD */}
        {!successResult && (
          <div className="w-full bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
            
            {/* Steps Progress Indicator */}
            <div className="flex items-center justify-between mb-8 overflow-x-auto scrollbar-none pb-2 border-b border-white/10">
              {[1, 2, 3, 4, 5, 6].map((num) => {
                const labels = ['Planos', 'Loja', 'Acesso', 'Visual', 'Módulos', 'Resumo'];
                return (
                  <div key={num} className="flex items-center gap-2 shrink-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      step >= num 
                        ? 'bg-[#C9A96E] text-[#071D49]' 
                        : 'bg-white/10 text-white/40 border border-white/10'
                    }`}>
                      {num}
                    </div>
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${
                      step === num ? 'text-white font-extrabold' : 'text-white/40'
                    }`}>
                      {labels[num - 1]}
                    </span>
                    {num < 6 && <span className="w-4 h-px bg-white/10" />}
                  </div>
                );
              })}
            </div>

            {/* ERROR CARD */}
            {errorMsg && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-200 text-xs p-4 rounded-xl mb-4 flex items-center gap-2 animate-pulse">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* STEP 1: PLANOS */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-black text-white">Bem-vindo ao Setup SaaS</h1>
                  <p className="text-slate-300 text-sm">
                    Escolha o plano ideal para sua empresa e configure seu sistema em poucos minutos.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  {/* Trial Card */}
                  <div 
                    onClick={() => { setPlano('trial'); setStep(2); }}
                    className={`bg-white/5 border rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between hover:border-[#C9A96E]/60 ${
                      plano === 'trial' ? 'border-[#C9A96E] ring-2 ring-[#C9A96E]/20 bg-white/10' : 'border-white/10'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-white text-sm">Trial Grátis</span>
                        {plano === 'trial' && <CheckCircle2 className="w-4 h-4 text-[#C9A96E]" />}
                      </div>
                      <p className="text-slate-300 text-[10px]">3 Dias de Acesso total para testes iniciais.</p>
                      <ul className="space-y-1 text-[10px] text-slate-300 border-t border-white/5 pt-2 font-medium">
                        <li className="flex items-center gap-1">✔ CRM de Clientes</li>
                        <li className="flex items-center gap-1">✔ Controle de Caixa</li>
                        <li className="flex items-center gap-1">✔ Cadastro de Lentes</li>
                        <li className="flex items-center gap-1">✔ IA Básica (Testes)</li>
                      </ul>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-baseline gap-1">
                      <span className="text-lg font-black text-white">R$ 0</span>
                      <span className="text-[10px] text-slate-400">/ grátis</span>
                    </div>
                  </div>

                  {/* Básico Card */}
                  <div 
                    onClick={() => { setPlano('basico'); setStep(2); }}
                    className={`bg-white/5 border rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between hover:border-[#C9A96E]/60 ${
                      plano === 'basico' ? 'border-[#C9A96E] ring-2 ring-[#C9A96E]/20 bg-white/10' : 'border-white/10'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-white text-sm">Plano Básico</span>
                        {plano === 'basico' && <CheckCircle2 className="w-4 h-4 text-[#C9A96E]" />}
                      </div>
                      <p className="text-slate-300 text-[10px]">Ideal para pequenas empresas com CRM e Financeiro.</p>
                      <ul className="space-y-1 text-[10px] text-slate-300 border-t border-white/5 pt-2 font-medium">
                        <li className="flex items-center gap-1">✔ Até 150 OS/mês</li>
                        <li className="flex items-center gap-1">✔ CRM Completo</li>
                        <li className="flex items-center gap-1">✔ Controle de Caixas</li>
                        <li className="flex items-center gap-1 text-red-400 font-bold">❌ Sem IA no WhatsApp</li>
                      </ul>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-baseline gap-1">
                      <span className="text-lg font-black text-white">R$ 199</span>
                      <span className="text-[10px] text-slate-400">/ mês</span>
                    </div>
                  </div>

                  {/* Pro Max Card */}
                  <div 
                    onClick={() => { setPlano('promax'); setStep(2); }}
                    className={`bg-white/5 border rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between hover:border-[#C9A96E]/60 relative overflow-hidden ${
                      plano === 'promax' ? 'border-[#C9A96E] ring-2 ring-[#C9A96E]/20 bg-white/10' : 'border-white/10'
                    }`}
                  >
                    <div className="absolute top-0 right-0 bg-[#C9A96E] text-[#071D49] text-[9px] font-black uppercase px-2 py-0.5 tracking-wider rounded-bl-lg">
                      Recomendado
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-white text-sm flex items-center gap-1">
                          Pro Max <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" />
                        </span>
                        {plano === 'promax' && <CheckCircle2 className="w-4 h-4 text-[#C9A96E]" />}
                      </div>
                      <p className="text-slate-300 text-[10px]">Completo com IA autônoma e filiais integradas.</p>
                      <ul className="space-y-1 text-[10px] text-[#C9A96E] border-t border-white/5 pt-2 font-black">
                        <li className="flex items-center gap-1">✔ OS Ilimitadas</li>
                        <li className="flex items-center gap-1">✔ IA Mary 24/7 Autônoma</li>
                        <li className="flex items-center gap-1">✔ WhatsApp Integrado</li>
                        <li className="flex items-center gap-1">✔ Multi-Filiais / Redes</li>
                      </ul>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-baseline gap-1">
                      <span className="text-lg font-black text-white">R$ 249</span>
                      <span className="text-[10px] text-slate-400">/ mês</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: INFORMAÇÕES DA EMPRESA */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-[#C9A96E] uppercase tracking-wide flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" /> Informações da Empresa (Ótica)
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Nome Fantasia *</label>
                    <input 
                      type="text"
                      required
                      value={nomeFantasia}
                      onChange={e => setNomeFantasia(e.target.value)}
                      placeholder="Ex: Ótica Bella Vista"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:bg-white/10 focus:outline-none focus:border-[#C9A96E]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Razão Social</label>
                    <input 
                      type="text"
                      value={razaoSocial}
                      onChange={e => setRazaoSocial(e.target.value)}
                      placeholder="Ex: Bella Vista Ótica Ltda"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:bg-white/10 focus:outline-none focus:border-[#C9A96E]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">CNPJ *</label>
                    <input 
                      type="text"
                      required
                      value={cnpj}
                      onChange={e => setCnpj(e.target.value)}
                      placeholder="Ex: 00.000.000/0001-00"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:bg-white/10 focus:outline-none focus:border-[#C9A96E]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Telefone Fixo *</label>
                    <input 
                      type="text"
                      required
                      value={telefoneLoja}
                      onChange={e => setTelefoneLoja(formatBrazilianPhone(e.target.value))}
                      placeholder="Ex: (73) 3256-1122"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:bg-white/10 focus:outline-none focus:border-[#C9A96E]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">WhatsApp Proprietário</label>
                    <input 
                      type="text"
                      value={whatsappLoja}
                      onChange={e => setWhatsappLoja(formatBrazilianPhone(e.target.value))}
                      placeholder="Ex: (73) 99999-8888"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:bg-white/10 focus:outline-none focus:border-[#C9A96E]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">E-mail da Empresa *</label>
                    <input 
                      type="email"
                      required
                      value={emailLoja}
                      onChange={e => setEmailLoja(e.target.value)}
                      placeholder="Ex: contato@otica.com"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:bg-white/10 focus:outline-none focus:border-[#C9A96E]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Endereço Completo</label>
                  <input 
                    type="text"
                    value={enderecoCompleto}
                    onChange={e => setEnderecoCompleto(e.target.value)}
                    placeholder="Ex: Rua 23 de Abril, 51, Centro"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:bg-white/10 focus:outline-none focus:border-[#C9A96E]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Cidade</label>
                    <input 
                      type="text"
                      value={cidade}
                      onChange={e => setCidade(e.target.value)}
                      placeholder="Ituberá"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:bg-white/10 focus:outline-none focus:border-[#C9A96E]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Estado</label>
                    <input 
                      type="text"
                      value={estado}
                      onChange={e => setEstado(e.target.value)}
                      placeholder="BA"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:bg-white/10 focus:outline-none focus:border-[#C9A96E]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">CEP</label>
                    <input 
                      type="text"
                      value={cep}
                      onChange={e => setCep(e.target.value)}
                      placeholder="45435-000"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:bg-white/10 focus:outline-none focus:border-[#C9A96E]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: ADMINISTRADOR */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-[#C9A96E] uppercase tracking-wide flex items-center gap-1.5">
                  <User className="w-4 h-4" /> Proprietário (CEO da Nova Loja)
                </h3>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Nome Completo *</label>
                  <input 
                    type="text"
                    required
                    value={nomeProprietario}
                    onChange={e => setNomeProprietario(e.target.value)}
                    placeholder="Ex: João da Silva"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:bg-white/10 focus:outline-none focus:border-[#C9A96E]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Cargo</label>
                    <input 
                      type="text"
                      value={cargo}
                      onChange={e => setCargo(e.target.value)}
                      placeholder="CEO / Proprietário"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:bg-white/10 focus:outline-none focus:border-[#C9A96E]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">E-mail do Proprietário (Login) *</label>
                    <input 
                      type="email"
                      required
                      value={emailProprietario}
                      onChange={e => setEmailProprietario(e.target.value)}
                      placeholder="Ex: joao@oticaexemplo.com"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:bg-white/10 focus:outline-none focus:border-[#C9A96E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 relative">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-300">Senha Provisória *</label>
                      <button 
                        type="button" 
                        onClick={handleGeneratePassword}
                        className="text-[10px] text-[#C9A96E] hover:underline font-bold"
                      >
                        ⚡ Gerar Senha Forte
                      </button>
                    </div>
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={senhaProprietario}
                        onChange={e => setSenhaProprietario(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full bg-white/5 border border-white/15 rounded-xl pl-3 pr-10 py-2 text-xs text-white focus:bg-white/10 focus:outline-none focus:border-[#C9A96E]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Confirmar Senha *</label>
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmarSenha}
                      onChange={e => setConfirmarSenha(e.target.value)}
                      placeholder="Repita a senha provisória"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:bg-white/10 focus:outline-none focus:border-[#C9A96E]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: PERSONALIZAÇÃO */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-[#C9A96E] uppercase tracking-wide flex items-center gap-1.5">
                  <Palette className="w-4 h-4" /> Identidade Visual & Customização
                </h3>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">URL do Logotipo da Ótica</label>
                  <input 
                    type="text"
                    value={logoUrl}
                    onChange={e => setLogoUrl(e.target.value)}
                    placeholder="Ex: https://dominio.com/logo.png"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:bg-white/10 focus:outline-none focus:border-[#C9A96E]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">Cor Principal</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color"
                        value={corPrincipal}
                        onChange={e => setCorPrincipal(e.target.value)}
                        className="w-8 h-8 bg-transparent border-0 cursor-pointer rounded-full"
                      />
                      <span className="text-xs text-slate-200 uppercase font-mono">{corPrincipal}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">Cor Secundária (Destaques)</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color"
                        value={corSecundaria}
                        onChange={e => setCorSecundaria(e.target.value)}
                        className="w-8 h-8 bg-transparent border-0 cursor-pointer rounded-full"
                      />
                      <span className="text-xs text-slate-200 uppercase font-mono">{corSecundaria}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">Tema Padrão do Sistema</label>
                  <div className="flex gap-4">
                    {['claro', 'escuro', 'automatico'].map((t) => (
                      <label key={t} className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                        <input 
                          type="radio" 
                          name="tema" 
                          value={t} 
                          checked={tema === t}
                          onChange={() => setTema(t as any)}
                          className="text-[#C9A96E] focus:ring-0 bg-transparent border-white/20"
                        />
                        <span className="capitalize">{t}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: MÓDULOS */}
            {step === 5 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h3 className="text-sm font-black text-[#C9A96E] uppercase tracking-wide flex items-center gap-1.5">
                    <LayoutGrid className="w-4 h-4" /> Módulos Habilitados do Sistema
                  </h3>
                  <span className="text-[10px] bg-white/10 text-slate-200 px-2 py-0.5 rounded-full font-bold uppercase">
                    Plano: {plano === 'trial' ? 'Trial Grátis' : plano === 'basico' ? 'Básico' : 'Pro Max'}
                  </span>
                </div>

                <p className="text-slate-300 text-xs">
                  Ative ou desative os recursos abaixo de acordo com a necessidade operacional da sua nova loja:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {Object.keys(modulos).map((key) => {
                    const typedKey = key as keyof typeof modulos;
                    const labels: any = {
                      financeiro: 'Financeiro',
                      agenda: 'Agenda / Consultas',
                      estoque: 'Estoque / Produtos',
                      crm: 'CRM de Clientes',
                      ia: 'Inteligência Artificial (Mary)',
                      caixa: 'Frente de Caixa',
                      relatorios: 'Relatórios Executivos',
                      api: 'Acesso API',
                      marketing: 'Automação de Marketing',
                      rh: 'Controle de Equipe / Vendedores'
                    };

                    const isIaDisabled = plano === 'basico' && typedKey === 'ia';

                    return (
                      <div 
                        key={key} 
                        onClick={() => !isIaDisabled && handleToggleModulo(typedKey)}
                        className={`p-3 rounded-xl border flex items-center justify-between transition-all select-none ${
                          isIaDisabled 
                            ? 'opacity-40 border-white/5 bg-black/20 cursor-not-allowed'
                            : modulos[typedKey]
                              ? 'border-[#C9A96E] bg-[#C9A96E]/10 cursor-pointer text-white'
                              : 'border-white/10 bg-white/5 cursor-pointer text-white/50'
                        }`}
                      >
                        <span className="text-xs font-bold">{labels[typedKey]}</span>
                        <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                          modulos[typedKey] ? 'bg-[#C9A96E] border-[#C9A96E] text-[#071D49]' : 'border-white/20'
                        }`}>
                          {modulos[typedKey] && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 6: RESUMO E PAGAMENTO */}
            {step === 6 && (
              <form onSubmit={handleOnboardingSubmit} className="space-y-6">
                <div className="text-center space-y-1">
                  <h3 className="text-base font-black text-white">Resumo do Pedido & Setup do Sistema</h3>
                  <p className="text-slate-300 text-xs">Revise as informações antes de iniciar o pagamento e provisionamento.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Resumo da Assinatura */}
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
                    <h4 className="font-bold text-[#C9A96E] border-b border-white/10 pb-1.5 uppercase text-[10px]">1. Configuração da Assinatura</h4>
                    <div className="space-y-1.5 text-slate-200">
                      <div><span className="text-slate-400">Plano Selecionado:</span> <span className="font-bold text-white uppercase">{plano}</span></div>
                      <div>
                        <span className="text-slate-400">Mensalidade:</span>{' '}
                        <span className="font-bold text-white">
                          {plano === 'trial' ? 'R$ 0,00' : plano === 'basico' ? 'R$ 199,00' : 'R$ 249,00'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Limite OS/mês:</span>{' '}
                        <span className="text-white font-semibold">
                          {plano === 'basico' ? 'Até 150 OS/mês' : 'Ilimitadas'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Resumo da Ótica */}
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
                    <h4 className="font-bold text-[#C9A96E] border-b border-white/10 pb-1.5 uppercase text-[10px]">2. Dados de Contato & Acesso</h4>
                    <div className="space-y-1.5 text-slate-200">
                      <div className="truncate"><span className="text-slate-400">Ótica:</span> <span className="font-bold text-white">{nomeFantasia}</span></div>
                      <div><span className="text-slate-400">CNPJ:</span> <span className="text-white">{cnpj}</span></div>
                      <div className="truncate"><span className="text-slate-400">CEO/Proprietário:</span> <span className="text-white">{nomeProprietario}</span></div>
                      <div className="truncate"><span className="text-slate-400">E-mail de Login:</span> <span className="text-[#C9A96E] font-bold">{emailProprietario}</span></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2 text-xs text-slate-200">
                  <h4 className="font-bold text-[#C9A96E] border-b border-white/10 pb-1.5 uppercase text-[10px]">3. Customização do Ambiente</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div><span className="text-slate-400">Cor Principal:</span> <span className="font-semibold uppercase" style={{ color: corPrincipal }}>{corPrincipal}</span></div>
                    <div><span className="text-slate-400">Tema do Painel:</span> <span className="font-semibold uppercase">{tema}</span></div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-xl cursor-pointer shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    Continuar para Pagamento
                  </button>
                </div>
              </form>
            )}

            {/* Navigation buttons at bottom */}
            {step < 6 && (
              <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-8">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={step === 1}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                    step === 1 
                      ? 'opacity-30 text-white/50 border border-white/5 cursor-not-allowed' 
                      : 'bg-white/5 hover:bg-white/10 border border-white/15 text-white cursor-pointer active:scale-95'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" /> Voltar
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 bg-[#C9A96E] hover:bg-[#B39359] text-[#071D49] font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-xs"
                >
                  Avançar <ArrowRight className="w-4 h-4 text-[#071D49]" />
                </button>
              </div>
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center border-t border-white/10 backdrop-blur-md relative z-10 text-[10px] text-white/40">
        © 2026 Óticas Di Óculos. Todos os direitos reservados. Segurança SSL 256 bits com isolamento multi-tenant Supabase.
      </footer>
    </div>
  );
};
