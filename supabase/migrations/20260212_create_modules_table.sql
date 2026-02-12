-- Create modules table
CREATE TABLE IF NOT EXISTS me_modulo_ativo (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    module_code TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, module_code)
);

-- Enable RLS
ALTER TABLE me_modulo_ativo ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own modules" ON me_modulo_ativo
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert/update their own modules" ON me_modulo_ativo
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own modules" ON me_modulo_ativo
    FOR UPDATE USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_me_modulo_ativo_user_module ON me_modulo_ativo(user_id, module_code);
