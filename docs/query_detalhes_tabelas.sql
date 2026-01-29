-- =====================================================
-- Query para obter ESTRUTURA COMPLETA das tabelas
-- críticas para cadastro
-- =====================================================

SELECT 
    table_name,
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default,
    udt_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('me_empresa', 'me_usuario', 'me_empresa_endereco')
ORDER BY 
    table_name, 
    ordinal_position;

-- =====================================================
-- INSTRUÇÕES:
-- 1. Execute esta query no SQL Editor do Supabase
-- 2. Copie TODO o resultado (com todos os campos)
-- 3. Cole aqui no chat OU salve em docs/tabelas_detalhadas.txt
-- =====================================================
