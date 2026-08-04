import { supabase } from './supabaseClient';
import { ExamRecord } from '../types';
import { examSystemApi, Atendimento, ProntuarioV2 } from './examSystemApi';
import { ensureUUID } from './supabaseSync';

const MOCK_TENANT_ID = '00000000-0000-0000-0000-000000000001';

export const loadExamsFromSupabase = async (fallbackData: ExamRecord[]): Promise<ExamRecord[]> => {
  if (!supabase) return fallbackData;
  
  try {
    // 1. Carrega os Atendimentos e seus Prontuários (Novo Schema)
    const atendimentos = await examSystemApi.getAtendimentos(MOCK_TENANT_ID);
    if (!atendimentos || atendimentos.length === 0) return fallbackData; // ou []

    // Busca os prontuários de forma paralela (ou usa uma view no futuro)
    const prontuariosPromises = atendimentos.map(a => examSystemApi.getProntuario(a.id!).catch(() => null));
    const prontuariosData = await Promise.all(prontuariosPromises);

    // Mapeamento Bidirecional (Nova API -> Interface ExamRecord Legada do UI)
    return atendimentos.map((aten: any, index) => {
      const p = prontuariosData[index] || {};
      const paciente = aten.pacientes || {};
      
      return {
        id: aten.id,
        paciente_id: aten.paciente_id,
        paciente_nome: paciente.nome || 'Paciente Desconhecido',
        paciente_telefone: paciente.telefone || '',
        paciente_cpf: paciente.cpf || '',
        optometrista_nome: aten.profissional_responsavel || 'Dr. Lauro Rocha',
        cbo_numero: 'CBO 14852-BA',
        data_exame: aten.horario_agendado ? aten.horario_agendado.split('T')[0] : (p.data_consulta || new Date().toISOString().split('T')[0]),
        is_pinned: false,
        status: 
          aten.status === 'Aguardando' ? 'aguardando_anamnese' : 
          aten.status === 'Finalizado' ? 'concluido' : 
          aten.status === 'Cancelado' ? 'cancelado' : 
          aten.status === 'Reagendado' ? 'reagendado' : 'anamnese_concluida',
        prioridade: aten.prioridade || 'Normal',
        
        od_esferico: Number(p.ref_sub_od_esferico || 0),
        od_cilindrico: Number(p.ref_sub_od_cilindro || 0),
        od_eixo: Number(p.ref_sub_od_eixo || 0),
        oe_esferico: Number(p.ref_sub_oe_esferico || 0),
        oe_cilindrico: Number(p.ref_sub_oe_cilindro || 0),
        oe_eixo: Number(p.ref_sub_oe_eixo || 0),
        adicao: Number(p.ref_sub_od_adicao || 0),
        dnp_od: Number(p.dnp_od || 31.5),
        dnp_oe: Number(p.dnp_oe || 31.5),
        altura_od: Number(p.altura || 20.0),
        altura_oe: Number(p.altura || 20.0),
        av_longe_od: p.acuidade_visual_od_cc || '20/20',
        av_longe_oe: p.acuidade_visual_oe_cc || '20/20',
        av_perto_od: 'J1',
        av_perto_oe: 'J1',
        diagnostico_optometrico: p.diagnostico || '',
        recomendacao_lentes: p.recomendacoes || '',
        observacoes_clinicas: p.observacoes_prontuario || '',
        anamnese_json: {
          queixa_principal: p.queixa_principal || '',
          tempo_sintomas: p.historia_atual || '',
          sintomas_visuais: [],
          doencas_sistemicas: [],
          historico_familiar: [p.historico_sistemico || ''],
          uso_atual_oculos: 'Não'
        },
        enviado_para_otica: false,
        anexos: []
      } as ExamRecord;
    });
  } catch (error) {
    console.error('[ExamSync] Erro ao carregar exames do Novo Schema:', error);
    return fallbackData;
  }
};

export const saveExamToSupabase = async (exam: ExamRecord): Promise<boolean> => {
  if (!supabase) return false;
  
  try {
    // Reverse Mapping (ExamRecord Legado UI -> Nova API)
    
    // 1. Atualizar ou Criar Prontuário
    const prontuarioV2: ProntuarioV2 = {
      tenant_id: MOCK_TENANT_ID,
      paciente_id: exam.paciente_id,
      atendimento_id: exam.id, // Em nossa transição, o ID do ExamRecord é o ID do Atendimento
      data_consulta: exam.data_exame,
      profissional_responsavel: exam.optometrista_nome,
      
      queixa_principal: exam.anamnese_json?.queixa_principal || '',
      historia_atual: exam.anamnese_json?.tempo_sintomas || '',
      
      ref_sub_od_esferico: exam.od_esferico,
      ref_sub_od_cilindro: exam.od_cilindrico,
      ref_sub_od_eixo: exam.od_eixo,
      ref_sub_od_adicao: exam.adicao,
      
      ref_sub_oe_esferico: exam.oe_esferico,
      ref_sub_oe_cilindro: exam.oe_cilindrico,
      ref_sub_oe_eixo: exam.oe_eixo,
      ref_sub_oe_adicao: exam.adicao,
      
      dnp_od: exam.dnp_od,
      dnp_oe: exam.dnp_oe,
      altura: exam.altura_od,
      
      acuidade_visual_od_cc: exam.av_longe_od,
      acuidade_visual_oe_cc: exam.av_longe_oe,
      
      diagnostico: exam.diagnostico_optometrico || '',
      recomendacoes: exam.recomendacao_lentes || '',
      observacoes_prontuario: exam.observacoes_clinicas || ''
    };
    
    // Verifica se já existe um prontuário para este atendimento
    let prontuarioId = null;
    try {
      const p = await examSystemApi.getProntuario(exam.id);
      if (p) prontuarioId = p.id;
    } catch(e) {}
    
    if (prontuarioId) {
      prontuarioV2.id = prontuarioId;
    }
    
    await examSystemApi.saveProntuario(prontuarioV2);
    
    // 2. Atualiza Status do Atendimento
    let novoStatus: any = 'Em Atendimento';
    if (exam.status === 'concluido') novoStatus = 'Finalizado';
    if (exam.status === 'cancelado') novoStatus = 'Cancelado';
    
    await examSystemApi.updateAtendimentoStatus(exam.id, novoStatus);

    return true;
  } catch (error) {
    console.error('[ExamSync] Erro ao salvar exame no Novo Schema:', error);
    return false;
  }
};
