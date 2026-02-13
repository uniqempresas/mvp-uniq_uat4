# PRD - Sprint 03: Onboarding, Login & Navegação

**Data**: 13/02/2026
**Objetivo**: Preparar a plataforma para os primeiros parceiros, garantindo fluxos funcionais de criação de conta, login, recuperação de senha e navegação inicial.

## 1. Contexto Atual & Descobertas
A pesquisa na base de código revelou o seguinte estado atual:

### Autenticação
- **Arquivos existentes**:
    - `src/Login.tsx`: Tela de login funcional.
    - `src/services/authService.ts`: Serviços básicos de auth via Supabase.
- **Problemas identificados**:
    - **Falta de fluxo de "Esqueci minha senha"**: O arquivo `Login.tsx` não possui link para recuperação. Não existem páginas para solicitor ou redefinir senha.
    - **Rotas**: `src/App.tsx` não define rotas para `/forgot-password` ou `/update-password`.

### Onboarding
- **Arquivos existentes**:
    - `src/pages/Onboarding/Onboarding.tsx`: Orquestrador do wizard.
    - `src/pages/Onboarding/Step3Config.tsx`: Seleção de módulos.
- **Problemas identificados**:
    - **Seleção de Módulos Ignorada**: O componente `Onboarding.tsx` coleta a seleção de módulos do usuário no `Step3Config`, mas **NÃO** envia essa informação para o backend. A chamada RPC `criar_empresa_e_configuracoes_iniciais` (linhas 119-138) não recebe os módulos selecionados.
    - **RPC**: A função de banco de dados cria a empresa e configurações iniciais, mas a lógica de ativação de módulos personalizados parece estar ausente da integração frontend-backend.

### Navegação
- **Arquivos existentes**:
    - `src/components/Sidebar/MainSidebar.tsx`: Menu lateral principal.
    - `src/contexts/ModuleContext.tsx`: Gerencia estado global de módulos ativos.
- **Estado**: O `MainSidebar` filtra itens de menu baseado no `isModuleActive` do contexto. Como o Onboarding não está salvando os módulos, novos usuários podem entrar no sistema com uma sidebar vazia ou padrão (apenas Dashboard), criando uma experiência confusa.

## 2. Requisitos Funcionais (O que precisa ser feito)

### 2.1. Fluxo de Recuperação de Senha
- **Tela "Esqueci minha Senha" (`/forgot-password`)**:
    - Input de Email.
    - Botão "Enviar Link de Recuperação".
    - Feedback visual de sucesso.
- **Tela "Redefinir Senha" (`/update-password`)**:
    - Acessível via link enviado por email (Supabase Auth).
    - Input Nova Senha + Confirmação.
    - Botão "Salvar Nova Senha".
- **Integração no Login**:
    - Adicionar link "Esqueci minha senha" em `src/Login.tsx`.

### 2.2. Correção do Onboarding
- **Persistência de Módulos**:
    - Modificar `src/pages/Onboarding/Onboarding.tsx` para, após o sucesso da RPC de criação de empresa, iterar sobre os módulos selecionados (`formData.modules`) e inseri-los na tabela `me_modulo_ativo` (ou chamar uma nova RPC/Endpoint para isso).
    - Alternativamente, passar a lista de módulos para a RPC se ela suportar (verificar SQL, mas a chamada atual sugere que não suporta).

### 2.3. Navegação
- Garante que o usuário seja redirecionado para `/dashboard` após login/onboarding.
- Garantir que `MainSidebar` exiba corretamente "Configurações" e "Meus Módulos" fixos.

## 3. Estratégia Técnica (Spec Preview)
- **Tech Stack**: React, Tailwind, Supabase Auth, Supabase RPC.
- **Pattern**: Manter lógica de negócio nos Services (`authService`, `moduleService`).
- **Segurança**: Usar RLS do Supabase (já configurado) para garantir que usuário só insira módulos na sua própria empresa.

## 4. Referências de Código
- `src/Login.tsx`: Linha 146 (Link de "Criar conta", adicionar "Esqueci senha" próximo).
- `src/pages/Onboarding/Onboarding.tsx`: Linha 119 (Chamada RPC onde falta a lógica de módulos).
- `src/contexts/ModuleContext.tsx`: Linha 64 (Lógica de `toggleModule` que pode ser reutilizada ou adaptada para o bulk insert no onboarding).
