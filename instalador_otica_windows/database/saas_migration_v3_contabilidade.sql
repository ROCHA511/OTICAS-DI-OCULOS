-- ============================================================================
-- MIGRATION: FASE 3 - MÓDULO CONTÁBIL AUTOMÁTICO
-- SISTEMA: ÓTICA INTELIGENTE 2.0 (ENTERPRISE)
-- ============================================================================

-- 1. TABELA DE CONFIGURAÇÃO CONTÁBIL POR TENANT (INQUILINO)
CREATE TABLE IF NOT EXISTS public.contabilidade_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE UNIQUE,
    nome_contabilidade VARCHAR(150) NOT NULL,
    nome_contador VARCHAR(100) NOT NULL,
    whatsapp_contabilidade VARCHAR(20) NOT NULL,
    email_contabilidade VARCHAR(150) NOT NULL,
    nome_ceo VARCHAR(100) NOT NULL,
    whatsapp_ceo VARCHAR(20) NOT NULL,
    email_ceo VARCHAR(150) NOT NULL,
    dia_fechamento INTEGER DEFAULT 1 NOT NULL CHECK (dia_fechamento BETWEEN 1 AND 28),
    horario_envio TIME DEFAULT '08:00:00' NOT NULL,
    fuso_horario VARCHAR(50) DEFAULT 'America/Sao_Paulo' NOT NULL,
    envio_automatico BOOLEAN DEFAULT TRUE NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS para contabilidade_config
ALTER TABLE public.contabilidade_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "CEO/Admin access in contabilidade_config" ON public.contabilidade_config;
CREATE POLICY "CEO/Admin access in contabilidade_config" 
ON public.contabilidade_config
FOR ALL
TO authenticated
USING (public.jwt_tenant_id() = tenant_id)
WITH CHECK (public.jwt_tenant_id() = tenant_id);


-- 2. TABELA DE HISTÓRICO E PROTOCOLO DE RELATÓRIOS ENVIADOS
CREATE TABLE IF NOT EXISTS public.contabilidade_relatorios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    mes_referencia VARCHAR(7) NOT NULL, -- Formato: 'YYYY-MM'
    data_geracao TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    quantidade_vendas INTEGER DEFAULT 0 NOT NULL,
    valor_bruto NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    valor_liquido NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    valor_pix NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    valor_cartao NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    valor_dinheiro NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    status VARCHAR(50) DEFAULT 'pendente' NOT NULL, -- 'sucesso', 'falhou', 'processando'
    destinatarios JSONB NOT NULL,
    pdf_path_ceo TEXT,
    pdf_path_contabilidade TEXT,
    protocolo VARCHAR(100) UNIQUE,
    log_erro TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS para contabilidade_relatorios
ALTER TABLE public.contabilidade_relatorios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "CEO/Admin access in contabilidade_relatorios" ON public.contabilidade_relatorios;
CREATE POLICY "CEO/Admin access in contabilidade_relatorios" 
ON public.contabilidade_relatorios
FOR ALL
TO authenticated
USING (public.jwt_tenant_id() = tenant_id)
WITH CHECK (public.jwt_tenant_id() = tenant_id);
