# Metodologia Vibe Coding (SDD: Spec Driven Development)

Baseado na transcrição fornecida, a metodologia descrita é o **SDD (Spec Driven Development)**, focada em resolver problemas comuns de código gerado por IA (alucinação, reinvenção da roda, código legado, context window).

A metodologia consiste em **3 Passos Sequenciais**, onde cada passo ocorre em uma **nova sessão de chat** (Context Window limpa) para maximizar a qualidade do output.

---

## 🔁 O Processo (Workflow)

### 1. Pesquisa & Contexto (Gera `PRD.md`)
**Objetivo:** Coletar todo o contexto necessário (arquivos existentes, documentação externa, padrões de código) sem se preocupar com tokens inúteis.
- **Input:** "Quero fazer a feature X. Pesquise na base de código arquivos afetados, leia a doc da lib Y e busque patterns."
- **Ação da IA:** Varre a codebase, lê docs, procura exemplos.
- **Output esperado:** Um arquivo `PRD.md` (Product Requirements Document) contendo:
    - Lista de arquivos relevantes da base atual.
    - Trechos relevantes de documentação externa.
    - Code snippets/patterns a serem seguidos.
    - **NÃO** contém código final, apenas o "o quê" e o "material de apoio".

> 🧹 **Ação Humana:** Salvar `PRD.md` e dar `/clear` ou iniciar novo chat.

### 2. Especificação Tática (Gera `SPEC.md`)
**Objetivo:** Definir o plano de implementação detalhado (quais arquivos mudar e como), filtrando o lixo da pesquisa.
- **Input:** Enviar o `PRD.md` gerado no passo anterior. "Com base neste PRD, crie uma Spec técnica de implementação."
- **Ação da IA:** Analisa o PRD e planeja as mudanças cirurgicamente.
- **Output esperado:** Um arquivo `SPEC.md` contendo:
    - Lista exata de arquivos a criar.
    - Lista exata de arquivos a modificar.
    - Para cada arquivo: o que deve ser feito (em pseudocódigo ou descrição detalhada).
    - **Nenhuma** informação inútil ou alucinação (filtro do PRD).

> 🧹 **Ação Humana:** Salvar `SPEC.md` e dar `/clear` ou iniciar novo chat.

### 3. Implementação (Gera o Código)
**Objetivo:** Escrever o código final com foco total (Context Window 100% dedicada à execução).
- **Input:** Enviar o `SPEC.md`. "Implemente conforme esta Spec."
- **Ação da IA:** Executa o plano cego (blind execution) baseado na spec.
- **Resultado:** Código modular, que respeita padrões existentes e não reinventa a roda, pois as instruções já foram "limpas" nos passos anteriores.

---

## 🏆 Benefícios Citados
1.  **Redução de repetição:** A IA sabe o que já existe (via Pesquisa) e não recria botões/funções duplicados.
2.  **Menos "Overengineering":** A Spec define limites claros, impedindo a IA de inventar soluções complexas.
3.  **Assertividade:** A IA não precisa "adivinhar" documentação, pois ela foi lida e resumida no PRD.
4.  **Context Window Eficiente:** Cada etapa usa um contexto limpo, focando apenas no necessário para aquele momento (Pesquisa > Planejamento > Execução).
