import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  MoreVertical,
  Maximize2,
  Sparkles,
  Bot,
  UserCheck,
  FileText,
  Glasses,
  Scissors,
  CheckCircle2,
  MessageSquare,
  ArrowLeft,
  Volume2,
  Mic,
  Square,
  Paperclip,
  TrendingUp,
  Clock,
  ShieldCheck,
  Check,
  Phone,
  Eye,
  CreditCard,
  History,
  FileSpreadsheet,
} from 'lucide-react';
import { Client, ChatMessage } from '../../types';
import { speakMaryVoice, stopMaryVoice } from '../../utils/speechUtils';

interface ChatWindowPanelProps {
  client: Client;
  messages: ChatMessage[];
  onSendMessage: (text: string, mediaUrl?: string, mediaType?: 'image' | 'pdf') => void;
  onToggleAiControl: (clientId: string) => void;
  onGenerateAiSuggestion: () => Promise<void>;
  isGeneratingAi: boolean;
  onSelectQuickAction: (actionType: 'pix' | 'dnp_request' | 'recipe_request' | 'catalog') => void;
  onBackToOverview?: () => void;
}

export const ChatWindowPanel: React.FC<ChatWindowPanelProps> = ({
  client,
  messages,
  onSendMessage,
  onToggleAiControl,
  onGenerateAiSuggestion,
  isGeneratingAi,
  onSelectQuickAction,
  onBackToOverview,
}) => {
  const [inputText, setInputText] = useState('');
  const [activeSpeakingMsgId, setActiveSpeakingMsgId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [showMaryStatsCard, setShowMaryStatsCard] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSpeakMary = (msgId: string, text: string) => {
    if (activeSpeakingMsgId === msgId) {
      stopMaryVoice();
      setActiveSpeakingMsgId(null);
    } else {
      setActiveSpeakingMsgId(msgId);
      speakMaryVoice(text, {
        onEnd: () => setActiveSpeakingMsgId(null),
        onError: () => setActiveSpeakingMsgId(null),
      });
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Acesso ao microfone necessário para gravar mensagem de áudio para a Mary.');
    }
  };

  const stopRecordingAndSend = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      clearInterval(recordingTimerRef.current);
      setIsRecording(false);
      onSendMessage(`[🎙️ Áudio de ${recordingSeconds}s gravado pelo cliente]`);
      setRecordingSeconds(0);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('audio/')) {
      onSendMessage(`[🎙️ Áudio enviado: ${file.name}]`);
    } else if (file.type.startsWith('video/')) {
      onSendMessage(`[📹 Vídeo enviado: ${file.name}]`);
    } else {
      onSendMessage(`[📄 Arquivo anexado: ${file.name}]`);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  // Modern Workflow Steps (Apple / ClickUp Workflow)
  const workflowSteps = [
    { label: 'Receita', status: 'Concluído', time: '10:15 AM', resp: 'Dr. Óptico', icon: FileText, done: true },
    { label: 'Medições', status: 'Concluído', time: '10:28 AM', resp: 'IA Mary', icon: Eye, done: true },
    { label: 'Lentes', status: 'Em Produção', time: '11:00 AM', resp: 'Braslab', icon: Glasses, active: true },
    { label: 'Montagem', status: 'Pendente', time: '02:00 PM', resp: 'Oficina Lab', icon: Scissors },
    { label: 'Controle Qualidade', status: 'Pendente', time: '03:30 PM', resp: 'Gerência', icon: ShieldCheck },
    { label: 'Entrega', status: 'Pendente', time: '05:00 PM', resp: 'Atendimento', icon: CheckCircle2 },
  ];

  return (
    <div className="w-full h-full max-w-full bg-[#F7F8FA] flex flex-col min-h-0 overflow-hidden rounded-[20px] box-border relative">
      {/* 1. TOPO: Foto Cliente, Nome, Status, Telefone, Origem Lead, IA Badge */}
      <div className="p-3.5 bg-white border-b border-[#C9A96E]/20 flex items-center justify-between shrink-0 rounded-t-[20px] shadow-xs">
        <div className="flex items-center space-x-3 min-w-0">
          {onBackToOverview && (
            <button
              onClick={onBackToOverview}
              className="px-2.5 py-1 bg-[#071D49] hover:bg-[#0B255C] text-[#E8D2A8] border border-[#C9A96E]/40 rounded-xl transition-all shadow-xs flex items-center gap-1.5 text-xs font-semibold shrink-0 cursor-pointer"
              title="Voltar para Visão Geral"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#C9A96E]" />
              <span className="hidden sm:inline">Visão Geral</span>
            </button>
          )}

          <div className="relative shrink-0">
            <img
              src={
                client.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
              }
              alt={client.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-[#C9A96E]"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] absolute bottom-0 right-0 ring-2 ring-white"></span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#111827] truncate">{client.name}</h2>
              <span className="text-[10px] bg-[#071D49]/10 text-[#071D49] font-semibold px-2 py-0.2 rounded-full border border-[#071D49]/20 hidden sm:inline">
                {client.tags?.[0] || 'Orçamento'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#6B7280] font-normal">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-[#C9A96E]" /> {client.phone}
              </span>
              <span>•</span>
              <span className="text-[#C9A96E] font-medium">Origem: WhatsApp Meta</span>
            </div>
          </div>
        </div>

        {/* Right IA Badge & Controls */}
        <div className="flex items-center space-x-2">
          {/* Pequeño Badge Premium: ● IA Mary Online */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#071D49]/5 border border-[#C9A96E]/40 rounded-full text-xs font-semibold text-[#071D49]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span>● IA Mary Online</span>
          </div>

          {/* Toggle IA Control Button */}
          <button
            onClick={() => onToggleAiControl(client.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all border cursor-pointer ${
              client.isAiHandled
                ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/40 hover:bg-[#10B981]/25'
                : 'bg-[#071D49] text-white border-[#C9A96E] hover:bg-[#0B255C]'
            }`}
          >
            {client.isAiHandled ? (
              <>
                <Bot className="w-3.5 h-3.5 text-[#10B981]" /> IA Mary
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5 text-[#C9A96E]" /> Humano
              </>
            )}
          </button>

          <button
            onClick={() => setShowMaryStatsCard(!showMaryStatsCard)}
            title="Exibir Card da IA Mary"
            className="p-1.5 text-slate-400 hover:text-[#071D49] hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#C9A96E]" />
          </button>
        </div>
      </div>

      {/* 2. ATALHOS PREMIUM CHIPS (Border Radius: 999px) */}
      <div className="bg-white px-4 py-2 border-b border-[#C9A96E]/15 flex items-center gap-2 overflow-x-auto text-[11px] shrink-0 scrollbar-none">
        <span className="font-bold text-[#6B7280] text-[10px] uppercase tracking-wider shrink-0">
          Atalhos:
        </span>
        <button
          onClick={() => onSelectQuickAction('recipe_request')}
          className="bg-[#F7F8FA] hover:bg-[#071D49] text-[#111827] hover:text-white px-3.5 py-1 rounded-full border border-[#C9A96E]/30 font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1"
        >
          📄 Receita
        </button>
        <button
          onClick={() => onSelectQuickAction('dnp_request')}
          className="bg-[#F7F8FA] hover:bg-[#071D49] text-[#111827] hover:text-white px-3.5 py-1 rounded-full border border-[#C9A96E]/30 font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1"
        >
          📏 Medir DNP
        </button>
        <button
          onClick={() => onSelectQuickAction('catalog')}
          className="bg-[#F7F8FA] hover:bg-[#071D49] text-[#111827] hover:text-white px-3.5 py-1 rounded-full border border-[#C9A96E]/30 font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1"
        >
          👓 Lentes & Armações
        </button>
        <button
          onClick={() => onSelectQuickAction('pix')}
          className="bg-[#F7F8FA] hover:bg-[#071D49] text-[#111827] hover:text-white px-3.5 py-1 rounded-full border border-[#C9A96E]/30 font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1"
        >
          💳 Financeiro & Pix
        </button>
        <button
          onClick={() => onSelectQuickAction('catalog')}
          className="bg-[#F7F8FA] hover:bg-[#071D49] text-[#111827] hover:text-white px-3.5 py-1 rounded-full border border-[#C9A96E]/30 font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1"
        >
          📜 Histórico OS
        </button>
        <button
          onClick={() => onSendMessage('Olá! Como posso te ajudar hoje no WhatsApp das Óticas Di Óculos?')}
          className="bg-[#F7F8FA] hover:bg-[#071D49] text-[#111827] hover:text-white px-3.5 py-1 rounded-full border border-[#C9A96E]/30 font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1"
        >
          💬 WhatsApp
        </button>
        <button
          onClick={() => onSelectQuickAction('recipe_request')}
          className="bg-[#F7F8FA] hover:bg-[#071D49] text-[#111827] hover:text-white px-3.5 py-1 rounded-full border border-[#C9A96E]/30 font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1"
        >
          🩺 Exames de Vista
        </button>

        <button
          onClick={onGenerateAiSuggestion}
          disabled={isGeneratingAi}
          className="ml-auto bg-[#071D49] hover:bg-[#0B255C] text-[#C9A96E] px-3.5 py-1 rounded-full font-bold whitespace-nowrap shadow-xs flex items-center gap-1.5 disabled:opacity-50 transition-all border border-[#C9A96E]/50 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" />
          {isGeneratingAi ? 'Gerando...' : 'Copilot IA'}
        </button>
      </div>

      {/* 3. CARD EXCLUSIVO IA MARY (Docked/Floating Widget) */}
      {showMaryStatsCard && (
        <div className="mx-4 mt-2.5 p-3.5 bg-[#071D49] text-white rounded-[20px] border border-[#C9A96E]/40 shadow-md relative overflow-hidden shrink-0">
          <div className="flex items-center justify-between border-b border-[#C9A96E]/20 pb-2 mb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#0B255C] text-[#C9A96E] rounded-xl border border-[#C9A96E]/30">
                <Sparkles className="w-4 h-4 text-[#C9A96E]" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white tracking-wider uppercase flex items-center gap-1.5">
                  IA MARY <span className="text-[10px] text-[#C9A96E] font-normal">• Assistente Comercial</span>
                </h3>
                <div className="flex items-center gap-2 text-[10px] text-[#E8D2A8]">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
                    Online
                  </span>
                  <span>•</span>
                  <span>98% Assertividade</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowMaryStatsCard(false)}
              className="text-xs text-[#C9A96E] hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 bg-[#0B255C]/80 rounded-xl border border-[#C9A96E]/20">
              <div className="text-[10px] text-[#E8D2A8]">Tempo Resposta</div>
              <div className="font-bold text-white text-xs mt-0.5">&lt; 1.8 segundos</div>
            </div>
            <div className="p-2 bg-[#0B255C]/80 rounded-xl border border-[#C9A96E]/20">
              <div className="text-[10px] text-[#E8D2A8]">Leads Atendidos</div>
              <div className="font-bold text-white text-xs mt-0.5">142 Clientes</div>
            </div>
            <div className="p-2 bg-[#0B255C]/80 rounded-xl border border-[#C9A96E]/20">
              <div className="text-[10px] text-[#E8D2A8]">Vendas Geradas</div>
              <div className="font-bold text-[#10B981] text-xs mt-0.5">38 Orçamentos</div>
            </div>
            <div className="p-2 bg-[#0B255C]/80 rounded-xl border border-[#C9A96E]/20">
              <div className="text-[10px] text-[#E8D2A8]">Receita Influenciada</div>
              <div className="font-bold text-[#C9A96E] text-xs mt-0.5">R$ 47.120,00</div>
            </div>
          </div>
        </div>
      )}

      {/* 4. BALÕES DE CONVERSA */}
      <div className="flex-1 min-h-[160px] overflow-y-auto p-4 space-y-3.5 bg-[#F7F8FA]">
        {messages.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs italic font-medium">
            Inicie a conversa abaixo com o cliente.
          </div>
        ) : (
          messages.map((msg) => {
            const isCustomer = msg.sender === 'customer';
            const isAi = msg.sender === 'ai';
            const isSystem = msg.sender === 'system' || msg.text.includes('SISTEMA') || msg.text.includes('NOTIFICAÇÃO');

            // Balão Cliente: #FFFFFF
            // Balão IA Mary: #071D49
            // Balão Funcionário: #F3F4F6
            // Balão Sistema: #FFF7ED
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${
                  isCustomer ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Avatar */}
                <img
                  src={
                    isCustomer
                      ? client.avatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                      : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'
                  }
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover shrink-0 border border-[#C9A96E]/40 shadow-xs"
                />

                {/* Message Content Bubble */}
                <div
                  className={`max-w-md p-3.5 rounded-[20px] text-xs leading-relaxed shadow-xs transition-all ${
                    isSystem
                      ? 'bg-[#FFF7ED] text-[#111827] rounded-tl-xs border border-[#C9A96E]/60 shadow-sm'
                      : isCustomer
                      ? 'bg-white text-[#111827] rounded-tl-xs border border-slate-200/80'
                      : isAi
                      ? 'bg-[#071D49] text-white rounded-tr-xs border border-[#C9A96E]/40 shadow-md'
                      : 'bg-[#F3F4F6] text-[#111827] rounded-tr-xs border border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span
                      className={`font-bold text-[11px] flex items-center gap-1 ${
                        isAi ? 'text-[#E8D2A8]' : 'text-[#111827]'
                      }`}
                    >
                      {isCustomer
                        ? client.name
                        : isAi
                        ? 'IA Mary (Assistente Commercial)'
                        : isSystem
                        ? 'Notificação do Sistema'
                        : 'Atendente Loja'}
                      {isAi && <Sparkles className="w-3 h-3 text-[#C9A96E] inline" />}
                    </span>

                    <div className="flex items-center gap-2">
                      {isAi && (
                        <button
                          type="button"
                          onClick={() => handleSpeakMary(msg.id, msg.text)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 transition-all border cursor-pointer ${
                            activeSpeakingMsgId === msg.id
                              ? 'bg-[#C9A96E] text-[#071D49] border-[#C9A96E] animate-pulse'
                              : 'bg-[#0B255C] hover:bg-[#153270] text-[#E8D2A8] border-[#C9A96E]/40'
                          }`}
                          title="Ouvir resposta na voz da Mary"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>{activeSpeakingMsgId === msg.id ? 'Falando...' : 'Ouvir Mary'}</span>
                        </button>
                      )}
                      <span
                        className={`text-[10px] ${
                          isAi ? 'text-slate-300' : 'text-slate-400'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>

                  <p className="whitespace-pre-wrap font-normal leading-relaxed">{msg.text}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box & Voice/Video Controls */}
      <div className="p-3 bg-white border-t border-[#C9A96E]/20 space-y-2 shrink-0">
        {isRecording && (
          <div className="bg-rose-50 border border-rose-300 rounded-2xl p-2.5 flex items-center justify-between text-xs text-rose-900 animate-pulse">
            <span className="flex items-center gap-2 font-bold">
              <Mic className="w-4 h-4 text-rose-600 animate-bounce" />
              Gravando mensagem de áudio para Mary... ({recordingSeconds}s)
            </span>
            <button
              type="button"
              onClick={stopRecordingAndSend}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1 rounded-xl text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <Square className="w-3 h-3 fill-current" /> Enviar Áudio
            </button>
          </div>
        )}

        <form
          onSubmit={handleSend}
          className="bg-[#F7F8FA] border border-[#C9A96E]/30 rounded-full px-3.5 py-2 flex items-center justify-between focus-within:ring-1 focus-within:ring-[#C9A96E]"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/*,video/*,image/*,.pdf"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 text-slate-400 hover:text-[#071D49] hover:bg-slate-200/60 rounded-full transition-all cursor-pointer"
            title="Anexar áudio, vídeo ou receita"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Digite sua mensagem, grave um áudio para a Mary..."
            className="flex-1 bg-transparent text-xs text-[#111827] focus:outline-none px-2.5 placeholder-slate-400 font-normal"
          />

          <div className="flex items-center space-x-1.5">
            {!isRecording && (
              <button
                type="button"
                onClick={startRecording}
                className="p-2 text-rose-600 hover:bg-rose-50 rounded-full transition-all cursor-pointer"
                title="Gravar áudio"
              >
                <Mic className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              className="p-2 bg-[#071D49] text-[#C9A96E] hover:bg-[#0B255C] rounded-full transition-all shadow-xs flex items-center justify-center font-bold cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* 5. TIMELINE DE PROCESSO - Apple Workflow / Monday / ClickUp Style */}
      <div className="p-3 bg-white border-t border-[#C9A96E]/20 shrink-0 rounded-b-[20px]">
        <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>LINHA DO TEMPO DO PROCESSO DA OS</span>
          <span className="text-[#C9A96E]">Status Geral: Lentes em Produção</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs">
          {workflowSteps.map((step, idx) => {
            const StepIcon = step.icon;
            return (
              <div
                key={idx}
                className={`p-2 rounded-[14px] border flex flex-col justify-between transition-all ${
                  step.done
                    ? 'bg-[#10B981]/10 border-[#10B981]/30 text-[#111827]'
                    : step.active
                    ? 'bg-[#071D49] border-[#C9A96E] text-white shadow-sm'
                    : 'bg-[#F7F8FA] border-slate-200 text-[#6B7280]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[9px] font-bold uppercase truncate">{step.label}</span>
                  {step.done ? (
                    <Check className="w-3 h-3 text-[#10B981]" />
                  ) : (
                    <StepIcon className={`w-3 h-3 ${step.active ? 'text-[#C9A96E]' : 'text-slate-400'}`} />
                  )}
                </div>

                <div className="text-[9px] font-medium leading-tight">
                  <div className={step.active ? 'text-[#E8D2A8]' : 'text-[#6B7280]'}>{step.status}</div>
                  <div className={`text-[8.5px] mt-0.5 ${step.active ? 'text-slate-300' : 'text-slate-400'}`}>
                    {step.time} • {step.resp}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
