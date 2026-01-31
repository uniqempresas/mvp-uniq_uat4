-- =====================================================
-- Migration: Adicionar CASCADE DELETE para me_empresa
-- =====================================================
-- Data: 31/01/2026
-- Descrição: Adiciona ON DELETE CASCADE em todas as
--            foreign keys que referenciam me_empresa
--            para permitir deleção limpa de empresas
-- =====================================================

-- Tabelas principais que DEVEM ter CASCADE
-- (dados que não fazem sentido existir sem a empresa)

-- 1. me_usuario
ALTER TABLE me_usuario 
DROP CONSTRAINT IF EXISTS me_usuario_empresa_id_fkey;

ALTER TABLE me_usuario
ADD CONSTRAINT me_usuario_empresa_id_fkey
FOREIGN KEY (empresa_id) REFERENCES me_empresa(id) ON DELETE CASCADE;

-- 2. me_produto
ALTER TABLE me_produto
DROP CONSTRAINT IF EXISTS me_produto_empresa_id_fkey;

ALTER TABLE me_produto
ADD CONSTRAINT me_produto_empresa_id_fkey
FOREIGN KEY (empresa_id) REFERENCES me_empresa(id) ON DELETE CASCADE;

-- 3. me_servico
ALTER TABLE me_servico
DROP CONSTRAINT IF EXISTS me_servico_empresa_id_fkey;

ALTER TABLE me_servico
ADD CONSTRAINT me_servico_empresa_id_fkey
FOREIGN KEY (empresa_id) REFERENCES me_empresa(id) ON DELETE CASCADE;

-- 4. me_categoria
ALTER TABLE me_categoria
DROP CONSTRAINT IF EXISTS me_categoria_empresa_id_fkey;

ALTER TABLE me_categoria
ADD CONSTRAINT me_categoria_empresa_id_fkey
FOREIGN KEY (empresa_id) REFERENCES me_empresa(id) ON DELETE CASCADE;

-- 5. me_unidade_medida
ALTER TABLE me_unidade_medida
DROP CONSTRAINT IF EXISTS me_unidade_medida_empresa_id_fkey;

ALTER TABLE me_unidade_medida
ADD CONSTRAINT me_unidade_medida_empresa_id_fkey
FOREIGN KEY (empresa_id) REFERENCES me_empresa(id) ON DELETE CASCADE;

-- 6. CRM
ALTER TABLE crm_etapas
DROP CONSTRAINT IF EXISTS crm_etapas_empresa_id_fkey;

ALTER TABLE crm_etapas
ADD CONSTRAINT crm_etapas_empresa_id_fkey
FOREIGN KEY (empresa_id) REFERENCES me_empresa(id) ON DELETE CASCADE;

ALTER TABLE crm_chat_conversas
DROP CONSTRAINT IF EXISTS crm_chat_conversas_empresa_id_fkey;

ALTER TABLE crm_chat_conversas
ADD CONSTRAINT crm_chat_conversas_empresa_id_fkey
FOREIGN KEY (empresa_id) REFERENCES me_empresa(id) ON DELETE CASCADE;

-- 7. Financeiro (cx_*)
ALTER TABLE cx_contas
DROP CONSTRAINT IF EXISTS cx_contas_empresa_id_fkey;

ALTER TABLE cx_contas
ADD CONSTRAINT cx_contas_empresa_id_fkey
FOREIGN KEY (empresa_id) REFERENCES me_empresa(id) ON DELETE CASCADE;

ALTER TABLE cx_movimentacao_caixa
DROP CONSTRAINT IF EXISTS cx_movimentacao_caixa_empresa_id_fkey;

ALTER TABLE cx_movimentacao_caixa
ADD CONSTRAINT cx_movimentacao_caixa_empresa_id_fkey
FOREIGN KEY (empresa_id) REFERENCES me_empresa(id) ON DELETE CASCADE;

-- 8. Estoque
ALTER TABLE est_compra
DROP CONSTRAINT IF EXISTS est_compra_empresa_id_fkey;

ALTER TABLE est_compra
ADD CONSTRAINT est_compra_empresa_id_fkey
FOREIGN KEY (empresa_id) REFERENCES me_empresa(id) ON DELETE CASCADE;

ALTER TABLE est_movimentacao
DROP CONSTRAINT IF EXISTS est_movimentacao_empresa_id_fkey;

ALTER TABLE est_movimentacao
ADD CONSTRAINT est_movimentacao_empresa_id_fkey
FOREIGN KEY (empresa_id) REFERENCES me_empresa(id) ON DELETE CASCADE;

-- 9. Vendas e Serviços
ALTER TABLE me_venda_servicos
DROP CONSTRAINT IF EXISTS me_venda_servicos_empresa_id_fkey;

ALTER TABLE me_venda_servicos
ADD CONSTRAINT me_venda_servicos_empresa_id_fkey
FOREIGN KEY (empresa_id) REFERENCES me_empresa(id) ON DELETE CASCADE;

ALTER TABLE me_venda_servicos_itens
DROP CONSTRAINT IF EXISTS me_venda_servicos_itens_empresa_id_fkey;

ALTER TABLE me_venda_servicos_itens
ADD CONSTRAINT me_venda_servicos_itens_empresa_id_fkey
FOREIGN KEY (empresa_id) REFERENCES me_empresa(id) ON DELETE CASCADE;

-- 10. Agenda
ALTER TABLE agd_ft_horarios_modelo
DROP CONSTRAINT IF EXISTS agd_ft_horarios_modelo_empresa_id_fkey;

ALTER TABLE agd_ft_horarios_modelo
ADD CONSTRAINT agd_ft_horarios_modelo_empresa_id_fkey
FOREIGN KEY (empresa_id) REFERENCES me_empresa(id) ON DELETE CASCADE;

ALTER TABLE agd_status_agendamento
DROP CONSTRAINT IF EXISTS agd_status_agendamento_empresa_id_fkey;

ALTER TABLE agd_status_agendamento
ADD CONSTRAINT agd_status_agendamento_empresa_id_fkey
FOREIGN KEY (empresa_id) REFERENCES me_empresa(id) ON DELETE CASCADE;

-- 11. Consultoria (mel_*)
ALTER TABLE mel_consultoria_config
DROP CONSTRAINT IF EXISTS mel_consultoria_config_empresa_id_fkey;

ALTER TABLE mel_consultoria_config
ADD CONSTRAINT mel_consultoria_config_empresa_id_fkey
FOREIGN KEY (empresa_id) REFERENCES me_empresa(id) ON DELETE CASCADE;

ALTER TABLE mel_projetos
DROP CONSTRAINT IF EXISTS mel_projetos_empresa_id_fkey;

ALTER TABLE mel_projetos
ADD CONSTRAINT mel_projetos_empresa_id_fkey
FOREIGN KEY (empresa_id) REFERENCES me_empresa(id) ON DELETE CASCADE;

-- Comentário
COMMENT ON TABLE me_empresa IS 'Cadastro de empresas no sistema. Deletar uma empresa remove TODOS os dados relacionados via CASCADE.';
