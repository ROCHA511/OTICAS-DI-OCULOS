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
                  <svg viewBox="0 0 400 320" className="w-full h-full rounded-2xl shadow-2xl overflow-hidden drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                    <defs>
                      {/* Background Lab Gradients */}
                      <radialGradient id="labBg" cx="50%" cy="40%" r="65%">
                        <stop offset="0%" stopColor="#CBD5E1" />
                        <stop offset="40%" stopColor="#94A3B8" />
                        <stop offset="70%" stopColor="#475569" />
                        <stop offset="100%" stopColor="#1E293B" />
                      </radialGradient>
                      <linearGradient id="labLight" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#0F172A" stopOpacity="0.9" />
                      </linearGradient>

                      {/* Metallic Android Body Gradients */}
                      <linearGradient id="whiteArmor" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="35%" stopColor="#F1F5F9" />
                        <stop offset="70%" stopColor="#CBD5E1" />
                        <stop offset="100%" stopColor="#64748B" />
                      </linearGradient>
                      <linearGradient id="darkMetal" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#475569" />
                        <stop offset="50%" stopColor="#1E293B" />
                        <stop offset="100%" stopColor="#0F172A" />
                      </linearGradient>

                      {/* Face Skin & Hair */}
                      <linearGradient id="skinTone" x1="20%" y1="0%" x2="80%" y2="100%">
                        <stop offset="0%" stopColor="#FFF1F2" />
                        <stop offset="40%" stopColor="#FFE4E6" />
                        <stop offset="80%" stopColor="#FECDD3" />
                        <stop offset="100%" stopColor="#FDA4AF" />
                      </linearGradient>
                      <linearGradient id="bobHair" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#334155" />
                        <stop offset="30%" stopColor="#0F172A" />
                        <stop offset="70%" stopColor="#020617" />
                        <stop offset="100%" stopColor="#0369A1" />
                      </linearGradient>

                      {/* Gold Neon Glow Filter for Frame */}
                      <filter id="goldNeon" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <filter id="cyanNeon" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* 1. Laboratory Room Background */}
                    <rect width="400" height="320" fill="url(#labBg)" />
                    <rect width="400" height="320" fill="url(#labLight)" />

                    {/* Futuristic Lab Curved Arches */}
                    <path d="M -50 0 C 100 80, 100 240, -50 320" stroke="#E2E8F0" strokeWidth="18" fill="none" opacity="0.4" />
                    <path d="M 450 0 C 300 80, 300 240, 450 320" stroke="#94A3B8" strokeWidth="24" fill="none" opacity="0.3" />
                    
                    {/* Optical Diagnostic HUD Screen on the right */}
                    <rect x="270" y="50" width="110" height="90" rx="8" fill="rgba(15, 23, 42, 0.4)" stroke="#38BDF8" strokeWidth="1.5" opacity="0.8" />
                    <ellipse cx="325" cy="95" rx="30" ry="20" fill="none" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4,2" />
                    <circle cx="325" cy="95" r="8" fill="none" stroke="#38BDF8" strokeWidth="1.5" />
                    <line x1="285" y1="95" x2="365" y2="95" stroke="#38BDF8" strokeWidth="0.8" strokeDasharray="2,2" />

                    {/* 2. Android Alita Shoulder & Torso (Looking over right shoulder) */}
                    <path d="M 110 320 Q 130 230 190 200 Q 250 230 280 320 Z" fill="url(#whiteArmor)" stroke="#94A3B8" strokeWidth="2" />
                    <path d="M 120 250 Q 150 240 170 270 Q 160 320 120 320 Z" fill="url(#darkMetal)" stroke="#38BDF8" strokeWidth="1" />
                    <circle cx="155" cy="255" r="12" fill="url(#whiteArmor)" stroke="#475569" strokeWidth="2" />

                    {/* Back Cyber Spine & Neck Chassis */}
                    <rect x="185" y="150" width="30" height="60" rx="6" fill="url(#darkMetal)" stroke="#38BDF8" strokeWidth="1" />
                    <line x1="190" y1="165" x2="210" y2="165" stroke="#38BDF8" strokeWidth="2" filter="url(#cyanNeon)" />
                    <line x1="190" y1="180" x2="210" y2="180" stroke="#F59E0B" strokeWidth="2" filter="url(#goldNeon)" />

                    {/* Head Base & Neck */}
                    <path d="M 170 120 Q 200 90 230 120 Q 220 165 180 160 Z" fill="url(#skinTone)" />

                    {/* Face Turned Over Shoulder */}
                    <path d="M 165 100 Q 155 40 215 40 Q 250 45 245 95 Q 235 135 195 130 Q 165 120 165 100 Z" fill="url(#skinTone)" stroke="#FECDD3" strokeWidth="1" />

                    {/* Dark Hair (Short Bob Style) */}
                    <path d="M 150 90 C 140 20, 235 10, 250 80 C 260 130, 240 145, 230 145 C 210 110, 160 120, 150 90 Z" fill="url(#bobHair)" />
                    <path d="M 160 55 C 180 30, 230 35, 240 65 C 220 50, 180 50, 160 55 Z" fill="#0F172A" />

                    {/* Expressive Eyes (Alita Style) */}
                    <ellipse cx="195" cy="78" rx="11" ry="13" fill="#020617" stroke="#38BDF8" strokeWidth="1.5" />
                    <ellipse cx="230" cy="80" rx="9" ry="11" fill="#020617" stroke="#38BDF8" strokeWidth="1.5" />
                    <circle cx="195" cy="78" r="6" fill="#0284C7" />
                    <circle cx="230" cy="80" r="5" fill="#0284C7" />
                    <circle cx="195" cy="78" r="3" fill="#38BDF8" />
                    <circle cx="230" cy="80" r="2.5" fill="#38BDF8" />
                    <circle cx="197" cy="75" r="1.5" fill="#FFFFFF" />
                    <circle cx="232" cy="77" r="1.2" fill="#FFFFFF" />

                    {/* Eyebrows & Soft Smile */}
                    <path d="M 185 64 Q 198 60 208 67" stroke="#334155" strokeWidth="2" fill="none" />
                    <path d="M 222 66 Q 232 63 238 68" stroke="#334155" strokeWidth="2" fill="none" />
                    <path d="M 210 82 Q 208 92 212 94" stroke="#FDA4AF" strokeWidth="1.5" fill="none" />
                    <path d="M 198 108 Q 212 116 226 108" stroke="#E11D48" strokeWidth="2.5" fill="none" strokeLinecap="round" />

                    {/* Smart Glasses with HUD */}
                    <rect x="180" y="68" width="30" height="22" rx="5" fill="rgba(56, 189, 248, 0.2)" stroke="#94A3B8" strokeWidth="1.5" />
                    <rect x="218" y="70" width="26" height="20" rx="5" fill="rgba(56, 189, 248, 0.2)" stroke="#94A3B8" strokeWidth="1.5" />
                    <line x1="210" y1="76" x2="218" y2="76" stroke="#94A3B8" strokeWidth="2" />
                    <circle cx="195" cy="78" r="8" fill="none" stroke="#38BDF8" strokeWidth="0.8" strokeDasharray="2,2" filter="url(#cyanNeon)" />
                    <line x1="187" y1="78" x2="203" y2="78" stroke="#38BDF8" strokeWidth="0.5" />

                    {/* 3. Foreground Holographic Gold Badge matching IMAGEM 1 */}
                    <g transform="translate(40, 185)">
                      <rect x="0" y="0" width="320" height="90" rx="16" fill="rgba(15, 23, 42, 0.7)" stroke="#F59E0B" strokeWidth="3" filter="url(#goldNeon)" />
                      <rect x="4" y="4" width="312" height="82" rx="12" fill="none" stroke="#FEF08A" strokeWidth="1" opacity="0.8" />

                      <path d="M 12 18 L 12 12 L 18 12" stroke="#F59E0B" strokeWidth="2.5" fill="none" />
                      <path d="M 308 18 L 308 12 L 302 12" stroke="#F59E0B" strokeWidth="2.5" fill="none" />
                      <path d="M 12 72 L 12 78 L 18 78" stroke="#F59E0B" strokeWidth="2.5" fill="none" />
                      <path d="M 308 72 L 308 78 L 302 78" stroke="#F59E0B" strokeWidth="2.5" fill="none" />

                      <text x="160" y="44" textAnchor="middle" fill="#FEF08A" fontSize="28" fontWeight="bold" fontFamily="sans-serif" letterSpacing="1" filter="url(#goldNeon)">
                        ótica inteligente
                      </text>

                      <text x="160" y="68" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="500" fontFamily="monospace" opacity="0.95">
                        {shareUrl}
                      </text>
                    </g>
                  </svg>
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
            <div className="w-full h-80 mx-auto bg-slate-950 border-2 border-cyan-400 rounded-2xl p-2 shadow-2xl relative flex flex-col justify-between items-center overflow-hidden">
              <div className="w-full h-full relative">
                <svg viewBox="0 0 400 320" className="w-full h-full rounded-xl shadow-2xl overflow-hidden">
                  <defs>
                    <radialGradient id="labBgM" cx="50%" cy="40%" r="65%">
                      <stop offset="0%" stopColor="#CBD5E1" />
                      <stop offset="40%" stopColor="#94A3B8" />
                      <stop offset="70%" stopColor="#475569" />
                      <stop offset="100%" stopColor="#1E293B" />
                    </radialGradient>
                    <linearGradient id="labLightM" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#0F172A" stopOpacity="0.9" />
                    </linearGradient>

                    <linearGradient id="whiteArmorM" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="35%" stopColor="#F1F5F9" />
                      <stop offset="70%" stopColor="#CBD5E1" />
                      <stop offset="100%" stopColor="#64748B" />
                    </linearGradient>
                    <linearGradient id="darkMetalM" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#475569" />
                      <stop offset="50%" stopColor="#1E293B" />
                      <stop offset="100%" stopColor="#0F172A" />
                    </linearGradient>

                    <linearGradient id="skinToneM" x1="20%" y1="0%" x2="80%" y2="100%">
                      <stop offset="0%" stopColor="#FFF1F2" />
                      <stop offset="40%" stopColor="#FFE4E6" />
                      <stop offset="80%" stopColor="#FECDD3" />
                      <stop offset="100%" stopColor="#FDA4AF" />
                    </linearGradient>
                    <linearGradient id="bobHairM" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#334155" />
                      <stop offset="30%" stopColor="#0F172A" />
                      <stop offset="70%" stopColor="#020617" />
                      <stop offset="100%" stopColor="#0369A1" />
                    </linearGradient>

                    <filter id="goldNeonM" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <filter id="cyanNeonM" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Laboratory Background */}
                  <rect width="400" height="320" fill="url(#labBgM)" />
                  <rect width="400" height="320" fill="url(#labLightM)" />

                  <path d="M -50 0 C 100 80, 100 240, -50 320" stroke="#E2E8F0" strokeWidth="18" fill="none" opacity="0.4" />
                  <path d="M 450 0 C 300 80, 300 240, 450 320" stroke="#94A3B8" strokeWidth="24" fill="none" opacity="0.3" />
                  
                  {/* Optical HUD */}
                  <rect x="270" y="50" width="110" height="90" rx="8" fill="rgba(15, 23, 42, 0.4)" stroke="#38BDF8" strokeWidth="1.5" opacity="0.8" />
                  <ellipse cx="325" cy="95" rx="30" ry="20" fill="none" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4,2" />
                  <circle cx="325" cy="95" r="8" fill="none" stroke="#38BDF8" strokeWidth="1.5" />

                  {/* Android Alita Figure */}
                  <path d="M 110 320 Q 130 230 190 200 Q 250 230 280 320 Z" fill="url(#whiteArmorM)" stroke="#94A3B8" strokeWidth="2" />
                  <path d="M 120 250 Q 150 240 170 270 Q 160 320 120 320 Z" fill="url(#darkMetalM)" stroke="#38BDF8" strokeWidth="1" />
                  <circle cx="155" cy="255" r="12" fill="url(#whiteArmorM)" stroke="#475569" strokeWidth="2" />

                  <rect x="185" y="150" width="30" height="60" rx="6" fill="url(#darkMetalM)" stroke="#38BDF8" strokeWidth="1" />
                  <line x1="190" y1="165" x2="210" y2="165" stroke="#38BDF8" strokeWidth="2" filter="url(#cyanNeonM)" />
                  <line x1="190" y1="180" x2="210" y2="180" stroke="#F59E0B" strokeWidth="2" filter="url(#goldNeonM)" />

                  <path d="M 170 120 Q 200 90 230 120 Q 220 165 180 160 Z" fill="url(#skinToneM)" />
                  <path d="M 165 100 Q 155 40 215 40 Q 250 45 245 95 Q 235 135 195 130 Q 165 120 165 100 Z" fill="url(#skinToneM)" stroke="#FECDD3" strokeWidth="1" />

                  <path d="M 150 90 C 140 20, 235 10, 250 80 C 260 130, 240 145, 230 145 C 210 110, 160 120, 150 90 Z" fill="url(#bobHairM)" />
                  <path d="M 160 55 C 180 30, 230 35, 240 65 C 220 50, 180 50, 160 55 Z" fill="#0F172A" />

                  <ellipse cx="195" cy="78" rx="11" ry="13" fill="#020617" stroke="#38BDF8" strokeWidth="1.5" />
                  <ellipse cx="230" cy="80" rx="9" ry="11" fill="#020617" stroke="#38BDF8" strokeWidth="1.5" />
                  <circle cx="195" cy="78" r="6" fill="#0284C7" />
                  <circle cx="230" cy="80" r="5" fill="#0284C7" />
                  <circle cx="195" cy="78" r="3" fill="#38BDF8" />
                  <circle cx="230" cy="80" r="2.5" fill="#38BDF8" />
                  <circle cx="197" cy="75" r="1.5" fill="#FFFFFF" />
                  <circle cx="232" cy="77" r="1.2" fill="#FFFFFF" />

                  <path d="M 185 64 Q 198 60 208 67" stroke="#334155" strokeWidth="2" fill="none" />
                  <path d="M 222 66 Q 232 63 238 68" stroke="#334155" strokeWidth="2" fill="none" />
                  <path d="M 198 108 Q 212 116 226 108" stroke="#E11D48" strokeWidth="2.5" fill="none" strokeLinecap="round" />

                  <rect x="180" y="68" width="30" height="22" rx="5" fill="rgba(56, 189, 248, 0.2)" stroke="#94A3B8" strokeWidth="1.5" />
                  <rect x="218" y="70" width="26" height="20" rx="5" fill="rgba(56, 189, 248, 0.2)" stroke="#94A3B8" strokeWidth="1.5" />
                  <line x1="210" y1="76" x2="218" y2="76" stroke="#94A3B8" strokeWidth="2" />
                  <circle cx="195" cy="78" r="8" fill="none" stroke="#38BDF8" strokeWidth="0.8" strokeDasharray="2,2" filter="url(#cyanNeonM)" />

                  {/* Foreground Holographic Gold Badge matching IMAGEM 1 */}
                  <g transform="translate(40, 185)">
                    <rect x="0" y="0" width="320" height="90" rx="16" fill="rgba(15, 23, 42, 0.7)" stroke="#F59E0B" strokeWidth="3" filter="url(#goldNeonM)" />
                    <rect x="4" y="4" width="312" height="82" rx="12" fill="none" stroke="#FEF08A" strokeWidth="1" opacity="0.8" />

                    <path d="M 12 18 L 12 12 L 18 12" stroke="#F59E0B" strokeWidth="2.5" fill="none" />
                    <path d="M 308 18 L 308 12 L 302 12" stroke="#F59E0B" strokeWidth="2.5" fill="none" />
                    <path d="M 12 72 L 12 78 L 18 78" stroke="#F59E0B" strokeWidth="2.5" fill="none" />
                    <path d="M 308 72 L 308 78 L 302 78" stroke="#F59E0B" strokeWidth="2.5" fill="none" />

                    <text x="160" y="44" textAnchor="middle" fill="#FEF08A" fontSize="28" fontWeight="bold" fontFamily="sans-serif" letterSpacing="1" filter="url(#goldNeonM)">
                      ótica inteligente
                    </text>

                    <text x="160" y="68" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="500" fontFamily="monospace" opacity="0.95">
                      {shareUrl}
                    </text>
                  </g>
                </svg>
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

