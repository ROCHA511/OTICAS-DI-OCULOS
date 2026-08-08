-- ============================================================================
-- MIGRATION: ÓTICA INTELIGENTE 2.0 — ARQUITETURA SAAS MULTI-TENANT
-- Banco de Dados: PostgreSQL / Supabase
-- Modo: Idempotente com Isolamento por tenant_id e RLS sem recursão
-- ============================================================================

BEGIN;

-- 1. EXTENSÃO UUID E SCHEMA
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELA DE TENANTS / ÓTICAS PARCEIRAS
CREATE TABLE IF NOT EXISTS public.saas_tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    trade_name VARCHAR(255),
    cnpj VARCHAR(20) UNIQUE,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    whatsapp VARCHAR(50),
    address VARCHAR(255),
    number VARCHAR(20),
    complement VARCHAR(100),
    neighborhood VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(10),
    zip_code VARCHAR(20),
    logo_url TEXT,
    primary_color VARCHAR(20) DEFAULT '#071D49',
    secondary_color VARCHAR(20) DEFAULT '#D4AF37',
    accent_color VARCHAR(20) DEFAULT '#0055A5',
    status VARCHAR(30) DEFAULT 'active' CHECK (status IN ('pending_payment', 'active', 'suspended', 'cancelled', 'blocked')),
    plan_id UUID,
    owner_user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tenant Padrão Inicial (Matriz Ituberá) para vincular dados legados
INSERT INTO public.saas_tenants (id, name, legal_name, trade_name, cnpj, email, phone, city, state, status)
VALUES (
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Óticas Di Óculos - Matriz Ituberá',
    'Óticas Di Óculos Ltda',
    'Óticas Di Óculos',
    '12.345.678/0001-90',
    'matriz@dioculos.com.br',
    '(73) 98112-8923',
    'Ituberá',
    'BA',
    'active'
)
ON CONFLICT (id) DO NOTHING;

-- 3. TABELA DE PLANOS SAAS
CREATE TABLE IF NOT EXISTS public.saas_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    monthly_price NUMERIC(10, 2) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Planos Oficiais: Básico (R$ 199,00) e Pro Max (R$ 2.490,00)
INSERT INTO public.saas_plans (id, code, name, description, monthly_price, active, display_order)
VALUES 
(
    '11111111-1111-1111-1111-111111111111'::uuid,
    'basic',
    'Plano Básico',
    'Ideal para óticas individuais e pequenas unidades em crescimento.',
    199.00,
    TRUE,
    1
),
(
    '22222222-2222-2222-2222-222222222222'::uuid,
    'pro-max',
    'Plano Pro Max VIP',
    'Para redes de óticas, grandes lojas e laboratórios que exigem IA e provador 3D ilimitados.',
    2490.00,
    TRUE,
    2
)
ON CONFLICT (code) DO UPDATE 
SET monthly_price = EXCLUDED.monthly_price, name = EXCLUDED.name, description = EXCLUDED.description;

-- 4. TABELA DE FUNCIONALIDADES SAAS
CREATE TABLE IF NOT EXISTS public.saas_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    module VARCHAR(50) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Inserção das 22 Funcionalidades do Sistema
INSERT INTO public.saas_features (code, name, description, module) VALUES
('dashboard', 'Dashboard Executivo', 'Métricas e gráficos estratégicos de faturamento', 'core'),
('clients', 'Gestão de Clientes & CRM', 'Ficha completa de clientes e histórico óptico', 'crm'),
('products', 'Catálogo de Produtos & Armações', 'Cadastro de armações e lentes digitais', 'catalog'),
('inventory', 'Controle de Estoque', 'Gestão de entradas, saídas e alertas de nível', 'inventory'),
('sales', 'Ponto de Vendas (PDV)', 'Registro de vendas de balcão e orçamento rápido', 'sales'),
('cashier', 'Fluxo de Caixa Executivo', 'Controle financeiro, sangrias e fechamento de caixa', 'financial'),
('service_orders', 'Ordens de Serviço (OS)', 'Acompanhamento do ciclo da OS e prescrição', 'os'),
('financial', 'Gestão Financeira & DRE', 'Relatórios financeiros avançados e contas', 'financial'),
('reports', 'Relatórios & Inteligência', 'Relatórios exportáveis em PDF e Excel', 'reports'),
('commissions', 'Gestão de Comissões', 'Cálculo automático de comissões por vendedor', 'sales'),
('agenda', 'Agenda de Consultas', 'Agendamento de exames e consultas', 'exam'),
('crm', 'Funil de Vendas CRM', 'Gestão de leads e lembretes de retorno', 'crm'),
('whatsapp', 'Integração WhatsApp API', 'Envio de notificações de OS e orçamentos', 'communication'),
('ai', 'Inteligência Artificial Mary', 'Leitura visual de receitas e biometria DNP 3D', 'ai'),
('iris_ai', 'IA Íris Consultora', 'Consultoria óptica e recomendações automáticas', 'ai'),
('marketing', 'Módulo de Marketing', 'Campanhas de pós-venda e cupons', 'marketing'),
('multi_user', 'Múltiplos Usuários', 'Suporte a diferentes perfis e vendedores', 'admin'),
('audit', 'Logs de Auditoria', 'Histórico completo de alterações do sistema', 'admin'),
('export', 'Exportação de Dados', 'Download de relatórios e dados do tenant', 'reports'),
('backup', 'Backup Automático', 'Cópia de segurança diária na nuvem', 'admin'),
('branding', 'Personalização White-Label', 'Customização de logotipo e paleta de cores', 'branding'),
('api', 'Acesso via API', 'Integração externa via Webhooks', 'integration'),
('priority_support', 'Suporte VIP Prioritário', 'Atendimento dedicado via WhatsApp e telefone', 'support')
ON CONFLICT (code) DO NOTHING;

-- 5. RELACIONAMENTO PLANO x FUNCIONALIDADES
CREATE TABLE IF NOT EXISTS public.saas_plan_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES public.saas_plans(id) ON DELETE CASCADE,
    feature_id UUID NOT NULL REFERENCES public.saas_features(id) ON DELETE CASCADE,
    enabled BOOLEAN DEFAULT TRUE,
    limits JSONB DEFAULT '{}'::jsonb,
    UNIQUE(plan_id, feature_id)
);

-- 6. CONFIGURAÇÕES E IDENTIDADE VISUAL DO TENANT
CREATE TABLE IF NOT EXISTS public.tenant_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL UNIQUE REFERENCES public.saas_tenants(id) ON DELETE CASCADE,
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. VÍNCULO DE USUÁRIOS AO TENANT
CREATE TABLE IF NOT EXISTS public.tenant_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.saas_tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('owner', 'admin', 'manager', 'seller', 'cashier', 'employee')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(tenant_id, user_id)
);

-- 8. ASSINATURAS MENSAIS (MERCADO PAGO)
CREATE TABLE IF NOT EXISTS public.saas_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.saas_tenants(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.saas_plans(id),
    provider VARCHAR(50) DEFAULT 'mercado_pago',
    provider_customer_id VARCHAR(100),
    provider_subscription_id VARCHAR(100),
    status VARCHAR(30) DEFAULT 'active' CHECK (status IN ('pending', 'authorized', 'active', 'paused', 'cancelled')),
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'BRL',
    billing_cycle VARCHAR(20) DEFAULT 'monthly',
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. ACOMPANHAMENTO DE ONBOARDING
CREATE TABLE IF NOT EXISTS public.saas_onboarding (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.saas_tenants(id) ON DELETE CASCADE,
    current_step INT DEFAULT 1,
    status VARCHAR(30) DEFAULT 'in_progress',
    data JSONB DEFAULT '{}'::jsonb,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. EVENTOS DE PROVISIONAMENTO IDEMPOTENTE
CREATE TABLE IF NOT EXISTS public.saas_provisioning_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.saas_tenants(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
    payload JSONB DEFAULT '{}'::jsonb,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. INCLUSÃO DE TENANT_ID NAS TABELAS OPERACIONAIS EXISTENTES (SEM APAGAR DADOS)
DO $$
BEGIN
    -- perfis
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='perfis' AND column_name='tenant_id') THEN
        ALTER TABLE public.perfis ADD COLUMN tenant_id UUID DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;
    END IF;

    -- profissionais
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profissionais' AND column_name='tenant_id') THEN
        ALTER TABLE public.profissionais ADD COLUMN tenant_id UUID DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;
    END IF;

    -- clientes
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clientes' AND column_name='tenant_id') THEN
        ALTER TABLE public.clientes ADD COLUMN tenant_id UUID DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;
    END IF;

    -- produtos
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='produtos' AND column_name='tenant_id') THEN
        ALTER TABLE public.produtos ADD COLUMN tenant_id UUID DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;
    END IF;

    -- ordens_servico
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ordens_servico' AND column_name='tenant_id') THEN
        ALTER TABLE public.ordens_servico ADD COLUMN tenant_id UUID DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;
    END IF;

    -- transacoes_financeiras
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transacoes_financeiras' AND column_name='tenant_id') THEN
        ALTER TABLE public.transacoes_financeiras ADD COLUMN tenant_id UUID DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;
    END IF;

    -- caixa
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='caixa' AND column_name='tenant_id') THEN
        ALTER TABLE public.caixa ADD COLUMN tenant_id UUID DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;
    END IF;
END $$;

-- 12. FUNÇÃO SECURITY DEFINER PARA OBTER TENANT ATUAL (SEM RECURSÃO DE RLS)
CREATE OR REPLACE FUNCTION public.get_current_tenant_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
    v_tenant_id UUID;
BEGIN
    SELECT tenant_id INTO v_tenant_id
    FROM public.tenant_users
    WHERE user_id = auth.uid() AND status = 'active'
    LIMIT 1;

    -- Fallback para o tenant matriz caso esteja em ambiente de desenvolvimento/demo
    IF v_tenant_id IS NULL THEN
        RETURN '00000000-0000-0000-0000-000000000001'::uuid;
    END IF;

    RETURN v_tenant_id;
END;
$$;

-- 13. FUNÇÃO PARA VERIFICAR SE O TENANT POSSUI UMA FUNCIONALIDADE
CREATE OR REPLACE FUNCTION public.has_tenant_feature(
    p_tenant_id UUID,
    p_feature_code VARCHAR
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
    v_status VARCHAR;
    v_has_feature BOOLEAN;
BEGIN
    -- 1. Verificar se tenant existe e está ativo
    SELECT status INTO v_status FROM public.saas_tenants WHERE id = p_tenant_id;
    IF v_status IS NULL OR v_status NOT IN ('active', 'pending_payment') THEN
        RETURN FALSE;
    END IF;

    -- 2. Verificar se o plano do tenant possui a funcionalidade habilitada
    SELECT pf.enabled INTO v_has_feature
    FROM public.saas_tenants t
    JOIN public.saas_plan_features pf ON pf.plan_id = t.plan_id
    JOIN public.saas_features f ON f.id = pf.feature_id
    WHERE t.id = p_tenant_id AND f.code = p_feature_code;

    RETURN COALESCE(v_has_feature, FALSE);
END;
$$;

-- 14. ATIVAÇÃO DE RLS NAS TABELAS OPERACIONAIS
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordens_servico ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transacoes_financeiras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caixa ENABLE ROW LEVEL SECURITY;

-- Exemplo de políticas RLS idempotentes
DROP POLICY IF EXISTS "Acesso isolado por tenant_id nos clientes" ON public.clientes;
CREATE POLICY "Acesso isolado por tenant_id nos clientes" ON public.clientes
    FOR ALL
    USING (tenant_id = public.get_current_tenant_id())
    WITH CHECK (tenant_id = public.get_current_tenant_id());

DROP POLICY IF EXISTS "Acesso isolado por tenant_id nos produtos" ON public.produtos;
CREATE POLICY "Acesso isolado por tenant_id nos produtos" ON public.produtos
    FOR ALL
    USING (tenant_id = public.get_current_tenant_id())
    WITH CHECK (tenant_id = public.get_current_tenant_id());

DROP POLICY IF EXISTS "Acesso isolado por tenant_id nas ordens_servico" ON public.ordens_servico;
CREATE POLICY "Acesso isolado por tenant_id nas ordens_servico" ON public.ordens_servico
    FOR ALL
    USING (tenant_id = public.get_current_tenant_id())
    WITH CHECK (tenant_id = public.get_current_tenant_id());

COMMIT;
