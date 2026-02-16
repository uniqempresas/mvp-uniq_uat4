import { generateCNPJ, generateCPF, generateEmail } from './tests/helpers/generators';

console.log('=== DADOS VÁLIDOS ===');
console.log(`CNPJ: ${generateCNPJ()}`);
console.log(`CPF: ${generateCPF()}`);
console.log(`Email: ${generateEmail()}`);
console.log('=====================');
