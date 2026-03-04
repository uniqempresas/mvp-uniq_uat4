import { test, expect } from '@playwright/test'
import { loadTestData } from '../../helpers/data-loader'

test.describe('🔍 Debug - Campo de Preço do Serviço', () => {
    test.setTimeout(120000)

    test('deve identificar qual campo está sendo preenchido com o preço', async ({ page }) => {
        const data = loadTestData()
        
        console.log('🔍 Investigando campo de preço...')
        
        // Login
        await page.goto('/')
        await page.locator('input[type="email"]').fill(data.emailAdmin)
        await page.locator('input[type="password"]').fill(data.senha)
        await page.getByRole('button', { name: 'Entrar' }).click()
        await page.waitForURL(/.*dashboard/, { timeout: 15000 })
        
        // Navegar para Serviços
        await page.goto('/dashboard')
        await page.getByRole('button', { name: 'Cadastros' }).click()
        await page.getByRole('button', { name: 'Serviços' }).click()
        await page.waitForTimeout(2000)
        
        await page.getByRole('button', { name: 'Novo Serviço' }).click()
        await page.waitForTimeout(1500)
        
        console.log('\n📸 Screenshot ANTES de preencher:')
        await page.screenshot({ path: 'tests/reports/debug-antes.png' })
        
        // LISTAR TODOS OS CAMPOS DO FORMULÁRIO
        console.log('\n📝 Listando todos os campos input do formulário:')
        
        const inputs = await page.locator('input, textarea, select').all()
        console.log(`Total de campos: ${inputs.length}`)
        
        for (let i = 0; i < inputs.length; i++) {
            const tag = await inputs[i].evaluate(el => el.tagName.toLowerCase())
            const type = await inputs[i].getAttribute('type').catch(() => 'no-type')
            const placeholder = await inputs[i].getAttribute('placeholder').catch(() => 'no-placeholder')
            const name = await inputs[i].getAttribute('name').catch(() => 'no-name')
            const id = await inputs[i].getAttribute('id').catch(() => 'no-id')
            const label = await inputs[i].getAttribute('aria-label').catch(() => 'no-label')
            
            console.log(`\n[${i}] ${tag.toUpperCase()}`)
            console.log(`    type: ${type}`)
            console.log(`    placeholder: "${placeholder}"`)
            console.log(`    name: "${name}"`)
            console.log(`    id: "${id}"`)
            console.log(`    aria-label: "${label}"`)
        }
        
        // IDENTIFICAR QUAL É O CAMPO DE PREÇO
        console.log('\n💰 Tentando identificar campo de preço...')
        
        // Procurar por placeholder de preço
        const inputPrecoPorPlaceholder = await page.locator('input[placeholder*="0,00"], input[placeholder*="preço"], input[placeholder*="valor"]').count()
        console.log(`Campos com placeholder de preço: ${inputPrecoPorPlaceholder}`)
        
        // Procurar por label "Preço" ou "Valor"
        const labels = await page.locator('label').allTextContents()
        console.log('\n🏷️ Labels encontrados:')
        labels.forEach((label, i) => {
            if (label.toLowerCase().includes('preço') || label.toLowerCase().includes('valor') || label.toLowerCase().includes('R$')) {
                console.log(`   [${i}] "${label}"`)
            }
        })
        
        // TENTAR PREENCHER O CAMPO DE PREÇO CORRETAMENTE
        console.log('\n💰 Preenchendo NOME primeiro...')
        await page.getByPlaceholder('Ex: Consultoria Estratégica').fill('Serviço Debug Preço')
        
        console.log('\n💰 Agora procurando campo de preço...')
        
        // Tentar encontrar input que vem APÓS o campo de descrição
        // Na análise do Code Archaeologist, o preço é o primeiro input[type="text"] após a descrição
        const todosInputsText = await page.locator('input[type="text"]').all()
        console.log(`\nTotal inputs[type="text"]: ${todosInputsText.length}`)
        
        // Preencher o SEGUNDO input[type="text"] (o primeiro é o nome, o segundo deve ser o preço)
        if (todosInputsText.length >= 2) {
            console.log('\n💰 Preenchendo SEGUNDO input[type="text"] com 200,00...')
            await todosInputsText[1].fill('200,00')
            
            const valor = await todosInputsText[1].inputValue()
            console.log(`✅ Valor preenchido: "${valor}"`)
            
            // Tira screenshot para confirmar
            await page.screenshot({ path: 'tests/reports/debug-depois.png' })
        }
        
        // Preencher descrição no meio
        await page.getByPlaceholder('Descreva detalhadamente o serviço...').fill('Teste de debug para verificar campo de preço')
        
        // Ativar
        const checkbox = page.locator('input[type="checkbox"]')
        if (await checkbox.isVisible().catch(() => false)) {
            await checkbox.check()
        }
        
        console.log('\n📸 Screenshot APÓS preencher tudo:')
        await page.screenshot({ path: 'tests/reports/debug-form-preenchido.png' })
        
        console.log('\n✅ Debug completo! Verifique os screenshots.')
    })
})
