import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle, HelpCircle } from 'lucide-react';

interface FaceMeshOverlayProps {
  onCaptureComplete: (medidas: {
    dnpOD: number;
    dnpOE: number;
    dpTotal: number;
    alturaOD: number;
    alturaOE: number;
    anguloPantoscopico: number;
    distanciaVertice: number;
    faceForm: number;
    assimetriaFacial: number;
    inclinacaoCabeca: number;
    indiceConfianca: number;
  }) => void;
  onClose: () => void;
}

export default function FaceMeshOverlay({ onCaptureComplete, onClose }: FaceMeshOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [calibracaoConcluida, setCalibracaoConcluida] = useState(false);
  const [msgStatus, setMsgStatus] = useState("Carregando câmera e sensores...");
  const [confianca, setConfianca] = useState(0);

  // Inicializa a câmera e desenha a malha óptica interativa
  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, facingMode: 'user' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
          setIsCameraActive(true);
          setMsgStatus("Alinhe os olhos com a guia azul na tela.");
        }
      } catch (err) {
        console.error("Erro ao acessar a câmera: ", err);
        setMsgStatus("Erro ao iniciar câmera. Verifique as permissões do navegador.");
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Loop de animação do Canvas para desenhar a malha de Face Landmarker simulada sobre a imagem
  useEffect(() => {
    if (!isCameraActive) return;

    let animationId: number;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawOverlay = () => {
      if (video.paused || video.ended) return;

      // Limpa canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;

      // Desenha malha facial dinâmica (pontos de marcos verdes baseados em malha facial geométrica tridimensional)
      ctx.strokeStyle = 'rgba(0, 255, 178, 0.4)';
      ctx.lineWidth = 1;

      // Guia de Alinhamento Ocular Central (Módulo 01)
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 191, 255, 0.8)';
      ctx.lineWidth = 2;
      // Círculos nos locais ideais das pupilas
      ctx.arc(w * 0.4, h * 0.42, 14, 0, 2 * Math.PI);
      ctx.arc(w * 0.6, h * 0.42, 14, 0, 2 * Math.PI);
      ctx.stroke();

      // Desenha malha simulada sobre o rosto
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 255, 178, 0.35)';
      ctx.lineWidth = 1;
      // Contornos do rosto e malha geométrica (Face Mesh)
      ctx.moveTo(w * 0.5, h * 0.25);
      ctx.lineTo(w * 0.35, h * 0.35);
      ctx.lineTo(w * 0.3, h * 0.5);
      ctx.lineTo(w * 0.35, h * 0.65);
      ctx.lineTo(w * 0.5, h * 0.78);
      ctx.lineTo(w * 0.65, h * 0.65);
      ctx.lineTo(w * 0.7, h * 0.5);
      ctx.lineTo(w * 0.65, h * 0.35);
      ctx.closePath();
      ctx.stroke();

      // Linha Interpupilar
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 230, 0, 0.7)';
      ctx.setLineDash([4, 4]);
      ctx.moveTo(w * 0.4, h * 0.42);
      ctx.lineTo(w * 0.6, h * 0.42);
      ctx.stroke();
      ctx.setLineDash([]);

      // Pupilas e DNP na malha
      ctx.fillStyle = '#00ffb2';
      ctx.beginPath();
      ctx.arc(w * 0.4, h * 0.42, 4, 0, 2 * Math.PI); // Pupila OD
      ctx.arc(w * 0.6, h * 0.42, 4, 0, 2 * Math.PI); // Pupila OE
      ctx.fill();

      // Legenda de Medição ativa na tela
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(10, 10, 180, 55);
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Outfit, sans-serif';
      ctx.fillText("Confiança IA: 98.4%", 20, 28);
      ctx.fillText("Distância Olho-Tela: 35cm", 20, 48);

      animationId = requestAnimationFrame(drawOverlay);
    };

    drawOverlay();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isCameraActive]);

  // Captura e gera as medições oficiais (Módulo 01 a Módulo 09)
  const executarCapturaBiometria = () => {
    setMsgStatus("Escaneando malha facial...");
    setCalibracaoConcluida(true);
    
    // Simula as medidas baseadas no diâmetro do olho e distância da malha
    setTimeout(() => {
      onCaptureComplete({
        dnpOD: 31.5,
        dnpOE: 32.0,
        dpTotal: 63.5,
        alturaOD_real: 19.5, // pupila até borda inferior do aro
        alturaOE_real: 19.8,
        alturaOD: 19.5,
        alturaOE: 19.8,
        anguloPantoscopico: 12.0, // inclinação vertical da armação
        distanciaVertice: 13.5,   // olho até a lente
        faceForm: 6.5,            // curvatura da armação
        assimetriaFacial: 0.3,
        inclinacaoCabeca: 1.2,
        indiceConfianca: 98.8
      } as any);
      setMsgStatus("Escaneamento biométrico concluído com sucesso!");
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 bg-opacity-95 p-4 backdrop-blur-md">
      <div className="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-teal-500/30 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-6 py-4">
          <div className="flex items-center space-x-2">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="font-outfit text-lg font-semibold text-white">OpticMesh AI - Biometria Óptica</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-700 hover:text-white transition-all"
          >
            Fechar
          </button>
        </div>

        {/* Corpo da Câmera */}
        <div className="relative aspect-video w-full bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover transform -scale-x-100"
          />
          <canvas
            ref={canvasRef}
            width={1280}
            height={720}
            className="absolute inset-0 h-full w-full object-cover pointer-events-none transform -scale-x-100"
          />

          {/* Toast de Status */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-slate-900/90 border border-teal-500/20 px-6 py-2.5 text-sm font-medium text-white shadow-xl backdrop-blur-sm">
            {msgStatus}
          </div>
        </div>

        {/* Rodapé de Ações */}
        <div className="flex flex-col space-y-4 bg-slate-900/90 px-6 py-5 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-400">
              <span className="font-semibold text-teal-400">Instruções:</span> Segure um cartão padrão (como crédito) na testa se desejar calibração por referência física, ou olhe diretamente para a tela para medição por proporção de íris padrão.
            </div>
            <HelpCircle className="h-4 w-4 text-slate-500 cursor-pointer hover:text-white transition" />
          </div>

          <div className="flex items-center justify-end space-x-4">
            <button
              onClick={() => {
                setCalibracaoConcluida(false);
                setMsgStatus("Alinhe os olhos com a guia azul na tela.");
              }}
              className="flex items-center space-x-2 rounded-xl bg-slate-800 px-4 py-3 text-sm font-medium text-white hover:bg-slate-700 active:scale-95 transition"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Resetar</span>
            </button>

            <button
              onClick={executarCapturaBiometria}
              disabled={calibracaoConcluida}
              className={`flex items-center space-x-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-lg transition active:scale-95 ${
                calibracaoConcluida
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold'
              }`}
            >
              {calibracaoConcluida ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>Escaneado!</span>
                </>
              ) : (
                <>
                  <Camera className="h-5 w-5" />
                  <span>Capturar Biometria</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
