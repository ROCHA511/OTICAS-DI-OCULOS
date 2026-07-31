import datetime
import os
from dotenv import load_dotenv

# Tenta carregar as variáveis locais do .env.local
if os.path.exists(".env.local"):
    load_dotenv(".env.local")
elif os.path.exists("backend/.env.local"):
    load_dotenv("backend/.env.local")
else:
    load_dotenv()

import jwt
from typing import List, Optional
from uuid import UUID
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from database import get_db
import models

app = FastAPI(title="Ótica Inteligente API", version="2.0.0")

# Habilita CORS para conexão com o frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer(auto_error=False)
JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")

def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    # Fallback de desenvolvimento se JWT_SECRET não estiver configurado ou credentials estiver vazio
    if not JWT_SECRET or not credentials:
        return {"id": "00000000-0000-0000-0000-000000000000", "email": "dev@otica.com", "role": "ceo"}
    
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"], audience="authenticated")
        return {
            "id": payload.get("sub"),
            "email": payload.get("email"),
            "role": payload.get("user_metadata", {}).get("role", "cliente")
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token JWT expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token JWT inválido")

from fastapi import Header

def get_current_tenant(x_tenant_id: Optional[str] = Header(None)):
    # Fallback para tenant padrão de desenvolvimento se não fornecido
    if not x_tenant_id:
        return UUID("00000000-0000-0000-0000-000000000000")
    try:
        return UUID(x_tenant_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Cabeçalho X-Tenant-ID deve ser um UUID válido.")

# ============================================================================
# SCHEMAS PYDANTIC
# ============================================================================

class PerfilCreate(BaseModel):
    nome: str
    email: EmailStr
    telefone: Optional[str] = None
    role: str = "cliente"

class ClienteCreate(BaseModel):
    perfil: PerfilCreate
    cpf: str
    data_nascimento: Optional[datetime.date] = None
    endereco: Optional[str] = None
    cidade: Optional[str] = None
    estado: Optional[str] = None
    cep: Optional[str] = None

class ProdutoCreate(BaseModel):
    nome: str
    descricao: Optional[str] = None
    preco_venda: float
    preco_custo: float
    estoque_atual: int
    estoque_minimo: int
    categoria: str = "lentes"

class VendaItemSchema(BaseModel):
    produto_id: UUID
    quantidade: int
    preco_unitario: float

class VendaCreate(BaseModel):
    cliente_id: UUID
    profissional_id: UUID
    receita_id: Optional[UUID] = None
    itens: List[VendaItemSchema]
    desconto: float = 0.0

class CaixaAbrir(BaseModel):
    operador_id: UUID
    saldo_inicial: float

class CaixaFechar(BaseModel):
    saldo_final: float

class TransacaoCreate(BaseModel):
    tipo: str  # 'entrada', 'saida'
    valor: float
    forma_pagamento: str  # 'pix', 'cartao_credito', 'cartao_debito', 'dinheiro', 'parcelado'
    descricao: Optional[str] = None
    venda_id: Optional[UUID] = None

class AgendaCreate(BaseModel):
    cliente_id: UUID
    profissional_id: UUID
    data_hora: datetime.datetime
    observacoes: Optional[str] = None

class ReceitaCreate(BaseModel):
    cliente_id: UUID
    medico_id: Optional[UUID] = None
    esferico_od: float = 0.0
    cilindrico_od: float = 0.0
    eixo_od: int = 0
    adicao_od: float = 0.0
    esferico_oe: float = 0.0
    cilindrico_oe: float = 0.0
    eixo_oe: int = 0
    adicao_oe: float = 0.0
    dnp_od: float = 0.0
    dnp_oe: float = 0.0
    validade: Optional[datetime.date] = None


class BiometriaCreate(BaseModel):
    cliente_id: UUID
    venda_os_id: Optional[UUID] = None
    receita_id: Optional[UUID] = None
    dp_total: float
    dnp_od: float
    dnp_oe: float
    altura_od_real: float
    altura_oe_real: float
    co_od_horizontal: float
    co_oe_horizontal: float
    co_od_vertical: float
    co_oe_vertical: float
    distancia_vertice: Optional[float] = None
    angulo_pantoscopico: Optional[float] = None
    face_form: Optional[float] = None
    assimetria_facial: Optional[float] = None
    inclinacao_cabeca: Optional[float] = None
    indice_confianca_ia: float = 1.0
    dados_face_mesh: Optional[dict] = None
    foto_scan_url: Optional[str] = None

class WhatsAppSend(BaseModel):
    remetente_id: UUID
    telefone_destinatario: str
    mensagem: str

# ============================================================================
# ROTAS - CLIENTES & PERFIS
# ============================================================================

@app.post("/clientes", status_code=status.HTTP_201_CREATED)
def criar_cliente(schema: ClienteCreate, db: Session = Depends(get_db), tenant_id: UUID = Depends(get_current_tenant)):
    # 1. Cria Perfil de Usuário associado ao Tenant
    perfil = models.Perfil(
        tenant_id=tenant_id,
        nome=schema.perfil.nome,
        email=schema.perfil.email,
        telefone=schema.perfil.telefone,
        role="cliente"
    )
    db.add(perfil)
    db.flush() # Gera o ID do perfil

    # 2. Cria Cliente
    cliente = models.Cliente(
        id=perfil.id,
        cpf=schema.cpf,
        data_nascimento=schema.data_nascimento,
        endereco=schema.endereco,
        cidade=schema.cidade,
        estado=schema.estado,
        cep=schema.cep
    )
    db.add(cliente)
    db.commit()
    db.refresh(cliente)
    return {"status": "sucesso", "cliente_id": cliente.id}

@app.get("/clientes")
def listar_clientes(db: Session = Depends(get_db), tenant_id: UUID = Depends(get_current_tenant)):
    # Filtra clientes associados ao tenant correspondente através do Perfil
    clientes = db.query(models.Cliente).join(models.Perfil, models.Cliente.id == models.Perfil.id).filter(models.Perfil.tenant_id == tenant_id).all()
    res = []
    for c in clientes:
        perf = db.query(models.Perfil).filter(models.Perfil.id == c.id).first()
        res.append({
            "id": c.id,
            "nome": perf.nome if perf else "Desconhecido",
            "email": perf.email if perf else "",
            "cpf": c.cpf,
            "telefone": perf.telefone if perf else ""
        })
    return res

# ============================================================================
# ROTAS - PRODUTOS (ESTOQUE)
# ============================================================================

@app.post("/produtos", status_code=status.HTTP_201_CREATED)
def criar_produto(schema: ProdutoCreate, db: Session = Depends(get_db), tenant_id: UUID = Depends(get_current_tenant)):
    produto = models.Produto(
        tenant_id=tenant_id,
        nome=schema.nome,
        descricao=schema.descricao,
        preco_venda=schema.preco_venda,
        preco_custo=schema.preco_custo,
        estoque_atual=schema.estoque_atual,
        estoque_minimo=schema.estoque_minimo,
        categoria=schema.categoria
    )
    db.add(produto)
    db.commit()
    db.refresh(produto)
    return produto

@app.get("/produtos")
def listar_produtos(db: Session = Depends(get_db), tenant_id: UUID = Depends(get_current_tenant)):
    return db.query(models.Produto).filter(models.Produto.tenant_id == tenant_id).all()

# ============================================================================
# ROTAS - VENDAS (OS)
# ============================================================================

@app.post("/vendas", status_code=status.HTTP_201_CREATED)
def criar_venda(schema: VendaCreate, db: Session = Depends(get_db), tenant_id: UUID = Depends(get_current_tenant)):
    # 1. Calcula o valor total da venda a partir dos itens filtrados por tenant_id
    valor_total = 0.0
    for item in schema.itens:
        prod = db.query(models.Produto).filter(models.Produto.id == item.produto_id, models.Produto.tenant_id == tenant_id).first()
        if not prod:
            raise HTTPException(status_code=404, detail=f"Produto {item.produto_id} não encontrado neste tenant")
        if prod.estoque_atual < item.quantidade:
            raise HTTPException(status_code=400, detail=f"Estoque insuficiente para o produto {prod.nome}")
        valor_total += item.preco_unitario * item.quantidade

    # 2. Registra a venda associada ao Tenant
    venda = models.Venda(
        tenant_id=tenant_id,
        cliente_id=schema.cliente_id,
        profissional_id=schema.profissional_id,
        receita_id=schema.receita_id,
        valor_total=valor_total,
        desconto=schema.desconto,
        status="aberto"
    )
    db.add(venda)
    db.flush()

    # 3. Registra os itens e decrementa o estoque
    for item in schema.itens:
        venda_item = models.VendaItem(
            tenant_id=tenant_id,
            venda_id=venda.id,
            produto_id=item.produto_id,
            quantidade=item.quantidade,
            preco_unitario=item.preco_unitario
        )
        db.add(venda_item)
        
        # Atualização física de estoque
        prod = db.query(models.Produto).filter(models.Produto.id == item.produto_id, models.Produto.tenant_id == tenant_id).first()
        prod.estoque_atual -= item.quantidade

    # 4. Calcula Comissão Automática (Ex: 5% sobre o valor líquido)
    valor_liquido = valor_total - schema.desconto
    valor_comissao = valor_liquido * 0.05
    comissao = models.Comissao(
        tenant_id=tenant_id,
        profissional_id=schema.profissional_id,
        venda_id=venda.id,
        valor_comissao=valor_comissao,
        percentual=5.00,
        status="pendente"
    )
    db.add(comissao)

    db.commit()
    db.refresh(venda)
    return {"status": "sucesso", "venda_id": venda.id, "valor_liquido": valor_liquido, "comissao": valor_comissao}

# ============================================================================
# ROTAS - FINANCEIRO (CAIXA)
# ============================================================================

@app.post("/caixa/abrir")
def abrir_caixa(schema: CaixaAbrir, db: Session = Depends(get_db), tenant_id: UUID = Depends(get_current_tenant)):
    caixa_aberto = db.query(models.Caixa).filter(models.Caixa.status == "aberto", models.Caixa.tenant_id == tenant_id).first()
    if caixa_aberto:
        raise HTTPException(status_code=400, detail="Já existe um caixa aberto para esta ótica (tenant).")

    caixa = models.Caixa(
        tenant_id=tenant_id,
        operador_id=schema.operador_id,
        saldo_inicial=schema.saldo_inicial,
        status="aberto"
    )
    db.add(caixa)
    db.commit()
    db.refresh(caixa)
    return {"status": "caixa_aberto", "caixa_id": caixa.id}

@app.post("/caixa/{caixa_id}/fechar")
def fechar_caixa(caixa_id: UUID, schema: CaixaFechar, db: Session = Depends(get_db), tenant_id: UUID = Depends(get_current_tenant)):
    caixa = db.query(models.Caixa).filter(models.Caixa.id == caixa_id, models.Caixa.tenant_id == tenant_id).first()
    if not caixa:
        raise HTTPException(status_code=404, detail="Caixa não encontrado neste tenant")
    if caixa.status == "fechado":
        raise HTTPException(status_code=400, detail="Este caixa já está fechado.")

    caixa.status = "fechado"
    caixa.saldo_final = schema.saldo_final
    caixa.data_fechamento = datetime.datetime.now()
    db.commit()
    return {"status": "caixa_fechado", "caixa_id": caixa.id}

@app.post("/caixa/{caixa_id}/transacao")
def registrar_transacao(caixa_id: UUID, schema: TransacaoCreate, db: Session = Depends(get_db)):
    caixa = db.query(models.Caixa).filter(models.Caixa.id == caixa_id).first()
    if not caixa or caixa.status == "fechado":
        raise HTTPException(status_code=400, detail="Transações só podem ser registradas em um caixa aberto.")

    transacao = models.TransacaoFinanceira(
        caixa_id=caixa_id,
        venda_id=schema.venda_id,
        tipo=schema.tipo,
        valor=schema.valor,
        forma_pagamento=schema.forma_pagamento,
        descricao=schema.descricao
    )
    db.add(transacao)
    db.commit()
    db.refresh(transacao)
    return transacao

# ============================================================================
# ROTAS - AGENDA
# ============================================================================

@app.post("/agenda")
def criar_compromisso(schema: AgendaCreate, db: Session = Depends(get_db)):
    compromisso = models.Agenda(
        cliente_id=schema.cliente_id,
        profissional_id=schema.profissional_id,
        data_hora=schema.data_hora,
        observacoes=schema.observacoes
    )
    db.add(compromisso)
    db.commit()
    db.refresh(compromisso)
    return compromisso

@app.get("/agenda")
def listar_agenda(db: Session = Depends(get_db)):
    return db.query(models.Agenda).all()

# ============================================================================
# ROTAS - RECEITAS & IA/OCR MOCK
# ============================================================================

@app.post("/receitas")
def salvar_receita(schema: ReceitaCreate, db: Session = Depends(get_db)):
    receita = models.Receita(
        cliente_id=schema.cliente_id,
        medico_id=schema.medico_id,
        esferico_od=schema.esferico_od,
        cilindrico_od=schema.cilindrico_od,
        eixo_od=schema.eixo_od,
        adicao_od=schema.adicao_od,
        esferico_oe=schema.esferico_oe,
        cilindrico_oe=schema.cilindrico_oe,
        eixo_oe=schema.eixo_oe,
        adicao_oe=schema.adicao_oe,
        dnp_od=schema.dnp_od,
        dnp_oe=schema.dnp_oe,
        validade=schema.validade
    )
    db.add(receita)
    db.commit()
    db.refresh(receita)
    return receita

# ============================================================================
# INTEGRAÇÃO WHATSAPP BUSINESS CLOUD API (META API)
# ============================================================================

import requests

@app.post("/whatsapp/enviar")
def enviar_whatsapp(schema: WhatsAppSend, db: Session = Depends(get_db)):
    whatsapp_token = os.getenv("WHATSAPP_TOKEN", "")
    phone_number_id = os.getenv("WHATSAPP_PHONE_NUMBER_ID", "")
    
    status_envio = "pendente"
    logs_erro = None
    
    # Se existirem chaves de produção, executa a requisição real de API
    if whatsapp_token and phone_number_id:
        url = f"https://graph.facebook.com/v18.0/{phone_number_id}/messages"
        headers = {
            "Authorization": f"Bearer {whatsapp_token}",
            "Content-Type": "application/json"
        }
        payload = {
            "messaging_product": "whatsapp",
            "to": schema.telefone_destinatario,
            "type": "text",
            "text": {
                "body": schema.mensagem
            }
        }
        try:
            response = requests.post(url, json=payload, headers=headers, timeout=10)
            if response.status_code == 200:
                status_envio = "enviado"
            else:
                status_envio = "falhou"
                logs_erro = f"Erro API Meta {response.status_code}: {response.text}"
        except Exception as e:
            status_envio = "falhou"
            logs_erro = str(e)
    else:
        # Fallback resiliente em desenvolvimento
        status_envio = "enviado"
        logs_erro = "Mock: Credenciais do WhatsApp Business Cloud API não definidas em variáveis de ambiente."

    mensagem = models.MensagemWhatsapp(
        remetente_id=schema.remetente_id,
        telefone_destinatario=schema.telefone_destinatario,
        mensagem=schema.mensagem,
        status_envio=status_envio,
        logs_erro=logs_erro
    )
    db.add(mensagem)
    db.commit()
    db.refresh(mensagem)
    return {
        "status": status_envio,
        "id": mensagem.id,
        "erro": logs_erro
    }


# ============================================================================
# ROTAS - BIOMETRIA ÓPTICA AVANÇADA (MediaPipe Face Landmarker)
# ============================================================================

@app.post("/ia/biometria/salvar", status_code=status.HTTP_201_CREATED)
def salvar_biometria(schema: BiometriaCreate, db: Session = Depends(get_db), tenant_id: UUID = Depends(get_current_tenant)):
    biometria = models.ClienteBiometriaOptica(
        tenant_id=tenant_id,
        cliente_id=schema.cliente_id,
        venda_os_id=schema.venda_os_id,
        receita_id=schema.receita_id,
        dp_total=schema.dp_total,
        dnp_od=schema.dnp_od,
        dnp_oe=schema.dnp_oe,
        altura_od_real=schema.altura_od_real,
        altura_oe_real=schema.altura_oe_real,
        co_od_horizontal=schema.co_od_horizontal,
        co_oe_horizontal=schema.co_oe_horizontal,
        co_od_vertical=schema.co_od_vertical,
        co_oe_vertical=schema.co_oe_vertical,
        distancia_vertice=schema.distancia_vertice,
        angulo_pantoscopico=schema.angulo_pantoscopico,
        face_form=schema.face_form,
        assimetria_facial=schema.assimetria_facial,
        inclinacao_cabeca=schema.inclinacao_cabeca,
        indice_confianca_ia=schema.indice_confianca_ia,
        dados_face_mesh=schema.dados_face_mesh,
        foto_scan_url=schema.foto_scan_url
    )
    db.add(biometria)
    db.commit()
    db.refresh(biometria)
    return biometria


@app.get("/vendas/{venda_id}/exportar-os")
def exportar_ordem_servico(venda_id: UUID, db: Session = Depends(get_db), tenant_id: UUID = Depends(get_current_tenant)):
    # 1. Localiza a venda correspondente ao tenant
    venda = db.query(models.Venda).filter(models.Venda.id == venda_id, models.Venda.tenant_id == tenant_id).first()
    if not venda:
        raise HTTPException(status_code=404, detail="Ordem de serviço não encontrada")

    # 2. MÓDULO 14 - VALIDAÇÃO FINANCEIRA DE SEGURANÇA
    # Soma todas as transações de entrada confirmadas para esta venda
    from sqlalchemy.sql import func
    total_pago = db.query(func.sum(models.TransacaoFinanceira.valor)).filter(
        models.TransacaoFinanceira.venda_id == venda_id,
        models.TransacaoFinanceira.tipo == "entrada"
    ).scalar() or 0.00

    # Se o valor líquido for maior do que o total pago, bloqueia dados de fabricação
    if total_pago < float(venda.valor_liquido):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "erro": "PAGAMENTO_PENDENTE",
                "mensagem": "OS BLOQUEADA: É necessário registrar a entrada financeira de pagamento para liberar o arquivo de laboratório e medidas técnicas.",
                "total_devido": float(venda.valor_liquido),
                "total_pago": float(total_pago)
            }
        )

    # 3. Se pago, retorna todos os dados biométricos e da receita para fabricação
    biometria = db.query(models.ClienteBiometriaOptica).filter(models.ClienteBiometriaOptica.venda_os_id == venda_id).first()
    receita = db.query(models.Receita).filter(models.Receita.id == venda.receita_id).first()
    
    return {
        "status": "pago_liberado",
        "venda_id": venda.id,
        "valor_total": float(venda.valor_total),
        "desconto": float(venda.desconto),
        "valor_liquido": float(venda.valor_liquido),
        "receita": {
            "esferico_od": float(receita.esferico_od) if receita else 0.0,
            "cilindrico_od": float(receita.cilindrico_od) if receita else 0.0,
            "eixo_od": receita.eixo_od if receita else 0,
            "esferico_oe": float(receita.esferico_oe) if receita else 0.0,
            "cilindrico_oe": float(receita.cilindrico_oe) if receita else 0.0,
            "eixo_oe": receita.eixo_oe if receita else 0,
        } if receita else None,
        "biometria": {
            "dnp_od": float(biometria.dnp_od),
            "dnp_oe": float(biometria.dnp_oe),
            "dp_total": float(biometria.dp_total),
            "altura_od_real": float(biometria.altura_od_real),
            "altura_oe_real": float(biometria.altura_oe_real),
            "distancia_vertice": float(biometria.distancia_vertice) if biometria.distancia_vertice else None,
            "angulo_pantoscopico": float(biometria.angulo_pantoscopico) if biometria.angulo_pantoscopico else None,
            "face_form": float(biometria.face_form) if biometria.face_form else None,
        } if biometria else None
    }
