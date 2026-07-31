export type ChatSender = 'customer' | 'ai' | 'operator' | 'system';

export type CustomerStatus = 'active' | 'lead' | 'awaiting_quote' | 'payment_pending' | 'paid' | 'in_lab' | 'delivered';

export interface OpticalEye {
  esferico: number; // e.g. -2.50
  cilindrico: number; // e.g. -0.75
  eixo: number; // 0 to 180 degrees
}

export interface OpticalPrescription {
  od: OpticalEye; // Olho Direito
  oe: OpticalEye; // Olho Esquerdo
  adicao?: number; // Adição (Multifocal / Perto)
  medicoName?: string;
  crm?: string;
  dataExame?: string;
  validadeData?: string;
  observacoes?: string;
  imageUrl?: string;
}

export interface DnpMeasurement {
  dnpOD: number; // Distância Naso-Pupilar Olho Direito (mm)
  dnpOE: number; // Distância Naso-Pupilar Olho Esquerdo (mm)
  dpTotal: number; // Distância Pupilar Total (mm)
  alturaCentroOD: number; // Centro Óptico OD (mm)
  alturaCentroOE: number; // Centro Óptico OE (mm)
  cardDetected: boolean;
  confidenceScore: number; // percentage
  measuredAt?: string;
  notes?: string;
  photoUrl?: string;
}

export interface Frame {
  id: string;
  brand: string;
  model: string;
  code: string;
  color: string;
  material: string;
  eyeSize: number; // e.g. 52mm
  bridge: number; // e.g. 18mm
  temple: number; // e.g. 140mm
  price: number;
  image: string;
  stock: number;
  
  // Parâmetros avançados da versão 2.0
  ed?: number;             // Diâmetro efetivo (mm)
  diagonalMaior?: number;  // Diagonal maior (mm)
  baseCurva?: number;      // Curvatura da armação (graus/base)
  larguraTotal?: number;   // Largura frontal total (mm)
  peso?: number;           // Peso em gramas (g)
  modelo3dUrl?: string;    // URL para provador virtual 3D
  codigoBarras?: string;
  ativo?: boolean;
}

export type LensType = 'visao_simples' | 'bifocal' | 'multifocal_digital' | 'antirreflexo_blue' | 'fotocromatica';

export interface Lens {
  id: string;
  brand: string;
  name: string;
  type: LensType;
  indexRefraction: number; // 1.56, 1.60, 1.67, 1.74
  price: number;
  description: string;
  idealForRange?: string; // e.g. "Graus de -3.00 a -6.00"
  
  // Parâmetros avançados da versão 2.0
  fabricante?: string;
  grauEsfMax?: number;
  grauEsfMin?: number;
  grauCilMax?: number;
  grauCilMin?: number;
  garantiaMeses?: number;
  tratamentos?: string[];
}

export interface ChatMessage {
  id: string;
  clientId: string;
  sender: ChatSender;
  text: string;
  timestamp: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'pdf' | 'audio';
  metadata?: {
    prescription?: Partial<OpticalPrescription>;
    dnp?: Partial<DnpMeasurement>;
    quoteTotal?: number;
    osId?: string;
    pixKey?: string;
  };
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  cpf?: string;
  birthDate?: string;
  avatar?: string;
  status: CustomerStatus;
  isAiHandled: boolean; // true = AI controlled, false = Human Operator took over
  lastInteraction: string;
  unreadCount: number;
  tags: string[];
  prescription?: OpticalPrescription;
  dnp?: DnpMeasurement;
  selectedFrameId?: string;
  selectedLensId?: string;
  notes?: string;
}

export type OSStatus = 'orcamento' | 'aguardando_pagamento' | 'pago' | 'no_laboratorio' | 'pronto' | 'entregue';

export interface ServiceOrder {
  id: string;
  osNumber: string; // e.g. OS-1882 or 1882
  clientId: string;
  clientName: string;
  clientCPF: string;
  clientPhone: string;
  prescription: OpticalPrescription;
  dnp: DnpMeasurement;
  frame: Frame;
  lens: Lens;
  framePrice: number;
  lensPrice: number;
  discount: number;
  totalValue: number;
  status: OSStatus;
  paymentMethod?: 'pix' | 'cartao_credito' | 'dinheiro' | 'link_pagamento';
  pixCode?: string;
  pixQrCodeUrl?: string;
  nfceNumber?: string;
  createdAt: string;
  labEstimatedCompletion?: string;
  ceoNotified: boolean;
  ceoApprovalNeeded: boolean;
  ceoApproved?: boolean;

  // Exact Fields from the Official Printed Service Order (Modelo DI Óticas)
  vendedor?: string; // e.g. John Rocha
  cnpj?: string; // e.g. 12.348.411/0001-51
  lojaEndereco?: string; // e.g. Rua 23 de Abril, 51, Otica DI Oculos, Centro - Ituberá - BA
  lojaTelefone?: string; // e.g. (73) 3256-1599
  dataEntrada?: string; // e.g. 11/07/2026
  prevEntrega?: string; // e.g. 31/07/2026
  tipoOS?: string; // e.g. Otica
  subtotal?: number;
  adiantamento?: number;
  aReceber?: number;
  medicoName?: string; // e.g. Dr. Lauro / lauro
  possuiReceita?: boolean;
  armacaoPropria?: boolean;
  armacaoSegue?: boolean;
  distPupilar?: number;
  itemsList?: Array<{
    ref: string;
    qtde: number;
    valUnit: number;
    acrescimo: number;
    desconto: number;
    total: number;
  }>;
  adiantamentoHistory?: Array<{
    data: string;
    formaPagamento: string;
    valor: number;
    responsavel: string;
  }>;
}

export type UserRole = 'ADMIN' | 'GERENTE' | 'VENDEDOR' | 'FINANCEIRO' | 'AUDITOR';

export type PaymentMethod =
  | 'Dinheiro'
  | 'Pix'
  | 'Cartão Débito'
  | 'Cartão Crédito'
  | 'Transferência'
  | 'Boleto'
  | 'Cheque'
  | 'Crediário'
  | 'Convênio';

export type MovementType = 'entrada' | 'saida' | 'transferencia';

export type IncomeCategory =
  | 'Venda à Vista'
  | 'Venda Cartão Débito'
  | 'Venda Cartão Crédito'
  | 'Pix'
  | 'Transferência Recebida'
  | 'Recebimento OS'
  | 'Recebimento Convênio'
  | 'Recebimento Particular'
  | 'Recebimento Parcelado'
  | 'Aporte de Caixa'
  | 'Outras Receitas';

export type ExpenseCategory =
  | 'Pagamento Fornecedor'
  | 'Aluguel'
  | 'Energia'
  | 'Internet'
  | 'Água'
  | 'Telefone'
  | 'Marketing'
  | 'Impostos'
  | 'Salário'
  | 'Comissão'
  | 'Manutenção'
  | 'Compra de Produtos'
  | 'Compra de Lentes'
  | 'Compra de Armações'
  | 'Retirada Sócio'
  | 'Sangria'
  | 'Outras Despesas';

export interface CashFlowEntry {
  id: string;
  empresa: string;
  filial: string;
  usuario: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm:ss
  type: MovementType;
  category: string;
  description: string;
  paymentMethod: PaymentMethod;
  entrada: number;
  saida: number;
  amount: number; // for legacy compatibility
  saldo: number; // calculated running balance
  observacao?: string;
  comprovanteUrl?: string;
  status: 'confirmado' | 'pendente' | 'bloqueado' | 'cancelado';
  osId?: string;
  clientName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CashClosing {
  id: string;
  empresa: string;
  filial: string;
  dataFechamento: string;
  saldoAnterior: number;
  totalEntradas: number;
  totalSaidas: number;
  saldoFinal: number;
  dinheiroConferido: number;
  pixConferido: number;
  cartaoConferido: number;
  diferenca: number;
  usuarioResponsavel: string;
  observacao?: string;
  status: 'aberto' | 'fechado' | 'reaberto';
  createdAt: string;
}

export interface CashFlowFilterState {
  startDate: string;
  endDate: string;
  empresa: string;
  filial: string;
  usuario: string;
  type: 'todos' | 'entrada' | 'saida' | 'transferencia';
  paymentMethod: string;
  searchQuery: string;
}

export type ProfessionalRole =
  | 'medico_oftalmologista'
  | 'optometrista'
  | 'vendedor'
  | 'gerente'
  | 'tecnico_laboratorio';

export interface Professional {
  id: string;
  name: string;
  role: ProfessionalRole;
  registrationNumber?: string; // CRM, CBO, Matrícula
  phone: string;
  email?: string;
  filial: string;
  specialty?: string;
  commissionRate?: number; // e.g. 5.0%
  status: 'ativo' | 'inativo';
  avatar?: string;
  createdAt: string;
}

export interface AiSettings {
  autoReplyEnabled: boolean;
  modelName: string;
  ceoPhoneNumber: string;
  ceoApprovalThreshold: number; // e.g. 1500
  welcomeMessage: string;
  dnpMethodEnabled: boolean;
  pixKeyType: string;
  pixKey: string;
  whatsappProvider?: 'meta_cloud_api' | 'zapi';
  whatsappNumber?: string;
  metaPhoneNumberId?: string;
  metaWabaId?: string;
  metaAccessToken?: string;
  metaWebhookVerifyToken?: string;
  voicePersona?: 'ideal' | 'tecnica' | 'vip' | 'express' | 'clonada';
  clonedVoiceConfig?: {
    name: string;
    sampleUrl?: string;
    audioBase64?: string;
    durationSeconds?: number;
    pitch?: number;
    rate?: number;
    createdAt?: string;
  };
}

export type AiQuoteStatus = 'enviado' | 'aprovado_cliente' | 'aguardando_ceo' | 'convertido_os' | 'recusado';

export interface AiQuote {
  id: string; // e.g. ORC-2026-101
  clientId: string;
  clientName: string;
  clientPhone: string;
  prescription: OpticalPrescription;
  dnp?: DnpMeasurement;
  recommendedLensName: string;
  lensPrice: number;
  recommendedFrameName: string;
  framePrice: number;
  totalValue: number;
  pixDiscountValue: number; // e.g. 10% off
  installmentText: string; // e.g. "10x de R$ 89,90 sem juros"
  status: AiQuoteStatus;
  ceoApprovalNeeded: boolean;
  ceoApproved?: boolean;
  createdAt: string;
  aiNotes?: string;
  dnpPhotoUrl?: string;
}

