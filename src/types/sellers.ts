export type UserRole = 'CEO' | 'Gerente' | 'Supervisor' | 'Vendedor' | 'Recepcionista' | 'Caixa' | 'Laboratório' | 'Administrador';

export type SellerStatus = 'Ativo' | 'Inativo' | 'Férias' | 'Afastado';

export interface Seller {
  id: string;
  photo: string;
  fullName: string;
  cpf: string;
  rg: string;
  phone: string;
  whatsapp: string;
  email: string;
  birthDate: string;
  admissionDate: string;
  roleTitle: string; // e.g. "Consultor Óptico Senior", "Gerente de Loja"
  branch: string; // e.g. "Matriz Ituberá BA", "Filial Valença", "Filial Gandu"
  monthlyGoal: number;
  weeklyGoal: number;
  dailyGoal: number;
  baseSalary: number;
  status: SellerStatus;
  login: string;
  role: UserRole;
  permissions?: string[];
  notes?: string;
  createdAt: string;
}

export type PeriodFilter = 'Hoje' | 'Ontem' | 'Semana' | 'Mês' | 'Trimestre' | 'Ano' | 'Personalizado';

export interface SellerGoal {
  id: string;
  sellerId: string;
  sellerName: string;
  branch: string;
  period: 'Diária' | 'Semanal' | 'Mensal' | 'Anual';
  targetValue: number;
  currentValue: number;
  targetSalesCount: number;
  currentSalesCount: number;
  targetMultifocalCount: number;
  currentMultifocalCount: number;
  targetTreatmentsCount: number;
  currentTreatmentsCount: number;
  startDate: string;
  endDate: string;
  status: 'Em Progresso' | 'Concluída' | 'Superada' | 'Não Atingida';
}

export type CommissionRuleType = 'PERCENTUAL' | 'PRODUTO' | 'META' | 'MARGEM';

export interface CommissionRule {
  id: string;
  title: string;
  type: CommissionRuleType;
  categoryOrProduct: string; // e.g., "Armações", "Lentes Multifocais", "Varilux XR", "Margem > 60%"
  value: number; // percentage (e.g. 7%) or fixed amount (e.g. R$ 100)
  valueType: 'PERCENTAGE' | 'FIXED';
  minMargin?: number;
  targetThreshold?: number;
  bonusAmount?: number;
  active: boolean;
  branch?: string;
  createdAt: string;
}

export interface CommissionMovement {
  id: string;
  osNumber: string;
  sellerId: string;
  sellerName: string;
  branch: string;
  clientName: string;
  date: string;
  productName: string;
  category: string;
  saleValue: number;
  commissionRate: number;
  commissionAmount: number;
  ruleType: CommissionRuleType;
  status: 'PENDENTE' | 'APROVADO' | 'PAGO' | 'BLOQUEADO';
}

export interface SellerSale {
  id: string;
  osNumber: string;
  sellerId: string;
  sellerName: string;
  clientName: string;
  branch: string;
  date: string;
  productName: string;
  category: 'Armação' | 'Lente Visão Simples' | 'Lente Multifocal' | 'Tratamento' | 'Óculos de Sol' | 'Acessórios';
  value: number;
  costValue: number;
  marginPercent: number;
  commissionAmount: number;
  status: 'Concluída' | 'Em Produção' | 'Entregue' | 'Cancelada';
  paymentMethod: string;
}

export interface AwardCampaign {
  id: string;
  title: string;
  description: string;
  prize: string; // e.g. "R$ 500 em Bônus", "iPhone 15", "Viagem para Porto de Galinhas"
  targetMetric: 'Valor Total' | 'Qtd Multifocais' | 'Maior Ticket Médio' | 'Qtd Tratamentos';
  targetValue: number;
  startDate: string;
  endDate: string;
  winnerSellerId?: string;
  winnerSellerName?: string;
  status: 'Ativa' | 'Encerrada' | 'Em Breve';
  branch?: string;
}

export interface SellerRanking {
  position: number;
  sellerId: string;
  sellerName: string;
  photo: string;
  branch: string;
  totalSales: number;
  salesCount: number;
  monthlyGoal: number;
  goalPercent: number;
  totalCommission: number;
  avgTicket: number;
  badge?: 'GOLD' | 'SILVER' | 'BRONZE' | 'TOP_SELLER';
}

export interface AIPerformanceAnalysis {
  conversionRate: number;
  avgTicket: number;
  topSellingCategory: string;
  peakHours: string;
  strengths: string[];
  opportunities: string[];
  suggestedActions: string[];
  recommendedTrainings: string[];
}
