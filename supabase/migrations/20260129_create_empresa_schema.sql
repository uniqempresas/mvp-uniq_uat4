-- =====================================================
-- Migration: Schema completo para cadastro de empresas
-- =====================================================
-- Descrição: Cria todas as tabelas necessárias para o
--            sistema de cadastro de empresas e usuários
-- =====================================================

-- Criar tabela de empresas
create table if not exists me_empresa (
    id uuid primary key default gen_random_uuid(),
    nome_fantasia text not null,
    razao_social text,
    cnpj text unique,
    telefone text,
    email_contato text,
    slug text unique not null,
    ativo boolean default true,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Criar índices para performance
create index if not exists idx_me_empresa_slug on me_empresa(slug);
create index if not exists idx_me_empresa_cnpj on me_empresa(cnpj);
create index if not exists idx_me_empresa_ativo on me_empresa(ativo);

-- Comentários da tabela
comment on table me_empresa is 'Cadastro de empresas no sistema';
comment on column me_empresa.slug is 'Slug único para URL pública da empresa';
comment on column me_empresa.ativo is 'Indica se a empresa está ativa no sistema';

-- =====================================================
-- Tabela de usuários vinculados a empresas
-- =====================================================

create table if not exists me_usuario (
    id uuid primary key references auth.users(id) on delete cascade,
    empresa_id uuid not null references me_empresa(id) on delete cascade,
    nome text,
    email text,
    ativo boolean default true,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Índices
create index if not exists idx_me_usuario_empresa_id on me_usuario(empresa_id);
create index if not exists idx_me_usuario_email on me_usuario(email);
create index if not exists idx_me_usuario_ativo on me_usuario(ativo);

-- Comentários
comment on table me_usuario is 'Usuários do sistema vinculados às empresas';
comment on column me_usuario.id is 'FK para auth.users - mesmo ID do usuário autenticado';
comment on column me_usuario.empresa_id is 'Empresa à qual o usuário pertence';

-- =====================================================
-- Tabela de endereços de empresas
-- =====================================================

create table if not exists me_empresa_endereco (
    id uuid primary key default gen_random_uuid(),
    empresa_id uuid not null references me_empresa(id) on delete cascade,
    cep text,
    logradouro text,
    numero text,
    complemento text,
    bairro text,
    cidade text,
    uf text,
    ibge text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Índices
create index if not exists idx_me_empresa_endereco_empresa_id on me_empresa_endereco(empresa_id);
create index if not exists idx_me_empresa_endereco_cep on me_empresa_endereco(cep);

-- Comentários
comment on table me_empresa_endereco is 'Endereços das empresas cadastradas';

-- =====================================================
-- Políticas RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS nas tabelas
alter table me_empresa enable row level security;
alter table me_usuario enable row level security;
alter table me_empresa_endereco enable row level security;

-- =====================================================
-- Políticas para me_empresa
-- =====================================================

-- Permitir que usuários autenticados criem empresas
create policy "Usuários podem criar empresas"
on me_empresa for insert
to authenticated
with check (true);

-- Permitir que usuários leiam empresas às quais pertencem
create policy "Usuários podem ler suas empresas"
on me_empresa for select
to authenticated
using (
    id in (
        select empresa_id from me_usuario where id = auth.uid()
    )
);

-- Permitir que usuários atualizem suas empresas
create policy "Usuários podem atualizar suas empresas"
on me_empresa for update
to authenticated
using (
    id in (
        select empresa_id from me_usuario where id = auth.uid()
    )
);

-- =====================================================
-- Políticas para me_usuario
-- =====================================================

-- Permitir que usuários criem seu próprio registro
create policy "Usuários podem criar seu próprio cadastro"
on me_usuario for insert
to authenticated
with check (auth.uid() = id);

-- Permitir que usuários leiam registros da mesma empresa
create policy "Usuários podem ler usuários da mesma empresa"
on me_usuario for select
to authenticated
using (
    empresa_id in (
        select empresa_id from me_usuario where id = auth.uid()
    )
);

-- Permitir que usuários atualizem seu próprio registro
create policy "Usuários podem atualizar seu próprio cadastro"
on me_usuario for update
to authenticated
using (auth.uid() = id);

-- =====================================================
-- Políticas para me_empresa_endereco
-- =====================================================

-- Permitir que usuários criem endereços para suas empresas
create policy "Usuários podem criar endereços de suas empresas"
on me_empresa_endereco for insert
to authenticated
with check (
    empresa_id in (
        select empresa_id from me_usuario where id = auth.uid()
    )
);

-- Permitir que usuários leiam endereços de suas empresas
create policy "Usuários podem ler endereços de suas empresas"
on me_empresa_endereco for select
to authenticated
using (
    empresa_id in (
        select empresa_id from me_usuario where id = auth.uid()
    )
);

-- Permitir que usuários atualizem endereços de suas empresas
create policy "Usuários podem atualizar endereços de suas empresas"
on me_empresa_endereco for update
to authenticated
using (
    empresa_id in (
        select empresa_id from me_usuario where id = auth.uid()
    )
);

-- =====================================================
-- Políticas públicas para Storefront
-- =====================================================

-- Permitir leitura pública de empresas ativas (para storefront)
create policy "Leitura pública de empresas ativas via slug"
on me_empresa for select
to anon
using (ativo = true);

-- =====================================================
-- Triggers para updated_at
-- =====================================================

-- Função para atualizar updated_at automaticamente
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Trigger para me_empresa
drop trigger if exists update_me_empresa_updated_at on me_empresa;
create trigger update_me_empresa_updated_at
    before update on me_empresa
    for each row
    execute function update_updated_at_column();

-- Trigger para me_usuario
drop trigger if exists update_me_usuario_updated_at on me_usuario;
create trigger update_me_usuario_updated_at
    before update on me_usuario
    for each row
    execute function update_updated_at_column();

-- Trigger para me_empresa_endereco
drop trigger if exists update_me_empresa_endereco_updated_at on me_empresa_endereco;
create trigger update_me_empresa_endereco_updated_at
    before update on me_empresa_endereco
    for each row
    execute function update_updated_at_column();
