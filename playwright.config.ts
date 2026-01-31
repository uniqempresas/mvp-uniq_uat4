import { defineConfig, devices } from '@playwright/test'

/**
 * Configuração do Playwright para testes E2E
 * Documentação: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    // Pasta onde os testes estão
    testDir: './tests/e2e',

    // Timeout máximo para cada teste
    timeout: 30 * 1000,

    // Tenta executar novamente testes que falharam (útil para testes instáveis)
    retries: process.env.CI ? 2 : 0,

    // Quantos testes podem rodar ao mesmo tempo
    workers: process.env.CI ? 1 : undefined,

    // Configurações globais de expect
    expect: {
        timeout: 5000,
    },

    // Reporter: como mostrar os resultados
    reporter: [
        ['html'], // Gera relatório HTML em playwright-report/
        ['list'], // Mostra no console linha por linha
    ],

    // Configurações compartilhadas entre todos os projetos
    use: {
        // URL base do app
        baseURL: 'http://localhost:5173',

        // Timeout para cada ação (click, fill, etc)
        actionTimeout: 10 * 1000,

        // Captura de tela ao falhar
        screenshot: 'only-on-failure',

        // Vídeo apenas quando falha
        video: 'retain-on-failure',

        // Trace (histórico de ações) apenas ao falhar
        trace: 'on-first-retry',
    },

    // Projetos = navegadores para testar
    projects: [
        {
            name: 'chrome',
            use: {
                ...devices['Desktop Chrome'],
                // Usa o Chrome já instalado no seu Windows
                channel: 'chrome',
                // Mostra o navegador ao rodar testes
                headless: false,
            },
        },

        // Descomente para testar em outros navegadores:
        // {
        //   name: 'firefox',
        //   use: { ...devices['Desktop Firefox'] },
        // },
        // {
        //   name: 'webkit',
        //   use: { ...devices['Desktop Safari'] },
        // },
    ],

    // Servidor de desenvolvimento (opcional - inicia automaticamente se não estiver rodando)
    // webServer: {
    //   command: 'npm run dev',
    //   url: 'http://localhost:5173',
    //   reuseExistingServer: !process.env.CI,
    // },
})
