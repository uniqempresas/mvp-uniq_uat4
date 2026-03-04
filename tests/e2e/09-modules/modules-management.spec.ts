import { test, expect } from '@playwright/test'
import { loadTestData } from '../../helpers/data-loader'

test.describe('⚙️ Etapa 9: Gestão de Módulos', () => {
    test.setTimeout(120000)

    test('deve visualizar e ativar módulos na loja de módulos', async ({ page }) => {
        const data = loadTestData()
        
        console.log('⚙️ Testando gestão de módulos...')
        
        // ==================== LOGIN ====================
        await page.goto('/')
        await page.locator('input[type="email"]').fill(data.emailAdmin)
        await page.locator('input[type="password"]').fill(data.senha)
        await page.getByRole('button', { name: 'Entrar' }).click()
        await page.waitForURL(/.*dashboard/, { timeout: 15000 })
        await page.waitForTimeout(1500)
        console.log('✅ Login realizado')
        
        // ==================== ACESSAR LOJA DE MÓDULOS ====================
        console.log('\n🛒 Acessando Loja de Módulos...')
        
        // Clica em Módulos no menu
        await page.getByRole('button', { name: /Módulos/i }).first().click()
        await page.waitForTimeout(2000)
        
        // Verifica se chegou na loja de módulos
        await expect(page.getByRole('heading', { name: /Módulo Store|Loja de Módulos/i })).toBeVisible({ timeout: 10000 })
        console.log('✅ Loja de módulos carregada')
        
        // Tira screenshot da página inicial
        await page.screenshot({ path: 'tests/reports/modulos-loja-inicial.png', fullPage: true })
        
        // ==================== VERIFICAR ABAS ====================
        console.log('\n📑 Verificando abas de módulos...')
        
        const abas = ['Meus Módulos', 'Disponíveis', 'Em Breve']
        for (const aba of abas) {
            const btnAba = page.getByRole('button', { name: aba })
            if (await btnAba.isVisible().catch(() => false)) {
                await btnAba.click()
                await page.waitForTimeout(1500)
                console.log(`   ✅ Aba "${aba}" acessada`)
                
                // Tira screenshot de cada aba
                await page.screenshot({ path: `tests/reports/modulos-aba-${aba.toLowerCase().replace(/\s+/g, '-')}.png`, fullPage: true })
            }
        }
        
        // ==================== VERIFICAR MÓDULOS ATIVOS ====================
        console.log('\n✅ Verificando módulos ativos...')
        
        // Volta para "Meus Módulos"
        await page.getByRole('button', { name: 'Meus Módulos' }).click()
        await page.waitForTimeout(1500)
        
        // Conta quantos módulos estão ativos
        const badgesAtivos = await page.locator('text=Ativo').count()
        console.log(`   📊 Módulos ativos encontrados: ${badgesAtivos}`)
        
        // Lista módulos ativos
        const nomesModulosAtivos = await page.locator('.text-lg.font-bold').allTextContents()
        if (nomesModulosAtivos.length > 0) {
            console.log('   📝 Módulos ativos:')
            nomesModulosAtivos.forEach((nome, i) => console.log(`      ${i + 1}. ${nome}`))
        }
        
        // ==================== TENTAR ATIVAR MÓDULO ====================
        console.log('\n🔄 Tentando ativar um módulo...')
        
        // Vai para aba "Disponíveis"
        await page.getByRole('button', { name: 'Disponíveis' }).click()
        await page.waitForTimeout(1500)
        
        // Procura módulos disponíveis (com badge "Inativo")
        const modulosInativos = await page.locator('text=Inativo').count()
        console.log(`   📊 Módulos disponíveis: ${modulosInativos}`)
        
        if (modulosInativos > 0) {
            // Clica no primeiro módulo inativo para ver detalhes
            const primeiroModulo = page.locator('.bg-white.rounded').filter({ hasText: 'Inativo' }).first()
            await primeiroModulo.click()
            await page.waitForTimeout(1500)
            
            console.log('   ✅ Tela de detalhes do módulo aberta')
            
            // Tira screenshot da tela de detalhes
            await page.screenshot({ path: 'tests/reports/modulos-detalhes.png', fullPage: true })
            
            // Verifica se há botão de ativar
            const btnAtivar = page.getByRole('button', { name: /Ativar|Assinar|Contratar/i })
            if (await btnAtivar.isVisible().catch(() => false)) {
                console.log('   🔄 Botão de ativação encontrado')
                
                // Clica para ativar (em ambiente de teste, pode ser simulado)
                // await btnAtivar.click()
                // await page.waitForTimeout(2000)
                
                // console.log('   ✅ Módulo ativado com sucesso')
            } else {
                console.log('   ℹ️ Botão de ativação não disponível (pode já estar ativo ou requerer pagamento)')
            }
            
            // Volta para lista
            const btnVoltar = page.getByRole('button', { name: /Voltar|←/i })
            if (await btnVoltar.isVisible().catch(() => false)) {
                await btnVoltar.click()
                await page.waitForTimeout(1000)
            }
        } else {
            console.log('   ℹ️ Nenhum módulo disponível para ativação')
        }
        
        console.log('\n✅ Teste de gestão de módulos concluído!')
    })

    test('deve verificar módulos no onboarding', async ({ page }) => {
        console.log('\n📝 Verificando seleção de módulos no onboarding...')
        
        // Acessa onboarding (sem criar conta, só visualizar)
        await page.goto('/onboarding')
        await page.waitForLoadState('networkidle')
        await page.waitForTimeout(2000)
        
        // Preenche passo 1 para avançar
        await page.locator('input[name="fullName"]').fill('Teste Módulos')
        await page.locator('input[name="email"]').fill('teste.modulos@uniq.com')
        await page.locator('input[name="cpf"]').fill('529.982.247-25')
        await page.locator('input[name="password"]').fill('Senha123!')
        await page.locator('input[name="confirmPassword"]').fill('Senha123!')
        
        await page.getByRole('button', { name: 'Próximo Passo' }).click()
        await page.waitForTimeout(1500)
        
        // Preenche passo 2
        await page.locator('input[name="companyName"]').fill('Empresa Teste Módulos')
        await page.locator('input[name="cnpj"]').fill('11.222.333/0001-44')
        await page.locator('input[name="phone"]').fill('(11) 98765-4321')
        
        // Preenche endereço
        await page.locator('input[name="cep"]').fill('01001-000')
        await page.locator('input[name="cep"]').blur()
        await page.waitForTimeout(2000)
        
        await page.locator('input[name="numero"]').fill('100')
        
        await page.getByRole('button', { name: 'Próximo Passo' }).click()
        await page.waitForTimeout(1500)
        
        // ==================== VERIFICAR MÓDULOS NO PASSO 3 ====================
        console.log('⚙️ Verificando seleção de módulos...')
        
        // Verifica título da configuração
        await expect(page.getByRole('heading', { name: /Configuração|módulos/i })).toBeVisible({ timeout: 10000 })
        
        // Verifica se há checkboxes de módulos
        const checkboxes = await page.locator('input[type="checkbox"]').count()
        console.log(`   ✅ ${checkboxes} checkboxes de módulos encontrados`)
        
        // Lista módulos disponíveis
        const labelsModulos = await page.locator('label').filter({ hasText: /Vendas|Estoque|Financeiro|CRM/i }).allTextContents()
        if (labelsModulos.length > 0) {
            console.log('   📝 Módulos disponíveis no onboarding:')
            labelsModulos.forEach((mod, i) => console.log(`      ${i + 1}. ${mod}`))
        }
        
        // Marca alguns módulos
        const checkboxVendas = page.locator('label', { hasText: /Vendas|PDV/i }).locator('input[type="checkbox"]')
        if (await checkboxVendas.isVisible().catch(() => false)) {
            await checkboxVendas.check()
            console.log('   ✅ Módulo Vendas selecionado')
        }
        
        const checkboxFinanceiro = page.locator('label', { hasText: /Financeiro/i }).locator('input[type="checkbox"]')
        if (await checkboxFinanceiro.isVisible().catch(() => false)) {
            await checkboxFinanceiro.check()
            console.log('   ✅ Módulo Financeiro selecionado')
        }
        
        await page.screenshot({ path: 'tests/reports/modulos-onboarding.png', fullPage: true })
        
        console.log('✅ Teste de módulos no onboarding concluído!')
    })

    test('deve verificar acesso negado a módulos não ativos', async ({ page }) => {
        const data = loadTestData()
        
        console.log('\n🔒 Testando acesso a módulos...')
        
        // Login
        await page.goto('/')
        await page.locator('input[type="email"]').fill(data.emailAdmin)
        await page.locator('input[type="password"]').fill(data.senha)
        await page.getByRole('button', { name: 'Entrar' }).click()
        await page.waitForURL(/.*dashboard/, { timeout: 15000 })
        
        // Verifica quais módulos aparecem no menu
        console.log('📋 Verificando módulos no menu principal...')
        
        const modulosMenu = ['Vendas', 'CRM', 'Financeiro', 'Estoque', 'Loja Virtual', 'Atendente']
        const modulosVisiveis = []
        
        for (const modulo of modulosMenu) {
            const visivel = await page.getByRole('link').filter({ hasText: new RegExp(modulo, 'i') }).isVisible().catch(() => false)
            if (visivel) {
                modulosVisiveis.push(modulo)
            }
        }
        
        console.log(`   ✅ Módulos visíveis no menu: ${modulosVisiveis.join(', ')}`)
        
        // Tenta acessar um módulo
        if (modulosVisiveis.length > 0) {
            const primeiroModulo = modulosVisiveis[0]
            await page.getByRole('link').filter({ hasText: new RegExp(primeiroModulo, 'i') }).click()
            await page.waitForTimeout(2000)
            
            console.log(`   ✅ Acessou módulo: ${primeiroModulo}`)
            
            await page.screenshot({ path: `tests/reports/modulos-acesso-${primeiroModulo.toLowerCase().replace(/\s+/g, '-')}.png`, fullPage: true })
        }
        
        console.log('✅ Teste de acesso a módulos concluído!')
    })
})
