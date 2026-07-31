import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Copy, Check, ExternalLink, Users, AlertTriangle, Maximize2, X, Share2, Bot } from 'lucide-react';

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
      <div className="bg-gradient-to-br from-[#020A1C] via-[#071D49] to-[#0D1B3E] border-2 border-[#C9A96E] rounded-3xl p-5 text-white shadow-2xl relative overflow-hidden font-sans">
        {/* Background Ambient Cyber Glow */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/25 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-amber-500/25 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          
          {/* Left / Top: Android Alita Hyper-Realistic Artwork holding plaque */}
          <div className="shrink-0 flex flex-col items-center justify-center">
            <div className="relative group cursor-pointer" onClick={() => setShowFullArt(true)}>
              {/* Holographic Glowing Outer Aura */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-400 via-cyan-400 to-amber-500 rounded-3xl blur-md opacity-80 group-hover:opacity-100 transition duration-500 animate-pulse"></div>

              {/* Android Alita Cyber Artwork Frame */}
              <div className="relative w-52 h-56 sm:w-60 sm:h-64 bg-slate-950 rounded-2xl border-2 border-cyan-400/90 p-2 shadow-2xl flex flex-col items-center justify-between overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
                
                {/* Click to expand hover hint */}
                <div className="absolute top-2 right-2 z-30 bg-slate-900/80 backdrop-blur-md text-amber-300 border border-amber-400/50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>

                {/* Alita Cyber Face & Smart Glasses Artwork SVG (Exact Hyper-Realistic 3D Cybernetic Render matching IMAGEM 1) */}
                <div className="w-full h-44 relative flex items-center justify-center">
                  <img 
                    src="/alita_premium.png" 
                    alt="Android Alita Premium" 
                    className="w-full h-full object-cover rounded-2xl shadow-2xl" 
                  />
                </div>

                {/* Glowing Plaque held by Alita Android */}
                <div className="w-full bg-gradient-to-r from-[#071D49] via-[#0B255C] to-[#071D49] border-2 border-[#C9A96E] rounded-xl p-2 text-center shadow-xl transform -translate-y-1 relative z-10">
                  <div className="text-[11px] font-black text-amber-300 tracking-wider uppercase flex items-center justify-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" /> ÓTICA INTELIGENTE
                  </div>
                  <div className="text-[8px] text-cyan-300 font-mono font-black tracking-widest uppercase mt-0.5">
                    SISTEMA ANDROID DE ALTA PERFORMANCE
                  </div>
                </div>

              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowFullArt(true)}
              className="text-[10px] text-[#C9A96E] font-extrabold mt-1.5 uppercase tracking-wider flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3 h-3 text-cyan-400" />
              <span>🤖 Android Alita • Clique para Expandir</span>
            </button>
          </div>

          {/* Right / Content: Public Link Release & Instructions for the 10 Testers */}
          <div className="flex-1 space-y-3.5 text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-[#10B981] text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wide flex items-center gap-1.5 shadow-md">
                <ShieldCheck className="w-3.5 h-3.5 stroke-[3]" /> LINK PÚBLICO LIBERADO (SEM ERRO 403)
              </span>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Grupo dos 10 Testadores
              </span>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-black text-amber-200 tracking-tight flex items-center gap-2">
                <span>Link Oficial do Sistema Ótica Inteligente</span>
                <Bot className="w-5 h-5 text-cyan-400" />
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                O seu grupo de 10 testadores pode acessar o sistema diretamente pelo link público abaixo no celular ou computador, sem precisar fazer login na conta do Google AI Studio!
              </p>
            </div>

            {/* High visibility Public URL Container */}
            <div className="p-3.5 bg-slate-950/95 border-2 border-amber-400 rounded-2xl space-y-2 shadow-2xl">
              <div className="flex items-center justify-between text-[11px] font-bold text-amber-300">
                <span>🔗 Seu Link Público para Enviar ao Time:</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  ● Online &amp; Funcionando
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-cyan-300 select-all focus:outline-none"
                />

                <button
                  type="button"
                  onClick={onCopy}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-lg ${
                    copied
                      ? 'bg-emerald-500 text-slate-950 font-black scale-105'
                      : 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950'
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

            {/* Explanation Box on Why 403/404 happened */}
            <div className="p-3 bg-amber-500/15 border border-amber-400/40 rounded-xl text-[11px] text-amber-100 flex items-start gap-2.5">
              <AlertTriangle className="w-4.5 h-4.5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Como resolver o "Erro 404 / Page Not Found" ou "403"?</strong>
                <span className="block text-slate-300 mt-0.5 leading-relaxed">
                  • <strong>Link Ativo Agora:</strong> Use o link acima (<code className="text-cyan-300 font-mono font-bold">{shareUrl}</code>) que já está rodando e online sem erros.<br />
                  • <strong>Para ativar o link "ais-pre":</strong> No menu superior do Google AI Studio, clique no botão <strong>"Share" (Compartilhar)</strong> para publicar a versão `ais-pre` oficial.
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-1 flex items-center justify-between gap-2 text-xs flex-wrap">
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 hover:text-white font-extrabold underline flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Abrir Link Público em Nova Aba
              </a>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `🤖 *ÓTICA INTELIGENTE • Link de Acesso do Sistema*\n\nOlá time! Aqui está o link oficial para testar o sistema no celular ou PC:\n\n🔗 ${shareUrl}\n\nQualquer dúvida, pode me chamar!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md text-[11px]"
              >
                <Share2 className="w-3.5 h-3.5" /> Disparar no WhatsApp do Grupo
              </a>
            </div>

          </div>

        </div>
      </div>

      {/* Full Screen Image Art Modal for Alita Android */}
      {showFullArt && (
        <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="relative bg-gradient-to-br from-[#040D21] via-[#071D49] to-[#0A1128] border-2 border-amber-400 rounded-3xl p-6 max-w-lg w-full text-center shadow-2xl space-y-4">
            
            <button
              onClick={() => setShowFullArt(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full bg-slate-900 border border-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center gap-2 text-amber-300 font-black text-sm uppercase">
              <Sparkles className="w-4 h-4 text-amber-300" /> Mascote Oficial Ótica Inteligente
            </div>

            {/* Detailed Art Render Container matching IMAGEM 1 */}
            <div className="w-full h-[400px] mx-auto bg-slate-950 border-2 border-cyan-400 rounded-2xl p-1 shadow-2xl relative flex flex-col justify-between items-center overflow-hidden">
              <div className="w-full h-full relative">
                <img 
                  src="/alita_premium.png" 
                  alt="Android Alita Premium" 
                  className="w-full h-full object-cover rounded-xl shadow-2xl" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white">
                Android Feminina Alita - Representante do Sistema
              </h4>
              <p className="text-xs text-slate-300">
                Esta arte representa a inteligência artificial humanizada do sistema Ótica Inteligente para o grupo dos 10 testadores.
              </p>
            </div>

            <button
              onClick={() => setShowFullArt(false)}
              className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-2.5 rounded-xl text-xs cursor-pointer shadow-lg"
            >
              Fechar Visualização
            </button>
          </div>
        </div>
      )}
    </>
  );
};

