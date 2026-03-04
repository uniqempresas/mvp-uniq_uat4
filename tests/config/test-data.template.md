# Configuração de Dados para Testes E2E - UNIQ

> **INSTRUÇÕES:** Preencha os dados abaixo e salve este arquivo como `test-data.md` (sem ".template")
> 
> Os testes E2E usarão estes dados para criar empresas e executar cenários.

---

## 🏢 Dados da Empresa de Teste

Escolha UM tipo de empresa abaixo e preencha os dados:

### Tipo de Empresa

| Opção | Descrição | Produtos que serão criados |
|-------|-----------|---------------------------|
| **optica** | Ótica e Loja de Óculos | Armação, Lente, Óculos de Sol, Estojo, Limpa Lentes |
| **confeccao** | Confecção de Roupas | Camiseta Básica, Calça Jeans, Blusa Social, Shorts, Vestido |
| **hamburgueria** | Hamburgueria Artesanal | Hamburguer Clássico, Cheeseburger, Batata Frita, Refrigerante, Milkshake |
| **loja_roupas** | Loja de Roupas | Camiseta, Calça, Jaqueta, Tênis, Boné, Meia |

> **Selecione o tipo:** `optica`, `confeccao`, `hamburgueria`, ou `loja_roupas`

| Campo | Valor a Preencher | Exemplo |
|-------|------------------|---------|
| **TIPO_EMPRESA** | `` | `optica` |
| **NOME_EMPRESA** | `` | `Ótica Visão Clara` |
| **EMAIL_ADMIN** | `` | `otica@uniq.com` |
| **SENHA** | `Senha123` | `Senha123` |

---

## 👤 Dados do Proprietário

| Campo | Valor a Preencher | Exemplo |
|-------|------------------|---------|
| **NOME_COMPLETO** | `` | `Maria Oliveira` |
| **CPF** | `` | `987.654.321-00` |

---

## 📍 Endereço da Empresa

| Campo | Valor a Preencher | Exemplo |
|-------|------------------|---------|
| **CEP** | `` | `01310-100` |
| **NUMERO** | `` | `456` |
| **COMPLEMENTO** | `` | `Loja 12` |

---

## ✅ Módulos a Ativar

Marque com [x] os módulos que deseja ativar na empresa:

- [x] **Vendas (PDV)** - Ponto de venda e gestão de vendas
- [x] **Estoque** - Controle de inventário
- [x] **Financeiro** - Gestão financeira e DRE
- [x] **CRM** - Gestão de clientes e leads
- [ ] **Fiscal** - Notas fiscais e obrigações
- [ ] **Projetos** - Gestão de projetos

---

## 📝 Exemplo Completo Preenchido

```markdown
TIPO_EMPRESA: optica
NOME_EMPRESA: Ótica Visão Clara
EMAIL_ADMIN: otica@uniq.com
SENHA: Senha123
NOME_COMPLETO: Maria Oliveira
CPF: 987.654.321-00
CEP: 01310-100
NUMERO: 456
COMPLEMENTO: Loja 12

Módulos:
- [x] Vendas (PDV)
- [x] Estoque
- [x] Financeiro
- [x] CRM
- [ ] Fiscal
- [ ] Projetos
```

---

## ⚠️ Importante

1. **NÃO use dados reais** - Use dados fictícios para testes
2. **CPF deve ser válido** - Use um gerador online se necessário
3. **CEP deve existir** - Use um CEP real do endereço fictício
4. **Senha padrão:** Use `Senha123` (simples e atende requisitos: 8+ chars, maiúscula, minúscula, número)
5. **Salve como:** `test-data.md` (na mesma pasta deste arquivo)

---

## 🔄 Múltiplas Empresas

Quer testar com mais de uma empresa? Crie arquivos adicionais:
- `test-data-empresa1.md`
- `test-data-empresa2.md`
- `test-data-optica.md`
- etc.

Execute o teste especificando qual usar:
```bash
npm run test:e2e -- --grep "empresa1"
```

---

**Última atualização:** Template gerado para testes E2E UNIQ
