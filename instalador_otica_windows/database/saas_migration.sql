-- ============================================================================
-- SCRIPT DE MIGRAÇÃO SAAS MULTITENANT & MULTIFILIAL
-- ÓTICA INTELIGENTE v2.0 (Fase 1)
-- ============================================================================

BEGIN;

-- 1. Criação da Tabela de Inquilinos (Tenants/Óticas contratantes)
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_fantasia VARCHAR(255) NOT NULL,
    razao_social VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    plano_atual VARCHAR(50) DEFAULT 'starter' NOT NULL, -- starter, professional, premium_ia, visufit_ai
    status VARCHAR(50) DEFAULT 'ativo' NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Criação da Tabela de Lojas / Filiais
CREATE TABLE IF NOT EXISTS public.filiais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    nome VARCHAR(150) NOT NULL,
    cnpj VARCHAR(18) UNIQUE,
    telefone VARCHAR(50),
    endereco TEXT,
    cidade VARCHAR(100),
    estado VARCHAR(2),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Atualização das Tabelas Existentes para Adicionar tenant_id e filial_id
ALTER TABLE public.perfis ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.perfis ADD COLUMN IF NOT EXISTS filial_id UUID REFERENCES public.filiais(id) ON DELETE SET NULL;

ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

ALTER TABLE public.receitas ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

ALTER TABLE public.vendas ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.vendas ADD COLUMN IF NOT EXISTS filial_id UUID REFERENCES public.filiais(id) ON DELETE SET NULL;

ALTER TABLE public.vendas_itens ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

ALTER TABLE public.caixa ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.caixa ADD COLUMN IF NOT EXISTS filial_id UUID REFERENCES public.filiais(id) ON DELETE SET NULL;

ALTER TABLE public.transacoes_financeiras ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

ALTER TABLE public.parcelas ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

ALTER TABLE public.comissoes ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

ALTER TABLE public.agenda ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.agenda ADD COLUMN IF NOT EXISTS filial_id UUID REFERENCES public.filiais(id) ON DELETE SET NULL;

ALTER TABLE public.mensagens_whatsapp ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

ALTER TABLE public.logs_auditoria ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

-- 4. Criação de Índices para a Chave de Tenant (Otimização de Performance Multitenant)
CREATE INDEX IF NOT EXISTS idx_perfis_tenant ON public.perfis(tenant_id);
CREATE INDEX IF NOT EXISTS idx_filiais_tenant ON public.filiais(tenant_id);
CREATE INDEX IF NOT EXISTS idx_produtos_tenant ON public.produtos(tenant_id);
CREATE INDEX IF NOT EXISTS idx_receitas_tenant ON public.receitas(tenant_id);
CREATE INDEX IF NOT EXISTS idx_vendas_tenant ON public.vendas(tenant_id);
CREATE INDEX IF NOT EXISTS idx_caixa_tenant ON public.caixa(tenant_id);
CREATE INDEX IF NOT EXISTS idx_agenda_tenant ON public.agenda(tenant_id);

-- 5. Reconfiguração de RLS baseada em tenant_id do Supabase (JWT app_metadata)
-- Função auxiliar para extrair tenant_id do JWT do usuário autenticado no Supabase
CREATE OR REPLACE FUNCTION public.jwt_tenant_id()
RETURNS UUID AS $$
    SELECT COALESCE(
        (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'tenant_id')::uuid,
        '00000000-0000-0000-0000-000000000000'::uuid
    );
$$ LANGUAGE sql STABLE;

-- Excluir políticas genéricas anteriores
DROP POLICY IF EXISTS "CEO: acesso total a perfis" ON public.perfis;
DROP POLICY IF EXISTS "Líder: vê e edita perfis de seu time e clientes" ON public.perfis;

-- Habilitar políticas de tenant RLS estritas nas tabelas
CREATE POLICY "RLS Tenant: Perfis" ON public.perfis 
    FOR ALL TO authenticated USING (tenant_id = public.jwt_tenant_id()) WITH CHECK (tenant_id = public.jwt_tenant_id());

CREATE POLICY "RLS Tenant: Produtos" ON public.produtos 
    FOR ALL TO authenticated USING (tenant_id = public.jwt_tenant_id()) WITH CHECK (tenant_id = public.jwt_tenant_id());

CREATE POLICY "RLS Tenant: Vendas" ON public.vendas 
    FOR ALL TO authenticated USING (tenant_id = public.jwt_tenant_id()) WITH CHECK (tenant_id = public.jwt_tenant_id());

CREATE POLICY "RLS Tenant: Caixa" ON public.caixa 
    FOR ALL TO authenticated USING (tenant_id = public.jwt_tenant_id()) WITH CHECK (tenant_id = public.jwt_tenant_id());

CREATE POLICY "RLS Tenant: Receitas" ON public.receitas 
    FOR ALL TO authenticated USING (tenant_id = public.jwt_tenant_id()) WITH CHECK (tenant_id = public.jwt_tenant_id());

CREATE POLICY "RLS Tenant: Agenda" ON public.agenda 
    FOR ALL TO authenticated USING (tenant_id = public.jwt_tenant_id()) WITH CHECK (tenant_id = public.jwt_tenant_id());

CREATE POLICY "RLS Tenant: Comissões" ON public.comissoes 
    FOR ALL TO authenticated USING (tenant_id = public.jwt_tenant_id()) WITH CHECK (tenant_id = public.jwt_tenant_id());

COMMIT;
