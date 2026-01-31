# Testes End-to-End (E2E)

Este projeto usa **Playwright** para testes automatizados que simulam usuários reais navegando no sistema.

## 🚀 Começando

### 1. Instalar Navegadores (primeira vez)

```bash
npm run test:install
```

Isso baixa o Chromium (~150MB). Precisa fazer **só uma vez**.

---

## 🧪 Executando Testes

### Opção 1: Modo UI (Recomendado para iniciantes)

```bash
npm run test:e2e:ui
```

**O que faz:** Abre uma interface visual onde você pode:
- Ver todos os testes listados
- Clicar para executar um teste
- Assistir o navegador rodando
- Ver screenshots e erros

### Opção 2: Rodar Todos os Testes

```bash
npm run test:e2e
```

Executa todos os testes no terminal.

### Opção 3: Rodar um Teste Específico

```bash
npm run test:e2e auth
npm run test:e2e produtos
npm run test:e2e crm
```

### Opção 4: Modo Debug (Passo a Passo)

```bash
npm run test:e2e:debug
```

O navegador abre **pausado**. Você clica para executar cada ação.

---

## 📁 Estrutura

```
tests/
├── e2e/
│   ├── auth.spec.ts       # Testes de login
│   ├── produtos.spec.ts   # Testes de produtos
│   └── crm.spec.ts        # Testes de CRM
├── helpers/
│   └── auth.ts            # Funções auxiliares de login
└── README.md              # Este arquivo
```

---

## ✍️ Criando Novos Testes

### Exemplo Básico

```typescript
import { test, expect } from '@playwright/test'

test('meu novo teste', async ({ page }) => {
  // 1. Ir para uma página
  await page.goto('http://localhost:5173/dashboard')
  
  // 2. Clicar em algo
  await page.click('text=Meu Botão')
  
  // 3. Preencher campo
  await page.fill('[name="campo"]', 'valor')
  
  // 4. Verificar resultado
  await expect(page.locator('text=Sucesso')).toBeVisible()
})
```

### Usando Login Helper

```typescript
import { login } from '../helpers/auth'

test('teste que precisa estar logado', async ({ page }) => {
  await login(page, 'teste@uniq.com', '123456')
  
  // Já está logado, pode continuar...
})
```

---

## 🔍 Seletores (Como Encontrar Elementos)

```typescript
// Por texto visível
page.click('text=Salvar')

// Por nome do input
page.fill('[name="email"]')

// Por ID
page.click('#meu-botao')

// Por classe CSS
page.click('.btn-primary')

// Combinado
page.click('button:has-text("Salvar")')
```

---

## 📊 Relatórios

Após rodar os testes, um relatório HTML é gerado:

```bash
npx playwright show-report
```

**Contém:**
- Screenshots de falhas
- Vídeos (se configurado)
- Tempo de execução
- Stack trace de erros

---

## ⚙️ Configuração

Edite `playwright.config.ts` para mudar:
- Timeout dos testes
- Navegadores a testar
- Captura de screenshots/vídeos
- URL base

---

## 🐛 Dicas de Debug

### 1. Ver o navegador funcionando

```bash
npm run test:e2e:headed
```

### 2. Pausar em um ponto específico

```typescript
await page.pause() // Para aqui
```

### 3. Ver conteúdo da página

```typescript
console.log(await page.content())
```

### 4. Esperar elemento aparecer

```typescript
await page.waitForSelector('text=Carregando', { state: 'hidden' })
```

---

## ❗ Problemas Comuns

### Elemento não encontrado

**Erro:** `Element 'text=Salvar' not found`

**Solução:** Verifique se o texto está correto (case-sensitive) ou use outro seletor.

### Timeout

**Erro:** `Timeout 30000ms exceeded`

**Solução:** 
- O elemento demora para aparecer? Use `waitForSelector`
- Aumenta timeout no `playwright.config.ts`

### Teste falhando aleatoriamente

**Solução:** Adicione `await page.waitForLoadState('networkidle')` antes de interagir.

---

## 📚 Documentação Completa

Para mais informações, veja o guia completo em:
`C:\Users\henri\.gemini\antigravity\brain\...\playwright_guide.md`

Ou visite: https://playwright.dev/docs/intro
