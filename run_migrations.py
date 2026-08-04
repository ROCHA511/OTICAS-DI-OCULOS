# -*- coding: utf-8 -*-
"""
run_migrations.py
Execute todas as migrations no Supabase usando a service_role key via SQL API.
"""
import urllib.request
import urllib.error
import json
import sys
import time

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://nbbwajogbrwcirnfrigo.supabase.co")
SERVICE_KEY  = os.getenv("SUPABASE_SERVICE_KEY", "")

def exec_sql(sql, label=""):
    """Executa SQL via endpoint pg (requer service_role key)."""
    # Tenta o endpoint de pg_query ou SQL editor do Supabase
    body = json.dumps({"query": sql}).encode("utf-8")
    for endpoint in ["/rest/v1/rpc/exec_sql", "/pg/query"]:
        req = urllib.request.Request(
            f"{SUPABASE_URL}{endpoint}",
            data=body,
            headers={
                "apikey": SERVICE_KEY,
                "Authorization": f"Bearer {SERVICE_KEY}",
                "Content-Type": "application/json",
            },
            method="POST"
        )
        try:
            resp = urllib.request.urlopen(req, timeout=20)
            return True, resp.read().decode()
        except urllib.error.HTTPError as e:
            err = e.read().decode()
            if '"PGRST202"' in err or "no matches" in err:
                continue
            return False, err
        except Exception as ex:
            return False, str(ex)
    return False, "Nenhum endpoint SQL disponivel via API"

def table_exists(table):
    """Verifica se tabela existe via REST."""
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/{table}?select=*&limit=0"
    )
    req.add_header("apikey", SERVICE_KEY)
    req.add_header("Authorization", f"Bearer {SERVICE_KEY}")
    try:
        resp = urllib.request.urlopen(req, timeout=10)
        return True
    except urllib.error.HTTPError as e:
        return e.code != 404
    except:
        return False

def insert_row(table, row):
    """Insere/atualiza linha via REST."""
    body = json.dumps(row).encode("utf-8")
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/{table}",
        data=body,
        headers={
            "apikey": SERVICE_KEY,
            "Authorization": f"Bearer {SERVICE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates,return=minimal"
        },
        method="POST"
    )
    try:
        resp = urllib.request.urlopen(req, timeout=10)
        return True
    except urllib.error.HTTPError as e:
        body_resp = e.read().decode()
        print(f"    [INSERT ERR {e.code}] {body_resp[:120]}")
        return False
    except Exception as ex:
        print(f"    [INSERT ERR] {str(ex)[:80]}")
        return False

print("\n" + "="*65)
print("  MIGRACAO SUPABASE - OTICA INTELIGENTE 2.0")
print("  Projeto: nbbwajogbrwcirnfrigo")
print("="*65 + "\n")

# -----------------------------------------------------------------------
# 1. Verificar o que ja existe
# -----------------------------------------------------------------------
TODAS_TABELAS = [
    "tenants", "perfis", "clientes", "produtos", "vendas",
    "receitas", "transacoes_financeiras", "caixa", "profissionais",
    "sala_exames_prontuarios", "assinaturas",
    "clinica_pacientes", "clinica_atendimentos", "clinica_pre_anamneses",
    "clinica_prontuarios", "clinica_receitas_digitais", "clinica_documentos"
]

print("[1/3] Verificando estado atual do banco...")
existentes = []
ausentes = []
for t in TODAS_TABELAS:
    if table_exists(t):
        existentes.append(t)
        print(f"  [JA EXISTE] {t}")
    else:
        ausentes.append(t)
        print(f"  [AUSENTE  ] {t}")

print(f"\n  Existentes: {len(existentes)} | Ausentes: {len(ausentes)}\n")

# -----------------------------------------------------------------------
# 2. Tentar executar SQL via API
# -----------------------------------------------------------------------
print("[2/3] Tentando criar tabelas via SQL API...")

# Testa se endpoint SQL funciona com query simples
ok, resp = exec_sql("SELECT 1 as ping", "ping")
if ok:
    print("  [SQL API] Disponivel! Executando migrations...\n")
    
    SQL_MIGRATIONS = [
        ("SELECT version()", "Test ping"),
    ]
    
    sql_file = open("migration_manual.sql", encoding="utf-8").read()
    ok2, resp2 = exec_sql(sql_file, "migration_manual.sql")
    if ok2:
        print("  [OK] migration_manual.sql executado!")
    else:
        print(f"  [AVISO] {resp2[:200]}")
else:
    print(f"  [INFO] SQL API nao disponivel via REST: {resp[:100]}")
    print("  [INFO] Usando abordagem alternativa via insercoes REST...\n")

# -----------------------------------------------------------------------
# 3. Verificar resultado e gerar instrucoes
# -----------------------------------------------------------------------
print("\n[3/3] Verificando resultado...")
time.sleep(2)

criadas = []
pendentes = []
for t in ausentes:
    if table_exists(t):
        criadas.append(t)
        print(f"  [CRIADA ] {t}")
    else:
        pendentes.append(t)
        print(f"  [PENDENTE] {t}")

print("\n" + "="*65)
if not pendentes:
    print("  SUCESSO! Todas as tabelas foram criadas!")
else:
    print(f"  {len(pendentes)} tabela(s) ainda precisam ser criadas manualmente.")
    print("\n  INSTRUCAO - Execute o SQL no painel do Supabase:")
    print("  https://supabase.com/dashboard/project/nbbwajogbrwcirnfrigo/sql/new")
    print("\n  Arquivo pronto: migration_manual.sql (raiz do projeto)")
print("="*65 + "\n")
