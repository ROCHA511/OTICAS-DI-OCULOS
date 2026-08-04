# -*- coding: utf-8 -*-
"""
migrate_supabase_rest.py
==========================
Executa todas as migrações via REST API do Supabase (sem precisar de conexão
direta PostgreSQL). Usa o endpoint /rest/v1/rpc ou executa via SQL direto.
"""

import urllib.request
import urllib.error
import json
import os
import sys
import time

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

SUPABASE_URL = "https://ulrrtzbxcsywmtshdnbp.supabase.co"
ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "sb_publishable_vJ0IlajBwDiTDQCV9kyExg_zYujA5o8")

def supabase_request(method, path, body=None, extra_headers=None):
    url = f"{SUPABASE_URL}{path}"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {ANON_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    if extra_headers:
        headers.update(extra_headers)
    
    data = json.dumps(body).encode("utf-8") if body is not None else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        resp = urllib.request.urlopen(req, timeout=30)
        return resp.status, resp.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8")
    except Exception as ex:
        return -1, str(ex)

def table_exists(table_name):
    status, body = supabase_request("GET", f"/rest/v1/{table_name}?select=*&limit=1")
    return status != 404

def insert_row(table, row):
    status, body = supabase_request("POST", f"/rest/v1/{table}", body=row)
    return status in (200, 201)

def upsert_row(table, row, on_conflict=""):
    path = f"/rest/v1/{table}"
    extra = {"Prefer": f"resolution=merge-duplicates,return=representation"}
    status, body = supabase_request("POST", path, body=row, extra_headers=extra)
    return status in (200, 201)

print("\n[MIGRACAO] Iniciando via REST API do Supabase...")
print(f"   URL: {SUPABASE_URL}\n")

erros = 0
resultados = []

# -----------------------------------------------------------------------
# Verificar conectividade
# -----------------------------------------------------------------------
status, body = supabase_request("GET", "/rest/v1/")
if status not in (200, 201, 206):
    print(f"[ERRO] Nao foi possivel conectar ao Supabase. HTTP {status}: {body[:200]}")
    sys.exit(1)
print("[OK] Conexao com Supabase REST API estabelecida!\n")

# -----------------------------------------------------------------------
# 1. Verificar tabelas existentes e reportar
# -----------------------------------------------------------------------
tabelas_verificar = [
    "perfis", "clientes", "produtos", "vendas", "receitas",
    "transacoes_financeiras", "caixa", "profissionais",
    "sala_exames_prontuarios", "assinaturas",
    "clinica_pacientes", "clinica_atendimentos",
    "clinica_prontuarios", "clinica_pre_anamneses",
    "clinica_receitas_digitais", "clinica_documentos"
]

print("[INFO] Verificando tabelas existentes...")
existentes = []
ausentes = []
for t in tabelas_verificar:
    if table_exists(t):
        existentes.append(t)
        print(f"  [JA EXISTE] {t}")
    else:
        ausentes.append(t)
        print(f"  [AUSENTE]   {t}")

print(f"\n[INFO] {len(existentes)} tabelas existentes, {len(ausentes)} a criar via SQL manual.\n")

# -----------------------------------------------------------------------
# 2. Para tabelas de dados que ja existem, fazer upsert de dados iniciais
# -----------------------------------------------------------------------

if "assinaturas" in existentes:
    print("[SEED] Inserindo assinatura padrao na tabela assinaturas...")
    ok = upsert_row("assinaturas", {
        "tenant_id": "00000000-0000-0000-0000-000000000001",
        "plano": "promax",
        "status": "active",
        "customer_email": "dioennerocha@hotmail.com",
        "trial_ends_at": "2027-08-03T00:00:00Z"
    })
    print(f"  [{'OK' if ok else 'AVISO'}] Assinatura padrao")

if "sala_exames_prontuarios" in existentes:
    print("[OK] sala_exames_prontuarios ja existe e esta pronta para uso!")

# -----------------------------------------------------------------------
# 3. Gerar o SQL completo para colar no Supabase SQL Editor
# -----------------------------------------------------------------------
SQL_COMPLETO = """
-- ============================================================
-- MIGRACAO COMPLETA - OTICA INTELIGENTE 2.0
-- Cole este SQL no Supabase SQL Editor e execute
-- URL: https://supabase.com/dashboard/project/ulrrtzbxcsywmtshdnbp/sql
-- ============================================================

-- TABELA: tenants
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

-- TABELA: assinaturas
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

-- TABELA: sala_exames_prontuarios
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
ALTER TABLE public.sala_exames_prontuarios ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "acesso_total_sala_exames" ON public.sala_exames_prontuarios;
CREATE POLICY "acesso_total_sala_exames" ON public.sala_exames_prontuarios FOR ALL USING (true) WITH CHECK (true);

-- TABELA: clinica_pacientes
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

-- TABELA: clinica_atendimentos
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

-- TABELA: clinica_pre_anamneses
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

-- TABELA: clinica_prontuarios
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

-- TABELA: clinica_receitas_digitais
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

-- TABELA: clinica_documentos
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

-- Indices otimizacao
CREATE INDEX IF NOT EXISTS idx_sala_exames_status ON public.sala_exames_prontuarios(status);
CREATE INDEX IF NOT EXISTS idx_clinica_atend_status ON public.clinica_atendimentos(status);
CREATE INDEX IF NOT EXISTS idx_clinica_pront_atend ON public.clinica_prontuarios(atendimento_id);
"""

# Salvar o SQL em arquivo
sql_path = "migration_manual.sql"
with open(sql_path, "w", encoding="utf-8") as f:
    f.write(SQL_COMPLETO)

print(f"\n[GERADO] Arquivo SQL salvo: {sql_path}")
print("\n" + "="*70)
print("ACAO NECESSARIA:")
print("="*70)
print("As tabelas ausentes nao podem ser criadas via anon key.")
print("Para criar as tabelas, execute o SQL no Supabase SQL Editor:")
print()
print("  1. Acesse: https://supabase.com/dashboard/project/ulrrtzbxcsywmtshdnbp/sql/new")
print("  2. Abra o arquivo: migration_manual.sql")  
print("  3. Cole o conteudo e clique em RUN")
print("="*70)

# Verificar quais tabelas importantes JA existem e funcionam
print("\n[STATUS FINAL] Tabelas disponiveis para o sistema:")
for t in tabelas_verificar:
    existe = table_exists(t)
    estado = "PRONTA" if existe else "PENDENTE (criar via SQL Editor)"
    print(f"  {estado:35} -> {t}")
