import React from 'react';
import {
  Sparkles,
  TrendingUp,
  Clock,
  Users,
  Target,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  Award,
  CheckCircle2
} from 'lucide-react';
import { Seller, UserRole } from '../../types/sellers';

interface AiSalesAssistantSubViewProps {
  currentRole: UserRole;
  currentSeller: Seller;
}

export const AiSalesAssistantSubView: React.FC<AiSalesAssistantSubViewProps> = ({
  currentRole,
  currentSeller,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#071D49] via-[#0B255C] to-[#071D49] p-6 rounded-3xl border-2 border-[#C9A96E]/50 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-[#C9A96E]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="p-3 bg-[#C9A96E]/20 border border-[#C9A96E]/50 rounded-2xl text-[#E8D2A8] shrink-0">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#C9A96E] text-[#071D49] px-2.5 py-0.5 rounded-full">
              MÓDULO IA ERP ÓTICAS DI ÓCULOS
            </span>
            <h1 className="text-lg sm:text-xl font-black text-[#E8D2A8] mt-1">
              Inteligência Artificial de Performance & Coaching de Vendas
            </h1>
            <p className="text-xs text-slate-300">
              Análise preditiva de conversão, horários de pico, perfil de clientes e sugestões para bater metas
            </p>
          </div>
        </div>
      </div>

      {/* Main Analysis Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Taxa de Conversão */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
            Taxa de Conversão de Atendimentos
          </span>
          <div className="text-2xl font-black text-[#071D49]">68.4%</div>
          <p className="text-xs text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> +5.2% acima da média da filial
          </p>
        </div>

        {/* Metric 2: Horários de Pico */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
            Horários de Maior Conversão
          </span>
          <div className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#C9A96E]" /> 10h às 12h & 16h às 18h
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Maior fluxo de prescrições de oftamologistas locais
          </p>
        </div>

        {/* Metric 3: Perfil dos Clientes */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
            Perfil Predominante de Comprador
          </span>
          <div className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#C9A96E]" /> Presbiopia 40+ (Multifocal)
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Média de Ticket: R$ 2.450 (Armação + Varilux/Zeiss)
          </p>
        </div>

        {/* Metric 4: Oportunidades de Upsell */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
            Oportunidades de Upsell Perdidas
          </span>
          <div className="text-2xl font-black text-amber-700">R$ 4.200</div>
          <p className="text-xs text-slate-500 font-medium">
            12 clientes compraram Lente sem Antirreflexo Blue
          </p>
        </div>

      </div>

      {/* AI Recommendations & Coaching Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Sugestões de Melhoria e Vendas */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h3 className="text-xs font-black text-[#071D49] uppercase tracking-wider">
              Sugestões Personalizadas da IA para Aumentar Comissão
            </h3>
          </div>

          <ul className="space-y-3 text-xs text-slate-700 font-medium">
            <li className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-2.5">
              <span className="text-base">💡</span>
              <div>
                <strong className="text-amber-900 block font-bold">Oferecer Antirreflexo Crizal/BlueControl em 100% dos exames:</strong>
                <p className="mt-0.5 text-slate-600">
                  Adicionar o tratamento Blue aumenta o ticket médio em R$ 250 e gera +8% de comissão direta por venda.
                </p>
              </div>
            </li>

            <li className="p-3 bg-blue-50 rounded-2xl border border-blue-200 flex items-start gap-2.5">
              <span className="text-base">🕶️</span>
              <div>
                <strong className="text-blue-900 block font-bold">Aproveitar a promoção de Varilux XR com 2º par Solar prescrito:</strong>
                <p className="mt-0.5 text-slate-600">
                  Ao oferecer a lente multifocal, ofereça 50% de desconto no segundo par para óculos de sol prescrito.
                </p>
              </div>
            </li>

            <li className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-2.5">
              <span className="text-base">📞</span>
              <div>
                <strong className="text-emerald-900 block font-bold">Resgatar 5 Orçamentos de Óculos Multifocais pendentes:</strong>
                <p className="mt-0.5 text-slate-600">
                  A IA identificou 5 clientes com orçamentos abertos na semana passada. Um contato via WhatsApp pode converter R$ 8.500 em vendas.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Treinamentos e Oportunidades Perdidas */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <BookOpen className="w-5 h-5 text-[#071D49]" />
            <h3 className="text-xs font-black text-[#071D49] uppercase tracking-wider">
              Treinamentos & Oportunidades Ópticas Recomendadas
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex justify-between font-extrabold text-slate-900">
                <span>🎓 Treinamento: Apresentação de Lentes Varilux XR</span>
                <span className="text-emerald-700 font-bold">Módulo 15 min</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Aprenda a explicar ao cliente os benefícios da inteligência comportamental da Varilux para aumentar conversão em 30%.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex justify-between font-extrabold text-slate-900">
                <span>📐 Treinamento: Tomada de DNP com Câmera IA Mary</span>
                <span className="text-emerald-700 font-bold">Módulo 10 min</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Técnicas de medição rápida e precisa da altura focal para evitar adaptações incorretas em lentes multifocais.
              </p>
            </div>

            <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 space-y-1">
              <div className="flex justify-between font-extrabold text-purple-900">
                <span>⭐ Oportunidade: Campanha de Julho Multifocais</span>
                <span className="text-purple-800 font-black">Faltam 2 vendas</span>
              </div>
              <p className="text-purple-700 text-[11px]">
                Faltam apenas 2 vendas de multifocal para você atingir a meta da campanha e garantir o Bônus de R$ 1.000,00!
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
