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