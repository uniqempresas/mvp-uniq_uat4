# Sprint 05 Research (Vibe Research)

## 🎯 Objetivos da Sprint
1.  **Testar**: Fluxo de Onboarding (Criação de Conta) e Seleção de Módulos.
2.  **Implementar**:
    *   Menu de Contexto no `ModuleStore` (3 segmentações).
    *   Configurações da Loja Virtual.

## 📂 Análise da Base de Código

### 1. Onboarding (Criação de Conta)
O fluxo atual está implementado em `src/pages/Onboarding/`.
*   **Arquivos Principais**:
    *   `Step1Personal.tsx`: Coleta Nome, Email, CPF, Senha. Usa validações locais.
    *   `Step2Company.tsx`: Coleta Dados da Empresa (CNPJ, Endereço via CEP, Segmento).
    *   `Step3Config.tsx`: Configurações iniciais (provavelmente senha ou confirmação).
*   **Padrões**:
    *   Formulários controlados via props (`formData`, `updateFormData`).
    *   Validações em `src/utils/validators.ts`.

### 2. Módulos & Seleção
O gerenciamento de módulos ocorre via `modulesService` e context API.
*   **Arquivos Principais**:
    *   `src/contexts/ModuleContext.tsx`: Gerencia estado global dos módulos ativos.
    *   `src/services/modulesService.ts`: Comunicação com Supabase (`unq_modulos_sistema`, `unq_empresa_modulos`).
    *   `src/pages/Dashboard/components/ModuleStore.tsx`: Interface da loja de módulos.
*   **Ponto de Atenção**:
    *   Atualmente o `ModuleStore.tsx` usa abas por **Categoria** (Financeiro, Vendas, etc.).
    *   **Mudança Necessária**: Alterar para abas de **Contexto**:
        1.  **Meus Módulos**: Filtrar `myModules` (já existente).
        2.  **Novos Módulos**: `allModules` excluindo `myModules`.
        3.  **Em Desenvolvimento**: Necessário filtrar por status ou flag específica no banco (verificar coluna `status` ou `flags`).

### 3. Configurações da Loja Virtual
As configurações estão em `src/pages/Dashboard/StoreConfig/`.
*   **Arquivos Principais**:
    *   `GeneralTab.tsx`: Configurações gerais (Slug, Nome, Bio, WhatsApp). Usa `react-hook-form` + `zod`.
    *   `ProductsTab.tsx` -> `StoreProductList.tsx`: Seleção de produtos visíveis.
*   **Ponto de Atenção**:
    *   Garantir que os dados salvos em `GeneralTab` refletem no `Storefront` público (`src/pages/Public/Storefront.tsx`).
    *   Verificar integridade do `slug` (único).

## 🛠️ Padrões de Implementação Identificados
*   **Forms**: `react-hook-form` com `zod` para validação (Ex: `GeneralTab.tsx`).
*   **Services**: Singleton pattern exportando objetos com métodos async (`modulesService`, `storeService`).
*   **UI Components**: Uso de TailwindCSS e `material-symbols-outlined`.
*   **State Management**: Context API para estados globais (`ModuleContext`), Local state para UI efêmera.

## ⚠️ Dependências & Riscos
*   **Banco de Dados**: Verificar se a tabela `unq_modulos_sistema` possui campo para identificar módulos "Em Desenvolvimento". Caso contrário, será necessário adicionar ou usar uma convenção (ex: tag no JSON de configurações).
*   **Onboarding**: O teste deve garantir que o usuário criado já vem com o `empresa_id` vinculado corretamente para permitir a ativação de módulos.
