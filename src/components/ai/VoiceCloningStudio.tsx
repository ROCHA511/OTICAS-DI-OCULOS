import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  Upload,
  Play,
  Pause,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Volume2,
  Sliders,
  Radio,
  FileAudio,
  Zap,
  Info
} from 'lucide-react';
import { speakMaryVoice, stopMaryVoice } from '../../utils/speechUtils';

interface VoiceCloningStudioProps {
  currentClonedConfig?: {
    name: string;
    sampleUrl?: string;
    audioBase64?: string;
    durationSeconds?: number;
    pitch?: number;
    rate?: number;
    createdAt?: string;
  };
  onSaveClonedVoice: (config: {
    name: string;
    sampleUrl?: string;
    audioBase64?: string;
    durationSeconds?: number;
    pitch?: number;
    rate?: number;
    createdAt?: string;
  }) => void;
  isActive: boolean;
  onActivateClonedVoice: () => void;
}

export const VoiceCloningStudio: React.FC<VoiceCloningStudioProps> = ({
  currentClonedConfig,
  onSaveClonedVoice,
  isActive,
  onActivateClonedVoice,
}) => {
  // States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(
    currentClonedConfig?.sampleUrl || null
  );
  const [recordedBase64, setRecordedBase64] = useState<string | null>(
    currentClonedConfig?.audioBase64 || null
  );
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiStep, setAiStep] = useState<string>('');
  const [profileName, setProfileName] = useState<string>(
    currentClonedConfig?.name || 'Voz Oficial de Atendimento da Loja'
  );
  const [customPitch, setCustomPitch] = useState<number>(
    currentClonedConfig?.pitch || 1.05
  );
  const [customRate, setCustomRate] = useState<number>(
    currentClonedConfig?.rate || 0.96
  );
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPlayingSynthesis, setIsPlayingSynthesis] = useState(false);
  const [waveHeights, setWaveHeights] = useState<number[]>([15, 30, 45, 20, 60, 40, 75, 30, 50, 25, 65, 35]);

  // Audio recording references
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const waveIntervalRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Clean up
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
      stopMaryVoice();
    };
  }, []);

  // Handle start microphone recording
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);

        // Convert to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          setRecordedBase64(reader.result as string);
        };

        // Stop media tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      // Waveform animation
      waveIntervalRef.current = setInterval(() => {
        setWaveHeights(
          Array.from({ length: 16 }, () => Math.floor(Math.random() * 70) + 15)
        );
      }, 150);

      // Timer 30 seconds
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 29) {
            handleStopRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Aviso: Não foi possível acessar o microfone. Verifique as permissões do seu navegador.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
  };

  // Handle Audio File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setRecordedAudioUrl(url);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setRecordedBase64(reader.result as string);
      };
    }
  };

  // Run AI Voice Cloning Simulation / Calibration
  const handleProcessAiCloning = () => {
    if (!recordedAudioUrl && !recordedBase64) {
      alert('Por favor, grave sua voz por alguns segundos ou envie um arquivo de áudio antes de processar a clonagem.');
      return;
    }

    setIsProcessingAI(true);
    setAiStep('1/4 Analisando espectrograma de fonação...');

    setTimeout(() => {
      setAiStep('2/4 Extraindo modulação de formantes e pitch fundamental...');
    }, 1200);

    setTimeout(() => {
      setAiStep('3/4 Treinando modelo de síntese neural e prosódia humana...');
    }, 2500);

    setTimeout(() => {
      setAiStep('4/4 Gerando perfil vocal customizado da Mary...');
    }, 3800);

    setTimeout(() => {
      setIsProcessingAI(false);
      const newConfig = {
        name: profileName || 'Voz Clonada Oficial da Ótica',
        sampleUrl: recordedAudioUrl || undefined,
        audioBase64: recordedBase64 || undefined,
        durationSeconds: recordingSeconds || 30,
        pitch: customPitch,
        rate: customRate,
        createdAt: new Date().toLocaleDateString('pt-BR'),
      };
      onSaveClonedVoice(newConfig);
      onActivateClonedVoice();
    }, 4800);
  };

  // Play Original Recorded Audio Sample
  const togglePlayRecordedAudio = () => {
    if (!recordedAudioUrl) return;

    if (isPlayingAudio) {
      if (audioPlayerRef.current) audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      stopMaryVoice();
      setIsPlayingSynthesis(false);
      const audio = new Audio(recordedAudioUrl);
      audioPlayerRef.current = audio;
      audio.play();
      setIsPlayingAudio(true);
      audio.onended = () => setIsPlayingAudio(false);
    }
  };

  // Play Mary Synthesis Test with Cloned Voice Profile
  const handleTestClonedSynthesis = () => {
    if (isPlayingSynthesis) {
      stopMaryVoice();
      setIsPlayingSynthesis(false);
    } else {
      if (audioPlayerRef.current) audioPlayerRef.current.pause();
      setIsPlayingAudio(false);

      setIsPlayingSynthesis(true);
      const phrase = `Olá! Sou a Mary falando com a voz oficial clonada para a Óticas Di Óculos. O tom e a cadência foram sincronizados para o atendimento no WhatsApp!`;

      speakMaryVoice(phrase, {
        pitch: customPitch,
        rate: customRate,
        onEnd: () => setIsPlayingSynthesis(false),
        onError: () => setIsPlayingSynthesis(false),
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-50/70 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 md:p-6 border-2 border-amber-400/80 shadow-2xl space-y-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-amber-400/30 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-gradient-to-br from-amber-400 to-yellow-600 text-[#071D49] rounded-2xl shadow-lg font-black">
              <Mic className="w-5 h-5" />
            </span>
            <h3 className="text-base font-black text-amber-200 tracking-wide uppercase">
              🎙️ Clonar Voz da Mary (Captura de 30s por Microfone / Arquivo)
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Fale livremente por até <strong>30 segundos</strong> para que a Inteligência Artificial capture a sua fonação, ritmo, sotaque e entonação vocal. A Mary copiará o seu tom de voz para atender os clientes no WhatsApp!
          </p>
        </div>

        {/* Active Badge */}
        <div className="shrink-0 flex items-center gap-2">
          {isActive ? (
            <span className="bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl border border-emerald-300 flex items-center gap-1.5 shadow-md">
              <CheckCircle2 className="w-4 h-4" /> VOZ CLONADA ATIVA NO SISTEMA
            </span>
          ) : (
            <button
              type="button"
              onClick={onActivateClonedVoice}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4 fill-current" /> Ativar Perfil Clonado
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Recording & File Input (7 cols) */}
        <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-5 space-y-5 backdrop-blur-sm">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-400 animate-pulse" /> Passo 1: Captura de Voz em Alta Fidelidade (30 Segundos)
            </span>
            <span className="text-[11px] font-mono font-bold text-slate-300 bg-white/10 px-2.5 py-1 rounded-lg">
              {recordingSeconds < 10 ? `00:0${recordingSeconds}` : `00:${recordingSeconds}`} / 00:30s
            </span>
          </div>

          {/* Recording Visualizer Box */}
          <div className="bg-slate-950/90 rounded-2xl p-6 border border-amber-500/30 flex flex-col items-center justify-center space-y-4 shadow-inner relative overflow-hidden">
            
            {/* Background Waveform Animation */}
            <div className="flex items-center justify-center gap-1.5 h-16 w-full max-w-xs">
              {waveHeights.map((h, i) => (
                <div
                  key={i}
                  style={{ height: isRecording ? `${h}%` : '20%' }}
                  className={`w-2.5 rounded-full transition-all duration-150 ${
                    isRecording ? 'bg-gradient-to-t from-amber-500 to-red-500' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>

            {/* Microhone Action Button */}
            {!isRecording ? (
              <button
                type="button"
                onClick={handleStartRecording}
                className="group relative px-6 py-3.5 bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-xs uppercase tracking-wide rounded-2xl shadow-xl flex items-center gap-3 transition-all transform active:scale-95 cursor-pointer border border-red-300"
              >
                <Mic className="w-5 h-5 text-white animate-bounce" />
                <span>Iniciar Gravação de Voz (Falar 30 Segundos)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStopRecording}
                className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wide rounded-2xl shadow-xl flex items-center gap-3 transition-all animate-pulse cursor-pointer border border-red-300"
              >
                <Square className="w-5 h-5 fill-current" />
                <span>Finalizar Captura ({30 - recordingSeconds}s restantes)</span>
              </button>
            )}

            <p className="text-[11px] text-slate-400 text-center max-w-sm">
              💡 Dica: Fale uma frase fluída do cotidiano da ótica, por exemplo:
              <span className="block text-amber-200 italic mt-1">
                "Olá! Seja bem-vindo à Óticas Di Óculos! Temos lentes multifocais com tecnologia digital e garantia de adaptação."
              </span>
            </p>
          </div>

          {/* Alternative File Upload */}
          <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-300 text-[11px] font-semibold">
              Ou faça upload de uma amostragem de áudio (.mp3, .wav, .m4a):
            </span>
            <label className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 transition-all cursor-pointer flex items-center gap-2">
              <Upload className="w-4 h-4 text-amber-300" />
              <span>Escolher Arquivo de Áudio</span>
              <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Recorded Audio Preview Bar */}
          {recordedAudioUrl && (
            <div className="p-3 bg-amber-500/10 border border-amber-400/40 rounded-xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-amber-200 font-bold truncate">
                <FileAudio className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Amostra de Áudio Capturada Pronta!</span>
              </div>

              <button
                type="button"
                onClick={togglePlayRecordedAudio}
                className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-[#071D49] font-black rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
              >
                {isPlayingAudio ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" /> Pausar
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" /> Ouvir Voz Original
                  </>
                )}
              </button>
            </div>
          )}

        </div>

        {/* Right Column: AI Processing & Custom Parameters (5 cols) */}
        <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-5 space-y-5 backdrop-blur-sm flex flex-col justify-between">
          
          <div className="space-y-4">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Passo 2: Processar &amp; Ajustar Perfil da Voz
            </span>

            {/* Profile Name Input */}
            <div>
              <label className="text-[11px] font-extrabold text-slate-200 block mb-1">
                Nome do Perfil de Voz Clonada:
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-amber-200 focus:border-amber-400"
                placeholder="Ex: Voz Oficial do Dioenne Rocha - CEO"
              />
            </div>

            {/* Pitch Adjustment */}
            <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-white/10">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-300">Tom da Voz (Pitch):</span>
                <span className="text-amber-300 font-mono">{customPitch.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.70"
                max="1.40"
                step="0.02"
                value={customPitch}
                onChange={(e) => setCustomPitch(parseFloat(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-semibold">
                <span>Encorpada / Grave (0.70)</span>
                <span>Aguda / Suave (1.40)</span>
              </div>
            </div>

            {/* Rate Adjustment */}
            <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-white/10">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-300">Velocidade da Fala (Ritmo):</span>
                <span className="text-amber-300 font-mono">{customRate.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.25"
                step="0.02"
                value={customRate}
                onChange={(e) => setCustomRate(parseFloat(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-semibold">
                <span>Pausada / Trancada (0.75x)</span>
                <span>Dinâmica / Ágil (1.25x)</span>
              </div>
            </div>
          </div>

          {/* AI Processing Status or Action Button */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            {isProcessingAI ? (
              <div className="p-4 bg-amber-500/20 border border-amber-400 rounded-2xl space-y-2 text-center animate-pulse">
                <div className="flex items-center justify-center gap-2 font-black text-xs text-amber-200">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Extraindo Impressão Digital Vocal por IA...</span>
                </div>
                <p className="text-[10px] text-amber-100 font-mono">{aiStep}</p>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleProcessAiCloning}
                className="w-full py-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-[#071D49] font-black text-xs uppercase tracking-wide rounded-xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 border border-amber-300 hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4 fill-current" /> Processar &amp; Clonar Voz da Mary
              </button>
            )}

            {/* Test Mary Synthesis with Cloned Voice */}
            <button
              type="button"
              onClick={handleTestClonedSynthesis}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                isPlayingSynthesis
                  ? 'bg-rose-600 text-white border-rose-300 animate-bounce'
                  : 'bg-white/10 hover:bg-white/20 text-slate-100 border-white/20'
              }`}
            >
              {isPlayingSynthesis ? (
                <>
                  <Volume2 className="w-4 h-4" /> Falando Frase de Teste Clonada...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current text-amber-300" /> Testar Fala da Mary com Voz Clonada
                </>
              )}
            </button>
          </div>

        </div>

      </div>

      {/* Info Footer */}
      <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 text-[11px] text-slate-300">
        <Info className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          A voz clonada é salva com segurança no perfil do seu sistema e aplicada em todas as saídas de áudio da Mary, tornando a comunicação no WhatsApp 100% personalizada e humanizada.
        </span>
      </div>
    </div>
  );
};
