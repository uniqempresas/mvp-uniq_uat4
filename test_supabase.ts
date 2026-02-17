import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variáveis de ambiente não configuradas!');
    console.error('Certifique-se de que VITE_SUPABASE_URL e VITE_SUPABASE_KEY estão no arquivo .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
    console.log('🔄 Testando conexão com Supabase...\n');
    
    try {
        // Testar conexão buscando um registro
        const { data, error } = await supabase
            .from('me_empresa')
            .select('*')
            .limit(1);
        
        if (error) {
            console.error('❌ Erro ao consultar tabela:', error.message);
            return;
        }
        
        console.log('✅ Conexão com Supabase bem-sucedida!\n');
        
        if (data && data.length > 0) {
            console.log('📋 Campos da tabela me_empresa:\n');
            const fields = Object.keys(data[0]);
            fields.forEach((field, index) => {
                const value = data[0][field];
                const type = typeof value;
                console.log(`  ${index + 1}. ${field} (${type})`);
            });
            
            console.log('\n📊 Valores do registro encontrado:\n');
            console.log(JSON.stringify(data[0], null, 2));
        } else {
            console.log('⚠️ Tabela existe mas está vazia.');
            
            // Tentar verificar se a tabela existe
            const { error: schemaError } = await supabase
                .from('me_empresa')
                .select('id')
                .limit(0);
            
            if (schemaError) {
                console.error('❌ Erro ao verificar tabela:', schemaError.message);
            } else {
                console.log('✅ Tabela me_empresa existe no banco de dados.');
            }
        }
        
    } catch (err) {
        console.error('❌ Erro inesperado:', err);
    }
}

testSupabase();
