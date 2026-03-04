import { test, expect } from '@playwright/test'
import { loadTestData } from '../../helpers/data-loader'

test.describe('🧪 Teste de Bug - Preço do Serviço', () => {
    test.setTimeout(120000)

    test('deve cadastrar serviço com valor 200 e verificar se salvou corretamente', async ({ page }) => {
        const data = loadTestData()
        const nomeServico = `Serviço Teste Preço 200 - ${Date.now()}`
        
        console.log('🧪 Testando cadastro de serviço com preço R$ 200,00...')
        console.log(`📝 Nome: ${nomeServico}`)
        
        // Login
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        await page.locator('input[type="email"]').fill(data.emailAdmin)
        await page.locator('input[type="password"]').fill(data.senha)
        await page.getByRole('button', { name: 'Entrar' }).click()
        
        await page.waitForURL(/.*dashboard/, { timeout: 15000 })
        await page.waitForTimeout(1500)
        console.log('✅ Login realizado')
        
        // Navegar para Serviços
        await page.goto('/dashboard')
        await page.getByRole('button', { name: 'Cadastros' }).click()
        await page.getByRole('button', { name: 'Serviços' }).click()
        await page.waitForTimeout(2000)
        
        await expect(page.getByRole('heading', { name: 'Catálogo de Serviços' })).toBeVisible({ timeout: 10000 })
        console.log('✅ Página de serviços carregada')
        
        // Criar novo serviço
        await page.getByRole('button', { name: 'Novo Serviço' }).click()
        await page.waitForTimeout(1500)
        
        await expect(page.getByRole('heading', { name: 'Novo Serviço' })).toBeVisible({ timeout: 10000 })
        console.log('✅ Modal aberto')
        
        // PREENCHER FORMULÁRIO COM VALOR 200
        console.log('\n📝 Preenchendo formulário...')
        
        // Nome
        await page.getByPlaceholder('Ex: Consultoria Estratégica').fill(nomeServico)
        console.log('   ✅ Nome preenchido')
        
        // Descrição
        await page.getByPlaceholder('Descreva detalhadamente o serviço...').fill('Serviço de teste para verificar se o preço está sendo salvo corretamente no valor de R$ 200,00')
        console.log('   ✅ Descrição preenchida')
        
        // VERIFICAR CAMPOS DE PREÇO ANTES DE PREENCHER
        console.log('\n🔍 Verificando campos de valor antes de preencher...')
        
        // Lista todos os inputs do tipo text para ver qual é o de preço
        const inputs = await page.locator('input[type="text"]').all()
        console.log(`   📊 Total de inputs[type="text"]: ${inputs.length}`)
        
        for (let i = 0; i < inputs.length; i++) {
            const placeholder = await inputs[i].getAttribute('placeholder').catch(() => 'sem placeholder')
            const name = await inputs[i].getAttribute('name').catch(() => 'sem name')
            const value = await inputs[i].inputValue().catch(() => 'vazio')
            console.log(`   Input ${i}: placeholder="${placeholder}" | name="${name}" | value="${value}"`)
        }
        
        // PREÇO: Tentar preencher o campo correto
        console.log('\n💰 Preenchendo preço com R$ 200,00...')
        
        // Tenta encontrar input com placeholder relacionado a preço/valor
        const inputPreco = page.locator('input[type="text"]').first()
        await inputPreco.fill('200,00')
        
        // Verifica o que foi preenchido
        const valorPreenchido = await inputPreco.inputValue()
        console.log(`   ✅ Valor preenchido: "${valorPreenchido}"`)
        
        // Duração
        const inputDuracao = page.getByPlaceholder('Ex: 60')
        if (await inputDuracao.isVisible().catch(() => false)) {
            await inputDuracao.fill('45')
            console.log('   ⏱️ Duração: 45 minutos')
        }
        
        // Categoria
        const selectCategoria = page.locator('select').first()
        if (await selectCategoria.isVisible().catch(() => false)) {
            const options = await selectCategoria.locator('option').count()
            if (options > 1) {
                await selectCategoria.selectOption({ index: 1 })
                console.log('   ✅ Categoria selecionada')
            }
        }
        
        // Ativar
        const checkboxAtivo = page.locator('input[type="checkbox"]')
        if (await checkboxAtivo.isVisible().catch(() => false)) {
            await checkboxAtivo.check()
            console.log('   ✅ Serviço ativado')
        }
        
        // Screenshot antes de salvar
        await page.screenshot({ path: 'tests/reports/servico-bug-form-antes.png' })
        
        // Salvar
        console.log('\n💾 Salvando serviço...')
        await page.getByRole('button', { name: 'Salvar Serviço' }).click()
        await page.waitForTimeout(3000)
        
        console.log('✅ Serviço salvo')
        
        // VERIFICAR NA LISTA
        console.log('\n🔍 Verificando na lista...')
        
        // Volta para lista
        await page.goto('/dashboard')
        await page.getByRole('button', { name: 'Cadastros' }).click()
        await page.getByRole('button', { name: 'Serviços' }).click()
        await page.waitForTimeout(2000)
        
        // Limpa busca
        const campoBusca = page.getByPlaceholder('Buscar por nome, categoria...')
        if (await campoBusca.isVisible().catch(() => false)) {
            await campoBusca.clear()
        }
        
        // Procura o serviço
        const servicoEncontrado = await page.getByText(nomeServico).isVisible({ timeout: 5000 }).catch(() => false)
        
        if (servicoEncontrado) {
            console.log(`   ✅ Serviço "${nomeServico}" encontrado na lista`)
            
            // Verifica o preço na lista
            const preco200 = await page.getByText('R$ 200,00').isVisible({ timeout: 3000 }).catch(() => false)
            const preco150 = await page.getByText('R$ 150,00').isVisible({ timeout: 3000 }).catch(() => false)
            
            if (preco200) {
                console.log('   ✅✅✅ PREÇO CORRETO: R$ 200,00 está aparecendo!')
            } else if (preco150) {
                console.log('   ❌❌❌ BUG DETECTADO: Preço está R$ 150,00 (valor do serviço anterior)')
                console.log('   ⚠️ O valor não está sendo salvo corretamente!')
            } else {
                console.log('   ⚠️ Preço não encontrado na lista (pode estar zerado ou em outro formato)')
            }
        } else {
            console.log('   ❌ Serviço não encontrado na lista')
        }
        
        // Lista todos os preços visíveis para debug
        console.log('\n💰 Preços encontrados na lista:')
        const precos = await page.locator('text=R$').allTextContents()
        precos.forEach((preco, i) => console.log(`   ${i + 1}. ${preco}`))
        
        await page.screenshot({ path: 'tests/reports/servico-bug-lista-depois.png', fullPage: true })
        
        console.log('\n' + '='.repeat(60))
        console.log('🧪 TESTE DE BUG CONCLUÍDO')
        console.log('='.repeat(60))
        console.log(`📝 Serviço criado: ${nomeServico}`)
        console.log(`💰 Valor esperado: R$ 200,00`)
        console.log('='.repeat(60))
    })
})
