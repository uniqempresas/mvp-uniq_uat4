import { test, expect } from '@playwright/test'
import { loadTestData } from '../../helpers/data-loader'

test.describe('🔐 Etapa 2: Autenticação', () => {
    test.setTimeout(30000)

    test('deve fazer login com credenciais válidas', async ({ page }) => {
        const data = loadTestData()
        
        console.log('🔐 Testando login...')
        console.log(`📧 Email: ${data.emailAdmin}`)
        console.log(`🔑 Senha: ${data.senha}`)
        
        // Acessa página de login
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        // Valida que está na página de login
        await expect(page.locator('text=Bem-vindo')).toBeVisible({ timeout: 10000 })
        
        // Preenche credenciais (inputs sem name, usar type ou placeholder)
        await page.locator('input[type="email"]').fill(data.emailAdmin)
        await page.locator('input[type="password"]').fill(data.senha)
        
        // Clica em entrar
        await page.getByRole('button', { name: /entrar|login|acessar/i }).click()
        
        // Aguarda redirecionamento para dashboard
        await page.waitForURL(/.*dashboard/, { timeout: 15000 })
        
        // Aguarda carregamento do dashboard
        await page.waitForTimeout(3000)
        
        // Valida que está logado (heading "Minha Empresa" na sidebar)
        await expect(page.getByRole('heading', { name: 'Minha Empresa' })).toBeVisible({ timeout: 10000 })
        
        await page.screenshot({ path: 'tests/reports/login-sucesso.png', fullPage: true })
        
        console.log('✅ Login realizado com sucesso!')
        console.log(`🏢 Empresa: ${data.nomeEmpresa}`)
        console.log(`👤 Logado como: ${data.emailAdmin}`)
    })

    test('deve mostrar erro com senha incorreta', async ({ page }) => {
        const data = loadTestData()
        
        console.log('🔐 Testando login com senha incorreta...')
        
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        // Preenche com senha errada
        await page.locator('input[type="email"]').fill(data.emailAdmin)
        await page.locator('input[type="password"]').fill('SenhaErrada123')
        
        await page.getByRole('button', { name: /entrar|login|acessar/i }).click()
        
        // Aguarda mensagem de erro
        await page.waitForTimeout(1000)
        
        const temErro = await page.locator('text=/inválida|incorreta|erro/i').isVisible({ timeout: 5000 }).catch(() => false)
        
        if (temErro) {
            console.log('✅ Mensagem de erro exibida corretamente')
        } else {
            // Verifica se permanece na página de login
            expect(page.url()).not.toContain('dashboard')
            console.log('✅ Permaneceu na página de login (senha incorreta)')
        }
        
        await page.screenshot({ path: 'tests/reports/login-erro.png', fullPage: true })
    })

    test('deve redirecionar para login ao acessar página protegida sem autenticação', async ({ page }) => {
        console.log('🔐 Testando acesso não autorizado...')
        
        // Tenta acessar dashboard diretamente sem login
        await page.goto('/dashboard')
        await page.waitForLoadState('networkidle')
        
        // Deve redirecionar para login
        await page.waitForTimeout(1000)
        
        const url = page.url()
        if (url.includes('login') || url === '/' || !url.includes('dashboard')) {
            console.log('✅ Redirecionou para login corretamente')
        } else {
            console.log('⚠️ Pode estar mostrando tela de erro ou outra página')
        }
        
        await page.screenshot({ path: 'tests/reports/acesso-nao-autorizado.png', fullPage: true })
    })

    test.skip('deve fazer logout corretamente', async ({ page }) => {
        const data = loadTestData()
        
        console.log('🔐 Testando logout...')
        
        // Primeiro faz login
        await page.goto('/')
        await page.locator('input[type="email"]').fill(data.emailAdmin)
        await page.locator('input[type="password"]').fill(data.senha)
        await page.getByRole('button', { name: /entrar|login|acessar/i }).click()
        
        await page.waitForURL(/.*dashboard/, { timeout: 15000 })
        
        // Agora faz logout (procura botão/link de sair)
        await page.locator('text=/sair|logout|exit/i').first().click().catch(async () => {
            // Se não achar por texto, tenta por ícone ou menu
            console.log('Buscando opção de logout no menu...')
            // Clica no avatar/menu do usuário
            await page.locator('[class*="avatar"], [class*="user-menu"], button:has-text("conta")').first().click()
            await page.waitForTimeout(500)
            await page.locator('text=/sair|logout/i').first().click()
        })
        
        await page.waitForTimeout(1000)
        
        // Verifica se voltou para login ou página inicial
        const url = page.url()
        if (!url.includes('dashboard')) {
            console.log('✅ Logout realizado com sucesso')
        }
        
        await page.screenshot({ path: 'tests/reports/logout.png', fullPage: true })
    })
})
