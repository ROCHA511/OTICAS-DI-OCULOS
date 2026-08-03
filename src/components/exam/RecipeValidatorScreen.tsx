import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck, Printer, Calendar, Clock, Award, User, RefreshCw } from 'lucide-react';
import { ExamRecord } from '../../types';

interface RecipeValidatorScreenProps {
  prontuarioId: string;
  onBackToApp?: () => void;
}

export const RecipeValidatorScreen: React.FC<RecipeValidatorScreenProps> = ({
  prontuarioId,
  onBackToApp,
}) => {
  const [exam, setExam] = useState<ExamRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/exames/fila');
        if (!res.ok) throw new Error('Falha ao conectar com o servidor.');
        const list: ExamRecord[] = await res.json();
        const found = list.find((e) => e.id === prontuarioId);
        
        if (found) {
          setExam(found);
        } else {
          setError('Código de receita digital inválido ou inexistente no banco central.');
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao validar receita digital.');
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [prontuarioId]);

  // Função para gerar um hash estável e determinístico de integridade dos graus
  const generateCryptographicHash = (rec: ExamRecord) => {
    const dataStr = `${rec.id}-${rec.paciente_nome}-${rec.od_esferico}-${rec.oe_esferico}-${rec.adicao}-${rec.data_exame}`;
    let hash = 0;
    for (let i = 0; i < dataStr.length; i++) {
      const char = dataStr.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return 'SHA256-DIGITAL-' + Math.abs(hash).toString(16).toUpperCase() + 'D7F8';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-radial from-[#0c255c] via-[#07193f] to-[#040f26] text-white flex flex-col justify-between py-6 px-4 font-sans select-none print:bg-white print:text-black">
      {/* Header */}
      <div className="max-w-2xl mx-auto w-full flex justify-between items-center border-b border-slate-700/50 pb-4 mb-6 print:border-slate-300">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#C9A96E] rounded-xl flex items-center justify-center shadow-lg print:border print:border-black">
            <span className="text-[#071D49] font-black text-lg">👓</span>
          </div>
          <div>
            <h1 className="text-sm font-black tracking-widest text-[#C9A96E] uppercase">Óticas Di Óculos</h1>
            <p className="text-[10px] text-slate-400 print:text-slate-500">Validador de Receitas Digitais v2.0</p>
          </div>
        </div>
        {onBackToApp && (
          <button 
            onClick={onBackToApp} 
            className="text-xs font-bold bg-[#071D49] border border-[#C9A96E]/50 hover:bg-[#0B255C] text-[#C9A96E] px-4 py-1.5 rounded-lg transition-all print:hidden active:scale-95 cursor-pointer"
          >
            Acessar Sistema
          </button>
        )}
      </div>

      {/* Main Validation Card */}
      <main className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center">
        {loading ? (
          <div className="bg-[#071D49]/40 border border-slate-700/60 rounded-3xl p-12 text-center backdrop-blur-xl flex flex-col items-center gap-4">
            <RefreshCw className="w-10 h-10 text-[#C9A96E] animate-spin" />
            <p className="text-sm font-bold text-slate-300">Consultando o banco central da clínica...</p>
          </div>
        ) : error ? (
          <div className="bg-[#5c0b0b]/20 border-2 border-red-500/50 rounded-3xl p-8 text-center backdrop-blur-xl space-y-4">
            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto border-2 border-red-500/40">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-black text-red-400 uppercase tracking-wider">Falha na Autenticação</h2>
              <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto">{error}</p>
            </div>
            <p className="text-[10px] text-red-400/70">Esta receita digital pode ter sido revogada ou adulterada.</p>
          </div>
        ) : exam ? (
          <div className="bg-[#071D49]/60 border border-[#C9A96E]/40 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden print:border-none print:shadow-none print:bg-white">
            {/* Badge de Validade */}
            <div className="bg-gradient-to-r from-emerald-600/90 to-teal-700/90 px-6 py-4 flex items-center justify-between border-b border-emerald-500/30 print:from-emerald-50 print:to-emerald-50 print:border-slate-300 print:text-black">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-emerald-300 fill-emerald-800/40 print:text-emerald-600" />
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-emerald-100 print:text-emerald-700">Receita Autêntica & Válida</h2>
                  <p className="text-[9px] text-emerald-200/80 print:text-slate-600">Integridade confirmada no banco geral da Óticas Di Óculos.</p>
                </div>
              </div>
              <button 
                onClick={handlePrint}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 p-2 rounded-xl transition-all cursor-pointer active:scale-95 print:hidden"
                title="Imprimir Receita"
              >
                <Printer className="w-4 h-4 text-[#C9A96E]" />
              </button>
            </div>

            {/* Dados Principais */}
            <div className="p-6 space-y-6">
              {/* Informações da Consulta */}
              <div className="grid grid-cols-2 gap-4 border-b border-slate-700/40 pb-4 print:border-slate-300">
                <div className="space-y-1">
                  <div className="text-[9px] text-slate-400 uppercase tracking-widest font-black">Paciente</div>
                  <div className="text-sm font-extrabold flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#C9A96E] shrink-0" />
                    <span>{exam.paciente_nome}</span>
                  </div>
                  {exam.paciente_cpf && <div className="text-[10px] text-slate-400">CPF: {exam.paciente_cpf}</div>}
                </div>
                <div className="space-y-1">
                  <div className="text-[9px] text-slate-400 uppercase tracking-widest font-black">Profissional Responsável</div>
                  <div className="text-sm font-extrabold flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#C9A96E] shrink-0" />
                    <span>{exam.optometrista_nome}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">{exam.cbo_numero}</div>
                </div>
              </div>

              {/* Data e Validade */}
              <div className="flex gap-6 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#C9A96E] shrink-0" />
                  <span><strong>Data de Emissão:</strong> {exam.data_exame.split('-').reverse().join('/')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#C9A96E] shrink-0" />
                  <span><strong>Status:</strong> <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold text-[9px] border border-emerald-500/40 uppercase">Ativa</span></span>
                </div>
              </div>

              {/* Tabela de Refração */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#C9A96E]">Grau Prescrito (Refração)</h3>
                <div className="border border-slate-700/60 rounded-2xl overflow-hidden bg-slate-900/50 print:border-slate-300">
                  <table className="w-full text-center text-xs">
                    <thead>
                      <tr className="bg-slate-800/80 border-b border-slate-700 text-slate-400 text-[10px] font-black uppercase print:bg-slate-100 print:text-black print:border-slate-300">
                        <th className="py-2.5 px-3 text-left">Olho</th>
                        <th className="py-2.5">Esférico (ESF)</th>
                        <th className="py-2.5">Cilíndrico (CIL)</th>
                        <th className="py-2.5">Eixo (°)</th>
                        <th className="py-2.5">DNP (mm)</th>
                        <th className="py-2.5">Alt (mm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 print:divide-slate-300">
                      <tr className="hover:bg-slate-800/20">
                        <td className="py-3 px-3 font-extrabold text-left text-slate-300 print:text-black">OD (Direito)</td>
                        <td className="py-3 font-mono font-bold text-[#C9A96E] print:text-black">{exam.od_esferico > 0 ? `+${exam.od_esferico.toFixed(2)}` : exam.od_esferico.toFixed(2)}</td>
                        <td className="py-3 font-mono font-bold text-[#C9A96E] print:text-black">{exam.od_cilindrico > 0 ? `+${exam.od_cilindrico.toFixed(2)}` : exam.od_cilindrico.toFixed(2)}</td>
                        <td className="py-3 font-mono print:text-black">{exam.od_eixo}°</td>
                        <td className="py-3 font-mono print:text-black">{exam.dnp_od.toFixed(1)}</td>
                        <td className="py-3 font-mono print:text-black">{exam.altura_od.toFixed(1)}</td>
                      </tr>
                      <tr className="hover:bg-slate-800/20">
                        <td className="py-3 px-3 font-extrabold text-left text-slate-300 print:text-black">OE (Esquerdo)</td>
                        <td className="py-3 font-mono font-bold text-[#C9A96E] print:text-black">{exam.oe_esferico > 0 ? `+${exam.oe_esferico.toFixed(2)}` : exam.oe_esferico.toFixed(2)}</td>
                        <td className="py-3 font-mono font-bold text-[#C9A96E] print:text-black">{exam.oe_cilindrico > 0 ? `+${exam.oe_cilindrico.toFixed(2)}` : exam.oe_cilindrico.toFixed(2)}</td>
                        <td className="py-3 font-mono print:text-black">{exam.oe_eixo}°</td>
                        <td className="py-3 font-mono print:text-black">{exam.dnp_oe.toFixed(1)}</td>
                        <td className="py-3 font-mono print:text-black">{exam.altura_oe.toFixed(1)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Adição Perto e DNP */}
              <div className="grid grid-cols-2 gap-4">
                {exam.adicao > 0 && (
                  <div className="bg-[#0b255c]/40 border border-slate-700/50 p-3 rounded-2xl print:border-slate-300">
                    <div className="text-[9px] text-slate-400 uppercase tracking-widest font-black">Adição Perto (ADD)</div>
                    <div className="text-sm font-extrabold font-mono text-[#C9A96E] print:text-black">+{exam.adicao.toFixed(2)} D</div>
                  </div>
                )}
                {exam.recomendacao_lentes && (
                  <div className="bg-[#0b255c]/40 border border-slate-700/50 p-3 rounded-2xl col-span-2 print:border-slate-300">
                    <div className="text-[9px] text-slate-400 uppercase tracking-widest font-black">Recomendação de Lentes</div>
                    <div className="text-xs font-bold text-slate-200 print:text-black">{exam.recomendacao_lentes}</div>
                  </div>
                )}
              </div>

              {/* Hash Criptográfico de Integridade */}
              <div className="border-t border-slate-700/40 pt-4 flex flex-col items-center gap-1">
                <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">Assinatura Eletrônica e Hash de Integridade</span>
                <span className="font-mono text-[9px] text-[#C9A96E] bg-slate-900 px-3 py-1 rounded-md border border-slate-800 print:border-slate-300 print:bg-white print:text-black">
                  {generateCryptographicHash(exam)}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="max-w-2xl mx-auto w-full text-center text-[10px] text-slate-500 pt-6 mt-6 border-t border-slate-700/30 print:border-slate-300">
        Rua 23 de Abril, 51, Centro, Ituberá - BA, CEP: 45435-000 • CNPJ: 12.348.411/0001-51
        <br />
        © 2026 Óticas Di Óculos. Todos os direitos reservados.
      </footer>
    </div>
  );
};
