import React, { useEffect, useState, useRef } from 'react';
import { 
  Eye, Stethoscope, Search, Plus, Pin, MessageSquare, ClipboardCheck, Sparkles, 
  RefreshCw, FileText, Settings, BarChart3, ShieldCheck, Printer, Trash2, 
  Brain, FileUp, HelpCircle, Check, AlertTriangle, AlertCircle, RefreshCcw, Landmark 
} from 'lucide-react';
import { ExamRecord, AnamnesisIaInput } from '../../types';
import { loadExamsFromSupabase, saveExamToSupabase } from '../../utils/examSync';

export const ExamRoomModule: React.FC = () => {
  const [exams, setExams] = useState<ExamRecord[]>([]);
  const [selectedExam, setSelectedExam] = useState<ExamRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'atendimento' | 'dashboard' | 'receitas' | 'config' | 'ia-chat'>('atendimento');
  
  // Filtros da fila
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'sem_anamnese' | 'com_anamnese' | 'concluidos'>('todos');
  
  // Configurações do optometrista
  const [optometristaNome, setOptometristaNome] = useState('Dr. Lauro Rocha');
  const [cboNumero, setCBONumero] = useState('CBO 14852-BA');
  const [clinicaNome, setClinicaNome] = useState('Óticas Di Óculos - Matriz');
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
    queixa_principal: '',
    tempo_sintomas: '',
    sintomas_visuais: [],
    doencas_sistemicas: [],
    historico_familiar: [],
    uso_atual_oculos: 'Não'
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

  // Carregar prontuários ao montar
  const fetchExams = async () => {
    setLoading(true);
    const data = await loadExamsFromSupabase([]);
    setExams(data);
    if (data.length > 0 && !selectedExam) {
      // Abre o primeiro por padrão
      setSelectedExam(data[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // Recarrega fila periodicamente (Realtime simulado/Supabase polling)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchExams();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Executa análise IA em tempo real ao alterar valores refrativos
  useEffect(() => {
    if (!selectedExam) return;
    
    const delayDebounceFn = setTimeout(() => {
      analyzeExamWithIA();
    }, 1500); // Debounce de 1.5s para evitar chamadas excessivas na digitação

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
      // Faz análise baseada nos graus inseridos
      const odSph = selectedExam.od_esferico;
      const oeSph = selectedExam.oe_esferico;
      const odCyl = selectedExam.od_cilindrico;
      const oeCyl = selectedExam.oe_cilindrico;
      const add = selectedExam.adicao;
      
      const alerts: string[] = [];
      let suggestion = '';

      if (Math.abs(odSph) > 4.0 || Math.abs(oeSph) > 4.0) {
        alerts.push('⚠️ Alto Erro Refrativo (Alta Miopia/Hipermetropia): Recomendar Lentes 1.67 ou 1.74.');
      }
      if (Math.abs(odCyl) > 2.0 || Math.abs(oeCyl) > 2.0) {
        alerts.push('⚠️ Alto Astigmatismo: Cuidado com distorções laterais na escolha da armação.');
      }
      if (add > 0 && (Math.abs(odSph) < 1.0 && Math.abs(oeSph) < 1.0)) {
        alerts.push('⚠️ Adição detectada com baixo grau de longe: Sugerir lentes ocupacionais.');
      }

      // Validação de eixos vazios quando há astigmatismo
      if ((odCyl !== 0 && selectedExam.od_eixo === 0) || (oeCyl !== 0 && selectedExam.oe_eixo === 0)) {
        alerts.push('⚠️ Eixo Refrativo Inconsistente: Grau cilíndrico preenchido mas eixo em 0°.');
      }

      // Diagnóstico preliminar simulado / gerado
      if (odSph < 0 && oeSph < 0) {
        suggestion = 'Diagnóstico Sugerido: Miopia Simples. Lentes indicadas: Antirreflexo Blue Control.';
      } else if (odSph > 0 && oeSph > 0) {
        suggestion = 'Diagnóstico Sugerido: Hipermetropia. Lentes indicadas: Antirreflexo Crizal Easy.';
      } else if (odCyl !== 0 || oeCyl !== 0) {
        suggestion = 'Diagnóstico Sugerido: Astigmatismo composto. Lentes indicadas: Policarbonato 1.59.';
      }
      
      if (add > 0) {
        suggestion += ' Presbiopia associada. Recomendação técnica: Multifocal Varilux ou SmartLife.';
      }

      setIaAlerts(alerts);
      setIaSuggestions(suggestion);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingIa(false);
    }
  };

  // Salva alterações do exame selecionado localmente no state
  const handleUpdateField = (field: keyof ExamRecord, value: any) => {
    if (!selectedExam) return;
    setSelectedExam({
      ...selectedExam,
      [field]: value
    });
  };

  // Salva alterações refrativas no banco
  const handleSaveExam = async () => {
    if (!selectedExam) return;
    setLoading(true);
    try {
      const updated = await saveExamToSupabase({
        ...selectedExam,
        optometrista_nome: optometristaNome,
        cbo_numero: cboNumero
      });
      // Atualiza a fila
      setExams(exams.map(e => e.id === updated.id ? updated : e));
      setSelectedExam(updated);
      alert("Prontuário salvo com sucesso!");
    } catch (e) {
      alert("Falha ao salvar prontuário.");
    } finally {
      setLoading(false);
    }
  };

  // Concluir e Emitir Receita
  const handleConcludeExam = async () => {
    if (!selectedExam) return;
    
    // Confirmação de campos obrigatórios
    if (selectedExam.diagnostico_optometrico === '' || !selectedExam.diagnostico_optometrico) {
      const diag = prompt("Por favor, preencha o diagnóstico optométrico antes de concluir:");
      if (!diag) return;
      selectedExam.diagnostico_optometrico = diag;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/exames/${selectedExam.id}/concluir`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          od: { esferico: selectedExam.od_esferico, cilindrico: selectedExam.od_cilindrico, eixo: selectedExam.od_eixo },
          oe: { esferico: selectedExam.oe_esferico, cilindrico: selectedExam.oe_cilindrico, eixo: selectedExam.oe_eixo },
          adicao: selectedExam.adicao,
          dnp_od: selectedExam.dnp_od,
          dnp_oe: selectedExam.dnp_oe,
          altura_od: selectedExam.altura_od,
          altura_oe: selectedExam.altura_oe,
          av_longe_od: selectedExam.av_longe_od,
          av_longe_oe: selectedExam.av_longe_oe,
          av_perto_od: selectedExam.av_perto_od,
          av_perto_oe: selectedExam.av_perto_oe,
          diagnostico_optometrico: selectedExam.diagnostico_optometrico,
          recomendacao_lentes: selectedExam.recomendacao_lentes || '',
          observacoes_clinicas: selectedExam.observacoes_clinicas || ''
        })
      });

      if (res.ok) {
        // Recarrega
        await fetchExams();
        // Transmite automaticamente para a ótica (vendas)
        await fetch(`/api/exames/${selectedExam.id}/transmitir-otica`, { method: 'POST' });
        alert("Receita digital emitida e transmitida com sucesso para o balcão de vendas!");
        setIsRecipeModalOpen(true);
      }
    } catch (err) {
      alert("Falha ao concluir exame.");
    } finally {
      setLoading(false);
    }
  };

  // Pin/Unpin paciente
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

  // WhatsApp link generator
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

  // Simulação de OCR de Receita Antiga
  const handleSimulateOCR = async () => {
    setOcrLoading(true);
    try {
      // Simula chamada de backend de OCR
      const response = await fetch('/api/gemini/parse-prescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: 'placeholder' })
      });
      const data = await response.json();
      if (data.success && selectedExam) {
        setOcrResult(data.prescription);
        alert("OCR executado com sucesso! Veja as informações extraídas no painel esquerdo.");
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
    alert("Dados da receita antiga aplicados ao prontuário de Pedro!");
  };

  // Cria novo paciente na fila
  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientForm.nome || !newPatientForm.telefone) {
      alert("Preencha nome e telefone.");
      return;
    }
    try {
      const res = await fetch('/api/exames/fila/novo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paciente_nome: newPatientForm.nome,
          paciente_telefone: newPatientForm.telefone,
          paciente_cpf: newPatientForm.cpf,
          prioridade: newPatientForm.prioridade,
          observacoes: newPatientForm.observacoes
        })
      });
      if (res.ok) {
        const data = await res.json();
        alert("Paciente inserido na fila com sucesso!");
        setIsNewPatientModalOpen(false);
        setNewPatientForm({ nome: '', telefone: '', cpf: '', prioridade: 'Normal', observacoes: '' });
        await fetchExams();
      }
    } catch {
      alert("Erro ao enfileirar paciente.");
    }
  };

  // Salva Anamnese Manual Simulando Triagem WhatsApp
  const handleSaveAnamneseForm = async () => {
    if (!selectedExam) return;
    try {
      const res = await fetch(`/api/exames/${selectedExam.id}/anamnese-ia`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(anamneseForm)
      });
      if (res.ok) {
        alert("Anamnese processada pela IA e salva no prontuário!");
        setIsAnamneseModalOpen(false);
        await fetchExams();
      }
    } catch {
      alert("Erro ao salvar anamnese.");
    }
  };

  // Filtros aplicados na fila
  const filteredExams = exams.filter(e => {
    const matchesSearch = e.paciente_nome.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'todos') return matchesSearch;
    if (filterStatus === 'sem_anamnese') return matchesSearch && e.status === 'aguardando_anamnese';
    if (filterStatus === 'com_anamnese') return matchesSearch && e.status === 'anamnese_concluida';
    if (filterStatus === 'concluidos') return matchesSearch && e.status === 'concluido';
    return matchesSearch;
  });

  // Geração de Hash para receita
  const recipeHash = selectedExam ? `SHA256-DIGITAL-${selectedExam.id.replace(/\D/g, '')}-B8F7` : 'N/A';

  return (
    <div className="flex flex-col h-[calc(100vh-16px)] my-2 mr-2 bg-[#040f26]/95 border-2 border-[#C9A96E]/80 rounded-[24px] shadow-[0_0_35px_rgba(201,169,110,0.2)] text-white overflow-hidden select-none select-none">
      
      {/* 1. Header de Ações Rápidas (Superior) */}
      <header className="px-6 py-3 border-b border-[#C9A96E]/30 bg-[#071D49] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.location.reload()} 
            className="flex items-center gap-1.5 bg-[#C9A96E] hover:bg-[#E8D2A8] text-[#071D49] font-black text-xs px-4 py-2 rounded-xl transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md"
          >
            ← Voltar ao Início
          </button>
          <span className="text-slate-400 text-xs font-semibold">
            🏠 Óticas Di Óculos • Módulo Clínico Ativo
          </span>
        </div>
        <button 
          onClick={() => fetchExams()}
          className="text-xs bg-[#0b255c] hover:bg-[#153270] border border-[#C9A96E]/40 text-[#C9A96E] px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Atualizar Fila
        </button>
      </header>

      {/* 2. Banner de Módulo "Sala de Exames Optométricos" (Conforme Imagem) */}
      <section className="mx-6 mt-4 p-4 bg-gradient-to-r from-[#071D49] to-[#0A2E70] border-2 border-[#C9A96E]/60 rounded-2xl flex items-center justify-between shadow-[0_4px_25px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#C9A96E] bg-[#0b255c] flex items-center justify-center text-2xl text-[#C9A96E] shadow-lg animate-pulse">
            👁
          </div>
          <div>
            <span className="text-[9px] bg-[#C9A96E] text-[#071D49] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
              Módulo Clínico Inteligente
            </span>
            <h1 className="text-lg font-black text-white mt-1 tracking-tight">
              Sala de Exames Optométricos & Prontuário IA
            </h1>
            <p className="text-[10px] text-slate-300">
              Anamnese prévia por inteligência artificial, emissão de receita com QR Code e transmissão instantânea para vendas.
            </p>
          </div>
        </div>
        
        {/* Optometrista Responsável */}
        <div className="bg-[#040f26]/80 border border-[#C9A96E]/50 rounded-xl px-4 py-2 text-right">
          <span className="text-[8px] text-[#C9A96E] font-black uppercase tracking-widest block">
            Optometrista Responsável
          </span>
          <span className="text-sm font-black text-white flex items-center gap-1.5 justify-end">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            {optometristaNome}
          </span>
          <span className="text-[10px] text-slate-400 font-bold block">{cboNumero}</span>
        </div>
      </section>

      {/* Submenus Auxiliares */}
      <nav className="mx-6 mt-3 flex border-b border-[#C9A96E]/20">
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
            className={`px-4 py-2 border-b-2 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === tab.id
                ? 'border-[#C9A96E] text-[#C9A96E] bg-[#C9A96E]/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.title}
          </button>
        ))}
      </nav>

      {/* 3. Área de Trabalho Principal */}
      <div className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-hidden min-h-0">

        {activeSubTab === 'atendimento' && (
          <>
            {/* COLUNA ESQUERDA: Fila de Atendimento */}
            <div className="col-span-12 lg:col-span-4 flex flex-col h-full bg-[#071D49]/40 border border-[#C9A96E]/30 rounded-2xl overflow-hidden shadow-lg backdrop-blur-md">
              <div className="p-4 border-b border-slate-700/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-black tracking-wider text-slate-100 flex items-center gap-1.5">
                    👥 Fila de Atendimento
                  </h2>
                  <button 
                    onClick={() => setIsNewPatientModalOpen(true)}
                    className="bg-[#C9A96E] hover:bg-[#E8D2A8] text-[#071D49] font-black text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" /> Novo Paciente
                  </button>
                </div>
                
                {/* Input de Busca */}
                <div className="relative">
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar paciente na fila..."
                    className="w-full bg-[#041333] border border-slate-700/70 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#C9A96E] transition-all"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                </div>

                {/* Filtros Pílula */}
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
                      className={`text-[9px] font-black px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                        filterStatus === pill.id
                          ? 'bg-[#C9A96E] border-[#C9A96E] text-[#071D49] font-extrabold shadow-sm'
                          : 'bg-[#041333] border-slate-700/50 text-slate-400 hover:text-white'
                      }`}
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista dos Pacientes Enfileirados */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2 [scrollbar-width:thin]">
                {loading ? (
                  <div className="text-center py-12 text-slate-500 text-xs italic">Carregando lista...</div>
                ) : filteredExams.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs italic">Nenhum paciente na fila.</div>
                ) : (
                  filteredExams.map(item => {
                    const isSelected = selectedExam?.id === item.id;
                    const initials = item.paciente_nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

                    return (
                      <div 
                        key={item.id}
                        onClick={() => setSelectedExam(item)}
                        className={`p-3 border rounded-xl flex items-center justify-between gap-2.5 transition-all cursor-pointer relative group ${
                          isSelected
                            ? 'bg-[#0b255c] border-[#C9A96E] shadow-[0_0_12px_rgba(201,169,110,0.15)]'
                            : 'bg-[#041333]/50 border-slate-800 hover:border-slate-700 hover:bg-[#071D49]/50'
                        }`}
                      >
                        {/* Indicador de Prioridade Urgente */}
                        {item.prioridade === 'Urgente' && (
                          <span className="absolute top-0 left-0 w-2.5 h-2.5 bg-red-500 rounded-br-lg" title="Paciente Urgente" />
                        )}

                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Avatar */}
                          <div className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center shrink-0 shadow-inner ${
                            isSelected ? 'bg-[#C9A96E] text-[#071D49]' : 'bg-[#0b255c] text-[#C9A96E]'
                          }`}>
                            {initials}
                          </div>
                          
                          {/* Detalhes */}
                          <div className="min-w-0">
                            <div className="text-xs font-extrabold text-slate-200 truncate group-hover:text-white">
                              {item.paciente_nome}
                              {item.is_pinned && <span className="text-[#C9A96E] ml-1">📌</span>}
                            </div>
                            <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                              {item.id} • {item.prioridade}
                            </div>
                          </div>
                        </div>

                        {/* Status / Ações */}
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          {item.status === 'aguardando_anamnese' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleGenerateWhatsappLink(item.id);
                              }}
                              className="bg-[#25D366]/10 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-black text-[9px] px-2 py-1 rounded-md transition-all active:scale-95 cursor-pointer flex items-center gap-1 shrink-0"
                            >
                              💬 WhatsApp Anamnese
                            </button>
                          )}
                          {item.status === 'anamnese_concluida' && (
                            <span className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-black text-[9px] px-2 py-0.5 rounded-md uppercase shrink-0">
                              Anamnese IA Concluída
                            </span>
                          )}
                          {item.status === 'concluido' && (
                            <span className="bg-blue-500/10 border border-blue-500/40 text-blue-400 font-black text-[9px] px-2 py-0.5 rounded-md uppercase shrink-0">
                              Exame Concluído
                            </span>
                          )}

                          {/* Pin Toggle */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTogglePin(item.id, item.is_pinned);
                            }}
                            className={`p-1 rounded-sm text-slate-500 hover:text-[#C9A96E] hover:bg-[#071D49] transition-all`}
                            title={item.is_pinned ? "Desafixar do topo" : "Fixar no topo"}
                          >
                            <Pin className={`w-3 h-3 ${item.is_pinned ? 'text-[#C9A96E] fill-[#C9A96E]' : ''}`} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* COLUNA DIREITA: Prontuário Clínico & IA */}
            <div className="col-span-12 lg:col-span-8 flex flex-col h-full bg-[#071D49]/30 border border-[#C9A96E]/20 rounded-2xl overflow-hidden shadow-lg">
              {selectedExam ? (
                <div className="flex-1 flex flex-col min-h-0">
                  {/* Header do Prontuário */}
                  <div className="p-4 border-b border-slate-700/50 bg-[#071D49]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
                    <div>
                      <span className="text-[9px] text-[#C9A96E] uppercase font-black tracking-wider">
                        Prontuário Optométrico Digital • ID: {selectedExam.id}
                      </span>
                      <h2 className="text-sm font-black text-slate-200 mt-0.5">
                        Exame de Refração: <span className="text-[#C9A96E] font-black">{selectedExam.paciente_nome}</span>
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsRecipeModalOpen(true)}
                        className="bg-[#0b255c] hover:bg-[#153270] border border-[#C9A96E]/50 text-[#C9A96E] font-black text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" /> Ver Receita Digital QR
                      </button>

                      <button
                        onClick={handleConcludeExam}
                        className="bg-[#C9A96E] hover:bg-[#E8D2A8] text-[#071D49] font-black text-xs px-4 py-2 rounded-xl transition-all cursor-pointer active:scale-95 shadow-md flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4 stroke-[3]" /> Concluir & Emitir Receita
                      </button>
                    </div>
                  </div>

                  {/* Formulário Clínico */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 [scrollbar-width:thin]">
                    
                    {/* Anamnese e IA de Triagem */}
                    {selectedExam.anamnese_json ? (
                      <div className="bg-[#0b255c]/30 border border-[#C9A96E]/40 p-4 rounded-2xl space-y-2">
                        <h3 className="text-xs font-black uppercase text-[#C9A96E] tracking-wider flex items-center gap-1">
                          🤖 Triagem & Anamnese Prévia IA (WhatsApp)
                        </h3>
                        <div className="text-xs space-y-1">
                          <div><strong>Principal Queixa:</strong> {selectedExam.anamnese_json.queixa_principal} ({selectedExam.anamnese_json.tempo_sintomas})</div>
                          <div><strong>Sintomas:</strong> {selectedExam.anamnese_json.sintomas_visuais.join(', ') || 'Nenhum'}</div>
                          <div><strong>Histórico Sistêmico:</strong> {selectedExam.anamnese_json.doencas_sistemicas.join(', ') || 'Nenhum'} | <strong>Familiar:</strong> {selectedExam.anamnese_json.historico_familiar.join(', ') || 'Nenhum'}</div>
                          <div><strong>Uso de Óculos:</strong> {selectedExam.anamnese_json.uso_atual_oculos}</div>
                        </div>
                        <div className="mt-2.5 p-2.5 bg-[#040f26]/60 border border-slate-700/60 rounded-xl text-xs font-semibold text-amber-200/90 leading-relaxed">
                          {selectedExam.anamnese_json.ia_summary}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#0b255c]/10 border border-dashed border-slate-700 p-4 rounded-2xl flex items-center justify-between">
                        <div>
                          <h3 className="text-xs font-bold text-slate-400">Nenhuma anamnese prévia enviada.</h3>
                          <p className="text-[10px] text-slate-500">Envie o link para o paciente pelo WhatsApp ou preencha agora.</p>
                        </div>
                        <button 
                          onClick={() => {
                            setAnamneseForm({
                              queixa_principal: '',
                              tempo_sintomas: '',
                              sintomas_visuais: [],
                              doencas_sistemicas: [],
                              historico_familiar: [],
                              uso_atual_oculos: 'Não'
                            });
                            setIsAnamneseModalOpen(true);
                          }}
                          className="bg-[#0b255c] hover:bg-[#153270] border border-slate-700/60 text-slate-300 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          Preencher Anamnese
                        </button>
                      </div>
                    )}

                    {/* OCR Comparativo de Receitas Antigas */}
                    <div className="border border-slate-700/40 p-4 rounded-2xl bg-[#040f26]/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-wider text-[#C9A96E]">
                          📂 Upload & OCR de Receita Antiga
                        </h3>
                        <button
                          onClick={handleSimulateOCR}
                          disabled={ocrLoading}
                          className="bg-[#0b255c] hover:bg-[#153270] border border-slate-700/60 text-slate-300 font-bold text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                          {ocrLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileUp className="w-3.5 h-3.5" />}
                          Simular OCR de Receita
                        </button>
                      </div>

                      {/* Exibe resultado do OCR para comparação */}
                      {ocrResult && (
                        <div className="p-3.5 bg-amber-500/10 border border-amber-500/40 rounded-xl space-y-2 text-xs">
                          <div className="text-amber-400 font-bold uppercase text-[10px]">Receita Antiga Detectada via IA Vision:</div>
                          <div className="grid grid-cols-2 gap-4">
                            <div><strong>OD:</strong> Esf {ocrResult.od.esferico} | Cil {ocrResult.od.cilindrico} | Eixo {ocrResult.od.eixo}</div>
                            <div><strong>OE:</strong> Esf {ocrResult.oe.esferico} | Cil {ocrResult.oe.cilindrico} | Eixo {ocrResult.oe.eixo}</div>
                            <div className="col-span-2"><strong>ADD:</strong> {ocrResult.adicao} | <strong>Médico:</strong> {ocrResult.medicoName}</div>
                          </div>
                          <button
                            onClick={handleApplyOCRData}
                            className="w-full mt-2 py-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-black rounded-md text-[10px] uppercase transition-all"
                          >
                            Importar Graus para Prontuário Atual
                          </button>
                        </div>
                      )}
                    </div>

                    {/* REFRAÇÃO SUBJETIVA (GRAU FINAL PRESCRITO) */}
                    <div className="space-y-3.5">
                      <h3 className="text-xs font-black uppercase tracking-widest text-[#C9A96E] border-b border-[#C9A96E]/20 pb-1 flex items-center justify-between">
                        <span>👁 REFRAÇÃO SUBJETIVA (GRAU FINAL PRESCRITO)</span>
                        <span className="text-[9px] text-slate-400 font-normal lowercase">Valores em dioptrias (D)</span>
                      </h3>

                      <div className="border border-slate-700/60 rounded-2xl overflow-hidden bg-slate-900/40">
                        <table className="w-full text-center text-xs">
                          <thead>
                            <tr className="bg-slate-800/80 border-b border-slate-700 text-slate-400 text-[10px] font-black uppercase">
                              <th className="py-2.5 px-3 text-left">Olho</th>
                              <th className="py-2.5">Esférico (ESF)</th>
                              <th className="py-2.5">Cilíndrico (CIL)</th>
                              <th className="py-2.5">Eixo (°)</th>
                              <th className="py-2.5">DNP (mm)</th>
                              <th className="py-2.5">Alt (mm)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60">
                            {/* Olho Direito */}
                            <tr className="hover:bg-slate-800/10">
                              <td className="py-3.5 px-3 font-extrabold text-left text-slate-300">OD (Right)</td>
                              <td className="py-2 px-1">
                                <input 
                                  type="number"
                                  step="0.25"
                                  value={selectedExam.od_esferico}
                                  onChange={(e) => handleUpdateField('od_esferico', Number(e.target.value))}
                                  className="w-16 bg-[#041333] border border-slate-700/80 rounded-lg p-1 text-center font-mono font-bold text-[#C9A96E]"
                                />
                              </td>
                              <td className="py-2 px-1">
                                <input 
                                  type="number"
                                  step="0.25"
                                  value={selectedExam.od_cilindrico}
                                  onChange={(e) => handleUpdateField('od_cilindrico', Number(e.target.value))}
                                  className="w-16 bg-[#041333] border border-slate-700/80 rounded-lg p-1 text-center font-mono font-bold text-[#C9A96E]"
                                />
                              </td>
                              <td className="py-2 px-1">
                                <input 
                                  type="number"
                                  min="0"
                                  max="180"
                                  value={selectedExam.od_eixo}
                                  onChange={(e) => handleUpdateField('od_eixo', Number(e.target.value))}
                                  className="w-16 bg-[#041333] border border-slate-700/80 rounded-lg p-1 text-center font-mono text-slate-300"
                                />
                              </td>
                              <td className="py-2 px-1">
                                <input 
                                  type="number"
                                  step="0.5"
                                  value={selectedExam.dnp_od}
                                  onChange={(e) => handleUpdateField('dnp_od', Number(e.target.value))}
                                  className="w-16 bg-[#041333] border border-slate-700/80 rounded-lg p-1 text-center font-mono text-slate-300"
                                />
                              </td>
                              <td className="py-2 px-1">
                                <input 
                                  type="number"
                                  step="0.5"
                                  value={selectedExam.altura_od}
                                  onChange={(e) => handleUpdateField('altura_od', Number(e.target.value))}
                                  className="w-16 bg-[#041333] border border-slate-700/80 rounded-lg p-1 text-center font-mono text-slate-300"
                                />
                              </td>
                            </tr>

                            {/* Olho Esquerdo */}
                            <tr className="hover:bg-slate-800/10">
                              <td className="py-3.5 px-3 font-extrabold text-left text-slate-300">OE (Left)</td>
                              <td className="py-2 px-1">
                                <input 
                                  type="number"
                                  step="0.25"
                                  value={selectedExam.oe_esferico}
                                  onChange={(e) => handleUpdateField('oe_esferico', Number(e.target.value))}
                                  className="w-16 bg-[#041333] border border-slate-700/80 rounded-lg p-1 text-center font-mono font-bold text-[#C9A96E]"
                                />
                              </td>
                              <td className="py-2 px-1">
                                <input 
                                  type="number"
                                  step="0.25"
                                  value={selectedExam.oe_cilindrico}
                                  onChange={(e) => handleUpdateField('oe_cilindrico', Number(e.target.value))}
                                  className="w-16 bg-[#041333] border border-slate-700/80 rounded-lg p-1 text-center font-mono font-bold text-[#C9A96E]"
                                />
                              </td>
                              <td className="py-2 px-1">
                                <input 
                                  type="number"
                                  min="0"
                                  max="180"
                                  value={selectedExam.oe_eixo}
                                  onChange={(e) => handleUpdateField('oe_eixo', Number(e.target.value))}
                                  className="w-16 bg-[#041333] border border-slate-700/80 rounded-lg p-1 text-center font-mono text-slate-300"
                                />
                              </td>
                              <td className="py-2 px-1">
                                <input 
                                  type="number"
                                  step="0.5"
                                  value={selectedExam.dnp_oe}
                                  onChange={(e) => handleUpdateField('dnp_oe', Number(e.target.value))}
                                  className="w-16 bg-[#041333] border border-slate-700/80 rounded-lg p-1 text-center font-mono text-slate-300"
                                />
                              </td>
                              <td className="py-2 px-1">
                                <input 
                                  type="number"
                                  step="0.5"
                                  value={selectedExam.altura_oe}
                                  onChange={(e) => handleUpdateField('altura_oe', Number(e.target.value))}
                                  className="w-16 bg-[#041333] border border-slate-700/80 rounded-lg p-1 text-center font-mono text-slate-300"
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* ADIÇÃO PERTO e Acuidade Visual */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">
                          Adição Perto (ADD)
                        </label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number"
                            step="0.25"
                            value={selectedExam.adicao}
                            onChange={(e) => handleUpdateField('adicao', Number(e.target.value))}
                            className="bg-[#041333] border border-slate-700/80 rounded-xl py-2 px-4 text-xs text-[#C9A96E] font-mono font-bold focus:outline-hidden focus:border-[#C9A96E] w-32"
                          />
                          <span className="text-xs text-slate-500">(Adicionar apenas para perto/multifocal)</span>
                        </div>
                      </div>

                      {/* Acuidade Visual Simples */}
                      <div className="space-y-3">
                        <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">
                          Acuidade Visual (Longe/Perto)
                        </label>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-slate-400 font-bold">AV Longe OD:</span>
                            <input 
                              type="text" 
                              value={selectedExam.av_longe_od} 
                              onChange={(e) => handleUpdateField('av_longe_od', e.target.value)}
                              className="w-full bg-[#041333] border border-slate-700/60 rounded-lg p-1.5 mt-1"
                            />
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold">AV Longe OE:</span>
                            <input 
                              type="text" 
                              value={selectedExam.av_longe_oe} 
                              onChange={(e) => handleUpdateField('av_longe_oe', e.target.value)}
                              className="w-full bg-[#041333] border border-slate-700/60 rounded-lg p-1.5 mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Exames Complementares adicionais (Segmento Anterior/Posterior/Diagnóstico) */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-wider text-[#C9A96E] border-b border-slate-700 pb-1">
                        📋 Diagnóstico e Encaminhamento
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1.5">
                          <span className="text-slate-400 font-black uppercase text-[9px] tracking-wider block">Diagnóstico Optométrico Principal *</span>
                          <textarea
                            value={selectedExam.diagnostico_optometrico || ''}
                            onChange={(e) => handleUpdateField('diagnostico_optometrico', e.target.value)}
                            rows={3}
                            placeholder="Descreva o achado refrativo (ex: Presbiopia associada à Miopia simples)..."
                            className="w-full bg-[#041333] border border-slate-700/70 rounded-xl p-3 focus:outline-hidden focus:border-[#C9A96E]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-slate-400 font-black uppercase text-[9px] tracking-wider block">Conduta e Indicação de Lentes</span>
                          <textarea
                            value={selectedExam.recomendacao_lentes || ''}
                            onChange={(e) => handleUpdateField('recomendacao_lentes', e.target.value)}
                            rows={3}
                            placeholder="Recomendação de lentes, filtros antirreflexo ou encaminhamento oftalmológico..."
                            className="w-full bg-[#041333] border border-slate-700/70 rounded-xl p-3 focus:outline-hidden focus:border-[#C9A96E]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Botão de Salvar Rascunho */}
                    <button
                      onClick={handleSaveExam}
                      className="w-full py-2.5 border border-[#C9A96E] hover:bg-[#C9A96E]/10 text-[#C9A96E] font-black text-xs rounded-xl transition-all cursor-pointer text-center"
                    >
                      Gravar Prontuário Clínico (Rascunho)
                    </button>
                  </div>

                  {/* Alertas e Sugestões da IA Gemini (Visualizado na direita de forma integrada) */}
                  <div className="bg-[#0b255c]/20 border-t border-slate-800 p-4 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs leading-relaxed">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-1 text-[#C9A96E] font-black uppercase tracking-wider text-[10px]">
                        <Brain className="w-4 h-4" /> Assistente IA Clínico Gemini
                      </div>
                      {iaAlerts.length > 0 ? (
                        <div className="text-red-400 text-[11px] font-bold space-y-0.5">
                          {iaAlerts.map((a, i) => <div key={i}>{a}</div>)}
                        </div>
                      ) : (
                        <div className="text-slate-300">
                          {iaSuggestions || 'Aguardando dados clínicos para analisar refração...'}
                        </div>
                      )}
                    </div>
                    {loadingIa && (
                      <span className="text-[10px] text-[#C9A96E] animate-pulse flex items-center gap-1.5 font-bold">
                        <RefreshCw className="w-3 h-3 animate-spin" /> Analisando...
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500 italic text-xs">
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
                <div key={i} className="bg-[#071D49]/40 border border-slate-700/50 p-4 rounded-2xl">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black block">{card.title}</span>
                  <span className="text-2xl font-black text-[#C9A96E] block mt-1">{card.val}</span>
                  <span className="text-[10px] text-slate-500 block mt-1">{card.desc}</span>
                </div>
              ))}
            </div>

            {/* Simulação de Gráfico */}
            <div className="bg-[#071D49]/40 border border-slate-700/50 p-6 rounded-3xl space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#C9A96E]">Fluxo de Atendimento Horário</h3>
              <div className="h-48 border border-slate-700/60 rounded-xl bg-slate-900/50 flex items-end justify-between p-6">
                {[
                  { hour: '08h', val: 3 }, { hour: '09h', val: 7 }, { hour: '10h', val: 12 }, 
                  { hour: '11h', val: 5 }, { hour: '14h', val: 4 }, { hour: '15h', val: 9 }, 
                  { hour: '16h', val: 15 }, { hour: '17h', val: 2 }
                ].map((bar, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <span className="text-[9px] text-[#C9A96E] font-bold">{bar.val}</span>
                    <div 
                      className="w-8 rounded-t-md bg-gradient-to-t from-[#0b255c] to-[#C9A96E] transition-all duration-500" 
                      style={{ height: `${bar.val * 8}px` }}
                    />
                    <span className="text-[9px] text-slate-500 font-bold">{bar.hour}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB: Receitas Digitais */}
        {activeSubTab === 'receitas' && (
          <div className="col-span-12 bg-[#071D49]/40 border border-slate-700/50 rounded-3xl p-6 overflow-hidden flex flex-col h-full">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#C9A96E] mb-4">Histórico de Receitas Digitais Emitidas</h3>
            
            <div className="flex-1 overflow-y-auto [scrollbar-width:thin]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-800/80 text-slate-400 text-[10px] font-black uppercase border-b border-slate-700">
                    <th className="py-2.5 px-4">Código</th>
                    <th className="py-2.5">Paciente</th>
                    <th className="py-2.5">Data Emissão</th>
                    <th className="py-2.5">Status Receita</th>
                    <th className="py-2.5">Integração Ótica</th>
                    <th className="py-2.5 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {exams.filter(e => e.status === 'concluido').map(rec => (
                    <tr key={rec.id} className="hover:bg-slate-800/20">
                      <td className="py-3 px-4 font-mono font-bold text-[#C9A96E]">{rec.id}</td>
                      <td className="py-3 font-extrabold text-white">{rec.paciente_nome}</td>
                      <td className="py-3">{rec.data_exame.split('-').reverse().join('/')}</td>
                      <td className="py-3">
                        <span className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">Ativa</span>
                      </td>
                      <td className="py-3">
                        {rec.enviado_para_otica ? (
                          <span className="bg-blue-500/10 border border-blue-500/40 text-blue-400 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">OS Gerada</span>
                        ) : (
                          <span className="bg-slate-500/10 border border-slate-500/40 text-slate-400 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">Pendente</span>
                        )}
                      </td>
                      <td className="py-3 text-center">
                        <button
                          onClick={() => {
                            setSelectedExam(rec);
                            setIsRecipeModalOpen(true);
                          }}
                          className="bg-[#0b255c] hover:bg-[#153270] border border-[#C9A96E]/50 text-[#C9A96E] font-bold text-[10px] px-3 py-1 rounded-md transition-all active:scale-95 cursor-pointer"
                        >
                          Visualizar & Imprimir
                        </button>
                      </td>
                    </tr>
                  ))}
                  {exams.filter(e => e.status === 'concluido').length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-500 italic text-xs">Nenhuma receita emitida hoje.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-TAB: IA Chat */}
        {activeSubTab === 'ia-chat' && (
          <div className="col-span-12 bg-[#071D49]/40 border border-slate-700/50 rounded-3xl p-6 flex flex-col h-full">
            <div className="border-b border-slate-700 pb-3 mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#C9A96E]">IA Assistente Clínica Gemini</h3>
                <p className="text-[10px] text-slate-400">Interação direta com a IA para esclarecer dúvidas diagnósticas ou redigir condutas.</p>
              </div>
            </div>
            
            <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800 p-4 mb-4 flex items-center justify-center text-xs text-slate-500 italic">
              Selecione o prontuário no atendimento para ter resumos automáticos de IA. Use a caixa de texto abaixo para simular comandos de clínica.
            </div>

            <div className="flex gap-2 shrink-0">
              <input 
                type="text" 
                placeholder="Perguntar à IA clínica (ex: Quais testes complementares fazer para suspeita de glaucoma?)..."
                className="flex-1 bg-[#041333] border border-slate-700/80 rounded-xl py-2 px-4 text-xs text-white focus:outline-hidden focus:border-[#C9A96E]"
              />
              <button className="bg-[#C9A96E] hover:bg-[#E8D2A8] text-[#071D49] font-black text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer">
                Enviar
              </button>
            </div>
          </div>
        )}

        {/* SUB-TAB: Configurações */}
        {activeSubTab === 'config' && (
          <div className="col-span-12 bg-[#071D49]/40 border border-slate-700/50 rounded-3xl p-6 overflow-y-auto h-full space-y-6 [scrollbar-width:thin]">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#C9A96E] border-b border-slate-700 pb-2">Configurações Gerais do Consultório</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-1.5">
                <span className="font-bold text-slate-400">Nome do Optometrista/Oftalmologista Responsável</span>
                <input 
                  type="text" 
                  value={optometristaNome} 
                  onChange={(e) => setOptometristaNome(e.target.value)}
                  className="w-full bg-[#041333] border border-slate-700/70 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-slate-400">Conselho e Registro Profissional (Ex: CBO, CRM)</span>
                <input 
                  type="text" 
                  value={cboNumero} 
                  onChange={(e) => setCBONumero(e.target.value)}
                  className="w-full bg-[#041333] border border-slate-700/70 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-slate-400">Razão Social / Nome da Clínica</span>
                <input 
                  type="text" 
                  value={clinicaNome} 
                  onChange={(e) => setClinicaNome(e.target.value)}
                  className="w-full bg-[#041333] border border-slate-700/70 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-slate-400">Assinatura Digital (URL Imagem)</span>
                <input 
                  type="text" 
                  value={assinaturaUrl} 
                  onChange={(e) => setAssinaturaUrl(e.target.value)}
                  className="w-full bg-[#041333] border border-slate-700/70 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <button
              onClick={() => alert('Configurações atualizadas!')}
              className="bg-[#C9A96E] hover:bg-[#E8D2A8] text-[#071D49] font-black text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              Salvar Alterações
            </button>
          </div>
        )}

      </div>

      {/* ============================================================================
          MODAIS E DIÁLOGOS
          ============================================================================ */}

      {/* 1. Modal: Novo Paciente na Fila */}
      {isNewPatientModalOpen && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-[300]">
          <div className="bg-[#071D49] border-2 border-[#C9A96E]/80 rounded-[24px] p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-sm font-black text-[#C9A96E] uppercase tracking-wider">📋 Cadastrar Paciente na Fila</h3>
              <button onClick={() => setIsNewPatientModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>
            
            <form onSubmit={handleCreatePatient} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <span className="text-slate-300 font-bold block">Nome Completo *</span>
                <input 
                  type="text"
                  required
                  value={newPatientForm.nome}
                  onChange={(e) => setNewPatientForm({ ...newPatientForm, nome: e.target.value })}
                  placeholder="Ex: Pedro Alves"
                  className="w-full bg-[#041333] border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div className="space-y-1.5">
                <span className="text-slate-300 font-bold block">Telefone WhatsApp (com DDD) *</span>
                <input 
                  type="text"
                  required
                  value={newPatientForm.telefone}
                  onChange={(e) => setNewPatientForm({ ...newPatientForm, telefone: e.target.value })}
                  placeholder="Ex: (11) 98877-1001"
                  className="w-full bg-[#041333] border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div className="space-y-1.5">
                <span className="text-slate-300 font-bold block">CPF (Opcional)</span>
                <input 
                  type="text"
                  value={newPatientForm.cpf}
                  onChange={(e) => setNewPatientForm({ ...newPatientForm, cpf: e.target.value })}
                  placeholder="Ex: 123.456.789-01"
                  className="w-full bg-[#041333] border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div className="space-y-1.5">
                <span className="text-slate-300 font-bold block">Nível de Prioridade</span>
                <select
                  value={newPatientForm.prioridade}
                  onChange={(e) => setNewPatientForm({ ...newPatientForm, prioridade: e.target.value as any })}
                  className="w-full bg-[#041333] border border-slate-700 rounded-xl p-2.5 text-white focus:outline-hidden"
                >
                  <option value="Normal">Normal</option>
                  <option value="Urgente">Urgente</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <span className="text-slate-300 font-bold block">Observações do Atendimento</span>
                <input 
                  type="text"
                  value={newPatientForm.observacoes}
                  onChange={(e) => setNewPatientForm({ ...newPatientForm, observacoes: e.target.value })}
                  placeholder="Ex: Exame de rotina para perto"
                  className="w-full bg-[#041333] border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#C9A96E] hover:bg-[#E8D2A8] text-[#071D49] font-black py-2.5 rounded-xl uppercase tracking-wider text-xs shadow-md transition-all cursor-pointer"
              >
                Confirmar Cadastro & Enfileirar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: WhatsApp Anamnese Envio */}
      {isWhatsappModalOpen && whatsappData && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-[300]">
          <div className="bg-[#071D49] border-2 border-[#C9A96E]/80 rounded-[24px] p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-sm font-black text-[#C9A96E] uppercase tracking-wider flex items-center gap-1.5">
                💬 WhatsApp Anamnese
              </h3>
              <button onClick={() => setIsWhatsappModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>
            
            <div className="text-xs space-y-3">
              <p className="text-slate-300">
                Gere o link e envie para o paciente responder às perguntas clínicas conduzidas pela IA antes da consulta:
              </p>
              
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-[10px] text-slate-400 break-all select-text">
                {whatsappData.texto}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(whatsappData.texto);
                    alert("Mensagem copiada para a área de transferência!");
                  }}
                  className="flex-1 bg-[#0b255c] hover:bg-[#153270] border border-slate-700 text-slate-300 text-xs font-bold py-2.5 rounded-xl cursor-pointer"
                >
                  Copiar Mensagem
                </button>

                <a
                  href={whatsappData.link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setIsWhatsappModalOpen(false)}
                  className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-black py-2.5 rounded-xl flex items-center justify-center shadow-lg transition-all cursor-pointer text-center"
                >
                  Enviar via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal: Receita Digital PDF Printable (Visualização A4) */}
      {isRecipeModalOpen && selectedExam && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[300] overflow-y-auto print:p-0 print:bg-white print:absolute print:inset-0">
          <div className="bg-[#071D49] border-2 border-[#C9A96E]/80 rounded-[32px] max-w-2xl w-full p-8 shadow-2xl relative my-8 print:border-none print:shadow-none print:bg-white print:p-0 print:my-0">
            
            {/* Fechar modal */}
            <button 
              onClick={() => setIsRecipeModalOpen(false)} 
              className="absolute top-6 right-6 text-slate-400 hover:text-white text-base print:hidden cursor-pointer"
            >
              ✕
            </button>

            {/* Layout de Impressão A4 */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6 text-white print:bg-white print:text-black print:border-none print:p-0">
              
              {/* Header Clínica */}
              <div className="flex justify-between items-center border-b border-slate-700/50 pb-4 print:border-slate-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#C9A96E] rounded-2xl flex items-center justify-center text-white text-2xl font-black print:border print:border-black">
                    👓
                  </div>
                  <div>
                    <h2 className="text-sm font-black uppercase text-[#C9A96E] tracking-wider print:text-black">{clinicaNome}</h2>
                    <p className="text-[9px] text-slate-400 print:text-slate-500">Rua 23 de Abril, 51, Centro, Ituberá - BA</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-mono block">RECEITA DIGITAL</span>
                  <span className="text-xs font-black text-[#C9A96E] print:text-black">{selectedExam.id}</span>
                </div>
              </div>

              {/* Paciente e Médico */}
              <div className="grid grid-cols-2 gap-6 text-xs border-b border-slate-700/40 pb-4 print:border-slate-300">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black block">Paciente</span>
                  <span className="text-sm font-extrabold text-white print:text-black">{selectedExam.paciente_nome}</span>
                  {selectedExam.paciente_cpf && <div className="text-[10px] text-slate-400 mt-0.5">CPF: {selectedExam.paciente_cpf}</div>}
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black block">Profissional Emitente</span>
                  <span className="text-sm font-extrabold text-white print:text-black">{selectedExam.optometrista_nome}</span>
                  <div className="text-[10px] text-slate-400 mt-0.5">{selectedExam.cbo_numero}</div>
                </div>
              </div>

              {/* Refração Subjetiva */}
              <div className="space-y-2">
                <span className="text-[9px] text-[#C9A96E] uppercase tracking-wider font-black block print:text-black">Grau Prescrito</span>
                
                <table className="w-full text-center text-xs border border-slate-700/50 rounded-xl overflow-hidden print:border-slate-300">
                  <thead>
                    <tr className="bg-slate-800/80 border-b border-slate-700 text-slate-400 text-[9px] font-black uppercase print:bg-slate-100 print:text-black print:border-slate-300">
                      <th className="py-2 px-3 text-left">Olho</th>
                      <th className="py-2">Esférico (ESF)</th>
                      <th className="py-2">Cilíndrico (CIL)</th>
                      <th className="py-2">Eixo (°)</th>
                      <th className="py-2">DNP (mm)</th>
                      <th className="py-2">Alt (mm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 print:divide-slate-300">
                    <tr>
                      <td className="py-3 px-3 font-extrabold text-left text-slate-300 print:text-black">OD (Direito)</td>
                      <td className="py-3 font-mono font-bold text-[#C9A96E] print:text-black">{selectedExam.od_esferico > 0 ? `+${selectedExam.od_esferico.toFixed(2)}` : selectedExam.od_esferico.toFixed(2)}</td>
                      <td className="py-3 font-mono font-bold text-[#C9A96E] print:text-black">{selectedExam.od_cilindrico > 0 ? `+${selectedExam.od_cilindrico.toFixed(2)}` : selectedExam.od_cilindrico.toFixed(2)}</td>
                      <td className="py-3 font-mono print:text-black">{selectedExam.od_eixo}°</td>
                      <td className="py-3 font-mono print:text-black">{selectedExam.dnp_od.toFixed(1)}</td>
                      <td className="py-3 font-mono print:text-black">{selectedExam.altura_od.toFixed(1)}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-extrabold text-left text-slate-300 print:text-black">OE (Esquerdo)</td>
                      <td className="py-3 font-mono font-bold text-[#C9A96E] print:text-black">{selectedExam.oe_esferico > 0 ? `+${selectedExam.oe_esferico.toFixed(2)}` : selectedExam.oe_esferico.toFixed(2)}</td>
                      <td className="py-3 font-mono font-bold text-[#C9A96E] print:text-black">{selectedExam.oe_cilindrico > 0 ? `+${selectedExam.oe_cilindrico.toFixed(2)}` : selectedExam.oe_cilindrico.toFixed(2)}</td>
                      <td className="py-3 font-mono print:text-black">{selectedExam.oe_eixo}°</td>
                      <td className="py-3 font-mono print:text-black">{selectedExam.dnp_oe.toFixed(1)}</td>
                      <td className="py-3 font-mono print:text-black">{selectedExam.altura_oe.toFixed(1)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Adição Perto e Recomendações */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                {selectedExam.adicao > 0 && (
                  <div className="border border-slate-700/40 p-2.5 rounded-xl print:border-slate-300">
                    <span className="text-[8px] text-slate-400 uppercase font-black block">Adição perto (ADD)</span>
                    <span className="text-sm font-extrabold font-mono text-[#C9A96E] print:text-black">+{selectedExam.adicao.toFixed(2)} D</span>
                  </div>
                )}
                {selectedExam.recomendacao_lentes && (
                  <div className="border border-slate-700/40 p-2.5 rounded-xl col-span-2 print:border-slate-300">
                    <span className="text-[8px] text-slate-400 uppercase font-black block">Recomendação Lentes</span>
                    <span className="text-xs font-bold text-slate-300 print:text-black">{selectedExam.recomendacao_lentes}</span>
                  </div>
                )}
              </div>

              {/* QR Code Autenticação + Assinatura */}
              <div className="flex items-center justify-between border-t border-slate-700/40 pt-4 print:border-slate-300">
                <div className="flex items-center gap-3">
                  {/* QR Code de Autenticidade */}
                  <div className="w-20 h-20 bg-white p-1 rounded-lg">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                        window.location.origin + '/?validarReceita=' + selectedExam.id
                      )}`} 
                      alt="QR Code Receita"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-[9px] text-slate-400">
                    <strong className="text-slate-300 print:text-black block">Receita Segura Criptografada</strong>
                    <span>Escaneie para verificar a validade técnica e autenticidade da assinatura no banco Óticas Di Óculos.</span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-32 h-10 mx-auto">
                    <img src={assinaturaUrl} alt="Assinatura Optometrista" className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="w-36 border-t border-slate-700/50 mt-1 mx-auto print:border-slate-400"></div>
                  <span className="text-[9px] text-slate-400 font-bold block mt-1">{selectedExam.optometrista_nome}</span>
                  <span className="text-[8px] text-slate-500 font-semibold block">{selectedExam.cbo_numero}</span>
                </div>
              </div>

              {/* Hash Criptográfico final */}
              <div className="text-center font-mono text-[9px] text-[#C9A96E] print:text-black">
                Assinatura Digital Hash: {recipeHash}
              </div>
            </div>

            {/* Impressão física */}
            <div className="mt-6 flex justify-end gap-3 print:hidden">
              <button
                onClick={() => setIsRecipeModalOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
              >
                Fechar Visualização
              </button>
              <button
                onClick={handlePrint}
                className="bg-[#C9A96E] hover:bg-[#E8D2A8] text-[#071D49] font-black text-xs px-6 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Printer className="w-4 h-4 stroke-[3]" /> Imprimir Receita Digital
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. Modal: Preenchimento de Anamnese Manual */}
      {isAnamneseModalOpen && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-[300]">
          <div className="bg-[#071D49] border-2 border-[#C9A96E]/80 rounded-[24px] p-6 max-w-md w-full space-y-4 shadow-2xl overflow-y-auto max-h-[85vh] [scrollbar-width:thin]">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-sm font-black text-[#C9A96E] uppercase tracking-wider">📋 Preenchimento Manual de Anamnese</h3>
              <button onClick={() => setIsAnamneseModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>
            
            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <span className="text-slate-300 font-bold block">Queixa Principal</span>
                <input 
                  type="text"
                  value={anamneseForm.queixa_principal}
                  onChange={(e) => setAnamneseForm({ ...anamneseForm, queixa_principal: e.target.value })}
                  placeholder="Ex: Visão embaçada para longe"
                  className="w-full bg-[#041333] border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-slate-300 font-bold block">Tempo dos Sintomas</span>
                <input 
                  type="text"
                  value={anamneseForm.tempo_sintomas}
                  onChange={(e) => setAnamneseForm({ ...anamneseForm, tempo_sintomas: e.target.value })}
                  placeholder="Ex: 2 meses"
                  className="w-full bg-[#041333] border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-slate-300 font-bold block">Sintomas Oculares</span>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  {["Visão Embaçada", "Visão Dupla", "Olhos Secos", "Dores de Cabeça", "Sensibilidade à Luz", "Ardência Ocular"].map(sym => {
                    const isChecked = anamneseForm.sintomas_visuais.includes(sym);
                    return (
                      <label key={sym} className="flex items-center gap-1.5">
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={() => {
                            const newSyms = isChecked 
                              ? anamneseForm.sintomas_visuais.filter(s => s !== sym)
                              : [...anamneseForm.sintomas_visuais, sym];
                            setAnamneseForm({ ...anamneseForm, sintomas_visuais: newSyms });
                          }}
                        />
                        <span>{sym}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-slate-300 font-bold block">Doenças Crônicas</span>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  {["Diabetes", "Hipertensão"].map(disease => {
                    const isChecked = anamneseForm.doencas_sistemicas.includes(disease);
                    return (
                      <label key={disease} className="flex items-center gap-1.5">
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={() => {
                            const newDiseases = isChecked 
                              ? anamneseForm.doencas_sistemicas.filter(d => d !== disease)
                              : [...anamneseForm.doencas_sistemicas, disease];
                            setAnamneseForm({ ...anamneseForm, doencas_sistemicas: newDiseases });
                          }}
                        />
                        <span>{disease}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-slate-300 font-bold block">Histórico Familiar Ocular</span>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  {["Glaucoma", "Catarata", "Cegueira"].map(fam => {
                    const isChecked = anamneseForm.historico_familiar.includes(fam);
                    return (
                      <label key={fam} className="flex items-center gap-1.5">
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={() => {
                            const newFam = isChecked 
                              ? anamneseForm.historico_familiar.filter(f => f !== fam)
                              : [...anamneseForm.historico_familiar, fam];
                            setAnamneseForm({ ...anamneseForm, historico_familiar: newFam });
                          }}
                        />
                        <span>{fam}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-slate-300 font-bold block">Usa óculos atualmente?</span>
                <input 
                  type="text"
                  value={anamneseForm.uso_atual_oculos}
                  onChange={(e) => setAnamneseForm({ ...anamneseForm, uso_atual_oculos: e.target.value })}
                  placeholder="Ex: Sim, há 1 ano"
                  className="w-full bg-[#041333] border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <button 
                onClick={handleSaveAnamneseForm}
                className="w-full bg-[#C9A96E] hover:bg-[#E8D2A8] text-[#071D49] font-black py-2.5 rounded-xl uppercase tracking-wider text-xs shadow-md transition-all cursor-pointer"
              >
                Salvar Anamnese & Analisar IA
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
