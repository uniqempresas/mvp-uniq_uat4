# SPEC - Sprint 03: Onboarding, Login & Navegação

**Baseado em**: `PRD-Sprint_03.md`
**Objetivo**: Implementar fluxos de recuperação de senha, corrigir persistência de módulos no onboarding e ajustar navegação.

## 1. Visão Geral
Esta sprint foca em fechar o ciclo de entrada do usuário (Onboarding -> Login -> Dashboard), garantindo que usuários reais consigam criar contas, configurar seus módulos e recuperar acesso se necessário.

## 2. Arquivos a Criar
| Arquivo | Descrição |
| :--- | :--- |
| `src/pages/Auth/ForgotPassword.tsx` | Tela para solicitar link de recuperação de senha. |
| `src/pages/Auth/UpdatePassword.tsx` | Tela para definir nova senha (acessada via link do email). |

## 3. Arquivos a Modificar
| Arquivo | Ação |
| :--- | :--- |
| `src/App.tsx` | Adicionar rotas para `/forgot-password` e `/update-password`. |
| `src/Login.tsx` | Adicionar link "Esqueci minha senha". |
| `src/pages/Onboarding/Onboarding.tsx` | Implementar lógica de ativação de módulos após criação da empresa. |

---

## 4. Detalhes de Implementação

### 4.1. Recuperação de Senha

#### A. Nova Página: `src/pages/Auth/ForgotPassword.tsx`
- **Layout**: Similar ao `Login.tsx` (centralizado, limpo).
- **Estado**: `email` (string), `loading` (boolean), `message` (string | null), `error` (string | null).
- **Lógica**:
  - Chamar `supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/update-password' })`.
  - Exibir mensagem de sucesso: "Verifique seu email para redefinir sua senha."
  - Botão para voltar ao Login.

#### B. Nova Página: `src/pages/Auth/UpdatePassword.tsx`
- **Layout**: Similar ao `Login.tsx`.
- **Estado**: `password` (string), `confirmPassword` (string), `loading` (boolean), `error` (string | null).
- **Lógica**:
  - Validar se senhas conferem.
  - Chamar `supabase.auth.updateUser({ password: newPassword })`.
  - Em sucesso: Exibir alerta e redirecionar para `/dashboard` (o update já loga o usuário ou mantém sessão).
  - Caso `updateUser` não logue automaticamente, redirecionar para `/`.

#### C. Modificação: `src/App.tsx`
- Adicionar rotas públicas dentro do `<Routes>`:
  ```tsx
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/update-password" element={<UpdatePassword />} />
  ```
- Importar os novos componentes.

#### D. Modificação: `src/Login.tsx`
- Adicionar link abaixo do campo de senha ou próximo ao botão de login:
  ```tsx
  <div className="flex justify-end mb-4">
      <button
          type="button"
          onClick={() => navigate('/forgot-password')}
          className="text-xs text-primary hover:underline font-medium"
      >
          Esqueci minha senha
      </button>
  </div>
  ```

### 4.2. Correção do Onboarding (Módulos)

#### Modificação: `src/pages/Onboarding/Onboarding.tsx`
- **Local**: Função `handleFinish`, após o sucesso do `supabase.rpc` (após linha 165).
- **Importação**: Importar `moduleService` de `../../services/moduleService`.
- **Lógica**:
  Iterar sobre os módulos selecionados em `formData.modules` e ativar os que estiverem `true`.
  
  ```typescript
  // ... após sucesso do RPC
  
  // 3. Ativar módulos selecionados
  const selectedModules = Object.entries(formData.modules)
      .filter(([_, isActive]) => isActive)
      .map(([code]) => code);

  if (selectedModules.length > 0) {
      try {
          // Executar em paralelo para performance
          await Promise.all(
              selectedModules.map(moduleCode => 
                  moduleService.toggleModule(moduleCode, true)
              )
          );
          console.log('Módulos ativados:', selectedModules);
      } catch (moduleError) {
          console.error('Erro ao ativar módulos:', moduleError);
          // Não bloquear o fluxo, pois a empresa foi criada. 
          // O usuário pode ativar depois em Configurações.
      }
  }

  // Navegar para dashboard
  // ...
  ```

## 5. Plano de Verificação

### Testes Manuais
1.  **Recuperação de Senha**:
    -   Acessar tela de login.
    -   Clicar em "Esqueci minha senha".
    -   Inserir email válido e enviar.
    -   Verificar recebimento do email (ou log do Supabase em variaveis locais).
    -   Clicar no link do email -> Deve abrir `/update-password`.
    -   Redefinir senha com sucesso.
    -   Logar com nova senha.

2.  **Onboarding**:
    -   Criar nova conta (fluxo completo).
    -   No Step 3, selecionar apenas "Vendas" e "Estoque".
    -   Finalizar cadastro.
    -   Ao entrar no Dashboard, verificar Sidebar.
    -   Ir em "Configurações" > "Meus Módulos".
    -   Verificar se apenas "Vendas" e "Estoque" estão marcados como ativos.
