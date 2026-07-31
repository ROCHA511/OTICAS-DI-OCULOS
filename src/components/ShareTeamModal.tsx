import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  QrCode,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Users,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { AlitaOticaInteligenteBanner } from './AlitaOticaInteligenteBanner';

interface ShareTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareTeamModal: React.FC<ShareTeamModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // Public shared link for the app (converts -dev to -pre for unrestricted public access)
  const currentOrigin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://ais-pre-qz7lavammczznxwgiawjko-248777919228.us-east5.run.app';
  const shareUrl = currentOrigin.replace('ais-dev-', 'ais-pre-');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappMessage = encodeURIComponent(
    `👓 *Óticas Dioculos • Sistema Ótica Inteligente*\n\n` +
      `Link de acesso direto para o grupo de testadores e equipe da loja (sem precisar de login do Google):\n\n` +
      `🔗 ${shareUrl}\n\n` +
      `*Instruções de Acesso:*\n` +
      `• Basta clicar no link acima e acessar normalmente pelo celular ou computador!`
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border-2 border-[#C9A96E]/50 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#071D49] via-[#0B255C] to-[#071D49] px-6 py-4 text-white flex items-center justify-between border-b-2 border-[#C9A96E]/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#0B255C] text-[#C9A96E] rounded-2xl border border-[#C9A96E]/40 shadow-sm flex items-center justify-center">
              <Share2 className="w-5 h-5 text-[#C9A96E]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Liberar Acesso para os 10 Testadores
                </h2>
                <span className="text-[10px] bg-[#C9A96E] text-[#071D49] font-black px-2 py-0.5 rounded-full uppercase">
                  Ótica Inteligente
                </span>
              </div>
              <p className="text-xs text-[#E8D2A8] font-medium">
                Link público sem restrição de conta do Google (Zero Erro 403)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {/* Android Alita Banner holding Ótica Inteligente plaque */}
          <AlitaOticaInteligenteBanner
            shareUrl={shareUrl}
            onCopy={handleCopy}
            copied={copied}
          />

          {/* Quick Share Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* WhatsApp Share */}
            <a
              href={`https://wa.me/?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl transition-all flex items-center gap-3 cursor-pointer group"
            >
              <div className="p-2 bg-emerald-500 text-white rounded-xl shadow-xs group-hover:scale-105 transition-transform">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-extrabold text-emerald-950">Enviar Convite no WhatsApp</div>
                <div className="text-[10px] text-emerald-700 font-medium">Disparar no grupo dos 10 testadores</div>
              </div>
            </a>

            {/* QR Code toggle */}
            <button
              onClick={() => setShowQr(!showQr)}
              className="p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-2xl transition-all flex items-center gap-3 cursor-pointer group"
            >
              <div className="p-2 bg-[#071D49] text-[#C9A96E] rounded-xl shadow-xs group-hover:scale-105 transition-transform">
                <QrCode className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-extrabold text-slate-900">QR Code para Celular</div>
                <div className="text-[10px] text-slate-600 font-medium">
                  {showQr ? 'Ocultar Código' : 'Escanear na loja'}
                </div>
              </div>
            </button>
          </div>

          {/* QR Code View */}
          {showQr && (
            <div className="bg-slate-900 text-white p-5 rounded-2xl text-center space-y-3 animate-in fade-in">
              <p className="text-xs font-bold text-[#C9A96E] flex items-center justify-center gap-1.5">
                <Smartphone className="w-4 h-4" /> Aponta a câmera do celular para abrir o sistema
              </p>
              <div className="bg-white p-3 rounded-2xl inline-block shadow-md">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    shareUrl
                  )}`}
                  alt="QR Code Acesso Sistema Ótica Inteligente"
                  className="w-40 h-40 mx-auto"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Acesso direto para Tablets, Celulares de Vendedores e Computadores do Balcão.
              </p>
            </div>
          )}

          {/* Access Roles Guidelines */}
          <div className="bg-[#071D49]/5 p-4 rounded-2xl border border-[#C9A96E]/30 space-y-2">
            <div className="text-xs font-bold text-[#071D49] flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#C9A96E]" />
              Instrução aos 10 Testadores no Primeiro Acesso:
            </div>
            <ul className="text-xs text-slate-700 space-y-1.5 pl-5 list-disc">
              <li>
                <strong>Link de Acesso:</strong> Forneça o link <code className="bg-slate-100 px-1 py-0.5 rounded border border-slate-300 font-mono text-[11px] font-bold text-[#071D49]">{shareUrl}</code>.
              </li>
              <li>
                <strong>Nenhum Login do Google Exigido:</strong> O sistema abre direto no perfil de Atendimento / CRM / Ordens de Serviço.
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#071D49] font-bold hover:underline flex items-center gap-1"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Abrir Link Público em Nova Aba
          </a>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#071D49] text-white font-bold text-xs rounded-xl hover:bg-[#0B255C] transition-all cursor-pointer"
          >
            Concluído
          </button>
        </div>
      </div>
    </div>
  );
};

