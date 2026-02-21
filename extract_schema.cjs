const { Client } = require('pg');

const client = new Client({
  host: 'aws-0-sa-east-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.krrkfgvdwhpelxtrdtla',
  password: 'usuario01@HQ29lh19',
  ssl: {
    rejectUnauthorized: false
  }
});

async function getSchema() {
  try {
    await client.connect();
    
    // Get all tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    console.log('-- =============================================================================');
    console.log('-- UNIQ UAT_04 - Estrutura Completa do Banco de Dados');
    console.log('-- Gerado em: ' + new Date().toISOString().split('T')[0]);
    console.log('-- Projeto Supabase: krrkfgvdwhpelxtrdtla');
    console.log('-- =============================================================================\n');
    
    for (const table of tablesResult.rows) {
      const tableName = table.table_name;
      
      console.log(`\n-- Tabela: ${tableName}`);
      console.log(`CREATE TABLE ${tableName} (`);
      
      // Get columns
      const columnsResult = await client.query(`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default,
          character_maximum_length
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = $1
        ORDER BY ordinal_position
      `, [tableName]);
      
      const columns = [];
      for (let i = 0; i < columnsResult.rows.length; i++) {
        const col = columnsResult.rows[i];
        let colDef = `    ${col.column_name} ${col.data_type}`;
        
        if (col.character_maximum_length) {
          colDef += `(${col.character_maximum_length})`;
        }
        
        if (col.is_nullable === 'NO') {
          colDef += ' NOT NULL';
        }
        
        if (col.column_default) {
          colDef += ` DEFAULT ${col.column_default}`;
        }
        
        if (i < columnsResult.rows.length - 1) {
          colDef += ',';
        }
        
        columns.push(colDef);
      }
      
      console.log(columns.join('\n'));
      console.log(');');
      
      // Get constraints (PK, FK)
      const constraintsResult = await client.query(`
        SELECT
          tc.constraint_name,
          tc.constraint_type,
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        LEFT JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
        WHERE tc.table_name = $1
        AND tc.table_schema = 'public'
      `, [tableName]);
      
      for (const constraint of constraintsResult.rows) {
        if (constraint.constraint_type === 'PRIMARY KEY') {
          console.log(`\n-- Primary Key: ${constraint.constraint_name}`);
          console.log(`ALTER TABLE ${tableName} ADD PRIMARY KEY (${constraint.column_name});`);
        } else if (constraint.constraint_type === 'FOREIGN KEY' && constraint.foreign_table_name) {
          console.log(`\n-- Foreign Key: ${constraint.constraint_name}`);
          console.log(`ALTER TABLE ${tableName} ADD CONSTRAINT ${constraint.constraint_name} FOREIGN KEY (${constraint.column_name}) REFERENCES ${constraint.foreign_table_name}(${constraint.foreign_column_name});`);
        }
      }
      
      // Get indexes
      const indexesResult = await client.query(`
        SELECT
          indexname,
          indexdef
        FROM pg_indexes
        WHERE tablename = $1
        AND schemaname = 'public'
      `, [tableName]);
      
      for (const index of indexesResult.rows) {
        if (!index.indexname.includes('_pkey')) {
          console.log(`\n-- Index: ${index.indexname}`);
          console.log(`${index.indexdef};`);
        }
      }
    }
    
    console.log('\n\n-- =============================================================================');
    console.log('-- VIEWS');
    console.log('-- =============================================================================\n');
    
    const viewsResult = await client.query(`
      SELECT table_name, view_definition
      FROM information_schema.views
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    for (const view of viewsResult.rows) {
      console.log(`\n-- View: ${view.table_name}`);
      if (view.view_definition) {
        console.log(`CREATE OR REPLACE VIEW ${view.table_name} AS`);
        console.log(view.view_definition.trim() + ';');
      }
    }
    
    console.log('\n\n-- =============================================================================');
    console.log('-- FUNCTIONS');
    console.log('-- =============================================================================\n');
    
    const functionsResult = await client.query(`
      SELECT 
        routine_name,
        routine_type,
        routine_definition
      FROM information_schema.routines
      WHERE routine_schema = 'public'
      AND routine_type = 'FUNCTION'
      ORDER BY routine_name
    `);
    
    for (const func of functionsResult.rows) {
      console.log(`\n-- Function: ${func.routine_name}`);
      console.log(`-- Type: ${func.routine_type}`);
      if (func.routine_definition) {
        console.log(func.routine_definition.trim());
      }
      console.log();
    }
    
    console.log('\n-- =============================================================================');
    console.log('-- TRIGGERS');
    console.log('-- =============================================================================\n');
    
    const triggersResult = await client.query(`
      SELECT 
        trigger_name,
        event_manipulation,
        event_object_table,
        action_timing,
        action_statement
      FROM information_schema.triggers
      WHERE trigger_schema = 'public'
      ORDER BY event_object_table, trigger_name
    `);
    
    for (const trigger of triggersResult.rows) {
      console.log(`\n-- Trigger: ${trigger.trigger_name}`);
      console.log(`-- Table: ${trigger.event_object_table}`);
      console.log(`-- Event: ${trigger.event_manipulation}`);
      console.log(`-- Timing: ${trigger.action_timing}`);
      console.log(`-- Action: ${trigger.action_statement}`);
    }
    
    await client.end();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

getSchema();
