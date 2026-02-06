-- =====================================================
-- Script para Documentar Schema do Supabase
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- Copie todos os resultados e salve no arquivo abaixo
-- =====================================================

-- =====================================================
-- 1. TABELAS
-- =====================================================
\echo '=== TABELAS ==='
SELECT 
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- =====================================================
-- 2. COLUNAS
-- =====================================================
\echo ''
\echo '=== ESTRUTURA DAS TABELAS ==='
SELECT 
    table_name,
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- =====================================================
-- 3. CONSTRAINTS (Chaves)
-- =====================================================
\echo ''
\echo '=== PRIMARY KEYS ==='
SELECT
    kcu.table_name,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'PRIMARY KEY'
    AND tc.table_schema = 'public'
ORDER BY kcu.table_name;

\echo ''
\echo '=== FOREIGN KEYS ==='
SELECT
    kcu.table_name as "from_table",
    kcu.column_name as "from_column",
    ccu.table_name as "to_table",
    ccu.column_name as "to_column"
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu
    ON tc.constraint_name = ccu.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY kcu.table_name;

-- =====================================================
-- 4. FUNÇÕES/RPCs
-- =====================================================
\echo ''
\echo '=== FUNÇÕES RPC ==='
SELECT 
    routine_name,
    data_type as return_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- =====================================================
-- 5. POLÍTICAS RLS
-- =====================================================
\echo ''
\echo '=== POLÍTICAS RLS ==='
SELECT 
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =====================================================
-- INSTRUÇÕES:
-- 1. Copie TODO o resultado
-- 2. Salve em: docs/database_schema_export.txt
-- 3. Me envie o conteúdo
-- =====================================================
