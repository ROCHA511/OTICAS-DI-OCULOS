-- ============================================================================
-- SCRIPT DE MIGRAÇÃO - SALA DE EXAMES (Fase 3)
-- ÓTICA INTELIGENTE v2.0
-- ============================================================================

BEGIN;

-- 1. Criação da Tabela de Prontuários e Fila de Exames
CREATE TABLE IF NOT EXISTS public.sala_exames_prontuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    paciente_id UUID REFERENCES public.perfis(id) ON DELETE SET NULL,
    paciente_nome VARCHAR(255) NOT NULL,
    paciente_telefone VARCHAR(50) NOT NULL,
    paciente_cpf VARCHAR(20),
    optometrista_id UUID REFERENCES public.perfis(id) ON DELETE SET NULL,
    optometrista_nome VARCHAR(255) DEFAULT 'Dr. Lauro Rocha',
    cbo_numero VARCHAR(50) DEFAULT 'CBO 14852-BA',
    data_exame DATE NOT NULL DEFAULT CURRENT_DATE,
    is_pinned BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'aguardando_anamnese' NOT NULL, -- 'aguardando_anamnese', 'anamnese_concluida', 'concluido', 'reagendado', 'cancelado'
    prioridade VARCHAR(20) DEFAULT 'Normal' NOT NULL, -- 'Normal', 'Urgente'
    
    -- Refração Olho Direito (OD)
    od_esferico NUMERIC(5,2) DEFAULT 0.0 NOT NULL,
    od_cilindrico NUMERIC(5,2) DEFAULT 0.0 NOT NULL,
    od_eixo INTEGER DEFAULT 0 NOT NULL,
    
    -- Refração Olho Esquerdo (OE)
    oe_esferico NUMERIC(5,2) DEFAULT 0.0 NOT NULL,
    oe_cilindrico NUMERIC(5,2) DEFAULT 0.0 NOT NULL,
    oe_eixo INTEGER DEFAULT 0 NOT NULL,

    -- Adição e Medidas Óticas
    adicao NUMERIC(5,2) DEFAULT 0.0 NOT NULL,
    dnp_od NUMERIC(4,2) DEFAULT 31.5 NOT NULL,
    dnp_oe NUMERIC(4,2) DEFAULT 31.5 NOT NULL,
    altura_od NUMERIC(4,2) DEFAULT 20.0 NOT NULL,
    altura_oe NUMERIC(4,2) DEFAULT 20.0 NOT NULL,

    -- Acuidade Visual
    av_longe_od VARCHAR(50) DEFAULT '20/20' NOT NULL,
    av_longe_oe VARCHAR(50) DEFAULT '20/20' NOT NULL,
    av_perto_od VARCHAR(50) DEFAULT 'J1' NOT NULL,
    av_perto_oe VARCHAR(50) DEFAULT 'J1' NOT NULL,

    -- Diagnóstico e Recomendações
    diagnostico_optometrico TEXT,
    recomendacao_lentes TEXT,
    observacoes_clinicas TEXT,

    -- Anamnese IA (JSON)
    anamnese_json JSONB,
    enviado_para_otica BOOLEAN DEFAULT FALSE NOT NULL,
    
    -- Anexos de documentos (armazenados como JSONB para simplificar o array no Supabase)
    anexos JSONB DEFAULT '[]'::jsonb,
    
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Índices de Otimização
CREATE INDEX IF NOT EXISTS idx_sala_exames_tenant ON public.sala_exames_prontuarios(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sala_exames_paciente ON public.sala_exames_prontuarios(paciente_id);
CREATE INDEX IF NOT EXISTS idx_sala_exames_status ON public.sala_exames_prontuarios(status);

-- 3. Habilitar RLS na Tabela
ALTER TABLE public.sala_exames_prontuarios ENABLE ROW LEVEL SECURITY;

-- 4. Criação da Política RLS baseada no tenant logado
DROP POLICY IF EXISTS "RLS Tenant: Sala de Exames Prontuários" ON public.sala_exames_prontuarios;
CREATE POLICY "RLS Tenant: Sala de Exames Prontuários" ON public.sala_exames_prontuarios
    FOR ALL TO authenticated USING (tenant_id = public.jwt_tenant_id()) WITH CHECK (tenant_id = public.jwt_tenant_id());

COMMIT;
