-- =====================================================
-- Migration: Função RPC para criar empresa e usuário
-- =====================================================
-- Descrição: Cria função para cadastro atômico de
--            empresa + usuário durante onboarding
-- =====================================================

-- Remover função se já existir (para permitir recriar)
drop function if exists criar_empresa_e_configuracoes_iniciais;

-- Criar função RPC
create or replace function criar_empresa_e_configuracoes_iniciais(
    p_usuario_id uuid,
    p_nome_fantasia text,
    p_cnpj text,
    p_telefone text,
    p_email_contato text,
    p_slug text
)
returns uuid
language plpgsql
security definer -- Executa com privilégios do owner (bypass RLS)
set search_path = public
as $$
declare
    v_empresa_id uuid;
begin
    -- Validações básicas
    if p_usuario_id is null then
        raise exception 'ID do usuário não pode ser nulo';
    end if;
    
    if p_nome_fantasia is null or trim(p_nome_fantasia) = '' then
        raise exception 'Nome fantasia é obrigatório';
    end if;
    
    if p_slug is null or trim(p_slug) = '' then
        raise exception 'Slug é obrigatório';
    end if;

    -- Verificar se usuário já existe
    if exists (select 1 from me_usuario where id = p_usuario_id) then
        raise exception 'Usuário já está cadastrado';
    end if;

    -- Verificar se slug já está em uso
    if exists (select 1 from me_empresa where slug = p_slug) then
        raise exception 'Slug já está em uso. Tente outro nome para a empresa.';
    end if;

    -- 1. Criar empresa
    insert into me_empresa (
        nome_fantasia,
        cnpj,
        telefone,
        email_contato,
        slug,
        ativo
    )
    values (
        p_nome_fantasia,
        p_cnpj,
        p_telefone,
        p_email_contato,
        p_slug,
        true
    )
    returning id into v_empresa_id;

    -- 2. Vincular usuário à empresa
    insert into me_usuario (
        id,
        empresa_id,
        nome,
        email,
        ativo
    )
    values (
        p_usuario_id,
        v_empresa_id,
        '', -- Nome será atualizado posteriormente se necessário
        p_email_contato,
        true
    );

    -- 3. Retornar ID da empresa criada
    return v_empresa_id;

exception
    when others then
        -- Em caso de erro, rollback automático acontece
        raise exception 'Erro ao criar empresa: %', sqlerrm;
end;
$$;

-- Comentário da função
comment on function criar_empresa_e_configuracoes_iniciais is 
    'Cria empresa e vincula usuário de forma atômica durante onboarding';

-- =====================================================
-- Permissões
-- =====================================================

-- Permitir que usuários autenticados executem a função
grant execute on function criar_empresa_e_configuracoes_iniciais to authenticated;

-- =====================================================
-- Função auxiliar: Obter empresa do usuário
-- =====================================================

create or replace function get_user_empresa_id(p_user_id uuid default auth.uid())
returns uuid
language sql
security definer
stable
as $$
    select empresa_id from me_usuario where id = p_user_id limit 1;
$$;

comment on function get_user_empresa_id is 
    'Retorna o ID da empresa do usuário autenticado';

grant execute on function get_user_empresa_id to authenticated;

-- =====================================================
-- Função auxiliar: Verificar se slug está disponível
-- =====================================================

create or replace function is_slug_available(p_slug text)
returns boolean
language sql
security definer
stable
as $$
    select not exists (select 1 from me_empresa where slug = p_slug);
$$;

comment on function is_slug_available is 
    'Verifica se um slug está disponível para uso';

grant execute on function is_slug_available to authenticated, anon;
