import React, { useState } from 'react';
import { Sparkles, Copy, Check, ExternalLink, Maximize2, X, Share2, Bot, ShieldCheck, Zap } from 'lucide-react';

interface AlitaOticaInteligenteBannerProps {
  shareUrl?: string;
  onCopy?: () => void;
  copied?: boolean;
}

export const AlitaOticaInteligenteBanner: React.FC<AlitaOticaInteligenteBannerProps> = ({
  shareUrl = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://ais-dev-qz7lavammczznxwgiawjko-248777919228.us-east5.run.app',
  onCopy,
  copied,
}) => {
  const [showFullArt, setShowFullArt] = useState(false);

  return (
    <>
      {/* Luxury Glassmorphic Executive Container */}
      <div className="bg-gradient-to-br from-[#0F172A] via-[#141C2D] to-[#0A0E17] border border-[#D4AF37]/30 rounded-3xl p-4 sm:p-6 text-white shadow-2xl relative overflow-hidden font-sans backdrop-blur-xl">
        {/* Soft Ambient Gold & Cyan Blurs */}
        <div className="absolute -top-16 -right-16 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 relative z-10">
          
          {/* Left: Alita AI 3D Cyber Portrait Card */}
          <div className="shrink-0 flex flex-col items-center justify-center">
            <div 
              className="relative group cursor-pointer" 
              onClick={() => setShowFullArt(true)}
              title="Clique para expandir a arte da Alita AI"
            >
              {/* Subtle Gold Pulse Outline */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-[#D4AF37] via-amber-200 to-[#D4AF37]/40 rounded-2xl blur-sm opacity-60 group-hover:opacity-100 transition duration-500" />

              {/* Compact Frame */}
              <div className="relative w-44 h-48 sm:w-52 sm:h-56 bg-[#0B0F17] rounded-xl border border-[#D4AF37]/40 p-2 shadow-2xl flex flex-col items-center justify-between overflow-hidden">
                
                <div className="absolute top-2 right-2 z-30 bg-[#0F172A]/90 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/40 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>

                <div className="w-full h-36 relative flex items-center justify-center overflow-hidden rounded-lg">
                  <img 
                    src="/alita_premium.png" 
                    alt="Alita AI Executive Assistant" 
                    className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>

                {/* Status Plaque */}
                <div className="w-full bg-[#161D2A]/95 border border-[#D4AF37]/40 rounded-lg p-1.5 text-center shadow-lg transform -translate-y-0.5">
                  <div className="text-[10px] font-black text-[#D4AF37] tracking-wider uppercase flex items-center justify-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" /> ALITA AI SPECIALIST
                  </div>
                  <div className="text-[8px] text-emerald-400 font-mono font-bold tracking-wider uppercase mt-0.5 flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ONLINE &bull; ALTA PERFORMANCE
                  </div>
                </div>

              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowFullArt(true)}
              className="text-[10px] text-[#D4AF37] font-bold mt-2 uppercase tracking-widest flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3 h-3 text-[#D4AF37]" />
              <span>Expandir Visualização</span>
            </button>
          </div>

          {/* Right: Executive Info & Access Link */}
          <div className="flex-1 space-y-3.5 text-left w-full">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> Sistema Conectado VIP
                </span>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3 h-3 text-emerald-400" /> Multi-Equipe
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Painel de Inteligência &amp; Gestão Ótica</span>
                <Bot className="w-5 h-5 text-[#D4AF37]" />
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Acesso direto e ilimitado para toda a equipe de consultores e optometristas.
              </p>
            </div>

            {/* Clean Access Bar Container */}
            <div className="p-3 bg-[#0B0F17]/90 border border-[#D4AF37]/30 rounded-2xl space-y-2 shadow-xl">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-300">
                <span className="flex items-center gap-1.5 font-semibold text-white">
                  🔗 Link Oficial de Acesso da Sua Ótica:
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Ativo &amp; Seguro
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="w-full bg-[#161D2A] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono font-semibold text-[#D4AF37] select-all focus:outline-none"
                />

                <button
                  type="button"
                  onClick={onCopy}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-lg ${
                    copied
                      ? 'bg-emerald-500 text-slate-950 font-black scale-105'
                      : 'bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:from-[#E5C158] hover:to-amber-400 text-slate-950 shadow-[#D4AF37]/10'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" /> Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copiar Link
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Executive Actions */}
            <div className="pt-1 flex items-center justify-between gap-3 text-xs flex-wrap">
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4AF37] hover:text-white font-bold underline flex items-center gap-1 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Abrir Sistema em Nova Aba
              </a>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `🤖 *ÓTICA INTELIGENTE • Link de Acesso do Sistema*\n\nOlá equipe! Aqui está o link oficial para acessar o sistema:\n\n🔗 ${shareUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md text-[11px] transition-all border border-emerald-400/30"
              >
                <Share2 className="w-3.5 h-3.5" /> Enviar para a Equipe no WhatsApp
              </a>
            </div>

          </div>

        </div>
      </div>

      {/* Full Screen Image Art Modal for Alita Android */}
      {showFullArt && (
        <div className="fixed inset-0 z-[200] bg-[#05080E]/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="relative bg-gradient-to-br from-[#0B0F17] via-[#141C2D] to-[#0A0E17] border border-[#D4AF37]/50 rounded-3xl p-6 max-w-lg w-full text-center shadow-2xl space-y-4">
            
            <button
              onClick={() => setShowFullArt(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full bg-[#161D2A] border border-white/10 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[#D4AF37] font-black text-sm uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Alita AI Specialist &bull; Assistente Executiva
            </div>

            <div className="w-full h-[380px] mx-auto bg-[#0B0F17] border border-[#D4AF37]/40 rounded-2xl p-1 shadow-2xl relative flex flex-col justify-between items-center overflow-hidden">
              <div className="w-full h-full relative">
                <img 
                  src="/alita_premium.png" 
                  alt="Alita AI Executive Assistant" 
                  className="w-full h-full object-cover rounded-xl shadow-2xl" 
                />
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">
                Inteligência Artificial Nativa da Ótica Inteligente
              </h4>
              <p className="text-xs text-slate-300">
                Atua no suporte a vendas, cotações de lentes de alta tecnologia e fidelização de clientes.
              </p>
            </div>

            <button
              onClick={() => setShowFullArt(false)}
              className="w-full bg-[#D4AF37] hover:bg-[#E5C158] text-slate-950 font-extrabold py-2.5 rounded-xl text-xs cursor-pointer shadow-lg transition-colors"
            >
              Fechar Visualização
            </button>
          </div>
        </div>
      )}
    </>
  );
};


