import uuid
from sqlalchemy import Column, String, Integer, Numeric, DateTime, Date, ForeignKey, Enum as SqlEnum, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

# ============================================================================
# DEFINIÇÃO DOS MODELOS ORM SAAS DA ÓTICA INTELIGENTE
# ============================================================================

class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nome_fantasia = Column(String(255), nullable=False)
    razao_social = Column(String(255), nullable=False)
    cnpj = Column(String(18), unique=True, nullable=False)
    plano_atual = Column(String(50), default="starter", nullable=False) # 'starter', 'professional', 'premium_ia', 'visufit_ai'
    status = Column(String(50), default="ativo", nullable=False)
    criado_em = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class Filial(Base):
    __tablename__ = "filiais"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    nome = Column(String(150), nullable=False)
    cnpj = Column(String(18), unique=True)
    telefone = Column(String(50))
    endereco = Column(String)
    cidade = Column(String(100))
    estado = Column(String(2))
    criado_em = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class Perfil(Base):
    __tablename__ = "perfis"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    filial_id = Column(UUID(as_uuid=True), ForeignKey("filiais.id", ondelete="SET NULL"))
    nome = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    telefone = Column(String(50))
    role = Column(String(50), default="cliente") # 'ceo', 'lider', 'profissional', 'cliente'
    status = Column(String(50), default="ativo")  # 'ativo', 'inativo'
    criado_em = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    atualizado_em = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relacionamentos
    profissional = relationship("Profissional", uselist=False, back_populates="perfil", foreign_keys="[Profissional.id]")
    cliente = relationship("Cliente", uselist=False, back_populates="perfil", foreign_keys="[Cliente.id]")


class Profissional(Base):
    __tablename__ = "profissionais"

    id = Column(UUID(as_uuid=True), ForeignKey("perfis.id", ondelete="CASCADE"), primary_key=True)
    especialidade = Column(String(100))
    crm_registro = Column(String(50))
    leader_id = Column(UUID(as_uuid=True), ForeignKey("perfis.id", ondelete="SET NULL"))
    criado_em = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relacionamentos
    perfil = relationship("Perfil", back_populates="profissional", foreign_keys=[id])
    lider = relationship("Perfil", foreign_keys=[leader_id])
    vendas = relationship("Venda", back_populates="profissional")
    comissoes = relationship("Comissao", back_populates="profissional")
    agenda = relationship("Agenda", back_populates="profissional")


class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(UUID(as_uuid=True), ForeignKey("perfis.id", ondelete="CASCADE"), primary_key=True)
    cpf = Column(String(14), unique=True)
    data_nascimento = Column(Date)
    endereco = Column(String)
    cidade = Column(String(100))
    estado = Column(String(2))
    cep = Column(String(9))
    criado_em = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relacionamentos
    perfil = relationship("Perfil", back_populates="cliente")
    receitas = relationship("Receita", back_populates="cliente")
    vendas = relationship("Venda", back_populates="cliente")
    agenda = relationship("Agenda", back_populates="cliente")


class Produto(Base):
    __tablename__ = "produtos"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    nome = Column(String(255), nullable=False)
    descricao = Column(String)
    preco_venda = Column(Numeric(10, 2), nullable=False)
    preco_custo = Column(Numeric(10, 2), nullable=False)
    estoque_atual = Column(Integer, default=0, nullable=False)
    estoque_minimo = Column(Integer, default=0, nullable=False)
    categoria = Column(String(100), default="lentes")
    criado_em = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    atualizado_em = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Constraints adicionais de validação
    __table_args__ = (
        CheckConstraint("preco_venda >= 0", name="chk_preco_venda_positivo"),
        CheckConstraint("preco_custo >= 0", name="chk_preco_custo_positivo"),
        CheckConstraint("estoque_atual >= 0", name="chk_estoque_atual_positivo"),
        CheckConstraint("estoque_minimo >= 0", name="chk_estoque_minimo_positivo"),
    )


class Receita(Base):
    __tablename__ = "receitas"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    cliente_id = Column(UUID(as_uuid=True), ForeignKey("clientes.id", ondelete="CASCADE"), nullable=False)
    medico_id = Column(UUID(as_uuid=True), ForeignKey("profissionais.id", ondelete="SET NULL"))
    
    # Detalhes de Grau Ótico
    esferico_od = Column(Numeric(4, 2), default=0.00)
    cilindrico_od = Column(Numeric(4, 2), default=0.00)
    eixo_od = Column(Integer, default=0)
    adicao_od = Column(Numeric(4, 2), default=0.00)
    esferico_oe = Column(Numeric(4, 2), default=0.00)
    cilindrico_oe = Column(Numeric(4, 2), default=0.00)
    eixo_oe = Column(Integer, default=0)
    adicao_oe = Column(Numeric(4, 2), default=0.00)
    dnp_od = Column(Numeric(4, 2), default=0.00)
    dnp_oe = Column(Numeric(4, 2), default=0.00)
    altura_od = Column(Numeric(4, 2), default=0.00)
    altura_oe = Column(Numeric(4, 2), default=0.00)
    
    data_emissao = Column(Date, server_default=func.current_date())
    validade = Column(Date)
    criado_em = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relacionamentos
    cliente = relationship("Cliente", back_populates="receitas")
    profissional = relationship("Profissional")
    vendas = relationship("Venda", back_populates="receita")


class Venda(Base):
    __tablename__ = "vendas"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    filial_id = Column(UUID(as_uuid=True), ForeignKey("filiais.id", ondelete="SET NULL"))
    cliente_id = Column(UUID(as_uuid=True), ForeignKey("clientes.id", ondelete="CASCADE"), nullable=False)
    profissional_id = Column(UUID(as_uuid=True), ForeignKey("profissionais.id", ondelete="CASCADE"), nullable=False)
    receita_id = Column(UUID(as_uuid=True), ForeignKey("receitas.id", ondelete="SET NULL"))
    status = Column(String(50), default="aberto") # 'aberto', 'em_producao', 'pronto', 'entregue', 'cancelado'
    valor_total = Column(Numeric(10, 2), default=0.00, nullable=False)
    desconto = Column(Numeric(10, 2), default=0.00, nullable=False)
    
    criado_em = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    atualizado_em = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relacionamentos
    cliente = relationship("Cliente", back_populates="vendas")
    profissional = relationship("Profissional", back_populates="vendas")
    receita = relationship("Receita", back_populates="vendas")
    itens = relationship("VendaItem", back_populates="venda", cascade="all, delete-orphan")
    transacoes = relationship("TransacaoFinanceira", back_populates="venda")
    comissoes = relationship("Comissao", back_populates="venda")


class VendaItem(Base):
    __tablename__ = "vendas_itens"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    venda_id = Column(UUID(as_uuid=True), ForeignKey("vendas.id", ondelete="CASCADE"), nullable=False)
    produto_id = Column(UUID(as_uuid=True), ForeignKey("produtos.id", ondelete="CASCADE"), nullable=False)
    quantidade = Column(Integer, nullable=False)
    preco_unitario = Column(Numeric(10, 2), nullable=False)
    criado_em = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relacionamentos
    venda = relationship("Venda", back_populates="itens")
    produto = relationship("Produto")


class Caixa(Base):
    __tablename__ = "caixa"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    filial_id = Column(UUID(as_uuid=True), ForeignKey("filiais.id", ondelete="SET NULL"))
    operador_id = Column(UUID(as_uuid=True), ForeignKey("perfis.id", ondelete="CASCADE"), nullable=False)
    data_abertura = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    data_fechamento = Column(DateTime(timezone=True))
    saldo_inicial = Column(Numeric(10, 2), default=0.00, nullable=False)
    saldo_final = Column(Numeric(10, 2))
    status = Column(String(50), default="aberto") # 'aberto', 'fechado'
    criado_em = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relacionamentos
    operador = relationship("Perfil")
    transacoes = relationship("TransacaoFinanceira", back_populates="caixa")


class TransacaoFinanceira(Base):
    __tablename__ = "transacoes_financeiras"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    caixa_id = Column(UUID(as_uuid=True), ForeignKey("caixa.id", ondelete="CASCADE"), nullable=False)
    venda_id = Column(UUID(as_uuid=True), ForeignKey("vendas.id", ondelete="SET NULL"))
    tipo = Column(String(50), nullable=False) # 'entrada', 'saida'
    valor = Column(Numeric(10, 2), nullable=False)
    forma_pagamento = Column(String(50), nullable=False) # 'pix', 'cartao_credito', 'cartao_debito', 'dinheiro', 'parcelado'
    descricao = Column(String)
    criado_em = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relacionamentos
    caixa = relationship("Caixa", back_populates="transacoes")
    venda = relationship("Venda", back_populates="transacoes")
    parcelas = relationship("Parcela", back_populates="transacao", cascade="all, delete-orphan")


class Parcela(Base):
    __tablename__ = "parcelas"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    transacao_id = Column(UUID(as_uuid=True), ForeignKey("transacoes_financeiras.id", ondelete="CASCADE"), nullable=False)
    numero_parcela = Column(Integer, nullable=False)
    valor = Column(Numeric(10, 2), nullable=False)
    data_vencimento = Column(Date, nullable=False)
    data_pagamento = Column(Date)
    status = Column(String(50), default="pendente") # 'pendente', 'pago', 'atrasado'
    criado_em = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relacionamentos
    transacao = relationship("TransacaoFinanceira", back_populates="parcelas")


class Comissao(Base):
    __tablename__ = "comissoes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    profissional_id = Column(UUID(as_uuid=True), ForeignKey("profissionais.id", ondelete="CASCADE"), nullable=False)
    venda_id = Column(UUID(as_uuid=True), ForeignKey("vendas.id", ondelete="CASCADE"), nullable=False)
    valor_comissao = Column(Numeric(10, 2), nullable=False)
    percentual = Column(Numeric(5, 2), nullable=False)
    status = Column(String(50), default="pendente") # 'pendente', 'pago'
    data_pagamento = Column(Date)
    criado_em = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relacionamentos
    profissional = relationship("Profissional", back_populates="comissoes")
    venda = relationship("Venda", back_populates="comissoes")


class Agenda(Base):
    __tablename__ = "agenda"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    filial_id = Column(UUID(as_uuid=True), ForeignKey("filiais.id", ondelete="SET NULL"))
    cliente_id = Column(UUID(as_uuid=True), ForeignKey("clientes.id", ondelete="CASCADE"), nullable=False)
    profissional_id = Column(UUID(as_uuid=True), ForeignKey("profissionais.id", ondelete="CASCADE"), nullable=False)
    data_hora = Column(DateTime(timezone=True), nullable=False)
    status = Column(String(50), default="agendado") # 'agendado', 'confirmado', 'realizado', 'cancelado'
    observacoes = Column(String)
    criado_em = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relacionamentos
    cliente = relationship("Cliente", back_populates="agenda")
    profissional = relationship("Profissional", back_populates="agenda")


class MensagemWhatsapp(Base):
    __tablename__ = "mensagens_whatsapp"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    remetente_id = Column(UUID(as_uuid=True), ForeignKey("perfis.id", ondelete="CASCADE"), nullable=False)
    destinatario_id = Column(UUID(as_uuid=True), ForeignKey("perfis.id", ondelete="SET NULL"))
    telefone_destinatario = Column(String(50), nullable=False)
    mensagem = Column(String, nullable=False)
    status_envio = Column(String(50), default="pendente") # 'pendente', 'enviado', 'entregue', 'falhou'
    logs_erro = Column(String)
    criado_em = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class LogAuditoria(Base):
    __tablename__ = "logs_auditoria"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    usuario_id = Column(UUID(as_uuid=True), ForeignKey("perfis.id", ondelete="SET NULL"))
    acao = Column(String(100), nullable=False)
    tabela = Column(String(100), nullable=False)
    registro_id = Column(UUID(as_uuid=True))
    dados_anteriores = Column(JSONB)
    dados_novos = Column(JSONB)
    ip_address = Column(String(45))
    criado_em = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class ClienteBiometriaOptica(Base):
    __tablename__ = "cliente_biometria_optica"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    cliente_id = Column(UUID(as_uuid=True), ForeignKey("perfis.id", ondelete="CASCADE"), nullable=False)
    venda_os_id = Column(UUID(as_uuid=True), ForeignKey("vendas.id", ondelete="SET NULL"))
    receita_id = Column(UUID(as_uuid=True), ForeignKey("receitas.id", ondelete="SET NULL"))

    # Parâmetros Oculares
    dp_total = Column(Numeric(5, 2), nullable=False)
    dnp_od = Column(Numeric(4, 2), nullable=False)
    dnp_oe = Column(Numeric(4, 2), nullable=False)
    altura_od_real = Column(Numeric(4, 2), nullable=False)
    altura_oe_real = Column(Numeric(4, 2), nullable=False)

    # Parâmetros de Centragem / Armação
    co_od_horizontal = Column(Numeric(4, 2), nullable=False)
    co_oe_horizontal = Column(Numeric(4, 2), nullable=False)
    co_od_vertical = Column(Numeric(4, 2), nullable=False)
    co_oe_vertical = Column(Numeric(4, 2), nullable=False)

    # Parâmetros de Armação Física
    distancia_vertice = Column(Numeric(4, 2))
    angulo_pantoscopico = Column(Numeric(4, 2))
    face_form = Column(Numeric(4, 2))
    assimetria_facial = Column(Numeric(4, 2))
    inclinacao_cabeca = Column(Numeric(4, 2))

    # Auditoria de IA
    indice_confianca_ia = Column(Numeric(4, 2), default=1.00)
    dados_face_mesh = Column(JSONB)
    foto_scan_url = Column(String)

    criado_em = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
