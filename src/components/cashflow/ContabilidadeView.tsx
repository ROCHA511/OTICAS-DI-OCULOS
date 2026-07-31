import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  User, 
  Send, 
  Download, 
  RefreshCw, 
  Calendar, 
  Mail, 
  Phone, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Clock,
  Play
} from 'lucide-react';

interface Relatorio {
  id: string;
  mes_referencia: string;
  data_geracao: string;
  quantidade_vendas: number;
  valor_bruto: number;
  valor_liquido: number;
  valor_pix: number;
  valor_cartao: number;
  valor_dinheiro: number;
  status: string;
  destinatarios: {
    ceo: { nome: string; whatsapp: string; email: string };
    contabilidade: { nome: string; empresa: string; whatsapp: string; email: string };
  };
  pdf_path_ceo: string;
  pdf_path_contabilidade: string;
  protocolo: string;
}

export const ContabilidadeView: React.FC = () => {
  // Configurações
  const [nomeContabilidade, setNomeContabilidade] = useState('');
  const [nomeContador, setNomeContador] = useState('');
  const [whatsappContabilidade, setWhatsappContabilidade] = useState('');
  const [emailContabilidade, setEmailContabilidade] = useState('');
  const [nomeCeo, setNomeCeo] = useState('');
  const [whatsappCeo, setWhatsappCeo] = useState('');
  const [emailCeo, setEmailCeo] = useState('');
  const [diaFechamento, setDiaFechamento] = useState(1);
  const [horarioEnvio, setHorarioEnvio] = useState('08:00:00');
  const [envioAutomatico, setEnvioAutomatico] = useState(true);

  // Histórico e UI
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [salvandoConfig, setSalvandoConfig] = useState(false);
  const [disparandoRelatorio, setDisparandoRelatorio] = useState(false);
  const [mesDisparo, setMesDisparo] = useState(new Date().getMonth() + 1);
  const [anoDisparo, setAnoDisparo] = useState(new Date().getFullYear());

  const backendUrl = 'http://127.0.0.1:8000';

  // Carregar dados na inicialização
  useEffect(() => {
    carregarConfig();
    carregarHistorico();
  }, []);

  const carregarConfig = async () => {
    try {
      setLoadingConfig(true);
      const res = await fetch(`${backendUrl}/contabilidade/config`, {
        headers: { 'X-Tenant-Id': '00000000-0000-0000-0000-000000000000' } // Fallback local
      });
      if (res.ok) {
        const data = await res.json();
        setNomeContabilidade(data.nome_contabilidade || '');
        setNomeContador(data.nome_contador || '');
        setWhatsappContabilidade(data.whatsapp_contabilidade || '');
        setEmailContabilidade(data.email_contabilidade || '');
        setNomeCeo(data.nome_ceo || '');
        setWhatsappCeo(data.whatsapp_ceo || '');
        setEmailCeo(data.email_ceo || '');
        setDiaFechamento(data.dia_fechamento || 1);
        setHorarioEnvio(data.horario_envio || '08:00:00');
        setEnvioAutomatico(data.envio_automatico !== false);
      }
    } catch (err) {
      console.error('Erro ao carregar configurações de contabilidade:', err);
    } finally {
      setLoadingConfig(false);
    }
  };

  const carregarHistorico = async () => {
    try {
      setLoadingHistory(true);
      const res = await fetch(`${backendUrl}/contabilidade/relatorios`, {
        headers: { 'X-Tenant-Id': '00000000-0000-0000-0000-000000000000' }
      });
      if (res.ok) {
        const data = await res.json();
        setRelatorios(data);
      }
    } catch (err) {
      console.error('Erro ao carregar histórico contábil:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const salvarConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSalvandoConfig(true);
      const res = await fetch(`${backendUrl}/contabilidade/config`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Tenant-Id': '00000000-0000-0000-0000-000000000000'
        },
        body: JSON.stringify({
          nome_contabilidade: nomeContabilidade,
          nome_contador: nomeContador,
          whatsapp_contabilidade: whatsappContabilidade,
          email_contabilidade: emailContabilidade,
          nome_ceo: nomeCeo,
          whatsapp_ceo: whatsappCeo,
          email_ceo: emailCeo,
          dia_fechamento: Number(diaFechamento),
          horario_envio: horarioEnvio,
          fuso_horario: 'America/Sao_Paulo',
          envio_automatico: envioAutomatico
        })
      });
      if (res.ok) {
        alert('Configurações contábeis salvas com sucesso!');
        carregarConfig();
      } else {
        alert('Falha ao salvar configurações.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao salvar.');
    } finally {
      setSalvandoConfig(false);
    }
  };

  const dispararFechamentoManual = async () => {
    if (!confirm(`Confirma a apuração e fechamento manual do mês de ${mesDisparo}/${anoDisparo}? Os relatórios em PDF correspondentes serão enviados via WhatsApp.`)) {
      return;
    }
    try {
      setDisparandoRelatorio(true);
      const res = await fetch(`${backendUrl}/contabilidade/relatorios/disparar`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Tenant-Id': '00000000-0000-0000-0000-000000000000'
        },
        body: JSON.stringify({
          ano: Number(anoDisparo),
          mes: Number(mesDisparo)
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.mensagem || 'Fechamento gerado e enviado com sucesso!');
        carregarHistorico();
      } else {
        alert(data.detail || 'Falha ao processar fechamento.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao processar fechamento.');
    } finally {
      setDisparandoRelatorio(false);
    }
  };

  const reenviarRelatorio = async (id: string) => {
    if (!confirm('Deseja reenviar este relatório contábil para o WhatsApp do CEO e do Contador?')) {
      return;
    }
    try {
      const res = await fetch(`${backendUrl}/contabilidade/relatorios/${id}/reenviar`, {
        method: 'POST',
        headers: { 'X-Tenant-Id': '00000000-0000-0000-0000-000000000000' }
      });
      const data = await res.json();
      if (res.ok) {
        alert('Reenvio agendado com sucesso!');
      } else {
        alert(data.detail || 'Falha ao reenviar.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-1">
      {/* Formulário de Configuração */}
      <div className="lg:col-span-2 bg-white rounded-3xl border border-[#C5A880]/20 shadow-xs p-6 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2 bg-[#0B1E36] rounded-xl text-amber-300">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-[#0B1E36] uppercase tracking-tight font-serif">Configurações Contábeis & Fiscais</h2>
            <p className="text-xs text-slate-500 font-medium">Defina os contatos da contabilidade e do fechamento automático mensal</p>
          </div>
        </div>

        {loadingConfig ? (
          <div className="py-8 text-center text-xs text-slate-400 italic">Carregando configurações...</div>
        ) : (
          <form onSubmit={salvarConfig} className="space-y-4 text-xs font-semibold text-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contabilidade */}
              <div className="space-y-3 p-4 bg-[#FAF8F5] rounded-2xl border border-[#C5A880]/15">
                <h3 className="text-xs font-black uppercase text-[#0B1E36] tracking-wider mb-2 flex items-center gap-1.5 border-b border-[#C5A880]/20 pb-1.5">
                  <Building2 className="w-3.5 h-3.5" /> Dados do Contador
                </h3>
                
                <div>
                  <label className="block text-[10px] uppercase text-slate-500 mb-1">Nome da Contabilidade</label>
                  <input 
                    type="text" 
                    value={nomeContabilidade} 
                    onChange={e => setNomeContabilidade(e.target.value)}
                    required
                    placeholder="Ex: Contabilidade Rocha Associados" 
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-slate-500 mb-1">Nome do Contador Responsável</label>
                  <input 
                    type="text" 
                    value={nomeContador} 
                    onChange={e => setNomeContador(e.target.value)}
                    required
                    placeholder="Ex: João da Silva" 
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-slate-500 mb-1">WhatsApp da Contabilidade</label>
                  <input 
                    type="text" 
                    value={whatsappContabilidade} 
                    onChange={e => setWhatsappContabilidade(e.target.value)}
                    required
                    placeholder="Ex: 11999999999" 
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-slate-500 mb-1">E-mail da Contabilidade</label>
                  <input 
                    type="email" 
                    value={emailContabilidade} 
                    onChange={e => setEmailContabilidade(e.target.value)}
                    required
                    placeholder="Ex: contador@email.com" 
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
                  />
                </div>
              </div>

              {/* CEO */}
              <div className="space-y-3 p-4 bg-[#FAF8F5] rounded-2xl border border-[#C5A880]/15">
                <h3 className="text-xs font-black uppercase text-[#0B1E36] tracking-wider mb-2 flex items-center gap-1.5 border-b border-[#C5A880]/20 pb-1.5">
                  <User className="w-3.5 h-3.5" /> Dados do CEO
                </h3>

                <div>
                  <label className="block text-[10px] uppercase text-slate-500 mb-1">Nome do CEO</label>
                  <input 
                    type="text" 
                    value={nomeCeo} 
                    onChange={e => setNomeCeo(e.target.value)}
                    required
                    placeholder="Ex: Roberto Dono" 
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-slate-500 mb-1">WhatsApp do CEO</label>
                  <input 
                    type="text" 
                    value={whatsappCeo} 
                    onChange={e => setWhatsappCeo(e.target.value)}
                    required
                    placeholder="Ex: 11988888888" 
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-slate-500 mb-1">E-mail do CEO</label>
                  <input 
                    type="email" 
                    value={emailCeo} 
                    onChange={e => setEmailCeo(e.target.value)}
                    required
                    placeholder="Ex: ceo@otica.com" 
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
                  />
                </div>
              </div>
            </div>

            {/* Fechamento Automático */}
            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/50 space-y-3">
              <h3 className="text-xs font-black uppercase text-amber-800 tracking-wider flex items-center gap-1.5 border-b border-amber-200 pb-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-700" /> Rotina de Fechamento do Sistema
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-amber-800 mb-1">Dia do Fechamento</label>
                  <select 
                    value={diaFechamento} 
                    onChange={e => setDiaFechamento(Number(e.target.value))}
                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                  >
                    {[...Array(28)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>Todo dia {i + 1}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-amber-800 mb-1">Horário de Envio</label>
                  <input 
                    type="time" 
                    value={horarioEnvio} 
                    onChange={e => setHorarioEnvio(e.target.value.includes(':') && e.target.value.split(':').length === 2 ? e.target.value + ':00' : e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                  />
                </div>

                <div className="flex items-center md:pt-4">
                  <label className="flex items-center gap-2 cursor-pointer font-extrabold text-amber-900">
                    <input 
                      type="checkbox" 
                      checked={envioAutomatico}
                      onChange={e => setEnvioAutomatico(e.target.checked)}
                      className="w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-[#C5A880]"
                    />
                    ATIVAR FECHAMENTO AUTOMÁTICO
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={salvandoConfig}
                className="px-5 py-2.5 bg-[#0B1E36] hover:bg-[#112d52] border border-[#C5A880]/50 text-amber-300 text-xs font-black uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                {salvandoConfig ? 'Salvando...' : 'Salvar Configurações'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Disparo Manual Rápido */}
      <div className="bg-white rounded-3xl border border-[#C5A880]/20 shadow-xs p-6 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2 bg-amber-500 rounded-xl text-white">
            <Play className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-[#0B1E36] uppercase tracking-tight font-serif">Fechar Mês Manualmente</h2>
            <p className="text-xs text-slate-500 font-medium">Gere e envie o PDF de qualquer mês imediatamente</p>
          </div>
        </div>

        <div className="space-y-4 text-xs font-semibold text-slate-700">
          <div className="space-y-2">
            <label className="block text-[10px] uppercase text-slate-500">Mês de Referência</label>
            <select 
              value={mesDisparo} 
              onChange={e => setMesDisparo(Number(e.target.value))}
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
            >
              <option value="1">Janeiro</option>
              <option value="2">Fevereiro</option>
              <option value="3">Março</option>
              <option value="4">Abril</option>
              <option value="5">Maio</option>
              <option value="6">Junho</option>
              <option value="7">Julho</option>
              <option value="8">Agosto</option>
              <option value="9">Setembro</option>
              <option value="10">Outubro</option>
              <option value="11">Novembro</option>
              <option value="12">Dezembro</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] uppercase text-slate-500">Ano</label>
            <input 
              type="number" 
              value={anoDisparo} 
              onChange={e => setAnoDisparo(Number(e.target.value))}
              className="w-full bg-[#FAF8F5] border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
            />
          </div>

          <button 
            onClick={dispararFechamentoManual}
            disabled={disparandoRelatorio}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {disparandoRelatorio ? 'Processando Fechamento...' : 'Gerar & Enviar Fechamento'}
          </button>
        </div>
      </div>

      {/* Histórico de Relatórios Enviados */}
      <div className="lg:col-span-3 bg-white rounded-3xl border border-[#C5A880]/20 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 rounded-xl text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#0B1E36] uppercase tracking-tight font-serif">Relatórios Enviados (Histórico)</h2>
              <p className="text-xs text-slate-500 font-medium">Acompanhe os fechamentos e faça download ou reenvio dos PDFs contábeis</p>
            </div>
          </div>
          <button 
            onClick={carregarHistorico}
            className="p-2 text-[#0B1E36] hover:bg-slate-50 rounded-xl border border-slate-200 transition-all"
            title="Atualizar Histórico"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {loadingHistory ? (
          <div className="py-12 text-center text-xs text-slate-400 italic">Carregando histórico...</div>
        ) : relatorios.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 italic">Nenhum relatório contábil enviado ainda.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold">
              <thead className="bg-[#0B1E36] text-amber-200 uppercase font-black tracking-wider text-[10px] border-b border-[#C5A880]/30">
                <tr>
                  <th className="py-3 px-4">Mês Ref.</th>
                  <th className="py-3 px-4">Data Geração</th>
                  <th className="py-3 px-4">Vendas</th>
                  <th className="py-3 px-4">Faturamento Bruto</th>
                  <th className="py-3 px-4">Faturamento Líquido</th>
                  <th className="py-3 px-4">Pix / Cartões</th>
                  <th className="py-3 px-4">Dinheiro</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {relatorios.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-all font-medium">
                    <td className="py-3 px-4 font-extrabold text-[#0B1E36]">{r.mes_referencia}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(r.data_geracao).toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3 px-4 font-bold">{r.quantidade_vendas} vendas</td>
                    <td className="py-3 px-4 text-slate-900 font-bold">R$ {Number(r.valor_bruto).toFixed(2)}</td>
                    <td className="py-3 px-4 text-slate-900 font-bold">R$ {Number(r.valor_liquido).toFixed(2)}</td>
                    <td className="py-3 px-4 text-slate-600">
                      R$ {Number(r.valor_pix).toFixed(2)} / R$ {Number(r.valor_cartao).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-500">R$ {Number(r.valor_dinheiro).toFixed(2)}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center justify-center gap-1 w-max mx-auto shadow-4xs">
                        <CheckCircle className="w-3 h-3" /> {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Download CEO */}
                        <a 
                          href={`${backendUrl}${r.pdf_path_ceo}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 rounded-lg transition-all flex items-center gap-1"
                          title="Baixar PDF do CEO (Completo)"
                        >
                          <Download className="w-3.5 h-3.5 text-blue-900" />
                          <span>CEO</span>
                        </a>

                        {/* Download Contador */}
                        <a 
                          href={`${backendUrl}${r.pdf_path_contabilidade}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 rounded-lg transition-all flex items-center gap-1"
                          title="Baixar PDF da Contabilidade (Sem Dinheiro)"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Contador</span>
                        </a>

                        {/* Reenviar */}
                        <button 
                          onClick={() => reenviarRelatorio(r.id)}
                          className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all flex items-center gap-1"
                          title="Reenviar por WhatsApp"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Reenviar</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
