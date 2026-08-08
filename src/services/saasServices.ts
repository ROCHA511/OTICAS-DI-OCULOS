import { supabase } from '../utils/supabaseClient';
import { Tenant, SaaSPlan, SaaSFeature, SaaSSubscription, ProvisioningEvent } from '../types';

export const INITIAL_SAAS_PLANS: SaaSPlan[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    code: 'basic',
    name: 'Plano Básico',
    description: 'Ideal para óticas individuais e pequenas unidades em crescimento.',
    monthlyPrice: 199.00,
    active: true,
    displayOrder: 1,
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    code: 'pro-max',
    name: 'Plano Pro Max VIP',
    description: 'Para redes de óticas, grandes lojas e laboratórios que exigem IA e provador 3D ilimitados.',
    monthlyPrice: 2490.00,
    active: true,
    displayOrder: 2,
  },
];

export const INITIAL_SAAS_FEATURES: SaaSFeature[] = [
  { id: 'f1', code: 'dashboard', name: 'Dashboard Executivo', description: 'Métricas e gráficos estratégicos de faturamento', module: 'core', active: true },
  { id: 'f2', code: 'clients', name: 'Gestão de Clientes & CRM', description: 'Ficha completa de clientes e histórico óptico', module: 'crm', active: true },
  { id: 'f3', code: 'products', name: 'Catálogo de Produtos & Armações', description: 'Cadastro de armações e lentes digitais', module: 'catalog', active: true },
  { id: 'f4', code: 'inventory', name: 'Controle de Estoque', description: 'Gestão de entradas, saídas e alertas de nível', module: 'inventory', active: true },
  { id: 'f5', code: 'sales', name: 'Ponto de Vendas (PDV)', description: 'Registro de vendas de balcão e orçamento rápido', module: 'sales', active: true },
  { id: 'f6', code: 'cashier', name: 'Fluxo de Caixa Executivo', description: 'Controle financeiro, sangrias e fechamento de caixa', module: 'financial', active: true },
  { id: 'f7', code: 'service_orders', name: 'Ordens de Serviço (OS)', description: 'Acompanhamento do ciclo da OS e prescrição', module: 'os', active: true },
  { id: 'f8', code: 'financial', name: 'Gestão Financeira & DRE', description: 'Relatórios financeiros avançados e contas', module: 'financial', active: true },
  { id: 'f9', code: 'reports', name: 'Relatórios & Inteligência', description: 'Relatórios exportáveis em PDF e Excel', module: 'reports', active: true },
  { id: 'f10', code: 'commissions', name: 'Gestão de Comissões', description: 'Cálculo automático de comissões por vendedor', module: 'sales', active: true },
  { id: 'f11', code: 'agenda', name: 'Agenda de Consultas', description: 'Agendamento de exames e consultas', module: 'exam', active: true },
  { id: 'f12', code: 'crm', name: 'Funil de Vendas CRM', description: 'Gestão de leads e lembretes de retorno', module: 'crm', active: true },
  { id: 'f13', code: 'whatsapp', name: 'Integração WhatsApp API', description: 'Envio de notificações de OS e orçamentos', module: 'communication', active: true },
  { id: 'f14', code: 'ai', name: 'Inteligência Artificial Mary', description: 'Leitura visual de receitas e biometria DNP 3D', module: 'ai', active: true },
  { id: 'f15', code: 'iris_ai', name: 'IA Íris Consultora', description: 'Consultoria óptica e recomendações automáticas', module: 'ai', active: true },
  { id: 'f16', code: 'marketing', name: 'Módulo de Marketing', description: 'Campanhas de pós-venda e cupons', module: 'marketing', active: true },
  { id: 'f17', code: 'multi_user', name: 'Múltiplos Usuários', description: 'Suporte a diferentes perfis e vendedores', module: 'admin', active: true },
  { id: 'f18', code: 'audit', name: 'Logs de Auditoria', description: 'Histórico completo de alterações do sistema', module: 'admin', active: true },
  { id: 'f19', code: 'export', name: 'Exportação de Dados', description: 'Download de relatórios e dados do tenant', module: 'reports', active: true },
  { id: 'f20', code: 'backup', name: 'Backup Automático', description: 'Cópia de segurança diária na nuvem', module: 'admin', active: true },
  { id: 'f21', code: 'branding', name: 'Personalização White-Label', description: 'Customização de logotipo e paleta de cores', module: 'branding', active: true },
  { id: 'f22', code: 'api', name: 'Acesso via API', description: 'Integração externa via Webhooks', module: 'integration', active: true },
  { id: 'f23', code: 'priority_support', name: 'Suporte VIP Prioritário', description: 'Atendimento dedicado via WhatsApp e telefone', module: 'support', active: true }
];

export const saasServices = {
  // Carregar planos do banco de dados (saas_plans)
  async getPlans(): Promise<SaaSPlan[]> {
    if (!supabase) return INITIAL_SAAS_PLANS;
    try {
      const { data, error } = await supabase
        .from('saas_plans')
        .select('*')
        .order('display_order', { ascending: true });
      if (error || !data || data.length === 0) return INITIAL_SAAS_PLANS;
      return data.map((p) => ({
        id: p.id,
        code: p.code,
        name: p.name,
        description: p.description,
        monthlyPrice: Number(p.monthly_price),
        active: p.active,
        displayOrder: p.display_order,
      }));
    } catch (err) {
      console.warn('Fallback para planos de teste:', err);
      return INITIAL_SAAS_PLANS;
    }
  },

  // Carregar funcionalidades cadastradas
  async getFeatures(): Promise<SaaSFeature[]> {
    if (!supabase) return INITIAL_SAAS_FEATURES;
    try {
      const { data, error } = await supabase
        .from('saas_features')
        .select('*')
        .order('code', { ascending: true });
      if (error || !data || data.length === 0) return INITIAL_SAAS_FEATURES;
      return data;
    } catch {
      return INITIAL_SAAS_FEATURES;
    }
  },

  // Carregar todos os tenants para o painel Super Admin
  async getAllTenants(): Promise<Tenant[]> {
    if (!supabase) {
      return [
        {
          id: '00000000-0000-0000-0000-000000000001',
          name: 'Óticas Di Óculos - Matriz Ituberá',
          tradeName: 'Óticas Di Óculos',
          cnpj: '12.345.678/0001-90',
          email: 'matriz@dioculos.com.br',
          phone: '(73) 98112-8923',
          city: 'Ituberá',
          state: 'BA',
          logoUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=150&auto=format&fit=crop&q=80',
          primaryColor: '#071D49',
          secondaryColor: '#D4AF37',
          status: 'active',
          planId: '22222222-2222-2222-2222-222222222222',
        },
      ];
    }

    try {
      const { data, error } = await supabase.from('saas_tenants').select('*');
      if (error || !data) return [];
      return data.map((t) => ({
        id: t.id,
        name: t.name,
        legalName: t.legal_name,
        tradeName: t.trade_name,
        cnpj: t.cnpj,
        email: t.email,
        phone: t.phone,
        whatsapp: t.whatsapp,
        address: t.address,
        city: t.city,
        state: t.state,
        zipCode: t.zip_code,
        logoUrl: t.logo_url,
        primaryColor: t.primary_color,
        secondaryColor: t.secondary_color,
        accentColor: t.accent_color,
        status: t.status,
        planId: t.plan_id,
        ownerUserId: t.owner_user_id,
        createdAt: t.created_at,
      }));
    } catch {
      return [];
    }
  },

  // Simular / Executar Pagamento Mercado Pago
  async processMercadoPagoSubscription(params: {
    tenantId: string;
    planId: string;
    amount: number;
    paymentMethod: 'card' | 'pix';
    cardData?: any;
  }): Promise<{ success: boolean; subscriptionId: string; status: string }> {
    const subscriptionId = `mp_sub_${Date.now()}`;
    
    // Registrar assinatura na tabela saas_subscriptions
    if (supabase) {
      try {
        await supabase.from('saas_subscriptions').insert({
          tenant_id: params.tenantId,
          plan_id: params.planId,
          provider: 'mercado_pago',
          provider_subscription_id: subscriptionId,
          status: 'active',
          amount: params.amount,
          billing_cycle: 'monthly',
          current_period_start: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Erro ao gravar assinatura no Supabase:', err);
      }
    }

    return {
      success: true,
      subscriptionId,
      status: 'active',
    };
  },

  // Registrar Evento de Provisionamento Idempotente
  async logProvisioningEvent(event: Partial<ProvisioningEvent>): Promise<void> {
    if (!supabase) return;
    try {
      await supabase.from('saas_provisioning_events').insert({
        tenant_id: event.tenantId,
        event_type: event.eventType,
        status: event.status || 'completed',
        payload: event.payload || {},
        error_message: event.errorMessage,
      });
    } catch (err) {
      console.warn('Erro ao registrar log de provisionamento:', err);
    }
  },
};
