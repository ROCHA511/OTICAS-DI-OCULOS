import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  CheckCircle2,
  Share,
  PlusSquare,
  X,
  Wifi,
  WifiOff,
  Sparkles,
  Monitor,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export const InstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);
  const [installedSuccess, setInstalledSuccess] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [detectedBrowser, setDetectedBrowser] = useState<string>('Navegador');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect Standalone mode (already installed PWA)
    const isInStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    setIsStandalone(isInStandaloneMode);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(ios);

    // Detect Browser
    if (/samsungbrowser/i.test(userAgent)) setDetectedBrowser('Samsung Internet');
    else if (/edg/i.test(userAgent)) setDetectedBrowser('Microsoft Edge');
    else if (/chrome/i.test(userAgent)) setDetectedBrowser('Google Chrome');
    else if (/safari/i.test(userAgent)) setDetectedBrowser('Safari iOS');
    else setDetectedBrowser('Navegador Web');

    // Handle beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
      setInstalledSuccess(true);
      setTimeout(() => setInstalledSuccess(false), 5000);
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult?.outcome === 'accepted') {
        setInstalledSuccess(true);
      }
      setDeferredPrompt(null);
    } else {
      // Exibe modal com instruções completas para todos os navegadores/dispositivos
      setShowInstallModal(true);
    }
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {/* Badge Online/Offline */}
      <div
        className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all ${
          isOnline
            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
            : 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
        }`}
        title={isOnline ? 'Sistema Online Sincronizado' : 'Modo Offline'}
      >
        {isOnline ? (
          <>
            <Wifi className="w-3 h-3 text-emerald-400" />
            <span className="hidden lg:inline">Online</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3 text-red-400" />
            <span>Offline</span>
          </>
        )}
      </div>

      {/* Installed Success Toast */}
      {installedSuccess && (
        <div className="bg-emerald-600 text-white px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
          <span className="hidden sm:inline">App Instalado com Sucesso!</span>
        </div>
      )}

      {/* Botão de Instalar App no Menu Horizontal Superior (Sempre Visível e Destacado) */}
      <button
        onClick={handleInstallClick}
        className="px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-[#D4AF37] via-amber-400 to-amber-500 hover:from-[#E5C158] hover:to-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md border border-amber-200 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shrink-0"
        title={`Instalar Aplicativo Óticas Dioculos PWA no ${detectedBrowser}`}
      >
        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
        <span className="uppercase text-[10px] sm:text-[11px] tracking-wider font-extrabold">
          {isStandalone ? 'App Instalado 📲' : 'Instalar App'}
        </span>
      </button>

      {/* Modal Interativo de Instalação PWA */}
      {showInstallModal && (
        <div className="fixed inset-0 z-[300] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white text-slate-900 w-full max-w-md rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-4 relative">
            <button
              onClick={() => setShowInstallModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#071D49] to-[#0B255C] text-[#D4AF37] rounded-2xl flex items-center justify-center shadow-md">
                <Smartphone className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full uppercase">
                  PWA Luxo Ouro &amp; Preto 2.0
                </span>
                <h3 className="text-base font-black text-[#071D49]">
                  Instalar Aplicativo na Tela Inicial
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Tenha acesso rápido ao sistema **Óticas Di Óculos** direto no seu celular ou computador sem precisar abrir o navegador!
            </p>

            <div className="space-y-3 pt-1 text-xs">
              {isIOS ? (
                /* Instruções para iPhone / iOS */
                <div className="space-y-2">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-700 rounded-xl shrink-0">
                      <Share className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-slate-900 font-bold">1. Toque em Compartilhar</strong>
                      <span className="text-slate-500 text-[11px]">No botão central inferior do Safari</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
                      <PlusSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-slate-900 font-bold">2. Adicionar à Tela Inicial</strong>
                      <span className="text-slate-500 text-[11px]">Selecione "Adicionar à Tela de Início"</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Instruções para Android / Windows / Mac */
                <div className="space-y-2">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                    <div className="p-2 bg-[#071D49] text-[#D4AF37] rounded-xl shrink-0 font-bold">
                      ⋮
                    </div>
                    <div>
                      <strong className="block text-slate-900 font-bold">1. Abra o Menu do {detectedBrowser}</strong>
                      <span className="text-slate-500 text-[11px]">Clique nos 3 pontinhos (canto superior direito)</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                    <div className="p-2 bg-amber-100 text-amber-900 rounded-xl shrink-0">
                      <Download className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-slate-900 font-bold">2. Clique em "Instalar Aplicativo"</strong>
                      <span className="text-slate-500 text-[11px]">Ou "Adicionar à Tela Inicial"</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Atualização de Ícone */}
              <div className="bg-[#F0F7FF] p-3 rounded-2xl border border-[#0055A5]/30 flex items-center gap-2 text-[11px] text-[#0055A5] font-bold">
                <RefreshCw className="w-4 h-4 shrink-0 text-[#0055A5]" />
                <span>Para atualizar o ícone antigo para a nova versão Ouro + Preto, exclua o atalho antigo e adicione novamente.</span>
              </div>
            </div>

            <button
              onClick={() => setShowInstallModal(false)}
              className="w-full py-3 bg-[#071D49] hover:bg-[#0B255C] text-[#E8D2A8] font-extrabold text-xs uppercase rounded-2xl shadow-lg border border-[#C9A96E]/40 transition-all cursor-pointer"
            >
              Entendido! Concluir Instalação
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
