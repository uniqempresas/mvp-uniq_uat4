-- =====================================================
-- Query para ver o CÓDIGO da função RPC atual
-- =====================================================

SELECT 
    pg_get_functiondef(oid) as function_definition
FROM pg_proc 
WHERE proname = 'criar_empresa_e_configuracoes_iniciais'
  AND pronargs = 6;  -- A que recebe 6 parâmetros (uuid)

-- =====================================================
-- INSTRUÇÕES:
-- Execute e me envie TODO o resultado
-- Isso vai mostrar o código SQL da função
-- =====================================================
