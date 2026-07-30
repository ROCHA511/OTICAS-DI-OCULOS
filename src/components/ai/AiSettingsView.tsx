import React, { useState } from 'react';
import { Bot, Sparkles, Phone, ShieldAlert, Key, Save, Check, RefreshCw, Volume2, Mic, Play, CheckCircle2, Star, Zap, Heart } from 'lucide-react';
import { AiSettings } from '../../types';
import { VOICE_PERSONAS_CONFIG, VoicePersonaKey, speakMaryPersona, stopMaryVoice } from '../../utils/speechUtils';
import { VoiceCloningStudio } from './VoiceCloningStudio';

interface AiSettingsViewProps {
  settings: AiSettings;
  onSaveSettings: (newSettings: AiSettings) => void;
}

export const AiSettingsView: React.FC<AiSettingsViewProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<AiSettings>({
    ...settings,
    voicePersona: settings.voicePersona || 'ideal',
  });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testPrompt, setTestPrompt] = useState('Quanto custa uma lente antirreflexo para grau -2.50?');
  const [testResponse, setTestResponse] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [playingPersona, setPlayingPersona] = useState<string | null>(null);

  // CEO Dioenne Rocha WhatsApp Command Console state
  const [ceoCommandText, setCeoCommandText] = useState('Mary, me passe o relatório do dia');
  const [ceoCommandResponse, setCeoCommandResponse] = useState('');
  const [isCeoCommandTesting, setIsCeoCommandTesting] = useState(false);

  const handlePlayPersonaSample = (personaKey: VoicePersonaKey) => {
    stopMaryVoice();
    setPlayingPersona(personaKey);
    speakMaryPersona(personaKey, undefined, {
      onEnd: () => setPlayingPersona(null),
      onError: () => setPlayingPersona(null),
    });
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleRunCeoCommand = async (customCommand?: string) => {
    const commandToSend = customCommand || ceoCommandText;
    setIsCeoCommandTesting(true);
    setCeoCommandResponse('');
    try {
      const res = await fetch('/api/gemini/ceo-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: commandToSend,
          systemState: {
            totalCaixaDia: 4850.00,
            vendasDia: 8,
            novosClientes: 5,
            osNoLaboratorio: 4,
            alertasPendentes: ['Orçamento ORC-2026-102 aguardando aprovação do CEO Dioenne Rocha', '1 foto de DNP necessitando de maior iluminação'],
          },
        }),
      });
      const data = await res.json();
      setCeoCommandResponse(data.text || 'Comando executado com sucesso.');
    } catch (err: any) {
      setCeoCommandResponse('Erro na execução do comando: ' + err.message);
    } finally {
      setIsCeoCommandTesting(false);
    }
  };

  const handleRunLiveTest = async () => {
    setIsTesting(true);
    setTestResponse('');
    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: testPrompt,
          clientInfo: { name: 'Cliente Teste Sandbox' },
        }),
      });
      const data = await res.json();
      setTestResponse(data.text || 'Resposta gerada com sucesso.');
    } catch (err: any) {
      setTestResponse('Erro na chamada da API Gemini: ' + err.message);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto overflow-y-auto h-[calc(100vh-65px)]">
      {/* Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-600" /> CONFIGURAÇÕES DO AGENTE IA & APROVAÇÃO CEO
          </h1>
          <p className="text-xs text-slate-500">
            Ajuste as regras de automação do WhatsApp Meta, limite de desconto do CEO Dioenne Rocha e chave Pix.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6 text-xs">
        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" /> Configurações salvas com sucesso!
          </div>
        )}

        {/* Section 1: WhatsApp Business Cloud API (Meta) */}
        <div className="space-y-4 border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                1. Conexão WhatsApp Business Cloud API (Meta Official)
                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-md border border-emerald-300 font-extrabold">
                  Meta Official API Active
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Integração oficial via Meta Graph API para envio e recebimento de mensagens e webhooks em tempo real.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Atendimento IA Automático</span>
              <input
                type="checkbox"
                checked={formData.autoReplyEnabled}
                onChange={(e) => setFormData({ ...formData, autoReplyEnabled: e.target.checked })}
                className="w-5 h-5 accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Número do WhatsApp Business:</label>
              <input
                type="text"
                value={formData.whatsappNumber || '5573981128923'}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                placeholder="5573981128923"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">Óticas Di Óculos - (73) 98112-8923</p>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">ID do Número de Telefone (Phone Number ID):</label>
              <input
                type="text"
                value={formData.metaPhoneNumberId || ''}
                onChange={(e) => setFormData({ ...formData, metaPhoneNumberId: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-800"
                placeholder="Ex: 109847263548910"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">ID da Conta WhatsApp Business (WABA ID):</label>
              <input
                type="text"
                value={formData.metaWabaId || ''}
                onChange={(e) => setFormData({ ...formData, metaWabaId: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-800"
                placeholder="Ex: 382910482019384"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Token de Verificação do Webhook (Verify Token):</label>
              <input
                type="text"
                value={formData.metaWebhookVerifyToken || ''}
                onChange={(e) => setFormData({ ...formData, metaWebhookVerifyToken: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-800"
                placeholder="Ex: di_oculos_meta_webhook_2026"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Token de Acesso Permanente Meta (System User Token):</label>
              <input
                type="password"
                value={formData.metaAccessToken || ''}
                onChange={(e) => setFormData({ ...formData, metaAccessToken: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800"
                placeholder="EAAG... (Cole aqui o token de usuário do sistema da Meta)"
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-[11px] space-y-1">
            <span className="font-black uppercase tracking-wide flex items-center gap-1 text-blue-800">
              <Bot className="w-3.5 h-3.5 text-blue-600" /> URL do Webhook Meta para configurar no Painel Meta Developers:
            </span>
            <code className="block p-2 bg-white rounded border border-blue-200 font-mono text-blue-950 font-bold select-all">
              https://ais-dev-qz7lavammczznxwgiawjko-248777919228.us-east5.run.app/api/whatsapp/meta-webhook
            </code>
          </div>
        </div>

        {/* Section 2: CEO Threshold & Contact */}
        <div className="space-y-3 border-b pb-4">
          <h3 className="text-sm font-bold text-slate-900">2. Alerta & Aprovação do CEO (Dioenne Rocha)</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Limite para Solicitar Aprovação do CEO (R$):
              </label>
              <input
                type="number"
                value={formData.ceoApprovalThreshold}
                onChange={(e) =>
                  setFormData({ ...formData, ceoApprovalThreshold: parseFloat(e.target.value) || 1500 })
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Orçamentos acima deste valor notificam automaticamente o CEO Dioenne Rocha no WhatsApp.
              </p>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Celular do CEO (Dioenne Rocha):</label>
              <input
                type="text"
                value={formData.ceoPhoneNumber || '(73) 99990-4727'}
                onChange={(e) => setFormData({ ...formData, ceoPhoneNumber: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Pix Configuration */}
        <div className="space-y-3 border-b pb-4">
          <h3 className="text-sm font-bold text-slate-900">3. Dados da Chave Pix da Ótica</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Tipo de Chave Pix:</label>
              <input
                type="text"
                value={formData.pixKeyType}
                onChange={(e) => setFormData({ ...formData, pixKeyType: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Chave Pix da Loja:</label>
              <input
                type="text"
                value={formData.pixKey}
                onChange={(e) => setFormData({ ...formData, pixKey: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Agente de IA Consultor Óptico Especialista */}
        <div className="space-y-4 border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                4. Agente de IA Consultor Óptico Especialista (Gemini 3.6 Flash)
                <span className="bg-amber-100 text-amber-900 text-[10px] px-2 py-0.5 rounded-md border border-amber-300 font-extrabold">
                  Recomendador & Medidor DNP
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Acesso integral à Tabela Oficial de Preços de Lentes, Catálogo de Armações e Visão Computacional.
              </p>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-sky-50 via-amber-50 to-blue-50 rounded-2xl border border-sky-200 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="font-extrabold text-[#0284C7] block">👓 Recomendação Inteligente de Lentes:</span>
                <p className="text-slate-600">
                  Cruzamento automático da receita (OD/OE) com a Tabela Oficial de Lentes (HOYA, ZEISS, Varilux, Kodak, Crizal, Transitions).
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="font-extrabold text-amber-700 block">🖼️ Indicação de Armações por Grau:</span>
                <p className="text-slate-600">
                  Para graus altos (&gt; -4.00), indica armações pequenas em acetato com aro fechado. Para graus leves/moderados, indica opções variadas.
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="font-extrabold text-emerald-700 block">📸 Guia de Foto DNP &amp; Validador de Qualidade:</span>
                <p className="text-slate-600">
                  Gera orientações passo a passo para o cliente e valida o alinhamento do cartão (85.6mm) e iluminação.
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="font-extrabold text-purple-700 block">📋 Clientes Online &amp; Orçamentos com IA:</span>
                <p className="text-slate-600">
                  Cadastra automaticamente clientes na lista "Clientes Online" e anexa os orçamentos na janela "Orçamentos e Vendas com IA".
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Escolha da Voz da Mary no WhatsApp (4 Versões + Opção de Clonagem de Voz por IA) */}
        <div className="space-y-6 border-b pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                5. Escolha &amp; Clonagem da Voz Oficial da Mary no WhatsApp
                <span className="bg-[#071D49] text-[#E8D2A8] text-[10px] px-2.5 py-0.5 rounded-full border border-[#C9A96E] font-extrabold">
                  4 Tons Distintos + Clonagem Neural
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Escolha entre os 4 tons de voz pré-configurados (cada um com ritmo, tom e velocidade únicos) ou grave sua própria voz para cloná-la com IA!
              </p>
            </div>
          </div>

          {/* Voice Personas Grid (4 Official Versions) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['ideal', 'tecnica', 'vip', 'express'] as VoicePersonaKey[]).map((pKey) => {
              const persona = VOICE_PERSONAS_CONFIG[pKey];
              const isSelected = (formData.voicePersona || 'ideal') === pKey;
              const isPlaying = playingPersona === pKey;

              return (
                <div
                  key={pKey}
                  onClick={() => setFormData({ ...formData, voicePersona: pKey })}
                  className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-gradient-to-br from-slate-900 via-[#071D49] to-slate-900 border-[#C9A96E] text-white shadow-lg ring-2 ring-[#C9A96E]/40 scale-[1.01]'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-2xs hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'border-[#C9A96E] bg-[#C9A96E] text-[#071D49]'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className={`text-xs font-black ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {persona.title}
                        </span>
                      </div>

                      <span
                        className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md border shrink-0 ${
                          isSelected ? 'bg-[#C9A96E] text-[#071D49] border-[#C9A96E]' : persona.badgeColor
                        }`}
                      >
                        {persona.badge}
                      </span>
                    </div>

                    <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-slate-200' : 'text-slate-600'}`}>
                      {persona.description}
                    </p>

                    {/* Characteristics tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {persona.toneCharacteristics.map((trait, idx) => (
                        <span
                          key={idx}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                            isSelected
                              ? 'bg-white/10 text-amber-200 border border-white/15'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          • {trait}
                        </span>
                      ))}
                    </div>

                    <div className={`text-[10px] p-2 rounded-xl border ${
                      isSelected
                        ? 'bg-white/5 border-white/10 text-slate-300'
                        : 'bg-amber-50/60 border-amber-200 text-amber-900'
                    }`}>
                      <strong className="block text-[10px] font-bold uppercase tracking-wider mb-0.5">
                        💡 Aplicação Prática no WhatsApp:
                      </strong>
                      {persona.useCases}
                    </div>
                  </div>

                  {/* Audio Audition Playback Bar */}
                  <div className={`pt-2 border-t flex items-center justify-between ${
                    isSelected ? 'border-white/15' : 'border-slate-100'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold ${
                        isSelected ? 'text-amber-300' : 'text-slate-500'
                      }`}>
                        Tom: {persona.pitch.toFixed(2)}x | Velocidade: {persona.rate.toFixed(2)}x
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayPersonaSample(pKey);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 ${
                        isPlaying
                          ? 'bg-rose-600 text-white animate-pulse'
                          : isSelected
                          ? 'bg-[#C9A96E] hover:bg-[#b8975d] text-[#071D49]'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Volume2 className="w-3.5 h-3.5 animate-bounce" /> Falando...
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" /> Ouvir Amostra
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Voice Cloning Studio Section */}
          <div className="pt-4 border-t border-slate-200">
            <VoiceCloningStudio
              currentClonedConfig={formData.clonedVoiceConfig}
              isActive={formData.voicePersona === 'clonada'}
              onSaveClonedVoice={(clonedConfig) => {
                setFormData((prev) => ({
                  ...prev,
                  clonedVoiceConfig: clonedConfig,
                  voicePersona: 'clonada',
                }));
              }}
              onActivateClonedVoice={() => {
                setFormData((prev) => ({
                  ...prev,
                  voicePersona: 'clonada',
                }));
              }}
            />
          </div>

          {/* Explanation Box on Why Voice Ideal or Cloned Voice is Best */}
          <div className="p-4 bg-gradient-to-r from-blue-900 via-[#071D49] to-indigo-950 text-white rounded-2xl border border-[#C9A96E] shadow-md space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#C9A96E] font-black uppercase text-[11px]">
              <Star className="w-4 h-4 fill-current" /> POR QUE A VOZ HUMANA &amp; CLONADA CONVERTE MAIS NO WHATSAPP?
            </div>
            <p className="text-slate-200 text-[11px] leading-relaxed">
              O cliente da Óticas Di Óculos busca atenciosidade e proximidade humana. Ao utilizar a <strong>Voz Clonada da Gerente/Proprietário</strong> ou a <strong>Voz 1 (Executiva &amp; Empática)</strong>, o cliente sente que está dialogando com uma pessoa de verdade, aumentando em até 3x a taxa de aprovação de orçamentos e de visitas à loja em Ituberá!
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" /> Salvar Alterações
        </button>
      </form>


      {/* Live Gemini Test Sandbox */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 text-xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-600" /> Teste ao Vivo de Atendimento da IA Mary (Sandbox Cliente)
        </h3>

        <div className="flex gap-2">
          <input
            type="text"
            value={testPrompt}
            onChange={(e) => setTestPrompt(e.target.value)}
            className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
            placeholder="Digite uma pergunta de cliente para testar a Mary..."
          />
          <button
            type="button"
            onClick={handleRunLiveTest}
            disabled={isTesting}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
          >
            {isTesting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Testando Mary...
              </>
            ) : (
              'Testar Atendimento Mary'
            )}
          </button>
        </div>

        {testResponse && (
          <div className="p-4 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 space-y-1 font-sans">
            <div className="text-[10px] text-cyan-400 font-bold uppercase">Resposta da IA Mary no WhatsApp:</div>
            <p className="whitespace-pre-line text-xs">{testResponse}</p>
          </div>
        )}
      </div>

      {/* CEO Dioenne Rocha Command Terminal & Executive Reports */}
      <div className="bg-gradient-to-br from-amber-50 via-white to-slate-900 rounded-2xl border border-amber-300 shadow-sm p-6 space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
          <div>
            <h3 className="text-sm font-black text-amber-950 flex items-center gap-2">
              👑 Terminal de Comando WhatsApp do CEO Dioenne Rocha -&gt; Mary (IA)
              <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase">
                Acesso Direto CEO
              </span>
            </h3>
            <p className="text-[11px] text-slate-600">
              Envie ordens diretamente para a Mary como CEO Dioenne Rocha no WhatsApp para receber relatórios em tempo real, aprovar orçamentos e controlar o caixa.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-[10px] font-bold">
          <span className="text-slate-500 flex items-center gap-1 self-center">Comandos Rápidos do CEO:</span>
          <button
            type="button"
            onClick={() => {
              setCeoCommandText('Mary, me passe o relatório diário do sistema');
              handleRunCeoCommand('Mary, me passe o relatório diário do sistema');
            }}
            className="px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            📊 Relatório Diário Completo
          </button>
          <button
            type="button"
            onClick={() => {
              setCeoCommandText('/caixa');
              handleRunCeoCommand('/caixa');
            }}
            className="px-3 py-1.5 bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            💰 Resumo de Caixa do Dia
          </button>
          <button
            type="button"
            onClick={() => {
              setCeoCommandText('/vendas');
              handleRunCeoCommand('/vendas');
            }}
            className="px-3 py-1.5 bg-white border border-blue-300 hover:bg-blue-100 text-blue-900 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            🚀 Vendas &amp; Novos Clientes
          </button>
          <button
            type="button"
            onClick={() => {
              setCeoCommandText('/alerta');
              handleRunCeoCommand('/alerta');
            }}
            className="px-3 py-1.5 bg-white border border-rose-300 hover:bg-rose-100 text-rose-900 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            ⚠️ Alertas &amp; Problemas Pendentes
          </button>
          <button
            type="button"
            onClick={() => {
              setCeoCommandText('/aprovar ORC-2026-102');
              handleRunCeoCommand('/aprovar ORC-2026-102');
            }}
            className="px-3 py-1.5 bg-white border border-purple-300 hover:bg-purple-100 text-purple-900 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            ✅ Aprovar Orçamento Especial
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={ceoCommandText}
            onChange={(e) => setCeoCommandText(e.target.value)}
            className="flex-1 p-3 bg-white border border-amber-300 rounded-xl text-xs font-semibold text-slate-800 shadow-2xs focus:ring-2 focus:ring-amber-500"
            placeholder="Digite o comando do CEO Dioenne Rocha no WhatsApp..."
          />
          <button
            type="button"
            onClick={() => handleRunCeoCommand()}
            disabled={isCeoCommandTesting}
            className="px-5 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-extrabold rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
          >
            {isCeoCommandTesting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Processando...
              </>
            ) : (
              'Enviar Comando para Mary'
            )}
          </button>
        </div>

        {ceoCommandResponse && (
          <div className="p-4 bg-emerald-950 text-emerald-100 rounded-2xl border border-emerald-700 space-y-2 font-mono text-xs shadow-inner">
            <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold border-b border-emerald-800 pb-2">
              <span className="flex items-center gap-2">
                🟢 RESPOSTA OFICIAL DA MARY NO WHATSAPP DO CEO DIOENNE ROCHA
              </span>
              <span className="text-[10px] bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded-md font-mono">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
            <p className="whitespace-pre-line text-xs leading-relaxed font-sans font-medium text-emerald-50">
              {ceoCommandResponse}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
