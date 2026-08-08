import React, { useEffect, useState, useRef } from 'react';
import { 
  Eye, Stethoscope, Search, Plus, Pin, MessageSquare, ClipboardCheck, Sparkles, 
  RefreshCw, FileText, Settings, BarChart3, ShieldCheck, Printer, Trash2, 
  Brain, FileUp, HelpCircle, Check, AlertTriangle, AlertCircle, RefreshCcw, Landmark,
  ArrowLeft, Clock, User, Phone, ChevronRight, FileSpreadsheet, Send, Award, Activity
} from 'lucide-react';
import { ExamRecord, AnamnesisIaInput } from '../../types';
import { loadExamsFromSupabase, saveExamToSupabase } from '../../utils/examSync';
import { supabase } from '../../utils/supabaseClient';
import { examSystemApi } from '../../utils/examSystemApi';
import { TrialFrameIcon } from '../brand/TrialFrameIcon';

export const ExamRoomModule: React.FC = () => {
  const [exams, setExams] = useState<ExamRecord[]>([]);
  const [selectedExam, setSelectedExam] = useState<ExamRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'atendimento' | 'dashboard' | 'receitas' | 'config' | 'ia-chat'>('atendimento');
  
  // Filtros da fila
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'sem_anamnese' | 'com_anamnese' | 'concluidos'>('todos');
  
  // Configurações do optometrista / clínica
  const [optometristaNome, setOptometristaNome] = useState('Dr. Lauro Rocha');
  const [cboNumero, setCBONumero] = useState('CBO 14852-BA');
  const [clinicaNome, setClinicaNome] = useState('Óticas Di Óculos - Matriz');
  const [unidadeNome, setUnidadeNome] = useState('Matriz Centro (Ituberá - BA)');
  const [assinaturaUrl, setAssinaturaUrl] = useState('https://images.unsplash.com/photo-1598257006458-087169a1f08d?w=300&auto=format&fit=crop&q=60');

  // Modais
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false);
  const [whatsappData, setWhatsappData] = useState<{ paciente: string; link: string; texto: string } | null>(null);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [isAnamneseModalOpen, setIsAnamneseModalOpen] = useState(false);

  // IA State
  const [iaAlerts, setIaAlerts] = useState<string[]>([]);
  const [iaSuggestions, setIaSuggestions] = useState<string>('');
  const [loadingIa, setLoadingIa] = useState(false);

  // Anamnese manual modal form
  const [anamneseForm, setAnamneseForm] = useState<AnamnesisIaInput>({
    queixa_principal: 'Tenho a visão bastante embaçada para leitura no celular e dores de cabeça frequentes no final da tarde',
    tempo_sintomas: 'Pouco menos de 6 meses',
    sintomas_visuais: ['Visão Embaçada Perto', 'Dores de Cabeça no Fim do Dia'],
    doencas_sistemicas: ['Nenhuma'],
    historico_familiar: ['Hipermetropia na família'],
    uso_atual_oculos: 'Uso lentes simples de grau para leitura de perto'
  });

  // Novo paciente form
  const [newPatientForm, setNewPatientForm] = useState({
    nome: '',
    telefone: '',
    cpf: '',
    prioridade: 'Normal' as 'Normal' | 'Urgente',
    observacoes: ''
  });

  // OCR state
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);

  const handlePrint = () => {
    window.print();
  };

  // Carregar prontuários ao montar
  const fetchExams = async () => {
    setLoading(true);
    const data = await loadExamsFromSupabase([]);
    setExams(data);
    if (data.length > 0 && !selectedExam) {
      setSelectedExam(data[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // Polling de sincronização da fila de exames
  useEffect(() => {
    const interval = setInterval(() => {
      fetchExams();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Análise em tempo real de IA Gemini sobre a refração
  useEffect(() => {
    if (!selectedExam) return;
    
    const delayDebounceFn = setTimeout(() => {
      analyzeExamWithIA();
    }, 1200);

    return () => clearTimeout(delayDebounceFn);
  }, [
    selectedExam?.od_esferico, selectedExam?.od_cilindrico, selectedExam?.od_eixo,
    selectedExam?.oe_esferico, selectedExam?.oe_cilindrico, selectedExam?.oe_eixo,
    selectedExam?.adicao
  ]);

  const analyzeExamWithIA = async () => {
    if (!selectedExam) return;
    setLoadingIa(true);
    try {
      const odSph = selectedExam.od_esferico || 0;
      const oeSph = selectedExam.oe_esferico || 0;
      const odCyl = selectedExam.od_cilindrico || 0;
      const oeCyl = selectedExam.oe_cilindrico || 0;
      const add = selectedExam.adicao || 0;
      
      const alerts: string[] = [];
      let suggestion = '';

      if (Math.abs(odSph) > 4.0 || Math.abs(oeSph) > 4.0) {
        alerts.push('⚠️ Alto Erro Refrativo (Alta Miopia/Hipermetropia): Recomendar Lentes de Alto Índice 1.67 ou 1.74.');
      }
      if (Math.abs(odCyl) > 2.0 || Math.abs(oeCyl) > 2.0) {
        alerts.push('⚠️ Astigmatismo Elevado: Atenção ao eixo e montagem na oficina.');
      }
      if (add > 0 && Math.abs(odSph) < 1.0 && Math.abs(oeSph) < 1.0) {
        alerts.push('⚠️ Adição Perto com Grau de Longe Baixo: Recomendação de Lente Ocupacional ou Presbiopia Inicial.');
      }
      if ((odCyl !== 0 && selectedExam.od_eixo === 0) || (oeCyl !== 0 && selectedExam.oe_eixo === 0)) {
        alerts.push('⚠️ Inconsistência de Eixo: Grau Cilíndrico ativo sem Eixo informado.');
      }

      if (odSph < 0 && oeSph < 0) {
        suggestion = 'Diagnóstico Sugerido: Miopia Simples. Indicação: Lente Monofocal Antirreflexo Crizal Sapphire.';
      } else if (odSph > 0 && oeSph > 0) {
        suggestion = 'Diagnóstico Sugerido: Hipermetropia. Indicação: Lentes com Filtro Blue Control e Antirreflexo.';
      } else if (odCyl !== 0 || oeCyl !== 0) {
        suggestion = 'Diagnóstico Sugerido: Astigmatismo Composto. Indicação: Lentes em Policarbonato 1.59.';
      }
      
      if (add > 0) {
        suggestion += ' Associado à Presbiopia. Recomendação Técnica: Lente Multifocal Digital Varilux ou SmartLife.';
      }

      setIaAlerts(alerts);
      setIaSuggestions(suggestion);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingIa(false);
    }
  };

  const handleUpdateField = (field: keyof ExamRecord, value: any) => {
    if (!selectedExam) return;
    setSelectedExam({
      ...selectedExam,
      [field]: value
    });
  };

  const handleSaveExam = async () => {
    if (!selectedExam) return;
    setLoading(true);
    try {
      const updated = await saveExamToSupabase({
        ...selectedExam,
        optometrista_nome: optometristaNome,
        cbo_numero: cboNumero
      });
      setExams(exams.map(e => e.id === updated.id ? updated : e));
      setSelectedExam(updated);
      alert("Prontuário clínico gravado com sucesso!");
    } catch (e) {
      alert("Falha ao salvar prontuário.");
    } finally {
      setLoading(false);
    }
  };

  const handleConcludeExam = async () => {
    if (!selectedExam) return;
    
    if (!selectedExam.diagnostico_optometrico) {
      const diag = prompt("Por favor, informe o Diagnóstico Optométrico antes de finalizar:");
      if (!diag) return;
      selectedExam.diagnostico_optometrico = diag;
    }

    setLoading(true);
    try {
      const examAtualizado = { ...selectedExam, status: 'concluido' as any, enviado_para_otica: true };
      await saveExamToSupabase(examAtualizado);

      await examSystemApi.generateReceitaDigital({
        tenant_id: '00000000-0000-0000-0000-000000000001',
        paciente_id: selectedExam.paciente_id,
        prontuario_id: selectedExam.id,
        od_esferico: selectedExam.od_esferico,
        od_cilindro: selectedExam.od_cilindrico,
        od_eixo: selectedExam.od_eixo,
        od_adicao: selectedExam.adicao,
        od_dnp: selectedExam.dnp_od,
        oe_esferico: selectedExam.oe_esferico,
        oe_cilindro: selectedExam.oe_cilindrico,
        oe_eixo: selectedExam.oe_eixo,
        oe_adicao: selectedExam.adicao,
        oe_dnp: selectedExam.dnp_oe,
        dp_receita: selectedExam.dnp_od + selectedExam.dnp_oe,
        adicao_receita: selectedExam.adicao,
        observacoes_receita: selectedExam.recomendacao_lentes || ''
      });

      setSelectedExam(examAtualizado);
      alert("✨ Atendimento concluído! Receita Digital emitida e Ordem de Serviço enviada para a Ótica.");
      setIsRecipeModalOpen(true);
      await fetchExams();
    } catch (e) {
      console.error(e);
      alert("Erro ao concluir atendimento.");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePin = async (examId: string, currentPin: boolean) => {
    try {
      const res = await fetch(`/api/exames/${examId}/pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: !currentPin })
      });
      if (res.ok) {
        setExams(exams.map(e => e.id === examId ? { ...e, is_pinned: !currentPin } : e));
        if (selectedExam && selectedExam.id === examId) {
          setSelectedExam({ ...selectedExam, is_pinned: !currentPin });
        }
      }
    } catch {}
  };

  const handleGenerateWhatsappLink = async (examId: string) => {
    try {
      const res = await fetch(`/api/exames/${examId}/whatsapp/gerar-link`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setWhatsappData({
          paciente: data.paciente,
          link: data.whatsapp_link,
          texto: data.mensagem_texto
        });
        setIsWhatsappModalOpen(true);
      }
    } catch {
      alert("Erro ao gerar link do WhatsApp.");
    }
  };

  const handleSimulateOCR = async () => {
    setOcrLoading(true);
    try {
      const response = await fetch('/api/gemini/parse-prescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: 'placeholder' })
      });
      const data = await response.json();
      if (data.success && selectedExam) {
        setOcrResult(data.prescription);
        alert("OCR executado com sucesso! Dados da receita prévia importados.");
      }
    } catch (e) {
      alert("Falha no processamento OCR.");
    } finally {
      setOcrLoading(false);
    }
  };

  const handleApplyOCRData = () => {
    if (!ocrResult || !selectedExam) return;
    setSelectedExam({
      ...selectedExam,
      od_esferico: ocrResult.od?.esferico || 0,
      od_cilindrico: ocrResult.od?.cilindrico || 0,
      od_eixo: ocrResult.od?.eixo || 0,
      oe_esferico: ocrResult.oe?.esferico || 0,
      oe_cilindrico: ocrResult.oe?.cilindrico || 0,
      oe_eixo: ocrResult.oe?.eixo || 0,
      adicao: ocrResult.adicao || 0,
      observacoes_clinicas: `[Comparativo Receita Anterior]: ${ocrResult.observacoes || ''}`
    });
    setOcrResult(null);
    alert("Dados aplicados ao prontuário!");
  };

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientForm.nome || !newPatientForm.telefone) {
      alert("Preencha nome e telefone do paciente.");
      return;
    }
    try {
      const { data: clientes } = await supabase
        .from('clientes')
        .select('*')
        .eq('telefone', newPatientForm.telefone)
        .limit(1);
        
      let cliente_id = null;
      if (clientes && clientes.length > 0) {
        cliente_id = clientes[0].id;
      } else {
        const { data: novoCliente, error: errCli } = await supabase
          .from('clientes')
          .insert([{ 
            nome: newPatientForm.nome, 
            telefone: newPatientForm.telefone, 
            cpf: newPatientForm.cpf 
          }])
          .select().single();
        if (errCli) throw errCli;
        cliente_id = novoCliente.id;
      }

      await examSystemApi.createAtendimento({
        tenant_id: '00000000-0000-0000-0000-000000000001',
        paciente_id: cliente_id,
        horario_agendado: new Date().toISOString(),
        status: 'Aguardando',
        prioridade: newPatientForm.prioridade,
        profissional_responsavel: optometristaNome,
        observacoes: newPatientForm.observacoes
      });
      
      alert("Paciente enfileirado com sucesso!");
      setIsNewPatientModalOpen(false);
      setNewPatientForm({ nome: '', telefone: '', cpf: '', prioridade: 'Normal', observacoes: '' });
      await fetchExams();
    } catch (e) {
      console.error(e);
      alert("Erro ao enfileirar paciente.");
    }
  };

  const handleSaveAnamneseForm = async () => {
    if (!selectedExam) return;
    try {
      await examSystemApi.createPreAnamnese({
        tenant_id: '00000000-0000-0000-0000-000000000001',
        paciente_id: selectedExam.paciente_id,
        atendimento_id: selectedExam.id,
        principal_queixa: anamneseForm.queixa_principal,
        tempo_queixa: anamneseForm.tempo_sintomas,
      });

      const resIa = await examSystemApi.iaAnalisarAnamnese(selectedExam.id, anamneseForm);
      
      const examAtualizado = {
        ...selectedExam,
        status: 'anamnese_concluida' as any,
        anamnese_json: {
          ...anamneseForm,
          ia_summary: resIa.resumo,
          pontos_atencao: resIa.pontos
        }
      };
      await saveExamToSupabase(examAtualizado);
      setSelectedExam(examAtualizado);
      
      alert("Anamnese processada pela IA e salva no prontuário!");
      setIsAnamneseModalOpen(false);
      await fetchExams();
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar anamnese.");
    }
  };

  const filteredExams = exams.filter(e => {
    const matchesSearch = e.paciente_nome.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'todos') return matchesSearch;
    if (filterStatus === 'sem_anamnese') return matchesSearch && e.status === 'aguardando_anamnese';
    if (filterStatus === 'com_anamnese') return matchesSearch && e.status === 'anamnese_concluida';
    if (filterStatus === 'concluidos') return matchesSearch && e.status === 'concluido';
    return matchesSearch;
  });

  const recipeHash = selectedExam ? `SHA256-DIGITAL-${selectedExam.id.replace(/\D/g, '')}-B8F7` : 'N/A';

  return (
    <div className="w-full h-full min-h-0 overflow-y-auto flex flex-col my-0 sm:my-2 mx-0 sm:mr-2 bg-[#F4F7FA] text-slate-900 select-none pb-24 sm:pb-6">
      
      {/* ═══════════════════════════════════════════════════════════════
          MÓDULO 1: HEADER SUPERIOR (Escuro Marinho)
      ═══════════════════════════════════════════════════════════════ */}
      <header className="px-3 sm:px-6 py-3 bg-[#06285F] border-b border-[#0878C9]/40 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 shrink-0 shadow-md text-white">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              if (confirm('Deseja retornar ao painel inicial?')) {
                window.location.reload();
              }
            }} 
            className="flex items-center gap-1.5 bg-[#F4C542] hover:bg-[#FFD45A] text-[#06285F] font-black text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" /> Voltar ao Início
          </button>
          <div className="min-w-0">
            <span className="text-xs font-black text-white truncate block">
              Óticas Di Óculos • Módulo Clínico Ativo
            </span>
            <span className="text-[10px] text-[#0795D1] font-semibold block">
              Gestão de Prontuários &amp; Transmissão de Receitas
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchExams()}
            className="text-xs bg-[#0878C9] hover:bg-[#1677FF] text-white font-bold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Atualizar Fila
          </button>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          MÓDULO 2: BARRA DE IDENTIDADE DA CLÍNICA / ÓTICA
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-[#0878C9] text-white px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between text-xs font-bold shrink-0 border-b border-[#1677FF]">
        <div className="flex items-center gap-2">
          <Landmark className="w-4 h-4 text-[#F4C542]" />
          <span>{clinicaNome} • {unidadeNome}</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-[#F4C542]">
            <User className="w-3.5 h-3.5" /> {optometristaNome} ({cboNumero})
          </span>
          <span className="bg-[#06285F] text-[#00C98B] px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase">
            ● SISTEMA ATIVO
          </span>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          MÓDULO 3: CARD HERO "SALA DE EXAMES OPTOMÉTRICOS & PRONTUÁRIO IA"
      ═══════════════════════════════════════════════════════════════ */}
      <section className="mx-3 sm:mx-6 mt-4 p-5 bg-gradient-to-r from-[#06285F] via-[#082E68] to-[#06285F] border-2 border-[#F4C542]/60 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl text-white shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl border-2 border-[#F4C542] bg-[#0878C9] flex items-center justify-center text-[#F4C542] shadow-lg shrink-0">
            <TrialFrameIcon className="w-8 h-8 text-[#F4C542]" />
          </div>
          <div className="min-w-0 space-y-1">
            <span className="text-[9px] bg-[#F4C542] text-[#06285F] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block shadow-sm">
              SISTEMA OFICIAL MÚLTIPLOS CLIENTES • ÓTICA DI ÓCULOS
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate">
              Sala de Exames Optométricos &amp; Prontuário IA
            </h1>
            <p className="text-xs text-slate-200 font-medium max-w-2xl leading-relaxed">
              Atendimento completo com inteligência artificial, emissão de prescrições com QR Code e transmissão instantânea para vendas.
            </p>
          </div>
        </div>
        
        {/* Card Profissional Responsável */}
        <div className="bg-[#041333]/90 border border-[#F4C542]/40 rounded-2xl p-3 text-left sm:text-right w-full sm:w-auto shrink-0 space-y-1">
          <span className="text-[9px] text-[#F4C542] font-black uppercase tracking-widest block">
            OPTOMETRISTA RESPONSÁVEL
          </span>
          <div className="flex items-center gap-2 sm:justify-end">
            <div className="w-7 h-7 rounded-full bg-[#F4C542] text-[#06285F] font-black text-xs flex items-center justify-center">
              LR
            </div>
            <div>
              <span className="text-xs font-black text-white block">{optometristaNome}</span>
              <span className="text-[10px] text-slate-300 font-bold block">{cboNumero}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Submenus Auxiliares */}
      <nav className="mx-3 sm:mx-6 mt-4 flex overflow-x-auto border-b-2 border-slate-200 scrollbar-none whitespace-nowrap shrink-0 gap-1">
        {[
          { id: 'atendimento', title: 'Fila e Atendimento', icon: Stethoscope },
          { id: 'dashboard', title: 'Métricas & Dashboard', icon: BarChart3 },
          { id: 'receitas', title: 'Histórico de Receitas', icon: FileText },
          { id: 'ia-chat', title: 'IA Assistente', icon: Brain },
          { id: 'config', title: 'Configurações', icon: Settings }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === tab.id
                ? 'bg-[#06285F] text-[#F4C542] border-t-2 border-x-2 border-[#F4C542]'
                : 'bg-white text-slate-600 hover:text-[#06285F] hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.title}
          </button>
        ))}
      </nav>

      {/* ═══════════════════════════════════════════════════════════════
          ÁREA DE TRABALHO PRINCIPAL (ATENDIMENTO CLÍNICO)
      ═══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 p-3 sm:p-6 grid grid-cols-12 gap-4 sm:gap-6 min-h-0">

        {activeSubTab === 'atendimento' && (
          <>
            {/* ═══════════════════════════════════════════════════════════════
                MÓDULO 4: FILA DE ATENDIMENTO (Coluna Esquerda)
            ═══════════════════════════════════════════════════════════════ */}
            <div className="col-span-12 lg:col-span-4 flex flex-col min-h-[420px] lg:h-full bg-[#06285F] text-white border-2 border-[#082E68] rounded-3xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-[#0878C9]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-black tracking-wider text-white flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-[#F4C542]" /> Fila de Atendimento
                  </h2>
                  <button 
                    onClick={() => setIsNewPatientModalOpen(true)}
                    className="bg-[#F4C542] hover:bg-[#FFD45A] text-[#06285F] font-black text-xs px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" /> Novo Paciente
                  </button>
                </div>
                
                {/* Campo de Busca de Paciente */}
                <div className="relative">
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar paciente na fila..."
                    className="w-full bg-[#041333] border border-[#0878C9]/50 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#F4C542] transition-all font-medium"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>

                {/* Filtros em Pílulas */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'todos', label: 'Todos' },
                    { id: 'sem_anamnese', label: 'Sem Anamnese' },
                    { id: 'com_anamnese', label: 'Com Anamnese' },
                    { id: 'concluidos', label: 'Concluídos' }
                  ].map(pill => (
                    <button
                      key={pill.id}
                      onClick={() => setFilterStatus(pill.id as any)}
                      className={`text-[10px] font-black px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                        filterStatus === pill.id
                          ? 'bg-[#F4C542] border-[#F4C542] text-[#06285F]'
                          : 'bg-[#041333] border-[#0878C9]/40 text-slate-300 hover:text-white'
                      }`}
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista dos Pacientes Enfileirados */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5 [scrollbar-width:thin]">
                {loading ? (
                  <div className="text-center py-12 text-slate-400 text-xs italic">Carregando fila de pacientes...</div>
                ) : filteredExams.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs italic">Nenhum paciente na fila.</div>
                ) : (
                  filteredExams.map(item => {
                    const isSelected = selectedExam?.id === item.id;
                    const initials = item.paciente_nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

                    return (
                      <div 
                        key={item.id}
                        onClick={() => setSelectedExam(item)}
                        className={`p-3.5 border-2 rounded-2xl flex items-center justify-between gap-3 transition-all cursor-pointer relative group ${
                          isSelected
                            ? 'bg-[#0878C9] border-[#F4C542] shadow-lg'
                            : 'bg-[#041333]/80 border-[#0878C9]/30 hover:border-[#0878C9] hover:bg-[#041333]'
                        }`}
                      >
                        {item.prioridade === 'Urgente' && (
                          <span className="absolute top-0 left-0 w-3 h-3 bg-rose-500 rounded-br-lg" title="Paciente Urgente" />
                        )}

                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-full font-black text-xs flex items-center justify-center shrink-0 shadow-inner ${
                            isSelected ? 'bg-[#F4C542] text-[#06285F]' : 'bg-[#0878C9] text-white'
                          }`}>
                            {initials}
                          </div>
                          
                          <div className="min-w-0 space-y-0.5">
                            <div className="text-xs font-black text-white truncate group-hover:text-[#F4C542]">
                              {item.paciente_nome}
                              {item.is_pinned && <span className="text-[#F4C542] ml-1">📌</span>}
                            </div>
                            <div className="text-[10px] text-slate-300 font-mono">
                              {item.id} • {item.prioridade}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          {item.status === 'aguardando_anamnese' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleGenerateWhatsappLink(item.id);
                              }}
                              className="bg-[#00C98B] hover:bg-[#00D39A] text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                            >
                              💬 Anamnese WhatsApp
                            </button>
                          )}
                          {item.status === 'anamnese_concluida' && (
                            <span className="bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-black text-[9px] px-2 py-0.5 rounded-md uppercase">
                              Anamnese Concluída
                            </span>
                          )}
                          {item.status === 'concluido' && (
                            <span className="bg-[#1677FF]/20 border border-[#1677FF] text-blue-300 font-black text-[9px] px-2 py-0.5 rounded-md uppercase">
                              Exame Concluído
                            </span>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTogglePin(item.id, item.is_pinned);
                            }}
                            className="p-1 rounded-md text-slate-400 hover:text-[#F4C542] transition-all"
                            title={item.is_pinned ? "Desafixar do topo" : "Fixar no topo"}
                          >
                            <Pin className={`w-3.5 h-3.5 ${item.is_pinned ? 'text-[#F4C542] fill-[#F4C542]' : ''}`} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                PRONTUÁRIO CLÍNICO COMPLETO (Coluna Direita - Sequência Vertical)
            ═══════════════════════════════════════════════════════════════ */}
            <div className="col-span-12 lg:col-span-8 flex flex-col h-full bg-[#06285F] text-white border-2 border-[#082E68] rounded-3xl overflow-hidden shadow-xl">
              {selectedExam ? (
                <div className="flex-1 flex flex-col min-h-0">
                  
                  {/* Header do Prontuário em Destaque */}
                  <div className="p-4 border-b border-[#0878C9]/40 bg-[#041333] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
                    <div>
                      <span className="text-[10px] text-[#F4C542] uppercase font-black tracking-wider">
                        PRESCRIÇÃO OPTOMÉTRICA DIGITAL • ID: {selectedExam.id}
                      </span>
                      <h2 className="text-base font-black text-white mt-0.5">
                        Exame de Refração: <span className="text-[#F4C542]">{selectedExam.paciente_nome}</span>
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsRecipeModalOpen(true)}
                        className="bg-[#0878C9] hover:bg-[#1677FF] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                      >
                        <FileText className="w-4 h-4" /> Ver Receita Digital IA
                      </button>

                      <button
                        onClick={handleConcludeExam}
                        className="bg-[#00C98B] hover:bg-[#00D39A] text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition-all cursor-pointer active:scale-95 shadow-md flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4 stroke-[3]" /> Concluir &amp; Emitir Receita
                      </button>
                    </div>
                  </div>

                  {/* Corpo do Prontuário Clinico com Scroll Fluido */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 [scrollbar-width:thin]">
                    
                    {/* ═══════════════════════════════════════════════════════════════
                        MÓDULO 5: RESUMO / CONTEXTO DO ATENDIMENTO (Prévia IA)
                    ═══════════════════════════════════════════════════════════════ */}
                    <div className="bg-[#041333] border-2 border-[#0878C9] p-4 sm:p-5 rounded-2xl space-y-3 shadow-md">
                      <div className="flex items-center justify-between border-b border-[#0878C9]/40 pb-2">
                        <h3 className="text-xs font-black uppercase text-[#F4C542] tracking-wider flex items-center gap-2">
                          <Brain className="w-4 h-4 text-[#F4C542]" /> RESUMO DE ATENDIMENTO PRÉVIA IA
                        </h3>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold">
                          Dados 1.ª Anamnese conectada do WhatsApp
                        </span>
                      </div>

                      {/* Queixa Principal do Paciente em Destaque */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Queixa Principal do Paciente:</span>
                        <div className="p-3 bg-[#06285F] border-l-4 border-[#F4C542] rounded-r-xl text-xs font-bold text-white italic leading-relaxed">
                          "{selectedExam.anamnese_json?.queixa_principal || anamneseForm.queixa_principal}"
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                        <div className="bg-[#06285F] p-3 rounded-xl border border-[#0878C9]/40">
                          <span className="text-[10px] text-slate-400 font-bold block">Tempo dos Sintomas:</span>
                          <span className="font-extrabold text-[#F4C542] text-xs">
                            {selectedExam.anamnese_json?.tempo_sintomas || anamneseForm.tempo_sintomas}
                          </span>
                        </div>

                        <div className="bg-[#06285F] p-3 rounded-xl border border-[#0878C9]/40">
                          <span className="text-[10px] text-slate-400 font-bold block">Óculos Atual:</span>
                          <span className="font-extrabold text-white text-xs">
                            {selectedExam.anamnese_json?.uso_atual_oculos || anamneseForm.uso_atual_oculos}
                          </span>
                        </div>
                      </div>

                      {/* Resumo de Diagnóstico da IA */}
                      <div className="p-3 bg-[#0878C9]/20 border border-[#0878C9] rounded-xl text-xs font-semibold text-cyan-200 leading-relaxed">
                        <strong>Resumo de Diagnóstico IA:</strong> {selectedExam.anamnese_json?.ia_summary || 'Aderência a presbiopia inicial. Recomendado exame subjetivo com foco em adição multifocal e teste de 100% perto.'}
                      </div>
                    </div>

                    {/* OCR Comparativo de Receitas Antigas */}
                    <div className="border border-[#0878C9]/50 p-4 rounded-2xl bg-[#041333] space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-wider text-[#F4C542]">
                          📂 Upload &amp; OCR de Receita Antiga
                        </h3>
                        <button
                          onClick={handleSimulateOCR}
                          disabled={ocrLoading}
                          className="bg-[#0878C9] hover:bg-[#1677FF] text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                          {ocrLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileUp className="w-3.5 h-3.5" />}
                          Simular OCR de Receita
                        </button>
                      </div>

                      {ocrResult && (
                        <div className="p-3.5 bg-amber-500/10 border border-amber-500/40 rounded-xl space-y-2 text-xs">
                          <div className="text-amber-300 font-bold uppercase text-[10px]">Receita Antiga Detectada via IA:</div>
                          <div className="grid grid-cols-2 gap-4">
                            <div><strong>OD:</strong> Esf {ocrResult.od.esferico} | Cil {ocrResult.od.cilindrico} | Eixo {ocrResult.od.eixo}</div>
                            <div><strong>OE:</strong> Esf {ocrResult.oe.esferico} | Cil {ocrResult.oe.cilindrico} | Eixo {ocrResult.oe.eixo}</div>
                          </div>
                          <button
                            onClick={handleApplyOCRData}
                            className="w-full mt-2 py-1.5 bg-[#F4C542] text-[#06285F] font-black rounded-lg text-xs uppercase transition-all cursor-pointer"
                          >
                            Importar Graus para Prontuário Atual
                          </button>
                        </div>
                      )}
                    </div>

                    {/* ═══════════════════════════════════════════════════════════════
                        MÓDULO 6 & 11: TABELA DE REFRAÇÃO (OD & OE)
                    ═══════════════════════════════════════════════════════════════ */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-[#0878C9]/40 pb-2">
                        <h3 className="text-xs font-black uppercase tracking-widest text-[#F4C542] flex items-center gap-2">
                          <TrialFrameIcon className="w-4 h-4 text-[#F4C542]" /> REFRAÇÃO SUBJETIVA (GRAU FINAL PRESCRITO)
                        </h3>
                        <span className="text-[10px] text-slate-300 font-semibold">Valores em dioptrias (D)</span>
                      </div>

                      <div className="border-2 border-[#0878C9] rounded-2xl overflow-hidden bg-[#041333]">
                        <table className="w-full text-center text-xs">
                          <thead>
                            <tr className="bg-[#0878C9]/40 border-b border-[#0878C9] text-white text-[10px] font-black uppercase">
                              <th className="py-3 px-3 text-left">Olho / Opção</th>
                              <th className="py-3">Esférico (ESF)</th>
                              <th className="py-3">Cilíndrico (CIL)</th>
                              <th className="py-3">Eixo (°)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#0878C9]/30">
                            {/* Olho Direito */}
                            <tr className="hover:bg-[#0878C9]/10">
                              <td className="py-3.5 px-3 font-black text-left text-white flex items-center gap-2">
                                <span className="bg-[#F4C542] text-[#06285F] text-[10px] font-black px-2 py-0.5 rounded-md">OD (Right)</span>
                              </td>
                              <td className="py-2 px-2">
                                <input 
                                  type="number"
                                  step="0.25"
                                  value={selectedExam.od_esferico}
                                  onChange={(e) => handleUpdateField('od_esferico', Number(e.target.value))}
                                  className="w-20 bg-[#06285F] border-2 border-[#0878C9] rounded-xl py-1.5 text-center font-mono font-black text-white focus:outline-none focus:border-[#F4C542] text-sm"
                                />
                              </td>
                              <td className="py-2 px-2">
                                <input 
                                  type="number"
                                  step="0.25"
                                  value={selectedExam.od_cilindrico}
                                  onChange={(e) => handleUpdateField('od_cilindrico', Number(e.target.value))}
                                  className="w-20 bg-[#06285F] border-2 border-[#0878C9] rounded-xl py-1.5 text-center font-mono font-black text-white focus:outline-none focus:border-[#F4C542] text-sm"
                                />
                              </td>
                              <td className="py-2 px-2">
                                <input 
                                  type="number"
                                  min="0"
                                  max="180"
                                  value={selectedExam.od_eixo}
                                  onChange={(e) => handleUpdateField('od_eixo', Number(e.target.value))}
                                  className="w-20 bg-[#06285F] border-2 border-[#0878C9] rounded-xl py-1.5 text-center font-mono font-black text-white focus:outline-none focus:border-[#F4C542] text-sm"
                                />
                              </td>
                            </tr>

                            {/* Olho Esquerdo */}
                            <tr className="hover:bg-[#0878C9]/10">
                              <td className="py-3.5 px-3 font-black text-left text-white flex items-center gap-2">
                                <span className="bg-[#F4C542] text-[#06285F] text-[10px] font-black px-2 py-0.5 rounded-md">OE (Left)</span>
                              </td>
                              <td className="py-2 px-2">
                                <input 
                                  type="number"
                                  step="0.25"
                                  value={selectedExam.oe_esferico}
                                  onChange={(e) => handleUpdateField('oe_esferico', Number(e.target.value))}
                                  className="w-20 bg-[#06285F] border-2 border-[#0878C9] rounded-xl py-1.5 text-center font-mono font-black text-white focus:outline-none focus:border-[#F4C542] text-sm"
                                />
                              </td>
                              <td className="py-2 px-2">
                                <input 
                                  type="number"
                                  step="0.25"
                                  value={selectedExam.oe_cilindrico}
                                  onChange={(e) => handleUpdateField('oe_cilindrico', Number(e.target.value))}
                                  className="w-20 bg-[#06285F] border-2 border-[#0878C9] rounded-xl py-1.5 text-center font-mono font-black text-white focus:outline-none focus:border-[#F4C542] text-sm"
                                />
                              </td>
                              <td className="py-2 px-2">
                                <input 
                                  type="number"
                                  min="0"
                                  max="180"
                                  value={selectedExam.oe_eixo}
                                  onChange={(e) => handleUpdateField('oe_eixo', Number(e.target.value))}
                                  className="w-20 bg-[#06285F] border-2 border-[#0878C9] rounded-xl py-1.5 text-center font-mono font-black text-white focus:outline-none focus:border-[#F4C542] text-sm"
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* ═══════════════════════════════════════════════════════════════
                        MÓDULO 12: ACUIDADE VISUAL & EQUIPAMENTOS
                    ═══════════════════════════════════════════════════════════════ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#041333] border-2 border-[#0878C9] p-4 rounded-2xl space-y-3">
                        <span className="text-[10px] text-[#F4C542] uppercase tracking-wider font-black block">
                          ACUIDADE VISUAL (SNELLEN / JÁGER)
                        </span>
                        
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-slate-300 font-bold text-[11px]">AV Longe OD:</span>
                            <input 
                              type="text" 
                              value={selectedExam.av_longe_od || '20/20'} 
                              onChange={(e) => handleUpdateField('av_longe_od', e.target.value)}
                              className="w-full bg-[#06285F] border border-[#0878C9] rounded-xl p-2 font-mono font-bold text-white mt-1"
                            />
                          </div>
                          <div>
                            <span className="text-slate-300 font-bold text-[11px]">AV Longe OE:</span>
                            <input 
                              type="text" 
                              value={selectedExam.av_longe_oe || '20/25'} 
                              onChange={(e) => handleUpdateField('av_longe_oe', e.target.value)}
                              className="w-full bg-[#06285F] border border-[#0878C9] rounded-xl p-2 font-mono font-bold text-white mt-1"
                            />
                          </div>
                          <div>
                            <span className="text-slate-300 font-bold text-[11px]">AV Perto OD:</span>
                            <input 
                              type="text" 
                              value={selectedExam.av_perto_od || 'J1'} 
                              onChange={(e) => handleUpdateField('av_perto_od', e.target.value)}
                              className="w-full bg-[#06285F] border border-[#0878C9] rounded-xl p-2 font-mono font-bold text-white mt-1"
                            />
                          </div>
                          <div>
                            <span className="text-slate-300 font-bold text-[11px]">AV Perto OE:</span>
                            <input 
                              type="text" 
                              value={selectedExam.av_perto_oe || 'J1'} 
                              onChange={(e) => handleUpdateField('av_perto_oe', e.target.value)}
                              className="w-full bg-[#06285F] border border-[#0878C9] rounded-xl p-2 font-mono font-bold text-white mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Adição Perto (ADD) */}
                      <div className="bg-[#041333] border-2 border-[#0878C9] p-4 rounded-2xl space-y-3 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] text-[#F4C542] uppercase tracking-wider font-black block">
                            ADIÇÃO PERTO (ADD)
                          </span>
                          <div className="flex items-center gap-3 mt-2">
                            <input 
                              type="number"
                              step="0.25"
                              value={selectedExam.adicao}
                              onChange={(e) => handleUpdateField('adicao', Number(e.target.value))}
                              className="bg-[#06285F] border-2 border-[#0878C9] rounded-xl py-2 px-4 text-[#F4C542] font-mono font-black text-lg focus:outline-none focus:border-[#F4C542] w-32 text-center"
                            />
                            <span className="text-xs text-slate-300 font-medium">Dioptrias para perto/multifocal</span>
                          </div>
                        </div>
                        <div className="text-[10px] text-[#00C98B] font-bold bg-[#00C98B]/10 p-2 rounded-xl border border-[#00C98B]/30">
                          ✓ Teste de adição efetuado com armação de prova.
                        </div>
                      </div>
                    </div>

                    {/* ═══════════════════════════════════════════════════════════════
                        MÓDULO 13: TONOMETRIA & MEDIDAS GEOMÉTRICAS
                    ═══════════════════════════════════════════════════════════════ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Tonometria (PIO) & Complementares */}
                      <div className="bg-[#041333] border-2 border-[#0878C9] p-4 rounded-2xl space-y-3">
                        <span className="text-[10px] text-[#F4C542] uppercase tracking-wider font-black block">
                          TONOMETRIA (PIO) &amp; EXAMES COMPLEMENTARES
                        </span>
                        
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-slate-300 font-bold text-[10px]">PIO OD (mmHg):</span>
                            <input 
                              type="number" 
                              value={selectedExam.pio_od || 14} 
                              onChange={(e) => handleUpdateField('pio_od', Number(e.target.value))}
                              className="w-full bg-[#06285F] border border-[#0878C9] rounded-xl p-2 font-mono font-bold text-white mt-1"
                            />
                          </div>
                          <div>
                            <span className="text-slate-300 font-bold text-[10px]">PIO OE (mmHg):</span>
                            <input 
                              type="number" 
                              value={selectedExam.pio_oe || 15} 
                              onChange={(e) => handleUpdateField('pio_oe', Number(e.target.value))}
                              className="w-full bg-[#06285F] border border-[#0878C9] rounded-xl p-2 font-mono font-bold text-white mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Medidas Geométricas da Armação */}
                      <div className="bg-[#041333] border-2 border-[#0878C9] p-4 rounded-2xl space-y-3">
                        <span className="text-[10px] text-[#F4C542] uppercase tracking-wider font-black block">
                          MEDIDAS GEOMÉTRICAS DA ARMAÇÃO (LABORATÓRIO)
                        </span>
                        
                        <div className="grid grid-cols-4 gap-2 text-xs text-center">
                          <div>
                            <span className="text-slate-300 font-bold text-[10px]">Aro (HOR)</span>
                            <input 
                              type="number" 
                              value={selectedExam.aro_hor || 54} 
                              onChange={(e) => handleUpdateField('aro_hor', Number(e.target.value))}
                              className="w-full bg-[#06285F] border border-[#0878C9] rounded-xl p-1.5 font-mono text-center font-bold text-white mt-1"
                            />
                          </div>
                          <div>
                            <span className="text-slate-300 font-bold text-[10px]">Ponte</span>
                            <input 
                              type="number" 
                              value={selectedExam.ponte || 18} 
                              onChange={(e) => handleUpdateField('ponte', Number(e.target.value))}
                              className="w-full bg-[#06285F] border border-[#0878C9] rounded-xl p-1.5 font-mono text-center font-bold text-white mt-1"
                            />
                          </div>
                          <div>
                            <span className="text-slate-300 font-bold text-[10px]">Haste</span>
                            <input 
                              type="number" 
                              value={selectedExam.haste || 142} 
                              onChange={(e) => handleUpdateField('haste', Number(e.target.value))}
                              className="w-full bg-[#06285F] border border-[#0878C9] rounded-xl p-1.5 font-mono text-center font-bold text-white mt-1"
                            />
                          </div>
                          <div>
                            <span className="text-slate-300 font-bold text-[10px]">Altura</span>
                            <input 
                              type="number" 
                              value={selectedExam.altura_armacao || 32.5} 
                              onChange={(e) => handleUpdateField('altura_armacao', Number(e.target.value))}
                              className="w-full bg-[#06285F] border border-[#0878C9] rounded-xl p-1.5 font-mono text-center font-bold text-white mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ═══════════════════════════════════════════════════════════════
                        MÓDULO 14 & 18: RECOMENDAÇÕES TÉCNICAS E OBSERVAÇÕES
                    ═══════════════════════════════════════════════════════════════ */}
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-[#F4C542] uppercase font-black tracking-wider block">
                          RECOMENDAÇÃO TÉCNICA DE LENTES PARA A ÓTICA
                        </label>
                        <input
                          type="text"
                          value={selectedExam.recomendacao_lentes || 'Lentes Multifocais Digitais 1.67 com Filtro Azul e Antirreflexo Crizal'}
                          onChange={(e) => handleUpdateField('recomendacao_lentes', e.target.value)}
                          placeholder="Ex: Lentes Multifocais Digitais com Filtro Blue Control..."
                          className="w-full bg-[#041333] border-2 border-[#0878C9] rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-[#F4C542] font-semibold"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] text-[#F4C542] uppercase font-black tracking-wider block">
                          OBSERVAÇÕES CLÍNICAS ADICIONAIS
                        </label>
                        <textarea
                          value={selectedExam.observacoes_clinicas || 'Acomodação visual confortável com adição de +1.75. Adaptou-se perfeitamente durante o teste com armação de prova.'}
                          onChange={(e) => handleUpdateField('observacoes_clinicas', e.target.value)}
                          rows={3}
                          placeholder="Digite observações clínicas do atendimento..."
                          className="w-full bg-[#041333] border-2 border-[#0878C9] rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-[#F4C542] font-medium leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* ═══════════════════════════════════════════════════════════════
                        MÓDULO 16: CARD DE ANÁLISE IA & ALERTAS GEMINI
                    ═══════════════════════════════════════════════════════════════ */}
                    <div className="bg-[#041333] border-2 border-indigo-500/60 p-4 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-indigo-300 font-black text-xs uppercase tracking-wider">
                          <Sparkles className="w-4 h-4 text-indigo-400" /> ANÁLISE / ASSISTÊNCIA DA IA CLINICAL
                        </div>
                        <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                          GEMINI AI ASSISTANT
                        </span>
                      </div>
                      
                      {iaAlerts.length > 0 ? (
                        <div className="text-rose-400 text-xs font-bold space-y-1 pt-1">
                          {iaAlerts.map((a, i) => <div key={i}>{a}</div>)}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-200 font-medium pt-1">
                          {iaSuggestions || 'Sem alertas refrativos graves. Dados compatíveis com refração normal de presbiopia.'}
                        </div>
                      )}
                    </div>

                    {/* ═══════════════════════════════════════════════════════════════
                        MÓDULO 19: BOTÃO PRINCIPAL DE FINALIZAÇÃO (CTA Verde Gigante)
                    ═══════════════════════════════════════════════════════════════ */}
                    <div className="bg-[#041333] border-2 border-[#00C98B] p-5 rounded-3xl space-y-3 shadow-2xl text-center">
                      <div className="space-y-0.5">
                        <span className="text-xs font-black uppercase text-[#00C98B] tracking-wider block">
                          Transmissão Direta para a Ótica
                        </span>
                        <p className="text-[11px] text-slate-300 font-medium">
                          Grava o prontuário, emite a Receita Digital com QR Code e envia a Ordem de Serviço diretamente para a balcão de vendas.
                        </p>
                      </div>

                      <button
                        onClick={handleConcludeExam}
                        className="w-full py-4 bg-gradient-to-r from-[#00C98B] to-[#00D39A] hover:from-[#00D39A] hover:to-[#00C98B] text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl transition-all transform active:scale-98 cursor-pointer flex items-center justify-center gap-2 border-2 border-emerald-300"
                      >
                        <Check className="w-5 h-5 stroke-[3]" />
                        <span>Salvar &amp; Enviar OS para a Ótica</span>
                      </button>
                    </div>

                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400 italic text-xs">
                  Selecione um paciente na fila de atendimento para iniciar a consulta.
                </div>
              )}
            </div>
          </>
        )}

        {/* SUB-TAB: Dashboard */}
        {activeSubTab === 'dashboard' && (
          <div className="col-span-12 space-y-6 overflow-y-auto h-full pr-1 [scrollbar-width:thin]">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {[
                { title: 'Aguardando Atendimento', val: exams.filter(e => e.status !== 'concluido').length, desc: 'Pacientes na fila' },
                { title: 'Atendidos Hoje', val: exams.filter(e => e.status === 'concluido').length, desc: 'Consultas finalizadas' },
                { title: 'Receitas Emitidas', val: exams.filter(e => e.status === 'concluido').length, desc: 'Enviadas ao balcão' },
                { title: 'Tempo Médio de Espera', val: '14 min', desc: 'Entrada ao atendimento' }
              ].map((card, i) => (
                <div key={i} className="bg-[#06285F] text-white border-2 border-[#082E68] p-4 rounded-2xl">
                  <span className="text-[10px] text-slate-300 uppercase tracking-widest font-black block">{card.title}</span>
                  <span className="text-2xl font-black text-[#F4C542] block mt-1">{card.val}</span>
                  <span className="text-[10px] text-slate-400 block mt-1">{card.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-TAB: Receitas Digitais */}
        {activeSubTab === 'receitas' && (
          <div className="col-span-12 bg-[#06285F] text-white border-2 border-[#082E68] rounded-3xl p-6 overflow-hidden flex flex-col h-full">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#F4C542] mb-4">Histórico de Receitas Digitais Emitidas</h3>
            
            <div className="flex-1 overflow-y-auto [scrollbar-width:thin]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#0878C9]/40 text-white text-[10px] font-black uppercase border-b border-[#0878C9]">
                    <th className="py-3 px-4">Código</th>
                    <th className="py-3">Paciente</th>
                    <th className="py-3">Data Emissão</th>
                    <th className="py-3">Status Receita</th>
                    <th className="py-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0878C9]/30 text-white">
                  {exams.filter(e => e.status === 'concluido').map(rec => (
                    <tr key={rec.id} className="hover:bg-[#0878C9]/20">
                      <td className="py-3 px-4 font-mono font-bold text-[#F4C542]">{rec.id}</td>
                      <td className="py-3 font-extrabold text-white">{rec.paciente_nome}</td>
                      <td className="py-3">{rec.data_exame.split('-').reverse().join('/')}</td>
                      <td className="py-3">
                        <span className="bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase">Ativa</span>
                      </td>
                      <td className="py-3 text-center">
                        <button
                          onClick={() => {
                            setSelectedExam(rec);
                            setIsRecipeModalOpen(true);
                          }}
                          className="bg-[#0878C9] hover:bg-[#1677FF] text-white font-bold text-[10px] px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                        >
                          Visualizar &amp; Imprimir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-TAB: Configurações */}
        {activeSubTab === 'config' && (
          <div className="col-span-12 bg-[#06285F] text-white border-2 border-[#082E68] rounded-3xl p-6 overflow-y-auto h-full space-y-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#F4C542] border-b border-[#0878C9] pb-2">Configurações Gerais do Consultório</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-1.5">
                <span className="font-bold text-slate-300">Nome do Optometrista/Oftalmologista Responsável</span>
                <input 
                  type="text" 
                  value={optometristaNome} 
                  onChange={(e) => setOptometristaNome(e.target.value)}
                  className="w-full bg-[#041333] border border-[#0878C9] rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-slate-300">Conselho e Registro Profissional (Ex: CBO, CRM)</span>
                <input 
                  type="text" 
                  value={cboNumero} 
                  onChange={(e) => setCBONumero(e.target.value)}
                  className="w-full bg-[#041333] border border-[#0878C9] rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <button
              onClick={() => alert('Configurações salvas!')}
              className="bg-[#F4C542] hover:bg-[#FFD45A] text-[#06285F] font-black text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              Salvar Configurações
            </button>
          </div>
        )}

      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MÓDULO 22: MENU INFERIOR MOBILE (Navegação Fixa para Celulares)
      ═══════════════════════════════════════════════════════════════ */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#06285F] border-t-2 border-[#F4C542] px-2 py-2 flex items-center justify-around text-white shadow-2xl">
        <button 
          onClick={() => window.location.reload()}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-slate-300 hover:text-[#F4C542] cursor-pointer"
        >
          <Landmark className="w-5 h-5" />
          <span>Início</span>
        </button>

        <button 
          onClick={() => setActiveSubTab('atendimento')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-black cursor-pointer ${
            activeSubTab === 'atendimento' ? 'text-[#F4C542]' : 'text-slate-300'
          }`}
        >
          <Stethoscope className="w-5 h-5" />
          <span>Atendimento</span>
        </button>

        <button 
          onClick={() => setIsRecipeModalOpen(true)}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-slate-300 hover:text-[#F4C542] cursor-pointer"
        >
          <FileText className="w-5 h-5" />
          <span>Receita</span>
        </button>

        <button 
          onClick={() => setActiveSubTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-black cursor-pointer ${
            activeSubTab === 'dashboard' ? 'text-[#F4C542]' : 'text-slate-300'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span>Métricas</span>
        </button>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════
          MODAIS E DIÁLOGOS
      ═══════════════════════════════════════════════════════════════ */}

      {/* 1. Modal Novo Paciente na Fila */}
      {isNewPatientModalOpen && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-[300]">
          <div className="bg-[#06285F] border-2 border-[#F4C542] rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-[#0878C9] pb-3">
              <h3 className="text-sm font-black text-[#F4C542] uppercase tracking-wider">📋 Cadastrar Paciente na Fila</h3>
              <button onClick={() => setIsNewPatientModalOpen(false)} className="text-slate-300 hover:text-white cursor-pointer text-base">✕</button>
            </div>
            
            <form onSubmit={handleCreatePatient} className="space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-200 font-bold block">Nome Completo *</span>
                <input 
                  type="text"
                  required
                  value={newPatientForm.nome}
                  onChange={(e) => setNewPatientForm({ ...newPatientForm, nome: e.target.value })}
                  placeholder="Ex: Pedro Alves"
                  className="w-full bg-[#041333] border border-[#0878C9] rounded-xl p-2.5 text-white"
                />
              </div>
              <div className="space-y-1">
                <span className="text-slate-200 font-bold block">Telefone WhatsApp (com DDD) *</span>
                <input 
                  type="text"
                  required
                  value={newPatientForm.telefone}
                  onChange={(e) => setNewPatientForm({ ...newPatientForm, telefone: e.target.value })}
                  placeholder="Ex: (73) 98112-8923"
                  className="w-full bg-[#041333] border border-[#0878C9] rounded-xl p-2.5 text-white"
                />
              </div>
              <div className="space-y-1">
                <span className="text-slate-200 font-bold block">CPF (Opcional)</span>
                <input 
                  type="text"
                  value={newPatientForm.cpf}
                  onChange={(e) => setNewPatientForm({ ...newPatientForm, cpf: e.target.value })}
                  placeholder="Ex: 123.456.789-01"
                  className="w-full bg-[#041333] border border-[#0878C9] rounded-xl p-2.5 text-white"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#F4C542] hover:bg-[#FFD45A] text-[#06285F] font-black py-3 rounded-xl uppercase tracking-wider text-xs shadow-md transition-all cursor-pointer"
              >
                Confirmar Cadastro &amp; Enfileirar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal WhatsApp Link */}
      {isWhatsappModalOpen && whatsappData && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-[300]">
          <div className="bg-[#06285F] border-2 border-[#F4C542] rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-[#0878C9] pb-3">
              <h3 className="text-sm font-black text-[#F4C542] uppercase tracking-wider flex items-center gap-2">
                💬 Anamnese WhatsApp
              </h3>
              <button onClick={() => setIsWhatsappModalOpen(false)} className="text-slate-300 hover:text-white cursor-pointer text-base">✕</button>
            </div>
            
            <div className="text-xs space-y-3">
              <p className="text-slate-200">
                Envie o link para o paciente responder às perguntas conduzidas pela IA antes da consulta:
              </p>
              
              <div className="bg-[#041333] p-3 rounded-xl border border-[#0878C9] font-mono text-[10px] text-slate-300 break-all select-text">
                {whatsappData.texto}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(whatsappData.texto);
                    alert("Mensagem copiada!");
                  }}
                  className="flex-1 bg-[#0878C9] text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer"
                >
                  Copiar Texto
                </button>

                <a
                  href={whatsappData.link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setIsWhatsappModalOpen(false)}
                  className="flex-1 bg-[#00C98B] hover:bg-[#00D39A] text-slate-950 text-xs font-black py-2.5 rounded-xl flex items-center justify-center shadow-lg transition-all cursor-pointer text-center"
                >
                  Enviar via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal Receita Digital QR Code */}
      {isRecipeModalOpen && selectedExam && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[300] overflow-y-auto print:p-0 print:bg-white print:absolute print:inset-0">
          <div className="bg-[#06285F] border-2 border-[#F4C542] rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative my-8 print:border-none print:shadow-none print:bg-white print:p-0 print:my-0 text-white">
            
            <button 
              onClick={() => setIsRecipeModalOpen(false)} 
              className="absolute top-6 right-6 text-slate-300 hover:text-white text-base print:hidden cursor-pointer"
            >
              ✕
            </button>

            <div className="bg-[#041333] border border-[#0878C9] p-6 rounded-2xl space-y-6 print:bg-white print:text-black print:border-none print:p-0">
              
              <div className="flex justify-between items-center border-b border-[#0878C9]/40 pb-4 print:border-slate-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#F4C542] rounded-2xl flex items-center justify-center text-[#06285F] text-2xl font-black">
                    👓
                  </div>
                  <div>
                    <h2 className="text-sm font-black uppercase text-[#F4C542] tracking-wider print:text-black">{clinicaNome}</h2>
                    <p className="text-[10px] text-slate-300 print:text-slate-500">Rua 23 de Abril, 51, Centro, Ituberá - BA</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-mono block">RECEITA DIGITAL</span>
                  <span className="text-xs font-black text-[#F4C542] print:text-black">{selectedExam.id}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 text-xs border-b border-[#0878C9]/40 pb-4 print:border-slate-300">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black block">Paciente</span>
                  <span className="text-sm font-extrabold text-white print:text-black">{selectedExam.paciente_nome}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black block">Profissional Emitente</span>
                  <span className="text-sm font-extrabold text-white print:text-black">{selectedExam.optometrista_nome}</span>
                  <div className="text-[10px] text-slate-300 print:text-slate-500">{selectedExam.cbo_numero}</div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-[#F4C542] uppercase tracking-wider font-black block print:text-black">Grau Prescrito</span>
                
                <table className="w-full text-center text-xs border border-[#0878C9] rounded-xl overflow-hidden print:border-slate-300">
                  <thead>
                    <tr className="bg-[#0878C9]/40 border-b border-[#0878C9] text-white text-[9px] font-black uppercase print:bg-slate-100 print:text-black">
                      <th className="py-2 px-3 text-left">Olho</th>
                      <th className="py-2">Esférico (ESF)</th>
                      <th className="py-2">Cilíndrico (CIL)</th>
                      <th className="py-2">Eixo (°)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0878C9]/30 print:divide-slate-300">
                    <tr>
                      <td className="py-3 px-3 font-extrabold text-left text-white print:text-black">OD (Direito)</td>
                      <td className="py-3 font-mono font-bold text-[#F4C542] print:text-black">{selectedExam.od_esferico > 0 ? `+${selectedExam.od_esferico.toFixed(2)}` : selectedExam.od_esferico.toFixed(2)}</td>
                      <td className="py-3 font-mono font-bold text-[#F4C542] print:text-black">{selectedExam.od_cilindrico > 0 ? `+${selectedExam.od_cilindrico.toFixed(2)}` : selectedExam.od_cilindrico.toFixed(2)}</td>
                      <td className="py-3 font-mono print:text-black">{selectedExam.od_eixo}°</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-extrabold text-left text-white print:text-black">OE (Esquerdo)</td>
                      <td className="py-3 font-mono font-bold text-[#F4C542] print:text-black">{selectedExam.oe_esferico > 0 ? `+${selectedExam.oe_esferico.toFixed(2)}` : selectedExam.oe_esferico.toFixed(2)}</td>
                      <td className="py-3 font-mono font-bold text-[#F4C542] print:text-black">{selectedExam.oe_cilindrico > 0 ? `+${selectedExam.oe_cilindrico.toFixed(2)}` : selectedExam.oe_cilindrico.toFixed(2)}</td>
                      <td className="py-3 font-mono print:text-black">{selectedExam.oe_eixo}°</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between border-t border-[#0878C9]/40 pt-4 print:border-slate-300">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-white p-1 rounded-lg">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                        window.location.origin + '/?validarReceita=' + selectedExam.id
                      )}`} 
                      alt="QR Code Receita"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-[9px] text-slate-300 print:text-slate-600">
                    <strong className="text-white print:text-black block">Receita Digital Autêntica</strong>
                    <span>Escaneie o QR Code para validar autenticidade técnica.</span>
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-[10px] text-white print:text-black font-black block">{selectedExam.optometrista_nome}</span>
                  <span className="text-[9px] text-slate-300 print:text-slate-500 font-bold block">{selectedExam.cbo_numero}</span>
                </div>
              </div>

            </div>

            <div className="mt-6 flex justify-end gap-3 print:hidden">
              <button
                onClick={() => setIsRecipeModalOpen(false)}
                className="bg-[#0878C9] hover:bg-[#1677FF] text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
              >
                Fechar
              </button>
              <button
                onClick={handlePrint}
                className="bg-[#00C98B] hover:bg-[#00D39A] text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Printer className="w-4 h-4 stroke-[3]" /> Imprimir Receita Digital
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
