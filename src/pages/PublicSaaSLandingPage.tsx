import React from 'react';
import {
  Glasses,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Users,
  Award,
  Bot,
  Layers,
  Check,
  Star,
  FileText,
  DollarSign
} from 'lucide-react';
import { useTenant } from '../context/TenantContext';

interface PublicSaaSLandingPageProps {
  onSelectPlan: (planCode: string) => void;
  onOpenApp: () => void;
}

export const PublicSaaSLandingPage: React.FC<PublicSaaSLandingPageProps> = ({
  onSelectPlan,
  onOpenApp,
}) => {
  const { availablePlans } = useTenant();

  return (
    <div className="min-h-screen bg-[#071D49] text-white flex flex-col font-sans selection:bg-[#D4AF37] selection:text-slate-950">
      
      {/* 👑 NAVBAR INSTITUCIONAL */}
      <header className="border-b border-[#C9A96E]/20 bg-[#071D49]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-amber-400 p-0.5 shadow-lg shadow-[#D4AF37]/20">
              <div className="w-full h-full bg-[#071D49] rounded-[14px] flex items-center justify-center">
                <Glasses className="w-6 h-6 text-[#D4AF37]" />
              </div>
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-[#E8D2A8] block leading-none">
                ÓTICA INTELIGENTE <span className="text-[#D4AF37] text-xs font-normal">SAAS 2.0</span>
              </span>
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Plataforma Multi-Óticas</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenApp}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all border border-white/20 cursor-pointer"
            >
              Área da Ótica
            </button>
            <button
              onClick={() => onSelectPlan('pro-max')}
              className="px-5 py-2 bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:from-[#E5C158] hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer border border-amber-300/40 active:scale-95"
            >
              Começar Agora
            </button>
          </div>
        </div>
      </header>

      {/* 🚀 HERO BANNER */}
      <section className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 text-center space-y-8">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 text-[#E8D2A8] border border-[#D4AF37]/40 text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" /> O Sistema #1 para Redes de Óticas e Laboratórios
          </span>

          <h1 className="text-3xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Transforme sua Ótica em uma Potência Digital com <span className="text-[#D4AF37] underline decoration-[#D4AF37]/40">Inteligência Artificial</span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-200 font-medium max-w-2xl mx-auto">
            Ordens de serviço inteligentes, biometria facial DNP 3D, leitor de receitas por câmera e fluxo de caixa executivo em um único sistema multi-tenant isolado.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 relative z-10 pt-2">
          <button
            onClick={() => onSelectPlan('pro-max')}
            className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] via-amber-400 to-[#E8D2A8] hover:from-[#E5C158] hover:to-amber-300 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-[#D4AF37]/30 transition-all cursor-pointer border-2 border-amber-200 active:scale-95 flex items-center gap-2"
          >
            <span>Criar Minha Ótica Agora</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => onSelectPlan('basic')}
            className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-2xl transition-all border border-white/20 cursor-pointer"
          >
            Ver Tabela de Planos
          </button>
        </div>

        {/* Feature Badges */}
        <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto relative z-10 text-xs">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
            <Bot className="w-6 h-6 text-[#D4AF37]" />
            <div className="text-left"><strong className="block text-white">IA Mary 3D</strong> Biometria DNP</div>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <div className="text-left"><strong className="block text-white">100% Isolado</strong> RLS por Tenant</div>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
            <Zap className="w-6 h-6 text-amber-400" />
            <div className="text-left"><strong className="block text-white">WhatsApp API</strong> Avisos de OS</div>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
            <Award className="w-6 h-6 text-sky-400" />
            <div className="text-left"><strong className="block text-white">White-Label</strong> Sua Marca &amp; Logo</div>
          </div>
        </div>
      </section>

      {/* 💎 TABELA DINÂMICA DE PLANOS */}
      <section className="bg-slate-900/90 py-16 px-4 sm:px-6 border-t border-[#C9A96E]/20 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black text-[#D4AF37] uppercase tracking-widest">Assinatura Transparente</span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">Planos que Cabem no seu Negócio</h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Sem taxas escondidas. Cancele ou altere a qualquer momento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {availablePlans.map((plan) => {
            const isProMax = plan.code === 'pro-max';
            return (
              <div
                key={plan.id}
                className={`p-6 sm:p-8 rounded-3xl border-2 flex flex-col justify-between space-y-6 relative transition-all ${
                  isProMax
                    ? 'border-[#D4AF37] bg-gradient-to-br from-[#071D49] to-[#0B255C] shadow-2xl ring-2 ring-[#D4AF37]/30'
                    : 'border-slate-700 bg-slate-800/80 text-white'
                }`}
              >
                {isProMax && (
                  <span className="absolute -top-3.5 right-6 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase shadow-md">
                    👑 Recomendado pelo CEO
                  </span>
                )}

                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-black text-[#D4AF37] uppercase tracking-widest">{plan.code.toUpperCase()}</span>
                    <h3 className="text-2xl font-black text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-300 font-medium">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1 py-2 border-y border-white/10">
                    <span className="text-4xl font-black text-[#E8D2A8]">R$ {plan.monthlyPrice.toFixed(2)}</span>
                    <span className="text-xs text-slate-400 font-bold">/mês</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-200 font-medium">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#D4AF37]" />
                      <span>Ordens de Serviço &amp; Rastreio de Laboratório</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#D4AF37]" />
                      <span>Caixa Executivo e CRM de Clientes Completo</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#D4AF37]" />
                      <span>{isProMax ? 'Múltiplos Usuários e Vendedores ILIMITADOS' : 'Até 5 colaboradores'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#D4AF37]" />
                      <span>{isProMax ? 'Inteligência Artificial Mary 3D &amp; Provador Virtual' : 'Módulos Essenciais'}</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => onSelectPlan(plan.code)}
                  className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    isProMax
                      ? 'bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:from-[#E5C158] hover:to-amber-400 text-slate-950 shadow-lg'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  }`}
                >
                  Assinar {plan.name}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-4 text-center border-t border-white/10 text-xs text-slate-400 space-y-2">
        <div>Óticas Di Óculos Plataforma Multi-Óticas SaaS 2.0 • Todos os direitos reservados.</div>
        <div className="text-[10px] text-slate-500 font-mono">
          Ambiente Seguro com Isolamento RLS • Mercado Pago Checkout Encaminhado
        </div>
      </footer>

    </div>
  );
};
