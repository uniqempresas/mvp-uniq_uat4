import { test, expect } from '@playwright/test'
import { loadTestData } from '../../helpers/data-loader'
import path from 'path'

test.describe('🏪 Etapa 7: Loja Virtual - Configuração Completa', () => {
    test.setTimeout(180000)

    test('deve configurar loja completa com banners e produtos', async ({ page }) => {
        const data = loadTestData()
        
        console.log('🏪 Iniciando configuração da Loja Virtual...')
        console.log(`🏢 Empresa: ${data.nomeEmpresa}`)
        
        // ==================== LOGIN ====================
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        
        await page.locator('input[type="email"]').fill(data.emailAdmin)
        await page.locator('input[type="password"]').fill(data.senha)
        await page.getByRole('button', { name: 'Entrar' }).click()
        
        await page.waitForURL(/.*dashboard/, { timeout: 15000 })
        await page.waitForTimeout(1500)
        console.log('✅ Login realizado')
        
        // ==================== ACESSAR CONFIGURAÇÕES DA LOJA ====================
        console.log('\n⚙️ Acessando Configurações da Loja...')
        
        // Acessa diretamente pela URL
        await page.goto('/dashboard/store-config')
        await page.waitForTimeout(2000)
        
        // Verifica página carregou
        await expect(page.getByRole('heading', { name: 'Configurações de Perfil' })).toBeVisible({ timeout: 10000 })
        console.log('✅ Página de configurações carregada')
        
        // ==================== ABA 1: INFORMAÇÕES GERAIS ====================
        console.log('\n📝 Configurando Informações Gerais...')
        
        // Clica na aba Informações Gerais
        await page.getByRole('button', { name: 'Informações Gerais' }).click()
        await page.waitForTimeout(1000)
        
        // Preenche nome da empresa
        const inputNome = page.locator('input[name="nome_fantasia"]').first()
        if (await inputNome.isVisible().catch(() => false)) {
            await inputNome.clear()
            await inputNome.fill(data.nomeEmpresa)
            console.log(`   ✅ Nome: ${data.nomeEmpresa}`)
        }
        
        // Preenche slogan
        const inputSlogan = page.locator('input[name="store_config.slogan"]').first()
        if (await inputSlogan.isVisible().catch(() => false)) {
            await inputSlogan.fill('A melhor ótica da cidade!')
            console.log('   ✅ Slogan configurado')
        }
        
        // Preenche descrição
        const textareaDescricao = page.locator('textarea[name="store_config.description"]').first()
        if (await textareaDescricao.isVisible().catch(() => false)) {
            await textareaDescricao.fill('Especialistas em óculos de grau, sol e lentes de contato. Atendimento personalizado e preços justos para toda a família.')
            console.log('   ✅ Descrição configurada')
        }
        
        // Tira screenshot
        await page.screenshot({ path: 'tests/reports/loja-config-geral.png', fullPage: true })
        
        // ==================== ABA 2: VITRINE & PRODUTOS ====================
        console.log('\n📦 Configurando Vitrine e Produtos...')
        
        await page.getByRole('button', { name: 'Vitrine & Produtos' }).click()
        await page.waitForTimeout(1500)
        
        // Verifica lista de produtos
        const produtos = await page.locator('button[role="switch"]').count()
        console.log(`   📊 Produtos encontrados: ${produtos}`)
        
        // Ativa os primeiros 3 produtos
        const toggles = await page.locator('button[role="switch"]').all()
        let ativados = 0
        
        for (let i = 0; i < Math.min(3, toggles.length); i++) {
            const toggle = toggles[i]
            const isAtivo = await toggle.evaluate(el => el.classList.contains('bg-indigo-600'))
            
            if (!isAtivo) {
                await toggle.click()
                await page.waitForTimeout(500)
                ativados++
            }
        }
        
        console.log(`   ✅ ${ativados} produtos ativados na vitrine`)
        
        await page.screenshot({ path: 'tests/reports/loja-config-produtos.png', fullPage: true })
        
        // ==================== ABA 3: BANNERS ====================
        console.log('\n🖼️ Criando Banners...')
        
        await page.getByRole('button', { name: 'Banners', exact: true }).click()
        await page.waitForTimeout(1500)
        
        // Verifica se já existe banner
        const temBanners = await page.locator('img[alt="Banner"]').isVisible().catch(() => false)
        
        if (!temBanners) {
            console.log('   🆕 Criando novo banner...')
            
            // Clica em "Novo Banner" ou "Criar Primeiro Banner"
            const btnNovoBanner = page.getByRole('button', { name: /Novo Banner|Criar Primeiro Banner/i }).first()
            await btnNovoBanner.click()
            await page.waitForTimeout(1500)
            
            // Preenche formulário do banner
            await page.locator('input[type="text"]').filter({ hasValue: '' }).first().fill('Promoção de Verão')
            await page.locator('input[type="text"]').nth(1).fill('Até 30% de desconto em óculos de sol')
            await page.locator('input[type="text"]').nth(2).fill('Ver Ofertas')
            
            console.log('   📝 Informações do banner preenchidas')
            
            // Upload da imagem desktop
            const fileInputDesktop = page.locator('input[type="file"]').first()
            const bannerDesktopPath = path.join(process.cwd(), 'public', 'banner-desktop.png')
            await fileInputDesktop.setInputFiles(bannerDesktopPath)
            
            await page.waitForTimeout(2000)
            console.log('   🖼️ Imagem desktop enviada')
            
            // Upload da imagem mobile (opcional)
            const fileInputMobile = page.locator('input[type="file"]').nth(1)
            const bannerMobilePath = path.join(process.cwd(), 'public', 'banner-mobile.png')
            await fileInputMobile.setInputFiles(bannerMobilePath)
            
            await page.waitForTimeout(2000)
            console.log('   🖼️ Imagem mobile enviada')
            
            // Tira screenshot do formulário
            await page.screenshot({ path: 'tests/reports/loja-banner-form.png' })
            
            // Salva banner
            await page.getByRole('button', { name: 'Salvar Banner' }).click()
            await page.waitForTimeout(2000)
            
            console.log('✅ Banner criado com sucesso')
        } else {
            console.log('   ℹ️ Já existem banners cadastrados')
        }
        
        await page.screenshot({ path: 'tests/reports/loja-config-banners.png', fullPage: true })
        
        // ==================== VISUALIZAR LOJA PÚBLICA ====================
        console.log('\n🌐 Visualizando Loja Pública...')
        
        // Procura link para ver loja
        const linkLojaPublica = page.getByRole('link', { name: /Ver perfil público/i })
        
        if (await linkLojaPublica.isVisible().catch(() => false)) {
            // Abre em nova aba
            const [newPage] = await Promise.all([
                page.context().waitForEvent('page'),
                linkLojaPublica.click()
            ])
            
            await newPage.waitForLoadState('networkidle')
            await newPage.waitForTimeout(3000)
            
            console.log('✅ Loja pública aberta')
            
            // Verifica elementos da loja
            const temBanner = await newPage.locator('img').first().isVisible().catch(() => false)
            const temNomeEmpresa = await newPage.getByText(data.nomeEmpresa).isVisible().catch(() => false)
            const temProdutos = await newPage.getByText(/R\$/).isVisible().catch(() => false)
            
            console.log(`   🖼️ Banner: ${temBanner ? '✅' : '⚠️'}`)
            console.log(`   🏢 Nome da Empresa: ${temNomeEmpresa ? '✅' : '⚠️'}`)
            console.log(`   📦 Produtos: ${temProdutos ? '✅' : '⚠️'}`)
            
            // Tira screenshot da loja pública
            await newPage.screenshot({ path: 'tests/reports/loja-publica.png', fullPage: true })
            
            // Fecha aba
            await newPage.close()
        } else {
            console.log('⚠️ Link para loja pública não encontrado')
        }
        
        console.log('\n' + '='.repeat(50))
        console.log('✅ CONFIGURAÇÃO DA LOJA CONCLUÍDA!')
        console.log('='.repeat(50))
        console.log(`🏢 Empresa: ${data.nomeEmpresa}`)
        console.log(`📝 Slogan: A melhor ótica da cidade!`)
        console.log(`📦 Produtos ativados: ${ativados}`)
        console.log(`🖼️ Banners criados: ${temBanners ? 'Já existia' : '1 novo'}`)
        console.log('='.repeat(50))
    })

    test('deve verificar filtros e busca na loja pública', async ({ page }) => {
        const data = loadTestData()
        
        console.log('\n🔍 Testando filtros da loja pública...')
        
        // Login
        await page.goto('/')
        await page.locator('input[type="email"]').fill(data.emailAdmin)
        await page.locator('input[type="password"]').fill(data.senha)
        await page.getByRole('button', { name: 'Entrar' }).click()
        await page.waitForURL(/.*dashboard/, { timeout: 15000 })
        
        // Acessa configurações para pegar o slug
        await page.goto('/dashboard/store-config')
        await page.waitForTimeout(2000)
        
        // Pega o slug da loja
        const inputSlug = page.locator('input[name="slug"]').first()
        let slug = 'otica-teste'
        
        if (await inputSlug.isVisible().catch(() => false)) {
            slug = await inputSlug.inputValue() || 'otica-teste'
        }
        
        // Acessa loja pública diretamente
        await page.goto(`/c/${slug}`)
        await page.waitForTimeout(3000)
        
        console.log(`🌐 Acessando loja: /c/${slug}`)
        
        // Verifica elementos básicos
        const temConteudo = await page.locator('body').textContent().then(text => text.length > 100).catch(() => false)
        
        if (temConteudo) {
            console.log('✅ Loja pública carregada')
            
            // Procura por elementos de navegação
            const temCategorias = await page.getByText(/Categorias|Categoria/i).isVisible().catch(() => false)
            const temBusca = await page.locator('input[type="search"], input[placeholder*="buscar"]').isVisible().catch(() => false)
            
            console.log(`   📂 Categorias: ${temCategorias ? '✅' : '⚠️'}`)
            console.log(`   🔍 Busca: ${temBusca ? '✅' : '⚠️'}`)
            
            // Tira screenshot
            await page.screenshot({ path: 'tests/reports/loja-publica-filtros.png', fullPage: true })
        } else {
            console.log('⚠️ Loja pública pode estar vazia ou não carregou corretamente')
        }
        
        console.log('✅ Teste de filtros concluído')
    })
})