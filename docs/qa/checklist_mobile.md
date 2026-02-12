
# Checklist de QA Mobile - UNIQ Empresas

**Sprint:** 02  
**Data:** 12/02/2026  
**Status:** ⬜ A Fazer

## 📱 Matriz de Dispositivos

| Dispositivo | OS | Navegador | Status |
| :--- | :--- | :--- | :--- |
| iPhone (pessoal) | iOS 17+ | Safari | ⬜ |
| Android (pessoal) | Android 12+ | Chrome | ⬜ |
| Tablet/iPad | iPadOS/Android | Safari/Chrome | ⬜ |
| Desktop (Emulação) | Windows | Chrome DevTools | ⬜ |

## 🧪 Casos de Teste (Smoke Test)

### 1. Navegação & Layout
- [ ] **Menu Hamburger**: Abre e fecha suavemente? Ocupa a tela corretamente?
- [ ] **Sidebar**: Desaparece em mobile e aparece em desktop?
- [ ] **Scroll Horizontal**: NÃO deve haver scroll horizontal em nenhuma página.
- [ ] **Touch Targets**: Botões e links são clicáveis sem zoom (tamanho adequado)?

### 2. Módulos & Funcionalidades
- [ ] **Dashboard**: Cards empilham verticalmente em mobile? Gráficos legíveis?
- [ ] **Clientes**: Lista aparece como cards? Formulário de edição funciona?
- [ ] **Produtos**: Modal de detalhes abre em tela cheia? Upload de imagem funciona?
- [ ] **Financeiro**: Tabelas adaptadas ou com scroll horizontal controlado?

### 3. Performance & UX
- [ ] **Carregamento**: App carrega em < 3s em 4G?
- [ ] **Feedback Visual**: Botões têm estado "pressionado" (active/focus)?
- [ ] **Teclado Virtual**: Abre o teclado numérico para campos de valor/telefone?
- [ ] **Gestos**: Swipe para ações (se implementado) funciona sem travar o scroll da página?

## 🐞 Bugs Encontrados

| ID | Descrição | Prioridade | Status |
| :--- | :--- | :--- | :--- |
| | | | |

---

**Observações:**
- Testar preferencialmente em dispositivos físicos.
- Limpar cache antes de iniciar os testes.
