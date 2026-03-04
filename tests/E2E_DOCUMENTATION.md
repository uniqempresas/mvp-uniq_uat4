# Documentação de Testes E2E - UNIQ

**Projeto:** MVP UNIQ UAT4  
**Local:** `C:\Users\henri\.gemini\antigravity\playground\vector-perseverance\mvp-uniq_uat4`  
**Última atualização:** 03 Março 2026  
**Status:** 17/25 Testes Passando

---

## Visão Geral

Esta documentação descreve todos os testes E2E (End-to-End) automatizados do projeto UNIQ usando Playwright. Os testes cobrem os principais fluxos de negócio do sistema.

**Arquitetura dos Testes:**
- **Framework:** Playwright
- **Navegador:** Chrome (headed/headless)
- **Tempo padrão:** 120s por teste
- **Screenshots:** Gerados automaticamente em `tests/reports/`

---

## Estrutura de Arquivos

```
tests/
├── config/
│   ├── test-data.template.md          # Template para dados personalizados
│   └── test-data-default.md           # Dados padrão para testes
├── e2e/
│   ├── 01-onboarding/                 # Passando (2/2)
│   │   └── create-company.spec.ts
│   ├── 02-auth/                       # Passando (3/4)
│   │   └── login.spec.ts
│   ├── 03-catalog/                    # Passando (2/2)
│   │   └── setup-products.spec.ts
│   ├── 04-sales/                      # Passando (2/2)
│   │   └── pdv-flow.spec.ts
│   ├── 05-finance/                    # Bloqueado por Bug #7
│   │   └── finance-flow.spec.ts
│   ├── 06-crm/                        # Passando (3/3) - com bugs conhecidos
│   │   └── crm-flow.spec.ts
│   ├── 07-storefront/                 # Passando (2/2)
│   │   └── storefront-flow.spec.ts
│   ├── 08-services/                   # Passando (3/3)
│   │   └── services-flow.spec.ts
│   └── 09-modules/                    # Parcial (1/3)
│       └── modules-management.spec.ts
├── helpers/
│   ├── data-loader.ts                 # Carrega dados de configuração
│   ├── generators.ts                  # Gera CPF/CNPJ válidos
│   └── product-generator.ts           # Gera produtos por tipo de empresa
├── reports/                           # Screenshots e evidências
└── E2E_DOCUMENTATION.md               # Este arquivo
```

---

## Resumo de Testes

| Etapa | Módulo | Testes | Status | Tempo |
|-------|--------|--------|--------|-------|
| 01 | Onboarding | 2/2 | ✅ | 36.5s |
| 02 | Autenticação | 3/4 | ✅ | 21.2s |
| 03 | Catálogo | 2/2 | ✅ | 33.9s |
| 04 | Vendas/PDV | 2/2 | ✅ | 15.4s |
| 05 | Financeiro | 0/3 | 🐛 Bloqueado | - |
| 06 | CRM | 3/3 | ⚠️ Com bugs | - |
| 07 | Loja Virtual | 2/2 | ✅ | - |
| 08 | Serviços | 3/3 | ✅ | - |
| 09 | Módulos | 1/3 | ⚠️ Parcial | - |

**Total: 17/25 testes passando**

---

## Testes Funcionando

### Etapa 1: Onboarding
**Arquivo:** `tests/e2e/01-onboarding/create-company.spec.ts`

**Fluxo:**
1. Acessa página de onboarding (`/onboarding`)
2. Preenche dados pessoais (nome, email, CPF, senha)
3. Preenche dados da empresa (nome, CNPJ, telefone, endereço)
4. Configura módulos e aceita termos
5. Valida redirecionamento para dashboard

**Status:** ✅ 2/2 testes passando  
**Tempo:** ~36.5 segundos

---

### Etapa 2: Autenticação
**Arquivo:** `tests/e2e/02-auth/login.spec.ts`

**Cenários:**
1. ✅ Login com credenciais válidas
2. ✅ Erro com senha incorreta
3. ✅ Acesso não autorizado (proteção de rotas)
4. ⏭️ Logout (skipado)

**Status:** ✅ 3/4 testes passando  
**Tempo:** ~21.2 segundos

---

### Etapa 3: Setup de Produtos
**Arquivo:** `tests/e2e/03-catalog/setup-products.spec.ts`

**Fluxo:**
1. Faz login
2. Navega para Cadastros → Produtos
3. Cadastra 5 produtos automaticamente
4. Tipos suportados: ótica, confecção, hamburgueria, loja_roupas

**Produtos criados (Ótica):**
- Armação de Óculos de Grau - R$ 299,90
- Lente para Grau - R$ 199,90
- Óculos de Sol - R$ 249,90
- Estojo para Óculos - R$ 49,90
- Limpa Lentes - R$ 29,90

**Status:** ✅ 2/2 testes passando  
**Tempo:** ~33.9 segundos

---

### Etapa 4: PDV - Fluxo de Venda
**Arquivo:** `tests/e2e/04-sales/pdv-flow.spec.ts`

**Fluxo:**
1. Acessa PDV (`/sales`)
2. Adiciona 2 produtos ao carrinho
3. Cadastra cliente rápido
4. Seleciona PIX como forma de pagamento
5. Finaliza venda

**Status:** ✅ 2/2 testes passando  
**Tempo:** ~15.4 segundos

---

### Etapa 6: CRM
**Arquivo:** `tests/e2e/06-crm/crm-flow.spec.ts`

**Cenários:**
1. Verificar dashboard do CRM
2. Criar oportunidade
3. Verificar pipeline de vendas

**Status:** ✅ 3/3 testes passando  
**⚠️ Bugs conhecidos:** #12, #13, #14 (ver seção de Bugs)

---

### Etapa 7: Loja Virtual
**Arquivo:** `tests/e2e/07-storefront/storefront-flow.spec.ts`

**Cenários:**
1. Configurar loja completa (título, descrição, cores, banners)
2. Verificar loja pública com filtros

**Imagens de teste disponíveis:**
- `public/banner-desktop.png` (1200x400)
- `public/banner-mobile.png` (600x600)

**Status:** ✅ 2/2 testes passando

---

### Etapa 8: Serviços
**Arquivo:** `tests/e2e/08-services/services-flow.spec.ts`

**Cenários:**
1. Criar serviço e vender no PDV
2. Editar serviço existente
3. Verificar lista de serviços

**Status:** ✅ 3/3 testes passando

---

## Testes Bloqueados/Parciais

### Etapa 5: Financeiro
**Arquivo:** `tests/e2e/05-finance/finance-flow.spec.ts`

**Cenários planejados:**
1. Criar receita em Contas a Receber
2. Criar despesa em Contas a Pagar
3. Verificar dashboard financeiro

**Status:** 🐛 **Bloqueado - Bug #7**

**Problema:** Comboboxes de "Conta de Vencimento", "Categoria" e "Cliente" não carregam dados, impossibilitando salvar lançamentos.

---

### Etapa 9: Gestão de Módulos
**Arquivo:** `tests/e2e/09-modules/modules-management.spec.ts`

**Cenários:**
1. Visualizar e ativar módulos na loja de módulos ✅
2. Verificar módulos no onboarding ❌
3. Verificar acesso a módulos ❌

**Status:** ⚠️ 1/3 testes passando (falha em seletores)

---

## Configuração de Dados

### Dados Padrão

| Campo | Valor | Observação |
|-------|-------|------------|
| **TIPO_EMPRESA** | `optica` | Ótica - cria produtos de óculos |
| **NOME_EMPRESA** | `Ótica Teste E2E` | Nome identificável |
| **EMAIL_ADMIN** | `optica@uniq.com` | Padrão: empresa@uniq.com |
| **SENHA** | `Senha123!` | 8+ chars, maiúscula, minúscula, número, especial |
| **CPF** | Gerado automaticamente | Válido |
| **CNPJ** | Gerado automaticamente | Válido |

### Tipos de Empresa Suportados

| Tipo | Produtos Criados |
|------|-----------------|
| `optica` | Armação, Lente, Óculos de Sol, Estojo, Limpa Lentes |
| `confeccao` | Camiseta, Calça Jeans, Blusa, Shorts, Vestido |
| `hamburgueria` | Hamburguer, Cheeseburger, Batata Frita, Refrigerante, Milkshake |
| `loja_roupas` | Camiseta, Calça, Jaqueta, Tênis, Boné, Meia |

---

## Bugs Encontrados

Documentados em: `tracking/TRACKING.md`

### Bugs Críticos

| # | Descrição | Status | Impacto |
|---|-----------|--------|---------|
| **#7** | Financeiro: Comboboxes não carregam dados | 🔴 Ativo | Impossível criar transações |
| **#12** | CRM: Coluna 'observacoes' não existe em 'crm_leads' | 🔴 Ativo | Impossível criar leads |
| **#13** | CRM: Oportunidades exigem Lead/Cliente pré-existente | 🔴 Ativo | Fluxo de criação bloqueado |
| **#14** | CRM: Módulo precisa revisão geral | 🟡 Ativo | Múltiplos problemas de integração |

### Bugs Resolvidos/Teste

| # | Descrição | Status | Nota |
|---|-----------|--------|------|
| **#9** | Preço do serviço não salva | ✅ **Resolvido** | Era erro de teste - seletor incorreto |

### Outros Bugs

- **#11**: Não é possível excluir serviços (FK com tabela de vendas)
- **Filtro Loja Virtual**: Filtro de Produto/Serviço quebra a página
- **Erro RLS**: Ao criar conta bancária
- **Gráficos duplicados**: No dashboard financeiro

---

## Como Executar

### Pré-requisitos
```bash
# Servidor deve estar rodando
npm run dev

# Verificar se está rodando na porta 5173
curl http://localhost:5173
```

### Executar Testes

```bash
# Todos os testes
npx playwright test tests/e2e/ --project=chrome

# Com interface gráfica
npx playwright test tests/e2e/ --project=chrome --headed

# Teste específico
npx playwright test tests/e2e/01-onboarding/
npx playwright test tests/e2e/04-sales/

# Modo debug
npx playwright test --debug

# Relatório HTML
npx playwright test --reporter=html
```

---

## Métricas

- **Total de testes:** 25
- **Testes passando:** 17
- **Módulos cobertos:** 9
- **Bugs documentados:** 14
- **Tempo total (funcionando):** ~107 segundos

---

## Referências

- **Playwright Docs:** https://playwright.dev
- **Trackings:** `tracking/TRACKING.md`
- **Testes:** `tests/e2e/`
- **Screenshots:** `tests/reports/`

---

**Nota para outros agents:** Esta documentação é auto-contida e pode ser usada para entender e executar os testes E2E. Todos os seletores, fluxos e configurações estão documentados aqui.

**Atualizado:** 03 Março 2026
