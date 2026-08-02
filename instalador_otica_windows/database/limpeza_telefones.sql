-- ============================================================================
-- SCRIPT DE VARREDURA E SANEAMENTO DE TELEFONES FICTÍCIOS / DE TESTE
-- OTICAS DI OCULOS 2.0 - SUPABASE DATABASE
-- ============================================================================

-- 1. Criação da função auxiliar para identificar números fictícios ou de teste
CREATE OR REPLACE FUNCTION public.is_telefone_ficticio(tel TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    nums_so TEXT;
    ddd INT;
BEGIN
    -- Se for nulo ou vazio, consideramos inválido/limpo
    IF tel IS NULL OR trim(tel) = '' THEN
        RETURN TRUE;
    END IF;

    -- Extrai apenas os números do telefone
    nums_so := regexp_replace(tel, '[^0-9]', '', 'g');

    -- Remove o prefixo do país '55' se estiver presente no início
    IF length(nums_so) > 10 AND left(nums_so, 2) = '55' THEN
        nums_so := substring(nums_so from 3);
    END IF;

    -- Tamanho incorreto para telefones brasileiros (fixo = 10, celular = 11)
    IF length(nums_so) < 10 OR length(nums_so) > 11 THEN
        RETURN TRUE;
    END IF;

    -- Validação do DDD (primeiros 2 dígitos)
    ddd := CAST(left(nums_so, 2) AS INT);
    -- DDDs brasileiros válidos vão de 11 a 99 (excluindo os que iniciam em 0 e DDDs inexistentes)
    IF ddd < 11 OR ddd > 99 OR ddd IN (20, 25, 26, 36, 39, 40, 50, 60, 70, 72, 76, 78, 80, 90) THEN
        RETURN TRUE;
    END IF;

    -- Validação de sequências repetidas (ex: 99999999999, 11111111111, 00000000000)
    IF nums_so ~ '^([0-9])\1+$' THEN
        RETURN TRUE;
    END IF;

    -- Validação de sequências numéricas óbvias (ex: 1234567890, 9876543210)
    IF nums_so IN ('1234567890', '12345678901', '0123456789', '01234567890', '9876543210', '98765432100') THEN
        RETURN TRUE;
    END IF;

    -- Celulares com dígitos do meio óbvios demais
    IF length(nums_so) = 11 AND substring(nums_so from 3 for 9) = '999999999' THEN
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- 2. Criação da função para formatar telefones válidos
CREATE OR REPLACE FUNCTION public.formatar_telefone_br(tel TEXT)
RETURNS TEXT AS $$
DECLARE
    nums_so TEXT;
BEGIN
    IF tel IS NULL OR trim(tel) = '' THEN
        RETURN NULL;
    END IF;

    -- Extrai números
    nums_so := regexp_replace(tel, '[^0-9]', '', 'g');

    -- Remove 55 se for padrão internacional
    IF length(nums_so) > 10 AND left(nums_so, 2) = '55' THEN
        nums_so := substring(nums_so from 3);
    END IF;

    -- Formata Celular (11 dígitos): (XX) 9XXXX-XXXX
    IF length(nums_so) = 11 THEN
        RETURN '(' || substring(nums_so from 1 for 2) || ') ' || substring(nums_so from 3 for 1) || substring(nums_so from 4 for 4) || '-' || substring(nums_so from 8 for 4);
    -- Formata Fixo (10 dígitos): (XX) XXXX-XXXX
    ELSIF length(nums_so) = 10 THEN
        RETURN '(' || substring(nums_so from 1 for 2) || ') ' || substring(nums_so from 3 for 4) || '-' || substring(nums_so from 7 for 4);
    END IF;

    RETURN tel; -- Retorna o original caso não caiba na regra
END;
$$ LANGUAGE plpgsql;

-- 3. Bloco anônimo de transação que executa o saneamento e gera o relatório estatístico
DO $$
DECLARE
    r_perfil RECORD;
    has_history BOOLEAN;
    v_removidos INT := 0;
    v_corrigidos INT := 0;
    v_preservados INT := 0;
    v_total INT := 0;
BEGIN
    RAISE NOTICE 'Iniciando varredura de telefones...';

    -- Loop por todos os perfis cadastrados no banco
    FOR r_perfil IN SELECT id, nome, telefone, role FROM public.perfis LOOP
        v_total := v_total + 1;

        -- Verifica se o telefone deste perfil é fictício ou inválido
        IF public.is_telefone_ficticio(r_perfil.telefone) THEN
            
            -- Verifica se o ID do perfil possui chaves estrangeiras vinculadas em outras tabelas
            has_history := FALSE;

            -- 1. Verifica em vendas (cliente ou profissional)
            IF EXISTS (SELECT 1 FROM public.vendas WHERE cliente_id = r_perfil.id OR profissional_id = r_perfil.id) THEN
                has_history := TRUE;
            END IF;

            -- 2. Verifica em receitas
            IF NOT has_history AND EXISTS (SELECT 1 FROM public.receitas WHERE cliente_id = r_perfil.id OR medico_id = r_perfil.id) THEN
                has_history := TRUE;
            END IF;

            -- 3. Verifica em cliente_biometria_optica
            IF NOT has_history AND EXISTS (SELECT 1 FROM public.cliente_biometria_optica WHERE cliente_id = r_perfil.id) THEN
                has_history := TRUE;
            END IF;

            -- 4. Verifica em agenda
            IF NOT has_history AND EXISTS (SELECT 1 FROM public.agenda WHERE cliente_id = r_perfil.id OR profissional_id = r_perfil.id) THEN
                has_history := TRUE;
            END IF;

            -- 5. Verifica em mensagens_whatsapp
            IF NOT has_history AND EXISTS (SELECT 1 FROM public.mensagens_whatsapp WHERE cliente_id = r_perfil.id) THEN
                has_history := TRUE;
            END IF;

            -- Decisão baseada no histórico
            IF has_history THEN
                -- Se possuir histórico importante: Mantemos o perfil e apenas anulamos o telefone inválido
                UPDATE public.perfis SET telefone = NULL WHERE id = r_perfil.id;
                v_preservados := v_preservados + 1;
            ELSE
                -- Se não possuir nenhum histórico: Removemos o registro da tabela pai (limpa cascade nas tabelas clientes/profissionais)
                DELETE FROM public.perfis WHERE id = r_perfil.id;
                v_removidos := v_removidos + 1;
            END IF;

        ELSE
            -- Telefone é válido, vamos garantir a formatação brasileira correta
            DECLARE
                tel_formatado TEXT;
            BEGIN
                tel_formatado := public.formatar_telefone_br(r_perfil.telefone);
                IF tel_formatado <> r_perfil.telefone THEN
                    UPDATE public.perfis SET telefone = tel_formatado WHERE id = r_perfil.id;
                    v_corrigidos := v_corrigidos + 1;
                END IF;
            END;
        END IF;

    END LOOP;

    -- Relatório final exibido no console do Supabase
    RAISE NOTICE '==================================================';
    RAISE NOTICE 'RELATÓRIO DE SANEAMENTO DE TELEFONES';
    RAISE NOTICE '==================================================';
    RAISE NOTICE 'Total de registros analisados: %', v_total;
    RAISE NOTICE 'Quantidade de telefones fictícios removidos: %', v_removidos;
    RAISE NOTICE 'Quantidade de telefones formatados/corrigidos: %', v_corrigidos;
    RAISE NOTICE 'Quantidade de registros preservados por histórico: %', v_preservados;
    RAISE NOTICE 'Tabelas afetadas: public.perfis, public.clientes, public.profissionais';
    RAISE NOTICE '==================================================';
END;
$$;
