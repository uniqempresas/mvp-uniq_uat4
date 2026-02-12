# Lista de Tarefas - Sprint 02: Encerramento Mobile & Módulos

## Fase 1: Unificação da Navegação (Core Fix)
- [ ] Criar `src/config/menu.ts` <!-- id: 0 -->
- [ ] Refatorar `src/components/Sidebar/MainSidebar.tsx` para usar `menu.ts` <!-- id: 1 -->
- [ ] Refatorar `src/components/Mobile/MobileDrawer.tsx` para usar `menu.ts` e filtrar por módulos <!-- id: 2 -->

## Fase 2: Banco de Dados & Serviços
- [ ] Criar migration `supabase/migrations/20260212_create_modules_table.sql` <!-- id: 3 -->
- [ ] Atualizar `src/services/moduleService.ts` <!-- id: 4 -->
- [ ] Atualizar `src/contexts/ModuleContext.tsx` (Integração com Service/DB) <!-- id: 5 -->

## Fase 3: Interface de Gestão de Módulos
- [ ] Criar componente `src/components/Cards/ModuleCard.tsx` <!-- id: 6 -->
- [ ] Criar página `src/pages/Modules/index.tsx` <!-- id: 7 -->
- [ ] Atualizar `src/routes.tsx` (Adicionar rota e proteção) <!-- id: 8 -->

## Fase 4: Garantia de Qualidade (QA)
- [ ] Validar consistência do menu entre Mobile e Web <!-- id: 9 -->
- [ ] Testar ativação/desativação de módulos (ex: CRM) <!-- id: 10 -->
- [ ] Verificar persistência da configuração de módulos <!-- id: 11 -->
