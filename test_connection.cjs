const { Client } = require('pg');

// Usar porta do connection pooler (6543)
const client = new Client({
  host: 'aws-0-sa-east-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.krrkfgvdwhpelxtrdtla',
  password: 'Usuario01@HQ29lh19',
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    await client.connect();
    console.log('Connected successfully!');
    
    const result = await client.query('SELECT current_user, current_database()');
    console.log('User:', result.rows[0].current_user);
    console.log('Database:', result.rows[0].current_database);
    
    await client.end();
  } catch (err) {
    console.error('Connection error:', err.message);
    console.error('Error code:', err.code);
    process.exit(1);
  }
}

testConnection();
