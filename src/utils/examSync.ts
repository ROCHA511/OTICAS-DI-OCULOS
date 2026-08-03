import { supabase } from './supabaseClient';
import { ExamRecord } from '../types';
import { ensureUUID } from './supabaseSync';

export const loadExamsFromSupabase = async (fallbackData: ExamRecord[]): Promise<ExamRecord[]> => {
  if (!supabase) {
    try {
      const res = await fetch('/api/exames/fila');
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (e) {
      console.warn('[Exam Sync] Falha ao carregar do backend local, usando fallback local de memória:', e);
    }
    return fallbackData;
  }
  
  try {
    const { data, error } = await supabase
      .from('sala_exames_prontuarios')
      .select('*')
      .order('criado_em', { ascending: false });
      
    if (error) throw error;
    if (!data || data.length === 0) return [];
    
    return data.map((d: any) => ({
      id: d.id,
      paciente_id: d.paciente_id,
      paciente_nome: d.paciente_nome,
      paciente_telefone: d.paciente_telefone,
      paciente_cpf: d.paciente_cpf,
      optometrista_nome: d.optometrista_nome,
      cbo_numero: d.cbo_numero,
      data_exame: d.data_exame,
      is_pinned: d.is_pinned,
      status: d.status,
      prioridade: d.prioridade,
      od_esferico: Number(d.od_esferico || 0),
      od_cilindrico: Number(d.od_cilindrico || 0),
      od_eixo: Number(d.od_eixo || 0),
      oe_esferico: Number(d.oe_esferico || 0),
      oe_cilindrico: Number(d.oe_cilindrico || 0),
      oe_eixo: Number(d.oe_eixo || 0),
      adicao: Number(d.adicao || 0),
      dnp_od: Number(d.dnp_od || 31.5),
      dnp_oe: Number(d.dnp_oe || 31.5),
      altura_od: Number(d.altura_od || 20.0),
      altura_oe: Number(d.altura_oe || 20.0),
      av_longe_od: d.av_longe_od || '20/20',
      av_longe_oe: d.av_longe_oe || '20/20',
      av_perto_od: d.av_perto_od || 'J1',
      av_perto_oe: d.av_perto_oe || 'J1',
      diagnostico_optometrico: d.diagnostico_optometrico,
      recomendacao_lentes: d.recomendacao_lentes,
      observacoes_clinicas: d.observacoes_clinicas,
      anamnese_json: d.anamnese_json,
      enviado_para_otica: d.enviado_para_otica,
      anexos: d.anexos || []
    }));
  } catch (err) {
    console.warn('[Exam Sync] Erro ao carregar do Supabase. Buscando do backend Express:', err);
    try {
      const res = await fetch('/api/exames/fila');
      if (res.ok) return await res.json();
    } catch {}
    return fallbackData;
  }
};

export const saveExamToSupabase = async (exam: ExamRecord): Promise<ExamRecord> => {
  if (!supabase) {
    try {
      const res = await fetch(`/api/exames/${exam.id}/concluir`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          od: { esferico: exam.od_esferico, cilindrico: exam.od_cilindrico, eixo: exam.od_eixo },
          oe: { esferico: exam.oe_esferico, cilindrico: exam.oe_cilindrico, eixo: exam.oe_eixo },
          adicao: exam.adicao,
          dnp_od: exam.dnp_od,
          dnp_oe: exam.dnp_oe,
          altura_od: exam.altura_od,
          altura_oe: exam.altura_oe,
          av_longe_od: exam.av_longe_od,
          av_longe_oe: exam.av_longe_oe,
          av_perto_od: exam.av_perto_od,
          av_perto_oe: exam.av_perto_oe,
          diagnostico_optometrico: exam.diagnostico_optometrico || '',
          recomendacao_lentes: exam.recomendacao_lentes || '',
          observacoes_clinicas: exam.observacoes_clinicas || ''
        })
      });
      if (res.ok) return exam;
    } catch (e) {
      console.warn('[Exam Sync] Falha ao salvar no backend local Express:', e);
    }
    return exam;
  }

  try {
    const uuid = ensureUUID(exam.id);
    const pacUUID = exam.paciente_id ? ensureUUID(exam.paciente_id) : null;
    
    const { data: { user } } = await supabase.auth.getUser();
    let tenantId = '00000000-0000-0000-0000-000000000000';
    
    if (user) {
      const { data: profile } = await supabase.from('perfis').select('tenant_id').eq('id', user.id).single();
      if (profile?.tenant_id) {
        tenantId = profile.tenant_id;
      }
    }

    const dbPayload = {
      id: uuid,
      tenant_id: tenantId,
      paciente_id: pacUUID,
      paciente_nome: exam.paciente_nome,
      paciente_telefone: exam.paciente_telefone,
      paciente_cpf: exam.paciente_cpf || null,
      optometrista_nome: exam.optometrista_nome,
      cbo_numero: exam.cbo_numero,
      data_exame: exam.data_exame,
      is_pinned: exam.is_pinned,
      status: exam.status,
      prioridade: exam.prioridade,
      od_esferico: exam.od_esferico,
      od_cilindrico: exam.od_cilindrico,
      od_eixo: exam.od_eixo,
      oe_esferico: exam.oe_esferico,
      oe_cilindrico: exam.oe_cilindrico,
      oe_eixo: exam.oe_eixo,
      adicao: exam.adicao,
      dnp_od: exam.dnp_od,
      dnp_oe: exam.dnp_oe,
      altura_od: exam.altura_od,
      altura_oe: exam.altura_oe,
      av_longe_od: exam.av_longe_od,
      av_longe_oe: exam.av_longe_oe,
      av_perto_od: exam.av_perto_od,
      av_perto_oe: exam.av_perto_oe,
      diagnostico_optometrico: exam.diagnostico_optometrico || null,
      recomendacao_lentes: exam.recomendacao_lentes || null,
      observacoes_clinicas: exam.observacoes_clinicas || null,
      anamnese_json: exam.anamnese_json || null,
      enviado_para_otica: exam.enviado_para_otica,
      anexos: exam.anexos || []
    };

    const { error } = await supabase.from('sala_exames_prontuarios').upsert(dbPayload);
    if (error) throw error;
    return exam;
  } catch (err) {
    console.error('[Exam Sync] Erro ao salvar prontuário no Supabase:', err);
    throw err;
  }
};
