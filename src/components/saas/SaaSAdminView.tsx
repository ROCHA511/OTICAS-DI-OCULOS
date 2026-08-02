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
  AlertCircle
} from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

export const SaaSAdminView: React.FC = () => {
  // Estados do Formulário - Ótica
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [telefoneLoja, setTelefoneLoja] = useState('');
  const [enderecoCompleto, setEnderecoCompleto] = useState('');
  const [plano, setPlano] = useState<'trial' | 'basico' | 'promax'>('promax');

  // Estados do Formulário - Proprietário (CEO)
  const [nomeProprietario, setNomeProprietario] = useState('');
  const [emailProprietario, setEmailProprietario] = useState('');
  const [phoneProprietario, setPhoneProprietario] = useState('');
  const [senhaProprietario, setSenhaProprietario] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Vendedores adicionais
  const [novoVendedor, setNovoVendedor] = useState('');
  const [vendedores, setVendedores] = useState<string[]>([]);

  // Estados de Processamento
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStepText, setCurrentStepText] = useState('');
  const [creationResult, setCreationResult] = useState<{
    success: boolean;
    tenant_id?: string;
    user_id?: string;
    message: string;
  } | null>(null);

  // Gerar senha forte aleatória
  const handleGeneratePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSenhaProprietario(pass);
    setShowPassword(true);
  };

  // Adicionar Vendedor
  const handleAddVendedor = () => {
    if (novoVendedor.trim() && !vendedores.includes(novoVendedor.trim())) {
      setVendedores([...vendedores, novoVendedor.trim()]);
      setNovoVendedor('');
    }
  };

  // Remover Vendedor
  const handleRemoveVendedor = (idx: number) => {
    setVendedores(vendedores.filter((_, i) => i !== idx));
  };

  // Submissão do Formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeFantasia || !cnpj || !emailProprietario || !senhaProprietario || !nomeProprietario) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    setCreationResult(null);

    // Fluxo simulado de progresso visual (UI Premium)
    const steps = [
      'Gerando ID único do Tenant (Inquilino)...',
      'Registrando a ótica no banco de dados...',
      'Criptografando as credenciais de acesso...',
      'Criando conta no Supabase Auth e gerando identidades...',
      'Vinculando políticas RLS de isolamento multitenant...',
      'Criando perfil do CEO e configurando permissões...',
      'Cadastrando vendedores na equipe...',
      'Concluindo o onboarding...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setCurrentStepText(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    try {
      if (supabase) {
        // Chamada real ao Supabase RPC
        const { data, error } = await supabase.rpc('cadastrar_nova_otica', {
          p_nome_fantasia: nomeFantasia,
          p_razao_social: razaoSocial,
          p_cnpj: cnpj,
          p_plano: plano,
          p_email_proprietario: emailProprietario,
          p_senha_proprietario: senhaProprietario,
          p_nome_proprietario: nomeProprietario,
          p_telefone_proprietario: phoneProprietario
        });

        if (error) throw error;
        
        // Se houver vendedores, cria os perfis de atendentes associados no novo tenant
        if (data?.success && vendedores.length > 0) {
          setCurrentStepText('Cadastrando vendedores no banco de dados...');
          // Cria perfis para os vendedores vinculados ao novo tenant
          for (const vendName of vendedores) {
            // Em produção, isso seria feito registrando no auth ou por uma API de equipe,
            // aqui criamos apenas perfis de atendentes para ilustrar a carga inicial
            await supabase.from('perfis').insert({
              tenant_id: data.tenant_id,
              nome: vendName,
              role: 'attendant',
              status: 'ativo'
            });
          }
        }

        setCreationResult({
          success: true,
          tenant_id: data?.tenant_id,
          user_id: data?.user_id,
          message: data?.message || 'Ótica ativada com sucesso!'
        });
      } else {
        // Fallback local caso Supabase não esteja conectado
        setCreationResult({
          success: true,
          tenant_id: 'dev-tenant-id-' + Math.floor(Math.random() * 1000),
          user_id: 'dev-user-id-' + Math.floor(Math.random() * 1000),
          message: 'Ótica criada localmente com sucesso! (Modo offline)'
        });
      }
    } catch (err: any) {
      console.error('Erro no onboarding da ótica:', err);
      setCreationResult({
        success: false,
        message: err.message || 'Erro inesperado ao registrar ótica.'
      });
    } finally {
      setIsSubmitting(false);
      setCurrentStepText('');
    }
  };

  // Reset do formulário para nova inserção
  const handleReset = () => {
    setNomeFantasia('');
    setRazaoSocial('');
    setCnpj('');
    setTelefoneLoja('');
    setEnderecoCompleto('');
    setPlano('promax');
    setNomeProprietario('');
    setEmailProprietario('');
    setPhoneProprietario('');
    setSenhaProprietario('');
    setVendedores([]);
    setCreationResult(null);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#FDFBF7] p-4 sm:p-6 select-none">
      {/* Cabeçalho */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#071D49]" />
            <h1 className="text-xl sm:text-2xl font-black text-[#071D49]">
              Painel de Administração SaaS & Multitenant
            </h1>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Cadastre novas franquias, filiais e óticas parceiras vinculadas ao isolamento RLS do Supabase.
          </p>
        </div>
        <span className="bg-[#C9A96E]/20 text-[#071D49] border border-[#C9A96E] font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider self-start md:self-center">
          Super Admin Master
        </span>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* MODAL DE PROCESSAMENTO / ANIMAÇÃO DE ONBOARDING */}
        {isSubmitting && (
          <div className="fixed inset-0 z-[400] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#071D49] border-2 border-[#C9A96E] rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
              <div className="w-16 h-16 border-4 border-[#C9A96E] border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white">Criando Nova Ótica</h3>
                <p className="text-amber-400 text-sm font-semibold animate-pulse">{currentStepText}</p>
              </div>
              <p className="text-slate-300 text-xs">
                Aguarde. O Supabase está alocando as credenciais de segurança e isolando o banco de dados.
              </p>
            </div>
          </div>
        )}

        {/* TELA DE SUCESSO / ERRO */}
        {creationResult && (
          <div className="bg-white border-2 border-[#C9A96E] rounded-3xl p-6 sm:p-8 shadow-xl max-w-2xl mx-auto text-center space-y-6 animate-in fade-in">
            {creationResult.success ? (
              <>
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-[#071D49]">Ótica Ativada com Sucesso!</h2>
                  <p className="text-slate-600 text-sm">
                    A loja **{nomeFantasia}** foi criada com RLS ativo no Supabase. O proprietário já pode logar.
                  </p>
                </div>

                <div className="bg-[#071D49]/95 text-left p-4 sm:p-5 rounded-2xl border border-[#C9A96E]/50 space-y-3 font-mono text-xs text-white max-w-md mx-auto">
                  <div className="text-amber-400 font-bold border-b border-[#C9A96E]/30 pb-1.5 uppercase text-[10px]">
                    Credenciais Geradas & Envio WhatsApp
                  </div>
                  <div><span className="text-slate-400">ID da Ótica (Tenant):</span> <span className="text-emerald-400 select-all">{creationResult.tenant_id}</span></div>
                  <div><span className="text-slate-400">E-mail do Dono:</span> <span className="text-slate-200 select-all">{emailProprietario}</span></div>
                  <div><span className="text-slate-400">Senha Provisória:</span> <span className="text-slate-200 select-all">{senhaProprietario}</span></div>
                  <div><span className="text-slate-400">Plano Selecionado:</span> <span className="text-slate-200 uppercase">{plano}</span></div>
                  {vendedores.length > 0 && (
                    <div><span className="text-slate-400">Equipe Inicial:</span> <span className="text-slate-200">{vendedores.join(', ')}</span></div>
                  )}
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 bg-[#071D49] hover:bg-[#0B255C] text-[#C9A96E] font-bold text-sm rounded-xl border border-[#C9A96E] cursor-pointer transition-all active:scale-95"
                  >
                    Cadastrar Outra Ótica
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <AlertCircle className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-red-600">Erro no Onboarding</h2>
                  <p className="text-slate-600 text-sm">{creationResult.message}</p>
                </div>
                <button
                  onClick={() => setCreationResult(null)}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-all cursor-pointer"
                >
                  Corrigir Formulário e Tentar Novamente
                </button>
              </>
            )}
          </div>
        )}

        {/* FORMULÁRIO DE GESTÃO - LAYOUT EM DUAS COLUNAS */}
        {!creationResult && (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* COLUNA ESQUERDA - FORMULÁRIO DE DADOS (3/5) */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* CARD 1 - DADOS DA ÓTICA */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-[#071D49] border-b border-slate-100 pb-2 uppercase tracking-wide flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#C9A96E]" />
                  1. Informações da Ótica (Empresa)
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Nome Fantasia *</label>
                    <input
                      type="text"
                      required
                      value={nomeFantasia}
                      onChange={e => setNomeFantasia(e.target.value)}
                      placeholder="Ex: Óticas Dioculos Matriz"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-[#071D49] transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Razão Social</label>
                    <input
                      type="text"
                      value={razaoSocial}
                      onChange={e => setRazaoSocial(e.target.value)}
                      placeholder="Ex: Dioculos Franquia Ltda"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-[#071D49] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">CNPJ *</label>
                    <input
                      type="text"
                      required
                      value={cnpj}
                      onChange={e => setCnpj(e.target.value)}
                      placeholder="Ex: 00.000.000/0001-00"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-[#071D49] transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Telefone Comercial</label>
                    <input
                      type="text"
                      value={telefoneLoja}
                      onChange={e => setTelefoneLoja(e.target.value)}
                      placeholder="Ex: (73) 98112-8923"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-[#071D49] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Endereço Completo</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={enderecoCompleto}
                      onChange={e => setEnderecoCompleto(e.target.value)}
                      placeholder="Ex: Rua 23 de Abril, 51, Centro, Ituberá - BA"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-[#071D49] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* CARD 2 - SELEÇÃO DE PLANO SAAS */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-[#071D49] border-b border-slate-100 pb-2 uppercase tracking-wide flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#C9A96E]" />
                  2. Configuração de Assinatura (Plano)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* CARD TRIAL */}
                  <label className={`border-2 rounded-xl p-3 flex flex-col justify-between cursor-pointer transition-all ${
                    plano === 'trial' ? 'border-[#C9A96E] bg-amber-500/5' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                  }`}>
                    <input 
                      type="radio" 
                      name="plano" 
                      value="trial" 
                      checked={plano === 'trial'}
                      onChange={() => setPlano('trial')}
                      className="sr-only" 
                    />
                    <div>
                      <div className="font-bold text-xs text-[#071D49]">Trial Grátis</div>
                      <div className="text-[10px] text-slate-500 mt-1">3 Dias de Acesso total para testes iniciais</div>
                    </div>
                    <div className="font-bold text-sm text-[#071D49] mt-3">R$ 0 / Grátis</div>
                  </label>

                  {/* CARD BÁSICO */}
                  <label className={`border-2 rounded-xl p-3 flex flex-col justify-between cursor-pointer transition-all ${
                    plano === 'basico' ? 'border-[#C9A96E] bg-amber-500/5' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                  }`}>
                    <input 
                      type="radio" 
                      name="plano" 
                      value="basico" 
                      checked={plano === 'basico'}
                      onChange={() => setPlano('basico')}
                      className="sr-only" 
                    />
                    <div>
                      <div className="font-bold text-xs text-[#071D49]">Plano Básico</div>
                      <div className="text-[10px] text-slate-500 mt-1">Até 150 OS/mês, CRM. Sem IA no WhatsApp.</div>
                    </div>
                    <div className="font-bold text-sm text-[#071D49] mt-3">R$ 199 /mês</div>
                  </label>

                  {/* CARD PRO MAX */}
                  <label className={`border-2 rounded-xl p-3 flex flex-col justify-between cursor-pointer transition-all ${
                    plano === 'promax' ? 'border-[#C9A96E] bg-amber-500/5' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                  }`}>
                    <input 
                      type="radio" 
                      name="plano" 
                      value="promax" 
                      checked={plano === 'promax'}
                      onChange={() => setPlano('promax')}
                      className="sr-only" 
                    />
                    <div>
                      <div className="font-bold text-xs text-[#071D49] flex items-center gap-1">
                        Pro Max <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500 animate-pulse" />
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">OS ilimitadas, Agente IA 24/7 e Multifiliais.</div>
                    </div>
                    <div className="font-bold text-sm text-[#071D49] mt-3">R$ 249 /mês</div>
                  </label>
                </div>
              </div>

              {/* CARD 3 - PROPRIETÁRIO (CEO) DA ÓTICA */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-[#071D49] border-b border-slate-100 pb-2 uppercase tracking-wide flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#C9A96E]" />
                  3. Proprietário (CEO da Nova Loja)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Nome do Proprietário *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={nomeProprietario}
                        onChange={e => setNomeProprietario(e.target.value)}
                        placeholder="Ex: João da Silva"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-[#071D49] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">WhatsApp Proprietário</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={phoneProprietario}
                        onChange={e => setPhoneProprietario(e.target.value)}
                        placeholder="Ex: (73) 99999-8888"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-[#071D49] transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">E-mail do Proprietário (Login) *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={emailProprietario}
                        onChange={e => setEmailProprietario(e.target.value)}
                        placeholder="Ex: joao@oticaexemplo.com"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-[#071D49] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-600">Senha Provisória *</label>
                      <button
                        type="button"
                        onClick={handleGeneratePassword}
                        className="text-[10px] text-[#C9A96E] hover:text-[#E8D2A8] font-black uppercase cursor-pointer"
                      >
                        Gerar Senha Forte ⚡
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={senhaProprietario}
                        onChange={e => setSenhaProprietario(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-10 py-2 text-xs focus:bg-white focus:outline-none focus:border-[#071D49] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUNA DIREITA - EQUIPE & PREVIEW CARD (2/5) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* CARD 4 - EQUIPE E VENDEDORES INICIAIS */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-[#071D49] border-b border-slate-100 pb-2 uppercase tracking-wide flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#C9A96E]" />
                  4. Equipe de Vendedores Inicial
                </h3>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={novoVendedor}
                    onChange={e => setNovoVendedor(e.target.value)}
                    placeholder="Nome do Vendedor"
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-[#071D49] transition-all"
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddVendedor())}
                  />
                  <button
                    type="button"
                    onClick={handleAddVendedor}
                    className="bg-[#071D49] hover:bg-[#0B255C] text-[#C9A96E] px-3.5 rounded-xl border border-[#C9A96E] flex items-center justify-center cursor-pointer transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {vendedores.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {vendedores.map((name, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700">{name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveVendedor(idx)}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-[11px] text-center italic py-2">
                    Nenhum vendedor adicionado. O proprietário poderá adicioná-los depois.
                  </p>
                )}
              </div>

              {/* CARD 5 - PREVIEW GERAL & CADASTRO */}
              <div className="bg-[#071D49] text-white border-2 border-[#C9A96E] rounded-3xl p-5 shadow-lg space-y-4 relative overflow-hidden">
                {/* Efeito Glow Dourado de Fundo */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A96E]/10 rounded-full blur-2xl pointer-events-none" />
                
                <h3 className="text-xs font-black text-[#C9A96E] uppercase tracking-widest border-b border-[#C9A96E]/30 pb-2">
                  Resumo de Ativação (Preview)
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ótica:</span>
                    <span className="font-black text-slate-200 max-w-[160px] truncate">
                      {nomeFantasia || 'A preencher...'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">CNPJ:</span>
                    <span className="font-bold text-slate-200">{cnpj || 'A preencher...'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Proprietário (CEO):</span>
                    <span className="font-bold text-slate-200 max-w-[150px] truncate">
                      {nomeProprietario || 'A preencher...'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">E-mail Proprietário:</span>
                    <span className="font-medium text-slate-200 max-w-[170px] truncate">
                      {emailProprietario || 'A preencher...'}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-[#C9A96E]/20 pt-2 text-[#C9A96E]">
                    <span className="font-bold uppercase tracking-wider text-[10px]">Plano:</span>
                    <span className="font-black uppercase">{plano}</span>
                  </div>
                </div>

                <div className="bg-[#0B255C] border border-[#C9A96E]/40 rounded-2xl p-3 text-[10px] text-slate-300 space-y-1">
                  <div className="flex items-center gap-1 font-bold text-[#E8D2A8]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                    Isolamento RLS Ativado
                  </div>
                  <p className="leading-relaxed">
                    Ao salvar, o Supabase criará automaticamente um hash Bcrypt para a senha do proprietário e associará os dados ao UUID de segurança.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#C9A96E] hover:bg-[#E8D2A8] text-[#071D49] font-black text-sm rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1"
                >
                  <ShieldCheck className="w-4 h-4 text-[#071D49]" />
                  <span>Finalizar e Ativar Ótica</span>
                </button>
              </div>

            </div>

          </form>
        )}
      </div>
    </div>
  );
};
