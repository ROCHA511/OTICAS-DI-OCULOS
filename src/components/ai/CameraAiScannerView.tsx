import React, { useState } from 'react';
import { Camera, Scan, Upload, FileText, Glasses, Sparkles, CheckCircle2, RefreshCw, Eye, Zap, Copy, Check, Save } from 'lucide-react';

export const CameraAiScannerView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dnp_mary' | 'receita' | 'armacao'>('dnp_mary');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [formattedMessage, setFormattedMessage] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(true);

  const handleSimulateScan = async () => {
    setIsScanning(true);
    setScanResult(null);
    setFormattedMessage('');

    if (activeTab === 'dnp_mary') {
      try {
        const res = await fetch('/api/gemini/measure-dnp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: 'data:image/jpeg;base64,sample',
            frameId: 'ARM-2026-RAYBAN',
            clientId: 'CLI-789',
          }),
        });
        const data = await res.json();
        setIsScanning(false);
        if (data.success) {
          setScanResult(data.measurement);
          setFormattedMessage(data.formattedText);
        }
      } catch (e) {
        setIsScanning(false);
        const fallbackMeas = {
          dnp_od: 31.5,
          dnp_oe: 32.0,
          dp_total: 63.5,
          altura_montagem: 21.0,
          frame_id: 'ARM-2026-RAYBAN',
          client_id: 'CLI-789',
        };
        setScanResult(fallbackMeas);
        setFormattedMessage(`Foto processada com sucesso! Identifiquei os reflexos de luz e marcos faciais.

**Medidas Pupilares Horizontal:**
* **DNP Olho Direito (OD):** 31.5 mm
* **DNP Olho Esquerdo (OE):** 32.0 mm
* **DP Total:** 63.5 mm *(Conferência: Soma das DNPs = 63.5 mm)*

**Medida Vertical (Altura de Montagem):**
* **Altura de Montagem:** 21.0 mm

Seus dados foram salvos e já estão prontos para a produção das suas lentes digitais!`);
      }
    } else {
      setTimeout(() => {
        setIsScanning(false);
        if (activeTab === 'receita') {
          setScanResult({
            medico: 'Dr. Fernando Vasconcelos - CRM/SP 148.920',
            dataExame: '28/07/2026',
            od: { esferico: -2.75, cilindrico: -0.75, eixo: 180 },
            oe: { esferico: -3.00, cilindrico: -0.50, eixo: 175 },
            adicao: 1.75,
            observacao: 'Lentes fotossensíveis com anti-reflexo recomendadas',
          });
        } else {
          setScanResult({
            marca: 'Ray-Ban',
            modelo: 'Clubmaster Classic RB5154',
            codigo: 'RB5154-2000',
            cor: 'Preto / Dourado',
            material: 'Acetato e Metal Titânio',
            ponte: 18,
            aro: 52,
            haste: 140,
            precoSugerido: 'R$ 680,00',
          });
        }
      }, 1500);
    }
  };

  const copyMessageToClipboard = () => {
    navigator.clipboard.writeText(formattedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#071D49] text-[#E8D2A8] border border-[#C9A96E]/40 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#C9A96E]" /> IA Mary Bio-Óptica
            </span>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              Visão Computacional & Biometria Pupilar 3D
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Motor de processamento da IA Mary: Malha 3D de 468 pontos faciais, reflexo do flash na pupila e medições DNP/Altura sem objetos físicos.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-extrabold flex-wrap">
          <button
            onClick={() => {
              setActiveTab('dnp_mary');
              setScanResult(null);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'dnp_mary'
                ? 'bg-[#071D49] text-[#E8D2A8] border border-[#C9A96E]/50 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-[#C9A96E]" /> Biometria DNP (Mary)
          </button>
          <button
            onClick={() => {
              setActiveTab('receita');
              setScanResult(null);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'receita'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Leitura Receita
          </button>
          <button
            onClick={() => {
              setActiveTab('armacao');
              setScanResult(null);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'armacao'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Glasses className="w-3.5 h-3.5" /> Reconhecimento Armação
          </button>
        </div>
      </div>

      {/* Camera / Upload Canvas & Result Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Scanner Frame */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#071D49]" /> Câmera / Escaneamento Bio-Óptico
              </h3>
              {activeTab === 'dnp_mary' ? (
                <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-600 fill-current" /> Flash Recomendado
                </span>
              ) : (
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                  Gemini Vision API
                </span>
              )}
            </div>

            {/* Instruction Banner for DNP Mary */}
            {activeTab === 'dnp_mary' && (
              <div className="p-3 bg-[#071D49] text-white rounded-xl border border-[#C9A96E]/40 text-xs space-y-1">
                <span className="text-[#C9A96E] font-bold block flex items-center gap-1">
                  📸 Instrução para o Cliente (IA Mary):
                </span>
                <p className="text-slate-200 text-[11px] leading-relaxed">
                  "Tire uma foto com o <strong>FLASH da câmera ligado</strong>. Olhe diretamente para a lente da câmera.
                  <em>(O flash cria o ponto de reflexo de luz na pupila para garantir precisão milimétrica).</em>"
                </p>
              </div>
            )}

            {/* Simulated Viewfinder */}
            <div className="relative w-full h-72 bg-slate-900 rounded-2xl overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-slate-700 text-slate-400 p-4">
              {isScanning ? (
                <div className="flex flex-col items-center space-y-3 text-center">
                  <RefreshCw className="w-8 h-8 text-[#C9A96E] animate-spin" />
                  <span className="text-xs font-extrabold text-amber-200">
                    Projetando malha 3D MediaPipe (468 pontos) &amp; Detectando reflexo do Flash...
                  </span>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Calculando DNP OD, DNP OE e Altura de Montagem...
                  </div>
                </div>
              ) : scanResult ? (
                <div className="relative w-full h-full">
                  <img
                    src={
                      activeTab === 'dnp_mary'
                        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600'
                        : activeTab === 'receita'
                        ? 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500'
                        : 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500'
                    }
                    alt="Escaneamento"
                    className="w-full h-full object-cover rounded-xl opacity-85"
                  />
                  {activeTab === 'dnp_mary' && (
                    <div className="absolute inset-0 border-2 border-[#C9A96E]/80 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                      <div className="flex justify-between items-center text-[10px] bg-black/60 text-[#C9A96E] font-mono px-2 py-1 rounded">
                        <span>● MALHA 3D MEDIAPIPE ATIVA</span>
                        <span>468 PONTOS DETECTADOS</span>
                      </div>
                      <div className="flex justify-around items-center">
                        <div className="w-6 h-6 border-2 border-emerald-400 rounded-full flex items-center justify-center text-[9px] bg-emerald-500/30 text-white font-bold animate-ping">
                          OD
                        </div>
                        <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                        <div className="w-6 h-6 border-2 border-emerald-400 rounded-full flex items-center justify-center text-[9px] bg-emerald-500/30 text-white font-bold animate-ping">
                          OE
                        </div>
                      </div>
                      <div className="text-center text-[10px] bg-black/60 text-emerald-400 font-mono py-0.5 rounded">
                        DP: 63.5mm | DNP OD: 31.5mm | DNP OE: 32.0mm
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center text-center space-y-2">
                  <Upload className="w-8 h-8 text-slate-500" />
                  <p className="text-xs font-semibold text-slate-300">
                    {activeTab === 'dnp_mary'
                      ? 'Capture a foto com FLASH ativado ou selecione do dispositivo'
                      : `Arraste a foto da ${activeTab === 'receita' ? 'receita médica' : 'armação'} ou clique para capturar`}
                  </p>
                  <span className="text-[10px] text-slate-500">Formatos aceitos: JPG, PNG, WEBP (Até 10MB)</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleSimulateScan}
            disabled={isScanning}
            className="w-full py-3 bg-[#071D49] hover:bg-[#0B255C] text-[#C9A96E] font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 border border-[#C9A96E]/50 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#C9A96E]" />
            {isScanning
              ? 'Processando Biometria 3D...'
              : activeTab === 'dnp_mary'
              ? 'Executar Medição DNP com IA Mary'
              : 'Iniciar Escaneamento IA'}
          </button>
        </div>

        {/* Right: Extracted Result Panel */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Scan className="w-4 h-4 text-[#071D49]" /> Resultado da Biometria Bio-Óptica
            </h3>
            {scanResult && (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Processado com Sucesso
              </span>
            )}
          </div>

          {scanResult ? (
            activeTab === 'dnp_mary' ? (
              <div className="space-y-4 text-xs">
                {/* Formatted Customer Text Output */}
                <div className="p-4 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 space-y-2 font-sans relative">
                  <div className="flex items-center justify-between text-[10px] text-[#C9A96E] font-bold border-b border-slate-800 pb-1.5">
                    <span>MENSAGEM ENVIADA AO CLIENTE (SISTEMA IA MARY)</span>
                    <button
                      onClick={copyMessageToClipboard}
                      className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded text-white text-[10px] cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#C9A96E]" />}
                      {copied ? 'Copiado!' : 'Copiar Texto'}
                    </button>
                  </div>

                  <div className="text-xs leading-relaxed whitespace-pre-line text-slate-200">
                    {formattedMessage}
                  </div>
                </div>

                {/* Attached JSON Payload */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    JSON Gerado e Anexado à Ordem de Serviço (OS) do Cliente:
                  </span>
                  <pre className="p-2.5 bg-white border border-slate-200 rounded-lg text-[11px] font-mono text-emerald-800 overflow-x-auto">
                    {JSON.stringify(scanResult, null, 2)}
                  </pre>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => alert('Medições e Imagem Anexadas à Ordem de Serviço do Cliente!')}
                    className="flex-1 py-2 bg-[#071D49] hover:bg-[#0B255C] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 text-[#C9A96E]" /> Anexar à OS do Cliente
                  </button>
                </div>
              </div>
            ) : activeTab === 'receita' ? (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 space-y-1">
                  <div className="font-extrabold text-blue-900">{scanResult.medico}</div>
                  <div className="text-[10px] text-blue-700">Data do Exame: {scanResult.dataExame}</div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-center text-xs font-mono border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase">
                        <th className="p-2 text-left">Olho</th>
                        <th className="p-2">Esférico</th>
                        <th className="p-2">Cilíndrico</th>
                        <th className="p-2">Eixo</th>
                        <th className="p-2">Adição</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-bold">
                      <tr>
                        <td className="p-2 text-left text-blue-700">OD</td>
                        <td className="p-2">{scanResult.od.esferico.toFixed(2)}</td>
                        <td className="p-2">{scanResult.od.cilindrico.toFixed(2)}</td>
                        <td className="p-2">{scanResult.od.eixo}°</td>
                        <td className="p-2">+{scanResult.adicao.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-left text-blue-700">OE</td>
                        <td className="p-2">{scanResult.oe.esferico.toFixed(2)}</td>
                        <td className="p-2">{scanResult.oe.cilindrico.toFixed(2)}</td>
                        <td className="p-2">{scanResult.oe.eixo}°</td>
                        <td className="p-2">+{scanResult.adicao.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] font-medium">
                  <strong>Observação IA:</strong> {scanResult.observacao}
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 space-y-1">
                  <div className="font-black text-indigo-900 text-sm">
                    {scanResult.marca} - {scanResult.modelo}
                  </div>
                  <div className="text-[11px] text-indigo-700 font-mono">Código: {scanResult.codigo}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px]">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Cor</span>
                    <span className="font-extrabold text-slate-800">{scanResult.cor}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Material</span>
                    <span className="font-extrabold text-slate-800">{scanResult.material}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Ponte / Aro / Haste</span>
                    <span className="font-extrabold text-slate-800">
                      {scanResult.ponte}mm / {scanResult.aro}mm / {scanResult.haste}mm
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Preço Sugerido</span>
                    <span className="font-extrabold text-emerald-700">{scanResult.precoSugerido}</span>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs italic">
              Nenhum resultado escaneado ainda. Clique no botão de processamento para calcular a biometria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

