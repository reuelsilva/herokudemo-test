import { expect, Page } from "@playwright/test";

export class InputPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page
    }

    async enableInputField() {
        await this.page.locator('#input-example').getByRole('button').click();
        await this.page.waitForSelector('#message');
        // Validação: o texto “It's enabled!” esteja visível em tela.
        await expect(this.page.locator('#message', { hasText: "It's enabled!" })).toBeVisible();
        // Validação: o campo de texto está habilitado (não está desabilitado) e se é possível digitar nele.
        await expect(this.page.locator('#input-example').getByRole('textbox')).toBeEnabled();
    }

    async fillInputField(text: string){
        const inputField = this.page.locator('#input-example').getByRole('textbox');
        const inputState = await inputField.isEnabled();
        if(inputState){
            await inputField.fill(`${text}`);
        }
    }
}