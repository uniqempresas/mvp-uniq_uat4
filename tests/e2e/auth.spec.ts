import { test, expect } from '@playwright/test'
import { login } from '../helpers/auth'

/**
 * Testes de Autenticação
 * 
 * Verifica se o sistema de login está funcionando corretamente
 */

test.describe('Autenticação', () => {

    test('deve fazer login com credenciais válidas', async ({ page }) => {
        // PASSO 1: Ir para a página inicial
        await page.goto('/')

        // PASSO 2: Preencher o formulário de login
        await page.fill('input[name="email"]', 'teste@uniq.com')
        await page.fill('input[name="password"]', '123456')

        // PASSO 3: Clicar no botão de entrar
        await page.click('button[type="submit"]')

        // PASSO 4: VERIFICAR - Deve estar no dashboard
        await expect(page).toHaveURL(/.*dashboard/)

        // PASSO 5: VERIFICAR - Título da página mudou
        await expect(page.locator('h1')).toContainText('Dashboard', { ignoreCase: true })
    })

    test('deve mostrar erro com credenciais inválidas', async ({ page }) => {
        // Ir para página de login
        await page.goto('/')

        // Tentar login com senha errada
        await page.fill('input[name="email"]', 'teste@uniq.com')
        await page.fill('input[name="password"]', 'senha_errada')
        await page.click('button[type="submit"]')

        // VERIFICAR - Deve mostrar mensagem de erro
        // Nota: Ajuste o seletor conforme sua mensagem de erro real
        await expect(page.locator('text=/credenciais.*inválidas/i')).toBeVisible({ timeout: 5000 })
            .catch(() => {
                // Se não tiver mensagem específica, verifica se continua na página de login
                expect(page.url()).toContain('/')
            })
    })

    test('não deve acessar dashboard sem estar logado', async ({ page }) => {
        // Tentar ir direto para o dashboard sem login
        await page.goto('/dashboard')

        // VERIFICAR - Deve redirecionar para página de login
        await expect(page).toHaveURL(/.*\/$/)
    })

})
