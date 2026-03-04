# Dados de Teste Padrão - UNIQ E2E

> **ARQUIVO DE TESTE** - Dados fictícios para execução automática de testes
> Este arquivo é usado quando `test-data.md` não está preenchido ou não existe.

---

## 🏢 Configuração da Empresa Padrão

| Campo | Valor | Observação |
|-------|-------|------------|
| **TIPO_EMPRESA** | `optica` | Ótica - cria produtos como armações e lentes |
| **NOME_EMPRESA** | `Ótica Teste E2E` | Nome identificável para testes |
| **EMAIL_ADMIN** | `optica@uniq.com` | Padrão: empresa@uniq.com |
| **SENHA** | `Senha123` | Senha padrão (8+ chars, maiúscula, minúscula, número) |
| **NOME_COMPLETO** | `Usuario Teste E2E` | Nome do proprietário |
| **CPF** | `529.982.247-25` | CPF válido |
| **CNPJ** | `48.155.586/0001-90` | CNPJ válido (gerado automaticamente) |
| **TELEFONE** | `(11) 98765-4321` | Telefone de teste |
| **CEP** | `01001-000` | Praça da Sé, São Paulo/SP |
| **NUMERO** | `100` | Número do endereço |
| **COMPLEMENTO** | `Sala 1001` | Complemento do endereço |

---

## 🏭 Tipos de Empresa Disponíveis

Cada tipo cria produtos específicos automaticamente:

### 1. Ótica (`optica`)
Produtos criados:
- Armação de Óculos de Grau
- Lente para Grau
- Óculos de Sol
- Estojo para Óculos
- Limpa Lentes

### 2. Confecção (`confeccao`)
Produtos criados:
- Camiseta Básica Algodão
- Calça Jeans Masculina
- Blusa Social Feminina
- Shorts Jeans
- Vestido Casual

### 3. Hamburgueria (`hamburgueria`)
Produtos criados:
- Hambúrguer Clássico
- Cheeseburger Duplo
- Batata Frita (Média)
- Refrigerante Lata
- Milkshake de Chocolate

### 4. Loja de Roupas (`loja_roupas`)
Produtos criados:
- Camiseta Estampada
- Calça Cargo
- Jaqueta Jeans
- Tênis Esportivo
- Boné Aba Curva
- Meia Kit c/3

---

## ✅ Módulos Ativados (Padrão)

- [x] **Vendas (PDV)** - Sempre ativo
- [x] **Estoque** - Sempre ativo
- [x] **Financeiro** - Sempre ativo
- [x] **CRM** - Sempre ativo
- [ ] **Fiscal** - Opcional
- [ ] **Projetos** - Opcional

---

## 🔄 Variáveis de Ambiente

Você pode sobrescrever valores via variáveis de ambiente:

```bash
# Windows
set TEST_EMPRESA_TIPO=hamburgueria
set TEST_EMAIL=meuemail@teste.com

# Linux/Mac
export TEST_EMPRESA_TIPO=hamburgueria
export TEST_EMAIL=meuemail@teste.com
```

Variáveis suportadas:
- `TEST_EMPRESA_TIPO` - Tipo da empresa
- `TEST_EMAIL` - Email do admin
- `TEST_SENHA` - Senha do admin
- `TEST_CPF` - CPF do proprietário

---

## 📝 Dados de Clientes de Teste

Clientes usados nos testes de PDV/CRM:

| Nome | Email | Telefone | Tipo |
|------|-------|----------|------|
| Cliente Padrão | cliente@email.com | (11) 99999-0001 | Pessoa Física |
| Empresa ABC Ltda | contato@empresaabc.com | (11) 3333-4444 | Pessoa Jurídica |
| Maria Silva | maria.silva@email.com | (11) 98888-7777 | Pessoa Física |

---

## 💳 Formas de Pagamento para Testes

- **PIX** - Transação instantânea
- **Dinheiro** - Pagamento em espécie
- **Cartão de Crédito** - Parcelado em até 12x
- **Cartão de Débito** - À vista no débito
- **Boleto** - Pagamento à prazo

---

## 🎯 Cenários de Teste Automáticos

Este arquivo habilita os seguintes testes:

1. **Onboarding Completo**
   - Criação de conta com dados acima
   - Validação de email
   - Configuração de módulos

2. **Autenticação**
   - Login com credenciais acima
   - Logout
   - Recuperação de senha

3. **Catálogo Setup**
   - Criação de 5 produtos do tipo escolhido
   - Upload de imagens placeholder
   - Configuração de variações (se aplicável)

4. **Fluxo de Venda (PDV)**
   - Abertura de caixa
   - Adição de 2-3 produtos ao carrinho
   - Seleção de cliente
   - Processamento de pagamento (PIX)
   - Fechamento de venda
   - Geração de comprovante

---

## 🧹 Limpeza de Dados

Após os testes, os seguintes dados são criados no banco:

- 1 Empresa (`me_empresa`)
- 1 Usuário (`auth.users` + `me_usuario`)
- 1 Endereço (`me_endereco`)
- 5 Produtos (`unq_produtos`)
- 1-3 Clientes (`unq_clientes`)
- N vendas (`unq_vendas`) - conforme execução

**Recomendação:** Execute em ambiente de desenvolvimento ou UAT.

---

**Versão:** 1.0
**Gerado em:** 2025-03-01
**Propósito:** Testes E2E automatizados UNIQ
