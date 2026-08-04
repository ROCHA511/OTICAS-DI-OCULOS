"""
migrate_supabase.py
====================
Script de migração completo — cria TODAS as tabelas faltantes no Supabase
e semeia dados iniciais.

Execute: python migrate_supabase.py
"""

import os
import sys
import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    os.environ.get("DATABASE_URL", "postgresql://postgres:SENHA_AQUI@db.ulrrtzbxcsywmtshdnbp.supabase.co:5432/postgres")
)

def get_conn():
    return psycopg2.connect(DATABASE_URL, connect_timeout=15)

def run_sql(conn, statement: str, description: str = ""):
    try:
        with conn.cursor() as cur:
            cur.execute(statement)
        conn.commit()
        label = description or statement[:60].replace('\n', ' ')
        print(f"  ✅ {label}")
    except Exception as e:
        conn.rollback()
        print(f"  ⚠️  Erro em [{description}]: {e}")

# ===========================================================================
# TODAS AS MIGRAÇÕES
# ===========================================================================

MIGRATIONS = []

# ---------------------------------------------------------------------------
# 1. Garantir que funções auxiliares existam
# ---------------------------------------------------------------------------
MIGRATIONS.append(("Função jwt_tenant_id", """
CREATE OR REPLACE FUNCTION public.jwt_tenant_id()
RETURNS UUID AS $$
  SELECT COALESCE(
    (current_setting('request.jwt.claims', true)::jsonb ->> 'tenant_id')::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid
  );
$$ LANGUAGE sql STABLE;
"""))

# ---------------------------------------------------------------------------
# 2. Tabela: tenants (caso não exista)
# ---------------------------------------------------------------------------
MIGRATIONS.append(("Tabela tenants", """
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_fantasia VARCHAR(255) NOT NULL,
    razao_social VARCHAR(255),
    cnpj VARCHAR(20) UNIQUE,
    plano VARCHAR(20) NOT NULL DEFAULT 'trial',
    status VARCHAR(30) NOT NULL DEFAULT 'ativo',
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);
"""))

# ---------------------------------------------------------------------------
# 3. Tenant padrão (Óticas Di Óculos)
# ---------------------------------------------------------------------------
MIGRATIONS.append(("Tenant padrão Óticas Di Óculos", """
INSERT INTO public.tenants (id, nome_fantasia, razao_social, cnpj, plano, status)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Óticas Di Óculos',
    'Di Óculos Comércio de Ótica Ltda.',
    '00.000.000/0001-01',
    'promax',
    'ativo'
) ON CONFLICT (id) DO NOTHING;
"""))

# ---------------------------------------------------------------------------
# 4. Tabela: sala_exames_prontuarios
# ---------------------------------------------------------------------------
MIGRATIONS.append(("Tabela sala_exames_prontuarios", """
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
"""))

MIGRATIONS.append(("Índices sala_exames_prontuarios", """
CREATE INDEX IF NOT EXISTS idx_sala_exames_tenant ON public.sala_exames_prontuarios(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sala_exames_status ON public.sala_exames_prontuarios(status);
CREATE INDEX IF NOT EXISTS idx_sala_exames_data ON public.sala_exames_prontuarios(data_exame DESC);
"""))

MIGRATIONS.append(("RLS sala_exames_prontuarios", """
ALTER TABLE public.sala_exames_prontuarios ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "acesso_total_sala_exames" ON public.sala_exames_prontuarios;
CREATE POLICY "acesso_total_sala_exames" ON public.sala_exames_prontuarios
    FOR ALL USING (true) WITH CHECK (true);
"""))

# ---------------------------------------------------------------------------
# 5. Tabela: assinaturas (substituição do subscriptions.json)
# ---------------------------------------------------------------------------
MIGRATIONS.append(("Tabela assinaturas", """
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
"""))

MIGRATIONS.append(("Assinatura padrão Óticas Di Óculos", """
INSERT INTO public.assinaturas (tenant_id, plano, status, customer_email)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'promax',
    'active',
    'dioennerocha@hotmail.com'
) ON CONFLICT (tenant_id) DO NOTHING;
"""))

MIGRATIONS.append(("RLS assinaturas", """
ALTER TABLE public.assinaturas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "acesso_total_assinaturas" ON public.assinaturas;
CREATE POLICY "acesso_total_assinaturas" ON public.assinaturas
    FOR ALL USING (true) WITH CHECK (true);
"""))

# ---------------------------------------------------------------------------
# 6. Tabelas Python FastAPI (sala de exames — substitui SQLite)
# ---------------------------------------------------------------------------
MIGRATIONS.append(("Tabela clinica_pacientes", """
CREATE TABLE IF NOT EXISTS public.clinica_pacientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(20) UNIQUE NOT NULL,
    data_nascimento TIMESTAMP WITH TIME ZONE NOT NULL,
    genero VARCHAR(50) DEFAULT 'Não especificado',
    telefone VARCHAR(50),
    email VARCHAR(255) UNIQUE,
    endereco TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);
"""))

MIGRATIONS.append(("Tabela clinica_atendimentos", """
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
"""))

MIGRATIONS.append(("Tabela clinica_pre_anamneses", """
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
"""))

MIGRATIONS.append(("Tabela clinica_prontuarios", """
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
"""))

MIGRATIONS.append(("Tabela clinica_receitas_digitais", """
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
"""))

MIGRATIONS.append(("Tabela clinica_documentos", """
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
"""))

MIGRATIONS.append(("RLS tabelas clínica", """
ALTER TABLE public.clinica_pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinica_atendimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinica_pre_anamneses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinica_prontuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinica_receitas_digitais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinica_documentos ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "acesso_clinica_pacientes" ON public.clinica_pacientes;
  CREATE POLICY "acesso_clinica_pacientes" ON public.clinica_pacientes FOR ALL USING (true) WITH CHECK (true);
  DROP POLICY IF EXISTS "acesso_clinica_atendimentos" ON public.clinica_atendimentos;
  CREATE POLICY "acesso_clinica_atendimentos" ON public.clinica_atendimentos FOR ALL USING (true) WITH CHECK (true);
  DROP POLICY IF EXISTS "acesso_clinica_pre_anamneses" ON public.clinica_pre_anamneses;
  CREATE POLICY "acesso_clinica_pre_anamneses" ON public.clinica_pre_anamneses FOR ALL USING (true) WITH CHECK (true);
  DROP POLICY IF EXISTS "acesso_clinica_prontuarios" ON public.clinica_prontuarios;
  CREATE POLICY "acesso_clinica_prontuarios" ON public.clinica_prontuarios FOR ALL USING (true) WITH CHECK (true);
  DROP POLICY IF EXISTS "acesso_clinica_receitas" ON public.clinica_receitas_digitais;
  CREATE POLICY "acesso_clinica_receitas" ON public.clinica_receitas_digitais FOR ALL USING (true) WITH CHECK (true);
  DROP POLICY IF EXISTS "acesso_clinica_documentos" ON public.clinica_documentos;
  CREATE POLICY "acesso_clinica_documentos" ON public.clinica_documentos FOR ALL USING (true) WITH CHECK (true);
END $$;
"""))

# ---------------------------------------------------------------------------
# 7. Índices das tabelas clínicas
# ---------------------------------------------------------------------------
MIGRATIONS.append(("Índices tabelas clínicas", """
CREATE INDEX IF NOT EXISTS idx_clinica_atend_paciente ON public.clinica_atendimentos(paciente_id);
CREATE INDEX IF NOT EXISTS idx_clinica_atend_status ON public.clinica_atendimentos(status);
CREATE INDEX IF NOT EXISTS idx_clinica_pront_atend ON public.clinica_prontuarios(atendimento_id);
CREATE INDEX IF NOT EXISTS idx_clinica_receita_pront ON public.clinica_receitas_digitais(prontuario_id);
"""))

# ===========================================================================
# EXECUÇÃO PRINCIPAL
# ===========================================================================

def main():
    print("\n[MIGRACAO] Iniciando migracao para Supabase PostgreSQL...\n")
    print(f"   Projeto: ulrrtzbxcsywmtshdnbp.supabase.co")
    print(f"   Etapas a executar: {len(MIGRATIONS)}\n")

    try:
        conn = get_conn()
        print("[OK] Conexao com Supabase estabelecida!\n")
    except Exception as e:
        print(f"[ERRO FATAL] Nao foi possivel conectar ao Supabase:\n   {e}")
        sys.exit(1)

    erros = 0
    for desc, stmt in MIGRATIONS:
        try:
            with conn.cursor() as cur:
                cur.execute(stmt)
            conn.commit()
            print(f"  [OK] {desc}")
        except Exception as e:
            conn.rollback()
            print(f"  [AVISO] [{desc}]: {e}")
            erros += 1

    conn.close()

    print(f"\n{'='*60}")
    if erros == 0:
        print("[SUCESSO] Migracao concluida! Todas as tabelas criadas.")
    else:
        print(f"[AVISO] Migracao concluida com {erros} aviso(s). Verifique acima.")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    main()
