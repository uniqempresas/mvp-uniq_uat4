import { test, expect } from '@playwright/test'
import { login } from '../helpers/auth'

/**
 * Testes de Produtos
 * 
 * Verifica se é possível criar, editar e visualizar produtos
 */

test.describe('Gerenciamento de Produtos', () => {

    // Antes de CADA teste, fazer login
    test.beforeEach(async ({ page }) => {
        await login(page, 'teste@uniq.com', '123456')
    })

    test('deve navegar para a página de produtos', async ({ page }) => {
        // PASSO 1: Clicar em "Cadastros" no menu
        await page.click('text=Cadastros')

        // PASSO 2: Clicar em "Produtos" no submenu
        await page.click('text=Produtos')

        // PASSO 3: VERIFICAR - Deve estar na página de produtos
        await expect(page.locator('h1')).toContainText('Lista de Produtos')
    })

    test('deve abrir modal de novo produto', async ({ page }) => {
        // Navegar para produtos
        await page.click('text=Cadastros')
        await page.click('text=Produtos')

        // Clicar no botão "Novo Produto"
        await page.click('button:has-text("Novo Produto")')

        // VERIFICAR - Modal deve abrir
        // Nota: Ajuste o seletor conforme seu modal
        await expect(page.locator('text=Cadastrar Produto')).toBeVisible({ timeout: 5000 })
            .catch(async () => {
                // Alternativa: verificar se algum formulário de produto apareceu
                await expect(page.locator('[name="nome_produto"]')).toBeVisible()
            })
    })

    test.skip('deve criar produto simples', async ({ page }) => {
        // SKIP: Este teste precisa ser ajustado conforme seu formulário real

        // Navegar para produtos
        await page.click('text=Cadastros')
        await page.click('text=Produtos')
        await page.click('button:has-text("Novo Produto")')

        // Preencher formulário
        await page.fill('[name="nome_produto"]', 'Produto Teste E2E')
        await page.fill('[name="preco_varejo"]', '99.90')

        // Salvar
        await page.click('button:has-text("Salvar")')

        // VERIFICAR - Produto aparece na lista
        await expect(page.locator('text=Produto Teste E2E')).toBeVisible({ timeout: 10000 })
    })

})

test.describe('Vitrine Pública', () => {

    test('deve carregar a vitrine pública', async ({ page }) => {
        // Ir para a vitrine usando o slug da empresa
        // Nota: Ajuste o slug conforme sua empresa de teste
        await page.goto('/c/uniq-empresas')

        // VERIFICAR - Página carregou
        await expect(page.locator('h1')).toBeVisible()

        // VERIFICAR - Campo de busca existe
        await expect(page.locator('input[placeholder*="Buscar"]')).toBeVisible()
    })

    test.skip('deve mostrar produtos na vitrine', async ({ page }) => {
        await page.goto('/c/uniq-empresas')

        // VERIFICAR - Pelo menos um produto está visível
        await expect(page.locator('.product-card').first()).toBeVisible({ timeout: 10000 })
            .catch(async () => {
                // Alternativa: verificar se há imagens de produtos
                await expect(page.locator('img[alt*="produto"]').first()).toBeVisible()
            })
    })

})
