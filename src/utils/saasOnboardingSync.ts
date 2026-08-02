import { supabase } from './supabaseClient';

export interface ProvisioningData {
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  plano: 'trial' | 'basico' | 'promax';
  emailProprietario: string;
  senhaProprietario: string;
  nomeProprietario: string;
  phoneProprietario: string;
}

export const provisionTenantFromOnboarding = async (formData: ProvisioningData) => {
  if (!supabase) {
    // Fallback local em ambiente de desenvolvimento offline
    console.warn('[Supabase Onboarding] Conexão offline. Simulando cadastro local.');
    return {
      success: true,
      tenant_id: `dev-tenant-${Math.floor(Math.random() * 10000)}`,
      user_id: `dev-user-${Math.floor(Math.random() * 10000)}`,
      message: 'Onboarding simulado com sucesso (modo offline).'
    };
  }

  try {
    const { data, error } = await supabase.rpc('cadastrar_nova_otica', {
      p_nome_fantasia: formData.nomeFantasia,
      p_razao_social: formData.razaoSocial,
      p_cnpj: formData.cnpj,
      p_plano: formData.plano,
      p_email_proprietario: formData.emailProprietario,
      p_senha_proprietario: formData.senhaProprietario,
      p_nome_proprietario: formData.nomeProprietario,
      p_telefone_proprietario: formData.phoneProprietario
    });

    if (error) throw error;
    return data;
  } catch (err: any) {
    console.error('[Supabase Onboarding] Erro ao cadastrar ótica via RPC:', err);
    throw new Error(err.message || 'Falha de comunicação com o Supabase ao registrar nova ótica.');
  }
};
