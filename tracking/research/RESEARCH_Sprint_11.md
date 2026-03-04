# 📋 PRD - Sprint 11: Configuração n8n + Beta Testers

**Data:** 03/03/2026  
**Sprint:** 11  
**Status:** EM PESQUISA (Passo 1/3 SDD)  
**Arquivo:** `tracking/research/RESEARCH_Sprint_11.md`

---

## 🎯 Visão Geral

Esta sprint tem como objetivo **ativar o fluxo completo de WhatsApp** para as empresas beta (Gráfica e Confecção), permitindo que elas recebam e respondam mensagens de clientes através do CRM UNIQ.

**Resultado Esperado:** Duas empresas beta operando com atendimento via WhatsApp integrado ao CRM.

---

## 🏢 Contexto do Projeto

### Fase Atual
- **FASE 1: Validação MVP** (Mês 0-3)
- **Meta:** 4 clientes | MRR R$ 1.200
- **Atual:** 2 clientes (setup vendido)
- **Sprint anterior (10):** Unificação CRM + Atendente concluída ✅

### Empresas Beta
| Empresa | Tipo | Dores Principais | Prioridade |
|---------|------|------------------|------------|
| **Gráfica** | Serviços | Fluxo de pedidos confuso | 🔴 ALTA |
| **Confecção** | Produtos | Ninguém conhece a marca | 🔴 ALTA |

---

## 🔍 Análise do Problema

### O Que Já Existe (Sprint 10)
✅ Backend completo para receber mensagens  
✅ Frontend de chat unificado no CRM  
✅ Edge Functions para processar mensagens  
✅ Tabelas: `crm_chat_config`, `crm_mensagens`, `crm_canais`  
✅ Interface de configuração do agente  
✅ Respostas rápidas com atalhos  

### O Que Falta (Sprint 11)
❌ Workflows n8n configurados  
❌ Instâncias Evolution API ativas  
❌ Empresas beta cadastradas no sistema  
❌ Testes de integração completos  

---

## 📐 Requisitos Funcionais

### RF1: Workflow de Recebimento (Evolution → Supabase)
**Descrição:** Receber mensagens do WhatsApp e armazenar no Supabase

**Fluxo:**
1. Evolution API envia webhook quando mensagem chega
2. n8n recebe webhook e transforma dados
3. n8n chama Edge Function do Supabase
4. Mensagem é salva na tabela `crm_mensagens`
5. Aparece no painel do CRM automaticamente

**Dados necessários:**
- instance_id (identifica qual empresa)
- phone (número do remetente)
- message (texto da mensagem)
- timestamp (data/hora)
- type (text, image, etc.)

### RF2: Workflow de Envio (Supabase → Evolution)
**Descrição:** Enviar mensagens do CRM para o WhatsApp do cliente

**Fluxo:**
1. Usuário envia mensagem no painel CRM
2. Supabase dispara webhook para n8n
3. n8n chama Evolution API
4. Mensagem é entregue no WhatsApp do cliente

**Dados necessários:**
- instance_id
- phone (destinatário)
- message (texto)

### RF3: Cadastro de Empresas Beta
**Descrição:** Inserir dados das empresas no banco de dados

**Para cada empresa:**
- Criar registro em `me_empresa`
- Criar usuário administrador em `me_usuario`
- Ativar módulos em `unq_empresa_modulos` (CRM, Finance, PDV, Store)
- Configurar `crm_chat_config` (URA, respostas automáticas)
- Cadastrar produtos/serviços iniciais
- Criar categorias financeiras básicas
- Definir instance_id da Evolution

### RF4: Configuração Evolution API
**Descrição:** Criar e configurar instâncias WhatsApp

**Para cada empresa:**
- Criar instância na Evolution API
- Obter instance_id
- Conectar número de WhatsApp
- Testar envio/recebimento

---

## ⚙️ Especificações Técnicas

### Stack de Integração
```
WhatsApp Cliente → Evolution API → n8n → Supabase Edge Function → CRM UNIQ
                    ↑_________________________________________________↓
                                        (resposta)
```

### URLs e Endpoints
- **Evolution API:** `https://api.evolution.com` (exemplo)
- **n8n:** `https://n8n.seu-dominio.com`
- **Supabase Edge Function:** `https://<project>.supabase.co/functions/v1/webhook-whatsapp`

### Variáveis de Ambiente (n8n)
```
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_URL=...
EVOLUTION_API_KEY=...
```

---

## 🎯 Critérios de Aceitação

### CA1: Workflow de Recebimento
- [ ] Mensagem enviada para número da Gráfica aparece no CRM em < 5 segundos
- [ ] Mensagem enviada para número da Confecção aparece no CRM em < 5 segundos
- [ ] Mensagens exibem número do remetente corretamente
- [ ] Mensagens de imagem são recebidas e exibidas

### CA2: Workflow de Envio
- [ ] Resposta enviada pelo CRM chega no WhatsApp do cliente
- [ ] Mensagem exibe remetente correto (nome da empresa)
- [ ] Tempo de entrega < 3 segundos

### CA3: Cadastro de Empresas
- [ ] Gráfica consegue fazer login no sistema
- [ ] Confecção consegue fazer login no sistema
- [ ] Ambas têm módulos necessários ativados
- [ ] Ambas têm produtos/serviços cadastrados

### CA4: Testes de Integração
- [ ] Fluxo completo testado com Gráfica
- [ ] Fluxo completo testado com Confecção
- [ ] URA automática funcionando
- [ ] Respostas rápidas funcionando

---

## 📊 Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Evolution API instável | Média | Alto | Ter plano B (testar outro provider) |
| n8n fora do ar | Baixa | Alto | Monitoramento + alertas |
| Empresa não conseguir conectar WhatsApp | Alta | Médio | Documentação passo a passo + suporte |
| Delay na entrega de mensagens | Média | Médio | Monitorar logs e otimizar |

---

## 📅 Cronograma Sugerido

| Dia | Atividade |
|-----|-----------|
| 1 | Configurar n8n (workflows recebimento) |
| 2 | Configurar n8n (workflows envio) |
| 3 | Criar instâncias Evolution (Gráfica) |
| 4 | Criar instâncias Evolution (Confecção) |
| 5 | Cadastrar dados Gráfica no sistema |
| 6 | Cadastrar dados Confecção no sistema |
| 7 | Testes integração Gráfica |
| 8 | Testes integração Confecção |
| 9 | Coletar feedback e ajustes |
| 10 | Documentação e handoff |

---

## 🎬 Próximo Passo

**Ação Requerida:** Salvar este arquivo e iniciar **Passo 2: Especificação Tática** para gerar o SPEC.md com:
- Lista exata de arquivos a modificar
- Estrutura dos workflows n8n
- Scripts SQL para cadastro das empresas
- Plano de testes detalhado

---

**Documento gerado por:** NEO - O Arquiteto UNIQ  
**Metodologia:** Vibe Coding (SDD) - Passo 1/3  
**Revisão:** Aguardando aprovação para próximo passo
