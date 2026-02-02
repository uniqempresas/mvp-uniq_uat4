-- =============================================================================
-- UNIQ UAT_04 - Estrutura Completa do Banco de Dados
-- Gerado em: 2026-02-01
-- Projeto Supabase: krrkfgvdwhpelxtrdtla
-- =============================================================================

-- =============================================================================
-- TABELAS DO MÓDULO: AGENDAMENTOS (AGD)
-- =============================================================================

-- Tabela: agd_agendamentos
-- Descrição: Registros de agendamentos de serviços
CREATE TABLE agd_agendamentos (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    colaborador_id UUID NOT NULL REFERENCES me_usuario(id),
    cliente_id UUID REFERENCES me_cliente(id),
    data_agendamento DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    observacao TEXT,
    status TEXT DEFAULT 'agendado',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: agd_bloqueios_fixos
-- Descrição: Bloqueios fixos na agenda (folgas, ausências programadas)
CREATE TABLE agd_bloqueios_fixos (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID,
    colaborador_id UUID,
    dia_semana INTEGER,
    hora_inicio TIME,
    hora_fim TIME,
    motivo TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: agd_config_colaboradores
-- Descrição: Configurações individuais de agenda por colaborador
CREATE TABLE agd_config_colaboradores (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID,
    colaborador_id UUID,
    aceita_agendamento_online BOOLEAN DEFAULT true,
    intervalo_minutos INTEGER DEFAULT 30,
    max_agendamentos_dia INTEGER,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: agd_ft_horarios_modelo
-- Descrição: Modelos de horário de funcionamento
CREATE TABLE agd_ft_horarios_modelo (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    nome TEXT,
    horarios JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: agd_horarios_empresa
-- Descrição: Horários de funcionamento da empresa para agenda
CREATE TABLE agd_horarios_empresa (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID,
    dia_semana INTEGER,
    hora_abertura TIME,
    hora_fechamento TIME,
    hora_intervalo_inicio TIME,
    hora_intervalo_fim TIME,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: agd_preferencias
-- Descrição: Preferências gerais do módulo de agenda
CREATE TABLE agd_preferencias (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID,
    intervalo_padrao INTEGER DEFAULT 30,
    antecedencia_minima INTEGER DEFAULT 60,
    antecedencia_maxima INTEGER DEFAULT 30,
    permitir_cancelamento BOOLEAN DEFAULT true,
    prazo_cancelamento INTEGER DEFAULT 24,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: agd_status_agendamento
-- Descrição: Status personalizados de agendamento
CREATE TABLE agd_status_agendamento (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    nome TEXT,
    cor TEXT,
    ordem INTEGER,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- TABELAS DO MÓDULO: CRM
-- =============================================================================

-- Tabela: crm_atendimentos
-- Descrição: Registro de atendimentos/interações com clientes
CREATE TABLE crm_atendimentos (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID,
    lead_id BIGINT,
    oportunidade_id BIGINT,
    tipo TEXT,
    descricao TEXT,
    data_atendimento TIMESTAMPTZ DEFAULT now(),
    usuario_id UUID,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: crm_atividades
-- Descrição: Atividades do pipeline CRM
CREATE TABLE crm_atividades (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    oportunidade_id BIGINT REFERENCES crm_oportunidades(id),
    tipo TEXT NOT NULL,
    titulo TEXT NOT NULL,
    descricao TEXT,
    data_atividade TIMESTAMPTZ NOT NULL,
    data_conclusao TIMESTAMPTZ,
    status TEXT DEFAULT 'pendente',
    responsavel_id UUID REFERENCES me_usuario(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: crm_chat_conversas
-- Descrição: Conversas de chat do CRM
CREATE TABLE crm_chat_conversas (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    cliente_id UUID REFERENCES me_cliente(id),
    lead_id BIGINT REFERENCES crm_leads(id),
    canal TEXT NOT NULL,
    status TEXT DEFAULT 'ativo',
    modo TEXT DEFAULT 'bot',
    ultima_mensagem_at TIMESTAMPTZ DEFAULT now(),
    atendente_id UUID REFERENCES me_usuario(id),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: crm_chat_mensagens
-- Descrição: Mensagens das conversas de chat
CREATE TABLE crm_chat_mensagens (
    id BIGINT PRIMARY KEY NOT NULL,
    conversa_id BIGINT NOT NULL REFERENCES crm_chat_conversas(id),
    tipo TEXT NOT NULL,
    conteudo TEXT NOT NULL,
    remetente TEXT NOT NULL,
    remetente_id UUID,
    lida BOOLEAN DEFAULT false,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: crm_etapas
-- Descrição: Etapas do funil de vendas
CREATE TABLE crm_etapas (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    nome TEXT NOT NULL,
    ordem INTEGER NOT NULL,
    cor TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: crm_leads
-- Descrição: Leads/prospectos do CRM
CREATE TABLE crm_leads (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    origem_id BIGINT REFERENCES crm_origem(id),
    status TEXT DEFAULT 'novo',
    score INTEGER DEFAULT 0,
    observacoes TEXT,
    dados_extras JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: crm_oportunidade_produtos
-- Descrição: Produtos vinculados a oportunidades
CREATE TABLE crm_oportunidade_produtos (
    id BIGINT PRIMARY KEY NOT NULL,
    oportunidade_id BIGINT NOT NULL REFERENCES crm_oportunidades(id),
    produto_id BIGINT REFERENCES me_produto(id),
    servico_id BIGINT REFERENCES me_servico(id),
    quantidade NUMERIC DEFAULT 1,
    preco_unitario NUMERIC,
    desconto NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: crm_oportunidades
-- Descrição: Oportunidades de venda do pipeline
CREATE TABLE crm_oportunidades (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    lead_id BIGINT REFERENCES crm_leads(id),
    cliente_id UUID REFERENCES me_cliente(id),
    etapa_id BIGINT NOT NULL REFERENCES crm_etapas(id),
    titulo TEXT NOT NULL,
    valor NUMERIC DEFAULT 0,
    probabilidade INTEGER DEFAULT 50,
    data_previsao DATE,
    data_conclusao DATE,
    status TEXT DEFAULT 'aberta',
    motivo_perda TEXT,
    responsavel_id UUID REFERENCES me_usuario(id),
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: crm_origem
-- Descrição: Origens de leads
CREATE TABLE crm_origem (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    nome TEXT NOT NULL,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- TABELAS DO MÓDULO: CAIXA/FINANCEIRO (CX)
-- =============================================================================

-- Tabela: cx_categorias_movimentacao_caixa
-- Descrição: Categorias de movimentação de caixa
CREATE TABLE cx_categorias_movimentacao_caixa (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID,
    tipo_id BIGINT REFERENCES cx_tipo_movimentacao_caixa(id),
    nome TEXT NOT NULL,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: cx_classe_movimentacao_caixa
-- Descrição: Classes de movimentação (receita/despesa)
CREATE TABLE cx_classe_movimentacao_caixa (
    id BIGINT PRIMARY KEY NOT NULL,
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL,
    ativo BOOLEAN DEFAULT true
);

-- Tabela: cx_contas
-- Descrição: Contas de caixa (caixas físicos, bancos)
CREATE TABLE cx_contas (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL,
    saldo_inicial NUMERIC DEFAULT 0,
    saldo_atual NUMERIC DEFAULT 0,
    ativo BOOLEAN DEFAULT true,
    aberto BOOLEAN DEFAULT false,
    data_abertura TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: cx_movimentacao_caixa
-- Descrição: Movimentações de caixa (entradas/saídas)
CREATE TABLE cx_movimentacao_caixa (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    conta_id BIGINT NOT NULL REFERENCES cx_contas(id),
    tipo TEXT NOT NULL,
    categoria_id BIGINT REFERENCES cx_categorias_movimentacao_caixa(id),
    descricao TEXT,
    valor NUMERIC NOT NULL,
    data_movimentacao TIMESTAMPTZ DEFAULT now(),
    usuario_id UUID REFERENCES me_usuario(id),
    venda_id BIGINT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: cx_tipo_movimentacao_caixa
-- Descrição: Tipos de movimentação
CREATE TABLE cx_tipo_movimentacao_caixa (
    id BIGINT PRIMARY KEY NOT NULL,
    nome TEXT NOT NULL,
    natureza TEXT NOT NULL,
    ativo BOOLEAN DEFAULT true
);

-- =============================================================================
-- TABELAS DO MÓDULO: ESTOQUE (EST)
-- =============================================================================

-- Tabela: est_compra
-- Descrição: Registro de compras/entrada de estoque
CREATE TABLE est_compra (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    fornecedor_id UUID REFERENCES me_fornecedor(id),
    numero_nota TEXT,
    data_compra DATE NOT NULL,
    valor_total NUMERIC DEFAULT 0,
    observacoes TEXT,
    status TEXT DEFAULT 'pendente',
    usuario_id UUID REFERENCES me_usuario(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: est_compra_item
-- Descrição: Itens de uma compra
CREATE TABLE est_compra_item (
    id BIGINT PRIMARY KEY NOT NULL,
    compra_id BIGINT NOT NULL REFERENCES est_compra(id),
    produto_id BIGINT REFERENCES me_produto(id),
    variacao_id BIGINT REFERENCES me_produto_variacao(id),
    quantidade NUMERIC NOT NULL,
    preco_unitario NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: est_movimentacao
-- Descrição: Movimentações de estoque (entrada/saída)
CREATE TABLE est_movimentacao (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    produto_id BIGINT REFERENCES me_produto(id),
    variacao_id BIGINT REFERENCES me_produto_variacao(id),
    tipo TEXT NOT NULL,
    quantidade NUMERIC NOT NULL,
    motivo TEXT,
    referencia_id BIGINT,
    referencia_tipo TEXT,
    usuario_id UUID REFERENCES me_usuario(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- View: est_view_estoque
-- Descrição: View consolidada de estoque atual
-- (VIEW - estrutura derivada)

-- =============================================================================
-- TABELAS DO MÓDULO: FINANCEIRO (FN)
-- =============================================================================

-- Tabela: fn_categoria
-- Descrição: Categorias financeiras (DRE)
CREATE TABLE fn_categoria (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL,
    cor TEXT,
    parent_id BIGINT REFERENCES fn_categoria(id),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: fn_conta
-- Descrição: Contas bancárias para financeiro
CREATE TABLE fn_conta (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    nome TEXT NOT NULL,
    banco TEXT,
    agencia TEXT,
    conta TEXT,
    tipo TEXT NOT NULL,
    saldo_inicial NUMERIC DEFAULT 0,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: fn_movimento
-- Descrição: Movimentos financeiros (contas a pagar/receber)
CREATE TABLE fn_movimento (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    tipo TEXT NOT NULL,
    categoria_id BIGINT REFERENCES fn_categoria(id),
    conta_id BIGINT REFERENCES fn_conta(id),
    descricao TEXT NOT NULL,
    valor NUMERIC NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento DATE,
    status TEXT DEFAULT 'pendente',
    forma_pagamento TEXT,
    documento TEXT,
    fornecedor_id UUID REFERENCES me_fornecedor(id),
    cliente_id UUID REFERENCES me_cliente(id),
    recorrencia_id BIGINT REFERENCES fn_movimento_recorrencia(id),
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: fn_movimento_recorrencia
-- Descrição: Configuração de movimentos recorrentes
CREATE TABLE fn_movimento_recorrencia (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    tipo TEXT NOT NULL,
    periodicidade TEXT NOT NULL,
    dia_vencimento INTEGER,
    quantidade_parcelas INTEGER,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- TABELAS DO MÓDULO: MINHA EMPRESA (ME)
-- =============================================================================

-- Tabela: me_cargo
-- Descrição: Cargos de colaboradores
CREATE TABLE me_cargo (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    nome TEXT NOT NULL,
    descricao TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: me_categoria
-- Descrição: Categorias de produtos/serviços
CREATE TABLE me_categoria (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    nome_categoria TEXT NOT NULL,
    descricao TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: me_cliente
-- Descrição: Cadastro de clientes
CREATE TABLE me_cliente (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    cpf_cnpj TEXT,
    data_nascimento DATE,
    endereco TEXT,
    cidade TEXT,
    estado TEXT,
    cep TEXT,
    observacoes TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: me_empresa
-- Descrição: Cadastro de empresas (principal tabela)
CREATE TABLE me_empresa (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    nome_fantasia TEXT NOT NULL,
    razao_social TEXT,
    cnpj TEXT,
    telefone TEXT,
    email TEXT,
    slug TEXT UNIQUE,
    avatar_url TEXT,
    logo_url TEXT,
    endereco TEXT,
    cidade TEXT,
    estado TEXT,
    cep TEXT,
    segmento TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: me_empresa_endereco
-- Descrição: Endereços adicionais da empresa
CREATE TABLE me_empresa_endereco (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    tipo TEXT,
    logradouro TEXT,
    numero TEXT,
    complemento TEXT,
    bairro TEXT,
    cidade TEXT,
    estado TEXT,
    cep TEXT,
    principal BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: me_forma_pagamento
-- Descrição: Formas de pagamento aceitas
CREATE TABLE me_forma_pagamento (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    nome TEXT NOT NULL,
    tipo TEXT,
    taxa_percentual NUMERIC DEFAULT 0,
    taxa_fixa NUMERIC DEFAULT 0,
    prazo_recebimento INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: me_fornecedor
-- Descrição: Cadastro de fornecedores
CREATE TABLE me_fornecedor (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    cnpj TEXT,
    endereco TEXT,
    cidade TEXT,
    estado TEXT,
    observacoes TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: me_horario_funcionamento
-- Descrição: Horários de funcionamento da empresa
CREATE TABLE me_horario_funcionamento (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    dia_semana INTEGER NOT NULL,
    hora_inicio TIME,
    hora_fim TIME,
    fechado BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: me_itens_venda
-- Descrição: Itens de uma venda (produtos)
CREATE TABLE me_itens_venda (
    id BIGINT PRIMARY KEY NOT NULL,
    venda_id BIGINT NOT NULL REFERENCES me_venda(id),
    produto_id BIGINT REFERENCES me_produto(id),
    variacao_id BIGINT REFERENCES me_produto_variacao(id),
    quantidade NUMERIC NOT NULL,
    preco_unitario NUMERIC NOT NULL,
    desconto NUMERIC DEFAULT 0,
    subtotal NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: me_produto
-- Descrição: Cadastro de produtos
CREATE TABLE me_produto (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    nome_produto TEXT NOT NULL,
    descricao TEXT,
    preco NUMERIC NOT NULL,
    preco_varejo NUMERIC,
    preco_custo NUMERIC,
    categoria_id BIGINT REFERENCES me_categoria(id),
    subcategoria_id BIGINT REFERENCES me_subcategoria(id),
    unidade_medida_id BIGINT REFERENCES me_unidade_medida(id),
    codigo_barras TEXT,
    sku TEXT,
    tipo TEXT DEFAULT 'simples',
    estoque_atual NUMERIC DEFAULT 0,
    estoque_minimo NUMERIC DEFAULT 0,
    ativo BOOLEAN DEFAULT true,
    exibir_vitrine BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: me_produto_imagem
-- Descrição: Imagens de produtos
CREATE TABLE me_produto_imagem (
    id BIGINT PRIMARY KEY NOT NULL,
    produto_id BIGINT NOT NULL REFERENCES me_produto(id),
    variacao_id BIGINT REFERENCES me_produto_variacao(id),
    imagem_url TEXT NOT NULL,
    ordem_exibicao INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: me_produto_variacao
-- Descrição: Variações de produtos (tamanho, cor, etc)
CREATE TABLE me_produto_variacao (
    id BIGINT PRIMARY KEY NOT NULL,
    produto_pai_id BIGINT NOT NULL REFERENCES me_produto(id),
    nome_variacao TEXT NOT NULL,
    sku TEXT,
    preco NUMERIC,
    preco_varejo NUMERIC,
    preco_custo NUMERIC,
    estoque NUMERIC DEFAULT 0,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: me_servico
-- Descrição: Cadastro de serviços
CREATE TABLE me_servico (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    nome_servico TEXT NOT NULL,
    descricao TEXT,
    preco NUMERIC NOT NULL,
    duracao_minutos INTEGER DEFAULT 60,
    categoria_id BIGINT REFERENCES me_categoria(id),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: me_subcategoria
-- Descrição: Subcategorias de produtos/serviços
CREATE TABLE me_subcategoria (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    categoria_id BIGINT NOT NULL REFERENCES me_categoria(id),
    nome_subcategoria TEXT NOT NULL,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: me_unidade_medida
-- Descrição: Unidades de medida (UN, KG, etc)
CREATE TABLE me_unidade_medida (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    sigla TEXT NOT NULL,
    descricao TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: me_usuario
-- Descrição: Usuários do sistema (colaboradores)
CREATE TABLE me_usuario (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT,
    cargo_id BIGINT REFERENCES me_cargo(id),
    avatar_url TEXT,
    role TEXT DEFAULT 'colaborador',
    ativo BOOLEAN DEFAULT true,
    aceita_agendamento BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: me_venda
-- Descrição: Registro de vendas
CREATE TABLE me_venda (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    cliente_id UUID REFERENCES me_cliente(id),
    usuario_id UUID REFERENCES me_usuario(id),
    caixa_id BIGINT REFERENCES cx_contas(id),
    forma_pagamento_id BIGINT REFERENCES me_forma_pagamento(id),
    valor_total NUMERIC NOT NULL,
    desconto NUMERIC DEFAULT 0,
    status_venda TEXT DEFAULT 'concluida',
    canal_venda TEXT DEFAULT 'loja',
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: me_venda_servicos
-- Descrição: Registro de vendas de serviços
CREATE TABLE me_venda_servicos (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    cliente_id UUID REFERENCES me_cliente(id),
    colaborador_id UUID REFERENCES me_usuario(id),
    caixa_id BIGINT REFERENCES cx_contas(id),
    forma_pagamento_id BIGINT REFERENCES me_forma_pagamento(id),
    valor_total NUMERIC NOT NULL,
    desconto NUMERIC DEFAULT 0,
    status_venda TEXT DEFAULT 'concluida',
    data_servico DATE DEFAULT CURRENT_DATE,
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: me_venda_servicos_itens
-- Descrição: Itens de vendas de serviços
CREATE TABLE me_venda_servicos_itens (
    id BIGINT PRIMARY KEY NOT NULL,
    venda_servico_id BIGINT NOT NULL REFERENCES me_venda_servicos(id),
    servico_id BIGINT REFERENCES me_servico(id),
    produto_id BIGINT REFERENCES me_produto(id),
    quantidade NUMERIC DEFAULT 1,
    preco_unitario NUMERIC NOT NULL,
    desconto NUMERIC DEFAULT 0,
    subtotal NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- TABELAS DO MÓDULO: MEL (IA/CHAT)
-- =============================================================================

-- Tabela: mel_chat
-- Descrição: Histórico de chat com IA
CREATE TABLE mel_chat (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    usuario_id UUID REFERENCES me_usuario(id),
    projeto_id BIGINT REFERENCES mel_projetos(id),
    mensagem TEXT NOT NULL,
    resposta TEXT,
    tipo TEXT DEFAULT 'chat',
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: mel_chat_buffer
-- Descrição: Buffer de mensagens para processamento IA
CREATE TABLE mel_chat_buffer (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID,
    usuario_id UUID,
    mensagens JSONB,
    contexto JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ
);

-- Tabela: mel_chat_custos
-- Descrição: Registro de custos de uso de IA
CREATE TABLE mel_chat_custos (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    chat_id BIGINT REFERENCES mel_chat(id),
    modelo TEXT,
    tokens_entrada INTEGER,
    tokens_saida INTEGER,
    custo_estimado NUMERIC,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: mel_consultoria
-- Descrição: Sessões de consultoria IA
CREATE TABLE mel_consultoria (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    projeto_id BIGINT REFERENCES mel_projetos(id),
    titulo TEXT,
    status TEXT DEFAULT 'ativa',
    resumo TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: mel_consultoria_config
-- Descrição: Configurações de consultoria por projeto
CREATE TABLE mel_consultoria_config (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    projeto_id BIGINT REFERENCES mel_projetos(id),
    modelo_ia TEXT DEFAULT 'gpt-4',
    temperatura NUMERIC DEFAULT 0.7,
    max_tokens INTEGER DEFAULT 2000,
    prompt_sistema TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: mel_projetos
-- Descrição: Projetos de consultoria/IA
CREATE TABLE mel_projetos (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    nome TEXT NOT NULL,
    descricao TEXT,
    tipo TEXT DEFAULT 'consultoria',
    status TEXT DEFAULT 'ativo',
    configuracao JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- TABELAS DO MÓDULO: UNIQ SISTEMA (UNQ)
-- =============================================================================

-- Tabela: unq_empresa_modulos
-- Descrição: Módulos ativados por empresa
CREATE TABLE unq_empresa_modulos (
    id BIGINT PRIMARY KEY NOT NULL,
    empresa_id UUID NOT NULL REFERENCES me_empresa(id),
    modulo_id BIGINT NOT NULL REFERENCES unq_modulos_sistema(id),
    ativo BOOLEAN DEFAULT true,
    data_ativacao TIMESTAMPTZ DEFAULT now(),
    data_expiracao TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela: unq_modulos_sistema
-- Descrição: Catálogo de módulos do sistema UNIQ
CREATE TABLE unq_modulos_sistema (
    id BIGINT PRIMARY KEY NOT NULL,
    nome TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    descricao TEXT,
    icone TEXT,
    ativo BOOLEAN DEFAULT true,
    ordem INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- VIEWS
-- =============================================================================

-- View: view_historico_vendas_servicos
-- Descrição: Histórico unificado de vendas e serviços
-- Campos: id, empresa_id, tipo, usuario_id, nome_vendedor, valor_total, 
--         status_venda, data_venda, forma_pagamento, nome_forma_pagamento,
--         canal_venda, categoria_ids, subcategoria_ids

-- View: est_view_estoque
-- Descrição: Estoque consolidado por produto/variação

-- =============================================================================
-- FUNÇÕES
-- =============================================================================

-- Função: atualiza_timestamp()
-- Tipo: TRIGGER
-- Descrição: Atualiza campo updated_at automaticamente
CREATE OR REPLACE FUNCTION atualiza_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função: criar_empresa_e_configuracoes_iniciais()
-- Tipo: FUNCTION
-- Retorno: JSONB
-- Descrição: Cria empresa e todas as configurações iniciais padrão

-- Função: me_excluir_conta()
-- Tipo: FUNCTION
-- Retorno: VOID
-- Descrição: Exclui conta de usuário e dados relacionados

-- Função: save_opportunity_full()
-- Tipo: FUNCTION
-- Retorno: JSONB
-- Descrição: Salva oportunidade com todos os relacionamentos (produtos, atividades)

-- =============================================================================
-- RESUMO DE RELACIONAMENTOS (FKs)
-- =============================================================================

/*
CHAVES ESTRANGEIRAS PRINCIPAIS:

agd_agendamentos:
  -> me_empresa (empresa_id)
  -> me_usuario (colaborador_id)
  -> me_cliente (cliente_id)

crm_atividades:
  -> me_empresa (empresa_id)
  -> crm_oportunidades (oportunidade_id)
  -> me_usuario (responsavel_id)

crm_chat_conversas:
  -> me_empresa (empresa_id)
  -> me_cliente (cliente_id)
  -> crm_leads (lead_id)
  -> me_usuario (atendente_id)

crm_oportunidades:
  -> me_empresa (empresa_id)
  -> crm_leads (lead_id)
  -> me_cliente (cliente_id)
  -> crm_etapas (etapa_id)
  -> me_usuario (responsavel_id)

me_produto:
  -> me_empresa (empresa_id)
  -> me_categoria (categoria_id)
  -> me_subcategoria (subcategoria_id)
  -> me_unidade_medida (unidade_medida_id)

me_venda:
  -> me_empresa (empresa_id)
  -> me_cliente (cliente_id)
  -> me_usuario (usuario_id)
  -> cx_contas (caixa_id)
  -> me_forma_pagamento (forma_pagamento_id)

fn_movimento:
  -> me_empresa (empresa_id)
  -> fn_categoria (categoria_id)
  -> fn_conta (conta_id)
  -> me_fornecedor (fornecedor_id)
  -> me_cliente (cliente_id)
*/

-- =============================================================================
-- TOTAL: 57 TABELAS/VIEWS | 4 FUNÇÕES
-- =============================================================================
