-- Migration: Adicionar suporte para recorrência e parcelamento
-- Execute este SQL manualmente no Supabase SQL Editor

-- Adicionar campos em fn_movimento para suportar recorrência e parcelamento
ALTER TABLE fn_movimento 
ADD COLUMN IF NOT EXISTS eh_parcelado BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS parcela_numero INTEGER,
ADD COLUMN IF NOT EXISTS parcela_total INTEGER,
ADD COLUMN IF NOT EXISTS grupo_parcelamento UUID,
ADD COLUMN IF NOT EXISTS eh_recorrente BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS recorrencia_id UUID;

-- Criar tabela de controle de recorrência
CREATE TABLE IF NOT EXISTS fn_movimento_recorrencia (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES me_empresa(id) ON DELETE CASCADE,
    descricao TEXT NOT NULL,
    valor DECIMAL(15,2) NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
    categoria_id INTEGER REFERENCES fn_categoria(id),
    conta_id UUID REFERENCES fn_conta(id),
    dia_vencimento INTEGER NOT NULL CHECK (dia_vencimento >= 1 AND dia_vencimento <= 31),
    tipo_recorrencia TEXT NOT NULL CHECK (tipo_recorrencia IN ('mensal', 'fixa_12_meses')),
    meses_restantes INTEGER,
    ativo BOOLEAN DEFAULT TRUE,
    observacao TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Adicionar foreign key para recorrencia_id
ALTER TABLE fn_movimento
ADD CONSTRAINT fk_movimento_recorrencia 
FOREIGN KEY (recorrencia_id) 
REFERENCES fn_movimento_recorrencia(id) 
ON DELETE SET NULL;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_movimento_parcelamento ON fn_movimento(grupo_parcelamento) WHERE grupo_parcelamento IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_movimento_recorrencia ON fn_movimento(recorrencia_id) WHERE recorrencia_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_recorrencia_empresa ON fn_movimento_recorrencia(empresa_id);
CREATE INDEX IF NOT EXISTS idx_recorrencia_ativo ON fn_movimento_recorrencia(ativo) WHERE ativo = TRUE;

-- Comentários nas tabelas
COMMENT ON COLUMN fn_movimento.eh_parcelado IS 'Indica se este movimento faz parte de um parcelamento';
COMMENT ON COLUMN fn_movimento.parcela_numero IS 'Número da parcela atual (ex: 1 de 12)';
COMMENT ON COLUMN fn_movimento.parcela_total IS 'Total de parcelas';
COMMENT ON COLUMN fn_movimento.grupo_parcelamento IS 'UUID que agrupa todas as parcelas do mesmo parcelamento';
COMMENT ON COLUMN fn_movimento.eh_recorrente IS 'Indica se este movimento foi gerado por uma regra de recorrência';
COMMENT ON COLUMN fn_movimento.recorrencia_id IS 'ID da regra de recorrência que gerou este movimento';

COMMENT ON TABLE fn_movimento_recorrencia IS 'Regras de recorrência para geração automática de movimentos financeiros';
COMMENT ON COLUMN fn_movimento_recorrencia.tipo_recorrencia IS 'mensal = recorre indefinidamente, fixa_12_meses = gera 12 parcelas e para';
COMMENT ON COLUMN fn_movimento_recorrencia.meses_restantes IS 'Para despesas fixas, quantos meses faltam até renovação';
