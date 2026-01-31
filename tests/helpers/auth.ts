import { Page } from '@playwright/test'

/**
 * Helper: Faz login no sistema
 * 
 * @param page - Página do Playwright
 * @param email - Email do usuário
 * @param password - Senha do usuário
 */
export async function login(page: Page, email: string, password: string) {
    // Ir para a página inicial
    await page.goto('/')

    // Preencher formulário de login
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', password)

    // Clicar no botão de login
    await page.click('button[type="submit"]')

    // Esperar estar na página do dashboard
    await page.waitForURL('**/dashboard')
}

/**
 * Helper: Faz logout do sistema
 */
export async function logout(page: Page) {
    // Clicar no avatar/menu do usuário
    // await page.click('[data-testid="user-menu"]')
    // await page.click('text=Sair')

    // Implementação simples: ir para / e limpar cookies
    await page.context().clearCookies()
    await page.goto('/')
}

/**
 * Helper: Verifica se está logado
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
    try {
        // Verificar se a URL é /dashboard ou se há algum elemento só visível quando logado
        return page.url().includes('/dashboard')
    } catch {
        return false
    }
}
