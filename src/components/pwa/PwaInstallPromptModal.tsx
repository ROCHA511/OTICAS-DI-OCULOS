import React, { useState, useEffect } from 'react';
import { Download, X, Laptop, Smartphone, Info, Share } from 'lucide-react';

export const PwaInstallPromptModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isManualInstruction, setIsManualInstruction] = useState(false);
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop'>('desktop');

  useEffect(() => {
    // 1. Detectar tipo de dispositivo e SO
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    const isAndroid = /android/i.test(userAgent);
    
    if (isIOS) {
      setDeviceType('ios');
    } else if (isAndroid) {
      setDeviceType('android');
    } else {
      setDeviceType('desktop');
    }

    // 2. Verificar se já está rodando em modo standalone (PWA instalado)
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (navigator as any).standalone === true || 
      document.referrer.includes('android-app://');

    if (isStandalone) {
      console.log('[PWA] Aplicativo já está rodando instalado.');
      return;
    }

    // 3. Capturar evento beforeinstallprompt (Chrome/Edge/Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('[PWA] Evento beforeinstallprompt disparado.');
      e.preventDefault();
      setDeferredPrompt(e);

      // Só abrir se o usuário não tiver descartado na sessão/dia atual
      const dismissedTime = localStorage.getItem('pwa_prompt_dismissed_at');
      if (dismissedTime) {
        const diff = Date.now() - parseInt(dismissedTime, 10);
        const hoursPassed = diff / (1000 * 60 * 60);
        if (hoursPassed < 24) {
          // Menos de 24h desde o último descarte, não incomodar
          return;
        }
      }
      
      setIsOpen(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. Fallback para iOS / Safari que não suporta beforeinstallprompt
    if (isIOS) {
      const dismissedTime = localStorage.getItem('pwa_prompt_dismissed_at');
      let shouldShowIOS = true;
      if (dismissedTime) {
        const diff = Date.now() - parseInt(dismissedTime, 10);
        if (diff / (1000 * 60 * 60) < 24) {
          shouldShowIOS = false;
        }
      }

      if (shouldShowIOS) {
        setIsManualInstruction(true);
        // Pequeno atraso para dar uma sensação premium após o carregamento da página
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Mostrar prompt nativo
      deferredPrompt.prompt();
      
      // Aguardar decisão do usuário
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`[PWA] Usuário escolheu instalação: ${outcome}`);
      
      if (outcome === 'accepted') {
        localStorage.setItem('pwa_installed', 'true');
        setIsOpen(false);
      }
      setDeferredPrompt(null);
    } else {
      // Se não há prompt nativo, exibe as instruções manuais
      setIsManualInstruction(true);
    }
  };

  const handleDismiss = () => {
    // Salvar o timestamp do descarte para não perturbar o usuário por 24 horas
    localStorage.setItem('pwa_prompt_dismissed_at', Date.now().toString());
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[400] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300 ease-out animate-fade-in">
      <div className="bg-[#071D49] border-2 border-[#C9A96E] rounded-3xl max-w-md w-full p-6 text-white shadow-2xl relative transition-all duration-300 scale-95 md:scale-100 animate-zoom-in">
        
        {/* Botão de Fechar */}
        <button 
          onClick={handleDismiss} 
          className="absolute top-4 right-4 text-slate-400 hover:text-[#C9A96E] p-1.5 rounded-full hover:bg-white/10 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo / Header */}
        <div className="flex flex-col items-center text-center space-y-4 mt-2">
          <div className="w-16 h-16 rounded-2xl bg-[#0B255C] border border-[#C9A96E] flex items-center justify-center shadow-lg p-2">
            <img src="/logo.svg" alt="Dioculos Logo" className="w-12 h-12" />
          </div>
          
          <h3 className="text-xl sm:text-2xl font-black text-[#C9A96E] tracking-wide">
            Instale o Aplicativo
          </h3>
          
          <p className="text-slate-300 text-sm leading-relaxed px-2">
            Adicione este sistema à sua Área de Trabalho para um acesso mais rápido, funcionamento em tela cheia e melhor desempenho.
          </p>
        </div>

        {/* Conteúdo / Instruções Manuais */}
        <div className="my-6 space-y-4">
          {isManualInstruction ? (
            <div className="bg-[#0B255C] border border-[#C9A96E]/30 rounded-2xl p-4 text-xs sm:text-sm space-y-3">
              <div className="flex items-center gap-2 text-[#C9A96E] font-black">
                <Info className="w-4 h-4 shrink-0" />
                <span>Instruções de Instalação Manual:</span>
              </div>
              
              {deviceType === 'ios' ? (
                <ol className="list-decimal list-inside space-y-2 text-slate-300">
                  <li>
                    Toque no botão de <strong>Compartilhar</strong> <Share className="w-4 h-4 inline text-sky-400 shrink-0" /> na barra inferior do Safari.
                  </li>
                  <li>
                    Role para baixo e selecione <strong>"Adicionar à Tela de Início"</strong>.
                  </li>
                  <li>
                    Toque em <strong>"Adicionar"</strong> no canto superior direito para confirmar.
                  </li>
                </ol>
              ) : (
                <ol className="list-decimal list-inside space-y-2 text-slate-300">
                  <li>
                    Abra o menu de opções do navegador (geralmente os três pontinhos <strong>⋮</strong> no Chrome/Edge).
                  </li>
                  <li>
                    Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.
                  </li>
                  <li>
                    Confirme o prompt de instalação do sistema.
                  </li>
                </ol>
              )}
            </div>
          ) : (
            <div className="flex justify-around py-2">
              <div className="flex flex-col items-center gap-1.5 text-slate-400">
                <Smartphone className="w-6 h-6" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Celular</span>
              </div>
              <div className="w-px bg-[#C9A96E]/20" />
              <div className="flex flex-col items-center gap-1.5 text-slate-400">
                <Laptop className="w-6 h-6" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Computador</span>
              </div>
            </div>
          )}
        </div>

        {/* Ações */}
        <div className="flex flex-col gap-3">
          {!isManualInstruction && (
            <button
              onClick={handleInstallClick}
              className="w-full py-3.5 bg-[#C9A96E] hover:bg-[#E8D2A8] text-[#071D49] font-black text-base rounded-xl transition-all shadow-lg hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span>Instalar Agora</span>
            </button>
          )}

          <button
            onClick={handleDismiss}
            className="w-full py-3 bg-transparent hover:bg-white/5 text-slate-300 hover:text-white font-bold text-sm rounded-xl transition-all border border-slate-500/40 cursor-pointer active:scale-95 text-center"
          >
            {isManualInstruction ? 'Entendi' : 'Agora não'}
          </button>
        </div>

      </div>
    </div>
  );
};
