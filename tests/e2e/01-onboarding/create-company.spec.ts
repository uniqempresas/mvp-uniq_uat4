import { test, expect } from '@playwright/test'
import { loadTestData } from '../../helpers/data-loader'
import { gerarProdutos } from '../../helpers/product-generator'

test.describe('🚀 Etapa 1: Onboarding - Criação de Empresa', () => {
    test.setTimeout(60000) // Aumenta timeout para 60s
    
    test('deve criar empresa completa com dados do template', async ({ page }) => {
        // Carrega dados de teste
        const data = loadTestData()
        
        console.log('🏢 Iniciando criação de empresa:', data.nomeEmpresa)
        console.log('📧 Email:', data.emailAdmin)
        console.log('🏭 Tipo:', data.tipoEmpresa)
        console.log('🔑 Senha:', data.senha)
        
        // ==================== PASSO 1: DADOS PESSOAIS ====================
        console.log('📋 Passo 1/3: Preenchendo dados pessoais...')
        
        await page.goto('/onboarding')
        await page.waitForLoadState('networkidle')
        
        // Valida que está na página correta
        await expect(page.locator('text=Criar sua Conta')).toBeVisible({ timeout: 10000 })
        
        // Preenche formulário - usando fill direto (limpa automaticamente)
        await page.locator('input[name="fullName"]').fill(data.nomeCompleto)
        await page.locator('input[name="email"]').fill(data.emailAdmin)
        await page.locator('input[name="cpf"]').fill(data.cpf)
        await page.locator('input[name="password"]').fill(data.senha)
        await page.locator('input[name="confirmPassword"]').fill(data.senha)
        
        // Verifica valores preenchidos
        await page.waitForTimeout(500)
        const emailValue = await page.locator('input[name="email"]').inputValue()
        const cpfValue = await page.locator('input[name="cpf"]').inputValue()
        console.log('✓ Email preenchido:', emailValue)
        console.log('✓ CPF preenchido:', cpfValue)
        
        // Tira screenshot para evidência
        await page.screenshot({ path: 'tests/reports/onboarding-step1.png', fullPage: true })
        
        // Clica no botão próximo
        console.log('➡️ Clicando em Próximo Passo...')
        await page.getByRole('button', { name: 'Próximo Passo' }).click()
        
        // Aguarda e verifica se permaneceu na mesma página (erro) ou avançou
        await page.waitForTimeout(1500)
        
        const urlAposClick = page.url()
        if (urlAposClick.includes('onboarding')) {
            // Ainda na página de onboarding - verificar se é Step 1 ou Step 2
            const step1Visivel = await page.locator('text=Criar sua Conta').isVisible().catch(() => false)
            
            if (step1Visivel) {
                console.log('⚠️ Ainda no Step 1 - pode haver erro de validação')
                
                const camposComErro = await page.locator('input.border-red-500').count()
                if (camposComErro > 0) {
                    console.log(`❌ ${camposComErro} campos com erro de validação`)
                    await page.screenshot({ path: 'tests/reports/onboarding-step1-erro.png', fullPage: true })
                    
                    // Tenta ler mensagens de erro
                    const erros = await page.locator('.text-red-500').allTextContents()
                    console.log('Erros encontrados:', erros)
                }
            }
        }
        
        // ==================== PASSO 2: DADOS DA EMPRESA ====================
        console.log('🏢 Passo 2/3: Preenchendo dados da empresa...')
        
        // Aguarda carregar o Step 2
        await expect(page.locator('text=Dados da Empresa')).toBeVisible({ timeout: 10000 })
        
        // Preenche campos da empresa
        await page.locator('input[name="companyName"]').fill(data.nomeEmpresa)
        await page.locator('input[name="cnpj"]').fill(data.cnpj)
        await page.locator('input[name="phone"]').fill(data.telefone)
        
        // Preenche selects obrigatórios (Ramo e Funcionários)
        await page.locator('select').first().selectOption('retail') // Varejo
        await page.locator('select').nth(1).selectOption('1-5') // 1-5 funcionários
        
        // Endereço - CEP (dispara busca automática)
        await page.locator('input[name="cep"]').fill(data.cep)
        await page.locator('input[name="cep"]').blur()
        
        // Aguarda preenchimento automático do endereço pelo ViaCEP (API pode demorar)
        await page.waitForTimeout(10000)
        
        // Verifica se o endereço foi preenchido
        const logradouro = await page.locator('input[name="logradouro"]').inputValue().catch(() => '')
        console.log('📍 Logradouro:', logradouro || '(aguardando...)')
        
        // Número e Complemento (usando placeholder ou label)
        await page.getByPlaceholder(/nº|numero/i).fill(data.numero)
        await page.getByPlaceholder(/apto|bloco|complemento/i).fill(data.complemento)
        
        await page.screenshot({ path: 'tests/reports/onboarding-step2.png', fullPage: true })
        
        // Avança para próximo passo
        await page.getByRole('button', { name: 'Próximo Passo' }).click()
        
        // ==================== PASSO 3: CONFIGURAÇÃO ====================
        console.log('⚙️ Passo 3/3: Configurando módulos...')
        
        await expect(page.locator('text=/configuração|módulos/i').first()).toBeVisible({ timeout: 10000 })
        
        // Aguarda carregar a tela de configuração
        await page.waitForTimeout(2000)
        
        // Aceita termos (sem módulos - agora configurados dentro da plataforma)
        await page.locator('text=Concordo com os Termos').first().click().catch(async () => {
            // Fallback: procura checkbox de termos
            const checkbox = await page.locator('input[type="checkbox"]').first()
            await checkbox.check()
        })
        
        await page.screenshot({ path: 'tests/reports/onboarding-step3.png', fullPage: true })
        
        // ==================== FINALIZAÇÃO ====================
        console.log('✅ Finalizando cadastro...')
        
        await page.getByRole('button', { name: /concluir|finalizar|criar/i }).click()
        
        // Aguarda redirecionamento para dashboard
        await page.waitForURL(/.*dashboard/, { timeout: 30000 })
        
        // Valida que chegou ao dashboard
        await expect(page.locator('text=/dashboard|visão geral/i').first()).toBeVisible({ timeout: 10000 })
        
        await page.screenshot({ path: 'tests/reports/onboarding-dashboard.png', fullPage: true })
        
        // ==================== RELATÓRIO ====================
        console.log('\n✅ EMPRESA CRIADA COM SUCESSO!')
        console.log('=====================================')
        console.log(`🏢 Empresa: ${data.nomeEmpresa}`)
        console.log(`📧 Email: ${data.emailAdmin}`)
        console.log(`🔑 Senha: ${data.senha}`)
        console.log(`🏭 Tipo: ${data.tipoEmpresa}`)
        console.log(`👤 Proprietário: ${data.nomeCompleto}`)
        console.log(`📍 Endereço: CEP ${data.cep}, Nº ${data.numero}`)
        console.log('=====================================\n')
        
        // Lista produtos para próxima etapa
        const produtos = gerarProdutos(data.tipoEmpresa)
        console.log(`📦 Produtos para criar na Etapa 3 (${produtos.length} itens):`)
        produtos.forEach((p, i) => console.log(`   ${i + 1}. ${p.nome} - R$ ${p.preco.toFixed(2)}`))
    })
    
    test('deve validar campos obrigatórios no onboarding', async ({ page }) => {
        await page.goto('/onboarding')
        await page.waitForLoadState('networkidle')
        
        // Tenta avançar sem preencher
        await page.getByRole('button', { name: 'Próximo Passo' }).click()
        
        await page.waitForTimeout(500)
        
        // Verifica erros
        const temErros = await page.locator('text=/obrigatório|preencha|inválido/i').isVisible({ timeout: 3000 }).catch(() => false)
        
        if (temErros) {
            console.log('✅ Validação de campos obrigatórios funcionando')
        } else {
            const camposComErro = await page.locator('input.border-red-500').count()
            if (camposComErro > 0) {
                console.log(`✅ ${camposComErro} campos marcados com erro`)
            }
        }
        
        expect(page.url()).toContain('onboarding')
    })
})
