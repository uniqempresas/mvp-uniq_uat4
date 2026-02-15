import { test, expect } from '@playwright/test'
import { generateCPF, generateCNPJ, generateEmail, generatePhone } from '../helpers/generators'

test.describe('Fluxo de Onboarding (Nova Empresa)', () => {

    test('deve criar uma nova empresa com sucesso', async ({ page }) => {
        // Dados de teste
        const userData = {
            fullName: 'Test Automation User',
            email: generateEmail(),
            cpf: generateCPF(),
            password: 'Password123!',
            companyName: `Loja Teste Automação ${Date.now()}`,
            cnpj: generateCNPJ(),
            phone: generatePhone()
        }

        const addressData = {
            cep: '01001-000', // Sé, SP
            logradouro: 'Praça da Sé',
            bairro: 'Sé',
            cidade: 'São Paulo',
            uf: 'SP',
            ibge: '3550308',
            numero: '123',
            complemento: 'Sala 404'
        }

        // Interceptar API de CEP para garantir estabilidade (Mock)
        await page.route(`https://viacep.com.br/ws/${addressData.cep.replace('-', '')}/json/`, async route => {
            const json = {
                cep: addressData.cep,
                logradouro: addressData.logradouro,
                complemento: "",
                bairro: addressData.bairro,
                localidade: addressData.cidade,
                uf: addressData.uf,
                ibge: addressData.ibge,
                gia: "1004",
                ddd: "11",
                siafi: "7107"
            }
            await route.fulfill({ json })
        })

        // --- STEP 1: DADOS PESSOAIS ---
        await page.goto('/onboarding')

        // Verificar se está no passo 1
        await expect(page.getByText('Criar sua Conta')).toBeVisible()

        // Preencher formulário
        await page.fill('input[name="fullName"]', userData.fullName)
        await page.fill('input[name="email"]', userData.email)
        await page.fill('input[name="cpf"]', userData.cpf)
        await page.fill('input[name="password"]', userData.password)
        await page.fill('input[name="confirmPassword"]', userData.password)

        // Avançar
        await page.click('text=Próximo Passo')

        // --- STEP 2: DADOS DA EMPRESA ---

        // Verificar se mudou para passo 2
        await expect(page.getByText('Dados da Empresa')).toBeVisible()

        // Preencher formulário
        await page.fill('input[name="companyName"]', userData.companyName)
        await page.fill('input[name="cnpj"]', userData.cnpj)
        await page.fill('input[name="phone"]', userData.phone)

        // Selecionar selects
        await page.selectOption('select', { label: 'Varejo' }) // Primeiro select (Ramo)
        // O segundo select é de funcionários, vamos pegar pelo valor ou ordem se não tiver name/id fácil
        // Como o ID não está definido no código, vamos usar o localizador por label próximo ou ordem
        // Analisando o código: Ramo é o primeiro select, Funcionários é o segundo.
        await page.locator('select').nth(1).selectOption('1-5')

        // Endereço
        await page.fill('input[name="cep"]', addressData.cep)

        // Aguardar preenchimento automático (mockado)
        // Disparar blur para garantir que o evento de busca ocorra
        await page.locator('input[name="cep"]').blur()

        // Verificar se endereço foi preenchido com timeout maior
        await expect(page.locator('input[value="Praça da Sé"]')).toBeVisible({ timeout: 10000 })

        // Completar endereço
        await page.fill('input[placeholder="Nº"]', addressData.numero)
        await page.fill('input[placeholder="Apto, Bloco, etc."]', addressData.complemento)

        // Avançar
        await page.click('text=Próximo Passo')

        // --- STEP 3: CONFIGURAÇÃO ---

        // Verificar se mudou para passo 3
        await expect(page.getByRole('heading', { name: 'Configuração' })).toBeVisible()

        // Aceitar termos
        await page.getByLabel('Concordo com os Termos de Serviço e Política de Privacidade da UNIQ.').check()

        // Finalizar
        // Como a request pro Supabase pode demorar, aumentamos o timeout do click/expect se necessário
        await page.click('button:has-text("Concluir Configuração")')

        // --- VALIDAÇÃO FINAL ---

        // Deve redirecionar para o dashboard
        await expect(page).toHaveURL(/\/dashboard$/, { timeout: 30000 })

        // Verificar mensagem de boas-vindas ou elemento do dashboard
        // Ex: "Início" no sidebar ou "Visão Geral"
        // Vamos verificar se a URL é dashboard, o que já indica sucesso no cadastro.
    })

})
