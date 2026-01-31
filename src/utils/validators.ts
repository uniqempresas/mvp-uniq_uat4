/**
 * Validators - Funções de validação reutilizáveis
 * 
 * Valida CPF, CNPJ, Email e Senha para o cadastro de usuários
 */

/**
 * Valida CPF (Cadastro de Pessoa Física)
 * @param cpf - CPF com ou sem formatação (XXX.XXX.XXX-XX ou XXXXXXXXXXX)
 * @returns true se CPF é válido, false caso contrário
 */
export function validateCPF(cpf: string): boolean {
  // Remove formatação
  cpf = cpf.replace(/[^\d]/g, '')
  
  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false
  
  // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
  if (/^(\d)\1+$/.test(cpf)) return false
  
  // Valida primeiro dígito verificador
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i)
  }
  let digit = 11 - (sum % 11)
  if (digit > 9) digit = 0
  if (digit !== parseInt(cpf.charAt(9))) return false
  
  // Valida segundo dígito verificador
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i)
  }
  digit = 11 - (sum % 11)
  if (digit > 9) digit = 0
  
  return digit === parseInt(cpf.charAt(10))
}

/**
 * Valida CNPJ (Cadastro Nacional de Pessoa Jurídica)
 * @param cnpj - CNPJ com ou sem formatação (XX.XXX.XXX/XXXX-XX ou XXXXXXXXXXXXXX)
 * @returns true se CNPJ é válido, false caso contrário
 */
export function validateCNPJ(cnpj: string): boolean {
  // Remove formatação
  cnpj = cnpj.replace(/[^\d]/g, '')
  
  // Verifica se tem 14 dígitos
  if (cnpj.length !== 14) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cnpj)) return false
  
  // Valida primeiro dígito verificador
  let size = cnpj.length - 2
  let numbers = cnpj.substring(0, size)
  const digits = cnpj.substring(size)
  let sum = 0
  let pos = size - 7
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--
    if (pos < 2) pos = 9
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(digits.charAt(0))) return false
  
  // Valida segundo dígito verificador
  size = size + 1
  numbers = cnpj.substring(0, size)
  sum = 0
  pos = size - 7
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--
    if (pos < 2) pos = 9
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  return result === parseInt(digits.charAt(1))
}

/**
 * Valida formato de email
 * @param email - Email a ser validado
 * @returns true se email tem formato válido, false caso contrário
 */
export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email.trim())
}

/**
 * Valida força da senha
 * @param password - Senha a ser validada
 * @returns Objeto com valid (boolean) e message (string) opcional
 */
export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Senha deve ter no mínimo 8 caracteres' }
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Senha deve conter ao menos uma letra maiúscula' }
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Senha deve conter ao menos uma letra minúscula' }
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Senha deve conter ao menos um número' }
  }
  
  return { valid: true }
}

/**
 * Formata CPF
 * @param cpf - CPF sem formatação
 * @returns CPF formatado (XXX.XXX.XXX-XX)
 */
export function formatCPF(cpf: string): string {
  cpf = cpf.replace(/[^\d]/g, '')
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

/**
 * Formata CNPJ
 * @param cnpj - CNPJ sem formatação
 * @returns CNPJ formatado (XX.XXX.XXX/XXXX-XX)
 */
export function formatCNPJ(cnpj: string): string {
  cnpj = cnpj.replace(/[^\d]/g, '')
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

/**
 * Formata telefone
 * @param phone - Telefone sem formatação
 * @returns Telefone formatado ((XX) XXXXX-XXXX ou (XX) XXXX-XXXX)
 */
export function formatPhone(phone: string): string {
  phone = phone.replace(/[^\d]/g, '')
  if (phone.length === 11) {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  } else if (phone.length === 10) {
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return phone
}

/**
 * Formata CEP
 * @param cep - CEP sem formatação
 * @returns CEP formatado (XXXXX-XXX)
 */
export function formatCEP(cep: string): string {
  cep = cep.replace(/[^\d]/g, '')
  return cep.replace(/(\d{5})(\d{3})/, '$1-$2')
}
