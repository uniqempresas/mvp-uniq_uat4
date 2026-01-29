# Database Schema - UNIQ Empresas

**Data de exportação**: [PREENCHER]  
**Ambiente**: Production Supabase

---

## 📋 Instruções de Preenchimento

1. Execute o script `export_schema.sql` no SQL Editor do Supabase
2. Copie os resultados de cada query
3. Cole nas seções correspondentes abaixo
4. Salve este arquivo

---

## 🗂️ Tabelas Existentes

```
--'=== TABELAS ==='

| table_name                       | table_type |
| -------------------------------- | ---------- |
| agd_agendamentos                 | BASE TABLE |
| agd_bloqueios_fixos              | BASE TABLE |
| agd_config_colaboradores         | BASE TABLE |
| agd_ft_horarios_modelo           | BASE TABLE |
| agd_horarios_empresa             | BASE TABLE |
| agd_preferencias                 | BASE TABLE |
| agd_status_agendamento           | BASE TABLE |
| crm_atendimentos                 | BASE TABLE |
| crm_atividades                   | BASE TABLE |
| crm_chat_conversas               | BASE TABLE |
| crm_chat_mensagens               | BASE TABLE |
| crm_etapas                       | BASE TABLE |
| crm_leads                        | BASE TABLE |
| crm_oportunidade_produtos        | BASE TABLE |
| crm_oportunidades                | BASE TABLE |
| crm_origem                       | BASE TABLE |
| cx_categorias_movimentacao_caixa | BASE TABLE |
| cx_classe_movimentacao_caixa     | BASE TABLE |
| cx_contas                        | BASE TABLE |
| cx_movimentacao_caixa            | BASE TABLE |
| cx_tipo_movimentacao_caixa       | BASE TABLE |
| est_compra                       | BASE TABLE |
| est_compra_item                  | BASE TABLE |
| est_movimentacao                 | BASE TABLE |
| est_view_estoque                 | VIEW       |
| fn_categoria                     | BASE TABLE |
| fn_conta                         | BASE TABLE |
| fn_movimento                     | BASE TABLE |
| fn_movimento_recorrencia         | BASE TABLE |
| me_cargo                         | BASE TABLE |
| me_categoria                     | BASE TABLE |
| me_cliente                       | BASE TABLE |
| me_empresa                       | BASE TABLE |
| me_empresa_endereco              | BASE TABLE |
| me_forma_pagamento               | BASE TABLE |
| me_fornecedor                    | BASE TABLE |
| me_horario_funcionamento         | BASE TABLE |
| me_itens_venda                   | BASE TABLE |
| me_produto                       | BASE TABLE |
| me_produto_imagem                | BASE TABLE |
| me_produto_variacao              | BASE TABLE |
| me_servico                       | BASE TABLE |
| me_subcategoria                  | BASE TABLE |
| me_unidade_medida                | BASE TABLE |
| me_usuario                       | BASE TABLE |
| me_venda                         | BASE TABLE |
| me_venda_servicos                | BASE TABLE |
| me_venda_servicos_itens          | BASE TABLE |
| mel_chat                         | BASE TABLE |
| mel_chat_buffer                  | BASE TABLE |
| mel_chat_custos                  | BASE TABLE |
| mel_consultoria                  | BASE TABLE |
| mel_consultoria_config           | BASE TABLE |
| mel_projetos                     | BASE TABLE |
| unq_empresa_modulos              | BASE TABLE |
| unq_modulos_sistema              | BASE TABLE |
| view_historico_vendas_servicos   | VIEW       |



--'=== ESTRUTURA DAS TABELAS ==='

| table_name                       | column_name     |
| -------------------------------- | --------------- |
| agd_agendamentos                 | id              |
| agd_bloqueios_fixos              | id              |
| agd_config_colaboradores         | id              |
| agd_ft_horarios_modelo           | id              |
| agd_horarios_empresa             | id              |
| agd_preferencias                 | id              |
| agd_status_agendamento           | id              |
| crm_atendimentos                 | id              |
| crm_atividades                   | id              |
| crm_chat_conversas               | id              |
| crm_chat_mensagens               | id              |
| crm_etapas                       | id              |
| crm_leads                        | id              |
| crm_oportunidade_produtos        | id              |
| crm_oportunidades                | id              |
| crm_origem                       | id              |
| cx_categorias_movimentacao_caixa | id_categoria    |
| cx_classe_movimentacao_caixa     | id_classe       |
| cx_contas                        | id              |
| cx_movimentacao_caixa            | id              |
| cx_tipo_movimentacao_caixa       | id_tipo         |
| est_compra                       | id              |
| est_compra_item                  | id              |
| est_movimentacao                 | id              |
| fn_categoria                     | id              |
| fn_conta                         | id              |
| fn_movimento                     | id              |
| fn_movimento_recorrencia         | id              |
| me_cargo                         | id              |
| me_categoria                     | id_categoria    |
| me_cliente                       | id              |
| me_empresa                       | id              |
| me_empresa_endereco              | id              |
| me_forma_pagamento               | id              |
| me_fornecedor                    | id              |
| me_horario_funcionamento         | id              |
| me_itens_venda                   | id              |
| me_produto                       | id              |
| me_produto_imagem                | id              |
| me_produto_variacao              | id              |
| me_servico                       | id              |
| me_subcategoria                  | id_subcategoria |
| me_unidade_medida                | id              |
| me_usuario                       | id              |
| me_venda                         | id              |
| me_venda_servicos                | id              |
| me_venda_servicos_itens          | id              |
| mel_chat                         | id              |
| mel_chat_buffer                  | id              |
| mel_chat_custos                  | id              |
| mel_consultoria                  | id              |
| mel_consultoria_config           | id              |
| mel_projetos                     | id              |
| unq_empresa_modulos              | id              |
| unq_modulos_sistema              | id              |

--  '=== PRIMARY KEYS ==='

| table_name                       | column_name     |
| -------------------------------- | --------------- |
| agd_agendamentos                 | id              |
| agd_bloqueios_fixos              | id              |
| agd_config_colaboradores         | id              |
| agd_ft_horarios_modelo           | id              |
| agd_horarios_empresa             | id              |
| agd_preferencias                 | id              |
| agd_status_agendamento           | id              |
| crm_atendimentos                 | id              |
| crm_atividades                   | id              |
| crm_chat_conversas               | id              |
| crm_chat_mensagens               | id              |
| crm_etapas                       | id              |
| crm_leads                        | id              |
| crm_oportunidade_produtos        | id              |
| crm_oportunidades                | id              |
| crm_origem                       | id              |
| cx_categorias_movimentacao_caixa | id_categoria    |
| cx_classe_movimentacao_caixa     | id_classe       |
| cx_contas                        | id              |
| cx_movimentacao_caixa            | id              |
| cx_tipo_movimentacao_caixa       | id_tipo         |
| est_compra                       | id              |
| est_compra_item                  | id              |
| est_movimentacao                 | id              |
| fn_categoria                     | id              |
| fn_conta                         | id              |
| fn_movimento                     | id              |
| fn_movimento_recorrencia         | id              |
| me_cargo                         | id              |
| me_categoria                     | id_categoria    |
| me_cliente                       | id              |
| me_empresa                       | id              |
| me_empresa_endereco              | id              |
| me_forma_pagamento               | id              |
| me_fornecedor                    | id              |
| me_horario_funcionamento         | id              |
| me_itens_venda                   | id              |
| me_produto                       | id              |
| me_produto_imagem                | id              |
| me_produto_variacao              | id              |
| me_servico                       | id              |
| me_subcategoria                  | id_subcategoria |
| me_unidade_medida                | id              |
| me_usuario                       | id              |
| me_venda                         | id              |
| me_venda_servicos                | id              |
| me_venda_servicos_itens          | id              |
| mel_chat                         | id              |
| mel_chat_buffer                  | id              |
| mel_chat_custos                  | id              |
| mel_consultoria                  | id              |
| mel_consultoria_config           | id              |
| mel_projetos                     | id              |
| unq_empresa_modulos              | id              |
| unq_modulos_sistema              | id              |

--  '=== FOREIGN KEYS ==='

| from_table                       | from_column       | to_table                         | to_column       |
| -------------------------------- | ----------------- | -------------------------------- | --------------- |
| agd_agendamentos                 | colaborador_id    | me_usuario                       | id              |
| agd_agendamentos                 | cliente_id        | me_cliente                       | id              |
| agd_ft_horarios_modelo           | empresa_id        | me_empresa                       | id              |
| agd_status_agendamento           | empresa_id        | me_empresa                       | id              |
| crm_atendimentos                 | cliente_id        | me_cliente                       | id              |
| crm_atividades                   | oportunidade_id   | crm_oportunidades                | id              |
| crm_chat_conversas               | empresa_id        | me_empresa                       | id              |
| crm_chat_conversas               | lead_id           | crm_leads                        | id              |
| crm_chat_conversas               | cliente_id        | me_cliente                       | id              |
| crm_chat_mensagens               | conversa_id       | crm_chat_conversas               | id              |
| crm_etapas                       | empresa_id        | me_empresa                       | id              |
| crm_oportunidade_produtos        | produto_id        | me_produto                       | id              |
| crm_oportunidade_produtos        | oportunidade_id   | crm_oportunidades                | id              |
| crm_oportunidades                | lead_id           | crm_leads                        | id              |
| crm_oportunidades                | cliente_id        | me_cliente                       | id              |
| cx_categorias_movimentacao_caixa | id_tipo           | cx_tipo_movimentacao_caixa       | id_tipo         |
| cx_categorias_movimentacao_caixa | empresa_id        | me_empresa                       | id              |
| cx_classe_movimentacao_caixa     | empresa_id        | me_empresa                       | id              |
| cx_contas                        | empresa_id        | me_empresa                       | id              |
| cx_movimentacao_caixa            | conta_id          | cx_contas                        | id              |
| cx_movimentacao_caixa            | empresa_id        | me_empresa                       | id              |
| cx_movimentacao_caixa            | categoria_id      | cx_categorias_movimentacao_caixa | id_categoria    |
| cx_tipo_movimentacao_caixa       | empresa_id        | me_empresa                       | id              |
| cx_tipo_movimentacao_caixa       | id_classe         | cx_classe_movimentacao_caixa     | id_classe       |
| est_compra                       | empresa_id        | me_empresa                       | id              |
| est_compra                       | fornecedor_id     | me_fornecedor                    | id              |
| est_compra_item                  | produto_id        | me_produto                       | id              |
| est_compra_item                  | compra_id         | est_compra                       | id              |
| est_movimentacao                 | empresa_id        | me_empresa                       | id              |
| est_movimentacao                 | produto_id        | me_produto                       | id              |
| fn_categoria                     | empresa_id        | me_empresa                       | id              |
| fn_conta                         | empresa_id        | me_empresa                       | id              |
| fn_movimento                     | recorrencia_id    | fn_movimento_recorrencia         | id              |
| fn_movimento                     | empresa_id        | me_empresa                       | id              |
| fn_movimento                     | categoria_id      | fn_categoria                     | id              |
| fn_movimento                     | cliente_id        | me_cliente                       | id              |
| fn_movimento                     | conta_id          | fn_conta                         | id              |
| fn_movimento_recorrencia         | categoria_id      | fn_categoria                     | id              |
| fn_movimento_recorrencia         | conta_id          | fn_conta                         | id              |
| fn_movimento_recorrencia         | empresa_id        | me_empresa                       | id              |
| me_cargo                         | empresa_id        | me_empresa                       | id              |
| me_empresa_endereco              | empresa_id        | me_empresa                       | id              |
| me_forma_pagamento               | empresa_id        | me_empresa                       | id              |
| me_horario_funcionamento         | empresa_id        | me_empresa                       | id              |
| me_itens_venda                   | produto_id        | me_produto                       | id              |
| me_itens_venda                   | empresa_id        | me_empresa                       | id              |
| me_itens_venda                   | venda_id          | me_venda                         | id              |
| me_produto                       | empresa_id        | me_empresa                       | id              |
| me_produto                       | subcategoria_id   | me_subcategoria                  | id_subcategoria |
| me_produto                       | unidade_medida_id | me_unidade_medida                | id              |
| me_produto                       | categoria_id      | me_categoria                     | id_categoria    |
| me_produto_imagem                | produto_id        | me_produto                       | id              |
| me_produto_variacao              | produto_pai_id    | me_produto                       | id              |
| me_servico                       | unidade_medida_id | me_unidade_medida                | id              |
| me_servico                       | categoria_id      | me_categoria                     | id_categoria    |
| me_servico                       | empresa_id        | me_empresa                       | id              |
| me_servico                       | subcategoria_id   | me_subcategoria                  | id_subcategoria |
| me_subcategoria                  | id_categoria      | me_categoria                     | id_categoria    |
| me_unidade_medida                | empresa_id        | me_empresa                       | id              |
| me_usuario                       | cargo             | me_cargo                         | id              |
| me_usuario                       | empresa_id        | me_empresa                       | id              |
| me_venda                         | conta_id          | cx_contas                        | id              |
| me_venda                         | empresa_id        | me_empresa                       | id              |
| me_venda                         | forma_pagamento   | me_forma_pagamento               | id              |
| me_venda                         | usuario_id        | me_usuario                       | id              |
| me_venda_servicos                | forma_pagamento   | me_forma_pagamento               | id              |
| me_venda_servicos                | cliente_id        | me_cliente                       | id              |
| me_venda_servicos                | empresa_id        | me_empresa                       | id              |
| me_venda_servicos_itens          | servico_id        | me_servico                       | id              |
| me_venda_servicos_itens          | venda_id          | me_venda_servicos                | id              |
| me_venda_servicos_itens          | empresa_id        | me_empresa                       | id              |
| mel_consultoria_config           | projeto_id        | mel_projetos                     | id              |
| mel_consultoria_config           | empresa_id        | me_empresa                       | id              |
| mel_projetos                     | empresa_id        | me_empresa                       | id              |
| unq_empresa_modulos              | modulo_id         | unq_modulos_sistema              | id              |
| unq_empresa_modulos              | empresa_id        | me_empresa                       | id              |


--  '=== FUNÇÕES RPC ==='

| routine_name                           | return_type |
| -------------------------------------- | ----------- |
| atualiza_timestamp                     | trigger     |
| criar_empresa_e_configuracoes_iniciais | uuid        |
| criar_empresa_e_configuracoes_iniciais | json        |
| me_excluir_conta                       | void        |
| save_opportunity_full                  | jsonb       |


--  '=== POLÍTICAS RLS ==='

| tablename               | policyname                                                 | cmd    |
| ----------------------- | ---------------------------------------------------------- | ------ |
| crm_chat_conversas      | Enable all access for authenticated users                  | ALL    |
| crm_chat_mensagens      | Enable all access for authenticated users                  | ALL    |
| cx_contas               | Enable insert access for users based on empresa_id         | INSERT |
| cx_contas               | Enable read access for users based on empresa_id           | SELECT |
| cx_contas               | Enable update access for users based on empresa_id         | UPDATE |
| cx_movimentacao_caixa   | Enable delete access for users based on empresa_id         | DELETE |
| cx_movimentacao_caixa   | Enable insert access for users based on empresa_id         | INSERT |
| cx_movimentacao_caixa   | Enable read access for users based on empresa_id           | SELECT |
| cx_movimentacao_caixa   | Enable update access for users based on empresa_id         | UPDATE |
| est_compra              | Enable delete for authenticated users                      | DELETE |
| est_compra              | Enable insert for authenticated users                      | INSERT |
| est_compra              | Enable read access for all users                           | SELECT |
| est_compra              | Enable update for authenticated users                      | UPDATE |
| est_compra_item         | Enable delete for authenticated users                      | DELETE |
| est_compra_item         | Enable insert for authenticated users                      | INSERT |
| est_compra_item         | Enable read access for all users                           | SELECT |
| est_compra_item         | Enable update for authenticated users                      | UPDATE |
| est_movimentacao        | Enable delete for authenticated users                      | DELETE |
| est_movimentacao        | Enable insert for authenticated users                      | INSERT |
| est_movimentacao        | Enable read access for all users                           | SELECT |
| est_movimentacao        | Enable update for authenticated users                      | UPDATE |
| fn_categoria            | Users can view their own company categories                | SELECT |
| fn_conta                | Users can view their own company accounts                  | SELECT |
| fn_movimento            | Users can delete their own company transactions            | DELETE |
| fn_movimento            | Users can insert their own company transactions            | INSERT |
| fn_movimento            | Users can update their own company transactions            | UPDATE |
| fn_movimento            | Users can view their own company transactions              | SELECT |
| me_empresa_endereco     | Enable read/write for authenticated users based on company | ALL    |
| me_itens_venda          | Enable all access for authenticated users based on company | ALL    |
| me_produto_variacao     | Enable read for users based on company via parent          | SELECT |
| me_produto_variacao     | Enable write for users based on company via parent         | ALL    |
| me_venda                | Enable all access for authenticated users based on company | ALL    |
| me_venda_servicos       | Enable all access for authenticated users based on company | ALL    |
| me_venda_servicos_itens | Enable all access for authenticated users based on company | ALL    |
```

---

## 📊 Estrutura das Tabelas

### Todas as Colunas

```
[COLAR RESULTADO DA QUERY 2 AQUI]
```

---

## 🔑 Constraints (Chaves)

### Primary Keys

```
[COLAR RESULTADO DA QUERY 3 - PARTE 1 AQUI]
```

### Foreign Keys

```
[COLAR RESULTADO DA QUERY 3 - PARTE 2 AQUI]
```

---

## ⚙️ Funções RPC

```
[COLAR RESULTADO DA QUERY 4 AQUI]
```

---

## 🔐 Políticas RLS

```
[COLAR RESULTADO DA QUERY 5 AQUI]
```

---

## 📝 Notas Adicionais

- [Adicionar qualquer observação importante sobre o schema]
- [Tabelas personalizadas criadas manualmente]
- [Regras de negócio específicas]

---

**Última atualização**: [DATA]
