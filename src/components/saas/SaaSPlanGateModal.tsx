import React, { useState } from 'react';
import { Check, ShieldCheck, Zap, Crown, Sparkles, Clock, Lock } from 'lucide-react';

interface SaaSPlanGateModalProps {
  isOpen: boolean;
  onClose?: () => void;
  userEmail: string;
  daysRemainingInTrial: number; // Ex: 3, 2, 1, 0
  currentPlan: 'trial' | 'basico' | 'promax';
}

export const SaaSPlanGateModal: React.FC<SaaSPlanGateModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  daysRemainingInTrial,
  currentPlan,
}) => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  if (!isOpen) return null;

  const isTrialExpired = daysRemainingInTrial <= 0 && currentPlan === 'trial';

  const handleSelectPlan = async (plan: 'basico' | 'promax') => {
    setLoadingPlan(plan);
    try {
      const response = await fetch('/api/payments/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, plan }),
      });

      const data = await response.json();

      if (data.initPoint) {
        // Redireciona o cliente para o checkout seguro do Mercado Pago
        window.location.href = data.initPoint;
      } else {
        alert('Assinatura iniciada com sucesso!');
      }
    } catch (err) {
      alert('Erro ao conectar com o Mercado Pago. Tente novamente.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#071D49] border-2 border-[#C9A96E] rounded-3xl max-w-4xl w-full p-6 sm:p-8 text-white shadow-2xl relative">
        
        {/* Cabeçalho do Modal */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 bg-[#C9A96E]/20 border border-[#C9A96E] px-4 py-1.5 rounded-full text-[#C9A96E] text-xs font-black uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            {isTrialExpired ? 'Seu Período de Teste de 3 Dias Expirou' : `Teste Grátis Ativo: ${daysRemainingInTrial} dia(s) restante(s)`}
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white text-center">
            Escolha o Plano Ideal para a Sua Ótica
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto text-center">
            Aumente o faturamento da sua ótica com gestão automatizada de Ordens de Serviço, CRM e Inteligência Artificial no WhatsApp.
          </p>
        </div>

        {/* Grade de Planos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* PLANO BÁSICO */}
          <div className="bg-[#0B255C]/80 border border-[#C9A96E]/40 hover:border-[#C9A96E] rounded-2xl p-6 flex flex-col justify-between transition-all hover:scale-[1.02]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-black text-slate-200 uppercase tracking-wide">Plano Básico</span>
                <Zap className="w-6 h-6 text-slate-400" />
              </div>
              <div className="mb-6">
                <span className="text-4xl font-black text-white">R$ 199</span>
                <span className="text-slate-400 text-sm"> /mês</span>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-300 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Até 150 Ordens de Serviço / mês
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> CRM de Clientes e Receitas Completo
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Impressão de OS em Térmica e A4
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> WhatsApp Manual com 1-Clique
                </li>
                <li className="flex items-center gap-2 text-slate-500 line-through">
                  <Lock className="w-3.5 h-3.5 text-slate-500" /> Agente IA no WhatsApp (Atendimento Auto)
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan('basico')}
              disabled={loadingPlan === 'basico'}
              className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-extrabold rounded-xl transition-all border border-slate-500 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {loadingPlan === 'basico' ? 'Processando...' : 'Assinar Plano Básico'}
            </button>
          </div>

          {/* PLANO PRO MAX (DESTAQUE) */}
          <div className="bg-gradient-to-b from-[#0B255C] to-[#071D49] border-2 border-[#C9A96E] rounded-2xl p-6 flex flex-col justify-between relative shadow-[0_0_30px_rgba(201,169,110,0.3)] hover:scale-[1.02] transition-all">
            <div className="absolute -top-3.5 right-6 bg-[#C9A96E] text-[#071D49] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
              Mais Vendido ⭐
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-6 h-6 text-[#C9A96E]" />
                <span className="text-xl font-black text-[#C9A96E] uppercase tracking-wide">Plano Pro Max</span>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-black text-white">R$ 249</span>
                <span className="text-slate-300 text-sm"> /mês</span>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-200 mb-6">
                <li className="flex items-center gap-2 font-bold text-white">
                  <Check className="w-4 h-4 text-amber-400" /> Ordens de Serviço ILIMITADAS
                </li>
                <li className="flex items-center gap-2 font-bold text-emerald-300">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> Agente IA WhatsApp Atendimento 24/7
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400" /> Laboratório Inteligente (Smart OS 12 Etapas)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400" /> Multi-Filiais (Até 5 lojas)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400" /> Suporte Prioritário VIP no WhatsApp
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan('promax')}
              disabled={loadingPlan === 'promax'}
              className="w-full py-3.5 bg-[#C9A96E] hover:bg-[#E8D2A8] text-[#071D49] font-black text-base rounded-xl transition-all shadow-lg cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {loadingPlan === 'promax' ? 'Processando...' : 'Quero o Plano Pro Max com IA'}
            </button>
          </div>

        </div>

        {/* Rodapé de Segurança */}
        <div className="mt-8 pt-4 border-t border-[#C9A96E]/20 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Pagamento Seguro via Mercado Pago (Pix e Cartão)</span>
          </div>
          <div>Cancele ou altere seu plano a qualquer momento sem fidelidade.</div>
        </div>

      </div>
    </div>
  );
};
