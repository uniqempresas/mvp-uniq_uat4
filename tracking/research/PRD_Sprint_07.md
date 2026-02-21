# 📋 PRD - Sprint 07: Correções Mobile Financeiro + Sistema de Vendas Integrado

**Data:** 17/02/2026  
**Sprint:** 07  
**Período:** 17/02/2026 a 20/02/2026 (4 dias)  
**Status:** 📋 PLANEJAMENTO  
**Responsável:** AI Agent + Squad UNIQ  

---

## 🎯 Visão Geral

Esta Sprint tem como objetivo resolver dois problemas críticos para o lançamento dos beta testers (Gráfica e Confecção):

1. **Correção de Layout Mobile** no módulo Financeiro - identificado distorção na visualização mobile que impacta a usabilidade
2. **Implementação do Sistema de Vendas** - criar uma solução integrada que permita registrar vendas tanto no PDV interno quanto receber vendas de lojas externas via API

---

## 📸 Problema Identificado: Layout Mobile Financeiro

### Descrição Visual (baseado na imagem anexada)

O dashboard financeiro apresenta os seguintes problemas em telas mobile:

1. **Cards de KPIs não responsivos**: Os cards de "Receita Bruta", "Despesas Totais" e "Lucro Líquido" estão em grid de 3 colunas que não se adapta ao mobile
2. **Gráfico de Evolução Financeira**: Ocupa espaço excessivo e não scrolla horizontalmente
3. **Cards de Detalhamento**: "Detalhamento de Despesas" fica posicionado de forma inadequada
4. **Tabela Demonstrativo Detalhado**: Colunas não estão otimizadas para mobile (possível corte de conteúdo)

### Comportamento Atual
- Layout desktop com grid 3 colunas forçado no mobile
- Textos grandes (R$ 0,00) não quebram linha adequadamente
- Gráficos não têm scroll horizontal habilitado
- Cards empilhados sem espaçamento adequado

### Comportamento Esperado
- Cards de KPI em stack vertical no mobile (1 coluna)
- Fontes adaptativas (text-2xl no mobile, text-4xl no desktop)
- Gráficos com scroll horizontal quando necessário
- Cards com espaçamento consistente (gap-4)
- Tabela com scroll horizontal ou cards expansíveis

---

## 🏗️ Requisitos Funcionais

### RF1: Correções de Responsividade no Financeiro

**RF1.1 - Dashboard Financeiro (FinanceDashboard.tsx)**
```
DADO QUE o usuário acessa o dashboard financeiro em dispositivo mobile
QUANDO a tela tem largura < 768px
ENTÃO os cards de KPI devem empilhar verticalmente
E as fontes devem reduzir proporcionalmente
E os gráficos devem permitir scroll horizontal
```

**RF1.2 - Grid de Cards Responsivo**
```
DADO QUE existem 3 cards de KPI (Receita, Despesas, Lucro)
QUANDO em mobile
ENTÃO devem aparecer como lista vertical (1 coluna)
E em tablet (2 colunas)
E em desktop (3 colunas)
```

**RF1.3 - Tabela Demonstrativo Detalhado**
```
DADO QUE a tabela de demonstrativo tem muitas colunas
QUANDO em mobile
ENTÃO deve permitir scroll horizontal
OU converter para cards expansíveis
E manter as colunas essenciais visíveis (Descrição, Valor)
```

### RF2: Sistema de Vendas Integrado

**RF2.1 - Tela de Vendas/PDV**
```
DADO QUE o usuário quer registrar uma venda
QUANDO acessa a tela de vendas
ENTÃO deve visualizar:
  - Busca rápida de produtos/serviços
  - Lista de itens no carrinho
  - Seleção de cliente (opcional)
  - Cálculo automático de totais
  - Seleção de forma de pagamento
  - Botão de finalizar venda
```

**RF2.2 - Busca de Produtos/Serviços**
```
DADO QUE o usuário está na tela de vendas
QUANDO digita na barra de busca
ENTÃO deve aparecer sugestões de:
  - Produtos cadastrados (nome, preço, estoque)
  - Serviços cadastrados (nome, preço)
E ao selecionar, adicionar ao carrinho
```

**RF2.3 - Carrinho de Venda**
```
DADO QUE o usuário adicionou itens ao carrinho
QUANDO visualiza o carrinho
ENTÃO deve ver:
  - Nome do item
  - Quantidade (editável)
  - Preço unitário
  - Subtotal
  - Botão remover
E o total geral deve atualizar automaticamente
```

**RF2.4 - Seleção de Cliente**
```
DADO QUE o usuário está finalizando uma venda
QUANDO quer vincular um cliente
ENTÃO deve poder:
  - Buscar cliente existente no CRM
  - Cadastrar cliente rápido (nome + telefone)
  - Deixar sem cliente (venda avulsa)
```

**RF2.5 - Formas de Pagamento**
```
DADO QUE o usuário está finalizando a venda
QUANDO seleciona forma de pagamento
ENTÃO deve ter opções:
  - Dinheiro
  - Cartão de Crédito
  - Cartão de Débito
  - Pix
  - Boleto
  - Outros
E data de vencimento (para prazo)
```

### RF3: Função Supabase de Registro de Venda

**RF3.1 - Função RPC `registrar_venda`**
```
DADO QUE uma venda foi confirmada
QUANDO a função RPC é chamada
ENTÃO deve:
  1. Inserir registro em `me_venda` com:
     - ID da empresa
     - ID do cliente (opcional)
     - Valor total
     - Forma de pagamento
     - Data da venda
     - Status (pendente/pago)
     - Observações
     - Array de itens (JSONB)
  
  2. Inserir registro em `me_contas_receber` com:
     - ID da venda (referência)
     - ID da empresa
     - ID do cliente
     - Valor
     - Data de vencimento
     - Status (pendente)
     - Descrição automática: "Venda #[ID] - [Cliente]"
  
  3. Atualizar estoque dos produtos vendidos
  
  4. Retornar ID da venda criada
  
  5. Tudo dentro de uma transação (ROLLBACK em caso de erro)
```

**RF3.2 - Estrutura JSON de Itens da Venda**
```json
{
  "itens": [
    {
      "tipo": "produto|servico",
      "id_referencia": "uuid",
      "nome": "string",
      "quantidade": "number",
      "preco_unitario": "number",
      "subtotal": "number"
    }
  ]
}
```

**RF3.3 - API Externa (Futuro)**
```
DADO QUE existe uma loja externa do cliente
QUANDO ela faz POST para endpoint seguro
ENTÃO a função RPC pode ser chamada via:
  - Edge Function do Supabase
  - Com autenticação via API Key
  - Registrando a origem da venda
```

---

## 🗄️ Modelo de Dados

### Tabela: `me_venda` (já existe - verificar estrutura)

Campos esperados:
- `id` (uuid, PK)
- `id_empresa` (uuid, FK)
- `id_cliente` (uuid, FK, nullable)
- `valor_total` (numeric)
- `forma_pagamento` (varchar)
- `data_venda` (timestamp)
- `data_vencimento` (date, nullable)
- `status` (varchar: pendente, pago, cancelado)
- `itens` (jsonb) - array de produtos/serviços
- `observacoes` (text, nullable)
- `origem` (varchar: 'interna', 'api', 'loja_virtual')
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Tabela: `me_contas_receber` (já existe)

Campos a preencher:
- `id` (uuid, PK)
- `id_empresa` (uuid, FK)
- `id_cliente` (uuid, FK, nullable)
- `id_venda` (uuid, FK) - NOVO CAMPO
- `valor` (numeric)
- `data_vencimento` (date)
- `data_pagamento` (timestamp, nullable)
- `status` (varchar: pendente, pago, atrasado)
- `forma_pagamento` (varchar)
- `descricao` (varchar)
- `created_at` (timestamp)

### Nova Coluna Necessária

```sql
-- Adicionar coluna id_venda em me_contas_receber (se não existir)
ALTER TABLE me_contas_receber 
ADD COLUMN IF NOT EXISTS id_venda uuid REFERENCES me_venda(id);
```

---

## 🔧 Especificações Técnicas

### Correções Mobile Financeiro

**Arquivos a modificar:**

1. `src/pages/Finance/FinanceDashboard.tsx`
   - Usar grid responsivo: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
   - Adicionar `overflow-x-auto` nos gráficos
   - Ajustar fontes: `text-2xl md:text-3xl lg:text-4xl`

2. `src/components/Finance/KPICard.tsx` (criar se não existir)
   - Componente reutilizável para os 3 KPIs
   - Props: title, value, trend, color
   - Classes responsivas

3. `src/components/Finance/DemonstrativeTable.tsx`
   - Wrapper com `overflow-x-auto`
   - Versão mobile: mostrar apenas colunas essenciais
   - Versão desktop: todas as colunas

### Nova Tela de Vendas

**Arquivos a criar:**

1. `src/pages/Sales/SalesPage.tsx` - Página principal
2. `src/pages/Sales/components/ProductSearch.tsx` - Busca de produtos
3. `src/pages/Sales/components/SaleCart.tsx` - Carrinho de venda
4. `src/pages/Sales/components/CustomerSelector.tsx` - Seleção de cliente
5. `src/pages/Sales/components/PaymentSelector.tsx` - Formas de pagamento
6. `src/services/salesService.ts` - Serviço de vendas

**Rota:**
- Adicionar `/sales` no router
- Atualizar `submenus.ts` linha 29: `href: '/sales'`

### Função Supabase

**Arquivo:**
- `supabase/migrations/20250217_create_registrar_venda_function.sql`

**Tipo:** Função RPC segura

**Permissões:**
- Executar como SECURITY DEFINER
- Verificar se usuário tem permissão na empresa
- Validar dados obrigatórios

---

## 📱 Wireframes Mobile

### Tela de Vendas (Mobile)

```
┌─────────────────────────────┐
│  Venda Rápida          💰   │
├─────────────────────────────┤
│ 🔍 Buscar produto...        │
│                             │
│ Sugestões:                  │
│ ┌─────────────────────────┐ │
│ │ 🎨 Banner 60x40cm  R$35 │ │
│ │ 📦 Estoque: 50          │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 👕 Camiseta Polo    R$45│ │
│ │ 📦 Estoque: 23          │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ 📋 ITENS DO CARRINHO        │
├─────────────────────────────┤
│ Banner 60x40cm          🗑️  │
│ Qtd: [-] 2 [+]    R$ 70,00  │
├─────────────────────────────┤
│ Camiseta Polo           🗑️  │
│ Qtd: [-] 1 [+]    R$ 45,00  │
├─────────────────────────────┤
│ 👤 Cliente: (opcional)  ▼   │
│ 🔍 Buscar ou cadastrar...   │
├─────────────────────────────┤
│ 💳 Forma de Pagamento    ▼  │
│ ☑️ Pix                      │
├─────────────────────────────┤
│ 📅 Vencimento: 17/02/2026   │
├─────────────────────────────┤
│ 💰 TOTAL: R$ 115,00         │
│                             │
│ ┌─────────────────────────┐ │
│ │    FINALIZAR VENDA      │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

---

## ✅ Checklist de Implementação

### Dia 1 (17/02) - Correções Mobile
- [ ] Analisar componentes atuais do Financeiro
- [ ] Criar componente KPICard responsivo
- [ ] Ajustar grid do FinanceDashboard
- [ ] Corrigir scroll horizontal em gráficos
- [ ] Testar em diferentes tamanhos de tela

### Dia 2 (18/02) - Estrutura de Vendas
- [ ] Criar migration da função RPC `registrar_venda`
- [ ] Adicionar coluna `id_venda` em `me_contas_receber`
- [ ] Criar página SalesPage.tsx
- [ ] Criar componente ProductSearch.tsx
- [ ] Criar componente SaleCart.tsx

### Dia 3 (19/02) - Lógica de Venda
- [ ] Criar componente CustomerSelector.tsx
- [ ] Criar componente PaymentSelector.tsx
- [ ] Implementar serviço salesService.ts
- [ ] Integrar com função RPC
- [ ] Testar fluxo completo de venda

### Dia 4 (20/02) - Integração e Testes
- [ ] Atualizar rota em submenus.ts
- [ ] Adicionar rota no router
- [ ] Testar integração com Financeiro (contas a receber)
- [ ] Testar em mobile
- [ ] Documentar uso da função RPC para API externa

---

## 🧪 Critérios de Aceitação

### Correções Mobile
1. ✅ Dashboard financeiro visualiza corretamente em iPhone SE (375px)
2. ✅ Cards de KPI empilham verticalmente sem cortar conteúdo
3. ✅ Gráficos permitem scroll horizontal suave
4. ✅ Tabela de demonstrativo é legível em mobile

### Sistema de Vendas
1. ✅ Usuário consegue buscar e adicionar produtos ao carrinho
2. ✅ Carrinho atualiza quantidades e calcula total automaticamente
3. ✅ Venda é registrada em `me_venda` com todos os itens
4. ✅ Conta a receber é criada automaticamente vinculada à venda
5. ✅ Estoque é decrementado corretamente
6. ✅ Transação faz ROLLBACK em caso de erro
7. ✅ Tela funciona perfeitamente em mobile

---

## 📚 Documentação para API Externa (Futuro)

### Exemplo de Uso da Função RPC via Edge Function

```javascript
// POST /functions/v1/registrar-venda-externa
{
  "api_key": "chave_secreta_do_cliente",
  "id_empresa": "uuid-da-empresa",
  "cliente": {
    "nome": "João Silva",
    "telefone": "11999999999"
  },
  "itens": [
    {
      "tipo": "produto",
      "id_externo": "sku-123",
      "nome": "Produto da Loja Externa",
      "quantidade": 1,
      "preco_unitario": 99.90
    }
  ],
  "forma_pagamento": "pix",
  "origem": "loja_externa"
}
```

### Resposta
```json
{
  "success": true,
  "id_venda": "uuid-gerado",
  "id_conta_receber": "uuid-gerado",
  "valor_total": 99.90,
  "message": "Venda registrada com sucesso"
}
```

---

## 🎯 Métricas de Sucesso

- **Tempo médio para registrar uma venda:** < 2 minutos
- **Taxa de erro no registro:** < 1%
- **Compatibilidade mobile:** 100% das funcionalidades acessíveis
- **Testes passando:** > 90% coverage

---

## 📝 Notas Técnicas

### Sobre a Função RPC
- Usar `SECURITY DEFINER` para bypassar RLS durante a transação
- Validar todos os dados de entrada
- Retornar erro detalhado em caso de falha
- Logar tentativas de API externa para auditoria

### Sobre Mobile-First
- Usar Tailwind breakpoints: `sm:`, `md:`, `lg:`
- Testar em: iPhone SE, iPhone 12 Pro, Galaxy S8+, iPad
- Priorizar touch targets de pelo menos 44px
- Usar `overscroll-behavior: contain` em scroll areas

### Integração com Módulos Existentes
- Reutilizar componentes do Catalog (ProductCard adaptado)
- Reutilizar serviço de Clientes do CRM
- Reutilizar componentes de pagamento do Financeiro
- Manter consistência visual com o Design System

---

## 🔗 Referências

- [Contexto do Projeto](tracking/CONTEXTO_PROJETO.md)
- [Backlog Geral](tracking/TRACKING_Backlog.md)
- [Tracking Sprint Atual](tracking/TRACKING.md)
- [Sprint 06 Anterior](tracking/tracking_arq/TRACKING_Sprint_06.md)

---

**Versão:** 1.0  
**Autor:** AI Agent @neo + @vibe-planner  
**Data de Criação:** 17/02/2026  
**Próxima Revisão:** Após implementação
