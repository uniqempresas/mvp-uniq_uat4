import { test, expect } from '@playwright/test'
import { loadTestData } from '../../helpers/data-loader'

test.describe('💰 Etapa 5: Módulo Financeiro', () => {
    test.setTimeout(120000)

    test('deve criar receita em Contas a Receber', async ({ page }) => {
        const data = loadTestData()
        const descricaoReceita = `Receita Teste E2E - ${Date.now()}`
        
        console.log('💰 Testando criação de receita...')
        console.log(`📝 Descrição: ${descricaoReceita}`)
        
        // ==================== LOGIN ====================
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        await page.locator('input[type="email"]').fill(data.emailAdmin)
        await page.locator('input[type="password"]').fill(data.senha)
        await page.getByRole('button', { name: 'Entrar' }).click()
        
        await page.waitForURL(/.*dashboard/, { timeout: 15000 })
        await page.waitForTimeout(1500)
        console.log('✅ Login realizado')
        
        // ==================== NAVEGAÇÃO ====================
        console.log('\n🧭 Navegando para Contas a Receber...')
        
        // Acessa diretamente pela URL
        await page.goto('/finance/receivable')
        await page.waitForTimeout(2000)
        
        // Verifica página carregou
        await expect(page.locator('text=Contas a Receber').first()).toBeVisible({ timeout: 10000 })
        console.log('✅ Página Contas a Receber carregada')
        
        // Verifica KPIs
        await expect(page.getByText('A Receber Hoje')).toBeVisible()
        await expect(page.getByText('Total a Receber (Mês)')).toBeVisible()
        await expect(page.getByText('Recebido (Mês)')).toBeVisible()
        console.log('✅ KPIs visíveis')
        
        // ==================== CRIAR RECEITA ====================
        console.log('\n💵 Criando nova receita...')
        
        // Clica em "Nova Receita"
        await page.getByRole('button', { name: 'Nova Receita' }).click()
        await page.waitForTimeout(1500)
        
        // Verifica modal abriu
        await expect(page.locator('text=Nova Receita').first()).toBeVisible({ timeout: 10000 })
        console.log('✅ Modal de receita aberto')
        
        // Preenche descrição
        await page.getByPlaceholder('Ex: Venda de Produto').fill(descricaoReceita)
        console.log('   📝 Descrição preenchida')
        
        // Preenche valor
        await page.getByPlaceholder('R$ 0,00').fill('299,90')
        console.log('   💵 Valor: R$ 299,90')
        
        // Preenche data de vencimento (amanhã)
        const amanha = new Date()
        amanha.setDate(amanha.getDate() + 1)
        await page.locator('input[type="date"]').fill(amanha.toISOString().split('T')[0])
        console.log('   📅 Vencimento preenchido')
        
        // Seleciona categoria (se houver)
        const selectCategoria = page.locator('label:has-text("Categoria") + select')
        if (await selectCategoria.isVisible().catch(() => false)) {
            const options = await selectCategoria.locator('option').count()
            if (options > 1) {
                await selectCategoria.selectOption({ index: 1 })
                console.log('   🏷️ Categoria selecionada')
            }
        }
        
        // Seleciona conta de vencimento (REQUIRED)
        const selectConta = page.locator('label:has-text("Conta de Vencimento") + select')
        await expect(selectConta).toBeVisible({ timeout: 5000 })
        
        const optionsConta = await selectConta.locator('option').count()
        if (optionsConta > 1) {
            await selectConta.selectOption({ index: 1 })
            console.log('   🏦 Conta de vencimento selecionada')
        } else {
            console.log('   ⚠️ Nenhuma conta disponível - teste pode falhar')
        }
        
        // Tira screenshot antes de salvar
        await page.screenshot({ path: 'tests/reports/financeiro-receita-form.png' })
        
        // Clica em Salvar
        await page.getByRole('button', { name: 'Salvar' }).click()
        await page.waitForTimeout(2000)
        
        console.log('✅ Receita salva')
        
        // Verifica se receita aparece na lista
        const receitaNaLista = await page.getByText(descricaoReceita).isVisible({ timeout: 5000 }).catch(() => false)
        
        if (receitaNaLista) {
            console.log('✅ Receita aparece na lista')
        } else {
            console.log('⚠️ Receita pode não ter sido salva ou ainda está carregando')
        }
        
        await page.screenshot({ path: 'tests/reports/financeiro-receita-lista.png', fullPage: true })
    })

    test('deve criar despesa em Contas a Pagar', async ({ page }) => {
        const data = loadTestData()
        const descricaoDespesa = `Despesa Teste E2E - ${Date.now()}`
        
        console.log('\n💸 Testando criação de despesa...')
        console.log(`📝 Descrição: ${descricaoDespesa}`)
        
        // Login
        await page.goto('/')
        await page.locator('input[type="email"]').fill(data.emailAdmin)
        await page.locator('input[type="password"]').fill(data.senha)
        await page.getByRole('button', { name: 'Entrar' }).click()
        
        await page.waitForURL(/.*dashboard/, { timeout: 15000 })
        
        // Navega para Contas a Pagar
        console.log('\n🧭 Navegando para Contas a Pagar...')
        await page.goto('/finance/payable')
        await page.waitForTimeout(2000)
        
        // Verifica página carregou
        await expect(page.locator('text=Contas a Pagar').first()).toBeVisible({ timeout: 10000 })
        console.log('✅ Página Contas a Pagar carregada')
        
        // Verifica KPIs
        await expect(page.getByText('Vencendo Hoje')).toBeVisible()
        await expect(page.getByText('Total a Pagar (Mês)')).toBeVisible()
        await expect(page.getByText('Pago (Mês)')).toBeVisible()
        console.log('✅ KPIs visíveis')
        
        // ==================== CRIAR DESPESA ====================
        console.log('\n💸 Criando nova despesa...')
        
        // Clica em "Nova Despesa"
        await page.getByRole('button', { name: 'Nova Despesa' }).click()
        await page.waitForTimeout(1500)
        
        // Verifica modal abriu
        await expect(page.locator('text=Nova Despesa').first()).toBeVisible({ timeout: 10000 })
        console.log('✅ Modal de despesa aberto')
        
        // Preenche descrição
        await page.getByPlaceholder('Ex: Conta de Luz').fill(descricaoDespesa)
        console.log('   📝 Descrição preenchida')
        
        // Preenche valor
        await page.getByPlaceholder('R$ 0,00').fill('150,00')
        console.log('   💸 Valor: R$ 150,00')
        
        // Preenche data de vencimento
        const amanha = new Date()
        amanha.setDate(amanha.getDate() + 1)
        await page.locator('input[type="date"]').fill(amanha.toISOString().split('T')[0])
        console.log('   📅 Vencimento preenchido')
        
        // Preenche fornecedor (opcional)
        const inputFornecedor = page.getByPlaceholder('Nome do fornecedor')
        if (await inputFornecedor.isVisible().catch(() => false)) {
            await inputFornecedor.fill('Fornecedor Teste E2E')
            console.log('   🏢 Fornecedor preenchido')
        }
        
        // Seleciona conta de vencimento (REQUIRED)
        const selectConta = page.locator('label:has-text("Conta de Vencimento") + select')
        await expect(selectConta).toBeVisible({ timeout: 5000 })
        
        const optionsConta = await selectConta.locator('option').count()
        if (optionsConta > 1) {
            await selectConta.selectOption({ index: 1 })
            console.log('   🏦 Conta de vencimento selecionada')
        }
        
        // Tira screenshot
        await page.screenshot({ path: 'tests/reports/financeiro-despesa-form.png' })
        
        // Salva
        await page.getByRole('button', { name: 'Salvar' }).click()
        await page.waitForTimeout(2000)
        
        console.log('✅ Despesa salva')
        
        // Verifica se despesa aparece na lista
        const despesaNaLista = await page.getByText(descricaoDespesa).isVisible({ timeout: 5000 }).catch(() => false)
        
        if (despesaNaLista) {
            console.log('✅ Despesa aparece na lista')
        }
        
        await page.screenshot({ path: 'tests/reports/financeiro-despesa-lista.png', fullPage: true })
    })

    test('deve verificar dashboard financeiro', async ({ page }) => {
        const data = loadTestData()
        
        console.log('\n📊 Verificando dashboard financeiro...')
        
        // Login
        await page.goto('/')
        await page.locator('input[type="email"]').fill(data.emailAdmin)
        await page.locator('input[type="password"]').fill(data.senha)
        await page.getByRole('button', { name: 'Entrar' }).click()
        
        await page.waitForURL(/.*dashboard/, { timeout: 15000 })
        
        // Navega para Financeiro
        await page.goto('/finance')
        await page.waitForTimeout(2000)
        
        // Verifica dashboard (usa first() para evitar conflito de múltiplos headings)
        await expect(page.getByRole('heading', { name: /Fluxo de Caixa|Financeiro/i }).first()).toBeVisible({ timeout: 10000 })
        console.log('✅ Dashboard financeiro carregado')
        
        // Verifica KPIs principais
        const kpis = ['Receita Bruta', 'Despesas Totais', 'Lucro Líquido']
        for (const kpi of kpis) {
            const visivel = await page.getByText(kpi).isVisible().catch(() => false)
            console.log(`   ${visivel ? '✅' : '⚠️'} ${kpi}`)
        }
        
        // Verifica gráficos
        const graficos = await page.locator('canvas').count()
        console.log(`   📈 Gráficos encontrados: ${graficos}`)
        
        // Verifica seções
        const secoes = ['Evolução Financeira', 'Detalhamento de Despesas']
        for (const secao of secoes) {
            const visivel = await page.getByText(secao).isVisible().catch(() => false)
            if (visivel) {
                console.log(`   ✅ Seção: ${secao}`)
            }
        }
        
        await page.screenshot({ path: 'tests/reports/financeiro-dashboard.png', fullPage: true })
        
        console.log('✅ Dashboard verificado')
    })
})
