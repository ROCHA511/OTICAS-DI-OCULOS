import React, { useState } from 'react';
import {
  X,
  Bot,
  Sparkles,
  Camera,
  CheckCircle2,
  FileText,
  Glasses,
  Send,
  HelpCircle,
  AlertCircle,
  RefreshCw,
  Award,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { OpticalPrescription, AiQuote, Client } from '../../types';

interface AiConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveQuote: (newQuote: AiQuote, newOnlineClient: Client) => void;
}

export const AiConsultantModal: React.FC<AiConsultantModalProps> = ({
  isOpen,
  onClose,
  onSaveQuote,
}) => {
  const [clientName, setClientName] = useState('Cliente Exclusivo Online IA');
  const [clientPhone, setClientPhone] = useState('(73) 98888-2026');
  
  // Prescription inputs
  const [odEsf, setOdEsf] = useState(-3.50);
  const [odCil, setOdCil] = useState(-1.00);
  const [odEixo, setOdEixo] = useState(90);

  const [oeEsf, setOeEsf] = useState(-3.25);
  const [oeCil, setOeCil] = useState(-0.75);
  const [oeEixo, setOeEixo] = useState(85);

  const [adicao, setAdicao] = useState(0);

  const [loading, setLoading] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState<any>(null);

  // DNP Photo simulation & feedback state
  const [dnpPhotoBase64, setDnpPhotoBase64] = useState<string | null>(null);
  const [dnpQualityStatus, setDnpQualityStatus] = useState<'pending' | 'analyzing' | 'approved' | 'rejected'>('pending');
  const [dnpFeedbackMessage, setDnpFeedbackMessage] = useState('');

  if (!isOpen) return null;

  const handleRunConsultant = async () => {
    setLoading(true);
    try {
      const prescriptionData: OpticalPrescription = {
        od: { esferico: odEsf, cilindrico: odCil, eixo: odEixo },
        oe: { esferico: oeEsf, cilindrico: oeCil, eixo: oeEixo },
        adicao,
      };

      const res = await fetch('/api/gemini/optical-consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          prescription: prescriptionData,
        }),
      });

      const json = await res.json();
      setRecommendationResult(json.data);
    } catch (err: any) {
      console.error('Error in AI Consultant:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateDnpPhoto = (quality: 'good' | 'bad') => {
    setDnpQualityStatus('analyzing');
    setTimeout(() => {
      if (quality === 'good') {
        setDnpQualityStatus('approved');
        setDnpFeedbackMessage('✅ Foto aprovada! Cartão magnético detectado com escala calibrada de 85.6mm. DNP OD: 31.5mm / DNP OE: 32.0mm (Confiança IA: 98%).');
      } else {
        setDnpQualityStatus('rejected');
        setDnpFeedbackMessage('⚠️ Foto não aprovada: pouca iluminação e cartão levemente inclinado. Por favor afaste o celular a 40cm, alinhe o cartão exatamente na testa e ligue a luz ambiente.');
      }
    }, 1200);
  };

  const handleGenerateQuoteAndSave = () => {
    if (!recommendationResult) return;

    const lensPrice = recommendationResult.lensRecommendation.estimatedPrice || 680;
    const framePrice = recommendationResult.frameRecommendation.estimatedPrice || 380;
    const totalValue = lensPrice + framePrice;
    const pixDiscountValue = totalValue * 0.9;
    const installmentValue = totalValue / 10;

    const newQuote: AiQuote = {
      id: `ORC-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientId: `cli-online-${Date.now()}`,
      clientName,
      clientPhone,
      prescription: {
        od: { esferico: odEsf, cilindrico: odCil, eixo: odEixo },
        oe: { esferico: oeEsf, cilindrico: oeCil, eixo: oeEixo },
        adicao,
      },
      dnp: {
        dnpOD: 31.5,
        dnpOE: 32.0,
        dpTotal: 63.5,
        alturaCentroOD: 21.0,
        alturaCentroOE: 21.5,
        cardDetected: true,
        confidenceScore: 98,
      },
      recommendedLensName: recommendationResult.lensRecommendation.name,
      lensPrice,
      recommendedFrameName: recommendationResult.frameRecommendation.material + ' - ' + recommendationResult.frameRecommendation.rimType,
      framePrice,
      totalValue,
      pixDiscountValue,
      installmentText: `10x de R$ ${installmentValue.toFixed(2)} sem juros`,
      status: totalValue > 1500 ? 'aguardando_ceo' : 'enviado',
      ceoApprovalNeeded: totalValue > 1500,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      aiNotes: recommendationResult.quoteSummaryText,
    };

    const newOnlineClient: Client = {
      id: newQuote.clientId,
      name: clientName,
      phone: clientPhone,
      status: 'awaiting_quote',
      isAiHandled: true,
      lastInteraction: 'Agora mesmo (Agente IA)',
      unreadCount: 0,
      tags: ['Clientes Online IA', 'Atendimento WhatsApp Meta'],
      prescription: newQuote.prescription,
      dnp: newQuote.dnp,
    };

    onSaveQuote(newQuote, newOnlineClient);
    alert(`✨ Orçamento ${newQuote.id} criado com sucesso e anexado na Janela "Orçamentos e Vendas com IA"!\nCliente salvo na lista "Clientes Online".`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border-2 border-[#C5A059] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-[#0B2D5C] via-[#0284C7] to-[#0B1E36] text-white p-5 rounded-t-3xl border-b border-[#C5A059] flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C5A059] text-slate-950 flex items-center justify-center shadow-md font-black">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                Mary (IA) - Consultora Óptica Especialista &amp; Assistente Executiva
              </h2>
              <p className="text-xs text-sky-200">
                Acesso à Tabela Oficial de Preços de Lentes, Visão Computacional DNP e comando do CEO Dioenne Rocha.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-xs text-slate-800">
          {/* Step 1: Client & Prescription Data */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0284C7]" /> 1. Dados do Cliente & Receita Inserida
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nome do Cliente:</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">WhatsApp Meta:</label>
                <input
                  type="text"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold"
                />
              </div>
            </div>

            {/* Prescription Table Input */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
              <div className="font-extrabold text-[11px] text-slate-700 uppercase tracking-wide">
                Grau da Receita Óptica (Dióptrico):
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* OD */}
                <div className="bg-sky-50/50 p-2.5 rounded-xl border border-sky-200 space-y-2">
                  <div className="font-black text-sky-900 text-xs">Olho Direito (OD):</div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold block">Esférico</label>
                      <input
                        type="number"
                        step="0.25"
                        value={odEsf}
                        onChange={(e) => setOdEsf(parseFloat(e.target.value) || 0)}
                        className="w-full p-1 bg-white border rounded font-mono font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold block">Cilíndrico</label>
                      <input
                        type="number"
                        step="0.25"
                        value={odCil}
                        onChange={(e) => setOdCil(parseFloat(e.target.value) || 0)}
                        className="w-full p-1 bg-white border rounded font-mono font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold block">Eixo (°)</label>
                      <input
                        type="number"
                        value={odEixo}
                        onChange={(e) => setOdEixo(parseInt(e.target.value) || 0)}
                        className="w-full p-1 bg-white border rounded font-mono font-bold text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* OE */}
                <div className="bg-sky-50/50 p-2.5 rounded-xl border border-sky-200 space-y-2">
                  <div className="font-black text-sky-900 text-xs">Olho Esquerdo (OE):</div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold block">Esférico</label>
                      <input
                        type="number"
                        step="0.25"
                        value={oeEsf}
                        onChange={(e) => setOeEsf(parseFloat(e.target.value) || 0)}
                        className="w-full p-1 bg-white border rounded font-mono font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold block">Cilíndrico</label>
                      <input
                        type="number"
                        step="0.25"
                        value={oeCil}
                        onChange={(e) => setOeCil(parseFloat(e.target.value) || 0)}
                        className="w-full p-1 bg-white border rounded font-mono font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold block">Eixo (°)</label>
                      <input
                        type="number"
                        value={oeEixo}
                        onChange={(e) => setOeEixo(parseInt(e.target.value) || 0)}
                        className="w-full p-1 bg-white border rounded font-mono font-bold text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleRunConsultant}
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-[#0284C7] to-[#0B2D5C] hover:brightness-110 text-white font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Processando Análise com Gemini 3.6 Flash...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" /> Consultar Tabela Oficial de Lentes e Sugerir Lente Ideal + Armação
                </>
              )}
            </button>
          </div>

          {/* Step 2: Gemini Recommendation Results */}
          {recommendationResult && (
            <div className="space-y-4 border-2 border-[#C5A059]/50 p-4 rounded-2xl bg-amber-50/30">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#C5A059]" /> 2. Recomendação Oficial da IA Mary (Lente Ideal &amp; Armação)
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    import('../../utils/speechUtils').then((m) => {
                      const textToSay = `Recomendação oficial da Mary para ${clientName || 'o cliente'}. A lente ideal é ${recommendationResult.lensRecommendation.name}, valor de R$ ${recommendationResult.lensRecommendation.estimatedPrice?.toFixed(2)}. Armação recomendada em ${recommendationResult.frameRecommendation.material}. Total do orçamento de R$ ${(recommendationResult.lensRecommendation.estimatedPrice + recommendationResult.frameRecommendation.estimatedPrice).toFixed(2)}, com 10% de desconto no Pix.`;
                      m.speakMaryVoice(textToSay);
                    });
                  }}
                  className="px-3 py-1 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  🔊 Ouvir Apresentação da Mary
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Ideal Lens */}
                <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs space-y-2">
                  <div className="text-[10px] text-[#0284C7] font-black uppercase tracking-wider">
                    Lente Ideal Sugerida pela IA
                  </div>
                  <h4 className="text-sm font-black text-slate-900">{recommendationResult.lensRecommendation.name}</h4>
                  <div className="text-xs font-extrabold text-emerald-700">
                    Preço de Tabela: R$ {recommendationResult.lensRecommendation.estimatedPrice?.toFixed(2)}
                  </div>
                  <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <strong>Motivo Técnico:</strong> {recommendationResult.lensRecommendation.technicalReason}
                  </p>
                </div>

                {/* Recommended Frame */}
                <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs space-y-2">
                  <div className="text-[10px] text-amber-700 font-black uppercase tracking-wider">
                    Indicação de Armação por Grau
                  </div>
                  <h4 className="text-sm font-black text-slate-900">
                    {recommendationResult.frameRecommendation.material} ({recommendationResult.frameRecommendation.rimType})
                  </h4>
                  <div className="text-xs font-extrabold text-amber-700">
                    Preço Médio Armação: R$ {recommendationResult.frameRecommendation.estimatedPrice?.toFixed(2)}
                  </div>
                  <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <strong>Motivo Técnico:</strong> {recommendationResult.frameRecommendation.technicalReason}
                  </p>
                </div>
              </div>

              {/* DNP Photo Instructions Guide */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-black text-xs text-slate-900 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-sky-600" /> Passo a Passo de Orientação ao Cliente para Foto de DNP
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  {recommendationResult.dnpPhotoGuide?.map((step: string, idx: number) => (
                    <div key={idx} className="p-2.5 bg-sky-50/80 border border-sky-200 rounded-xl font-medium text-sky-950 flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>

                {/* Simulated DNP Photo Quality Check */}
                <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-extrabold text-xs text-slate-800">
                    Testar Validação de Foto de DNP Recebida do WhatsApp:
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSimulateDnpPhoto('good')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs cursor-pointer flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Simular Foto Aprovada (Alinhada)
                    </button>

                    <button
                      onClick={() => handleSimulateDnpPhoto('bad')}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs cursor-pointer flex items-center gap-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5" /> Simular Foto Inadequada (Instruções de Ajuste)
                    </button>
                  </div>

                  {dnpQualityStatus === 'analyzing' && (
                    <div className="text-xs text-sky-700 font-bold flex items-center gap-1 animate-pulse">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Analisando alinhamento facial e cartão de referência...
                    </div>
                  )}

                  {dnpFeedbackMessage && dnpQualityStatus !== 'analyzing' && (
                    <div
                      className={`p-3 rounded-xl border text-xs font-semibold ${
                        dnpQualityStatus === 'approved'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                          : 'bg-rose-50 border-rose-300 text-rose-900'
                      }`}
                    >
                      {dnpFeedbackMessage}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Save & Attach Quote */}
              <div className="flex items-center justify-between pt-3 border-t">
                <div>
                  <div className="text-sm font-black text-slate-900">
                    Total Orçamento: R$ {((recommendationResult.lensRecommendation.estimatedPrice || 680) + (recommendationResult.frameRecommendation.estimatedPrice || 380)).toFixed(2)}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-bold">
                    Pix 10% OFF: R$ {(((recommendationResult.lensRecommendation.estimatedPrice || 680) + (recommendationResult.frameRecommendation.estimatedPrice || 380)) * 0.9).toFixed(2)}
                  </div>
                </div>

                <button
                  onClick={handleGenerateQuoteAndSave}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#C5A059] via-amber-400 to-[#C5A059] hover:brightness-110 text-slate-950 font-black text-xs rounded-xl shadow-lg border border-amber-200 flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>Salvar em "Clientes Online" e Anexar a "Orçamentos e Vendas com IA"</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
