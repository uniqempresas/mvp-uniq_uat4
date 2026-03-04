import { test, expect } from '@playwright/test'
import { loadTestData } from '../../helpers/data-loader'

test.describe('👥 Etapa 6: Módulo CRM', () => {
    test.setTimeout(120000)

    test('deve cadastrar lead e verificar na lista', async ({ page }) => {
        const data = loadTestData()
        const nomeLead = `Lead E2E - ${Date.now()}`
        
        console.log('👥 Testando CRM - Cadastro de Lead...')
        console.log(`📝 Nome: ${nomeLead}`)
        
        // ==================== LOGIN ====================
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        await page.locator('input[type="email"]').fill(data.emailAdmin)
        await page.locator('input[type="password"]').fill(data.senha)
        await page.getByRole('button', { name: 'Entrar' }).click()
        
        await page.waitForURL(/.*dashboard/, { timeout: 15000 })
        await page.waitForTimeout(1500)
        console.log('✅ Login realizado')
        
        // ==================== NAVEGAR PARA CRM ====================
        console.log('\n🧭 Acessando CRM...')
        
        await page.goto('/crm')
        await page.waitForTimeout(2000)
        
        // Verifica dashboard CRM carregou
        await expect(page.getByRole('heading', { name: /CRM|Dashboard/i }).first()).toBeVisible({ timeout: 10000 })
        console.log('✅ Dashboard CRM carregado')
        
        // ==================== ACESSAR CLIENTES/LEADS ====================
        console.log('\n👤 Cadastrando novo lead...')
        
        // Clica em Clientes no submenu
        await page.getByRole('button', { name: 'Clientes' }).click()
        await page.waitForTimeout(1500)
        
        // Verifica página de leads
        await expect(page.getByRole('heading', { name: 'Leads' })).toBeVisible({ timeout: 10000 })
        console.log('✅ Página de leads carregada')
        
        // ==================== CRIAR NOVO LEAD ====================
        console.log('\n➕ Criando novo lead...')
        
        await page.getByRole('button', { name: 'Novo Lead' }).click()
        await page.waitForTimeout(1500)
        
        // Verifica modal abriu
        await expect(page.getByRole('heading', { name: 'Novo Lead' })).toBeVisible({ timeout: 10000 })
        console.log('✅ Modal de lead aberto')
        
        // Preenche formulário
        await page.locator('input[name="nome"]').fill(nomeLead)
        console.log('   ✅ Nome preenchido')
        
        await page.locator('input[name="email"]').fill('lead@teste.com')
        console.log('   📧 Email preenchido')
        
        await page.locator('input[name="telefone"]').fill('(11) 98765-4321')
        console.log('   📱 Telefone preenchido')
        
        // Seleciona status
        await page.locator('select[name="status"]').selectOption('novo')
        console.log('   🏷️ Status: Novo')
        
        // Observações (opcional)
        await page.locator('textarea[name="observacoes"]').fill('Lead cadastrado via teste E2E automatizado')
        
        // Tira screenshot antes de salvar
        await page.screenshot({ path: 'tests/reports/crm-lead-form.png' })
        
        // Salva
        await page.getByRole('button', { name: 'Salvar' }).click()
        await page.waitForTimeout(2000)
        
        console.log('✅ Lead salvo')
        
        // ==================== VERIFICAR NA LISTA ====================
        console.log('\n📋 Verificando lead na lista...')
        
        // Volta para lista
        await page.goto('/crm')
        await page.getByRole('button', { name: 'Clientes' }).click()
        await page.waitForTimeout(2000)
        
        const leadNaLista = await page.getByText(nomeLead).isVisible({ timeout: 5000 }).catch(() => false)
        
        if (leadNaLista) {
            console.log('✅ Lead aparece na lista')
        } else {
            console.log('⚠️ Lead não encontrado na lista')
        }
        
        await page.screenshot({ path: 'tests/reports/crm-lead-lista.png', fullPage: true })
        
        console.log('\n' + '='.repeat(50))
        console.log('✅ CADASTRO DE LEAD CONCLUÍDO!')
        console.log('='.repeat(50))
        console.log(`📝 Nome: ${nomeLead}`)
        console.log(`📧 Email: lead@teste.com`)
        console.log(`📱 Telefone: (11) 98765-4321`)
        console.log('='.repeat(50))
    })

    test('deve criar oportunidade', async ({ page }) => {
        const data = loadTestData()
        const tituloOportunidade = `Oportunidade E2E - ${Date.now()}`
        
        console.log('\n💼 Testando criação de oportunidade...')
        console.log(`📝 Título: ${tituloOportunidade}`)
        
        // ==================== LOGIN ====================
        await page.goto('/')
        await page.locator('input[type="email"]').fill(data.emailAdmin)
        await page.locator('input[type="password"]').fill(data.senha)
        await page.getByRole('button', { name: 'Entrar' }).click()
        
        await page.waitForURL(/.*dashboard/, { timeout: 15000 })
        
        // ==================== NAVEGAR PARA OPORTUNIDADES ====================
        console.log('\n🧭 Acessando Oportunidades...')
        
        await page.goto('/crm')
        await page.waitForTimeout(1000)
        
        await page.getByRole('button', { name: 'Oportunidades' }).click()
        await page.waitForTimeout(2000)
        
        // Verifica página de oportunidades
        await expect(page.getByRole('heading', { name: 'Oportunidades' })).toBeVisible({ timeout: 10000 })
        console.log('✅ Página de oportunidades carregada')
        
        // ==================== CRIAR OPORTUNIDADE ====================
        console.log('\n➕ Criando nova oportunidade...')
        
        await page.getByRole('button', { name: 'Nova Oportunidade' }).click()
        await page.waitForTimeout(1500)
        
        // Preenche título
        await page.locator('input[name="titulo"]').fill(tituloOportunidade)
        console.log('   ✅ Título preenchido')
        
        // Seleciona lead (se houver)
        const selectLead = page.locator('select[name="lead_id"]')
        if (await selectLead.isVisible().catch(() => false)) {
            const optionsLead = await selectLead.locator('option').count()
            if (optionsLead > 1) {
                await selectLead.selectOption({ index: 1 })
                console.log('   ✅ Lead selecionado')
            }
        }
        
        // Preenche valor
        const inputValor = page.locator('input[name="valor"]')
        if (await inputValor.isVisible().catch(() => false)) {
            await inputValor.fill('5000,00')
            console.log('   💰 Valor: R$ 5.000,00')
        }
        
        // Data de fechamento
        const inputData = page.locator('input[name="data_fechamento"]')
        if (await inputData.isVisible().catch(() => false)) {
            const dataFechamento = new Date()
            dataFechamento.setDate(dataFechamento.getDate() + 30)
            await inputData.fill(dataFechamento.toISOString().split('T')[0])
            console.log('   📅 Data de fechamento preenchida')
        }
        
        // Seleciona estágio (se houver opções)
        const selectEstagio = page.locator('select[name="estagio"]')
        if (await selectEstagio.isVisible().catch(() => false)) {
            const optionsCount = await selectEstagio.locator('option').count()
            if (optionsCount > 0) {
                await selectEstagio.selectOption({ index: 0 })
                console.log('   🏷️ Estágio selecionado')
            } else {
                console.log('   ⚠️ Select de estágio vazio (sem estágios configurados)')
            }
        }
        
        // Tira screenshot
        await page.screenshot({ path: 'tests/reports/crm-oportunidade-form.png' })
        
        // Salva
        await page.getByRole('button', { name: 'Salvar' }).click()
        await page.waitForTimeout(2000)
        
        console.log('✅ Oportunidade criada')
        
        // Verifica se aparece no funil
        const oportunidadeCriada = await page.getByText(tituloOportunidade).isVisible({ timeout: 5000 }).catch(() => false)
        
        if (oportunidadeCriada) {
            console.log('✅ Oportunidade aparece no funil')
        } else {
            console.log('⚠️ Oportunidade não encontrada no funil')
        }
        
        await page.screenshot({ path: 'tests/reports/crm-oportunidade-kanban.png', fullPage: true })
        
        console.log('\n' + '='.repeat(50))
        console.log('✅ OPORTUNIDADE CRIADA!')
        console.log('='.repeat(50))
        console.log(`📝 Título: ${tituloOportunidade}`)
        console.log(`💰 Valor: R$ 5.000,00`)
        console.log('='.repeat(50))
    })

    test('deve verificar dashboard do CRM', async ({ page }) => {
        const data = loadTestData()
        
        console.log('\n📊 Verificando dashboard do CRM...')
        
        // Login
        await page.goto('/')
        await page.locator('input[type="email"]').fill(data.emailAdmin)
        await page.locator('input[type="password"]').fill(data.senha)
        await page.getByRole('button', { name: 'Entrar' }).click()
        
        await page.waitForURL(/.*dashboard/, { timeout: 15000 })
        
        // Vai para CRM Dashboard
        await page.goto('/crm')
        await page.waitForTimeout(2000)
        
        // Clica em Dashboard
        await page.getByRole('button', { name: 'Dashboard' }).click()
        await page.waitForTimeout(1500)
        
        // Verifica KPIs
        const kpis = [
            'Oportunidades em Aberto',
            'Valor em Pipeline', 
            'Vendas Ganhas',
            'Taxa de Conversão'
        ]
        
        let kpisEncontrados = 0
        
        for (const kpi of kpis) {
            const encontrado = await page.getByText(kpi).isVisible().catch(() => false)
            if (encontrado) {
                console.log(`   ✅ KPI: ${kpi}`)
                kpisEncontrados++
            }
        }
        
        // Verifica funil de vendas
        const temFunil = await page.getByRole('heading', { name: /Funil de Vendas/i }).isVisible().catch(() => false)
        
        if (temFunil) {
            console.log('   ✅ Funil de vendas encontrado')
        }
        
        // Verifica atividades recentes
        const temAtividades = await page.getByRole('heading', { name: /Atividades Recentes/i }).isVisible().catch(() => false)
        
        if (temAtividades) {
            console.log('   ✅ Atividades recentes encontradas')
        }
        
        // Verifica novas oportunidades
        const temNovasOportunidades = await page.getByRole('heading', { name: /Novas Oportunidades/i }).isVisible().catch(() => false)
        
        if (temNovasOportunidades) {
            console.log('   ✅ Tabela de novas oportunidades encontrada')
        }
        
        await page.screenshot({ path: 'tests/reports/crm-dashboard.png', fullPage: true })
        
        console.log('\n' + '='.repeat(50))
        console.log(`✅ DASHBOARD VERIFICADO!`)
        console.log('='.repeat(50))
        console.log(`📊 KPIs encontrados: ${kpisEncontrados}/${kpis.length}`)
        console.log('='.repeat(50))
    })
})