-- ============================================================================
-- SCRIPT DE MIGRAÇÃO - BIOMETRIA ÓPTICA (Fase 2)
-- ÓTICA INTELIGENTE v2.0
-- ============================================================================

BEGIN;

-- 1. Tabela de Histórico Biométrico
CREATE TABLE IF NOT EXISTS public.cliente_biometria_optica (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    cliente_id UUID NOT NULL REFERENCES public.perfis(id) ON DELETE CASCADE,
    venda_os_id UUID REFERENCES public.vendas(id) ON DELETE SET NULL,
    receita_id UUID REFERENCES public.receitas(id) ON DELETE SET NULL,
    
    -- Parâmetros Oculares
    dp_total NUMERIC(5,2) NOT NULL,
    dnp_od NUMERIC(4,2) NOT NULL,
    dnp_oe NUMERIC(4,2) NOT NULL,
    altura_od_real NUMERIC(4,2) NOT NULL,
    altura_oe_real NUMERIC(4,2) NOT NULL,
    
    -- Parâmetros de Centragem / Armação
    co_od_horizontal NUMERIC(4,2) NOT NULL,
    co_oe_horizontal NUMERIC(4,2) NOT NULL,
    co_od_vertical NUMERIC(4,2) NOT NULL,
    co_oe_vertical NUMERIC(4,2) NOT NULL,
    
    -- Parâmetros de Armação Física
    distancia_vertice NUMERIC(4,2),
    angulo_pantoscopico NUMERIC(4,2),
    face_form NUMERIC(4,2), -- Inclinação lateral/galvânica
    assimetria_facial NUMERIC(4,2),
    inclinacao_cabeca NUMERIC(4,2),
    
    -- Auditoria de IA
    indice_confianca_ia NUMERIC(4,2) DEFAULT 1.00,
    dados_face_mesh JSONB, -- JSON contendo os vetores puros detectados para recálculo futuro
    foto_scan_url TEXT,
    
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Índices de Otimização
CREATE INDEX IF NOT EXISTS idx_biometria_tenant ON public.cliente_biometria_optica(tenant_id);
CREATE INDEX IF NOT EXISTS idx_biometria_cliente ON public.cliente_biometria_optica(cliente_id);
CREATE INDEX IF NOT EXISTS idx_biometria_os ON public.cliente_biometria_optica(venda_os_id);

-- 3. Habilita RLS na Tabela
ALTER TABLE public.cliente_biometria_optica ENABLE ROW LEVEL SECURITY;

-- 4. Criação da Política RLS baseada no tenant logado
CREATE POLICY "RLS Tenant: Biometria Óptica" ON public.cliente_biometria_optica
    FOR ALL TO authenticated USING (tenant_id = public.jwt_tenant_id()) WITH CHECK (tenant_id = public.jwt_tenant_id());

COMMIT;
