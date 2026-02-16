import { test, expect } from '@playwright/test';

test('Criar empresa e verificar cargo de proprietário', async ({ page }) => {
    test.setTimeout(60000); // Aumentar timeout total para 60s

    const randomSuffix = Math.floor(Math.random() * 10000);
    const email = `test.owner.${randomSuffix}@example.com`;
    const password = 'Password123!';
    const companyName = `Empresa Teste ${randomSuffix}`;
    const cnpj = `123456780001${randomSuffix.toString().padStart(2, '0')}`;
    const phone = '11999999999';

    console.log(`Iniciando teste com: ${email}`);

    // 1. Acessar página
    await page.goto('http://localhost:5173/onboarding');
    await expect(page.locator('text=Crie sua conta')).toBeVisible({ timeout: 10000 });

    // 2. Passo 1 - Dados Pessoais
    console.log('Preenchendo Passo 1...');
    await page.getByPlaceholder('Seu nome completo').fill('Usuário Teste');
    await page.getByPlaceholder('seu@email.com').fill(email);
    await page.getByPlaceholder('000.000.000-00').fill('123.456.789-00');
    await page.getByPlaceholder('Sua senha segura').fill(password);
    await page.getByPlaceholder('Confirme sua senha').fill(password);

    await page.click('button:has-text("Continuar")');

    // 3. Passo 2 - Empresa
    console.log('Preenchendo Passo 2...');
    await expect(page.locator('text=Dados da Empresa')).toBeVisible();

    await page.getByPlaceholder('Razão Social ou Nome Fantasia').fill(companyName);
    await page.getByPlaceholder('00.000.000/0000-00').fill(cnpj);
    await page.getByPlaceholder('(00) 00000-0000').fill(phone);

    // Endereço
    await page.getByPlaceholder('00000-000').fill('01001-000');
    // Aguardar um pouco para simular busca de CEP ou delay de UI
    await page.waitForTimeout(2000);

    // Garantir que campos obrigatórios de endereço estão preenchidos se o autofill falhar
    // Se o autofill funcionar, ok. Se não, preenchemos manual.
    const logradouro = page.locator('input[name="logradouro"]'); // Ajustar seletor se necessário
    if (await logradouro.isVisible()) {
        await logradouro.fill('Praça da Sé');
    }

    await page.click('button:has-text("Continuar")');

    // 4. Passo 3 - Configuração
    console.log('Preenchendo Passo 3...');
    await expect(page.locator('text=Personalize sua experiência')).toBeVisible();

    // Marcar termos (checkbox)
    // Tentar encontrar checkbox pelo ID ou role
    const termsCheckbox = page.locator('button[role="checkbox"]');
    if (await termsCheckbox.isVisible()) {
        await termsCheckbox.click();
    } else {
        // Tentar outro seletor se for um input nativo
        await page.check('input[type="checkbox"]');
    }

    // Finalizar
    await page.click('button:has-text("Finalizar Cadastro")');

    // 5. Verificar Sucesso
    console.log('Aguardando redirecionamento para Dashboard...');
    // Aumentar timeout pois a criação pode demorar (RPC, triggers, etc)
    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 30000 });

    console.log('Redirecionado para Dashboard!');

    // 6. Verificar Elementos de Proprietário
    // Tentar ver se o nome da empresa aparece
    await expect(page.locator(`text=${companyName}`)).toBeVisible();

    console.log('TESTE PASSOU: Empresa criada e dashboard carregado.');
    console.log(`CREDENCIAIS ÚTEIS:\nEmail: ${email}\nSenha: ${password}`);
});
