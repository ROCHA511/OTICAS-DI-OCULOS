# ============================================================================
# SCRIPT DE DEPLOY AUTOMÁTICO - BANCO DE DADOS SUPABASE (ÓTICA INTELIGENTE 2.0)
# ============================================================================
# Este script lê os scripts SQL locais de migração e os executa no seu banco.
# Ele também atualizará seus arquivos locais .env.local com a senha correta.

import os
import getpass
import psycopg2
import sys
import urllib.parse

def main():
    print("=" * 80)
    print("        DEPLOY DE BANCO DE DADOS AUTOMÁTICO - ÓTICA INTELIGENTE 2.0")
    print("=" * 80)
    
    project_id = "ulrrtzbxcsywmtshdnbp"
    host = f"db.{project_id}.supabase.co"
    port = 5432
    user = "postgres"
    database = "postgres"
    
    print(f"Projeto Supabase: {project_id}")
    print(f"Host de Conexão: {host}")
    print("-" * 80)
    
    # 1. Solicita a senha do banco de dados de forma segura no terminal
    password = getpass.getpass("Digite a senha do seu banco de dados Postgres do Supabase: ").strip()
    if not password:
        print("Erro: A senha não pode estar vazia.")
        sys.exit(1)
        
    # 2. Testa a conexão com o banco usando parâmetros nomeados (evita falha por caracteres especiais da URI)
    print("\n[1/3] Conectando ao banco de dados remoto do Supabase...")
    try:
        conn = psycopg2.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            database=database
        )
        cursor = conn.cursor()
        cursor.execute("SELECT version();")
        version = cursor.fetchone()
        print(f" -> Conexão estabelecida com sucesso!")
        print(f" -> Versão do Banco: {version[0]}")
    except Exception as e:
        print(f"\n❌ Erro de Conexão: A senha digitada foi rejeitada ou o host está inacessível.")
        print(f"Detalhes do erro: {e}")
        print("\nCaso não se lembre da senha, redefina ela no Dashboard do Supabase:")
        print("Configurações do Projeto -> Database -> Reset Database Password")
        sys.exit(1)

    # 3. Executa as Migrações SQL
    migracoes = [
        {"nome": "Fase 1 - SaaS Multitenant", "path": "instalador_otica_windows/database/saas_migration.sql"},
        {"nome": "Fase 2 - Biometria Óptica", "path": "instalador_otica_windows/database/saas_migration_v2_biometria.sql"}
    ]
    
    print("\n[2/3] Executando scripts de migração SQL...")
    for mig in migracoes:
        path = mig["path"]
        nome = mig["nome"]
        
        if not os.path.exists(path):
            print(f" ❌ Arquivo não encontrado: {path}")
            continue
            
        print(f" -> Aplicando {nome} ({path})...")
        try:
            with open(path, "r", encoding="utf-8") as f:
                sql_content = f.read()
            
            # Executa o conteúdo da migração
            cursor.execute(sql_content)
            conn.commit()
            print(f"   ✅ {nome} aplicado com sucesso!")
        except Exception as e:
            conn.rollback()
            print(f"   ❌ Falha ao aplicar {nome}. Detalhes: {e}")
            conn.close()
            sys.exit(1)

    # 4. Atualiza os arquivos .env.local locais com a senha do banco
    print("\n[3/3] Atualizando arquivos de configuração local (.env.local)...")
    arquivos_env = [
        ".env.local",
        "instalador_otica_windows/backend/.env.local",
        "instalador_otica_windows/.env"
    ]
    
    for env_path in arquivos_env:
        if os.path.exists(env_path):
            try:
                with open(env_path, "r", encoding="utf-8") as f:
                    lines = f.readlines()
                
                novas_linhas = []
                alterado = False
                password_encoded = urllib.parse.quote_plus(password)
                for line in lines:
                    if line.startswith("DATABASE_URL="):
                        line = f"DATABASE_URL=postgresql://postgres:{password_encoded}@db.ulrrtzbxcsywmtshdnbp.supabase.co:5432/postgres\n"
                        alterado = True
                    novas_linhas.append(line)
                    
                if alterado:
                    with open(env_path, "w", encoding="utf-8") as f:
                        f.writelines(novas_linhas)
                    print(f"   ✅ Arquivo atualizado: {env_path}")
            except Exception as e:
                print(f"   ❌ Não foi possível atualizar {env_path}. Detalhes: {e}")

    conn.close()
    print("\n" + "=" * 80)
    print("       🎉 DEPLOY DE BANCO DE DADOS E CONFIGURAÇÕES CONCLUÍDOS COM SUCESSO!")
    print("=" * 80)

if __name__ == "__main__":
    main()
