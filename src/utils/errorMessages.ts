/**
 * Error Messages - Mensagens de erro amigáveis para o usuário
 * 
 * Traduz erros técnicos do Supabase em mensagens compreensíveis
 */

/**
 * Retorna mensagem de erro amigável baseada no erro do Supabase
 * @param error - Erro capturado (Supabase ou genérico)
 * @returns Mensagem de erro formatada para o usuário
 */
export function getErrorMessage(error: any): string {
    // Erros de autenticação do Supabase
    if (error.message?.includes('User already registered')) {
        return 'Este email já está cadastrado. Tente fazer login ou use outro email.'
    }

    if (error.message?.includes('Password should be at least')) {
        return 'A senha deve ter no mínimo 6 caracteres.'
    }

    if (error.message?.includes('Invalid login credentials')) {
        return 'Email ou senha incorretos.'
    }

    if (error.message?.includes('Email not confirmed')) {
        return 'Por favor, confirme seu email antes de fazer login.'
    }

    // Erros de violação de constraint no banco (PostgreSQL)
    if (error.code === '23505') { // Unique violation
        if (error.message?.includes('cnpj')) {
            return 'Este CNPJ já está cadastrado no sistema.'
        }
        if (error.message?.includes('cpf')) {
            return 'Este CPF já está cadastrado no sistema.'
        }
        if (error.message?.includes('slug')) {
            return 'Já existe uma empresa com este nome. Tente um nome diferente.'
        }
        if (error.message?.includes('email')) {
            return 'Este email já está em uso. Tente outro email.'
        }
        return 'Já existe um registro com estes dados. Verifique as informações.'
    }

    if (error.code === '23503') { // Foreign key violation
        return 'Erro de referência no banco de dados. Entre em contato com o suporte.'
    }

    if (error.code === '23502') { // Not null violation
        return 'Alguns campos obrigatórios não foram preenchidos. Verifique o formulário.'
    }

    // Erro de permissão RLS (Row Level Security)
    if (error.code === '42501') {
        return 'Erro de permissão. Verifique as configurações de segurança ou contate o suporte.'
    }

    // Erros de rede
    if (error.message?.includes('Failed to fetch') || error.message?.includes('Network')) {
        return 'Erro de conexão. Verifique sua internet e tente novamente.'
    }

    // Timeout
    if (error.message?.includes('timeout')) {
        return 'A operação demorou muito tempo. Tente novamente.'
    }

    // Erro genérico
    return error.message || 'Ocorreu um erro desconhecido. Tente novamente ou contate o suporte.'
}

/**
 * Mensagens de validação específicas
 */
export const ValidationMessages = {
    CPF_INVALID: 'CPF inválido. Verifique o número digitado.',
    CNPJ_INVALID: 'CNPJ inválido. Verifique o número digitado.',
    EMAIL_INVALID: 'Email inválido. Use o formato: exemplo@email.com',
    PASSWORD_WEAK: 'Senha fraca. Use no mínimo 8 caracteres com letras maiúsculas, minúsculas e números.',
    PASSWORD_MISMATCH: 'As senhas não coincidem. Digite a mesma senha nos dois campos.',
    FIELD_REQUIRED: 'Este campo é obrigatório.',
    PHONE_INVALID: 'Telefone inválido. Use o formato: (XX) XXXXX-XXXX',
    CEP_INVALID: 'CEP inválido. Use o formato: XXXXX-XXX',
}
