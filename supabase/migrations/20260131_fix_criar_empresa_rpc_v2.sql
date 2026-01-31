-- =====================================================
-- Migration: Corrigir schema da RPC criar_empresa
-- =====================================================
-- Data: 31/01/2026
-- Descrição: Corrige nomes de colunas na RPC para
--            usar schema real:
--            - nome_categoria (não 'nome')
--            - nome_produto (não 'nome')
--            - preco (não 'preco_venda')
-- =====================================================

-- Drop função antiga
drop function if exists criar_empresa_e_configuracoes_iniciais;

-- Criar função RPC corrigida
create or replace function criar_empresa_e_configuracoes_iniciais(
    p_usuario_id uuid,
    p_nome_fantasia text,
    p_cnpj text,
    p_telefone text,
    p_email text,
    p_slug text,
    -- Parâmetros de endereço
    p_cep text default null,
    p_logradouro text default null,
    p_numero text default null,
    p_complemento text default null,
    p_bairro text default null,
    p_cidade text default null,
    p_uf text default null,
    p_ibge text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    v_empresa_id uuid;
    v_categoria_produtos_id integer;
    v_categoria_servicos_id integer;
    v_resultado jsonb;
begin
    -- ===== VALIDAÇÕES =====
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

    -- ===== 1. CRIAR EMPRESA =====
    insert into me_empresa (
        id,
        nome_fantasia,
        cnpj,
        telefone,
        email,
        slug
    )
    values (
        p_usuario_id,
        p_nome_fantasia,
        p_cnpj,
        p_telefone,
        p_email,
        p_slug
    )
    returning id into v_empresa_id;

    -- ===== 2. VINCULAR USUÁRIO À EMPRESA =====
    insert into me_usuario (
        id,
        empresa_id
    )
    values (
        p_usuario_id,
        v_empresa_id
    );

    -- ===== 3. CRIAR ENDEREÇO (se fornecido) =====
    if p_cep is not null then
        insert into me_empresa_endereco (
            empresa_id,
            cep,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            uf,
            ibge
        )
        values (
            v_empresa_id,
            p_cep,
            p_logradouro,
            p_numero,
            p_complemento,
            p_bairro,
            p_cidade,
            p_uf,
            p_ibge
        );
    end if;

    -- ===== 4. CRIAR CATEGORIAS INICIAIS =====
    -- CORRIGIDO: usa nome_categoria
    insert into me_categoria (empresa_id, nome_categoria)
    values (v_empresa_id, 'Produtos')
    returning id_categoria into v_categoria_produtos_id;

    insert into me_categoria (empresa_id, nome_categoria)
    values (v_empresa_id, 'Serviços')
    returning id_categoria into v_categoria_servicos_id;

    -- ===== 5. CRIAR PRODUTOS INICIAIS (EXEMPLOS) =====
    -- CORRIGIDO: usa nome_produto e preco
    insert into me_produto (
        empresa_id,
        categoria_id,
        nome_produto,
        descricao,
        preco,
        ativo
    )
    values
    (
        v_empresa_id,
        v_categoria_produtos_id,
        'Produto Exemplo 1',
        'Este é um produto de exemplo. Edite ou delete conforme necessário.',
        100.00,
        true
    ),
    (
        v_empresa_id,
        v_categoria_produtos_id,
        'Produto Exemplo 2',
        'Outro produto de exemplo para você começar.',
        200.00,
        true
    ),
    (
        v_empresa_id,
        v_categoria_servicos_id,
        'Serviço Exemplo',
        'Este é um serviço de exemplo. Personalize de acordo com seu negócio.',
        150.00,
        true
    );

    -- ===== 6. PREPARAR RESULTADO =====
    v_resultado := jsonb_build_object(
        'success', true,
        'empresa_id', v_empresa_id,
        'message', 'Empresa criada com sucesso! Produtos e categorias de exemplo foram adicionados.'
    );

    return v_resultado;

exception
    when others then
        raise exception 'Erro ao criar empresa: %', sqlerrm;
end;
$$;

-- Comentário e permissões
comment on function criar_empresa_e_configuracoes_iniciais is 
    'Cria empresa, vincula usuário, cria endereço e adiciona dados iniciais (categorias e produtos de exemplo) de forma atômica durante onboarding';

grant execute on function criar_empresa_e_configuracoes_iniciais to authenticated;
