import fs from 'fs'
import path from 'path'
import { generateCPF, generateCNPJ } from './generators'

export interface TestData {
    tipoEmpresa: 'optica' | 'confeccao' | 'hamburgueria' | 'loja_roupas'
    nomeEmpresa: string
    emailAdmin: string
    senha: string
    nomeCompleto: string
    cpf: string
    cnpj: string
    telefone: string
    cep: string
    numero: string
    complemento: string
    modulos: {
        vendas: boolean
        estoque: boolean
        financeiro: boolean
        crm: boolean
        fiscal: boolean
        projetos: boolean
    }
}

export interface ClienteTeste {
    nome: string
    email: string
    telefone: string
    tipo: 'fisica' | 'juridica'
}

const DEFAULT_DATA: TestData = {
    tipoEmpresa: 'optica',
    nomeEmpresa: 'Ótica Teste E2E',
    emailAdmin: 'otica@uniq.com',
    senha: 'Senha123!',
    nomeCompleto: 'Usuario Teste E2E',
    cpf: generateCPF(),
    cnpj: generateCNPJ(),
    telefone: '(11) 98765-4321',
    cep: '01001-000',
    numero: '100',
    complemento: 'Sala 1001',
    modulos: {
        vendas: true,
        estoque: true,
        financeiro: true,
        crm: true,
        fiscal: false,
        projetos: false
    }
}

const CLIENTES_PADRAO: ClienteTeste[] = [
    {
        nome: 'Cliente Padrão',
        email: 'cliente@email.com',
        telefone: '(11) 99999-0001',
        tipo: 'fisica'
    },
    {
        nome: 'Empresa ABC Ltda',
        email: 'contato@empresaabc.com',
        telefone: '(11) 3333-4444',
        tipo: 'juridica'
    },
    {
        nome: 'Maria Silva',
        email: 'maria.silva@email.com',
        telefone: '(11) 98888-7777',
        tipo: 'fisica'
    }
]

export function loadTestData(nomeArquivo: string = 'test-data'): TestData {
    // Tenta carregar arquivo personalizado
    const customPath = path.join(process.cwd(), 'tests', 'config', `${nomeArquivo}.md`)
    const defaultPath = path.join(process.cwd(), 'tests', 'config', 'test-data-default.md')
    
    let content: string
    
    if (fs.existsSync(customPath)) {
        content = fs.readFileSync(customPath, 'utf-8')
    } else if (fs.existsSync(defaultPath)) {
        content = fs.readFileSync(defaultPath, 'utf-8')
    } else {
        return DEFAULT_DATA
    }
    
    return parseTestData(content)
}

function parseTestData(content: string): TestData {
    // Sobrescreve com variáveis de ambiente se existirem
    const data = { ...DEFAULT_DATA }
    
    // Tenta extrair valores do arquivo MD
    const tipoMatch = content.match(/\*\*TIPO_EMPRESA\*\*\s*[:\|]\s*`?([^\n|]+)`?/i)
    const nomeMatch = content.match(/\*\*NOME_EMPRESA\*\*\s*[:\|]\s*`?([^\n|]+)`?/i)
    const emailMatch = content.match(/\*\*EMAIL_ADMIN\*\*\s*[:\|]\s*`?([^\n|]+)`?/i)
    const senhaMatch = content.match(/\*\*SENHA\*\*\s*[:\|]\s*`?([^\n|]+)`?/i)
    const nomeCompletoMatch = content.match(/\*\*NOME_COMPLETO\*\*\s*[:\|]\s*`?([^\n|]+)`?/i)
    const cpfMatch = content.match(/\*\*CPF\*\*\s*[:\|]\s*`?([^\n|]+)`?/i)
    const cnpjMatch = content.match(/\*\*CNPJ\*\*\s*[:\|]\s*`?([^\n|]+)`?/i)
    const telefoneMatch = content.match(/\*\*TELEFONE\*\*\s*[:\|]\s*`?([^\n|]+)`?/i)
    const cepMatch = content.match(/\*\*CEP\*\*\s*[:\|]\s*`?([^\n|]+)`?/i)
    const numeroMatch = content.match(/\*\*NUMERO\*\*\s*[:\|]\s*`?([^\n|]+)`?/i)
    const complementoMatch = content.match(/\*\*COMPLEMENTO\*\*\s*[:\|]\s*`?([^\n|]+)`?/i)
    
    if (tipoMatch) data.tipoEmpresa = tipoMatch[1].replace(/`/g, '').trim().toLowerCase() as any
    if (nomeMatch) data.nomeEmpresa = nomeMatch[1].replace(/`/g, '').trim()
    if (emailMatch) data.emailAdmin = emailMatch[1].replace(/`/g, '').trim()
    if (senhaMatch) data.senha = senhaMatch[1].replace(/`/g, '').trim()
    if (nomeCompletoMatch) data.nomeCompleto = nomeCompletoMatch[1].replace(/`/g, '').trim()
    if (cpfMatch) data.cpf = cpfMatch[1].replace(/`/g, '').trim()
    if (cnpjMatch) data.cnpj = cnpjMatch[1].replace(/`/g, '').trim()
    if (telefoneMatch) data.telefone = telefoneMatch[1].replace(/`/g, '').trim()
    if (cepMatch) data.cep = cepMatch[1].replace(/`/g, '').trim()
    if (numeroMatch) data.numero = numeroMatch[1].replace(/`/g, '').trim()
    if (complementoMatch) data.complemento = complementoMatch[1].replace(/`/g, '').trim()
    
    // Verifica módulos
    data.modulos.vendas = content.includes('Vendas') && (content.match(/-\s*\[x\].*Vendas/i) !== null)
    data.modulos.estoque = content.includes('Estoque') && (content.match(/-\s*\[x\].*Estoque/i) !== null)
    data.modulos.financeiro = content.includes('Financeiro') && (content.match(/-\s*\[x\].*Financeiro/i) !== null)
    data.modulos.crm = content.includes('CRM') && (content.match(/-\s*\[x\].*CRM/i) !== null)
    
    // Sobrescreve com variáveis de ambiente
    if (process.env.TEST_EMPRESA_TIPO) data.tipoEmpresa = process.env.TEST_EMPRESA_TIPO as any
    if (process.env.TEST_EMAIL) data.emailAdmin = process.env.TEST_EMAIL
    if (process.env.TEST_SENHA) data.senha = process.env.TEST_SENHA
    if (process.env.TEST_CPF) data.cpf = process.env.TEST_CPF
    
    return data
}

export function getClientesPadrao(): ClienteTeste[] {
    return CLIENTES_PADRAO
}

export function getFormasPagamento(): string[] {
    return ['PIX', 'Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Boleto']
}
