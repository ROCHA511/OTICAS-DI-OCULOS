import os
from dotenv import load_dotenv

# Tenta carregar o arquivo .env.local primeiro (segurança local), senão o .env padrão
if os.path.exists(".env.local"):
    load_dotenv(".env.local")
elif os.path.exists("backend/.env.local"):
    load_dotenv("backend/.env.local")
else:
    load_dotenv()

# Carrega DATABASE_URL das variáveis de ambiente. Caso não exista, utiliza um fallback para desenvolvimento.
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/otica_inteligente")

# Configura o engine do SQLAlchemy. 
# pool_pre_ping=True ajuda a recuperar conexões perdidas silenciosamente (ideal para Supabase Serverless)
engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_recycle=3600,
    pool_pre_ping=True
)

# Cria sessão local configurada
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base declarativa para criação dos modelos do ORM
Base = declarative_base()

# Dependência do FastAPI para obter a sessão de banco de dados por requisição
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
