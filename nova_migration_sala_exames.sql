-- ==============================================================================
-- NOVA MIGRATION: SALA DE EXAMES AVANÇADA E PRONTUÁRIO DIGITAL
-- Baseada na modelagem avançada (Python/SQLAlchemy)
-- ==============================================================================

-- 1. ENUMS (Status e Tipos)
-- Como o PostgreSQL não suporta IF NOT EXISTS para TYPE facilmente, vamos usar domínios ou campos textuais com restrições CHECK, ou criar o tipo se não existir com um bloco DO.

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_atendimento') THEN
        CREATE TYPE status_atendimento AS ENUM ('Aguardando', 'Em Atendimento', 'Finalizado', 'Reagendado', 'Cancelado');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'prioridade_atendimento') THEN
        CREATE TYPE prioridade_atendimento AS ENUM ('Normal', 'Urgente');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_documento') THEN
        CREATE TYPE tipo_documento AS ENUM ('Receita Antiga', 'Foto da Receita', 'Foto dos Óculos', 'Foto dos Olhos', 'Retinografia', 'Campo Visual', 'OCT', 'Laudos', 'Outros Documentos');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_receita') THEN
        CREATE TYPE status_receita AS ENUM ('Pendente', 'Processada', 'Concluída');
    END IF;
END$$;

-- NOTA: O modelo do cliente (paciente) já existe na tabela `public.clientes` do Supabase. 
-- Usaremos o `cliente_id` (UUID) para referenciar o paciente.

-- 2. Tabela: ATENDIMENTOS
CREATE TABLE IF NOT EXISTS public.sala_exames_atendimentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    paciente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    horario_agendado TIMESTAMP WITH TIME ZONE,
    status status_atendimento DEFAULT 'Aguardando',
    prioridade prioridade_atendimento DEFAULT 'Normal',
    profissional_responsavel VARCHAR(255),
    observacoes TEXT,
    pre_anamnese_concluida BOOLEAN DEFAULT FALSE,
    receita_antiga_anexada BOOLEAN DEFAULT FALSE,
    quantidade_anexos INTEGER DEFAULT 0,
    indicador_ia BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT now(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Tabela: PRÉ-ANAMNESES (Com IA)
CREATE TABLE IF NOT EXISTS public.sala_exames_pre_anamneses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    paciente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    atendimento_id UUID NOT NULL REFERENCES public.sala_exames_atendimentos(id) ON DELETE CASCADE,
    link_acesso VARCHAR(255) UNIQUE,
    data_preenchimento TIMESTAMP WITH TIME ZONE,
    principal_queixa TEXT,
    tempo_queixa VARCHAR(255),
    dores_cabeca BOOLEAN DEFAULT FALSE,
    visao_embacada BOOLEAN DEFAULT FALSE,
    visao_dupla BOOLEAN DEFAULT FALSE,
    olhos_secos BOOLEAN DEFAULT FALSE,
    sensibilidade_luz BOOLEAN DEFAULT FALSE,
    ardencia_ocular BOOLEAN DEFAULT FALSE,
    coceira_ocular BOOLEAN DEFAULT FALSE,
    uso_oculos BOOLEAN DEFAULT FALSE,
    uso_lentes_contato BOOLEAN DEFAULT FALSE,
    receita_anterior BOOLEAN DEFAULT FALSE,
    ultimo_exame DATE,
    cirurgia_ocular_previa BOOLEAN DEFAULT FALSE,
    diabetes BOOLEAN DEFAULT FALSE,
    hipertensao BOOLEAN DEFAULT FALSE,
    glaucoma BOOLEAN DEFAULT FALSE,
    catarata BOOLEAN DEFAULT FALSE,
    uso_medicamentos TEXT,
    profissao VARCHAR(255),
    tempo_computador INTEGER,
    tempo_celular INTEGER,
    historico_familiar TEXT,
    outras_doencas TEXT,
    resumo_ia TEXT,
    pontos_atencao_ia TEXT
);

-- 4. Tabela: DOCUMENTOS ANEXADOS
CREATE TABLE IF NOT EXISTS public.sala_exames_documentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    paciente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    atendimento_id UUID REFERENCES public.sala_exames_atendimentos(id) ON DELETE SET NULL,
    tipo_documento tipo_documento,
    nome_arquivo VARCHAR(500),
    url_arquivo TEXT,
    data_upload TIMESTAMP WITH TIME ZONE DEFAULT now(),
    conteudo_ocr TEXT,
    dados_ocr_json JSONB
);

-- 5. Tabela: PRONTUÁRIOS (Nova versão super detalhada)
CREATE TABLE IF NOT EXISTS public.sala_exames_prontuarios_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    paciente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    atendimento_id UUID NOT NULL REFERENCES public.sala_exames_atendimentos(id) ON DELETE CASCADE,
    data_consulta TIMESTAMP WITH TIME ZONE DEFAULT now(),
    profissional_responsavel VARCHAR(255),

    -- Anamnese e Histórico
    queixa_principal TEXT,
    historia_atual TEXT,
    historico_ocular TEXT,
    historico_sistemico TEXT,

    -- Acuidade Visual (SC = Sem Correção / CC = Com Correção)
    acuidade_visual_od_sc VARCHAR(50),
    acuidade_visual_oe_sc VARCHAR(50),
    acuidade_visual_od_cc VARCHAR(50),
    acuidade_visual_oe_cc VARCHAR(50),

    -- Refração Objetiva
    ref_obj_od_esferico NUMERIC(5,2),
    ref_obj_od_cilindro NUMERIC(5,2),
    ref_obj_od_eixo INTEGER,
    ref_obj_oe_esferico NUMERIC(5,2),
    ref_obj_oe_cilindro NUMERIC(5,2),
    ref_obj_oe_eixo INTEGER,

    -- Refração Subjetiva
    ref_sub_od_esferico NUMERIC(5,2),
    ref_sub_od_cilindro NUMERIC(5,2),
    ref_sub_od_eixo INTEGER,
    ref_sub_od_adicao NUMERIC(5,2),
    ref_sub_od_prisma VARCHAR(50),
    ref_sub_oe_esferico NUMERIC(5,2),
    ref_sub_oe_cilindro NUMERIC(5,2),
    ref_sub_oe_eixo INTEGER,
    ref_sub_oe_adicao NUMERIC(5,2),
    ref_sub_oe_prisma VARCHAR(50),

    -- Medidas
    dp NUMERIC(5,2),
    dnp_od NUMERIC(5,2),
    dnp_oe NUMERIC(5,2),
    altura NUMERIC(5,2),
    centro_optico VARCHAR(100),
    curva_base VARCHAR(100),
    aro VARCHAR(100),
    ponte VARCHAR(100),
    haste VARCHAR(100),

    -- Exames Complementares
    visao_cores VARCHAR(255),
    estereopsia VARCHAR(255),
    motilidade VARCHAR(255),
    cover_test VARCHAR(255),
    ppc NUMERIC(5,2),
    amsler VARCHAR(255),
    tonometria_od NUMERIC(5,2),
    tonometria_oe NUMERIC(5,2),
    biomicroscopia TEXT,
    fundoscopia TEXT,

    -- Diagnóstico e Conduta
    diagnostico TEXT,
    conduta TEXT,
    tratamento TEXT,
    recomendacoes TEXT,
    data_retorno DATE,
    observacoes_prontuario TEXT
);

-- 6. Tabela: RECEITAS DIGITAIS
CREATE TABLE IF NOT EXISTS public.sala_exames_receitas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    paciente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    prontuario_id UUID NOT NULL REFERENCES public.sala_exames_prontuarios_v2(id) ON DELETE CASCADE,
    profissional_id UUID,
    data_emissao TIMESTAMP WITH TIME ZONE DEFAULT now(),
    data_validade DATE,
    numero_unico VARCHAR(100) UNIQUE,
    hash_criptografico VARCHAR(255) UNIQUE,
    url_pdf TEXT,
    url_qr_code TEXT,
    status status_receita DEFAULT 'Pendente',

    -- Dados Prescrição Óptica
    od_esferico NUMERIC(5,2),
    od_cilindro NUMERIC(5,2),
    od_eixo INTEGER,
    od_adicao NUMERIC(5,2),
    od_dnp NUMERIC(5,2),
    oe_esferico NUMERIC(5,2),
    oe_cilindro NUMERIC(5,2),
    oe_eixo INTEGER,
    oe_adicao NUMERIC(5,2),
    oe_dnp NUMERIC(5,2),
    dp_receita NUMERIC(5,2),
    adicao_receita NUMERIC(5,2),
    observacoes_receita TEXT
);

-- Habilitar RLS (Row Level Security) em todas as tabelas
ALTER TABLE public.sala_exames_atendimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sala_exames_pre_anamneses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sala_exames_documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sala_exames_prontuarios_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sala_exames_receitas ENABLE ROW LEVEL SECURITY;

-- Políticas de Acesso Total (Para uso inicial seguro pelo Tenant)
DROP POLICY IF EXISTS "acesso_total_atendimentos" ON public.sala_exames_atendimentos;
CREATE POLICY "acesso_total_atendimentos" ON public.sala_exames_atendimentos FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "acesso_total_pre_anamneses" ON public.sala_exames_pre_anamneses;
CREATE POLICY "acesso_total_pre_anamneses" ON public.sala_exames_pre_anamneses FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "acesso_total_documentos" ON public.sala_exames_documentos;
CREATE POLICY "acesso_total_documentos" ON public.sala_exames_documentos FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "acesso_total_prontuarios_v2" ON public.sala_exames_prontuarios_v2;
CREATE POLICY "acesso_total_prontuarios_v2" ON public.sala_exames_prontuarios_v2 FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "acesso_total_receitas" ON public.sala_exames_receitas;
CREATE POLICY "acesso_total_receitas" ON public.sala_exames_receitas FOR ALL USING (true) WITH CHECK (true);

-- Índices de performance
CREATE INDEX IF NOT EXISTS idx_sala_exames_aten_tenant ON public.sala_exames_atendimentos(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sala_exames_aten_paciente ON public.sala_exames_atendimentos(paciente_id);
CREATE INDEX IF NOT EXISTS idx_sala_exames_aten_status ON public.sala_exames_atendimentos(status);

CREATE INDEX IF NOT EXISTS idx_sala_exames_pre_tenant ON public.sala_exames_pre_anamneses(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sala_exames_pre_paciente ON public.sala_exames_pre_anamneses(paciente_id);
CREATE INDEX IF NOT EXISTS idx_sala_exames_pre_link ON public.sala_exames_pre_anamneses(link_acesso);

CREATE INDEX IF NOT EXISTS idx_sala_exames_doc_tenant ON public.sala_exames_documentos(tenant_id);

CREATE INDEX IF NOT EXISTS idx_sala_exames_pro_tenant ON public.sala_exames_prontuarios_v2(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sala_exames_pro_paciente ON public.sala_exames_prontuarios_v2(paciente_id);

CREATE INDEX IF NOT EXISTS idx_sala_exames_rec_tenant ON public.sala_exames_receitas(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sala_exames_rec_hash ON public.sala_exames_receitas(hash_criptografico);
