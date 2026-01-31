import { test, expect } from '@playwright/test'
import { login } from '../helpers/auth'

/**
 * Testes de CRM
 * 
 * Verifica navegação e funcionalidades do módulo CRM
 */

test.describe('CRM', () => {

    // Fazer login antes de cada teste
    test.beforeEach(async ({ page }) => {
        await login(page, 'teste@uniq.com', '123456')
    })

    test('deve abrir o menu CRM', async ({ page }) => {
        // PASSO 1: Clicar em "CRM" no menu principal
        await page.click('text=CRM')

        // PASSO 2: VERIFICAR - Submenu do CRM apareceu
        await expect(page.locator('text=Dashboard')).toBeVisible()
        await expect(page.locator('text=Leads/Clientes')).toBeVisible()
        await expect(page.locator('text=Chat')).toBeVisible()
    })

    test('deve navegar para Dashboard do CRM', async ({ page }) => {
        // Abrir menu CRM
        await page.click('text=CRM')

        // Clicar em "Dashboard"
        await page.click('text=Dashboard')

        // VERIFICAR - Carregou o dashboard do CRM
        // Nota: Ajuste conforme elementos do seu dashboard
        await expect(page.locator('text=/total.*leads/i')).toBeVisible({ timeout: 10000 })
            .catch(async () => {
                // Alternativa: verificar se algum KPI apareceu
                await expect(page.locator('[class*="card"]').first()).toBeVisible()
            })
    })

    test('deve navegar para Leads/Clientes', async ({ page }) => {
        // Abrir menu CRM e clicar em Leads/Clientes
        await page.click('text=CRM')
        await page.click('text=Leads/Clientes')

        // VERIFICAR - Página de leads carregou
        await expect(page.locator('text=/lead/i')).toBeVisible({ timeout: 5000 })
            .catch(async () => {
                // Alternativa: verificar se há uma tabela ou lista
                await expect(page.locator('table, [class*="list"]')).toBeVisible()
            })
    })

    test('deve navegar para Chat', async ({ page }) => {
        // Abrir menu CRM e clicar em Chat
        await page.click('text=CRM')
        await page.click('text=Chat')

        // VERIFICAR - Interface de chat carregou
        await expect(page.locator('text=/conversa|mensagem|chat/i')).toBeVisible({ timeout: 5000 })
            .catch(async () => {
                // Alternativa: verificar se há área de mensagens
                await expect(page.locator('[class*="chat"]').first()).toBeVisible()
            })
    })

    test('deve navegar para Oportunidades', async ({ page }) => {
        // Abrir menu CRM e clicar em Oportunidades
        await page.click('text=CRM')
        await page.click('text=Oportunidades')

        // VERIFICAR - Kanban de oportunidades carregou
        await expect(page.locator('text=/oportunidade|pipeline/i')).toBeVisible({ timeout: 5000 })
    })

})
