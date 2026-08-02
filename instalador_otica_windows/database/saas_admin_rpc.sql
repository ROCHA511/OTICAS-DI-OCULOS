-- ==========================================
-- SCRIPT DE ADMINISTRAÇÃO SAAS MULTITENANT
-- CRIAÇÃO DA FUNÇÃO RPC PARA CADASTRO DE ÓTICAS
-- COMPATIBILIDADE: PostgreSQL 15+ (Supabase)
-- ==========================================

CREATE OR REPLACE FUNCTION public.cadastrar_nova_otica(
    p_nome_fantasia TEXT,
    p_razao_social TEXT,
    p_cnpj TEXT,
    p_plano TEXT,
    p_email_proprietario TEXT,
    p_senha_proprietario TEXT,
    p_nome_proprietario TEXT,
    p_telefone_proprietario TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER -- Roda com privilégios de super-usuário para criar no auth.users
AS $$
DECLARE
    v_tenant_id UUID;
    v_user_id UUID;
    v_result JSON;
BEGIN
    -- 1. Verificação de Segurança (Apenas CEOs Master podem cadastrar novas óticas)
    IF NOT EXISTS (
        SELECT 1 FROM public.perfis 
        WHERE id = auth.uid() AND role = 'ceo'
    ) THEN
        RAISE EXCEPTION 'Acesso negado: Apenas o CEO master possui autorização para criar novas óticas no sistema.';
    END IF;

    -- 2. Validação de dados duplicados
    IF EXISTS (SELECT 1 FROM public.tenants WHERE cnpj = p_cnpj) THEN
        RAISE EXCEPTION 'CNPJ já cadastrado no sistema.';
    END IF;

    IF EXISTS (SELECT 1 FROM auth.users WHERE email = p_email_proprietario) THEN
        RAISE EXCEPTION 'E-mail do proprietário já está cadastrado no sistema.';
    END IF;

    -- 3. Gerar ID da Ótica (Tenant)
    v_tenant_id := gen_random_uuid();

    -- 4. Inserir na Tabela de Tenants
    INSERT INTO public.tenants (id, nome_fantasia, razao_social, cnpj, plano, ativo, created_at, updated_at)
    VALUES (
        v_tenant_id, 
        p_nome_fantasia, 
        p_razao_social, 
        p_cnpj, 
        p_plano, 
        true, 
        now(), 
        now()
    );

    -- 5. Criar conta do Proprietário no Supabase Auth (auth.users)
    v_user_id := gen_random_uuid();

    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_metadata_to_json,
        raw_user_meta_data_to_json,
        is_super_admin,
        created_at,
        updated_at,
        phone,
        phone_confirmed_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    )
    VALUES (
        '00000000-0000-0000-0000-000000000000',
        v_user_id,
        'authenticated',
        'authenticated',
        p_email_proprietario,
        crypt(p_senha_proprietario, gen_salt('bf')), -- Criptografia Bcrypt padrão
        now(),                                      -- Confirma o e-mail na hora
        jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email'), 'tenant_id', v_tenant_id),
        jsonb_build_object('name', p_nome_proprietario),
        false,
        now(),
        now(),
        NULL,
        NULL,
        '',
        '',
        '',
        ''
    );

    -- 6. Criar identidade correspondente no Supabase Auth para permitir login
    INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    )
    VALUES (
        v_user_id,
        v_user_id,
        jsonb_build_object('sub', v_user_id, 'email', p_email_proprietario),
        'email',
        now(),
        now(),
        now()
    );

    -- 7. Criar Perfil de Usuário do Proprietário (CEO da nova ótica) no CRM
    INSERT INTO public.perfis (id, tenant_id, nome, role, telefone, status, created_at, updated_at)
    VALUES (
        v_user_id,
        v_tenant_id,
        p_nome_proprietario,
        'ceo',
        p_telefone_proprietario,
        'ativo',
        now(),
        now()
    );

    -- Retorna JSON de Sucesso
    v_result := jsonb_build_object(
        'success', true,
        'tenant_id', v_tenant_id,
        'user_id', v_user_id,
        'message', 'Onboarding da ótica concluído! Nova loja cadastrada e proprietário ativado.'
    );
    
    RETURN v_result;
END;
$$;
