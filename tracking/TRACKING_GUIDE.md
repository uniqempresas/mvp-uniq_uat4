# 📖 Guia de Uso - Sistema de Tracking UNIQ

**Versão:** 2.1 (Vibe Coding Integrated)
**Data:** 13/02/2026

---

## 🎯 Visão Geral

O Sistema de Tracking da UNIQ Empresas foi unificado para trabalhar em harmonia com a metodologia **Vibe Coding**. Ele serve como o "cérebro administrativo" do projeto, enquanto os Agentes Vibe cuidam da execução técnica.

### Estrutura de Arquivos

```
tracking/
├── TRACKING.md          → Dashboard da Sprint Atual (Operacional)
├── TRACKING_Backlog.md  → Backlog Geral (Estratégico)
├── CONTEXTO_PROJETO.md  → Documentação de Contexto (Negócio/Técnico)
├── TRACKING_GUIDE.md    → Este guia
└── tracking_arq/        → Histórico de Sprints passadas
```

---

## 📋 TRACKING.md - O Coração da Sprint

Este é o arquivo mais importante. Ele reflete o **estado atual** do desenvolvimento.

### Ciclo de Vida da Sprint

1.  **Planejamento**:
    - Selecione tarefas do `TRACKING_Backlog.md`.
    - Mova para `TRACKING.md`.
    - Defina o Objetivo da Sprint.

2.  **Execução (Vibe Coding)**:
    - Ao usar o agente `/implement`, ele deve consultar este arquivo para saber o status macro.
    - Ao finalizar uma tarefa via agente, atualize o status aqui.

3.  **Fechamento**:
    - Mova o conteúdo concluído para `tracking/tracking_arq/TRACKING_Sprint_XX.md`.
    - Limpe o `TRACKING.md` para a próxima sprint.

### Status das Tarefas
- **🔴 EM PROGRESSO**: O que está sendo codado *agora*.
- **📋 A FAZER**: Próximas tarefas da sprint.
- **✅ CONCLUÍDO**: Finalizado e testado.
- **🚫 BLOQUEADO**: Impedimentos.

---

## 🗄️ tracking/tracking_arq/ - Arquivo Morto

Para manter o `TRACKING.md` limpo e leve para os Agentes de AI lerem, **nunca** mantenha histórico antigo nele.

- Ao fim de cada Sprint, crie um arquivo `TRACKING_Sprint_XX.md` nesta pasta.
- Mova todo o conteúdo da Sprint finalizada para lá.
- Mantenha o `TRACKING.md` apenas com o que é relevante *hoje*.

---

## 🔄 Fluxo de Trabalho Integrado

1.  **Analise (`/research`)**: O agente lê `CONTEXTO_PROJETO.md` e o código.
2.  **Planeje (`/spec`)**: O agente cria um plano.
3.  **Atualize**: Adicione a tarefa no `TRACKING.md` como "EM PROGRESSO".
4.  **Implemente (`/implement`)**: O agente executa o código.
5.  **Finalize**: Marque como "✅ CONCLUÍDO" no `TRACKING.md`.

---

## 📝 Dicas Importantes

- **Mantenha Simples**: Agentes de AI performam melhor com arquivos claros e diretos.
- **Contexto é Rei**: Mantenha `CONTEXTO_PROJETO.md` atualizado com as principais decisões arquiteturais, pois ele serve de "memória de longo prazo" para os agentes.
- **Sem Changelog Manual**: O histórico das Sprints em `tracking_arq` serve como log de alterações.
