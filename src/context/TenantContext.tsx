import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tenant, SaaSPlan, SaaSFeature } from '../types';
import { saasServices, INITIAL_SAAS_PLANS, INITIAL_SAAS_FEATURES } from '../services/saasServices';

interface TenantContextType {
  currentTenant: Tenant;
  currentPlan: SaaSPlan;
  availablePlans: SaaSPlan[];
  enabledFeatures: string[];
  hasFeature: (featureCode: string) => boolean;
  setTenant: (tenant: Tenant) => void;
  updateTenantTheme: (logoUrl: string, primaryColor: string, secondaryColor: string) => void;
}

const DEFAULT_TENANT: Tenant = {
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
  accentColor: '#0055A5',
  status: 'active',
  planId: '22222222-2222-2222-2222-222222222222', // Pro Max por padrão
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState<Tenant>(DEFAULT_TENANT);
  const [availablePlans, setAvailablePlans] = useState<SaaSPlan[]>(INITIAL_SAAS_PLANS);
  const [currentPlan, setCurrentPlan] = useState<SaaSPlan>(INITIAL_SAAS_PLANS[1]); // Pro Max por padrão
  const [enabledFeatures, setEnabledFeatures] = useState<string[]>(
    INITIAL_SAAS_FEATURES.map((f) => f.code)
  );

  // Carregar planos dinâmicos e aplicar o tema visual do tenant
  useEffect(() => {
    saasServices.getPlans().then((plans) => {
      if (plans && plans.length > 0) {
        setAvailablePlans(plans);
        const match = plans.find((p) => p.id === currentTenant.planId) || plans[0];
        setCurrentPlan(match);
      }
    });

    // Injetar variáveis CSS personalizadas do Tenant
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--tenant-primary-color', currentTenant.primaryColor || '#071D49');
      root.style.setProperty('--tenant-secondary-color', currentTenant.secondaryColor || '#D4AF37');
    }
  }, [currentTenant]);

  const hasFeature = (featureCode: string): boolean => {
    // Se o plano for Pro Max, todas as funcionalidades estão liberadas
    if (currentPlan.code === 'pro-max') return true;

    // Se for o plano Básico, desabilitar IA avançada e Provador 3D
    if (currentPlan.code === 'basic') {
      const basicDisabled = ['ai', 'iris_ai', 'branding', 'api'];
      return !basicDisabled.includes(featureCode);
    }

    return enabledFeatures.includes(featureCode);
  };

  const setTenant = (tenant: Tenant) => {
    setCurrentTenant(tenant);
    const matchPlan = availablePlans.find((p) => p.id === tenant.planId) || availablePlans[0];
    setCurrentPlan(matchPlan);
  };

  const updateTenantTheme = (logoUrl: string, primaryColor: string, secondaryColor: string) => {
    setCurrentTenant((prev) => ({
      ...prev,
      logoUrl: logoUrl || prev.logoUrl,
      primaryColor: primaryColor || prev.primaryColor,
      secondaryColor: secondaryColor || prev.secondaryColor,
    }));
  };

  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        currentPlan,
        availablePlans,
        enabledFeatures,
        hasFeature,
        setTenant,
        updateTenantTheme,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant deve ser usado dentro de um TenantProvider');
  }
  return context;
};
