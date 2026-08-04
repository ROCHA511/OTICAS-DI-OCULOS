-- ============================================================
-- MIGRACAO COMPLETA - OTICA INTELIGENTE 2.0
-- Execute este SQL no Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ulrrtzbxcsywmtshdnbp/sql/new
-- ============================================================

-- 1. Tabela de tenants (caso nao exista)
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_fantasia VARCHAR(255) NOT NULL DEFAULT 'Oticas Di Oculos',
    razao_social VARCHAR(255),
    cnpj VARCHAR(20) UNIQUE,
    plano VARCHAR(20) NOT NULL DEFAULT 'trial',
    status VARCHAR(30) NOT NULL DEFAULT 'ativo',
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);
INSERT INTO public.tenants (id, nome_fantasia, cnpj, plano, status)
VALUES ('00000000-0000-0000-0000-000000000001', 'Oticas Di Oculos', '00.000.000/0001-01', 'promax', 'ativo')
ON CONFLICT (id) DO NOTHING;

-- 2. Tabela de assinaturas SaaS (substitui subscriptions.json)
CREATE TABLE IF NOT EXISTS public.assinaturas (
    tenant_id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001'::uuid,
    plano VARCHAR(20) NOT NULL DEFAULT 'trial',
    status VARCHAR(30) NOT NULL DEFAULT 'trialing',
    trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '30 days'),
    customer_email VARCHAR(255),
    mp_subscription_id VARCHAR(255),
    mp_preapproval_plan_id VARCHAR(255),
    mp_payer_id VARCHAR(255),
    mp_status VARCHAR(100),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER TABLE public.assinaturas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "acesso_total_assinaturas" ON public.assinaturas;
CREATE POLICY "acesso_total_assinaturas" ON public.assinaturas FOR ALL USING (true) WITH CHECK (true);
INSERT INTO public.assinaturas (tenant_id, plano, status, customer_email)
VALUES ('00000000-0000-0000-0000-000000000001', 'promax', 'active', 'dioennerocha@hotmail.com')
ON CONFLICT (tenant_id) DO NOTHING;

-- 3. Sala de Exames Prontuarios (substitui exams.json)
CREATE TABLE IF NOT EXISTS public.sala_exames_prontuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid,
    paciente_id UUID,
    paciente_nome VARCHAR(255) NOT NULL,
    paciente_telefone VARCHAR(50) NOT NULL DEFAULT '',
    paciente_cpf VARCHAR(20),
    optometrista_nome VARCHAR(255) DEFAULT 'Dr. Lauro Rocha',
    cbo_numero VARCHAR(50) DEFAULT 'CBO 14852-BA',
    data_exame DATE NOT NULL DEFAULT CURRENT_DATE,
    is_pinned BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'aguardando_anamnese' NOT NULL,
    prioridade VARCHAR(20) DEFAULT 'Normal' NOT NULL,
    od_esferico NUMERIC(5,2) DEFAULT 0.0 NOT NULL,
    od_cilindrico NUMERIC(5,2) DEFAULT 0.0 NOT NULL,
    od_eixo INTEGER DEFAULT 0 NOT NULL,
    oe_esferico NUMERIC(5,2) DEFAULT 0.0 NOT NULL,
    oe_cilindrico NUMERIC(5,2) DEFAULT 0.0 NOT NULL,
    oe_eixo INTEGER DEFAULT 0 NOT NULL,
    adicao NUMERIC(5,2) DEFAULT 0.0 NOT NULL,
    dnp_od NUMERIC(4,2) DEFAULT 31.5 NOT NULL,
    dnp_oe NUMERIC(4,2) DEFAULT 31.5 NOT NULL,
    altura_od NUMERIC(4,2) DEFAULT 20.0 NOT NULL,
    altura_oe NUMERIC(4,2) DEFAULT 20.0 NOT NULL,
    av_longe_od VARCHAR(50) DEFAULT '20/20' NOT NULL,
    av_longe_oe VARCHAR(50) DEFAULT '20/20' NOT NULL,
    av_perto_od VARCHAR(50) DEFAULT 'J1' NOT NULL,
    av_perto_oe VARCHAR(50) DEFAULT 'J1' NOT NULL,
    diagnostico_optometrico TEXT,
    recomendacao_lentes TEXT,
    observacoes_clinicas TEXT,
    anamnese_json JSONB,
    enviado_para_otica BOOLEAN DEFAULT FALSE NOT NULL,
    anexos JSONB DEFAULT '[]'::jsonb,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sala_exames_status ON public.sala_exames_prontuarios(status);
CREATE INDEX IF NOT EXISTS idx_sala_exames_data ON public.sala_exames_prontuarios(data_exame DESC);
ALTER TABLE public.sala_exames_prontuarios ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "acesso_total_sala_exames" ON public.sala_exames_prontuarios;
CREATE POLICY "acesso_total_sala_exames" ON public.sala_exames_prontuarios FOR ALL USING (true) WITH CHECK (true);

-- 4. Clinica Pacientes (substitui SQLite sala_de_exames.db - tabela pacientes)
CREATE TABLE IF NOT EXISTS public.clinica_pacientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(20) UNIQUE NOT NULL,
    data_nascimento TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    genero VARCHAR(50) DEFAULT 'Nao especificado',
    telefone VARCHAR(50),
    email VARCHAR(255) UNIQUE,
    endereco TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER TABLE public.clinica_pacientes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "acesso_clinica_pacientes" ON public.clinica_pacientes;
CREATE POLICY "acesso_clinica_pacientes" ON public.clinica_pacientes FOR ALL USING (true) WITH CHECK (true);

-- 5. Clinica Atendimentos (substitui SQLite - tabela atendimentos)
CREATE TABLE IF NOT EXISTS public.clinica_atendimentos (
    id SERIAL PRIMARY KEY,
    paciente_id INTEGER NOT NULL REFERENCES public.clinica_pacientes(id) ON DELETE CASCADE,
    horario_agendado TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    status VARCHAR(50) NOT NULL DEFAULT 'Aguardando',
    prioridade VARCHAR(20) NOT NULL DEFAULT 'Normal',
    profissional_responsavel VARCHAR(255) DEFAULT 'Dr. Lauro Rocha',
    observacoes TEXT DEFAULT '',
    pre_anamnese_concluida BOOLEAN DEFAULT FALSE,
    indicador_ia BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT now(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER TABLE public.clinica_atendimentos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "acesso_clinica_atendimentos" ON public.clinica_atendimentos;
CREATE POLICY "acesso_clinica_atendimentos" ON public.clinica_atendimentos FOR ALL USING (true) WITH CHECK (true);

-- 6. Clinica Pre-Anamneses (substitui SQLite - tabela pre_anamneses)
CREATE TABLE IF NOT EXISTS public.clinica_pre_anamneses (
    id SERIAL PRIMARY KEY,
    paciente_id INTEGER NOT NULL REFERENCES public.clinica_pacientes(id) ON DELETE CASCADE,
    atendimento_id INTEGER NOT NULL REFERENCES public.clinica_atendimentos(id) ON DELETE CASCADE,
    link_acesso TEXT NOT NULL DEFAULT '',
    data_preenchimento TIMESTAMP WITH TIME ZONE DEFAULT now(),
    principal_queixa TEXT DEFAULT '',
    tempo_queixa VARCHAR(100) DEFAULT '',
    visao_embacada BOOLEAN DEFAULT FALSE,
    dores_cabeca BOOLEAN DEFAULT FALSE,
    visao_dupla BOOLEAN DEFAULT FALSE,
    olhos_secos BOOLEAN DEFAULT FALSE,
    sensibilidade_luz BOOLEAN DEFAULT FALSE,
    ardencia_ocular BOOLEAN DEFAULT FALSE,
    coceira_ocular BOOLEAN DEFAULT FALSE,
    uso_oculos BOOLEAN DEFAULT FALSE,
    diabetes BOOLEAN DEFAULT FALSE,
    hipertensao BOOLEAN DEFAULT FALSE,
    glaucoma BOOLEAN DEFAULT FALSE,
    catarata BOOLEAN DEFAULT FALSE,
    resumo_ia TEXT DEFAULT '',
    pontos_atencao_ia TEXT DEFAULT '',
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER TABLE public.clinica_pre_anamneses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "acesso_clinica_pre_anamneses" ON public.clinica_pre_anamneses;
CREATE POLICY "acesso_clinica_pre_anamneses" ON public.clinica_pre_anamneses FOR ALL USING (true) WITH CHECK (true);

-- 7. Clinica Prontuarios (substitui SQLite - tabela prontuarios)
CREATE TABLE IF NOT EXISTS public.clinica_prontuarios (
    id SERIAL PRIMARY KEY,
    paciente_id INTEGER NOT NULL REFERENCES public.clinica_pacientes(id) ON DELETE CASCADE,
    atendimento_id INTEGER NOT NULL REFERENCES public.clinica_atendimentos(id) ON DELETE CASCADE,
    data_consulta TIMESTAMP WITH TIME ZONE DEFAULT now(),
    profissional_responsavel VARCHAR(255) DEFAULT 'Dr. Lauro Rocha',
    queixa_principal TEXT DEFAULT '',
    historia_atual TEXT DEFAULT '',
    acuidade_visual_od_sc VARCHAR(50) DEFAULT '20/20',
    acuidade_visual_oe_sc VARCHAR(50) DEFAULT '20/20',
    acuidade_visual_od_cc VARCHAR(50) DEFAULT 'J1',
    acuidade_visual_oe_cc VARCHAR(50) DEFAULT 'J1',
    ref_sub_od_esferico NUMERIC(5,2) DEFAULT 0.0,
    ref_sub_od_cilindro NUMERIC(5,2) DEFAULT 0.0,
    ref_sub_od_eixo INTEGER DEFAULT 0,
    ref_sub_od_adicao NUMERIC(5,2) DEFAULT 0.0,
    ref_sub_oe_esferico NUMERIC(5,2) DEFAULT 0.0,
    ref_sub_oe_cilindro NUMERIC(5,2) DEFAULT 0.0,
    ref_sub_oe_eixo INTEGER DEFAULT 0,
    ref_sub_oe_adicao NUMERIC(5,2) DEFAULT 0.0,
    dnp_od NUMERIC(4,2) DEFAULT 31.5,
    dnp_oe NUMERIC(4,2) DEFAULT 31.5,
    altura NUMERIC(4,2) DEFAULT 20.0,
    dp NUMERIC(5,2) DEFAULT 63.0,
    diagnostico TEXT DEFAULT '',
    conduta TEXT DEFAULT '',
    recomendacoes TEXT DEFAULT '',
    observacoes_prontuario TEXT DEFAULT '',
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER TABLE public.clinica_prontuarios ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "acesso_clinica_prontuarios" ON public.clinica_prontuarios;
CREATE POLICY "acesso_clinica_prontuarios" ON public.clinica_prontuarios FOR ALL USING (true) WITH CHECK (true);

-- 8. Clinica Receitas Digitais (substitui SQLite - tabela receitas)
CREATE TABLE IF NOT EXISTS public.clinica_receitas_digitais (
    id SERIAL PRIMARY KEY,
    paciente_id INTEGER NOT NULL REFERENCES public.clinica_pacientes(id) ON DELETE CASCADE,
    prontuario_id INTEGER NOT NULL REFERENCES public.clinica_prontuarios(id) ON DELETE CASCADE,
    profissional_id INTEGER NOT NULL DEFAULT 1,
    data_emissao TIMESTAMP WITH TIME ZONE DEFAULT now(),
    data_validade TIMESTAMP WITH TIME ZONE,
    numero_unico VARCHAR(100) UNIQUE NOT NULL,
    hash_criptografico TEXT DEFAULT '',
    url_pdf TEXT DEFAULT '',
    url_qr_code TEXT DEFAULT '',
    status VARCHAR(50) DEFAULT 'Pendente',
    od_esferico NUMERIC(5,2) DEFAULT 0.0,
    od_cilindro NUMERIC(5,2) DEFAULT 0.0,
    od_eixo INTEGER DEFAULT 0,
    od_adicao NUMERIC(5,2) DEFAULT 0.0,
    od_dnp NUMERIC(4,2) DEFAULT 31.5,
    oe_esferico NUMERIC(5,2) DEFAULT 0.0,
    oe_cilindro NUMERIC(5,2) DEFAULT 0.0,
    oe_eixo INTEGER DEFAULT 0,
    oe_adicao NUMERIC(5,2) DEFAULT 0.0,
    oe_dnp NUMERIC(4,2) DEFAULT 31.5,
    dp_receita NUMERIC(5,2) DEFAULT 63.0,
    adicao_receita NUMERIC(5,2) DEFAULT 0.0,
    observacoes_receita TEXT DEFAULT '',
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER TABLE public.clinica_receitas_digitais ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "acesso_clinica_receitas" ON public.clinica_receitas_digitais;
CREATE POLICY "acesso_clinica_receitas" ON public.clinica_receitas_digitais FOR ALL USING (true) WITH CHECK (true);

-- 9. Clinica Documentos (substitui SQLite - tabela documentos_paciente)
CREATE TABLE IF NOT EXISTS public.clinica_documentos (
    id SERIAL PRIMARY KEY,
    paciente_id INTEGER NOT NULL REFERENCES public.clinica_pacientes(id) ON DELETE CASCADE,
    atendimento_id INTEGER REFERENCES public.clinica_atendimentos(id) ON DELETE SET NULL,
    tipo_documento VARCHAR(50) NOT NULL DEFAULT 'outro',
    nome_arquivo VARCHAR(255) NOT NULL,
    url_arquivo TEXT NOT NULL,
    descricao TEXT DEFAULT '',
    data_upload TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER TABLE public.clinica_documentos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "acesso_clinica_documentos" ON public.clinica_documentos;
CREATE POLICY "acesso_clinica_documentos" ON public.clinica_documentos FOR ALL USING (true) WITH CHECK (true);

-- Indices de otimizacao
CREATE INDEX IF NOT EXISTS idx_clinica_atend_status ON public.clinica_atendimentos(status);
CREATE INDEX IF NOT EXISTS idx_clinica_atend_paciente ON public.clinica_atendimentos(paciente_id);
CREATE INDEX IF NOT EXISTS idx_clinica_pront_atend ON public.clinica_prontuarios(atendimento_id);
CREATE INDEX IF NOT EXISTS idx_clinica_receita_pront ON public.clinica_receitas_digitais(prontuario_id);
CREATE INDEX IF NOT EXISTS idx_clinica_pre_atend ON public.clinica_pre_anamneses(atendimento_id);

-- Confirmar criacao
SELECT table_name, 'CRIADA' as status 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'assinaturas', 'sala_exames_prontuarios',
    'clinica_pacientes', 'clinica_atendimentos', 
    'clinica_pre_anamneses', 'clinica_prontuarios',
    'clinica_receitas_digitais', 'clinica_documentos'
  )
ORDER BY table_name;
