-- ==========================================================
-- SQL COMPLETO - OTICA INTELIGENTE 2.0
-- Projeto: nbbwajogbrwcirnfrigo.supabase.co
-- Execute no SQL Editor: https://supabase.com/dashboard/project/nbbwajogbrwcirnfrigo/sql/new
-- ==========================================================

-- ---- dump.sql ----
-- ============================================================================
-- MASTER AUDITOR SQL - OTICA INTELIGENTE
-- MODO: AUDITORIA COMPLETA + AUTO CORREÇÃO IDEMPOTENTE
-- COMPATIBILIDADE: PostgreSQL 15+ / Supabase
-- AUTORES: Iris Clin (Dioenne, Marly e Mariana)
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. CRIAÇÃO DE ENUMS (SE NÃO EXISTIREM)
-- ============================================================================

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('ceo', 'lider', 'profissional', 'cliente');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_cadastro') THEN
        CREATE TYPE status_cadastro AS ENUM ('ativo', 'inativo');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_venda') THEN
        CREATE TYPE status_venda AS ENUM ('aberto', 'em_producao', 'pronto', 'entregue', 'cancelado');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_caixa') THEN
        CREATE TYPE status_caixa AS ENUM ('aberto', 'fechado');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_transacao') THEN
        CREATE TYPE tipo_transacao AS ENUM ('entrada', 'saida');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'forma_pagamento') THEN
        CREATE TYPE forma_pagamento AS ENUM ('pix', 'cartao_credito', 'cartao_debito', 'dinheiro', 'parcelado');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_parcela') THEN
        CREATE TYPE status_parcela AS ENUM ('pendente', 'pago', 'atrasado');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_comissao') THEN
        CREATE TYPE status_comissao AS ENUM ('pendente', 'pago');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_agenda') THEN
        CREATE TYPE status_agenda AS ENUM ('agendado', 'confirmado', 'realizado', 'cancelado');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_whatsapp') THEN
        CREATE TYPE status_whatsapp AS ENUM ('pendente', 'enviado', 'entregue', 'falhou');
    END IF;
END $$;

-- ============================================================================
-- 2. CRIAÇÃO DE TABELAS E RELACIONAMENTOS (IF NOT EXISTS)
-- ============================================================================

-- Tabela de Perfis de Usuários (Integrada com auth.users do Supabase)
CREATE TABLE IF NOT EXISTS public.perfis (
    id UUID PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(50),
    role user_role DEFAULT 'cliente'::user_role,
    status status_cadastro DEFAULT 'ativo'::status_cadastro,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Profissionais / Médicos
CREATE TABLE IF NOT EXISTS public.profissionais (
    id UUID PRIMARY KEY REFERENCES public.perfis(id) ON DELETE CASCADE,
    especialidade VARCHAR(100),
    crm_registro VARCHAR(50),
    leader_id UUID REFERENCES public.perfis(id) ON DELETE SET NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS public.clientes (
    id UUID PRIMARY KEY REFERENCES public.perfis(id) ON DELETE CASCADE,
    cpf VARCHAR(14) UNIQUE,
    data_nascimento DATE,
    endereco TEXT,
    cidade VARCHAR(100),
    estado VARCHAR(2),
    cep VARCHAR(9),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Produtos (Estoque da Ótica)
CREATE TABLE IF NOT EXISTS public.produtos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco_venda NUMERIC(10,2) NOT NULL CHECK (preco_venda >= 0),
    preco_custo NUMERIC(10,2) NOT NULL CHECK (preco_custo >= 0),
    estoque_atual INT NOT NULL DEFAULT 0 CHECK (estoque_atual >= 0),
    estoque_minimo INT NOT NULL DEFAULT 0 CHECK (estoque_minimo >= 0),
    categoria VARCHAR(100) DEFAULT 'lentes',
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Receitas de Óculos / Lentes
CREATE TABLE IF NOT EXISTS public.receitas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    medico_id UUID REFERENCES public.profissionais(id) ON DELETE SET NULL,
    esferico_od NUMERIC(4,2) DEFAULT 0.00,
    cilindrico_od NUMERIC(4,2) DEFAULT 0.00,
    eixo_od INT DEFAULT 0 CHECK (eixo_od >= 0 AND eixo_od <= 180),
    adicao_od NUMERIC(4,2) DEFAULT 0.00,
    esferico_oe NUMERIC(4,2) DEFAULT 0.00,
    cilindrico_oe NUMERIC(4,2) DEFAULT 0.00,
    eixo_oe INT DEFAULT 0 CHECK (eixo_oe >= 0 AND eixo_oe <= 180),
    adicao_oe NUMERIC(4,2) DEFAULT 0.00,
    dnp_od NUMERIC(4,2) DEFAULT 0.00,
    dnp_oe NUMERIC(4,2) DEFAULT 0.00,
    altura_od NUMERIC(4,2) DEFAULT 0.00,
    altura_oe NUMERIC(4,2) DEFAULT 0.00,
    data_emissao DATE DEFAULT CURRENT_DATE,
    validade DATE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Vendas / Ordens de Serviço (OS)
CREATE TABLE IF NOT EXISTS public.vendas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    profissional_id UUID NOT NULL REFERENCES public.profissionais(id) ON DELETE CASCADE,
    receita_id UUID REFERENCES public.receitas(id) ON DELETE SET NULL,
    status status_venda DEFAULT 'aberto'::status_venda,
    valor_total NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (valor_total >= 0),
    desconto NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (desconto >= 0),
    valor_liquido NUMERIC(10,2) GENERATED ALWAYS AS (valor_total - desconto) STORED,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Itens da Venda
CREATE TABLE IF NOT EXISTS public.vendas_itens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venda_id UUID NOT NULL REFERENCES public.vendas(id) ON DELETE CASCADE,
    produto_id UUID NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
    quantidade INT NOT NULL CHECK (quantidade > 0),
    preco_unitario NUMERIC(10,2) NOT NULL CHECK (preco_unitario >= 0),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Caixa (Fechamento Diário)
CREATE TABLE IF NOT EXISTS public.caixa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operador_id UUID NOT NULL REFERENCES public.perfis(id) ON DELETE CASCADE,
    data_abertura TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    data_fechamento TIMESTAMP WITH TIME ZONE,
    saldo_inicial NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (saldo_inicial >= 0),
    saldo_final NUMERIC(10,2) CHECK (saldo_final >= 0),
    status status_caixa DEFAULT 'aberto'::status_caixa,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Transações Financeiras (Fluxo de Caixa)
CREATE TABLE IF NOT EXISTS public.transacoes_financeiras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    caixa_id UUID NOT NULL REFERENCES public.caixa(id) ON DELETE CASCADE,
    venda_id UUID REFERENCES public.vendas(id) ON DELETE SET NULL,
    tipo tipo_transacao NOT NULL,
    valor NUMERIC(10,2) NOT NULL CHECK (valor > 0),
    forma_pagamento forma_pagamento NOT NULL,
    descricao TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Parcelas de Pagamento
CREATE TABLE IF NOT EXISTS public.parcelas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transacao_id UUID NOT NULL REFERENCES public.transacoes_financeiras(id) ON DELETE CASCADE,
    numero_parcela INT NOT NULL CHECK (numero_parcela > 0),
    valor NUMERIC(10,2) NOT NULL CHECK (valor > 0),
    data_vencimento DATE NOT NULL,
    data_pagamento DATE,
    status status_parcela DEFAULT 'pendente'::status_parcela,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Comissões de Vendas
CREATE TABLE IF NOT EXISTS public.comissoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profissional_id UUID NOT NULL REFERENCES public.profissionais(id) ON DELETE CASCADE,
    venda_id UUID NOT NULL REFERENCES public.vendas(id) ON DELETE CASCADE,
    valor_comissao NUMERIC(10,2) NOT NULL CHECK (valor_comissao >= 0),
    percentual NUMERIC(5,2) NOT NULL CHECK (percentual >= 0),
    status status_comissao DEFAULT 'pendente'::status_comissao,
    data_pagamento DATE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela da Agenda da Ótica
CREATE TABLE IF NOT EXISTS public.agenda (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    profissional_id UUID NOT NULL REFERENCES public.profissionais(id) ON DELETE CASCADE,
    data_hora TIMESTAMP WITH TIME ZONE NOT NULL,
    status status_agenda DEFAULT 'agendado'::status_agenda,
    observacoes TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Notificações e Mensagens WhatsApp
CREATE TABLE IF NOT EXISTS public.mensagens_whatsapp (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    remetente_id UUID NOT NULL REFERENCES public.perfis(id) ON DELETE CASCADE,
    destinatario_id UUID REFERENCES public.perfis(id) ON DELETE SET NULL,
    telefone_destinatario VARCHAR(50) NOT NULL,
    mensagem TEXT NOT NULL,
    status_envio status_whatsapp DEFAULT 'pendente'::status_whatsapp,
    logs_erro TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Logs de Auditoria do Sistema
CREATE TABLE IF NOT EXISTS public.logs_auditoria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES public.perfis(id) ON DELETE SET NULL,
    acao VARCHAR(100) NOT NULL,
    tabela VARCHAR(100) NOT NULL,
    registro_id UUID,
    dados_anteriores JSONB,
    dados_novos JSONB,
    ip_address VARCHAR(45),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 3. CRIAÇÃO DE ÍNDICES PARA OTIMIZAÇÃO DE PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_perfis_role ON public.perfis(role);
CREATE INDEX IF NOT EXISTS idx_perfis_status ON public.perfis(status);
CREATE INDEX IF NOT EXISTS idx_profissionais_leader ON public.profissionais(leader_id);
CREATE INDEX IF NOT EXISTS idx_receitas_cliente ON public.receitas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_vendas_cliente ON public.vendas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_vendas_profissional ON public.vendas(profissional_id);
CREATE INDEX IF NOT EXISTS idx_vendas_status ON public.vendas(status);
CREATE INDEX IF NOT EXISTS idx_vendas_itens_venda ON public.vendas_itens(venda_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_caixa ON public.transacoes_financeiras(caixa_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_venda ON public.transacoes_financeiras(venda_id);
CREATE INDEX IF NOT EXISTS idx_parcelas_transacao ON public.parcelas(transacao_id);
CREATE INDEX IF NOT EXISTS idx_comissoes_profissional ON public.comissoes(profissional_id);
CREATE INDEX IF NOT EXISTS idx_comissoes_status ON public.comissoes(status);
CREATE INDEX IF NOT EXISTS idx_agenda_data_hora ON public.agenda(data_hora);
CREATE INDEX IF NOT EXISTS idx_mensagens_whatsapp_status ON public.mensagens_whatsapp(status_envio);
CREATE INDEX IF NOT EXISTS idx_logs_auditoria_criado_em ON public.logs_auditoria(criado_em);

-- ============================================================================
-- 4. TRIGGERS E FUNÇÕES AUTOMÁTICAS (AUTO CORREÇÃO & INTEGRIDADE)
-- ============================================================================

-- Trigger para atualizar data de modificação
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_perfis_timestamp
BEFORE UPDATE ON public.perfis
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE OR REPLACE TRIGGER update_produtos_timestamp
BEFORE UPDATE ON public.produtos
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE OR REPLACE TRIGGER update_vendas_timestamp
BEFORE UPDATE ON public.vendas
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();


-- Trigger de Integração com auth.users do Supabase
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.perfis (id, nome, email, role, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'full_name', 'Usuário Novo'),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'cliente'::user_role),
    'ativo'::status_cadastro
  )
  ON CONFLICT (id) DO UPDATE
  SET nome = EXCLUDED.nome,
      email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- Trigger de Atualização Automática de Estoque
CREATE OR REPLACE FUNCTION public.atualizar_estoque_venda()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.produtos
    SET estoque_atual = estoque_atual - NEW.quantidade
    WHERE id = NEW.produto_id;
    
    -- Notificação silenciosa se estoque cair abaixo do mínimo
    IF (SELECT estoque_atual FROM public.produtos WHERE id = NEW.produto_id) < (SELECT estoque_minimo FROM public.produtos WHERE id = NEW.produto_id) THEN
        INSERT INTO public.logs_auditoria (acao, tabela, registro_id, dados_novos)
        VALUES ('ALERTA_ESTOQUE_BAIXO', 'produtos', NEW.produto_id, jsonb_build_object('produto_id', NEW.produto_id, 'mensagem', 'Estoque abaixo do limite mínimo definido.'));
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_atualizar_estoque
AFTER INSERT ON public.vendas_itens
FOR EACH ROW EXECUTE FUNCTION public.atualizar_estoque_venda();


-- Trigger de Auditoria Geral Automatizada
CREATE OR REPLACE FUNCTION public.processar_log_auditoria()
RETURNS TRIGGER AS $$
DECLARE
    v_usuario_id UUID;
BEGIN
    BEGIN
        v_usuario_id := auth.uid();
    EXCEPTION WHEN OTHERS THEN
        v_usuario_id := NULL;
    END;

    INSERT INTO public.logs_auditoria (usuario_id, acao, tabela, registro_id, dados_anteriores, dados_novos)
    VALUES (
        v_usuario_id,
        TG_OP,
        TG_TABLE_NAME,
        CASE 
            WHEN TG_OP = 'DELETE' THEN OLD.id 
            ELSE NEW.id 
        END,
        CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER audit_vendas
AFTER INSERT OR UPDATE OR DELETE ON public.vendas
FOR EACH ROW EXECUTE FUNCTION public.processar_log_auditoria();

CREATE OR REPLACE TRIGGER audit_receitas
AFTER INSERT OR UPDATE OR DELETE ON public.receitas
FOR EACH ROW EXECUTE FUNCTION public.processar_log_auditoria();

CREATE OR REPLACE TRIGGER audit_transacoes
AFTER INSERT OR UPDATE OR DELETE ON public.transacoes_financeiras
FOR EACH ROW EXECUTE FUNCTION public.processar_log_auditoria();

-- ============================================================================
-- 5. HABILITAR E CONFIGURAR POLICIES DE RLS (ROW LEVEL SECURITY)
-- ============================================================================

ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profissionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendas_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caixa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transacoes_financeiras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parcelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comissoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agenda ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensagens_whatsapp ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs_auditoria ENABLE ROW LEVEL SECURITY;

-- Excluir policies antigas de forma segura
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.' || quote_ident(r.tablename);
    END LOOP;
END $$;

-- 5.1 POLICIES PARA PERFIS
CREATE POLICY "CEO: acesso total a perfis" ON public.perfis 
    FOR ALL TO authenticated USING (
        (SELECT role FROM public.perfis WHERE id = auth.uid()) = 'ceo'::user_role
    );

CREATE POLICY "Líder: vê e edita perfis de seu time e clientes" ON public.perfis 
    FOR ALL TO authenticated USING (
        (SELECT role FROM public.perfis WHERE id = auth.uid()) = 'lider'::user_role
    );

CREATE POLICY "Profissionais: veem dados de perfis públicos" ON public.perfis 
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Cliente: vê e edita o seu próprio perfil" ON public.perfis 
    FOR ALL TO authenticated USING (id = auth.uid());

-- 5.2 POLICIES PARA PROFISSIONAIS
CREATE POLICY "CEO: acesso total a profissionais" ON public.profissionais 
    FOR ALL TO authenticated USING (
        (SELECT role FROM public.perfis WHERE id = auth.uid()) = 'ceo'::user_role
    );

CREATE POLICY "Líder: vê profissionais de seu time" ON public.profissionais 
    FOR ALL TO authenticated USING (
        (SELECT role FROM public.perfis WHERE id = auth.uid()) = 'lider'::user_role 
        AND (leader_id = auth.uid() OR id = auth.uid())
    );

CREATE POLICY "Profissional: vê a si mesmo" ON public.profissionais 
    FOR SELECT TO authenticated USING (id = auth.uid());

-- 5.3 POLICIES PARA CLIENTES
CREATE POLICY "CEO: acesso total a clientes" ON public.clientes 
    FOR ALL TO authenticated USING (
        (SELECT role FROM public.perfis WHERE id = auth.uid()) = 'ceo'::user_role
    );

CREATE POLICY "Líder: vê clientes" ON public.clientes 
    FOR ALL TO authenticated USING (
        (SELECT role FROM public.perfis WHERE id = auth.uid()) = 'lider'::user_role
    );

CREATE POLICY "Profissionais: veem clientes" ON public.clientes 
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Cliente: vê seus dados de cliente" ON public.clientes 
    FOR SELECT TO authenticated USING (id = auth.uid());

-- 5.4 POLICIES PARA PRODUTOS (ESTOQUE)
CREATE POLICY "CEO: acesso total a produtos" ON public.produtos 
    FOR ALL TO authenticated USING (
        (SELECT role FROM public.perfis WHERE id = auth.uid()) = 'ceo'::user_role
    );

CREATE POLICY "Líder: vê e edita produtos" ON public.produtos 
    FOR ALL TO authenticated USING (
        (SELECT role FROM public.perfis WHERE id = auth.uid()) = 'lider'::user_role
    );

CREATE POLICY "Profissionais: visualizam estoque" ON public.produtos 
    FOR SELECT TO authenticated USING (true);

-- 5.5 POLICIES PARA RECEITAS
CREATE POLICY "CEO: acesso total a receitas" ON public.receitas 
    FOR ALL TO authenticated USING (
        (SELECT role FROM public.perfis WHERE id = auth.uid()) = 'ceo'::user_role
    );

CREATE POLICY "Líder: visualiza receitas" ON public.receitas 
    FOR SELECT TO authenticated USING (
        (SELECT role FROM public.perfis WHERE id = auth.uid()) = 'lider'::user_role
    );

CREATE POLICY "Profissional: vê e cadastra receitas" ON public.receitas 
    FOR ALL TO authenticated USING (
        medico_id = auth.uid() 
        OR (SELECT role FROM public.perfis WHERE id = auth.uid()) = 'profissional'::user_role
    );

CREATE POLICY "Cliente: vê suas próprias receitas" ON public.receitas 
    FOR SELECT TO authenticated USING (cliente_id = auth.uid());

-- 5.6 POLICIES PARA VENDAS E ITENS
CREATE POLICY "CEO: acesso total a vendas" ON public.vendas 
    FOR ALL TO authenticated USING (
        (SELECT role FROM public.perfis WHERE id = auth.uid()) = 'ceo'::user_role
    );

CREATE POLICY "Líder: gerencia vendas" ON public.vendas 
    FOR ALL TO authenticated USING (
        (SELECT role FROM public.perfis WHERE id = auth.uid()) = 'lider'::user_role
    );

CREATE POLICY "Profissionais: veem e criam suas vendas" ON public.vendas 
    FOR ALL TO authenticated USING (profissional_id = auth.uid());

CREATE POLICY "Cliente: visualiza seu histórico de compras" ON public.vendas 
    FOR SELECT TO authenticated USING (cliente_id = auth.uid());

CREATE POLICY "Acesso total aos itens com base nas vendas" ON public.vendas_itens
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.vendas 
            WHERE public.vendas.id = public.vendas_itens.venda_id
        )
    );

-- 5.7 POLICIES PARA FINANCEIRO (CAIXA, TRANSAÇÕES, PARCELAS)
CREATE POLICY "CEO: acesso total financeiro" ON public.caixa 
    FOR ALL TO authenticated USING (
        (SELECT role FROM public.perfis WHERE id = auth.uid()) = 'ceo'::user_role
    );

CREATE POLICY "Líder: gerencia financeiro" ON public.caixa 
    FOR ALL TO authenticated USING (
        (SELECT role FROM public.perfis WHERE id = auth.uid()) = 'lider'::user_role
    );

CREATE POLICY "Profissional: abre e gerencia seu próprio caixa" ON public.caixa 
    FOR ALL TO authenticated USING (operador_id = auth.uid());

CREATE POLICY "Acesso total a transações vinculadas ao caixa acessível" ON public.transacoes_financeiras
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.caixa 
            WHERE public.caixa.id = public.transacoes_financeiras.caixa_id
        )
    );

CREATE POLICY "Acesso total a parcelas vinculadas a transações" ON public.parcelas
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.transacoes_financeiras 
            WHERE public.transacoes_financeiras.id = public.parcelas.transacao_id
        )
    );

-- 5.8 POLICIES PARA COMISSÕES
CREATE POLICY "CEO: gerencia comissões" ON public.comissoes 
    FOR ALL TO authenticated USING (
        (SELECT role FROM public.perfis WHERE id = auth.uid()) = 'ceo'::user_role
    );

CREATE POLICY "Líder: visualiza comissões" ON public.comissoes 
    FOR SELECT TO authenticated USING (
        (SELECT role FROM public.perfis WHERE id = auth.uid()) = 'lider'::user_role
    );

CREATE POLICY "Profissional: visualiza suas próprias comissões" ON public.comissoes 
    FOR SELECT TO authenticated USING (profissional_id = auth.uid());

-- 5.9 POLICIES PARA AGENDA
CREATE POLICY "CEO: gerencia agenda global" ON public.agenda 
    FOR ALL TO authenticated USING (
        (SELECT role FROM public.perfis WHERE id = auth.uid()) = 'ceo'::user_role
    );

CREATE POLICY "Líder: gerencia agenda" ON public.agenda 
    FOR ALL TO authenticated USING (
        (SELECT role FROM public.perfis WHERE id = auth.uid()) = 'lider'::user_role
    );

CREATE POLICY "Profissional: gerencia sua própria agenda" ON public.agenda 
    FOR ALL TO authenticated USING (profissional_id = auth.uid());

CREATE POLICY "Cliente: gerencia seus próprios agendamentos" ON public.agenda 
    FOR ALL TO authenticated USING (cliente_id = auth.uid());

-- 5.10 POLICIES PARA NOTIFICAÇÕES & WHATSAPP
CREATE POLICY "CEO: visualiza logs de whatsapp" ON public.mensagens_whatsapp 
    FOR SELECT TO authenticated USING (
        (SELECT role FROM public.perfis WHERE id = auth.uid()) = 'ceo'::user_role
    );

CREATE POLICY "Envio de whatsapp para usuários autenticados" ON public.mensagens_whatsapp 
    FOR INSERT TO authenticated WITH CHECK (remetente_id = auth.uid());

-- 5.11 POLICIES PARA AUDITORIA (LOGS)
CREATE POLICY "Apenas CEO lê logs de auditoria" ON public.logs_auditoria 
    FOR SELECT TO authenticated USING (
        (SELECT role FROM public.perfis WHERE id = auth.uid()) = 'ceo'::user_role
    );

-- ============================================================================
-- 6. VALIDAÇÕES INICIAIS E LOG DE CONCLUSÃO DA MIGRAÇÃO
-- ============================================================================

INSERT INTO public.logs_auditoria (acao, tabela, registro_id, dados_novos)
VALUES (
    'AUDITORIA_AUTO_CORRECAO_EXECUTADA',
    'sistema',
    NULL,
    jsonb_build_object(
        'data', NOW(),
        'mensagem', 'Banco de dados auditado e corrigido com sucesso. Estrutura idempotente criada.',
        'versao', '2.0.0'
    )
);

COMMIT;

-- ---- saas_migration.sql ----
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
    FOR ALL TO authenticated USING (tenant_id = public.jwt_tenant_id() OR tenant_id IS NULL) WITH CHECK (tenant_id = public.jwt_tenant_id() OR tenant_id IS NULL);

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


-- ---- saas_migration_v2_biometria.sql ----
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


-- ---- saas_migration_v3_contabilidade.sql ----
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


-- ---- saas_migration_v3_sala_exames.sql ----
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


-- ---- migration_manual.sql ----
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

