import { supabase } from './supabaseClient';

// ==========================================
// TYPES (Baseados nos modelos Pydantic/SQL)
// ==========================================

export type StatusAtendimento = 'Aguardando' | 'Em Atendimento' | 'Finalizado' | 'Reagendado' | 'Cancelado';
export type PrioridadeAtendimento = 'Normal' | 'Urgente';
export type TipoDocumento = 'Receita Antiga' | 'Foto da Receita' | 'Foto dos Óculos' | 'Foto dos Olhos' | 'Retinografia' | 'Campo Visual' | 'OCT' | 'Laudos' | 'Outros Documentos';
export type StatusReceita = 'Pendente' | 'Processada' | 'Concluída';

export interface Atendimento {
  id?: string;
  tenant_id: string;
  paciente_id: string;
  horario_agendado?: string;
  status: StatusAtendimento;
  prioridade: PrioridadeAtendimento;
  profissional_responsavel?: string;
  observacoes?: string;
  pre_anamnese_concluida?: boolean;
  receita_antiga_anexada?: boolean;
  quantidade_anexos?: number;
  indicador_ia?: boolean;
  data_criacao?: string;
}

export interface PreAnamnese {
  id?: string;
  tenant_id: string;
  paciente_id: string;
  atendimento_id: string;
  link_acesso?: string;
  data_preenchimento?: string;
  principal_queixa?: string;
  tempo_queixa?: string;
  dores_cabeca?: boolean;
  visao_embacada?: boolean;
  visao_dupla?: boolean;
  olhos_secos?: boolean;
  sensibilidade_luz?: boolean;
  ardencia_ocular?: boolean;
  coceira_ocular?: boolean;
  uso_oculos?: boolean;
  uso_lentes_contato?: boolean;
  receita_anterior?: boolean;
  ultimo_exame?: string; // Date
  cirurgia_ocular_previa?: boolean;
  diabetes?: boolean;
  hipertensao?: boolean;
  glaucoma?: boolean;
  catarata?: boolean;
  uso_medicamentos?: string;
  profissao?: string;
  tempo_computador?: number;
  tempo_celular?: number;
  historico_familiar?: string;
  outras_doencas?: string;
  resumo_ia?: string;
  pontos_atencao_ia?: string;
}

export interface ProntuarioV2 {
  id?: string;
  tenant_id: string;
  paciente_id: string;
  atendimento_id: string;
  data_consulta?: string;
  profissional_responsavel?: string;
  queixa_principal?: string;
  historia_atual?: string;
  historico_ocular?: string;
  historico_sistemico?: string;
  acuidade_visual_od_sc?: string;
  acuidade_visual_oe_sc?: string;
  acuidade_visual_od_cc?: string;
  acuidade_visual_oe_cc?: string;
  ref_obj_od_esferico?: number;
  ref_obj_od_cilindro?: number;
  ref_obj_od_eixo?: number;
  ref_obj_oe_esferico?: number;
  ref_obj_oe_cilindro?: number;
  ref_obj_oe_eixo?: number;
  ref_sub_od_esferico?: number;
  ref_sub_od_cilindro?: number;
  ref_sub_od_eixo?: number;
  ref_sub_od_adicao?: number;
  ref_sub_od_prisma?: string;
  ref_sub_oe_esferico?: number;
  ref_sub_oe_cilindro?: number;
  ref_sub_oe_eixo?: number;
  ref_sub_oe_adicao?: number;
  ref_sub_oe_prisma?: string;
  dp?: number;
  dnp_od?: number;
  dnp_oe?: number;
  altura?: number;
  centro_optico?: string;
  curva_base?: string;
  aro?: string;
  ponte?: string;
  haste?: string;
  visao_cores?: string;
  estereopsia?: string;
  motilidade?: string;
  cover_test?: string;
  ppc?: number;
  amsler?: string;
  tonometria_od?: number;
  tonometria_oe?: number;
  biomicroscopia?: string;
  fundoscopia?: string;
  diagnostico?: string;
  conduta?: string;
  tratamento?: string;
  recomendacoes?: string;
  data_retorno?: string;
  observacoes_prontuario?: string;
}

export interface ReceitaDigital {
  id?: string;
  tenant_id: string;
  paciente_id: string;
  prontuario_id: string;
  profissional_id?: string;
  data_emissao?: string;
  data_validade?: string;
  numero_unico?: string;
  hash_criptografico?: string;
  url_pdf?: string;
  url_qr_code?: string;
  status?: StatusReceita;
  od_esferico?: number;
  od_cilindro?: number;
  od_eixo?: number;
  od_adicao?: number;
  od_dnp?: number;
  oe_esferico?: number;
  oe_cilindro?: number;
  oe_eixo?: number;
  oe_adicao?: number;
  oe_dnp?: number;
  dp_receita?: number;
  adicao_receita?: number;
  observacoes_receita?: string;
}

// ==========================================
// API CRUD (Supabase)
// ==========================================

export const examSystemApi = {
  // ATENDIMENTOS
  async getAtendimentos(tenantId: string) {
    const { data, error } = await supabase
      .from('sala_exames_atendimentos')
      .select('*, pacientes:clientes(nome, telefone, cpf, avatar)')
      .eq('tenant_id', tenantId)
      .order('horario_agendado', { ascending: true });
    if (error) throw error;
    return data;
  },

  async createAtendimento(atendimento: Atendimento) {
    const { data, error } = await supabase
      .from('sala_exames_atendimentos')
      .insert([atendimento])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateAtendimentoStatus(id: string, status: StatusAtendimento) {
    const { data, error } = await supabase
      .from('sala_exames_atendimentos')
      .update({ status, data_atualizacao: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // PRE-ANAMNESE
  async getPreAnamnese(atendimentoId: string) {
    const { data, error } = await supabase
      .from('sala_exames_pre_anamneses')
      .select('*')
      .eq('atendimento_id', atendimentoId)
      .single();
    // It's ok to not have one yet
    if (error && error.code !== 'PGRST116') throw error; 
    return data;
  },

  async createPreAnamnese(preAnamnese: PreAnamnese) {
    const { data, error } = await supabase
      .from('sala_exames_pre_anamneses')
      .insert([preAnamnese])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // PRONTUARIO
  async getProntuario(atendimentoId: string) {
    const { data, error } = await supabase
      .from('sala_exames_prontuarios_v2')
      .select('*')
      .eq('atendimento_id', atendimentoId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async saveProntuario(prontuario: ProntuarioV2) {
    if (prontuario.id) {
      const { data, error } = await supabase
        .from('sala_exames_prontuarios_v2')
        .update(prontuario)
        .eq('id', prontuario.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('sala_exames_prontuarios_v2')
        .insert([prontuario])
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },

  // RECEITAS
  async getReceitas(pacienteId: string) {
    const { data, error } = await supabase
      .from('sala_exames_receitas')
      .select('*')
      .eq('paciente_id', pacienteId)
      .order('data_emissao', { ascending: false });
    if (error) throw error;
    return data;
  },

  async generateReceitaDigital(receita: ReceitaDigital) {
    // Generate unique number and hash locally for now
    const numero_unico = 'REC-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const hash_criptografico = btoa(numero_unico + receita.paciente_id).replace(/=/g, '');
    const url_qr_code = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${hash_criptografico}`;

    const { data, error } = await supabase
      .from('sala_exames_receitas')
      .insert([{
        ...receita,
        numero_unico,
        hash_criptografico,
        url_qr_code,
        status: 'Processada',
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // INTEGRAÇÃO DE IA (GEMINI via Backend Express /server.ts)
  async iaAnalisarAnamnese(preAnamneseId: string, dadosAnamnese: any) {
    try {
      const response = await fetch('/api/exam/analisar-anamnese', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preAnamneseId, dadosAnamnese }),
      });
      if (!response.ok) throw new Error('Falha na IA');
      return await response.json();
    } catch (e) {
      console.error(e);
      return { resumo: "IA Indisponível", pontos: "Nenhum ponto de alerta" };
    }
  },

  async iaSugerirDiagnostico(prontuarioId: string, dadosProntuario: any) {
    try {
      const response = await fetch('/api/exam/sugerir-diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prontuarioId, dadosProntuario }),
      });
      if (!response.ok) throw new Error('Falha na IA');
      return await response.json();
    } catch (e) {
      console.error(e);
      return { diagnostico_sugerido: "", alertas: [] };
    }
  }
};
