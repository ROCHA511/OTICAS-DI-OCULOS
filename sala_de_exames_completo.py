import os
from datetime import datetime, date
from typing import List, Optional

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Float, ForeignKey, Enum as SQLEnum, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from pydantic import BaseModel, Field
from enum import Enum

# Configuração do Banco de Dados — usa PostgreSQL do Supabase em produção
_DB_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./sala_de_exames.db"  # fallback local apenas para desenvolvimento offline
)

# SQLAlchemy não aceita o prefixo "postgres://" do Supabase — corrige para "postgresql://"
if _DB_URL.startswith("postgres://"):
    _DB_URL = _DB_URL.replace("postgres://", "postgresql://", 1)

# Para PostgreSQL, não usar connect_args do SQLite
_is_sqlite = _DB_URL.startswith("sqlite")
if _is_sqlite:
    engine = create_engine(_DB_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(
        _DB_URL,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
        connect_args={"connect_timeout": 10}
    )

SQLALCHEMY_DATABASE_URL = _DB_URL
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()



# Modelos SQLAlchemy

# Enums
class StatusAtendimento(str, Enum):
    AGUARDANDO = "Aguardando"
    EM_ATENDIMENTO = "Em Atendimento"
    FINALIZADO = "Finalizado"
    REAGENDADO = "Reagendado"
    CANCELADO = "Cancelado"

class PrioridadeAtendimento(str, Enum):
    NORMAL = "Normal"
    URGENTE = "Urgente"

class TipoDocumento(str, Enum):
    RECEITA_ANTIGA = "Receita Antiga"
    FOTO_RECEITA = "Foto da Receita"
    FOTO_OCULOS = "Foto dos Óculos"
    FOTO_OLHOS = "Foto dos Olhos"
    RETINOGRAFIA = "Retinografia"
    CAMPO_VISUAL = "Campo Visual"
    OCT = "OCT"
    LAUDOS = "Laudos"
    OUTROS = "Outros Documentos"

class StatusReceita(str, Enum):
    PENDENTE = "Pendente"
    PROCESSADA = "Processada"
    CONCLUIDA = "Concluída"


# 1. Paciente (Base para outros modelos)
class Paciente(Base):
    __tablename__ = "pacientes"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    cpf = Column(String, unique=True, index=True)
    data_nascimento = Column(DateTime)
    genero = Column(String)
    telefone = Column(String)
    email = Column(String, unique=True, index=True)
    endereco = Column(String)

    atendimentos = relationship("Atendimento", back_populates="paciente")
    pre_anamneses = relationship("PreAnamnese", back_populates="paciente")
    documentos = relationship("DocumentoAnexado", back_populates="paciente")
    prontuarios = relationship("Prontuario", back_populates="paciente")
    receitas = relationship("ReceitaDigital", back_populates="paciente")


# 2. Atendimento (Lista de Atendimento)
class Atendimento(Base):
    __tablename__ = "atendimentos"

    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"))
    horario_agendado = Column(DateTime)
    status = Column(SQLEnum(StatusAtendimento), default=StatusAtendimento.AGUARDANDO)
    prioridade = Column(SQLEnum(PrioridadeAtendimento), default=PrioridadeAtendimento.NORMAL)
    profissional_responsavel = Column(String)
    observacoes = Column(String, nullable=True)
    pre_anamnese_concluida = Column(Boolean, default=False)
    receita_antiga_anexada = Column(Boolean, default=False)
    quantidade_anexos = Column(Integer, default=0)
    indicador_ia = Column(Boolean, default=False)
    data_criacao = Column(DateTime, default=datetime.now)
    data_atualizacao = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    paciente = relationship("Paciente", back_populates="atendimentos")
    pre_anamnese = relationship("PreAnamnese", uselist=False, back_populates="atendimento")
    prontuario = relationship("Prontuario", uselist=False, back_populates="atendimento")


# 3. Pré-Anamnese com IA
class PreAnamnese(Base):
    __tablename__ = "pre_anamneses"

    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"))
    atendimento_id = Column(Integer, ForeignKey("atendimentos.id"), unique=True)
    link_acesso = Column(String, unique=True, index=True)
    data_preenchimento = Column(DateTime, nullable=True)
    principal_queixa = Column(String, nullable=True)
    tempo_queixa = Column(String, nullable=True)
    dores_cabeca = Column(Boolean, nullable=True)
    visao_embacada = Column(Boolean, nullable=True)
    visao_dupla = Column(Boolean, nullable=True)
    olhos_secos = Column(Boolean, nullable=True)
    sensibilidade_luz = Column(Boolean, nullable=True)
    ardencia_ocular = Column(Boolean, nullable=True)
    coceira_ocular = Column(Boolean, nullable=True)
    uso_oculos = Column(Boolean, nullable=True)
    uso_lentes_contato = Column(Boolean, nullable=True)
    receita_anterior = Column(Boolean, nullable=True)
    ultimo_exame = Column(DateTime, nullable=True)
    cirurgia_ocular_previa = Column(Boolean, nullable=True)
    diabetes = Column(Boolean, nullable=True)
    hipertensao = Column(Boolean, nullable=True)
    glaucoma = Column(Boolean, nullable=True)
    catarata = Column(Boolean, nullable=True)
    uso_medicamentos = Column(String, nullable=True)
    profissao = Column(String, nullable=True)
    tempo_computador = Column(Integer, nullable=True)
    tempo_celular = Column(Integer, nullable=True)
    historico_familiar = Column(String, nullable=True)
    outras_doencas = Column(String, nullable=True)
    resumo_ia = Column(Text, nullable=True) # Resumo gerado pela IA
    pontos_atencao_ia = Column(Text, nullable=True) # Pontos de atenção identificados pela IA

    paciente = relationship("Paciente", back_populates="pre_anamneses")
    atendimento = relationship("Atendimento", back_populates="pre_anamnese")


# 4. Documento Anexado
class DocumentoAnexado(Base):
    __tablename__ = "documentos_anexados"

    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"))
    atendimento_id = Column(Integer, ForeignKey("atendimentos.id"), nullable=True) # Pode ser anexado fora de um atendimento específico
    tipo_documento = Column(SQLEnum(TipoDocumento))
    nome_arquivo = Column(String)
    url_arquivo = Column(String) # URL para o armazenamento do arquivo
    data_upload = Column(DateTime, default=datetime.now)
    conteudo_ocr = Column(Text, nullable=True) # Conteúdo extraído via OCR, se aplicável
    dados_ocr_json = Column(Text, nullable=True) # Dados estruturados do OCR em JSON

    paciente = relationship("Paciente", back_populates="documentos")


# 5. Prontuário Digital
class Prontuario(Base):
    __tablename__ = "prontuarios"

    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"))
    atendimento_id = Column(Integer, ForeignKey("atendimentos.id"), unique=True)
    data_consulta = Column(DateTime, default=datetime.now)
    profissional_responsavel = Column(String)

    # 10.1. Anamnese e Histórico
    queixa_principal = Column(String)
    historia_atual = Column(String)
    historico_ocular = Column(String, nullable=True)
    historico_sistemico = Column(String, nullable=True)

    # 10.2. Acuidade Visual e Refração
    acuidade_visual_od_sc = Column(String, nullable=True) # OD Sem Correção
    acuidade_visual_oe_sc = Column(String, nullable=True) # OE Sem Correção
    acuidade_visual_od_cc = Column(String, nullable=True) # OD Com Correção
    acuidade_visual_oe_cc = Column(String, nullable=True) # OE Com Correção

    # Refração Objetiva
    ref_obj_od_esferico = Column(Float, nullable=True)
    ref_obj_od_cilindro = Column(Float, nullable=True)
    ref_obj_od_eixo = Column(Integer, nullable=True)
    ref_obj_oe_esferico = Column(Float, nullable=True)
    ref_obj_oe_cilindro = Column(Float, nullable=True)
    ref_obj_oe_eixo = Column(Integer, nullable=True)

    # Refração Subjetiva
    ref_sub_od_esferico = Column(Float, nullable=True)
    ref_sub_od_cilindro = Column(Float, nullable=True)
    ref_sub_od_eixo = Column(Integer, nullable=True)
    ref_sub_od_adicao = Column(Float, nullable=True)
    ref_sub_od_prisma = Column(String, nullable=True)
    ref_sub_oe_esferico = Column(Float, nullable=True)
    ref_sub_oe_cilindro = Column(Float, nullable=True)
    ref_sub_oe_eixo = Column(Integer, nullable=True)
    ref_sub_oe_adicao = Column(Float, nullable=True)
    ref_sub_oe_prisma = Column(String, nullable=True)

    dp = Column(Float, nullable=True) # Distância Pupilar
    dnp_od = Column(Float, nullable=True) # Distância Naso-Pupilar OD
    dnp_oe = Column(Float, nullable=True) # Distância Naso-Pupilar OE
    altura = Column(Float, nullable=True)
    centro_optico = Column(String, nullable=True)
    curva_base = Column(String, nullable=True)
    aro = Column(String, nullable=True)
    ponte = Column(String, nullable=True)
    haste = Column(String, nullable=True)

    # 10.3. Exames Complementares e Diagnóstico
    visao_cores = Column(String, nullable=True)
    estereopsia = Column(String, nullable=True)
    motilidade = Column(String, nullable=True)
    cover_test = Column(String, nullable=True)
    ppc = Column(Float, nullable=True)
    amsler = Column(String, nullable=True)
    tonometria_od = Column(Float, nullable=True)
    tonometria_oe = Column(Float, nullable=True)
    biomicroscopia = Column(String, nullable=True)
    fundoscopia = Column(String, nullable=True)
    diagnostico = Column(String)
    conduta = Column(String)
    tratamento = Column(String, nullable=True)
    recomendacoes = Column(String, nullable=True)
    data_retorno = Column(DateTime, nullable=True)
    observacoes_prontuario = Column(String, nullable=True)

    paciente = relationship("Paciente", back_populates="prontuarios")
    atendimento = relationship("Atendimento", back_populates="prontuario")


# 6. Receita Digital
class ReceitaDigital(Base):
    __tablename__ = "receitas_digitais"

    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"))
    prontuario_id = Column(Integer, ForeignKey("prontuarios.id"), unique=True)
    profissional_id = Column(Integer) # ID do profissional que emitiu
    data_emissao = Column(DateTime, default=datetime.now)
    data_validade = Column(DateTime)
    numero_unico = Column(String, unique=True, index=True)
    hash_criptografico = Column(String, unique=True)
    url_pdf = Column(String) # URL para o PDF da receita
    url_qr_code = Column(String) # URL para a imagem do QR Code
    status = Column(SQLEnum(StatusReceita), default=StatusReceita.PENDENTE)

    # Dados da Receita (espelho do prontuário, mas focado na receita)
    od_esferico = Column(Float, nullable=True)
    od_cilindro = Column(Float, nullable=True)
    od_eixo = Column(Integer, nullable=True)
    od_adicao = Column(Float, nullable=True)
    od_dnp = Column(Float, nullable=True)

    oe_esferico = Column(Float, nullable=True)
    oe_cilindro = Column(Float, nullable=True)
    oe_eixo = Column(Integer, nullable=True)
    oe_adicao = Column(Float, nullable=True)
    oe_dnp = Column(Float, nullable=True)

    dp_receita = Column(Float, nullable=True)
    adicao_receita = Column(Float, nullable=True)
    observacoes_receita = Column(String, nullable=True)

    paciente = relationship("Paciente", back_populates="receitas")


# Cria as tabelas no banco de dados
Base.metadata.create_all(bind=engine)


# Modelos Pydantic (Schemas para API)

# Schemas para Enums
class StatusAtendimentoSchema(StatusAtendimento):
    pass

class PrioridadeAtendimentoSchema(PrioridadeAtendimento):
    pass

class TipoDocumentoSchema(TipoDocumento):
    pass

class StatusReceitaSchema(StatusReceita):
    pass


# Schemas para Paciente
class PacienteBase(BaseModel):
    nome: str
    cpf: str
    data_nascimento: datetime
    genero: str
    telefone: str
    email: str
    endereco: str

class PacienteCreate(PacienteBase):
    pass

class PacienteUpdate(PacienteBase):
    nome: Optional[str] = None
    cpf: Optional[str] = None
    data_nascimento: Optional[datetime] = None
    genero: Optional[str] = None
    telefone: Optional[str] = None
    email: Optional[str] = None
    endereco: Optional[str] = None

class PacienteSchema(PacienteBase):
    id: int

    class Config:
        from_attributes = True


# Schemas para Atendimento
class AtendimentoBase(BaseModel):
    paciente_id: int
    horario_agendado: datetime
    status: StatusAtendimentoSchema = StatusAtendimentoSchema.AGUARDANDO
    prioridade: PrioridadeAtendimentoSchema = PrioridadeAtendimentoSchema.NORMAL
    profissional_responsavel: str
    observacoes: Optional[str] = None
    pre_anamnese_concluida: bool = False
    receita_antiga_anexada: bool = False
    quantidade_anexos: int = 0
    indicador_ia: bool = False

class AtendimentoCreate(AtendimentoBase):
    pass

class AtendimentoUpdate(AtendimentoBase):
    horario_agendado: Optional[datetime] = None
    status: Optional[StatusAtendimentoSchema] = None
    prioridade: Optional[PrioridadeAtendimentoSchema] = None
    profissional_responsavel: Optional[str] = None
    observacoes: Optional[str] = None
    pre_anamnese_concluida: Optional[bool] = None
    receita_antiga_anexada: Optional[bool] = None
    quantidade_anexos: Optional[int] = None
    indicador_ia: Optional[bool] = None

class AtendimentoSchema(AtendimentoBase):
    id: int
    data_criacao: datetime
    data_atualizacao: datetime
    paciente: PacienteSchema

    class Config:
        from_attributes = True


# Schemas para Pré-Anamnese
class PreAnamneseBase(BaseModel):
    paciente_id: int
    atendimento_id: int
    link_acesso: str
    data_preenchimento: Optional[datetime] = None
    principal_queixa: Optional[str] = None
    tempo_queixa: Optional[str] = None
    dores_cabeca: Optional[bool] = None
    visao_embacada: Optional[bool] = None
    visao_dupla: Optional[bool] = None
    olhos_secos: Optional[bool] = None
    sensibilidade_luz: Optional[bool] = None
    ardencia_ocular: Optional[bool] = None
    coceira_ocular: Optional[bool] = None
    uso_oculos: Optional[bool] = None
    uso_lentes_contato: Optional[bool] = None
    receita_anterior: Optional[bool] = None
    ultimo_exame: Optional[datetime] = None
    cirurgia_ocular_previa: Optional[bool] = None
    diabetes: Optional[bool] = None
    hipertensao: Optional[bool] = None
    glaucoma: Optional[bool] = None
    catarata: Optional[bool] = None
    uso_medicamentos: Optional[str] = None
    profissao: Optional[str] = None
    tempo_computador: Optional[int] = None
    tempo_celular: Optional[int] = None
    historico_familiar: Optional[str] = None
    outras_doencas: Optional[str] = None
    resumo_ia: Optional[str] = None
    pontos_atencao_ia: Optional[str] = None

class PreAnamneseCreate(PreAnamneseBase):
    pass

class PreAnamneseUpdate(PreAnamneseBase):
    link_acesso: Optional[str] = None
    data_preenchimento: Optional[datetime] = None
    principal_queixa: Optional[str] = None
    tempo_queixa: Optional[str] = None
    dores_cabeca: Optional[bool] = None
    visao_embacada: Optional[bool] = None
    visao_dupla: Optional[bool] = None
    olhos_secos: Optional[bool] = None
    sensibilidade_luz: Optional[bool] = None
    ardencia_ocular: Optional[bool] = None
    coceira_ocular: Optional[bool] = None
    uso_oculos: Optional[bool] = None
    uso_lentes_contato: Optional[bool] = None
    receita_anterior: Optional[bool] = None
    ultimo_exame: Optional[datetime] = None
    cirurgia_ocular_previa: Optional[bool] = None
    diabetes: Optional[bool] = None
    hipertensao: Optional[bool] = None
    glaucoma: Optional[bool] = None
    catarata: Optional[bool] = None
    uso_medicamentos: Optional[str] = None
    profissao: Optional[str] = None
    tempo_computador: Optional[int] = None
    tempo_celular: Optional[int] = None
    historico_familiar: Optional[str] = None
    outras_doencas: Optional[str] = None
    resumo_ia: Optional[str] = None
    pontos_atencao_ia: Optional[str] = None

class PreAnamneseSchema(PreAnamneseBase):
    id: int

    class Config:
        from_attributes = True


# Schemas para DocumentoAnexado
class DocumentoAnexadoBase(BaseModel):
    paciente_id: int
    atendimento_id: Optional[int] = None
    tipo_documento: TipoDocumentoSchema
    nome_arquivo: str
    url_arquivo: str
    conteudo_ocr: Optional[str] = None
    dados_ocr_json: Optional[str] = None

class DocumentoAnexadoCreate(DocumentoAnexadoBase):
    pass

class DocumentoAnexadoSchema(DocumentoAnexadoBase):
    id: int
    data_upload: datetime

    class Config:
        from_attributes = True


# Schemas para Prontuario
class ProntuarioBase(BaseModel):
    paciente_id: int
    atendimento_id: int
    data_consulta: datetime
    profissional_responsavel: str

    # Anamnese e Histórico
    queixa_principal: str
    historia_atual: str
    historico_ocular: Optional[str] = None
    historico_sistemico: Optional[str] = None

    # Acuidade Visual e Refração
    acuidade_visual_od_sc: Optional[str] = None
    acuidade_visual_oe_sc: Optional[str] = None
    acuidade_visual_od_cc: Optional[str] = None
    acuidade_visual_oe_cc: Optional[str] = None

    ref_obj_od_esferico: Optional[float] = None
    ref_obj_od_cilindro: Optional[float] = None
    ref_obj_od_eixo: Optional[int] = None
    ref_obj_oe_esferico: Optional[float] = None
    ref_obj_oe_cilindro: Optional[float] = None
    ref_obj_oe_eixo: Optional[int] = None

    ref_sub_od_esferico: Optional[float] = None
    ref_sub_od_cilindro: Optional[float] = None
    ref_sub_od_eixo: Optional[int] = None
    ref_sub_od_adicao: Optional[float] = None
    ref_sub_od_prisma: Optional[str] = None
    ref_sub_oe_esferico: Optional[float] = None
    ref_sub_oe_cilindro: Optional[float] = None
    ref_sub_oe_eixo: Optional[int] = None
    ref_sub_oe_adicao: Optional[float] = None
    ref_sub_oe_prisma: Optional[str] = None

    dp: Optional[float] = None
    dnp_od: Optional[float] = None
    dnp_oe: Optional[float] = None
    altura: Optional[float] = None
    centro_optico: Optional[str] = None
    curva_base: Optional[str] = None
    aro: Optional[str] = None
    ponte: Optional[str] = None
    haste: Optional[str] = None

    # Exames Complementares e Diagnóstico
    visao_cores: Optional[str] = None
    estereopsia: Optional[str] = None
    motilidade: Optional[str] = None
    cover_test: Optional[str] = None
    ppc: Optional[float] = None
    amsler: Optional[str] = None
    tonometria_od: Optional[float] = None
    tonometria_oe: Optional[float] = None
    biomicroscopia: Optional[str] = None
    fundoscopia: Optional[str] = None
    diagnostico: str
    conduta: str
    tratamento: Optional[str] = None
    recomendacoes: Optional[str] = None
    data_retorno: Optional[datetime] = None
    observacoes_prontuario: Optional[str] = None

class ProntuarioCreate(ProntuarioBase):
    pass

class ProntuarioUpdate(ProntuarioBase):
    data_consulta: Optional[datetime] = None
    profissional_responsavel: Optional[str] = None
    queixa_principal: Optional[str] = None
    historia_atual: Optional[str] = None
    historico_ocular: Optional[str] = None
    historico_sistemico: Optional[str] = None
    acuidade_visual_od_sc: Optional[str] = None
    acuidade_visual_oe_sc: Optional[str] = None
    acuidade_visual_od_cc: Optional[str] = None
    acuidade_visual_oe_cc: Optional[str] = None
    ref_obj_od_esferico: Optional[float] = None
    ref_obj_od_cilindro: Optional[float] = None
    ref_obj_od_eixo: Optional[int] = None
    ref_obj_oe_esferico: Optional[float] = None
    ref_obj_oe_cilindro: Optional[float] = None
    ref_obj_oe_eixo: Optional[int] = None
    ref_sub_od_esferico: Optional[float] = None
    ref_sub_od_cilindro: Optional[float] = None
    ref_sub_od_eixo: Optional[int] = None
    ref_sub_od_adicao: Optional[float] = None
    ref_sub_od_prisma: Optional[str] = None
    ref_sub_oe_esferico: Optional[float] = None
    ref_sub_oe_cilindro: Optional[float] = None
    ref_sub_oe_eixo: Optional[int] = None
    ref_sub_oe_adicao: Optional[float] = None
    ref_sub_oe_prisma: Optional[str] = None
    dp: Optional[float] = None
    dnp_od: Optional[float] = None
    dnp_oe: Optional[float] = None
    altura: Optional[float] = None
    centro_optico: Optional[str] = None
    curva_base: Optional[str] = None
    aro: Optional[str] = None
    ponte: Optional[str] = None
    haste: Optional[str] = None
    visao_cores: Optional[str] = None
    estereopsia: Optional[str] = None
    motilidade: Optional[str] = None
    cover_test: Optional[str] = None
    ppc: Optional[float] = None
    amsler: Optional[str] = None
    tonometria_od: Optional[float] = None
    tonometria_oe: Optional[float] = None
    biomicroscopia: Optional[str] = None
    fundoscopia: Optional[str] = None
    diagnostico: Optional[str] = None
    conduta: Optional[str] = None
    tratamento: Optional[str] = None
    recomendacoes: Optional[str] = None
    data_retorno: Optional[datetime] = None
    observacoes_prontuario: Optional[str] = None

class ProntuarioSchema(ProntuarioBase):
    id: int

    class Config:
        from_attributes = True


# Schemas para Receita Digital
class ReceitaDigitalBase(BaseModel):
    paciente_id: int
    prontuario_id: int
    profissional_id: int
    data_emissao: datetime
    data_validade: datetime
    numero_unico: str
    hash_criptografico: str
    url_pdf: str
    url_qr_code: str
    status: StatusReceitaSchema = StatusReceitaSchema.PENDENTE
    od_esferico: Optional[float] = None
    od_cilindro: Optional[float] = None
    od_eixo: Optional[int] = None
    od_adicao: Optional[float] = None
    od_dnp: Optional[float] = None
    oe_esferico: Optional[float] = None
    oe_cilindro: Optional[float] = None
    oe_eixo: Optional[int] = None
    oe_adicao: Optional[float] = None
    oe_dnp: Optional[float] = None
    dp_receita: Optional[float] = None
    adicao_receita: Optional[float] = None
    observacoes_receita: Optional[str] = None

class ReceitaDigitalCreate(ReceitaDigitalBase):
    pass

class ReceitaDigitalUpdate(ReceitaDigitalBase):
    data_validade: Optional[datetime] = None
    status: Optional[StatusReceitaSchema] = None
    od_esferico: Optional[float] = None
    od_cilindro: Optional[float] = None
    od_eixo: Optional[int] = None
    od_adicao: Optional[float] = None
    od_dnp: Optional[float] = None
    oe_esferico: Optional[float] = None
    oe_cilindro: Optional[float] = None
    oe_eixo: Optional[int] = None
    oe_adicao: Optional[float] = None
    oe_dnp: Optional[float] = None
    dp_receita: Optional[float] = None
    adicao_receita: Optional[float] = None
    observacoes_receita: Optional[str] = None

class ReceitaDigitalSchema(ReceitaDigitalBase):
    id: int

    class Config:
        from_attributes = True


# Dependência para obter a sessão do banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Funções CRUD (Exemplo para Paciente)

def get_paciente(db: SessionLocal, paciente_id: int):
    """Obtém um paciente pelo ID."""
    return db.query(Paciente).filter(Paciente.id == paciente_id).first()

def get_paciente_by_cpf(db: SessionLocal, cpf: str):
    """Obtém um paciente pelo CPF."""
    return db.query(Paciente).filter(Paciente.cpf == cpf).first()

def get_pacientes(db: SessionLocal, skip: int = 0, limit: int = 100):
    """Obtém uma lista de pacientes."""
    return db.query(Paciente).offset(skip).limit(limit).all()

def create_paciente(db: SessionLocal, paciente: PacienteCreate):
    """Cria um novo paciente."""
    db_paciente = Paciente(**paciente.model_dump())
    db.add(db_paciente)
    db.commit()
    db.refresh(db_paciente)
    return db_paciente

def update_paciente(db: SessionLocal, paciente_id: int, paciente: PacienteUpdate):
    """Atualiza um paciente existente."""
    db_paciente = db.query(Paciente).filter(Paciente.id == paciente_id).first()
    if db_paciente:
        for key, value in paciente.model_dump(exclude_unset=True).items():
            setattr(db_paciente, key, value)
        db.commit()
        db.refresh(db_paciente)
    return db_paciente

def delete_paciente(db: SessionLocal, paciente_id: int):
    """Deleta um paciente pelo ID."""
    db_paciente = db.query(Paciente).filter(Paciente.id == paciente_id).first()
    if db_paciente:
        db.delete(db_paciente)
        db.commit()
    return db_paciente


# Funções CRUD para Atendimento

def get_atendimento(db: SessionLocal, atendimento_id: int):
    """Obtém um atendimento pelo ID."""
    return db.query(Atendimento).filter(Atendimento.id == atendimento_id).first()

def get_atendimentos(db: SessionLocal, skip: int = 0, limit: int = 100):
    """Obtém uma lista de atendimentos."""
    return db.query(Atendimento).offset(skip).limit(limit).all()

def create_atendimento(db: SessionLocal, atendimento: AtendimentoCreate):
    """Cria um novo atendimento."""
    db_atendimento = Atendimento(**atendimento.model_dump())
    db.add(db_atendimento)
    db.commit()
    db.refresh(db_atendimento)
    return db_atendimento

def update_atendimento(db: SessionLocal, atendimento_id: int, atendimento: AtendimentoUpdate):
    """Atualiza um atendimento existente."""
    db_atendimento = db.query(Atendimento).filter(Atendimento.id == atendimento_id).first()
    if db_atendimento:
        for key, value in atendimento.model_dump(exclude_unset=True).items():
            setattr(db_atendimento, key, value)
        db.commit()
        db.refresh(db_atendimento)
    return db_atendimento

def delete_atendimento(db: SessionLocal, atendimento_id: int):
    """Deleta um atendimento pelo ID."""
    db_atendimento = db.query(Atendimento).filter(Atendimento.id == atendimento_id).first()
    if db_atendimento:
        db.delete(db_atendimento)
        db.commit()
    return db_atendimento


# Funções CRUD para Pré-Anamnese

def get_pre_anamnese(db: SessionLocal, pre_anamnese_id: int):
    """Obtém uma pré-anamnese pelo ID."""
    return db.query(PreAnamnese).filter(PreAnamnese.id == pre_anamnese_id).first()

def get_pre_anamnese_by_atendimento_id(db: SessionLocal, atendimento_id: int):
    """Obtém uma pré-anamnese pelo ID do atendimento."""
    return db.query(PreAnamnese).filter(PreAnamnese.atendimento_id == atendimento_id).first()

def create_pre_anamnese(db: SessionLocal, pre_anamnese: PreAnamneseCreate):
    """Cria uma nova pré-anamnese."""
    db_pre_anamnese = PreAnamnese(**pre_anamnese.model_dump())
    db.add(db_pre_anamnese)
    db.commit()
    db.refresh(db_pre_anamnese)
    return db_pre_anamnese

def update_pre_anamnese(db: SessionLocal, pre_anamnese_id: int, pre_anamnese: PreAnamneseUpdate):
    """Atualiza uma pré-anamnese existente."""
    db_pre_anamnese = db.query(PreAnamnese).filter(PreAnamnese.id == pre_anamnese_id).first()
    if db_pre_anamnese:
        for key, value in pre_anamnese.model_dump(exclude_unset=True).items():
            setattr(db_pre_anamnese, key, value)
        db.commit()
        db.refresh(db_pre_anamnese)
    return db_pre_anamnese


# Funções CRUD para DocumentoAnexado

def get_documento_anexado(db: SessionLocal, documento_id: int):
    """Obtém um documento anexado pelo ID."""
    return db.query(DocumentoAnexado).filter(DocumentoAnexado.id == documento_id).first()

def get_documentos_by_paciente(db: SessionLocal, paciente_id: int, skip: int = 0, limit: int = 100):
    """Obtém documentos anexados de um paciente."""
    return db.query(DocumentoAnexado).filter(DocumentoAnexado.paciente_id == paciente_id).offset(skip).limit(limit).all()

def create_documento_anexado(db: SessionLocal, documento: DocumentoAnexadoCreate):
    """Cria um novo documento anexado."""
    db_documento = DocumentoAnexado(**documento.model_dump())
    db.add(db_documento)
    db.commit()
    db.refresh(db_documento)
    return db_documento


# Funções CRUD para Prontuario

def get_prontuario(db: SessionLocal, prontuario_id: int):
    """Obtém um prontuário pelo ID."""
    return db.query(Prontuario).filter(Prontuario.id == prontuario_id).first()

def get_prontuario_by_atendimento_id(db: SessionLocal, atendimento_id: int):
    """Obtém um prontuário pelo ID do atendimento."""
    return db.query(Prontuario).filter(Prontuario.atendimento_id == atendimento_id).first()

def get_prontuarios_by_paciente(db: SessionLocal, paciente_id: int, skip: int = 0, limit: int = 100):
    """Obtém prontuários de um paciente."""
    return db.query(Prontuario).filter(Prontuario.paciente_id == paciente_id).offset(skip).limit(limit).all()

def create_prontuario(db: SessionLocal, prontuario: ProntuarioCreate):
    """Cria um novo prontuário."""
    db_prontuario = Prontuario(**prontuario.model_dump())
    db.add(db_prontuario)
    db.commit()
    db.refresh(db_prontuario)
    return db_prontuario

def update_prontuario(db: SessionLocal, prontuario_id: int, prontuario: ProntuarioUpdate):
    """Atualiza um prontuário existente."""
    db_prontuario = db.query(Prontuario).filter(Prontuario.id == prontuario_id).first()
    if db_prontuario:
        for key, value in prontuario.model_dump(exclude_unset=True).items():
            setattr(db_prontuario, key, value)
        db.commit()
        db.refresh(db_prontuario)
    return db_prontuario


# Funções CRUD para ReceitaDigital

def get_receita_digital(db: SessionLocal, receita_id: int):
    """Obtém uma receita digital pelo ID."""
    return db.query(ReceitaDigital).filter(ReceitaDigital.id == receita_id).first()

def get_receita_digital_by_prontuario_id(db: SessionLocal, prontuario_id: int):
    """Obtém uma receita digital pelo ID do prontuário."""
    return db.query(ReceitaDigital).filter(ReceitaDigital.prontuario_id == prontuario_id).first()

def create_receita_digital(db: SessionLocal, receita: ReceitaDigitalCreate):
    """Cria uma nova receita digital."""
    db_receita = ReceitaDigital(**receita.model_dump())
    db.add(db_receita)
    db.commit()
    db.refresh(db_receita)
    return db_receita

def update_receita_digital(db: SessionLocal, receita_id: int, receita: ReceitaDigitalUpdate):
    """Atualiza uma receita digital existente."""
    db_receita = db.query(ReceitaDigital).filter(ReceitaDigital.id == receita_id).first()
    if db_receita:
        for key, value in receita.model_dump(exclude_unset=True).items():
            setattr(db_receita, key, value)
        db.commit()
        db.refresh(db_receita)
    return db_receita


# Funções de Negócio e Integração (Esboços)

def gerar_link_pre_anamnese(paciente_id: int, atendimento_id: int) -> str:
    """Gera um link seguro e exclusivo para a pré-anamnese do paciente."""
    # Lógica para gerar um token seguro e o link
    return f"https://otica_inteligente.com/pre_anamnese/{paciente_id}/{atendimento_id}/abc123token"

def processar_ocr_receita(documento_id: int) -> dict:
    """Processa um documento de receita via OCR e extrai dados relevantes."""
    # Simulação de extração OCR
    print(f"Processando OCR para documento {documento_id}...")
    dados_extraidos = {
        "OD_esferico": -2.50,
        "OD_cilindro": -0.75,
        "OD_eixo": 180,
        "OD_adicao": 1.50,
        "OD_dp": 32.0,
        "OE_esferico": -3.00,
        "OE_cilindro": -1.00,
        "OE_eixo": 10,
        "OE_adicao": 1.50,
        "OE_dp": 32.0,
        "observacoes": "Receita com validade de 1 ano."
    }
    return dados_extraidos

def gerar_receita_pdf(receita_id: int) -> str:
    """Gera o PDF da receita digital e retorna a URL."""
    return f"https://otica_inteligente.com/receitas/pdf/{receita_id}.pdf"

def gerar_qr_code_autenticacao(receita_id: int, numero_unico: str, hash_receita: str) -> str:
    """Gera um QR Code para autenticação da receita e retorna a URL da imagem."""
    conteudo_qr = f"https://otica_inteligente.com/validar_receita?id={receita_id}&num={numero_unico}&hash={hash_receita}"
    return f"https://otica_inteligente.com/receitas/qrcode/{receita_id}.png"

def integrar_com_modulo_otica(receita_id: int) -> bool:
    """Envia a receita digital para o módulo da ótica."""
    print(f"Integrando receita {receita_id} com o módulo da ótica...")
    return True

def gerar_ordem_servico_otica(receita_id: int) -> Optional[str]:
    """Gera uma ordem de serviço no módulo da ótica, se configurado."""
    print(f"Gerando Ordem de Serviço para receita {receita_id} no módulo da ótica...")
    return f"OS-{receita_id}-XYZ"

def assistente_ia_analisar_anamnese(pre_anamnese_data: PreAnamneseCreate) -> dict:
    """A IA analisa os dados da pré-anamnese e retorna um resumo e pontos de atenção."""
    resumo = "Paciente com queixa principal de visão embaçada. Refere dores de cabeça ocasionais. Não usa óculos atualmente."
    pontos_atencao = "Verificar histórico de diabetes e hipertensão. Avaliar acuidade visual e refração."
    return {"resumo_ia": resumo, "pontos_atencao_ia": pontos_atencao}

def assistente_ia_sugerir_diagnostico(prontuario_data: ProntuarioCreate) -> List[str]:
    """A IA sugere possíveis diagnósticos optométricos com base nos dados do prontuário."""
    return ["Miopia", "Astigmatismo", "Presbiopia inicial"]

def assistente_ia_detectar_inconsistencias(prontuario_data: ProntuarioCreate) -> List[str]:
    """A IA detecta inconsistências ou anomalias nos dados do prontuário."""
    inconsistencias = []
    if prontuario_data.ref_obj_od_esferico and prontuario_data.ref_sub_od_esferico:
        if abs(prontuario_data.ref_obj_od_esferico - prontuario_data.ref_sub_od_esferico) > 1.0:
            inconsistencias.append("Diferença significativa entre refração objetiva e subjetiva OD.")
    return inconsistencias

def assistente_ia_sugerir_perguntas(prontuario_data: ProntuarioCreate) -> List[str]:
    """A IA sugere perguntas adicionais para o profissional."""
    return ["O paciente sente melhora com óculos antigos?", "Há histórico de trauma ocular?"]

def assistente_ia_alertar_fatores_risco(paciente_id: int, prontuario_data: ProntuarioCreate) -> List[str]:
    """A IA alerta sobre fatores de risco para doenças oculares/sistêmicas."""
    riscos = []
    if prontuario_data.tonometria_od and prontuario_data.tonometria_od > 21:
        riscos.append("Pressão intraocular elevada no OD. Risco de glaucoma.")
    return risks

def assistente_ia_sugerir_encaminhamento(prontuario_data: ProntuarioCreate) -> Optional[str]:
    """A IA recomenda encaminhamento a um especialista, se necessário."""
    if "glaucoma" in prontuario_data.diagnostico.lower():
        return "Encaminhamento para oftalmologista especialista em glaucoma."
    return None

def assistente_ia_sugerir_tratamentos(diagnostico: str) -> List[str]:
    """A IA propõe opções de tratamento ou condutas."""
    if "miopia" in diagnostico.lower():
        return ["Prescrição de lentes corretivas para miopia", "Aconselhamento sobre higiene visual."]
    return []

def assistente_ia_gerar_observacoes_tecnicas(prontuario_data: ProntuarioCreate) -> str:
    """A IA auxilia na redação de observações técnicas."""
    return f"Paciente apresenta {prontuario_data.queixa_principal}. Refração subjetiva indica {prontuario_data.ref_sub_od_esferico} OD e {prontuario_data.ref_sub_oe_esferico} OE."


# Funções para Estatísticas (Esboços)

def get_estatisticas_atendimentos_por_status() -> dict:
    """Retorna estatísticas de atendimentos por status."""
    return {
        "Aguardando": 15,
        "Em Atendimento": 5,
        "Finalizado": 120,
        "Cancelado": 10
    }

def get_estatisticas_diagnosticos_comuns() -> dict:
    """Retorna os diagnósticos mais comuns."""
    return {
        "Miopia": 30,
        "Astigmatismo": 25,
        "Presbiopia": 20,
        "Hipermetropia": 15
    }


# Funções para Automações (Esboços)

def agendar_envio_link_pre_anamnese(paciente_id: int, atendimento_id: int, horario_envio: datetime):
    """Agenda o envio do link da pré-anamnese para o paciente."""
    print(f"Agendando envio do link da pré-anamnese para paciente {paciente_id} no atendimento {atendimento_id} em {horario_envio}.")


def automatizar_criacao_os_otica(receita_id: int):
    """Automatiza a criação de Ordem de Serviço na ótica após emissão da receita."""
    print(f"Automatizando criação de OS para receita {receita_id}.")
    gerar_ordem_servico_otica(receita_id)


# Funções para Permissões (Esboços)

def verificar_permissao(usuario_id: int, acao: str, recurso: str) -> bool:
    """Verifica se o usuário tem permissão para realizar uma ação em um recurso."""
    print(f"Verificando permissão para usuário {usuario_id} realizar '{acao}' em '{recurso}'.")
    return True


# Funções para Busca Avançada (Esboços)

def buscar_prontuarios_avancado(db: SessionLocal, termo_busca: str, data_inicio: Optional[datetime] = None, data_fim: Optional[datetime] = None, diagnostico: Optional[str] = None, skip: int = 0, limit: int = 100) -> List[Prontuario]:
    """Realiza uma busca avançada em prontuários."""
    query = db.query(Prontuario)

    if termo_busca:
        query = query.filter(
            (Prontuario.queixa_principal.contains(termo_busca)) |
            (Prontuario.historia_atual.contains(termo_busca)) |
            (Prontuario.diagnostico.contains(termo_busca)) |
            (Prontuario.observacoes_prontuario.contains(termo_busca))
        )
    if data_inicio:
        query = query.filter(Prontuario.data_consulta >= data_inicio)
    if data_fim:
        query = query.filter(Prontuario.data_consulta <= data_fim)
    if diagnostico:
        query = query.filter(Prontuario.diagnostico.contains(diagnostico))

    return query.offset(skip).limit(limit).all()


# Configuração do FastAPI
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Módulo Sala de Exames - Ótica Inteligente")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Endpoints para Paciente
@app.post("/pacientes/", response_model=PacienteSchema)
def create_paciente_endpoint(paciente: PacienteCreate, db: Session = Depends(get_db)):
    """Cria um novo paciente no sistema."""
    db_paciente = get_paciente_by_cpf(db, cpf=paciente.cpf)
    if db_paciente:
        raise HTTPException(status_code=400, detail="CPF já cadastrado")
    return create_paciente(db=db, paciente=paciente)

@app.get("/pacientes/", response_model=List[PacienteSchema])
def read_pacientes_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retorna uma lista de pacientes."""
    pacientes = get_pacientes(db, skip=skip, limit=limit)
    return pacientes

@app.get("/pacientes/{paciente_id}", response_model=PacienteSchema)
def read_paciente_endpoint(paciente_id: int, db: Session = Depends(get_db)):
    """Retorna um paciente específico pelo ID."""
    db_paciente = get_paciente(db, paciente_id=paciente_id)
    if db_paciente is None:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    return db_paciente

@app.put("/pacientes/{paciente_id}", response_model=PacienteSchema)
def update_paciente_endpoint(paciente_id: int, paciente: PacienteUpdate, db: Session = Depends(get_db)):
    """Atualiza as informações de um paciente existente."""
    db_paciente = update_paciente(db, paciente_id, paciente)
    if db_paciente is None:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    return db_paciente

@app.delete("/pacientes/{paciente_id}")
def delete_paciente_endpoint(paciente_id: int, db: Session = Depends(get_db)):
    """Deleta um paciente do sistema."""
    db_paciente = delete_paciente(db, paciente_id)
    if db_paciente is None:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    return {"message": "Paciente deletado com sucesso"}


# Endpoints para Atendimento
@app.post("/atendimentos/", response_model=AtendimentoSchema)
def create_atendimento_endpoint(atendimento: AtendimentoCreate, db: Session = Depends(get_db)):
    """Cria um novo atendimento para um paciente."""
    return create_atendimento(db=db, atendimento=atendimento)

@app.get("/atendimentos/", response_model=List[AtendimentoSchema])
def read_atendimentos_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retorna uma lista de atendimentos."""
    atendimentos = db.query(Atendimento).options(relationship(Paciente)).offset(skip).limit(limit).all()
    return atendimentos

@app.get("/atendimentos/{atendimento_id}", response_model=AtendimentoSchema)
def read_atendimento_endpoint(atendimento_id: int, db: Session = Depends(get_db)):
    """Retorna um atendimento específico pelo ID."""
    db_atendimento = db.query(Atendimento).options(relationship(Paciente)).filter(Atendimento.id == atendimento_id).first()
    if db_atendimento is None:
        raise HTTPException(status_code=404, detail="Atendimento não encontrado")
    return db_atendimento

@app.put("/atendimentos/{atendimento_id}", response_model=AtendimentoSchema)
def update_atendimento_endpoint(atendimento_id: int, atendimento: AtendimentoUpdate, db: Session = Depends(get_db)):
    """Atualiza as informações de um atendimento existente."""
    db_atendimento = update_atendimento(db, atendimento_id, atendimento)
    if db_atendimento is None:
        raise HTTPException(status_code=404, detail="Atendimento não encontrado")
    return db_atendimento

@app.delete("/atendimentos/{atendimento_id}")
def delete_atendimento_endpoint(atendimento_id: int, db: Session = Depends(get_db)):
    """Deleta um atendimento do sistema."""
    db_atendimento = delete_atendimento(db, atendimento_id)
    if db_atendimento is None:
        raise HTTPException(status_code=404, detail="Atendimento não encontrado")
    return {"message": "Atendimento deletado com sucesso"}


# Endpoints para Pré-Anamnese
@app.post("/pre_anamneses/", response_model=PreAnamneseSchema)
def create_pre_anamnese_endpoint(pre_anamnese: PreAnamneseCreate, db: Session = Depends(get_db)):
    """Cria uma nova pré-anamnese para um atendimento."""
    db_pre_anamnese = get_pre_anamnese_by_atendimento_id(db, atendimento_id=pre_anamnese.atendimento_id)
    if db_pre_anamnese:
        raise HTTPException(status_code=400, detail="Já existe uma pré-anamnese para este atendimento")
    
    analise_ia = assistente_ia_analisar_anamnese(pre_anamnese)
    pre_anamnese.resumo_ia = analise_ia["resumo_ia"]
    pre_anamnese.pontos_atencao_ia = analise_ia["pontos_atencao_ia"]

    return create_pre_anamnese(db=db, pre_anamnese=pre_anamnese)

@app.get("/pre_anamneses/{pre_anamnese_id}", response_model=PreAnamneseSchema)
def read_pre_anamnese_endpoint(pre_anamnese_id: int, db: Session = Depends(get_db)):
    """Retorna uma pré-anamnese específica pelo ID."""
    db_pre_anamnese = get_pre_anamnese(db, pre_anamnese_id=pre_anamnese_id)
    if db_pre_anamnese is None:
        raise HTTPException(status_code=404, detail="Pré-Anamnese não encontrada")
    return db_pre_anamnese

@app.put("/pre_anamneses/{pre_anamnese_id}", response_model=PreAnamneseSchema)
def update_pre_anamnese_endpoint(pre_anamnese_id: int, pre_anamnese: PreAnamneseUpdate, db: Session = Depends(get_db)):
    """Atualiza as informações de uma pré-anamnese existente."""
    db_pre_anamnese = update_pre_anamnese(db, pre_anamnese_id, pre_anamnese)
    if db_pre_anamnese is None:
        raise HTTPException(status_code=404, detail="Pré-Anamnese não encontrada")
    return db_pre_anamnese


# Endpoints para DocumentoAnexado
@app.post("/documentos/", response_model=DocumentoAnexadoSchema)
def create_documento_endpoint(documento: DocumentoAnexadoCreate, db: Session = Depends(get_db)):
    """Faz upload de um novo documento e o anexa a um paciente/atendimento."""
    if documento.tipo_documento == TipoDocumento.RECEITA_ANTIGA or documento.tipo_documento == TipoDocumento.FOTO_RECEITA:
        dados_ocr = processar_ocr_receita(1)
        documento.dados_ocr_json = str(dados_ocr)
        documento.conteudo_ocr = "Conteúdo textual extraído via OCR (simulado)"

    return create_documento_anexado(db=db, documento=documento)

@app.get("/documentos/{documento_id}", response_model=DocumentoAnexadoSchema)
def read_documento_endpoint(documento_id: int, db: Session = Depends(get_db)):
    """Retorna um documento anexado específico pelo ID."""
    db_documento = get_documento_anexado(db, documento_id=documento_id)
    if db_documento is None:
        raise HTTPException(status_code=404, detail="Documento não encontrado")
    return db_documento

@app.get("/pacientes/{paciente_id}/documentos/", response_model=List[DocumentoAnexadoSchema])
def read_documentos_paciente_endpoint(paciente_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retorna uma lista de documentos anexados de um paciente."""
    documentos = get_documentos_by_paciente(db, paciente_id=paciente_id, skip=skip, limit=limit)
    return documentos


# Endpoints para Prontuário
@app.post("/prontuarios/", response_model=ProntuarioSchema)
def create_prontuario_endpoint(prontuario: ProntuarioCreate, db: Session = Depends(get_db)):
    """Cria um novo prontuário para um atendimento."""
    db_prontuario = get_prontuario_by_atendimento_id(db, atendimento_id=prontuario.atendimento_id)
    if db_prontuario:
        raise HTTPException(status_code=400, detail="Já existe um prontuário para este atendimento")
    return create_prontuario(db=db, prontuario=prontuario)

@app.get("/prontuarios/{prontuario_id}", response_model=ProntuarioSchema)
def read_prontuario_endpoint(prontuario_id: int, db: Session = Depends(get_db)):
    """Retorna um prontuário específico pelo ID."""
    db_prontuario = get_prontuario(db, prontuario_id=prontuario_id)
    if db_prontuario is None:
        raise HTTPException(status_code=404, detail="Prontuário não encontrado")
    return db_prontuario

@app.put("/prontuarios/{prontuario_id}", response_model=ProntuarioSchema)
def update_prontuario_endpoint(prontuario_id: int, prontuario: ProntuarioUpdate, db: Session = Depends(get_db)):
    """Atualiza as informações de um prontuário existente."""
    db_prontuario = update_prontuario(db, prontuario_id, prontuario)
    if db_prontuario is None:
        raise HTTPException(status_code=404, detail="Prontuário não encontrado")
    return db_prontuario

@app.get("/pacientes/{paciente_id}/prontuarios/", response_model=List[ProntuarioSchema])
def read_prontuarios_paciente_endpoint(paciente_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retorna uma lista de prontuários de um paciente."""
    prontuarios = get_prontuarios_by_paciente(db, paciente_id=paciente_id, skip=skip, limit=limit)
    return prontuarios

@app.get("/atendimentos/{atendimento_id}/prontuario", response_model=Optional[ProntuarioSchema])
def read_prontuario_by_atendimento_endpoint(atendimento_id: int, db: Session = Depends(get_db)):
    """Retorna o prontuário associado ao atendimento, se houver."""
    return get_prontuario_by_atendimento_id(db, atendimento_id=atendimento_id)

@app.get("/atendimentos/{atendimento_id}/pre_anamnese", response_model=Optional[PreAnamneseSchema])
def read_pre_anamnese_by_atendimento_endpoint(atendimento_id: int, db: Session = Depends(get_db)):
    """Retorna a pré-anamnese associada ao atendimento, se houver."""
    return get_pre_anamnese_by_atendimento_id(db, atendimento_id=atendimento_id)

@app.get("/prontuarios/{prontuario_id}/receita", response_model=Optional[ReceitaDigitalSchema])
def read_receita_by_prontuario_endpoint(prontuario_id: int, db: Session = Depends(get_db)):
    """Retorna a receita digital associada ao prontuário, se houver."""
    return get_receita_digital_by_prontuario_id(db, prontuario_id=prontuario_id)


# Endpoints para Receita Digital
@app.post("/receitas/", response_model=ReceitaDigitalSchema)
def create_receita_endpoint(receita: ReceitaDigitalCreate, db: Session = Depends(get_db)):
    """Cria uma nova receita digital e gera PDF/QR Code."""
    db_receita = get_receita_digital_by_prontuario_id(db, prontuario_id=receita.prontuario_id)
    if db_receita:
        raise HTTPException(status_code=400, detail="Já existe uma receita digital para este prontuário")
    
    receita.url_pdf = gerar_receita_pdf(0)
    receita.url_qr_code = gerar_qr_code_autenticacao(0, receita.numero_unico, receita.hash_criptografico)

    nova_receita = create_receita_digital(db=db, receita=receita)

    nova_receita.url_pdf = gerar_receita_pdf(nova_receita.id)
    nova_receita.url_qr_code = gerar_qr_code_autenticacao(nova_receita.id, nova_receita.numero_unico, nova_receita.hash_criptografico)
    db.add(nova_receita)
    db.commit()
    db.refresh(nova_receita)

    integrar_com_modulo_otica(nova_receita.id)
    gerar_ordem_servico_otica(nova_receita.id)

    return nova_receita

@app.get("/receitas/{receita_id}", response_model=ReceitaDigitalSchema)
def read_receita_endpoint(receita_id: int, db: Session = Depends(get_db)):
    """Retorna uma receita digital específica pelo ID."""
    db_receita = get_receita_digital(db, receita_id=receita_id)
    if db_receita is None:
        raise HTTPException(status_code=404, detail="Receita Digital não encontrada")
    return db_receita

@app.put("/receitas/{receita_id}", response_model=ReceitaDigitalSchema)
def update_receita_endpoint(receita_id: int, receita: ReceitaDigitalUpdate, db: Session = Depends(get_db)):
    """Atualiza as informações de uma receita digital existente."""
    db_receita = update_receita_digital(db, receita_id, receita)
    if db_receita is None:
        raise HTTPException(status_code=404, detail="Receita Digital não encontrada")
    return db_receita


# Endpoints para Assistente IA
@app.post("/ia/analisar_anamnese/", response_model=dict)
def ia_analisar_anamnese_endpoint(pre_anamnese: PreAnamneseCreate):
    """A IA analisa os dados da pré-anamnese e retorna um resumo e pontos de atenção."""
    return assistente_ia_analisar_anamnese(pre_anamnese)

@app.post("/ia/sugerir_diagnostico/", response_model=List[str])
def ia_sugerir_diagnostico_endpoint(prontuario: ProntuarioCreate):
    """A IA sugere possíveis diagnósticos optométricos com base nos dados do prontuário."""
    return assistente_ia_sugerir_diagnostico(prontuario)

@app.post("/ia/detectar_inconsistencias/", response_model=List[str])
def ia_detectar_inconsistencias_endpoint(prontuario: ProntuarioCreate):
    """A IA detecta inconsistências ou anomalias nos dados do prontuário."""
    return assistente_ia_detectar_inconsistencias(prontuario)

@app.post("/ia/sugerir_perguntas/", response_model=List[str])
def ia_sugerir_perguntas_endpoint(prontuario: ProntuarioCreate):
    """A IA sugere perguntas adicionais para o profissional."""
    return assistente_ia_sugerir_perguntas(prontuario)

@app.post("/ia/alertar_fatores_risco/{paciente_id}", response_model=List[str])
def ia_alertar_fatores_risco_endpoint(paciente_id: int, prontuario: ProntuarioCreate, db: Session = Depends(get_db)):
    """A IA alerta sobre fatores de risco para doenças oculares/sistêmicas."""
    return assistente_ia_alertar_fatores_risco(paciente_id, prontuario)

@app.post("/ia/sugerir_encaminhamento/", response_model=Optional[str])
def ia_sugerir_encaminhamento_endpoint(prontuario: ProntuarioCreate):
    """A IA recomenda encaminhamento a um especialista, se necessário."""
    return assistente_ia_sugerir_encaminhamento(prontuario)

@app.post("/ia/sugerir_tratamentos/", response_model=List[str])
def ia_sugerir_tratamentos_endpoint(diagnostico: str):
    """A IA propõe opções de tratamento ou condutas."""
    return assistente_ia_sugerir_tratamentos(diagnostico)

@app.post("/ia/gerar_observacoes_tecnicas/", response_model=str)
def ia_gerar_observacoes_tecnicas_endpoint(prontuario: ProntuarioCreate):
    """A IA auxilia na redação de observações técnicas."""
    return assistente_ia_gerar_observacoes_tecnicas(prontuario)


# Endpoints para Estatísticas
@app.get("/estatisticas/atendimentos_por_status/", response_model=dict)
def get_atendimentos_por_status_endpoint():
    """Retorna estatísticas de atendimentos por status."""
    return get_estatisticas_atendimentos_por_status()

@app.get("/estatisticas/diagnosticos_comuns/", response_model=dict)
def get_diagnosticos_comuns_endpoint():
    """Retorna os diagnósticos mais comuns."""
    return get_estatisticas_diagnosticos_comuns()


# Endpoints para Automações
@app.post("/automacoes/agendar_envio_link_pre_anamnese/")
def agendar_envio_link_pre_anamnese_endpoint(paciente_id: int, atendimento_id: int, horario_envio: datetime):
    """Agenda o envio do link da pré-anamnese para o paciente."""
    agendar_envio_link_pre_anamnese(paciente_id, atendimento_id, horario_envio)
    return {"message": "Envio do link da pré-anamnese agendado com sucesso."}

@app.post("/automacoes/automatizar_criacao_os_otica/{receita_id}")
def automatizar_criacao_os_otica_endpoint(receita_id: int):
    """Automatiza a criação de Ordem de Serviço na ótica após emissão da receita."""
    automatizar_criacao_os_otica(receita_id)
    return {"message": "Criação de Ordem de Serviço automatizada com sucesso."}


# Endpoints para Permissões
@app.get("/permissoes/verificar/{usuario_id}/{acao}/{recurso}", response_model=bool)
def verificar_permissao_endpoint(usuario_id: int, acao: str, recurso: str):
    """Verifica se o usuário tem permissão para realizar uma ação em um recurso."""
    return verificar_permissao(usuario_id, acao, recurso)


# Endpoints para Busca Avançada
@app.get("/busca_avancada/prontuarios/", response_model=List[ProntuarioSchema])
def buscar_prontuarios_avancado_endpoint(
    termo_busca: Optional[str] = None,
    data_inicio: Optional[datetime] = None,
    data_fim: Optional[datetime] = None,
    diagnostico: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Realiza uma busca avançada em prontuários."""
    return buscar_prontuarios_avancado(db, termo_busca, data_inicio, data_fim, diagnostico, skip, limit)


# Endpoint para validação de receita via QR Code (simulado)
@app.get("/validar_receita")
def validar_receita_qrcode_endpoint(id: int, num: str, hash: str):
    """Endpoint para validar uma receita digital via QR Code."""
    if id == 1 and num == "REC-20260802-001" and hash == "abc123def456":
        return {
            "Receita Válida": True,
            "Nome": "João Silva",
            "Data": datetime(2026, 8, 2).isoformat(),
            "Profissional": "Dra. Ana Costa",
            "Número": num,
            "Hash": hash,
            "Autenticidade": True
        }
    raise HTTPException(status_code=404, detail="Receita não encontrada ou inválida.")


# Exemplo de uso (para demonstração) e inicialização automática
if __name__ == "__main__":
    print("Criando tabelas no banco de dados...")
    Base.metadata.create_all(bind=engine)
    print("Tabelas criadas com sucesso!")

    db = SessionLocal()

    print("\nVerificando se o paciente demonstração existe...")
    paciente_existente = get_paciente_by_cpf(db, "123.456.789-00")
    if not paciente_existente:
        paciente_data = PacienteCreate(
            nome="João Silva",
            cpf="123.456.789-00",
            data_nascimento=datetime(1985, 5, 10),
            genero="Masculino",
            telefone="(11) 98765-4321",
            email="joao.silva@example.com",
            endereco="Rua Exemplo, 123 - São Paulo"
        )
        novo_paciente = create_paciente(db, paciente_data)
        print(f"Paciente criado: {novo_paciente.nome} (ID: {novo_paciente.id})")

        print("\nCriando atendimento...")
        atendimento_data = AtendimentoCreate(
            paciente_id=novo_paciente.id,
            horario_agendado=datetime(2026, 8, 2, 10, 0),
            profissional_responsavel="Dra. Ana Costa"
        )
        novo_atendimento = create_atendimento(db, atendimento_data)
        print(f"Atendimento criado para {novo_paciente.nome} (ID: {novo_atendimento.id})")

        link = gerar_link_pre_anamnese(novo_paciente.id, novo_atendimento.id)
        print(f"Link de Pré-Anamnese: {link}")

        print("\nCriando pré-anamnese...")
        pre_anamnese_data = PreAnamneseCreate(
            paciente_id=novo_paciente.id,
            atendimento_id=novo_atendimento.id,
            link_acesso=link,
            data_preenchimento=datetime.now(),
            principal_queixa="Visão embaçada para longe",
            tempo_queixa="6 meses",
            dores_cabeca=True,
            uso_oculos=False,
            diabetes=False,
            hipertensao=False
        )
        nova_pre_anamnese = create_pre_anamnese(db, pre_anamnese_data)
        print(f"Pré-Anamnese criada (ID: {nova_pre_anamnese.id})")

        analise_ia = assistente_ia_analisar_anamnese(pre_anamnese_data)
        print(f"Resumo IA: {analise_ia['resumo_ia']}")
        print(f"Pontos de Atenção IA: {analise_ia['pontos_atencao_ia']}")

        update_atendimento(db, novo_atendimento.id, AtendimentoUpdate(pre_anamnese_concluida=True, indicador_ia=True))

        print("\nCriando prontuário...")
        prontuario_data = ProntuarioCreate(
            paciente_id=novo_paciente.id,
            atendimento_id=novo_atendimento.id,
            data_consulta=datetime.now(),
            profissional_responsavel="Dra. Ana Costa",
            queixa_principal="Visão embaçada",
            historia_atual="Paciente relata dificuldade para enxergar placas de trânsito.",
            diagnostico="Miopia",
            conduta="Prescrição de lentes corretivas.",
            ref_sub_od_esferico=-2.00,
            ref_sub_od_cilindro=-0.50,
            ref_sub_od_eixo=180,
            ref_sub_oe_esferico=-2.25,
            ref_sub_oe_cilindro=-0.75,
            ref_sub_oe_eixo=10,
            dp=64.0
        )
        novo_prontuario = create_prontuario(db, prontuario_data)
        print(f"Prontuário criado (ID: {novo_prontuario.id})")

        print("\nCriando receita digital...")
        receita_data = ReceitaDigitalCreate(
            paciente_id=novo_paciente.id,
            prontuario_id=novo_prontuario.id,
            profissional_id=1,
            data_emissao=datetime.now(),
            data_validade=datetime(2027, 8, 2),
            numero_unico="REC-20260802-001",
            hash_criptografico="abc123def456",
            url_pdf="",
            url_qr_code="",
            od_esferico=-2.00,
            od_cilindro=-0.50,
            od_eixo=180,
            oe_esferico=-2.25,
            oe_cilindro=-0.75,
            oe_eixo=10,
            dp_receita=64.0
        )
        nova_receita = create_receita_digital(db, receita_data)
        print(f"Receita Digital criada (ID: {nova_receita.id})")
    else:
        print("Dados de demonstração já existentes no banco.")

    db.close()
    print("\nExemplo de uso concluído.")

    print("\nIniciando o servidor FastAPI de produção na porta 8000...")
    import uvicorn
    uvicorn.run("sala_de_exames_completo:app", host="127.0.0.1", port=8000, reload=False)
