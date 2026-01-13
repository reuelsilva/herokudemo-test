import { test, expect } from '@playwright/test';

test.beforeEach(async({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dynamic_controls');
})

test.describe('Automacao da pagina Dynamic Controls do site Heroku', () => {
  test('Deve remover o Checkbox', async ({ page }) => {
    await page.getByRole('button', { name: 'Remove' }).click();
    // Esperar explicitamente até que o texto “It’s gone!” apareça
    await page.waitForSelector('#message');
    const messageGone = await page.textContent('#message');
    expect(messageGone?.trim()).toBe("It's gone!");
    // Verificar se o checkbox não está mais presente
    await page.waitForFunction(() => !document.querySelector('#checkbox'));
    await expect(page.locator('#checkbox')).toHaveCount(0);
  })

  test('Deve habilitar o campo de texto', async ({ page }) => {
    const inputField = page.locator('#input-example input');
    const toggleButton = page.locator('#input-example button');

    // Clicar em “Enable”
    await toggleButton.click();
    // Esperar até que “It’s enabled!” apareça
    await page.waitForSelector('#message');
    const messageEnabled = await page.textContent('#message');
    expect(messageEnabled?.trim()).toBe("It's enabled!");
    // Validar que o campo está habilitado
    await page.waitForFunction(() => {
      const input = document.querySelector('#input-example input') as HTMLInputElement | null;
      return input !== null && !input.disabled;
    });
    await expect(inputField).toBeEnabled();

    // Validar que é possível digitar no campo
    await inputField.fill('Teste Playwright');
    await expect(inputField).toHaveValue('Teste Playwright');
  })

  test('Deve desabilitar o campo de texto', async ({ page }) => {
    const inputField = page.locator('#input-example input');
    const toggleButton = page.locator('#input-example button');

    // Clicar em “Enable”
    await toggleButton.click();

    await page.waitForSelector('#message');
    const messageEnabled = await page.textContent('#message');
    expect(messageEnabled?.trim()).toBe("It's enabled!");

    // Digitar um texto de teste
    await inputField.fill('Teste de Desabilitação');
    await expect(inputField).toHaveValue('Teste de Desabilitação');

    await toggleButton.click();

    // 6️⃣ Esperar explicitamente até que o texto “It’s disabled!” apareça
    await page.waitForSelector('#message');
    const messageDisabled = await page.textContent('#message');
    expect(messageDisabled?.trim()).toBe("It's disabled!");

    // 7️⃣ Verificar se o campo de texto está desabilitado
    await page.waitForFunction(() => {
      const input = document.querySelector('#input-example input') as HTMLInputElement | null;
      return input !== null && input.disabled;
    });
    await expect(inputField).toBeDisabled();
  })

  test("Deve remover o checkbox, adicionar e remover novamente e o texto checkbox nao estar na tela", async({page})=>{
    //Dá o click inicial no botao de Remover o checkbox
    await page.locator('#checkbox-example button').click();

    // Espera o elemento com id message com o texto Its gone
    await page.waitForSelector('#message');
    await expect(page.locator('#checkbox-example #message')).toHaveText("It's gone!");
    // Dá o click no botao de Adicionar o checkbox
    await page.locator('#checkbox-example button', {hasText: 'Add'}).click();
    // Espera o elemento com id message com o texto Its back
    await page.waitForSelector('#message');
    await expect(page.locator('#checkbox-example #message')).toHaveText("It's back!");
    //Repete a acao de click para Remover o checkbox
    await page.locator('#checkbox-example button').click();
    // Confere uma assertion se nenhum texto 'A checkbox'ficou na tela
    await expect(page.locator('#checkbox-example div')).not.toHaveText(' A checkbox')
  })
})