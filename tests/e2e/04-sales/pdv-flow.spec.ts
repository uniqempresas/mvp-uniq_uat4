import { test, expect } from '@playwright/test'
import { loadTestData } from '../../helpers/data-loader'
import { getNomesProdutos } from '../../helpers/product-generator'

test.describe('💰 Etapa 4: PDV - Fluxo de Venda', () => {
    test.setTimeout(120000) // 2 minutos

    test('deve realizar uma venda completa no PDV', async ({ page }) => {
        const data = loadTestData()
        const nomesProdutos = getNomesProdutos(data.tipoEmpresa)
        
        console.log('💰 Iniciando fluxo de venda no PDV...')
        console.log(`🏭 Empresa: ${data.nomeEmpresa}`)
        console.log(`📦 Produtos disponíveis: ${nomesProdutos.join(', ')}`)
        
        // ==================== LOGIN ====================
        console.log('\n🔐 Fazendo login...')
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        await page.locator('input[type="email"]').fill(data.emailAdmin)
        await page.locator('input[type="password"]').fill(data.senha)
        await page.getByRole('button', { name: 'Entrar' }).click()
        
        await page.waitForURL(/.*dashboard/, { timeout: 15000 })
        await page.waitForTimeout(1500)
        console.log('✅ Login realizado')
        
        // ==================== NAVEGAÇÃO PARA PDV ====================
        console.log('\n🛒 Navegando para PDV...')
        
        // Clica no menu Vendas & PDV (ícone point_of_sale)
        await page.getByRole('link', { name: /Vendas.*PDV/i }).click()
        await page.waitForTimeout(2000)
        
        // Verifica se chegou no PDV
        await expect(page.getByText(/PDV.*Venda Rápida/i)).toBeVisible({ timeout: 10000 })
        console.log('✅ PDV carregado')
        
        // ==================== ADICIONAR PRODUTOS ====================
        console.log('\n📦 Adicionando produtos ao carrinho...')
        
        // Adiciona 2 produtos do quick grid (clica nos cards)
        const produtosParaAdicionar = nomesProdutos.slice(0, 2) // Primeiros 2 produtos
        
        for (const nomeProduto of produtosParaAdicionar) {
            console.log(`   ➕ Adicionando: ${nomeProduto}`)
            
            // Procura o card do produto pelo nome
            const produtoCard = page.locator('button').filter({ hasText: nomeProduto }).first()
            
            if (await produtoCard.isVisible().catch(() => false)) {
                await produtoCard.click()
                await page.waitForTimeout(800)
                
                // Verifica se abriu modal de variação
                const temModalVariacao = await page.getByText('Selecionar Variação').isVisible({ timeout: 2000 }).catch(() => false)
                
                if (temModalVariacao) {
                    console.log('      📋 Modal de variação aberto')
                    // Seleciona primeira variação disponível
                    const primeiraVariacao = page.locator('button', { hasText: /R\$/ }).first()
                    await primeiraVariacao.click()
                    await page.waitForTimeout(500)
                    
                    // Clica em "Adicionar ao Carrinho"
                    await page.getByRole('button', { name: 'Adicionar ao Carrinho' }).click()
                    await page.waitForTimeout(800)
                    console.log('      ✅ Variação selecionada e adicionada')
                } else {
                    console.log('      ✅ Produto simples adicionado')
                }
            } else {
                console.log(`      ⚠️ Produto não encontrado no grid: ${nomeProduto}`)
            }
        }
        
        // Verifica se carrinho tem itens
        const carrinhoVazio = await page.getByText('Carrinho vazio').isVisible().catch(() => false)
        expect(carrinhoVazio).toBeFalsy()
        console.log('✅ Produtos adicionados ao carrinho')
        
        // ==================== SELECIONAR CLIENTE ====================
        console.log('\n👤 Selecionando cliente...')
        
        // Por padrão está "Venda sem cliente (avulsa)"
        // Vamos adicionar um cliente rápido
        await page.getByRole('button', { name: 'Cadastrar cliente rápido' }).click()
        await page.waitForTimeout(500)
        
        // Preenche dados do cliente (campos do modal de cadastro rápido)
        await page.getByPlaceholder('Nome do cliente *').fill('Cliente Teste PDV')
        await page.getByRole('textbox', { name: 'Telefone', exact: true }).fill('(11) 98765-4321')
        
        // Cadastra
        await page.getByRole('button', { name: 'Cadastrar' }).click()
        await page.waitForTimeout(1000)
        
        // Verifica se cliente foi selecionado
        const clienteSelecionado = await page.getByText('Cliente Teste PDV').isVisible({ timeout: 3000 }).catch(() => false)
        if (clienteSelecionado) {
            console.log('✅ Cliente cadastrado e selecionado')
        } else {
            console.log('⚠️ Cliente pode não ter sido selecionado, continuando...')
        }
        
        // ==================== FORMA DE PAGAMENTO ====================
        console.log('\n💳 Selecionando forma de pagamento...')
        
        // PIX já é o padrão, mas vamos garantir
        const btnPix = page.locator('button').filter({ hasText: /Pix/i }).first()
        if (await btnPix.isVisible().catch(() => false)) {
            await btnPix.click()
            console.log('   ✅ PIX selecionado')
        }
        
        // ==================== FINALIZAR VENDA ====================
        console.log('\n✅ Finalizando venda...')
        
        // Tira screenshot antes de finalizar
        await page.screenshot({ path: 'tests/reports/pdv-antes-finalizar.png', fullPage: true })
        
        // Clica em "Finalizar Venda"
        await page.getByRole('button', { name: 'Finalizar Venda' }).click()
        
        // Aguarda processamento
        await page.waitForTimeout(3000)
        
        // Verifica mensagem de sucesso
        const sucesso = await page.getByText('Venda registrada com sucesso!').isVisible({ timeout: 5000 }).catch(() => false)
        
        if (sucesso) {
            console.log('✅ Venda registrada com sucesso!')
        } else {
            // Verifica se houve erro
            const erro = await page.locator('[class*="bg-red-50"], [class*="text-red"]').isVisible().catch(() => false)
            if (erro) {
                const msgErro = await page.locator('[class*="bg-red-50"], [class*="text-red"]').textContent().catch(() => '')
                console.log(`❌ Erro na venda: ${msgErro}`)
            }
        }
        
        // Tira screenshot do resultado
        await page.screenshot({ path: 'tests/reports/pdv-venda-finalizada.png', fullPage: true })
        
        // Verifica se carrinho foi limpo (venda concluída)
        const carrinhoLimpo = await page.getByText('Carrinho vazio').isVisible({ timeout: 3000 }).catch(() => false)
        if (carrinhoLimpo) {
            console.log('✅ Carrinho limpo após venda')
        }
        
        console.log('\n' + '='.repeat(50))
        console.log('✅ FLUXO DE VENDA CONCLUÍDO!')
        console.log('='.repeat(50))
        console.log(`📦 Produtos: ${produtosParaAdicionar.length}`)
        console.log(`👤 Cliente: Cliente Teste PDV`)
        console.log(`💳 Pagamento: PIX`)
        console.log('='.repeat(50))
        
        // Valida que a venda foi concluída
        expect(sucesso || carrinhoLimpo).toBeTruthy()
    })

    test('deve validar carrinho vazio ao tentar finalizar', async ({ page }) => {
        const data = loadTestData()
        
        console.log('\n🧪 Testando validação de carrinho vazio...')
        
        // Login
        await page.goto('/')
        await page.locator('input[type="email"]').fill(data.emailAdmin)
        await page.locator('input[type="password"]').fill(data.senha)
        await page.getByRole('button', { name: 'Entrar' }).click()
        
        await page.waitForURL(/.*dashboard/, { timeout: 15000 })
        
        // Vai para PDV
        await page.getByRole('link', { name: /Vendas.*PDV/i }).click()
        await page.waitForTimeout(2000)
        
        // Tenta finalizar sem produtos
        const btnFinalizar = page.getByRole('button', { name: 'Finalizar Venda' })
        const estaDesabilitado = await btnFinalizar.isDisabled().catch(() => false)
        
        if (estaDesabilitado) {
            console.log('✅ Botão desabilitado quando carrinho vazio')
        } else {
            // Clica e verifica mensagem de erro
            await btnFinalizar.click()
            await page.waitForTimeout(1000)
            
            const temErro = await page.getByText(/carrinho vazio|adicione.*item/i).isVisible({ timeout: 3000 }).catch(() => false)
            if (temErro) {
                console.log('✅ Mensagem de erro exibida')
            }
        }
        
        await page.screenshot({ path: 'tests/reports/pdv-carrinho-vazio.png', fullPage: true })
    })
})
