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
  Info
} from 'lucide-react';

export const InstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [showIOSModal, setShowIOSModal] = useState<boolean>(false);
  const [installedSuccess, setInstalledSuccess] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [detectedBrowser, setDetectedBrowser] = useState<string>('');

  useEffect(() => {
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
    else if (/safari/i.test(userAgent)) setDetectedBrowser('Apple Safari');
    else setDetectedBrowser('Navegador Web');

    // Handle beforeinstallprompt for Android, Chrome, Windows, Edge
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

    // Listen to online/offline network events
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
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setInstalledSuccess(true);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback for browsers or desktop
      alert(`Para instalar no ${detectedBrowser}, clique no ícone de três pontos (...) ou barra de endereço e selecione 'Instalar Óticas Dioculos'.`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Offline/Online Connection Status Badge */}
      <div
        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
          isOnline
            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
            : 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
        }`}
        title={isOnline ? 'Sistema Online Sincronizado' : 'Modo Offline Ativado'}
      >
        {isOnline ? (
          <>
            <Wifi className="w-3 h-3 text-emerald-400" />
            <span className="hidden md:inline">Online</span>
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
          <span>Aplicativo instalado com sucesso!</span>
        </div>
      )}

      {/* Standalone Installed Badge */}
      {isStandalone && !installedSuccess && (
        <div className="bg-[#C9A96E]/20 text-[#E8D2A8] border border-[#C9A96E]/40 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
          <Smartphone className="w-3 h-3 text-[#C9A96E]" />
          <span className="hidden sm:inline">PWA Instalado</span>
        </div>
      )}

      {/* Install Button (Shows when prompt available OR iOS OR not standalone) */}
      {!isStandalone && (
        <button
          onClick={handleInstallClick}
          className="px-3 py-1.5 bg-[#C9A96E] hover:bg-[#b5955b] text-[#071D49] font-black text-xs rounded-xl shadow-md border border-[#E8D2A8]/50 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shrink-0"
          title={`Instalar Aplicativo Óticas Dioculos PWA no ${detectedBrowser}`}
        >
          <Download className="w-3.5 h-3.5" />
          <span className="uppercase text-[11px] tracking-wider">
            {isIOS ? 'Instalar no iPhone' : 'Baixar App PWA'}
          </span>
        </button>
      )}

      {/* iOS Installation Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-[#071D49]/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white text-slate-900 w-full max-w-sm rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-4 relative">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#071D49] text-[#E8D2A8] rounded-2xl">
                <Smartphone className="w-6 h-6 text-[#C9A96E]" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#071D49] uppercase">
                  Instalar no iOS / iPhone
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Adicione à Tela Inicial sem ocupar espaço
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs font-medium">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-xl shrink-0">
                  <Share className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-slate-900 font-bold">1. Toque em Compartilhar</strong>
                  <span className="text-slate-500 text-[11px]">No menu inferior do navegador Safari</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-slate-900 font-bold">2. Adicionar à Tela Inicial</strong>
                  <span className="text-slate-500 text-[11px]">Role a lista e selecione esta opção</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 bg-[#071D49] text-[#E8D2A8] font-black text-xs uppercase rounded-xl border border-[#C9A96E] shadow"
            >
              Entendido!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
