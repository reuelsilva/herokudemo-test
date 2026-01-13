import { test, expect } from '@playwright/test';
import { InputPage } from '../page-objects/inputPage';

test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/dynamic_controls');
})

test('Deve remover o checkbox ao clicar no botao Remove', async ({ page }) => {
    await page.locator('#checkbox-example').getByRole("button").click();
    await page.waitForSelector('#message');
    // Validação: o texto “It’s gone!” esteja visível em tela.
    await expect(page.locator('#message', { hasText: "It's gone!" })).toBeVisible();
    // Validação: o checkbox não está mais presente na DOM.
    await expect(page.locator('#checkbox').getByRole('checkbox')).not.toBeAttached();
})

test('Deve habilitar o campo de texto ao clicar no botao Enable', async ({ page }) => {
    const onInputField = new InputPage(page);
    await onInputField.enableInputField();
})

test('Deve desabilitar o campo de texto (com um texto inserido) ao clicar no botao Disable', async ({ page }) => {
    // Digitar um texto de teste no campo habilitado.
    // 1 step: habilitar o campo texto
    const onInputField = new InputPage(page);
    await onInputField.enableInputField();
    await onInputField.fillInputField('teste de exemplo');
    //
    await page.locator('#input-example').getByRole('button').click();
    await page.waitForSelector('#message');
    // Validacao: o texto “It’s disabled!” seja exibido em tela.
    await expect(page.locator('#message', { hasText: "It's disabled!" })).toBeVisible();
    // Validacao: o campo de texto está desabilitado (não é possível digitar nele).
    await expect(page.locator('#input-example').getByRole('textbox')).toBeDisabled();
})