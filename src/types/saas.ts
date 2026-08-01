// src/types/saas.ts

export type PlanType = 'trial' | 'basico' | 'promax';
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'expired';

export interface TenantSubscription {
  tenantId: string;
  plan: PlanType;
  status: SubscriptionStatus;
  trialEndsAt: string; // ISO String
  nextBillingDate?: string;
  mercadoPagoSubscriptionId?: string;
  customerEmail: string;
}

// Utilitário de Verificação de Recursos por Plano
export const PLAN_LIMITS = {
  trial: {
    maxOsPerMonth: 9999,
    hasAiAgent: true,
    hasMultiBranch: true,
    hasSmartLab: true,
  },
  basico: {
    maxOsPerMonth: 150,
    hasAiAgent: false,
    hasMultiBranch: false,
    hasSmartLab: false,
  },
  promax: {
    maxOsPerMonth: 99999,
    hasAiAgent: true,
    hasMultiBranch: true,
    hasSmartLab: true,
  },
};
